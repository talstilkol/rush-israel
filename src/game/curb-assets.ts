import * as THREE from "three";

const kits = new Map<string, THREE.Texture>();

export function getCurb(kind: string) {
  return kits.get(kind) ?? kits.get("city");
}

export async function loadCurbs() {
  if (kits.size) return;
  const L = new THREE.TextureLoader();
  await Promise.all(
    (["city", "stone", "dirt", "sand"] as const).map(async (k) => {
      const t = await L.loadAsync(`/game/curb-${k}.png`);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.repeat.set(1, 1);
      t.needsUpdate = true;
      kits.set(k, t);
    }),
  );
}
