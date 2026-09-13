import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-041 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 24\.0\.0/);
  assert.match(register, /merge of the RSH-041 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-042 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 41 \|/);
  assert.match(register, /\| Remaining units \| 26 \|/);
  assert.match(register, /\| RSH-041 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-040 \| 20 enter-exit leak cycles locked on validated merge \|/);
  assert.match(register, /\| RSH-041 \| WebGL context-loss recovery locked on validated merge \|/);
  assert.match(register, /No RSH-042 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-041 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-041 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 40 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 27 \|/);
  assert.doesNotMatch(register, /RSH-041 not authorised/);
  assert.doesNotMatch(register, /RSH-041 requires a new explicit owner instruction/);
});
