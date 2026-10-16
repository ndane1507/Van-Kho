import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch();
const page=await browser.newPage();
const results=[];
const base=process.env.QA_BASE_URL||'http://localhost:3000';
fs.mkdirSync('qa',{recursive:true});
try {
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/lop-12','/gioi-thieu','/thu-vien','/tac-pham/trang-giang']){
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>[...document.images].filter(image=>{const box=image.getBoundingClientRect();return box.top<innerHeight&&box.bottom>0;}).every(image=>image.complete&&image.naturalWidth>0));
   const sizes=await page.evaluate(()=>{
    const size=selector=>{const element=document.querySelector(selector);return element?parseFloat(getComputedStyle(element).fontSize):null;};
    return {heading:size('h1'),description:size('.vk-row-desc'),article:size('.article-body'),lead:size('.lead-paragraph'),intro:size('.page-heading>p:not(.eyebrow)')};
   });
   assert.ok(sizes.heading>=40);
   if(sizes.description)assert.ok(sizes.description>=16);
   if(sizes.article)assert.ok(sizes.article>=18);
   if(sizes.lead)assert.ok(sizes.lead>=19);
   if(sizes.intro)assert.ok(sizes.intro>=17);
   await page.screenshot({path:`qa/redesign-${route.slice(1).replaceAll('/','-')}-${width}.png`});
   results.push({route,width,sizes});
  }
 }
 await page.setViewportSize({width:390,height:1000});
 await page.goto(base+'/lop-12');
 await page.locator('.mobile-reading-guide summary').click();
 assert.equal(await page.locator('.mobile-reading-guide').getAttribute('open'),'');
 await page.locator('.mobile-reading-guide summary').click();
 await page.locator('.vk-jumps a[href="#hoc-ky-2"]').click();
 await page.waitForFunction(()=>Math.abs(document.querySelector('#hoc-ky-2').getBoundingClientRect().top-105)<8);
 assert.equal(await page.locator('#hoc-ky-2 .vk-row').count(),9);
 await page.screenshot({path:'qa/redesign-semester-390.png'});
 await page.goto(base+'/thu-vien');
 assert.equal(await page.locator('.vk-filters').getAttribute('open'),null);
 await page.locator('.vk-filters summary').click();
 assert.ok(await page.locator('select[name="grade"]').isVisible());
 assert.ok(await page.locator('select[name="author"]').isVisible());
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:'qa/redesign-filters-390.png'});
 await page.goto(base+'/gioi-thieu');
 for(const section of ['BẠN SẼ TÌM THẤY GÌ?','CÁCH SỬ DỤNG','ĐỒNG HÀNH VỚI VIỆC HỌC VĂN'])assert.ok((await page.locator('main').innerText()).includes(section));
 await page.screenshot({path:'qa/redesign-about-full-390.png',fullPage:true});
 fs.writeFileSync('qa/redesign-report.json',JSON.stringify({layouts:results,mobileGuide:true,semesterJump:true,mobileFilters:true,aboutContent:true},null,2));
 console.log(JSON.stringify({fontChecks:results.length,mobileGuide:true,semesterJump:true,mobileFilters:true,aboutContent:true},null,2));
}finally{await browser.close();}
