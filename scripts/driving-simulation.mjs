#!/usr/bin/env node
// Real production vehicle and track modules. This is simulation-only evidence;
// it does not include world colliders, rendering, device input or a browser race.
import './runtime-typescript-loader.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';
const { TRACKS, V1_TRACK_IDS } = await import('../src/game/tracks.ts');
const { buildTrack } = await import('../src/game/spline.ts');
const { CARS } = await import('../src/game/cars.ts');
const { ArcadeCar, aiInput, SURFACE_GRIP } = await import('../src/game/vehicle.ts');
const { PHYSICS_DT } = await import('../src/game/physics.ts');
const { applyTune, emptyTune } = await import('../src/game/garage.ts');
const results = [];
for (const def of TRACKS.filter(track => V1_TRACK_IDS.includes(track.id))) {
  const track = buildTrack(def);
  const car = new ArcadeCar(applyTune(CARS[0], emptyTune()), CARS[0].nameEn);
  car.handling = 'arcade';
  car.baseGrip = car.surfaceGrip = SURFACE_GRIP[def.theme] ?? 1;
  car.spawn(track, 0.006, 0);
  let ticks = 0;
  let offRoad = 0;
  for (; ticks < 120 * 1200 && car.lap < (track.closed ? 3 : 1); ticks++) {
    const previous = car.progress;
    car.step(PHYSICS_DT, aiInput(car, track), track, true);
    car.consumeCheckpoints(track, previous);
    if (!car.onTrack) offRoad++;
    if (![car.x, car.y, car.z, car.speed, car.progress].every(Number.isFinite)) throw new Error(`non-finite physics: ${def.id}`);
  }
  const row = { track: def.id, laps: car.lap, seconds: ticks * PHYSICS_DT, offRoadRatio: offRoad / Math.max(1, ticks), complete: car.lap >= (track.closed ? 3 : 1) };
  results.push(row);
  console.log(JSON.stringify(row));
}
await mkdir(fromRoot('artifacts', 'driving-simulation'), { recursive: true });
await writeFile(fromRoot('artifacts', 'driving-simulation', 'v1.json'), `${JSON.stringify({ kind: 'simulation-only', results }, null, 2)}\n`);
if (results.some(result => !result.complete)) process.exitCode = 1;
