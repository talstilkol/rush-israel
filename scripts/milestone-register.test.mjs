import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-028 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 13\.0\.0/);
  assert.match(register, /merge of the RSH-028 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-029 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 28 \|/);
  assert.match(register, /\| Remaining units \| 39 \|/);
  assert.match(register, /\| RSH-028 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-028 \| Ayalon landmark placement locked on validated merge \|/);
  assert.match(register, /No RSH-029 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-028 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-028 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 27 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 40 \|/);
  assert.doesNotMatch(register, /RSH-028 not authorised/);
  assert.doesNotMatch(register, /RSH-028 requires a new explicit owner instruction/);
});
