import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_LEAK_DIGEST_SHA256,
  canonicalLeakDigest,
  validateLeakCycles,
} from "./check-leak-cycles.mjs";
import {
  CONTEXT_LOSS_ENFORCED,
  ENTER_EXIT_CYCLES,
  GEOMETRY_DELTA_MAX,
  REQUIRED_CI_CYCLES,
  SOAK_ENFORCED,
  TEXTURE_DELTA_MAX,
  runEnterExitCycles,
} from "../src/game/leak-cycles/cycles.ts";
import { ResourceRegistry } from "../src/rendering/ResourceRegistry.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-040 leak-cycle lock passes and RSH-043 remains absent", () => {
  const result = validateLeakCycles();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
  assert.equal(result.cycles, 20);
});

test("RSH-043 precreation fails closed", () => {
  const result = validateLeakCycles({
    repositoryFiles: ["RSH-043-PREFLIGHT.json", "src/game/device-matrix/matrix.ts", "scripts/check-device-matrix.mjs"],
  });
  assert.match(messages(result), /RSH-043 was precreated/);
});

test("20 ResourceRegistry enter-exit cycles leave no outstanding leases", () => {
  const reports = runEnterExitCycles(() => new ResourceRegistry());
  assert.equal(reports.length, ENTER_EXIT_CYCLES);
  for (const report of reports) {
    assert.equal(report.first.alreadyDisposed, false);
    assert.equal(report.first.outstanding, 0);
    assert.equal(report.first.disposed, 3);
    assert.equal(report.second.alreadyDisposed, true);
    assert.equal(report.second.disposed, 0);
    assert.equal(report.second.outstanding, 0);
  }
});

test("leak cycles are locked without context-loss, soak or a real-device baseline", () => {
  assert.equal(createHash("sha256").update(canonicalLeakDigest()).digest("hex"), EXPECTED_LEAK_DIGEST_SHA256);
  const cycles = readFileSync(fromRoot("src", "game", "leak-cycles", "cycles.ts"), "utf8");
  assert.match(cycles, /export const LEAK_CYCLES_DEFINED = true/);
  assert.match(cycles, /export const CONTEXT_LOSS_ENFORCED = false/);
  assert.match(cycles, /export const SOAK_ENFORCED = false/);
  assert.match(cycles, /export const REAL_DEVICE_BASELINE_ACCEPTED = false/);
  assert.match(cycles, /export const LEAK_CYCLES_GIS_CLAIM = false/);
  const manifest = JSON.parse(readFileSync(fromRoot("LEAK-CYCLES-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.context_loss_enforced, false);
  assert.equal(manifest.lock.soak_enforced, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-043");
  assert.equal(ENTER_EXIT_CYCLES, 20);
  assert.equal(REQUIRED_CI_CYCLES, 2);
  assert.equal(TEXTURE_DELTA_MAX, 2);
  assert.equal(GEOMETRY_DELTA_MAX, 2);
  assert.equal(CONTEXT_LOSS_ENFORCED, false);
  assert.equal(SOAK_ENFORCED, false);
});
