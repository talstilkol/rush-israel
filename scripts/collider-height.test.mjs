import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {getTrack} from '../src/game/tracks.ts';
import {buildTrack} from '../src/game/spline.ts';
import {CARS} from '../src/game/cars.ts';
import {ArcadeCar} from '../src/game/vehicle.ts';
import {fromRoot} from './project-root.mjs';
const observed=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','haifa-height','observed.json'),'utf8'));
const building=observed.meshes.find(mesh=>mesh.type==='BoxGeometry'&&mesh.position[0]===observed.colliders[0].x);
const roof=observed.meshes.find(mesh=>mesh.type==='ConeGeometry'&&mesh.position[0]===observed.colliders[0].x);
const collider={...observed.colliders[0],maxY:Math.max(building.max[1],roof.max[1])};
function atRealRoute(){const track=buildTrack(getTrack('haifa')),car=new ArcadeCar(CARS[0],CARS[0].nameEn);car.spawn(track,track.samples[142].t,0);car.x=collider.x-collider.hx;car.z=observed.position.z;car.y=observed.position.y;return car;}
test('recorded Haifa house cannot block the actual elevated driving surface',()=>{
 const car=atRealRoute(),before={x:car.x,z:car.z,damage:car.damage};
 assert.ok(car.y>collider.maxY+40,'must replay actual large height separation');
 car.hitColliders([collider]);
 assert.deepEqual({x:car.x,z:car.z,damage:car.damage},before);
});
test('the same recorded house still resolves real overlap below its roof',()=>{
 const car=atRealRoute();car.y=building.min[1];const before={x:car.x,z:car.z};
 car.hitColliders([collider]);
 assert.ok(Math.hypot(car.x-before.x,car.z-before.z)>.1,'height handling must not disable the physical house');
});
