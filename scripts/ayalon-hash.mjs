#!/usr/bin/env node
/** Codex 82: sha256 of Ayalon track + world slices. Bump AYALON_LOCK to rewrite. */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LOCK_PATH = "/workspace/golden-baseline/ayalon.lock";

export function ayalonPayload() {
  const tracks = readFileSync("/workspace/src/game/tracks.ts", "utf8");
  const world = readFileSync("/workspace/src/game/world.ts", "utf8");
  const t0 = tracks.indexOf('id: "ayalon"');
  const t1 = tracks.indexOf('id: "caesarea"', t0);
  const w0 = world.indexOf("const placeAzrieli");
  const w1 = world.indexOf("const placeCityGate", w0);
  const a0 = world.indexOf('if (def.id === "ayalon") {', 5000);
  const a1 = world.indexOf('if (def.id === "caesarea")', a0);
  const hits = world
    .split("\n")
    .filter((l) => /ayalon/i.test(l))
    .join("\n");
  return [tracks.slice(t0, t1), world.slice(w0, w1), world.slice(a0, a1), hits].join("\n--\n");
}

export function ayalonHash() {
  return createHash("sha256").update(ayalonPayload()).digest("hex");
}

const hash = ayalonHash();
const envLock = process.env.AYALON_LOCK ? Number(process.env.AYALON_LOCK) : null;

if (process.argv.includes("--write") || envLock) {
  let lockN = envLock && Number.isFinite(envLock) ? envLock : 1;
  try {
    const prev = JSON.parse(readFileSync(LOCK_PATH, "utf8"));
    if (prev.hash === hash) lockN = prev.lock;
    else if (envLock == null) {
      console.error("hash changed; set AYALON_LOCK=" + (Number(prev.lock) + 1) + " to accept");
      process.exit(1);
    } else if (envLock <= prev.lock) {
      console.error("AYALON_LOCK must be > " + prev.lock);
      process.exit(1);
    }
  } catch {
    /* first write */
  }
  mkdirSync("/workspace/golden-baseline", { recursive: true });
  writeFileSync(LOCK_PATH, JSON.stringify({ lock: lockN, hash }, null, 2) + "\n");
  console.log("ayalon.lock wrote", lockN, hash.slice(0, 12));
  process.exit(0);
}

const stored = JSON.parse(readFileSync(LOCK_PATH, "utf8"));
if (stored.hash !== hash) {
  console.error("ayalon hash mismatch have", hash, "want", stored.hash, "bump AYALON_LOCK");
  process.exit(1);
}
console.log("ayalon-hash ok", stored.lock, hash.slice(0, 12));
