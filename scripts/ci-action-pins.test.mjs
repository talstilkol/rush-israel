import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { CI_ACTION_PINS, inspectActionUses } from './ci-action-pins.mjs';
import { fromRoot } from './project-root.mjs';
for (const [action, commit] of Object.entries(CI_ACTION_PINS)) test(`${action} is bound to the verified commit, not its mutable tag`, () => {
  for (const ref of ['v4', '1'.repeat(40), commit.slice(0, 12)]) assert.equal(inspectActionUses(` - uses: ${action}@${ref}`, 'fixture').unresolved.length, 1);
  for (const value of [`${action}@${commit}`, `'${action}@${commit}'`, `"${action}@${commit}" # checked`])
    assert.equal(inspectActionUses(` - uses: ${value}`, 'fixture').actions.length, 1);
});
test('required CI uses only four reviewed action invocations and remains read-only', () => {
  const text = readFileSync(fromRoot('.github/workflows/required-ci.yml'), 'utf8');
  const result = inspectActionUses(text, '.github/workflows/required-ci.yml');
  assert.deepEqual(result.unresolved, []); assert.equal(result.actions.length, 4);
  assert.equal(new Set(result.actions.map(row => row.action)).size, 3);
  assert.match(text, /contents: read/); assert.doesNotMatch(text, /contents: write/);
});
for (const ref of ['vendor/action@' + 'f'.repeat(40), '${{ inputs.action }}', './unreviewed-action', 'docker://unreviewed:latest'])
  test(`unknown action source remains an explicit qualification blocker: ${ref}`, () => {
    assert.equal(inspectActionUses(`  uses: ${ref}`, 'fixture').unresolved.length, 1);
  });
test('comments cannot impersonate pinned action invocations', () => {
  assert.equal(inspectActionUses('# uses: actions/checkout@v4\n', 'fixture').actions.length, 0);
});
