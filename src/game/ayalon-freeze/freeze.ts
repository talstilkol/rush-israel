/** Partial Ayalon candidate inventory. Acceptance and complete dependency coverage remain blocked. */

export const AYALON_FREEZE_GIS_CLAIM = false;
export const AYALON_FREEZE_OWNER_SETTINGS = false;
export const AYALON_FREEZE_PUBLIC_DISTRIBUTION = false;
export const AYALON_FREEZE_GRANTED = false;

export const AYALON_LOCK_GENERATION = 11;
export const AYALON_LOCK_HASH = "0c34b9d1f9ded36eaa8400c7aaba48a4f725033bfe25412a4648c36c73910d48";
export const GOLDEN_DIGEST_SHA256 = "d1a09a9b9d4542b4ffd7d6feefcfd21e71a0a9903d12a1002dd728d3432f7a74";
export const DUPLICATE_PLACEHOLDER_HASH = "38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094";
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export const TRANSITIVE_SOURCE_SHA256 = {
  "golden-baseline/ayalon.lock": "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b",
  "golden-baseline/hashalom-photo.json": "5f63d02f48f85d47916917c5dd6eb29c1c6b559bce6359e1e4f985cad339dc10",
  "scripts/pixel-golden.mjs": "a8d05fcda8af97d67689f866a03dda052afb5b09c1181797875ccf7ce67fc621",
  "scripts/ayalon-hash.mjs": "961470f70d518c6db9a2cbc81c4c2d08217f64e70fc24a34921692ee5d9425ca",
  "src/game/tracks/ayalon.ts": "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d",
  "src/game/world-builders/tracks/ayalon.ts": "866afe889a98457a868d1f9e61ca8cb3a803b821bd089ff9d4ab13dae8da2c3c",
  "src/game/world.ts": "b750d1ffc51a34a5b5d557e821577f6c679cef903c3b682514b03d52078b3fdc",
  "src/game/ayalon-lock/geometry.ts": "b5be3e5838fb99449fb7d5a5684177e8626a7a283c54275461fd45faf42a94f7",
  "src/game/ayalon-lock/index.ts": "878d7834dfac9c7756b0929eea515f03ff23b2f8500a63fd49f1fb369c4e3ae6",
  "src/game/ayalon-colliders/colliders.ts": "da611c2867879fa55f6b3db84c76f93725a8b786e0b7dea94079fe6f5ae6708f",
  "src/game/ayalon-colliders/index.ts": "0da73a7edfc99d806ae884f482175b88644f66cd58709362b9235c7e9de80daa",
  "src/game/ayalon-landmarks/landmarks.ts": "d830e1440e6daaf302cca68409208dc2db440f8712dbfae8a32b722b9009209e",
  "src/game/ayalon-landmarks/index.ts": "d51244ebc8e3b0793a9b17796ea7db044eab4432d6d9e0a54d7c19b21515e86b",
  "src/game/ayalon-asphalt/asphalt.ts": "56917840c78578561c37c41e78c3d57eccb4f3338d27758d525e0861b6b95dd0",
  "src/game/ayalon-asphalt/index.ts": "ceea2c0c9e6274d42e1e0233a38d4147194510c9118d71f7737d616b249fc17b",
  "src/game/ayalon-light/daylight.ts": "362f8c59468b353d7e20accc58d7527baea800bed48e3968061af07780ef0a27",
  "src/game/ayalon-light/index.ts": "97d09b015750529f809b751e0026e7ba9d9e912466803b7ac70a0f6bb18db461",
  "src/game/ayalon-night/night.ts": "9538e17393b21728628fb2d55b2ea697a02f425d17cec8804380d3d8cf335914",
  "src/game/ayalon-night/index.ts": "27a9aec7e8fa3259fcbc44ae876712206510e651830ba35bb9738665d78728c8",
  "src/game/ayalon-feel/feel.ts": "fea9f1a017261cb0c0649ed8c472825954bb236224e741a00ac51b71255abc1e",
  "src/game/ayalon-feel/index.ts": "06a2113bb5a45027ab22f9a5563a217d477f0b3f0176a458786d7373cd536ba6",
  "src/game/ayalon-golden/pack.ts": "ce1b6f6c3cb5db8e3695864e5a54df2be480caa8ff852aadc8fb4fd693f920ed",
  "src/game/ayalon-golden/index.ts": "8326432974994dddd7c3b4015693f1833bd02c7a0a6ebf5c947fd92d8b5efb3e",
  "src/game/physics-lock/physics.ts": "477c9c75d707945f4c9c7463675db9099a419b7ca21911fff065d8cf287a98d0",
  "src/game/physics-lock/index.ts": "e9489dbe34cee8d9768fa75fbe5ea0ce5276f686fdfcdad1c2a95e908988504e",
  "src/game/hero-car/hero.ts": "cdfc64228cfcef3d89f76134541ef9e05b3a68cbcfd3df0c5838588eee05adb7",
  "src/game/hero-car/index.ts": "105fd7c5d68162fe7652c8731baa60682276f44338f56495a2839bb8989f6266",
  "src/game/physics.ts": "7b331f697e3e0df41546563f683d18c27c2edf9cebfb1422fb6f3bf9f94c0aff",
  "src/game/cars.ts": "bbdf2b01bc8ae5a9169b2706fd522d34ec3584e17255fc284740c93942236542",
  "src/game/audio.ts": "bf83db8b5e0929dcd7d057172db6dedbaff1cad84405f152a3ef6ca884a3b650",
  "src/game/input.ts": "51d638c0a004d080d2b558d34a58e4631e74606129d557eb1ffc835218c124aa",
  "src/game/input-curve.ts": "01abad60b246cc76a389291685f65d1bb0039767af328434169743947aa2f04c",
  "src/components/game-app/hud.tsx": "041a55c04f8ebd559fdf37b47ac3b84c2813ff8f0938e4b1370d7e823863ebbe",
  "src/components/touch-controls.tsx": "3f89972a7cf2aa62a81d0bc82aec098a91b41eae5a9d25dd74038c14577868b8",
  "package.json": "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94",
  "AYALON-OWNER-APPROVAL.json": "c735f363cbbeb3c30c5e7b44d5cf6bf1b3256e32548f434f46215560de6d7f84",
  "src/game/engine.ts": "598676caf41bb8ede1c6a5625719f2dcabaae327f95dcb258c8b8c02d44d995d",
  "src/game/records.ts": "10bff6426c0ce8d9b406bac66662363ec997883fbff28941dab3f95e1f818aa0",
  "src/components/game-app/race-controller.tsx": "02bf8279185a618488fe730567dd2b742d35c53abffd23864efb6fbb40c54819",
  "src/game/race-startup.ts": "cda8d6d3e3af7d385196e1e0d6702a70b6749be76aae8f4fffc1399ef7075dba",
  "src/game/minimap-route.ts": "35810413542c7b57ac5b7cabc0ede8fec5cf19ceff8a3ca2e109ce6b7ab0031d",
} as const;

export const FREEZE_APPROVAL = {
  unit: "RSH-036",
  instruction: "המשך",
  freeze_granted: false,
  unique_pack_approved: true,
  placeholders_are_unique_evidence: false,
  gis_claim: false,
  owner_settings_freeze: false,
  public_distribution: false,
  approved_by: null,
  status: "candidate_acceptance_blocked",
  complete_dependency_closure: false,
} as const;

export function canonicalFreezeDigest() {
  const sources = Object.entries(TRANSITIVE_SOURCE_SHA256)
    .map(([path, hash]) => `${path}=${hash}`)
    .join(",");
  return [
    "track=ayalon",
    `lock_generation=${AYALON_LOCK_GENERATION}`,
    `lock_hash=${AYALON_LOCK_HASH}`,
    `golden_digest=${GOLDEN_DIGEST_SHA256}`,
    `placeholder_hash=${DUPLICATE_PLACEHOLDER_HASH}`,
    `package=${PACKAGE_SOURCE_SHA256}`,
    "gis=false",
    "owner_settings_freeze=false",
    "public_distribution=false",
    "freeze_granted=false",
    "unique_pack_approved=true",
    "placeholders_are_unique_evidence=false",
    `sources=${sources}`,
  ].join("\n") + "\n";
}
