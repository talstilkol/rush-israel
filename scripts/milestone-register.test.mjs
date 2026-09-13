import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-067 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 50\.0\.0/);
  assert.match(register, /merge of the RSH-067 pull request/);
  assert.match(register, /Next scheduled unit:\*\* none — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 67 \|/);
  assert.match(register, /\| Remaining units \| 0 \|/);
  assert.match(register, /\| RSH-067 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-067 \| private v1.0.0 dossier and rollback proof locked; public distribution forbidden \|/);
  assert.match(register, /No none branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-067 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-067 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 66 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 1 \|/);
  assert.doesNotMatch(register, /RSH-067 not authorised/);
  assert.doesNotMatch(register, /RSH-067 requires a new explicit owner instruction/);
});
