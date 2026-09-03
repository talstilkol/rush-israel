#!/usr/bin/env node
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { stripRsh019Overlay } from "./rsh019-overlay.mjs";

export const EXPECTED_MANIFEST_SHA256 = "e121116947d63d986d60e57c6d56462e2d9e166aa2c4c285a5b10af06aff7fdd";

function sha256(source) {
  return createHash("sha256").update(source).digest("hex");
}
function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "dist", ".output", ".nitro", ".vercel"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const path = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path));
    else out.push(path);
  }
  return out;
}
export function readResourceOwnershipInputs() {
  const manifestSource = readFileSync(fromRoot("RESOURCE-OWNERSHIP-MANIFEST.json"), "utf8");
  const manifest = JSON.parse(manifestSource);
  return {
    manifestSource,
    sources: Object.fromEntries(
      Object.keys(manifest.runtime_sources).map((path) => [
        path,
        readFileSync(fromRoot(...path.split("/")), "utf8"),
      ]),
    ),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    trackManifestSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    repositoryFiles: walk(fromRoot()),
  };
}
export function validateResourceOwnership(overrides = {}) {
  const input = { ...readResourceOwnershipInputs(), ...overrides };
  const errors = [];
  let manifest;
  try {
    manifest = JSON.parse(input.manifestSource);
  } catch (error) {
    return { errors: [`RESOURCE-OWNERSHIP-MANIFEST.json invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("resource manifest differs from the accepted RSH-019 authority");
  if (manifest.unit !== "RSH-019" || manifest.ownership.length !== 9) errors.push("resource ownership identity/count changed");
  for (const [path, expected] of Object.entries(manifest.runtime_sources)) {
    const source = input.sources[path];
    if (typeof source !== "string" || sha256(source) !== expected.sha256 || Buffer.byteLength(source) !== expected.bytes || (source.match(/\n/g) ?? []).length !== expected.lines) {
      errors.push(`resource-owned source identity changed: ${path}`);
    }
  }

  const registry = input.sources["src/rendering/ResourceRegistry.ts"] ?? "";
  if (!registry.includes("sort((a, b) => b[1].order - a[1].order)")) errors.push("registry no longer disposes in reverse creation order");
  if (!registry.includes("if (this.dead)")) errors.push("registry late-retain/idempotence guard missing");
  if (!registry.includes("different disposer")) errors.push("registry duplicate-owner guard missing");

  const engine = input.sources["src/game/engine.ts"] ?? "";
  if (!engine.includes("if (this.disposed) return;")) errors.push("RaceEngine dispose is not idempotent");
  for (const family of ["this.visuals ?? []", "this.trafficVis ?? []", "this.copVis ?? []", "this.ghostVis", "this.rivalGhostVis"]) {
    if (!engine.includes(family)) errors.push(`car visual family is not disposed: ${family}`);
  }
  if (engine.indexOf("this.leases.disposeAll();") > engine.indexOf("this.gfx.dispose();")) errors.push("renderer is disposed before owned leases");
  if (!engine.includes("disposeObject3D(this.scene, tracker)")) errors.push("engine scene sweep missing");

  const world = input.sources["src/game/world.ts"] ?? "";
  if (!world.includes("if (disposed) return;") || !world.includes("for (let index = bag.length - 1; index >= 0; index -= 1)")) errors.push("world disposal is not idempotent/reverse-order");
  if (!world.includes("disposeObject3D(group, tracker)")) errors.push("world unique scene sweep missing");

  const audio = input.sources["src/game/audio.ts"] ?? "";
  if (!audio.includes("this.unbindVisibility?.();") || !audio.includes('removeEventListener("visibilitychange"')) errors.push("audio visibility listeners are not released");

  const objectDisposer = input.sources["src/rendering/disposeObject3D.ts"] ?? "";
  if (/\b(?:map|texture)\.dispose\s*\(/.test(objectDisposer)) errors.push("per-engine Object3D disposal must not destroy shared textures");
  const postfx = input.sources["src/game/postfx.ts"] ?? "";
  if (!postfx.includes("disposeObject3D(tmp)")) errors.push("fallback PMREM scene resources are not released");
  if (!objectDisposer.includes("tracker.geometries") || !objectDisposer.includes("tracker.materials")) errors.push("unique geometry/material accounting missing");

  const adapter = input.sources["src/game/engine/rendering-adapter.ts"] ?? "";
  if (!adapter.includes("renderTarget?.dispose();") || !adapter.includes("finally")) errors.push("environment capture failure cleanup missing");
  if (!adapter.includes("const released = this.leases.release")) errors.push("post replacement ownership handoff missing");

  const soak = input.sources["scripts/soak-menu-race.mjs"] ?? "";
  if (!soak.includes("dGeo") || !soak.includes("geometry leak")) errors.push("geometry leak accounting missing");

  try {
    const historicalEngine = stripRsh019Overlay("src/game/engine.ts", engine);
    if (sha256(historicalEngine) !== manifest.historical_preservation.base_identities["src/game/engine.ts"].sha256) errors.push("engine overlay does not normalize to the RSH-018 base");
    const historicalWorld = stripRsh019Overlay("src/game/world.ts", world);
    if (sha256(historicalWorld) !== manifest.historical_preservation.base_identities["src/game/world.ts"].sha256) errors.push("world overlay does not normalize to the RSH-018 base");
    const historicalAdapter = stripRsh019Overlay("src/game/engine/rendering-adapter.ts", adapter);
    if (sha256(historicalAdapter) !== manifest.historical_preservation.base_identities["src/game/engine/rendering-adapter.ts"].sha256) errors.push("adapter overlay does not normalize to the RSH-018 base");
  } catch (error) {
    errors.push(`RSH-019 overlay normalization failed: ${error.message}`);
  }

  const asset = JSON.parse(input.assetSource);
  const tracks = JSON.parse(input.trackManifestSource);
  if (asset.scope.unverified_asset_files !== 66 || asset.scope.public_distribution_authorized !== false || asset.truth_boundaries.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (tracks.modules.length !== 56 || tracks.counts.mvp !== 8 || tracks.counts.deferred !== 48) errors.push("track catalogue boundary changed");

  const later = input.repositoryFiles.filter((path) =>
    path.startsWith(".rsh030") ||
    path.startsWith(".github/workflows/rsh-030-") ||
    path.startsWith("RSH-030-"),
  );
  if (later.length) errors.push(`RSH-030 was precreated: ${later.join(", ")}`);
  const temp = input.repositoryFiles.filter((path) =>
    path === ".rsh019-payload.gz.b64" ||
    path === ".github/workflows/rsh-019-apply.yml",
  );
  if (temp.length) errors.push(`temporary RSH-019 files remain: ${temp.join(", ")}`);

  return {
    errors,
    ownerCount: manifest.ownership.length,
    sourceCount: Object.keys(manifest.runtime_sources).length,
  };
}
function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateResourceOwnership();
  if (result.errors.length) {
    console.error("resource-ownership fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`resource-ownership ok: ${result.ownerCount} owners/${result.sourceCount} pinned sources`);
}
