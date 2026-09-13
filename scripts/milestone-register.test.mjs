import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-056 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 39\.0\.0/);
  assert.match(register, /merge of the RSH-056 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-057 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 56 \|/);
  assert.match(register, /\| Remaining units \| 11 \|/);
  assert.match(register, /\| RSH-056 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-056 \| Jerusalem–Scopus art, golden and source freeze locked on validated merge \|/);
  assert.match(register, /No RSH-057 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-056 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-056 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 55 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 12 \|/);
  assert.doesNotMatch(register, /RSH-056 not authorised/);
  assert.doesNotMatch(register, /RSH-056 requires a new explicit owner instruction/);
});
