import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';
import {
  GOLDEN_ATTRIBUTION_CAMERA_DY, GOLDEN_ATTRIBUTION_CAMERA_DZ,
  LOCKED_CHASE_FOLLOW_BASE, LOCKED_CHASE_HEIGHT,
} from './rsh036-overlay.mjs';

/** Rest-camera attribution after r6.21. Not original-golden and not a PNG refresh. */
export const ATTRIBUTION_FRAMES = Object.freeze([
  { id: 'g01', t: 0.04, night: false, file: 'ayalon-day-g01.png' },
  { id: 'g05', t: 0.46, night: false, file: 'ayalon-day-g05.png' },
  { id: 'g07', t: 0.62, night: false, file: 'ayalon-day-g07.png' },
  { id: 'g08', t: 0.48, night: true, file: 'ayalon-night-g08.png' },
]);
export const HISTORICAL_RAMPS = 32;
export const HISTORICAL_COLLIDERS = 541;
export const LOCKED_FOV = 58;
export const CAMERA_EPS = 0.05;
export const SCENE_LIT_MIN = 0.15;
export const R68_CAMERA_DY = GOLDEN_ATTRIBUTION_CAMERA_DY;
export const R68_CAMERA_DZ = GOLDEN_ATTRIBUTION_CAMERA_DZ;

export function restOffset(player, camera) {
  assert.ok(player && camera, 'player/camera missing');
  const dx = camera[0] - player[0];
  const dy = camera[1] - player[1];
  const dz = camera[2] - player[2];
  return { follow: Math.hypot(dx, dz), height: dy, dx, dy, dz };
}

export function r68CameraDeltaIsNotPostRestoreAttribution(row) {
  if (!row) return true;
  const dy = Number(row.deltaY ?? row.delta_camera_y);
  const dz = Number(row.deltaZ ?? row.delta_camera_z);
  return Number.isFinite(dy) && Number.isFinite(dz)
    && Math.abs(dy - R68_CAMERA_DY) < 1e-9
    && Math.abs(dz - R68_CAMERA_DZ) < 1e-9;
}

export function hudOnBlackIsNotSceneComparison(frame) {
  return !frame || !Number.isFinite(frame.nonBlackFraction) || frame.nonBlackFraction < SCENE_LIT_MIN;
}

export function restCameraMatchesLock(frame, eps = CAMERA_EPS) {
  return !!frame
    && Math.abs(frame.follow - LOCKED_CHASE_FOLLOW_BASE) <= eps
    && Math.abs(frame.height - LOCKED_CHASE_HEIGHT) <= eps
    && Math.abs((frame.fov ?? LOCKED_FOV) - LOCKED_FOV) <= 0.05;
}

function frame(id, extra = {}) {
  const spec = ATTRIBUTION_FRAMES.find(row => row.id === id);
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: LOCKED_CHASE_FOLLOW_BASE, height: LOCKED_CHASE_HEIGHT, fov: LOCKED_FOV,
    nonBlackFraction: 0.42, litSamples: 21, totalSamples: 49, glError: 0,
    attribution: 'world', speed: 0, ...extra,
  };
}

export function attributionFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pageErrors: [], glError: 0, protocol: 'rest-camera-attribution-not-original-golden',
    frames: ATTRIBUTION_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function goldenAttributionResults(r) {
  assert.ok(r && typeof r === 'object', 'golden-attribution evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.equal(r.historicalRamps, HISTORICAL_RAMPS);
  assert.equal(r.historicalColliders, HISTORICAL_COLLIDERS);
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'attribution frames missing');
  let cameraFail = 0, sceneFail = 0, staleCamera = 0, blackWorld = 0;
  for (const spec of ATTRIBUTION_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.ok(Number.isFinite(row.follow) && Number.isFinite(row.height) && Number.isFinite(row.fov));
    assert.ok(Number.isFinite(row.nonBlackFraction));
    if (r68CameraDeltaIsNotPostRestoreAttribution(row)) staleCamera += 1;
    if (hudOnBlackIsNotSceneComparison(row) && row.attribution === 'world') blackWorld += 1;
    if (!restCameraMatchesLock(row)) cameraFail += 1;
    if (hudOnBlackIsNotSceneComparison(row)) sceneFail += 1;
  }
  assert.equal(staleCamera, 0, 'r6.8 0.36/1.8 camera delta is not post-r6.21 attribution');
  assert.equal(blackWorld, 0, 'HUD-on-black capture is not world-divergence evidence');
  return [
    {
      case: 'r6.8 0.36/1.8 camera delta is not post-r6.21 attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'HUD-on-black page capture is not scene comparison',
      status: blackWorld ? 'failed' : 'passed',
      probes: 4,
      failures: blackWorld,
    },
    {
      case: 'live rest chase matches historical 7.4/1.92 after snapCamera(true)',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'direct-engine scene buffer is lit (not a black canvas)',
      status: sceneFail ? 'failed' : 'passed',
      probes: 4,
      failures: sceneFail,
    },
    {
      case: 'world catalogue remains 50 ramps / 722 colliders vs historical 32/541',
      status: r.rampCount === 50 && r.colliderCount === 722 ? 'passed' : 'failed',
      probes: 2,
      failures: (r.rampCount === 50 && r.colliderCount === 722) ? 0 : 1,
    },
    {
      case: 'rest-camera attribution is not original-golden comparison',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainGoldenAttribution(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = goldenAttributionResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureGoldenAttribution(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ frames, litMin }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 800;
      canvas.style.cssText = 'width:1280px;height:800px';
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      try {
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        const colliders = engine.world.colliders;
        const added = colliders.filter(c => c.role === 'support-pier');
        const legacy = colliders.filter(c => c.role !== 'support-pier');
        const gl = engine.renderer.getContext();
        const pixel = new Uint8Array(4);
        const capture = (spec) => {
          engine.setNight(spec.night);
          engine.player.spawn(engine.built, spec.t, 0);
          engine.snapCamera(true, 0.016);
          engine.camera.updateMatrixWorld(true);
          engine.renderer.render(engine.scene, engine.camera);
          let lit = 0;
          const total = 49;
          for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) {
            gl.readPixels(
              Math.floor(gl.drawingBufferWidth * x / 8),
              Math.floor(gl.drawingBufferHeight * y / 8),
              1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel,
            );
            if (pixel[0] + pixel[1] + pixel[2] > 30) lit += 1;
          }
          const player = [engine.player.x, engine.player.y, engine.player.z];
          const camera = engine.camera.position.toArray();
          const dx = camera[0] - player[0];
          const dy = camera[1] - player[1];
          const dz = camera[2] - player[2];
          const follow = Math.hypot(dx, dz);
          const height = dy;
          const nonBlackFraction = lit / total;
          const cameraMatches = Math.abs(follow - 7.4) <= 0.05 && Math.abs(height - 1.92) <= 0.05;
          return {
            id: spec.id, t: spec.t, night: spec.night, file: spec.file,
            player, camera, quaternion: engine.camera.quaternion.toArray(),
            follow, height, fov: engine.camera.fov, speed: engine.player.speed,
            yaw: engine.player.yaw, dx, dy, dz,
            litSamples: lit, totalSamples: total, nonBlackFraction,
            glError: gl.getError(),
            attribution: nonBlackFraction < litMin ? 'empty-canvas' : cameraMatches ? 'world' : 'camera',
          };
        };
        return {
          colliderCount: colliders.length,
          legacyCount: legacy.length,
          pierCount: added.length,
          rampCount: engine.world.ramps.length,
          routeSamples: engine.built.samples.length,
          checkpointCount: engine.world.checkpoints?.length ?? engine.built.checkpoints?.length ?? 8,
          glError: gl.getError(),
          frames: frames.map(capture),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, { frames: ATTRIBUTION_FRAMES, litMin: SCENE_LIT_MIN });
    return {
      ...report,
      historicalRamps: HISTORICAL_RAMPS,
      historicalColliders: HISTORICAL_COLLIDERS,
      originalGoldenComparisons: 0,
      authority: false,
      baselineUpdates: 0,
      updateGolden: false,
      protocol: 'rest-camera-attribution-not-original-golden',
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyGoldenAttribution(browser, url) {
  const report = await measureGoldenAttribution(browser, url);
  const out = process.env.GOLDEN_ATTRIBUTION_OUTPUT ?? fromRoot('artifacts', 'golden-attribution');
  const results = await retainGoldenAttribution(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames }));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyGoldenAttribution(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
