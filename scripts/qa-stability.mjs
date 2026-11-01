import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3010';
const browser = await chromium.launch();
const report = {testedAt: new Date().toISOString(), layouts: [], deepLinks: []};
fs.mkdirSync('qa', {recursive: true});
try {
  for (const width of [390, 1440]) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({viewport: {width, height: 950}, reducedMotion: 'reduce'});
    const page = await context.newPage();
    await page.addInitScript(theme => {
      localStorage.setItem('van-kho-theme', theme);
      window.layoutShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.layoutShifts.push(entry.value);
      }).observe({type: 'layout-shift', buffered: true});
    }, theme);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 90000});
    await cdp.send('Emulation.setCPUThrottlingRate', {rate: 4});
    await page.goto(base + '/thu-vien');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.vk-row')).toHaveCount(60);
    // Observe the end of streaming/hydration, including delayed font swaps.
    await page.waitForTimeout(1000);
    const shifts = await page.evaluate(() => window.layoutShifts);
    const clsUpperBound = shifts.reduce((sum, shift) => sum + shift, 0);
    report.layouts.push({width, theme, shifts, clsUpperBound});
    assert.ok(clsUpperBound <= .1, `Library shifted: ${clsUpperBound} at ${width}/${theme}`);
    await context.close();
  }
  for (let attempt = 0; attempt < 20; attempt++) {
    const width = attempt % 2 ? 1440 : 390;
    const context = await browser.newContext({viewport: {width, height: 950}, reducedMotion: 'reduce'});
    const page = await context.newPage();
    if (attempt % 3 === 0) await page.route('**/*.js', async route => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      await route.continue();
    });
    await page.goto(base + '/tac-pham/trang-giang#phan-tich');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.toc-desktop a[href="#phan-tich"]')).toHaveAttribute('aria-current', 'location');
    const top = await page.locator('#phan-tich').evaluate(element => element.getBoundingClientRect().top);
    assert.ok(top >= 100 && top < 250, `Deep link hidden or displaced: ${top}`);
    report.deepLinks.push({attempt, width, delayedJs: attempt % 3 === 0, top});
    await page.mouse.wheel(0, -100000);
    await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.evaluate(() => scrollY), 0, 'Initial anchor recovery must not pull the reader back after manual scrolling');
    await context.close();
  }
  console.log(JSON.stringify(report, null, 2));
} finally {
  fs.writeFileSync('qa/stability-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
