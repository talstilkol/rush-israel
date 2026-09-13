import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-066 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 49\.0\.0/);
  assert.match(register, /merge of the RSH-066 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-067 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 66 \|/);
  assert.match(register, /\| Remaining units \| 1 \|/);
  assert.match(register, /\| RSH-066 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-066 \| private RC1 identity locked; blocking program defects remain owner-gated \|/);
  assert.match(register, /No RSH-067 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-066 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-066 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 65 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 2 \|/);
  assert.doesNotMatch(register, /RSH-066 not authorised/);
  assert.doesNotMatch(register, /RSH-066 requires a new explicit owner instruction/);
});
