import { createHash } from "node:crypto";

const ACCEPTED_SUPPORT_SOURCE = Object.freeze({
  module: "./math",
  path: "src/game/math.ts",
  git_blob_sha1: "c215daef16056d5d7c142db964ed93f82c74f8e8",
});
const ACCEPTED_AGGREGATE_BASIS =
  "aggregate of expected_digest and configured support-source Git blob identities";
const ACCEPTED_AGGREGATE_DIGEST =
  "1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7";

function gitBlobSha1(source) {
  const body = Buffer.from(String(source), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

export function validateTrackSupportPin({ schema, supportSources, aggregateDigest }) {
  const errors = [];
  const integrity = schema?.runtime_definition_integrity;
  const declared = integrity?.support_sources;

  if (integrity?.aggregate_basis !== ACCEPTED_AGGREGATE_BASIS) {
    errors.push("support-source aggregate basis differs from the accepted RSH-013 authority");
  }
  if (!Array.isArray(declared) || declared.length !== 1) {
    errors.push("RSH-013 support-source authority must contain exactly one pinned source");
  } else {
    const entry = declared[0];
    if (
      entry?.module !== ACCEPTED_SUPPORT_SOURCE.module
      || entry?.path !== ACCEPTED_SUPPORT_SOURCE.path
      || entry?.git_blob_sha1 !== ACCEPTED_SUPPORT_SOURCE.git_blob_sha1
    ) {
      errors.push("declared math support source differs from the accepted RSH-013 baseline");
    }
  }

  const source = supportSources?.[ACCEPTED_SUPPORT_SOURCE.path];
  let actualGitBlobSha1 = null;
  if (typeof source !== "string") {
    errors.push("accepted math support source is missing from validation inputs");
  } else {
    actualGitBlobSha1 = gitBlobSha1(source);
    if (actualGitBlobSha1 !== ACCEPTED_SUPPORT_SOURCE.git_blob_sha1) {
      errors.push("math support source Git blob differs from the accepted RSH-013 baseline");
    }
  }

  if (integrity?.expected_aggregate_digest !== ACCEPTED_AGGREGATE_DIGEST) {
    errors.push("declared aggregate digest differs from the accepted RSH-013 baseline");
  }
  if (aggregateDigest !== ACCEPTED_AGGREGATE_DIGEST) {
    errors.push("computed aggregate digest differs from the accepted RSH-013 baseline");
  }

  return { errors, actualGitBlobSha1 };
}
