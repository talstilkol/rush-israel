#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";
import { SECRET_PATTERNS } from "./secrets-check.mjs";

export const PUBLIC_TEXT = /\.(?:ts|tsx|js|jsx|mjs|cjs|mts|cts|json|md|yml|yaml|html|css|txt|svg|xml|map)$/i;

export function trackedPublicTextFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z", "public"], { cwd: projectRoot, encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
      .filter((path) => PUBLIC_TEXT.test(path))
      .sort();
  } catch {
    return [];
  }
}

function lineHits(rel, text) {
  const hits = [];
  text.split("\n").forEach((line, index) => {
    for (const { id, re } of SECRET_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(line)) hits.push(`${rel}:${index + 1}:${id}:${line.trim()}`);
    }
  });
  return hits;
}

export function scanPublicText(rel, text) {
  return lineHits(rel, text);
}

export function scanTrackedPublicSecrets() {
  const hits = [];
  for (const rel of trackedPublicTextFiles()) {
    hits.push(...lineHits(rel, readFileSync(fromRoot(...rel.split("/")), "utf8")));
  }
  return hits;
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
  const hits = scanTrackedPublicSecrets();
  if (hits.length) {
    console.error(hits.join("\n"));
    process.exit(1);
  }
  console.log("public-secrets ok", trackedPublicTextFiles().length, "tracked public text files");
}
