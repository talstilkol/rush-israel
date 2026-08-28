import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

const EXPECTED_NODE = "22.16.0";
const EXPECTED_NPM = "10.9.2";

function readJson(name) {
  return JSON.parse(readFileSync(fromRoot(name), "utf8"));
}

test("all tracked toolchain pins agree exactly", () => {
  const pkg = readJson("package.json");
  assert.equal(readFileSync(fromRoot(".nvmrc"), "utf8").trim(), EXPECTED_NODE);
  assert.equal(readFileSync(fromRoot(".node-version"), "utf8").trim(), EXPECTED_NODE);
  assert.equal(pkg.packageManager, `npm@${EXPECTED_NPM}`);
  assert.deepEqual(pkg.volta, { node: EXPECTED_NODE, npm: EXPECTED_NPM });
  assert.equal(pkg.scripts.preinstall, "node scripts/verify-toolchain.mjs");
});

test("package and lockfile root metadata remain synchronised", () => {
  const pkg = readJson("package.json");
  const lock = readJson("package-lock.json");
  const root = lock.packages?.[""];
  assert.ok(root, "package-lock root package is missing");
  assert.equal(lock.name, pkg.name);
  assert.equal(root.name, pkg.name);
  assert.equal(pkg.engines, undefined);
  assert.equal(root.engines, undefined);
  assert.deepEqual(root.dependencies, pkg.dependencies);
  assert.deepEqual(root.devDependencies, pkg.devDependencies);
});
