import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-020 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 7\.0\.0/);
  assert.match(register, /merge of the RSH-020 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-021 — deferred and not authorised/);
  assert.match(register, /\| M3 \| Architecture decomposition \| RSH-013–RSH-020 \| 8 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 20 \|/);
  assert.match(register, /\| Remaining units \| 47 \|/);
  assert.match(register, /\| RSH-020 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-019 \| Resource ownership and leak accounting accepted \|/);
  assert.match(register, /\| RSH-020 \| Auth\/DB\/multiplayer\/template isolation and 74→30 direct package reduction accepted on validated merge \|/);
  assert.match(register, /No RSH-021 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-020 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-020/);
  assert.doesNotMatch(register, /\| Accepted units \| 19 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 48 \|/);
  assert.doesNotMatch(register, /RSH-020 not authorised/);
  assert.doesNotMatch(register, /RSH-020 requires a new explicit owner instruction/);
});
