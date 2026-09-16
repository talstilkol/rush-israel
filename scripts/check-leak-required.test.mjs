import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { missingLeakHarnessTokens, runLeakEnterExit } from "./check-leak-required.mjs";

test("20-cycle enter-exit leak harness tokens remain", () => {
  assert.deepEqual(missingLeakHarnessTokens(), []);
  const pkg = JSON.parse(readFileSync(fromRoot("package.json"), "utf8"));
  assert.equal(pkg.scripts["qa:soak:raw"], "node scripts/soak-menu-race.mjs");
  assert.equal(pkg.scripts["qa:ci:raw"].includes("qa:soak:raw"), false);
  assert.equal(pkg.scripts["qa:raw"].includes("qa:soak-smoke:raw"), true);
});

test("20-cycle enter-exit leak harness runs inside npm test", { timeout: 780_000 }, () => {
  const result = runLeakEnterExit();
  assert.equal(result.status, 0, (result.stderr || "") + (result.stdout || ""));
  assert.match(result.stdout, /soak ok/);
});
