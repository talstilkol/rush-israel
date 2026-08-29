#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { fromRoot } from "./project-root.mjs";

export const SHARED_MARKER = "// RSH-014: GENERATED EXPORT BRIDGE — excluded from the reconstructed RSH-013 source\n";
export const FACADE_MARKER = "// RSH-014: RECONSTRUCTED LEGACY POSTLUDE START\n";

export function sha256(value) {
  return createHash("sha256").update(String(value), "utf8").digest("hex");
}
export function gitBlobSha1(value) {
  const body = Buffer.from(String(value), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}
function parse(fileName, source) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  if (file.parseDiagnostics.length) throw new Error(`${fileName} has TypeScript parse diagnostics`);
  return file;
}
function unwrap(node) {
  let current = node;
  while (current && (ts.isParenthesizedExpression(current) || ts.isAsExpression(current)
    || ts.isSatisfiesExpression(current) || ts.isNonNullExpression(current))) current = current.expression;
  return current;
}
export function extractTrackObjectSource(source, path = "track-module.ts") {
  const file = parse(path, source);
  const assignment = file.statements.find((statement) => ts.isExportAssignment(statement));
  if (!assignment || assignment.isExportEquals) throw new Error(`${path} must default-export defineTrack(...)`);
  const call = unwrap(assignment.expression);
  if (!ts.isCallExpression(call) || !ts.isIdentifier(call.expression)
    || call.expression.text !== "defineTrack" || call.arguments.length !== 1) {
    throw new Error(`${path} must default-export defineTrack(object)`);
  }
  const object = unwrap(call.arguments[0]);
  if (!ts.isObjectLiteralExpression(object)) throw new Error(`${path} defineTrack argument must be an object literal`);
  return source.slice(object.getStart(file), object.end);
}
export function readTrackModuleManifestSource() {
  return readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8");
}
export function readTrackModuleManifest() {
  return JSON.parse(readTrackModuleManifestSource());
}
let cache = null;
export function readTrackModuleBundle() {
  if (cache) return cache;
  const manifestSource = readTrackModuleManifestSource();
  const manifest = JSON.parse(manifestSource);
  const sharedSource = readFileSync(fromRoot(...manifest.layout.shared_path.split("/")), "utf8");
  const facadeSource = readFileSync(fromRoot(...manifest.layout.facade_path.split("/")), "utf8");
  const indexSource = readFileSync(fromRoot(...manifest.layout.index_path.split("/")), "utf8");
  const moduleSources = Object.fromEntries(manifest.modules.map((entry) => [
    entry.path,
    readFileSync(fromRoot(...entry.path.split("/")), "utf8"),
  ]));
  cache = { manifest, manifestSource, sharedSource, facadeSource, indexSource, moduleSources };
  return cache;
}
export function reconstructCanonicalTrackSource(bundle = readTrackModuleBundle()) {
  const { manifest, sharedSource, facadeSource, moduleSources } = bundle;
  const sharedMarker = sharedSource.indexOf(SHARED_MARKER);
  if (sharedMarker < 0) throw new Error("shared source export bridge marker missing");
  const sharedLegacy = sharedSource.slice(0, sharedMarker)
    .replaceAll('"../math"', '"./math"')
    .replaceAll('"../types"', '"./types"');
  const facadeMarker = facadeSource.indexOf(FACADE_MARKER);
  if (facadeMarker < 0) throw new Error("track facade postlude marker missing");
  const postlude = facadeSource.slice(facadeMarker + FACADE_MARKER.length);
  const objects = manifest.modules.map((entry) => extractTrackObjectSource(moduleSources[entry.path], entry.path));
  const layout = manifest.legacy_reconstruction.layout;
  let statement = layout.statement_prefix + layout.leading;
  objects.forEach((object, index) => {
    statement += object;
    if (index < layout.separators.length) statement += layout.separators[index];
  });
  statement += layout.trailing + layout.statement_suffix;
  return sharedLegacy + statement + postlude;
}
let canonicalSourceCache = null;
export function readCanonicalTrackSource() {
  canonicalSourceCache ??= reconstructCanonicalTrackSource();
  return canonicalSourceCache;
}
