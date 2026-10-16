import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {CARS} from '../src/game/cars.ts';
import {fitCarWindows} from '../src/game/car-glazing.ts';
import {createCarVisual,disposeCarVisual} from '../src/game/car-mesh.ts';
const windows=v=>v.group.children.filter(m=>m.name.startsWith('window-')||(m.isMesh&&m.material.transparent&&m.material.opacity===.38&&m.material.roughness===.07&&m.geometry.parameters.width>.1));
for(const def of CARS){
 test(`${def.id}: actual fallback body must not hide its four window surfaces`,()=>{
  const v=createCarVisual(def.color,def.accent,true,false,def.body);
  try{
   v.group.updateMatrixWorld(true);const body=v.group.children.find(m=>m.name==='body'||m.geometry?.type==='ExtrudeGeometry');assert.ok(body);body.geometry.computeBoundingBox();const bodyCenter=body.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(body.matrixWorld),panes=windows(v);assert.equal(panes.length,4);
   for(const pane of panes){pane.geometry.computeBoundingBox();const center=pane.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(pane.matrixWorld),normal=new THREE.Vector3(0,0,1).applyQuaternion(pane.getWorldQuaternion(new THREE.Quaternion()));if(normal.dot(center.clone().sub(bodyCenter))<0)normal.negate();const first=new THREE.Raycaster(center.clone().addScaledVector(normal,3),normal.negate()).intersectObjects([pane,body],false)[0];assert.ok(first?.object===pane,'a real window must be visible before its body shell');}
  }finally{disposeCarVisual(v);}
 });
 test(`${def.id}: repeated construction preserves geometry and independent disposal`,()=>{
  const a=createCarVisual(def.color,def.accent,true,false,def.body),b=createCarVisual(def.color,def.accent,true,false,def.body);
  try{const aw=windows(a),bw=windows(b);assert.equal(aw.length,4);assert.equal(bw.length,4);for(let i=0;i<4;i++){assert.notEqual(aw[i].geometry,bw[i].geometry);assert.deepEqual(Array.from(aw[i].geometry.attributes.position.array),Array.from(bw[i].geometry.attributes.position.array));assert.notEqual(aw[i].material,bw[i].material);}let disposed=false;bw[0].geometry.addEventListener('dispose',()=>disposed=true);disposeCarVisual(a);assert.equal(disposed,false);}finally{disposeCarVisual(b);}
 });
}

for(const failure of ['missing window coverage','changed shell transform'])test(`failed fitting is atomic: ${failure}`,()=>{
 const d=CARS[0],v=createCarVisual(d.color,d.accent,true,false,d.body);
 try{const panes=windows(v),body=v.group.getObjectByName('body');
  if(failure==='missing window coverage')panes[3].position.x+=100;else body.position.y+=10;
  const state=panes.map(p=>({geometry:p.geometry,material:p.material,position:p.position.toArray()}));
  const cabinHeight=Math.min(...panes.map(p=>p.geometry.parameters.height))/.48;
  assert.equal(fitCarWindows(body,panes,cabinHeight),false);
  panes.forEach((p,i)=>{assert.equal(p.geometry,state[i].geometry);assert.equal(p.material,state[i].material);assert.deepEqual(p.position.toArray(),state[i].position);});
 }finally{disposeCarVisual(v);}
});
