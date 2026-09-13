import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-062 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 45\.0\.0/);
  assert.match(register, /merge of the RSH-062 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-063 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 62 \|/);
  assert.match(register, /\| Remaining units \| 5 \|/);
  assert.match(register, /\| RSH-062 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-062 \| Hermon art, golden and source freeze locked on validated merge \|/);
  assert.match(register, /No RSH-063 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-062 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-062 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 61 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 6 \|/);
  assert.doesNotMatch(register, /RSH-062 not authorised/);
  assert.doesNotMatch(register, /RSH-062 requires a new explicit owner instruction/);
});
