#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "6da5199ffb06ecdac1995a31c6d8a093a60acc8d1bbde13ec7d99c817e2283b9";
export const EXPECTED_FREEZE_SHA256 = "28e34f94fc5699301bc53301eec3e4f1f8811bc76ae12d3c68ccf315671e3ab4";
export const EXPECTED_INDEX_SHA256 = "54cf9ad3c6188cc776c7aa232fd7bd526452c9cbef3a68b918253489b7647c10";
export const EXPECTED_CONTRACT_SHA256 = "1dafe6a51e7d09e2c3c2cfc16017eda54842d91673e33ea6632dbd62bf943712";
export const EXPECTED_OWNER_SHA256 = "c735f363cbbeb3c30c5e7b44d5cf6bf1b3256e32548f434f46215560de6d7f84";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_HASHALOM_INDEX_SHA256 = "5f63d02f48f85d47916917c5dd6eb29c1c6b559bce6359e1e4f985cad339dc10";
export const EXPECTED_PIXEL_GOLDEN_SHA256 = "a8d05fcda8af97d67689f866a03dda052afb5b09c1181797875ccf7ce67fc621";
export const EXPECTED_CHECKER_TEST_SHA256 = "5e4a314682bf85e8cb5afdd6d34f223e6f285d806b64b492a067abd5dcb763cc";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_FREEZE_DIGEST_SHA256 = "b932b49a7689fe40b51fcb8b61ca8812c572403c6abd769acb3cb032066c6ff4";
export const EXPECTED_GOLDEN_DIGEST_SHA256 = "d1a09a9b9d4542b4ffd7d6feefcfd21e71a0a9903d12a1002dd728d3432f7a74";
export const DUPLICATE_PLACEHOLDER_HASH = "38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094";

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function sha256File(path) { return sha256(readFileSync(path)); }
function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "coverage", ".vercel", ".output", ".nitro", "dist"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const path = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path));
    else out.push(path);
  }
  return out;
}
function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" }).split("\0").filter(Boolean).sort();
  } catch { return walk(fromRoot()); }
}

export function canonicalFreezeDigest() {
  const source = readFileSync(fromRoot("src", "game", "ayalon-freeze", "freeze.ts"), "utf8");
  const hashes = {};
  const block = source.match(/export const TRANSITIVE_SOURCE_SHA256 = \{([\s\S]*?)\} as const;/);
  if (!block) throw new Error("TRANSITIVE_SOURCE_SHA256 missing");
  for (const line of block[1].split("\n")) {
    const m = line.match(/"([^"]+)": "([0-9a-f]{64})"/);
    if (m) hashes[m[1]] = m[2];
  }
  const sources = Object.entries(hashes).map(([path, hash]) => `${path}=${hash}`).join(",");
  return [
    "track=ayalon",
    "lock_generation=11",
    "lock_hash=0c34b9d1f9ded36eaa8400c7aaba48a4f725033bfe25412a4648c36c73910d48",
    `golden_digest=${EXPECTED_GOLDEN_DIGEST_SHA256}`,
    `placeholder_hash=${DUPLICATE_PLACEHOLDER_HASH}`,
    `package=${EXPECTED_PACKAGE_SHA256}`,
    "gis=false",
    "owner_settings_freeze=false",
    "public_distribution=false",
    "freeze_granted=false",
    "unique_pack_approved=true",
    "placeholders_are_unique_evidence=false",
    `sources=${sources}`,
  ].join("\n") + "\n";
}

export function readAyalonFreezeInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("src", "game", "ayalon-freeze", "freeze.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-freeze", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-036-AYALON-FREEZE-CONTRACT.md"), "utf8"),
    ownerSource: readFileSync(fromRoot("AYALON-OWNER-APPROVAL.json"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    hashalomIndexSource: readFileSync(fromRoot("golden-baseline", "hashalom-photo.json"), "utf8"),
    pixelGoldenSource: readFileSync(fromRoot("scripts", "pixel-golden.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-freeze.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonFreeze(overrides = {}) {
  const input = { ...readAyalonFreezeInputs(), ...overrides };
  const errors = [];
  let manifest, lock, owner, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    owner = JSON.parse(input.ownerSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-036 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("ayalon-freeze manifest differs from the reviewed RSH-036 authority");
  const identities = {
    freeze_source_sha256: [input.freezeSource, EXPECTED_FREEZE_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    owner_approval_sha256: [input.ownerSource, EXPECTED_OWNER_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    hashalom_index_sha256: [input.hashalomIndexSource, EXPECTED_HASHALOM_INDEX_SHA256],
    pixel_golden_sha256: [input.pixelGoldenSource, EXPECTED_PIXEL_GOLDEN_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalFreezeDigest()) !== EXPECTED_FREEZE_DIGEST_SHA256 || manifest.identities?.freeze_digest_sha256 !== EXPECTED_FREEZE_DIGEST_SHA256) errors.push("freeze digest identity changed");
  if (manifest.unit !== "RSH-036") errors.push("RSH-036 unit identity changed");
  if (manifest.lock?.track_id !== "ayalon") errors.push("freeze track id changed");
  if (manifest.lock?.source_count !== 41) errors.push("transitive source count changed");
  if (manifest.lock?.freeze_granted !== false) errors.push("premature Ayalon freeze grant");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_settings_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-036 must not claim GIS accuracy, owner-settings freeze or public distribution");
  if (owner.freeze_granted !== false || owner.unique_pack_approved !== true) errors.push("historical owner-approval record was rewritten");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-036");
  if (!/export const AYALON_FREEZE_GRANTED = false/.test(input.freezeSource)) errors.push("pending freeze token missing");
  if (!/from "\.\/freeze"/.test(input.indexSource)) errors.push("ayalon-freeze index no longer re-exports freeze");
  if (manifest.coverage?.status !== "partial" || manifest.coverage?.complete_dependency_closure !== false || manifest.acceptance?.state !== "blocked") errors.push("partial dependency coverage or blocked acceptance was hidden");
  const files = manifest.lock?.transitive_sources ?? {};
  if (Object.keys(files).length !== 41) errors.push("transitive source inventory changed");
  for (const [rel, expected] of Object.entries(files)) {
    if (sha256File(fromRoot(...rel.split("/"))) !== expected) errors.push(`transitive hash drift: ${rel}`);
  }
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-036 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-037 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-037" || manifest.deferred_boundary?.rsh_037_authorized !== false || manifest.deferred_boundary?.rsh_037_started !== false) errors.push("RSH-037 deferred boundary changed");
  return { errors, frozen: manifest.lock?.freeze_granted === true, sourceCount: Object.keys(files).length };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateAyalonFreeze();
  if (result.errors.length) {
    console.error(`ayalon-freeze fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-freeze candidate integrity ok: frozen ${result.frozen}; ${result.sourceCount} partially inventoried sources; RSH-037 deferred`);
}
