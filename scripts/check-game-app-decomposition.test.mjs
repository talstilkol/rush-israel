import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readGameAppDecompositionInputs,
  validateGameAppDecomposition,
} from "./check-game-app-decomposition.mjs";
import { reconstructRsh017GameAppSource, gitBlobSha1, sha256 } from "./load-game-app-decomposition.mjs";

function baseline() { return structuredClone(readGameAppDecompositionInputs()); }
function messages(result) { return result.errors.join("\n"); }

test("RSH-018 owns exactly screens, HUD and race-controller modules and reconstructs the accepted game app", () => {
  const result = validateGameAppDecomposition();
  assert.deepEqual(result.errors, []);
  assert.equal(result.moduleCount, 3);
  assert.equal(result.facadeLines, 179);
  assert.equal(result.facadeBytes, 4431);
  const input = baseline();
  const manifest = JSON.parse(input.manifestSource);
  const reconstructed = reconstructRsh017GameAppSource(manifest, input.moduleSources);
  assert.equal(sha256(reconstructed), "04f0c06e69a7a8c91bc4524eba1fcc066a05e7f4a5199d7492b330ee70e7829e");
  assert.equal(gitBlobSha1(reconstructed), "956cfa131200b3c9d9d0902a1b2d6d4d9a8d8728");
});

test("missing, substituted, reordered or unmanifested game-app modules fail closed", () => {
  const missing = baseline();
  delete missing.moduleSources[Object.keys(missing.moduleSources)[0]];
  assert.match(messages(validateGameAppDecomposition(missing)), /module set|missing game-app module/);
  const changed = baseline();
  const path = Object.keys(changed.moduleSources)[0];
  changed.moduleSources[path] += "\n// drift\n";
  assert.match(messages(validateGameAppDecomposition(changed)), /module identity changed/);
  const order = baseline();
  const manifest = JSON.parse(order.manifestSource);
  [manifest.extraction.modules[0], manifest.extraction.modules[1]] = [manifest.extraction.modules[1], manifest.extraction.modules[0]];
  order.manifestSource = JSON.stringify(manifest, null, 2) + "\n";
  assert.match(messages(validateGameAppDecomposition(order)), /manifest differs|module order/);
  const extra = baseline();
  extra.repositoryFiles.push("src/components/game-app/extra.tsx");
  assert.match(messages(validateGameAppDecomposition(extra)), /unmanifested game-app structure/);
});

test("game-app block markers, bodies and ownership fail closed", () => {
  const input = baseline();
  const path = "src/components/game-app/screens.tsx";
  input.moduleSources[path] = input.moduleSources[path].replace("RSH-018-BLOCK-BEGIN:Menu", "RSH-018-BLOCK-BEGIN:Menu-x");
  assert.match(messages(validateGameAppDecomposition(input)), /module identity|block set|reconstruction/);
  const body = baseline();
  body.moduleSources[path] = body.moduleSources[path].replace("function themeWash", "function themeWashChanged");
  assert.match(messages(validateGameAppDecomposition(body)), /module identity|block identity|reconstruction/);
});

test("facade bypass, public export drift and dependency-graph drift fail closed", () => {
  const facade = baseline();
  facade.facadeSource = facade.facadeSource.replace('from "@/components/game-app/race-controller"', 'from "@/game/engine"');
  assert.match(messages(validateGameAppDecomposition(facade)), /facade identity|module wiring|bypasses/);
  const exports = baseline();
  exports.facadeSource += "\nexport const Extra = 1;\n";
  assert.match(messages(validateGameAppDecomposition(exports)), /facade identity|export surface/);
  const graph = baseline();
  graph.moduleSources["src/components/game-app/hud.tsx"] += '\nimport "./screens";\n';
  assert.match(messages(validateGameAppDecomposition(graph)), /module identity|dependency graph/);
});

test("engine, world, tracks, physics, saves, assets and dependencies remain closed", () => {
  for (const path of [
    "src/game/engine.ts",
    "src/game/world.ts",
    "src/game/physics.ts",
    "src/game/save.ts",
    "TRACK-MODULE-MANIFEST.json",
    "ASSET-PROVENANCE.json",
    "package-lock.json",
  ]) {
    const input = baseline();
    input.preservedSources[path] += " ";
    assert.match(messages(validateGameAppDecomposition(input)), /preserved source|asset|distribution|release/, path);
  }
});

test("temporary RSH-018 files and RSH-022 precreation fail closed", () => {
  const temp = baseline();
  temp.repositoryFiles.push(".github/workflows/rsh-018-finalizer.yml");
  assert.match(messages(validateGameAppDecomposition(temp)), /temporary RSH-018 files/);
  const later = baseline();
  later.repositoryFiles.push("RSH-022-PREFLIGHT.json");
  assert.match(messages(validateGameAppDecomposition(later)), /unauthorized later-unit structure/);
});

test("@ts-nocheck is forbidden across the game-app boundary", () => {
  const input = baseline();
  const path = "src/components/game-app/race-controller.tsx";
  input.moduleSources[path] = `// @ts-nocheck\n${input.moduleSources[path]}`;
  assert.match(messages(validateGameAppDecomposition(input)), /@ts-nocheck|module identity/);
});
