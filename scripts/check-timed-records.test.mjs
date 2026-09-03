import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTimedRecords } from "./check-timed-records.mjs";
import {
  RECORD_LIMIT,
  RECORD_LIMIT_PER_TRACK_CAR,
  hashTimedRecord,
  persistTimedRecord,
  sha256hexSync,
} from "../src/game/records.ts";
import { PHYSICS_VERSION } from "../src/game/physics.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-023 timed-record authority passes under the RSH-028 overlay and RSH-029 remains absent", () => {
  const result = validateTimedRecords();
  assert.deepEqual(result.errors, []);
  assert.equal(result.recordLimit, 200);
  assert.equal(result.perTrackCarLimit, 24);
  assert.equal(result.schemaVersion, 3);
});

test("RSH-029 precreation fails closed", () => {
  const result = validateTimedRecords({
    repositoryFiles: ["RSH-029-PREFLIGHT.json", "src/game/records.ts"],
  });
  assert.match(messages(result), /RSH-029 was precreated/);
});

test("hash, serial-write and limit tokens are required", () => {
  const records = readFileSync(fromRoot("src", "game", "records.ts"), "utf8");
  const save = readFileSync(fromRoot("src", "game", "save.ts"), "utf8");
  for (const token of [
    "export function sha256hexSync",
    "export function hashTimedRecord",
    "export function recordHashMatches",
    "export function persistTimedRecord",
    "let persistChain",
    "export const RECORD_LIMIT = 200",
    "export const RECORD_LIMIT_PER_TRACK_CAR = 24",
  ]) assert.ok(records.includes(token), token);
  for (const token of [
    "persistTimedRecord(rec, localStorage, PHYSICS_VERSION)",
    "loadTimedRecords(localStorage, PHYSICS_VERSION)",
    "hashTimedRecord({ t: time, trackId: id, carId, physicsVersion: PHYSICS_VERSION })",
  ]) assert.ok(save.includes(token), token);
  assert.equal(RECORD_LIMIT, 200);
  assert.equal(RECORD_LIMIT_PER_TRACK_CAR, 24);
});

test("synchronous SHA-256 matches the record digest helper", () => {
  const rec = { t: 41.25, trackId: "ayalon", carId: "sabra", physicsVersion: PHYSICS_VERSION };
  const digest = hashTimedRecord(rec);
  assert.equal(digest, sha256hexSync(`ayalon|sabra|41.25|${PHYSICS_VERSION}`));
  assert.match(digest, /^[0-9a-f]{64}$/);
});

test("serial persist still returns structured status for a rejected hash", async () => {
  const storage = {
    values: new Map(),
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; },
    setItem(key, value) { this.values.set(key, String(value)); },
  };
  const result = await persistTimedRecord({
    t: 40,
    trackId: "ayalon",
    carId: "sabra",
    physicsVersion: PHYSICS_VERSION,
    hash: "0".repeat(64),
  }, storage, PHYSICS_VERSION);
  assert.equal(result.status, "rejected");
  assert.equal(storage.values.size, 0);
});
