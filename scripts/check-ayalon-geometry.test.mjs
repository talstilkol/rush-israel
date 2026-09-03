import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_CONTROL_POINT_SHA256,
  canonicalControlPointDigest,
  liveControlPoints,
  validateAyalonGeometry,
} from "./check-ayalon-geometry.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-026 Ayalon geometry lock passes under the RSH-029 overlay and RSH-034 remains absent", () => {
  const result = validateAyalonGeometry();
  assert.deepEqual(result.errors, []);
  assert.equal(result.trackId, "ayalon");
  assert.equal(result.width, 28);
  assert.equal(result.lanes, 8);
  assert.equal(result.pointCount, 27);
});

test("RSH-034 precreation fails closed", () => {
  const result = validateAyalonGeometry({
    repositoryFiles: ["RSH-034-PREFLIGHT.json", "src/game/ayalon-lock/geometry.ts"],
  });
  assert.match(messages(result), /RSH-034 was precreated/);
});

test("live spline stays 27 samples of width 28 / 8 lanes", () => {
  const points = liveControlPoints();
  assert.equal(points.length, 27);
  assert.equal(points[0].x, points[points.length - 1].x);
  const digest = canonicalControlPointDigest(points);
  assert.equal(createHash("sha256").update(digest).digest("hex"), EXPECTED_CONTROL_POINT_SHA256);
  const track = readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8");
  assert.match(track, /width: 28/);
  assert.match(track, /for \(let lat = 32\.052; lat <= 32\.106; lat \+= 0\.002\)/);
  const world = readFileSync(fromRoot("src", "game", "world.ts"), "utf8");
  assert.match(world, /if \(def\.id === "ayalon"\) return 8;/);
  assert.match(world, /built\.width \+ 18/);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-GEOMETRY-MANIFEST.json"), "utf8"));
  assert.equal(manifest.geometry.gis_claim, false);
  assert.equal(manifest.geometry.owner_freeze, false);
  assert.equal(manifest.geometry.opposite_driveable, false);
});
