#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const EXPECTED_NODE = "22.16.0";
const EXPECTED_NPM = "10.9.2";

function npmVersion() {
  const userAgent = process.env.npm_config_user_agent ?? "";
  const fromAgent = /(?:^|\s)npm\/([^\s]+)/.exec(userAgent)?.[1];
  if (fromAgent) return fromAgent;

  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath) {
    return execFileSync(process.execPath, [npmExecPath, "--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    }).trim();
  }

  return execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["--version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

const actualNode = process.versions.node;
const actualNpm = npmVersion();
const failures = [];

if (actualNode !== EXPECTED_NODE) {
  failures.push(`Node ${actualNode}; expected ${EXPECTED_NODE}`);
}
if (actualNpm !== EXPECTED_NPM) {
  failures.push(`npm ${actualNpm}; expected ${EXPECTED_NPM}`);
}

if (failures.length) {
  console.error("RUSH toolchain mismatch:");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error("Use .nvmrc/.node-version or Volta, then run npm ci again.");
  process.exit(1);
}

console.log(`toolchain ok — Node ${actualNode}, npm ${actualNpm}`);
