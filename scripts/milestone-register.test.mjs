import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-044 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 27\.0\.0/);
  assert.match(register, /merge of the RSH-044 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-045 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 44 \|/);
  assert.match(register, /\| Remaining units \| 23 \|/);
  assert.match(register, /\| RSH-044 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-043 \| browser and device support matrix locked on validated merge \|/);
  assert.match(register, /\| RSH-044 \| keyboard, touch and gamepad input maps unified on validated merge \|/);
  assert.match(register, /No RSH-045 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-044 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-044 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 43 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 24 \|/);
  assert.doesNotMatch(register, /RSH-044 not authorised/);
  assert.doesNotMatch(register, /RSH-044 requires a new explicit owner instruction/);
});
