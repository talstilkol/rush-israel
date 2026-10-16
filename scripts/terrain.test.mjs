import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fromRoot } from './project-root.mjs';
import * as THREE from 'three';
import { getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { buildTerrain } from '../src/game/terrain.ts';

test('Hermon support bounds match independently clipped terrain triangles under nine actual building footprints', () => {
  const recorded = JSON.parse(readFileSync(fromRoot('evidence', '2026-10-16', 'landmark-alignment', 'prior-collider.json'), 'utf8'));
  assert.equal(recorded.groundingFootprints.length, 9);
  const definition = getTrack('hermon');
  const terrain = buildTerrain(definition, buildTrack(definition));
  // Independent polygon clipping uses actual rendered Float32 vertices, rather
  // than the height-query/grid-intersection implementation being checked.
  const clip = (vertices, axis, edge, sign) => {
    const result = [];
    for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i], b = vertices[(i + 1) % vertices.length];
      const insideA = sign * (a[axis] - edge) >= 0;
      const insideB = sign * (b[axis] - edge) >= 0;
      if (insideA) result.push(a);
      if (insideA !== insideB) {
        const t = (edge - a[axis]) / (b[axis] - a[axis]);
        result.push(a.map((value, index) => value + (b[index] - value) * t));
      }
    }
    return result;
  };
  try {
    const positions = terrain.geometry.getAttribute('position'), indices = terrain.geometry.index;
    for (const footprint of recorded.groundingFootprints) {
      const [x, , z] = footprint.position, hx = footprint.dimensions.width / 2, hz = footprint.dimensions.depth / 2;
      let min = Infinity, max = -Infinity;
      for (let i = 0; i < indices.count; i += 3) {
        let polygon = [0, 1, 2].map(offset => {
          const index = indices.getX(i + offset);
          return [positions.getX(index), positions.getY(index), positions.getZ(index)];
        });
        if (Math.max(...polygon.map(p => p[0])) < x - hx || Math.min(...polygon.map(p => p[0])) > x + hx ||
            Math.max(...polygon.map(p => p[2])) < z - hz || Math.min(...polygon.map(p => p[2])) > z + hz) continue;
        for (const [axis, edge, sign] of [[0, x - hx, 1], [0, x + hx, -1], [2, z - hz, 1], [2, z + hz, -1]]) polygon = clip(polygon, axis, edge, sign);
        for (const point of polygon) { min = Math.min(min, Math.max(-0.4, point[1])); max = Math.max(max, Math.max(-0.4, point[1])); }
      }
      if (!Number.isFinite(min)) min = max = -0.4; // Actual base plane beyond the terrain mesh.
      const actual = terrain.boundsForBox(x, z, hx, hz);
      assert.ok(Math.abs(actual.min - min) < 1e-5, `minimum differs at ${x},${z}: ${actual.min} vs ${min}`);
      assert.ok(Math.abs(actual.max - max) < 1e-5, `maximum differs at ${x},${z}: ${actual.max} vs ${max}`);
    }
  } finally { terrain.geometry.dispose(); }
});

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
