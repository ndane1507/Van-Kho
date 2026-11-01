import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {mediaData} from '../src/content/media.ts';

// Match the existing CSS cover crop; never generate or substitute new artwork.
const items = mediaData.map(asset => ({path: asset.path, ratio: 1.5, positionY: .5}));
const output = path.resolve('public/images/mobile');
fs.mkdirSync(output, {recursive: true});
assert.equal(new Set(items.map(asset => path.parse(asset.path).name)).size, items.length);
const manifest = {};
for (const [index, asset] of items.entries()) {
  const source = path.resolve('public', asset.path.slice(1));
  const metadata = await sharp(source).metadata();
  const width = Math.min(metadata.width, Math.round(metadata.height * asset.ratio));
  const height = Math.min(metadata.height, Math.round(width / asset.ratio));
  const crop = {left: Math.round((metadata.width - width) / 2), top: Math.round((metadata.height - height) * asset.positionY), width, height};
  const stem = path.parse(asset.path).name;
  const formats = {avif: [], webp: []};
  for (const size of [672, 960]) {
    for (const format of ['avif', 'webp']) {
      const name = `${stem}-${size}.${format}`;
      let image = sharp(source).extract(crop).resize({width: size});
      image = format === 'avif' ? image.avif({quality: 35, effort: 5}) : image.webp({quality: 60, effort: 5});
      await image.toFile(path.join(output, name));
      formats[format].push(`/images/mobile/${name} ${size}w`);
    }
  }
  manifest[asset.path] = {avif: formats.avif.join(', '), webp: formats.webp.join(', ')};
  if ((index + 1) % 10 === 0) console.log(`Prepared ${index + 1}/${items.length} mobile artwork variants`);
}
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared all ${items.length} images; originals unchanged`);
