import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {mediaData} from '../src/content/media.ts';

test('Every work has valid responsive illustration sources', async () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../public/images/mobile/manifest.json', import.meta.url)));
  for (const imagePath of mediaData.map(asset => asset.path)) {
    assert.ok(manifest[imagePath], imagePath);
    for (const format of ['avif', 'webp']) for (const source of manifest[imagePath][format].split(', ')) {
      const [url, descriptor] = source.split(' ');
      const filename = new URL(`../public${url}`, import.meta.url);
      assert.ok(fs.existsSync(filename), url);
      const metadata = await sharp(fileURLToPath(filename)).metadata();
      assert.equal(metadata.width, Number.parseInt(descriptor, 10), url);
      assert.ok(metadata.height > 0, url);
    }
  }
});

test('Vietnamese font source provenance matches the checked-in originals', () => {
  const provenance = JSON.parse(fs.readFileSync(new URL('../docs/media/fonts/font-provenance.json', import.meta.url)));
  assert.equal(provenance.length, 5);
  for (const face of provenance) {
    const source = fs.readFileSync(new URL('../' + face.path.replaceAll('\\', '/'), import.meta.url));
    assert.equal(createHash('sha256').update(source).digest('hex'), face.sha256, face.path);
  }
});
