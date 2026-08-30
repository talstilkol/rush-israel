#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { fromRoot } from "./project-root.mjs";
import { stripRsh019Overlay } from "./rsh019-overlay.mjs";
import {
  readEngineAdapterInputs,
  validateEngineAdapters,
} from "./check-engine-adapters.mjs";
import { reconstructRsh016EngineSource } from "./load-engine-adapters.mjs";
import {
  LEGACY_WORLD_BYTES,
  LEGACY_WORLD_GIT_BLOB_SHA1,
  LEGACY_WORLD_LINES,
  LEGACY_WORLD_SHA256,
  gitBlobSha1,
  reconstructLegacyWorldSource,
  sha256,
} from "./load-world-core.mjs";
import { reconstructRsh015WorldSource } from "./load-world-builders.mjs";

export const EXPECTED_MANIFEST_SHA256 = "3d0b85bd8b3646dac24490b5b3480db246a853ca2648b665eb66d48ad2a73629";
export const EXPECTED_WORLD_SHA256 = "b750d1ffc51a34a5b5d557e821577f6c679cef903c3b682514b03d52078b3fdc";
export const EXPECTED_CORE_SHA256 = "cbb9ac1f9de387cb1b31290fbc617b0ca34536b97067198b61e82ffcaf31fafe";
export const EXPECTED_DEPENDENCY_MAP_SHA256 = "043847573b5f3b3fd66f2174b052539b34899b864e2fe0fedbcf4ce33dd10471";
export const EXPECTED_TRACK_MANIFEST_SHA256 = "a8891a4af9345dbfa34fcb998302b77383f3b14f19fd240c9a8c46d2e5a43fdd";
export const EXPECTED_TRACK_SCHEMA_SHA256 = "56f2f29c131d8df1b98c5fdc909fd1fe35cf21de2346d6f9f8189b6d1abec208";
export const EXPECTED_RUNTIME_DIGEST = "a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d";
export const EXPECTED_AGGREGATE_DIGEST = "1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7";

const OUTPUT_KEYS = [
  "group", "sun", "sky", "dir", "dirNear", "waterMesh", "colliders", "streets", "ramps",
  "night", "weather", "followShadows", "followMirror", "setPlanar", "sunDir", "tick",
  "setTime", "setClock", "clock", "setWeather", "setLod", "dispose",
];
const INPUT_KEYS = [
  "group", "sun", "sky", "dir", "dirNear", "waterMesh", "colliders", "streets", "ramps",
  "getNight", "getWeather", "followShadows", "followMirror", "setPlanar", "sunDir", "tick",
  "setTime", "setClock", "getClock", "setWeather", "setLod", "dispose",
];
const ALLOWED_CORE_IMPORTS = ["three", "three/examples/jsm/objects/Sky.js", "./types"];
const FORBIDDEN_RSH016_PATHS = [
  "src/game/world/",
  "src/game/world-builders/",
  "src/game/track-builders/",
  "src/game/builders/",
  "src/game/tracks/builders/",
];
const PRESERVED_PATHS = [
  "src/game/engine.ts",
  "src/game/physics.ts",
  "src/game/save.ts",
  "src/game/records.ts",
  "src/rendering/EnvironmentState.ts",
  "src/rendering/RendererFacade.ts",
  "src/rendering/ResourceRegistry.ts",
  "src/world/AssetRegistry.ts",
  "ASSET-PROVENANCE.json",
  "PRODUCT-DEFINITION.json",
  "package-lock.json",
  "scripts/drive-smoke.mjs",
  "scripts/ramp-smoke.mjs",
  "scripts/webgl2-smoke.mjs",
  "scripts/accel-smoke.mjs",
  "scripts/collider-offset-smoke.mjs",
  "scripts/airborne-smoke.mjs",
  "scripts/soak-smoke.mjs",
];

function dependencyMapDigest(packageSource) {
  const pkg = JSON.parse(packageSource);
  // Use recursive stable normalization, matching the manifest generator.
  const stable = JSON.stringify(
    { dependencies: pkg.dependencies ?? {}, devDependencies: pkg.devDependencies ?? {} },
    (_key, value) => value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
      : value,
  ) + "\n";
  return createHash("sha256").update(stable).digest("hex");
}
function lineCount(source) {
  return (source.match(/\n/g) ?? []).length;
}
function parse(fileName, source, errors) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (const diagnostic of file.parseDiagnostics) {
    errors.push(`${fileName} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
  }
  return file;
}
function hasModifier(node, kind) {
  return node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
}
function propertyName(property) {
  const name = property.name;
  if (!name) return null;
  return ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) ? name.text : null;
}
function walk(node, visit) {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}
function walkFiles(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory)) {
    if ([".git", "node_modules", "dist", ".output", ".nitro"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const relative = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walkFiles(absolute, relative));
    else out.push(relative);
  }
  return out.sort();
}
function readGameSources(repositoryFiles) {
  return Object.fromEntries(
    repositoryFiles
      .filter((path) => path.startsWith("src/game/") && /\.(?:ts|tsx)$/.test(path))
      .map((path) => [path, readFileSync(fromRoot(...path.split("/")), "utf8")]),
  );
}
export function readWorldCoreInputs() {
  const repositoryFiles = walkFiles(fromRoot());
  const engineAdapterInputs = readEngineAdapterInputs();
  return {
    manifestSource: readFileSync(fromRoot("WORLD-CORE-MANIFEST.json"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    coreSource: readFileSync(fromRoot("src", "game", "world-core.ts"), "utf8"),
    engineSource: readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
    engineAdapterManifestSource: engineAdapterInputs.manifestSource,
    engineAdapterSupportSource: engineAdapterInputs.supportSource,
    engineAdapterSources: engineAdapterInputs.adapterSources,
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    trackManifestSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    trackSchemaSource: readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8"),
    assetProvenanceSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles,
    gameSources: readGameSources(repositoryFiles),
    preservedSources: Object.fromEntries(PRESERVED_PATHS.map((path) => [path, readFileSync(fromRoot(...path.split("/")), "utf8")])),
  };
}
function validateCoreAst(coreSource, errors) {
  const file = parse("src/game/world-core.ts", coreSource, errors);
  if (/^\s*\/\/\s*@ts-nocheck/m.test(coreSource)) errors.push("world-core.ts must not use @ts-nocheck");

  const imports = file.statements.filter(ts.isImportDeclaration);
  const importModules = imports.map((statement) => statement.moduleSpecifier.text);
  if (JSON.stringify(importModules) !== JSON.stringify(ALLOWED_CORE_IMPORTS)) {
    errors.push("world-core imports differ from the narrow type-only boundary");
  }
  for (const statement of imports) {
    if (!statement.importClause?.isTypeOnly) errors.push(`world-core runtime import is forbidden: ${statement.moduleSpecifier.text}`);
  }

  const exported = [];
  for (const statement of file.statements) {
    if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword)) continue;
    if ((ts.isTypeAliasDeclaration(statement) || ts.isFunctionDeclaration(statement)) && statement.name) exported.push(statement.name.text);
  }
  if (JSON.stringify(exported) !== JSON.stringify(["World", "WorldCoreAssembly", "assembleWorld"])) {
    errors.push("world-core export ownership differs from the contract");
  }

  const assemble = file.statements.find((statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === "assembleWorld");
  if (!assemble?.body) {
    errors.push("world-core must own assembleWorld exactly once");
    return;
  }
  const returns = assemble.body.statements.filter(ts.isReturnStatement);
  const object = returns[0]?.expression;
  if (returns.length !== 1 || !object || !ts.isObjectLiteralExpression(object)) {
    errors.push("assembleWorld must return exactly one object literal");
    return;
  }
  const keys = object.properties.map(propertyName);
  if (JSON.stringify(keys) !== JSON.stringify(OUTPUT_KEYS)) errors.push("world lifecycle/public key order differs from the accepted contract");

  const getterCalls = new Map();
  for (const property of object.properties) {
    if (!ts.isGetAccessorDeclaration(property) || !property.body) continue;
    const returned = property.body.statements.find(ts.isReturnStatement)?.expression;
    if (returned && ts.isCallExpression(returned) && ts.isIdentifier(returned.expression)) {
      getterCalls.set(propertyName(property), returned.expression.text);
    }
  }
  if (JSON.stringify(Object.fromEntries(getterCalls)) !== JSON.stringify({ night: "getNight", weather: "getWeather", clock: "getClock" })) {
    errors.push("world accessors no longer delegate to the accepted live state providers");
  }

  const calls = [];
  let newExpressions = 0;
  let awaitExpressions = 0;
  walk(assemble.body, (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) calls.push(node.expression.text);
    if (ts.isNewExpression(node)) newExpressions += 1;
    if (ts.isAwaitExpression(node)) awaitExpressions += 1;
  });
  if (JSON.stringify(calls) !== JSON.stringify(["getNight", "getWeather", "getClock"])) {
    errors.push("world-core contains side-effecting or unauthorized calls");
  }
  if (newExpressions !== 0 || awaitExpressions !== 0) errors.push("world-core must not construct or await resources");
}
function validateWorldAst(worldSource, errors) {
  const file = parse("src/game/world.ts", worldSource, errors);
  if (/^\s*\/\/\s*@ts-nocheck/m.test(worldSource)) errors.push("world.ts must not use @ts-nocheck");
  const coreImports = file.statements.filter((statement) => ts.isImportDeclaration(statement) && statement.moduleSpecifier.text === "./world-core");
  const assembleImports = coreImports.flatMap((statement) => statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)
    ? statement.importClause.namedBindings.elements.filter((element) => element.name.text === "assembleWorld") : []);
  if (assembleImports.length !== 1 || coreImports.length !== 1) errors.push("world.ts must import assembleWorld from world-core exactly once");

  const worldTypeExports = file.statements.filter((statement) => ts.isExportDeclaration(statement)
    && statement.isTypeOnly && statement.moduleSpecifier?.text === "./world-core"
    && statement.exportClause && ts.isNamedExports(statement.exportClause)
    && statement.exportClause.elements.some((element) => element.name.text === "World"));
  if (worldTypeExports.length !== 1) errors.push("world.ts must re-export World from world-core exactly once");
  if (file.statements.some((statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === "World")) {
    errors.push("world.ts duplicates world-core World ownership");
  }

  const createWorld = file.statements.filter((statement) => ts.isFunctionDeclaration(statement)
    && statement.name?.text === "createWorld" && hasModifier(statement, ts.SyntaxKind.ExportKeyword));
  if (createWorld.length !== 1) errors.push("world.ts must export createWorld exactly once");

  const calls = [];
  walk(file, (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "assembleWorld") calls.push(node);
  });
  if (calls.length !== 1) {
    errors.push("world.ts must delegate lifecycle assembly exactly once");
  } else {
    const arg = calls[0].arguments[0];
    if (!arg || !ts.isObjectLiteralExpression(arg)) errors.push("assembleWorld must receive one explicit object literal");
    else {
      const keys = arg.properties.map(propertyName);
      if (JSON.stringify(keys) !== JSON.stringify(INPUT_KEYS)) errors.push("world.ts lifecycle assembly wiring is missing or reordered");
      const dispose = arg.properties.find((property) => propertyName(property) === "dispose");
      const disposalSource = dispose?.getText(file) ?? "";
      if (
        !disposalSource.includes("if (disposed) return;") ||
        !disposalSource.includes("disposeObject3D(group, tracker)") ||
        !disposalSource.includes("for (let index = bag.length - 1; index >= 0; index -= 1)")
      ) {
        errors.push("world.ts disposal no longer preserves the RSH-019 ownership contract");
      }
    }
  }

  const publicExports = [];
  for (const statement of file.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name && hasModifier(statement, ts.SyntaxKind.ExportKeyword)) publicExports.push(statement.name.text);
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      publicExports.push(...statement.exportClause.elements.map((element) => element.name.text));
    }
  }
  if (JSON.stringify(publicExports.sort()) !== JSON.stringify(["World", "createWorld"])) {
    errors.push("world.ts public exports changed");
  }
}
function validateEngine(engineSource, errors) {
  const file = parse("src/game/engine.ts", engineSource, errors);
  const imports = file.statements.filter((statement) => ts.isImportDeclaration(statement));
  if (imports.some((statement) => statement.moduleSpecifier.text === "./world-core")) errors.push("engine.ts must not bypass the world.ts facade");
  const worldImports = imports.filter((statement) => statement.moduleSpecifier.text === "./world");
  if (worldImports.length !== 1) {
    errors.push("engine.ts world facade import changed");
    return;
  }
  const elements = worldImports[0].importClause?.namedBindings && ts.isNamedImports(worldImports[0].importClause.namedBindings)
    ? worldImports[0].importClause.namedBindings.elements : [];
  const values = elements.filter((element) => !element.isTypeOnly).map((element) => element.name.text);
  const types = elements.filter((element) => element.isTypeOnly).map((element) => element.name.text);
  if (JSON.stringify(values) !== JSON.stringify(["createWorld"]) || JSON.stringify(types) !== JSON.stringify(["World"])) {
    errors.push("engine.ts createWorld/World consumer wiring changed");
  }
}
function validateOwnership(gameSources, errors) {
  const worldOwners = [];
  const assemblyOwners = [];
  for (const [path, source] of Object.entries(gameSources)) {
    if (/\b(?:export\s+)?type\s+World\s*=/.test(source)) worldOwners.push(path);
    if (/\bfunction\s+assembleWorld\s*\(/.test(source)) assemblyOwners.push(path);
  }
  if (JSON.stringify(worldOwners) !== JSON.stringify(["src/game/world-core.ts"])) errors.push(`duplicate world-contract ownership: ${worldOwners.join(", ")}`);
  if (JSON.stringify(assemblyOwners) !== JSON.stringify(["src/game/world-core.ts"])) errors.push(`duplicate world-core assembly ownership: ${assemblyOwners.join(", ")}`);
}
function reconstructPreservedEngine(input, errors) {
  let engineManifest;
  try {
    engineManifest = JSON.parse(input.engineAdapterManifestSource);
  } catch (error) {
    errors.push(`RSH-017 engine-adapter manifest is invalid JSON: ${error.message}`);
    return input.engineSource;
  }

  const validation = validateEngineAdapters({
    manifestSource: input.engineAdapterManifestSource,
    engineSource: input.engineSource,
    supportSource: input.engineAdapterSupportSource,
    adapterSources: input.engineAdapterSources,
  });
  errors.push(...validation.errors.map(
    (error) => `RSH-017 engine-adapter authority invalid: ${error}`,
  ));

  try {
    return reconstructRsh016EngineSource(
      input.engineSource,
      engineManifest,
      input.engineAdapterSources,
    );
  } catch (error) {
    errors.push(`RSH-017 engine reconstruction failed: ${error.message}`);
    return input.engineSource;
  }
}

function validatePreservation(input, manifest, errors) {
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("world-core manifest differs from the accepted RSH-015 authority");
  if (manifest.schema_version !== "1.0.0" || manifest.document_type !== "rush-world-core-manifest" || manifest.unit !== "RSH-015") {
    errors.push("world-core manifest identity is invalid");
  }
  if (sha256(input.worldSource) !== EXPECTED_WORLD_SHA256) errors.push("world.ts differs from the bounded extracted facade");
  if (sha256(input.coreSource) !== EXPECTED_CORE_SHA256) errors.push("world-core.ts differs from its canonical owner implementation");
  if (lineCount(input.worldSource) > manifest.extraction.facade.lines || Buffer.byteLength(input.worldSource) > manifest.extraction.facade.bytes) {
    errors.push("world.ts regrew beyond the accepted extracted boundary");
  }
  try {
    const reconstructed = reconstructLegacyWorldSource(reconstructRsh015WorldSource(input.worldSource));
    if (sha256(reconstructed) !== LEGACY_WORLD_SHA256 || gitBlobSha1(reconstructed) !== LEGACY_WORLD_GIT_BLOB_SHA1
      || lineCount(reconstructed) !== LEGACY_WORLD_LINES || Buffer.byteLength(reconstructed) !== LEGACY_WORLD_BYTES) {
      errors.push("world runtime source drifts from the accepted pre-extraction baseline");
    }
  } catch (error) {
    errors.push(`world runtime reconstruction failed: ${error.message}`);
  }

  if (sha256(input.trackManifestSource) !== EXPECTED_TRACK_MANIFEST_SHA256) errors.push("RSH-014 track-module manifest integrity changed");
  if (sha256(input.trackSchemaSource) !== EXPECTED_TRACK_SCHEMA_SHA256) errors.push("track schema integrity changed");
  const tracks = JSON.parse(input.trackManifestSource);
  if (tracks.layout?.module_count !== 56 || tracks.modules?.length !== 56 || tracks.counts?.total !== 56
    || tracks.counts?.mvp !== 8 || tracks.counts?.deferred !== 48 || tracks.runtime_order?.length !== 56) {
    errors.push("track count/classification/order boundary changed");
  }
  if (tracks.semantic_integrity?.ordered_runtime_definition_digest_sha256 !== EXPECTED_RUNTIME_DIGEST
    || tracks.semantic_integrity?.aggregate_runtime_definition_digest_sha256 !== EXPECTED_AGGREGATE_DIGEST) {
    errors.push("track runtime-definition digest changed");
  }

  const reconstructedEngineSource = reconstructPreservedEngine(input, errors);
  for (const [name, authority] of Object.entries(manifest.preservation_identities)) {
    if (name === "smokes") continue;
    const source = authority.path === "src/game/engine.ts"
      ? reconstructedEngineSource
      : input.preservedSources[authority.path];
    if (typeof source !== "string" || sha256(source) !== authority.sha256) errors.push(`${authority.path} preservation identity changed`);
  }
  for (const authority of Object.values(manifest.preservation_identities.smokes)) {
    const source = input.preservedSources[authority.path];
    if (typeof source !== "string" || sha256(source) !== authority.sha256) errors.push(`${authority.path} preservation identity changed`);
  }
  if (!/export const PHYSICS_HZ = 120;/.test(input.preservedSources["src/game/physics.ts"] ?? "")) errors.push("physics rate is not 120 Hz");

  const asset = JSON.parse(input.assetProvenanceSource);
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false
    || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) {
    errors.push("asset provenance, distribution or release-gate boundary changed");
  }
  if (dependencyMapDigest(input.packageSource) !== EXPECTED_DEPENDENCY_MAP_SHA256) errors.push("dependency map changed");
  if (sha256(input.preservedSources["package-lock.json"] ?? "") !== manifest.dependency_preservation.package_lock_sha256) errors.push("package-lock changed");
}
function validateDeferredBoundary(repositoryFiles, errors) {
  for (const path of repositoryFiles) {
    const normalized = path.replaceAll("\\", "/");
    if (normalized.startsWith("src/game/world-builders/")) continue;
    if (FORBIDDEN_RSH016_PATHS.some((prefix) => normalized.startsWith(prefix))
      || /(?:^|\/)(?:world|track)-builders?(?:\/|\.|$)/.test(normalized)) {
      errors.push(`unauthorized RSH-016 structure: ${normalized}`);
    }
  }
}
export function validateWorldCore(overrides = {}) {
  const input = { ...readWorldCoreInputs(), ...overrides };
  const errors = [];
  let manifest;
  try { manifest = JSON.parse(input.manifestSource); }
  catch (error) { return { errors: [`WORLD-CORE-MANIFEST.json is invalid JSON: ${error.message}`] }; }
  validateCoreAst(input.coreSource, errors);
  validateWorldAst(input.worldSource, errors);
  validateEngine(input.engineSource, errors);
  validateOwnership(input.gameSources, errors);
  validateDeferredBoundary(input.repositoryFiles, errors);
  validatePreservation(input, manifest, errors);
  return {
    errors,
    worldLines: lineCount(stripRsh019Overlay("src/game/world.ts", input.worldSource)),
    worldBytes: Buffer.byteLength(stripRsh019Overlay("src/game/world.ts", input.worldSource)),
    coreLines: lineCount(input.coreSource),
    coreBytes: Buffer.byteLength(input.coreSource),
    reconstructedWorldSha256: errors.length ? null : LEGACY_WORLD_SHA256,
  };
}
function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(moduleUrl); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateWorldCore();
  if (result.errors.length) {
    console.error("world-core fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`world-core ok: world ${result.worldLines} lines/${result.worldBytes} bytes; core ${result.coreLines} lines/${result.coreBytes} bytes; reconstructed ${result.reconstructedWorldSha256}`);
}
