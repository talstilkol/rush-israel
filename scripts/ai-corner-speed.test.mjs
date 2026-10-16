import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARS } from '../src/game/cars.ts';
import { ArcadeCar, aiInput, SURFACE_GRIP } from '../src/game/vehicle.ts';
import { getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { WEATHER_SPEC } from '../src/game/physics.ts';

// Actual tight bends and stock production cars. Controlled entry speed is a
// test condition, not a measured vehicle claim or a full-race acceptance.
for (const id of ['oldjaffa', 'hermon']) {
 const definition = getTrack(id), track = buildTrack(definition);
 for (const spec of CARS) for (const handling of ['arcade', 'simcade']) for (const weather of Object.keys(WEATHER_SPEC)) {
  test(`${id}/${spec.id}/${handling}/${weather}: brake before accelerating into a sharp real bend`, () => {
   let exercised = 0;
   const car = new ArcadeCar(spec, spec.nameEn);car.handling = handling;car.weather = weather;
   car.baseGrip = car.surfaceGrip = SURFACE_GRIP[definition.theme] ?? 1;
   for (let i = 5; i < track.samples.length - 5; i++) {
    car.spawn(track, (i + 0.1) / (track.closed ? track.samples.length : track.samples.length - 1), 0);
    car.speed = 25;car.vx = -Math.sin(car.yaw) * car.speed;car.vz = -Math.cos(car.yaw) * car.speed;
    const input = aiInput(car, track);
    // Steering saturation identifies the real sharp-bend entry. It is not a
    // fixture with a made-up track or hand-selected braking threshold.
    if (Math.abs(input.steer) < 0.99) continue;
    exercised++;
    assert.ok(input.brake > 0, `sharp bend at ${car.progress}: ${JSON.stringify(input)}`);
    assert.equal(input.throttle, 0, 'brake and full acceleration must not fight on entry');
    assert.equal(input.nitro, false);
    if (exercised === 3) break;
   }
   assert.equal(exercised, 3, 'three actual sharp-bend entries required');
  });
 }
}
