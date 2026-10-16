import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { z } from 'zod';
import { workData } from '../src/content/works.ts';
import { authorData } from '../src/content/authors.ts';
import { sourceData } from '../src/content/sources.ts';
import { mediaData } from '../src/content/media.ts';
import { excerptData } from '../src/content/excerpts.ts';
import { workSchema,authorSchema,sourceSchema,curriculumSchema,mediaSchema,excerptSchema } from '../src/lib/validation.ts';
const read=name=>JSON.parse(fs.readFileSync(new URL(`../src/content/curriculum/${name}.json`,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const raw=read('ppct-raw'),entries=read('inventory'),rows=read('row-dispositions'),report=read('audit-report');
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
test('Every reading row has exactly one disposition, with no omitted rows',()=>{
 const expected=raw.filter(r=>r.cells.some(c=>/^\s*Đọc\s+VB/i.test(c))).map(r=>r.index);
 assert.equal(expected.length,91);assert.deepEqual(rows.map(r=>r.sourceRow),expected);assert.equal(new Set(rows.map(r=>r.sourceRow)).size,expected.length);assert.deepEqual(report.missingRows,[]);
 for(const row of rows){const matching=entries.filter(e=>e.sourceRows.includes(row.sourceRow));assert.ok(matching.length>0);assert.ok(matching.every(e=>e.includeDecision===row.includeDecision));}
});
test('All six grade/semester groups reconcile, with repeated periods preserved',()=>{
 assert.equal(entries.length,78);assert.deepEqual(report.groups.map(g=>g.distinctItems),[15,13,13,12,12,13]);
 for(const g of report.groups)assert.equal(g.include+g.exclude_nonliterary+g.author_profile_only+g.needs_review,g.distinctItems);
 assert.equal(new Set(entries.map(e=>`${e.grade}/${e.semester}/${norm(e.workTitle)}`)).size,entries.length);
 const trao=entries.find(e=>e.workTitle==='Trao duyên');assert.deepEqual(trao.periodReferences,['57','58']);
 const poems=entries.filter(e=>e.sourceRows.includes(303));assert.deepEqual(poems.map(e=>e.workTitle),['Mộ','Nguyên tiêu']);assert.equal(poems.length,2);
 assert.equal(entries.find(e=>e.workTitle==='Một thời đại trong thi ca').genre,'Phê bình văn học');
});
test('Informational, skills and author-only items cannot become published works',()=>{
 for(const e of entries){assert.ok(!/^Viết|^Nói và nghe|^Thực hành|^Kiểm tra|^Chuyên/.test(e.workTitle));if(e.includeDecision!=='include')assert.notEqual(e.publicationStatus,'published');}
 for(const w of workData.filter(w=>w.status==='published')){const e=entries.find(e=>w.curriculumId?e.id===w.curriculumId:norm(e.workTitle)===norm(w.title));assert.ok(e);assert.equal(e.includeDecision,'include');assert.equal(e.publicationStatus,'published');}
 assert.equal(entries.filter(e=>e.includeDecision==='author_profile_only').length,3);
 assert.equal(entries.find(e=>e.workTitle.startsWith('Hải khẩu')).includeDecision,'include');
});
test('Schemas, references, excerpts and source coverage are valid',()=>{
 for(const [schema,data] of [[workSchema,workData],[authorSchema,authorData],[sourceSchema,sourceData],[curriculumSchema,entries],[mediaSchema,mediaData],[excerptSchema,excerptData]])z.array(schema).parse(data);
 for(const w of workData){assert.equal(w.sections.length,8);assert.ok(w.sections.find(s=>s.id==='phan-tich').units.length>=3);assert.ok(w.authorIds.every(id=>authorData.some(a=>a.id===id)));for(const s of w.sections){assert.ok(s.paragraphs.every(p=>p.length>0));assert.ok(s.sourceIds.every(id=>sourceData.some(r=>r.id===id)));for(const u of s.units??[])assert.ok(sourceData.some(r=>r.id===u.sourceId));}assert.ok(w.sourceIds.every(id=>sourceData.some(r=>r.id===id)));assert.equal(new Set(w.sections.map(s=>s.id)).size,w.sections.length);assert.equal(w.humanReviewedAt,null);}
 for(const e of excerptData)assert.ok(workData.some(w=>w.id===e.workId));
 for(const m of mediaData)assert.ok(fs.existsSync(new URL(`../public${m.path}`,import.meta.url)));
 for(const a of authorData.filter(a=>a.portraitPath))assert.ok(fs.existsSync(new URL(`../public${a.portraitPath}`,import.meta.url)),`Thieu file chan dung: ${a.id}`);
 assert.equal(workData.filter(w=>w.status==='published').length,60);
});

test('Complete literary inventory and distinct illustrations',()=>{
 const selected=entries.filter(e=>e.includeDecision==='include');assert.equal(selected.length,60);
 for(const e of selected)assert.ok(workData.some(w=>w.curriculumId===e.id||norm(w.title)===norm(e.workTitle)),e.workTitle);
 assert.equal(mediaData.length,60);assert.equal(new Set(mediaData.map(m=>m.path)).size,60);
 assert.equal(mediaData.filter(m=>m.generatedByAI).length,58);assert.equal(mediaData.filter(m=>!m.generatedByAI).length,2);
 const pending=JSON.parse(fs.readFileSync(new URL('../src/content/expanded/pending-illustrations.json',import.meta.url),'utf8'));assert.equal(pending.length,0);
 for(const w of workData)assert.ok(w.mediaId&&mediaData.some(m=>m.id===w.mediaId),w.slug);
});
