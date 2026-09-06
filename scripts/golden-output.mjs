/** Safe, non-authoritative capture output. Never modifies a golden reference. */
import assert from 'node:assert/strict';
import { lstatSync, realpathSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fromRoot } from './project-root.mjs';

function info(file) {
  try { return lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function canonical(value) {
  assert.equal(typeof value, 'string', 'golden path must be a string');
  assert.ok(value.trim(), 'golden path must not be empty');
  let current = path.resolve(value);
  const suffix = [];
  while (!info(current)) {
    suffix.unshift(path.basename(current));
    const parent = path.dirname(current);
    assert.notEqual(parent, current, 'unresolvable golden path');
    current = parent;
  }
  // Broken links are errors, not permission to create a different destination.
  return path.join(realpathSync(current), ...suffix);
}
export function assertGoldenDirectories(baseline, output) {
  const base = canonical(baseline), target = canonical(output);
  const within = (parent, child) => {
    const rel = path.relative(parent, child);
    return rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel));
  };
  assert.ok(!within(base, target) && !within(target, base),
    'golden output must not overlap the immutable baseline directory');
  return { baseline: base, output: target };
}

/** Validate the entire destination BEFORE deleting any stale output or starting a browser. */
export function prepareGoldenOutput({ output, baseline = fromRoot('golden-baseline'),
  immutableBaseline = fromRoot('golden-baseline'), names, update = process.env.UPDATE_GOLDEN } = {}) {
  assert.notEqual(update, '1', 'Automatic golden baseline updates are forbidden');
  assert.ok(Array.isArray(names) && names.length > 0, 'known output filenames required');
  assert.equal(new Set(names).size, names.length, 'duplicate output filenames');
  for (const name of names) assert.ok(typeof name === 'string' && name !== '.' && name !== '..'
    && name.length > 0 && !/[\\/\0]/.test(name), 'output filename must be a basename');
  assertGoldenDirectories(immutableBaseline, output);
  const directory = assertGoldenDirectories(baseline, output).output;
  const directoryInfo = info(directory);
  assert.ok(!directoryInfo || directoryInfo.isDirectory(), 'output must be a directory');
  for (const name of names) {
    const stat = info(path.join(directory, name));
    assert.ok(!stat || (stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1),
      `unsafe existing golden output: ${name}`);
  }
  mkdirSync(directory, { recursive: true });
  for (const name of names) if (info(path.join(directory, name))) unlinkSync(path.join(directory, name));
  return {
    directory,
    write(name, data) {
      assert.ok(names.includes(name), 'unregistered golden output filename');
      // Exclusive creation prevents following an existing file, symlink or hard link.
      writeFileSync(path.join(directory, name), data, { flag: 'wx' });
    },
  };
}
