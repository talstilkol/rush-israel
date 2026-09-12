import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() { return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8"); }

test("milestone register records the consumed RSH-037 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 20\.0\.0/);
  assert.match(register, /merge of the RSH-037 pull request/);
  assert.match(register, /Next scheduled unit:\*\* RSH-038 — deferred and not authorised/);
  assert.match(register, /\| M5 \| Ayalon vertical slice \| RSH-025–RSH-036 \| 12 \| ACCEPTED/);
  assert.match(register, /\| Accepted units \| 37 \|/);
  assert.match(register, /\| Remaining units \| 30 \|/);
  assert.match(register, /\| RSH-037 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-036 \| Ayalon freeze and 36 transitive dependency hashes recorded on validated merge \|/);
  assert.match(register, /\| RSH-037 \| Instrument p50, p95, p99, draw calls, triangles and memory locked on validated merge \|/);
  assert.match(register, /No RSH-038 branch, PR or implementation structure is authorised/);
});

test("milestone register contains no stale RSH-037 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-037 — deferred/);
  assert.doesNotMatch(register, /\| Accepted units \| 36 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 31 \|/);
  assert.doesNotMatch(register, /RSH-037 not authorised/);
  assert.doesNotMatch(register, /RSH-037 requires a new explicit owner instruction/);
});
