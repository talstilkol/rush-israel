import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-048 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 31\.0\.0/);
  assert.match(register, /merge of the RSH-048 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-049 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 48 \|/);
  assert.match(register, /\| Remaining units \| 19 \|/);
  assert.match(register, /\| RSH-048 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-047 \| PWA, offline, update and manifest behaviour locked on validated merge \|/);
  assert.match(register, /\| RSH-048 \| accessibility, privacy and Alpha UX gates locked on validated merge \|/);
  assert.match(register, /No RSH-049 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-048 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-048 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 46 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 21 \|/);
  assert.doesNotMatch(register, /RSH-048 not authorised/);
  assert.doesNotMatch(register, /RSH-048 requires a new explicit owner instruction/);
});
