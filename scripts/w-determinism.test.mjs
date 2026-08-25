import assert from "node:assert/strict";
import { test } from "node:test";
import { hash01, hashStr, errorId, clamp } from "../src/game/math.ts";
import {
  absModulate,
  brakeForce,
  hydroplane,
  pacejka,
  PHYSICS_HZ,
  tcsModulate,
} from "../src/game/physics.ts";

test("hash01 is deterministic", () => {
  assert.equal(hash01(3, 7), hash01(3, 7));
  assert.notEqual(hash01(3, 7), hash01(3, 8));
});

test("errorId is stable", () => {
  assert.equal(errorId("boom"), errorId("boom"));
  assert.match(errorId("boom"), /^E-[0-9a-f]{8}$/);
});

test("hashStr is stable", () => {
  assert.equal(hashStr("ayalon|0.1500"), hashStr("ayalon|0.1500"));
});

test("brake force is monotonic in 0-1 including 82-83%", () => {
  const samples = [0, 0.5, 0.7, 0.82, 0.83, 0.9, 1];
  for (let i = 1; i < samples.length; i++) {
    assert.ok(
      brakeForce(samples[i], 10, 0.2) >= brakeForce(samples[i - 1], 10, 0.2),
      `brake ${samples[i]} < ${samples[i - 1]}`,
    );
  }
});

test("pacejka is odd and peaks near 0.12", () => {
  assert.equal(pacejka(0, 1), 0);
  assert.ok(Math.abs(pacejka(0.12, 1) + pacejka(-0.12, 1)) < 1e-9);
  assert.ok(pacejka(0.12, 1) > pacejka(0.04, 1));
  assert.ok(pacejka(0.12, 1) > pacejka(0.4, 1));
});

test("ABS reduces brake only when locked", () => {
  const open = absModulate(1, -0.05, true);
  assert.equal(open.brake, 1);
  assert.equal(open.active, false);
  const locked = absModulate(1, -0.3, true);
  assert.ok(locked.brake < 1);
  assert.equal(locked.active, true);
});

test("TCS reduces throttle on spin", () => {
  const calm = tcsModulate(1, 0.02, true);
  assert.equal(calm.throttle, 1);
  const spin = tcsModulate(1, 0.3, true);
  assert.ok(spin.throttle < 1);
  assert.equal(spin.active, true);
});

test("hydroplane only in wet high speed", () => {
  assert.equal(hydroplane(40, 0), 1);
  assert.equal(hydroplane(10, 0.4), 1);
  assert.ok(hydroplane(50, 0.4) < 1);
});

test("physics rate is 120Hz", () => {
  assert.equal(PHYSICS_HZ, 120);
});

test("clamp helper still works", () => {
  assert.equal(clamp(2, 0, 1), 1);
});
