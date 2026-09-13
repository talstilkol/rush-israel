import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-052 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 35\.0\.0/);
  assert.match(register, /merge of the RSH-052 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-053 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 52 \|/);
  assert.match(register, /\| Remaining units \| 15 \|/);
  assert.match(register, /\| RSH-052 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-052 \| Yarkon–Reading art, golden and source freeze locked on validated merge \|/);
  assert.match(register, /No RSH-053 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-052 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-052 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 51 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 16 \|/);
  assert.doesNotMatch(register, /RSH-052 not authorised/);
  assert.doesNotMatch(register, /RSH-052 requires a new explicit owner instruction/);
});
