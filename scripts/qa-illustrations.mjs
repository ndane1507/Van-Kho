import {chromium} from '@playwright/test';
import fs from 'node:fs';
import {mediaData} from '../src/content/media.ts';
import {workData} from '../src/content/works.ts';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('http://localhost:3000/');
const checked=[];for(const w of workData){await page.goto('http://localhost:3000/tac-pham/'+w.slug);const img=page.locator('.work-hero img');if(w.mediaId){assert.equal(await img.count(),1,w.title);await img.evaluate(i=>i.decode());assert.equal(await img.evaluate(i=>i.naturalWidth>0),true);checked.push({title:w.title,asset:w.mediaId});}else assert.equal(await img.count(),0,w.title);}
fs.writeFileSync('qa/illustration-checks.json',JSON.stringify(checked,null,2));
await page.setContent(`<html lang="vi"><body style="margin:0;background:#f9f6ef"><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:8px">${mediaData.map(m=>`<figure style="margin:0"><img src="http://localhost:3000${m.path}" alt="${m.alt}" style="display:block;width:100%;aspect-ratio:3/2;object-fit:cover"><figcaption style="font:12px sans-serif;padding:3px">${m.title}</figcaption></figure>`).join('')}</div></body></html>`);
await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await page.screenshot({path:'qa/illustrations-contact-sheet.png',fullPage:true});
for(const width of [390,1440]){await page.setViewportSize({width,height:1000});for(const route of ['/gioi-thieu','/tac-pham/hec-to-tu-biet-ang-dro-mac','/tac-pham/van-te-nghia-si-can-giuoc']){await page.goto('http://localhost:3000'+route);await page.evaluate(()=>document.fonts.ready);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:`qa/expanded-${route.split('/').at(-1)}-${width}.png`,fullPage:route==='/gioi-thieu'});}}
console.log({articles:workData.length,loadedUniqueIllustrations:checked.length,pending:workData.length-checked.length});
}finally{await browser.close();}
