import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium, webkit} from '@playwright/test';
import {workData} from '../src/content/works.ts';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3014';
const widths = [320, 360, 390, 430, 768, 1440];
const report = {pages: 0, layouts: 0, numbers: 0, failures: []};
const selectors = '.article-section-title>span, .toc nav a>span, .vk-row-index, .path-grade, .author-section-label>span, .reading-steps li>span, .about-stats strong, .directory-stats strong, .grade-summary strong';
const routes = workData.filter(work => work.status === 'published').map(work => `/tac-pham/${work.slug}`);
routes.push('/', '/thu-vien', '/lop-10', '/lop-11', '/lop-12', '/tac-gia', '/tac-gia/vu-trong-phung', '/tac-gia/huy-can', '/gioi-thieu');
fs.mkdirSync('qa', {recursive: true});

try {
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch();
    try {
      const context = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
      const page = await context.newPage();
      for (const route of routes) {
        const response = await page.goto(base + route);
        assert.equal(response.status(), 200, route);
        await page.evaluate(() => document.fonts.ready);
        // Lay out offscreen sections so every numbered heading can be measured.
        await page.addStyleTag({content: '.reading-chunk{content-visibility:visible;contain-intrinsic-block-size:none}'});
        for (const width of widths) {
          await page.setViewportSize({width, height: 844});
          await page.evaluate(() => {const toc = document.querySelector('.toc-mobile'); if (toc) toc.open = true;});
          const result = await page.locator(selectors).evaluateAll(elements => {
            const failures = [];
            let numbers = 0;
            for (const element of elements) {
              const box = element.getBoundingClientRect();
              const text = element.textContent.trim();
              if (!box.width || !box.height || !/^\d+$/.test(text)) continue;
              numbers++;
              const glyphs = [...text].map((_, index) => {
                const range = document.createRange();
                range.setStart(element.firstChild, index);
                range.setEnd(element.firstChild, index + 1);
                const rect = range.getBoundingClientRect();
                return {top: rect.top, left: rect.left, right: rect.right};
              });
              const css = getComputedStyle(element);
              const problem = glyphs.some(glyph => Math.abs(glyph.top - glyphs[0].top) > 1) ? 'digits wrap'
                : glyphs.some(glyph => glyph.left < box.left - 1 || glyph.right > box.right + 1) ? 'digits clipped'
                : css.color === 'rgba(0, 0, 0, 0)' && Number.parseFloat(css.webkitTextStrokeWidth) === 0 ? 'invisible digits' : '';
              if (problem) failures.push({text, problem, section: element.closest('section')?.id, className: element.className});
            }
            return {numbers, failures, overflow: document.documentElement.scrollWidth > innerWidth + 1};
          });
          report.numbers += result.numbers;
          report.layouts++;
          report.failures.push(...result.failures.map(failure => ({engine: name, route, width, ...failure})));
          if (result.overflow) report.failures.push({engine: name, route, width, problem: 'page overflows'});
          if (route === '/tac-pham/xuan-toc-do-cuu-quoc' && width === 390) {
            await page.evaluate(() => {const toc = document.querySelector('.toc-mobile'); if (toc) toc.open = false;});
            const heading = page.locator('#hinh-tuong .article-section-title');
            await heading.evaluate(element => element.scrollIntoView({block: 'center'}));
            await heading.screenshot({path: `qa/number-08-${name}.png`});
          }
          if (route === '/gioi-thieu' && width === 390) {
            await page.locator('.reading-steps').screenshot({path: `qa/reading-steps-${name}.png`});
          }
        }
        report.pages++;
      }
    } finally { await browser.close(); }
  }
} finally {
  fs.writeFileSync('qa/mobile-numbers.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({...report, failures: report.failures.slice(0, 12), failureCount: report.failures.length}, null, 2));
}
assert.equal(report.failures.length, 0, 'Numbering layout failures; inspect qa/mobile-numbers.json');
