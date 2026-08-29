#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const EXPECTED_SOURCE_COMMIT = "69765febef85d732d9ba79fe260fec78ee76b2df";

export const EXPECTED_MVP_MAPPING = [
  { frozen_name: "Ayalon", id: "ayalon" },
  { frozen_name: "Rothschild", id: "rothschild" },
  { frozen_name: "Yarkon–Reading", id: "namal" },
  { frozen_name: "Jaffa", id: "oldjaffa" },
  { frozen_name: "Jerusalem–Scopus", id: "scopus" },
  { frozen_name: "Haifa–Carmel", id: "haifa" },
  { frozen_name: "Ramon", id: "ramon" },
  { frozen_name: "Hermon", id: "hermon" },
];

export function extractTrackIdsFromType(source) {
  const match = source.match(
    /export type TrackId =([\s\S]*?);\n\nexport type HandlingMode/,
  );
  if (!match) throw new Error("TrackId union not found");
  return [...match[1].matchAll(/\|\s*"([^"]+)"/g)].map((item) => item[1]);
}

export function extractTrackIdsFromDefinitions(source) {
  const startToken = "export const TRACKS: TrackDef[] = [";
  const endToken = "\n];\n\nexport function getTrack";
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start);
  if (start < 0 || end < 0) throw new Error("TRACKS definition boundary not found");
  const catalogue = source.slice(start + startToken.length, end);
  return [...catalogue.matchAll(/^\s{4}id:\s*"([^"]+)",$/gm)].map((item) => item[1]);
}

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function validateTrackCatalogue({ classification, product, typeSource, trackSource }) {
  const errors = [];
  if (!classification || typeof classification !== "object") {
    return ["track catalogue classification is not an object"];
  }

  let typeIds = [];
  let definitionIds = [];
  try {
    typeIds = extractTrackIdsFromType(typeSource);
  } catch (error) {
    errors.push(error.message);
  }
  try {
    definitionIds = extractTrackIdsFromDefinitions(trackSource);
  } catch (error) {
    errors.push(error.message);
  }

  if (classification.schema_version !== "1.0.0") {
    errors.push("schema version must be 1.0.0");
  }
  if (classification.document_type !== "rush-track-catalogue-classification") {
    errors.push("document type must be rush-track-catalogue-classification");
  }
  if (classification.repository !== "talstilkol/rush-israel") {
    errors.push("repository must be talstilkol/rush-israel");
  }
  if (classification.canonical_branch !== "main") {
    errors.push("canonical branch must be main");
  }
  if (classification.observed_source_commit !== EXPECTED_SOURCE_COMMIT) {
    errors.push("observed source commit must match the accepted RSH-009 merge");
  }

  if (typeIds.length !== 56 || new Set(typeIds).size !== 56) {
    errors.push("TrackId union must contain exactly 56 unique IDs");
  }
  if (!sameJson(typeIds, definitionIds)) {
    errors.push("TrackId union and TRACKS definitions must contain the same IDs in the same order");
  }

  const entries = classification.entries;
  if (!Array.isArray(entries)) {
    errors.push("entries must be an array");
  } else {
    if (entries.length !== 56) errors.push("entries must contain exactly 56 records");
    const entryIds = entries.map((entry) => entry.id);
    if (new Set(entryIds).size !== entryIds.length) {
      errors.push("classification entry IDs must be unique");
    }
    if (!sameJson(entryIds, typeIds)) {
      errors.push("classification entries must exactly match live source order");
    }
    entries.forEach((entry, index) => {
      if (entry.ordinal !== index + 1) {
        errors.push(`entry ${entry.id ?? index} has a non-sequential ordinal`);
      }
      if (entry.status !== "mvp" && entry.status !== "deferred") {
        errors.push(`entry ${entry.id ?? index} has an invalid status`);
      }
      if (entry.status === "deferred" && Object.hasOwn(entry, "frozen_name")) {
        errors.push(`deferred entry ${entry.id} must not have a frozen name`);
      }
    });
  }

  if (!sameJson(classification.mvp_mapping, EXPECTED_MVP_MAPPING)) {
    errors.push("MVP mapping differs from the frozen RSH-010 mapping");
  }

  const mvpEntries = Array.isArray(entries)
    ? entries.filter((entry) => entry.status === "mvp")
    : [];
  const deferredEntries = Array.isArray(entries)
    ? entries.filter((entry) => entry.status === "deferred")
    : [];
  const mvpById = new Map(mvpEntries.map((entry) => [entry.id, entry.frozen_name]));
  for (const mapping of EXPECTED_MVP_MAPPING) {
    if (mvpById.get(mapping.id) !== mapping.frozen_name) {
      errors.push(`MVP entry ${mapping.id} must map to ${mapping.frozen_name}`);
    }
  }
  if (mvpEntries.length !== 8) errors.push("exactly 8 entries must be MVP");
  if (deferredEntries.length !== 48) errors.push("exactly 48 entries must be deferred");

  if (
    classification.counts?.total !== 56
    || classification.counts?.mvp !== 8
    || classification.counts?.deferred !== 48
  ) {
    errors.push("declared counts must be exactly 56 total, 8 MVP and 48 deferred");
  }

  const frozenNames = product?.version_1_scope?.tracks?.names;
  if (!sameJson(frozenNames, EXPECTED_MVP_MAPPING.map((entry) => entry.frozen_name))) {
    errors.push("PRODUCT-DEFINITION track names differ from the RSH-010 mapping");
  }
  if (product?.version_1_scope?.tracks?.target_count !== 8) {
    errors.push("PRODUCT-DEFINITION must retain an eight-track target");
  }

  const rules = classification.rules;
  if (rules?.all_live_track_ids_must_be_classified !== true) {
    errors.push("all live track IDs must be classified");
  }
  if (rules?.implicit_mvp_expansion_allowed !== false) {
    errors.push("implicit MVP expansion must be prohibited");
  }
  if (rules?.deferred_tracks_are_retained_in_source !== true) {
    errors.push("deferred tracks must remain retained in source");
  }
  if (rules?.classification_changes_require_owner_authorization !== true) {
    errors.push("classification changes must require owner authorization");
  }
  if (rules?.release_gates_green !== 0 || rules?.release_gates_total !== 13) {
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
  const classification = JSON.parse(
    readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
  );
  const product = JSON.parse(readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8"));
  const typeSource = readFileSync(fromRoot("src", "game", "types.ts"), "utf8");
  const trackSource = readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8");
  const errors = validateTrackCatalogue({ classification, product, typeSource, trackSource });
  if (errors.length) {
    console.error("track-catalogue fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log("track-catalogue ok: 56 total; 8 MVP; 48 deferred; 0 deleted");
}
