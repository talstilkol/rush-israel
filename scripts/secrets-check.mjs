#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { fromRoot } from "./project-root.mjs";

const PAT = /sk-|apiKey|BEGIN RSA/;

export async function scanSecrets(root) {
  const hits = [];
  async function walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (/\.(ts|tsx|js|mjs)$/.test(e.name)) {
        const t = await readFile(p, "utf8");
        t.split("\n").forEach((line, i) => {
          if (PAT.test(line)) hits.push(`${p}:${i + 1}:${line.trim()}`);
        });
      }
    }
  }
  await walk(root);
  return hits;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const hits = await scanSecrets(fromRoot("src", "game"));
  if (hits.length) {
    console.error(hits.join("\n"));
    process.exit(1);
  }
  console.log("secrets-check ok");
}
