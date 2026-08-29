import { createHash } from "node:crypto";

export const EXPECTED_TRACK_TYPE_SOURCE_PATH = "src/game/types.ts";
export const EXPECTED_TRACK_TYPE_SOURCE_GIT_BLOB_SHA1 =
  "f2ce095b2fcd4f9fa6f55ce0c3413ffa8d09d6c0";

function gitBlobSha1(source) {
  const body = Buffer.from(String(source ?? ""), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

export function validateTrackTypeSourcePin(typeSource) {
  const errors = [];
  const actualGitBlobSha1 = gitBlobSha1(typeSource);
  if (actualGitBlobSha1 !== EXPECTED_TRACK_TYPE_SOURCE_GIT_BLOB_SHA1) {
    errors.push(
      `${EXPECTED_TRACK_TYPE_SOURCE_PATH} Git blob identity ${actualGitBlobSha1} differs from pinned ${EXPECTED_TRACK_TYPE_SOURCE_GIT_BLOB_SHA1}`,
    );
  }
  return { errors, actualGitBlobSha1 };
}
