import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARS } from '../src/game/cars.ts';
import { ArcadeCar } from '../src/game/vehicle.ts';
import { getTrack, V1_TRACK_IDS } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { PHYSICS_DT, WEATHER_SPEC } from '../src/game/physics.ts';

// Actual route geometry and actual production vehicles, not a synthetic slope.
// Compare the same physical travel direction with the nose facing either way.
// No world colliders, browser timing, vehicle measurements or human acceptance.
const coast = { steer: 0, throttle: 0, brake: 0, drift: false, nitro: false };
for (const id of V1_TRACK_IDS) {
  const track = buildTrack(getTrack(id));
  test(`${id}: spawning keeps the grade sample at the actual vehicle position`, () => {
    const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
    for (const requested of track.samples) {
      car.spawn(track, requested.t, 0);
      const supporting = track.samples[car.sampleIndex];
      assert.deepEqual([supporting.x,supporting.y,supporting.z], [car.x,car.y,car.z], `spawn t=${requested.t}`);
    }
  });
  test(`${id}: recovery replaces the old grade sample with the actual checkpoint position`, () => {
    const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
    for (let checkpoint = 0; checkpoint < track.checkpoints.length; checkpoint++) {
      car.sampleIndex = track.samples.length - 2;
      car.lastCheckpoint = checkpoint;
      car.respawn(track);
      const supporting = track.samples[car.sampleIndex];
      assert.deepEqual([supporting.x,supporting.y,supporting.z], [car.x,car.y,car.z], `checkpoint=${checkpoint}`);
    }
    car.lastCheckpoint = -1;car.progress = track.samples[3].t;
    car.sampleIndex = track.samples.length - 2;car.respawn(track);
    const supporting = track.samples[car.sampleIndex];
    assert.deepEqual([supporting.x,supporting.y,supporting.z], [car.x,car.y,car.z], 'recovery before first checkpoint');
  });
}
for (const id of ['haifa', 'hermon', 'scopus', 'ramon']) {
  const track = buildTrack(getTrack(id));
  let index = 2;
  let maxGrade = 0;
  for (let i = 2; i < track.samples.length - 3; i++) {
    const s = track.samples[i], n = track.samples[i + 1];
    const grade = (n.y - s.y) / Math.hypot(n.x - s.x, n.z - s.z);
    if (Math.abs(grade) > Math.abs(maxGrade)) { index = i; maxGrade = grade; }
  }
  assert.ok(Math.abs(maxGrade) > 0.04, `${id} must have a real slope to exercise`);
  for (const definition of CARS) for (const handling of ['arcade', 'simcade']) for (const weather of Object.keys(WEATHER_SPEC)) {
    test(`${id}/${definition.id}/${handling}/${weather}: slope force follows the nose, not route order or velocity`, () => {
      const run = (turned, speed) => {
        const car = new ArcadeCar(definition, definition.nameEn);
        car.handling = handling; car.weather = weather;
        const t = (index + 0.01) / (track.closed ? track.samples.length : track.samples.length - 1);
        car.spawn(track, t, 0);
        assert.equal(car.sampleIndex, index);
        if (turned) car.yaw += Math.PI;
        car.speed = speed;
        car.vx = -Math.sin(car.yaw) * speed;
        car.vz = -Math.cos(car.yaw) * speed;
        assert.equal(car.step(PHYSICS_DT, coast, track, true), false, 'no automatic rescue');
        assert.equal(car.damage, 0);
        assert.ok([car.x,car.y,car.z,car.speed,car.pitch].every(Number.isFinite));
        return car;
      };
      // 5m/s is below every real reverse limiter and below lane assistance onset.
      const along = run(false, 5), opposite = run(true, 5);
      const alongBackwards = run(true, -5), oppositeBackwards = run(false, -5);
      assert.ok((opposite.speed - along.speed) * Math.sign(maxGrade) > 0.01,
        `turning the nose must reverse grade effect: ${along.speed} vs ${opposite.speed}`);
      assert.ok(Math.abs(along.speed + alongBackwards.speed) < 1e-8,
        `same physical route direction must not change speed magnitude in reverse: ${along.speed} vs ${alongBackwards.speed}`);
      assert.ok(Math.abs(opposite.speed + oppositeBackwards.speed) < 1e-8,
        `opposite physical direction must also match in reverse: ${opposite.speed} vs ${oppositeBackwards.speed}`);
      assert.ok(along.pitch * Math.sign(maxGrade) < 0 && opposite.pitch * Math.sign(maxGrade) > 0,
        `body pitch must follow slope in body coordinates: ${along.pitch} vs ${opposite.pitch}`);
    });
  }
}
