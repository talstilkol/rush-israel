import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-043 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 26\.0\.0/);
  assert.match(register, /merge of the RSH-043 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-044 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 43 \|/);
  assert.match(register, /\| Remaining units \| 24 \|/);
  assert.match(register, /\| RSH-043 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-043 \| browser\ and\ device\ support\ matrix\ locked\ on\ validated\ merge \|/);
  assert.match(register, /No RSH-044 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-043 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-043 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 42 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 25 \|/);
  assert.doesNotMatch(register, /RSH-043 not authorised/);
  assert.doesNotMatch(register, /RSH-043 requires a new explicit owner instruction/);
});
