import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readResourceOwnershipInputs,
  validateResourceOwnership,
} from "./check-resource-ownership.mjs";

function baseline() {
  return structuredClone(readResourceOwnershipInputs());
}
function messages(result) {
  return result.errors.join("\n");
}

test("RSH-019 pins the complete per-engine ownership map", () => {
  const result = validateResourceOwnership();
  assert.deepEqual(result.errors, []);
  assert.equal(result.ownerCount, 9);
  assert.equal(result.sourceCount, 10);
});

test("missing idempotence, visual disposal or listener cleanup fails closed", () => {
  const engine = baseline();
  engine.sources["src/game/engine.ts"] = engine.sources["src/game/engine.ts"].replace(
    "if (this.disposed) return;",
    "if (false) return;",
  );
  assert.match(messages(validateResourceOwnership(engine)), /identity changed|idempotent/);

  const visual = baseline();
  visual.sources["src/game/engine.ts"] = visual.sources["src/game/engine.ts"].replace(
    "this.trafficVis ?? []",
    "[]",
  );
  assert.match(messages(validateResourceOwnership(visual)), /identity changed|visual family/);

  const audio = baseline();
  audio.sources["src/game/audio.ts"] = audio.sources["src/game/audio.ts"].replace(
    "this.unbindVisibility?.();",
    "",
  );
  assert.match(messages(validateResourceOwnership(audio)), /identity changed|visibility/);
});

test("shared texture disposal, world order drift and leak-gate drift fail closed", () => {
  const textures = baseline();
  textures.sources["src/rendering/disposeObject3D.ts"] += "\ntexture.dispose();\n";
  assert.match(messages(validateResourceOwnership(textures)), /identity changed|shared textures/);

  const world = baseline();
  world.sources["src/game/world.ts"] = world.sources["src/game/world.ts"].replace(
    "for (let index = bag.length - 1; index >= 0; index -= 1)",
    "for (let index = 0; index < bag.length; index += 1)",
  );
  assert.match(messages(validateResourceOwnership(world)), /identity changed|reverse-order/);

  const soak = baseline();
  soak.sources["scripts/soak-menu-race.mjs"] = soak.sources["scripts/soak-menu-race.mjs"].replace(
    "geometry leak",
    "geometry warning",
  );
  assert.match(messages(validateResourceOwnership(soak)), /identity changed|geometry leak/);
});

test("RSH-033 precreation fails closed", () => {
  const input = baseline();
  input.repositoryFiles.push("RSH-033-PREFLIGHT.json");
  assert.match(messages(validateResourceOwnership(input)), /RSH-033 was precreated/);
});
