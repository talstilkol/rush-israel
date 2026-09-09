import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

// Import the actual vehicle and local dependencies, never a substitute solver.
const memo = new Map();
function compile(file) {
  if (memo.has(file)) return memo.get(file);
  let js = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  js = js.replace(/from\s*(["'])([^"']+)\1/g, (_, quote, spec) => {
    assert.ok(spec.startsWith('.'), `Unexpected dependency: ${spec}`);
    return `from ${JSON.stringify(compile(resolve(dirname(file), spec + (spec.endsWith('.ts') ? '' : '.ts'))))}`;
  });
  const uri = `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
  memo.set(file, uri); return uri;
}
const { ArcadeCar } = await import(compile(fromRoot('src/game/vehicle.ts')));
const { CARS } = await import(compile(fromRoot('src/game/cars.ts')));

const close = (a, b) => assert.ok(Math.abs(a-b) < 1e-9, `${a} != ${b}`);
const { supportPierCollider, overlapsColliderHeight, preserveColliderAtSpawn, CAR_CONTACT_HEIGHT } = await import(compile(fromRoot('src/game/collider-height.ts')));
function trial(y, moving = false, bounds = { min: 0, max: 8.45 }, box = false) {
  const car = new ArcadeCar(CARS[0], 'height-qualified pier');
  Object.assign(car, { x: 0, z: 0, y, vy: -2, vx: moving ? 3 : 0, vz: moving ? 4 : 0, speed: moving ? -4 : 0 });
  car.hitColliders([{ x: 0, z: 0, r: 1.77, kind: 'barrier', ...(box ? { hx: 0.72, hz: 0.72 } : {}), vertical: bounds }]);
  assert.ok([car.x,car.z,car.y,car.vy,car.vx,car.vz,car.speed].every(Number.isFinite));
  close(car.y,y); close(car.vy,-2); return car;
}
for (const box of [false, true]) for (const moving of [false, true]) {
  for (const y of [8.45, 9.4, 20, -1.6, -10]) test(`height filter allows ${box?'box':'circle'} non-overlap y=${y} moving=${moving}`, () => {
    const car = trial(y,moving,undefined,box); close(car.x,0); close(car.z,0); close(car.vx,moving?3:0); close(car.vz,moving?4:0); close(car.damage,0);
  });
  for (const y of [0, 4, 8.44, -0.8]) test(`height filter retains ${box?'box':'circle'} overlap y=${y} moving=${moving}`, () => {
    const car=trial(y,moving,undefined,box); assert.ok(Math.hypot(car.x,car.z)>=1.77-1e-9);
  });
}
test('legacy obstacle without bounds is not silently height-filtered', () => {
  for(const y of [-100,100]) { const car=trial(y,false,null); close(Math.hypot(car.x,car.z),1.77); }
});
test('malformed height bounds fail conservatively rather than disabling contacts', () => {
  for(const vertical of [{min:0,max:NaN},{min:Infinity,max:5},{min:5,max:1}]) assert.equal(overlapsColliderHeight({vertical},3),true);
});
test('pier collider matches ground-to-slab span and widest footprint plus established padding', () => {
  assert.deepEqual(supportPierCollider(1,2,8.45),{x:1,z:2,r:1.77,kind:'barrier',vertical:{min:0,max:8.45},role:'support-pier'});
  assert.equal(CAR_CONTACT_HEIGHT,1.6);
});
test('invalid pier geometry cannot silently create invalid collider data', () => {
  for(const args of [[NaN,0,1],[0,Infinity,1],[0,0,0],[0,0,-1],[0,0,NaN]]) assert.throws(()=>supportPierCollider(...args),/dimensions/);
});
test('public vehicle step blocks a pier at ground level but leaves elevated travel free', () => {
  const samples=Array.from({length:121},(_,i)=>({x:0,z:60-i,y:0,t:i/120,tx:0,tz:-1,rx:1,rz:0}));
  const track={samples,width:28,length:120,closed:false,checkpoints:[0.2,0.8]};
  const input={throttle:0,brake:0,steer:0,nitro:false,drift:false};
  for(const y of [0,9.4]) {
    const car=new ArcadeCar(CARS[0],'public pier approach');
    Object.assign(car,{x:0,z:1.75,y,yaw:0,speed:4,vx:0,vz:-4,sampleIndex:58});
    const elevatedTrack={...track,samples:samples.map(s=>({...s,y}))};
    car.step(1/120,input,elevatedTrack,true,[supportPierCollider(0,0,8.45)]);
    if(y===0) {assert.ok(car.z>=1.77-1e-9);assert.equal(car.lastHit,'barrier');}
    else {assert.ok(car.z<1.75);assert.equal(car.lastHit,'');}
  }
});

test('spawn clearing preserves structural support-pier obstacles',()=>assert.equal(preserveColliderAtSpawn(supportPierCollider(1,2,3)),true));
test('spawn clearing retains legacy scenery eligibility',()=>assert.equal(preserveColliderAtSpawn({x:0,z:0,r:2,kind:'barrier'}),false));
