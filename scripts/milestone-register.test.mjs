import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-036 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 19\.0\.0/);
  assert.match(register, /merge of the RSH-036 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-037 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 36 \|/);
  assert.match(register, /\| Remaining units \| 31 \|/);
  assert.match(register, /\| RSH-036 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-035 \| Unique Ayalon golden pack and owner approval recorded on validated merge \|/);
  assert.match(register, /\| RSH-036 \| Ayalon freeze and transitive-dependency hashes recorded on validated merge \|/);
  assert.match(register, /No RSH-037 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-036 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-036 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 35 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 32 \|/);
  assert.doesNotMatch(register, /RSH-036 not authorised/);
  assert.doesNotMatch(register, /RSH-036 requires a new explicit owner instruction/);
});
