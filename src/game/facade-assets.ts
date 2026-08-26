import * as THREE from "three";

const kits = new Map<string, THREE.Texture>();

export function getCurtain(kind: string) {
  return kits.get(kind) ?? kits.get("blue");
}

export async function loadCurtains() {
  if (kits.size) return;
  const L = new THREE.TextureLoader();
  await Promise.all(
    (["blue", "teal", "dark", "gold", "white"] as const).map(async (k) => {
      const t = await L.loadAsync(`/game/curtain-${k}.png`);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.colorSpace = THREE.SRGBColorSpace;
      t.repeat.set(2, 8);
      t.needsUpdate = true;
      kits.set(k, t);
    }),
  );
}
