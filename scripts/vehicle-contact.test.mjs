import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import * as THREE from 'three';
import {OBB} from 'three/addons/math/OBB.js';
import {ArcadeCar,separateCars} from '../src/game/vehicle.ts';
import {CARS} from '../src/game/cars.ts';
import {fromRoot} from './project-root.mjs';
const parent=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','vehicle-contact','actual-parent.json'),'utf8'));
const carsFrom=rows=>rows.map(row=>{
 const definition=CARS.find(c=>c.body===row.kind);assert.ok(definition);
 const car=new ArcadeCar({...definition,mass:row.mass},row.kind);Object.assign(car,row);
 car.contactBounds={minX:-row.bodyMax[0],maxX:-row.bodyMin[0],minY:row.bodyMin[1],maxY:row.bodyMax[1],minZ:-row.bodyMax[2],maxZ:-row.bodyMin[2]};return car;
});
// Independent Three.js OBB oracle. Shrink each half-extent by one micrometre
// so merely touching hulls are not counted as penetrations.
function box(car){const b=car.contactBounds,rotation=new THREE.Matrix4().makeRotationY(car.yaw),center=new THREE.Vector3((b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2).applyMatrix4(rotation).add(new THREE.Vector3(car.x,car.y,car.z));return new OBB(center,new THREE.Vector3((b.maxX-b.minX)/2-1e-6,(b.maxY-b.minY)/2-1e-6,(b.maxZ-b.minZ)/2-1e-6),new THREE.Matrix3().setFromMatrix4(rotation))}
function overlaps(cars){const hits=[];for(let i=0;i<cars.length;i++)for(let j=i+1;j<cars.length;j++)if(box(cars[i]).intersectsOBB(box(cars[j]),1e-10))hits.push([i,j]);return hits}
const failing=parent.frames.filter(frame=>overlaps(carsFrom(frame.rows)).length);
assert.ok(failing.length,'The captured parent must actually contain body penetrations');
for(const frame of failing)test(`actual Namal ${frame.time.toFixed(3)}s: resolve recorded body penetrations`,()=>{
 const cars=carsFrom(frame.rows);assert.ok(overlaps(cars).length);separateCars(cars);assert.deepEqual(overlaps(cars),[]);
});
for(const condition of ['coincident','rear-end','side','crossed','separate elevation','clear side lane'])test(`actual measured bodies under controlled contact: ${condition}`,()=>{
 const cars=carsFrom(parent.frames[0].rows.slice(0,2)),[a,b]=cars;
 b.x=a.x;b.y=a.y;b.z=a.z;b.yaw=a.yaw;
 const axis=new THREE.Vector3(0,0,-1).applyAxisAngle(new THREE.Vector3(0,1,0),a.yaw);
 if(condition==='rear-end'){b.x+=axis.x*3;b.z+=axis.z*3}
 if(condition==='side'){b.x+=Math.cos(a.yaw);b.z-=Math.sin(a.yaw)}
 if(condition==='crossed')b.yaw+=Math.PI/2;
 if(condition==='separate elevation')b.y+=10;
 if(condition==='clear side lane'){b.x+=Math.cos(a.yaw)*3;b.z-=Math.sin(a.yaw)*3}
 const before=cars.map(c=>c.snap());const penetrating=overlaps(cars).length;
 assert.equal(penetrating>0,!['separate elevation','clear side lane'].includes(condition));
 separateCars(cars);assert.deepEqual(overlaps(cars),[]);
 if(!penetrating)assert.deepEqual(cars.map(c=>c.snap()),before);
});

test('eight actual measured bodies at the same position separate deterministically',()=>{
 const create=()=>{const cars=carsFrom(parent.frames[0].rows.slice(0,8));for(const c of cars){c.x=cars[0].x;c.y=cars[0].y;c.z=cars[0].z;c.yaw=cars[0].yaw;c.vx=0;c.vz=0}return cars};
 const a=create(),b=create();separateCars(a);separateCars(b);assert.deepEqual(overlaps(a),[]);assert.deepEqual(a.map(c=>c.snap()),b.map(c=>c.snap()));
});

test('actual body head-on contact preserves momentum and charges one impact per pair',()=>{
 const [a,b]=carsFrom(parent.frames[0].rows.slice(0,2));b.x=a.x;b.y=a.y;b.z=a.z;b.yaw=a.yaw;
 const fx=-Math.sin(a.yaw),fz=-Math.cos(a.yaw);b.x+=fx*3;b.z+=fz*3;a.vx=fx*20;a.vz=fz*20;b.vx=-fx*10;b.vz=-fz*10;
 const momentum=()=>[a.vx*a.stats.mass+b.vx*b.stats.mass,a.vz*a.stats.mass+b.vz*b.stats.mass],before=momentum();a.damage=0;b.damage=0;
 separateCars([a,b]);momentum().forEach((value,i)=>assert.ok(Math.abs(value-before[i])<1e-9));assert.deepEqual(overlaps([a,b]),[]);assert.ok(a.damage>0&&b.damage>0);
 const damage=[a.damage,b.damage];separateCars([a,b]);assert.deepEqual([a.damage,b.damage],damage);
});

const {createCarVisual,carContactBounds,disposeCarVisual}=await import('../src/game/car-mesh.ts');
for(const definition of CARS)for(const scale of [[1,1,1],[1.12,1.22,1.38],[1.18,1.28,1.42]])test(`${definition.id}/${scale.join('x')}: contact bounds enclose the actual solid vertices`,()=>{
 const visual=createCarVisual(definition.color,definition.accent,false,false,definition.body);
 try{
  visual.group.scale.set(...scale);const bounds=carContactBounds(visual),vertices=[];
  visual.group.traverse(mesh=>{if(!mesh.isMesh)return;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];if(materials.every(m=>m.transparent))return;const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const point=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);vertices.push([-point.x,point.y,-point.z])}});
  const min=[0,1,2].map(axis=>Math.min(...vertices.map(p=>p[axis]))),max=[0,1,2].map(axis=>Math.max(...vertices.map(p=>p[axis])));
  for(const[axis,key]of [[0,'X'],[1,'Y'],[2,'Z']]){assert.ok(Math.abs(bounds[`min${key}`]-min[axis])<1e-6);assert.ok(Math.abs(bounds[`max${key}`]-max[axis])<1e-6)}
  assert.ok(bounds.maxZ-bounds.minZ>4,'actual solid length must exceed the old centre-distance envelope');
  const before={...bounds};visual.group.position.set(12,3,-8);visual.group.rotation.y=.66;const posed=carContactBounds(visual);for(const key of Object.keys(before))assert.ok(Math.abs(before[key]-posed[key])<1e-6,'root position/yaw must not corrupt local contact bounds');
 }finally{disposeCarVisual(visual)}
});

const {aiInput}=await import('../src/game/vehicle.ts');
const {getTrack}=await import('../src/game/tracks.ts');
const {buildTrack}=await import('../src/game/spline.ts');
test('actual Haifa downhill approach: brake before different road heights converge',()=>{
 const trace=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','vehicle-contact','before-grade-hazard.json'),'utf8'));
 const approach=trace.hazards.find(r=>Math.abs(r.time-6.6)<.01);assert.ok(approach);assert.equal(approach.input.throttle,1);assert.equal(approach.input.brake,0);
 const cars=approach.cars.map((row,i)=>{const c=new ArcadeCar(row.stats,row.stats.id);c.load(row.state);c.contactBounds=row.bounds;c.isAi=i!==0;return c});
 const input=aiInput(cars[0],buildTrack(getTrack('haifa')),undefined,cars);assert.equal(input.throttle,0);assert.ok(input.brake>0);assert.equal(input.nitro,false);
});
