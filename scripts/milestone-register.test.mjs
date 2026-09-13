import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-046 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 29\.0\.0/);
  assert.match(register, /merge of the RSH-046 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-047 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 46 \|/);
  assert.match(register, /\| Remaining units \| 21 \|/);
  assert.match(register, /\| RSH-046 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-045 \| Hebrew RTL, English LTR and Arabic-scope decision locked on validated merge \|/);
  assert.match(register, /\| RSH-046 \| onboarding, settings, error and recovery flows locked on validated merge \|/);
  assert.match(register, /No RSH-047 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-046 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-046 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 45 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 22 \|/);
  assert.doesNotMatch(register, /RSH-046 not authorised/);
  assert.doesNotMatch(register, /RSH-046 requires a new explicit owner instruction/);
});
