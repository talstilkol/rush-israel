import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-047 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 30\.0\.0/);
  assert.match(register, /merge of the RSH-047 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-048 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 47 \|/);
  assert.match(register, /\| Remaining units \| 20 \|/);
  assert.match(register, /\| RSH-047 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-046 \| onboarding, settings, error and recovery flows locked on validated merge \|/);
  assert.match(register, /\| RSH-047 \| PWA, offline, update and manifest behaviour locked on validated merge \|/);
  assert.match(register, /No RSH-048 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-047 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-047 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 46 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 21 \|/);
  assert.doesNotMatch(register, /RSH-047 not authorised/);
  assert.doesNotMatch(register, /RSH-047 requires a new explicit owner instruction/);
});
