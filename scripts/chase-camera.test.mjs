import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { validateEngineAdapters } from "./check-engine-adapters.mjs";
import { validateResourceOwnership } from "./check-resource-ownership.mjs";
import { fromRoot } from "./project-root.mjs";
import {
  ACCEPTED_RENDERING_ADAPTER_SHA256,
  DRIFTED_CHASE_FOLLOW_BASE,
  DRIFTED_CHASE_FOLLOW_CLAMP,
  DRIFTED_CHASE_HEIGHT,
  GOLDEN_ATTRIBUTION_CAMERA_DY,
  GOLDEN_ATTRIBUTION_CAMERA_DZ,
  LOCKED_CHASE_FOLLOW_BASE,
  LOCKED_CHASE_FOLLOW_CLAMP,
  LOCKED_CHASE_HEIGHT,
  chaseFollowDistance,
  driftedChaseFollowDistance,
  stripRsh036Overlay,
} from "./rsh036-overlay.mjs";

const adapterPath = fromRoot("src", "game", "engine", "rendering-adapter.ts");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const adapterSource = () => readFileSync(adapterPath, "utf8");

test("rest chase lock is 7.4 follow and 1.92 height", () => {
  assert.equal(chaseFollowDistance(0), LOCKED_CHASE_FOLLOW_BASE);
  assert.equal(LOCKED_CHASE_HEIGHT, 1.92);
  assert.equal(LOCKED_CHASE_FOLLOW_CLAMP, 2.2);
});

test("the drifted 9.2/2.28 rest pose is 1.8 further and 0.36 higher than the lock", () => {
  assert.equal(driftedChaseFollowDistance(0), 9.2);
  assert.equal(chaseFollowDistance(0), 7.4);
  assert.equal(DRIFTED_CHASE_FOLLOW_BASE, 9.2);
  assert.equal(LOCKED_CHASE_FOLLOW_BASE, 7.4);
  assert.equal(DRIFTED_CHASE_HEIGHT, 2.28);
  assert.equal(LOCKED_CHASE_HEIGHT, 1.92);
  assert.equal(GOLDEN_ATTRIBUTION_CAMERA_DY, 0.36);
  assert.equal(GOLDEN_ATTRIBUTION_CAMERA_DZ, -1.8);
  assert.ok(Math.abs(DRIFTED_CHASE_HEIGHT - LOCKED_CHASE_HEIGHT - 0.36) < 1e-12);
  assert.ok(Math.abs(LOCKED_CHASE_FOLLOW_BASE - DRIFTED_CHASE_FOLLOW_BASE + 1.8) < 1e-12);
  assert.equal(DRIFTED_CHASE_FOLLOW_CLAMP, 2.6);
});

test("high speed uses the locked 2.2 clamp, not the drifted 2.6 clamp", () => {
  assert.equal(chaseFollowDistance(100), 7.4 + 2.2);
  assert.equal(driftedChaseFollowDistance(100), 9.2 + 2.6);
});

test("live snapCamera uses the locked rest recipe, not the drifted 9.2/2.28 pair", () => {
  const source = adapterSource();
  assert.match(source, /RSH-036-OVERLAY-BEGIN:chase-rest-geometry/);
  assert.match(source, /let follow = 7\.4 \+ clamp\(Math\.abs\(p\.speed\) \/ 22, 0, 2\.2\);/);
  assert.match(source, /let height = 1\.92;/);
  assert.doesNotMatch(source, /let follow = 9\.2 \+ clamp\(Math\.abs\(p\.speed\) \/ 22, 0, 2\.6\);/);
  assert.doesNotMatch(source, /let height = 2\.28;/);
});

test("stripping the overlay restores accepted RSH-017/RSH-019 adapter bytes", () => {
  const stripped = stripRsh036Overlay("src/game/engine/rendering-adapter.ts", adapterSource());
  assert.equal(sha256(stripped), ACCEPTED_RENDERING_ADAPTER_SHA256);
  assert.match(stripped, /let follow = 9\.2 \+ clamp\(Math\.abs\(p\.speed\) \/ 22, 0, 2\.6\);/);
  assert.match(stripped, /let height = 2\.28;/);
  assert.doesNotMatch(stripped, /RSH-036-OVERLAY/);
});

test("missing or duplicated chase overlay fails closed", () => {
  assert.throws(() => stripRsh036Overlay("src/game/engine/rendering-adapter.ts", "export const x = 1;\n"));
  const duplicated = adapterSource() + adapterSource().match(/^[ \t]*\/\/ RSH-036-OVERLAY-BEGIN:chase-rest-geometry[\s\S]*?RSH-036-OVERLAY-END:chase-rest-geometry\n/m)[0];
  assert.throws(() => stripRsh036Overlay("src/game/engine/rendering-adapter.ts", duplicated));
});

test("unrelated adapter paths pass through without mutation", () => {
  const source = "export function frame() {}\n";
  assert.equal(stripRsh036Overlay("src/game/engine/loop-adapter.ts", source), source);
});

test("engine adapter and resource-ownership identities still pass under the overlay", () => {
  assert.deepEqual(validateEngineAdapters().errors, []);
  assert.deepEqual(validateResourceOwnership().errors, []);
});

test("original golden capture authority, images and thresholds stay unchanged", () => {
  const source = readFileSync(fromRoot("scripts", "pixel-golden.mjs"), "utf8");
  assert.match(source, /threshold: 0\.12/);
  assert.match(source, /pct > 0\.08/);
  assert.match(source, /if \(process.env.UPDATE_GOLDEN === "1"\) throw/);
  assert.doesNotMatch(source, /copyFile|\.find\([\s\S]*?\?\.click/);
  for (const name of ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"]) {
    const png = readFileSync(fromRoot("golden-baseline", name));
    assert.ok(png.length > 0);
  }
});
