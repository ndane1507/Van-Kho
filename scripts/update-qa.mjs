import fs from 'node:fs';
let p='scripts/qa-browser.mjs',s=fs.readFileSync(p,'utf8');
s=s.replace(" const internal=new Set();"," routes.push(...JSON.parse(fs.readFileSync('src/content/expansion-manifest.json','utf8')).map(w=>'/tac-pham/'+w.slug));\n const internal=new Set();");
s=s.replaceAll("locator('.work-row').count(),2","locator('.work-row').count(),21").replaceAll("locator('.work-row').count(),4","locator('.work-row').count(),60");
s=s.replace("selectOption('tho');await page.getByRole('button',{name:'Áp dụng'}).click();await page.getByRole('heading'","selectOption('kich');await page.getByRole('button',{name:'Áp dụng'}).click();await page.getByRole('heading'");
s=s.replace(" const notFound=",` await page.goto(base+'/gioi-thieu');const about=await page.locator('main').innerText();assert.ok(!/Yên Lãng|Phạm vi cụ thể|Giới hạn|bài mẫu/.test(about));results.interactions.push('Introduction describes website and benefits');
 await page.goto(base+'/tac-pham/chu-nguoi-tu-tu');assert.ok(!/Tiết|Phạm vi thư viện|Yên Lãng/.test(await page.locator('.work-info').innerText()));results.interactions.push('No period or school restriction metadata');
 const notFound=`);
fs.writeFileSync(p,s);
// Check every selected curriculum entry is represented, and every available AI asset is distinct.
fs.appendFileSync('tests/content.test.mjs',`\ntest('Complete literary inventory and distinct available AI illustrations',()=>{
 const selected=entries.filter(e=>e.includeDecision==='include');assert.equal(selected.length,60);
 for(const e of selected)assert.ok(workData.some(w=>w.curriculumId===e.id||norm(w.title)===norm(e.workTitle)),e.workTitle);
 assert.equal(mediaData.length,60);assert.equal(new Set(mediaData.map(m=>m.path)).size,60);
 assert.equal(mediaData.filter(m=>m.generatedByAI).length,58);assert.equal(mediaData.filter(m=>!m.generatedByAI).length,2);
 const pending=JSON.parse(fs.readFileSync(new URL('../src/content/expanded/pending-illustrations.json',import.meta.url),'utf8'));assert.equal(pending.length,0);
 for(const w of workData)assert.ok(w.mediaId&&mediaData.some(m=>m.id===w.mediaId),w.slug);
});\n`);
console.log('Updated browser checks and content coverage tests');

