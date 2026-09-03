import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-025 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 12\.0\.0/);
  assert.match(register, /merge of the RSH-025 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-026 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 25 \|/);
  assert.match(register, /\| Remaining units \| 42 \|/);
  assert.match(register, /\| RSH-025 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-025 \| Ayalon V1 acceptance criteria and existing golden\/reference pack inventory accepted on validated merge \|/);
  assert.match(register, /No RSH-026 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-025 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-025/);
  assert.doesNotMatch(register, /\| Accepted units \| 24 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 43 \|/);
  assert.doesNotMatch(register, /RSH-025 not authorised/);
  assert.doesNotMatch(register, /RSH-025 requires a new explicit owner instruction/);
});
