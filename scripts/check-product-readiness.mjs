#!/usr/bin/env node
/** Release guard; successful code CI alone cannot authorize a product release. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fromRoot, projectRoot } from './project-root.mjs';
// Exact-commit evidence must be external: committing its own SHA would change it.
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--manifest')) throw new Error('usage: check-product-readiness.mjs [--manifest path]');
const readiness = JSON.parse(readFileSync(args[1] || fromRoot('PRODUCT-READINESS.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(fromRoot('package.json'), 'utf8'));
const git = args => spawnSync('git', args, { cwd: projectRoot, encoding: 'utf8' });
const head = git(['rev-parse', 'HEAD']);
const sha = head.status === 0 ? head.stdout.trim() : null;
const missing = [];
if (!sha || readiness.release_target_sha !== sha) missing.push('release target is not bound to the exact current commit');
if (git(['status', '--porcelain']).stdout.trim()) missing.push('release checkout is not clean');
if (readiness.gates.length !== 13 || Array.from({ length: 13 }, (_, i) => i + 1).some(id => !readiness.gates.some(gate => gate.id === id))) missing.push('the 13-gate inventory is incomplete');
for (const gate of readiness.gates) {
  if (gate.status !== 'verified' && !(gate.id === 2 && gate.status === 'verified-settings')) {
    missing.push(`gate ${gate.id}: ${gate.status} — ${gate.note}`);
    continue;
  }
  if (!gate.evidence.length) missing.push(`gate ${gate.id}: no evidence files`);
  for (const path of gate.evidence) {
    try { readFileSync(fromRoot(path)); } catch { missing.push(`gate ${gate.id}: missing evidence ${path}`); }
  }
  if (gate.id !== 2 && gate.verified_sha !== sha) missing.push(`gate ${gate.id}: evidence is not bound to the release commit`);
}
if (pkg.version === '0.0.0-private') missing.push('package version has not been prepared for release');
if (git(['verify-tag', `v${pkg.version}`]).status !== 0) missing.push(`no locally verifiable signed tag v${pkg.version}`);
if (git(['rev-parse', `v${pkg.version}^{commit}`]).stdout.trim() !== sha) missing.push('the release tag does not identify the current commit');
if (!readiness.owner_distribution_authorization) missing.push('owner private-distribution acceptance is not recorded');
if (missing.length) {
  console.error('PRODUCT RELEASE BLOCKED\n' + missing.map(item => `- ${item}`).join('\n'));
  process.exitCode = 1;
} else if (readiness.release_ready !== true) {
  console.error('PRODUCT RELEASE BLOCKED: owner readiness record remains false');
  process.exitCode = 1;
} else {
  console.log(`release prerequisites recorded for ${sha}; perform the documented owner release procedure`);
}
