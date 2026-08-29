import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() {
  return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8");
}

test("milestone register records the consumed RSH-015 authority exactly", () => {
  const register = readRegister();

  assert.match(register, /\*\*Version:\*\* 3\.0\.0/);
  assert.match(register, /\*\*State effective on:\*\* merge of the RSH-015 pull request/);
  assert.match(register, /\*\*Next eligible unit:\*\* none/);
  assert.match(register, /\*\*Next scheduled unit:\*\* RSH-016 — deferred and not authorised/);
  assert.match(register, /\| M3 \| Architecture decomposition \| RSH-013–RSH-020 \| 8 \| DEFERRED — RSH-013–RSH-015 accepted; RSH-016 not authorised \|/);
  assert.match(register, /\| Accepted units \| 15 \|/);
  assert.match(register, /\| Eligible units \| 0 \|/);
  assert.match(register, /\| Queue head \| none \|/);
  assert.match(register, /\| Remaining units \| 52 \|/);
  assert.match(register, /\| RSH-015 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-015 — world-core extraction \| ACCEPTED ON MERGE — RSH-015 PR \|/);
  assert.match(register, /No unit remains eligible\. RSH-016 requires a new explicit owner instruction\./);
});

test("milestone register contains no stale RSH-015 execution authority", () => {
  const register = readRegister();

  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-015/);
  assert.doesNotMatch(register, /\| Accepted units \| 14 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 53 \|/);
  assert.doesNotMatch(register, /RSH-015 not authorised/);
  assert.doesNotMatch(register, /RSH-015 requires a new explicit owner instruction/);
});
