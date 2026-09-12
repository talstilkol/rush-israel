import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-039 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 22\.0\.0/);
  assert.match(register, /merge of the RSH-039 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-040 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 39 \|/);
  assert.match(register, /\| Remaining units \| 28 \|/);
  assert.match(register, /\| RSH-039 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-038 \| Quality profiles and dynamic-quality hysteresis locked on validated merge \|/);
  assert.match(register, /\| RSH-039 \| Bundle, streaming and cache budgets locked on validated merge \|/);
  assert.match(register, /No RSH-040 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-039 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-039 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 38 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 29 \|/);
  assert.doesNotMatch(register, /RSH-039 not authorised/);
  assert.doesNotMatch(register, /RSH-039 requires a new explicit owner instruction/);
});
