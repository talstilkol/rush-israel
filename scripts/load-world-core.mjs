import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";

export const LEGACY_WORLD_SHA256 = "db0fd7cada42d3f3479fa6fffca61d3668a6ce3e7977152935480c7dce124056";
export const LEGACY_WORLD_GIT_BLOB_SHA1 = "07b7e0b559e66f89641357db5aa2be8bcd8c3135";
export const LEGACY_WORLD_LINES = 9034;
export const LEGACY_WORLD_BYTES = 353285;
export const LEGACY_WORLD_TYPE = "export type World = {\n  group: THREE.Group;\n  sun: THREE.Vector3;\n  sky: Sky;\n  dir: THREE.DirectionalLight;\n  dirNear: THREE.DirectionalLight;\n  waterMesh?: THREE.Mesh;\n  night: boolean;\n  colliders: Collider[];\n  streets: any[];\n  ramps: Ramp[];\n  followShadows: (x: number, y: number, z: number) => void;\n  followMirror: (x: number, y: number, z: number, yaw: number) => void;\n  setPlanar: (on: boolean) => void;\n  sunDir: THREE.Vector3;\n  tick: (now: number, x: number, z: number) => void;\n  setTime: (night: boolean) => any;\n  setClock: (clock: number) => any;\n  clock: number;\n  setWeather: (w: any) => any;\n  setLod?: (tier: \"low\" | \"mid\" | \"high\") => void;\n  weather: Weather;\n  dispose: () => void;\n};";
export const EXTRACTED_WORLD_TYPE_EDGE = "import { assembleWorld } from \"./world-core\";\nexport type { World } from \"./world-core\";";
export const LEGACY_WORLD_RETURN = "  return {\n    group,\n    sun,\n    sky,\n    dir,\n    dirNear,\n    waterMesh,\n    colliders,\n    streets,\n    ramps,\n    get night() {\n      return isNight;\n    },\n    get weather() {\n      return wx;\n    },\n    followShadows,\n    followMirror,\n    setPlanar(on: boolean) {\n      planarOk = !!on;\n      if (mirror) mirror.visible = planarOk;\n    },\n    sunDir: lightAim,\n    tick,\n    setTime,\n    setClock,\n    get clock() {\n      return clock;\n    },\n    setWeather,\n    setLod,\n    dispose() {\n      for (const d of bag) d.dispose();\n    }\n  };";
export const EXTRACTED_WORLD_RETURN = "  return assembleWorld({\n    group,\n    sun,\n    sky,\n    dir,\n    dirNear,\n    waterMesh,\n    colliders,\n    streets,\n    ramps,\n    getNight: () => isNight,\n    getWeather: () => wx,\n    followShadows,\n    followMirror,\n    setPlanar(on: boolean) {\n      planarOk = !!on;\n      if (mirror) mirror.visible = planarOk;\n    },\n    sunDir: lightAim,\n    tick,\n    setTime,\n    setClock,\n    getClock: () => clock,\n    setWeather,\n    setLod,\n    dispose() {\n      for (const d of bag) d.dispose();\n    },\n  });";

export function sha256(source) {
  return createHash("sha256").update(source).digest("hex");
}

export function gitBlobSha1(source) {
  const body = Buffer.from(source);
  return createHash("sha1").update(`blob ${body.length}\0`).update(body).digest("hex");
}

export function reconstructLegacyWorldSource(source = readFileSync(fromRoot("src", "game", "world.ts"), "utf8")) {
  if (source.split(EXTRACTED_WORLD_TYPE_EDGE).length !== 2) {
    throw new Error("world.ts must contain the extracted world-core import/re-export edge exactly once");
  }
  if (source.split(EXTRACTED_WORLD_RETURN).length !== 2) {
    throw new Error("world.ts must delegate its lifecycle assembly to world-core exactly once");
  }
  return source
    .replace(EXTRACTED_WORLD_TYPE_EDGE, LEGACY_WORLD_TYPE)
    .replace(EXTRACTED_WORLD_RETURN, LEGACY_WORLD_RETURN);
}
