#!/usr/bin/env node
// Recheck the existing save tests against current source. Only the two exact
// historical identity contracts belong to the separate immutable-tree job.
import { spawnSync } from 'node:child_process';
import { fromRoot, projectRoot } from './project-root.mjs';

const historicalIdentity = [
  'the committed RSH-022 recovery authority passes under the RSH-023 overlay',
  'the RSH-021 schema remains exact beneath the accepted RSH-022 recovery overlay',
];
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
console.log('CURRENT SAVE RECHECK: schema, backup, migration, quarantine, retry and recovery UI checks. Two historical SHA contracts are checked by test:historical, not accepted against changed source.');
const result = spawnSync(process.execPath, [
  '--import', fromRoot('scripts', 'runtime-typescript-loader.mjs'),
  '--test', `--test-skip-pattern=^(${historicalIdentity.map(escape).join('|')})$`,
  fromRoot('scripts', 'check-save-schema.test.mjs'),
  fromRoot('scripts', 'check-save-recovery.test.mjs'),
], { cwd: projectRoot, stdio: 'inherit' });
process.exit(result.status ?? 1);
