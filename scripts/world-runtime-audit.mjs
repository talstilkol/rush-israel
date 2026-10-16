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
    const { buildTrack, closestSample, sampleAtT } = await import(dependency('spline.ts'));
    const { createWorld } = await import('/src/game/world.ts');
    const { ArcadeCar, aiInput } = await import('/src/game/vehicle.ts');
    const { roadLaneOffset, ROAD_UV_METRES, ROAD_PAINT_REPEAT_METRES } = await import('/src/game/road-layout.ts');
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
    const blockingRoadBuildings = (world, built) => {
      const blockers = [];
      const point = new THREE.Vector3();
      world.group.updateMatrixWorld(true);
      world.group.traverse(mesh => {
        if (!mesh.isMesh || mesh.isInstancedMesh || mesh.geometry.type !== 'BoxGeometry') return;
        const size = mesh.geometry.parameters;
        if (size.height < 3 || Math.max(size.width, size.depth) < 4) return;
        const inverse = mesh.matrixWorld.clone().invert();
        for (let index = 0; index < built.samples.length; index++) {
          const sample = built.samples[index];
          for (const lane of [-1, -0.5, 0, 0.5, 1]) {
            const offset = lane * built.width / 2;
            point.set(sample.x + sample.rx * offset, sample.y + 1.2, sample.z + sample.rz * offset).applyMatrix4(inverse);
            if (Math.abs(point.x) < size.width / 2 && Math.abs(point.y) < size.height / 2 && Math.abs(point.z) < size.depth / 2) {
              blockers.push({ name: mesh.name, dimensions: size, position: mesh.position.toArray(), sampleIndex: index, lane });
              return;
            }
          }
        }
      });
      return blockers;
    };
    const results = [];
    let buildingImpactVerified = false;
    try {
      for (const definition of TRACKS) {
        let world;
        const result = { track: definition.id };
        try {
          const built = buildTrack(definition);
          world = await createWorld(definition, built, false, false, 'clear');
          if (['oldjaffa', 'namal', 'haifa', 'rothschild', 'ayalon', 'hermon', 'scopus', 'ramon'].includes(definition.id)) {
            result.blockingRoadBuildings = blockingRoadBuildings(world, built);
            if (result.blockingRoadBuildings.length) throw new Error(`buildings occupy the actual driving path: ${JSON.stringify(result.blockingRoadBuildings)}`);
          }
          let nonFiniteGeometries = 0;
          let meshes = 0;
          const invalidInstanceBuffers = [];
          world.group.traverse(object => {
            if (object.isMesh) meshes++;
            if (object.isInstancedMesh && (!Number.isInteger(object.count) || object.count < 0 || object.count > object.instanceMatrix.count || (object.instanceColor && object.count > object.instanceColor.count))) {
              invalidInstanceBuffers.push({ name: object.name, instances: object.count, capacity: object.instanceMatrix.count, colorCapacity: object.instanceColor?.count });
            }
            const positions = object.geometry?.attributes?.position?.array;
            if (positions?.some(value => !Number.isFinite(value))) nonFiniteGeometries++;
          });
          Object.assign(result, { meshes, colliders: world.colliders.length, nonFiniteGeometries, invalidInstanceBuffers });
          if (invalidInstanceBuffers.length) throw new Error(`instance buffer overflow: ${JSON.stringify(invalidInstanceBuffers)}`);
          const raceRoad = world.group.getObjectByName('rush-race-road');
          if (!raceRoad?.isMesh || raceRoad.material.side !== THREE.FrontSide) throw new Error('missing single-sided race road');
          if (raceRoad.geometry.attributes.normal.array.some((value, i) => i % 3 === 1 && value < -0.0001)) throw new Error('race road normals face below the surface');
          const terrain = world.group.getObjectByName('rush-terrain');
          if (terrain) {
            if (terrain.geometry.attributes.normal.array.some((value, i) => i % 3 === 1 && value <= 0)) throw new Error('terrain folds below its surface');
            world.group.updateMatrixWorld(true);
            const ray = new THREE.Raycaster();
            const matrix = new THREE.Matrix4();
            const root = new THREE.Vector3();
            let grounded = 0;
            const checkSupport = (x,y,z) => {
              ray.set(new THREE.Vector3(x, 2000, z), new THREE.Vector3(0,-1,0));
              const hit = ray.intersectObjects([terrain, world.group.getObjectByName('rush-base-ground')])[0];
              if (!hit || Math.abs(hit.point.y-y) > 0.015) throw new Error(`tree floats or sinks relative to actual terrain at ${x},${z}`);
              grounded++;
            };
            const trunks = world.group.getObjectByName('rush-terrain-tree-trunks');
            if (trunks) for (let i=0;i<trunks.count;i++) {
              trunks.getMatrixAt(i,matrix); matrix.premultiply(trunks.matrixWorld);
              root.setFromMatrixPosition(matrix); checkSupport(root.x,root.y,root.z);
            }
            const cypresses = [];
            world.group.traverse(object => { if(object.name === 'scopus-grounded-cypress') cypresses.push(object); });
            for (const tree of cypresses) {
              tree.getWorldPosition(root); checkSupport(root.x,root.y-3.4,root.z);
              for (let i=0;i<built.samples.length-1;i++) {
                const a=built.samples[i], b=built.samples[i+1], dx=b.x-a.x, dz=b.z-a.z;
                const t=Math.max(0,Math.min(1,((root.x-a.x)*dx+(root.z-a.z)*dz)/(dx*dx+dz*dz || 1)));
                if(Math.hypot(root.x-a.x-dx*t,root.z-a.z-dz*t) < built.width/2+1.2) throw new Error('grounded cypress occupies driving corridor');
              }
            }
            if (definition.id === 'scopus' && cypresses.length !== 32) throw new Error('Scopus cypresses were removed rather than grounded');
            result.terrain = { vertices: terrain.geometry.attributes.position.count, groundedTrees: grounded, groundedCypresses: cypresses.length };
          }
          const dryRoughness = raceRoad.material.roughness;
          if (raceRoad.material.map.repeat.y !== ROAD_UV_METRES / ROAD_PAINT_REPEAT_METRES || raceRoad.material.roughnessMap.repeat.y !== raceRoad.material.map.repeat.y) throw new Error('paint and paint roughness lost their actual metre scale');
          if (raceRoad.material.userData.roadWetness !== 0 || raceRoad.material.clearcoat !== 0) throw new Error('clear daylight road was initialized wet');
          world.setWeather('rain');
          if (raceRoad.material.userData.roadWetness !== 1 || raceRoad.material.roughness >= dryRoughness) throw new Error('rain did not change the real road material');
          world.setWeather('clear');
          world.setTime(true);
          if (raceRoad.material.userData.roadWetness !== 0 || raceRoad.material.roughness <= 0.7) throw new Error('clear night retained wet road shading');
          const roadPuddles = world.group.getObjectByName('rush-road-puddles');
          if (!roadPuddles || roadPuddles.visible) throw new Error('clear night retained road puddles');
          result.roadMaterialWeather = { dryRoughness, clearNightRoughness: raceRoad.material.roughness, wetnessReset: true };
          if (definition.id === 'haifa') {
            const bounded = world.colliders.filter(collider => collider.maxY != null);
            if (bounded.length !== 5 || bounded.some(collider => !Number.isFinite(collider.maxY))) throw new Error('Haifa house roofs lack their real collision height bounds');
            const checks = [];
            for (const definition of CARS) {
              const car = new ArcadeCar(definition, definition.nameEn);
              car.spawn(built, built.samples[138].t, -2.2);
              for (let tick=0;tick<120*8;tick++) car.step(1/120,aiInput(car,built),built,true,world.colliders,world.streets,world.ramps);
              const row = {car:definition.id,progress:car.progress,speed:car.speed,damage:car.damage};
              if (car.progress <= built.samples[147].t || car.damage !== 0) throw new Error(`actual elevated Haifa route remains blocked: ${JSON.stringify(row)}`);
              checks.push(row);
            }
            result.haifaHeightChecks = checks;
          }
          if (definition.id === 'rothschild') {
            const lanes = [];
            for (const definition of CARS) for (const side of [-1, 1]) for (const follow of [false, true]) {
              const car = new ArcadeCar(definition, definition.nameEn);
              car.aiOffset = roadLaneOffset(built, side);
              car.spawn(built, 0.08, car.aiOffset);
              let minimumClearance = Infinity;
              for (let tick = 0; tick < 120 * 8; tick++) {
                car.step(1 / 120, follow ? aiInput(car, built) : { steer: 0, throttle: 1, brake: 0, drift: false, nitro: false }, built, true, world.colliders, world.streets, world.ramps);
                const road = sampleAtT(built.samples, car.progress);
                const lateral = (car.x - road.x) * road.rx + (car.z - road.z) * road.rz;
                minimumClearance = Math.min(minimumClearance, side * lateral - built.medianHalfWidth);
              }
              const row = { car: definition.id, side, follow, minimumClearance, damage: car.damage, speed: car.speed };
              if (minimumClearance <= 1.4 || car.damage !== 0 || car.speed <= 15) throw new Error(`median lane regression with real world colliders: ${JSON.stringify(row)}`);
              lanes.push(row);
            }
            result.medianLaneChecks = lanes;
          }
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
