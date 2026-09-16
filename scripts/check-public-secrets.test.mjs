import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PUBLIC_TEXT,
  scanPublicText,
  scanTrackedPublicSecrets,
  trackedPublicTextFiles,
} from "./check-public-secrets.mjs";

test("shipped public text and SVG files contain no secret-like values", () => {
  const files = trackedPublicTextFiles();
  assert.ok(files.includes("public/basis/basis_transcoder.js"));
  assert.ok(files.includes("public/__grok/install/styles.css"));
  assert.ok(files.includes("public/favicon.svg"));
  assert.ok(files.every((path) => path.startsWith("public/") && PUBLIC_TEXT.test(path)));
  assert.deepEqual(scanTrackedPublicSecrets(), []);
});

test("public secret scanner fails closed on a planted leak", () => {
  const openai = `sk-${"abcdefghijklmnopqrstuvwxyz1234"}`;
  const hits = scanPublicText("public/leak.js", `const k = "${openai}";`);
  assert.equal(hits.length, 1);
  assert.match(hits[0], /openai-sk/);
});
