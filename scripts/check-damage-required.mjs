#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { withQaPortLockSync } from "./qa-port-lock.mjs";

export const DAMAGE_SMOKE_TOKENS = ["setDamage", "getDamage", "Escape", "resetStart"];

export function missingDamageSmokeTokens() {
  const source = readFileSync(fromRoot("scripts", "damage-smoke.mjs"), "utf8");
  return DAMAGE_SMOKE_TOKENS.filter((token) => !source.includes(token));
}

export function runDamageSmoke() {
  return withQaPortLockSync(() => spawnSync(
    process.execPath,
    [
      fromRoot("scripts", "run-with-server.mjs"),
      "--",
      process.execPath,
      fromRoot("scripts", "damage-smoke.mjs"),
    ],
    {
      cwd: fromRoot(),
      encoding: "utf8",
      timeout: 180_000,
    },
  ));
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
  const missing = missingDamageSmokeTokens();
  if (missing.length) {
    console.error("damage-required fail: smoke lost tokens " + missing.join(", "));
    process.exit(1);
  }
  const result = runDamageSmoke();
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "damage-smoke failed\n");
    process.exit(result.status === null ? 1 : result.status);
  }
  process.stdout.write(result.stdout);
  console.log("damage-required ok");
}
