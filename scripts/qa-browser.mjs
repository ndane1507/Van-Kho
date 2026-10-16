import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const base=process.env.QA_BASE_URL||'http://localhost:3000';
const output=path.resolve('qa');fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const results={testedAt:new Date().toISOString(),viewports:[],routes:[],accessibility:[],interactions:[],consoleErrors:[],brokenLinks:[]};
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();page.on('pageerror',e=>results.consoleErrors.push(e.message));
 const routes=['/','/thu-vien','/lop-10','/lop-11','/lop-12','/tac-gia','/gioi-thieu','/tim-kiem','/the-loai/tho','/the-loai/truyen-ngan','/the-loai/chinh-luan','/the-loai/kich','/tac-gia/huy-can','/tac-gia/nguyen-tuan','/tac-gia/nguyen-trai','/tac-gia/luu-quang-vu','/tac-pham/trang-giang','/tac-pham/chu-nguoi-tu-tu','/tac-pham/binh-ngo-dai-cao','/tac-pham/hon-truong-ba-da-hang-thit'];
 routes.push(...JSON.parse(fs.readFileSync('src/content/expansion-manifest.json','utf8')).map(w=>'/tac-pham/'+w.slug));
 const internal=new Set();
 for(const route of routes){const response=await page.goto(base+route);assert.equal(response.status(),200,route);assert.equal(await page.locator('h1').count(),1,route);await page.locator('footer').getByText('Liên hệ: Nguyễn Đức Anh & Nguyễn Văn Đạt',{exact:true}).waitFor();for(const email of ['ngducanh15072009@gmail.com','datnguyen02092009@gmail.com'])assert.equal(await page.locator(`footer a[href="mailto:${email}"]`).count(),1);const hrefs=await page.locator('a[href]').evaluateAll(els=>els.map(a=>a.getAttribute('href')));for(const href of hrefs){if(href.startsWith('/')&&!href.startsWith('//'))internal.add(href);if(href.startsWith('#')&&href.length>1)assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(),1,`missing anchor ${href} on ${route}`);}const ids=await page.locator('[id]').evaluateAll(els=>els.map(e=>e.id));assert.equal(ids.length,new Set(ids).size,`duplicate ID on ${route}`);results.routes.push({route,status:response.status(),footer:true});}
 for(const href of internal){const response=await context.request.get(base+href,{timeout:10000});if(response.status()>=400)results.brokenLinks.push({href,status:response.status()});}
 for(const route of ['/robots.txt','/sitemap.xml','/data/inventory.json','/data/audit-report.json'])assert.equal((await context.request.get(base+route)).status(),200,route);assert.equal((await context.request.get(base+'/nguon-tham-khao')).status(),404,'nguon-tham-khao is not public');
 for(const width of [360,390,768,1024,1280,1440])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:1000});await page.goto(base);await page.evaluate((t)=>localStorage.setItem('van-kho-theme',t),theme);await page.reload();
  for(const route of ['/','/thu-vien','/tac-pham/trang-giang','/tac-pham/hon-truong-ba-da-hang-thit','/lop-10','/lop-11','/lop-12','/gioi-thieu']){
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);if(await page.locator('.artwork').count()){await page.waitForFunction(()=>{const img=document.querySelector('.artwork img');return img?.complete&&img.naturalWidth>0;});assert.equal(await page.locator('.image-fallback').count(),0);}const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(overflow.scroll<=overflow.width+1,`${route} ${width} ${theme} overflows by ${overflow.scroll-overflow.width}`);assert.ok((await page.locator('html').getAttribute('class')).split(' ').includes(theme));results.viewports.push({route,width,theme,overflow:false});
   if(route==='/'||route==='/tac-pham/trang-giang')await page.screenshot({path:path.join(output,`${route==='/'?'home':'article'}-${width}-${theme}.png`),fullPage:route==='/' });
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const theme of ['light','dark']){
  await page.goto(base);await page.evaluate(()=>localStorage.setItem('van-kho-theme','system'));
  for(const route of ['/','/thu-vien','/tac-pham/trang-giang','/tac-pham/hon-truong-ba-da-hang-thit','/lop-12','/gioi-thieu']){await page.goto(base+route);const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();results.accessibility.push({route,theme,violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 }
 await page.goto(base+'/tim-kiem');await page.getByLabel('Tìm tác phẩm, tác giả hoặc chủ đề',{exact:true}).fill('trang giang');await page.getByRole('button',{name:'Tìm kiếm',exact:true}).click();await page.waitForURL('**/tim-kiem?**');assert.equal(await page.locator('.vk-row').count(),1);assert.match(await page.locator('.vk-row').innerText(),/Tràng giang/);results.interactions.push('Search without Vietnamese accents');
 await page.goto(base+'/thu-vien');await page.locator('.vk-filters summary').click();await page.locator('select[name="grade"]').selectOption('10');await page.getByRole('button',{name:'Lọc kết quả'}).click();await page.waitForURL('**/thu-vien?**');assert.equal(await page.locator('.vk-row').count(),21);assert.ok(new URL(page.url()).searchParams.get('grade')==='10');await page.reload();assert.equal(await page.locator('.vk-row').count(),21);results.interactions.push('Shareable grade filter survives reload');
 await page.locator('select[name="genre"]').selectOption('kich');await page.getByRole('button',{name:'Lọc kết quả'}).click();await page.getByRole('heading',{name:'Chưa tìm thấy tác phẩm'}).waitFor();await page.getByRole('link',{name:'Xóa bộ lọc'}).click();await page.waitForURL('**/thu-vien');assert.equal(await page.locator('.vk-row').count(),60);results.interactions.push('Combined filters, empty state and clear');
 await page.goto(base+'/thu-vien?sort=az');const titles=await page.locator('.vk-row-title').allTextContents();assert.deepEqual(titles,[...titles].sort((a,b)=>a.localeCompare(b,'vi')));results.interactions.push('Vietnamese alphabetical sorting');
 await page.goto(base+'/tac-pham/trang-giang');await page.locator('.toc-desktop a[href="#phan-tich"]').click();await page.waitForFunction(()=>document.querySelector('.toc-desktop a[href="#phan-tich"]').getAttribute('aria-current')==='location');results.interactions.push('TOC deep links and scroll spy');
 await page.getByLabel('Giao diện',{exact:true}).selectOption('system');await page.emulateMedia({colorScheme:'dark'});await page.waitForFunction(()=>document.documentElement.classList.contains('dark'));await page.emulateMedia({colorScheme:'light'});await page.waitForFunction(()=>document.documentElement.classList.contains('light'));results.interactions.push('System theme follows OS and manual preference persists');
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.getByLabel('Mở điều hướng').click();await page.locator('.mobile-panel').getByRole('link',{name:'Lớp 12',exact:true}).click();await page.waitForURL('**/lop-12');await page.waitForFunction(()=>!document.querySelector('.mobile-panel'));results.interactions.push('Mobile navigation closes after route change');
 await page.goto(base+'/tac-pham/trang-giang');await page.locator('.toc-mobile summary').click();await page.locator('.toc-mobile a[href="#60-giay"]').click();assert.ok(page.url().endsWith('#60-giay'));assert.equal(await page.locator('.toc-mobile').getAttribute('open'),null);results.interactions.push('Mobile table of contents');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');results.interactions.push('Reduced motion');
 await page.goto(base+'/gioi-thieu');const about=await page.locator('main').innerText();assert.ok(!/Yên Lãng|Phạm vi cụ thể|Giới hạn|bài mẫu/.test(about));results.interactions.push('Introduction describes website and benefits');
 await page.goto(base+'/tac-pham/chu-nguoi-tu-tu');assert.ok(!/Tiết|Phạm vi thư viện|Yên Lãng/.test(await page.locator('.article-body').innerText()));results.interactions.push('No period or school restriction metadata');
 const notFound=await page.goto(base+'/tac-pham/chua-xuat-ban');assert.equal(notFound.status(),404);await page.locator('footer').getByText('Liên hệ: Nguyễn Đức Anh & Nguyễn Văn Đạt',{exact:true}).waitFor();results.interactions.push('Unpublished work returns 404 with footer');
 assert.equal(results.brokenLinks.length,0);assert.equal(results.consoleErrors.length,0);fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify(results,null,2));
 const violations=results.accessibility.flatMap(a=>a.violations);console.log(JSON.stringify({routes:results.routes.length,viewportChecks:results.viewports.length,interactionChecks:results.interactions.length,accessibilityViolations:violations.length,brokenLinks:results.brokenLinks,consoleErrors:results.consoleErrors},null,2));assert.equal(violations.length,0,'Accessibility violations; inspect qa/browser-report.json');
}finally{fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify(results,null,2));await browser.close();}



