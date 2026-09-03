#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "766d23822a672210317b0c129a9545741cc408d01af1a8ceef681d7758c888cb";
export const EXPECTED_PACK_SHA256 = "ce1b6f6c3cb5db8e3695864e5a54df2be480caa8ff852aadc8fb4fd693f920ed";
export const EXPECTED_INDEX_SHA256 = "8326432974994dddd7c3b4015693f1833bd02c7a0a6ebf5c947fd92d8b5efb3e";
export const EXPECTED_OWNER_SHA256 = "c735f363cbbeb3c30c5e7b44d5cf6bf1b3256e32548f434f46215560de6d7f84";
export const EXPECTED_CONTRACT_SHA256 = "0328becc41d5ed9568778a8630ffd06dbea46ee11ce0d7301906616336c64c3d";
export const EXPECTED_CHECKER_TEST_SHA256 = "30fc5360e39b53fea02fd116fa08e8a64d938701d89bb93dfbe67b510179a57e";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_HASHALOM_INDEX_SHA256 = "5f63d02f48f85d47916917c5dd6eb29c1c6b559bce6359e1e4f985cad339dc10";
export const EXPECTED_PIXEL_GOLDEN_SHA256 = "a8d05fcda8af97d67689f866a03dda052afb5b09c1181797875ccf7ce67fc621";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_GOLDEN_DIGEST_SHA256 = "d1a09a9b9d4542b4ffd7d6feefcfd21e71a0a9903d12a1002dd728d3432f7a74";
export const DUPLICATE_PLACEHOLDER_HASH = "38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094";
export const PIXEL_FRAMES = ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"];
export const PLACEHOLDERS = ["hashalom-g04.png", "hashalom-g05.png", "hashalom-g06.png", "hashalom-ramp.png"];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sha256File(path) {
  return sha256(readFileSync(path));
}

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
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
      .sort();
  } catch {
    return walk(fromRoot());
  }
}

export function canonicalGoldenDigest() {
  return [
    "track=ayalon",
    "lock_generation=11",
    "lock_hash=0c34b9d1f9ded36eaa8400c7aaba48a4f725033bfe25412a4648c36c73910d48",
    "pixel_threshold=0.12",
    "pixel_fail_percent=8",
    "pixel_frames=ayalon-day-g01.png,ayalon-day-g05.png,ayalon-day-g07.png,ayalon-night-g08.png",
    "unique_count=20",
    "unique_frames=ayalon-chase.png,ayalon-day-g01.png,ayalon-day-g05.png,ayalon-day-g07.png,ayalon-night-chase.png,ayalon-night-g08.png,hashalom-azrieli.png,hashalom-citygate.png,hashalom-electra.png,hashalom-galuyot.png,hashalom-hagana.png,hashalom-hakirya.png,hashalom-midtown.png,hashalom-platinum.png,hashalom-sarona.png,hashalom-savidor.png,hashalom-shalommeir.png,hashalom-tau.png,hashalom-toha.png,hashalom-university.png",
    "placeholders=hashalom-g04.png,hashalom-g05.png,hashalom-g06.png,hashalom-ramp.png",
    `placeholder_hash=${DUPLICATE_PLACEHOLDER_HASH}`,
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
    "unique_pack_approved=true",
    "placeholders_are_unique_evidence=false",
    "freeze_granted=false",
  ].join("\n") + "\n";
}

export function readAyalonGoldenInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-GOLDEN-MANIFEST.json"), "utf8"),
    packSource: readFileSync(fromRoot("src", "game", "ayalon-golden", "pack.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-golden", "index.ts"), "utf8"),
    ownerSource: readFileSync(fromRoot("AYALON-OWNER-APPROVAL.json"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-035-AYALON-GOLDEN-CONTRACT.md"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    hashalomIndexSource: readFileSync(fromRoot("golden-baseline", "hashalom-photo.json"), "utf8"),
    pixelGoldenSource: readFileSync(fromRoot("scripts", "pixel-golden.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-golden.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonGolden(overrides = {}) {
  const input = { ...readAyalonGoldenInputs(), ...overrides };
  const errors = [];
  let manifest, lock, hashalom, owner, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    hashalom = JSON.parse(input.hashalomIndexSource);
    owner = JSON.parse(input.ownerSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-035 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) {
    errors.push("ayalon-golden manifest differs from the reviewed RSH-035 authority");
  }

  const identities = {
    pack_source_sha256: [input.packSource, EXPECTED_PACK_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    owner_approval_sha256: [input.ownerSource, EXPECTED_OWNER_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    hashalom_index_sha256: [input.hashalomIndexSource, EXPECTED_HASHALOM_INDEX_SHA256],
    pixel_golden_sha256: [input.pixelGoldenSource, EXPECTED_PIXEL_GOLDEN_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (sha256(canonicalGoldenDigest()) !== EXPECTED_GOLDEN_DIGEST_SHA256 || manifest.identities?.golden_digest_sha256 !== EXPECTED_GOLDEN_DIGEST_SHA256) {
    errors.push("golden digest identity changed");
  }

  if (manifest.unit !== "RSH-035") errors.push("RSH-035 unit identity changed");
  if (manifest.lock?.track_id !== "ayalon") errors.push("golden pack track id changed");
  if (manifest.lock?.unique_count !== 20) errors.push("unique authority frame count changed");
  if (manifest.lock?.placeholder_count !== 4) errors.push("placeholder count changed");
  if (manifest.lock?.pixel_threshold !== 0.12 || manifest.lock?.pixel_fail_percent !== 8) errors.push("pixel-golden gate changed");
  if (manifest.lock?.ayalon_lock_generation !== 11) errors.push("ayalon.lock generation changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) {
    errors.push("RSH-035 must not claim GIS accuracy, owner freeze or public distribution");
  }
  if (manifest.lock?.unique_pack_approved !== true) errors.push("unique pack is not owner-approved");
  if (manifest.lock?.placeholders_are_unique_evidence !== false) errors.push("placeholders must not be unique evidence");
  if (manifest.lock?.freeze_granted !== false) errors.push("Ayalon freeze is reserved for RSH-036");

  if (owner.unique_pack_approved !== true || owner.placeholders_are_unique_evidence !== false || owner.freeze_granted !== false) {
    errors.push("owner approval record lost unique-pack authority");
  }
  if (owner.gis_claim !== false || owner.public_distribution !== false) errors.push("owner approval claimed GIS or public distribution");
  if (owner.instruction !== "המשך" || owner.authorized_unit !== "RSH-035") errors.push("owner instruction identity changed");

  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-035");
  if (lock.hash !== "0c34b9d1f9ded36eaa8400c7aaba48a4f725033bfe25412a4648c36c73910d48") errors.push("ayalon.lock hash changed");
  if (!Array.isArray(hashalom.shots) || hashalom.shots.length !== 18) errors.push("HaShalom shot inventory changed");

  if (!/export const AYALON_LOCK_GENERATION = 11/.test(input.packSource)) errors.push("lock generation token missing from pack module");
  if (!/export const AYALON_GOLDEN_OWNER_FREEZE = false/.test(input.packSource)) errors.push("owner freeze token missing from pack module");
  if (!/unique_pack_approved: true/.test(input.packSource)) errors.push("owner approval token missing from pack module");
  if (!/from "\.\/pack"/.test(input.indexSource)) errors.push("ayalon-golden index no longer re-exports pack");

  const files = manifest.lock?.unique_files ?? {};
  if (Object.keys(files).length !== 20) errors.push("unique authority inventory changed");
  for (const name of Object.keys(files)) {
    const actual = sha256File(fromRoot("golden-baseline", name));
    if (actual !== files[name]) errors.push(`unique golden hash drift: ${name}`);
  }
  for (const name of PIXEL_FRAMES) {
    if (!files[name]) errors.push(`pixel-golden frame missing from unique pack: ${name}`);
  }
  for (const name of PLACEHOLDERS) {
    const actual = sha256File(fromRoot("golden-baseline", name));
    if (actual !== DUPLICATE_PLACEHOLDER_HASH) errors.push(`placeholder ${name} is no longer the recorded duplicate hash`);
    if (files[name]) errors.push(`placeholder ${name} was promoted to unique authority`);
  }

  for (const token of [
    'const files = ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"]',
    "threshold 0.12",
    "fail >8%",
  ]) if (!input.pixelGoldenSource.includes(token)) errors.push(`pixel-golden lost required token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) {
    errors.push("asset/distribution/release boundary changed");
  }
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0 || manifest.preservation?.track_source_changes !== 0) {
    errors.push("RSH-035 preservation counts changed");
  }

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-036 was precreated: ${later.join(", ")}`);
  if (
    manifest.deferred_boundary?.queue_head !== "RSH-036"
    || manifest.deferred_boundary?.rsh_036_authorized !== false
    || manifest.deferred_boundary?.rsh_036_started !== false
  ) {
    errors.push("RSH-036 deferred boundary changed");
  }

  return {
    errors,
    uniqueCount: Object.keys(files).length,
    placeholderCount: PLACEHOLDERS.length,
    approved: manifest.lock?.unique_pack_approved === true,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAyalonGolden();
  if (result.errors.length) {
    console.error(`ayalon-golden fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-golden ok: ${result.uniqueCount} unique frames; ${result.placeholderCount} placeholders; approved ${result.approved}; RSH-036 deferred`);
}
