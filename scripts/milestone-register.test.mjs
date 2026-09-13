import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-064 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 47\.0\.0/);
  assert.match(register, /merge of the RSH-064 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-065 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 64 \|/);
  assert.match(register, /\| Remaining units \| 3 \|/);
  assert.match(register, /\| RSH-064 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-064 \| preview, staging, production and rollback channels locked on validated merge \|/);
  assert.match(register, /No RSH-065 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-064 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-064 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 63 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 4 \|/);
  assert.doesNotMatch(register, /RSH-064 not authorised/);
  assert.doesNotMatch(register, /RSH-064 requires a new explicit owner instruction/);
});
