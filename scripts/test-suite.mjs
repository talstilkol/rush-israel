#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fromRoot, projectRoot } from './project-root.mjs';

export function readTestCatalogue() {
  const catalogue = JSON.parse(readFileSync(fromRoot('TEST-CLASSIFICATION.json'), 'utf8'));
  const actual = readdirSync(fromRoot('scripts')).filter(name => name.endsWith('.test.mjs')).sort();
  const declared = Object.keys(catalogue.tests).sort();
  if (JSON.stringify(actual) !== JSON.stringify(declared)) throw new Error('Every test file must be explicitly classified; update TEST-CLASSIFICATION.json');
  if (Object.values(catalogue.tests).some(kind => !['current-unit', 'historical-contract', 'current-long'].includes(kind))) throw new Error('Unknown test classification');
  return catalogue;
}

const catalogue = readTestCatalogue();
const files = Object.entries(catalogue.tests).filter(([, kind]) => kind === 'current-unit').map(([name]) => fromRoot('scripts', name));
console.log(`CURRENT SOURCE UNIT TESTS: ${files.length} files. Historical contracts and the 30-minute browser job are separate required CI jobs.`);
const result = spawnSync(process.execPath, ['--import', fromRoot('scripts', 'runtime-typescript-loader.mjs'), '--test', ...files], { cwd: projectRoot, stdio: 'inherit' });
process.exit(result.status ?? 1);
