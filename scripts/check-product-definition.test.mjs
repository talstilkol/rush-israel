import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_TRACK_NAMES,
  FROZEN_DEFINITION_SHA256,
  REQUIRED_NON_CLAIMS,
  productDefinitionHash,
  validateProductDefinition,
} from "./check-product-definition.mjs";

const readDefinition = () =>
  JSON.parse(readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8"));

test("committed Version 1 definition passes the frozen contract", () => {
  const definition = readDefinition();
  assert.equal(productDefinitionHash(definition), FROZEN_DEFINITION_SHA256);
  assert.deepEqual(validateProductDefinition(definition), []);
});

test("Version 1 contains exactly the eight owner-approved track names", () => {
  const definition = readDefinition();
  assert.deepEqual(definition.version_1_scope.tracks.names, EXPECTED_TRACK_NAMES);
  assert.equal(definition.version_1_scope.tracks.target_count, 8);
  assert.equal(new Set(definition.version_1_scope.tracks.names).size, 8);
});

test("private ownership and no public distribution fail closed", () => {
  const definition = readDefinition();
  assert.equal(definition.product.ownership_model, "private_owner_controlled");
  assert.equal(definition.product.public_distribution_authorized, false);
  const broken = structuredClone(definition);
  broken.product.public_distribution_authorized = true;
  assert.match(validateProductDefinition(broken).join("\n"), /public distribution|digest/);
});

test("WebGL, simcade and 120 Hz are frozen technology invariants", () => {
  const definition = readDefinition();
  assert.equal(definition.classification.default_renderer, "WebGLRenderer");
  assert.equal(definition.classification.handling, "simcade");
  assert.equal(definition.classification.physics_frequency_hz, 120);
  assert.equal(definition.technology_invariants.webgpu_default, false);
});

test("all explicit non-claims remain present in exact frozen order", () => {
  const definition = readDefinition();
  assert.deepEqual(definition.explicit_non_claims, REQUIRED_NON_CLAIMS);
});

test("known unresolved work stays assigned to later authorities", () => {
  const definition = readDefinition();
  const byTopic = new Map(
    definition.known_unresolved_authorities.map((entry) => [entry.topic, entry.unit]),
  );
  assert.equal(byTopic.get("exact_track_ids_and_56_entry_classification"), "RSH-010");
  assert.equal(byTopic.get("asset_provenance_and_licensing"), "RSH-011");
  assert.equal(byTopic.get("vehicle_performance_and_zero_to_100_claims"), "RSH-033");
  assert.equal(byTopic.get("browser_and_device_support_matrix"), "RSH-043");
});

test("scope expansion requires an explicit reviewed owner change", () => {
  const definition = readDefinition();
  assert.equal(definition.change_control.implicit_scope_expansion_allowed, false);
  assert.deepEqual(definition.change_control.change_requires, [
    "explicit_owner_authorization",
    "canonical_plan_and_queue_update",
    "separate_reviewed_change_unit",
    "preservation_of_historical_definition",
  ]);
});

test("every frozen section is protected by the canonical digest", () => {
  const mutations = [
    ["technology engine", (value) => { value.technology_invariants.engine = "Other"; }],
    ["application", (value) => { value.technology_invariants.application = "Other"; }],
    ["build system", (value) => { value.technology_invariants.build_system = "Other"; }],
    ["public release", (value) => { value.version_1_scope.delivery.public_release = true; }],
    ["gameplay", (value) => { value.version_1_scope.gameplay.pop(); }],
    ["inputs", (value) => { value.version_1_scope.inputs = ["keyboard"]; }],
    ["languages", (value) => { value.version_1_scope.languages.push("Arabic"); }],
    ["delivery form", (value) => { value.version_1_scope.delivery.form = "public_web"; }],
    ["change control", (value) => {
      value.change_control.implicit_scope_expansion_allowed = true;
    }],
    ["unresolved authority", (value) => {
      value.known_unresolved_authorities[0].unit = "RSH-999";
    }],
  ];

  for (const [label, mutate] of mutations) {
    const broken = readDefinition();
    mutate(broken);
    const errors = validateProductDefinition(broken);
    assert.notEqual(productDefinitionHash(broken), FROZEN_DEFINITION_SHA256, label);
    assert.ok(errors.includes("frozen product-definition digest mismatch"), label);
  }
});
