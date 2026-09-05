import assert from "node:assert/strict";
import { test } from "node:test";
import { REC_KEY, canonicalTimedRecordsString, hashTimedRecord, loadTimedRecords, persistTimedRecord } from "../src/game/records.ts";
const version = 7;
function record(t = 21.5) {
  const item = { t, trackId: "ayalon", carId: "sabra", physicsVersion: version };
  return { ...item, hash: hashTimedRecord(item) };
}
function storage(initial = null) {
  let raw = initial;
  return { getItem: () => raw, setItem: (_key, next) => { raw = next; } };
}
async function withBrowserStorage(descriptor, callback) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, ...descriptor });
    await callback();
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else delete globalThis.localStorage;
  }
}

test("record read denial returns read-failed rather than an empty successful read", () => {
  const loaded = loadTimedRecords({ getItem() { throw new Error("denied"); } }, version);
  assert.equal(loaded.status, "read-failed");
  assert.equal(loaded.error, "denied");
  assert.deepEqual(loaded.records, []);
});
test("record persistence read denial does not reject or write over unread bytes", async () => {
  let writes = 0;
  const target = { getItem() { throw new Error("denied"); }, setItem() { writes++; } };
  const result = await persistTimedRecord(record(), target, version);
  assert.equal(result.status, "read-failed");
  assert.equal(writes, 0);
});
test("throwing browser storage getter is inside both public failure boundaries", async () => {
  await withBrowserStorage({ get() { throw new Error("SecurityError"); } }, async () => {
    assert.equal(loadTimedRecords(undefined, version).status, "read-failed");
    const pending = persistTimedRecord(record(), undefined, version);
    assert.ok(pending instanceof Promise);
    assert.equal((await pending).status, "read-failed");
  });
});
test("unavailable storage returns explicit failure for read and persist", async () => {
  await withBrowserStorage({ value: undefined }, async () => {
    assert.equal(loadTimedRecords(undefined, version).status, "read-failed");
    assert.equal((await persistTimedRecord(record(), undefined, version)).status, "read-failed");
  });
});
test("retry after denied read retains existing bytes and adds exactly one record", async () => {
  const first = record(35);
  const before = canonicalTimedRecordsString([first]);
  const target = storage(before);
  const get = target.getItem;
  target.getItem = () => { throw new Error("denied once"); };
  assert.equal((await persistTimedRecord(record(), target, version)).status, "read-failed");
  assert.equal(get(), before);
  target.getItem = get;
  assert.equal((await persistTimedRecord(record(), target, version)).status, "saved");
  assert.equal((await persistTimedRecord(record(), target, version)).status, "duplicate");
  assert.equal(loadTimedRecords(target, version).records.length, 2);
});
test("quota failure preserves existing data and does not poison the write queue", async () => {
  const before = canonicalTimedRecordsString([record(38)]);
  const target = storage(before);
  const set = target.setItem;
  target.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.equal((await persistTimedRecord(record(), target, version)).status, "write-failed");
  assert.equal(target.getItem(REC_KEY), before);
  target.setItem = set;
  assert.equal((await persistTimedRecord(record(), target, version)).status, "saved");
});
test("verification read failure is explicit even when the atomic write already succeeded", async () => {
  let reads = 0;
  const target = storage();
  const get = target.getItem;
  target.getItem = () => { if (++reads === 2) throw new Error("verification denied"); return get(); };
  assert.equal((await persistTimedRecord(record(), target, version)).status, "write-failed");
  // The API cannot roll back a committed storage write. Retry detects the existing record.
  assert.equal((await persistTimedRecord(record(), target, version)).status, "duplicate");
});
test("concurrent records are serialized and caller mutation cannot corrupt a queued request", async () => {
  const target = storage();
  const a = record(25);
  const first = persistTimedRecord(a, target, version);
  a.t = 999;
  const second = persistTimedRecord(record(27), target, version);
  assert.equal((await first).status, "saved");
  assert.equal((await second).status, "saved");
  assert.deepEqual(loadTimedRecords(target, version).records.map(item => item.t), [25, 27]);
});
test("invalid record is still rejected without modifying healthy storage", async () => {
  const target = storage(canonicalTimedRecordsString([record(38)]));
  const before = target.getItem(REC_KEY);
  const result = await persistTimedRecord({ ...record(), hash: "0".repeat(64) }, target, version);
  assert.equal(result.status, "rejected");
  assert.equal(target.getItem(REC_KEY), before);
});
test("healthy default browser storage is acquired once per serialized operation", async () => {
  const target = storage();
  let acquisitions = 0;
  await withBrowserStorage({ get() { acquisitions++; return target; } }, async () => {
    assert.equal((await persistTimedRecord(record(), undefined, version)).status, "saved");
    assert.equal(acquisitions, 1);
  });
});
