import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';

const read = name => JSON.parse(readFileSync(fromRoot(name), 'utf8'));
const backlog = read('COMPLETION-BACKLOG.json');
const readiness = read('PRODUCT-READINESS.json');
const crosswalk = read('COMPLETION-CROSSWALK.json');

test('the real completion backlog is a complete acyclic dependency graph', () => {
  const tasks = new Map(backlog.tasks.map(task => [task.id, task]));
  assert.equal(tasks.size, backlog.tasks.length, 'duplicate completion tasks');
  assert.deepEqual([...tasks.keys()].sort(), Array.from({ length: 46 }, (_, i) => `MP-${String(i + 1).padStart(3, '0')}`));
  const visiting = new Set();
  const visited = new Set();
  const visit = id => {
    assert.ok(tasks.has(id), `unknown dependency ${id}`);
    assert.ok(!visiting.has(id), `dependency cycle at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const task = tasks.get(id);
    assert.ok(task.deliverable.trim() && task.acceptance.trim(), `${id} lacks a deliverable or acceptance criterion`);
    assert.equal(new Set(task.depends_on).size, task.depends_on.length, `${id} repeats a dependency`);
    for (const dependency of task.depends_on) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of tasks.keys()) visit(id);
  const contract = readFileSync(fromRoot(backlog.quality_contract), 'utf8');
  for (const gate of ['Q-DRIVE', 'Q-PHYSICS', 'Q-ART', 'Q-PERF', 'Q-RELIABILITY', 'Q-ACCESS', 'Q-PLAYTEST']) assert.ok(contract.includes(gate), `missing quality gate ${gate}`);
});

test('all real RSH units and completion tasks have coverage without creating another acceptance ledger', () => {
  const expectedUnits = Array.from({ length: 67 }, (_, i) => `RSH-${String(i + 1).padStart(3, '0')}`);
  assert.deepEqual(crosswalk.units.map(unit => unit.unit).sort(), expectedUnits);
  assert.deepEqual(readiness.units.map(unit => unit.id).sort(), expectedUnits);
  const tasks = new Set(backlog.tasks.map(task => task.id));
  const covered = new Set();
  for (const unit of crosswalk.units) {
    assert.ok(unit.completion_tasks.length, `unmapped unit ${unit.unit}`);
    assert.equal(new Set(unit.completion_tasks).size, unit.completion_tasks.length);
    assert.equal(Object.hasOwn(unit, 'product_accepted'), false, 'coverage must not duplicate product acceptance');
    assert.equal(Object.hasOwn(unit, 'status'), false, 'coverage must not duplicate status');
    for (const id of unit.completion_tasks) {
      assert.ok(tasks.has(id), `${unit.unit} refers to unknown task ${id}`);
      covered.add(id);
    }
  }
  assert.deepEqual([...covered].sort(), [...tasks].sort(), 'unmapped completion tasks');
  const accepted = readiness.units.filter(unit => unit.product_accepted === true).length;
  assert.equal(readiness.verified_product_units, accepted, 'product counter differs from actual unit acceptance');
  assert.deepEqual(readiness.gates.map(gate => gate.id).sort((a, b) => a - b), Array.from({ length: 13 }, (_, i) => i + 1));
});
