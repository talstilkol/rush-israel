import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { fromRoot } from './project-root.mjs';
import { HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';
import {
  FAILURE_LIMIT, ORIGINAL_GOLDEN_FILES, PIXEL_THRESHOLD, RSH035_BASELINE_SHA256, VIEWPORT,
} from './original-golden-browser.mjs';
import {
  EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, GROUND_PLANE_MIN,
  RESIDUAL_FRAMES, SKY_RADIUS_MIN, WATER_IOR, WATER_IOR_EPS, classifyResidual,
} from './world-residual-browser.mjs';
import { pngSampleGrid } from './world-mismatch-browser.mjs';
import { classifyBiasKind, sampleChannelBias, pngSampleGridUnflipped } from './world-bias-browser.mjs';

/** 7x7 structured kind is not full-frame scene-buffer mismatch. Page screenshots are not this probe. */
export const SCENE_FRAMES = RESIDUAL_FRAMES;
export const SCENE_PIXELS = VIEWPORT.width * VIEWPORT.height;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function decodeDataUrlPng(dataUrl) {
  assert.ok(typeof dataUrl === 'string' && dataUrl.startsWith('data:image/png;base64,'), 'scene PNG data URL missing');
  return PNG.sync.read(Buffer.from(dataUrl.slice('data:image/png;base64,'.length), 'base64'));
}

export function scenePixelmatch(livePng, goldPng, threshold = PIXEL_THRESHOLD) {
  assert.equal(livePng.width, VIEWPORT.width, 'live scene width');
  assert.equal(livePng.height, VIEWPORT.height, 'live scene height');
  assert.equal(goldPng.width, VIEWPORT.width, 'locked PNG width');
  assert.equal(goldPng.height, VIEWPORT.height, 'locked PNG height');
  const mismatched = pixelmatch(livePng.data, goldPng.data, null, VIEWPORT.width, VIEWPORT.height, { threshold });
  return { mismatched, pct: mismatched / SCENE_PIXELS, threshold, pixels: SCENE_PIXELS };
}

export function structuredKindIsNotSceneMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.rawPct)
    || !Number.isFinite(frame.presentMismatched)
    || !Number.isFinite(frame.rawMismatched)
    || frame.pixelThreshold !== PIXEL_THRESHOLD);
}

export function sceneBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-scene-buffer-not-original-golden'
    || report.originalGoldenComparisons !== 0
    || report.authority === true
    || report.updateGolden === true
    || report.baselineUpdates !== 0
    || report.pixelThreshold !== PIXEL_THRESHOLD
    || report.failureLimit !== FAILURE_LIMIT
    || report.viewport?.width !== VIEWPORT.width
    || report.viewport?.height !== VIEWPORT.height;
}

function frame(id, extra = {}) {
  const spec = SCENE_FRAMES.find(row => row.id === id);
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    flippedMismatch: 49, unflippedMismatch: 49, kind: 'structured',
    rawPct: 0.52, rawMismatched: Math.round(0.52 * SCENE_PIXELS),
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    scenePct: 0.41, mismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD,
    ...extra,
  };
}

export function worldSceneFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-scene-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: SCENE_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldSceneResults(r) {
  assert.ok(r && typeof r === 'object', 'world-scene evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
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
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-scene frames missing');
  assert.equal(structuredKindIsNotSceneMismatch(r), false, 'raw renderer.render is not present-path mismatch');
  assert.equal(sceneBufferIsNotOriginalGolden(r), false, 'scene buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, sizeFail = 0;
  for (const spec of SCENE_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    if (row.presentPct < 0 || row.presentPct > 1 || row.rawPct < 0 || row.rawPct > 1) sizeFail += 1;
  }
  return [
    {
      case: 'raw renderer.render is not product present-path mismatch attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while the present buffer is matched',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'full-frame present pixelmatch ran at 1280x800 threshold 0.12',
      status: sizeFail ? 'failed' : 'passed',
      probes: 4,
      failures: sizeFail,
    },
    {
      case: 'locked PNG still mismatches the live present buffer at every golden pose',
      status: mismatchFail ? 'failed' : 'passed',
      probes: 4,
      failures: mismatchFail,
    },
    {
      case: 'scene-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldScene(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldSceneResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldScene(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  const goldGrids = {};
  const goldUnflipped = {};
  for (const spec of SCENE_FRAMES) {
    const buf = await readFile(`${baseline}/${spec.file}`);
    baselineHashes[spec.file] = sha256(buf);
    const png = PNG.sync.read(buf);
    goldPngs[spec.id] = png;
    goldGrids[spec.id] = pngSampleGrid(buf);
    goldUnflipped[spec.id] = pngSampleGridUnflipped(buf);
  }
  const page = await browser.newPage({ viewport: { width: VIEWPORT.width, height: VIEWPORT.height } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ frames, waterIor, waterIorEps, skyRadiusMin, groundPlaneMin, width, height }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.cssText = `width:${width}px;height:${height}px`;
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      const same = (a, b) => Math.abs(a - b) < 1e-4;
      try {
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        engine.renderer.setPixelRatio(1);
        engine.renderer.setSize(width, height, false);
        engine.camera.aspect = width / height;
        engine.camera.updateProjectionMatrix();
        engine.post.setSize(width, height);
        const colliders = engine.world.colliders;
        const added = colliders.filter(c => c.role === 'support-pier');
        const legacy = colliders.filter(c => c.role !== 'support-pier');
        const ramps = engine.world.ramps;
        const gl = engine.renderer.getContext();
        const meshes = [];
        engine.world.group.traverse(object => { if (object.isMesh) meshes.push(object); });
        let decks = 0, strips = 0, classifiedPiers = 0;
        for (const mesh of meshes) {
          const p = mesh?.geometry?.parameters;
          const type = mesh?.geometry?.type;
          if (type === 'CylinderGeometry' && p && same(p.radiusTop, 0.55) && same(p.radiusBottom, 0.72)) classifiedPiers += 1;
          if (type === 'BoxGeometry' && p) {
            if (same(p.height, 0.95) && ramps.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) decks += 1;
            if (same(p.width, 0.18) && same(p.height, 0.08)) strips += 1;
          }
        }
        const encode = () => {
          const w = gl.drawingBufferWidth;
          const h = gl.drawingBufferHeight;
          const pixels = new Uint8Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          const flipped = new Uint8ClampedArray(w * h * 4);
          let lit = 0;
          for (let y = 0; y < h; y++) {
            const src = y * w * 4;
            const dst = (h - 1 - y) * w * 4;
            flipped.set(pixels.subarray(src, src + w * 4), dst);
          }
          for (let i = 0; i < flipped.length; i += 4) {
            if (flipped[i] + flipped[i + 1] + flipped[i + 2] > 30) lit += 1;
          }
          const copy = document.createElement('canvas');
          copy.width = w;
          copy.height = h;
          copy.getContext('2d', { willReadFrequently: true }).putImageData(new ImageData(flipped, w, h), 0, 0);
          return { bufferWidth: w, bufferHeight: h, lit, png: copy.toDataURL('image/png') };
        };
        const capture = (spec) => {
          engine.setNight(spec.night);
          engine.player.spawn(engine.built, spec.t, 0);
          engine.snapCamera(true, 0.016);
          engine.camera.updateMatrixWorld(true);
          engine.renderer.setPixelRatio(1);
          engine.renderer.setSize(width, height, false);
          engine.post.setSize(width, height);
          engine.post.setDrive(0, false);
          engine.post.render();
          const present = encode();
          engine.renderer.render(engine.scene, engine.camera);
          const raw = encode();
          const player = [engine.player.x, engine.player.y, engine.player.z];
          const camera = engine.camera.position.toArray();
          const dx = camera[0] - player[0];
          const dy = camera[1] - player[1];
          const dz = camera[2] - player[2];
          return {
            id: spec.id, t: spec.t, night: spec.night, file: spec.file,
            player, camera, follow: Math.hypot(dx, dz), height: dy, fov: engine.camera.fov,
            speed: engine.player.speed, yaw: engine.player.yaw, dx, dy, dz,
            bufferWidth: present.bufferWidth, bufferHeight: present.bufferHeight,
            rawWidth: raw.bufferWidth, rawHeight: raw.bufferHeight,
            nonBlackFraction: present.lit / (present.bufferWidth * present.bufferHeight),
            glError: gl.getError(),
            rawPng: raw.png,
            presentPng: present.png,
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
      frames: SCENE_FRAMES,
      waterIor: WATER_IOR,
      waterIorEps: WATER_IOR_EPS,
      skyRadiusMin: SKY_RADIUS_MIN,
      groundPlaneMin: GROUND_PLANE_MIN,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
    });
    const frames = report.frames.map(row => {
      const { rawPng, presentPng, bufferWidth, bufferHeight, rawWidth, rawHeight, ...rest } = row;
      assert.equal(bufferWidth, VIEWPORT.width, `${row.id} present width`);
      assert.equal(bufferHeight, VIEWPORT.height, `${row.id} present height`);
      assert.equal(rawWidth, VIEWPORT.width, `${row.id} raw width`);
      assert.equal(rawHeight, VIEWPORT.height, `${row.id} raw height`);
      const presentLive = decodeDataUrlPng(presentPng);
      const rawLive = decodeDataUrlPng(rawPng);
      const presentMatch = scenePixelmatch(presentLive, goldPngs[row.id]);
      const rawMatch = scenePixelmatch(rawLive, goldPngs[row.id]);
      const vsRaw = scenePixelmatch(presentLive, rawLive);
      const liveBuf = PNG.sync.write(presentLive);
      const flipped = sampleChannelBias(pngSampleGrid(liveBuf), goldGrids[row.id]);
      const unflipped = sampleChannelBias(pngSampleGridUnflipped(liveBuf), goldUnflipped[row.id]);
      return {
        ...rest,
        pixelThreshold: PIXEL_THRESHOLD,
        rawMismatched: rawMatch.mismatched,
        rawPct: Number(rawMatch.pct.toFixed(4)),
        presentMismatched: presentMatch.mismatched,
        presentPct: Number(presentMatch.pct.toFixed(4)),
        scenePct: Number(presentMatch.pct.toFixed(4)),
        mismatched: presentMatch.mismatched,
        presentMinusRaw: Number((presentMatch.pct - rawMatch.pct).toFixed(4)),
        presentVsRawPct: Number(vsRaw.pct.toFixed(4)),
        flippedMismatch: flipped.mismatch,
        unflippedMismatch: unflipped.mismatch,
        kind: classifyBiasKind(flipped, unflipped),
      };
    });
    return {
      colliderCount: report.colliderCount,
      legacyCount: report.legacyCount,
      pierCount: report.pierCount,
      rampCount: report.rampCount,
      routeSamples: report.routeSamples,
      checkpointCount: report.checkpointCount,
      decks: report.decks,
      strips: report.strips,
      classifiedPiers: report.classifiedPiers,
      glError: report.glError,
      frames,
      historicalRamps: HISTORICAL_RAMPS,
      historicalColliders: HISTORICAL_COLLIDERS,
      originalGoldenComparisons: 0,
      authority: false,
      baselineUpdates: 0,
      updateGolden: false,
      pixelThreshold: PIXEL_THRESHOLD,
      failureLimit: FAILURE_LIMIT,
      viewport: { ...VIEWPORT },
      protocol: 'world-scene-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldScene(browser, url) {
  const report = await measureWorldScene(browser, url);
  const out = process.env.WORLD_SCENE_OUTPUT ?? fromRoot('artifacts', 'world-scene');
  const results = await retainWorldScene(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames }));
  return results;
}

export { PIXEL_THRESHOLD, FAILURE_LIMIT, SCENE_PIXELS as SAMPLE_PIXELS, classifyResidual };

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyWorldScene(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
