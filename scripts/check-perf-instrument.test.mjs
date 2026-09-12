import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_PERF_DIGEST_SHA256,
  canonicalPerfDigest,
  validatePerfInstrument,
} from "./check-perf-instrument.mjs";
import { percentile, sampleGpuMemory, sampleJsHeap } from "../src/game/perf-instrument/metrics.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-037 performance instrument passes and RSH-040 remains absent", () => {
  const result = validatePerfInstrument();
  assert.deepEqual(result.errors, []);
  assert.equal(result.instrumented, true);
  assert.equal(result.metrics, 6);
});

test("RSH-040 precreation fails closed", () => {
  const result = validatePerfInstrument({
    repositoryFiles: ["RSH-040-PREFLIGHT.json", "src/game/leak-cycles/cycles.ts"],
  });
  assert.match(messages(result), /RSH-040 was precreated/);
});

test("instrumentation is locked without budgets, quality profiles or a real-device baseline", () => {
  assert.equal(createHash("sha256").update(canonicalPerfDigest()).digest("hex"), EXPECTED_PERF_DIGEST_SHA256);
  const metrics = readFileSync(fromRoot("src", "game", "perf-instrument", "metrics.ts"), "utf8");
  assert.match(metrics, /export const BUDGETS_ENFORCED = false/);
  assert.match(metrics, /export const QUALITY_PROFILES_DEFINED = false/);
  assert.match(metrics, /export const REAL_DEVICE_BASELINE_ACCEPTED = false/);
  assert.match(metrics, /export const PERF_INSTRUMENT_GIS_CLAIM = false/);
  const manifest = JSON.parse(readFileSync(fromRoot("PERF-INSTRUMENT-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.budgets_enforced, false);
  assert.equal(manifest.lock.quality_profiles, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-040");
  assert.deepEqual(percentile([1, 2, 3, 4], 50), 3);
  assert.deepEqual(sampleGpuMemory({ memory: { textures: 4, geometries: 7 } }), { textures: 4, geometries: 7 });
  assert.equal(sampleJsHeap(undefined), null);
  assert.equal(sampleJsHeap({ memory: { usedJSHeapSize: 12 } }), 12);
});
