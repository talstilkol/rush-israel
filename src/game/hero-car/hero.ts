/** Canonical Version 1 hero car, LOD table and silhouette gate (RSH-030). */

export const HERO_CAR_COUNT = 5;
export const HERO_FICTIONAL = true;
export const HERO_SCANNED = false;
export const HERO_LICENSED_REAL_MODELS = false;
export const HERO_GLTF_PRESENT = false;
export const HERO_GIS_CLAIM = false;
export const HERO_OWNER_FREEZE = false;

export const HERO_BODY_KINDS = ["gt", "hatch", "muscle", "rally", "super"] as const;
export type HeroBodyKind = (typeof HERO_BODY_KINDS)[number];

export const HERO_CARS = [
  { id: "sabra", body: "gt", nameHe: "צבר", nameEn: "Sabra", color: 0xf2eee8, accent: 0x1a3a6a, maxSpeed: 53, accel: 6.2, brake: 9.2, turnRate: 1.85, grip: 0.9, drag: 0.55, mass: 1.12, zeroTo100: 8.4 },
  { id: "carmel", body: "hatch", nameHe: "כרמל T", nameEn: "Carmel T", color: 0xc42c24, accent: 0x1a1010, maxSpeed: 64, accel: 6.8, brake: 10.4, turnRate: 2.12, grip: 0.92, drag: 0.58, mass: 0.96, zeroTo100: 6.6 },
  { id: "kfir", body: "muscle", nameHe: "כפיר V8", nameEn: "Kfir V8", color: 0x1a2a48, accent: 0xc8a24a, maxSpeed: 72, accel: 8.2, brake: 9.6, turnRate: 1.68, grip: 0.84, drag: 0.46, mass: 1.34, zeroTo100: 4.9 },
  { id: "negev", body: "rally", nameHe: "נגב", nameEn: "Negev", color: 0xc4a06a, accent: 0x3a2814, maxSpeed: 58, accel: 7.4, brake: 10, turnRate: 1.92, grip: 0.97, drag: 0.5, mass: 1.24, zeroTo100: 5.8 },
  { id: "yam", body: "super", nameHe: "ים סוף", nameEn: "Yam Suf", color: 0x0c1420, accent: 0x6ec8c4, maxSpeed: 86, accel: 10.4, brake: 12.4, turnRate: 1.78, grip: 0.88, drag: 0.4, mass: 0.94, zeroTo100: 3.5 },
] as const;

export const HERO_BODY_MESH = "body";
export const HERO_WHEEL_NAMES = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"] as const;
export const HERO_GLASS_NAME = "glass";
export const HERO_ASSET_PREFIX = "/game/car-";

export const HERO_LOD0_MAX_TRIANGLES = 40000;
export const HERO_LOD1_MAX_TRIANGLES = 12000;
export const HERO_LOD2_MAX_TRIANGLES = 4000;
export const HERO_LOD0_DISTANCE = 40;
export const HERO_LOD1_DISTANCE = 90;
export const HERO_PLAYER_ALWAYS_LOD0 = true;

export const HERO_LIVE_BODY_TRIANGLES = {
  gt: 276,
  hatch: 256,
  muscle: 276,
  rally: 256,
  super: 256,
} as const;

export const HERO_SILHOUETTE_WIDTH = 64;
export const HERO_SILHOUETTE_HEIGHT = 24;
export const HERO_SILHOUETTE_SHA256 = {
  gt: "c148de9a9b8abbe0f7a91ba9d7a644e86b33191063723d42635de4b647ea241e",
  hatch: "231d53cea0e3d6e41bb265041ba8fd543674b8142bb91f8155e7577c29d19700",
  muscle: "3dd91e6fa52a63e7c3e63b6698108e39f20344a8b9c8fbedf3a168250594efbe",
  rally: "eff39d6a7239bab5ed38c69876ee25192e32865d6a40536b91fb1e414b17ad31",
  super: "dd74f8a5911b2bef16c689d556a292b4f297519898dd2f46add84ddc479ef876",
} as const;

export const HERO_PROFILE_SHA256 = {
  gt: "c76757797753592797e68d0400fc0ce3f6592be3daab2ef24a5ce4f7fe73dc3f",
  hatch: "fd72762dcb059f7b1959557602246aa7cb5f3ad97ec55f7667d4740c2e35b51b",
  muscle: "40e66b92154c1fb522f380cff967b6df045a0af3d6c42ebb6148762a7529789d",
  rally: "a8365483a278d2ed4ce35a1e92dfb8ea3354aabb2a9119cfc74907e0c42fd231",
  super: "fa8a371c34c9ef17e1a6f12038e5c0aeec8ae6f5794442b9e73504f8454fc526",
} as const;

export function selectHeroLod(distance: number, isPlayer: boolean): 0 | 1 | 2 {
  if (isPlayer || HERO_PLAYER_ALWAYS_LOD0) return 0;
  if (distance < HERO_LOD0_DISTANCE) return 0;
  if (distance < HERO_LOD1_DISTANCE) return 1;
  return 2;
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
