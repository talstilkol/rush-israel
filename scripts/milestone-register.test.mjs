import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-055 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 38\.0\.0/);
  assert.match(register, /merge of the RSH-055 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-056 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 55 \|/);
  assert.match(register, /\| Remaining units \| 12 \|/);
  assert.match(register, /\| RSH-055 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-055 \| Jerusalem–Scopus geometry and driving locked on validated merge \|/);
  assert.match(register, /No RSH-056 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-055 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-055 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 54 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 13 \|/);
  assert.doesNotMatch(register, /RSH-055 not authorised/);
  assert.doesNotMatch(register, /RSH-055 requires a new explicit owner instruction/);
});
