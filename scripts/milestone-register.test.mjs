import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-051 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 34\.0\.0/);
  assert.match(register, /merge of the RSH-051 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-052 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 51 \|/);
  assert.match(register, /\| Remaining units \| 16 \|/);
  assert.match(register, /\| RSH-051 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-051 \| Yarkon–Reading geometry and driving locked on validated merge \|/);
  assert.match(register, /No RSH-052 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-051 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-051 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 50 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 17 \|/);
  assert.doesNotMatch(register, /RSH-051 not authorised/);
  assert.doesNotMatch(register, /RSH-051 requires a new explicit owner instruction/);
});
