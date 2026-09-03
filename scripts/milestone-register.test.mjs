import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-026 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 13\.0\.0/);
  assert.match(register, /merge of the RSH-026 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-027 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 26 \|/);
  assert.match(register, /\| Remaining units \| 41 \|/);
  assert.match(register, /\| RSH-026 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-026 \| Ayalon road geometry, width 28 and 8 lanes locked on validated merge \|/);
  assert.match(register, /No RSH-027 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-026 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-026 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 25 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 42 \|/);
  assert.doesNotMatch(register, /RSH-026 not authorised/);
  assert.doesNotMatch(register, /RSH-026 requires a new explicit owner instruction/);
});
