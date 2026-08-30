import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() {
  return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8");
}

test("milestone register records the consumed RSH-016 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 4\.0\.0/);
  assert.match(register, /\*\*State effective on:\*\* merge of the RSH-016 pull request/);
  assert.match(register, /\*\*Next eligible unit:\*\* none/);
  assert.match(register, /\*\*Next scheduled unit:\*\* RSH-017 — deferred and not authorised/);
  assert.match(register, /\| M3 \| Architecture decomposition \| RSH-013–RSH-020 \| 8 \| DEFERRED — RSH-013–RSH-016 accepted; RSH-017 not authorised \|/);
  assert.match(register, /\| Accepted units \| 16 \|/);
  assert.match(register, /\| Eligible units \| 0 \|/);
  assert.match(register, /\| Queue head \| none \|/);
  assert.match(register, /\| Remaining units \| 51 \|/);
  assert.match(register, /\| RSH-016 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-016 — isolated world builders per track \| ACCEPTED ON MERGE — RSH-016 PR \|/);
  assert.match(register, /No unit remains eligible\. RSH-017 requires a new explicit owner instruction\./);
});

test("milestone register contains no stale RSH-016 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-016/);
  assert.doesNotMatch(register, /\| Accepted units \| 15 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 52 \|/);
  assert.doesNotMatch(register, /RSH-016 not authorised/);
  assert.doesNotMatch(register, /RSH-016 requires a new explicit owner instruction/);
});
