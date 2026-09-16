#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const DAMAGE_SMOKE_TOKENS = ["setDamage", "getDamage", "Escape", "resetStart"];

export function missingDamageSmokeTokens() {
  const source = readFileSync(fromRoot("scripts", "damage-smoke.mjs"), "utf8");
  return DAMAGE_SMOKE_TOKENS.filter((token) => !source.includes(token));
}

function runScript(args, timeout) {
  return spawnSync(process.execPath, args, {
    cwd: fromRoot(),
    encoding: "utf8",
    timeout,
  });
}

export function runAyalonLock() {
  return runScript([fromRoot("scripts", "ayalon-hash.mjs")], 30_000);
}

export function runDamageSmoke() {
  return runScript(
    [
      fromRoot("scripts", "run-with-server.mjs"),
      "--",
      process.execPath,
      fromRoot("scripts", "damage-smoke.mjs"),
    ],
    180_000,
  );
}

export function runPixelGolden() {
  return runScript(
    [
      fromRoot("scripts", "run-with-server.mjs"),
      "--",
      process.execPath,
      fromRoot("scripts", "pixel-golden.mjs"),
    ],
    180_000,
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
  const missing = missingDamageSmokeTokens();
  if (missing.length) {
    console.error("damage-required fail: smoke lost tokens " + missing.join(", "));
    process.exit(1);
  }
  const lock = runAyalonLock();
  if (lock.status !== 0) {
    process.stderr.write(lock.stderr || lock.stdout || "ayalon-hash failed\n");
    process.exit(lock.status === null ? 1 : lock.status);
  }
  process.stdout.write(lock.stdout);
  const damage = runDamageSmoke();
  if (damage.status !== 0) {
    process.stderr.write(damage.stderr || damage.stdout || "damage-smoke failed\n");
    process.exit(damage.status === null ? 1 : damage.status);
  }
  process.stdout.write(damage.stdout);
  const golden = runPixelGolden();
  if (golden.status !== 0) {
    process.stderr.write(golden.stderr || golden.stdout || "pixel-golden failed\n");
    process.exit(golden.status === null ? 1 : golden.status);
  }
  process.stdout.write(golden.stdout);
  console.log("damage-required ok");
}
