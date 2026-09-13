import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-042 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 25\.0\.0/);
  assert.match(register, /merge of the RSH-042 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-043 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 42 \|/);
  assert.match(register, /\| Remaining units \| 25 \|/);
  assert.match(register, /\| RSH-042 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-041 \| WebGL context-loss recovery locked on validated merge \|/);
  assert.match(register, /\| RSH-042 \| 30-minute soak contract locked on validated merge \|/);
  assert.match(register, /No RSH-043 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-042 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-042 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 41 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 26 \|/);
  assert.doesNotMatch(register, /RSH-042 not authorised/);
  assert.doesNotMatch(register, /RSH-042 requires a new explicit owner instruction/);
});
