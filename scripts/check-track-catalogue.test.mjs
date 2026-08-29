import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_MVP_MAPPING,
  extractTrackIdsFromDefinitions,
  extractTrackIdsFromType,
  validateTrackCatalogue,
} from "./check-track-catalogue.mjs";
import { readCanonicalTrackSource } from "./load-track-modules.mjs";

function readInputs() {
  return {
    classification: JSON.parse(
      readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
    ),
    product: JSON.parse(readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8")),
    typeSource: readFileSync(fromRoot("src", "game", "types.ts"), "utf8"),
    trackSource: readCanonicalTrackSource(),
  };
}

test("committed track catalogue classifies every live ID", () => {
  assert.deepEqual(validateTrackCatalogue(readInputs()), []);
});

test("TrackId and TRACKS expose the same 56 unique IDs", () => {
  const { typeSource, trackSource } = readInputs();
  const typeIds = extractTrackIdsFromType(typeSource);
  const definitionIds = extractTrackIdsFromDefinitions(trackSource);
  assert.equal(typeIds.length, 56);
  assert.equal(definitionIds.length, 56);
  assert.equal(new Set(typeIds).size, 56);
  assert.equal(new Set(definitionIds).size, 56);
  assert.deepEqual(typeIds.slice().sort(), definitionIds.slice().sort());
  assert.notDeepEqual(definitionIds, typeIds);
});

test("the canonical classification order follows TrackId and not TRACKS layout", () => {
  const { classification, typeSource } = readInputs();
  assert.deepEqual(
    classification.entries.map((entry) => entry.id),
    extractTrackIdsFromType(typeSource),
  );
});

test("the eight frozen names map to exact repository IDs", () => {
  const { classification } = readInputs();
  assert.deepEqual(classification.mvp_mapping, EXPECTED_MVP_MAPPING);
  assert.deepEqual(
    classification.entries
      .filter((entry) => entry.status === "mvp")
      .map(({ id, frozen_name }) => ({ id, frozen_name })),
    [
      { id: "oldjaffa", frozen_name: "Jaffa" },
      { id: "namal", frozen_name: "Yarkon–Reading" },
      { id: "haifa", frozen_name: "Haifa–Carmel" },
      { id: "rothschild", frozen_name: "Rothschild" },
      { id: "ayalon", frozen_name: "Ayalon" },
      { id: "hermon", frozen_name: "Hermon" },
      { id: "scopus", frozen_name: "Jerusalem–Scopus" },
      { id: "ramon", frozen_name: "Ramon" },
    ],
  );
});

test("all 48 deferred tracks remain explicit and retained", () => {
  const { classification, typeSource } = readInputs();
  const deferred = classification.entries.filter((entry) => entry.status === "deferred");
  const liveIds = new Set(extractTrackIdsFromType(typeSource));
  assert.equal(deferred.length, 48);
  assert.equal(deferred.every((entry) => liveIds.has(entry.id)), true);
  assert.equal(deferred.every((entry) => !Object.hasOwn(entry, "frozen_name")), true);
});

test("missing, duplicate and implicit promotion mutations fail closed", () => {
  const base = readInputs();

  const missing = structuredClone(base);
  missing.classification.entries.pop();
  assert.match(validateTrackCatalogue(missing).join("\n"), /56|canonical TrackId order/);

  const duplicate = structuredClone(base);
  duplicate.classification.entries[55].id = duplicate.classification.entries[54].id;
  assert.match(validateTrackCatalogue(duplicate).join("\n"), /unique|canonical TrackId order/);

  const promoted = structuredClone(base);
  const entry = promoted.classification.entries.find((item) => item.id === "hayarkon");
  entry.status = "mvp";
  entry.frozen_name = "Unapproved";
  assert.match(validateTrackCatalogue(promoted).join("\n"), /8 entries|48 entries/);
});

test("source drift is rejected instead of silently changing classification", () => {
  const changedType = readInputs();
  changedType.typeSource = changedType.typeSource.replace(
    '| "manhattan";',
    '| "manhattan"\n  | "future-track";',
  );
  assert.match(
    validateTrackCatalogue(changedType).join("\n"),
    /56|same unique IDs|canonical TrackId order/,
  );

  const changedDefinitions = readInputs();
  changedDefinitions.trackSource = changedDefinitions.trackSource.replace(
    '    id: "hayarkon",',
    '    id: "future-track",',
  );
  assert.match(validateTrackCatalogue(changedDefinitions).join("\n"), /same unique IDs/);
});
