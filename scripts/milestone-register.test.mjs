import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-060 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 43\.0\.0/);
  assert.match(register, /merge of the RSH-060 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-061 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 60 \|/);
  assert.match(register, /\| Remaining units \| 7 \|/);
  assert.match(register, /\| RSH-060 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-060 \| Ramon art, golden and source freeze locked on validated merge \|/);
  assert.match(register, /No RSH-061 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-060 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-060 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 59 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 8 \|/);
  assert.doesNotMatch(register, /RSH-060 not authorised/);
  assert.doesNotMatch(register, /RSH-060 requires a new explicit owner instruction/);
});
