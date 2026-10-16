import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { buildTerrain } from '../src/game/terrain.ts';

for (const id of ['haifa', 'hermon', 'scopus', 'ramon']) {
  const def = getTrack(id), built = buildTrack(def);
  test(`${id}: actual terrain faces upward throughout the route`, () => {
    const { geometry } = buildTerrain(def, built);
    try {
      const p = geometry.getAttribute('position'), indices = geometry.index;
      let downward = 0;
      for (let i = 0; i < indices.count; i += 3) {
        const a=indices.getX(i), b=indices.getX(i+1), c=indices.getX(i+2);
        const crossY=(p.getZ(b)-p.getZ(a))*(p.getX(c)-p.getX(a))-(p.getX(b)-p.getX(a))*(p.getZ(c)-p.getZ(a));
        if(crossY < -0.00001) downward++;
      }
      assert.equal(downward, 0, `${downward} terrain faces point down or fold over`);
    } finally { geometry.dispose(); }
  });
  test(`${id}: actual terrain cannot cover the driving corridor`, () => {
    const { geometry } = buildTerrain(def, built);
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    const ray = new THREE.Raycaster();
    try {
      const blocked=[];
      for(let i=0; i<built.samples.length-1; i++) {
        const s=built.samples[i], next=built.samples[i+1];
        for(const lateral of [-0.5,0,0.5]) {
          const x=(s.x+next.x)/2 + s.rx*built.width*lateral;
          const z=(s.z+next.z)/2 + s.rz*built.width*lateral;
          const y=(s.y+next.y)/2;
          ray.set(new THREE.Vector3(x,y+1000,z),new THREE.Vector3(0,-1,0));
          const top=ray.intersectObject(mesh)[0];
          if(top && top.point.y > y+0.05) blocked.push({i,lateral,height:top.point.y-y});
        }
      }
      assert.deepEqual(blocked, [], `terrain crosses actual road: ${JSON.stringify(blocked.slice(0,3))}`);
    } finally { geometry.dispose(); material.dispose(); }
  });
}
