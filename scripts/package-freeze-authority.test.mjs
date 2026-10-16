import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PACKAGE_JSON_FROZEN, PACKAGE_SOURCE_SHA256, OWNER_FREEZE } from '../src/game/semver-release/semver.ts';
import { fromRoot } from './project-root.mjs';

test('a current package freeze claim requires the actual bytes and owner authority', () => {
  const actual = createHash('sha256').update(readFileSync(fromRoot('package.json'))).digest('hex');
  const contradictions = [];
  if (PACKAGE_JSON_FROZEN) {
    if (!OWNER_FREEZE) contradictions.push('package frozen without owner freeze');
    if (actual !== PACKAGE_SOURCE_SHA256) contradictions.push(`package bytes ${actual} differ from declared freeze ${PACKAGE_SOURCE_SHA256}`);
  }
  assert.deepEqual(contradictions, [], 'historical tokens must not certify the current working tree');
});
