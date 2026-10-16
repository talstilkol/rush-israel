import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as THREE from 'three';
import { PNG } from 'pngjs';
import { injectRoadWetness, bindRoadCompile } from '../src/game/roadShader.ts';
import { ROAD_PAINT_REPEAT_METRES, roadLaneCount } from '../src/game/road-layout.ts';
import { TRACKS, getTrack } from '../src/game/tracks.ts';
import { fromRoot } from './project-root.mjs';

const physicalShader = () => ({
  fragmentShader: THREE.ShaderLib.physical.fragmentShader,
  uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.physical.uniforms),
});

test('actual physical shader changes wetness without painting a second set of lanes', () => {
  const shader = physicalShader();
  injectRoadWetness(shader);
  assert.ok(shader.fragmentShader.includes('RUSH_ROAD_WETNESS'));
  assert.ok(shader.fragmentShader.includes('#include <map_fragment>'));
  assert.equal(shader.fragmentShader.includes('RUSH_LANES'), false);
  assert.equal(shader.fragmentShader.includes('laneU'), false);
  assert.equal(shader.fragmentShader.includes('uLanes'), false);
  assert.equal(shader.uniforms.uWet.value, 0);
  const first = shader.fragmentShader;
  const uniform = shader.uniforms.uWet;
  injectRoadWetness(shader);
  assert.equal(shader.fragmentShader, first);
  assert.equal(shader.uniforms.uWet, uniform);
});

test('real road material chains compile hooks and keeps the actual precompile weather state', () => {
  const material = new THREE.MeshPhysicalMaterial();
  const order = [];
  material.userData.lanes = roadLaneCount(getTrack('ayalon'));
  material.userData.roadWetness = 1;
  material.onBeforeCompile = () => { order.push('existing-compile-hook'); };
  bindRoadCompile(material);
  const shader = physicalShader();
  material.onBeforeCompile(shader, null);
  assert.deepEqual(order, ['existing-compile-hook']);
  assert.equal(shader.uniforms.uWet.value, 1);
  assert.equal(material.userData.uWet, shader.uniforms.uWet);
  material.dispose();
});

test('each actual baked road kit already contains the declared lane boundaries', () => {
  const laneCounts = new Set(TRACKS.map(roadLaneCount));
  for (const lanes of laneCounts) {
    const image = PNG.sync.read(readFileSync(fromRoot('public', 'game', `asphalt-${lanes}.png`)));
    let maximumRuns = 0;
    for (let y = 0; y < image.height; y++) {
      let runs = 0, previous = false;
      for (let x = 0; x < image.width; x++) {
        const i = (y * image.width + x) * 4;
        const white = image.data[i] > 220 && image.data[i + 1] > 220 && image.data[i + 2] > 220;
        if (white && !previous) runs++;
        previous = white;
      }
      maximumRuns = Math.max(maximumRuns, runs);
    }
    assert.equal(maximumRuns, lanes + 1, `${lanes}-lane texture must contain its lane boundaries plus two white edges`);
    let paintedPixels = 0, longestDash = 0;
    const boundaryX = Math.round(image.width / lanes);
    for (let y = 0; y < image.height; y++) {
      const i = (y * image.width + boundaryX) * 4;
      if (image.data[i] > 220 && image.data[i + 1] > 220 && image.data[i + 2] > 220) paintedPixels++;
      else paintedPixels = 0;
      longestDash = Math.max(longestDash, paintedPixels);
    }
    const dashMetres = longestDash / image.height * ROAD_PAINT_REPEAT_METRES;
    assert.ok(Math.abs(dashMetres - 4.4) < 0.25, `actual baked dash is ${dashMetres}m; preserve the existing approximately 4.4m road rhythm`);
  }
});
