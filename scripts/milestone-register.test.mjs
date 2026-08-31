import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-022 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 9\.0\.0/);
  assert.match(register, /merge of the RSH-022 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-023 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACTIVE — 2\/4 accepted/);
  assert.match(register, /\| Accepted units \| 22 \|/);
  assert.match(register, /\| Remaining units \| 45 \|/);
  assert.match(register, /\| RSH-022 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-022 \| Verified one-generation backup, bounded rejected-byte quarantine, explicit recovery and accessible visible failure handling accepted on validated merge \|/);
  assert.match(register, /No RSH-023 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-022 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-022/);
  assert.doesNotMatch(register, /\| Accepted units \| 21 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 46 \|/);
  assert.doesNotMatch(register, /RSH-022 not authorised/);
  assert.doesNotMatch(register, /RSH-022 requires a new explicit owner instruction/);
});
