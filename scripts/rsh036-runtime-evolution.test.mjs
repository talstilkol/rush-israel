import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import { readEvolution, historicalRsh036Source, historicalRsh036Inputs, validateCurrentRuntime } from './rsh036-runtime-evolution.mjs';
const hash = s => createHash('sha256').update(s).digest('hex');
test('RSH-036 requires exact current production sources independently of historical projection', () => {
  const result = validateCurrentRuntime();
  assert.deepEqual(result.errors, []);
  assert.equal(result.sourceCount, 9);
  assert.equal(result.accepted, false);
});
test('runtime evolution manifest cannot silently change or add exemptions', () => {
  const text = readFileSync(fromRoot('RSH-036-RUNTIME-EVOLUTION.json'), 'utf8');
  assert.throws(() => readEvolution(text + '\n'), /authority drift/);
});
for (const [path, row] of Object.entries(readEvolution().files)) {
  test(`current source drift or deletion is rejected: ${path}`, () => {
    const source = readFileSync(fromRoot(path), 'utf8');
    assert.ok(validateCurrentRuntime({ [path]: source + '\n// drift\n' }).errors.length);
    assert.ok(validateCurrentRuntime({ [path]: null }).errors.length);
    assert.equal(historicalRsh036Source(source + '\n// drift\n'), source + '\n// drift\n');
  });
  if (row.previous_sha256) test(`verified baseline projection is exact, and rollback is forbidden: ${path}`, () => {
    const source = readFileSync(fromRoot(path), 'utf8');
    const previous = historicalRsh036Source(source);
    assert.equal(hash(previous), row.previous_sha256);
    assert.ok(validateCurrentRuntime({ [path]: previous }).errors.length, 'historical source must not substitute the runtime fix');
  });
}

test('historical source projection never converts binary image evidence into objects', () => {
  const image = Buffer.from([0, 137, 80, 78, 71, 255]);
  assert.equal(historicalRsh036Inputs({ image }).image, image);
});
