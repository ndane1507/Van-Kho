import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3010';
const browser = await chromium.launch();
const report = {testedAt: new Date().toISOString(), images: [], film: null};
try {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 2, reducedMotion: 'reduce'});
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push(new URL(request.url())));
  for (const route of ['/', '/tac-pham/trang-giang']) {
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator(route === '/' ? '.opening-art img' : '.work-art-mobile figure img');
    await expect(hero).toBeHidden();
    if (route === '/') {
      assert.equal(requests.filter(url => url.href.includes('van-kho-reading-room')).length, 0, 'Decorative mobile hero must not consume image bandwidth');
      report.images.push({route, decorativeHeroDeferred: true});
      continue;
    }
    await page.getByText('Xem minh họa tác phẩm', {exact: true}).click();
    await expect(hero).toBeVisible();
    await page.waitForFunction(selector => document.querySelector(selector).complete, '.work-art-mobile figure img');
    assert.match(await hero.evaluate(image => image.currentSrc), /\/images\/mobile\//);
    assert.ok(await hero.evaluate(image => image.naturalWidth > 0));
    report.images.push({route, mobileSource: await hero.evaluate(image => image.currentSrc)});
  }
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(requests.filter(url => url.pathname === '/images/van-kho-film-poster-v3.jpg').length, 0, 'Raw video poster must not compete with the optimized cover');
  assert.equal(requests.filter(url => url.pathname.endsWith('.mp4')).length, 0, 'Video must wait for a user request');
  const fontRequests = new Set(requests.filter(url => url.pathname.endsWith('.woff2')).map(url => url.pathname));
  // The real Newsreader italic face adds one resource to the four-face flow.
  assert.ok(fontRequests.size > 0 && fontRequests.size <= 5, `Unexpected font request count: ${fontRequests.size}`);
  report.fontRequests = fontRequests.size;
  assert.equal(await page.locator('link[rel="preload"][as="font"]').count(), 0, 'Font weights load on CSS demand');
  const faces = await page.evaluate(() => {
    const family = getComputedStyle(document.body).fontFamily.split(',')[0].trim().replace(/["']/g, '');
    return [...document.fonts].filter(face => face.family.replace(/["']/g, '') === family).map(face => face.weight);
  });
  assert.ok(['400', '500', '600'].every(weight => faces.includes(weight)), `Real font weights missing: ${faces}`);
  report.sansWeights = faces;
  await page.getByRole('button', {name: 'Phát phim giới thiệu Văn Khố, 30 giây', exact: true}).click();
  await page.waitForFunction(() => document.querySelector('video').currentTime > .2);
  report.film = await page.locator('video').evaluate(video => {
    video.pause();
    return {width: video.videoWidth, height: video.videoHeight, duration: video.duration};
  });
  assert.ok(report.film.width > 0 && report.film.duration >= 29);
  await page.setViewportSize({width: 1440, height: 950});
  await page.goto(base);
  assert.ok(!(await page.locator('.opening-art img').evaluate(image => image.currentSrc)).includes('/images/mobile/'), 'Desktop keeps the original artwork');
  report.slowFonts = [];
  const broken = await browser.newContext({viewport: {width: 1440, height: 950}});
  await broken.route('**/_next/image?**', route => route.abort());
  const brokenPage = await broken.newPage();
  await brokenPage.goto(base + '/tac-pham/trang-giang');
  await expect(brokenPage.locator('.work-art-desktop .artwork picture')).toHaveCount(0);
  await expect(brokenPage.locator('.work-art-desktop .artwork svg')).toBeVisible();
  report.imageErrorFallback = true;
  await broken.close();
  for (const route of ['/', '/tac-pham/trang-giang']) {
    const slow = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    await slow.route('**/*.woff2', async route => { await new Promise(resolve => setTimeout(resolve, 2000)); await route.continue(); });
    const delayed = await slow.newPage();
    const cdp = await slow.newCDPSession(delayed);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    await delayed.goto(base + route, {waitUntil: 'domcontentloaded'});
    await delayed.waitForTimeout(250);
    const {root} = await cdp.send('DOM.getDocument');
    const {nodeId} = await cdp.send('DOM.querySelector', {nodeId: root.nodeId, selector: route === '/' ? '.opening-description' : '.hero-description'});
    const before = (await cdp.send('CSS.getPlatformFontsForNode', {nodeId})).fonts;
    assert.ok(before.some(font => !font.isCustomFont && font.glyphCount > 0), 'Delayed fonts must leave readable system text');
    await delayed.evaluate(() => document.fonts.ready);
    const after = (await cdp.send('CSS.getPlatformFontsForNode', {nodeId})).fonts;
    assert.deepEqual(after.map(font => font.familyName), before.map(font => font.familyName), 'Optional fonts must not replace text late');
    assert.ok(await delayed.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    report.slowFonts.push({route, readableFallback: true, noLateSwap: true, families: before.map(font => font.familyName)});
    await slow.close();
  }
  await page.goto(base + '/tac-pham/trang-giang');
  await page.emulateMedia({media: 'print'});
  assert.equal(await page.locator('.reading-chunk').count(), 8);
  assert.ok(await page.locator('.reading-chunk').evaluateAll(elements => elements.every(element => getComputedStyle(element).contentVisibility === 'visible')));
  report.printContentNotDeferred = true;
  console.log(JSON.stringify(report, null, 2));
} finally {
  fs.mkdirSync('qa', {recursive: true});
  fs.writeFileSync('qa/performance-regression-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
