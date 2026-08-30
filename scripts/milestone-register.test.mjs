import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() {
  return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8");
}

test("milestone register records the consumed RSH-017 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 5\.0\.0/);
  assert.match(register, /\*\*State effective on:\*\* merge of the RSH-017 pull request/);
  assert.match(register, /\*\*Next eligible unit:\*\* none/);
  assert.match(register, /\*\*Next scheduled unit:\*\* RSH-018 — deferred and not authorised/);
  assert.match(register, /\| M3 \| Architecture decomposition \| RSH-013–RSH-020 \| 8 \| DEFERRED — RSH-013–RSH-017 accepted; RSH-018 not authorised \|/);
  assert.match(register, /\| Accepted units \| 17 \|/);
  assert.match(register, /\| Eligible units \| 0 \|/);
  assert.match(register, /\| Queue head \| none \|/);
  assert.match(register, /\| Remaining units \| 50 \|/);
  assert.match(register, /\| RSH-017 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-016 — isolated world builders per track \| ACCEPTED — PR #19 \|/);
  assert.match(register, /\| RSH-017 — loop\/rendering\/physics\/QA engine adapters \| ACCEPTED ON MERGE — RSH-017 PR \|/);
  assert.match(register, /No unit remains eligible\. RSH-018 requires a new explicit owner instruction\./);
});

test("milestone register contains no stale RSH-017 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-017/);
  assert.doesNotMatch(register, /\| Accepted units \| 16 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 51 \|/);
  assert.doesNotMatch(register, /RSH-017 not authorised/);
  assert.doesNotMatch(register, /RSH-017 requires a new explicit owner instruction/);
});
