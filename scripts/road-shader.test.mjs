import assert from "node:assert/strict";
import { test } from "node:test";
import { injectRoadLanes, bindRoadCompile } from "../src/game/roadShader.ts";

test("injects boundary dashes, skips edges and Ayalon mid", () => {
  const shader = { fragmentShader: "#include <map_fragment>\nvoid main(){}", uniforms: {} };
  injectRoadLanes(shader, 8);
  assert.match(shader.fragmentShader, /RUSH_LANES/);
  assert.match(shader.fragmentShader, /fract\(laneU \+ 0\.5\)/);
  assert.match(shader.fragmentShader, /skipMid/);
  assert.match(shader.fragmentShader, /skipEdge/);
  assert.equal(shader.uniforms.uLanes.value, 8);
});

test("bindRoadCompile chains after an existing onBeforeCompile", () => {
  const order = [];
  const mat = {
    userData: { lanes: 8 },
    onBeforeCompile: () => {
      order.push("csm");
    },
  };
  bindRoadCompile(mat);
  const shader = { fragmentShader: "#include <map_fragment>", uniforms: {} };
  mat.onBeforeCompile(shader, null);
  assert.deepEqual(order, ["csm"]);
  assert.match(shader.fragmentShader, /RUSH_LANES/);
});
