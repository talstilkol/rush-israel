import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";

export const RSH015_WORLD_SHA256 = "64d3aed2e9d4a6dca0fcdbd7d27bb924783afc441549d76cb4079f399b11b107";
export const RSH015_WORLD_GIT_BLOB_SHA1 = "a6586b78725573f97ef9d938f592ab545aba793d";
export const RSH015_WORLD_LINES = 9006;
export const RSH015_WORLD_BYTES = 352625;

export function sha256(source) { return createHash("sha256").update(source).digest("hex"); }
export function gitBlobSha1(source) {
  const body = Buffer.from(source);
  return createHash("sha1").update(`blob ${body.length}\0`).update(body).digest("hex");
}
function extractBetween(source, begin, end, label) {
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (start < 0 || finish < 0 || source.indexOf(begin, start + begin.length) >= 0 || source.indexOf(end, finish + end.length) >= 0) {
    throw new Error(`${label} markers are missing or duplicated`);
  }
  return source.slice(start + begin.length, finish);
}
function replaceOnce(source, before, after, label) {
  const pieces = source.split(before);
  if (pieces.length !== 2) throw new Error(`${label} must occur exactly once`);
  return pieces[0] + after + pieces[1];
}
export function reconstructRsh015WorldSource(source = readFileSync(fromRoot("src", "game", "world.ts"), "utf8")) {
  const manifest = JSON.parse(readFileSync(fromRoot("WORLD-BUILDER-MANIFEST.json"), "utf8"));
  const layout = manifest.reconstruction;
  const markers = layout.markers;
  let world = replaceOnce(source, `\n${layout.new_import_edge}`, "", "RSH-016 import edge");
  world = replaceOnce(world, layout.extracted_call, layout.original_call, "RSH-016 call edge");
  const sharedSource = readFileSync(fromRoot(...manifest.extraction.shared.path.split("/")), "utf8");
  let fn = layout.function_header + extractBetween(sharedSource, markers.shared_begin, markers.shared_end, "shared builder");
  for (const id of layout.legacy_builder_order) {
    const module = manifest.extraction.modules.find((candidate) => candidate.id === id);
    if (!module) throw new Error(`legacy-order world builder ${id} is missing`);
    const moduleSource = readFileSync(fromRoot(...module.path.split("/")), "utf8");
    const body = extractBetween(moduleSource, markers.body_begin, markers.body_end, module.id);
    fn += module.layout.prefix + body + module.layout.suffix + module.layout.separator_after;
  }
  const indexSource = readFileSync(fromRoot(...manifest.extraction.registry.path.split("/")), "utf8");
  fn += extractBetween(indexSource, markers.final_begin, markers.final_end, "final street builder") + layout.function_close_suffix;
  if (!world.endsWith(layout.after_function_suffix)) throw new Error("RSH-016 world function suffix anchor changed");
  const at = world.length - layout.after_function_suffix.length;
  return world.slice(0, at) + fn + world.slice(at);
}
