import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PHYSICS_VERSION } from '../src/game/physics.ts';
import {
  REC_KEY,
  canonicalTimedRecordsString,
  hashTimedRecord,
  loadTimedRecords,
  persistTimedRecord,
} from '../src/game/records.ts';
import { fromRoot } from './project-root.mjs';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

const V7_SABRA = {
  t: 91.234,
  trackId: 'ayalon',
  carId: 'sabra',
  physicsVersion: 7,
  hash: '8f55e131a7414eebe40613a033e74114b06d9a806f9b7bcf7977aba08f17a83f',
};
const V7_KFIR = {
  t: 104.5,
  trackId: 'ayalon',
  carId: 'kfir',
  physicsVersion: 7,
  hash: '9bdac80ad39e8daaffaf17e9e8608488b4c5b307289a3d95853fdf9c99447b3f',
};

test('physicsVersion remains 7 and matches the freeze pin', () => {
  assert.equal(PHYSICS_VERSION, 7);
  assert.match(readFileSync(fromRoot('src/game/physics.ts'), 'utf8'), /export const PHYSICS_VERSION = 7;/);
});

test('frozen version-7 payloads keep their historical SHA-256', () => {
  assert.equal(hashTimedRecord(V7_SABRA), V7_SABRA.hash);
  assert.equal(hashTimedRecord(V7_KFIR), V7_KFIR.hash);
  assert.equal(
    createHash('sha256').update('ayalon|sabra|91.234|7').digest('hex'),
    V7_SABRA.hash,
  );
});

test('stored version-7 records load without conversion, deletion or rewrite', () => {
  const raw = JSON.stringify([V7_KFIR, V7_SABRA]);
  const storage = memoryStorage({ [REC_KEY]: raw });
  const loaded = loadTimedRecords(storage, PHYSICS_VERSION);
  assert.equal(loaded.status, 'loaded');
  assert.equal(loaded.dropped, 0);
  assert.deepEqual(loaded.records, [V7_SABRA, V7_KFIR]);
  assert.equal(storage.getItem(REC_KEY), raw);
});

test('canonical rewrite of live v7 records does not bump the version', () => {
  const storage = memoryStorage({ [REC_KEY]: JSON.stringify([V7_SABRA, V7_KFIR]) });
  const loaded = loadTimedRecords(storage, PHYSICS_VERSION);
  const canonical = canonicalTimedRecordsString(loaded.records);
  assert.match(canonical, /"physicsVersion":7/);
  assert.doesNotMatch(canonical, /"physicsVersion":(?:6|8)/);
  assert.equal(JSON.parse(canonical).every(row => row.physicsVersion === 7), true);
});

test('older physics versions are dropped, never converted into version 7', async () => {
  const stale = { ...V7_SABRA, physicsVersion: 6, hash: hashTimedRecord({ ...V7_SABRA, physicsVersion: 6 }) };
  const storage = memoryStorage({ [REC_KEY]: JSON.stringify([stale, V7_KFIR]) });
  const loaded = loadTimedRecords(storage, PHYSICS_VERSION);
  assert.equal(loaded.status, 'loaded');
  assert.equal(loaded.dropped, 1);
  assert.deepEqual(loaded.records, [V7_KFIR]);
  const saved = await persistTimedRecord(V7_SABRA, storage, PHYSICS_VERSION);
  assert.equal(saved.status, 'saved');
  assert.equal(saved.records.every(row => row.physicsVersion === 7), true);
  assert.equal(JSON.parse(storage.getItem(REC_KEY)).some(row => row.physicsVersion === 6), false);
});
