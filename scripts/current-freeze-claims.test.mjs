import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import { AYALON_FREEZE_GRANTED, FREEZE_APPROVAL, TRANSITIVE_SOURCE_SHA256 } from '../src/game/ayalon-freeze/freeze.ts';
import { RC1_PRODUCED } from '../src/game/rc1-close/rc1.ts';

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : path.endsWith('.ts') ? [path] : [];
  });
}

test('current source cannot assert a product freeze while its owner authority is false', () => {
  const contradictions = [];
  for (const path of sourceFiles(fromRoot('src/game'))) {
    const source = readFileSync(path, 'utf8');
    if (!/export const OWNER_FREEZE = false;/.test(source)) continue;
    for (const match of source.matchAll(/export const ([A-Z_]*(?:LOCKED|FROZEN|FREEZE_GRANTED|SOURCE_FREEZE)) = true;/g)) {
      contradictions.push(`${relative(fromRoot(), path)}: ${match[1]}`);
    }
  }
  assert.deepEqual(contradictions, [], 'historical locks do not certify changed gameplay, art, input or release');
});

test('an Ayalon freeze requires its exact transitive source bytes and current approval', () => {
  const changed = Object.entries(TRANSITIVE_SOURCE_SHA256).filter(([path, expected]) => {
    const actual = createHash('sha256').update(readFileSync(fromRoot(path))).digest('hex');
    return actual !== expected;
  }).map(([path]) => path);
  if (AYALON_FREEZE_GRANTED) {
    assert.equal(FREEZE_APPROVAL.freeze_granted, true);
    assert.deepEqual(changed, [], 'a historical owner instruction cannot freeze changed source');
  } else {
    assert.equal(FREEZE_APPROVAL.freeze_granted, false);
    assert.equal(FREEZE_APPROVAL.status, 'unverified-current-source');
  }
});

test('RC metadata cannot certify a release candidate absent from the actual readiness ledger', () => {
  const readiness = JSON.parse(readFileSync(fromRoot('PRODUCT-READINESS.json'), 'utf8'));
  if (RC1_PRODUCED) assert.ok(readiness.release_target_sha, 'RC1 has no accepted candidate SHA');
});
