#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const DAMAGE_SMOKE_TOKENS = ["setDamage", "getDamage", "Escape", "resetStart"];
export const SOAK_THIRTY_TOKENS = [
  "const MS = Number(process.env.SOAK_MS || 30 * 60 * 1000)",
  "Not advanceTime",
  "while (Date.now() - t0 < MS)",
];
export const QA_COMMAND_TIMEOUT_MS = String(34 * 60 * 1000);
export const DAMAGE_THEN_SOAK_SPAWN_TIMEOUT_MS = 36 * 60 * 1000;

export function missingDamageSmokeTokens() {
  const source = readFileSync(fromRoot("scripts", "damage-smoke.mjs"), "utf8");
  return DAMAGE_SMOKE_TOKENS.filter((token) => !source.includes(token));
}

export function missingSoakThirtyTokens() {
  const source = readFileSync(fromRoot("scripts", "soak-30min.mjs"), "utf8");
  return SOAK_THIRTY_TOKENS.filter((token) => !source.includes(token));
}

export function runDamageThenSoak() {
  return spawnSync(
    process.execPath,
    [
      fromRoot("scripts", "run-with-server.mjs"),
      "--",
      process.execPath,
      fromRoot("scripts", "run-damage-then-soak.mjs"),
    ],
    {
      cwd: fromRoot(),
      encoding: "utf8",
      timeout: DAMAGE_THEN_SOAK_SPAWN_TIMEOUT_MS,
      env: {
        ...process.env,
        QA_COMMAND_TIMEOUT_MS,
      },
    },
  );
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
  const missing = [...missingDamageSmokeTokens(), ...missingSoakThirtyTokens()];
  if (missing.length) {
    console.error("damage-required fail: smoke lost tokens " + missing.join(", "));
    process.exit(1);
  }
  const result = runDamageThenSoak();
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "damage-then-soak failed\n");
    process.exit(result.status === null ? 1 : result.status);
  }
  process.stdout.write(result.stdout);
  console.log("damage-required ok");
}
