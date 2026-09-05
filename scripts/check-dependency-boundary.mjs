#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "86e01f31af5ee43f1571f806545a0c72d3ee77174a9949b7df24d08f9cd9d51c";
export const EXPECTED_PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_DEPENDENCY_MAP_SHA256 = "a3e951f6e3e7d32ee06008b2b3f294b619c7b3753419001624399e477c8038ea";
export const EXPECTED_PACKAGE_LOCK_SHA256 = "55afd975f03b12867aada083c375e2fadc402b654ddaf0f0934807966fa9f1ed";
export const EXPECTED_RUNTIME_PACKAGES = [
  "@tailwindcss/vite",
  "@tanstack/react-router",
  "@tanstack/react-start",
  "clsx",
  "lucide-react",
  "react",
  "react-dom",
  "tailwind-merge",
  "tailwindcss",
  "three"
];
export const EXPECTED_DEVELOPMENT_PACKAGES = [
  "@eslint/js",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "@types/three",
  "@vitejs/plugin-react",
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-react-hooks",
  "eslint-plugin-react-refresh",
  "globals",
  "ktx-parse",
  "nitro",
  "pixelmatch",
  "playwright",
  "pngjs",
  "prettier",
  "typescript",
  "typescript-eslint",
  "vite"
];

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, stable(child)]));
  return value;
}
function dependencyMapSource(pkg) { return JSON.stringify(stable({ dependencies: pkg.dependencies ?? {}, devDependencies: pkg.devDependencies ?? {} })) + "\n"; }
function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "coverage"].includes(name)) continue;
    const absolute = directory + "/" + name;
    const path = prefix ? prefix + "/" + name : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path)); else out.push(path);
  }
  return out;
}
function trackedRepositoryFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }).split("\0").filter(Boolean).sort();
  } catch {
    return walk(fromRoot());
  }
}
export function readDependencyBoundaryInputs() {
  return {
    manifestSource: readFileSync(fromRoot("DEPENDENCY-BOUNDARY-MANIFEST.json"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    lockSource: readFileSync(fromRoot("package-lock.json"), "utf8"),
    rootSource: readFileSync(fromRoot("src", "routes", "__root.tsx"), "utf8"),
    viteSource: readFileSync(fromRoot("vite.config.ts"), "utf8"),
    envSource: readFileSync(fromRoot(".env.example"), "utf8"),
    ignoreSource: readFileSync(fromRoot(".gitignore"), "utf8"),
    policySource: readFileSync(fromRoot("DEPENDENCY-POLICY.md"), "utf8"),
    metadataSource: readFileSync(fromRoot("PRODUCT-METADATA.json"), "utf8"),
    productSource: readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8"),
    qaHookSource: readFileSync(fromRoot("scripts", "check-qa-hook.mjs"), "utf8"),
    serverRunnerSource: readFileSync(fromRoot("scripts", "run-with-server.mjs"), "utf8"),
    browserSmokeSource: readFileSync(fromRoot("scripts", "browser-smoke.mjs"), "utf8"),
    repositoryFiles: trackedRepositoryFiles(),
  };
}
export function validateDependencyBoundary(overrides = {}) {
  const input = { ...readDependencyBoundaryInputs(), ...overrides };
  const errors = [];
  let manifest, pkg, lock, metadata, product;
  try { manifest = JSON.parse(input.manifestSource); } catch (error) { return { errors: ["dependency manifest invalid: " + error.message] }; }
  try { pkg = JSON.parse(input.packageSource); lock = JSON.parse(input.lockSource); metadata = JSON.parse(input.metadataSource); product = JSON.parse(input.productSource); }
  catch (error) { return { errors: ["dependency input JSON invalid: " + error.message] }; }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("dependency manifest differs from the accepted RSH-020 authority");
  if (manifest.unit !== "RSH-020" || manifest.direct_packages.before.total !== 74 || manifest.direct_packages.after.total !== 30 || manifest.direct_packages.removed !== 44) errors.push("dependency count authority changed");
  const runtime = Object.keys(pkg.dependencies ?? {}).sort();
  const development = Object.keys(pkg.devDependencies ?? {}).sort();
  if (JSON.stringify(runtime) !== JSON.stringify(EXPECTED_RUNTIME_PACKAGES)) errors.push("runtime direct dependency set changed");
  if (JSON.stringify(development) !== JSON.stringify(EXPECTED_DEVELOPMENT_PACKAGES)) errors.push("development direct dependency set changed");
  if (runtime.length !== 10 || development.length !== 20) errors.push("direct dependency counts changed");
  if (sha256(input.packageSource) !== EXPECTED_PACKAGE_SOURCE_SHA256) errors.push("package.json identity changed");
  if (sha256(dependencyMapSource(pkg)) !== EXPECTED_DEPENDENCY_MAP_SHA256) errors.push("dependency map changed");
  if (sha256(input.lockSource) !== EXPECTED_PACKAGE_LOCK_SHA256) errors.push("package-lock identity changed");
  const lockRoot = lock.packages?.[""];
  if (!lockRoot || JSON.stringify(lockRoot.dependencies ?? {}) !== JSON.stringify(pkg.dependencies) || JSON.stringify(lockRoot.devDependencies ?? {}) !== JSON.stringify(pkg.devDependencies)) errors.push("package-lock root dependency maps differ from package.json");
  const expectedScripts = { dev: "vite dev --host 0.0.0.0 --port 8080", build: "vite build", "build:dev": "vite build --mode development", preview: "vite preview" };
  for (const [name, command] of Object.entries(expectedScripts)) if (pkg.scripts?.[name] !== command) errors.push("product script changed: " + name);
  if (pkg.scripts?.["db:migrate"] || pkg.scripts?.["check:auth"] || /with-app-env|migrate\.mjs/.test(JSON.stringify(pkg.scripts ?? {}))) errors.push("removed template script returned");
  if (pkg.scripts?.["check:dependencies"] !== "node scripts/check-dependency-boundary.mjs" || !pkg.scripts?.["qa:ci:raw"]?.includes("npm run check:dependencies")) errors.push("dependency boundary is not in the QA gate");
  if (/with-app-env\.mjs|app-env\.json/.test(input.qaHookSource) || !input.qaHookSource.includes('execSync("npm run build"')) errors.push("QA hook build reintroduced the removed app-env wrapper");
  if (/with-app-env\.mjs|app-env\.json/.test(input.serverRunnerSource) || !input.serverRunnerSource.includes('fromRoot("node_modules", "vite", "bin", "vite.js")')) errors.push("QA server launcher reintroduced the removed app-env wrapper");
  if (/check-auth-invariant\.mjs|authInvariantWarnings|buildAuthEnabled|compareAuthInvariant|probeDevAuthEnabled/.test(input.browserSmokeSource) || !input.browserSmokeSource.includes("const authWarnings = [];")) errors.push("browser smoke reintroduced the removed auth invariant helper");
  if (/AuthProvider|PreviewHostBridge|lib\/auth|preview-host-bridge/.test(input.rootSource)) errors.push("root route reintroduced template auth or preview bridge");
  if (!input.rootSource.includes("<Outlet />") || !input.rootSource.includes("/__grok/manifest.webmanifest")) errors.push("root route lost the product or retained PWA boundary");
  if (/pgliteBootstrapPlugin|authPopupPlugin|appEnvPlugin|migration-plan|src\/lib\/db|src\/lib\/auth/.test(input.viteSource)) errors.push("Vite reintroduced auth, DB or app-env template plugins");
  for (const token of ["grokPwaPlugin()", "gameCachePlugin()", "tailwindcss()", "tanstackStart()", "nitro({", "viteReact()"] ) if (!input.viteSource.includes(token)) errors.push("Vite lost retained product plugin: " + token);
  if (/DATABASE_URL|BETTER_AUTH|GROK_AUTH|GROK_PREVIEW|VITE_AUTH_ENABLED/.test(input.envSource) || !input.envSource.includes("VITE_QA=")) errors.push("environment example contains removed backend/auth configuration");
  if (!input.ignoreSource.split(/\r?\n/).includes(".vercel/")) errors.push("generated Vercel output is not excluded by .gitignore");
  for (const prefix of [".grok", "migrations", "src/lib/auth", "src/lib/multiplayer"]) if (input.repositoryFiles.some((path) => path === prefix || path.startsWith(prefix + "/"))) errors.push("removed directory returned: " + prefix);
  for (const path of manifest.removed_surfaces.files) if (input.repositoryFiles.includes(path)) errors.push("removed file returned: " + path);
  const forbiddenRuntime = ["better-auth", "@electric-sql/pglite", "kysely", "from \"pg\"", "RTCPeerConnection", "preview-host-bridge"];
  for (const path of input.repositoryFiles.filter((path) => path.startsWith("src/") || path === "vite.config.ts")) {
    if (!/\.(?:ts|tsx|js|jsx|mjs)$/.test(path)) continue;
    let source;
    try { source = path === "vite.config.ts" ? input.viteSource : readFileSync(fromRoot(...path.split("/")), "utf8"); }
    catch { continue; }
    for (const token of forbiddenRuntime) if (source.includes(token)) errors.push("removed runtime token returned in " + path + ": " + token);
  }
  if (pkg.devDependencies?.nitro !== "3.0.260610-beta" || manifest.audit_evidence.nitro_latest_dist_tag !== "3.0.260610-beta") errors.push("Nitro exact stability decision changed");
  if (!input.policySource.includes("at least monthly") || !input.policySource.includes("Automated dependency PRs are disabled") || !input.policySource.includes("3.0.260610-beta")) errors.push("dependency update policy is incomplete");
  if (metadata.pwa?.manifest_delivery !== "dynamic_via_vite_and_server_middleware" || metadata.product?.name !== "RUSH Israel") errors.push("product metadata or PWA boundary changed");
  if (product.product?.public_distribution_authorized !== false || product.version_1_scope?.tracks?.target_count !== 8) errors.push("frozen product boundary changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary.forbidden_prefixes.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push("RSH-037 was precreated: " + later.join(", "));
  const generated = input.repositoryFiles.filter((path) => [".vercel/", "dist/", ".output/", ".nitro/"].some((prefix) => path.startsWith(prefix)));
  if (generated.length) errors.push("generated build output is tracked: " + generated.join(", "));
  const temp = input.repositoryFiles.filter((path) => path.startsWith(".rsh020") || path.startsWith(".github/workflows/rsh-020-") || path.startsWith("scripts/rsh020-"));
  if (temp.length) errors.push("temporary RSH-020 files remain: " + temp.join(", "));
  return { errors, runtimePackages: runtime.length, developmentPackages: development.length, totalPackages: runtime.length + development.length, removedPackages: 74 - runtime.length - development.length };
}
function isMainModule(url) { const entry = process.argv[1]; if (!entry) return false; try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; } }
if (isMainModule(import.meta.url)) {
  const result = validateDependencyBoundary();
  if (result.errors.length) { console.error("dependency-boundary fail\n" + result.errors.map((error) => "- " + error).join("\n")); process.exit(1); }
  console.log("dependency-boundary ok: " + result.runtimePackages + " runtime + " + result.developmentPackages + " development = " + result.totalPackages + "; removed " + result.removedPackages);
}
