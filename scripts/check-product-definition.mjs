#!/usr/bin/env node
import { createHash } from "node:crypto";
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

export const FROZEN_DEFINITION_SHA256 =
  "a9e481e9c262b51ddb09bee75a129f7886b6161f234abfd24ccea20d3de6f715";

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function productDefinitionHash(value) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function validateProductDefinition(value) {
  const errors = [];
  if (!value || typeof value !== "object") return ["product definition is not an object"];

  if (productDefinitionHash(value) !== FROZEN_DEFINITION_SHA256) {
    errors.push("frozen product-definition digest mismatch");
  }

  if (value.schema_version !== "1.0.0") errors.push("schema version must be 1.0.0");
  if (value.document_type !== "rush-version-1-product-definition") {
    errors.push("document type must be rush-version-1-product-definition");
  }
  if (value.product?.id !== "rush-israel") errors.push("product id must be rush-israel");
  if (value.product?.name !== "RUSH Israel") errors.push("product name must be RUSH Israel");
  if (value.product?.version_scope !== "Version 1") errors.push("version scope must be Version 1");
  if (value.product?.definition_state !== "frozen") errors.push("definition state must be frozen");
  if (value.product?.owner !== "@talstilkol") errors.push("product owner must be @talstilkol");
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
  if (value.classification?.world_basis !== "fictional_routes_inspired_by_Israeli_places") {
    errors.push("world basis must remain fictional routes inspired by Israeli places");
  }
  if (value.classification?.default_renderer !== "WebGLRenderer") {
    errors.push("default renderer must be WebGLRenderer");
  }
  if (value.classification?.physics_frequency_hz !== 120) {
    errors.push("physics frequency must be 120 Hz");
  }

  const technology = value.technology_invariants;
  const expectedTechnology = {
    runtime: "modern_web_browser",
    engine: "Three.js",
    application: "React_and_TypeScript",
    build_system: "Vite",
    default_graphics_api: "WebGL",
    webgpu_default: false,
    native_engine_dependency: false,
  };
  if (canonicalJson(technology) !== canonicalJson(expectedTechnology)) {
    errors.push("technology invariants differ from the frozen Version 1 contract");
  }

  const tracks = value.version_1_scope?.tracks;
  if (tracks?.target_count !== 8) errors.push("Version 1 must target exactly 8 tracks");
  if (
    tracks?.identity_state
    !== "owner_approved_names_pending_exact_repository_id_mapping_in_RSH-010"
  ) {
    errors.push("track identity state must remain pending exact RSH-010 mapping");
  }
  if (!Array.isArray(tracks?.names)) errors.push("track names must be an array");
  else {
    if (tracks.names.length !== 8) errors.push("track-name count must be exactly 8");
    if (new Set(tracks.names).size !== tracks.names.length) errors.push("track names must be unique");
    if (canonicalJson(tracks.names) !== canonicalJson(EXPECTED_TRACK_NAMES)) {
      errors.push("track names or order differ from the owner-approved boundary");
    }
  }
  if (tracks?.catalogue_expansion_authorized !== false) {
    errors.push("catalogue expansion must remain unauthorized");
  }

  const vehicles = value.version_1_scope?.vehicles;
  const expectedVehicles = {
    target_count: 5,
    identity: "fictional",
    balance_and_claims_frozen: false,
    calibration_authority: "RSH-033",
  };
  if (canonicalJson(vehicles) !== canonicalJson(expectedVehicles)) {
    errors.push("vehicle scope differs from the frozen Version 1 contract");
  }

  const expectedGameplay = [
    "local_single_player_driving",
    "race_and_free_drive_flows_exposed_by_the_accepted_product_surface",
    "simcade_handling_with_fixed_step_physics",
    "local_progress_save_and_timed_records",
    "day_night_and_weather_variants_subject_to_later_acceptance",
    "photo_capture_flow_subject_to_later_acceptance",
  ];
  if (canonicalJson(value.version_1_scope?.gameplay) !== canonicalJson(expectedGameplay)) {
    errors.push("gameplay scope differs from the frozen Version 1 contract");
  }
  if (canonicalJson(value.version_1_scope?.inputs) !== canonicalJson(["keyboard", "touch", "gamepad"])) {
    errors.push("input scope differs from the frozen Version 1 contract");
  }
  if (canonicalJson(value.version_1_scope?.languages) !== canonicalJson(["Hebrew", "English"])) {
    errors.push("language scope differs from the frozen Version 1 contract");
  }

  const expectedDelivery = {
    form: "private_owner_controlled_web_build",
    public_release: false,
    native_mobile_store_release: false,
  };
  if (canonicalJson(value.version_1_scope?.delivery) !== canonicalJson(expectedDelivery)) {
    errors.push("delivery scope differs from the frozen Version 1 contract");
  }

  if (canonicalJson(value.explicit_non_claims) !== canonicalJson(REQUIRED_NON_CLAIMS)) {
    errors.push("explicit non-claims differ from the frozen Version 1 contract");
  }

  const expectedExclusions = [
    "public_distribution",
    "public_licensing",
    "public_archive_submission",
    "online_multiplayer",
    "mandatory_user_accounts",
    "backend_database_as_a_game_requirement",
    "monetization",
    "user_generated_content",
    "WebGPU_as_the_default_renderer",
    "catalogue_expansion_beyond_eight_tracks",
    "native_iOS_or_Android_store_packages",
    "real_map_or_navigation_accuracy_claims",
  ];
  if (canonicalJson(value.version_1_exclusions) !== canonicalJson(expectedExclusions)) {
    errors.push("Version 1 exclusions differ from the frozen contract");
  }

  const expectedAcceptance = {
    release_gate_count: 13,
    all_release_gates_required: true,
    accepted_units_are_not_release_readiness: true,
    current_release_gates_green: 0,
    current_release_gates_total: 13,
  };
  if (canonicalJson(value.acceptance_authority) !== canonicalJson(expectedAcceptance)) {
    errors.push("release-gate authority differs from the frozen contract");
  }

  const expectedUnresolved = [
    ["exact_track_ids_and_56_entry_classification", "RSH-010"],
    ["asset_provenance_and_licensing", "RSH-011"],
    ["README_metadata_branding_root_license_and_PWA_alignment", "RSH-012"],
    ["vehicle_performance_and_zero_to_100_claims", "RSH-033"],
    ["browser_and_device_support_matrix", "RSH-043"],
    ["accessibility_privacy_and_alpha_UX", "RSH-048"],
  ].map(([topic, unit]) => ({ topic, unit }));
  if (
    canonicalJson(value.known_unresolved_authorities)
    !== canonicalJson(expectedUnresolved)
  ) {
    errors.push("known unresolved authorities differ from the frozen contract");
  }

  const expectedChangeControl = {
    definition_frozen_by: "RSH-009",
    implicit_scope_expansion_allowed: false,
    change_requires: [
      "explicit_owner_authorization",
      "canonical_plan_and_queue_update",
      "separate_reviewed_change_unit",
      "preservation_of_historical_definition",
    ],
  };
  if (canonicalJson(value.change_control) !== canonicalJson(expectedChangeControl)) {
    errors.push("change-control boundary differs from the frozen Version 1 contract");
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
  console.log(
    `product-definition ok ${productDefinitionHash(value)}: frozen private WebGL simcade; 8 tracks; 13 gates`,
  );
}
