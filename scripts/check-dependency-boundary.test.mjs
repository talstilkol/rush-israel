import assert from "node:assert/strict";
import { test } from "node:test";
import { readDependencyBoundaryInputs, validateDependencyBoundary } from "./check-dependency-boundary.mjs";

function baseline() { return structuredClone(readDependencyBoundaryInputs()); }
function messages(result) { return result.errors.join("\n"); }

test("RSH-020 pins the 74-to-30 direct dependency boundary", () => {
  const result = validateDependencyBoundary();
  assert.deepEqual(result.errors, []);
  assert.equal(result.runtimePackages, 10);
  assert.equal(result.developmentPackages, 20);
  assert.equal(result.totalPackages, 30);
  assert.equal(result.removedPackages, 44);
});

test("forbidden direct dependencies and backend scripts fail closed", () => {
  const dependency = baseline();
  const pkg = JSON.parse(dependency.packageSource);
  pkg.dependencies["better-auth"] = "1.0.0";
  dependency.packageSource = JSON.stringify(pkg, null, 2) + "\n";
  assert.match(messages(validateDependencyBoundary(dependency)), /runtime direct dependency|package.json identity|dependency map|lock/);
  const script = baseline();
  const scriptPkg = JSON.parse(script.packageSource);
  scriptPkg.scripts.build = "vite build && npm run db:migrate";
  script.packageSource = JSON.stringify(scriptPkg, null, 2) + "\n";
  assert.match(messages(validateDependencyBoundary(script)), /package.json identity|product script|template script/);
});

test("auth, DB, multiplayer and preview-host paths fail closed", () => {
  for (const path of ["src/lib/auth/client.ts", "src/lib/db.ts", "src/lib/multiplayer/p2p.ts", "src/components/preview-host-bridge.tsx"]) {
    const input = baseline();
    input.repositoryFiles.push(path);
    assert.match(messages(validateDependencyBoundary(input)), /removed directory|removed file/, path);
  }
});

test("retained PWA compatibility and Nitro pin fail closed", () => {
  const root = baseline();
  root.rootSource = root.rootSource.replace("/__grok/manifest.webmanifest", "/manifest.webmanifest");
  assert.match(messages(validateDependencyBoundary(root)), /PWA boundary/);
  const nitro = baseline();
  const pkg = JSON.parse(nitro.packageSource);
  pkg.devDependencies.nitro = "^3.0.0";
  nitro.packageSource = JSON.stringify(pkg, null, 2) + "\n";
  assert.match(messages(validateDependencyBoundary(nitro)), /package.json identity|dependency map|Nitro/);
});

test("RSH-021 precreation and temporary RSH-020 files fail closed", () => {
  const later = baseline();
  later.repositoryFiles.push("RSH-021-PREFLIGHT.json");
  assert.match(messages(validateDependencyBoundary(later)), /RSH-021 was precreated/);
  const temp = baseline();
  temp.repositoryFiles.push("scripts/rsh020-apply.mjs");
  assert.match(messages(validateDependencyBoundary(temp)), /temporary RSH-020 files remain/);
});
