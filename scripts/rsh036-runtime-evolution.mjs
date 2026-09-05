import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";

// Only these reviewed exact bytes may be projected for pre-RSH-036 history checks.
// Production behavioral tests always import the real current modules, not this projection.
export const EXPECTED_EVOLUTION_SHA256 = "7f2a5677085603b068e3a5ff3bda85ea5f0d50e90503d8b5db776819c3a80f3e";
const hash = value => createHash("sha256").update(value).digest("hex");
export function readEvolution(text = readFileSync(fromRoot("RSH-036-RUNTIME-EVOLUTION.json"), "utf8")) {
  if (hash(text) !== EXPECTED_EVOLUTION_SHA256) throw new Error("RSH-036 runtime evolution authority drift");
  return JSON.parse(text);
}
export function historicalRsh036Source(source) {
  if (typeof source !== "string") return source;
  const digest = hash(source);
  const row = Object.values(readEvolution().files).find(item => item.previous_sha256 && item.current_sha256 === digest);
  if (!row) return source; // Unknown/tampered bytes do NOT get a historical exemption.
  const lines = source.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of [...row.reverse_edits].reverse()) {
    const segment = lines.slice(edit.start_line, edit.end_line).join("");
    if (hash(segment) !== edit.current_segment_sha256) throw new Error("RSH-036 reverse edit preimage drift");
    lines.splice(edit.start_line, edit.end_line - edit.start_line, edit.previous_text);
  }
  const previous = lines.join("");
  if (hash(previous) !== row.previous_sha256) throw new Error("RSH-036 historical reconstruction drift");
  return previous;
}
export function historicalRsh036Inputs(value) {
  if (typeof value === "string") return historicalRsh036Source(value);
  if (Array.isArray(value)) return value.map(historicalRsh036Inputs);
  if (value && typeof value === "object" && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, historicalRsh036Inputs(item)]));
  return value;
}
export function validateCurrentRuntime(overrides = {}) {
  const errors = [];
  const manifest = readEvolution();
  for (const [path, expected] of Object.entries(manifest.files)) {
    try {
      const source = Object.hasOwn(overrides, path) ? overrides[path] : readFileSync(fromRoot(path), "utf8");
      if (typeof source !== "string" || hash(source) !== expected.current_sha256) errors.push(`current runtime source drift: ${path}`);
    } catch (error) { errors.push(`missing runtime source: ${path}: ${error.message}`); }
  }
  return { errors, sourceCount: Object.keys(manifest.files).length, accepted: false };
}
