import * as THREE from "three";

let tex: THREE.Texture | undefined;
let fileLoaded = false;

export function getLaneArrow() {
  if (!tex) tex = fallbackArrow();
  return tex;
}

function fallbackArrow() {
  const data = new Uint8Array(16 * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 242;
    data[i + 1] = 238;
    data[i + 2] = 232;
    data[i + 3] = 220;
  }
  const t = new THREE.DataTexture(data, 4, 4);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export async function loadLaneArrow() {
  if (fileLoaded && tex) return tex;
  try {
    const t = await new THREE.TextureLoader().loadAsync("/game/lane-arrow.png");
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    tex = t;
    fileLoaded = true;
    return tex;
  } catch {
    return getLaneArrow();
  }
}
