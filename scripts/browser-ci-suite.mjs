#!/usr/bin/env node
// Split software-rendered CI work without dropping any canonical runtime gate.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fromRoot, projectRoot } from './project-root.mjs';

const suites = {
  'worlds-races': ['qa:world:raw', 'qa:conditions:raw', 'qa:photo:raw', 'qa:v1:raw'],
  'driving-lifecycle': ['qa:raw', 'qa:damage:raw', 'qa:soak:raw'],
};
const canonical = JSON.parse(readFileSync(fromRoot('package.json'), 'utf8')).scripts['qa:runtime:raw']
  .split(/\s*&&\s*/).map(command => {
    const match = /^npm run ([a-z0-9:-]+)$/.exec(command.trim());
    if (!match) throw new Error(`Unclassified canonical runtime command: ${command}`);
    return match[1];
  });
const split = Object.values(suites).flat();
if (new Set(split).size !== split.length || JSON.stringify([...split].sort()) !== JSON.stringify([...canonical].sort())) {
  throw new Error('Split browser jobs must cover every canonical runtime gate exactly once');
}
const selected = process.argv[2];
if (selected === '--verify-coverage') {
  console.log(JSON.stringify({ canonical, suites, coverage: 'every gate exactly once' }));
} else {
  if (!Object.hasOwn(suites, selected)) throw new Error('Expected worlds-races or driving-lifecycle');
  for (const script of suites[selected]) {
    const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', script], {
      cwd: projectRoot, stdio: 'inherit', shell: process.platform === 'win32',
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
