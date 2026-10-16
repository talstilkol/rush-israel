import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {fromRoot} from './project-root.mjs';
import {ArcadeCar,aiInput,trafficInput} from '../src/game/vehicle.ts';
import {buildTrack} from '../src/game/spline.ts';
import {getTrack} from '../src/game/tracks.ts';
import {CARS} from '../src/game/cars.ts';
const read=name=>JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','grade-forecast',name),'utf8'));
const parent=read('actual-parent.json'),hazards=read('actual-hazards.json'),track=buildTrack(getTrack('haifa'));
assert.equal(parent.sourceHead,'dd1d3c79bb9d189ed8509ed4d7edba3a2fe43f49');assert.equal(hazards.length,19);
const restore=frame=>frame.cars.map((row,i)=>{const c=new ArcadeCar(row.stats,row.stats.id);c.load(row.state);c.contactBounds=row.bounds;c.isAi=i!==0;return c});
for(const control of [aiInput,trafficInput]){
 const drive=(car,cars)=>control===aiInput?control(car,track,undefined,cars):control(car,track,cars);
 for(const index of [0,8,9,10,18]){
  const observed=hazards[index],frame=parent.hazards.find(f=>Math.abs(f.time-observed.time)<1e-9);
  test(`${control.name}: actual Haifa ${observed.time.toFixed(2)}s grade approach needs early braking`,()=>{
   const cars=restore(frame);if(index===8||index===10)assert.equal(cars[0].airborne,true,'retain the actual transient airborne flag');assert.ok(Math.abs(observed.dy)>4);assert.ok(observed.arc>0&&observed.arc<72);assert.ok(Math.abs(observed.relativeLevel)<1);assert.equal(frame.input.throttle,1);assert.equal(frame.input.brake,0);
   const input=drive(cars[0],cars);assert.equal(input.throttle,0);assert.ok(input.brake>0);assert.equal(input.nitro,false);assert.equal(input.drift,false);
  });
 }
 for(const side of ['follower','leader'])test(`${control.name}: off-road ${side} cannot borrow the main-road grade forecast`,()=>{
  const observed=hazards[9],frame=parent.hazards.find(f=>Math.abs(f.time-observed.time)<1e-9),cars=restore(frame),a=cars[0],b=cars[observed.other];(side==='follower'?a:b).onTrack=false;
  assert.deepEqual(drive(a,[a,b]),drive(a,[]));
 });

 for(const displacement of [-12,12])test(`${control.name}: same horizontal pose on another level must not become a grade hazard (${displacement}m)`,()=>{
  // Controlled elevation change to an actual captured pose,not a measured road.
  const observed=hazards[9],frame=parent.hazards.find(f=>Math.abs(f.time-observed.time)<1e-9),cars=restore(frame),a=cars[0],b=cars[observed.other];b.y+=displacement;
  assert.deepEqual(drive(a,[a,b]),drive(a,[]));
 });
}

test('actual Hermon route fold: another elevation almost100m along the road must not cause false emergency braking',()=>{
 const observed=read('actual-fold.json')[0],built=buildTrack(getTrack(observed.track));assert.equal(observed.track,'hermon');assert.deepEqual(built.samples[observed.i],observed.a);assert.deepEqual(built.samples[observed.j],observed.b);
 const a=new ArcadeCar(CARS[0],CARS[0].id),b=new ArcadeCar(CARS[0],CARS[0].id);a.spawn(built,observed.a.t,0);b.spawn(built,observed.b.t,0);
 a.speed=50;a.vx=-Math.sin(a.yaw)*50;a.vz=-Math.cos(a.yaw)*50;b.speed=0;b.vx=b.vz=0;
 assert.ok(Math.abs(a.y-b.y)>4);assert.ok(observed.arc>90&&observed.along<65&&observed.side<1);
 assert.deepEqual(trafficInput(a,built,[a,b]),trafficInput(a,built,[]));
});
