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
  "scripts/pixel-golden.mjs": "9513d88627615a49764f46d10e913e8787bb925008da4d47e50b13e6efa623f9",
  "scripts/ayalon-hash.mjs": "961470f70d518c6db9a2cbc81c4c2d08217f64e70fc24a34921692ee5d9425ca",
  "src/game/tracks/ayalon.ts": "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d",
  "src/game/world-builders/tracks/ayalon.ts": "f7dab8c8c9686e32f8ee26e8ca2910b266ab6f7f35a87494de5a604659c97c2c",
  "src/game/world.ts": "5fabc7a9c2a8897bf7cbe91e524a6e3cf18dbdaebb47d7b4a0edf279161e25d6",
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
  "src/game/input.ts": "af2cbc260bbf9dd92cdbcbdc9f1f7667560197ec092a6516185dde1c3f5ceb2d",
  "src/game/input-curve.ts": "01abad60b246cc76a389291685f65d1bb0039767af328434169743947aa2f04c",
  "src/components/game-app/hud.tsx": "0ec00e1fc9b143493d6784b13118f28fb877efe2d49edc089e2b6bbed16d2454",
  "src/components/touch-controls.tsx": "11c2a7ed3c598c01f06c4450126a424a9ea00ff44c05d2cf1421092649b68a92",
  "package.json": "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94",
  "AYALON-OWNER-APPROVAL.json": "c735f363cbbeb3c30c5e7b44d5cf6bf1b3256e32548f434f46215560de6d7f84",
  "src/game/engine.ts": "730467eb6988f5f10e08678f5d1d47f56dd74b182b10539b41d379829f4f8c93",
  "src/game/records.ts": "10bff6426c0ce8d9b406bac66662363ec997883fbff28941dab3f95e1f818aa0",
  "src/components/game-app/race-controller.tsx": "02bf8279185a618488fe730567dd2b742d35c53abffd23864efb6fbb40c54819",
  "src/game/race-startup.ts": "cda8d6d3e3af7d385196e1e0d6702a70b6749be76aae8f4fffc1399ef7075dba",
  "src/game/minimap-route.ts": "35810413542c7b57ac5b7cabc0ede8fec5cf19ceff8a3ca2e109ce6b7ab0031d",
  "src/game/road-assets.ts": "a2a613b6b4ebf7796aa402709a852cf47181d660e5af8dbd18f863537db2b8a2",
  "src/rendering/RendererFacade.ts": "512425eda35e2514bfe15a9980ca938a0e31b2843631f7410049c69069870159",
  "src/game/owned-load.ts": "3c8cee655cc312b0ae3f79c2699effe650dc252a184cf7990222d052543a74d9",
  "src/game/water-clock.ts": "fd08dc8beb44d54b2839ad82cb8d6386e7ad76ef4b06e382bd80be005c101472",
  "src/game/world-builders/tracks/rothschild.ts": "0bb60ac11f0834503cb572d06850d3f6460254edc437ed27e4c6c648b00d3ca8",
  "src/game/sky-assets.ts": "621ff97db2cd2127ff53b679833b961d3a6d4dd5265974b011a7c160c71ffae9",
  "src/game/tree-assets.ts": "fa2349e25fd3f3e46d13c8fa61ba5220e3a905e78c24daa821ec2f0f0fc091e0",
  "src/game/flare-assets.ts": "4c29b305572b50cf419b5f656bea3f9e72bc5120fd61e625a451a86f72dcf6ce",
  "src/game/water-assets.ts": "c88645b7563dbdc869cbfd1883cb1c34faa442bbe4f7c3338f7b8f311b2c6318",
  "src/game/curb-assets.ts": "7d6778a2db23528c2f98b835602eb7cc7cd0cf9b1c6af97ea5cd0e1612e055a2",
  "src/game/facade-assets.ts": "16c25666913980a340ab182865236b273a36cb0444b2ae67d97f1c7198fba588",
  "src/game/sign-assets.ts": "b6a27de50bb2386cf10c6347d9497f52d26596cefbd8f6e309cc6b03b070e4df",
  "src/game/car-assets.ts": "28f503fb54db0f7550edb0b275e3071ea2954406774884aea13da92f2446b055",
  "src/game/asset-cache.ts": "de91927bc569d2c59747eb67d01b53c6801da89734f2cc9d7cef8e4b1e92bcea",
  "src/game/unpublished-gltf.ts": "562bd829ab7bef93926428faf74b9bb443f9e708304fa086f2b6e7ec829535ae",
  "src/components/game-app.tsx": "74685f1a46055ff13edcafcdeffaef683e1efecbc2d6f2ef58f6d9db82bef20a",
  "scripts/golden-capture.mjs": "eed90669c31b2d66be86320367923cc75ca494c79d107049c22b72f6dc14d7db",
  "scripts/capture-golden.mjs": "cf8c9b1860b370982cf7695980e082545dce2bcd3c3e3d6d7133789d797c1983",
  "scripts/golden-output.mjs": "0c61721b4f52cebfc5f99039ea2c6194a0cded4c8075144f43425a4f4ae11fd6",
  "scripts/ci-action-pins.mjs": "bc5fbd670f451aef455c0f1b33e627b4e7079941c568d1e142b52d7af928dde7",
  ".github/workflows/required-ci.yml": "a40aa920a89f5dbc9b258b1f1025f9a22f14cb5933c52c92129726342d11d6cf",
  "scripts/rush-head.mjs": "a1f031131c4fdb82a56ddd8a61d3538c5849ef1261ace35a502da0de6369f321",
  "scripts/grok-pwa-plugin.mjs": "86afd273fff692ea3ed059f4457f7e1945e198a03539ba828d0c9ece507fa491",
  "server/middleware/grok-pwa.ts": "184313168a63c66b4b0d809fa55c656b8ca4436775f6c0502bc9e9cfdfaf0e9f",
  "scripts/product-head-boundary.mjs": "c88328d144b77d1ea54aaab62d0e54f616c404d72097f1e6f232057185c5f3fe",
  "scripts/rush-head-browser.mjs": "78326319c8900b33eee1fc05dfce1e3230760507add0119fa631508464e66139",
  "scripts/runtime-recovery-smoke.mjs": "4a4cfca5f0d5eaa06910556a545c37cb15e8f5af02bfdfec8c86fb248f2decf7",
  "scripts/dependency-closure.mjs": "fcd1263a3616b9033842dcca0913c65edfb8f7434d3743aaf6690f52dfa9abc2",
  "scripts/font-evidence.mjs": "f4042513c7c4906b10551070e4c952bf820da6d0c87852d60a3ed5b52b247c35",
  "scripts/font-dependency-browser.mjs": "338a0be488294d3c8811c19d88cb27aad6a7459c11754aae546f69cca23ea673",
  "src/game/roadShader.ts": "057bccd519614b3ee23a536c1c12f6524c1ffaf72b858642e94e42eda70441aa",
  "scripts/road-uniform-browser.mjs": "aed1f57320633920ef28c803faef0c09802fbcd26fbf6c25d85ac7fbf9919c9d",
  "src/game/ramp-surface.ts": "4072158c03c6728f54f7efdd60fa5e43e831decda461975a528c1e01e1f512ed",
  "scripts/ramp-surface-browser.mjs": "665b1dd482d72ae8ba394e597c0d33e6ec9a5846fbd73699b7aa27cf8605930d",
  "src/game/vehicle.ts": "2b7e92295a2b5ed3ce0e8c735ddaee3dedcf6fb4b619040c9d1768bfe12fdd3a",
  "scripts/ramp-smoke.mjs": "8c35bfd9bde53b5b8487f877e8018bfcf3237efd37bd0e317fe457f610da8a2c",
  "scripts/ramp-contact-browser.mjs": "8929ff4e5772db2f8acabb67a3a3e28a0133602016a5cc49771c94a03abdb45e",
  "scripts/drive-smoke.mjs": "15b54f54badfae3f33117df2c5075faea571d68e1e78cb934f46af33f931e761",
  "scripts/drive-steering.mjs": "a466e01a8c94a521b70567a836d1ee37fa54c4eddc85c6181228e90cb7b344b0",
  "scripts/airborne-smoke.mjs": "fa321116c26412d51f89c8d3178d97182f7091a54a92f35375f0c320ae32c636",
  "scripts/airborne-clock.mjs": "fecc996075b4238a926387dc736bdcdd8208af3037623fa55e06aef219bb42fe",
  "scripts/collider-centre-browser.mjs": "7331bdddb064434cff6934ad42437bd1009d4699ff7b3d6057ecca3f496dc3b1",
  "src/game/collider-height.ts": "934747ab5c69127e90af5a457fa349a1a681682ecb692beab075848204359508",
  "scripts/pier-collision-browser.mjs": "256d9ffb20d5e95b8511effce86c7e1ae1f4580fdccc2ada3883c1a03955c8b8"
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
