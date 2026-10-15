#!/usr/bin/env node
/** Release guard; successful code CI alone cannot authorize a product release. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fromRoot, projectRoot } from './project-root.mjs';
const readiness = JSON.parse(readFileSync(fromRoot('PRODUCT-READINESS.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(fromRoot('package.json'), 'utf8'));
const git = args => spawnSync('git', args, { cwd: projectRoot, encoding: 'utf8' });
const head = git(['rev-parse', 'HEAD']);
const sha = head.status === 0 ? head.stdout.trim() : null;
const missing = [];
if (!sha || readiness.release_target_sha !== sha) missing.push('release target is not bound to the exact current commit');
if (git(['status', '--porcelain']).stdout.trim()) missing.push('release checkout is not clean');
if (readiness.gates.length !== 13 || new Set(readiness.gates.map(gate => gate.id)).size !== 13) missing.push('the 13-gate inventory is incomplete');
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
