#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "faee2b9f10f6d3ea8d243a7f44863ea9d18f38fce78fd4a6b43695dbdd02d64a";
export const EXPECTED_HERO_SHA256 = "cdfc64228cfcef3d89f76134541ef9e05b3a68cbcfd3df0c5838588eee05adb7";
export const EXPECTED_INDEX_SHA256 = "105fd7c5d68162fe7652c8731baa60682276f44338f56495a2839bb8989f6266";
export const EXPECTED_CARS_SHA256 = "bbdf2b01bc8ae5a9169b2706fd522d34ec3584e17255fc284740c93942236542";
export const EXPECTED_MESH_SHA256 = "b89ec24ddb76a8ab362b036aa6d97a02484d5f305fbdc8f7b1452eea0e92aca3";
export const EXPECTED_ASSETS_SHA256 = "92ea1de990a318a38e4d4fb363be0ae2d4818fc4fa3711e0a11cf77b6c599a79";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "0ee0ad27aaa093dfb938a364a8adc8cf93cebb36c4b49de177f7491bbade480e";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_HERO_DIGEST_SHA256 = "6fed144c9d66dca56270f7500e574cf1041a3b917a8cd13ffa6a64a68f0806cb";
export const EXPECTED_LOD_DIGEST_SHA256 = "0eab1d598a9b90650aafd23f69063bac407002c942311bdb95eab5beebdb6905";
export const EXPECTED_SIL_DIGEST_SHA256 = "e482429dd9484b16842d0684f79bb2cfeb2b072ee62cba6fd9f3052f94527a0a";
export const EXPECTED_LICENSE_SHA256 = "5e14bd82e1cf2a34832068c6e42a710327ceb1e23f3847478ed6b256c1bbd46a";

export const EXPECTED_GLB = {
  gt: "7183fadd9e20cdb03c078a7cb9661638129517c45d2201f27410325b610f4654",
  hatch: "fc54ab36e0ec3d3928539e19cd77c2c66f097162a9c7a4e297c746d8689b2c5d",
  muscle: "44b3bb1b6a1a07b68ce34e219517f90666a6ab0a76ec2abbe9b88c8212569e0b",
  rally: "4b556bfdf7f89f260b8be6d8e7637ad280576790a8d9200006e25769ffc53281",
  super: "0ad1815803d54a0fa53f7150443569d64803b4ac8590c991cc93546725d0c09b",
};
export const EXPECTED_SILHOUETTE = {
  gt: "c148de9a9b8abbe0f7a91ba9d7a644e86b33191063723d42635de4b647ea241e",
  hatch: "231d53cea0e3d6e41bb265041ba8fd543674b8142bb91f8155e7577c29d19700",
  muscle: "3dd91e6fa52a63e7c3e63b6698108e39f20344a8b9c8fbedf3a168250594efbe",
  rally: "eff39d6a7239bab5ed38c69876ee25192e32865d6a40536b91fb1e414b17ad31",
  super: "dd74f8a5911b2bef16c689d556a292b4f297519898dd2f46add84ddc479ef876",
};

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
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

export function canonicalHeroDigest() {
  return [
    "count=5",
    "ids=sabra,carmel,kfir,negev,yam",
    "bodies=gt,hatch,muscle,rally,super",
    "fictional=true",
    "scanned=false",
    "licensed_real=false",
    "hero_gltf=absent",
    "mesh=body",
    "asset=/game/car-${kind}.glb",
  ].join("\n") + "\n";
}

export function canonicalLodDigest() {
  return [
    "lod0_max=40000",
    "lod1_max=12000",
    "lod2_max=4000",
    "lod0_d=40",
    "lod1_d=90",
    "player_lod0=true",
    "live_tris=gt:276,hatch:256,muscle:276,rally:256,super:256",
  ].join("\n") + "\n";
}

export function canonicalSilhouetteDigest() {
  return [
    "gate=64x24",
    "distinct=5",
    "gt=c148de9a9b8abbe0f7a91ba9d7a644e86b33191063723d42635de4b647ea241e",
    "hatch=231d53cea0e3d6e41bb265041ba8fd543674b8142bb91f8155e7577c29d19700",
    "muscle=3dd91e6fa52a63e7c3e63b6698108e39f20344a8b9c8fbedf3a168250594efbe",
    "rally=eff39d6a7239bab5ed38c69876ee25192e32865d6a40536b91fb1e414b17ad31",
    "super=dd74f8a5911b2bef16c689d556a292b4f297519898dd2f46add84ddc479ef876",
  ].join("\n") + "\n";
}

const SHAPE_ORDER = ["hatch", "muscle", "rally", "super", "gt"];

export function extractBodyShapes(meshSource) {
  const blocks = [...meshSource.matchAll(/\[\s*((?:\[\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\]\s*,?\s*)+)\]/g)];
  if (blocks.length < 5) return null;
  const shapes = {};
  for (let i = 0; i < 5; i++) {
    const pts = [...blocks[i][1].matchAll(/\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/g)].map((m) => [Number(m[1]), Number(m[2])]);
    shapes[SHAPE_ORDER[i]] = pts;
  }
  return shapes;
}

export function rasterSilhouette(pts, W = 64, H = 24) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of pts) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  const pad = 0.12;
  minX -= pad; maxX += pad; minY -= pad; maxY += pad;
  const bits = [];
  for (let row = 0; row < H; row++) {
    let line = "";
    for (let col = 0; col < W; col++) {
      const x = minX + (col + 0.5) / W * (maxX - minX);
      const y = maxY - (row + 0.5) / H * (maxY - minY);
      let n = 0;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        const hit = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (hit) n++;
      }
      line += n % 2 === 1 ? "1" : "0";
    }
    bits.push(line);
  }
  return sha256(bits.join("\n") + "\n");
}

export function readHeroCarInputs() {
  return {
    manifestSource: readFileSync(fromRoot("HERO-CAR-MANIFEST.json"), "utf8"),
    heroSource: readFileSync(fromRoot("src", "game", "hero-car", "hero.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "hero-car", "index.ts"), "utf8"),
    carsSource: readFileSync(fromRoot("src", "game", "cars.ts"), "utf8"),
    meshSource: readFileSync(fromRoot("src", "game", "car-mesh.ts"), "utf8"),
    assetsSource: readFileSync(fromRoot("src", "game", "car-assets.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-hero-car.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    licenseSource: readFileSync(fromRoot("public", "game", "LICENSES.md"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    glb: {
      gt: readFileSync(fromRoot("public", "game", "car-gt.glb")),
      hatch: readFileSync(fromRoot("public", "game", "car-hatch.glb")),
      muscle: readFileSync(fromRoot("public", "game", "car-muscle.glb")),
      rally: readFileSync(fromRoot("public", "game", "car-rally.glb")),
      super: readFileSync(fromRoot("public", "game", "car-super.glb")),
    },
    repositoryFiles: trackedFiles(),
  };
}

export function validateHeroCar(overrides = {}) {
  const input = { ...readHeroCarInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-030 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("hero-car manifest differs from the reviewed RSH-030 authority");
  const identities = {
    hero_source_sha256: [input.heroSource, EXPECTED_HERO_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    cars_source_sha256: [input.carsSource, EXPECTED_CARS_SHA256],
    mesh_source_sha256: [input.meshSource, EXPECTED_MESH_SHA256],
    assets_source_sha256: [input.assetsSource, EXPECTED_ASSETS_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-030" || manifest.hero?.count !== 5) errors.push("RSH-030 hero identity changed");
  if (manifest.hero?.fictional !== true || manifest.hero?.scanned !== false || manifest.hero?.licensed_real_models !== false) errors.push("Version 1 cars must stay fictional and unscanned");
  if (manifest.hero?.hero_gltf_present !== false) errors.push("user-supplied hero glTF must remain absent");
  if (manifest.hero?.gis_claim !== false || manifest.hero?.owner_freeze !== false) errors.push("RSH-030 must not claim GIS accuracy or owner freeze");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-030");

  const heroDigest = canonicalHeroDigest();
  const lodDigest = canonicalLodDigest();
  const silDigest = canonicalSilhouetteDigest();
  if (sha256(heroDigest) !== EXPECTED_HERO_DIGEST_SHA256 || manifest.hero?.hero_sha256 !== EXPECTED_HERO_DIGEST_SHA256) errors.push("hero identity digest changed");
  if (sha256(lodDigest) !== EXPECTED_LOD_DIGEST_SHA256 || manifest.hero?.lod_sha256 !== EXPECTED_LOD_DIGEST_SHA256) errors.push("LOD digest changed");
  if (sha256(silDigest) !== EXPECTED_SIL_DIGEST_SHA256 || manifest.hero?.silhouette_sha256 !== EXPECTED_SIL_DIGEST_SHA256) errors.push("silhouette digest changed");

  for (const token of [
    'id: "sabra"',
    'id: "carmel"',
    'id: "kfir"',
    'id: "negev"',
    'id: "yam"',
    'body: "gt"',
    'body: "hatch"',
    'body: "muscle"',
    'body: "rally"',
    'body: "super"',
    "zeroTo100: 8.4",
    "zeroTo100: 3.5",
  ]) if (!input.carsSource.includes(token)) errors.push(`cars.ts lost required hero token: ${token}`);

  for (const token of [
    "export function cloneCarBody",
    "o.name === \"body\"",
    'const kinds = ["gt", "hatch", "muscle", "rally", "super"] as const',
    "loader.loadAsync(`/game/car-${k}.glb`)",
  ]) if (!input.assetsSource.includes(token)) errors.push(`car-assets lost required hero token: ${token}`);

  for (const token of [
    "function carShape(kind: CarDef[\"body\"]): THREE.Shape",
    "cloneCarBody(kind, color, shadows)",
    "kind === \"hatch\"",
    "kind === \"muscle\"",
    "kind === \"rally\"",
    "kind === \"super\"",
  ]) if (!input.meshSource.includes(token)) errors.push(`car-mesh lost required hero token: ${token}`);

  for (const token of [
    "export const HERO_CAR_COUNT = 5",
    "export const HERO_SCANNED = false",
    "export const HERO_GLTF_PRESENT = false",
    "export const HERO_LOD0_MAX_TRIANGLES = 40000",
    "export const HERO_PLAYER_ALWAYS_LOD0 = true",
    "export const HERO_GIS_CLAIM = false",
    "export const HERO_OWNER_FREEZE = false",
    "export function selectHeroLod",
  ]) if (!input.heroSource.includes(token)) errors.push(`hero-car lock lost required token: ${token}`);

  if (!input.licenseSource.includes("hero glTF: user-supplied / NOT PRESENT")) errors.push("LICENSES.md lost the absent-hero disclosure");
  if (!input.licenseSource.includes("car-*.glb / car-*.gltf: generated Meshopt extrusion, not a scan")) errors.push("LICENSES.md lost the extrusion disclosure");

  for (const kind of ["gt", "hatch", "muscle", "rally", "super"]) {
    if (sha256(input.glb[kind]) !== EXPECTED_GLB[kind] || manifest.hero?.glb_sha256?.[kind] !== EXPECTED_GLB[kind]) {
      errors.push(`car-${kind}.glb hash changed`);
    }
  }

  const shapes = extractBodyShapes(input.meshSource);
  if (!shapes) errors.push("car-mesh body silhouettes could not be extracted");
  else {
    const hashes = [];
    for (const kind of ["gt", "hatch", "muscle", "rally", "super"]) {
      const digest = rasterSilhouette(shapes[kind]);
      hashes.push(digest);
      if (digest !== EXPECTED_SILHOUETTE[kind]) errors.push(`${kind} silhouette gate failed`);
    }
    if (new Set(hashes).size !== 5) errors.push("silhouette gate requires five distinct body profiles");
  }

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.cars_source_changes !== 0 || manifest.preservation?.mesh_source_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-030 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-035 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-035" || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== false) errors.push("RSH-035 deferred boundary changed");

  return {
    errors,
    carCount: manifest.hero?.count,
    fictional: manifest.hero?.fictional,
    scanned: manifest.hero?.scanned,
    lod0: manifest.hero?.lod0_max_triangles,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateHeroCar();
  if (result.errors.length) {
    console.error(`hero-car fail\\n${result.errors.map((error) => `- ${error}`).join("\\n")}`);
    process.exit(1);
  }
  console.log(`hero-car ok: ${result.carCount} fictional cars; scanned ${result.scanned}; LOD0 cap ${result.lod0}; RSH-035 deferred`);
}
