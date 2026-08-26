import * as THREE from "three";

const kits = new Map<string, THREE.Texture>();

export function getSign(kind: string) {
  return kits.get(kind);
}

export async function loadSigns() {
  if (kits.size) return;
  const L = new THREE.TextureLoader();
  await Promise.all(
    (["stop", "yield", "none", "speed50", "speed80", "speed90"] as const).map(async (k) => {
      const t = await L.loadAsync(`/game/sign-${k}.png`);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      kits.set(k, t);
    }),
  );
}
