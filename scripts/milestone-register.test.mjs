import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-031 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 14\.0\.0/);
  assert.match(register, /merge of the RSH-031 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-032 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 31 \|/);
  assert.match(register, /\| Remaining units \| 36 \|/);
  assert.match(register, /\| RSH-031 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-031 \| Daylight, sky and image-based lighting locked on validated merge \|/);
  assert.match(register, /No RSH-032 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-031 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-031 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 30 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 37 \|/);
  assert.doesNotMatch(register, /RSH-031 not authorised/);
  assert.doesNotMatch(register, /RSH-031 requires a new explicit owner instruction/);
});
