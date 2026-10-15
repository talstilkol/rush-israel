#!/usr/bin/env node
// Reproduce historical extraction/provenance contracts against their actual Git tree.
// This never evaluates the current game as frozen, released or product-accepted.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync, rmSync } from 'node:fs';
import { fromRoot, projectRoot } from './project-root.mjs';

const BASE = 'b2c0d46dd43c3bd8f27dc0009e4809c27c54c60e';
const catalogue = JSON.parse(readFileSync(fromRoot('TEST-CLASSIFICATION.json'), 'utf8'));
if (catalogue.historical_base !== BASE) throw new Error('Historical base must be the audited immutable commit');
const target = fromRoot('artifacts', `historical-${BASE}`);
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: projectRoot, encoding: 'utf8', ...options });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed: ${result.stderr || result.error || ''}`);
  return result.stdout;
}
const expectedTree = run('git', ['rev-parse', `${BASE}^{tree}`]).trim();
if (!existsSync(target)) {
  mkdirSync(target, { recursive: true });
  const archive = run('git', ['archive', '--format=tar', BASE], { encoding: null, maxBuffer: 128 * 1024 * 1024 });
  run('tar', ['-xf', '-', '-C', target], { input: archive });
  run('git', ['init', '--quiet', target]);
  run('git', ['-C', target, 'add', '--all']);
  const actualTree = run('git', ['-C', target, 'write-tree']).trim();
  if (actualTree !== expectedTree) throw new Error('Historical extraction does not reconstruct the exact Git tree');
  symlinkSync(fromRoot('node_modules'), `${target}/node_modules`, process.platform === 'win32' ? 'junction' : 'dir');
}
writeFileSync(`${target}/.git/info/exclude`, "/node_modules\n");
// Detect edits to a previous extraction, including untracked source files.
if (run('git', ['-C', target, 'write-tree']).trim() !== expectedTree || run('git', ['-C', target, 'diff', '--exit-code']).trim() || run('git', ['-C', target, 'ls-files', '--others', '--exclude-standard']).trim()) {
  throw new Error('Historical fixture changed; preserve diagnostics and rebuild the extraction');
}
const files = Object.entries(catalogue.tests).filter(([, kind]) => kind === 'historical-contract').map(([name]) => `${target}/scripts/${name}`);
console.log(`HISTORICAL CONTRACTS ONLY: commit=${BASE} tree=${expectedTree} files=${files.length}; no current product acceptance.`);
const result = spawnSync(process.execPath, ['--experimental-strip-types', '--test', ...files], { cwd: target, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
writeFileSync(fromRoot('artifacts', 'historical-tests.tap'), result.stdout || '');
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
writeFileSync(fromRoot('artifacts', 'historical-contracts.json'), `${JSON.stringify({ kind: 'historical-only', base: BASE, tree: expectedTree, testFiles: files.length, status: result.status, productAcceptance: false }, null, 2)}\n`);
if (result.status === 0) rmSync(target, { recursive: true });
process.exit(result.status ?? 1);
