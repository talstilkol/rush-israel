import type * as THREE from "three";
import type { BuiltTrack } from "../spline";
import type { Collider, Ramp, TrackDef } from "../types";

export type Disposable = { dispose: () => void };
export type Glow = { light: THREE.PointLight; on: number };
export type Emit = { mat: THREE.MeshStandardMaterial; night: number; day: number };
export type Mover = {
  pts: { x: number; y: number; z: number; yaw: number }[];
  speed: number;
  phase: number;
  mesh: THREE.Object3D;
};

export type TrackWorldBuilderInput = {
  group: THREE.Group;
  def: TrackDef;
  bag: Disposable[];
  shadows: boolean;
  isNight: boolean;
  glows: Glow[];
  emitList: Emit[];
  colliders: Collider[];
  movers: Mover[];
  ramps: Ramp[];
  streets: unknown[];
  built: BuiltTrack;
  support: {
    _dummy: THREE.Object3D;
    barkTexture: () => THREE.Texture;
    curtainTexture: (kind?: string) => THREE.Texture;
    foliageTexture: () => THREE.Texture;
    herodianTexture: () => THREE.Texture;
    samp: (built: BuiltTrack, index: number) => BuiltTrack["samples"][number];
    segsOf: (built: BuiltTrack) => number;
  };
};
