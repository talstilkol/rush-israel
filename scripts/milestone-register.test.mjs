import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-058 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 41\.0\.0/);
  assert.match(register, /merge of the RSH-058 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-059 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 58 \|/);
  assert.match(register, /\| Remaining units \| 9 \|/);
  assert.match(register, /\| RSH-058 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-058 \| Haifa–Carmel art, golden and source freeze locked on validated merge \|/);
  assert.match(register, /No RSH-059 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-058 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-058 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 57 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 10 \|/);
  assert.doesNotMatch(register, /RSH-058 not authorised/);
  assert.doesNotMatch(register, /RSH-058 requires a new explicit owner instruction/);
});
