import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {workData} from '../src/content/works.ts';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3010';
const browser = await chromium.launch();
const report = {testedAt: new Date().toISOString(), metadata: [], sitemap: [], invalidApi: []};
try {
  const context = await browser.newContext({reducedMotion: 'reduce'});
  const page = await context.newPage();
  for (const route of ['/', '/thu-vien', '/lop-10', '/tac-pham/trang-giang', '/tac-gia/huy-can', '/tro-ly-van-hoc', '/tim-kiem?q=trang+giang']) {
    await page.goto(base + route);
    assert.equal(await page.locator('h1').count(), 1);
    const canonical = new URL(await page.locator('link[rel="canonical"]').getAttribute('href'));
    assert.equal(canonical.pathname, new URL(route, base).pathname);
    assert.equal(canonical.search, '');
    assert.ok(!['localhost', '127.0.0.1'].includes(canonical.hostname));
    const json = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const item of json) JSON.parse(item);
    if (route.startsWith('/tim-kiem')) assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
    const image = new URL(await page.locator('meta[property="og:image"]').getAttribute('content'));
    assert.equal((await context.request.get(base + image.pathname)).status(), 200);
    report.metadata.push({route, canonical: canonical.href, structuredDataScripts: json.length, shareImage: true});
  }
  await page.goto(base + '/tac-gia/huy-can');
  await expect(page.getByRole('heading', {name: 'Nguồn hồ sơ'})).toBeVisible();
  assert.ok(await page.locator('.author-sources a').count() > 0);
  await page.goto(base + '/tac-gia/dan-gian');
  assert.deepEqual((await page.locator('.author-facts dd').allTextContents()).slice(0, 2), ['Không áp dụng', 'Không áp dụng']);
  const collective = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  assert.equal(collective['@type'], 'Thing');
  assert.equal(collective.jobTitle, undefined);
  const collectiveWork = workData.find(work => work.authorIds.includes('dan-gian'));
  await page.goto(base + '/tac-pham/' + collectiveWork.slug);
  await expect(page.locator('.work-author-facts')).toContainText('Sinh Không áp dụng');
  const article = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text => JSON.parse(text)).find(item => item['@type'] === 'Article');
  assert.equal(article.about.author['@type'], 'Thing');

  const sitemap = await (await context.request.get(base + '/sitemap.xml')).text();
  assert.ok(!sitemap.includes('/nguon-tham-khao') && !sitemap.includes('/tim-kiem'));
  const locations = [];
  for (const [, item] of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const location = item.match(/<loc>(.*?)<\/loc>/)[1];
    assert.ok(!locations.includes(location), location);
    locations.push(location);
    const pathname = new URL(location).pathname;
    const response = await context.request.get(base + pathname);
    assert.equal(response.status(), 200, pathname);
    if (pathname.startsWith('/tac-pham/')) {
      const work = workData.find(work => '/tac-pham/' + work.slug === pathname);
      assert.ok(work, pathname);
      assert.match(item, new RegExp(`<lastmod>${work.updatedAt}`));
    }
    report.sitemap.push({pathname, status: response.status()});
  }
  assert.ok(locations.length > 100);
  assert.equal((await context.request.get(base + '/nguon-tham-khao')).status(), 404);
  assert.equal((await context.request.get(base + '/api/tro-ly-van-hoc')).status(), 405);
  // All payloads are rejected before configuration/provider access. No paid call.
  for (const data of ['{', 'null', '[]', '{}', '{"message":42}', '{"message":"   "}', '{"message":"ok","history":"bad"}']) {
    const response = await context.request.post(base + '/api/tro-ly-van-hoc', {data, headers: {'Content-Type': 'application/json'}});
    assert.equal(response.status(), 400, data);
    assert.ok((await response.json()).error);
    report.invalidApi.push({status: response.status()});
  }
  console.log(JSON.stringify({metadataChecks: report.metadata.length, sitemapRoutes: report.sitemap.length, invalidApiChecks: report.invalidApi.length}));
} finally {
  fs.mkdirSync('qa', {recursive: true});
  fs.writeFileSync('qa/seo-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
