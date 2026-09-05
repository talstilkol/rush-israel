import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, symlinkSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateGoldenSnapshot, assertGoldenDirectories, openAyalonRace } from './golden-capture.mjs';
import { fromRoot } from './project-root.mjs';
const valid = { track: 'ayalon', quality: 'high', weather: 'clear', photo: false, webgpuOk: false, speed: 0, progress: 0.04 };
test('actual Ayalon high-quality WebGL snapshot is accepted without modifying it', () => {
  assert.equal(validateGoldenSnapshot(valid), valid);
});
for (const [key, value] of [['track','rothschild'],['quality','low'],['weather','rain'],['photo',true],['webgpuOk',true],['speed',NaN],['progress',Infinity]]) {
  test(`golden capture rejects incorrect ${key}`, () => assert.throws(() => validateGoldenSnapshot({ ...valid, [key]: value })));
}
test('empty or missing engine evidence cannot be captured', () => {
  assert.throws(() => validateGoldenSnapshot(null)); assert.throws(() => validateGoldenSnapshot({}));
});
test('golden output cannot overlap the baseline, including symlink aliases', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'rush-golden-path-'));
  try {
    const base = path.join(root, 'baseline'); mkdirSync(base);
    for (const output of [base, root, path.join(base, 'nested')]) assert.throws(() => assertGoldenDirectories(base, output), /overlap/);
    const alias = path.join(root, 'alias'); symlinkSync(base, alias);
    assert.throws(() => assertGoldenDirectories(base, path.join(alias, 'new')), /overlap/);
    assert.equal(assertGoldenDirectories(base, path.join(root, 'artifacts', 'run')).output, path.join(root, 'artifacts', 'run'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('readiness timeouts are finite, positive and passed in the options position', async () => {
  for (const timeoutMs of [0, -1, NaN, Infinity]) await assert.rejects(openAyalonRace({}, { timeoutMs }), /bounded/);
  const calls = [];
  const locator = { async waitFor(options) { calls.push(['wait', options]); }, async click(options) { calls.push(['click', options]); } };
  let evaluations = 0;
  const page = { locator() { return locator; }, getByRole() { return locator; }, getByTestId() { return locator; },
    async waitForFunction(fn, arg, options) { assert.equal(typeof fn, 'function'); assert.deepEqual(options, { timeout: 1234 }); calls.push(['function', arg]); },
    async evaluate() { return evaluations++ === 0 ? 1 : valid; } };
  assert.equal(await openAyalonRace(page, { timeoutMs: 1234 }), valid);
  assert.equal(calls.filter(([kind]) => kind === 'click').length, 3);
  assert.deepEqual(calls.filter(([kind]) => kind === 'function').map(([,arg]) => arg), [undefined, 1]);
});
test('missing menu fails explicitly rather than silently skipping selection', async () => {
  const page = { locator() { return { async waitFor() {} }; }, getByRole() { return { async click() { throw new Error('menu missing'); } }; } };
  await assert.rejects(openAyalonRace(page), /menu missing/);
});
test('original capture authority, timing and comparison thresholds stay unchanged', () => {
  const source = readFileSync(fromRoot('scripts/pixel-golden.mjs'), 'utf8');
  assert.match(source, /threshold: 0\.12/); assert.match(source, /pct > 0\.08/);
  assert.match(source, /waitForTimeout\(450\)/); assert.match(source, /waitForTimeout\(400\)/); assert.match(source, /waitForTimeout\(500\)/);
  assert.match(source, /if \(process.env.UPDATE_GOLDEN === "1"\) throw/);
  assert.doesNotMatch(source, /copyFile|\.find\([\s\S]*?\?\.click/);
  assert.match(source, /finally \{ await browser\?\.close\(\); \}/);
});
test('app exposes readiness only after hydration and settings initialization', () => {
  const source = readFileSync(fromRoot('src/components/game-app.tsx'), 'utf8');
  assert.match(source, /\[appReady, setAppReady\] = useState\(false\)/);
  assert.ok(source.indexOf('setAppReady(true)') > source.indexOf('const savedLang = getLang()'));
  assert.match(source, /inert: !appReady/); assert.match(source, /"data-rush-ready": String\(appReady\)/);
});
