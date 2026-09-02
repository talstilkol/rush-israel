import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-024 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 11\.0\.0/);
  assert.match(register, /merge of the RSH-024 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-025 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 24 \|/);
  assert.match(register, /\| Remaining units \| 43 \|/);
  assert.match(register, /\| RSH-024 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-024 \| Expanded secret scanning, production QA-hook pin and build\/migration separation accepted on validated merge \|/);
  assert.match(register, /No RSH-025 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-024 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-024/);
  assert.doesNotMatch(register, /\| Accepted units \| 23 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 44 \|/);
  assert.doesNotMatch(register, /RSH-024 not authorised/);
  assert.doesNotMatch(register, /RSH-024 requires a new explicit owner instruction/);
});
