import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import path from 'node:path';
import {ESLint} from 'eslint';

const require = createRequire(import.meta.url);
const match = require('minimatch');

test('Legacy lint API delegates to the actual patched minimatch engine', () => {
  const metadata = require('minimatch/package.json');
  assert.equal(metadata.name, 'minimatch');
  assert.equal(metadata.version, '11.0.3');
  // The engine's ESM and CJS entry points have distinct function identities.
  // Compare observable matching behavior across those entry points instead.
  const engine = require(path.join(path.dirname(require.resolve('minimatch/package.json')), 'dist/commonjs/index.js'));
  for (const file of ['src/app/page.tsx', '.next/types/routes.d.ts', 'README.md']) {
    for (const pattern of ['**/*.tsx', '**/*.ts', '*.md']) {
      assert.equal(match(file, pattern, {dot: true}), engine.minimatch(file, pattern, {dot: true}));
    }
  }
  assert.equal(typeof match, 'function');
  assert.equal(match('src/app/page.tsx', '**/*.tsx'), true);
  assert.equal(match('src/app/page.tsx', '**/*.test.ts'), false);
  assert.equal(match('src/đường-dẫn.tsx', 'src/**/*.tsx'), true);
  assert.equal(match('.next/types/routes.d.ts', '**/*.ts', {dot: true}), true);
  assert.equal(match('.next/types/routes.d.ts', '**/*.ts'), false);
  assert.equal(match('src/Card.TSX', '*.tsx', {matchBase: true, nocase: true}), true);
  assert.equal(new match.Minimatch('**/*.{ts,tsx}').match('src/app/page.tsx'), true);
  assert.deepEqual(match.match(['a.ts', 'b.js'], '*.ts'), ['a.ts']);
  assert.deepEqual(match.braceExpand('a{b,c}'), ['ab', 'ac']);
  assert.equal(match.defaults({nocase: true})('Card.TSX', '*.tsx'), true);
});

test('Patched lint dependency preserves TypeScript, accessibility and hooks rules', async () => {
  const eslint = new ESLint();
  for (const [filePath, code, rule] of [
    ['compat-fixture.ts', 'const x: any = 1; export {x};', '@typescript-eslint/no-explicit-any'],
    ['compat-fixture.tsx', 'export default function Card(){ return <img src="/x.png" />; }', 'jsx-a11y/alt-text'],
    ['compat-fixture.tsx', 'import {useState} from "react"; export default function Card({ok}: {ok:boolean}){if(ok){useState(0)} return null}', 'react-hooks/rules-of-hooks'],
  ]) {
    const [result] = await eslint.lintText(code, {filePath});
    assert.ok(result.messages.some(message => message.ruleId === rule && message.severity > 0), `${rule} must still report the invalid fixture`);
  }
});
