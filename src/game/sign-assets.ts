import * as THREE from "three";

const kits = new Map<string, THREE.Texture>();
const GANTRY = [
  "gantry-kibbutz-galuyot",
  "gantry-hahagana",
  "gantry-laguardia",
  "gantry-hashalom",
  "gantry-savidor-center",
  "gantry-university",
  "stn-galuyot",
  "stn-hagana",
  "stn-shalom",
  "stn-savidor",
  "stn-uni",
  "dest-rail",
] as const;

export function getSign(kind: string) {
  return kits.get(kind);
}

export function getGantry(id: string) {
  return kits.get(id);
}

export async function loadSigns() {
  if (kits.size) return;
  const L = new THREE.TextureLoader();
  const names = ["stop", "yield", "none", "speed50", "speed80", "speed90"] as const;
  await Promise.all([
    ...names.map(async (k) => {
      const t = await L.loadAsync(`/game/sign-${k}.png`);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      kits.set(k, t);
    }),
    ...GANTRY.map(async (k) => {
      const t = await L.loadAsync(`/game/${k}.png`);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      kits.set(k, t);
    }),
  ]);
}
