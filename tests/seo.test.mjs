import test from 'node:test';
import assert from 'node:assert/strict';
import {safeJson, pageMeta, siteUrl} from '../src/lib/seo.ts';

test('Structured metadata is safe in script tags and preserves Vietnamese text', () => {
  const value = {title: 'Tiếng Việt: Tràng giang', description: '</script><img src=x onerror=alert(1)>'};
  const encoded = safeJson(value);
  assert.ok(!encoded.includes('<'));
  assert.deepEqual(JSON.parse(encoded), value);
});

test('Page metadata uses a canonical path and consistent share images', () => {
  const metadata = pageMeta('Tràng giang', 'Phân tích', '/tac-pham/trang-giang');
  assert.equal(metadata.alternates.canonical, '/tac-pham/trang-giang');
  assert.ok(!siteUrl.endsWith('/'));
  assert.equal(metadata.openGraph.url, '/tac-pham/trang-giang');
  assert.equal(metadata.twitter.card, 'summary_large_image');
});
