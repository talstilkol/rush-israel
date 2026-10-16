import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {ArcadeCar} from '../src/game/vehicle.ts';
import {buildTrack,roadEdgeBarriers} from '../src/game/spline.ts';
import {getTrack} from '../src/game/tracks.ts';
import {buildJersey} from '../src/game/road-geometry.ts';
import {CARS} from '../src/game/cars.ts';
import * as THREE from 'three';
import {fromRoot} from './project-root.mjs';
const observed=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','road-edge-height','actual-scopus.json'),'utf8'));
assert.equal(observed.sourceHead,'3d8200ffe961bb24b905932b1393c07a28cc4d75');assert.equal(observed.worldHits.length,2);
const track=buildTrack(getTrack('scopus')),edges=roadEdgeBarriers(track);
for(const[index,event]of observed.worldHits.entries()){
 const original=event.near[0],collider=edges.find(c=>Math.hypot(c.x-original.x,c.z-original.z)<1e-7);assert.ok(collider);
 const origin=track.samples.find(s=>[-1,1].some(side=>Math.hypot(s.x+s.rx*side*(track.width/2+1.55)-collider.x,s.z+s.rz*side*(track.width/2+1.55)-collider.z)<1e-7));assert.ok(origin);
 const post=new THREE.CylinderGeometry(.08,.1,.78,5);post.translate(0,.4,0);post.computeBoundingBox();const lower=origin.y+post.boundingBox.min.y,upper=origin.y+post.boundingBox.max.y;post.dispose();
 const restore=()=>{const car=new ArcadeCar(CARS[0],CARS[0].id);car.load(event.beforeState);car.contactBounds=event.bounds;return car};
 test(`Scopus ${index}: actual generated road edge retains finite vertical bounds`,()=>{
  assert.ok(Number.isFinite(collider.minY)&&Number.isFinite(collider.maxY));assert.ok(collider.maxY>collider.minY);assert.ok(Math.abs(collider.minY-lower)<1e-6&&Math.abs(collider.maxY-upper)<1e-6);
 });
 test(`Scopus ${index}: actual captured contact at another road level must not move or damage the car`,()=>{
  const car=restore(),before=car.snap();car.hitColliders([collider]);assert.deepEqual(car.snap(),before);
 });
 test(`Scopus ${index}: captured horizontal contact still resolves at the guardrail's own level`,()=>{
  const car=restore();car.y=lower;const before=car.snap();car.hitColliders([collider]);assert.ok(car.damage>before.damage);assert.ok(Math.hypot(car.x-before.x,car.z-before.z)>0);
 });
 test(`Scopus ${index}: top of actual loaded body below an elevated edge has no contact`,()=>{
  const car=restore();car.y=lower-car.contactBounds.maxY-.01;const before=car.snap();car.hitColliders([collider]);assert.deepEqual(car.snap(),before);
 });
 test(`Scopus ${index}: loaded body's top overlapping elevated edge still contacts`,()=>{
  const car=restore();car.y=lower-car.contactBounds.maxY+.01;const before=car.snap();car.hitColliders([collider]);assert.ok(car.damage>before.damage);
 });
 test(`Scopus ${index}: legacy CPU body without loaded dimensions retains same-level contact`,()=>{
  const car=restore();car.contactBounds=undefined;car.y=origin.y;const before=car.snap();car.hitColliders([collider]);assert.ok(car.damage>before.damage);assert.ok(Math.hypot(car.x-before.x,car.z-before.z)>0);
 });
 test(`Scopus ${index}: bottom of actual body above a lower edge has no contact`,()=>{
  const car=restore();car.y=upper-car.contactBounds.minY+.01;const before=car.snap();car.hitColliders([collider]);assert.deepEqual(car.snap(),before);
 });
}

const highway=buildTrack(getTrack('ayalon')),highwayEdge=roadEdgeBarriers(highway).find(c=>c.r===1.05);
const highwayIndex=highway.samples.findIndex(s=>Math.hypot(s.x-s.rx*(highway.width/2+1.55)-highwayEdge.x,s.z-s.rz*(highway.width/2+1.55)-highwayEdge.z)<1e-7);assert.ok(highwayIndex>=0);const highwayOrigin=highway.samples[highwayIndex];
test('Ayalon generated edge interval agrees with its actual jersey vertices',()=>{
 const geometry=buildJersey(highway,-1),p=geometry.attributes.position;
 try{assert.ok(Math.abs(highwayEdge.minY-p.getY(highwayIndex*2))<1e-5);assert.ok(Math.abs(highwayEdge.maxY-p.getY(highwayIndex*2+1))<1e-5)}finally{geometry.dispose()}
});
test('Ayalon loaded body still hits the actual upper jersey region above regular-post height',()=>{
 const car=new ArcadeCar(CARS[0],CARS[0].id);car.contactBounds=observed.worldHits[0].bounds;car.x=highwayEdge.x+.5;car.z=highwayEdge.z;car.y=highwayOrigin.y+1.05-car.contactBounds.minY;car.vx=-20;car.vz=0;car.speed=20;car.hitColliders([highwayEdge]);assert.ok(car.damage>0);
});
for(const id of ['haifa','hermon','ramon'])test(`${id}: legacy edge with no rendered rail orjersey does not invent a post-height interval`,()=>{
 const edges=roadEdgeBarriers(buildTrack(getTrack(id)));assert.ok(edges.length>0);assert.ok(edges.every(c=>c.minY===undefined&&c.maxY===undefined));
});
