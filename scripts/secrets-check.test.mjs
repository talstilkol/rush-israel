import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  SCAN_ROOTS,
  SECRET_PATTERN_SPECS,
  scanSecrets,
  scanTrackedSecrets,
} from "./secrets-check.mjs";

test("src/game still has no secret-like values", async () => {
  const hits = await scanSecrets(fromRoot("src", "game"));
  assert.deepEqual(hits, []);
});

test("tracked product, script, server and workflow text has no secret-like values", async () => {
  const hits = await scanTrackedSecrets();
  assert.deepEqual(hits, []);
});

test("secret scanning covers src, scripts, server and GitHub workflows", () => {
  assert.deepEqual([...SCAN_ROOTS], ["src", "scripts", "server", ".github"]);
  assert.equal(SECRET_PATTERN_SPECS.length, 8);
  for (const id of [
    "openai-sk",
    "xai-key",
    "github-token",
    "aws-access-key",
    "pem-private-key",
    "slack-token",
    "google-api-key",
    "assigned-secret",
  ]) assert.ok(SECRET_PATTERN_SPECS.some((spec) => spec.id === id), id);
});

test("expanded patterns fail closed on representative secret-like fixtures", async () => {
  const dir = mkdtempSync(join(tmpdir(), "rush-secrets-"));
  const openai = `sk-${"abcdefghijklmnopqrstuvwxyz1234"}`;
  const xai = `xai-${"abcdefghijklmnopqrstuvwxyz1234"}`;
  const github = `ghp_${"abcdefghijklmnopqrstuvwxyz1234"}`;
  const aws = `AKIA${"IOSFODNN7EXAMPLE"}`;
  const slack = ["xoxb", "123456789012", "abcdefghijklmnopqrst"].join("-");
  const google = `AIza${"SyDummyGoogleMapsKey000000000000001"}`;
  writeFileSync(join(dir, "leak.ts"), [
    `const k = "${openai}";`,
    `const x = "${xai}";`,
    `const g = "${github}";`,
    `const a = "${aws}";`,
    "-----BEGIN RSA PRIVATE KEY-----",
    `const s = "${slack}";`,
    `const z = "${google}";`,
    'const apiKey = "super-secret-value";',
  ].join("\n"));
  const hits = await scanSecrets(dir, { skipFiles: new Set() });
  assert.equal(hits.length, 8);
  for (const id of [
    "openai-sk",
    "xai-key",
    "github-token",
    "aws-access-key",
    "pem-private-key",
    "slack-token",
    "google-api-key",
    "assigned-secret",
  ]) assert.ok(hits.some((hit) => hit.includes(`:${id}:`)), id);
});
