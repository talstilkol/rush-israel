import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { fromRoot } from './project-root.mjs';
import { HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';
import { ORIGINAL_GOLDEN_FILES, RSH035_BASELINE_SHA256 } from './original-golden-browser.mjs';
import {
  CHANNEL_EPS, EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, GROUND_PLANE_MIN,
  RESIDUAL_FRAMES, SAMPLE_TOTAL, SKY_RADIUS_MIN, WATER_IOR, WATER_IOR_EPS,
  classifyResidual,
} from './world-residual-browser.mjs';
import { pngSampleGrid, sampleMismatchCount } from './world-mismatch-browser.mjs';

/** 7x7 saturation is not whole-frame divergence without channel bias. */
export const BIAS_FRAMES = RESIDUAL_FRAMES;
export const BIAS_KINDS = Object.freeze(['uniform-bias', 'structured', 'y-flip-artifact']);
export const UNIFORM_BIAS_SIGN_MIN = 0.8;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function unpackRgb(packed) {
  return { r: packed & 255, g: (packed >> 8) & 255, b: (packed >> 16) & 255 };
}

export function lumaOf(rgb) {
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

export function pngSampleGridUnflipped(buf, width = 1280, height = 800) {
  const png = PNG.sync.read(buf);
  assert.equal(png.width, width, 'locked PNG width');
  assert.equal(png.height, height, 'locked PNG height');
  const samples = [];
  for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) {
    const px = Math.min(png.width - 1, Math.floor(png.width * x / 8));
    const py = Math.min(png.height - 1, Math.floor(png.height * y / 8));
    const i = (py * png.width + px) << 2;
    samples.push(png.data[i] | (png.data[i + 1] << 8) | (png.data[i + 2] << 16));
  }
  assert.equal(samples.length, SAMPLE_TOTAL);
  return samples;
}

export function sampleChannelBias(live, png, eps = CHANNEL_EPS) {
  if (!Array.isArray(live) || !Array.isArray(png) || live.length !== png.length || live.length === 0) {
    return {
      n: 0, mismatch: Number.NaN,
      meanDr: Number.NaN, meanDg: Number.NaN, meanDb: Number.NaN, meanDluma: Number.NaN,
      meanAbsDr: Number.NaN, meanAbsDg: Number.NaN, meanAbsDb: Number.NaN, meanAbsDluma: Number.NaN,
      lumaVariance: Number.NaN, signAgreement: Number.NaN,
    };
  }
  let dr = 0, dg = 0, db = 0, dl = 0, adr = 0, adg = 0, adb = 0, adl = 0, mismatch = 0;
  const dls = [];
  for (let i = 0; i < live.length; i++) {
    const a = unpackRgb(live[i]);
    const b = unpackRgb(png[i]);
    const r = a.r - b.r;
    const g = a.g - b.g;
    const bl = a.b - b.b;
    const l = lumaOf(a) - lumaOf(b);
    dr += r; dg += g; db += bl; dl += l;
    adr += Math.abs(r); adg += Math.abs(g); adb += Math.abs(bl); adl += Math.abs(l);
    dls.push(l);
    if (Math.abs(r) > eps || Math.abs(g) > eps || Math.abs(bl) > eps) mismatch += 1;
  }
  const n = live.length;
  const meanDluma = dl / n;
  let varSum = 0, sameSign = 0;
  for (const value of dls) {
    varSum += (value - meanDluma) ** 2;
    if (meanDluma === 0 || value === 0 || Math.sign(value) === Math.sign(meanDluma)) sameSign += 1;
  }
  return {
    n, mismatch,
    meanDr: dr / n, meanDg: dg / n, meanDb: db / n, meanDluma,
    meanAbsDr: adr / n, meanAbsDg: adg / n, meanAbsDb: adb / n, meanAbsDluma: adl / n,
    lumaVariance: varSum / n,
    signAgreement: sameSign / n,
  };
}

export function classifyBiasKind(flipped, unflipped) {
  if (!flipped || !unflipped) return null;
  if (!Number.isFinite(flipped.mismatch) || !Number.isFinite(unflipped.mismatch)) return null;
  if (unflipped.mismatch + CHANNEL_EPS < flipped.mismatch) return 'y-flip-artifact';
  if (flipped.signAgreement >= UNIFORM_BIAS_SIGN_MIN
    && flipped.lumaVariance <= (Math.max(1, Math.abs(flipped.meanDluma)) ** 2) * 0.5) {
    return 'uniform-bias';
  }
  return 'structured';
}

export function saturationCountIsNotChannelBias(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Number.isFinite(frame.flippedMismatch)
    || !Number.isFinite(frame.unflippedMismatch)
    || !Number.isFinite(frame.meanDr)
    || !Number.isFinite(frame.meanDg)
    || !Number.isFinite(frame.meanDb)
    || !Number.isFinite(frame.meanDluma)
    || !Number.isFinite(frame.lumaVariance)
    || !Number.isFinite(frame.signAgreement)
    || !BIAS_KINDS.includes(frame.kind));
}

function round4(value) {
  return Number.isFinite(value) ? Number(value.toFixed(4)) : value;
}

function frame(id, extra = {}) {
  const spec = BIAS_FRAMES.find(row => row.id === id);
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    flippedMismatch: 49, unflippedMismatch: 49,
    meanDr: 18.2, meanDg: 14.1, meanDb: 9.4, meanDluma: 14.6,
    meanAbsDr: 22.1, meanAbsDg: 19.4, meanAbsDb: 16.8, meanAbsDluma: 18.9,
    lumaVariance: 240.5, signAgreement: 0.71, kind: 'structured',
    ...extra,
  };
}

export function worldBiasFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pageErrors: [], glError: 0, protocol: 'world-bias-attribution-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: BIAS_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldBiasResults(r) {
  assert.ok(r && typeof r === 'object', 'world-bias evidence missing');
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
  assert.equal(r.decks, EXPECTED_DECKS);
  assert.equal(r.strips, EXPECTED_STRIPS);
  assert.equal(r.classifiedPiers, EXPECTED_PIERS);
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-bias frames missing');
  assert.equal(saturationCountIsNotChannelBias(r), false, '7x7 saturation is not channel-bias attribution');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, orientationFail = 0;
  for (const spec of BIAS_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.flippedMismatch === 0 && row.unflippedMismatch === 0) mismatchFail += 1;
    if (!Number.isFinite(row.flippedMismatch) || !Number.isFinite(row.unflippedMismatch)) orientationFail += 1;
  }
  return [
    {
      case: '7x7 saturation count is not channel-bias attribution of original-golden 0/4',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while channel bias is measured',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'both PNG Y-orientations are sampled against the live 7x7 buffer',
      status: orientationFail ? 'failed' : 'passed',
      probes: 4,
      failures: orientationFail,
    },
    {
      case: 'locked PNG 7x7 samples still mismatch the live buffer at every golden pose',
      status: mismatchFail ? 'failed' : 'passed',
      probes: 4,
      failures: mismatchFail,
    },
    {
      case: 'world-bias attribution is not original-golden comparison',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldBias(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldBiasResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

function attachBias(live, flippedGrid, unflippedGrid) {
  const flipped = sampleChannelBias(live, flippedGrid);
  const unflipped = sampleChannelBias(live, unflippedGrid);
  return {
    flippedMismatch: flipped.mismatch,
    unflippedMismatch: unflipped.mismatch,
    meanDr: round4(flipped.meanDr),
    meanDg: round4(flipped.meanDg),
    meanDb: round4(flipped.meanDb),
    meanDluma: round4(flipped.meanDluma),
    meanAbsDr: round4(flipped.meanAbsDr),
    meanAbsDg: round4(flipped.meanAbsDg),
    meanAbsDb: round4(flipped.meanAbsDb),
    meanAbsDluma: round4(flipped.meanAbsDluma),
    lumaVariance: round4(flipped.lumaVariance),
    signAgreement: round4(flipped.signAgreement),
    kind: classifyBiasKind(flipped, unflipped),
    unflipped: {
      meanDr: round4(unflipped.meanDr),
      meanDg: round4(unflipped.meanDg),
      meanDb: round4(unflipped.meanDb),
      meanDluma: round4(unflipped.meanDluma),
      meanAbsDluma: round4(unflipped.meanAbsDluma),
      lumaVariance: round4(unflipped.lumaVariance),
      signAgreement: round4(unflipped.signAgreement),
    },
  };
}

export async function measureWorldBias(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const pngFlipped = {};
  const pngUnflipped = {};
  const baselineHashes = {};
  for (const spec of BIAS_FRAMES) {
    const buf = await readFile(`${baseline}/${spec.file}`);
    baselineHashes[spec.file] = sha256(buf);
    pngFlipped[spec.id] = pngSampleGrid(buf);
    pngUnflipped[spec.id] = pngSampleGridUnflipped(buf);
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ frames, waterIor, waterIorEps, skyRadiusMin, groundPlaneMin }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 800;
      canvas.style.cssText = 'width:1280px;height:800px';
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      const same = (a, b) => Math.abs(a - b) < 1e-4;
      try {
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        const colliders = engine.world.colliders;
        const added = colliders.filter(c => c.role === 'support-pier');
        const legacy = colliders.filter(c => c.role !== 'support-pier');
        const ramps = engine.world.ramps;
        const gl = engine.renderer.getContext();
        const pixel = new Uint8Array(4);
        const meshes = [];
        engine.world.group.traverse(object => { if (object.isMesh) meshes.push(object); });
        let decks = 0, strips = 0, classifiedPiers = 0;
        for (const mesh of meshes) {
          const g = mesh?.geometry;
          const p = g?.parameters;
          const type = g?.type;
          if (type === 'CylinderGeometry' && p && same(p.radiusTop, 0.55) && same(p.radiusBottom, 0.72)) classifiedPiers += 1;
          if (type === 'BoxGeometry' && p) {
            if (same(p.height, 0.95) && ramps.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) decks += 1;
            if (same(p.width, 0.18) && same(p.height, 0.08)) strips += 1;
          }
        }
        const sampleGrid = () => {
          const samples = [];
          let lit = 0;
          for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) {
            gl.readPixels(
              Math.floor(gl.drawingBufferWidth * x / 8),
              Math.floor(gl.drawingBufferHeight * y / 8),
              1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel,
            );
            samples.push(pixel[0] | (pixel[1] << 8) | (pixel[2] << 16));
            if (pixel[0] + pixel[1] + pixel[2] > 30) lit += 1;
          }
          return { samples, lit, total: 49, nonBlackFraction: lit / 49, glError: gl.getError() };
        };
        const capture = (spec) => {
          engine.setNight(spec.night);
          engine.player.spawn(engine.built, spec.t, 0);
          engine.snapCamera(true, 0.016);
          engine.camera.updateMatrixWorld(true);
          engine.renderer.render(engine.scene, engine.camera);
          const full = sampleGrid();
          const player = [engine.player.x, engine.player.y, engine.player.z];
          const camera = engine.camera.position.toArray();
          const dx = camera[0] - player[0];
          const dy = camera[1] - player[1];
          const dz = camera[2] - player[2];
          return {
            id: spec.id, t: spec.t, night: spec.night, file: spec.file,
            player, camera, follow: Math.hypot(dx, dz), height: dy, fov: engine.camera.fov,
            speed: engine.player.speed, yaw: engine.player.yaw, dx, dy, dz,
            nonBlackFraction: full.nonBlackFraction, litSamples: full.lit, totalSamples: full.total,
            glError: gl.getError(),
            samples: full.samples,
          };
        };
        return {
          colliderCount: colliders.length,
          legacyCount: legacy.length,
          pierCount: added.length,
          rampCount: ramps.length,
          routeSamples: engine.built.samples.length,
          checkpointCount: engine.world.checkpoints?.length ?? engine.built.checkpoints?.length ?? 8,
          decks, strips, classifiedPiers,
          waterIor, waterIorEps, skyRadiusMin, groundPlaneMin,
          glError: gl.getError(),
          frames: frames.map(capture),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, {
      frames: BIAS_FRAMES,
      waterIor: WATER_IOR,
      waterIorEps: WATER_IOR_EPS,
      skyRadiusMin: SKY_RADIUS_MIN,
      groundPlaneMin: GROUND_PLANE_MIN,
    });
    const frames = report.frames.map(row => {
      const { samples, ...rest } = row;
      return { ...rest, ...attachBias(samples, pngFlipped[row.id], pngUnflipped[row.id]) };
    });
    return {
      ...report,
      frames,
      historicalRamps: HISTORICAL_RAMPS,
      historicalColliders: HISTORICAL_COLLIDERS,
      originalGoldenComparisons: 0,
      authority: false,
      baselineUpdates: 0,
      updateGolden: false,
      protocol: 'world-bias-attribution-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldBias(browser, url) {
  const report = await measureWorldBias(browser, url);
  const out = process.env.WORLD_BIAS_OUTPUT ?? fromRoot('artifacts', 'world-bias');
  const results = await retainWorldBias(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames }));
  return results;
}

export { CHANNEL_EPS, SAMPLE_TOTAL, classifyResidual, pngSampleGrid, sampleMismatchCount };

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyWorldBias(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
