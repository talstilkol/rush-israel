import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-040 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 23\.0\.0/);
  assert.match(register, /merge of the RSH-040 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-041 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 40 \|/);
  assert.match(register, /\| Remaining units \| 27 \|/);
  assert.match(register, /\| RSH-040 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-039 \| Bundle, streaming and cache budgets locked on validated merge \|/);
  assert.match(register, /\| RSH-040 \| 20 enter-exit leak cycles locked on validated merge \|/);
  assert.match(register, /No RSH-041 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-040 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-040 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 39 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 28 \|/);
  assert.doesNotMatch(register, /RSH-040 not authorised/);
  assert.doesNotMatch(register, /RSH-040 requires a new explicit owner instruction/);
});
