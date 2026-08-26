import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("Azrieli uses 3 InstancedMesh floor bands, no per-floor Mesh", () => {
  const t = readFileSync("/workspace/src/game/world.ts", "utf8");
  const start = t.indexOf("const placeAzrieli");
  const end = t.indexOf("const placeCityGate", start);
  const fn = t.slice(start, end > start ? end : start + 8000);
  const inst = fn.match(/new THREE\.InstancedMesh/g) || [];
  assert.equal(inst.length, 3, "one InstancedMesh per tower");
  assert.match(fn, /TorusGeometry/);
  assert.match(fn, /BoxGeometry\(15\.8 \* s, 0\.35 \* s/);
  assert.doesNotMatch(fn, /for \(let i = 0; i < 49; i\+\+\)[\s\S]{0,80}new THREE\.Mesh/);
});
