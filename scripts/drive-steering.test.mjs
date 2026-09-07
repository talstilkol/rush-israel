import assert from 'node:assert/strict';
import { test } from 'node:test';
import { measureForwardSteering } from './drive-steering.mjs';

// Harness contract fixtures, not actual vehicle/keyboard evidence.
function controls(change = {}) {
  const state = { speed: 12, yaw: Math.PI - 0.02, damage: 0, on: true, airborne: false, mix: 0, steer: 0, resets: 0, ticks: 0, keys: [] };
  const t = {
    resetStart() { Object.assign(state, { speed: 12, yaw: Math.PI - 0.02, steer: 0, ticks: 0 }); state.resets++; },
    skipCountdown() {}, setDamage(v) { state.damage = v; }, setSteer(v) { state.steer = v; }, setThrottle(v) { state.throttle = v; }, setKeys(v) { state.keys = v; },
    getSpeed: () => state.speed, getYaw: () => state.yaw, getDamage: () => state.damage, getOnTrack: () => state.on, getAirborne: () => state.airborne, getKinMix: () => state.mix,
    advanceTime() { state.ticks++; state.yaw = Math.atan2(Math.sin(state.yaw + state.steer * 0.02), Math.cos(state.yaw + state.steer * 0.02)); change.tick?.(state); },
  };
  change.setup?.(state, t); return { state, t };
}
function withControls(change, run) {
  const { t, state } = controls(change), previous = globalThis.__controlsTest; globalThis.__controlsTest = t;
  try { return run(state); } finally { if (previous === undefined) delete globalThis.__controlsTest; else globalThis.__controlsTest = previous; }
}
test('left and right use independent starts and retain the positive angular threshold', () => withControls({}, s => {
  assert.ok(measureForwardSteering(1).delta > 0.03); assert.ok(measureForwardSteering(-1).delta < -0.03); assert.equal(s.resets, 2);
}));
test('the yaw response is wrapped at the pi boundary', () => withControls({}, () => assert.ok(Math.abs(measureForwardSteering(1).delta - 0.24) < 1e-10)));
test('all12 samples must remain in the forward dynamic regime', () => withControls({}, () => { const r=measureForwardSteering(-1);assert.equal(r.samples.length,12);assert.equal(r.minSpeed,12); }));
test('a reversed car cannot provide a passing right-steering measurement', () => withControls({ tick: s => { s.speed=-1; } }, () => assert.throws(() => measureForwardSteering(-1), /forward dynamic/)));
test('slow motion cannot provide a passing steering measurement', () => withControls({ tick: s => { s.speed=1; } }, () => assert.throws(() => measureForwardSteering(1), /forward dynamic/)));
test('a collision invalidates the isolated direction measurement', () => withControls({ tick: s => { s.damage=.03; } }, () => assert.throws(() => measureForwardSteering(1), /clean road/)));
test('leaving the track invalidates the direction measurement', () => withControls({ tick: s => { s.on=false; } }, () => assert.throws(() => measureForwardSteering(1), /clean road/)));
test('airborne or nonfinite samples cannot be used as steering evidence', () => {
  for (const mutate of [s => {s.airborne=true;}, s => {s.yaw=NaN;}]) withControls({tick:mutate},()=>assert.throws(()=>measureForwardSteering(1)));
});
test('wrong direction still fails rather than being waived after reset', () => withControls({tick:s=>{s.yaw-=s.steer*.04;}},()=>assert.throws(()=>measureForwardSteering(1),/direction response/)));
test('probe failure releases forced input overrides', () => withControls({tick:s=>{s.on=false;}},s=>{assert.throws(()=>measureForwardSteering(1));assert.equal(s.steer,0);assert.equal(s.throttle,0);assert.deepEqual(s.keys,[]);}));
test('invalid direction and missing controls fail before producing evidence', () => {
  assert.throws(()=>measureForwardSteering(0),/direction/);assert.throws(()=>measureForwardSteering(1),/controls unavailable/);
});
test('bounded warmup rejects a car that never reaches the required speed', () => withControls({ setup: (s,t) => {const reset=t.resetStart;t.resetStart=()=>{reset();s.speed=0;};} }, s => {
  assert.throws(()=>measureForwardSteering(1),/never reached12/);assert.equal(s.ticks,240);
}));
