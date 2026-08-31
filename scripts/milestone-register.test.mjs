import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-021 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 8\.0\.0/);
  assert.match(register, /merge of the RSH-021 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-022 — deferred and not authorised/);
  assert.match(register, /\| M4 \| Data integrity and production security \| RSH-021–RSH-024 \| 4 \| ACTIVE — 1\/4 accepted/);
  assert.match(register, /\| Accepted units \| 21 \|/);
  assert.match(register, /\| Remaining units \| 46 \|/);
  assert.match(register, /\| RSH-021 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-021 \| Save schema v3, deterministic 0→1→2→3 migrations/);
  assert.match(register, /No RSH-022 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-021 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-021/);
  assert.doesNotMatch(register, /\| Accepted units \| 20 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 47 \|/);
  assert.doesNotMatch(register, /RSH-021 not authorised/);
  assert.doesNotMatch(register, /RSH-021 requires a new explicit owner instruction/);
});
