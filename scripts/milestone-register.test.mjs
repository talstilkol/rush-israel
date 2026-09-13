import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-063 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 46\.0\.0/);
  assert.match(register, /merge of the RSH-063 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-064 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 63 \|/);
  assert.match(register, /\| Remaining units \| 4 \|/);
  assert.match(register, /\| RSH-063 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-063 \| SemVer, changelog and private release automation locked on validated merge \|/);
  assert.match(register, /No RSH-064 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-063 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-063 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 62 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 5 \|/);
  assert.doesNotMatch(register, /RSH-063 not authorised/);
  assert.doesNotMatch(register, /RSH-063 requires a new explicit owner instruction/);
});
