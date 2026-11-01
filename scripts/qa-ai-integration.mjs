import fs from 'node:fs';
import http from 'node:http';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {chromium, expect} from '@playwright/test';
const report={checks:[],providerCalls:0};const payloads=[];
const provider=http.createServer(async(req,res)=>{
 let body='';for await(const chunk of req)body+=chunk;
 assert.equal(req.headers.authorization,'Bearer offline-integration-key');
 payloads.push(JSON.parse(body));
 res.writeHead(200,{'Content-Type':'text/event-stream'});
 res.write('data: '+JSON.stringify({choices:[{delta:{content:'Kết nối '}}]})+'\n\n');
 setTimeout(()=>res.end('data: '+JSON.stringify({choices:[{delta:{content:'AI hoạt động.'}}]})+'\n\ndata: [DONE]\n\n'),20);
});
await new Promise(resolve=>provider.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:3013';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3013'],{windowsHide:true,env:{...process.env,AI_API_KEY:'offline-integration-key',AI_BASE_URL:`http://127.0.0.1:${provider.address().port}/v1`,AI_MODEL:'offline-test'},stdio:['ignore','pipe','pipe']});
let output='';server.stdout.on('data',chunk=>output+=chunk);server.stderr.on('data',chunk=>output+=chunk);
let browser;
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
 report.providerCalls=payloads.length;report.liveProviderCalled=false;
 console.log(JSON.stringify(report,null,2));
}finally{
 if(browser)await browser.close();server.kill();provider.close();
 fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/ai-integration-report.json',JSON.stringify(report,null,2));
}
