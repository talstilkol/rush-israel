import { historicalRsh036Source } from "./rsh036-runtime-evolution.mjs";
import { readFileSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";
import { gitBlobSha1, sha256 } from "./load-world-builders.mjs";
import { stripRsh019Overlay } from "./rsh019-overlay.mjs";

export const RSH016_ENGINE_SHA256 = "3f4d54bbe0b68f9654ae8a92a2f56ce378a59a9790e8fbbe2ee05199ced192c1";
export const RSH016_ENGINE_GIT_BLOB_SHA1 = "692663c6d05ab59c1d99c7a357999839b9ebb0ec";
export const RSH016_ENGINE_LINES = 2815;
export const RSH016_ENGINE_BYTES = 99577;

function replaceOnce(source, before, after, label) {
  const pieces = source.split(before);
  if (pieces.length !== 2) throw new Error(`${label} must occur exactly once`);
  return pieces[0] + after + pieces[1];
}

function extractBody(source, method) {
  const begin = `// RSH-017-BODY-BEGIN:${method}\n`;
  const end = `\n// RSH-017-BODY-END:${method}`;
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (
    start < 0 ||
    finish < 0 ||
    source.indexOf(begin, start + begin.length) >= 0 ||
    source.indexOf(end, finish + end.length) >= 0
  ) {
    throw new Error(`${method} body markers are missing or duplicated`);
  }
  return source.slice(start + begin.length, finish);
}

export function reconstructRsh016EngineSource(
  source = readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
  manifest = JSON.parse(readFileSync(fromRoot("ENGINE-ADAPTER-MANIFEST.json"), "utf8")),
  adapterSources = Object.fromEntries(
    manifest.extraction.adapters.map((adapter) => [
      adapter.path,
      readFileSync(fromRoot(...adapter.path.split("/")), "utf8"),
    ]),
  ),
) {
  source = historicalRsh036Source(source);
  source = stripRsh019Overlay("src/game/engine.ts", source);
  adapterSources = Object.fromEntries(
    Object.entries(adapterSources).map(([path, adapterSource]) => [
      path,
      stripRsh019Overlay(path, adapterSource),
    ]),
  );
  let engine = replaceOnce(
    source,
    manifest.reconstruction.adapter_import_block,
    "",
    "RSH-017 adapter import block",
  );
  for (const method of manifest.reconstruction.methods) {
    const adapterSource = adapterSources[method.path];
    if (typeof adapterSource !== "string") throw new Error(`missing adapter source ${method.path}`);
    const body = extractBody(adapterSource, method.name);
    if (sha256(body) !== method.body_sha256) throw new Error(`${method.name} adapter body drifted`);
    engine = replaceOnce(
      engine,
      method.wrapper_source,
      method.original_prefix + body + method.original_suffix,
      `${method.name} facade wrapper`,
    );
  }
  return engine;
}

export function engineIdentity(source) {
  return {
    sha256: sha256(source),
    gitBlobSha1: gitBlobSha1(source),
    lines: (source.match(/\n/g) ?? []).length,
    bytes: Buffer.byteLength(source),
  };
}
