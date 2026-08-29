#!/usr/bin/env node
import { createHash } from "node:crypto";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateTrackModuleManifest } from "./check-track-module-manifest.mjs";

export const EXPECTED_TRACK_SOURCE_PATH = "src/game/tracks.ts";
export const EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1 =
  "e26454223f8a598cdf516af7c7c3f494162e2616";
export const EXPECTED_RSH_012_MERGE =
  "94524201dfe87f1f22f8d8bdd9d97aad507c0438";
export const EXPECTED_TRACK_SOURCE_CAPTURE_COMMIT =
  "e9b7683330bb288e9e5005e595f699b58d7ad20f";

export function gitBlobSha1(source) {
  const body = Buffer.from(String(source ?? ""), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

export function validateTrackSourcePin({ pin, trackSource }) {
  const errors = [];
  if (!pin || typeof pin !== "object" || Array.isArray(pin)) {
    return { errors: ["track source pin must be an object"], actualGitBlobSha1: null };
  }
  if (pin.schema_version !== "1.0.0") errors.push("track source pin schema version must be 1.0.0");
  if (pin.document_type !== "rush-track-source-pin") {
    errors.push("track source pin document type is incorrect");
  }
  if (pin.unit !== "RSH-013") errors.push("track source pin unit must remain RSH-013");
  if (pin.repository !== "talstilkol/rush-israel" || pin.canonical_branch !== "main") {
    errors.push("track source pin repository authority is incorrect");
  }
  if (pin.source_path !== EXPECTED_TRACK_SOURCE_PATH) {
    errors.push(`track source pin path must remain ${EXPECTED_TRACK_SOURCE_PATH}`);
  }
  if (pin.algorithm !== "git_blob_sha1") {
    errors.push("track source pin algorithm must remain git_blob_sha1");
  }
  if (pin.captured_from_commit !== EXPECTED_TRACK_SOURCE_CAPTURE_COMMIT) {
    errors.push("track source pin must remain captured from the reconciled live main commit");
  }
  if (pin.capture_state !== "pinned") errors.push("track source pin must remain pinned");
  if (pin.expected_git_blob_sha1 !== EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1) {
    errors.push("track source pin authority differs from the accepted RSH-013 baseline");
  }
  if (
    pin.change_control?.updates_require_owner_authorization !== true
    || pin.change_control?.["RSH-014_may_replace_with_modular_source_manifest"] !== true
    || pin.change_control?.["RSH-015_authorized"] !== false
  ) {
    errors.push("track source pin change control is incomplete or over-authorized");
  }
  if (
    Object.hasOwn(pin.change_control ?? {}, "RSH_014_may_replace_with_modular_source_manifest")
    || Object.hasOwn(pin.change_control ?? {}, "RSH_015_authorized")
  ) {
    errors.push("track source pin change-control keys must use hyphenated RSH IDs");
  }

  const actualGitBlobSha1 = gitBlobSha1(trackSource);
  if (actualGitBlobSha1 !== EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1) {
    errors.push(
      `src/game/tracks.ts Git blob identity ${actualGitBlobSha1} differs from pinned ${EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1}`,
    );
  }
  return { errors, actualGitBlobSha1 };
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
  const result = validateTrackModuleManifest();
  if (result.errors.length) {
    console.error(
      "track-module-manifest replacement fail\n"
      + result.errors.map((error) => `- ${error}`).join("\n"),
    );
    process.exit(1);
  }
  console.log(
    `track-source-pin compatibility ok: replaced by ${result.moduleCount} track modules; reconstructed ${EXPECTED_TRACK_SOURCE_PATH} ${result.legacyBlob}`,
  );
}
