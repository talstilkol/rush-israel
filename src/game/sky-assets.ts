import * as THREE from "three";

let day: THREE.Texture | undefined;
let night: THREE.Texture | undefined;

export function getSkyDay() {
  return day;
}
export function getSkyNight() {
  return night;
}

function prep(tex: THREE.Texture) {
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Baked gradient skies. Not HDRI. */
export async function loadSky() {
  if (day && night) return;
  const L = new THREE.TextureLoader();
  const [d, n] = await Promise.all([L.loadAsync("/game/sky-day.png"), L.loadAsync("/game/sky-night.png")]);
  day = prep(d);
  night = prep(n);
}
