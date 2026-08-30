import type * as THREE from "three";
import type { CSM } from "three/examples/jsm/csm/CSM.js";
import type { CarVisual } from "../car-mesh";
import type { TrackDef, Weather } from "../types";
import type { ArcadeCar } from "../vehicle";
import type { World } from "../world";

type AdapterOpaque = any;
type AdapterCallArgs = any[];

// RSH-017 keeps RaceEngine state private in engine.ts.
// Adapters receive the concrete instance through Function.call; this structural
// host types only the collections used by callbacks and owns no runtime state.
export type EngineAdapterHost = {
  [key: string]: AdapterOpaque;
  blockGroup: THREE.Object3D | null;
  csm: CSM | null;
  cops: ArcadeCar[];
  racers: ArcadeCar[];
  scene: THREE.Scene;
  trackDef: TrackDef;
  traffic: ArcadeCar[];
  visuals: CarVisual[];
  weather: Weather;
  world: World;
};

declare module "./loop-adapter" {
  export function onContextLost(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function onContextRestored(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function shouldPresent(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function onResize(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function frame(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
}

declare module "./rendering-adapter" {
  export function upgradeGraphics(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function enterPhoto(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function exitPhoto(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function frameWorld(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function isPhoto(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function capturePhoto(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function flushSnap(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function cyclePhotoFilter(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function togglePhotoHud(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function setAutoCycle(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function getAutoCycle(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function setNight(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function applyLook(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function applyClockSky(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function captureSceneEnv(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function applyAltitudeLook(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function updateProbe(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function applyGfxStep(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function stepPhoto(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function present(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function snapCamera(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function setFovExtra(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function pushHud(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function setEnvRT(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function bindCsm(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function csmWanted(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function trimCsm(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function updateCsm(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
}

declare module "./physics-adapter" {
  export function fixed(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function stepDriftCraft(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function standings(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function stepHeat(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function pushCopsBack(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function ensureCops(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function addCop(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function spawnRoadblock(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function tickRoadblock(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function navAngle(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function stampPois(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function clearRoadblock(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function checkKnockout(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function closeSector(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function endRace(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function emitFinish(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function skipReplay(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function recordSnap(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function recordReplay(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function takePack(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function applyPack(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function stepRewind(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function stepReplay(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
}

declare module "./qa-adapter" {
  export function qaHookAllowed(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
  export function exposeControls(this: AdapterOpaque, ...args: AdapterCallArgs): AdapterOpaque;
}
