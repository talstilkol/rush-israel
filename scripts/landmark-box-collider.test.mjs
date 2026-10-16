import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import * as THREE from 'three';
import {fromRoot} from './project-root.mjs';
import {colliderForBox} from '../src/game/box-collider.ts';
import {ArcadeCar} from '../src/game/vehicle.ts';
import {CARS} from '../src/game/cars.ts';

const parent=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','landmark-footprints','parent-landmarks.json'),'utf8'));
function verifyActualMesh(mesh) {
 mesh.updateMatrixWorld(true);
 const collider=colliderForBox(mesh),bounds=new THREE.Box3().setFromObject(mesh);
 assert.ok(Math.abs(collider.maxY-bounds.max.y)<1e-6);
 const contact=(point,normal)=>{
  const car=new ArcadeCar(CARS[0],CARS[0].nameEn);
  [car.x,car.y,car.z]=point.toArray();car.vx=-normal.x*20;car.vz=-normal.z*20;car.speed=20;
  car.hitColliders([collider]);
  return{damage:car.damage,displacement:Math.hypot(car.x-point.x,car.z-point.z)};
 };
 for(const axis of['x','z'])for(const side of[-1,1]) {
  const origin=new THREE.Vector3();origin[axis]=side*100;
  mesh.localToWorld(origin);
  const direction=mesh.position.clone().sub(origin).normalize();
  const ray=new THREE.Raycaster(origin,direction),surface=ray.intersectObject(mesh)[0];
  assert.ok(surface,'actual rendered box must intersect its incoming ray');
  const normal=surface.face.normal.clone().transformDirection(mesh.matrixWorld);
  const point=surface.point.clone().addScaledVector(normal,1.05-.02);
  const hit=contact(point,normal);assert.ok(hit.damage>0&&hit.displacement>0);
  const outside=contact(surface.point.clone().addScaledVector(normal,1.05+.1),normal);
  assert.deepEqual(outside,{damage:0,displacement:0});
 }
 assert.deepEqual(contact(new THREE.Vector3(mesh.position.x,bounds.max.y+.1,mesh.position.z),new THREE.Vector3(1,0,0)),{damage:0,displacement:0});
 mesh.geometry.dispose();mesh.material.dispose();
}
for(const row of parent.rows)for(const actual of row.solids) {
 test(`${row.track}/${actual.role}: real geometry rays agree with vehicle contact andheight`,()=>{
  const p=actual.dimensions,mesh=new THREE.Mesh(new THREE.BoxGeometry(p.width,p.height,p.depth),new THREE.MeshBasicMaterial());
  mesh.position.fromArray(actual.position);mesh.quaternion.fromArray(actual.quaternion);
  verifyActualMesh(mesh);
 });
}
test('actual HW1 cloned right lining keeps its rendered orientation despite Euler aliasing',()=>{
 const record=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','tunnel-solids','actual-tunnels','summary.json'),'utf8'));
 const actual=record.actual.rows.find(r=>r.track==='hw1').solids.find(s=>s.name==='rush-tunnel-lining-right');
 const p=actual.dimensions,source=new THREE.Mesh(new THREE.BoxGeometry(p.width,p.height,p.depth),new THREE.MeshBasicMaterial());
 source.position.fromArray(actual.position);source.rotation.y=actual.collider.yaw;
 const cloned=source.clone();assert.ok(Math.abs(cloned.rotation.y-actual.collider.yaw)>.5,'exercise the actual quaternion-to-Euler alias');
 verifyActualMesh(cloned);
});
