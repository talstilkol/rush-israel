import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inspectTemplateImport, inspectProductHeadBoundary, SAFE_TEMPLATE_EXPORTS } from './product-head-boundary.mjs';
import { projectRoot } from './project-root.mjs';

const consumer = 'scripts/consumer.mjs';
test('reviewed safe named exports and aliases remain usable', () => {
  for (const name of SAFE_TEMPLATE_EXPORTS) assert.deepEqual(inspectTemplateImport(`import { ${name} as local } from './grok-pwa-shared.mjs';`, consumer), []);
});
test('unsafe named imports including renamed injectors fail qualification', () => {
  for (const name of ['injectGrokPwaHead','createHeadInjector','grokExtensionsHeadTags','grokOgHeadTags']) {
    assert.ok(inspectTemplateImport(`import { ${name} as safeLooking } from './grok-pwa-shared.mjs';`, consumer).length);
  }
});
test('namespace, default, side-effect and re-export access are not qualified', () => {
  for (const source of ["import * as x from './grok-pwa-shared.mjs';", "import x from './grok-pwa-shared.mjs';", "import './grok-pwa-shared.mjs';", "export * from './grok-pwa-shared.mjs';", "export {createHeadInjector as x} from './grok-pwa-shared.mjs';"]) assert.ok(inspectTemplateImport(source, consumer).length);
});
test('dynamic import and require cannot silently recover the vendor injector', () => {
  for (const source of ["await import('./grok-pwa-shared.mjs')", "require('./grok-pwa-shared.mjs')"]) assert.ok(inspectTemplateImport(source, consumer).length);
});
test('absolute paths and query suffixes do not bypass symbol qualification', () => {
  for (const spec of ['/scripts/grok-pwa-shared.mjs', './grok-pwa-shared.mjs?x']) assert.ok(inspectTemplateImport(`import {createHeadInjector} from '${spec}'`, consumer).length);
});
test('unrelated imports and comments do not become template violations', () => assert.deepEqual(inspectTemplateImport("import * as x from './other.mjs'; // import {createHeadInjector} from './grok-pwa-shared.mjs'", consumer), []));
test('the current actual serving graph qualifies with fixed compatibility bytes', () => {
  const paths = ['scripts/grok-pwa-plugin.mjs', 'server/middleware/grok-pwa.ts', 'scripts/rush-pwa.mjs', 'scripts/rush-head.mjs', 'scripts/brand-check.mjs'];
  const result = inspectProductHeadBoundary(projectRoot, paths); assert.deepEqual(result.errors, []); assert.equal(result.qualified, true); assert.equal(result.consumers.length, 5);
});
test('modified shared bytes or restored vendor serving code block qualification', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'rush-head-boundary-'));
  const files = ['scripts/grok-pwa-shared.mjs', 'scripts/grok-pwa-plugin.mjs', 'server/middleware/grok-pwa.ts'];
  try {
    for (const file of files) { mkdirSync(path.dirname(path.join(root,file)), { recursive:true }); writeFileSync(path.join(root,file), readFileSync(path.join(projectRoot,file))); }
    assert.equal(inspectProductHeadBoundary(root,files).qualified, true);
    writeFileSync(path.join(root,files[0]), readFileSync(path.join(root,files[0]),'utf8')+'\n// drift');
    assert.ok(inspectProductHeadBoundary(root,files).errors.some(e=>e.includes('bytes changed')));
    writeFileSync(path.join(root,files[0]), readFileSync(path.join(projectRoot,files[0])));
    writeFileSync(path.join(root,files[1]), "import {createHeadInjector} from './grok-pwa-shared.mjs';");
    const result = inspectProductHeadBoundary(root, files); assert.equal(result.qualified, false); assert.ok(result.errors.some(e=>e.includes('unsafe'))); assert.ok(result.errors.some(e=>e.includes('absent')));
  } finally { rmSync(root, { recursive:true, force:true }); }
});
