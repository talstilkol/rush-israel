import assert from "node:assert/strict";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

const DIGEST = "9f30d10a8be5d7388c23720a96ead370f9acaf38aa55aeac2f8166d8b8555230";

const schema = JSON.parse(readFileSync("TRACK-SCHEMA.json", "utf8"));
assert.equal(schema.runtime_definition_integrity.expected_digest, null);
assert.equal(schema.runtime_definition_integrity.capture_state, "pending_exact_ci_capture");
schema.generated_at = "2026-08-29T10:45:00+03:00";
schema.runtime_definition_integrity.expected_digest = DIGEST;
schema.runtime_definition_integrity.capture_state = "pinned";
writeFileSync("TRACK-SCHEMA.json", `${JSON.stringify(schema, null, 2)}\n`);

let testSource = readFileSync("scripts/check-track-schema.test.mjs", "utf8");n
assert.ok(testSource.includes("  assert.match(result.digest, /^[0-9a-f]{64}$/);"));
testSource = testSource.replace(
  "  assert.match(result.digest, /^[0-9a-f]{64}$/);",
  `  assert.equal(result.digest, "${DIGEST}");`,
);
assert.equal(testSource.includes("runtime data mutation changes the pinned digest"), false);
testSource += `\n\ntest("runtime data mutation changes the pinned digest", () => {\n  const inputs = readInputs();\n  inputs.trackSource = inputs.trackSource.replace(\n    '    descriptionEn: "Tel Aviv promenade, sea and sunset.",',\n    '    descriptionEn: "A changed but still valid localized description.",',\n  );\n  assert.match(errorsOf(inputs).join("\\n"), /runtime definition digest/);\n});\n`;
writeFileSync("scripts/check-track-schema.test.mjs", testSource);

let markdown = readFileSync("TRACK-SCHEMA.md", "utf8");
const before = "The exact digest is captured by exact-head CI and then committed before acceptance.";
assert.ok(markdown.includes(before));
markdown = markdown.replace(
  before,
  `The exact pinned digest is \`${DIGEST}\`. Any runtime-data or runtime-order change fails CI.`,
);
writeFileSync("TRACK-SCHEMA.md", markdown);

for (const path of ["scripts/finalize-rsh-013.mjs", ".github/workflows/rsh-013-finalize.yml"]) {
  if (existsSync(path)) unlinkSync(path);
}
console.log(`RSH-013 finalized with runtime digest ${DIGEST}`);
