import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PHYSICS_VERSION } from '../src/game/physics.ts';
import { fromRoot } from './project-root.mjs';

test('the current acceleration reference matches the record epoch without changing prior numerical targets', () => {
  const reference = JSON.parse(readFileSync(fromRoot('golden-baseline', 'accel.json'), 'utf8'));
  const prior = JSON.parse(readFileSync(fromRoot('evidence', '2026-10-16', 'accel-epoch', 'before-baseline.json'), 'utf8'));
  assert.equal(reference.physicsVersion, PHYSICS_VERSION, 'update the reviewed reference epoch with the physics epoch');
  assert.equal(prior.physicsVersion, 11, 'retain the actual parent reference');
  const { physicsVersion: currentEpoch, authority: currentAuthority, ...currentNumbers } = reference;
  const { physicsVersion: priorEpoch, authority: priorAuthority, ...priorNumbers } = prior;
  assert.equal(currentEpoch, 16, 'a later calibration requires a new explicit reference review');
  assert.equal(priorEpoch, 11);
  assert.ok(currentAuthority && priorAuthority);
  assert.deepEqual(currentNumbers, priorNumbers,
    'this layout/record-epoch correction must preserve all means, claims, tolerances and original measurement provenance');
});
