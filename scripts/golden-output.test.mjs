import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, linkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { prepareGoldenOutput } from './golden-output.mjs';
import { captureAyalon, CAPTURE_FILES } from './capture-golden.mjs';
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'rush-output-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const base = path.join(root, 'baseline'), out = path.join(root, 'output');
  mkdirSync(base); mkdirSync(out); writeFileSync(path.join(base, 'authority.png'), 'reviewed bytes');
  const prepare = extra => prepareGoldenOutput({ output: out, baseline: base, immutableBaseline: base, names: ['report.json', 'image.png'], ...extra });
  return { root, base, out, prepare };
}
for (const mode of ['same', 'ancestor', 'descendant', 'symlink']) test(`reject ${mode} baseline output before mutation`, t => {
  const f = fixture(t);
  let output = mode === 'same' ? f.base : mode === 'ancestor' ? f.root : path.join(f.base, 'new');
  if (mode === 'symlink') { output = path.join(f.root, 'alias'); symlinkSync(f.base, output); }
  assert.throws(() => f.prepare({ output }), /overlap/);
  assert.equal(readFileSync(path.join(f.base, 'authority.png'), 'utf8'), 'reviewed bytes');
  assert.equal(existsSync(path.join(f.base, 'new')), false);
});
test('alternate comparison authority cannot permit writes into the canonical baseline', t => {
  const f = fixture(t), alternate = path.join(f.root, 'other'); mkdirSync(alternate);
  assert.throws(() => f.prepare({ baseline: alternate, output: f.base }), /overlap/);
});
for (const kind of ['symlink', 'hardlink', 'directory']) test(`reject ${kind} output entries without modifying references or stale reports`, t => {
  const f = fixture(t), image = path.join(f.out, 'image.png');
  writeFileSync(path.join(f.out, 'report.json'), 'prior report');
  if (kind === 'symlink') symlinkSync(path.join(f.base, 'authority.png'), image);
  else if (kind === 'hardlink') linkSync(path.join(f.base, 'authority.png'), image);
  else mkdirSync(image);
  assert.throws(() => f.prepare(), /unsafe existing/);
  assert.equal(readFileSync(path.join(f.base, 'authority.png'), 'utf8'), 'reviewed bytes');
  assert.equal(readFileSync(path.join(f.out, 'report.json'), 'utf8'), 'prior report');
});
test('new runs remove only known ordinary stale output and preserve unrelated files', t => {
  const f = fixture(t); writeFileSync(path.join(f.out, 'report.json'), 'old success');
  writeFileSync(path.join(f.out, 'unrelated.txt'), 'keep');
  const out = f.prepare(); assert.equal(existsSync(path.join(f.out, 'report.json')), false);
  out.write('report.json', 'new failure'); assert.equal(readFileSync(path.join(f.out, 'report.json'), 'utf8'), 'new failure');
  assert.equal(readFileSync(path.join(f.out, 'unrelated.txt'), 'utf8'), 'keep');
});
test('exclusive output writes refuse a symlink installed after validation', t => {
  const f = fixture(t), out = f.prepare(); symlinkSync(path.join(f.base, 'authority.png'), path.join(f.out, 'image.png'));
  assert.throws(() => out.write('image.png', 'overwrite'), /EEXIST/);
  assert.equal(readFileSync(path.join(f.base, 'authority.png'), 'utf8'), 'reviewed bytes');
});
test('output writer refuses traversal, duplicates and unregistered targets', t => {
  const f = fixture(t);
  for (const name of ['../authority.png', '/authority.png', '..', '.', 'a/b', 'a\\b', 'a\0b', ''])
    assert.throws(() => f.prepare({ names: [name] }), /basename/);
  assert.throws(() => f.prepare({ names: ['a', 'a'] }), /duplicate/);
  assert.throws(() => f.prepare().write('not-listed', 'value'), /unregistered/);
});
test('broken directory symlinks fail rather than becoming unsealed output roots', t => {
  const f = fixture(t), alias = path.join(f.root, 'broken'); symlinkSync(path.join(f.root, 'missing'), alias);
  assert.throws(() => f.prepare({ output: path.join(alias, 'child') }), /ENOENT/);
  assert.equal(existsSync(path.join(f.root, 'missing')), false);
});
test('automatic baseline update request is rejected before stale cleanup', t => {
  const f = fixture(t); writeFileSync(path.join(f.out, 'report.json'), 'keep');
  assert.throws(() => f.prepare({ update: '1' }), /forbidden/);
  assert.equal(readFileSync(path.join(f.out, 'report.json'), 'utf8'), 'keep');
});
function browserFixture(t, phase) {
  const f = fixture(t), listeners = {}, calls = { launched: 0, closed: 0, frames: 0, waits: [] };
  let yaw = 0, night = false;
  const state = () => ({ engine: { track: 'ayalon', quality: 'high', weather: 'clear', photo: false,
    webgpuOk: false, speed: 0, progress: .04, night, telem: { backend: 'webgl2' } } });
  const page = {
    on(event, fn) { listeners[event] = fn; }, isClosed() { return false; },
    async goto() { if (phase === 'navigation') throw new Error('navigation failed'); },
    async evaluate(fn, id) {
      const text = String(fn);
      if (text.includes('gotoGolden')) { night = id === 'g08'; return phase !== 'camera'; }
      if (text.includes('getYaw')) return (yaw++ ? .1 : 0);
      return undefined;
    },
    async waitForTimeout(ms) { calls.waits.push(ms); },
    async waitForFunction() { if (phase === 'steering') throw new Error('steering timeout'); },
    async screenshot() { calls.frames++; if (phase === 'screenshot') throw new Error('capture failed'); return Buffer.alloc(22000, 3); },
  };
  const browserType = { async launch() { calls.launched++; if (phase === 'launch') throw new Error('launch failed');
    return { async newPage() { if (phase === 'new-page') throw new Error('new-page failed'); return page; }, async close() { calls.closed++; } }; } };
  return { ...f, calls, options: { environment: { GOLDEN_OUTPUT: f.out }, browserType,
    openRace: async () => { if (phase === 'readiness') throw new Error('readiness failed'); return state().engine; },
    readState: async () => state() } };
}
test('legacy command rejects ambiguous GOLDEN_DIR before launching any browser', async t => {
  const f = browserFixture(t); await assert.rejects(captureAyalon({ ...f.options, environment: { GOLDEN_DIR: f.base } }), /GOLDEN_DIR/);
  assert.equal(f.calls.launched, 0);
});
test('legacy capture success preserves its four-frame recipe and labels zero comparisons', async t => {
  const f = browserFixture(t); const result = await captureAyalon(f.options);
  assert.equal(result.status, 'captured_and_steering_checked_not_compared');
  assert.deepEqual(result.frames.map(row => row.file), CAPTURE_FILES);
  assert.equal(result.comparisons, 0); assert.equal(result.authority, false); assert.equal(f.calls.closed, 1);
  assert.deepEqual(f.calls.waits, [500, 500, 500, 400, 500, 400]);
});
for (const phase of ['launch', 'new-page', 'navigation', 'readiness', 'camera', 'screenshot', 'steering'])
  test(`legacy ${phase} failure persists a failed attempt and closes acquired browser`, async t => {
    const f = browserFixture(t, phase);
    writeFileSync(path.join(f.out, 'capture.json'), '{"status":"old success"}');
    await assert.rejects(captureAyalon(f.options));
    const report = JSON.parse(readFileSync(path.join(f.out, 'capture.json')));
    assert.equal(report.status, 'capture_failed'); assert.equal(report.comparisons, 0);
    assert.equal(f.calls.closed, phase === 'launch' ? 0 : 1);
  });
