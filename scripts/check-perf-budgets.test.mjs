import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_BUDGET_DIGEST_SHA256,
  EXPECTED_STREAM_FLAG_SHA256,
  canonicalBudgetDigest,
  validatePerfBudgets,
} from "./check-perf-budgets.mjs";
import { CACHE_MAX_AGE_S, DRAW_CALL_TARGET, STREAMING_MUSIC } from "../src/game/perf-budgets/budgets.ts";
import { MESH_STREAMING as LIVE_MESH_STREAMING } from "../src/game/stream-flag.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-039 budget lock passes and RSH-043 remains absent", () => {
  const result = validatePerfBudgets();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
  assert.equal(result.cacheMaxAge, 31536000);
});

test("RSH-043 precreation fails closed", () => {
  const result = validatePerfBudgets({
    repositoryFiles: ["RSH-043-PREFLIGHT.json", "src/game/device-matrix/matrix.ts", "scripts/check-device-matrix.mjs"],
  });
  assert.match(messages(result), /RSH-043 was precreated/);
});

test("live stream-flag MESH_STREAMING stays false and hashed", () => {
  const source = readFileSync(fromRoot("src", "game", "stream-flag.ts"), "utf8");
  assert.match(source, /export const MESH_STREAMING = false/);
  assert.equal(createHash("sha256").update(source).digest("hex"), EXPECTED_STREAM_FLAG_SHA256);
  assert.equal(LIVE_MESH_STREAMING, false);
  const flipped = validatePerfBudgets({
    streamFlagSource: "export const MESH_STREAMING = true;\n",
  });
  assert.match(messages(flipped), /stream-flag/);
});

test("P2-09 stays OPEN without a JS/asset byte-size check", () => {
  const result = validatePerfBudgets({
    findingsSource: "| P1-13 | P1 | **OPEN** |\n| P2-09 | P2 | **CLOSED** | No bundle or asset budget is enforced | overclaim | RSH-039 |\n",
  });
  assert.match(messages(result), /P2-09 must stay OPEN/);
});

test("budgets are locked without leak cycles or a real-device baseline", () => {
  assert.equal(createHash("sha256").update(canonicalBudgetDigest()).digest("hex"), EXPECTED_BUDGET_DIGEST_SHA256);
  const budgets = readFileSync(fromRoot("src", "game", "perf-budgets", "budgets.ts"), "utf8");
  assert.match(budgets, /export const BUDGETS_DEFINED = true/);
  assert.match(budgets, /export const LEAK_CYCLES_ENFORCED = false/);
  assert.match(budgets, /export const REAL_DEVICE_BASELINE_ACCEPTED = false/);
  assert.match(budgets, /export const PERF_BUDGETS_GIS_CLAIM = false/);
  const manifest = JSON.parse(readFileSync(fromRoot("PERF-BUDGETS-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.leak_cycles_enforced, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-043");
  assert.equal(CACHE_MAX_AGE_S, 31536000);
  assert.equal(DRAW_CALL_TARGET, 80);
  assert.equal(STREAMING_MUSIC, false);
});
