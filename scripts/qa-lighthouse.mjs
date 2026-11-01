import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import {launch} from 'chrome-launcher';
import {chromium} from '@playwright/test';

// Sequential measurements avoid competition between Lighthouse runs.
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3010';
const output = path.resolve('qa/lighthouse-release');
fs.mkdirSync(output, {recursive: true});
const mobileRuns = Number(process.env.QA_LH_MOBILE_RUNS || 1);
assert.ok(Number.isInteger(mobileRuns) && mobileRuns >= 1 && mobileRuns <= 5);
const report = {mobileRuns, testedAt: new Date().toISOString(), node: process.version, base, runs: []};
const chrome = await launch({chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--disable-gpu']});
try {
  for (const [name, route] of [['home', '/'], ['library', '/thu-vien'], ['article', '/tac-pham/trang-giang']]) {
    for (const device of ['mobile', 'desktop']) {
      for (let iteration = 1; iteration <= (device === 'mobile' ? mobileRuns : 1); iteration++) {
      const suffix = iteration === 1 ? '' : `-${iteration}`;
      const flags = {port: chrome.port, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']};
      const result = await lighthouse(new URL(route, base).href, flags, device === 'desktop' ? desktopConfig : undefined);
      assert.ok(result, `${name}/${device}: empty Lighthouse result`);
      const {lhr} = result;
      assert.equal(lhr.configSettings.formFactor, device, 'Measured device must match the report label');
      fs.writeFileSync(path.join(output, `${name}-${device}${suffix}.json`), result.report[0]);
      fs.writeFileSync(path.join(output, `${name}-${device}${suffix}.html`), result.report[1]);
      const summary = {
        name, route, device, iteration, lighthouseVersion: lhr.lighthouseVersion, userAgent: lhr.userAgent,
        scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, category]) => [key, category.score === null ? null : Math.round(category.score * 100)])),
        lcpMs: lhr.audits['largest-contentful-paint'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        tbtMs: lhr.audits['total-blocking-time'].numericValue,
        warnings: lhr.runWarnings, runtimeError: lhr.runtimeError ?? null,
        settings: lhr.configSettings,
        findings: Object.values(lhr.audits).filter(audit => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative').map(audit => ({id: audit.id, title: audit.title, score: audit.score, displayValue: audit.displayValue})),
      };
      report.runs.push(summary);
      fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(report, null, 2));
      console.log(JSON.stringify({name, device, scores: summary.scores, lcpMs: summary.lcpMs, cls: summary.cls, tbtMs: summary.tbtMs, runtimeError: summary.runtimeError}));
      assert.equal(summary.runtimeError, null, `${name}/${device}: Lighthouse runtime error`);
      }
    }
  }
} finally {
  fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(report, null, 2));
  await chrome.kill();
}
