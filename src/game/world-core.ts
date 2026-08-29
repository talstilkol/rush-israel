import type * as THREE from "three";
import type { Sky } from "three/examples/jsm/objects/Sky.js";
import type { Collider, Ramp, Weather } from "./types";

export type World = {
  group: THREE.Group;
  sun: THREE.Vector3;
  sky: Sky;
  dir: THREE.DirectionalLight;
  dirNear: THREE.DirectionalLight;
  waterMesh?: THREE.Mesh;
  night: boolean;
  colliders: Collider[];
  streets: any[];
  ramps: Ramp[];
  followShadows: (x: number, y: number, z: number) => void;
  followMirror: (x: number, y: number, z: number, yaw: number) => void;
  setPlanar: (on: boolean) => void;
  sunDir: THREE.Vector3;
  tick: (now: number, x: number, z: number) => void;
  setTime: (night: boolean) => any;
  setClock: (clock: number) => any;
  clock: number;
  setWeather: (w: any) => any;
  setLod?: (tier: "low" | "mid" | "high") => void;
  weather: Weather;
  dispose: () => void;
};

export type WorldCoreAssembly = {
  group: World["group"];
  sun: World["sun"];
  sky: World["sky"];
  dir: World["dir"];
  dirNear: World["dirNear"];
  waterMesh: World["waterMesh"];
  colliders: World["colliders"];
  streets: World["streets"];
  ramps: World["ramps"];
  getNight: () => World["night"];
  getWeather: () => World["weather"];
  followShadows: World["followShadows"];
  followMirror: World["followMirror"];
  setPlanar: World["setPlanar"];
  sunDir: World["sunDir"];
  tick: World["tick"];
  setTime: World["setTime"];
  setClock: World["setClock"];
  getClock: () => World["clock"];
  setWeather: World["setWeather"];
  setLod: World["setLod"];
  dispose: World["dispose"];
};

/**
 * Assemble the stable, track-agnostic world API around implementations owned by
 * the concrete world composition root. This function creates no scene, physics,
 * storage or QA resources and preserves the accepted public key order.
 */
export function assembleWorld(parts: WorldCoreAssembly): World {
  const {
    group,
    sun,
    sky,
    dir,
    dirNear,
    waterMesh,
    colliders,
    streets,
    ramps,
    getNight,
    getWeather,
    followShadows,
    followMirror,
    setPlanar,
    sunDir,
    tick,
    setTime,
    setClock,
    getClock,
    setWeather,
    setLod,
    dispose,
  } = parts;

  return {
    group,
    sun,
    sky,
    dir,
    dirNear,
    waterMesh,
    colliders,
    streets,
    ramps,
    get night() {
      return getNight();
    },
    get weather() {
      return getWeather();
    },
    followShadows,
    followMirror,
    setPlanar,
    sunDir,
    tick,
    setTime,
    setClock,
    get clock() {
      return getClock();
    },
    setWeather,
    setLod,
    dispose,
  };
}
