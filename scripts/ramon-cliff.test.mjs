import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { getTrack, ram } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { buildRamonCliff } from '../src/game/world-builders/ramon-cliff.ts';

test('actual Ramon cliff never crosses the driver path on either side of its faces', () => {
  const built = buildTrack(getTrack('ramon'));
  const geometry = buildRamonCliff(built, ram(30.585, 34.802));
  // DoubleSide is diagnostic here: a cliff must not cross the road even when
  // back-face culling happens to hide one side. Shipping materials stay one-sided.
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  const ray = new THREE.Raycaster();
  try {
    for (let i = 0; i < built.samples.length - 1; i++) {
      const a = built.samples[i], b = built.samples[i + 1];
      for (const lane of [-0.75, 0, 0.75]) {
        const offset = lane * built.width / 2;
        const from = new THREE.Vector3(a.x + a.rx * offset, a.y + 1.6, a.z + a.rz * offset);
        const to = new THREE.Vector3(b.x + b.rx * offset, b.y + 1.6, b.z + b.rz * offset);
        const distance = from.distanceTo(to);
        ray.set(from, to.sub(from).normalize());
        ray.near = 0.001;
        ray.far = Math.max(0.001, distance - 0.001);
        assert.equal(ray.intersectObject(mesh).length, 0, `cliff blocks actual road segment ${i}, lane ${lane}`);
      }
    }
  } finally { geometry.dispose(); material.dispose(); }
});

test('actual Ramon descent never climbs above its preceding road sample',()=>{
 const built=buildTrack(getTrack('ramon'));
 for(let i=1;i<built.samples.length;i++){
  const a=built.samples[i-1],b=built.samples[i];
  assert.ok(b.y<=a.y+Number.EPSILON*Math.max(1,Math.abs(a.y))*16,`actual segment ${i-1}->${i} climbs ${b.y-a.y}m`);
 }
});

test('actual Ramon plateau boundaries meet the descent without height jumps',()=>{
 const definition=getTrack('ramon'),built=buildTrack(definition),top=definition.elevation(built.samples[0].t);
 const first=built.samples.findIndex(s=>s.y!==top);assert.ok(first>0,'real descent must follow the plateau');
 let left=built.samples[first-1].t,right=built.samples[first].t;
 // Locate the real plateau transition using its actual route samples.
 for(let i=0;i<64;i++){const mid=(left+right)/2;if(mid===left||mid===right)break;if(definition.elevation(mid)===top)left=mid;else right=mid}
 const gap=Math.abs(definition.elevation(right)-definition.elevation(left));
 assert.ok(gap<=Number.EPSILON*Math.max(1,Math.abs(top))*16,`actual upper transition jumps ${gap}m`);
 const floor=definition.elevation(built.samples.at(-1).t);
 const firstFloor=built.samples.findIndex(s=>s.y===floor);
 assert.ok(firstFloor>first,'actual descent must finish at the lower plateau');
 left=built.samples[firstFloor-1].t;right=built.samples[firstFloor].t;
 for(let i=0;i<64;i++){const mid=(left+right)/2;if(mid===left||mid===right)break;if(definition.elevation(mid)===floor)right=mid;else left=mid}
 const lowerGap=Math.abs(definition.elevation(right)-definition.elevation(left));
 assert.ok(lowerGap<=Number.EPSILON*Math.max(1,Math.abs(floor))*16,`actual lower transition jumps ${lowerGap}m`);
});
