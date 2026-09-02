#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const SECRET_PATTERN_SPECS = [
  { id: "openai-sk", source: String.raw`(?<![A-Za-z0-9_-])sk-[A-Za-z0-9]{20,}` },
  { id: "xai-key", source: String.raw`(?<![A-Za-z0-9_-])xai-[A-Za-z0-9_-]{20,}` },
  { id: "github-token", source: String.raw`(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}` },
  { id: "aws-access-key", source: String.raw`AKIA[0-9A-Z]{16}` },
  { id: "pem-private-key", source: String.raw`BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY` },
  { id: "slack-token", source: String.raw`xox[baprs]-[A-Za-z0-9-]{20,}` },
  { id: "google-api-key", source: String.raw`AIza[0-9A-Za-z_-]{35}` },
  { id: "assigned-secret", source: String.raw`(?:api[_-]?key|apikey|secret[_-]?key)\s*[:=]\s*['"][^'"]{12,}['"]`, flags: "gi" },
];

export const SECRET_PATTERNS = SECRET_PATTERN_SPECS.map((spec) => ({
  id: spec.id,
  re: new RegExp(spec.source, spec.flags ?? "g"),
}));

export const SCAN_ROOTS = ["src", "scripts", "server", ".github"];
export const SKIP_FILES = new Set([
  "scripts/secrets-check.test.mjs",
  "package-lock.json",
]);

const TEXT = /\.(?:ts|tsx|js|jsx|mjs|cjs|mts|cts|json|md|yml|yaml|html|css|txt|example)$/i;
const SKIP_DIR = new Set([
  ".git",
  "node_modules",
  "coverage",
  "dist",
  ".output",
  ".nitro",
  ".vercel",
  "golden-baseline",
  "public",
  "soak-logs",
]);

function relativeToRoot(absolute) {
  const prefix = `${projectRoot}/`;
  return absolute.startsWith(prefix) ? absolute.slice(prefix.length) : absolute;
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

export async function scanSecrets(root, options = {}) {
  const skipFiles = options.skipFiles ?? SKIP_FILES;
  const hits = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const absolute = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIR.has(entry.name)) continue;
        await walk(absolute);
        continue;
      }
      if (!TEXT.test(entry.name) && entry.name !== ".env.example") continue;
      const rel = relativeToRoot(absolute).replaceAll("\\", "/");
      if (skipFiles.has(rel)) continue;
      hits.push(...lineHits(rel, await readFile(absolute, "utf8")));
    }
  }
  await walk(root);
  return hits;
}

export function trackedSecretFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
      .filter((path) => TEXT.test(path) || path === ".env.example")
      .filter((path) => !path.startsWith("golden-baseline/") && !path.startsWith("public/") && !SKIP_FILES.has(path))
      .sort();
  } catch {
    return [];
  }
}

export async function scanTrackedSecrets() {
  const hits = [];
  for (const rel of trackedSecretFiles()) {
    hits.push(...lineHits(rel, await readFile(fromRoot(...rel.split("/")), "utf8")));
  }
  return hits;
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const hits = await scanTrackedSecrets();
  if (hits.length) {
    console.error(hits.join("\n"));
    process.exit(1);
  }
  console.log("secrets-check ok", trackedSecretFiles().length, "tracked text files");
}
