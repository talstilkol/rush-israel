import assert from "node:assert/strict";
import { test } from "node:test";
import { beginRaceStartup } from "../src/game/race-startup.ts";
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function harness(ready = Promise.resolve()) {
  const calls = { prepare: 0, create: 0, dispose: 0, ready: 0, errors: [] };
  const resource = { ready, dispose() { calls.dispose++; } };
  const options = {
    async prepare() { calls.prepare++; return () => { calls.create++; return resource; }; },
    onReady() { calls.ready++; }, onError(error) { calls.errors.push(error); },
  };
  return { calls, resource, options };
}
test("startup import rejection is a handled failure, not an unhandled promise", async () => {
  const h = harness();
  h.options.prepare = async () => { throw new Error("injected import failure"); };
  const attempt = beginRaceStartup(h.options);
  assert.equal((await attempt.result).status, "failed");
  assert.equal(h.calls.errors.length, 1);
  assert.equal(h.calls.create, 0);
  assert.equal(h.calls.ready, 0);
});
test("retry invokes a fresh loader after its previous rejection and creates one engine", async () => {
  const h = harness();
  let loads = 0;
  const prepare = h.options.prepare;
  h.options.prepare = async () => { if (++loads === 1) throw new Error("offline"); return prepare(); };
  assert.equal((await beginRaceStartup(h.options).result).status, "failed");
  const retry = beginRaceStartup(h.options);
  assert.equal((await retry.result).status, "ready");
  assert.equal(loads, 2);
  assert.equal(h.calls.create, 1);
  assert.equal(h.calls.ready, 1);
  retry.cancel();
  retry.cancel();
  assert.equal(h.calls.dispose, 1);
});
test("synchronous import preparation and constructor failures are handled", async () => {
  for (const prepare of [() => { throw new Error("prepare"); }, async () => () => { throw new Error("constructor"); }]) {
    const h = harness();
    const attempt = beginRaceStartup({ ...h.options, prepare });
    assert.equal((await attempt.result).status, "failed");
    assert.equal(h.calls.errors.length, 1);
    assert.equal(h.calls.ready, 0);
  }
});
test("engine readiness rejection disposes partial resources exactly once", async () => {
  const pending = deferred();
  const h = harness(pending.promise);
  const attempt = beginRaceStartup(h.options);
  await Promise.resolve();
  pending.reject(new Error("texture failed"));
  assert.equal((await attempt.result).status, "failed");
  attempt.cancel();
  assert.equal(h.calls.dispose, 1);
  assert.equal(h.calls.errors.length, 1);
});
test("cancellation during module loading never creates an engine or reports a stale error", async () => {
  const pending = deferred();
  const h = harness();
  const attempt = beginRaceStartup({ ...h.options, prepare: () => pending.promise });
  attempt.cancel();
  pending.resolve(() => { h.calls.create++; return h.resource; });
  assert.equal((await attempt.result).status, "cancelled");
  assert.equal(h.calls.create, 0);
  assert.equal(h.calls.errors.length, 0);
});
test("late import rejection after cancellation is swallowed without recovery UI", async () => {
  const pending = deferred();
  const h = harness();
  const attempt = beginRaceStartup({ ...h.options, prepare: () => pending.promise });
  attempt.cancel(); pending.reject(new Error("late failure"));
  assert.equal((await attempt.result).status, "cancelled");
  assert.equal(h.calls.errors.length, 0);
});
test("cancellation while engine readies releases it once and blocks late activation", async () => {
  const pending = deferred();
  const h = harness(pending.promise);
  const attempt = beginRaceStartup(h.options);
  await Promise.resolve();
  attempt.cancel(); pending.resolve();
  assert.equal((await attempt.result).status, "cancelled");
  attempt.cancel();
  assert.equal(h.calls.dispose, 1);
  assert.equal(h.calls.ready, 0);
});
test("late ready rejection after cancellation does not double-dispose", async () => {
  const pending = deferred();
  const h = harness(pending.promise);
  const attempt = beginRaceStartup(h.options);
  await Promise.resolve();
  attempt.cancel(); pending.reject(new Error("late ready failure"));
  assert.equal((await attempt.result).status, "cancelled");
  assert.equal(h.calls.dispose, 1);
  assert.equal(h.calls.errors.length, 0);
});
test("activation failure is caught and disposes the engine", async () => {
  const h = harness();
  const attempt = beginRaceStartup({ ...h.options, onReady() { throw new Error("audio failed"); } });
  assert.equal((await attempt.result).status, "failed");
  assert.equal(h.calls.dispose, 1);
  assert.equal(h.calls.errors.length, 1);
});
test("cleanup and error-callback exceptions cannot create an unhandled rejection", async () => {
  const pending = deferred();
  const h = harness(pending.promise);
  h.resource.dispose = () => { throw new Error("cleanup failure"); };
  const attempt = beginRaceStartup({ ...h.options, onError() { throw new Error("notification failure"); } });
  await Promise.resolve(); pending.reject(new Error("ready failure"));
  const result = await attempt.result;
  assert.equal(result.status, "failed");
  assert.equal(result.cleanupError.message, "cleanup failure");
  assert.equal(result.notificationError.message, "notification failure");
});
test("StrictMode-like cleanup and re-entry activate only the latest attempt", async () => {
  const pending = deferred();
  const old = harness(pending.promise);
  const first = beginRaceStartup(old.options);
  await Promise.resolve(); first.cancel();
  const current = harness();
  const second = beginRaceStartup(current.options);
  pending.resolve();
  assert.equal((await first.result).status, "cancelled");
  assert.equal((await second.result).status, "ready");
  assert.equal(old.calls.ready, 0);
  assert.equal(old.calls.dispose, 1);
  assert.equal(current.calls.ready, 1);
  second.cancel();
  assert.equal(current.calls.dispose, 1);
});
