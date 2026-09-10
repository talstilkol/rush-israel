import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  FONT_QUALIFICATION, REVIEWED_FONT_RESOURCES, REVIEWED_FONT_SANS, REVIEWED_FONT_STYLESHEET,
  inspectFontDependencyBoundary, isReviewedFontResource,
} from './font-dependency-boundary.mjs';
import { buildDependencyClosure, CLOSURE_ROOTS, ROOT_FILES } from './dependency-closure.mjs';
import { projectRoot } from './project-root.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'rush-font-boundary-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (name, value) => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)); };
  for (const dir of CLOSURE_ROOTS) mkdirSync(path.join(root, dir), { recursive: true });
  for (const name of ROOT_FILES) put(name, '{}');
  put('package.json', { dependencies: { react: '19.2.0' } });
  put('package-lock.json', { packages: { 'node_modules/react': { version: '19.2.0', integrity: `sha512-${Buffer.alloc(64).toString('base64')}` } } });
  put('src/index.ts', `import React from 'react'; void React;`);
  put('public/game/a.png', Buffer.from([1, 2, 3]));
  put('scripts/pixel-golden.mjs', 'export const capture = 1;');
  put('scripts/run-with-server.mjs', 'export const harness = 1;');
  put('scripts/capture-golden.mjs', 'export const capture = 1;');
  return { root, put };
}

const productStyle = `@import url("${REVIEWED_FONT_STYLESHEET}");\n@theme { --font-sans: ${REVIEWED_FONT_SANS}; }\n`;
const productRoot = `export const Route = { head: () => ({ links: [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
]}) };\n`;

function product(t) {
  const f = fixture(t);
  f.put('src/styles.css', productStyle);
  f.put('src/routes/__root.tsx', productRoot);
  return f;
}

test('committed product qualifies the three reviewed font URLs without font files or immutable CDN bytes', () => {
  const result = buildDependencyClosure();
  assert.deepEqual(result.errors, []);
  assert.equal(result.font_dependency_boundary.qualified, true);
  assert.equal(result.font_dependency_boundary.font_files_written, 0);
  assert.equal(result.font_dependency_boundary.immutable_bytes_verified, false);
  assert.equal(result.unqualified_external_resources.length, 0);
  assert.equal(result.complete_dependency_closure, false);
  assert.equal(result.freeze_granted, false);
  const qualified = result.qualified_external_resources.filter(isReviewedFontResource);
  assert.equal(qualified.length, 3);
  assert.ok(qualified.every(row => row.qualification === FONT_QUALIFICATION));
  for (const expected of REVIEWED_FONT_RESOURCES) {
    assert.ok(qualified.some(row => row.from === expected.from && row.resource === expected.resource && row.kind === expected.kind));
  }
});

test('original typography declarations remain the reviewed Heebo and Noto Sans Arabic pins', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const root = readFileSync(new URL('../src/routes/__root.tsx', import.meta.url), 'utf8');
  assert.match(css, /family=Heebo:wght@400;500;600;700;800&family=Noto\+Sans\+Arabic:wght@400;500;600;700&display=swap/);
  assert.match(css, /--font-sans: "Heebo", "Noto Sans Arabic", ui-sans-serif, system-ui, sans-serif/);
  assert.match(root, /preconnect.*https:\/\/fonts\.googleapis\.com/s);
  assert.match(root, /preconnect.*https:\/\/fonts\.gstatic\.com/s);
});

test('stylesheet family or weight drift fails closed', t => {
  const f = product(t);
  f.put('src/styles.css', productStyle.replace('wght@400;500;600;700;800', 'wght@400'));
  const result = inspectFontDependencyBoundary(f.root, ['src/styles.css', 'src/routes/__root.tsx'], [...REVIEWED_FONT_RESOURCES]);
  assert.equal(result.qualified, false);
  assert.match(result.errors.join(' '), /stylesheet URL missing or changed/);
});

test('font-sans stack drift fails closed', t => {
  const f = product(t);
  f.put('src/styles.css', productStyle.replace('Noto Sans Arabic', 'Arial'));
  const result = inspectFontDependencyBoundary(f.root, ['src/styles.css', 'src/routes/__root.tsx'], [...REVIEWED_FONT_RESOURCES]);
  assert.equal(result.qualified, false);
  assert.match(result.errors.join(' '), /font-sans stack missing or changed/);
});

test('missing gstatic preconnect fails closed', t => {
  const f = product(t);
  f.put('src/routes/__root.tsx', productRoot.replace('https://fonts.gstatic.com', 'https://example.com'));
  const result = inspectFontDependencyBoundary(f.root, ['src/styles.css', 'src/routes/__root.tsx'], [
    REVIEWED_FONT_RESOURCES[0],
    { from: 'src/routes/__root.tsx', resource: 'https://example.com', kind: 'potential_remote_reference' },
    REVIEWED_FONT_RESOURCES[2],
  ]);
  assert.equal(result.qualified, false);
  assert.match(result.errors.join(' '), /preconnect missing/);
});

test('an extra Google Fonts family cannot be silently added', t => {
  const f = product(t);
  const extra = { from: 'src/styles.css', resource: 'https://fonts.googleapis.com/css2?family=Roboto', kind: 'css_url' };
  const result = inspectFontDependencyBoundary(f.root, ['src/styles.css', 'src/routes/__root.tsx'], [...REVIEWED_FONT_RESOURCES, extra]);
  assert.equal(result.qualified, false);
  assert.match(result.errors.join(' '), /unreviewed Google Fonts reference/);
});

test('vendored font binaries fail closed instead of being treated as qualification', t => {
  const f = product(t);
  f.put('public/game/heebo.woff2', Buffer.from([1, 2, 3, 4]));
  const result = inspectFontDependencyBoundary(f.root, ['src/styles.css', 'src/routes/__root.tsx', 'public/game/heebo.woff2'], [...REVIEWED_FONT_RESOURCES]);
  assert.equal(result.qualified, false);
  assert.equal(result.font_files_written, 1);
  assert.match(result.errors.join(' '), /distributed font files are forbidden/);
});

test('unreviewed non-Google font CSS remains unqualified without a local inventory error', t => {
  const f = fixture(t);
  f.put('src/styles.css', '@import url("https://fonts.example/font.css");');
  const result = buildDependencyClosure(f.root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.local_inventory_complete, true);
  assert.equal(result.complete_dependency_closure, false);
  assert.equal(result.qualified_external_resources.length, 0);
  assert.equal(result.unqualified_external_resources[0].kind, 'css_url');
  assert.equal(result.font_dependency_boundary.immutable_bytes_verified, true);
});

test('a fixture without remote fonts still has vacuous immutable-byte completeness', t => {
  const f = fixture(t);
  const result = buildDependencyClosure(f.root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.complete_dependency_closure, true);
  assert.equal(result.font_dependency_boundary.immutable_bytes_verified, true);
  assert.equal(result.freeze_granted, false);
});
