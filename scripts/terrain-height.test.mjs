import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { clearRoadsidePoint } from "../src/game/roadside.ts";
import { getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { buildTerrain } from '../src/game/terrain.ts';

for (const id of ['haifa','hermon','scopus','ramon']) {
  test(`${id}: height query matches the actual rendered terrain triangles`, () => {
    const def=getTrack(id), built=buildTrack(def), terrain=buildTerrain(def,built);
    const material=new THREE.MeshBasicMaterial({side:THREE.FrontSide});
    const mesh=new THREE.Mesh(terrain.geometry,material), ray=new THREE.Raycaster();
    try {
      const points = built.samples.filter((_, i) => i % 31 === 0).flatMap(s => [-40,40,80].map(d=>({x:s.x+s.rx*d,z:s.z+s.rz*d})));
      if (id==='scopus') {
        for(let i=0;i<32;i++) {
          points.push(clearRoadsidePoint(built,.06+i/32*.85,i%2?1:-1,1.2));
        }
      }
      for(const p of points) {
        ray.set(new THREE.Vector3(p.x,2000,p.z),new THREE.Vector3(0,-1,0));
        const hits=ray.intersectObject(mesh);
        assert.ok(hits.length>0,`${id} has a hole below a real terrain query`);
        assert.ok(Math.abs(hits[0].point.y-terrain.heightAt(p.x,p.z))<.001,`${id} query differs from rendered support`);
      }
    }finally{terrain.geometry.dispose();material.dispose();}
  });
}
