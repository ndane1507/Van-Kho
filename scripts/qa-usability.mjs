import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3010';
const browser = await chromium.launch();
const report = {testedAt: new Date().toISOString(), home: [], ai: [], interactions: []};
fs.mkdirSync('qa', {recursive: true});
try {
  const context = await browser.newContext({reducedMotion: 'reduce'});
  const page = await context.newPage();
  for (const width of [360, 390, 768, 1440]) for (const theme of ['light', 'dark']) {
    await page.setViewportSize({width, height: 900});
    await page.goto(base);
    await page.evaluate(t => localStorage.setItem('van-kho-theme', t), theme);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.ok(await page.locator('#home-q').evaluate(e => e.getBoundingClientRect().bottom < innerHeight));
    await expect(page.locator('#home-q')).toHaveCSS('font-size', '16px');
    await expect(page.getByRole('navigation', {name: 'Bắt đầu theo lớp'}).getByRole('link')).toHaveCount(3);
    const audit = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.equal(audit.violations.length, 0, JSON.stringify(audit.violations.map(v => v.id)));
    await page.screenshot({path: `qa/home-next-${width}-${theme}.png`});
    report.home.push({width, theme, searchInFirstViewport: true, axeViolations: 0});
  }
  await page.locator('#home-q').fill('trang giang');
  await page.locator('.discovery-search button').click();
  await expect(page).toHaveURL(/tim-kiem\?q=trang\+giang/);
  await expect(page.locator('.vk-row')).toHaveCount(1);
  await page.goto(base + '/tac-gia');
  await page.getByLabel('Tìm theo tên, tác phẩm hoặc thời kỳ').fill('huy can');
  await expect(page.locator('.directory-author-card')).toHaveCount(1);
  await expect(page.locator('.directory-list-heading [role="status"]')).toContainText('1 / 50');
  report.interactions.push('Home search and author live results');
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(base);
  await page.getByRole('button', {name: 'Mở điều hướng'}).click();
  await page.locator('.mobile-panel a').first().focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', {name: 'Mở điều hướng'})).toBeFocused();
  report.interactions.push('Escape restores focus to mobile menu trigger');
  const themeTarget = await page.getByRole('switch').boundingBox();
  assert.ok(themeTarget.height >= 44 && themeTarget.width >= 44);
  await page.locator('.opening-actions .button').click();
  await expect(page).toHaveURL(/\/thu-vien$/);
  await page.getByRole('button', {name: 'Mở điều hướng'}).click();
  await page.goBack();
  await expect(page.locator('.mobile-panel')).toHaveCount(0);
  await page.getByRole('button', {name: 'Mở điều hướng'}).click();
  await page.setViewportSize({width: 1440, height: 950});
  await expect(page.locator('.mobile-panel')).toHaveCount(0);
  await page.setViewportSize({width: 390, height: 844});
  await expect(page.getByRole('button', {name: 'Mở điều hướng'})).toHaveAttribute('aria-expanded', 'false');
  report.interactions.push('Theme touch target, history and responsive menu state');
  await page.goto(base + '/tac-pham/hon-truong-ba-da-hang-thit');
  await expect(page.locator('.excerpt-label')).toContainText('Phạm vi trích đoạn cần đối chiếu');
  assert.equal(await page.locator('.toc-desktop a[href="#nguon-bai-doc"]').count(), 1);
  report.interactions.push('Unverified excerpt notice and sources TOC');

  for (const width of [390, 1440]) for (const theme of ['light', 'dark']) {
    const requests = [];
    await page.route('**/api/tro-ly-van-hoc', route => {
      requests.push(route.request().postDataJSON());
      return route.fulfill(requests.length === 1
        ? {status: 503, contentType: 'application/json', body: JSON.stringify({error: 'Dịch vụ tạm thời bận. Vui lòng thử lại.'})}
        : {status: 200, contentType: 'text/plain; charset=utf-8', body: 'Hãy bắt đầu bằng cách xác định luận điểm.'});
    });
    await page.setViewportSize({width, height: 950});
    await page.goto(base);
    await page.evaluate(t => localStorage.setItem('van-kho-theme', t), theme);
    await page.goto(base + '/tro-ly-van-hoc');
    const input = page.getByRole('textbox', {name: 'Nhập câu hỏi gửi Trợ lý Văn học'});
    await input.fill('Gợi ý cách tìm luận điểm');
    await page.getByRole('button', {name: 'Gửi', exact: true}).click();
    await expect(page.getByText('Dịch vụ tạm thời bận. Vui lòng thử lại.', {exact: true})).toBeVisible();
    await expect(input).toHaveValue('Gợi ý cách tìm luận điểm');
    assert.ok(await input.evaluate(element => element.scrollHeight <= element.clientHeight + 2), 'Restored draft must fit without clipped lines');
    const audit = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.equal(audit.violations.length, 0, JSON.stringify(audit.violations.map(v => ({id: v.id, nodes: v.nodes.map(n => n.target)}))));
    await page.screenshot({path: `qa/ai-error-${width}-${theme}.png`});
    await page.getByRole('button', {name: 'Gửi', exact: true}).click();
    await expect(page.getByText('Hãy bắt đầu bằng cách xác định luận điểm.', {exact: true})).toBeVisible();
    assert.deepEqual(requests[1].history, [], 'Failed turn must not be repeated in AI history');
    report.ai.push({width, theme, draftRestored: true, retryWorks: true, axeViolations: 0, liveApiCalled: false});
    await page.unroute('**/api/tro-ly-van-hoc');
  }
  const imageRequests = [];
  await page.route('**/api/tro-ly-van-hoc', route => {
    imageRequests.push(route.request().postDataJSON());
    return route.fulfill(imageRequests.length === 1
      ? {status: 503, contentType: 'application/json', body: JSON.stringify({error: 'Ảnh chưa gửi được. Hãy thử lại.'})}
      : {status: 200, contentType: 'text/plain', body: 'Hãy đọc yêu cầu trong ảnh trước.'});
  });
  await page.goto(base + '/tro-ly-van-hoc');
  await page.locator('input[type="file"]').setInputFiles({name: 'de-bai.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64')});
  await expect(page.getByAltText('Xem trước ảnh đề bài')).toBeVisible();
  await page.getByRole('button', {name: 'Gửi', exact: true}).click();
  await expect(page.getByText('Ảnh chưa gửi được. Hãy thử lại.', {exact: true})).toBeVisible();
  await expect(page.getByAltText('Xem trước ảnh đề bài')).toBeVisible();
  await expect(page.locator('.ai-image-attachment-bar')).toContainText('de-bai.png');
  await page.getByRole('button', {name: 'Gửi', exact: true}).click();
  await expect(page.getByText('Hãy đọc yêu cầu trong ảnh trước.', {exact: true})).toBeVisible();
  assert.equal(imageRequests[1].imageBase64, imageRequests[0].imageBase64);
  assert.deepEqual(imageRequests[1].history, []);
  report.interactions.push('Image-only failed request restores image and filename, retry sends the same image once');
  console.log(JSON.stringify(report, null, 2));
} finally {
  fs.writeFileSync('qa/usability-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
