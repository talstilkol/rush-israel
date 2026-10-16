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
