#!/usr/bin/env node
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { EXPECTED_PACKAGE_LOCK_SHA256, EXPECTED_PACKAGE_SOURCE_SHA256 } from "./check-dependency-boundary.mjs";
import {
  gitBlobSha1,
  parseRsh018Blocks,
  reconstructRsh017GameAppSource,
  sha256,
} from "./load-game-app-decomposition.mjs";

export const EXPECTED_MANIFEST_SHA256 = "472f2d67a285cddc1758664c6e27d471c20793af77eb1e13c121faf2caa64a02";
export const EXPECTED_RSH022_SAVE_SHA256 = "3b454e60fe1cc635a0b3051dc9a75191f7098df0b6989b1bea9ca845784b7df2";
export const EXPECTED_RSH023_RECORDS_SHA256 = "1394102cc0c744a3000a0ad191bca61efc79880b874a7ded3794b51bf0d3a502";
export const EXPECTED_MODULE_PATHS = [
  "src/components/game-app/screens.tsx",
  "src/components/game-app/hud.tsx",
  "src/components/game-app/race-controller.tsx"
];
export const EXPECTED_FACADE_PATH = "src/components/game-app.tsx";

function walkFiles(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "dist", ".output", ".nitro", ".vercel"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const repoPath = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walkFiles(absolute, repoPath));
    else out.push(repoPath);
  }
  return out;
}

function exportsOf(source) {
  const values = new Set();
  const types = new Set();
  for (const match of String(source ?? "").matchAll(/\bexport\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/g)) values.add(match[1]);
  for (const match of String(source ?? "").matchAll(/\bexport\s+type\s+(?:\{([^}]+)\}|([A-Za-z_$][\w$]*))/g)) {
    if (match[1]) for (const item of match[1].split(",")) types.add((item.trim().split(/\s+as\s+/)[1] ?? item.trim().split(/\s+as\s+/)[0]).trim());
    else if (match[2]) types.add(match[2]);
  }
  for (const match of String(source ?? "").matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    if (/\bexport\s+type\s*\{/.test(match[0])) continue;
    for (const item of match[1].split(",")) {
      const cleaned = item.trim();
      if (!cleaned) continue;
      const parts = cleaned.split(/\s+as\s+/);
      values.add((parts[1] ?? parts[0]).trim());
    }
  }
  return { values: [...values].filter(Boolean).sort(), types: [...types].filter(Boolean).sort() };
}

function internalImports(source) {
  const imports = new Set();
  for (const match of String(source ?? "").matchAll(/\bfrom\s+["']([^"']+)["']/g)) {
    const specifier = match[1];
    if (specifier.startsWith("./") || specifier.startsWith("@/components/game-app/")) imports.add(specifier);
  }
  return [...imports].sort();
}

export function readGameAppDecompositionInputs() {
  const manifestSource = readFileSync(fromRoot("GAME-APP-DECOMPOSITION-MANIFEST.json"), "utf8");
  const manifest = JSON.parse(manifestSource);
  return {
    manifestSource,
    facadeSource: readFileSync(fromRoot(...manifest.extraction.facade.path.split("/")), "utf8"),
    moduleSources: Object.fromEntries(manifest.extraction.modules.map((module) => [
      module.path,
      readFileSync(fromRoot(...module.path.split("/")), "utf8"),
    ])),
    preservedSources: Object.fromEntries(Object.keys(manifest.preserved_sources).map((path) => [
      path,
      readFileSync(fromRoot(...path.split("/")), "utf8"),
    ])),
    repositoryFiles: walkFiles(fromRoot()),
  };
}

export function validateGameAppDecomposition(overrides = {}) {
  const input = { ...readGameAppDecompositionInputs(), ...overrides };
  const errors = [];
  let manifest;
  try {
    manifest = JSON.parse(input.manifestSource);
  } catch (error) {
    return { errors: [`GAME-APP-DECOMPOSITION-MANIFEST.json invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("game-app manifest differs from the accepted RSH-018 authority");
  if (manifest.unit !== "RSH-018" || manifest.extraction.module_count !== 3) errors.push("game-app manifest identity/count is invalid");
  if (JSON.stringify(manifest.extraction.module_order) !== JSON.stringify(["screens", "hud", "race-controller"])) errors.push("game-app module order changed");
  const modulePaths = Object.keys(input.moduleSources).sort();
  if (JSON.stringify(modulePaths) !== JSON.stringify([...EXPECTED_MODULE_PATHS].sort())) errors.push("game-app module set differs from the canonical three modules");

  const facade = manifest.extraction.facade;
  if (sha256(input.facadeSource) !== facade.sha256 || gitBlobSha1(input.facadeSource) !== facade.git_blob_sha1) errors.push("game-app facade identity changed");
  if (JSON.stringify(exportsOf(input.facadeSource)) !== JSON.stringify(facade.exports)) errors.push("game-app facade export surface changed");
  if (JSON.stringify(internalImports(input.facadeSource)) !== JSON.stringify(facade.internal_imports)) errors.push("game-app facade module wiring changed");
  if (!input.facadeSource.includes('from "@/components/game-app/race-controller"') || !input.facadeSource.includes('from "@/components/game-app/screens"')) errors.push("game-app facade bypasses canonical modules");

  const seenBlocks = new Set();
  for (const module of manifest.extraction.modules) {
    const source = input.moduleSources[module.path];
    if (typeof source !== "string") {
      errors.push(`missing game-app module ${module.path}`);
      continue;
    }
    if (sha256(source) !== module.sha256 || gitBlobSha1(source) !== module.git_blob_sha1 || (source.match(/\n/g) ?? []).length !== module.lines || Buffer.byteLength(source) !== module.bytes) errors.push(`game-app module identity changed: ${module.id}`);
    if (/^\s*\/\/\s*@ts-nocheck/m.test(source)) errors.push(`@ts-nocheck is forbidden: ${module.path}`);
    if (JSON.stringify(exportsOf(source)) !== JSON.stringify(module.exports)) errors.push(`game-app module export surface changed: ${module.id}`);
    if (JSON.stringify(internalImports(source)) !== JSON.stringify(module.internal_imports)) errors.push(`game-app module dependency graph changed: ${module.id}`);
    const blocks = parseRsh018Blocks(source, module.path);
    const actualIds = Object.keys(blocks).sort();
    const expectedIds = module.blocks.map((block) => block.id).sort();
    if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) errors.push(`game-app block set changed: ${module.id}`);
    for (const expected of module.blocks) {
      const body = blocks[expected.id];
      if (seenBlocks.has(expected.id)) errors.push(`game-app block assigned more than once: ${expected.id}`);
      seenBlocks.add(expected.id);
      if (typeof body !== "string" || sha256(body) !== expected.sha256 || (body.match(/\n/g) ?? []).length !== expected.lines || Buffer.byteLength(body) !== expected.bytes) errors.push(`game-app block identity changed: ${expected.id}`);
    }
  }
  if (seenBlocks.size !== manifest.extraction.block_count) errors.push("game-app block count changed");

  try {
    const reconstructed = reconstructRsh017GameAppSource(manifest, input.moduleSources);
    if (sha256(reconstructed) !== manifest.reconstruction.expected_sha256 || gitBlobSha1(reconstructed) !== manifest.reconstruction.expected_git_blob_sha1 || (reconstructed.match(/\n/g) ?? []).length !== manifest.reconstruction.expected_lines || Buffer.byteLength(reconstructed) !== manifest.reconstruction.expected_bytes) errors.push("RSH-017 game-app reconstruction drifted");
  } catch (error) {
    errors.push(`RSH-017 game-app reconstruction failed: ${error.message}`);
  }

  for (const [path, expected] of Object.entries(manifest.preserved_sources)) {
    const acceptedExpected = path === "package.json"
      ? EXPECTED_PACKAGE_SOURCE_SHA256
      : path === "package-lock.json"
        ? EXPECTED_PACKAGE_LOCK_SHA256
        : path === "src/game/save.ts"
          ? EXPECTED_RSH022_SAVE_SHA256
          : path === "src/game/records.ts"
            ? EXPECTED_RSH023_RECORDS_SHA256
            : expected;
    if (sha256(input.preservedSources[path] ?? "") !== acceptedExpected) errors.push(`preserved source changed: ${path}`);
  }
  const asset = JSON.parse(input.preservedSources["ASSET-PROVENANCE.json"] ?? "{}");
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");

  const directoryFiles = input.repositoryFiles.filter((path) => path.startsWith("src/components/game-app/"));
  if (JSON.stringify(directoryFiles.sort()) !== JSON.stringify([...EXPECTED_MODULE_PATHS].sort())) errors.push(`unmanifested game-app structure: ${directoryFiles.join(", ")}`);
  const temp = input.repositoryFiles.filter((path) => path.startsWith(".rsh018") || path.startsWith(".github/workflows/rsh-018-") || path === ".github/rsh-018-finalize.mjs");
  if (temp.length) errors.push(`temporary RSH-018 files remain: ${temp.join(", ")}`);
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary.forbidden_prefixes.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`unauthorized later-unit structure: ${later.join(", ")}`);
  if (/^\s*\/\/\s*@ts-nocheck/m.test(input.facadeSource)) errors.push("@ts-nocheck is forbidden in game-app facade");

  return {
    errors,
    moduleCount: manifest.extraction.module_count,
    blockCount: manifest.extraction.block_count,
    facadeLines: (input.facadeSource.match(/\n/g) ?? []).length,
    facadeBytes: Buffer.byteLength(input.facadeSource),
    moduleLines: manifest.extraction.modules.reduce((sum, module) => sum + module.lines, 0),
    moduleBytes: manifest.extraction.modules.reduce((sum, module) => sum + module.bytes, 0),
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateGameAppDecomposition();
  if (result.errors.length) {
    console.error("game-app-decomposition fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`game-app-decomposition ok: ${result.moduleCount} modules/${result.blockCount} blocks; facade ${result.facadeLines} lines/${result.facadeBytes} bytes; 0 runtime drift`);
}
