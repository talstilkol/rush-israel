#!/usr/bin/env node
import { readdirSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { fromRoot } from "./project-root.mjs";
import {
  extractTrackObjectSource,
  gitBlobSha1,
  readCanonicalTrackSource,
  readTrackModuleBundle,
  sha256,
} from "./load-track-modules.mjs";

export const EXPECTED_MANIFEST_SHA256 = "a8891a4af9345dbfa34fcb998302b77383f3b14f19fd240c9a8c46d2e5a43fdd";
export const EXPECTED_LEGACY_GIT_BLOB_SHA1 = "e26454223f8a598cdf516af7c7c3f494162e2616";
export const EXPECTED_RUNTIME_DIGEST = "a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d";
export const EXPECTED_AGGREGATE_DIGEST = "1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7";
export const EXPECTED_MODULE_COUNT = 56;

function parse(fileName, source, errors) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (const diagnostic of file.parseDiagnostics) {
    errors.push(`${fileName} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
  }
  return file;
}
function propertyName(name) {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
}
function trackIdFromObjectSource(source, path, errors) {
  let objectSource;
  try { objectSource = extractTrackObjectSource(source, path); }
  catch (error) { errors.push(error.message); return null; }
  const file = parse(path + "#object", `const value = ${objectSource};`, errors);
  const statement = file.statements[0];
  const object = statement?.declarationList?.declarations?.[0]?.initializer;
  if (!object || !ts.isObjectLiteralExpression(object)) return null;
  const idProperty = object.properties.find((property) =>
    ts.isPropertyAssignment(property) && propertyName(property.name) === "id");
  return idProperty && ts.isStringLiteral(idProperty.initializer) ? idProperty.initializer.text : null;
}
function hasCanonicalDefineTrackImport(source, path, errors) {
  const file = parse(path, source, errors);
  const imports = file.statements.filter((statement) => ts.isImportDeclaration(statement));
  const canonical = imports.filter((statement) => statement.moduleSpecifier.text === "../track-schema")
    .flatMap((statement) => statement.importClause?.namedBindings?.elements ?? [])
    .filter((element) => element.name.text === "defineTrack" && !element.propertyName);
  if (canonical.length !== 1) errors.push(`${path} must import canonical defineTrack exactly once`);
  const defaults = file.statements.filter((statement) => ts.isExportAssignment(statement));
  if (defaults.length !== 1) errors.push(`${path} must contain exactly one default export`);
  if (/\bTRACKS\b/.test(source)) errors.push(`${path} must contain one track only, not TRACKS`);
}
function validateIndex(source, manifest, errors) {
  const file = parse(manifest.layout.index_path, source, errors);
  const defaultImports = new Map();
  let defineTracksImports = 0;
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    if (statement.moduleSpecifier.text === "../track-schema") {
      const elements = statement.importClause?.namedBindings?.elements ?? [];
      defineTracksImports += elements.filter((element) => element.name.text === "defineTracks").length;
    }
    if (statement.importClause?.name) defaultImports.set(statement.importClause.name.text, statement.moduleSpecifier.text);
  }
  if (defineTracksImports !== 1) errors.push("track index must import canonical defineTracks exactly once");
  const statement = file.statements.find((item) => ts.isVariableStatement(item)
    && item.declarationList.declarations.some((decl) => ts.isIdentifier(decl.name) && decl.name.text === "TRACKS"));
  const declaration = statement?.declarationList.declarations.find((decl) => ts.isIdentifier(decl.name) && decl.name.text === "TRACKS");
  let init = declaration?.initializer;
  if (init && ts.isAsExpression(init)) init = init.expression;
  if (!init || !ts.isCallExpression(init) || !ts.isIdentifier(init.expression) || init.expression.text !== "defineTracks") {
    errors.push("track index TRACKS must be created by defineTracks");
    return;
  }
  const array = init.arguments[0];
  if (!array || !ts.isArrayLiteralExpression(array)) {
    errors.push("track index defineTracks argument must be an array literal");
    return;
  }
  const actual = array.elements.map((element) => ts.isIdentifier(element) ? defaultImports.get(element.text) : null);
  const expected = manifest.modules.map((entry) => `./${entry.id}`);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push("track index runtime order differs from manifest");
}
export function validateTrackModuleManifest(input = {}) {
  const bundle = input.bundle ?? readTrackModuleBundle();
  const { manifest, manifestSource, sharedSource, facadeSource, indexSource, moduleSources } = bundle;
  const errors = [];
  if (sha256(manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("module manifest differs from accepted RSH-014 authority");
  if (manifest.schema_version !== "1.0.0" || manifest.document_type !== "rush-track-module-manifest") {
    errors.push("module manifest identity is invalid");
  }
  if (manifest.unit !== "RSH-014" || manifest.repository !== "talstilkol/rush-israel" || manifest.canonical_branch !== "main") {
    errors.push("module manifest program authority is invalid");
  }
  if (manifest.layout?.module_count !== EXPECTED_MODULE_COUNT || manifest.modules?.length !== EXPECTED_MODULE_COUNT) {
    errors.push("module manifest must contain exactly 56 track modules");
  }
  if (manifest.counts?.total !== 56 || manifest.counts?.mvp !== 8 || manifest.counts?.deferred !== 48) {
    errors.push("module manifest counts must remain 56/8/48");
  }
  if (manifest.semantic_integrity?.ordered_runtime_definition_digest_sha256 !== EXPECTED_RUNTIME_DIGEST
    || manifest.semantic_integrity?.aggregate_runtime_definition_digest_sha256 !== EXPECTED_AGGREGATE_DIGEST) {
    errors.push("module manifest semantic digests differ from RSH-013");
  }
  const ids = manifest.modules.map((entry) => entry.id);
  if (new Set(ids).size !== 56 || JSON.stringify(ids) !== JSON.stringify(manifest.runtime_order)) {
    errors.push("module IDs/order must be unique and equal runtime_order");
  }
  const expectedFiles = new Set(["index.ts", "shared.ts", ...ids.map((id) => `${id}.ts`)]);
  const actualFiles = new Set(readdirSync(fromRoot("src", "game", "tracks")).filter((name) => name.endsWith(".ts")));
  if (JSON.stringify([...actualFiles].sort()) !== JSON.stringify([...expectedFiles].sort())) {
    errors.push("track module directory must contain exactly shared, index and 56 track files");
  }
  for (const [key, source] of [["facade", facadeSource], ["shared", sharedSource], ["index", indexSource]]) {
    const authority = manifest.source_identities[key];
    if (gitBlobSha1(source) !== authority.git_blob_sha1 || sha256(source) !== authority.sha256) {
      errors.push(`${key} source identity differs from manifest`);
    }
  }
  manifest.modules.forEach((entry, index) => {
    if (entry.ordinal !== index + 1 || entry.path !== `src/game/tracks/${entry.id}.ts`) {
      errors.push(`module entry ${index + 1} path/ordinal is invalid`);
      return;
    }
    const source = moduleSources[entry.path];
    if (typeof source !== "string") { errors.push(`missing module source ${entry.path}`); return; }
    if (gitBlobSha1(source) !== entry.git_blob_sha1 || sha256(source) !== entry.sha256) {
      errors.push(`${entry.path} identity differs from manifest`);
    }
    hasCanonicalDefineTrackImport(source, entry.path, errors);
    const actualId = trackIdFromObjectSource(source, entry.path, errors);
    if (actualId !== entry.id) errors.push(`${entry.path} exports id ${actualId} instead of ${entry.id}`);
  });
  validateIndex(indexSource, manifest, errors);
  const canonicalSource = input.canonicalSource ?? readCanonicalTrackSource();
  const legacyBlob = gitBlobSha1(canonicalSource);
  if (legacyBlob !== EXPECTED_LEGACY_GIT_BLOB_SHA1
    || legacyBlob !== manifest.legacy_reconstruction.expected_git_blob_sha1) {
    errors.push("reconstructed canonical source differs from accepted RSH-013 Git blob");
  }
  if (manifest.change_control?.["RSH-015_authorized"] !== false) errors.push("RSH-015 must remain unauthorized");
  return { errors, manifestSha256: sha256(manifestSource), legacyBlob, moduleCount: manifest.modules.length };
}
function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(moduleUrl); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateTrackModuleManifest();
  if (result.errors.length) {
    console.error("track-module-manifest fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`track-module-manifest ok: ${result.moduleCount} modules; legacy blob ${result.legacyBlob}; manifest ${result.manifestSha256}`);
}
