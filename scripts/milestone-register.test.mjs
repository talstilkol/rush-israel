import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-023 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 10\.0\.0/);
  assert.match(register, /merge of the RSH-023 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-024 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACTIVE — 3\/4 accepted/);
  assert.match(register, /\| Accepted units \| 23 \|/);
  assert.match(register, /\| Remaining units \| 44 \|/);
  assert.match(register, /\| RSH-023 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-023 \| Timed-record hash verification, serial writes, deduplication and storage limits accepted on validated merge \|/);
  assert.match(register, /No RSH-024 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-023 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-023/);
  assert.doesNotMatch(register, /\| Accepted units \| 22 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 45 \|/);
  assert.doesNotMatch(register, /RSH-023 not authorised/);
  assert.doesNotMatch(register, /RSH-023 requires a new explicit owner instruction/);
});
