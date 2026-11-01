// Reproducible API-only bridge for ESLint's legacy callable minimatch imports.
// The registry engine stays unchanged; matching and security limits remain v11.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const require = createRequire(import.meta.url);
const omitted = (process.env.npm_config_omit || '').split(/[\s,]+/);
if (omitted.includes('dev')) {
  console.log('Development lint dependencies omitted; compatibility bridge not needed');
} else {
  const metadataPath = require.resolve('minimatch/package.json');
  const root = path.dirname(metadataPath);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  assert.equal(metadata.name, 'minimatch');
  assert.equal(metadata.version, '11.0.3', 'Review this compatibility bridge before upgrading the engine');
  const engineFiles = ['dist/commonjs/index.js', 'dist/esm/index.js'];
  const hashes = engineFiles.map(file => createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'));
  const cjs = `const engine = require('./dist/commonjs/index.js');
  module.exports = Object.assign(engine.minimatch, engine);
  `;
  const esm = `import * as engine from './dist/esm/index.js';
  export * from './dist/esm/index.js';
  export default Object.assign(engine.minimatch, engine);
  `;
  fs.writeFileSync(path.join(root, 'van-kho-compat.cjs'), cjs);
  fs.writeFileSync(path.join(root, 'van-kho-compat.mjs'), esm);
  metadata.exports['.'].require.default = './van-kho-compat.cjs';
  metadata.exports['.'].import.default = './van-kho-compat.mjs';
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
  assert.deepEqual(engineFiles.map(file => createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')), hashes, 'Registry engine files must remain unchanged');
  console.log('minimatch 11.0.3: callable lint API bridge installed (engine unchanged)');
}
