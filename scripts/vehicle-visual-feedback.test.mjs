import assert from 'node:assert/strict';
import {test} from 'node:test';
import {CARS} from '../src/game/cars.ts';
import {ArcadeCar,aiInput} from '../src/game/vehicle.ts';
import {buildTrack} from '../src/game/spline.ts';
import {getTrack} from '../src/game/tracks.ts';
const track=buildTrack(getTrack('ayalon'));
for(const def of CARS){
 const make=()=>{const c=new ArcadeCar(def,def.nameEn);c.spawn(track,.2,0);return c;};
 test(`${def.id}: AI braking survives snapshots and clears on coast/spawn/old replay`,()=>{
  const c=make(),ahead=make();c.speed=25;c.vx=-Math.sin(c.yaw)*25;c.vz=-Math.cos(c.yaw)*25;
  ahead.x-=Math.sin(c.yaw)*12;ahead.z-=Math.cos(c.yaw)*12;
  const input=aiInput(c,track,undefined,[c,ahead]);assert.ok(input.brake>.15);
  c.step(1/120,input,track,true);assert.equal(c.visualBrake,input.brake);assert.equal(c.visualSteer,input.steer);
  const snap=c.snap(),restored=make();restored.load(snap);assert.equal(restored.visualBrake,input.brake);assert.equal(restored.visualSteer,input.steer);
  const old={...snap};delete old.visualInput;restored.load(old);assert.equal(restored.visualBrake,0);assert.equal(restored.visualSteer,0);
  c.step(1/120,{...input,brake:0,steer:0},track,true);assert.equal(c.visualBrake,0);assert.equal(c.visualSteer,0);
  c.load(snap);c.spawn(track,.2,0);assert.equal(c.visualBrake,0);assert.equal(c.visualSteer,0);
 });
 for(const phase of ['countdown','finished','eliminated'])test(`${def.id}: ${phase} does not display inactive controls`,()=>{
  const c=make();if(phase!=='countdown')c[phase]=true;
  c.step(1/120,{steer:.5,brake:1,throttle:0,drift:false,nitro:false},track,phase!=='countdown');
  assert.equal(c.visualBrake,0);assert.equal(c.visualSteer,0);
 });
}
