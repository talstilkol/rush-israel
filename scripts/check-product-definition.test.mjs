import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_TRACK_NAMES,
  REQUIRED_NON_CLAIMS,
  validateProductDefinition,
} from "./check-product-definition.mjs";

const readDefinition = () => JSON.parse(readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8"));

test("committed Version 1 definition passes the frozen contract", () => {
  assert.deepEqual(validateProductDefinition(readDefinition()), []);
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
  assert.match(validateProductDefinition(broken).join("\n"), /public distribution/);
});

test("WebGL, simcade and 120 Hz are frozen technology invariants", () => {
  const definition = readDefinition();
  assert.equal(definition.classification.default_renderer, "WebGLRenderer");
  assert.equal(definition.classification.handling, "simcade");
  assert.equal(definition.classification.physics_frequency_hz, 120);
  assert.equal(definition.technology_invariants.webgpu_default, false);
});

test("all explicit non-claims remain present", () => {
  const definition = readDefinition();
  const actual = new Set(definition.explicit_non_claims);
  for (const item of REQUIRED_NON_CLAIMS) assert.equal(actual.has(item), true, item);
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
