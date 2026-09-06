import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { CLOSURE_ROOTS, ROOT_FILES, buildDependencyClosure, validateDependencyClosure } from './dependency-closure.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'rush-closure-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (name, value) => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)); };
  for (const dir of CLOSURE_ROOTS) mkdirSync(path.join(root, dir), { recursive: true });
  for (const name of ROOT_FILES) put(name, '{}');
  put('package.json', { dependencies: { react: '19.2.0' } });
  put('package-lock.json', { packages: { 'node_modules/react': { version: '19.2.0', integrity: `sha512-${Buffer.alloc(64).toString('base64')}` } } });
  put('src/index.ts', `import React from 'react'; import './other'; export const deferred = () => import('@/other'); void React;`);
  put('src/other.ts', 'export const value = 1;');
  put('public/game/a.png', Buffer.from([1, 2, 3]));
  put('scripts/pixel-golden.mjs', 'export const capture = 1;');
  put('scripts/run-with-server.mjs', 'export const harness = 1;');
  put('scripts/capture-golden.mjs', 'export const capture = 1;');
  return { root, put };
}

test('committed conservative inventory validates without claiming external qualification or freeze', () => {
  const result = validateDependencyClosure();
  assert.deepEqual(result.errors, []); assert.ok(result.fileCount > 600); assert.ok(result.importCount > 700);
  assert.ok(result.externalCount > 0); assert.equal(result.complete, false); assert.equal(result.freezeGranted, false);
});
test('static, dynamic and alias imports have deterministic exact-byte closure', t => {
  const { root } = fixture(t), a = buildDependencyClosure(root), b = buildDependencyClosure(root);
  assert.deepEqual(a, b); assert.deepEqual(a.errors, []); assert.equal(a.complete_dependency_closure, true);
  assert.equal(a.imports.find(row => row.kind === 'dynamic_import').target, 'src/other.ts');
  assert.equal(a.freeze_granted, false);
});
for (const [name, mutate] of [
  ['source edit', f => f.put('src/other.ts', 'export const value = 2;')],
  ['untracked source addition', f => f.put('src/unreferenced.ts', 'export const latent = true;')],
  ['untracked asset addition', f => f.put('public/game/new.png', 'new bytes')],
  ['asset removal', f => rmSync(path.join(f.root, 'public/game/a.png'))],
  ['asset byte substitution', f => f.put('public/game/a.png', 'changed bytes')],
  ['new build configuration', f => f.put('new.config.ts', 'export default {};')],
  ['lockfile version drift', f => f.put('package-lock.json', { packages: {} })],
]) test(`inventory detects ${name} instead of refreshing itself`, t => {
  const f = fixture(t), prior = buildDependencyClosure(f.root); mutate(f);
  assert.match(validateDependencyClosure(f.root, prior).errors.join(' '), /drift/);
});
test('unresolved literal module imports fail closed', t => {
  const f = fixture(t); f.put('src/bad.ts', `import './missing';`);
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /unresolved local import/);
});
test('nonliteral dynamic imports fail closed', t => {
  const f = fixture(t); f.put('src/bad.ts', 'const name = "./other"; import(name);');
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /unresolved dynamic_import/);
});
test('unhandled import globs fail closed', t => {
  const f = fixture(t); f.put('src/bad.ts', 'const files = import.meta.glob("./*.ts");');
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /unresolved module glob/);
});
test('repository-escaping imports fail closed', t => {
  const f = fixture(t); f.put('src/bad.ts', `import '../../outside';`);
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /escapes repository/);
});
test('symbolic links cannot conceal unsealed source', t => {
  const f = fixture(t); symlinkSync(path.join(f.root, 'src/other.ts'), path.join(f.root, 'src/alias.ts'));
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /symlink/);
});
test('CSS remote fonts remain explicit unresolved external qualification', t => {
  const f = fixture(t); f.put('src/styles.css', '@import url("https://fonts.example/font.css");');
  const result = buildDependencyClosure(f.root);
  assert.deepEqual(result.errors, []); assert.equal(result.local_inventory_complete, true);
  assert.equal(result.complete_dependency_closure, false); assert.equal(result.external_resources[0].kind, 'css_url');
});
test('mutable CI actions prevent complete dependency qualification while reviewed exact commits do not', t => {
  const f = fixture(t); f.put('.github/workflows/ci.yml', 'steps:\n - uses: actions/checkout@v4\n');
  assert.equal(buildDependencyClosure(f.root).complete_dependency_closure, false);
  f.put('.github/workflows/ci.yml', `steps:\n - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262\n`);
  assert.equal(buildDependencyClosure(f.root).complete_dependency_closure, true);
});
test('package names with missing or invalid integrity cannot resolve', t => {
  const f = fixture(t); f.put('package-lock.json', { packages: { 'node_modules/react': { version: '19.2.0', integrity: 'made-up' } } });
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /unsealed package/);
});
test('type-only imports and JS-to-TS module resolution stay in inventory', t => {
  const f = fixture(t); f.put('src/types.ts', `import type { Value } from './other.js'; export type X = Value;`);
  const result = buildDependencyClosure(f.root);
  assert.deepEqual(result.errors, []); assert.ok(result.imports.some(row => row.typeOnly && row.target === 'src/other.ts'));
});
test('model external and missing local resources cannot silently disappear', t => {
  const f = fixture(t); f.put('public/game/model.gltf', { buffers: [{ uri: 'https://assets.example/mesh.bin' }], images: [{ uri: 'missing.png' }] });
  const result = buildDependencyClosure(f.root);
  assert.match(result.errors.join(' '), /unresolved model asset/); assert.ok(result.external_resources.some(row => row.kind === 'gltf_uri'));
});
test('truncated GLB dependency data is not considered complete', t => {
  const f = fixture(t); f.put('public/game/model.glb', Buffer.from([1, 2]));
  assert.match(buildDependencyClosure(f.root).errors.join(' '), /invalid model dependency/);
});
test('fabricated completeness and digest fields are rejected', t => {
  const f = fixture(t), result = buildDependencyClosure(f.root);
  assert.match(validateDependencyClosure(f.root, { ...result, freeze_granted: true }).errors.join(' '), /drift/);
  assert.match(validateDependencyClosure(f.root, { ...result, digest_sha256: '0'.repeat(64) }).errors.join(' '), /drift/);
});
test('missing mandatory roots and parse errors remain explicit blockers', t => {
  const f = fixture(t); rmSync(path.join(f.root, 'server'), { recursive: true }); f.put('src/bad.ts', 'export const = ;');
  const result = buildDependencyClosure(f.root);
  assert.match(result.errors.join(' '), /missing closure input: server/); assert.match(result.errors.join(' '), /parse error/);
});

test('known virtual build provider is local, while unknown providers require qualification', t => {
  const f = fixture(t); f.put('scripts/grok-pwa-plugin.mjs', 'export const plugin = true;');
  f.put('server/virtual.ts', `import { value } from 'virtual:grok-og-identity'; void value;`);
  let result = buildDependencyClosure(f.root);
  assert.ok(result.imports.some(row => row.resolution === 'repository_virtual_provider'));
  assert.equal(result.complete_dependency_closure, true);
  f.put('server/virtual.ts', `import { value } from 'virtual:unknown'; void value;`);
  result = buildDependencyClosure(f.root); assert.equal(result.complete_dependency_closure, false);
});
test('canonical loopback QA origins are not confused with remote dependencies', t => {
  const f = fixture(t); f.put('scripts/pixel-golden.mjs', `export const url = 'http://127.0.0.1:8080/?qa=1';`);
  assert.equal(buildDependencyClosure(f.root).external_resources.length, 0);
});
