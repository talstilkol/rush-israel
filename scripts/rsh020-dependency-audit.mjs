#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignored = new Set([".git", "node_modules", "dist", ".output", ".nitro", ".vercel", "coverage"]);
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"]);

function walk(directory) {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if (ignored.has(name)) continue;
    const absolute = resolve(directory, name);
    const stat = statSync(absolute);
    if (stat.isDirectory()) out.push(...walk(absolute));
    else if (sourceExtensions.has(extname(name))) out.push(absolute);
  }
  return out;
}

function packageRoot(specifier) {
  if (
    !specifier ||
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("node:") ||
    specifier.startsWith("@/") ||
    specifier.startsWith("virtual:") ||
    specifier.startsWith("#")
  ) return null;
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const declared = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
const usage = new Map();
const internalTargets = {
  auth: [],
  db: [],
  multiplayer: [],
  previewBridge: [],
  grokTemplate: [],
  migrations: [],
};
const patterns = [
  /\b(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
  /@import\s+["']([^"']+)["']/g,
];

for (const absolute of walk(root)) {
  const path = relative(root, absolute).replaceAll("\\", "/");
  const source = readFileSync(absolute, "utf8");
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source))) {
      const dependency = packageRoot(match[1]);
      if (!dependency) continue;
      if (!usage.has(dependency)) usage.set(dependency, new Set());
      usage.get(dependency).add(path);
    }
  }
  const checks = [
    ["auth", /(?:@\/|\.\.?\/)lib\/auth|src\/lib\/auth|better-auth/],
    ["db", /(?:@\/|\.\.?\/)lib\/db|src\/lib\/db|pglite|kysely|\bpg\b/],
    ["multiplayer", /(?:@\/|\.\.?\/)lib\/multiplayer|src\/lib\/multiplayer|RTCPeerConnection/],
    ["previewBridge", /preview-host-bridge|preview-embedder-origin|grok-preview-bridge/],
    ["grokTemplate", /__grok|grok-pwa|grok:app_id|Grok preview|grok-web/],
    ["migrations", /migrate\.mjs|migration-plan|migrations\//],
  ];
  for (const [key, pattern] of checks) if (pattern.test(source) || pattern.test(path)) internalTargets[key].push(path);
}

const scriptBinaryPackages = {
  vite: "vite",
  tsc: "typescript",
  eslint: "eslint",
  prettier: "prettier",
  playwright: "playwright",
  nitro: "nitro",
};
for (const command of Object.values(packageJson.scripts ?? {})) {
  for (const [binary, dependency] of Object.entries(scriptBinaryPackages)) {
    if (new RegExp(`(?:^|\\s|/)${binary}(?:\\s|$)`).test(command)) {
      if (!usage.has(dependency)) usage.set(dependency, new Set());
      usage.get(dependency).add("package.json#scripts");
    }
  }
}

const declaredNames = Object.keys(declared).sort();
const usedDeclared = declaredNames.filter((name) => usage.has(name));
const unusedDeclared = declaredNames.filter((name) => !usage.has(name));
const undeclaredImports = [...usage.keys()].filter((name) => !declared[name]).sort();
const usageObject = Object.fromEntries(
  [...usage.entries()]
    .filter(([name]) => declared[name])
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, files]) => [name, [...files].sort()]),
);

const report = {
  schemaVersion: 1,
  unit: "RSH-020",
  scannedFiles: walk(root).length,
  declaredPackages: declaredNames.length,
  usedDeclaredPackages: usedDeclared.length,
  unusedDeclaredPackages: unusedDeclared.length,
  used: usageObject,
  unused: unusedDeclared,
  undeclaredImports,
  internalTargets: Object.fromEntries(
    Object.entries(internalTargets).map(([key, files]) => [key, [...new Set(files)].sort()]),
  ),
};
console.log(JSON.stringify(report, null, 2));
