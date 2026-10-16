import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARS } from '../src/game/cars.ts';
import { TRACKS, getTrack, V1_TRACK_IDS } from '../src/game/tracks.ts';
import { buildTrack, sampleAtT } from '../src/game/spline.ts';
import { roadLaneOffset } from '../src/game/road-layout.ts';
import { ArcadeCar, aiInput } from '../src/game/vehicle.ts';
import { PHYSICS_DT, PHYSICS_HZ } from '../src/game/physics.ts';

test('actual V1 road layout keeps the Rothschild median separate from racing lanes', () => {
  for (const def of TRACKS.filter(def => V1_TRACK_IDS.includes(def.id))) {
    const track = buildTrack(def);
    if (def.id === 'rothschild') {
      assert.equal(track.medianHalfWidth, 6.2);
      for (const preferred of [-1, 0, 1]) {
        const lane = roadLaneOffset(track, preferred);
        assert.ok(Math.abs(lane) > track.medianHalfWidth + 1.4);
        assert.ok(Math.abs(lane) < track.width / 2 - 1.4);
        assert.equal(lane > 0, preferred > 0);
      }
    } else {
      assert.equal(track.medianHalfWidth, 0);
      assert.equal(roadLaneOffset(track, -2.2), -2.2);
      assert.equal(roadLaneOffset(track, 0), 0);
    }
  }
});

// Real production geometry, vehicle definitions and controls. No world colliders
// or renderer: this isolates the unintended steering force, not whole-race safety.
for (const definition of CARS) for (const side of [-1, 1]) for (const follow of [false, true]) {
  test(`${definition.id}: ${side < 0 ? 'left' : 'right'} carriageway survives eight seconds of ${follow ? 'AI input' : 'straight acceleration'}`, () => {
    const track = buildTrack(getTrack('rothschild'));
    const car = new ArcadeCar(definition, definition.nameEn);
    car.aiOffset = roadLaneOffset(track, side);
    car.spawn(track, 0.08, car.aiOffset);
    let minimumClearance = Infinity;
    for (let tick = 0; tick < PHYSICS_HZ * 8; tick++) {
      car.step(PHYSICS_DT, follow ? aiInput(car, track) : { steer: 0, throttle: 1, brake: 0, drift: false, nitro: false }, track, true);
      const road = sampleAtT(track.samples, car.progress);
      const lateral = (car.x - road.x) * road.rx + (car.z - road.z) * road.rz;
      assert.equal(Math.sign(lateral), side, 'steering assistance crossed the central island');
      minimumClearance = Math.min(minimumClearance, Math.abs(lateral) - track.medianHalfWidth);
      assert.ok([car.x, car.y, car.z, car.speed].every(Number.isFinite));
    }
    assert.ok(minimumClearance > 1.4, `car entered the landscaped median: clearance=${minimumClearance}`);
    assert.ok(car.speed > 15, 'a stopped car does not establish lane keeping');
  });
}
