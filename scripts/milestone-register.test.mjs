import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-018 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 6\.0\.0/);
  assert.match(register, /merge of the RSH-018 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-019 — deferred and not authorised/);
  assert.match(register, /RSH-013–RSH-018 accepted; RSH-019 not authorised/);
  assert.match(register, /\| Accepted units \| 18 \|/);
  assert.match(register, /\| Remaining units \| 49 \|/);
  assert.match(register, /\| RSH-018 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /RSH-017 — loop\/rendering\/physics\/QA engine adapters \| ACCEPTED — PR #20/);
  assert.match(register, /RSH-018 — screens\/HUD\/race-controller decomposition \| ACCEPTED ON MERGE/);
  assert.match(register, /RSH-019 requires a new explicit owner instruction/);
});

test("milestone register contains no stale RSH-018 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-018/);
  assert.doesNotMatch(register, /\| Accepted units \| 17 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 50 \|/);
  assert.doesNotMatch(register, /RSH-018 not authorised/);
  assert.doesNotMatch(register, /RSH-018 requires a new explicit owner instruction/);
});
