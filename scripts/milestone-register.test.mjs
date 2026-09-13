import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-054 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 37\.0\.0/);
  assert.match(register, /merge of the RSH-054 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-055 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 54 \|/);
  assert.match(register, /\| Remaining units \| 13 \|/);
  assert.match(register, /\| RSH-054 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-054 \| Jaffa art, golden and source freeze locked on validated merge \|/);
  assert.match(register, /No RSH-055 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-054 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-054 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 53 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 14 \|/);
  assert.doesNotMatch(register, /RSH-054 not authorised/);
  assert.doesNotMatch(register, /RSH-054 requires a new explicit owner instruction/);
});
