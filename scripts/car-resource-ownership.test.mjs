import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

test("RSH-019 gives every cloned car body per-engine geometry ownership", () => {
  const source = readFileSync(fromRoot("src", "game", "car-assets.ts"), "utf8");
  assert.match(
    source,
    /const mesh = src\.clone\(\);[\s\S]*mesh\.geometry = src\.geometry\.clone\(\);/,
  );
});

test("RSH-019 car disposal stays texture-safe and covers every visual family", () => {
  const disposer = readFileSync(fromRoot("src", "rendering", "disposeObject3D.ts"), "utf8");
  const carMesh = readFileSync(fromRoot("src", "game", "car-mesh.ts"), "utf8");
  const engine = readFileSync(fromRoot("src", "game", "engine.ts"), "utf8");

  assert.doesNotMatch(disposer, /\b(?:map|texture)\.dispose\s*\(/);
  assert.match(carMesh, /export function disposeCarVisual/);
  for (const family of [
    "this.visuals ?? []",
    "this.trafficVis ?? []",
    "this.copVis ?? []",
    "this.ghostVis",
    "this.rivalGhostVis",
  ]) {
    assert.ok(engine.includes(family), `missing disposal family: ${family}`);
  }
});
