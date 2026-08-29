import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1,
  gitBlobSha1,
  validateTrackSourcePin,
} from "./check-track-source-pin.mjs";

function readInputs() {
  return {
    pin: JSON.parse(readFileSync(fromRoot("TRACK-SOURCE-PIN.json"), "utf8")),
    trackSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
  };
}

test("committed track source matches the exact RSH-013 Git blob authority", () => {
  const inputs = readInputs();
  const result = validateTrackSourcePin(inputs);
  assert.deepEqual(result.errors, []);
  assert.equal(result.actualGitBlobSha1, EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1);
  assert.equal(gitBlobSha1(inputs.trackSource), EXPECTED_TRACK_SOURCE_GIT_BLOB_SHA1);
});

test("any source-level edit fails closed even when semantic guards miss its syntax", () => {
  const inputs = readInputs();
  inputs.trackSource += "\nvoid 0;\n";
  assert.match(
    validateTrackSourcePin(inputs).errors.join("\n"),
    /Git blob identity .* differs from pinned/,
  );
});

test("updating only the machine pin cannot authorize source drift", () => {
  const inputs = readInputs();
  inputs.trackSource += "\nTLV_BLUE.elevation = 9;\n";
  inputs.pin.expected_git_blob_sha1 = gitBlobSha1(inputs.trackSource);
  assert.match(
    validateTrackSourcePin(inputs).errors.join("\n"),
    /authority differs from the accepted RSH-013 baseline|differs from pinned/,
  );
});

test("source path algorithm capture state and baseline commit fail closed", () => {
  const inputs = readInputs();
  inputs.pin.source_path = "src/game/other.ts";
  inputs.pin.algorithm = "sha256";
  inputs.pin.capture_state = "pending";
  inputs.pin.captured_from_commit = "0".repeat(40);
  const errors = validateTrackSourcePin(inputs).errors.join("\n");
  assert.match(errors, /path must remain/);
  assert.match(errors, /algorithm/);
  assert.match(errors, /remain pinned/);
  assert.match(errors, /accepted RSH-012 merge/);
});

test("RSH-014 is the only declared replacement authority and RSH-015 stays blocked", () => {
  const inputs = readInputs();
  inputs.pin.change_control["RSH-014_may_replace_with_modular_source_manifest"] = false;
  inputs.pin.change_control["RSH-015_authorized"] = true;
  assert.match(
    validateTrackSourcePin(inputs).errors.join("\n"),
    /change control is incomplete or over-authorized/,
  );
});

test("underscore RSH aliases fail closed", () => {
  const inputs = readInputs();
  inputs.pin.change_control.RSH_014_may_replace_with_modular_source_manifest = true;
  assert.match(
    validateTrackSourcePin(inputs).errors.join("\n"),
    /hyphenated RSH IDs/,
  );
});
