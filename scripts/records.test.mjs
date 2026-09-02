import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { PHYSICS_VERSION } from "../src/game/physics.ts";
import {
  REC_KEY,
  RECORD_LIMIT,
  RECORD_LIMIT_PER_TRACK_CAR,
  canonicalTimedRecordsString,
  decodeTimedRecords,
  hashTimedRecord,
  isLiveRecord,
  persistTimedRecord,
  recordPayload,
  sanitizeTimedRecords,
  sha256hex,
  sha256hexSync,
  writeRecords,
} from "../src/game/records.ts";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

function rec(t, extras = {}) {
  const base = { t, trackId: "ayalon", carId: "sabra", physicsVersion: PHYSICS_VERSION, ...extras };
  return { ...base, hash: extras.hash ?? hashTimedRecord(base) };
}

test("old physicsVersion is rejected", () => {
  const item = { t: 12.3, trackId: "ayalon", carId: "sabra", physicsVersion: PHYSICS_VERSION - 1, hash: "x" };
  assert.equal(isLiveRecord(item, PHYSICS_VERSION), false);
});

test("current physicsVersion is kept", () => {
  const item = rec(12.3);
  assert.equal(isLiveRecord(item, PHYSICS_VERSION), true);
});

test("payload + sha256", async () => {
  const p = recordPayload("ayalon", "sabra", 12.3, PHYSICS_VERSION);
  assert.equal(p, `ayalon|sabra|12.3|${PHYSICS_VERSION}`);
  const hex = await sha256hex(p);
  const node = createHash("sha256").update(p).digest("hex");
  assert.equal(hex, node);
  assert.equal(sha256hexSync(p), node);
  assert.equal(hashTimedRecord({ trackId: "ayalon", carId: "sabra", t: 12.3, physicsVersion: PHYSICS_VERSION }), node);
});

test("writeRecords replaces the whole key", () => {
  const storage = memoryStorage();
  writeRecords([rec(12)], storage);
  writeRecords([rec(19, { carId: "kfir" })], storage);
  const live = JSON.parse(storage.values.get(REC_KEY));
  assert.equal(live.length, 1);
  assert.equal(live[0].t, 19);
  assert.equal(live[0].carId, "kfir");
});

test("read path drops malformed, unverified and stale records", () => {
  const good = rec(44);
  const badHash = { ...good, hash: "0".repeat(64) };
  const stale = rec(45, { physicsVersion: PHYSICS_VERSION - 1 });
  const raw = JSON.stringify([good, badHash, stale, { t: 1 }, "nope"]);
  const decoded = decodeTimedRecords(raw);
  assert.equal(decoded.length, 3);
  const sanitized = sanitizeTimedRecords(decoded, PHYSICS_VERSION);
  assert.equal(sanitized.records.length, 1);
  assert.equal(sanitized.records[0].t, 44);
  assert.ok(sanitized.dropped >= 1);
});

test("duplicate records are collapsed and the per-car cap is enforced", () => {
  const first = rec(40);
  const same = rec(40);
  const extras = Array.from({ length: RECORD_LIMIT_PER_TRACK_CAR + 5 }, (_, i) => rec(50 + i));
  const sanitized = sanitizeTimedRecords([first, same, ...extras], PHYSICS_VERSION);
  assert.equal(sanitized.records.length, RECORD_LIMIT_PER_TRACK_CAR);
  assert.equal(sanitized.records[0].t, 40);
});

test("serial persist verifies hashes, rejects duplicates and survives quota", async () => {
  const storage = memoryStorage();
  const a = rec(33);
  const b = rec(34, { carId: "kfir" });
  const first = await persistTimedRecord(a, storage, PHYSICS_VERSION);
  const second = await persistTimedRecord(b, storage, PHYSICS_VERSION);
  const dup = await persistTimedRecord(a, storage, PHYSICS_VERSION);
  assert.equal(first.status, "saved");
  assert.equal(second.status, "saved");
  assert.equal(dup.status, "duplicate");
  assert.equal(JSON.parse(storage.values.get(REC_KEY)).length, 2);

  const failing = {
    getItem: storage.getItem.bind(storage),
    setItem() { throw new Error("quota"); },
  };
  const failed = await persistTimedRecord(rec(90), failing, PHYSICS_VERSION);
  assert.equal(failed.status, "write-failed");
  assert.equal(JSON.parse(storage.values.get(REC_KEY)).length, 2);
});

test("concurrent persist calls are serialised and do not drop the earlier write", async () => {
  const storage = memoryStorage();
  const writes = await Promise.all([
    persistTimedRecord(rec(61), storage, PHYSICS_VERSION),
    persistTimedRecord(rec(62, { carId: "kfir" }), storage, PHYSICS_VERSION),
    persistTimedRecord(rec(63, { carId: "carmel" }), storage, PHYSICS_VERSION),
  ]);
  assert.deepEqual(writes.map((item) => item.status), ["saved", "saved", "saved"]);
  assert.equal(JSON.parse(storage.values.get(REC_KEY)).length, 3);
});

test("canonical serialization is byte-stable", () => {
  const records = [rec(80, { carId: "kfir" }), rec(70)];
  assert.equal(canonicalTimedRecordsString(records), canonicalTimedRecordsString(records.slice().reverse()));
  assert.equal(RECORD_LIMIT, 200);
});
