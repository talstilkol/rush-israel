import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { FORBIDDEN } from "../src/rendering/forbidden.ts";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|mjs|js)$/.test(name)) acc.push(p);
  }
  return acc;
}

test("Codex 84 forbidden features stay off", () => {
  assert.equal(Object.keys(FORBIDDEN).length, 12);
  const files = walk("/workspace/src");
  const blob = files.map((f) => readFileSync(f, "utf8")).join("\n");
  assert.doesNotMatch(blob, /from ["']@pmndrs\/postprocessing/);
  assert.doesNotMatch(blob, /from ["']@dimforge\/rapier|from ["']cannon-es|from ["']cannon["']/);
  assert.doesNotMatch(blob, /new Pedestrian|spawnPedestrian/);
  assert.doesNotMatch(blob, /AgXToneMapping|AgX/);
  assert.doesNotMatch(blob, /WebGLMultipleRenderTargets|MultipleRenderTargets/);
  assert.doesNotMatch(blob, /openstreetmap|overpass-api|new DEMTerrain/);
  assert.doesNotMatch(blob, /WindshieldRain|rainDropMesh/);
  assert.doesNotMatch(blob, /FFTOcean|Ocean\.js/);
  assert.doesNotMatch(blob, /VolumetricClouds|CloudVolume/);
  assert.doesNotMatch(blob, /unrealengine|UnrealEngine/);
  const pkg = readFileSync("/workspace/package.json", "utf8");
  assert.doesNotMatch(pkg, /@pmndrs\/postprocessing|rapier|cannon-es/);
});
