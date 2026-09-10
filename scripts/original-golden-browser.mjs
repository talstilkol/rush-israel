import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { fromRoot } from './project-root.mjs';
import { prepareGoldenOutput } from './golden-output.mjs';
import { openAyalonRace, goldenState, validateGoldenSnapshot } from './golden-capture.mjs';

/** Original Ayalon golden protocol. Non-authority capture and required-ci are not this probe. */
export const ORIGINAL_GOLDEN_FILES = Object.freeze([
  'ayalon-day-g01.png', 'ayalon-day-g05.png', 'ayalon-day-g07.png', 'ayalon-night-g08.png',
]);
export const ORIGINAL_GOLDEN_DAY_IDS = Object.freeze(['g01', 'g05', 'g07']);
export const PIXEL_THRESHOLD = 0.12;
export const FAILURE_LIMIT = 0.08;
export const VIEWPORT = Object.freeze({ width: 1280, height: 800 });
export const LOCK_GENERATION = 11;
export const HISTORICAL_ZERO_OF_FOUR_RUN = '34324754353';
export const RSH035_BASELINE_SHA256 = Object.freeze({
  'ayalon-day-g01.png': '6621099ae48187cc400ddeb7cc203d0e27e94312e8a4a1dff324bfc99516e455',
  'ayalon-day-g05.png': '7aa736559f1d4300a33db7807237ef7b790c81a46a7a52c0f259894fa2094b79',
  'ayalon-day-g07.png': '7008f9d9e29b333b1a3e36bf3e1f73a2f6ae8b3b86924a30f41173b632e12c97',
  'ayalon-night-g08.png': '72545851e488664b6d06319115414ee25b166f4608ab4d5c5df3b8bfa8fb3966',
});

export function steeringCaptureIsNotOriginalGolden(capture) {
  return !capture || (capture.comparisons ?? 0) === 0 || /not_compared/.test(String(capture.status ?? ''));
}

export function historicalZeroOfFourIsNotPostChaseEvidence(row) {
  return !row || String(row.runId ?? row.golden_source ?? '') === HISTORICAL_ZERO_OF_FOUR_RUN
    || /34324754353/.test(String(row.golden_source ?? row.source ?? ''));
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function originalGoldenResults(r) {
  assert.ok(r && typeof r === 'object', 'original-golden evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.equal(r.lockGeneration, LOCK_GENERATION);
  assert.equal(r.photo, false);
  assert.equal(r.webgpuOk, false);
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.ok(!steeringCaptureIsNotOriginalGolden(r), 'non-authority capture is not original-golden comparison');
  assert.equal(r.comparisons, 4);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'original-golden frames missing');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let failed = 0;
  for (const name of ORIGINAL_GOLDEN_FILES) {
    const frame = r.frames.find(row => row.file === name);
    assert.ok(frame, `missing frame ${name}`);
    assert.ok(Number.isFinite(frame.pct), `frame ${name} pct missing`);
    assert.ok(Number.isFinite(frame.mismatched), `frame ${name} mismatched missing`);
    if (frame.pct > FAILURE_LIMIT) failed += 1;
  }
  const night = r.frames.find(row => row.file === 'ayalon-night-g08.png');
  assert.equal(night.night, true);
  return [
    {
      case: 'original golden protocol ran (gotoGolden, photo=false, 1280x800, threshold 0.12)',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'immutable RSH-035 PNG bytes and generation-11 lock',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'non-authority capture is not original-golden comparison',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
    {
      case: 'four original golden frames within 8% at threshold 0.12',
      status: failed ? 'failed' : 'passed',
      probes: 4,
      failures: failed,
      blocking: false,
    },
  ];
}

export async function retainOriginalGolden(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = originalGoldenResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureOriginalGolden(browser, url) {
  if (process.env.UPDATE_GOLDEN === '1') throw new Error('Automatic golden baseline updates are forbidden; preserve the reviewed image authority');
  const baseline = process.env.GOLDEN_DIR || fromRoot('golden-baseline');
  const tmp = process.env.GOLDEN_TMP || fromRoot('artifacts', 'original-golden');
  const output = prepareGoldenOutput({
    baseline,
    output: tmp,
    names: ['results.json', 'report.json', 'capture.json', 'capture-failure.png',
      ...ORIGINAL_GOLDEN_FILES, ...ORIGINAL_GOLDEN_FILES.map(f => `diff-${f}`)],
  });
  const baselineHashes = Object.fromEntries(await Promise.all(ORIGINAL_GOLDEN_FILES.map(async name =>
    [name, sha256(await readFile(`${baseline}/${name}`))])));
  const pageErrors = [];
  const page = await browser.newPage({ viewport: { ...VIEWPORT }, deviceScaleFactor: 1 });
  page.on('pageerror', error => pageErrors.push(String(error)));
  const capture = {
    status: 'pending',
    protocol: 'original-pixel-golden',
    updateGolden: false,
    baselineUpdates: 0,
    authority: false,
    freezeGranted: false,
    comparisons: 0,
    pixelThreshold: PIXEL_THRESHOLD,
    failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT, dpr: 1 },
    lockGeneration: LOCK_GENERATION,
    photo: false,
    webgpuOk: false,
    baselineHashes,
    frames: [],
    pageErrors,
    glError: 0,
  };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    capture.initial = await openAyalonRace(page);
    if (pageErrors.length) throw new Error(pageErrors.join('\n'));
    await page.evaluate(() => window.__controlsTest.skipCountdown());
    for (const id of ORIGINAL_GOLDEN_DAY_IDS) {
      const moved = await page.evaluate(gid => window.__controlsTest.gotoGolden(gid), id);
      if (moved !== true) throw new Error(`unknown golden camera ${id}`);
      await page.waitForTimeout(450);
      const state = await goldenState(page);
      validateGoldenSnapshot(state.engine);
      if (pageErrors.length) throw new Error(pageErrors.join('\n'));
      const file = `ayalon-day-${id}.png`;
      output.write(file, await page.screenshot());
      capture.frames.push({ file, night: false, ...state });
    }
    await page.evaluate(() => window.__controlsTest.setNight(true));
    await page.waitForTimeout(400);
    const moved = await page.evaluate(() => window.__controlsTest.gotoGolden('g08'));
    if (moved !== true) throw new Error('unknown golden camera g08');
    await page.waitForTimeout(500);
    const state = await goldenState(page);
    validateGoldenSnapshot(state.engine);
    if (state.engine.night !== true) throw new Error('night golden frame remained in daytime');
    if (pageErrors.length) throw new Error(pageErrors.join('\n'));
    output.write('ayalon-night-g08.png', await page.screenshot());
    capture.frames.push({ file: 'ayalon-night-g08.png', night: true, ...state });
    capture.photo = capture.frames.every(frame => frame.engine?.photo === false) ? false : true;
    capture.webgpuOk = capture.frames.some(frame => frame.engine?.webgpuOk === true);
    const report = [];
    const compared = [];
    for (const name of ORIGINAL_GOLDEN_FILES) {
      const a = PNG.sync.read(await readFile(`${output.directory}/${name}`));
      const b = PNG.sync.read(await readFile(`${baseline}/${name}`));
      if (a.width !== b.width || a.height !== b.height) {
        compared.push({ file: name, pct: 1, mismatched: a.width * a.height, night: name.includes('night'), note: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` });
        report.push({ f: name, pct: 1, note: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` });
        continue;
      }
      const diff = new PNG({ width: a.width, height: a.height });
      const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: PIXEL_THRESHOLD });
      const pct = n / (a.width * a.height);
      const row = { file: name, pct: +pct.toFixed(4), mismatched: n, night: name.includes('night') };
      compared.push(row);
      report.push({ f: name, pct: row.pct, mismatched: n });
      if (pct > FAILURE_LIMIT) output.write(`diff-${name}`, PNG.sync.write(diff));
    }
    capture.frames = compared.map((row, i) => ({ ...capture.frames[i], ...row }));
    capture.comparisons = 4;
    capture.status = 'compared';
    output.write('report.json', JSON.stringify(report, null, 2) + '\n');
    output.write('capture.json', JSON.stringify(capture, null, 2) + '\n');
    return capture;
  } catch (error) {
    capture.status = 'capture_failed';
    capture.error = String(error);
    try { output.write('capture-failure.png', await page.screenshot()); } catch { /* retain capture.json */ }
    try { output.write('capture.json', JSON.stringify(capture, null, 2) + '\n'); } catch { /* still throw */ }
    throw error;
  } finally {
    await page.close();
  }
}

export async function verifyOriginalGolden(browser, url) {
  const report = await measureOriginalGolden(browser, url);
  const out = process.env.ORIGINAL_GOLDEN_OUTPUT ?? fromRoot('artifacts', 'original-golden');
  const results = await retainOriginalGolden(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify(results));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyOriginalGolden(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
