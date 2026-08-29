#!/usr/bin/env node
/** Fail if a track card drops the inspired disclaimer, or src/game says DEM. */
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { readCanonicalTrackSource } from "./load-track-modules.mjs";

const tracks = readCanonicalTrackSource();
const descs = [...tracks.matchAll(/description(?:En)?:\s*"([^"]*)"/g)].map((m) => m[1]);
if (descs.length < 50) {
  console.error("check-copy: too few descriptions", descs.length);
  process.exit(1);
}
const bad = descs.filter((d) => !/בהשראת|inspired|not gis/i.test(d));
if (bad.length) {
  console.error("check-copy: missing inspired line\n" + bad.slice(0, 8).join("\n"));
  process.exit(1);
}

async function walk(dir, out = []) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

const files = await walk("src");
const demHits = [];
for (const f of files) {
  const t = await readFile(f, "utf8");
  t.split("\n").forEach((line, i) => {
    if (/\bDEM\b/.test(line)) demHits.push(`${f}:${i + 1}:${line.trim()}`);
  });
}
if (demHits.length) {
  console.error("check-copy: DEM in src\n" + demHits.join("\n"));
  process.exit(1);
}
console.log("check-copy ok", descs.length, "descriptions");
