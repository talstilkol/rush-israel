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

test("QA build and server entry points cannot restore the removed app-env wrapper", () => {
  const hook = baseline();
  hook.qaHookSource = hook.qaHookSource.replace(
    'execSync("npm run build"',
    'execSync("node scripts/with-app-env.mjs vite build"',
  );
  assert.match(messages(validateDependencyBoundary(hook)), /QA hook build reintroduced/);

  const server = baseline();
  server.serverRunnerSource += "\nnode scripts/with-app-env.mjs vite dev\n";
  assert.match(messages(validateDependencyBoundary(server)), /QA server launcher reintroduced/);
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

test("tracked build output and a missing ignore rule fail closed", () => {
  for (const path of [
    ".vercel/output/config.json",
    "dist/assets/index.js",
    ".output/server/index.mjs",
    ".nitro/types/nitro.d.ts",
  ]) {
    const input = baseline();
    input.repositoryFiles.push(path);
    assert.match(messages(validateDependencyBoundary(input)), /generated build output is tracked/, path);
  }
  const ignore = baseline();
  ignore.ignoreSource = ignore.ignoreSource.replace(/^\.vercel\/\r?\n?/m, "");
  assert.match(messages(validateDependencyBoundary(ignore)), /not excluded by \.gitignore/);
});

test("RSH-029 precreation and every temporary RSH-020 transport fail closed", () => {
  const later = baseline();
  later.repositoryFiles.push("RSH-029-PREFLIGHT.json");
  assert.match(messages(validateDependencyBoundary(later)), /RSH-029 was precreated/);
  for (const path of [
    ".rsh020-apply.00",
    ".github/workflows/rsh-020-cleanup.yml",
    "scripts/rsh020-apply.mjs",
  ]) {
    const input = baseline();
    input.repositoryFiles.push(path);
    assert.match(messages(validateDependencyBoundary(input)), /temporary RSH-020 files remain/, path);
  }
});
