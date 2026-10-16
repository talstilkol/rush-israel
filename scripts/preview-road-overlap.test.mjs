import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import * as THREE from 'three';
import {fromRoot} from './project-root.mjs';
import {roadFootprintOverlap,roadFootprintGap} from './road-footprint-overlap.mjs';
const parent=JSON.parse(readFileSync(fromRoot('evidence','2026-10-16','preview-road-placement','actual-parent.json'),'utf8'));
for(const row of parent.rows)for(const solid of row.solids){
 test(`${row.track}/${solid.name}: actual parent triangles expose original preview-road overlap`,()=>{
  const overlaps=!solid.name.startsWith('rush-hw6-pier-'),expectedVertical=overlaps&&solid.name!=='ksaba-garden';
  const result=roadFootprintOverlap(row.road,solid.footprint);
  assert.equal(result.area>0,overlaps);assert.equal(result.triangles>0,overlaps);assert.equal(result.verticalTriangles>0,expectedVertical);
  const gap=roadFootprintGap(row.road,solid.footprint);if(overlaps)assert.equal(gap,0);else assert.ok(gap>2);
  const p=solid.dimensions;
  if(overlaps){const area=p.width?p.width*p.depth:p.radialSegments*p.radiusBottom**2*Math.sin(2*Math.PI/p.radialSegments)/2;assert.ok(Math.abs(result.area-area)<1e-3,'actual parent obstacle footprint was entirely inside the road');}
  // Independent ray intersection through the actual parent Float32 road geometry.
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(row.road.positions.flat(),3));if(row.road.indices)geometry.setIndex(row.road.indices);
  const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),mesh=new THREE.Mesh(geometry,material);mesh.updateMatrixWorld(true);
  try{const[x,,z]=solid.position,ray=new THREE.Raycaster(new THREE.Vector3(x,100,z),new THREE.Vector3(0,-1,0)),hits=ray.intersectObject(mesh);assert.equal(hits.length>0,overlaps);if(overlaps){const min=Math.min(...solid.footprint.map(p=>p[1])),max=Math.max(...solid.footprint.map(p=>p[1]));assert.equal(hits.some(h=>h.point.y>=min&&h.point.y<=max),expectedVertical);}}
  finally{geometry.dispose();material.dispose()}
 });
}
