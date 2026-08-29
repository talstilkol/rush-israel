import assert from "node:assert/strict";
import { test } from "node:test";
import { readWorldBuilderInputs, validateWorldBuilders } from "./check-world-builders.mjs";

function baseline() { return structuredClone(readWorldBuilderInputs()); }
function messages(result) { return result.errors.join("\n"); }

test("RSH-016 owns exactly one isolated builder per runtime track", () => {
  const result = validateWorldBuilders();
  assert.deepEqual(result.errors, []);
  assert.equal(result.moduleCount, 56);
});

test("missing, substituted or reordered builders fail closed", () => {
  const missing = baseline();
  delete missing.moduleSources[Object.keys(missing.moduleSources)[0]];
  assert.match(messages(validateWorldBuilders(missing)), /module set|missing world builder/);
  const changed = baseline();
  const path = Object.keys(changed.moduleSources)[0];
  changed.moduleSources[path] += "\n// drift\n";
  assert.match(messages(validateWorldBuilders(changed)), /identity changed/);
  const order = baseline();
  const manifest = JSON.parse(order.manifestSource);
  [manifest.extraction.modules[0], manifest.extraction.modules[1]] = [manifest.extraction.modules[1], manifest.extraction.modules[0]];
  order.manifestSource = JSON.stringify(manifest, null, 2) + "\n";
  assert.match(messages(validateWorldBuilders(order)), /manifest differs|module order/);
});

test("track ID branching and cross-builder imports fail closed", () => {
  const input = baseline();
  const path = Object.keys(input.moduleSources)[0];
  input.moduleSources[path] += '\nif (def.id === "ayalon") {}\nimport x from "./ayalon";\n';
  assert.match(messages(validateWorldBuilders(input)), /identity changed|runtime ID branching|imports another builder/);
});

test("world facade bypass or monolithic ownership regrowth fails closed", () => {
  const input = baseline();
  input.worldSource = input.worldSource.replace('import { addLandmarks } from "./world-builders";', 'function addLandmarks() {}');
  assert.match(messages(validateWorldBuilders(input)), /world.ts differs|monolithic|wiring/);
});

test("registry and shared-context duplicate ownership fail closed", () => {
  const registry = baseline();
  registry.indexSource += "\nconst WORLD_BUILDERS = {};\n";
  assert.match(messages(validateWorldBuilders(registry)), /registry changed|ownership/);
  const shared = baseline();
  shared.sharedSource += "\nfunction createTrackWorldBuilderContext() {}\n";
  assert.match(messages(validateWorldBuilders(shared)), /shared world-builder|ownership/);
});

test("legacy world reconstruction and facade drift fail closed", () => {
  const input = baseline();
  input.worldSource += "// unauthorized drift\n";
  assert.match(messages(validateWorldBuilders(input)), /world.ts differs|reconstruction/);
});

test("track, physics, assets and dependency identities remain closed", () => {
  const tracks = baseline();
  tracks.trackManifestSource = tracks.trackManifestSource.replace("a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d", "b1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d");
  assert.match(messages(validateWorldBuilders(tracks)), /track-module manifest|track definition digest/);
  const physics = baseline();
  physics.preservedSources["src/game/physics.ts"] = physics.preservedSources["src/game/physics.ts"].replace("PHYSICS_HZ = 120", "PHYSICS_HZ = 60");
  assert.match(messages(validateWorldBuilders(physics)), /preserved source/);
  const assets = baseline();
  assets.assetSource = assets.assetSource.replace('"unverified_asset_files": 66', '"unverified_asset_files": 65');
  assert.match(messages(validateWorldBuilders(assets)), /asset/distribution/release/);
  const dependencies = baseline();
  dependencies.preservedSources["package-lock.json"] += " ";
  assert.match(messages(validateWorldBuilders(dependencies)), /package-lock/);
});

test("RSH-017 structures remain unauthorized", () => {
  const input = baseline();
  input.repositoryFiles.push("src/game/engine/loop.ts");
  assert.match(messages(validateWorldBuilders(input)), /unauthorized RSH-017 structure/);
});

test("@ts-nocheck is forbidden in generated builders", () => {
  const input = baseline();
  const path = Object.keys(input.moduleSources)[0];
  input.moduleSources[path] = 