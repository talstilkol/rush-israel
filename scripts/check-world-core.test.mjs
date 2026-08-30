import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readWorldCoreInputs,
  validateWorldCore,
} from "./check-world-core.mjs";
import {
  LEGACY_WORLD_BYTES,
  LEGACY_WORLD_GIT_BLOB_SHA1,
  LEGACY_WORLD_LINES,
  LEGACY_WORLD_SHA256,
  gitBlobSha1,
  reconstructLegacyWorldSource,
  sha256,
} from "./load-world-core.mjs";
import { reconstructRsh016EngineSource } from "./load-engine-adapters.mjs";
import { reconstructRsh015WorldSource } from "./load-world-builders.mjs";

function baseline() {
  return structuredClone(readWorldCoreInputs());
}
function messages(result) {
  return result.errors.join("\n");
}

test("RSH-015 extracts one canonical world core without runtime drift", () => {
  const result = validateWorldCore();
  assert.deepEqual(result.errors, []);
  assert.equal(result.worldLines, 2790);
  assert.equal(result.worldBytes, 110205);
  assert.equal(result.coreLines, 116);
  assert.equal(result.coreBytes, 2604);
  assert.equal(result.reconstructedWorldSha256, LEGACY_WORLD_SHA256);
});

test("the extracted facade reconstructs the accepted world.ts byte-for-byte", () => {
  const source = reconstructLegacyWorldSource(reconstructRsh015WorldSource());
  assert.equal(sha256(source), LEGACY_WORLD_SHA256);
  assert.equal(gitBlobSha1(source), LEGACY_WORLD_GIT_BLOB_SHA1);
  assert.equal((source.match(/\n/g) ?? []).length, LEGACY_WORLD_LINES);
  assert.equal(Buffer.byteLength(source), LEGACY_WORLD_BYTES);
});

test("RSH-017 engine extraction preserves the accepted engine byte-for-byte", () => {
  const input = baseline();
  const source = reconstructRsh016EngineSource(
    input.engineSource,
    JSON.parse(input.engineAdapterManifestSource),
    input.engineAdapterSources,
  );
  assert.equal(sha256(source), "3f4d54bbe0b68f9654ae8a92a2f56ce378a59a9790e8fbbe2ee05199ced192c1");
  assert.equal(gitBlobSha1(source), "692663c6d05ab59c1d99c7a357999839b9ebb0ec");
});

test("engine-adapter source drift cannot satisfy the world-core preservation gate", () => {
  const input = baseline();
  input.engineAdapterSources["src/game/engine/loop-adapter.ts"] += "\n// unauthorized drift\n";
  assert.match(
    messages(validateWorldCore(input)),
    /RSH-017 engine-adapter authority invalid|RSH-017 engine reconstruction failed/,
  );
});

test("track-specific or runtime implementation entering world-core fails closed", () => {
  const input = baseline();
  input.coreSource = input.coreSource.replace(
    'import type * as THREE from "three";',
    'import * as THREE from "three";\nimport { TRACKS } from "./tracks";',
  );
  const errors = messages(validateWorldCore(input));
  assert.match(errors, /runtime import is forbidden|narrow type-only boundary|canonical owner implementation/);
});

test("duplicate world contract or assembly ownership fails closed", () => {
  const input = baseline();
  input.repositoryFiles.push("src/game/duplicate-world.ts");
  input.gameSources["src/game/duplicate-world.ts"] =
    "export type World = {};\nexport function assembleWorld() { return {}; }\n";
  const errors = messages(validateWorldCore(input));
  assert.match(errors, /duplicate world-contract ownership/);
  assert.match(errors, /duplicate world-core assembly ownership/);
});

test("missing or reordered lifecycle keys fail closed", () => {
  const input = baseline();
  input.coreSource = input.coreSource.replace(
    "  return {\n    group,\n    sun,",
    "  return {\n    sun,\n    group,",
  );
  assert.match(messages(validateWorldCore(input)), /lifecycle\/public key order|canonical owner implementation/);
});

test("altered disposal order or world.ts bypass fails closed", () => {
  const disposal = baseline();
  disposal.worldSource = disposal.worldSource.replace(
    "for (const d of bag) d.dispose();",
    "for (const d of [...bag].reverse()) d.dispose();",
  );
  assert.match(messages(validateWorldCore(disposal)), /disposal|reconstruction|bounded extracted facade/);

  const bypass = baseline();
  bypass.worldSource = bypass.worldSource.replace(
    'import { assembleWorld } from "./world-core";',
    'import { assembleWorld } from "./world-core-bypass";',
  );
  assert.match(messages(validateWorldCore(bypass)), /import assembleWorld|reconstruction|bounded extracted facade/);
});

test("engine wiring changes and unauthorized RSH-016 structures fail closed", () => {
  const wiring = baseline();
  wiring.engineSource = wiring.engineSource.replace('from "./world";', 'from "./world-core";');
  assert.match(messages(validateWorldCore(wiring)), /must not bypass|world facade import changed|preservation identity changed/);

  const structure = baseline();
  structure.repositoryFiles.push("src/game/world/builders/ayalon.ts");
  assert.match(messages(validateWorldCore(structure)), /unauthorized RSH-016 structure/);
});

test("world.ts regrowth and baseline runtime drift fail closed", () => {
  const input = baseline();
  input.worldSource += "// unauthorized regrowth\n";
  const errors = messages(validateWorldCore(input));
  assert.match(errors, /regrew beyond|bounded extracted facade|runtime source drifts/);
});

test("track, physics, asset and dependency preservation gates fail closed", () => {
  const tracks = baseline();
  tracks.trackManifestSource = tracks.trackManifestSource.replace(
    "a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d",
    "b1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d",
  );
  assert.match(messages(validateWorldCore(tracks)), /track-module manifest integrity|runtime-definition digest/);

  const physics = baseline();
  physics.preservedSources["src/game/physics.ts"] = physics.preservedSources["src/game/physics.ts"].replace(
    "PHYSICS_HZ = 120",
    "PHYSICS_HZ = 60",
  );
  assert.match(messages(validateWorldCore(physics)), /physics rate|preservation identity/);

  const assets = baseline();
  assets.assetProvenanceSource = assets.assetProvenanceSource.replace(
    '"unverified_asset_files": 66',
    '"unverified_asset_files": 65',
  );
  assert.match(messages(validateWorldCore(assets)), /asset provenance/);

  const dependencies = baseline();
  dependencies.packageSource = dependencies.packageSource.replace('"three": "0.185.1"', '"three": "0.185.2"');
  assert.match(messages(validateWorldCore(dependencies)), /dependency map changed/);
});

test("@ts-nocheck is rejected in both extracted source owners", () => {
  const core = baseline();
  core.coreSource = `// @ts-nocheck\n${core.coreSource}`;
  assert.match(messages(validateWorldCore(core)), /world-core\.ts must not use @ts-nocheck/);

  const world = baseline();
  world.worldSource = `// @ts-nocheck\n${world.worldSource}`;
  assert.match(messages(validateWorldCore(world)), /world\.ts must not use @ts-nocheck/);
});
