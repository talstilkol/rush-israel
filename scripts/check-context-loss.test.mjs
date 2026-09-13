import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_CONTEXT_DIGEST_SHA256,
  canonicalContextDigest,
  validateContextLoss,
} from "./check-context-loss.mjs";
import {
  CONTEXT_LOSS_CYCLES,
  CONTEXT_LOSS_ENFORCED,
  SOAK_ENFORCED,
  runContextLossCycles,
} from "../src/game/context-loss/restore.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-041 context-loss lock passes and RSH-042 remains absent", () => {
  const result = validateContextLoss();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
  assert.equal(result.cycles, 8);
});

test("RSH-042 precreation fails closed", () => {
  const result = validateContextLoss({
    repositoryFiles: ["RSH-042-PREFLIGHT.json", "src/game/thirty-soak/soak.ts", "scripts/check-thirty-soak.mjs"],
  });
  assert.match(messages(result), /RSH-042 was precreated/);
});

test("eight context-loss cycles remount the race without save-data loss", () => {
  const { host, session, reports } = runContextLossCycles({
    cash: 1200,
    stars: 7,
    records: [{ trackId: "ayalon", time: 91.2 }],
    raceKey: 3,
  });
  assert.equal(reports.length, CONTEXT_LOSS_CYCLES);
  assert.equal(host.restoreCount, 8);
  assert.equal(host.skippedFrames, 8);
  assert.equal(host.glLost, false);
  assert.equal(session.raceKey, 11);
  assert.equal(session.cash, 1200);
  assert.equal(session.stars, 7);
  assert.deepEqual(session.records, [{ trackId: "ayalon", time: 91.2 }]);
  for (const report of reports) {
    assert.equal(report.prevented, true);
    assert.equal(report.skipped, true);
    assert.equal(report.glLostAfterRestore, false);
    assert.equal(report.cashUnchanged, true);
    assert.equal(report.starsUnchanged, true);
    assert.equal(report.recordsUnchanged, true);
  }
});

test("context-loss is locked without soak or a real-device baseline", () => {
  assert.equal(createHash("sha256").update(canonicalContextDigest()).digest("hex"), EXPECTED_CONTEXT_DIGEST_SHA256);
  const restore = readFileSync(fromRoot("src", "game", "context-loss", "restore.ts"), "utf8");
  assert.match(restore, /export const CONTEXT_LOSS_DEFINED = true/);
  assert.match(restore, /export const CONTEXT_LOSS_ENFORCED = true/);
  assert.match(restore, /export const SOAK_ENFORCED = false/);
  assert.match(restore, /export const REAL_DEVICE_BASELINE_ACCEPTED = false/);
  assert.match(restore, /export const CONTEXT_LOSS_GIS_CLAIM = false/);
  const manifest = JSON.parse(readFileSync(fromRoot("CONTEXT-LOSS-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.context_loss_enforced, true);
  assert.equal(manifest.lock.soak_enforced, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-042");
  assert.equal(CONTEXT_LOSS_CYCLES, 8);
  assert.equal(CONTEXT_LOSS_ENFORCED, true);
  assert.equal(SOAK_ENFORCED, false);
});
