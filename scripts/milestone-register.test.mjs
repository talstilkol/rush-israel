import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-032 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 14\.0\.0/);
  assert.match(register, /merge of the RSH-032 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-033 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 32 \|/);
  assert.match(register, /\| Remaining units \| 35 \|/);
  assert.match(register, /\| RSH-032 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-032 \| Night lighting, headlights and weather locked on validated merge \|/);
  assert.match(register, /No RSH-033 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-032 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-032 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 31 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 36 \|/);
  assert.doesNotMatch(register, /RSH-032 not authorised/);
  assert.doesNotMatch(register, /RSH-032 requires a new explicit owner instruction/);
});
