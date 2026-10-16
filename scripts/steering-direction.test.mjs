import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARS } from '../src/game/cars.ts';
import { getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { ArcadeCar } from '../src/game/vehicle.ts';
const track=buildTrack(getTrack('ayalon'));
for(const definition of CARS) for(const steer of [-.3,-.2,-.1,.1,.2,.3]) {
  test(`${definition.id}: initial tire yaw follows steering ${steer}`,()=>{
    const car=new ArcadeCar(definition,definition.nameEn);car.spawn(track,.2,0);
    car.speed=20;car.vx=-Math.sin(car.yaw)*20;car.vz=-Math.cos(car.yaw)*20;
    car.step(1/120,{steer,throttle:0,brake:0,nitro:false,drift:false},track,true);
    assert.ok(car.yawRate*steer>0,`input${steer} produced opposite yawRate${car.yawRate}`);
  });
}
