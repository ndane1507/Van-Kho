import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium, expect} from '@playwright/test';
import {workData} from '../src/content/works.ts';
import {authorData} from '../src/content/authors.ts';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3010';
const report={fonts:[],works:[],authors:0};const browser=await chromium.launch();
try{
const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();
const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
for(const width of [390,1440])for(const theme of ['light','dark'])for(const [route,selector,name] of [['/','.reading-selection h2','home'],['/gioi-thieu','.about-purpose h2','about']]){
 await page.setViewportSize({width,height:1000});await page.goto(base+route);await page.evaluate(theme=>localStorage.setItem('van-kho-theme',theme),theme);await page.reload();await page.locator(selector).scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);
 await page.reload();await page.locator(selector).scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);
 const {root}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:name==='home'?selector+' em':selector});const fonts=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;
 assert.ok(fonts.length>0&&fonts.every(font=>font.isCustomFont&&font.familyName.includes('Newsreader')),JSON.stringify(fonts));
 if(name==='home')assert.ok(fonts.every(font=>/italic/i.test(font.postScriptName)),JSON.stringify(fonts));
 await page.locator(selector).screenshot({path:`qa/heading-fixed-${name}-${width}-${theme}.png`});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));report.fonts.push({route,width,theme,fonts});
}
await page.setViewportSize({width:390,height:844});
for(const work of workData){
 await page.goto(base+'/tac-pham/'+work.slug);await expect(page.locator('.analysis-entry')).toBeVisible();await page.locator('.analysis-entry').click();await expect(page).toHaveURL(/#phan-tich$/);
 const units=work.sections.find(section=>section.id==='phan-tich').units;
 await expect(page.locator('#phan-tich .analysis-unit')).toHaveCount(units.length);
 for(let i=0;i<units.length;i++){
  const unit=page.locator('#phan-tich .analysis-unit').nth(i);await unit.scrollIntoViewIfNeeded();await expect(unit).toBeVisible();assert.ok((await unit.innerText()).includes(units[i].evidence));assert.ok((await unit.innerText()).includes(units[i].explanation));await expect(unit.locator('.evidence')).toContainText('Dẫn chứng và chi tiết.');await expect(unit.locator('.analysis-explanation')).toContainText('Phân tích.');
 }
 assert.ok(!/\bPPCT\b/i.test(await page.locator('body').innerText()),work.slug);report.works.push({slug:work.slug,units:units.length});
}
for(const author of authorData){await page.goto(base+'/tac-gia/'+author.slug);assert.ok(!/\bPPCT\b/i.test(await page.locator('body').innerText()),author.slug);report.authors++;}
for(const route of ['/data/inventory.json','/data/audit-report.json'])assert.equal((await context.request.get(base+route)).status(),404);
console.log(JSON.stringify({fontViews:report.fonts.length,works:report.works.length,analysisUnits:report.works.reduce((sum,work)=>sum+work.units,0),authors:report.authors}));
}finally{fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/public-website-report.json',JSON.stringify(report,null,2));await browser.close();}
