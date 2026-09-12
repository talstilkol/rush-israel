#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "7d01c108446d8f536841f1bdae4d3c86bad29d9af1634543d9e6a91a6f5ac408";
export const EXPECTED_METRICS_SHA256 = "d76bc0131c31dfbf3d86de081d45a70fba49d0130755ad04368aceaf4592492a";
export const EXPECTED_INDEX_SHA256 = "adb2baa7d31786c21d36a65088606633dd5687a7388943fede5c3b1d1d1e546a";
export const EXPECTED_CONTRACT_SHA256 = "2e5ec28867b83bf444043be2b60a9aaa30e2296704e3f9a914e29f296f7066ec";
export const EXPECTED_TELEMETRY_SHA256 = "cfcfedd7462acdc6afce995edb5a8b081f601e026d005f4ba1b99273cd03af8d";
export const EXPECTED_LOOP_SHA256 = "88d8f39ff363664cc0a0ab965f7d9a174377961b8683d0752b200769439262c8";
export const EXPECTED_RENDERING_SHA256 = "947ca69a89f12550a4ba5c631f2004598dec8849368a762b29ed9d681a2d7132";
export const EXPECTED_QA_SHA256 = "973b8606f5e417e9477bf4b07a2bf8fba49b500003833a9e0d76396ad903730c";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_CHECKER_TEST_SHA256 = "264154533036312fdbb392ee3b6cf38a2a8a08c55a7c88ce55f691753e4ddb0a";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_PERF_DIGEST_SHA256 = "7475ef5f789a4950cf82743aa5a7d499075e8d37813a65ef4c0dc6b658b222fd";
export const EXPECTED_FREEZE_DIGEST_SHA256 = "9b7a9ffa0ed5835294f11c3f941d40abf015d85c76c03f2e9e94403bd08b5098";

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function sha256File(path) { return sha256(readFileSync(path)); }
function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "coverage", ".vercel", ".output", ".nitro", "dist"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const path = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path));
    else out.push(path);
  }
  return out;
}
function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" }).split("\0").filter(Boolean).sort();
  } catch { return walk(fromRoot()); }
}

export function canonicalPerfDigest() {
  return [
    "sample_cap=120",
    "percentiles=50,95,99",
    "draw_calls=renderer.info.render.calls",
    "triangles=renderer.info.render.triangles",
    "memory_textures=renderer.info.memory.textures",
    "memory_geometries=renderer.info.memory.geometries",
    "js_heap=optional_performance_memory",
    "budgets_enforced=false",
    "quality_profiles=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readPerfInstrumentInputs() {
  return {
    manifestSource: readFileSync(fromRoot("PERF-INSTRUMENT-MANIFEST.json"), "utf8"),
    metricsSource: readFileSync(fromRoot("src", "game", "perf-instrument", "metrics.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "perf-instrument", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-037-PERF-INSTRUMENT-CONTRACT.md"), "utf8"),
    telemetrySource: readFileSync(fromRoot("src", "rendering", "RenderTelemetry.ts"), "utf8"),
    loopSource: readFileSync(fromRoot("src", "game", "engine", "loop-adapter.ts"), "utf8"),
    renderingSource: readFileSync(fromRoot("src", "game", "engine", "rendering-adapter.ts"), "utf8"),
    qaSource: readFileSync(fromRoot("src", "game", "engine", "qa-adapter.ts"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-perf-instrument.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    findingsSource: readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validatePerfInstrument(overrides = {}) {
  const input = { ...readPerfInstrumentInputs(), ...overrides };
  const errors = [];
  let manifest, freeze;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
  } catch (error) {
    return { errors: [`RSH-037 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("perf-instrument manifest differs from the reviewed RSH-037 authority");
  const identities = {
    metrics_source_sha256: [input.metricsSource, EXPECTED_METRICS_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    telemetry_source_sha256: [input.telemetrySource, EXPECTED_TELEMETRY_SHA256],
    loop_source_sha256: [input.loopSource, EXPECTED_LOOP_SHA256],
    rendering_source_sha256: [input.renderingSource, EXPECTED_RENDERING_SHA256],
    qa_source_sha256: [input.qaSource, EXPECTED_QA_SHA256],
    hud_source_sha256: [input.hudSource, EXPECTED_HUD_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalPerfDigest()) !== EXPECTED_PERF_DIGEST_SHA256 || manifest.identities?.perf_digest_sha256 !== EXPECTED_PERF_DIGEST_SHA256) errors.push("perf digest identity changed");
  if (manifest.unit !== "RSH-037") errors.push("RSH-037 unit identity changed");
  if (manifest.lock?.sample_cap !== 120) errors.push("sample cap changed");
  if (JSON.stringify(manifest.lock?.percentiles) !== "[50,95,99]") errors.push("percentile set changed");
  if (manifest.lock?.budgets_enforced !== false) errors.push("RSH-037 must not enforce budgets");
  if (manifest.lock?.quality_profiles !== false) errors.push("RSH-037 must not define quality profiles");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-037 must not claim a real-device baseline");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-037 must not claim GIS accuracy, owner freeze or public distribution");
  if (!/export const PERF_SAMPLE_CAP = 120/.test(input.metricsSource)) errors.push("sample cap token missing");
  if (!/from "\.\/metrics"/.test(input.indexSource)) errors.push("perf-instrument index no longer re-exports metrics");
  if (!/p50: \+pct\(slice, 50\)/.test(input.telemetrySource) || !/p95: \+pct\(slice, 95\)/.test(input.telemetrySource) || !/p99: \+pct\(slice, 99\)/.test(input.telemetrySource)) errors.push("RenderTelemetry percentiles changed");
  if (!/this\.telem\.push\(dt \* 1000\)/.test(input.loopSource)) errors.push("loop adapter no longer samples frame times");
  if (!/drawCalls: this\.renderer\.info\.render\.calls/.test(input.renderingSource)) errors.push("rendering adapter no longer samples draw calls");
  if (!/triangles: this\.renderer\.info\.render\.triangles/.test(input.renderingSource)) errors.push("rendering adapter no longer samples triangles");
  if (!/textures: this\.renderer\.info\.memory\.textures/.test(input.renderingSource)) errors.push("rendering adapter no longer samples GPU textures");
  if (!/geometries: this\.renderer\.info\.memory\.geometries/.test(input.renderingSource)) errors.push("rendering adapter no longer samples GPU geometries");
  if (!/getMemory: \(\) => \(\{[\s\S]*textures: this\.renderer\.info\.memory\.textures/.test(input.qaSource)) errors.push("QA adapter no longer exposes GPU memory");
  if (!/p95 /.test(input.hudSource) || !/drawCalls/.test(input.hudSource) || !/triangles/.test(input.hudSource)) errors.push("HUD no longer surfaces p95/draw-calls/triangles");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN until a real-device baseline exists");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-037 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-038 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-038" || manifest.deferred_boundary?.rsh_038_authorized !== false || manifest.deferred_boundary?.rsh_038_started !== false) errors.push("RSH-038 deferred boundary changed");
  return { errors, instrumented: errors.length === 0, metrics: PERF_METRICS_COUNT() };
}

function PERF_METRICS_COUNT() { return 6; }

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validatePerfInstrument();
  if (result.errors.length) {
    console.error(`perf-instrument fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`perf-instrument ok: p50/p95/p99 + draw/tri/memory; RSH-038 deferred`);
}
