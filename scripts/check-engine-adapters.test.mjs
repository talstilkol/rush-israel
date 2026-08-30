import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readEngineAdapterInputs,
  validateEngineAdapters,
} from "./check-engine-adapters.mjs";
import { reconstructRsh016EngineSource } from "./load-engine-adapters.mjs";
import { gitBlobSha1, sha256 } from "./load-world-builders.mjs";

function baseline() {
  return structuredClone(readEngineAdapterInputs());
}
function messages(result) {
  return result.errors.join("\n");
}

test("RSH-017 owns exactly four engine adapters and reconstructs the accepted engine", () => {
  const result = validateEngineAdapters();
  assert.deepEqual(result.errors, []);
  assert.equal(result.adapterCount, 4);
  assert.equal(result.movedMethodCount, 58);
  assert.equal(result.engineLines, 1202);
  assert.equal(result.engineBytes, 40417);
  const input = baseline();
  const manifest = JSON.parse(input.manifestSource);
  const reconstructed = reconstructRsh016EngineSource(input.engineSource, manifest, input.adapterSources);
  assert.equal(sha256(reconstructed), "3f4d54bbe0b68f9654ae8a92a2f56ce378a59a9790e8fbbe2ee05199ced192c1");
  assert.equal(gitBlobSha1(reconstructed), "692663c6d05ab59c1d99c7a357999839b9ebb0ec");
});

test("missing, substituted, reordered or cross-wired adapters fail closed", () => {
  const missing = baseline();
  delete missing.adapterSources[Object.keys(missing.adapterSources)[0]];
  assert.match(messages(validateEngineAdapters(missing)), /adapter set|missing engine adapter/);

  const changed = baseline();
  const path = Object.keys(changed.adapterSources)[0];
  changed.adapterSources[path] += "\n// drift\n";
  assert.match(messages(validateEngineAdapters(changed)), /adapter identity changed/);

  const order = baseline();
  const manifest = JSON.parse(order.manifestSource);
  [manifest.extraction.adapters[0], manifest.extraction.adapters[1]] = [manifest.extraction.adapters[1], manifest.extraction.adapters[0]];
  order.manifestSource = JSON.stringify(manifest, null, 2) + "\n";
  assert.match(messages(validateEngineAdapters(order)), /manifest differs|adapter order/);

  const cross = baseline();
  const crossPath = "src/game/engine/loop-adapter.ts";
  cross.adapterSources[crossPath] += '\nimport "./physics-adapter";\n';
  assert.match(messages(validateEngineAdapters(cross)), /identity changed|may not import another adapter/);
});

test("facade bypass, wrapper drift and method duplication fail closed", () => {
  const facade = baseline();
  facade.engineSource = facade.engineSource.replace(
    'import * as engineLoop from "./engine/loop-adapter";',
    'const engineLoop = { frame() {} };',
  );
  assert.match(messages(validateEngineAdapters(facade)), /engine\.ts differs|adapter wiring/);

  const wrapper = baseline();
  wrapper.engineSource = wrapper.engineSource.replace(
    "return engineLoop.frame.call(this);",
    "return engineLoop.frame.call({});",
  );
  assert.match(messages(validateEngineAdapters(wrapper)), /engine\.ts differs|facade wrapper|reconstruction/);

  const duplicate = baseline();
  duplicate.adapterSources["src/game/engine/qa-adapter.ts"] += "\nexport function frame() {}\n";
  assert.match(messages(validateEngineAdapters(duplicate)), /identity changed|export missing or duplicated/);
});

test("physics, rendering, QA, tracks, assets and dependencies remain closed", () => {
  const physics = baseline();
  physics.preservedSources["src/game/physics.ts"] = physics.preservedSources["src/game/physics.ts"].replace("PHYSICS_HZ = 120", "PHYSICS_HZ = 60");
  assert.match(messages(validateEngineAdapters(physics)), /preserved source/);

  const renderer = baseline();
  renderer.preservedSources["src/rendering/RendererFacade.ts"] += " ";
  assert.match(messages(validateEngineAdapters(renderer)), /preserved source/);

  const qa = baseline();
  qa.preservedSources["src/components/game-app.tsx"] += " ";
  assert.match(messages(validateEngineAdapters(qa)), /preserved source/);

  const tracks = baseline();
  tracks.trackManifestSource = tracks.trackManifestSource.replace('"mvp": 8', '"mvp": 9');
  assert.match(messages(validateEngineAdapters(tracks)), /track count/);

  const assets = baseline();
  assets.assetSource = assets.assetSource.replace('"unverified_asset_files": 66', '"unverified_asset_files": 65');
  assert.match(messages(validateEngineAdapters(assets)), /asset|distribution|release/);

  const dependencies = baseline();
  dependencies.preservedSources["package-lock.json"] += " ";
  assert.match(messages(validateEngineAdapters(dependencies)), /package-lock/);
});

test("temporary transfer files, unmanifested engine files and RSH-018 structures fail closed", () => {
  const temp = baseline();
  temp.repositoryFiles.push(".rsh017-overlay.part-01");
  assert.match(messages(validateEngineAdapters(temp)), /temporary RSH-017 transfer files/);

  const extra = baseline();
  extra.repositoryFiles.push("src/game/engine/extra-adapter.ts");
  assert.match(messages(validateEngineAdapters(extra)), /unmanifested engine structure/);

  const later = baseline();
  later.repositoryFiles.push("src/game/race-controller.ts");
  assert.match(messages(validateEngineAdapters(later)), /unauthorized RSH-018 structure/);
});

test("@ts-nocheck and adapter body-marker drift fail closed", () => {
  const nocheck = baseline();
  const path = "src/game/engine/physics-adapter.ts";
  nocheck.adapterSources[path] = `// @ts-nocheck\n${nocheck.adapterSources[path]}`;
  assert.match(messages(validateEngineAdapters(nocheck)), /@ts-nocheck|identity changed/);

  const markers = baseline();
  markers.adapterSources[path] = markers.adapterSources[path].replace("RSH-017-BODY-BEGIN:fixed", "RSH-017-BODY-BEGIN:fixed-x");
  assert.match(messages(validateEngineAdapters(markers)), /markers|reconstruction|identity changed/);
});
