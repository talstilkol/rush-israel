#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, join } from "node:path";
import { fromRoot, projectRoot } from "./project-root.mjs";

const roots = [fromRoot("scripts"), fromRoot("src"), fromRoot("server")];
const fixedRoot = `/${"workspace"}`;
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(name)) continue;
    const text = readFileSync(path, "utf8");
    text.split("\n").forEach((line, index) => {
      if (line.includes(fixedRoot)) {
        hits.push(`${relative(projectRoot, path)}:${index + 1}:${line.trim()}`);
      }
    });
  }
}

for (const root of roots) walk(root);

if (hits.length) {
  console.error("Fixed sandbox root found in executable source:\n" + hits.join("\n"));
  process.exit(1);
}

console.log("portable-paths ok — no fixed sandbox root in scripts/src/server");
