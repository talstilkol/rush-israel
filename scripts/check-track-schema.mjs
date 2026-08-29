#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_RSH_012_MERGE,
  validateTrackSchema as validateTrackSchemaCore,
} from "./check-track-schema-core.mjs";
import { validateTrackConsumerSourcePin } from "./check-track-consumer-source-pin.mjs";
import { validateTrackSchemaExports } from "./check-track-schema-exports.mjs";
import { validateTrackSchemaHardening } from "./check-track-schema-hardening.mjs";
import { validateTrackDefinitionClosure } from "./check-track-schema-definition-guard.mjs";
import { validateTrackDefImportAuthority } from "./check-track-schema-import-authority.mjs";
import { validateTrackMutationEdges } from "./check-track-schema-mutation-edges.mjs";
import { validateTrackMutationGuard } from "./check-track-schema-mutation-guard.mjs";
import { validateTrackDefTypeAuthority } from "./check-track-schema-type-authority.mjs";
import { validateTrackSourcePin } from "./check-track-source-pin.mjs";
import { validateTrackSupportPin } from "./check-track-schema-support-pin.mjs";
import { validateTrackTypeSourcePin } from "./check-track-type-source-pin.mjs";

export { EXPECTED_RSH_012_MERGE };

function schemaForReviewedCore(schema) {
  if (!schema || typeof schema !== "object") return schema;
  const copy = structuredClone(schema);
  if (copy.runtime_definition_integrity) {
    copy.runtime_definition_integrity.support_sources = [];
    delete copy.runtime_definition_integrity.aggregate_basis;
    delete copy.runtime_definition_integrity.expected_aggregate_digest;
  }
  return copy;
}

export function validateTrackSchema(inputs) {
  const trackSchemaSource = inputs?.trackSchemaSource
    ?? readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8");
  const sourcePin = inputs?.sourcePin
    ?? JSON.parse(readFileSync(fromRoot("TRACK-SOURCE-PIN.json"), "utf8"));
  const supportSources = inputs?.supportSources ?? {
    "src/game/math.ts": readFileSync(fromRoot("src", "game", "math.ts"), "utf8"),
  };
  const coreResult = validateTrackSchemaCore({
    ...inputs,
    schema: schemaForReviewedCore(inputs?.schema),
    supportSources: {},
  });
  if (Array.isArray(coreResult)) return coreResult;

  const hardening = validateTrackSchemaHardening({
    ...inputs,
    supportSources,
    trackSchemaSource,
    coreResult,
  });
  const consumerSourcePinResult = validateTrackConsumerSourcePin({
    consumerSources: inputs?.consumerSources,
  });
  const exportErrors = validateTrackSchemaExports(trackSchemaSource);
  const importAuthorityErrors = validateTrackDefImportAuthority(trackSchemaSource);
  const typeAuthorityErrors = validateTrackDefTypeAuthority(inputs?.typeSource);
  const typeSourcePinResult = validateTrackTypeSourcePin(inputs?.typeSource);
  const supportPinResult = validateTrackSupportPin({
    schema: inputs?.schema,
    supportSources,
    aggregateDigest: hardening.aggregateDigest,
  });
  const mutationErrors = validateTrackMutationGuard(inputs?.trackSource);
  const mutationEdgeErrors = validateTrackMutationEdges(inputs?.trackSource);
  const definitionClosureErrors = validateTrackDefinitionClosure(inputs?.trackSource);
  const sourcePinResult = validateTrackSourcePin({
    pin: sourcePin,
    trackSource: inputs?.trackSource,
  });
  return {
    ...coreResult,
    errors: [
      ...coreResult.errors,
      ...hardening.errors,
      ...consumerSourcePinResult.errors,
      ...exportErrors,
      ...importAuthorityErrors,
      ...typeAuthorityErrors,
      ...typeSourcePinResult.errors,
      ...supportPinResult.errors,
      ...mutationErrors,
      ...mutationEdgeErrors,
      ...definitionClosureErrors,
      ...sourcePinResult.errors,
    ],
    aggregateDigest: hardening.aggregateDigest,
    supportSourceIdentities: hardening.supportSourceIdentities,
    mathSupportGitBlobSha1: supportPinResult.actualGitBlobSha1,
    trackConsumerSourceIdentities: consumerSourcePinResult.identities,
    trackSourceGitBlobSha1: sourcePinResult.actualGitBlobSha1,
    trackTypeSourceGitBlobSha1: typeSourcePinResult.actualGitBlobSha1,
  };
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
  const schema = JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8"));
  const classification = JSON.parse(
    readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
  );
  const result = validateTrackSchema({
    schema,
    classification,
    sourcePin: JSON.parse(readFileSync(fromRoot("TRACK-SOURCE-PIN.json"), "utf8")),
    typeSource: readFileSync(fromRoot("src", "game", "types.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
    trackSchemaSource: readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8"),
    supportSources: {
      "src/game/math.ts": readFileSync(fromRoot("src", "game", "math.ts"), "utf8"),
    },
  });
  if (Array.isArray(result) || result.errors.length) {
    const errors = Array.isArray(result) ? result : result.errors;
    console.error("track-schema fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(
    `track-schema ok: 56 definitions; source blob ${result.trackSourceGitBlobSha1};`
    + ` type blob ${result.trackTypeSourceGitBlobSha1};`
    + ` 4 consumer blobs; math blob ${result.mathSupportGitBlobSha1};`
    + ` track digest ${result.digest}; aggregate ${result.aggregateDigest};`
    + " 8 MVP; 48 deferred; 0/13 gates",
  );
}
