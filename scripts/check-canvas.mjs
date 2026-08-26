#!/usr/bin/env node
/** Fail if runtime CanvasTexture / 2D canvas appears outside the probe allowlist. */
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const ALLOW = new Set([
  "src/rendering/CapabilityProbe.ts",
  "src/rendering/RendererFacade.ts",
]);

const NEEDLES = [
  /createElement\(\s*["']canvas["']\s*\)/,
  /new\s+THREE\.CanvasTexture/,
  /CanvasTexture\s*\(/,
];

async function walk(dir, out = []) {
  const entries = await readdir(dir);
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

const files = await walk("src");
const hits = [];
for (const f of files) {
  const rel = f.replace(/\\/g, "/");
  if (ALLOW.has(rel)) continue;
  const text = await readFile(f, "utf8");
  for (const re of NEEDLES) {
    if (re.test(text)) hits.push(rel + " " + re);
  }
}
if (hits.length) {
  console.error("check-canvas: runtime canvas outside allowlist\n" + hits.join("\n"));
  process.exit(1);
}
console.log("check-canvas ok", files.length, "files");
