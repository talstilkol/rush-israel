import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { readFileSync } from 'node:fs';
import { probeAirbornePhysics } from './airborne-clock.mjs';

function fixture(edit = () => {}) {
  let tick = 0, y = 1, call = 0;
  let airborne = false, onTrack = true;
  const inputs = [];
  const t = {
    getTick: () => tick, getPhysicsHz: () => 120,
    getX: () => 0, getY: () => y, getZ: () => 0, getYaw: () => 0, getSpeed: () => 14,
    getAirborne: () => airborne, getOnTrack: () => onTrack,
    getRamps: () => [{ he: 'HaShalom', x: 0, z: 0, sx: 1, sz: 0, len: 40, y0: 0, y1: 8 }],
    resetStart() { y = 1; airborne = false; onTrack = true; }, skipCountdown() {},
    teleport(_x, _z, _yaw, nextY) { y = nextY; airborne = false; },
    setThrottle: value => inputs.push(['throttle', value]),
    setSteer: value => inputs.push(['steer', value]),
    setKeys: value => inputs.push(['keys', value]),
    advanceTime(ms) {
      call++;
      tick += Math.floor(ms / (1000 / 120));
      if (call === 3) { y -= 0.02625; airborne = true; }
      if (call === 4) { y = 1; airborne = false; }
      const state = { tick, y, airborne, onTrack };
      edit(state, call);
      ({ tick, y, airborne, onTrack } = state);
    },
  };
  return { t, inputs };
}
function rejected(edit, pattern) {
  const { t, inputs } = fixture(edit);
  const result = probeAirbornePhysics(t);
  assert.equal(result.ok, false); assert.match(result.error, pattern);
  assert.deepEqual(inputs.slice(-3), [['throttle', 0], ['steer', 0], ['keys', []]]);
  return result;
}
test('airborne probe measures exactly 113 falling physics steps and retains all phases', () => {
  const { t } = fixture(); const r = probeAirbornePhysics(t);
  assert.equal(r.ok, true); assert.equal(r.elapsedPhysicsSteps, 113);
  assert.equal(r.elapsedPhysicsSeconds, 113 / 120);
  assert.deepEqual(Object.keys(r.phases), ['ramp', 'settled', 'start', 'mid', 'land']);
  assert.equal(r.phases.ramp.actualSteps, 26); assert.equal(r.phases.settled.actualSteps, 9);
  assert.equal(r.phases.mid.actualSteps, 6); assert.equal(r.phases.land.actualSteps, 107);
});
test('probe serializes without closures into an isolated browser realm', () => {
  const { t } = fixture();
  const r = runInNewContext(`(${probeAirbornePhysics.toString()})()`, { __controlsTest: t });
  assert.equal(r.ok, true); assert.equal(r.elapsedPhysicsSteps, 113);
});
test('missing QA hook fails rather than skipping', () => assert.match(probeAirbornePhysics({}).error, /missing airborne control/));
test('wrong physics rate fails rather than relaxing time budget', () => {
  const { t } = fixture(); t.getPhysicsHz = () => 60;
  assert.match(probeAirbornePhysics(t).error, /120 Hz/);
});
test('missing intended ramp fails', () => {
  const { t } = fixture(); t.getRamps = () => [];
  assert.match(probeAirbornePhysics(t).error, /HaShalom/);
});
test('malformed ramp inventory fails', () => {
  const { t } = fixture(); t.getRamps = () => null;
  assert.match(probeAirbornePhysics(t).error, /inventory/);
});
test('nonfinite ramp geometry fails', () => {
  const { t } = fixture(); t.getRamps = () => [{ he: 'HaShalom', y0: 0, y1: 8, len: NaN }];
  assert.match(probeAirbornePhysics(t).error, /valid HaShalom/);
});
test('frozen clock cannot report a passing landing', () => rejected((s, n) => { if (n === 4) s.tick -= 107; }, /tick advance/));
test('extra clock steps cannot buy a longer landing allowance', () => rejected((s, n) => { if (n === 4) s.tick++; }, /tick advance/));
test('invalid snapshot is rejected', () => rejected((s, n) => { if (n === 3) s.y = NaN; }, /invalid airborne/));
test('ramp contact becoming airborne fails', () => rejected((s, n) => { if (n === 1) s.airborne = true; }, /ramp set airborne/));
test('instant downward attachment fails', () => rejected((s, n) => { if (n === 3) { s.airborne = false; s.y = 1; } }, /did not go airborne/));
test('early altitude clamping fails even with airborne flag set', () => rejected((s, n) => { if (n === 3) s.y -= 1; }, /gravity/));
test('stuck airborne fails within original physics budget', () => rejected((s, n) => { if (n === 4) s.airborne = true; }, /stuck airborne/));
test('landing off the route fails', () => rejected((s, n) => { if (n === 4) s.onTrack = false; }, /fell off Ayalon/));
test('false landing flag at unchanged height fails', () => rejected((s, n) => { if (n === 4) s.y = 3.2; }, /did not descend/));
test('nonboolean airborne evidence fails', () => rejected((s, n) => { if (n === 4) s.airborne = 0; }, /invalid airborne/));
test('browser runner retains three real trials, errors and cleanup instead of wall-time assertions', () => {
  const source = readFileSync(new URL('./airborne-smoke.mjs', import.meta.url), 'utf8');
  assert.match(source, /trial <= 3/); assert.match(source, /page\.evaluate\(probeAirbornePhysics\)/);
  assert.match(source, /if \(!result\.ok\) throw/); assert.match(source, /await browser\?\.close\(\)/);
  assert.match(source, /airborne-smoke\/results\.json/); assert.doesNotMatch(source, /waitForTimeout/);
});
