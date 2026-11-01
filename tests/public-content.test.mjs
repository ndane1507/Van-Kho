import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {workData} from '../src/content/works.ts';
import {authorData} from '../src/content/authors.ts';

test('Published reading text has complete analysis and no internal curriculum notes', () => {
  for (const work of workData) {
    const analysis = work.sections.find(section => section.id === 'phan-tich');
    assert.ok(analysis?.units?.length >= 3, work.slug);
    const prose = [work.title, work.description, work.origin, work.intro, ...work.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.units ?? []).flatMap(unit => [unit.title, unit.evidence, unit.explanation])])];
    for (const text of prose) {
      assert.ok(!/\bPPCT\b|Yên Lãng|�/.test(text), `${work.slug}: ${text}`);
      assert.equal(text.normalize('NFC'), text, work.slug);
    }
    for (const unit of analysis.units) assert.ok(unit.evidence.trim() && unit.explanation.trim(), work.slug);
  }
  for (const author of authorData) for (const text of [author.bio, author.style]) assert.ok(!/\bPPCT\b|�/.test(text), author.slug);
});

test('Internal audit exports are not distributed as public website assets', () => {
  for (const name of ['inventory.json', 'audit-report.json']) assert.equal(fs.existsSync(new URL('../public/data/' + name, import.meta.url)), false);
});
