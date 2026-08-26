import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { PHYSICS_VERSION } from "../src/game/physics.ts";
import { isLiveRecord, recordPayload, sha256hex } from "../src/game/records.ts";

test("old physicsVersion is rejected", () => {
  const rec = { t: 12.3, trackId: "ayalon", carId: "sabra", physicsVersion: PHYSICS_VERSION - 1, hash: "x" };
  assert.equal(isLiveRecord(rec, PHYSICS_VERSION), false);
});

test("current physicsVersion is kept", () => {
  const rec = { t: 12.3, trackId: "ayalon", carId: "sabra", physicsVersion: PHYSICS_VERSION, hash: "x" };
  assert.equal(isLiveRecord(rec, PHYSICS_VERSION), true);
});

test("payload + sha256", async () => {
  const p = recordPayload("ayalon", "sabra", 12.3, 3);
  assert.equal(p, "ayalon|sabra|12.3|3");
  const hex = await sha256hex(p);
  const node = createHash("sha256").update(p).digest("hex");
  assert.equal(hex, node);
});
