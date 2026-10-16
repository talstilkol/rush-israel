import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { TRACKS, getTrack } from '../src/game/tracks.ts';
import { buildTrack } from '../src/game/spline.ts';
import { buildRoad, buildOffsetRoad, buildSidewalk } from '../src/game/road-geometry.ts';

// Real track geometry and the same front-face culling used by the road material.
// Finite coordinates alone do not establish that the road is visible from above.
function checkVisibleFromAbove(built, geometry, offset = 0, height = 0.04) {
  const material = new THREE.MeshBasicMaterial({ side: THREE.FrontSide });
  const mesh = new THREE.Mesh(geometry, material);
  const ray = new THREE.Raycaster();
  try {
    const normals = geometry.getAttribute('normal');
    for (let i = 0; i < normals.count; i++) assert.ok(normals.getY(i) >= -0.000001, `surface normal faces below road at vertex ${i}`);
    for (const fraction of [0.05, 0.2, 0.4, 0.6, 0.8, 0.95]) {
      const i = Math.min(built.samples.length - 2, Math.floor(built.samples.length * fraction));
      const a = built.samples[i], b = built.samples[i + 1];
      const x = (a.x + a.rx * offset + b.x + b.rx * offset) / 2;
      const y = (a.y + b.y) / 2 + height;
      const z = (a.z + a.rz * offset + b.z + b.rz * offset) / 2;
      ray.set(new THREE.Vector3(x, y + 20, z), new THREE.Vector3(0, -1, 0));
      const hits = ray.intersectObject(mesh);
      assert.ok(hits.some(hit => Math.abs(hit.point.y - y) < 0.05), `no front-facing road surface at actual route fraction ${fraction}`);
    }
  } finally { geometry.dispose(); material.dispose(); }
}

for (const definition of TRACKS) {
  test(`${definition.id}: actual asphalt surface is visible with front-face culling`, () => {
    const built = buildTrack(definition);
    checkVisibleFromAbove(built, buildRoad(built));
  });
}

test('actual Ayalon opposing carriageway is also visible from above', () => {
  const built = buildTrack(getTrack('ayalon'));
  const offset = built.width + 18;
  checkVisibleFromAbove(built, buildOffsetRoad(built, offset), offset);
});

for (const side of [-1, 1]) {
  test(`actual Rothschild sidewalk on side ${side} faces pedestrians above it`, () => {
    const built = buildTrack(getTrack('rothschild'));
    checkVisibleFromAbove(built, buildSidewalk(built, side), side * (built.width / 2 + 0.42 + 1.6), 0.18);
  });
}
