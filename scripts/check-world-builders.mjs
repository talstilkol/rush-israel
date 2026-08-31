#!/usr/bin/env node
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { gitBlobSha1, reconstructRsh015WorldSource, sha256 } from "./load-world-builders.mjs";
import { stripRsh019Overlay } from "./rsh019-overlay.mjs";

export const EXPECTED_MANIFEST_SHA256 = "5921e14be99509e8b812bc3f556643b98d2244d1f8b77c2b928e02a99de90f00";
export const EXPECTED_WORLD_SHA256 = "08d4e7c230bef3c67f0250fb672e1b1ca351cb5149266e0161dcb470f5274fd9";
export const EXPECTED_TRACK_MANIFEST_SHA256 = "a8891a4af9345dbfa34fcb998302b77383f3b14f19fd240c9a8c46d2e5a43fdd";
export const EXPECTED_RUNTIME_DIGEST = "a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d";
export const EXPECTED_AGGREGATE_DIGEST = "1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7";
export const EXPECTED_PRESERVED = {
  "src/game/physics.ts": "cbff35aa2e2e4b509decf38e9f1ca3d262667675af81e0352ba02f460f5723c1",
  "src/game/world-core.ts": "cbb9ac1f9de387cb1b31290fbc617b0ca34536b97067198b61e82ffcaf31fafe",
  "src/game/save.ts": "d7c681b9e00942c91135a579d47f7f9f8def717d22232470b3990a5b0a644d87",
  "src/game/records.ts": "5bfea6496befb107f0ae6f60810692b3612c98f15dc39274596903bcaed1aad6",
  "TRACK-MODULE-MANIFEST.json": "a8891a4af9345dbfa34fcb998302b77383f3b14f19fd240c9a8c46d2e5a43fdd",
  "TRACK-SCHEMA.json": "56f2f29c131d8df1b98c5fdc909fd1fe35cf21de2346d6f9f8189b6d1abec208",
  "ASSET-PROVENANCE.json": "6881756ee4c3fba9ce798208f5222dbadc3820e18d676b4f8c93733e8fe5f6e5",
  "PRODUCT-DEFINITION.json": "66c445b89f73fd84bfd0ea85b80097945546241e85d7b1f3b738bc98ebe0e4ca",
  "package.json": "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94",
  "package-lock.json": "55afd975f03b12867aada083c375e2fadc402b654ddaf0f0934807966fa9f1ed",
  "src/rendering/EnvironmentState.ts": "a4471989af161d1e9d195cf1b9972c3ba4b6a9e85d09a1d9c60a9beb309b69a2",
  "src/rendering/RendererFacade.ts": "90d8b440c1dcbb2020196ea1b99c854ae4e44c3a30b094f015fef6e98fefc904",
  "src/rendering/ResourceRegistry.ts": "97a4d36cb120714df59c7f14c4218169b7ac05a9875be87089acdd96caeeed35",
  "src/world/AssetRegistry.ts": "c9877f99624077f73862e09c5c465236aee4b0d78bf938033d470449e517bed3"
};

function walkFiles(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory)) {
    if ([".git", "node_modules", "dist", ".output", ".nitro", ".vercel"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const relative = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walkFiles(absolute, relative));
    else out.push(relative);
  }
  return out.sort();
}
export function readWorldBuilderInputs() {
  const manifestSource = readFileSync(fromRoot("WORLD-BUILDER-MANIFEST.json"), "utf8");
  const manifest = JSON.parse(manifestSource);
  return {
    manifestSource,
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    sharedSource: readFileSync(fromRoot(...manifest.extraction.shared.path.split("/")), "utf8"),
    indexSource: readFileSync(fromRoot(...manifest.extraction.registry.path.split("/")), "utf8"),
    typesSource: readFileSync(fromRoot(...manifest.extraction.types.path.split("/")), "utf8"),
    moduleSources: Object.fromEntries(manifest.extraction.modules.map((module) => [module.path, readFileSync(fromRoot(...module.path.split("/")), "utf8")])),
    trackManifestSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    preservedSources: Object.fromEntries(Object.keys(EXPECTED_PRESERVED).map((path) => [path, readFileSync(fromRoot(...path.split("/")), "utf8")])),
    repositoryFiles: walkFiles(fromRoot()),
  };
}
export function validateWorldBuilders(overrides = {}) {
  const input = { ...readWorldBuilderInputs(), ...overrides };
  const errors = [];
  let manifest;
  try { manifest = JSON.parse(input.manifestSource); } catch (error) { return { errors: [`WORLD-BUILDER-MANIFEST.json invalid: ${error.message}`] }; }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("world-builder manifest differs from the accepted authority");
  if (manifest.unit !== "RSH-016" || manifest.extraction.module_count !== 56 || manifest.extraction.modules.length !== 56) errors.push("world-builder manifest identity/count is invalid");
  const ids = manifest.extraction.modules.map((module) => module.id);
  if (JSON.stringify(ids) !== JSON.stringify(manifest.extraction.runtime_order)) errors.push("world-builder module order differs from runtime order");
  const modulePaths = Object.keys(input.moduleSources).sort();
  const expectedPaths = manifest.extraction.modules.map((module) => module.path).sort();
  if (JSON.stringify(modulePaths) !== JSON.stringify(expectedPaths)) errors.push("world-builder module set differs from the manifest");
  for (const module of manifest.extraction.modules) {
    const source = input.moduleSources[module.path];
    if (typeof source !== "string") { errors.push(`missing world builder ${module.path}`); continue; }
    if (sha256(source) !== module.source_sha256 || gitBlobSha1(source) !== module.source_git_blob_sha1) errors.push(`world builder identity changed: ${module.id}`);
    if (/^\s*\/\/\s*@ts-nocheck/m.test(source)) errors.push(`@ts-nocheck is forbidden: ${module.path}`);
    if (/\bdef\.id\b/.test(source)) errors.push(`track builder reintroduces runtime ID branching: ${module.id}`);
    const foreign = manifest.extraction.runtime_order.filter((id) => id !== module.id && new RegExp(`from ["'][^"']*tracks/${id}["']`).test(source));
    if (foreign.length) errors.push(`track builder imports another builder: ${module.id}`);
  }
  const normalizedWorldSource = stripRsh019Overlay("src/game/world.ts", input.worldSource);
  if (sha256(normalizedWorldSource) !== EXPECTED_WORLD_SHA256) errors.push("world.ts differs from the accepted RSH-016 facade");
  if (/function\s+addLandmarks\s*\(/.test(input.worldSource)) errors.push("world.ts still owns the monolithic track builder");
  if ((input.worldSource.match(/from ["']\.\/world-builders["']/g) ?? []).length !== 1 || (input.worldSource.match(/addLandmarks\s*\(\s*\{/g) ?? []).length !== 1) errors.push("world.ts world-builder wiring changed");
  if (sha256(input.sharedSource) !== manifest.extraction.shared.sha256) errors.push("shared world-builder context changed");
  if (sha256(input.indexSource) !== manifest.extraction.registry.sha256) errors.push("world-builder registry changed");
  if (sha256(input.typesSource) !== manifest.extraction.types.sha256) errors.push("world-builder types changed");
  if ((input.indexSource.match(/const WORLD_BUILDERS\s*=/g) ?? []).length !== 1 || (input.sharedSource.match(/function createTrackWorldBuilderContext/g) ?? []).length !== 1) errors.push("world-builder ownership is duplicated or missing");
  try {
    const reconstructed = reconstructRsh015WorldSource(normalizedWorldSource);
    if (sha256(reconstructed) !== manifest.reconstruction.expected_sha256 || gitBlobSha1(reconstructed) !== manifest.reconstruction.expected_git_blob_sha1 || (reconstructed.match(/\n/g) ?? []).length !== manifest.reconstruction.expected_lines || Buffer.byteLength(reconstructed) !== manifest.reconstruction.expected_bytes) errors.push("RSH-015 world reconstruction drifted");
  } catch (error) { errors.push(`RSH-015 world reconstruction failed: ${error.message}`); }
  if (sha256(input.trackManifestSource) !== EXPECTED_TRACK_MANIFEST_SHA256) errors.push("track-module manifest identity changed");
  const tracks = JSON.parse(input.trackManifestSource);
  if (tracks.layout.module_count !== 56 || tracks.counts.total !== 56 || tracks.counts.mvp !== 8 || tracks.counts.deferred !== 48 || tracks.runtime_order.length !== 56) errors.push("track count/classification/order changed");
  if (tracks.semantic_integrity.ordered_runtime_definition_digest_sha256 !== EXPECTED_RUNTIME_DIGEST || tracks.semantic_integrity.aggregate_runtime_definition_digest_sha256 !== EXPECTED_AGGREGATE_DIGEST) errors.push("track definition digest changed");
  for (const [path, expected] of Object.entries(EXPECTED_PRESERVED)) if (sha256(input.preservedSources[path] ?? "") !== expected) errors.push(`preserved source changed: ${path}`);
  const asset = JSON.parse(input.assetSource);
  if (asset.scope.unverified_asset_files !== 66 || asset.scope.public_distribution_authorized !== false || asset.truth_boundaries.release_gates_green !== 0 || asset.truth_boundaries.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");
  const rsh017 = input.repositoryFiles.filter((path) => path.startsWith("src/game/engine/")).sort();
  const acceptedRsh017 = [
    "src/game/engine/adapter-host.ts",
    "src/game/engine/loop-adapter.ts",
    "src/game/engine/physics-adapter.ts",
    "src/game/engine/qa-adapter.ts",
    "src/game/engine/rendering-adapter.ts",
  ];
  if (JSON.stringify(rsh017) !== JSON.stringify(acceptedRsh017)) errors.push(`RSH-017 engine structure differs from its bounded adapter set: ${rsh017.join(", ")}`);
  const legacyRsh017 = input.repositoryFiles.filter((path) => path.startsWith("src/game/engine-adapters/") || path === "src/game/engine-core.ts");
  if (legacyRsh017.length) errors.push(`unauthorized alternate RSH-017 structure: ${legacyRsh017.join(", ")}`);
  return { errors, moduleCount: manifest.extraction.modules.length, worldLines: (normalizedWorldSource.match(/\n/g) ?? []).length, worldBytes: Buffer.byteLength(normalizedWorldSource) };
}
function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateWorldBuilders();
  if (result.errors.length) { console.error("world-builders fail\n" + result.errors.map((error) => `- ${error}`).join("\n")); process.exit(1); }
  console.log(`world-builders ok: ${result.moduleCount} modules; world ${result.worldLines} lines/${result.worldBytes} bytes; 0 runtime drift`);
}
