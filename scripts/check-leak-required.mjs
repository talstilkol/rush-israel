#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { withQaPortLockSync } from "./qa-port-lock.mjs";

export const LEAK_HARNESS_TOKENS = ["SOAK_CYCLES", "dTex > 2", "dGeo > 2", "soak ok"];

export function missingLeakHarnessTokens() {
  const source = readFileSync(fromRoot("scripts", "soak-menu-race.mjs"), "utf8");
  return LEAK_HARNESS_TOKENS.filter((token) => !source.includes(token));
}

export function runLeakEnterExit() {
  return withQaPortLockSync(() => spawnSync(
    process.execPath,
    [
      fromRoot("scripts", "run-with-server.mjs"),
      "--",
      process.execPath,
      fromRoot("scripts", "soak-menu-race.mjs"),
    ],
    {
      cwd: fromRoot(),
      encoding: "utf8",
      timeout: 360_000,
      env: { ...process.env, SOAK_CYCLES: "20" },
    },
  ), 420_000);
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(url);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const missing = missingLeakHarnessTokens();
  if (missing.length) {
    console.error("leak-required fail: harness lost tokens " + missing.join(", "));
    process.exit(1);
  }
  const result = runLeakEnterExit();
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "soak-menu-race failed\n");
    process.exit(result.status === null ? 1 : result.status);
  }
  process.stdout.write(result.stdout);
  console.log("leak-required ok");
}
