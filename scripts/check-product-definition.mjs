#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const EXPECTED_TRACK_NAMES = [
  "Ayalon",
  "Rothschild",
  "Yarkon–Reading",
  "Jaffa",
  "Jerusalem–Scopus",
  "Haifa–Carmel",
  "Ramon",
  "Hermon",
];

export const REQUIRED_NON_CLAIMS = [
  "GIS",
  "digital_twin",
  "measurement_simulator",
  "automotive_engineering_simulator",
  "real_road_navigation",
  "survey_grade_geospatial_accuracy",
  "Unreal_Engine",
  "Unity",
  "photogrammetry",
  "scanned_vehicles",
  "licensed_real_vehicle_models",
  "photorealistic_console_equivalence",
];

export function validateProductDefinition(value) {
  const errors = [];
  if (!value || typeof value !== "object") return ["product definition is not an object"];
  if (value.product?.id !== "rush-israel") errors.push("product id must be rush-israel");
  if (value.product?.name !== "RUSH Israel") errors.push("product name must be RUSH Israel");
  if (value.product?.version_scope !== "Version 1") errors.push("version scope must be Version 1");
  if (value.product?.definition_state !== "frozen") errors.push("definition state must be frozen");
  if (value.product?.ownership_model !== "private_owner_controlled") {
    errors.push("ownership model must be private_owner_controlled");
  }
  if (value.product?.public_distribution_authorized !== false) {
    errors.push("public distribution must remain unauthorized");
  }
  if (value.classification?.category !== "browser_driving_game") {
    errors.push("category must be browser_driving_game");
  }
  if (value.classification?.handling !== "simcade") errors.push("handling must be simcade");
  if (value.classification?.default_renderer !== "WebGLRenderer") {
    errors.push("default renderer must be WebGLRenderer");
  }
  if (value.classification?.physics_frequency_hz !== 120) {
    errors.push("physics frequency must be 120 Hz");
  }
  if (value.technology_invariants?.webgpu_default !== false) {
    errors.push("WebGPU must not be the Version 1 default");
  }

  const tracks = value.version_1_scope?.tracks;
  if (tracks?.target_count !== 8) errors.push("Version 1 must target exactly 8 tracks");
  if (!Array.isArray(tracks?.names)) errors.push("track names must be an array");
  else {
    if (tracks.names.length !== 8) errors.push("track-name count must be exactly 8");
    if (new Set(tracks.names).size !== tracks.names.length) errors.push("track names must be unique");
    if (JSON.stringify(tracks.names) !== JSON.stringify(EXPECTED_TRACK_NAMES)) {
      errors.push("track names or order differ from the owner-approved boundary");
    }
  }
  if (tracks?.catalogue_expansion_authorized !== false) {
    errors.push("catalogue expansion must remain unauthorized");
  }

  if (value.version_1_scope?.vehicles?.target_count !== 5) {
    errors.push("Version 1 must target exactly 5 fictional vehicles");
  }
  if (value.version_1_scope?.vehicles?.identity !== "fictional") {
    errors.push("vehicle identity must remain fictional");
  }
  if (value.version_1_scope?.vehicles?.calibration_authority !== "RSH-033") {
    errors.push("vehicle calibration authority must be RSH-033");
  }

  const nonClaims = new Set(value.explicit_non_claims ?? []);
  for (const claim of REQUIRED_NON_CLAIMS) {
    if (!nonClaims.has(claim)) errors.push(`missing explicit non-claim: ${claim}`);
  }
  const exclusions = new Set(value.version_1_exclusions ?? []);
  for (const exclusion of [
    "public_distribution",
    "online_multiplayer",
    "WebGPU_as_the_default_renderer",
    "catalogue_expansion_beyond_eight_tracks",
    "real_map_or_navigation_accuracy_claims",
  ]) {
    if (!exclusions.has(exclusion)) errors.push(`missing Version 1 exclusion: ${exclusion}`);
  }

  const authority = value.acceptance_authority;
  if (authority?.release_gate_count !== 13 || authority?.current_release_gates_total !== 13) {
    errors.push("release-gate authority must contain exactly 13 gates");
  }
  if (authority?.current_release_gates_green !== 0) {
    errors.push("current release gates must remain 0");
  }
  if (authority?.all_release_gates_required !== true) {
    errors.push("all release gates must be required");
  }

  const unresolved = new Map(
    (value.known_unresolved_authorities ?? []).map((entry) => [entry.topic, entry.unit]),
  );
  for (const [topic, unit] of [
    ["exact_track_ids_and_56_entry_classification", "RSH-010"],
    ["asset_provenance_and_licensing", "RSH-011"],
    ["README_metadata_branding_root_license_and_PWA_alignment", "RSH-012"],
    ["vehicle_performance_and_zero_to_100_claims", "RSH-033"],
    ["browser_and_device_support_matrix", "RSH-043"],
    ["accessibility_privacy_and_alpha_UX", "RSH-048"],
  ]) {
    if (unresolved.get(topic) !== unit) errors.push(`unresolved authority ${topic} must map to ${unit}`);
  }

  if (value.change_control?.definition_frozen_by !== "RSH-009") {
    errors.push("definition must be frozen by RSH-009");
  }
  if (value.change_control?.implicit_scope_expansion_allowed !== false) {
    errors.push("implicit scope expansion must be disabled");
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
  const value = JSON.parse(readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8"));
  const errors = validateProductDefinition(value);
  if (errors.length) {
    console.error("product-definition fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log("product-definition ok: frozen private WebGL simcade; 8 tracks; 13 gates");
}
