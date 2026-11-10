import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {transpileModule, ModuleKind, ScriptTarget} from 'typescript';

// Compile the real route (not a duplicate handler). NextRequest is a type here;
// the route uses the standard Request interface in these offline integration tests.
const source = fs.readFileSync(new URL('../src/app/api/tro-ly-van-hoc/route.ts', import.meta.url), 'utf8');
fs.mkdirSync(new URL('../qa/', import.meta.url), {recursive: true});
const compiled = new URL(`../qa/ai-route-${process.pid}.mjs`, import.meta.url);
const resolvable = source.replace("'@/content/works'", JSON.stringify(new URL('../src/content/works.ts', import.meta.url).href));
fs.writeFileSync(compiled, transpileModule(resolvable, {compilerOptions: {module: ModuleKind.ESNext, target: ScriptTarget.ES2022}}).outputText);
const {POST} = await import(compiled.href);
const request = body => new Request('http://localhost/api/tro-ly-van-hoc', {method: 'POST', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'}});

test('AI route validates requests and preserves streamed text without live API calls', async t => {
  const keys = ['AI_API_KEY', 'GEMINI_API_KEY', 'AI_BASE_URL'];
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  process.env.AI_API_KEY = 'test-only-placeholder';
  process.env.AI_BASE_URL = 'https://example.invalid/v1';
  t.after(() => {
    for (const key of keys) if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key];
    fs.unlinkSync(compiled);
  });
  t.mock.method(console, 'error', () => {});
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected network request in offline test'); });

  await t.test('Malformed JSON and invalid payloads return 400', async () => {
    const malformed = new Request('http://localhost/api/tro-ly-van-hoc', {method: 'POST', body: '{'});
    assert.equal((await POST(malformed)).status, 400);
    for (const body of [null, [], {message: 42}, {message: '   '}, {message: 'ok', imageBase64: 42}, {message: 'ok', imageBase64: {}}, {message: ' ', imageBase64: null}, {message: 'ok', history: 'bad'}, {message: 'ok', history: [{role: 'system', content: 'bad'}]}]) {
      assert.equal((await POST(request(body))).status, 400, JSON.stringify(body));
    }
  });
  await t.test('Size limits remain enforced', async () => {
    assert.equal((await POST(request({message: 'a'.repeat(4001)}))).status, 400);
    assert.equal((await POST(request({imageBase64: 'a'.repeat(7_000_001)}))).status, 400);
  });
  await t.test('Text-only browser requests accept a null image without forwarding image data', async child => {
    let payload;
    child.mock.method(globalThis, 'fetch', async (_url, init) => {
      payload = JSON.parse(init.body);
      return new Response(JSON.stringify({choices: [{message: {content: 'Kết nối thành công.'}}]}), {headers: {'Content-Type': 'application/json'}});
    });
    const response = await POST(request({message: 'Gợi ý cách đọc Tây Tiến', imageBase64: null, history: []}));
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'Kết nối thành công.');
    assert.equal(payload.messages.at(-1).content, 'Gợi ý cách đọc Tây Tiến');
  });
  await t.test('Missing configuration returns 503', async () => {
    delete process.env.AI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try { assert.equal((await POST(request({message: 'Hướng dẫn đọc hiểu'}))).status, 503); }
    finally { process.env.AI_API_KEY = 'test-only-placeholder'; }
  });
  await t.test('Relevant study notes follow the named work and retain follow-up context', async child => {
    let sent;
    child.mock.method(globalThis, 'fetch', async (_url, init) => {
      sent = JSON.parse(init.body);
      return new Response(JSON.stringify({choices: [{message: {content: 'Gợi ý có căn cứ.'}}]}), {headers: {'Content-Type': 'application/json'}});
    });
    for (const message of ['Phân tích Tràng giang', 'phan tich trang giang']) {
      await POST(request({message}));
      const notes = JSON.parse(sent.messages[0].content.split('\n').at(-1));
      assert.deepEqual(notes.map(work => work.title), ['Tràng giang']);
      assert.ok(notes[0].sections.some(section => section.units?.some(unit => unit.evidence && unit.explanation)));
    }
    await POST(request({message: 'Rút gọn ý trên', history: [{role: 'user', content: 'Phân tích Tràng giang'}]}));
    assert.equal(JSON.parse(sent.messages[0].content.split('\n').at(-1))[0].title, 'Tràng giang');
    await POST(request({message: 'Phân tích Tây Tiến', history: [{role: 'user', content: 'Phân tích Tràng giang'}]}));
    assert.deepEqual(JSON.parse(sent.messages[0].content.split('\n').at(-1)).map(work => work.title), ['Tây Tiến']);
    for (const message of ['Luận điểm là gì?', 'Viết một đoạn về lòng tốt']) {
      await POST(request({message}));
      assert.ok(!sent.messages[0].content.includes('HỌC LIỆU VĂN KHỐ ĐỂ ĐỐI CHIẾU'));
    }
    await POST(request({message: 'Phân tích bài Mộ'}));
    assert.deepEqual(JSON.parse(sent.messages[0].content.split('\n').at(-1)).map(work => work.title), ['Mộ (Chiều tối)']);
  });
  await t.test('UTF-8 chunks and a final SSE delta without newline are preserved', async child => {
    let sent;
    child.mock.method(globalThis, 'fetch', async (url, init) => {
      assert.match(url, /^https:\/\/example\.invalid\//);
      assert.ok(init.signal instanceof AbortSignal);
      sent = JSON.parse(init.body);
      const bytes = new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Gợi ý "}}]}\n' + 'data: {"choices":[{"delta":{"content":"luận điểm."}}]}');
      return new Response(new ReadableStream({start(controller) {
        for (let index = 0; index < bytes.length; index += 3) controller.enqueue(bytes.slice(index, index + 3));
        controller.close();
      }}), {headers: {'Content-Type': 'text/event-stream'}});
    });
    const response = await POST(request({message: 'Giúp em đọc hiểu', history: Array.from({length: 12}, (_, index) => ({role: 'user', content: String(index)}))}));
    assert.equal(await response.text(), 'Gợi ý luận điểm.');
    assert.equal(sent.messages.length, 12, 'System + 10 history turns + current question');
    assert.equal(sent.max_completion_tokens, 3000);
  });
  await t.test('Non-stream JSON gateway responses are accepted', async child => {
    child.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({choices: [{message: {content: 'Nêu luận điểm của em.'}}]}, null, 2), {headers: {'Content-Type': 'application/json'}}));
    assert.equal(await (await POST(request({message: 'Gợi ý'}))).text(), 'Nêu luận điểm của em.');
  });
  await t.test('Upstream errors return a friendly error without exposing provider content', async child => {
    child.mock.method(globalThis, 'fetch', async () => new Response('private provider debug details', {status: 500}));
    const response = await POST(request({message: 'Gợi ý'}));
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes('private provider'));
  });
  await t.test('Temporary failure retries once and a reader error propagates cleanly', async child => {
    let calls = 0;
    child.mock.method(globalThis, 'fetch', async () => {
      calls++;
      return calls === 1 ? new Response('busy', {status: 503}) : new Response('data: {"choices":[{"delta":{"content":"Gợi ý"}}]}\n', {headers: {'Content-Type': 'text/event-stream'}});
    });
    assert.equal(await (await POST(request({message: 'Gợi ý'}))).text(), 'Gợi ý');
    assert.equal(calls, 2);
    child.mock.method(globalThis, 'fetch', async () => new Response(new ReadableStream({start(controller) {controller.error(new Error('Simulated reader failure'));}})));
    await assert.rejects((await POST(request({message: 'Gợi ý'}))).text(), /Simulated reader failure/);
  });
});
