import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-035 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 18\.0\.0/);
  assert.match(register, /merge of the RSH-035 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-036 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 35 \|/);
  assert.match(register, /\| Remaining units \| 32 \|/);
  assert.match(register, /\| RSH-035 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-034 \| Audio, HUD, keyboard, touch and gamepad behaviour locked on validated merge \|/);
  assert.match(register, /\| RSH-035 \| Unique Ayalon golden pack and owner approval recorded on validated merge \|/);
  assert.match(register, /No RSH-036 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-035 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-035 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 34 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 33 \|/);
  assert.doesNotMatch(register, /RSH-035 not authorised/);
  assert.doesNotMatch(register, /RSH-035 requires a new explicit owner instruction/);
});
