import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARS } from '../src/game/cars.ts';
import { ArcadeCar, aiInput, trafficInput } from '../src/game/vehicle.ts';
import { getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';

const track = buildTrack(getTrack('ayalon'));
const make = (definition, t, lateral, speed) => {
 const car = new ArcadeCar(definition, definition.nameEn);car.spawn(track, t, lateral);
 car.speed = speed;car.vx = -Math.sin(car.yaw) * speed;car.vz = -Math.cos(car.yaw) * speed;
 return car;
};
// These are controlled driving conditions on actual road geometry, not claimed
// live road measurements. The production input controllers remain under test.
for (const definition of CARS) for (const control of [aiInput, trafficInput]) {
 const drive = (car, vehicles) => control === aiInput ? control(car, track, undefined, vehicles) : control(car, track, vehicles);
 test(`${definition.id}/${control.name}: brake for an actual slower vehicle ahead`, () => {
  const follower = make(definition, .2, 0, 25);
  const ahead = make(CARS[0], .2, 0, 10);
  const fx = -Math.sin(ahead.yaw), fz = -Math.cos(ahead.yaw);
  ahead.x += fx * 12;ahead.z += fz * 12;
  const input = drive(follower, [follower, ahead]);
  assert.ok(input.brake > 0);
  assert.equal(input.throttle, 0);assert.equal(input.nitro, false);assert.equal(input.drift, false);
 });
 for (const condition of ['adjacent lane', 'separate elevation', 'behind', 'receding', 'far ahead']) {
  test(`${definition.id}/${control.name}: ${condition} must not falsely stop traffic`, () => {
   const car = make(definition, .2, 0, 25), other = make(CARS[0], .2, 0, 10);
   const fx = -Math.sin(car.yaw), fz = -Math.cos(car.yaw), rx = Math.cos(car.yaw), rz = -Math.sin(car.yaw);
   const ahead = condition === 'behind' ? -12 : condition === 'far ahead' ? 90 : 12;
   other.x += fx * ahead;other.z += fz * ahead;
   if (condition === 'adjacent lane') { other.x += rx * 4;other.z += rz * 4; }
   if (condition === 'separate elevation') other.y += 10;
   if (condition === 'receding') {other.speed = 30;other.vx = fx * 30;other.vz = fz * 30;}
   assert.deepEqual(drive(car, [car, other]), drive(car, []));
  });
 }
}
