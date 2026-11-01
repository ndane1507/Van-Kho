import fs from 'node:fs';
import assert from 'node:assert/strict';

const report = JSON.parse(fs.readFileSync('qa/lighthouse-release/summary.json', 'utf8'));
const budget = {lcpThresholdMs: 2500, clsThreshold: .1, pages: []};
for (const name of ['home', 'library', 'article']) {
  const runs = report.runs.filter(run => run.name === name && run.device === 'mobile');
  assert.equal(runs.length, 3, `Measure all three mobile runs for ${name}`);
  const values = runs.map(run => run.lcpMs).sort((a, b) => a - b);
  const medianLcpMs = values[1];
  const worstCls = Math.max(...runs.map(run => run.cls));
  const passed = medianLcpMs <= budget.lcpThresholdMs && worstCls <= budget.clsThreshold && runs.every(run => run.runtimeError === null);
  budget.pages.push({name, lcpValuesMs: values, medianLcpMs, worstCls, passed});
}
fs.writeFileSync('qa/lighthouse-release/budget.json', JSON.stringify(budget, null, 2));
console.log(JSON.stringify(budget, null, 2));
assert.ok(budget.pages.every(page => page.passed), 'Mobile performance budget failed; inspect budget.json and full Lighthouse reports');
