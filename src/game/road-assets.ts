import * as THREE from "three";

export type RoadKit = {
  map: THREE.Texture;
  roughnessMap: THREE.Texture;
  bumpMap: THREE.Texture;
};

let ayalon: RoadKit | undefined;

export function getAyalonRoad(): RoadKit | undefined {
  return ayalon;
}

function prep(tex: THREE.Texture, srgb: boolean) {
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = srgb ? 16 : 8;
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Ayalon 8-lane PNG. Still a baked procedural, not photogrammetry. */
export async function loadAyalonRoad() {
  if (ayalon) return ayalon;
  const L = new THREE.TextureLoader();
  const [map, roughnessMap, bumpMap] = await Promise.all([
    L.loadAsync("/game/asphalt-8.png"),
    L.loadAsync("/game/asphalt-8-rough.png"),
    L.loadAsync("/game/asphalt-8-bump.png"),
  ]);
  ayalon = {
    map: prep(map, true),
    roughnessMap: prep(roughnessMap, false),
    bumpMap: prep(bumpMap, false),
  };
  return ayalon;
}
