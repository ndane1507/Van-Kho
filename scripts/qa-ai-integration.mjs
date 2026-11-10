import fs from 'node:fs';
import http from 'node:http';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {chromium, webkit, expect} from '@playwright/test';
const report={checks:[],providerCalls:0};const payloads=[];
const provider=http.createServer(async(req,res)=>{
 let body='';for await(const chunk of req)body+=chunk;
 assert.equal(req.headers.authorization,'Bearer offline-integration-key');
 payloads.push(JSON.parse(body));
 if(payloads.at(-1).messages.at(-1).content==='Bài phân tích dài để kiểm tra cuộn'){
  res.writeHead(200,{'Content-Type':'text/event-stream'});
  for(let index=0;index<36;index++){
   res.write('data: '+JSON.stringify({choices:[{delta:{content:`Luận điểm ${index+1}: đọc sát chi tiết để giải thích ý nghĩa của tác phẩm.\n\n`}}]})+'\n\n');
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  res.end('data: [DONE]\n\n');return;
 }
 res.writeHead(200,{'Content-Type':'text/event-stream'});
 res.write('data: '+JSON.stringify({choices:[{delta:{content:'Kết nối '}}]})+'\n\n');
 setTimeout(()=>res.end('data: '+JSON.stringify({choices:[{delta:{content:'AI hoạt động.'}}]})+'\n\ndata: [DONE]\n\n'),20);
});
await new Promise(resolve=>provider.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:3013';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3013'],{windowsHide:true,env:{...process.env,AI_API_KEY:'offline-integration-key',AI_BASE_URL:`http://127.0.0.1:${provider.address().port}/v1`,AI_MODEL:'offline-test'},stdio:['ignore','pipe','pipe']});
let output='';server.stdout.on('data',chunk=>output+=chunk);server.stderr.on('data',chunk=>output+=chunk);
let browser,safari;
try{
 let ready=false;
 for(let attempt=0;attempt<60;attempt++){
  if(server.exitCode!==null)throw Error('QA server exited before becoming ready: '+output);
  try{if((await fetch(base+'/tro-ly-van-hoc')).ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 assert.ok(ready,'QA server did not become ready');
 browser=await chromium.launch();const context=await browser.newContext();const page=await context.newPage();
 await page.goto(base+'/tro-ly-van-hoc');
 const input=page.getByRole('textbox',{name:'Nhập câu hỏi gửi Trợ lý Văn học'});
 const send=page.getByRole('button',{name:'Gửi',exact:true});
 const question='Phân tích vẻ đẹp lãng mạn và tinh thần bi tráng của người lính trong bài thơ Tây Tiến của Quang Dũng.';
 const outbound=[];page.on('request',request=>{if(request.url().endsWith('/api/tro-ly-van-hoc'))outbound.push(request.postDataJSON());});
 await input.fill(question);await send.click();
 await expect(page.getByText('Kết nối AI hoạt động.',{exact:true})).toBeVisible();
 assert.equal(Object.hasOwn(outbound[0],'imageBase64'),false);
 assert.equal(payloads[0].messages.at(-1).content,question);
 assert.equal(payloads[0].messages.length,2);
 report.checks.push('Real browser request -> real Next API -> local provider SSE -> rendered Vietnamese response');
 await input.fill('Gợi ý thêm một luận điểm.');await send.click();
 await expect(page.getByText('Kết nối AI hoạt động.',{exact:true})).toHaveCount(2);
 assert.deepEqual(payloads[1].messages.map(message=>message.role),['system','user','assistant','user']);
 report.checks.push('Follow-up includes prior user and assistant turns once');
 await page.reload();
 await page.locator('input[type="file"]').setInputFiles({name:'de-bai.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=','base64')});
 await expect(page.getByAltText('Xem trước ảnh đề bài')).toBeVisible();await send.click();await expect(page.getByText('Kết nối AI hoạt động.',{exact:true})).toBeVisible();
 assert.match(payloads[2].messages.at(-1).content[1].image_url.url,/^data:image\//);
 report.checks.push('Image-only submission reaches provider in the expected format');
 const legacy=await context.request.post(base+'/api/tro-ly-van-hoc',{data:{message:'Gợi ý cách đọc hiểu',imageBase64:null,history:[]}});
 assert.equal(legacy.status(),200);assert.equal(await legacy.text(),'Kết nối AI hoạt động.');
 report.checks.push('Already-open browser tabs with imageBase64:null remain compatible');
 const count=payloads.length;
 const invalid=await context.request.post(base+'/api/tro-ly-van-hoc',{data:{message:'ok',imageBase64:42}});assert.equal(invalid.status(),400);assert.equal(payloads.length,count);
 assert.ok(payloads.every(payload=>payload.max_completion_tokens===3000));
 report.checks.push('Invalid image types still return 400; token limits unchanged');
 for(const [engine,width] of [['chromium',360],['chromium',390],['chromium',430],['chromium',1440],['webkit',390]]){
  const mobile=width<768;
  if(engine==='webkit')safari=await webkit.launch();
  const device=await (engine==='webkit'?safari:browser).newContext({viewport:{width,height:844},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
  const screen=await device.newPage();await screen.goto(base+'/tro-ly-van-hoc');
  const field=screen.getByRole('textbox',{name:'Nhập câu hỏi gửi Trợ lý Văn học'});
  const submit=screen.getByRole('button',{name:'Gửi',exact:true});
  await field.fill('Câu thứ nhất');await field.press('Shift+Enter');
  assert.equal(await field.inputValue(),'Câu thứ nhất\n');
  await field.dispatchEvent('keydown',{key:'Enter',isComposing:true});
  assert.equal(await field.inputValue(),'Câu thứ nhất\n','IME composition must not submit');
  if(mobile){await field.press('Enter');assert.equal(await field.inputValue(),'Câu thứ nhất\n\n');}
  await field.fill('Bài phân tích dài để kiểm tra cuộn');
  await submit.scrollIntoViewIfNeeded();await field.focus();
  const geometry=()=>screen.evaluate(()=>({y:scrollY,height:document.documentElement.scrollHeight,chat:document.querySelector('.ai-chat-card').getBoundingClientRect().height}));
  const before=await geometry();if(mobile)await submit.click();else await field.press('Enter');
  await expect(field).toHaveAttribute('readonly','');
  await expect(screen.getByRole('button',{name:'Làm mới'})).toBeDisabled();
  const log=screen.getByRole('log');
  await expect.poll(()=>log.evaluate(el=>el.scrollHeight-el.clientHeight)).toBeGreaterThan(200);
  await log.evaluate(el=>{el.scrollTop=0;});
  await expect(screen.getByRole('button',{name:'Tin nhắn mới nhất'})).toBeVisible();
  await screen.waitForTimeout(500);
  assert.ok(await log.evaluate(el=>el.scrollTop<5),'Streaming must respect manual scroll');
  await screen.getByRole('button',{name:'Tin nhắn mới nhất'}).click();
  await expect(field).not.toHaveAttribute('readonly','');
  await expect.poll(()=>log.evaluate(el=>el.scrollHeight-el.scrollTop-el.clientHeight)).toBeLessThan(3);
  const after=await geometry();
  assert.ok(Math.abs(after.y-before.y)<3,`Page moved at ${width}px: ${JSON.stringify({before,after})}`);
  assert.equal(after.height,before.height,'Document height must stay stable');assert.equal(after.chat,before.chat);
  assert.ok(await screen.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Chat must not overflow horizontally');
  if(width===390||width===1440){await screen.screenshot({path:`qa/ai-chat-${width}.png`});}
  await field.fill('Giữ lại câu hỏi khi mất kết nối');
  await screen.route('**/api/tro-ly-van-hoc',route=>route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'Kết nối bị gián đoạn. Hãy thử lại.'})}));
  await submit.click();await expect(log.getByRole('alert')).toContainText('Kết nối bị gián đoạn');await expect(field).toHaveValue('Giữ lại câu hỏi khi mất kết nối');
  await screen.unroute('**/api/tro-ly-van-hoc');
  screen.once('dialog',dialog=>dialog.accept());await screen.getByRole('button',{name:'Làm mới'}).click();
  await expect(field).toHaveValue('');await expect(screen.locator('.ai-prompt-btn')).toHaveCount(4);
  report.checks.push(`${engine} ${width}px: stable page during streaming, manual scroll respected, jump to latest, multiline/IME input, draft recovery and reset`);
  await device.close();
 }
 report.providerCalls=payloads.length;report.liveProviderCalled=false;
 console.log(JSON.stringify(report,null,2));
}finally{
 if(safari)await safari.close();if(browser)await browser.close();server.kill();provider.close();
 fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/ai-integration-report.json',JSON.stringify(report,null,2));
}
