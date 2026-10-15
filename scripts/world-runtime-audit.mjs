#!/usr/bin/env node
/** CPU scene assembly in Chromium with real committed images and native Canvas.
 * No renderer, device performance or visual acceptance is claimed by this check.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(process.env.SMOKE_URL || 'http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  const report = await page.evaluate(async () => {
    // Reuse Vite's exact module identities, including dependency/HMR versions.
    const worldSource = await (await fetch('/src/game/world.ts')).text();
    const imports = [...worldSource.matchAll(/from "([^"]+)"/g)].map(match => match[1]);
    const dependency = name => imports.find(url => url.split('?')[0].endsWith(`/${name}`)) || `/src/game/${name}`;
    const THREE = await import(dependency('three.js'));
    const { TRACKS } = await import(dependency('tracks.ts'));
    const { buildTrack, closestSample } = await import(dependency('spline.ts'));
    const { createWorld } = await import('/src/game/world.ts');
    const { ArcadeCar } = await import('/src/game/vehicle.ts');
    const { CARS } = await import('/src/game/cars.ts');
    const modules = ['arrow', 'beam', 'blob', 'clock', 'curb', 'facade', 'flag', 'flake', 'flare', 'foam', 'ground', 'road', 'sign', 'sky', 'stone', 'tree', 'walk', 'water'];
    const cachedTextures = new Set();
    const collect = value => {
      if (value?.isTexture) cachedTextures.add(value);
      else if (value && typeof value === 'object') for (const item of Object.values(value)) if (item?.isTexture) cachedTextures.add(item);
    };
    const kinds = [undefined, 3, 4, 8, 'city', 'stone', 'dirt', 'sand', 'blue', 'teal', 'dark', 'gold', 'white', 'stop', 'yield', 'none', 'speed50', 'speed80', 'speed90', 'speed120'];
    for (const name of modules) {
      const module = await import(dependency(`${name}-assets.ts`));
      for (const [key, load] of Object.entries(module)) {
        if (key.startsWith('load') && key !== 'loadRoadFor') collect(await load());
      }
      for (const [key, get] of Object.entries(module)) if (key.startsWith('get')) for (const kind of kinds) collect(get(kind));
    }
    const disposedTextures = [];
    const disposals = new WeakMap();
    let duplicateDisposals = 0;
    const originals = [];
    for (const prototype of [THREE.Texture.prototype, THREE.BufferGeometry.prototype, THREE.Material.prototype]) {
      const original = prototype.dispose;
      originals.push(() => { prototype.dispose = original; });
      prototype.dispose = function () {
        const count = (disposals.get(this) || 0) + 1;
        disposals.set(this, count);
        if (count > 1) duplicateDisposals++;
        if (cachedTextures.has(this)) disposedTextures.push(this.source?.data?.src || this.name || 'cached-canvas-texture');
        original.call(this);
      };
    }
    const results = [];
    let buildingImpactVerified = false;
    try {
      for (const definition of TRACKS) {
        let world;
        const result = { track: definition.id };
        try {
          const built = buildTrack(definition);
          world = await createWorld(definition, built, false, false, 'clear');
          let nonFiniteGeometries = 0;
          let meshes = 0;
          world.group.traverse(object => {
            if (object.isMesh) meshes++;
            const positions = object.geometry?.attributes?.position?.array;
            if (positions?.some(value => !Number.isFinite(value))) nonFiniteGeometries++;
          });
          Object.assign(result, { meshes, colliders: world.colliders.length, nonFiniteGeometries });
          if (definition.id === 'ayalon') {
            let crossings = 0;
            let underpassChecks = 0;
            for (const ramp of world.ramps) for (const sample of built.samples) for (const lane of [-0.5, -0.25, 0, 0.25, 0.5]) {
              const dx = sample.x + sample.rx * built.width * lane - ramp.x;
              const dz = sample.z + sample.rz * built.width * lane - ramp.z;
              const along = dx * ramp.sx + dz * ramp.sz;
              const across = dx * ramp.sz - dz * ramp.sx;
              if (Math.abs(along) > ramp.len / 2 || Math.abs(across) > ramp.half) continue;
              crossings++;
              const underside = ramp.y0 + (along / ramp.len + 0.5) * (ramp.y1 - ramp.y0) - 0.475;
              if (underside < sample.y + 4.5) throw new Error(`ramp blocks race road: ${ramp.en}`);
              if (lane === 0) {
                const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
                car.spawn(built, sample.t, 0);
                for (let tick = 0; tick < 24; tick++) car.step(1 / 120, { steer: 0, throttle: 0, brake: 1, drift: false, nitro: false }, built, true, world.colliders, world.streets, world.ramps);
                if (Math.abs(car.y - sample.y) > 0.5) throw new Error(`car snapped onto an overhead ramp: y=${car.y}, road=${sample.y}, ramp=${ramp.en}`);
                underpassChecks++;
              }
            }
            let piers = 0;
            world.group.traverse(object => {
              if (object.name !== 'ayalon-ramp-pier') return;
              piers++;
              if (closestSample(built.samples, object.position.x, object.position.z).dist < built.width / 2 + 1.5) throw new Error('ramp pier occupies race road');
            });
            if (!crossings || !piers || !underpassChecks) throw new Error('interchange clearance check lost its real ramps, piers or underpasses');
            Object.assign(result, { rampCrossingSamples: crossings, rampPiers: piers, underpassChecks, raceRoadClearance: 'passed' });
          }
          world.setClock(0.5);
          world.setTime(true);
          world.setWeather('rain');
          world.tick(1000, built.samples[0].x, built.samples[0].z);
          world.setLod('low');
          world.tick(2000, built.samples[0].x, built.samples[0].z);
          // A real collider built by the track, approached directly along its normal.
          const wall = world.colliders.find(c => c.kind === 'building' && c.hx > 0 && c.hz > 0);
          if (!buildingImpactVerified && wall) {
            const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
            const yaw = wall.yaw || 0;
            const nx = Math.cos(yaw), nz = -Math.sin(yaw);
            const distance = wall.hx + 1.05 - 0.02;
            car.x = wall.x + nx * distance;
            car.z = wall.z + nz * distance;
            car.vx = -nx * 20;
            car.vz = -nz * 20;
            car.yaw = Math.atan2(-car.vx, -car.vz);
            car.speed = 20;
            car.hitColliders([wall]);
            if (car.damage <= 0 || car.impact <= 0) throw new Error('head-on building collision lost its pre-impact damage');
            buildingImpactVerified = true;
          }
          result.operations = 'passed';
        } catch (error) { result.error = String(error); }
        finally { world?.dispose(); world?.dispose(); }
        results.push(result);
      }
    } finally { for (const restore of originals) restore(); }
    return { scope: 'CPU scene assembly with actual TrackDefs, native Canvas and real committed assets; no GPU/device acceptance', results, disposedTextures, duplicateDisposals, buildingImpactVerified };
  });
  const dir = fromRoot('artifacts', 'world-runtime');
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/scenes-all.json`, `${JSON.stringify({ ...report, pageErrors: errors }, null, 2)}\n`);
  const failures = report.results.filter(result => result.error || result.nonFiniteGeometries);
  console.log(JSON.stringify({ count: report.results.length, failures, cachedTextureDisposals: report.disposedTextures.length, duplicateDisposals: report.duplicateDisposals, buildingImpactVerified: report.buildingImpactVerified, pageErrors: errors }, null, 2));
  if (failures.length || report.disposedTextures.length || report.duplicateDisposals || !report.buildingImpactVerified || errors.length) process.exitCode = 1;
} finally { await browser.close(); }
