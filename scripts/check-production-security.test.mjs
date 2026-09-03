import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateProductionSecurity } from "./check-production-security.mjs";
import {
  BUILD_COMMAND,
  PRODUCTION_QA_NEEDLES,
  SECRET_SCAN_ROOTS,
} from "../src/game/security/production-policy.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-024 production-security authority passes under the RSH-029 overlay and RSH-035 remains absent", () => {
  const result = validateProductionSecurity();
  assert.deepEqual(result.errors, []);
  assert.equal(result.buildCommand, "vite build");
  assert.equal(result.patternCount, 8);
  assert.equal(result.schemaVersion, 3);
});

test("RSH-035 precreation fails closed", () => {
  const result = validateProductionSecurity({
    repositoryFiles: ["RSH-035-PREFLIGHT.json", "src/game/security/production-policy.ts"],
  });
  assert.match(messages(result), /RSH-035 was precreated/);
});

test("production policy pins build, secret-scan roots and QA needles", () => {
  assert.equal(BUILD_COMMAND, "vite build");
  assert.deepEqual([...SECRET_SCAN_ROOTS], ["src", "scripts", "server", ".github"]);
  assert.deepEqual([...PRODUCTION_QA_NEEDLES], ["finishNow", "__controlsTest"]);
  const pkg = JSON.parse(readFileSync(fromRoot("package.json"), "utf8"));
  assert.equal(pkg.scripts.build, "vite build");
  assert.equal(pkg.scripts["db:migrate"], undefined);
  assert.ok(pkg.scripts["qa:ci:raw"].includes("npm run check:qa"));
  assert.ok(pkg.scripts["qa:ci:raw"].includes("npm run check:secrets"));
});

test("QA adapter keeps the accepted production early-return", () => {
  const adapter = readFileSync(fromRoot("src", "game", "engine", "qa-adapter.ts"), "utf8");
  assert.ok(adapter.includes('if (import.meta.env.PROD && import.meta.env.VITE_QA !== "1") return;'));
  assert.ok(adapter.includes("finishNow:"));
});
