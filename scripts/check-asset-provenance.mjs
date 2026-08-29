#!/usr/bin/env node
import { readdirSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

const EXPECTED_GROUPS = {
  game_generated_assets: { files: 64, assets: 64 },
  game_asset_evidence: { files: 1, assets: 0 },
  basis_universal_runtime: { files: 2, assets: 1 },
  track_card_images: { files: 56, assets: 56 },
  platform_install_material: { files: 8, assets: 7 },
  root_branding_assets: { files: 3, assets: 3 },
};

const ROOT_BRANDING = new Set([
  "public/favicon.svg",
  "public/og.jpg",
  "public/x-banner.jpg",
]);

export function listPublicFiles(root = fromRoot("public")) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`symbolic link is not allowed under public: ${absolute}`);
      }
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) {
        files.push(path.relative(fromRoot(), absolute).split(path.sep).join("/"));
      }
    }
  };
  visit(root);
  return files.sort();
}

export function classifyPublicPath(filePath) {
  const matches = [];
  if (filePath === "public/game/LICENSES.md") matches.push("game_asset_evidence");
  if (filePath.startsWith("public/game/") && filePath !== "public/game/LICENSES.md") {
    matches.push("game_generated_assets");
  }
  if (
    filePath === "public/basis/basis_transcoder.js"
    || filePath === "public/basis/basis_transcoder.wasm"
  ) {
    matches.push("basis_universal_runtime");
  }
  if (/^public\/tracks\/[a-z0-9]+\.jpg$/.test(filePath)) {
    matches.push("track_card_images");
  }
  if (filePath.startsWith("public/__grok/")) matches.push("platform_install_material");
  if (ROOT_BRANDING.has(filePath)) matches.push("root_branding_assets");
  return matches;
}

function isAsset(filePath, extensions) {
  return extensions.includes(path.extname(filePath).toLowerCase());
}

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function validateAssetProvenance({ manifest, catalogue, publicFiles, licencesText }) {
  const errors = [];
  if (!manifest || typeof manifest !== "object") {
    return ["asset provenance manifest is not an object"];
  }
  if (manifest.schema_version !== "1.0.0") errors.push("schema version must be 1.0.0");
  if (manifest.document_type !== "rush-asset-provenance-inventory") {
    errors.push("document type must be rush-asset-provenance-inventory");
  }
  if (manifest.repository !== "talstilkol/rush-israel") {
    errors.push("repository must be talstilkol/rush-israel");
  }
  if (manifest.canonical_branch !== "main") errors.push("canonical branch must be main");
  if (manifest.observed_source_commit !== "d8259877740a2feab6533f1723fd21be8fb2f6c2") {
    errors.push("observed source commit must match the accepted RSH-010 merge");
  }

  if (!Array.isArray(publicFiles)) errors.push("publicFiles must be an array");
  const uniqueFiles = new Set(publicFiles ?? []);
  if (uniqueFiles.size !== (publicFiles ?? []).length) errors.push("public file paths must be unique");

  const assetExtensions = manifest.asset_extensions ?? [];
  const classified = new Map();
  const byGroup = new Map(Object.keys(EXPECTED_GROUPS).map((id) => [id, []]));
  for (const filePath of publicFiles ?? []) {
    const matches = classifyPublicPath(filePath);
    if (matches.length !== 1) {
      errors.push(`${filePath} must match exactly one provenance group; matched ${matches.length}`);
      continue;
    }
    classified.set(filePath, matches[0]);
    byGroup.get(matches[0])?.push(filePath);
  }

  const actualAssetFiles = (publicFiles ?? []).filter((filePath) => isAsset(filePath, assetExtensions));
  const unverifiedGroups = new Set([
    "track_card_images",
    "platform_install_material",
    "root_branding_assets",
  ]);
  const unverifiedFiles = [...classified.entries()]
    .filter(([, group]) => unverifiedGroups.has(group))
    .map(([filePath]) => filePath);
  const unverifiedAssets = unverifiedFiles.filter((filePath) => isAsset(filePath, assetExtensions));

  if ((publicFiles ?? []).length !== 134) errors.push("public inventory must contain exactly 134 files");
  if (actualAssetFiles.length !== 131) errors.push("asset inventory must contain exactly 131 asset files");
  if (unverifiedFiles.length !== 67) errors.push("exactly 67 shipping files must remain unverified");
  if (unverifiedAssets.length !== 66) errors.push("exactly 66 asset files must remain unverified");

  const scope = manifest.scope;
  if (
    scope?.root !== "public"
    || scope?.shipping_files_total !== 134
    || scope?.asset_files_total !== 131
    || scope?.unverified_shipping_files !== 67
    || scope?.unverified_asset_files !== 66
  ) {
    errors.push("manifest scope counts must match 134 files, 131 assets, 67 unverified files and 66 unverified assets");
  }
  if (scope?.public_distribution_authorized !== false || scope?.legal_clearance_complete !== false) {
    errors.push("public distribution and legal clearance must remain false");
  }

  const groups = new Map((manifest.groups ?? []).map((group) => [group.id, group]));
  if (groups.size !== Object.keys(EXPECTED_GROUPS).length) {
    errors.push("manifest must contain exactly six provenance groups");
  }
  for (const [id, expected] of Object.entries(EXPECTED_GROUPS)) {
    const group = groups.get(id);
    const files = byGroup.get(id) ?? [];
    const assets = files.filter((filePath) => isAsset(filePath, assetExtensions));
    if (!group) {
      errors.push(`missing provenance group ${id}`);
      continue;
    }
    if (files.length !== expected.files || group.expected_file_count !== expected.files) {
      errors.push(`${id} must contain exactly ${expected.files} files`);
    }
    if (assets.length !== expected.assets || group.expected_asset_count !== expected.assets) {
      errors.push(`${id} must contain exactly ${expected.assets} asset files`);
    }
  }

  const basis = groups.get("basis_universal_runtime");
  if (
    basis?.provenance_status !== "third_party_identified"
    || basis?.licence_status !== "Apache-2.0"
    || basis?.public_distribution_clearance !== true
    || basis?.notice_required !== true
  ) {
    errors.push("Basis Universal must remain identified as Apache-2.0 with notice required");
  }

  for (const id of unverifiedGroups) {
    const group = groups.get(id);
    if (group?.licence_status !== "unverified" || group?.public_distribution_clearance !== false) {
      errors.push(`${id} must remain unverified and blocked from public distribution`);
    }
    if (!Array.isArray(group?.evidence) || group.evidence.length !== 0) {
      errors.push(`${id} must not claim missing evidence`);
    }
  }

  const generated = groups.get("game_generated_assets");
  if (
    generated?.provenance_status !== "owner_generated_claim_recorded"
    || generated?.public_distribution_clearance !== false
    || !sameJson(generated?.evidence, ["public/game/LICENSES.md"])
  ) {
    errors.push("generated game assets must retain recorded owner-generation evidence without public clearance");
  }

  if (!/Basis Universal/.test(licencesText) || !/Apache-2\.0/.test(licencesText)) {
    errors.push("public/game/LICENSES.md must identify Basis Universal and Apache-2.0");
  }
  if (!/generated/i.test(licencesText) || !/not (?:a )?scan/i.test(licencesText)) {
    errors.push("public/game/LICENSES.md must preserve generated-asset and non-scan statements");
  }

  const trackPaths = (byGroup.get("track_card_images") ?? []).map((filePath) =>
    path.basename(filePath, ".jpg")
  );
  const catalogueIds = (catalogue?.entries ?? []).map((entry) => entry.id).slice().sort();
  if (!sameJson(trackPaths.slice().sort(), catalogueIds)) {
    errors.push("track-card filenames must correspond one-to-one with all 56 classified TrackId values");
  }

  const blockerIds = (manifest.release_blockers ?? []).map((blocker) => blocker.id);
  if (!sameJson(blockerIds, ["AP-001", "AP-002", "AP-003", "AP-004"])) {
    errors.push("release blockers must remain AP-001 through AP-004");
  }
  const truth = manifest.truth_boundaries;
  if (truth?.inventory_coverage_complete !== true) errors.push("inventory coverage must be recorded complete");
  if (
    truth?.provenance_evidence_complete !== false
    || truth?.licence_clearance_complete !== false
    || truth?.public_release_allowed !== false
  ) {
    errors.push("provenance, licence and public-release claims must fail closed");
  }
  if (truth?.repository_visibility_current !== "public") {
    errors.push("repository visibility must remain truthfully recorded as public");
  }
  if (truth?.repository_visibility_policy_target !== "private") {
    errors.push("repository visibility target must remain private");
  }
  if (truth?.release_gates_green !== 0 || truth?.release_gates_total !== 13) {
    errors.push("release-gate truth must remain 0/13");
  }

  return errors;
}

function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const manifest = JSON.parse(readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"));
  const catalogue = JSON.parse(
    readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
  );
  const publicFiles = listPublicFiles();
  const licencesText = readFileSync(fromRoot("public", "game", "LICENSES.md"), "utf8");
  const errors = validateAssetProvenance({ manifest, catalogue, publicFiles, licencesText });
  if (errors.length) {
    console.error("asset-provenance fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(
    "asset-provenance ok: 134/134 files classified; 131 assets; 66 assets remain unverified; public release blocked",
  );
}
