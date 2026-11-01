import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch();
const context = await browser.newContext({reducedMotion: 'reduce'});
const page = await context.newPage();
const report = {testedAt: new Date().toISOString(), checks: []};
fs.mkdirSync('qa', {recursive: true});
try {
  for (const width of [390, 1440]) {
    await page.setViewportSize({width, height: 950});
    await page.goto(base + '/tac-pham/trang-giang#phan-tich');
    await expect(page.locator('.toc-desktop a[href="#phan-tich"]')).toHaveAttribute('aria-current', 'location');
    for (const id of ['nghe-thuat', 'tong-quan']) {
      await page.evaluate(id => document.getElementById(id).scrollIntoView(), id);
      await expect(page.locator(`.toc-desktop a[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
    }
    if (width === 390) await page.locator('.toc-mobile summary').click();
    await page.locator(`${width === 390 ? '.toc-mobile' : '.toc-desktop'} a[href="#60-giay"]`).click();
    await expect(page).toHaveURL(/#60-giay$/);
    await expect(page.locator('.toc-desktop a[href="#60-giay"]')).toHaveAttribute('aria-current', 'location');
    const top = await page.locator('[id="60-giay"]').evaluate(e => e.getBoundingClientRect().top);
    assert.ok(top >= 100 && top < 250, `Anchor offset: ${top}`);
    assert.equal(await page.locator('.toc-mobile').getAttribute('open'), null);
    await page.reload();
    await expect(page.locator('.toc-desktop a[href="#60-giay"]')).toHaveAttribute('aria-current', 'location');
    report.checks.push({width, tocHashReloadAndReverseScroll: true, top});
    for (const theme of ['light', 'dark']) {
      await page.evaluate(t => localStorage.setItem('van-kho-theme', t), theme);
      await page.reload();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.article-body')).toHaveCSS('font-size', width === 390 ? '17px' : '19px');
      await page.locator('#nguon-bai-doc').scrollIntoViewIfNeeded();
      await expect(page.locator('.reading-sources')).toContainText('chưa được giáo viên rà soát');
      assert.ok(await page.locator('.reading-sources a').count() > 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({path: `qa/sources-${width}-${theme}.png`});
      await page.locator('#phan-tich').evaluate(e => e.scrollIntoView());
      await expect(page.locator('.toc-desktop a[href="#phan-tich"]')).toHaveAttribute('aria-current', 'location');
      await page.screenshot({path: `qa/reading-${width}-${theme}.png`});
      report.checks.push({width, theme, fontSourcesAndOverflow: true});
    }
  }
  await page.goto(base + '/thu-vien?q=trang+giang');
  await page.locator('#q').fill('vo nhat');
  await page.getByRole('button', {name: 'Tìm kiếm', exact: true}).click();
  await expect(page).toHaveURL(/q=vo\+nhat/);
  await expect(page.locator('.vk-row')).toHaveCount(1);
  await page.goBack();
  await expect(page.locator('#q')).toHaveValue('trang giang');
  await expect(page.locator('.vk-row')).toHaveCount(1);
  await page.goForward();
  await expect(page.locator('#q')).toHaveValue('vo nhat');
  await page.reload();
  await expect(page.locator('#q')).toHaveValue('vo nhat');
  await page.getByRole('link', {name: 'Xóa bộ lọc', exact: true}).click();
  await expect(page.locator('#q')).toHaveValue('');
  await expect(page.locator('.vk-row')).toHaveCount(60);
  report.checks.push({searchBackForwardReloadReset: true});
  await page.goto(base);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Đến nội dung chính'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  report.checks.push({keyboardSkipLink: true});
  // Stub only the browser request: no credentials or paid upstream call.
  await page.route('**/api/tro-ly-van-hoc', route => route.fulfill({
    status: 503, contentType: 'application/json', body: JSON.stringify({error: 'Dịch vụ tạm thời bận. Vui lòng thử lại.'}),
  }));
  await page.goto(base + '/tro-ly-van-hoc');
  await expect(page.getByRole('button', {name: 'Gửi', exact: true})).toBeDisabled();
  await page.getByRole('textbox', {name: 'Nhập câu hỏi gửi Trợ lý Văn học'}).fill('Gợi ý cách tìm luận điểm');
  await page.getByRole('button', {name: 'Gửi', exact: true}).click();
  await expect(page.getByText('Dịch vụ tạm thời bận. Vui lòng thử lại.', {exact: true})).toBeVisible();
  await expect(page.getByRole('textbox', {name: 'Nhập câu hỏi gửi Trợ lý Văn học'})).toBeEnabled();
  report.checks.push({aiMockedErrorAndRecovery: true, liveApiCalled: false});
  const noJsContext = await browser.newContext({javaScriptEnabled: false, viewport: {width: 1440, height: 950}, reducedMotion: 'reduce'});
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(base + '/tac-pham/trang-giang#phan-tich');
  await expect(noJsPage.locator('#phan-tich')).toBeVisible();
  assert.equal(await noJsPage.locator('#phan-tich').evaluate(element => element.closest('[hidden]') !== null), false);
  const nativeTop = await noJsPage.locator('#phan-tich').evaluate(element => element.getBoundingClientRect().top);
  assert.ok(nativeTop >= 100 && nativeTop < 250, `Server-rendered native anchor: ${nativeTop}`);
  await noJsContext.close();
  report.checks.push({serverRenderedNativeDeepLinkWithoutJavaScript: true, top: nativeTop});
  console.log(JSON.stringify(report, null, 2));
} finally {
  fs.writeFileSync('qa/reading-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
