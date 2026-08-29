import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() {
  return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8");
}

test("milestone register records the closed RSH-014 batch exactly", () => {
  const register = readRegister();

  assert.match(register, /\*\*Version:\*\* 2\.0\.0/);
  assert.match(register, /\*\*State effective on:\*\* merge of PR #17/);
  assert.match(register, /\*\*Next eligible unit:\*\* none/);
  assert.match(register, /\*\*Next scheduled unit:\*\* RSH-015 — deferred and not authorised/);
  assert.match(register, /\| M3 \| Architecture decomposition \| RSH-013–RSH-020 \| 8 \| DEFERRED — RSH-013–RSH-014 accepted; RSH-015 not authorised \|/);
  assert.match(register, /\| Accepted units \| 14 \|/);
  assert.match(register, /\| Eligible units \| 0 \|/);
  assert.match(register, /\| Queue head \| none \|/);
  assert.match(register, /\| Remaining units \| 53 \|/);
  assert.match(register, /\| Batch completed \| 5\/5 \|/);
  assert.match(register, /\| RSH-014 — one module per track \| ACCEPTED ON MERGE — PR #17 \|/);
  assert.match(register, /No unit remains eligible\. RSH-015 requires a new explicit owner instruction\./);
});

test("milestone register contains no stale pre-RSH-014 execution authority", () => {
  const register = readRegister();

  assert.doesNotMatch(register, /Next eligible unit:\*\* RSH-014/);
  assert.doesNotMatch(register, /\| Accepted units \| 13 \|/);
  assert.doesNotMatch(register, /\| Eligible units \| 1 \|/);
  assert.doesNotMatch(register, /\| Queue head \| RSH-014 \|/);
  assert.doesNotMatch(register, /\| Batch completed \| 4\/5 \|/);
  assert.doesNotMatch(register, /RSH-014 eligible/);
  assert.doesNotMatch(register, /ELIGIBLE UNDER `next 2`/);
});
