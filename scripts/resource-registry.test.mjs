import assert from "node:assert/strict";
import { test } from "node:test";
import { ResourceRegistry } from "../src/rendering/ResourceRegistry.ts";

test("ResourceRegistry ref-counts and disposes in reverse creation order", () => {
  const order = [];
  const registry = new ResourceRegistry();
  const disposeA = () => order.push("a");
  registry.retain("a", disposeA, { owner: "test", kind: "other" });
  registry.retain("a", disposeA, { owner: "test", kind: "other" });
  registry.retain("b", () => order.push("b"), { owner: "test", kind: "render-target" });
  assert.equal(registry.release("a"), false);
  assert.equal(registry.release("missing"), false);
  const report = registry.disposeAll();
  assert.deepEqual(order, ["b", "a"]);
  assert.equal(report.disposed, 2);
  assert.equal(report.outstanding, 0);
  assert.equal(registry.disposeAll().alreadyDisposed, true);
});

test("ResourceRegistry rejects split ownership for one id", () => {
  const registry = new ResourceRegistry();
  registry.retain("same", () => {}, { owner: "one", kind: "other" });
  assert.throws(
    () => registry.retain("same", () => {}, { owner: "two", kind: "other" }),
    /different disposer|different ownership/,
  );
});

test("ResourceRegistry releases late resources and continues after disposal errors", () => {
  const order = [];
  const registry = new ResourceRegistry();
  registry.retain("bad", () => {
    order.push("bad");
    throw new Error("boom");
  });
  registry.retain("good", () => order.push("good"));
  const report = registry.disposeAll();
  assert.deepEqual(order, ["good", "bad"]);
  assert.equal(report.errors, 1);
  let late = 0;
  assert.equal(registry.retain("late", () => late++), false);
  assert.equal(late, 1);
  assert.equal(registry.snapshot().state, "disposed");
});
