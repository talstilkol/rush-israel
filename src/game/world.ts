import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { mulberry32, lerp, clamp, hash01 } from "./math";
import { nearestIndex } from "./spline";
import type { BuiltTrack } from "./spline";
import type { Collider, Ramp, SkyPreset, TrackDef, Weather } from "./types";
import { acr, afl, ard, asd, ask, bsn, bsv, bym, cae, dsea, eil, gol, hai, hdr, her, hol, hwy1, hwy2, hwy6, hwy40, hwy90, hzl, jer, ksb, ksm, lodp, mas, mod, naz, nah, net, nightAmt, nik, pth, raa, ram, rhv, rml, rsh, skyAt, skyFor, tib, tlv, tzf } from "./tracks";
import { scatterStreetBuildings } from "./buildings";
import { LOOKS, lookFromFlags } from "../rendering/EnvironmentState";
import { generateStreets, nearestStreet } from "./streets";
import { bindRoadCompile } from "./roadShader";
import { getLaneArrow } from "./arrow-assets";
import { getFlare0, getFlare1 } from "./flare-assets";
import { getWaterNormal, getChecker } from "./water-assets";
import { getSign, getGantry } from "./sign-assets";
import { getFoam } from "./foam-assets";
import { getGroundNoise } from "./ground-assets";
import { getSidewalk } from "./walk-assets";
import { getCurtain } from "./facade-assets";
import { getCurb } from "./curb-assets";
import { getHerodian } from "./stone-assets";
import { getJaffaClock } from "./clock-assets";
import { getIsraelFlag } from "./flag-assets";
import { getFoliage, getBark } from "./tree-assets";
import { getAyalonRoad, getBakedRoad } from "./road-assets";
import { getSkyDay, getSkyNight } from "./sky-assets";
import { getBlob } from "./blob-assets";

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

type Disposable = { dispose: () => void };
type Glow = { light: THREE.PointLight; on: number };
type Emit = { mat: THREE.MeshStandardMaterial; night: number; day: number };
type Mover = { pts: { x: number; y: number; z: number; yaw: number }[]; speed: number; phase: number; mesh: THREE.Object3D };

var _dummy = new THREE.Object3D();
var _color = new THREE.Color();
function asphaltTexture(lanes = 2) {
  const kit = getBakedRoad(lanes) || getBakedRoad(8) || getBakedRoad(4) || getBakedRoad(3);
  if (!kit) throw new Error("baked asphalt missing");
  return kit;
}
function herodianTexture() {
  const baked = getHerodian();
  if (!baked) throw new Error("herodian texture missing");
  return baked;
}
function curtainTexture(kind = "blue") {
  const baked = getCurtain(kind);
  if (!baked) throw new Error("curtain texture missing");
  return baked;
}
function curbTexture(kind: string) {
  const baked = getCurb(kind);
  if (!baked) throw new Error("curb texture missing");
  return baked;
}
function foliageTexture() {
  const baked = getFoliage();
  if (!baked) throw new Error("foliage texture missing");
  return baked;
}
function barkTexture() {
  const baked = getBark();
  if (!baked) throw new Error("bark texture missing");
  return baked;
}
function sidewalkTexture() {
  const baked = getSidewalk();
  if (!baked) throw new Error("sidewalk texture missing");
  return baked;
}
function groundTexture(_hex: number) {
  const baked = getGroundNoise();
  if (!baked) throw new Error("ground texture missing");
  return baked;
}
function foamTex() {
  const baked = getFoam();
  if (!baked) throw new Error("foam texture missing");
  return baked;
}
function tiSignTex(kind: string) {
  const baked = getSign(kind);
  if (!baked) throw new Error("sign texture missing");
  return baked;
}
function waterNormalTex() {
  const baked = getWaterNormal();
  if (!baked) throw new Error("water normal missing");
  return baked;
}
function checkerTexture() {
  const baked = getChecker();
  if (!baked) throw new Error("checker texture missing");
  return baked;
}
function flareTex(size: number, ..._rest: unknown[]) {
  const baked = size >= 128 ? getFlare0() : getFlare1();
  if (!baked) throw new Error("flare texture missing");
  return baked;
}
function segsOf(built: BuiltTrack) {
  return built.closed ? built.samples.length : Math.max(1, built.samples.length - 1);
}
function samp(built: BuiltTrack, i: number) {
  const n = built.samples.length;
  return built.samples[built.closed ? i % n : Math.min(i, n - 1)];
}
function buildRoad(built: BuiltTrack) {
  const hw = built.width / 2;
  const pos = [];
  const uv = [];
  const nrm = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 6;
    pos.push(s.x - s.rx * hw, s.y + 0.04, s.z - s.rz * hw);
    pos.push(s.x + s.rx * hw, s.y + 0.04, s.z + s.rz * hw);
    uv.push(0, v, 1, v);
    nrm.push(0, 1, 0, 0, 1, 0);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildOffsetRoad(built: BuiltTrack, offset: number) {
  const hw = built.width / 2;
  const pos = [];
  const uv = [];
  const nrm = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 6;
    const cx = s.x + s.rx * offset;
    const cz = s.z + s.rz * offset;
    pos.push(cx - s.rx * hw, s.y + 0.04, cz - s.rz * hw);
    pos.push(cx + s.rx * hw, s.y + 0.04, cz + s.rz * hw);
    uv.push(0, v, 1, v);
    nrm.push(0, 1, 0, 0, 1, 0);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildStrip(built: BuiltTrack, centerOff: number, half: number, y = 0.02) {
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 8;
    const cx = s.x + s.rx * centerOff;
    const cz = s.z + s.rz * centerOff;
    pos.push(cx - s.rx * half, s.y + y, cz - s.rz * half);
    pos.push(cx + s.rx * half, s.y + y, cz + s.rz * half);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildCenterLine(built: BuiltTrack) {
  const hw = 0.22;
  const pos = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const w = Math.floor(s.s / 5) % 2 === 0 ? hw : 0.02;
    pos.push(s.x - s.rx * w, s.y + 0.07, s.z - s.rz * w);
    pos.push(s.x + s.rx * w, s.y + 0.07, s.z + s.rz * w);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildSidewalk(built: BuiltTrack, side: number) {
  const d0 = built.width / 2 + 0.42;
  const d1 = d0 + 3.2;
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 8;
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0, s.y + 0.18, s.z + rz * d0);
    pos.push(s.x + rx * d1, s.y + 0.18, s.z + rz * d1);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildEdgeLine(built: BuiltTrack, side: number, inset = 0.28, hw = 0.28, yOff = 0.08, centerOff = 0) {
  const d = built.width / 2 - inset;
  const pos = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const cx = s.x + s.rx * (d * side + centerOff);
    const cz = s.z + s.rz * (d * side + centerOff);
    pos.push(cx - s.rx * hw, s.y + yOff, cz - s.rz * hw);
    pos.push(cx + s.rx * hw, s.y + yOff, cz + s.rz * hw);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function laneCountFor(def: TrackDef) {
  if (def.id === "ayalon") return 8;
  if (def.id === "telaviv" || def.id === "namal" || def.id === "gushdan" || def.id === "hw1" || def.id === "hw2" || def.id === "hw6") return 4;
  if (def.theme === "highway") return 4;
  if (def.id === "rothschild" || def.id === "hayarkon" || def.id === "jerusalem") return 3;
  return 3;
}
function buildCurb(built: BuiltTrack, side: number, centerOff = 0) {
  const d0 = built.width / 2;
  const d1 = d0 + 0.55;
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 2.4;
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0 + s.rx * centerOff, s.y + 0.06, s.z + rz * d0 + s.rz * centerOff);
    pos.push(s.x + rx * d1 + s.rx * centerOff, s.y + 0.58, s.z + rz * d1 + s.rz * centerOff);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildJersey(built: BuiltTrack, side: number, centerOff = 0) {
  const d0 = built.width / 2 + 0.62;
  const d1 = d0 + 0.42;
  const pos = [];
  const idx = [];
  const uvs: number[] = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0 + s.rx * centerOff, s.y + 0.08, s.z + rz * d0 + s.rz * centerOff);
    pos.push(s.x + rx * d1 + s.rx * centerOff, s.y + 1.35, s.z + rz * d1 + s.rz * centerOff);
    const v = i / n * (built.length / 2.4);
    uvs.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildRail(built: BuiltTrack, side: number) {
  const samples = built.samples;
  const d = built.width / 2 + 0.48;
  const pos = [];
  const idx = [];
  const uvs: number[] = [];
  const n = samples.length;
  for (let i = 0; i <= n; i++) {
    const s = samples[i % n];
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d, s.y + 0.22, s.z + rz * d);
    pos.push(s.x + rx * d, s.y + 0.72, s.z + rz * d);
    const v = i / n * (built.length / 3);
    uvs.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function buildShoulder(built: BuiltTrack, side: number) {
  const samples = built.samples;
  const d0 = built.width / 2 + 3.95;
  const d1 = d0 + 8.5;
  const pos = [];
  const uv = [];
  const idx = [];
  const n = samples.length;
  for (let i = 0; i <= n; i++) {
    const s = samples[i % n];
    const v = (i === n ? built.length : s.s) / 10;
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0, s.y + 0.03, s.z + rz * d0);
    pos.push(s.x + rx * d1, s.y + 0.01, s.z + rz * d1);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function applySky(sky: Sky, sun: THREE.Vector3, preset: SkyPreset) {
  const phi = THREE.MathUtils.degToRad(90 - preset.elevation);
  const theta = THREE.MathUtils.degToRad(preset.azimuth);
  sun.setFromSphericalCoords(1, phi, theta);
  const su = sky.material.uniforms;
  su["turbidity"].value = preset.turbidity;
  su["rayleigh"].value = preset.rayleigh;
  su["mieCoefficient"].value = preset.mieCoefficient;
  su["mieDirectionalG"].value = preset.mieDirectionalG;
  su["sunPosition"].value.copy(sun);
}
function aimLight(isNight: boolean, sun: THREE.Vector3, azimuth: number, out: THREE.Vector3) {
  if (!isNight) {
    out.copy(sun);
    return;
  }
  const phi = THREE.MathUtils.degToRad(46);
  const theta = THREE.MathUtils.degToRad(azimuth + 172);
  out.setFromSphericalCoords(1, phi, theta);
}
function applyLights(
  isNight: boolean,
  hemi: THREE.HemisphereLight,
  dir: THREE.DirectionalLight,
  fill: THREE.DirectionalLight,
  ambient: THREE.AmbientLight,
  lightAim: THREE.Vector3,
  flareCol: THREE.Color,
  lensflare: Lensflare | null,
) {
  hemi.color.setHex(isNight ? 0x6a88b0 : 0xa8c8e8);
  hemi.groundColor.setHex(isNight ? 0x2a241c : 0x4a5248);
  hemi.intensity = isNight ? 0.52 : 0.68;
  dir.color.setHex(isNight ? 0xc8d4e8 : 0xfff0d0);
  dir.intensity = isNight ? 0.38 : 1.12;
  dir.position.copy(lightAim).multiplyScalar(95);
  flareCol.setHex(isNight ? 16760944 : 16767136);
  if (lensflare) lensflare.visible = false;
  fill.color.setHex(isNight ? 0xffc070 : 0xc4d8f0);
  fill.intensity = isNight ? 0.48 : 0.28;
  if (isNight) fill.position.set(8, 22, -10);
  else {
    fill.position.copy(lightAim).multiplyScalar(-50);
    fill.position.y = Math.abs(fill.position.y) + 30;
  }
  ambient.color.setHex(isNight ? 0x4a6080 : 0xb0c4d8);
  ambient.intensity = isNight ? 0.28 : 0.32;
}
function starField() {
  const n = 1100;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = hash01(i, 1) * Math.PI * 2;
    const phi = Math.acos(hash01(i, 2) * 0.78);
    const r = 640 + hash01(i, 3) * 90;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 15659770,
    size: 2.2,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    fog: false
  });
  return {
    mesh: new THREE.Points(geo, mat),
    geo,
    mat
  };
}
export async function createWorld(def: TrackDef, built: BuiltTrack, shadows: boolean, night: boolean, weather: Weather = "clear") {
  const group = new THREE.Group();
  const bag: Disposable[] = [];
  const shared = new Set<Disposable>();
  for (const tex of [
      getFoliage(),
      getBark(),
      getSkyDay(),
      getSkyNight(),
      getJaffaClock(),
      getIsraelFlag(),
      getHerodian(),
      getCurb("city"),
      getCurb("stone"),
      getCurb("dirt"),
      getCurb("sand"),
      getCurtain("blue"),
      getCurtain("teal"),
      getCurtain("dark"),
      getCurtain("gold"),
      getCurtain("white"),
      getSidewalk(),
      getGroundNoise(),
      getFoam(),
      getBlob(),
      getSign("stop"),
      getSign("yield"),
      getSign("none"),
      getSign("speed50"),
      getSign("speed80"),
      getSign("speed90"),
      getWaterNormal(),
      getChecker(),
      getFlare0(),
      getFlare1(),
      getLaneArrow(),
  ]) {
    if (tex) shared.add(tex);
  }
  const keep = <T extends Disposable>(d: T): T => {
    if (shared.has(d)) return d;
    bag.push(d);
    return d;
  };
  const rng = mulberry32(def.seed);
  let isNight = night;
  let clock = night ? 0.9 : 0.5;
  let wx: Weather = weather;
  let lodCrowns = null;
  let lodTrunks = null;
  let lodBills = null;
  let lodShads = null;
  const lodWear: THREE.InstancedMesh[] = [];
  let lodPuddles: THREE.InstancedMesh | null = null;
  const preset = skyFor(def, isNight, wx);
  const sky = new Sky();
  sky.visible = false;
  const sun = new THREE.Vector3();
  const lightAim = new THREE.Vector3();
  applySky(sky, sun, preset);
  aimLight(isNight, sun, def.sky.azimuth, lightAim);
  const hemi = new THREE.HemisphereLight();
  group.add(hemi);
  const dir = new THREE.DirectionalLight();
  dir.castShadow = shadows;
  dir.shadow.mapSize.set(shadows ? 2048 : 512, shadows ? 2048 : 512);
  dir.shadow.camera.near = 8;
  dir.shadow.camera.far = 220;
  dir.shadow.camera.left = -58;
  dir.shadow.camera.right = 58;
  dir.shadow.camera.top = 58;
  dir.shadow.camera.bottom = -58;
  dir.shadow.bias = -6e-5;
  dir.shadow.normalBias = 0.022;
  dir.shadow.radius = isNight ? 0.55 : 0.85;
  dir.shadow.blurSamples = 4;
  group.add(dir);
  group.add(dir.target);
  const dirNear = new THREE.DirectionalLight();
  dirNear.castShadow = shadows;
  dirNear.shadow.mapSize.set(shadows ? 1024 : 256, shadows ? 1024 : 256);
  dirNear.shadow.camera.near = 2;
  dirNear.shadow.camera.far = 90;
  dirNear.shadow.camera.left = -18;
  dirNear.shadow.camera.right = 18;
  dirNear.shadow.camera.top = 18;
  dirNear.shadow.camera.bottom = -18;
  dirNear.shadow.bias = -4e-5;
  dirNear.shadow.normalBias = 0.018;
  dirNear.intensity = shadows ? 0.04 : 0;
  group.add(dirNear);
  group.add(dirNear.target);
  const fill = new THREE.DirectionalLight();
  group.add(fill);
  const ambient = new THREE.AmbientLight(16777215, 0.1);
  group.add(ambient);
  const flareCol = new THREE.Color();
  let lensflare: Lensflare | null = null;
  if (shadows) {
    const flare0 = keep(flareTex(128, "rgba(255,248,230,0.95)", "rgba(255,210,140,0.28)"));
    const flare1 = keep(flareTex(64, "rgba(255,180,90,0.45)", "rgba(255,120,40,0)"));
    lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(flare0, 190, 0, flareCol));
    lensflare.addElement(new LensflareElement(flare1, 52, 0.18));
    lensflare.addElement(new LensflareElement(flare1, 78, 0.36));
    lensflare.addElement(new LensflareElement(flare1, 36, 0.58));
    dir.add(lensflare);
  }
  applyLights(isNight, hemi, dir, fill, ambient, lightAim, flareCol, lensflare);
  if (isNight && (def.theme === "manhattan" || def.theme === "park")) {
    hemi.color.setHex(6981832);
    hemi.intensity = 0.58;
    dir.intensity = 1.22;
    fill.color.setHex(16734858);
    fill.intensity = 0.55;
    ambient.color.setHex(3820136);
    ambient.intensity = 0.32;
  }
  const stars = starField();
  keep(stars.geo);
  keep(stars.mat);
  stars.mesh.visible = isNight;
  stars.mesh.frustumCulled = false;
  group.add(stars.mesh);
  const moonMat = keep(new THREE.MeshBasicMaterial({
    color: 15265528,
    fog: false
  }));
  const moonMesh = new THREE.Mesh(keep(new THREE.SphereGeometry(12, 16, 16)), moonMat);
  moonMesh.position.copy(lightAim).multiplyScalar(420);
  moonMesh.visible = isNight;
  moonMesh.frustumCulled = false;
  group.add(moonMesh);
  const moonHaloMat = keep(new THREE.MeshBasicMaterial({
    color: 13162736,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    blending: 2,
    fog: false
  }));
  const moonHalo = new THREE.Mesh(keep(new THREE.SphereGeometry(28, 12, 12)), moonHaloMat);
  moonHalo.position.copy(moonMesh.position);
  moonHalo.visible = isNight;
  group.add(moonHalo);
  const sunMat = keep(new THREE.MeshBasicMaterial({
    color: 16774348,
    fog: false,
    toneMapped: false
  }));
  const sunMesh = new THREE.Mesh(keep(new THREE.SphereGeometry(12, 16, 16)), sunMat);
  sunMesh.position.copy(lightAim).multiplyScalar(900);
  sunMesh.visible = !isNight;
  sunMesh.frustumCulled = false;
  group.add(sunMesh);
  const sunHaloMat = keep(new THREE.MeshBasicMaterial({
    color: 16771232,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: 2,
    fog: false,
    toneMapped: false
  }));
  const sunHalo = new THREE.Mesh(keep(new THREE.SphereGeometry(28, 12, 12)), sunHaloMat);
  sunHalo.position.copy(sunMesh.position);
  sunHalo.visible = !isNight;
  sunHalo.frustumCulled = false;
  group.add(sunHalo);
  const skyDomeMat = keep(new THREE.MeshBasicMaterial({
    color: isNight ? 0x2a4a6c : 0x3c9ee0,
    fog: false,
    depthWrite: false,
    side: THREE.BackSide,
    toneMapped: false
  }));
  const skyDome = new THREE.Mesh(keep(new THREE.SphereGeometry(8200, 40, 20)), skyDomeMat);
  skyDome.frustumCulled = false;
  skyDome.renderOrder = -2000;
  group.add(skyDome);
  let span = 420;
  for (const s of built.samples) span = Math.max(span, Math.hypot(s.x, s.z));
  const groundCol = def.id === "ayalon" ? 0xd0d4d8 : def.theme === "desert" ? def.sand : def.theme === "stone" ? 0xe8dcc8 : def.theme === "carmel" ? 0xc4c8a8 : def.theme === "snow" ? 0xf0f4f8 : def.theme === "jaffa" ? 0xe2d2bc : 0xd4cfc6;
  const gMap = keep(groundTexture(def.ground));
  gMap.wrapS = gMap.wrapT = THREE.RepeatWrapping;
  gMap.repeat.set(90, 90);
  const ground = new THREE.Mesh(keep(new THREE.PlaneGeometry(Math.max(def.id === "scopus" || def.id === "hermon" || def.id === "ramon" ? 2800 : 1200, span * (def.id === "scopus" ? 4.2 : 2.8)), Math.max(def.id === "scopus" || def.id === "hermon" || def.id === "ramon" ? 2800 : 1200, span * (def.id === "scopus" ? 4.2 : 2.8)))), keep(new THREE.MeshStandardMaterial({
    map: gMap,
    color: groundCol,
    roughness: 0.97,
    metalness: 0,
    envMapIntensity: 0.12
  })));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.4;
  ground.receiveShadow = true;
  group.add(ground);
  const domeMat = keep(new THREE.MeshBasicMaterial({
    color: isNight ? 0x0e1a2c : def.theme === "desert" || def.id === "ramon" ? 0x87b4d8 : def.theme === "snow" || def.id === "hermon" ? 0xb8d4f0 : 0x4a9ad8,
    side: 1,
    fog: false,
    depthWrite: false,
    toneMapped: false
  }));
  const dome = new THREE.Mesh(keep(new THREE.SphereGeometry(8600, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.54)), domeMat);
  dome.position.y = -80;
  dome.frustumCulled = false;
  group.add(dome);
  if (def.theme === "carmel" || def.theme === "snow" || def.id === "ramon" || def.id === "jerusalem" || def.id === "scopus" || def.id === "hw1" || def.id === "masada" || def.id === "eilatmtn" || def.id === "golan" || def.id === "nazareth" || def.id === "tzfat" || def.id === "stellamaris") {
    const slopeMat = keep(new THREE.MeshStandardMaterial({
      color: def.id === "ramon" ? 11565642 : def.id === "hermon" ? 13950438 : def.id === "jerusalem" || def.id === "scopus" ? 12890250 : 4874808,
      roughness: 0.96,
      envMapIntensity: 0.18,
      flatShading: true
    }));
    const pos = [];
    const idx = [];
    const n = segsOf(built);
    const outer = def.id === "ramon" ? 190 : def.id === "hermon" ? 160 : def.theme === "carmel" ? 110 : 78;
    let valleyX = 0;
    let valleyZ = 0;
    let invertSide = false;
    if (def.id === "ramon") {
      const fl = ram(30.585, 34.802);
      valleyX = fl.x;
      valleyZ = fl.z;
    } else if (def.id === "hermon") {
      const pk = her(33.3112, 35.79);
      valleyX = pk.x;
      valleyZ = pk.z;
      invertSide = true;
    } else if (def.water) {
      valleyX = def.water.x;
      valleyZ = def.water.z;
    } else {
      valleyX = built.samples[built.samples.length - 1].x;
      valleyZ = built.samples[built.samples.length - 1].z;
    }
    for (let i = 0; i <= n; i++) {
      const s = samp(built, i);
      const hw = built.width / 2 + 1.2;
      let vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      if (invertSide) vs = -vs;
      const mountainY = def.id === "ramon" ? s.y + 140 + Math.min(90, s.y * 0.65) : def.id === "masada" ? s.y + 28 + s.y * 0.35 : def.id === "hermon" ? s.y + 92 + s.y * 0.48 : def.theme === "carmel" ? s.y + 52 : s.y + 8;
      const valleyY = Math.max(-0.35, s.y * 0.05 - 2);
      const leftY = vs === -1 ? valleyY : mountainY;
      const rightY = vs === 1 ? valleyY : mountainY;
      pos.push(s.x - s.rx * hw, s.y - 0.15, s.z - s.rz * hw);
      pos.push(s.x - s.rx * outer, leftY, s.z - s.rz * outer);
      pos.push(s.x + s.rx * hw, s.y - 0.15, s.z + s.rz * hw);
      pos.push(s.x + s.rx * outer, rightY, s.z + s.rz * outer);
    }
    for (let i = 0; i < n; i++) {
      const a = i * 4;
      idx.push(a, a + 1, a + 4, a + 1, a + 5, a + 4);
      idx.push(a + 2, a + 6, a + 3, a + 3, a + 6, a + 7);
    }
    const slope = new THREE.BufferGeometry();
    slope.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    slope.setIndex(idx);
    slope.computeVertexNormals();
    const slopeMesh = new THREE.Mesh(keep(slope), slopeMat);
    slopeMesh.receiveShadow = true;
    group.add(slopeMesh);
  }
  const lanes = laneCountFor(def);
  const roadMaps = asphaltTexture(lanes);
  if (!getBakedRoad(lanes)) bag.push(roadMaps.map, roadMaps.roughnessMap, roadMaps.bumpMap);
  const roadMat = keep(new THREE.MeshPhysicalMaterial({
    map: roadMaps.map,
    roughnessMap: roadMaps.roughnessMap,
    bumpMap: roadMaps.bumpMap,
    bumpScale: 0.36,
    color: 0xffffff,
    roughness: 0.48,
    metalness: 0,
    envMapIntensity: 0.85,
    clearcoat: 0.28,
    clearcoatRoughness: 0.4,
    reflectivity: 0.28
  }));
  roadMat.userData.lanes = lanes;
  roadMat.customProgramCacheKey = () => `rush-road-${lanes}`;
  bindRoadCompile(roadMat);
  const road = new THREE.Mesh(keep(buildRoad(built)), roadMat);
  road.receiveShadow = true;
  group.add(road);
  const edgeMat = keep(new THREE.MeshBasicMaterial({
    color: 0xffffff,
    fog: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  }));
  group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, 0.16, 0.46)), edgeMat));
  group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, 0.16, 0.46)), edgeMat));
  {
    const dashG = keep(new THREE.BoxGeometry(0.2, 0.045, 4.4));
    const dashM = keep(new THREE.MeshBasicMaterial({ color: 0xf7f8f4, fog: false }));
    const offs = def.id === "ayalon" ? [0, built.width + 18] : [0];
    const nDash = Math.min(2800, Math.floor(built.samples.length / 2) * (lanes - 1) * offs.length);
    const dashes = new THREE.InstancedMesh(dashG, dashM, Math.max(1, nDash));
    let di = 0;
    const hw = built.width / 2;
    const lw = built.width / lanes;
    const stepD = Math.max(2, Math.floor(built.samples.length / 140));
    for (const off of offs) {
      for (let i = 0; i < built.samples.length && di < nDash; i += stepD) {
        const s = built.samples[i];
        if (Math.floor(s.s / 9) % 2 === 0) continue;
        for (let k = 1; k < lanes && di < nDash; k++) {
          const lat = -hw + k * lw;
          _dummy.position.set(s.x + s.rx * (off + lat), s.y + 0.09, s.z + s.rz * (off + lat));
          _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          dashes.setMatrixAt(di++, _dummy.matrix);
        }
      }
    }
    dashes.count = di;
    dashes.instanceMatrix.needsUpdate = true;
    group.add(dashes);
  }
  {
    const yMat = keep(new THREE.MeshBasicMaterial({
      color: 0xffc400,
      fog: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    }));
    group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, 0.85, 0.1)), yMat));
    group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, 0.85, 0.1)), yMat));
    if (def.id === "ayalon") {
      const gap = 18;
      const oppOff = built.width + gap;
      const opp = new THREE.Mesh(keep(buildOffsetRoad(built, oppOff)), roadMat);
      opp.receiveShadow = true;
      group.add(opp);
      group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, 0.16, 0.46, 0.08, oppOff)), edgeMat));
      group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, 0.16, 0.46, 0.08, oppOff)), edgeMat));
      group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, 0.62, 0.09, 0.08, oppOff)), yMat));
      group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, 0.62, 0.09, 0.08, oppOff)), yMat));
      const midOff = built.width / 2 + gap * 0.5;
      const bedMap = keep(groundTexture(0));
      bedMap.wrapS = bedMap.wrapT = THREE.RepeatWrapping;
      bedMap.repeat.set(6, 80);
      const bed = new THREE.Mesh(keep(buildStrip(built, midOff, gap * 0.48)), keep(new THREE.MeshStandardMaterial({
        map: bedMap,
        color: 0x6a6860,
        roughness: 0.96,
        metalness: 0
      })));
      bed.receiveShadow = true;
      group.add(bed);
      const jerSh = new THREE.Shape();
      jerSh.moveTo(-0.3, 0);
      jerSh.lineTo(0.3, 0);
      jerSh.lineTo(0.14, 0.38);
      jerSh.lineTo(0.08, 0.88);
      jerSh.lineTo(-0.08, 0.88);
      jerSh.lineTo(-0.14, 0.38);
      jerSh.closePath();
      const jerG = keep(new THREE.ExtrudeGeometry(jerSh, { depth: 2.6, bevelEnabled: false }));
      jerG.translate(0, 0, -1.3);
      jerG.computeVertexNormals();
      const jerM = keep(new THREE.MeshStandardMaterial({ color: 0xb4aaa0, roughness: 0.86, metalness: 0 }));
      const nJer = 160;
      const jerRows = [
        -built.width / 2 - 0.5,
        built.width / 2 + 0.5,
        midOff,
        oppOff - built.width / 2 - 0.5,
        oppOff + built.width / 2 + 0.5,
      ];
      const jers = new THREE.InstancedMesh(jerG, jerM, nJer * jerRows.length);
      let ji = 0;
      const stepJ = Math.max(1, Math.floor(built.samples.length / nJer));
      for (let i = 0; i < built.samples.length && ji < nJer * jerRows.length; i += stepJ) {
        const s = built.samples[i];
        for (const lat of jerRows) {
          if (ji >= nJer * jerRows.length) break;
          _dummy.position.set(s.x + s.rx * lat, s.y + 0.06, s.z + s.rz * lat);
          _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
          _dummy.scale.set(1.2, 1.4, 1);
          _dummy.updateMatrix();
          jers.setMatrixAt(ji++, _dummy.matrix);
        }
      }
      jers.count = ji;
      jers.instanceMatrix.needsUpdate = true;
      group.add(jers);
      const railG = keep(new THREE.BoxGeometry(0.14, 0.1, 3.4));
      const railM = keep(new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.72, roughness: 0.28 }));
      const nRail = 220;
      const rails = new THREE.InstancedMesh(railG, railM, nRail * 2);
      let ri = 0;
      const stepR = Math.max(1, Math.floor(built.samples.length / nRail));
      for (let i = 0; i < built.samples.length && ri < nRail * 2; i += stepR) {
        const s = built.samples[i];
        for (const lane of [-1.15, 1.15]) {
          _dummy.position.set(s.x + s.rx * (midOff + lane), s.y + 0.16, s.z + s.rz * (midOff + lane));
          _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          rails.setMatrixAt(ri++, _dummy.matrix);
        }
      }
      rails.count = ri;
      rails.instanceMatrix.needsUpdate = true;
      group.add(rails);
      const wireG = keep(new THREE.BoxGeometry(0.05, 0.05, 3.4));
      const wireM = keep(new THREE.MeshBasicMaterial({ color: 0x2c2e32 }));
      const poleG2 = keep(new THREE.BoxGeometry(0.18, 6.2, 0.18));
      const poleM2 = keep(new THREE.MeshStandardMaterial({ color: 0x6a7076, metalness: 0.55, roughness: 0.4 }));
      const nWire = 200;
      const wires = new THREE.InstancedMesh(wireG, wireM, nWire);
      const nPole = 48;
      const poles = new THREE.InstancedMesh(poleG2, poleM2, nPole);
      let wi2 = 0;
      const stepWire = Math.max(1, Math.floor(built.samples.length / nWire));
      for (let i = 0; i < built.samples.length && wi2 < nWire; i += stepWire) {
        const s = built.samples[i];
        _dummy.position.set(s.x + s.rx * midOff, s.y + 5.35, s.z + s.rz * midOff);
        _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        wires.setMatrixAt(wi2++, _dummy.matrix);
      }
      wires.count = wi2;
      wires.instanceMatrix.needsUpdate = true;
      group.add(wires);
      let pi2 = 0;
      const stepP = Math.max(1, Math.floor(built.samples.length / nPole));
      for (let i = 0; i < built.samples.length && pi2 < nPole; i += stepP) {
        const s = built.samples[i];
        _dummy.position.set(s.x + s.rx * (midOff + 2.4), s.y + 3.1, s.z + s.rz * (midOff + 2.4));
        _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        poles.setMatrixAt(pi2++, _dummy.matrix);
      }
      poles.count = pi2;
      poles.instanceMatrix.needsUpdate = true;
      poles.castShadow = true;
      group.add(poles);
      const wallG = keep(new THREE.BoxGeometry(0.22, 3.4, 4.4));
      const wallM = keep(new THREE.MeshStandardMaterial({ color: 0xc8c4ba, roughness: 0.9, metalness: 0 }));
      const nWall = 90;
      const wallRows = [-built.width / 2 - 1.4, oppOff + built.width / 2 + 1.4];
      const walls = new THREE.InstancedMesh(wallG, wallM, nWall * wallRows.length);
      let wi = 0;
      const stepW = Math.max(1, Math.floor(built.samples.length / nWall));
      for (let i = 0; i < built.samples.length && wi < nWall * wallRows.length; i += stepW) {
        const s = built.samples[i];
        for (const lat of wallRows) {
          if (wi >= nWall * wallRows.length) break;
          _dummy.position.set(s.x + s.rx * lat, s.y + 1.72, s.z + s.rz * lat);
          _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          walls.setMatrixAt(wi++, _dummy.matrix);
        }
      }
      walls.count = wi;
      walls.instanceMatrix.needsUpdate = true;
      walls.castShadow = true;
      walls.receiveShadow = true;
      group.add(walls);
      const markG = keep(new THREE.BoxGeometry(0.1, 0.62, 0.9));
      const markRed = keep(new THREE.MeshBasicMaterial({ color: 0xc41818, fog: false }));
      const markWht = keep(new THREE.MeshBasicMaterial({ color: 0xf3f1ea, fog: false }));
      const nMark = 100;
      const markRows = [-built.width / 2 - 0.62, oppOff + built.width / 2 + 0.62];
      const reds = new THREE.InstancedMesh(markG, markRed, nMark * markRows.length);
      const whts = new THREE.InstancedMesh(markG, markWht, nMark * markRows.length);
      let riM = 0;
      let wiM = 0;
      let nM = 0;
      const stepM = Math.max(1, Math.floor(built.samples.length / nMark));
      for (let i = 0; i < built.samples.length && nM < nMark * markRows.length; i += stepM) {
        const s = built.samples[i];
        for (const lat of markRows) {
          if (nM >= nMark * markRows.length) break;
          _dummy.position.set(s.x + s.rx * lat, s.y + 0.95, s.z + s.rz * lat);
          _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          if (nM % 2 === 0) reds.setMatrixAt(riM++, _dummy.matrix);
          else whts.setMatrixAt(wiM++, _dummy.matrix);
          nM += 1;
        }
      }
      reds.count = riM;
      whts.count = wiM;
      reds.instanceMatrix.needsUpdate = true;
      whts.instanceMatrix.needsUpdate = true;
      group.add(reds, whts);
    }
  }
  {
    const arrowTex = getLaneArrow();
    const chevGeo = keep(new THREE.PlaneGeometry(2.8, 3.6));
    chevGeo.rotateX(-Math.PI / 2);
    const chevMat = keep(new THREE.MeshBasicMaterial({
      map: arrowTex ?? undefined,
      color: arrowTex ? 0xffffff : 16773248,
      transparent: !!arrowTex,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      fog: false,
      side: THREE.DoubleSide,
    }));
    const chevN = Math.min(def.id === "ayalon" ? 48 : 28, Math.max(8, Math.floor(built.samples.length / (def.id === "ayalon" ? 9 : 14))));
    const chevs = new THREE.InstancedMesh(chevGeo, chevMat, chevN);
    const stepC = Math.max(1, Math.floor(built.samples.length / chevN));
    let ci2 = 0;
    const chevS = def.id === "ayalon" ? 1.55 : Math.min(1.2, Math.max(0.72, built.width / 18));
    for (let i = 2; i < built.samples.length - 2 && ci2 < chevN; i += stepC) {
      const s = built.samples[i];
      _dummy.position.set(s.x, s.y + 0.06, s.z);
      _dummy.scale.set(chevS, 1, chevS);
      _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
      _dummy.updateMatrix();
      chevs.setMatrixAt(ci2++, _dummy.matrix);
    }
    chevs.count = ci2;
    chevs.instanceMatrix.needsUpdate = true;
    group.add(chevs);
    if (def.id === "ayalon") {
      const oppOff = built.width + 18;
      const chevs2 = new THREE.InstancedMesh(chevGeo, chevMat, chevN);
      let cj = 0;
      for (let i = 2; i < built.samples.length - 2 && cj < chevN; i += stepC) {
        const s = built.samples[i];
        _dummy.position.set(s.x + s.rx * oppOff, s.y + 0.06, s.z + s.rz * oppOff);
        _dummy.scale.set(chevS, 1, chevS);
        _dummy.rotation.set(0, Math.atan2(s.tx, s.tz) + Math.PI, 0);
        _dummy.updateMatrix();
        chevs2.setMatrixAt(cj++, _dummy.matrix);
      }
      chevs2.count = cj;
      chevs2.instanceMatrix.needsUpdate = true;
      group.add(chevs2);
    }
  }
  const urban = def.theme === "bauhaus" || def.theme === "stone" || def.theme === "jaffa" || def.id === "telaviv" || def.id === "rothschild" || def.id === "hayarkon";
  const zebraGeo = keep(new THREE.BoxGeometry(0.42, 0.035, 2.4));
  const zebraMat = keep(new THREE.MeshBasicMaterial({ color: 16250094 }));
  const stopGeo = keep(new THREE.BoxGeometry(built.width * 0.92, 0.04, 0.38));
  const paintAt = (t: number, cross: boolean) => {
    const idx = Math.min(built.samples.length - 1, Math.floor(t * built.samples.length));
    const s = built.samples[idx];
    const yaw = Math.atan2(s.tx, s.tz);
    if (cross) {
      const nBar = Math.max(6, Math.round(built.width / 0.85));
      for (let b = 0; b < nBar; b++) {
        const off = -built.width / 2 + 0.5 + b * (built.width / nBar);
        const bar = new THREE.Mesh(zebraGeo, zebraMat);
        bar.position.set(s.x + s.rx * off, s.y + 0.07, s.z + s.rz * off);
        bar.rotation.y = yaw;
        group.add(bar);
      }
    } else {
      const stop = new THREE.Mesh(stopGeo, zebraMat);
      stop.position.set(s.x, s.y + 0.07, s.z);
      stop.rotation.y = yaw;
      group.add(stop);
    }
  };
  paintAt(0.012, false);
  paintAt(0.022, true);
  if (urban) {
    paintAt(0.48, false);
    paintAt(0.5, true);
  }
  const wearMat = keep(new THREE.MeshBasicMaterial({
    map: getBlob() ?? undefined,
    color: getBlob() ? 0x2a2c30 : 1842720,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  }));
  const wearGeo = keep(new THREE.BoxGeometry(Math.max(1.6, built.width / Math.max(2, lanes) * 0.55), 0.02, 4.2));
  const wearN = Math.min(180, Math.floor(built.length / 8));
  const wear = new THREE.InstancedMesh(wearGeo, wearMat, wearN);
  const rightLane = built.width / 2 - built.width / lanes / 2;
  let wearI = 0;
  for (let i = 0; i < built.samples.length && wearI < wearN; i += Math.max(2, Math.floor(built.samples.length / wearN))) {
    const s = built.samples[i];
    _dummy.position.set(s.x + s.rx * rightLane, s.y + 0.05, s.z + s.rz * rightLane);
    _dummy.scale.set(1, 1, 1);
    _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
    _dummy.updateMatrix();
    wear.setMatrixAt(wearI++, _dummy.matrix);
  }
  wear.count = wearI;
  wear.instanceMatrix.needsUpdate = true;
  group.add(wear);
  lodWear.push(wear);
  if (def.id === "ayalon") {
    const oppOff = built.width + 18;
    const wear2 = new THREE.InstancedMesh(wearGeo, wearMat, wearN);
    let w2 = 0;
    const stepW = Math.max(2, Math.floor(built.samples.length / wearN));
    for (let i = 0; i < built.samples.length && w2 < wearN; i += stepW) {
      const s = built.samples[i];
      _dummy.position.set(s.x + s.rx * (oppOff - rightLane), s.y + 0.05, s.z + s.rz * (oppOff - rightLane));
      _dummy.scale.set(1, 1, 1);
      _dummy.rotation.set(0, Math.atan2(s.tx, s.tz) + Math.PI, 0);
      _dummy.updateMatrix();
      wear2.setMatrixAt(w2++, _dummy.matrix);
    }
    wear2.count = w2;
    wear2.instanceMatrix.needsUpdate = true;
    group.add(wear2);
    lodWear.push(wear2);
  }
  const curbTex = keep(curbTexture(def.theme === "stone" ? "stone" : def.theme === "desert" ? "sand" : def.theme === "carmel" || def.theme === "snow" ? "dirt" : "city"));
  const curbMat = keep(new THREE.MeshStandardMaterial({
    map: curbTex,
    color: 0xffffff,
    roughness: 0.52,
    metalness: 0.05,
    envMapIntensity: 0.2,
    emissive: 0x3a120c,
    emissiveIntensity: 0.14
  }));
  group.add(new THREE.Mesh(keep(buildCurb(built, 1)), curbMat));
  group.add(new THREE.Mesh(keep(buildCurb(built, -1)), curbMat));
  if (def.id === "ayalon") {
    const oppOff = built.width + 18;
    group.add(new THREE.Mesh(keep(buildCurb(built, 1, oppOff)), curbMat));
    group.add(new THREE.Mesh(keep(buildCurb(built, -1, oppOff)), curbMat));
  }
  {
    const eyeGeo = keep(new THREE.BoxGeometry(0.2, 0.09, 0.32));
    const eyeMat = keep(new THREE.MeshBasicMaterial({ color: 0xfff2b0, fog: false }));
    const eyeOffs = def.id === "ayalon" ? [0, built.width + 18] : [0];
    const eyeN = Math.min(def.id === "ayalon" ? 560 : 320, Math.max(24, Math.floor(built.samples.length / 1.5) * eyeOffs.length));
    const eyes = new THREE.InstancedMesh(eyeGeo, eyeMat, eyeN);
    let ei = 0;
    const stepE = Math.max(2, Math.floor(built.samples.length / (eyeN / (2 * eyeOffs.length))));
    for (const off of eyeOffs) {
      for (let i = 0; i < built.samples.length && ei < eyeN; i += stepE) {
        const s = built.samples[i];
        const d = built.width / 2 - 0.4;
        for (const side of [1, -1]) {
          if (ei >= eyeN) break;
          _dummy.position.set(s.x + s.rx * (off + d * side), s.y + 0.14, s.z + s.rz * (off + d * side));
          _dummy.scale.set(1, 1, 1);
          _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
          _dummy.updateMatrix();
          eyes.setMatrixAt(ei++, _dummy.matrix);
        }
      }
    }
    eyes.count = ei;
    eyes.instanceMatrix.needsUpdate = true;
    group.add(eyes);
  }
  const jerseySrc = getCurb("city");
  const jerseyMap = jerseySrc ? keep(jerseySrc.clone()) : undefined;
  if (jerseyMap) {
    jerseyMap.wrapS = jerseyMap.wrapT = THREE.RepeatWrapping;
    jerseyMap.needsUpdate = true;
  }
  const jerseyMat = keep(new THREE.MeshStandardMaterial({
    map: jerseyMap,
    color: 14209732,
    roughness: 0.58,
    metalness: 0.06,
    envMapIntensity: 0.4
  }));
  if (def.theme !== "desert" && def.theme !== "snow" && def.id !== "rothschild" && def.theme !== "stone" && def.theme !== "jaffa" && def.theme !== "carmel") {
    group.add(new THREE.Mesh(keep(buildJersey(built, 1)), jerseyMat));
    group.add(new THREE.Mesh(keep(buildJersey(built, -1)), jerseyMat));
    const capMat = keep(new THREE.MeshBasicMaterial({ color: 0xf4f0ea, fog: false }));
    group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, -0.78, 0.14, 1.38)), capMat));
    group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, -0.78, 0.14, 1.38)), capMat));
    if (def.id === "ayalon") {
      const oppOff = built.width + 18;
      group.add(new THREE.Mesh(keep(buildJersey(built, 1, oppOff)), jerseyMat));
      group.add(new THREE.Mesh(keep(buildJersey(built, -1, oppOff)), jerseyMat));
      group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, -0.78, 0.14, 1.38, oppOff)), capMat));
      group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, -0.78, 0.14, 1.38, oppOff)), capMat));
    }
  }
  const walkTex = keep(sidewalkTexture());
  walkTex.repeat.set(1, 8);
  const walkMat = keep(new THREE.MeshStandardMaterial({
    map: walkTex,
    roughness: 0.88,
    metalness: 0.04,
    envMapIntensity: 0.3
  }));
  if (def.theme !== "highway" && def.id !== "ayalon" && def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel") {
    const walkL = new THREE.Mesh(keep(buildSidewalk(built, 1)), walkMat);
    const walkR = new THREE.Mesh(keep(buildSidewalk(built, -1)), walkMat);
    walkL.receiveShadow = true;
    walkR.receiveShadow = true;
    group.add(walkL, walkR);
  }
  const shoulderMat = keep(new THREE.MeshStandardMaterial({
    color: def.sand,
    roughness: 0.96,
    metalness: 0.02,
    envMapIntensity: 0.18
  }));
  group.add(new THREE.Mesh(keep(buildShoulder(built, 1)), shoulderMat));
  group.add(new THREE.Mesh(keep(buildShoulder(built, -1)), shoulderMat));
  {
    const skipSigns = def.theme === "desert" || def.theme === "snow" || def.id === "ramon" || def.id === "hermon" || def.id === "masada" || def.id === "deadsea";
    if (!skipSigns) {
    const highway = def.theme === "highway" || def.id === "ayalon" || def.id === "hw1" || def.id === "hw2" || def.id === "hw6";
    const kinds = highway ? ["speed90", "speed80", "none"] : ["stop", "speed50", "yield"];
    const maps: Record<string, THREE.Texture> = {};
    for (const k of ["stop", "yield", "none", "speed50", "speed80", "speed90"]) maps[k] = keep(tiSignTex(k));
    const poleM = keep(new THREE.MeshStandardMaterial({ color: 0x8a9098, roughness: 0.55, metalness: 0.4 }));
    const poleG = keep(new THREE.CylinderGeometry(0.07, 0.09, 3.2, 6));
    poleG.translate(0, 1.6, 0);
    const nSign = highway ? 10 : 14;
    const stepS = Math.max(3, Math.floor(built.samples.length / nSign));
    let si = 0;
    for (let i = 8; i < built.samples.length - 8 && si < nSign; i += stepS) {
      const s = built.samples[i];
      const kind = kinds[si % kinds.length];
      const side = si % 2 ? 1 : -1;
      const off = built.width / 2 + 1.85;
      const px = s.x + s.rx * off * side;
      const pz = s.z + s.rz * off * side;
      const yaw = Math.atan2(s.tx, s.tz) + (side > 0 ? 0 : Math.PI);
      const pole = new THREE.Mesh(poleG, poleM);
      pole.position.set(px, s.y, pz);
      group.add(pole);
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(kind === "stop" || kind === "yield" ? 1.15 : 0.95, kind === "stop" || kind === "yield" ? 1.15 : 0.95),
        new THREE.MeshBasicMaterial({ map: maps[kind], transparent: true, depthWrite: false, fog: false }),
      );
      face.position.set(px, s.y + 3.05, pz);
      face.rotation.y = yaw;
      group.add(face);
      si++;
    }
    if (def.id === "ayalon") {
      const oppOff = built.width + 18;
      let sj = 0;
      for (let i = 12; i < built.samples.length - 8 && sj < nSign; i += stepS) {
        const s = built.samples[i];
        const kind = kinds[sj % kinds.length];
        const side = sj % 2 ? 1 : -1;
        const off = oppOff + built.width / 2 + 1.85;
        const px = s.x + s.rx * (side > 0 ? off : oppOff - built.width / 2 - 1.85);
        const pz = s.z + s.rz * (side > 0 ? off : oppOff - built.width / 2 - 1.85);
        const yaw = Math.atan2(s.tx, s.tz) + (side > 0 ? Math.PI : 0);
        const pole = new THREE.Mesh(poleG, poleM);
        pole.position.set(px, s.y, pz);
        group.add(pole);
        const face = new THREE.Mesh(
          new THREE.PlaneGeometry(0.95, 0.95),
          new THREE.MeshBasicMaterial({ map: maps[kind], transparent: true, depthWrite: false, fog: false }),
        );
        face.position.set(px, s.y + 3.05, pz);
        face.rotation.y = yaw;
        group.add(face);
        sj++;
      }
    }
    if (!highway) {
      const boxM = keep(new THREE.MeshStandardMaterial({ color: 0x1a1c18, roughness: 0.5 }));
      const redM = keep(new THREE.MeshBasicMaterial({ color: 0xff2a2a }));
      const yelM = keep(new THREE.MeshBasicMaterial({ color: 0xffc428 }));
      const grnM = keep(new THREE.MeshBasicMaterial({ color: isNight ? 0x3dff6a : 0x1a8a38 }));
      for (const t of [0.22, 0.71]) {
        const s = samp(built, Math.floor(t * segsOf(built)));
        const off = built.width / 2 + 1.7;
        const px = s.x + s.rx * off;
        const pz = s.z + s.rz * off;
        const pole = new THREE.Mesh(poleG, poleM);
        pole.position.set(px, s.y, pz);
        group.add(pole);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.05, 0.28), boxM);
        head.position.set(px, s.y + 3.35, pz);
        group.add(head);
        const lamp = (y: number, mat: THREE.Material) => {
          const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), mat);
          m.position.set(px, s.y + y, pz + s.tz * 0.16);
          group.add(m);
        };
        lamp(3.62, redM);
        lamp(3.35, yelM);
        lamp(3.08, grnM);
      }
    }
    }
  }
  const railMat = keep(new THREE.MeshPhysicalMaterial({
    color: 0x9aa3aa,
    metalness: 0.82,
    roughness: 0.28,
    roughnessMap: getBakedRoad(3)?.roughnessMap,
    envMapIntensity: 1.25
  }));
  if (def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon") {
    group.add(new THREE.Mesh(keep(buildRail(built, 1)), railMat));
    group.add(new THREE.Mesh(keep(buildRail(built, -1)), railMat));
  }
  let mirror: Reflector | null = null;
  let planarOk = true;
  if (shadows) {
    /** Codex 3.4: planar RT cap until Ayalon High p95 is measured on a user GPU. Do not raise. */
    const PLANAR_RT = 768;
    mirror = new Reflector(new THREE.PlaneGeometry(42, 80), {
      clipBias: 3e-3,
      textureWidth: PLANAR_RT,
      textureHeight: PLANAR_RT,
      color: isNight ? 0x4a5568 : 0x8aa0b4
    });
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = 0.026;
    const mmat = mirror.material as THREE.ShaderMaterial;
    mmat.transparent = true;
    mmat.opacity = isNight ? 0.36 : 0.22;
    group.add(mirror);
    bag.push({ dispose() {
      mirror?.dispose();
      mirror?.geometry.dispose();
    } });
  }
  const bodies = def.waters?.length ? def.waters : def.water ? [def.water] : [];
  const streets = generateStreets(def, built, bodies);
  const ramps: Ramp[] = [];
  const railPostGeo = keep(new THREE.CylinderGeometry(0.08, 0.1, 0.78, 5));
  railPostGeo.translate(0, 0.4, 0);
  const railPostMat = keep(new THREE.MeshStandardMaterial({
    color: 3027510,
    metalness: 0.55,
    roughness: 0.42
  }));
  const postSpots = [];
  if (def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon") for (let i = 0; i < built.samples.length; i += 5) {
    const s = built.samples[i];
    const alley = nearestStreet(s.x, s.z, streets);
    if (alley && alley.dist < alley.street.half + 5) continue;
    const d = built.width / 2 + 0.48;
    postSpots.push({
      x: s.x + s.rx * d,
      y: s.y,
      z: s.z + s.rz * d
    });
    postSpots.push({
      x: s.x - s.rx * d,
      y: s.y,
      z: s.z - s.rz * d
    });
  }
  if (postSpots.length) {
    const posts = new THREE.InstancedMesh(railPostGeo, railPostMat, postSpots.length);
    posts.castShadow = shadows;
    for (let i = 0; i < postSpots.length; i++) {
      const p = postSpots[i];
      _dummy.position.set(p.x, p.y, p.z);
      _dummy.scale.set(1, 1, 1);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      posts.setMatrixAt(i, _dummy.matrix);
    }
    posts.instanceMatrix.needsUpdate = true;
    group.add(posts);
  }
  if (streets.length) {
    const slab = keep(new THREE.BoxGeometry(1, 1, 1));
    const sideMesh = new THREE.InstancedMesh(slab, roadMat, streets.length);
    sideMesh.receiveShadow = true;
    for (let i = 0; i < streets.length; i++) {
      const r = streets[i];
      const dx = r.bx - r.ax;
      const dz = r.bz - r.az;
      const len = Math.hypot(dx, dz) || 1;
      _dummy.position.set((r.ax + r.bx) * 0.5, 0.045, (r.az + r.bz) * 0.5);
      _dummy.scale.set(r.half * 2, 0.06, len);
      _dummy.rotation.set(0, Math.atan2(dx, dz), 0);
      _dummy.updateMatrix();
      sideMesh.setMatrixAt(i, _dummy.matrix);
    }
    sideMesh.instanceMatrix.needsUpdate = true;
    group.add(sideMesh);
    const stripeGeo = keep(new THREE.BoxGeometry(0.28, 0.04, 1.1));
    const stripeMat = keep(new THREE.MeshStandardMaterial({
      color: 15920872,
      roughness: 0.55,
      emissive: 2236440,
      emissiveIntensity: isNight ? 0.35 : 0
    }));
    const stripeN = Math.min(streets.length * 5, 140);
    const stripes = new THREE.InstancedMesh(stripeGeo, stripeMat, stripeN);
    let si2 = 0;
    for (const r of streets) {
      const dx = r.bx - r.ax;
      const dz = r.bz - r.az;
      const len = Math.hypot(dx, dz) || 1;
      const ux = dx / len;
      const uz = dz / len;
      const yaw = Math.atan2(dx, dz);
      for (let k = 0; k < 5 && si2 < stripeN; k++) {
        const px = r.ax + ux * (1.2 + k * 0.55);
        const pz = r.az + uz * (1.2 + k * 0.55);
        _dummy.position.set(px, 0.08, pz);
        _dummy.scale.set(1, 1, 1);
        _dummy.rotation.set(0, yaw + Math.PI / 2, 0);
        _dummy.updateMatrix();
        stripes.setMatrixAt(si2, _dummy.matrix);
        si2 += 1;
      }
    }
    stripes.count = si2;
    stripes.instanceMatrix.needsUpdate = true;
    group.add(stripes);
  }
  let waterMesh;
  const waterMeshes: THREE.Mesh[] = [];
  const waterMats: THREE.MeshPhysicalMaterial[] = [];
  if (bodies.length) {
    const nrm = keep(waterNormalTex());
    for (const body of bodies) {
      const mat = keep(new THREE.MeshPhysicalMaterial({
        color: body.color,
        roughness: isNight ? 0.03 : 0.08,
        metalness: 0.08,
        transparent: true,
        opacity: isNight ? 0.9 : 0.82,
        envMapIntensity: isNight ? 2.6 : 1.7,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        ior: 1.33,
        normalMap: nrm,
        normalScale: new THREE.Vector2(1.15, 1.15)
      }));
      if (isNight) mat.color.multiplyScalar(0.65);
      const mesh = new THREE.Mesh(keep(new THREE.PlaneGeometry(Math.max(body.w * 1.4, 900), Math.max(body.d, 1600), 8, 8)), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(body.x, -0.12, body.z);
      group.add(mesh);
      waterMeshes.push(mesh);
      waterMats.push(mat);
      if (!waterMesh) waterMesh = mesh;
    }
    const sandBody = bodies[0];
    const sand = new THREE.Mesh(keep(new THREE.PlaneGeometry(Math.max(sandBody.w * 0.55, 420), Math.max(sandBody.d, 2200))), keep(new THREE.MeshStandardMaterial({
      color: def.sand,
      roughness: 1,
      envMapIntensity: 0.2
    })));
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(sandBody.x + sandBody.w * 0.28, -0.18, sandBody.z);
    if (def.theme !== "manhattan" && def.theme !== "park") group.add(sand);
    const foam = new THREE.Mesh(keep(new THREE.PlaneGeometry(sandBody.w * 0.14, sandBody.d * 0.92)), keep(new THREE.MeshBasicMaterial({
      map: keep(foamTex()),
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    })));
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(sandBody.x + sandBody.w * 0.14, -0.03, sandBody.z);
    if (def.theme !== "manhattan" && def.theme !== "park") group.add(foam);
  }
  if (def.id === "ayalon") {
    const nrm = keep(waterNormalTex());
    const canalMat = keep(new THREE.MeshPhysicalMaterial({
      color: isNight ? 0x1a3a48 : 0x2a6a78,
      roughness: 0.06,
      metalness: 0.06,
      transparent: true,
      opacity: 0.84,
      envMapIntensity: isNight ? 2.2 : 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      ior: 1.33,
      normalMap: nrm,
      normalScale: new THREE.Vector2(0.9, 0.9)
    }));
    const canalOff = built.width / 2 + 9 - 5.2;
    const canal = new THREE.Mesh(keep(buildStrip(built, canalOff, 2.2, -0.16)), canalMat);
    canal.receiveShadow = true;
    group.add(canal);
    waterMeshes.push(canal);
    waterMats.push(canalMat);
    const bankG = keep(new THREE.BoxGeometry(0.32, 1.35, 4.6));
    const bankM = keep(new THREE.MeshStandardMaterial({ color: 0xb4b0a6, roughness: 0.9, metalness: 0 }));
    const nBank = 110;
    const bankLats = [canalOff - 2.35, canalOff + 2.35];
    const banks = new THREE.InstancedMesh(bankG, bankM, nBank * 2);
    let bi = 0;
    const stepB = Math.max(1, Math.floor(built.samples.length / nBank));
    for (let i = 0; i < built.samples.length && bi < nBank * 2; i += stepB) {
      const s = built.samples[i];
      for (const lat of bankLats) {
        if (bi >= nBank * 2) break;
        _dummy.position.set(s.x + s.rx * lat, s.y + 0.55, s.z + s.rz * lat);
        _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        banks.setMatrixAt(bi++, _dummy.matrix);
      }
    }
    banks.count = bi;
    banks.instanceMatrix.needsUpdate = true;
    banks.castShadow = true;
    banks.receiveShadow = true;
    group.add(banks);
  }
  for (const zone of def.clearZones ?? []) {
    const grass = new THREE.Mesh(keep(new THREE.PlaneGeometry(zone.w, zone.d)), keep(new THREE.MeshStandardMaterial({
      color: def.theme === "park" || def.id === "manhattan" ? 3828292 : def.ground,
      roughness: 0.95,
      envMapIntensity: 0.2
    })));
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(zone.x, -0.28, zone.z);
    grass.receiveShadow = true;
    group.add(grass);
  }
  const needFacade = def.city === "nyc";
  const nycMod = needFacade ? await import("./nyc-canvas") : null;
  const facadeDay = nycMod ? keep(nycMod.facadeTexture(def.theme, false)) : null;
  const facadeNight = nycMod ? keep(nycMod.facadeTexture(def.theme, true)) : null;
  const facadeEmit = nycMod ? keep(nycMod.windowEmitTexture()) : null;
  const bGeo = keep(new THREE.BoxGeometry(1, 1, 1));
  bGeo.translate(0, 0.5, 0);
  const bMat = keep(new THREE.MeshStandardMaterial({
    map: !needFacade || def.theme === "jaffa" ? null : isNight ? facadeNight : facadeDay,
    emissive: new THREE.Color(!needFacade || def.theme === "jaffa" ? 0 : isNight ? 16763e3 : 0),
    emissiveMap: !needFacade || def.theme === "jaffa" ? null : facadeEmit,
    emissiveIntensity: !needFacade || def.theme === "jaffa" ? 0 : isNight ? def.theme === "manhattan" ? 2.6 : 1.35 : 0,
    roughness: def.theme === "jaffa" ? 0.86 : 0.68,
    metalness: isNight ? 0.16 : 0.08,
    envMapIntensity: isNight ? 0.95 : 0.5
  }));
  const canyon = def.id === "timessquare";
  const maxB = shadows ? def.theme === "manhattan" ? canyon ? 240 : 200 : 160 : def.theme === "manhattan" ? 280 : 220;
  const placements = [];
  const minX = def.id === "manhattan" ? -90 : -200;
  const maxX = def.id === "manhattan" ? 90 : 200;
  const minZ = def.id === "manhattan" ? -200 : -200;
  const maxZ = def.id === "manhattan" ? 200 : 200;
  const gap = def.theme === "desert" || def.theme === "highway" || def.theme === "snow" ? 18 : def.theme === "port" ? 16 : def.theme === "jaffa" ? 11 : def.theme === "manhattan" ? canyon ? 9 : 14 : def.theme === "park" ? 16 : 13;
  const inWater2 = (jx: number, jz: number) => {
    for (const w of bodies) if (Math.abs(jx - w.x) < w.w * 0.42 && Math.abs(jz - w.z) < w.d * 0.42) return true;
    return false;
  };
  const inClear2 = (jx: number, jz: number) => {
    for (const z of def.clearZones ?? []) if (Math.abs(jx - z.x) < z.w * 0.5 && Math.abs(jz - z.z) < z.d * 0.5) return true;
    return false;
  };
  if ((def.id === "hayarkon" || def.id === "namal" || def.id === "netanya" || def.id === "herzliya" || def.id === "eilat" || def.id === "batyam" || def.id === "ashkelon" || def.id === "nahariya" || def.id === "oldjaffa" || def.id === "gushdan") && bodies.length) {
    const trunkGeo2 = keep(new THREE.CylinderGeometry(0.16, 0.34, 8.2, 8));
    const trunkMat2 = keep(new THREE.MeshStandardMaterial({
      map: keep(barkTexture()),
      color: 0x5a4030,
      roughness: 0.92
    }));
    const frondGeo = keep(new THREE.ConeGeometry(0.42, 4.1, 6));
    frondGeo.translate(0, -1.75, 0);
    const crownMat = keep(new THREE.MeshStandardMaterial({
      map: keep(foliageTexture()),
      color: 0x3a7a32,
      roughness: 0.72,
      side: THREE.FrontSide,
      depthWrite: true
    }));
    const capGeo = keep(new THREE.SphereGeometry(0.55, 8, 6));
    const palmN = 28;
    const trunks2 = new THREE.InstancedMesh(trunkGeo2, trunkMat2, palmN);
    const fronds = new THREE.InstancedMesh(frondGeo, crownMat, palmN * 12);
    const caps = new THREE.InstancedMesh(capGeo, crownMat, palmN);
    trunks2.castShadow = shadows;
    fronds.castShadow = shadows;
    const w0 = bodies[0];
    let pc = 0;
    let fc = 0;
    const step2 = Math.max(4, Math.floor(built.samples.length / palmN));
    for (let i = 0; i < built.samples.length && pc < palmN; i += step2) {
      const s = built.samples[i];
      const d = built.width / 2 + 7.4;
      const side = Math.hypot(s.x + s.rx * d - w0.x, s.z + s.rz * d - w0.z) < Math.hypot(s.x - s.rx * d - w0.x, s.z - s.rz * d - w0.z) ? 1 : -1;
      const px = s.x + s.rx * d * side;
      const pz = s.z + s.rz * d * side;
      if (inWater2(px, pz) || inClear2(px, pz)) continue;
      _dummy.position.set(px, s.y + 4.1, pz);
      _dummy.scale.set(1, 1, 1);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      trunks2.setMatrixAt(pc, _dummy.matrix);
      _dummy.position.set(px, s.y + 8.05, pz);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      caps.setMatrixAt(pc, _dummy.matrix);
      for (let f = 0; f < 12; f++) {
        const a = f / 12 * Math.PI * 2;
        _dummy.position.set(px, s.y + 8.05, pz);
        _dummy.scale.set(0.95 + f % 3 * 0.1, 1, 1);
        _dummy.rotation.set(1.02, a, 0.1);
        _dummy.updateMatrix();
        fronds.setMatrixAt(fc, _dummy.matrix);
        fc++;
      }
      pc++;
    }
    trunks2.count = pc;
    fronds.count = fc;
    caps.count = pc;
    trunks2.instanceMatrix.needsUpdate = true;
    fronds.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
    group.add(trunks2, fronds, caps);
  }
  const heightAt = () => def.theme === "desert" ? 4 + rng() * 10 : def.theme === "jaffa" ? 3.4 + rng() * 4.2 : def.theme === "stone" ? 4.2 + rng() * 7.5 : def.theme === "carmel" ? 3.6 + rng() * 5.5 : def.theme === "port" ? 5 + rng() * 14 : def.theme === "highway" ? 16 + rng() * 38 : def.theme === "manhattan" ? 18 + rng() * 48 + (def.id === "timessquare" ? 8 : 0) : def.theme === "park" ? 14 + rng() * 26 : def.theme === "snow" ? 4 + rng() * 8 : 11 + rng() * 26;
  const step = def.theme === "highway" || def.theme === "desert" || def.theme === "snow" ? 14 : 7;
  let loopCx = 0;
  let loopCz = 0;
  for (const s of built.samples) {
    loopCx += s.x;
    loopCz += s.z;
  }
  loopCx /= built.samples.length;
  loopCz /= built.samples.length;
  for (let i = 0; i < built.samples.length && placements.length < maxB * 0.7; i += step) {
    if (def.city !== "nyc") break;
    const s = built.samples[i];
    if (s.y > 8) continue;
    for (const side of [-1, 1]) {
      const d = built.width / 2 + 16.5 + rng() * 2.2;
      const jx = s.x + s.rx * d * side;
      const jz = s.z + s.rz * d * side;
      if (inWater2(jx, jz) || inClear2(jx, jz)) continue;
      const alley = nearestStreet(jx, jz, streets);
      if (alley && alley.dist < alley.street.half + 6) continue;
      placements.push({
        x: jx,
        z: jz,
        y: s.y,
        sx: def.theme === "jaffa" ? 5.2 + rng() * 2.8 : def.theme === "manhattan" ? 10 + rng() * 6 : 10 + rng() * 4,
        sy: heightAt(),
        sz: def.theme === "jaffa" ? 5.2 + rng() * 2.6 : def.theme === "manhattan" ? 8 + rng() * 5 : 7 + rng() * 3,
        rot: Math.atan2(-s.rx * side, -s.rz * side)
      });
    }
  }
  for (let x = minX; x < maxX && placements.length < maxB; x += gap) for (let z = minZ; z < maxZ && placements.length < maxB; z += gap) {
    if (def.city !== "nyc") continue;
    const jx = x + (rng() - 0.5) * (def.theme === "manhattan" ? 3 : 6);
    const jz = z + (rng() - 0.5) * (def.theme === "manhattan" ? 3 : 6);
    if (inWater2(jx, jz)) continue;
    if (inClear2(jx, jz)) continue;
    const alley = nearestStreet(jx, jz, streets);
    if (alley && alley.dist < alley.street.half + (canyon ? 3.2 : 7)) continue;
    const near = nearestIndex(built.samples, jx, jz, 0);
    if (near.dist < built.width / 2 + (canyon ? 8 : 16)) continue;
    const t01 = near.index / built.samples.length;
    if ((t01 < 0.05 || t01 > 0.95) && near.dist < built.width / 2 + 16) continue;
    if (near.dist > (def.id === "manhattan" ? 90 : 140)) continue;
    const s = built.samples[near.index];
    placements.push({
      x: jx,
      z: jz,
      y: s.y,
      sx: def.theme === "jaffa" ? 4.8 + rng() * 2.4 : def.theme === "manhattan" ? 8 + rng() * 7 : 7 + rng() * 6,
      sy: heightAt(),
      sz: def.theme === "jaffa" ? 4.8 + rng() * 2.4 : def.theme === "manhattan" ? 8 + rng() * 7 : 7 + rng() * 6,
      rot: Math.atan2(s.x - jx, s.z - jz)
    });
  }
  const buildings = new THREE.InstancedMesh(bGeo, bMat, placements.length);
  buildings.castShadow = shadows;
  buildings.receiveShadow = true;
  buildings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const palette = def.theme === "stone" ? [
    13350810,
    12032632,
    13943460
  ] : def.theme === "desert" ? [
    14730394,
    13213808,
    14200954
  ] : def.theme === "carmel" ? [
    15656664,
    14274754,
    13156530
  ] : def.theme === "jaffa" ? [
    12096096,
    12886128,
    10910798,
    13808780,
    10120776
  ] : def.theme === "port" ? [
    13156532,
    11577496,
    10130056
  ] : def.theme === "highway" ? [
    15265522,
    13687008,
    15922936,
    13161692
  ] : def.theme === "manhattan" ? [
    13161696,
    10135732,
    14542058,
    6978184,
    15262940
  ] : def.theme === "park" ? [
    15261908,
    13945016,
    13154468,
    15789284
  ] : def.theme === "snow" ? [
    16054524,
    14739696,
    13687008
  ] : [
    15920868,
    15261906,
    14472390,
    16249578
  ];
  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    _dummy.position.set(p.x, p.y + p.sy * 0.5, p.z);
    _dummy.scale.set(p.sx, p.sy, p.sz);
    _dummy.rotation.set(0, p.rot, 0);
    _dummy.updateMatrix();
    buildings.setMatrixAt(i, _dummy.matrix);
    buildings.setColorAt(i, _color.setHex(palette[i % palette.length]));
  }
  buildings.instanceMatrix.needsUpdate = true;
  if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
  group.add(buildings);
  if (def.theme === "jaffa") {
    const roofGeo = keep(new THREE.ConeGeometry(1, 1, 4));
    const roofMat2 = keep(new THREE.MeshStandardMaterial({
      color: 10771002,
      roughness: 0.82,
      flatShading: true
    }));
    const roofs2 = new THREE.InstancedMesh(roofGeo, roofMat2, placements.length);
    for (let i = 0; i < placements.length; i++) {
      const p = placements[i];
      _dummy.position.set(p.x, p.y + p.sy + 1.1, p.z);
      _dummy.scale.set(p.sx * 0.78, 2.2, p.sz * 0.78);
      _dummy.rotation.set(0, p.rot + Math.PI / 4, 0);
      _dummy.updateMatrix();
      roofs2.setMatrixAt(i, _dummy.matrix);
    }
    roofs2.instanceMatrix.needsUpdate = true;
    group.add(roofs2);
  }
  const crownPlacements = def.city === "nyc" ? placements.filter((p) => p.sy > 16) : [];
  if (crownPlacements.length) {
    const crowns2 = new THREE.InstancedMesh(bGeo, bMat, crownPlacements.length);
    crowns2.castShadow = shadows;
    for (let i = 0; i < crownPlacements.length; i++) {
      const p = crownPlacements[i];
      const step2 = p.sy > 28 ? 0.62 : 0.74;
      const ch = Math.max(2.4, p.sy * 0.16);
      _dummy.position.set(p.x, p.y + p.sy + ch * 0.5, p.z);
      _dummy.scale.set(p.sx * step2, ch, p.sz * step2);
      _dummy.rotation.set(0, p.rot, 0);
      _dummy.updateMatrix();
      crowns2.setMatrixAt(i, _dummy.matrix);
      crowns2.setColorAt(i, _color.setHex(palette[i % palette.length]));
    }
    crowns2.instanceMatrix.needsUpdate = true;
    if (crowns2.instanceColor) crowns2.instanceColor.needsUpdate = true;
    group.add(crowns2);
  }
  const winGeo = keep(new THREE.PlaneGeometry(0.82, 1.18));
  const facadeWinMat = keep(new THREE.MeshStandardMaterial({
    color: 6985904,
    emissive: 16760944,
    emissiveIntensity: isNight ? 0.82 : 0.02,
    roughness: 0.16,
    metalness: 0.58,
    envMapIntensity: 1.45,
    side: 2
  }));
  const maxWin = Math.min(placements.length * 28, 1800);
  const wins = new THREE.InstancedMesh(winGeo, facadeWinMat, maxWin);
  const _off = new THREE.Vector3();
  let wi = 0;
  const faces = [
    {
      ax: 0,
      az: 1,
      yaw: 0
    },
    {
      ax: 0,
      az: -1,
      yaw: Math.PI
    },
    {
      ax: 1,
      az: 0,
      yaw: Math.PI / 2
    },
    {
      ax: -1,
      az: 0,
      yaw: -Math.PI / 2
    }
  ];
  for (let i = 0; i < placements.length && wi < maxWin; i++) {
    const p = placements[i];
    const floors = Math.max(1, Math.min(8, Math.floor(p.sy / 3.4)));
    for (const face of faces) {
      const along = face.ax !== 0 ? p.sz : p.sx;
      const cols = along > 9 ? 3 : along > 6 ? 2 : 1;
      const depth = (face.ax !== 0 ? p.sx : p.sz) * 0.51 + 0.04;
      for (let f = 0; f < floors && wi < maxWin; f++) for (let c = 0; c < cols && wi < maxWin; c++) {
        const slide = (c - (cols - 1) * 0.5) * Math.min(2.2, along * 0.28);
        const lx = face.ax * depth + (face.az !== 0 ? slide : 0);
        const lz = face.az * depth + (face.ax !== 0 ? slide : 0);
        const ly = 1.5 + f * 3.1;
        _dummy.position.set(p.x, p.y, p.z);
        _dummy.rotation.set(0, p.rot, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        _off.set(lx, ly, lz).applyMatrix4(_dummy.matrix);
        _dummy.position.copy(_off);
        _dummy.rotation.set(0, p.rot + face.yaw, 0);
        _dummy.updateMatrix();
        wins.setMatrixAt(wi++, _dummy.matrix);
      }
    }
  }
  wins.count = wi;
  wins.instanceMatrix.needsUpdate = true;
  group.add(wins);
  const roofMat = keep(new THREE.MeshStandardMaterial({
    color: isNight ? 3815476 : 6972508,
    roughness: 0.88,
    metalness: 0.08,
    envMapIntensity: 0.35
  }));
  const roofs = new THREE.InstancedMesh(bGeo, roofMat, placements.length);
  roofs.receiveShadow = true;
  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    _dummy.position.set(p.x, p.y + p.sy + 0.12, p.z);
    _dummy.scale.set(p.sx * 1.04, 0.24, p.sz * 1.04);
    _dummy.rotation.set(0, p.rot, 0);
    _dummy.updateMatrix();
    roofs.setMatrixAt(i, _dummy.matrix);
  }
  roofs.instanceMatrix.needsUpdate = true;
  group.add(roofs);
  const nyc = def.theme === "manhattan" || def.theme === "park";
  const tankGeo = keep(new THREE.CylinderGeometry(nyc ? 0.7 : 0.45, nyc ? 0.75 : 0.45, nyc ? 1.1 : 0.7, 8));
  const tankMat = keep(new THREE.MeshPhysicalMaterial({
    color: nyc ? 9071176 : 14212320,
    metalness: nyc ? 0.12 : 0.72,
    roughness: nyc ? 0.72 : 0.28,
    envMapIntensity: 1.1
  }));
  const tanks = new THREE.InstancedMesh(tankGeo, tankMat, def.theme === "jaffa" || def.theme === "carmel" || def.theme === "stone" ? 0 : Math.min(placements.length, nyc ? 70 : 90));
  for (let i = 0; i < tanks.count; i++) {
    const p = placements[i];
    _dummy.position.set(p.x + 1.1, p.y + p.sy + (nyc ? 0.6 : 0.4), p.z);
    _dummy.scale.set(1, 1, 1);
    _dummy.rotation.set(0, 0, 0);
    _dummy.updateMatrix();
    tanks.setMatrixAt(i, _dummy.matrix);
  }
  group.add(tanks);
  let farMesh: THREE.InstancedMesh | null = null;
  if ((def.city === "nyc" || def.theme === "carmel" || def.theme === "stone" || def.id === "hermon" || def.id === "hw1") && def.id !== "deadsea" && def.id !== "hayarkon" && def.id !== "ayalon" && def.id !== "ramon") {
    const tid = def.id as string;
    const natureHill = def.theme === "jaffa" || def.theme === "carmel" || tid === "hermon" || def.theme === "stone" || tid === "hw1";
    const farN = def.theme === "manhattan" ? 48 : natureHill ? 44 : 36;
    const farGeo = keep(natureHill ? new THREE.ConeGeometry(1, 1, 6) : new THREE.BoxGeometry(1, 1, 1));
    if (!natureHill) farGeo.translate(0, 0.5, 0);
    const farMat = keep(new THREE.MeshStandardMaterial({
      color: isNight ? 1713202 : tid === "ramon" ? 11565642 : tid === "hermon" ? 15265524 : def.theme === "carmel" || tid === "hw1" ? 4020788 : def.theme === "stone" ? 12890250 : 12103844,
      roughness: 0.92,
      metalness: 0.04,
      envMapIntensity: isNight ? 0.35 : 0.22,
      flatShading: true
    }));
    const far = new THREE.InstancedMesh(farGeo, farMat, farN);
    for (let i = 0; i < farN; i++) {
      const a = i / farN * Math.PI * 2 + 0.07;
      const r = tid === "ramon" || tid === "hermon" ? span * 1.45 + i % 6 * 70 : def.theme === "stone" || tid === "hw1" ? span * 1.55 + i % 6 * 55 : span * 1.15 + i % 6 * 28;
      const h = tid === "ramon" ? 52 + i % 6 * 22 : tid === "hermon" ? 64 + i % 5 * 26 : def.theme === "carmel" || tid === "hw1" ? 38 + i % 6 * 16 : def.theme === "stone" ? 36 + i % 5 * 18 : 22 + i % 8 * 16 + (def.theme === "manhattan" ? 28 : 0);
      _dummy.position.set(Math.cos(a) * r, natureHill ? h * 0.18 : 0, Math.sin(a) * r);
      _dummy.scale.set(tid === "ramon" ? 42 + i % 4 * 14 : tid === "hermon" ? 38 + i % 4 * 12 : def.theme === "carmel" || tid === "hw1" ? 32 + i % 4 * 12 : def.theme === "stone" ? 38 + i % 4 * 14 : 16 + i % 4 * 7, h, tid === "ramon" ? 36 : tid === "hermon" ? 32 : def.theme === "carmel" || tid === "hw1" ? 28 : def.theme === "stone" ? 32 : 12 + i % 3 * 5);
      _dummy.rotation.set(0, a, 0);
      _dummy.updateMatrix();
      far.setMatrixAt(i, _dummy.matrix);
    }
    far.instanceMatrix.needsUpdate = true;
    farMesh = far;
    group.add(far);
  }
  const deciduous = nyc;
  const stoneHill = def.theme === "stone";
  const pine = def.theme === "carmel" || def.id === "hermon" || def.id === "hw1";
  const acacia = def.theme === "desert" && def.id !== "ramon";
  const ficusStreet = (def.theme === "bauhaus" || def.id === "telaviv" || def.id === "namal" || def.id === "hayarkon") && def.id !== "ayalon" && def.id !== "rothschild";
  const trunkGeo = keep(new THREE.CylinderGeometry(pine ? 0.22 : acacia ? 0.16 : stoneHill ? 0.14 : ficusStreet ? 0.42 : deciduous ? 0.22 : 0.16, pine ? 0.38 : acacia ? 0.28 : stoneHill ? 0.22 : ficusStreet ? 0.62 : deciduous ? 0.34 : 0.26, pine ? 7.4 : acacia ? 3.6 : stoneHill ? 3.2 : ficusStreet ? 7.2 : deciduous ? 5.2 : 4.6, 8));
  trunkGeo.translate(0, pine ? 3.7 : acacia ? 1.8 : stoneHill ? 1.6 : ficusStreet ? 3.6 : deciduous ? 2.6 : 2.3, 0);
  const trunkMat = keep(new THREE.MeshStandardMaterial({
    map: keep(barkTexture()),
    color: pine ? 0x6a5840 : acacia ? 0x8a6a48 : stoneHill ? 0x6e5840 : 0x8a6a4e,
    roughness: 0.92,
    envMapIntensity: 0.18
  }));
  const crownGeo = keep(pine || stoneHill ? new THREE.ConeGeometry(pine ? 2.15 : 1.15, pine ? 5.6 : 7.6, 8) : acacia ? new THREE.ConeGeometry(3.4, 1.6, 8) : new THREE.SphereGeometry(ficusStreet ? 2.15 : 1.7, 8, 6));
  const frondMat = keep(new THREE.MeshStandardMaterial({
    map: keep(foliageTexture()),
    color: pine ? def.id === "hermon" ? 2449952 : 1853992 : acacia ? 6982200 : stoneHill ? 1853992 : def.theme === "park" ? 3832386 : 3107386,
    roughness: 0.86,
    envMapIntensity: 0.28,
    flatShading: pine || stoneHill,
    side: THREE.FrontSide,
    depthWrite: true
  }));
  const treeSpots = [];
  if ((pine || stoneHill || acacia || ficusStreet || nyc) && def.id !== "timessquare" && def.id !== "ramon") {
    const stepT = pine ? 5 : acacia ? 7 : ficusStreet ? 8 : stoneHill ? 6 : deciduous ? 8 : 6;
    for (let i = 0; i < built.samples.length; i += stepT) {
      const s = built.samples[i];
      if (!pine && !acacia && s.y > 14) continue;
      for (const side of pine || acacia ? [-1, 1] : [i % 12 === 0 ? 1 : -1]) {
        const d = built.width / 2 + (pine ? 14 + i % 5 * 4.2 : acacia ? 12 + i % 4 * 4 : ficusStreet ? 12.5 : stoneHill ? 16 : 7.2);
        treeSpots.push({
          x: s.x + s.rx * d * side,
          z: s.z + s.rz * d * side,
          y: s.y
        });
      }
    }
  }
  if (def.theme === "park") for (let x = -40; x <= 40; x += 14) for (let z = -100; z <= 120; z += 14) {
    if (inWater2(x, z)) continue;
    if (nearestIndex(built.samples, x, z, 0).dist < built.width / 2 + 6) continue;
    treeSpots.push({
      x: x + (rng() - 0.5) * 6,
      z: z + (rng() - 0.5) * 6,
      y: 0
    });
  }
  if (pine) {
    const forestR = def.id === "hw1" ? 380 : 180;
    const forestStep = def.id === "hw1" ? 28 : 24;
    for (let x = -forestR; x <= forestR; x += forestStep) for (let z = -forestR; z <= forestR; z += forestStep) {
      if (inWater2(x, z)) continue;
      const near = nearestIndex(built.samples, x, z, 0);
      if (near.dist < built.width / 2 + 16) continue;
      const s = built.samples[near.index];
      treeSpots.push({
        x: x + (rng() - 0.5) * 8,
        z: z + (rng() - 0.5) * 8,
        y: s.y * 0.72
      });
    }
  }
  if (def.id === "manhattan") for (let x = -22; x <= 22; x += 12) for (let z = 52; z <= 124; z += 12) {
    if (inWater2(x, z)) continue;
    treeSpots.push({
      x: x + (rng() - 0.5) * 4,
      z: z + (rng() - 0.5) * 4,
      y: 0
    });
  }
  if (def.id === "ayalon") {
    for (let i = 0; i < built.samples.length; i += 11) {
      const s = built.samples[i];
      const d = built.width / 2 + 38;
      treeSpots.push({
        x: s.x + s.rx * d,
        z: s.z + s.rz * d,
        y: s.y
      });
    }
  }
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeSpots.length);
  const pineLayers = pine ? 3 : 1;
  const crowns = new THREE.InstancedMesh(crownGeo, frondMat, pine || stoneHill || acacia ? treeSpots.length * pineLayers : treeSpots.length * (ficusStreet ? 6 : 5));
  lodTrunks = trunks;
  lodCrowns = crowns;
  trunks.castShadow = shadows;
  crowns.castShadow = shadows;
  let ci = 0;
  const snowCapMat = keep(new THREE.MeshStandardMaterial({
    color: 15921906,
    roughness: 0.88,
    flatShading: true
  }));
  const snowCaps = pine && def.id === "hermon" && treeSpots.length ? new THREE.InstancedMesh(crownGeo, snowCapMat, treeSpots.length) : null;
  let si = 0;
  for (let i = 0; i < treeSpots.length; i++) {
    const t = treeSpots[i];
    const h = 1 + rng() * 0.45;
    _dummy.position.set(t.x, t.y, t.z);
    _dummy.scale.set(1, h, 1);
    _dummy.rotation.set(0, rng() * 6, 0);
    _dummy.updateMatrix();
    trunks.setMatrixAt(i, _dummy.matrix);
    if (pine || stoneHill) {
      if (pine) {
        for (let L = 0; L < 3; L++) {
          _dummy.position.set(t.x, t.y + (4.6 + L * 2.55) * h, t.z);
          const sc = 1.28 - L * 0.28 + rng() * 0.12;
          _dummy.scale.set(sc, h * 0.72, sc);
          _dummy.updateMatrix();
          crowns.setMatrixAt(ci, _dummy.matrix);
          ci++;
        }
        if (snowCaps && t.y > 36) {
          _dummy.position.set(t.x, t.y + 11.4 * h, t.z);
          _dummy.scale.set(0.55, h * 0.42, 0.55);
          _dummy.updateMatrix();
          snowCaps.setMatrixAt(si++, _dummy.matrix);
        }
      } else {
        _dummy.position.set(t.x, t.y + 5.4 * h, t.z);
        _dummy.scale.set(0.85 + rng() * 0.35, h, 0.85 + rng() * 0.35);
        _dummy.updateMatrix();
        crowns.setMatrixAt(ci, _dummy.matrix);
        ci++;
      }
    } else if (acacia) {
      _dummy.position.set(t.x, t.y + 4.1 * h, t.z);
      _dummy.scale.set(1.15 + rng() * 0.4, 0.55, 1.15 + rng() * 0.4);
      _dummy.updateMatrix();
      crowns.setMatrixAt(ci, _dummy.matrix);
      ci++;
    } else {
      const top = t.y + (ficusStreet ? 6.8 : 4.8) * h;
      const blobs = ficusStreet
        ? [[0, 0, 0, 1.22], [1.25, 0.35, 0.5, 0.88], [-1.15, 0.3, -0.55, 0.84], [0.25, 0.95, -0.2, 0.76], [0.85, -0.15, -1.0, 0.7], [-0.9, -0.1, 0.95, 0.7]] as const
        : [[0, 0, 0, 1.08], [0.82, 0.32, 0.42, 0.78], [-0.68, 0.26, -0.48, 0.74], [0.15, 0.72, -0.12, 0.62], [0.55, -0.18, -0.7, 0.58]] as const;
      for (const [dx, dy, dz, sc] of blobs) {
        _dummy.position.set(t.x + dx, top + dy * h, t.z + dz);
        _dummy.scale.set(sc, sc * 0.86 * h, sc);
        _dummy.rotation.set(0, 0, 0);
        _dummy.updateMatrix();
        crowns.setMatrixAt(ci, _dummy.matrix);
        ci++;
      }
    }
  }
  trunks.instanceMatrix.needsUpdate = true;
  crowns.count = ci;
  crowns.instanceMatrix.needsUpdate = true;
  if (treeSpots.length) group.add(trunks, crowns);
  if (treeSpots.length && def.theme !== "desert" && def.id !== "timessquare") {
    const nBill = Math.min(36, treeSpots.length);
    const billG = keep(new THREE.PlaneGeometry(6.4, 7.6));
    const billM = keep(new THREE.MeshBasicMaterial({
      map: keep(foliageTexture()),
      transparent: true,
      alphaTest: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false
    }));
    const bills = new THREE.InstancedMesh(billG, billM, nBill * 2);
    let bi = 0;
    const stepB = Math.max(1, Math.floor(treeSpots.length / nBill));
    for (let i = 0; i < treeSpots.length && bi < nBill * 2; i += stepB) {
      const t = treeSpots[i];
      const ox = t.x + (i % 2 ? 16 : -16);
      const oz = t.z + (i % 3 ? 10 : -10);
      _dummy.position.set(ox, t.y + 3.6, oz);
      _dummy.scale.set(1, 1, 1);
      _dummy.rotation.set(0, 0.4, 0);
      _dummy.updateMatrix();
      bills.setMatrixAt(bi++, _dummy.matrix);
      _dummy.rotation.set(0, 0.4 + Math.PI / 2, 0);
      _dummy.updateMatrix();
      bills.setMatrixAt(bi++, _dummy.matrix);
    }
    bills.count = bi;
    bills.instanceMatrix.needsUpdate = true;
    group.add(bills);
    lodBills = bills;
  }
  if (snowCaps) {
    snowCaps.count = si;
    snowCaps.instanceMatrix.needsUpdate = true;
    if (si) group.add(snowCaps);
  }
  if (treeSpots.length) {
    const shadGeo = keep(new THREE.CircleGeometry(2.4, 10));
    shadGeo.rotateX(-Math.PI / 2);
    const shadMat = keep(new THREE.MeshBasicMaterial({
      color: 329224,
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    }));
    const shads = new THREE.InstancedMesh(shadGeo, shadMat, treeSpots.length);
    for (let i = 0; i < treeSpots.length; i++) {
      const t = treeSpots[i];
      _dummy.position.set(t.x, t.y + 0.04, t.z);
      _dummy.scale.set(ficusStreet ? 1.6 : acacia ? 1.4 : 1, 1, ficusStreet ? 1.6 : 1);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      shads.setMatrixAt(i, _dummy.matrix);
    }
    shads.instanceMatrix.needsUpdate = true;
    group.add(shads);
    lodShads = shads;
  }
  if (def.theme === "desert" || def.id === "ramon") {
    const rockGeo = keep(new THREE.DodecahedronGeometry(1.2, 0));
    const rockMat = keep(new THREE.MeshStandardMaterial({
      color: def.id === "ramon" ? 11037242 : 12886128,
      roughness: 0.96,
      flatShading: true
    }));
    const rockN = 80;
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockN);
    rocks.castShadow = shadows;
    let ri = 0;
    for (let i = 0; i < built.samples.length && ri < rockN; i += Math.max(2, Math.floor(built.samples.length / 40))) {
      const s = built.samples[i];
      const side = ri % 2 ? 1 : -1;
      const d = built.width / 2 + 14 + ri % 5 * 5;
      _dummy.position.set(s.x + s.rx * d * side, s.y + 0.4, s.z + s.rz * d * side);
      const sc = 0.8 + ri % 4 * 0.55;
      _dummy.scale.set(sc, sc * (0.5 + ri % 3 * 0.25), sc);
      _dummy.rotation.set(rng() * 1.2, rng() * 6, rng() * 0.6);
      _dummy.updateMatrix();
      rocks.setMatrixAt(ri++, _dummy.matrix);
    }
    rocks.count = ri;
    rocks.instanceMatrix.needsUpdate = true;
    group.add(rocks);
  }
  const poleGeo = keep(new THREE.CylinderGeometry(0.07, 0.09, 5.2, 5));
  poleGeo.translate(0, 2.6, 0);
  const poleMat = keep(new THREE.MeshStandardMaterial({
    color: 2764338,
    metalness: 0,
    roughness: 0.62,
    envMapIntensity: 0.5
  }));
  const bulbGeo = keep(new THREE.SphereGeometry(0.18, 8, 8));
  const bulbMat = keep(new THREE.MeshPhysicalMaterial({
    color: 15920864,
    emissive: isNight ? 16760944 : 2236962,
    emissiveIntensity: isNight ? 6.2 : 0.1,
    roughness: 0.22,
    metalness: 0.05
  }));
  const haloGeo = keep(new THREE.SphereGeometry(0.95, 8, 8));
  const haloMat = keep(new THREE.MeshBasicMaterial({
    color: 16760944,
    transparent: true,
    opacity: isNight ? 0.78 : 0,
    blending: 2,
    depthWrite: false
  }));
  const lampCount = def.id === "ramon" || def.id === "hermon" ? 0 : def.id === "ayalon" ? Math.floor(built.samples.length / 8) : def.id === "hw1" || def.id === "hw2" || def.id === "hw6" ? Math.floor(built.samples.length / 16) : def.theme === "carmel" ? Math.floor(built.samples.length / 18) : Math.floor(built.samples.length / 10);
  const lampStride = Math.max(1, Math.floor(built.samples.length / Math.max(1, lampCount)));
  const poles = new THREE.InstancedMesh(poleGeo, poleMat, Math.max(1, lampCount));
  const bulbs = new THREE.InstancedMesh(bulbGeo, bulbMat, Math.max(1, lampCount));
  const halos = new THREE.InstancedMesh(haloGeo, haloMat, Math.max(1, lampCount));
  const lampPos: THREE.Vector3[] = [];
  for (let i = 0; i < lampCount; i++) {
    const s = built.samples[(i * lampStride) % built.samples.length];
    const side = i % 2 === 0 ? 1 : -1;
    const d = built.width / 2 + 2.7;
    const lx = s.x + s.rx * d * side;
    const lz = s.z + s.rz * d * side;
    lampPos.push(new THREE.Vector3(lx, s.y + 5.15, lz));
    _dummy.position.set(lx, s.y, lz);
    _dummy.scale.set(1, 1, 1);
    _dummy.rotation.set(0, 0, 0);
    _dummy.updateMatrix();
    poles.setMatrixAt(i, _dummy.matrix);
    _dummy.position.y = s.y + 5.15;
    _dummy.updateMatrix();
    bulbs.setMatrixAt(i, _dummy.matrix);
    _dummy.scale.set(1.15, 1.15, 1.15);
    halos.setMatrixAt(i, _dummy.matrix);
  }
  if (lampCount) group.add(poles, bulbs, halos);
  const poolGeo = keep(new THREE.CircleGeometry(7.2, 20));
  poolGeo.rotateX(-Math.PI / 2);
  const poolMat = keep(new THREE.MeshBasicMaterial({
    color: 0xffc070,
    transparent: true,
    opacity: isNight ? 0.58 : 0,
    blending: 2,
    depthWrite: false
  }));
  const pools = new THREE.InstancedMesh(poolGeo, poolMat, Math.max(1, lampCount));
  pools.renderOrder = 2;
  for (let i = 0; i < lampCount; i++) {
    const s = built.samples[(i * lampStride) % built.samples.length];
    const p = lampPos[i];
    _dummy.position.set(p.x, s.y + 0.055, p.z);
    _dummy.scale.set(1.35, 1, 1.15);
    _dummy.rotation.set(0, 0, 0);
    _dummy.updateMatrix();
    pools.setMatrixAt(i, _dummy.matrix);
  }
  pools.visible = isNight && lampCount > 0;
  if (lampCount) group.add(pools);
  if (def.id === "ayalon" && lampCount) {
    const oppOff = built.width + 18;
    const poles2 = new THREE.InstancedMesh(poleGeo, poleMat, lampCount);
    const bulbs2 = new THREE.InstancedMesh(bulbGeo, bulbMat, lampCount);
    const pools2 = new THREE.InstancedMesh(poolGeo, poolMat, lampCount);
    pools2.renderOrder = 2;
    const d = oppOff + built.width / 2 + 2.7;
    for (let i = 0; i < lampCount; i++) {
      const s = built.samples[(i * lampStride + Math.floor(lampStride / 2)) % built.samples.length];
      const lx = s.x + s.rx * d;
      const lz = s.z + s.rz * d;
      _dummy.position.set(lx, s.y, lz);
      _dummy.scale.set(1, 1, 1);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      poles2.setMatrixAt(i, _dummy.matrix);
      _dummy.position.y = s.y + 5.15;
      _dummy.updateMatrix();
      bulbs2.setMatrixAt(i, _dummy.matrix);
      _dummy.position.y = s.y + 0.055;
      _dummy.scale.set(1.35, 1, 1.15);
      _dummy.updateMatrix();
      pools2.setMatrixAt(i, _dummy.matrix);
    }
    poles2.instanceMatrix.needsUpdate = true;
    bulbs2.instanceMatrix.needsUpdate = true;
    pools2.instanceMatrix.needsUpdate = true;
    pools2.visible = isNight;
    group.add(poles2, bulbs2, pools2);
  }
  const natureTrack = def.id === "ramon" || def.id === "hermon" || def.theme === "carmel" || def.theme === "desert" || def.theme === "snow" || def.id === "hw1" || def.id === "hw2" || def.id === "hw6";
  const crowdN = natureTrack || def.id === "ayalon" || def.id === "rothschild" || def.id === "hayarkon" || def.id === "oldjaffa" || def.id === "jerusalem" ? 0 : shadows ? 72 : 28;
  if (crowdN) {
    const bodyGeo = keep(new THREE.BoxGeometry(0.42, 0.95, 0.32));
    const headGeo = keep(new THREE.SphereGeometry(0.16, 6, 5));
    const crowdMat = keep(new THREE.MeshStandardMaterial({
      color: 2764340,
      roughness: 0.85,
      metalness: 0.05
    }));
    const shirtMat = keep(new THREE.MeshStandardMaterial({
      color: 7260356,
      roughness: 0.7
    }));
    const crowdBodies = new THREE.InstancedMesh(bodyGeo, crowdMat, crowdN);
    const shirts = new THREE.InstancedMesh(bodyGeo, shirtMat, Math.max(1, Math.floor(crowdN / 3)));
    const heads = new THREE.InstancedMesh(headGeo, keep(new THREE.MeshStandardMaterial({
      color: 12886138,
      roughness: 0.7
    })), crowdN);
    let shirtI = 0;
    for (let i = 0; i < crowdN; i++) {
      const s = built.samples[(i * 11 + 4) % built.samples.length];
      const side = i % 2 === 0 ? 1 : -1;
      const d = built.width / 2 + 2.35 + i % 5 * 0.18;
      const x = s.x + s.rx * d * side;
      const z = s.z + s.rz * d * side;
      const y = s.y + 0.55;
      const yaw = Math.atan2(-s.rx * side, -s.rz * side);
      _dummy.position.set(x, y, z);
      _dummy.rotation.set(0, yaw, 0);
      _dummy.scale.set(1, 0.9 + i % 4 * 0.08, 1);
      _dummy.updateMatrix();
      crowdBodies.setMatrixAt(i, _dummy.matrix);
      _dummy.position.y = y + 0.62;
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      heads.setMatrixAt(i, _dummy.matrix);
      if (i % 3 === 0 && shirtI < shirts.count) {
        _dummy.position.set(x, y, z);
        _dummy.scale.set(1.05, 0.92, 1.05);
        _dummy.updateMatrix();
        shirts.setMatrixAt(shirtI, _dummy.matrix);
        shirtI += 1;
      }
    }
    shirts.count = shirtI;
    group.add(crowdBodies, shirts, heads);
  }
  const boardGeo = keep(new THREE.BoxGeometry(8.5, 4.2, 0.22));
  const postGeo = keep(new THREE.BoxGeometry(0.22, 5.4, 0.22));
  const postMat = keep(new THREE.MeshStandardMaterial({
    color: 2764338,
    metalness: 0,
    roughness: 0.5
  }));
  const ads = [
    {
      bg: "#163048",
      fg: "#f2eee8",
      t: "RUSH"
    },
    {
      bg: "#1a3a6a",
      fg: "#6ec8c4",
      t: "PULSE 101"
    },
    {
      bg: "#2a8f8a",
      fg: "#f2eee8",
      t: "\u05D9\u05E4\u05D5"
    },
    {
      bg: "#1c1c1c",
      fg: "#f5c400",
      t: "TLV"
    }
  ];
  if (def.city === "nyc" && nycMod) for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];
    const tex = keep(nycMod.adBoardTexture(ad.bg, ad.fg, ad.t));
    const mat = keep(new THREE.MeshStandardMaterial({
      map: tex,
      emissive: new THREE.Color(ad.fg),
      emissiveIntensity: isNight ? 0.45 : 0.08,
      roughness: 0.45
    }));
    const s = built.samples[Math.floor(built.samples.length * (0.18 + i * 0.2)) % built.samples.length];
    const side = i % 2 === 0 ? 1 : -1;
    const d = built.width / 2 + 7.5;
    const x = s.x + s.rx * d * side;
    const z = s.z + s.rz * d * side;
    const board = new THREE.Mesh(boardGeo, mat);
    board.position.set(x, s.y + 4.4, z);
    board.lookAt(s.x, s.y + 3.2, s.z);
    group.add(board);
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(x, s.y + 2.6, z);
    group.add(post);
  }
  const nightLights: THREE.SpotLight[] = [];
  if (shadows) for (let i = 0; i < 10; i++) {
    const src = lampPos[i] ?? new THREE.Vector3();
    const spot = new THREE.SpotLight(0xffc070, isNight ? 200 : 0, 44, 0.9, 0.65, 1.2);
    spot.position.copy(src);
    spot.target.position.set(src.x, src.y - 5.2, src.z);
    spot.castShadow = false;
    group.add(spot, spot.target);
    nightLights.push(spot);
  }
  const puddleGeo = keep(new THREE.CircleGeometry(1.8, 10));
  puddleGeo.rotateX(-Math.PI / 2);
  const puddleMat = keep(new THREE.MeshPhysicalMaterial({
    color: 1843752,
    roughness: 0.04,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.6,
    transparent: true,
    opacity: 0.78
  }));
  const puddleN = 26;
  const puddlePos: { x: number; y: number; z: number; sx: number; sz: number; rot: number }[] = [];
  const puddles = new THREE.InstancedMesh(puddleGeo, puddleMat, puddleN);
  for (let i = 0; i < puddleN; i++) {
    const s = built.samples[Math.floor(i / puddleN * built.samples.length) % built.samples.length];
    const lat = (rng() - 0.5) * built.width * 0.72;
    const sc = 0.65 + rng() * 1.5;
    const rot = rng() * 6;
    puddlePos.push({
      x: s.x + s.rx * lat,
      y: s.y + 0.07,
      z: s.z + s.rz * lat,
      sx: sc,
      sz: sc * 0.5,
      rot
    });
    _dummy.position.set(puddlePos[i].x, puddlePos[i].y, puddlePos[i].z);
    _dummy.scale.set(sc, 1, sc * 0.5);
    _dummy.rotation.set(0, rot, 0);
    _dummy.updateMatrix();
    puddles.setMatrixAt(i, _dummy.matrix);
  }
  puddles.visible = isNight || wx !== "clear";
  group.add(puddles);
  lodPuddles = puddles;
  const neonGroup = new THREE.Group();
  neonGroup.visible = isNight;
  const neonGeo = keep(new THREE.BoxGeometry(3.4, 0.55, 0.1));
  const neonMats = [
    keep(new THREE.MeshBasicMaterial({ color: 7260356 })),
    keep(new THREE.MeshBasicMaterial({ color: 16731533 })),
    keep(new THREE.MeshBasicMaterial({ color: 16761165 }))
  ];
  const neonStep = Math.max(def.id === "timessquare" ? 7 : 18, Math.floor(built.samples.length / 22));
  for (let i = 0; i < built.samples.length; i += neonStep) {
    const s = built.samples[i];
    const side = i % (neonStep * 2) === 0 ? 1 : -1;
    const mesh = new THREE.Mesh(neonGeo, neonMats[i % 3]);
    mesh.position.set(s.x + s.rx * (built.width / 2 + 6.2) * side, s.y + 8 + rng() * 10, s.z + s.rz * (built.width / 2 + 6.2) * side);
    mesh.rotation.y = Math.atan2(s.tx, s.tz) + Math.PI / 2;
    neonGroup.add(mesh);
  }
  group.add(neonGroup);
  const neonLights: THREE.PointLight[] = [];
  if (shadows) for (let i = 0; i < Math.min(2, neonGroup.children.length); i++) {
    const src = neonGroup.children[i * 2];
    const col = neonMats[i % 3].color;
    const pl = new THREE.PointLight(col.getHex(), isNight ? 42 : 0, 16, 2);
    if (src) pl.position.copy(src.position);
    group.add(pl);
    neonLights.push(pl);
  }
  const landmarkGlows: Glow[] = [];
  const emitList: Emit[] = [];
  emitList.push({
    mat: facadeWinMat as THREE.MeshStandardMaterial,
    night: 0.82,
    day: 0.02
  });
  const colliders: Collider[] = [];
  const movers: Mover[] = [];
  addLandmarks(group, def, bag, shadows, isNight, landmarkGlows, emitList, colliders, movers, ramps, streets, built);
  if (def.city === "nyc") {
    const nycLand = await import("./nyc-landmarks");
    nycLand.addNycLandmarks(group, def, bag, shadows, isNight, landmarkGlows, emitList, colliders);
  }
  const edgeStep = Math.max(3, Math.floor(built.samples.length / 360));
  const wallD = built.width / 2 + 1.55;
  for (let i = 0; i < built.samples.length; i += edgeStep) {
    const s = built.samples[i];
    colliders.push({
      x: s.x + s.rx * wallD,
      z: s.z + s.rz * wallD,
      r: 0.62,
      kind: "barrier"
    });
    colliders.push({
      x: s.x - s.rx * wallD,
      z: s.z - s.rz * wallD,
      r: 1.05,
      kind: "barrier"
    });
  }
  let bHits = 0;
  for (const p of placements) {
    if (bHits >= 80) break;
    if (nearestIndex(built.samples, p.x, p.z, 0).dist < built.width / 2 + 8) continue;
    colliders.push({
      x: p.x,
      z: p.z,
      r: Math.max(p.sx, p.sz) * 0.42,
      kind: "building"
    });
    bHits += 1;
  }
  const start = built.samples[0];
  const stripe = new THREE.Mesh(keep(new THREE.BoxGeometry(built.width, 0.05, 1.8)), keep(new THREE.MeshStandardMaterial({
    map: keep(checkerTexture()),
    roughness: 0.45,
    metalness: 0.08
  })));
  stripe.position.set(start.x, start.y + 0.08, start.z);
  stripe.rotation.y = Math.atan2(start.tx, start.tz);
  group.add(stripe);
  if (def.open) {
    const fin = built.samples[built.samples.length - 1];
    const finish = new THREE.Mesh(keep(new THREE.BoxGeometry(built.width, 0.05, 1.8)), keep(new THREE.MeshStandardMaterial({
      map: keep(checkerTexture()),
      roughness: 0.45,
      metalness: 0.08
    })));
    finish.position.set(fin.x, fin.y + 0.08, fin.z);
    finish.rotation.y = Math.atan2(fin.tx, fin.tz);
    group.add(finish);
  }
  const gatePoleMat = keep(new THREE.MeshStandardMaterial({
    color: 1842724,
    roughness: 0.42,
    metalness: 0
  }));
  const startMat = keep(new THREE.MeshBasicMaterial({ color: 16250094 }));
  const cpMat = keep(new THREE.MeshBasicMaterial({ color: 6283476 }));
  for (let i = 0; i < built.checkpoints.length; i++) {
    const t = built.checkpoints[i];
    const s = built.samples[Math.floor(t * built.samples.length) % built.samples.length];
    const startGate = i === 0;
    const h = startGate ? 8.4 : 6.4;
    const half = built.width * 0.56;
    for (const side of [-1, 1]) {
      const pole = new THREE.Mesh(keep(new THREE.BoxGeometry(0.28, h, 0.28)), gatePoleMat);
      pole.position.set(s.x + s.rx * half * side, s.y + h * 0.5, s.z + s.rz * half * side);
      pole.castShadow = shadows;
      group.add(pole);
    }
    const beam = new THREE.Mesh(keep(new THREE.BoxGeometry(built.width * 1.16, startGate ? 0.85 : 0.55, 0.14)), startGate ? startMat : cpMat);
    beam.position.set(s.x, s.y + h - 0.2, s.z);
    beam.rotation.y = Math.atan2(s.tx, s.tz);
    group.add(beam);
    if (startGate) {
      const light = new THREE.Mesh(keep(new THREE.BoxGeometry(0.5, 0.5, 0.18)), keep(new THREE.MeshStandardMaterial({
        color: 3066993,
        emissive: 1748309,
        emissiveIntensity: 2.2
      })));
      light.position.set(s.x, s.y + h + 0.45, s.z);
      group.add(light);
    }
  }
  const followShadows = (x: number, y: number, z: number) => {
    if (!dir.castShadow) {
      dir.intensity = 0;
      dirNear.intensity = 0;
      dirNear.visible = false;
      return;
    }
    dir.target.position.set(x, y, z);
    const dist = 72;
    dir.position.set(x + lightAim.x * dist, y + Math.max(28, lightAim.y * dist), z + lightAim.z * dist);
    dir.target.updateMatrixWorld();
    dir.shadow.camera.updateProjectionMatrix();
    dirNear.target.position.set(x, y, z);
    const distN = 42;
    dirNear.position.set(x + lightAim.x * distN, y + Math.max(18, lightAim.y * distN), z + lightAim.z * distN);
    dirNear.target.updateMatrixWorld();
    dirNear.shadow.camera.updateProjectionMatrix();
    dirNear.color.copy(dir.color);
    dirNear.visible = dir.castShadow;
  };
  const followMirror = (x: number, y: number, z: number, yaw: number) => {
    if (!mirror || !planarOk) return;
    mirror.visible = true;
    mirror.position.set(x, y + 0.03, z);
    mirror.rotation.set(-Math.PI / 2, yaw, 0);
    const col = mirror.material as THREE.ShaderMaterial;
    const wet = wx === "rain" || wx === "storm";
    col.opacity = wet ? (isNight ? 0.58 : 0.38) : isNight ? 0.34 : 0.22;
    if (col.uniforms?.color) {
      const c = wet ? (isNight ? 0x6a7388 : 0x9aabbc) : isNight ? 0x3a4558 : 0x88a0b4;
      col.uniforms.color.value.setHex(c);
    }
  };
  const tick = (now: number, x: number, z: number) => {
    const t = now * 1e-3;
    dome.position.x = x;
    dome.position.z = z;
    for (const mv of movers) {
      if (mv.pts.length < 2) continue;
      const f = ((t * mv.speed + mv.phase) % 1 + 1) % 1 * (mv.pts.length - 1);
      const i = Math.min(mv.pts.length - 2, Math.floor(f));
      const a = mv.pts[i];
      const b = mv.pts[i + 1];
      const k = f - i;
      mv.mesh.position.set(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, a.z + (b.z - a.z) * k);
      const yaw = a.yaw + Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw)) * k;
      mv.mesh.rotation.y = yaw;
    }
    if (waterMeshes.length) {
      for (const mesh of waterMeshes) mesh.position.y = -0.1 + Math.sin(t * 0.7) * 0.06;
      if (waterMats.length) {
        for (const mat of waterMats) if (mat.normalMap) {
          mat.normalMap.offset.x = t * 0.04;
          mat.normalMap.offset.y = t * 0.026;
        }
      }
    }
    if (wx === "storm") {
      const bolt = Math.sin(now * 0.013) > 0.992;
      const n = nightAmt(clock);
      ambient.intensity = bolt ? n > 0.5 ? 1.8 : 1.2 : lerp(0.22, 0.34, n);
      hemi.intensity = bolt ? 1.4 : lerp(0.55, 0.52, n);
    }
    const wetAmt = wx === "storm" ? 1 : wx === "rain" ? 0.82 : lerp(0.08, 0.42, nightAmt(clock));
    puddles.visible = wetAmt > 0.1;
    puddleMat.opacity = 0.32 + wetAmt * 0.58;
    const ripple = 1 + Math.sin(t * 2.2) * 0.035 * (wx === "clear" ? 0.4 : 1);
    for (let i = 0; i < puddlePos.length; i++) {
      const p = puddlePos[i];
      _dummy.position.set(p.x, p.y, p.z);
      _dummy.scale.set(p.sx * ripple, 1, p.sz * ripple);
      _dummy.rotation.set(0, p.rot + t * 0.04, 0);
      _dummy.updateMatrix();
      puddles.setMatrixAt(i, _dummy.matrix);
    }
    puddles.instanceMatrix.needsUpdate = true;
    if (mirror) {
      const mmat = mirror.material as THREE.ShaderMaterial;
      mmat.opacity = wx !== "clear" ? 0.28 + wetAmt * 0.35 : lerp(0.1, 0.4, nightAmt(clock));
    }
    if (nightAmt(clock) < 0.4 || nightLights.length === 0 || lampPos.length === 0) return;
    const ranked = lampPos.map((p, i) => ({
      i,
      d: (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z)
    })).sort((a, b) => a.d - b.d);
    for (let i = 0; i < nightLights.length; i++) {
      const src = lampPos[ranked[i]?.i ?? 0];
      nightLights[i].position.copy(src);
      nightLights[i].target.position.set(src.x, src.y - 5.2, src.z);
    }
  };
  const groundMat = ground.material;
  const walkStd = walkMat;
  const applyWet = () => {
    const n = nightAmt(clock);
    puddles.visible = wx === "rain" || wx === "storm" || wx === "clear" && n > 0.35;
    if (wx === "rain" || wx === "storm") {
      roadMat.color.setHex(n > 0.5 ? 0xd0d4d8 : 0xe8ecee);
      roadMat.roughness = wx === "storm" ? 0.12 : 0.18;
      roadMat.metalness = 0;
      roadMat.envMapIntensity = n > 0.5 ? 1.25 : 1.1;
      roadMat.clearcoat = 0.62;
      roadMat.clearcoatRoughness = 0.14;
      puddleMat.opacity = wx === "storm" ? 0.9 : 0.78;
    } else if (n > 0.45) {
      roadMat.color.setHex(0xe8eaee);
      roadMat.roughness = 0.26;
      roadMat.metalness = 0;
      roadMat.envMapIntensity = 1.12;
      roadMat.clearcoat = 0.48;
      roadMat.clearcoatRoughness = 0.2;
    } else {
      roadMat.color.setHex(0xffffff);
      roadMat.roughness = 0.28;
      roadMat.metalness = 0;
      roadMat.envMapIntensity = 1.05;
      roadMat.clearcoat = 0.42;
      roadMat.clearcoatRoughness = 0.28;
    }
    if (roadMat.userData.uWet) {
      const n2 = nightAmt(clock);
      const morning = n2 <= 0.5 && clock < 0.38;
      const look = lookFromFlags(n2 > 0.5, wx, morning);
      roadMat.userData.uWet.value = LOOKS[look].wetness;
    }
  };
  const _dayHemi = new THREE.Color(9356520);
  const _mornHemi = new THREE.Color(13162734);
  const _nightHemi = new THREE.Color(0x6a88b0);
  const _dayDir = new THREE.Color(16773852);
  const _mornDir = new THREE.Color(16769200);
  const _nightDir = new THREE.Color(12898524);
  const _moon = new THREE.Vector3();
  const setClock = (nextClock: number) => {
    clock = (nextClock % 1 + 1) % 1;
    const n = nightAmt(clock);
    isNight = n > 0.48;
    const morning = n <= 0.5 && clock < 0.38;
    const next = skyAt(def, clock, wx);
    applySky(sky, sun, next);
    skyDomeMat.map = null;
    skyDomeMat.color.setHex(n > 0.5 ? 0x2a4a6c : 0x3c9ee0);
    skyDomeMat.needsUpdate = true;
    if (n < 0.58) lightAim.copy(sun);
    else {
      const phi = THREE.MathUtils.degToRad(46);
      const theta = THREE.MathUtils.degToRad(def.sky.azimuth + 172);
      _moon.setFromSphericalCoords(1, phi, theta);
      lightAim.copy(sun).lerp(_moon, (n - 0.58) / 0.42);
    }
    if (n > 0.5) {
      hemi.color.copy(_nightHemi);
      dir.color.copy(_nightDir);
      hemi.intensity = 0.98;
      dir.intensity = 0.72;
      fill.color.setHex(16758880);
      fill.intensity = 0.72;
      ambient.color.setHex(0x5a7898);
      ambient.intensity = 0.58;
    } else if (morning) {
      hemi.color.copy(_mornHemi);
      dir.color.copy(_mornDir);
      hemi.intensity = 0.66;
      dir.intensity = 0.98;
      fill.color.setHex(16760976);
      fill.intensity = 0.24;
      ambient.color.setHex(13682872);
      ambient.intensity = 0.26;
    } else {
      hemi.color.copy(_dayHemi);
      dir.color.copy(_dayDir);
      hemi.intensity = 0.62;
      dir.intensity = 0.82;
      fill.color.setHex(10139856);
      fill.intensity = 0.22;
      ambient.color.setHex(11057352);
      ambient.intensity = 0.24;
    }
    hemi.groundColor.setHex(n > 0.5 ? 1709072 : 5919304);
    dir.position.copy(lightAim).multiplyScalar(95);
    flareCol.setHex(n > 0.55 ? 16760944 : 16767136);
    if (lensflare) lensflare.visible = false;
    dir.shadow.radius = lerp(1.05, 0.7, n);
    if (n > 0.5 && (def.theme === "manhattan" || def.theme === "park")) {
      hemi.color.setHex(6981832);
      hemi.intensity = lerp(0.26, 0.52, n);
      dir.intensity = lerp(0.72, 1.02, n);
      fill.color.setHex(16734858);
      fill.intensity = lerp(0.1, 0.42, n);
    }
    stars.mesh.visible = n > 0.5;
    stars.mat.opacity = clamp((n - 0.45) * 2.4, 0, 0.92);
    moonMesh.visible = n > 0.55;
    moonHalo.visible = n > 0.55;
    moonMesh.position.copy(lightAim).multiplyScalar(420);
    moonHalo.position.copy(moonMesh.position);
    moonHaloMat.opacity = n > 0.55 ? 0.38 : 0;
    moonHaloMat.needsUpdate = true;
    sunMesh.visible = n < 0.5;
    sunHalo.visible = n < 0.5;
    sunMesh.position.copy(lightAim).multiplyScalar(900);
    sunHalo.position.copy(sunMesh.position);
    sunHaloMat.opacity = morning ? 0.38 : 0.26;
    haloMat.opacity = n > 0.45 ? 0.58 : 0;
    haloMat.needsUpdate = true;
    applyWet();
    groundMat.color.setHex(n > 0.5 ? 0x5a626c : groundCol);
    groundMat.envMapIntensity = lerp(0.14, 0.08, n);
    domeMat.color.setHex(n > 0.5 ? 0x1e3854 : clock < 0.38 ? 0x6aaee0 : 0x4a9ad8);
    walkStd.color.setHex(n > 0.5 ? 9078400 : 12892324);
    walkStd.envMapIntensity = lerp(0.22, 0.16, n);
    shoulderMat.color.setHex(n > 0.5 ? 4867128 : def.sand);
    jerseyMat.color.setHex(n > 0.5 ? 9078396 : 12893358);
    if (waterMats.length) for (let i = 0; i < waterMats.length; i++) {
      const src = bodies[i];
      const mat = waterMats[i];
      mat.color.setHex(src.color);
      if (n > 0.35) mat.color.multiplyScalar(lerp(1, 0.5, n));
      mat.envMapIntensity = lerp(1.7, 2.6, n);
      mat.roughness = lerp(0.08, 0.03, n);
      mat.opacity = lerp(0.82, 0.9, n);
    }
    if (needFacade) {
      bMat.map = n > 0.48 ? facadeNight : facadeDay;
      bMat.emissive.setHex(n > 0.4 ? 16763e3 : 0);
      bMat.emissiveIntensity = n * (def.theme === "manhattan" ? 3.2 : 1.85);
      bMat.metalness = lerp(0.08, 0.16, n);
      bMat.envMapIntensity = lerp(0.5, 1.15, n);
      bMat.needsUpdate = true;
    }
    bulbMat.emissive.setHex(n > 0.4 ? 16760944 : 2236962);
    bulbMat.emissiveIntensity = lerp(0.08, 7.2, n);
    haloMat.opacity = n > 0.4 ? 0.22 + n * 0.42 : 0;
    pools.visible = n > 0.4 && lampCount > 0;
    poolMat.opacity = n > 0.4 ? 0.32 + n * 0.4 : 0;
    neonGroup.visible = n > 0.32;
    for (const pl of nightLights) pl.intensity = n * 210;
    for (const pl of neonLights) pl.intensity = n * 42;
    for (const g of landmarkGlows) g.light.intensity = n * g.on;
    for (const e of emitList) e.mat.emissiveIntensity = lerp(e.day, e.night, n);
    applyWet();
    return next;
  };
  const setTime = (nextNight: boolean) => setClock(nextNight ? 0.9 : 0.5);
  const setWeather = (w: Weather) => {
    wx = w;
    return setClock(clock);
  };
  const setLod = (tier: "low" | "mid" | "high") => {
    const hi = tier === "high";
    const mid = tier === "mid";
    if (lodCrowns) {
      lodCrowns.visible = hi || mid;
      lodCrowns.castShadow = hi;
    }
    if (lodTrunks) lodTrunks.castShadow = hi;
    if (lodBills) lodBills.visible = hi;
    if (lodShads) lodShads.visible = hi || mid;
    tanks.visible = hi || mid;
    tanks.castShadow = hi;
    if (farMesh) farMesh.visible = hi || mid;
    for (const w of lodWear) w.visible = hi || mid;
    if (lodPuddles) lodPuddles.visible = hi;
  };
  applyWet();
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
      return isNight;
    },
    get weather() {
      return wx;
    },
    followShadows,
    followMirror,
    setPlanar(on: boolean) {
      planarOk = !!on;
      if (mirror) mirror.visible = planarOk;
    },
    sunDir: lightAim,
    tick,
    setTime,
    setClock,
    get clock() {
      return clock;
    },
    setWeather,
    setLod,
    dispose() {
      for (const d of bag) d.dispose();
    }
  };
}
function addLandmarks(
  group: THREE.Group,
  def: TrackDef,
  bag: Disposable[],
  shadows: boolean,
  isNight: boolean,
  glows: Glow[],
  emitList: Emit[],
  colliders: Collider[],
  movers: Mover[],
  ramps: Ramp[],
  streets: unknown[],
  built: BuiltTrack,
) {
  const add = (mesh: THREE.Mesh | THREE.Object3D) => {
    (mesh as THREE.Mesh).castShadow = shadows;
    (mesh as THREE.Mesh).receiveShadow = true;
    group.add(mesh);
    if ("geometry" in mesh && mesh.geometry) bag.push(mesh.geometry);
    const mat = "material" in mesh ? mesh.material : null;
    if (Array.isArray(mat)) mat.forEach((m: THREE.Material) => bag.push(m));
    else if (mat) bag.push(mat);
  };
  const glowAt = (x: number, y: number, z: number, color: number, on: number, dist: number) => {
    if (!shadows || glows.length >= 4) return;
    const pl = new THREE.PointLight(color, isNight ? on : 0, dist, 2);
    pl.position.set(x, y, z);
    group.add(pl);
    glows.push({
      light: pl,
      on
    });
  };
  const hit = (x: number, z: number, r: number, hx?: number, hz?: number, yaw?: number) => {
    colliders.push({
      x,
      z,
      r,
      hx: hx ?? r * 0.72,
      hz: hz ?? r * 0.72,
      yaw: yaw ?? 0,
      kind: "building"
    });
  };
  const roadYaw = (x: number, z: number) => {
    const s = built.samples[nearestIndex(built.samples, x, z, 0).index];
    return Math.atan2(s.tx, s.tz);
  };
  const hitRoad = (x: number, z: number, r: number, hx?: number, hz?: number) => hit(x, z, r, hx, hz, roadYaw(x, z));
  const towerHit = (x: number, z: number, r: number, hx?: number, hz?: number, yaw?: number) => {
    if (def.id === "ayalon") hitRoad(x, z, r, hx, hz);
    else hit(x, z, r, hx, hz, yaw);
  };
  const placeTunnel = (cx: number, cz: number, yaw: number, len: number, half: number, h: number, y0 = 0) => {
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 3813932,
      roughness: 0.9,
      envMapIntensity: 0.2
    });
    const tileMat = new THREE.MeshStandardMaterial({
      color: 10127986,
      roughness: 0.62,
      envMapIntensity: 0.35
    });
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 2367002,
      roughness: 0.92
    });
    const lampMat = new THREE.MeshStandardMaterial({
      color: 16771248,
      emissive: 16764006,
      emissiveIntensity: isNight ? 2.4 : 0.7,
      roughness: 0.4
    });
    bag.push(wallMat, tileMat, ceilMat, lampMat);
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.85, h, len), wallMat);
    wallL.position.set(cx - rx * half, y0 + h * 0.5, cz - rz * half);
    wallL.rotation.y = yaw;
    add(wallL);
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.85, h, len), wallMat);
    wallR.position.set(cx + rx * half, y0 + h * 0.5, cz + rz * half);
    wallR.rotation.y = yaw;
    add(wallR);
    const tileL = new THREE.Mesh(new THREE.BoxGeometry(0.12, h * 0.55, len * 0.96), tileMat);
    tileL.position.set(cx - rx * (half - 0.5), y0 + h * 0.32, cz - rz * (half - 0.5));
    tileL.rotation.y = yaw;
    add(tileL);
    const tileR = tileL.clone();
    tileR.position.set(cx + rx * (half - 0.5), y0 + h * 0.32, cz + rz * (half - 0.5));
    add(tileR);
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(half * 2 + 1.6, 0.7, len), ceilMat);
    ceil.position.set(cx, y0 + h + 0.15, cz);
    ceil.rotation.y = yaw;
    add(ceil);
    for (const end of [-1, 1]) {
      const px = cx + fx * (len * 0.5) * end;
      const pz = cz + fz * (len * 0.5) * end;
      for (const side of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(1.15, h + 1.4, 1.35), tileMat);
        post.position.set(px + rx * half * side, y0 + (h + 1.4) * 0.5, pz + rz * half * side);
        post.rotation.y = yaw;
        add(post);
      }
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(half * 2 + 2.4, 1.5, 1.5), tileMat);
      lintel.position.set(px, y0 + h + 0.6, pz);
      lintel.rotation.y = yaw;
      add(lintel);
    }
    const nLamps = Math.max(3, Math.round(len / 10));
    for (let i = 0; i < nLamps; i++) {
      const t = (i + 0.5) / nLamps - 0.5;
      const lx = cx + fx * t * len;
      const lz = cz + fz * t * len;
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.16, 1.1), lampMat);
      lamp.position.set(lx, y0 + h - 0.2, lz);
      lamp.rotation.y = yaw;
      add(lamp);
    }
    const nHit = Math.max(3, Math.round(len / 12));
    for (let i = 0; i < nHit; i++) {
      const t = (i + 0.5) / nHit - 0.5;
      const wx = cx + fx * t * len;
      const wz = cz + fz * t * len;
      hit(wx - rx * (half + 0.4), wz - rz * (half + 0.4), 1.05, 0.55, 2.4, yaw);
      hit(wx + rx * (half + 0.4), wz + rz * (half + 0.4), 1.05, 0.55, 2.4, yaw);
    }
  };
  const stone = new THREE.MeshStandardMaterial({
    color: 13350810,
    roughness: 0.78,
    envMapIntensity: 0.45
  });
  const white = new THREE.MeshStandardMaterial({
    color: 15525594,
    roughness: 0.48,
    metalness: 0,
    envMapIntensity: 0.7
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 6987956,
    roughness: 0.08,
    metalness: 0,
    envMapIntensity: 1.8,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: 1722982,
    emissiveIntensity: isNight ? 0.32 : 0
  });
  const copper = new THREE.MeshPhysicalMaterial({
    color: 11569722,
    metalness: 0.82,
    roughness: 0.22,
    envMapIntensity: 1.4,
    clearcoat: 0.45
  });
  const gold = new THREE.MeshPhysicalMaterial({
    color: 13934615,
    metalness: 0.92,
    roughness: 0.18,
    envMapIntensity: 1.8,
    clearcoat: 0.7,
    emissive: 13934615,
    emissiveIntensity: isNight ? 0.55 : 0.06
  });
  const cream = new THREE.MeshStandardMaterial({
    color: 15260868,
    roughness: 0.62,
    envMapIntensity: 0.5
  });
  const terracotta = new THREE.MeshStandardMaterial({
    color: 10771002,
    roughness: 0.82,
    envMapIntensity: 0.3
  });
  const wood = new THREE.MeshStandardMaterial({
    color: 6965810,
    roughness: 0.88
  });
  const darkArch = new THREE.MeshStandardMaterial({
    color: 1840144,
    roughness: 0.96
  });
  bag.push(darkArch);
  const merlonWall = (x: number, z: number, len: number, yaw: number, h = 12) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, h, 4.4), stone);
    wall.position.set(x, h * 0.5, z);
    wall.rotation.y = yaw;
    add(wall);
    const n = Math.max(4, Math.floor(len / 5.2));
    for (let i = 0; i < n; i++) {
      const t = (i / Math.max(1, n - 1) - 0.5) * (len - 2.4);
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.15, 4.8), stone);
      m.position.set(x + Math.cos(yaw) * t, h + 1.05, z - Math.sin(yaw) * t);
      m.rotation.y = yaw;
      add(m);
    }
    hit(x, z, Math.min(7, Math.max(3.5, len * 0.1)));
  };
  const minaret = (x: number, z: number, h = 26) => {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.65, h, 10), stone);
    shaft.position.set(x, h * 0.5, z);
    add(shaft);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.65, 10), cream);
    ring.position.set(x, h * 0.68, z);
    add(ring);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 3.2, 8), stone);
    cap.position.set(x, h + 1.4, z);
    add(cap);
    hit(x, z, 4);
  };
  const ottomanGate = (x: number, z: number, yaw: number) => {
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    const side = 18;
    for (const s of [-side, side]) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(9, 16, 10), stone);
      t.position.set(x + rx * s, 8, z + rz * s);
      t.rotation.y = yaw;
      add(t);
      hit(x + rx * s, z + rz * s, 6, 4.8, 5.2, yaw);
    }
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(38, 5.4, 10.4), stone);
    lintel.position.set(x, 18.2, z);
    lintel.rotation.y = yaw;
    add(lintel);
    const ped = new THREE.Mesh(new THREE.ConeGeometry(5.8, 3.6, 4), stone);
    ped.rotation.y = yaw + Math.PI / 4;
    ped.position.set(x, 23.6, z);
    add(ped);
    for (const s of [-16, -6, 6, 16]) {
      const mer = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 10.8), stone);
      mer.position.set(x + rx * s, 21.8, z + rz * s);
      mer.rotation.y = yaw;
      add(mer);
    }
  };
  const placeDome = (dmx: number, dmz: number) => {
    const oct = new THREE.Mesh(new THREE.CylinderGeometry(11.4, 11.4, 8.4, 8), cream);
    oct.position.set(dmx, 9.2, dmz);
    add(oct);
    const tile = new THREE.MeshStandardMaterial({
      color: 1986178,
      roughness: 0.38,
      metalness: 0.22,
      envMapIntensity: 0.85
    });
    bag.push(tile);
    const tileBand = new THREE.Mesh(new THREE.CylinderGeometry(11.55, 11.55, 3.2, 8), tile);
    tileBand.position.set(dmx, 11.4, dmz);
    add(tileBand);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.55, 8.6, 8), cream);
      col.position.set(dmx + Math.cos(a) * 11.9, 9.2, dmz + Math.sin(a) * 11.9);
      add(col);
    }
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(7.8, 7.8, 6.2, 20), tile);
    drum.position.set(dmx, 16.4, dmz);
    add(drum);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(10.4, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), gold);
    dome.position.set(dmx, 19.4, dmz);
    add(dome);
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.35, 3.1, 8), gold);
    lantern.position.set(dmx, 30.4, dmz);
    add(lantern);
    glowAt(dmx, 31, dmz, 16763972, 80, 48);
    hit(dmx, dmz, 12);
  };
  const cyan = new THREE.MeshPhysicalMaterial({
    color: 3842232,
    roughness: 0.08,
    metalness: 0.12,
    envMapIntensity: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    emissive: 3842232,
    emissiveIntensity: isNight ? 0.7 : 0.08
  });
  bag.push(stone, white, glass, copper, gold, cream, terracotta, wood, cyan);
  emitList.push({
    mat: gold,
    night: 0.55,
    day: 0.06
  }, {
    mat: glass,
    night: 0.32,
    day: 0
  }, {
    mat: cyan,
    night: 0.7,
    day: 0.08
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: 3822696,
    roughness: 0.08,
    metalness: 0,
    envMapIntensity: 1.6,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: 663600,
    emissiveIntensity: isNight ? 0.28 : 0
  });
  const paleGlass = new THREE.MeshPhysicalMaterial({
    color: 12110036,
    roughness: 0.1,
    metalness: 0,
    envMapIntensity: 1.4,
    clearcoat: 0.9,
    emissive: 1716288,
    emissiveIntensity: isNight ? 0.22 : 0
  });
  const bandMat = new THREE.MeshStandardMaterial({
    color: 14214378,
    metalness: 0.62,
    roughness: 0.22,
    envMapIntensity: 1.3
  });
  const winTex = curtainTexture("blue");
  const triTex = curtainTexture("teal");
  const sqTex = curtainTexture("dark");
  const gateTex = curtainTexture("dark");
  const tohaTex = curtainTexture("gold");
  bag.push(winTex, triTex, sqTex, gateTex, tohaTex);
  const mkGlass = (map: THREE.Texture, color: number, nightEmi: number) => new THREE.MeshPhysicalMaterial({
    map,
    color,
    roughness: 0.12,
    metalness: 0,
    envMapIntensity: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    emissive: 1722982,
    emissiveIntensity: isNight ? nightEmi : 0
  });
  const azGlass = mkGlass(winTex, 0x4e9a82, 0.38);
  const azTriGlass = mkGlass(triTex, 0x8b6b4a, 0.32);
  const azSqGlass = mkGlass(sqTex, 0x6a8aaa, 0.28);
  const gateGlass = mkGlass(gateTex, 0xc8d4dc, 0.3);
  const tohaGlass = mkGlass(tohaTex, 0xc9a45a, 0.24);
  bag.push(darkGlass, paleGlass, bandMat, azGlass, azTriGlass, azSqGlass, gateGlass, tohaGlass);
  emitList.push({
    mat: darkGlass,
    night: 0.28,
    day: 0
  }, {
    mat: paleGlass,
    night: 0.22,
    day: 0
  }, {
    mat: azGlass,
    night: 0.38,
    day: 0
  }, {
    mat: azTriGlass,
    night: 0.32,
    day: 0
  }, {
    mat: azSqGlass,
    night: 0.28,
    day: 0
  }, {
    mat: gateGlass,
    night: 0.3,
    day: 0
  }, {
    mat: tohaGlass,
    night: 0.24,
    day: 0
  });
  const placeAzrieli = (s: number) => {
    const azBand = new THREE.MeshStandardMaterial({
      color: 0xece8e0,
      metalness: 0,
      roughness: 0.42,
      envMapIntensity: 0.85
    });
    bag.push(azBand);
    const roundP = tlv(32.07455, 34.79195);
    const nAz = nearestIndex(built.samples, roundP.x, roundP.z, 0);
    const sAz = built.samples[nAz.index];
    const park = built.width / 2 + 52;
    const cx = sAz.x + sAz.rx * park;
    const cz = sAz.z + sAz.rz * park;
    const rH = 154 * s;
    const round = new THREE.Mesh(new THREE.CylinderGeometry(13.4 * s, 14.6 * s, rH, 48), azGlass);
    round.position.set(cx, rH * 0.5, cz);
    add(round);
    {
      const ringYs = [];
      for (let y = 4.4 * s; y < rH - 2.4 * s; y += 2.35 * s) ringYs.push(y);
      const ringGeo = new THREE.TorusGeometry(13.8 * s, 0.08 * s, 5, 24);
      const rings = new THREE.InstancedMesh(ringGeo, azBand, ringYs.length);
      rings.frustumCulled = false;
      for (let i = 0; i < ringYs.length; i++) {
        const sc = 1 + ringYs[i] / rH * 0.041;
        _dummy.position.set(cx, ringYs[i], cz);
        _dummy.rotation.set(Math.PI / 2, 0, 0);
        _dummy.scale.set(sc, sc, 1);
        _dummy.updateMatrix();
        rings.setMatrixAt(i, _dummy.matrix);
      }
      rings.instanceMatrix.needsUpdate = true;
      rings.castShadow = shadows;
      group.add(rings);
      bag.push(ringGeo);
    }
    const saucerUnd = new THREE.Mesh(new THREE.CylinderGeometry(22.4 * s, 14.6 * s, 2.8 * s, 36), azBand);
    saucerUnd.position.set(cx, rH + 0.4 * s, cz);
    add(saucerUnd);
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(23.2 * s, 20.4 * s, 2.0 * s, 36), paleGlass);
    saucer.position.set(cx, rH + 2.8 * s, cz);
    add(saucer);
    const saucerGlass = new THREE.Mesh(new THREE.SphereGeometry(12.6 * s, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), paleGlass);
    saucerGlass.position.set(cx, rH + 3.6 * s, cz);
    add(saucerGlass);
    const saucerRim = new THREE.Mesh(new THREE.TorusGeometry(21.6 * s, 0.48 * s, 6, 36), azBand);
    saucerRim.rotation.x = Math.PI / 2;
    saucerRim.position.set(cx, rH + 2.9 * s, cz);
    add(saucerRim);
    const saucerRim2 = new THREE.Mesh(new THREE.TorusGeometry(16.2 * s, 0.32 * s, 6, 28), azBand);
    saucerRim2.rotation.x = Math.PI / 2;
    saucerRim2.position.set(cx, rH + 3.8 * s, cz);
    add(saucerRim2);
    const tH = 138 * s;
    const triX = cx + sAz.tx * 24 * s + sAz.rx * 20 * s;
    const triZ = cz + sAz.tz * 24 * s + sAz.rz * 20 * s;
    const tri = new THREE.Mesh(new THREE.CylinderGeometry(8.8 * s, 10.8 * s, tH, 3), azTriGlass);
    tri.position.set(triX, tH * 0.5, triZ);
    tri.rotation.y = 0.52;
    add(tri);
    for (let i = 0; i < 3; i++) {
      const a = 0.52 + i * ((Math.PI * 2) / 3) + Math.PI / 3;
      const r = 9.2 * s;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.62 * s, tH * 0.96, 0.62 * s), azBand);
      post.position.set(triX + Math.cos(a) * r, tH * 0.5, triZ + Math.sin(a) * r);
      add(post);
    }
    {
      const bandYs = [];
      for (let y = 6 * s; y < tH - 4 * s; y += 5.6 * s) bandYs.push(y);
      const bandGeo = new THREE.CylinderGeometry(9.2 * s, 10.2 * s, 0.45 * s, 3);
      const bands = new THREE.InstancedMesh(bandGeo, azBand, bandYs.length);
      bands.frustumCulled = false;
      for (let i = 0; i < bandYs.length; i++) {
        _dummy.position.set(triX, bandYs[i], triZ);
        _dummy.rotation.set(0, 0.52, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        bands.setMatrixAt(i, _dummy.matrix);
      }
      bands.instanceMatrix.needsUpdate = true;
      bands.castShadow = shadows;
      group.add(bands);
      bag.push(bandGeo);
    }
    const triCap = new THREE.Mesh(new THREE.CylinderGeometry(1.4 * s, 8.6 * s, 18 * s, 3), paleGlass);
    triCap.position.set(triX, tH + 7 * s, triZ);
    triCap.rotation.y = 0.52;
    add(triCap);
    const sH = 126 * s;
    const sqX = cx - sAz.tx * 22 * s + sAz.rx * 12 * s;
    const sqZ = cz - sAz.tz * 22 * s + sAz.rz * 12 * s;
    const sq = new THREE.Mesh(new THREE.BoxGeometry(15.2 * s, sH, 15.2 * s), azSqGlass);
    sq.position.set(sqX, sH * 0.5, sqZ);
    add(sq);
    {
      const slabYs = [];
      for (let y = 5.5 * s; y < sH - 3 * s; y += 2.9 * s) slabYs.push(y);
      const slabGeo = new THREE.BoxGeometry(15.8 * s, 0.35 * s, 15.8 * s);
      const slabs = new THREE.InstancedMesh(slabGeo, azBand, slabYs.length);
      slabs.frustumCulled = false;
      for (let i = 0; i < slabYs.length; i++) {
        _dummy.position.set(sqX, slabYs[i], sqZ);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        slabs.setMatrixAt(i, _dummy.matrix);
      }
      slabs.instanceMatrix.needsUpdate = true;
      slabs.castShadow = shadows;
      group.add(slabs);
      bag.push(slabGeo);
    }
    const sq2 = new THREE.Mesh(new THREE.BoxGeometry(11.6 * s, 8.4 * s, 11.6 * s), paleGlass);
    sq2.position.set(sqX, sH + 3.8 * s, sqZ);
    add(sq2);
    const sq3 = new THREE.Mesh(new THREE.BoxGeometry(8.4 * s, 6.2 * s, 8.4 * s), azSqGlass);
    sq3.position.set(sqX, sH + 10.8 * s, sqZ);
    add(sq3);
    const sqMast = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.32 * s, 12 * s, 6), azBand);
    sqMast.position.set(sqX, sH + 20 * s, sqZ);
    add(sqMast);
    const mallP = { x: (cx + triX + sqX) / 3, z: (cz + triZ + sqZ) / 3 };
    const pod = new THREE.Mesh(new THREE.BoxGeometry(52 * s, 9.2 * s, 42 * s), white);
    pod.position.set(mallP.x, 4.6 * s, mallP.z);
    add(pod);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(16.4 * s, 16.4 * s, 14 * s, 32), paleGlass);
    atrium.position.set(mallP.x, 7 * s, mallP.z);
    add(atrium);
    const atriumRim = new THREE.Mesh(new THREE.TorusGeometry(16.6 * s, 0.48 * s, 6, 32), azBand);
    atriumRim.rotation.x = Math.PI / 2;
    atriumRim.position.set(mallP.x, 14.1 * s, mallP.z);
    add(atriumRim);
    const atriumDome = new THREE.Mesh(new THREE.SphereGeometry(16.4 * s, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.42), paleGlass);
    atriumDome.position.set(mallP.x, 14.2 * s, mallP.z);
    add(atriumDome);
    const spanTri = Math.max(8 * s, Math.hypot(cx - triX, cz - triZ));
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(spanTri, 1.7 * s, 5.8 * s), paleGlass);
    bridge.position.set((cx + triX) * 0.5, 34 * s, (cz + triZ) * 0.5);
    bridge.rotation.y = Math.atan2(triX - cx, triZ - cz);
    add(bridge);
    const spanSq = Math.max(8 * s, Math.hypot(cx - sqX, cz - sqZ));
    const bridge2 = new THREE.Mesh(new THREE.BoxGeometry(spanSq, 1.6 * s, 5.4 * s), paleGlass);
    bridge2.position.set((cx + sqX) * 0.5, 31 * s, (cz + sqZ) * 0.5);
    bridge2.rotation.y = Math.atan2(sqX - cx, sqZ - cz);
    add(bridge2);
    glowAt(cx, rH + 6, cz, 8308968, 62 * s, 54 * s);
    glowAt(triX, tH + 6, triZ, 8308968, 52 * s, 48 * s);
    towerHit(cx, cz, 12 * s, 14 * s, 14 * s);
    towerHit(triX, triZ, 11 * s, 10 * s, 10 * s);
    towerHit(sqX, sqZ, 10 * s, 8.4 * s, 8.4 * s);
  };
  const placeCityGate = (s: number) => {
    const p = tlv(32.0832, 34.8027);
    const h = 168 * s;
    const yaw = Math.PI / 4;
    const body = new THREE.Mesh(new THREE.BoxGeometry(16.2 * s, h, 16.2 * s), gateGlass);
    body.position.set(p.x, h * 0.5, p.z);
    body.rotation.y = yaw;
    add(body);
    {
      const slabYs = [];
      for (let y = 10 * s; y < h - 8 * s; y += 6.2 * s) slabYs.push(y);
      const slabGeo = new THREE.BoxGeometry(16.8 * s, 0.28 * s, 16.8 * s);
      const slabs = new THREE.InstancedMesh(slabGeo, bandMat, slabYs.length);
      slabs.frustumCulled = false;
      for (let i = 0; i < slabYs.length; i++) {
        _dummy.position.set(p.x, slabYs[i], p.z);
        _dummy.rotation.set(0, yaw, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        slabs.setMatrixAt(i, _dummy.matrix);
      }
      slabs.instanceMatrix.needsUpdate = true;
      slabs.castShadow = shadows;
      group.add(slabs);
      bag.push(slabGeo);
    }
    const crown = new THREE.Mesh(new THREE.BoxGeometry(11.4 * s, 18 * s, 11.4 * s), paleGlass);
    crown.position.set(p.x, h + 8 * s, p.z);
    crown.rotation.y = yaw;
    add(crown);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * s, 0.55 * s, 48 * s, 8), bandMat);
    mast.position.set(p.x, h + 40 * s, p.z);
    add(mast);
    glowAt(p.x, h + 24 * s, p.z, 11065584, 52 * s, 46 * s);
    towerHit(p.x, p.z, 11 * s, 10 * s, 10 * s, yaw);
  };
  const placeToHa = (s: number, lat = 32.0713, lon = 34.7886) => {
    const hint = tlv(lat, lon);
    const nH = nearestIndex(built.samples, hint.x, hint.z, 0);
    const sH = built.samples[nH.index];
    const p = nH.dist < built.width / 2 + 40
      ? { x: sH.x + sH.rx * (built.width / 2 + 48), z: sH.z + sH.rz * (built.width / 2 + 48) }
      : hint;
    const n = 22;
    const floorGeo = new THREE.BoxGeometry(1, 4.7 * s, 0.62);
    const floors = new THREE.InstancedMesh(floorGeo, tohaGlass, n * 2);
    floors.frustumCulled = false;
    const lipGeo = new THREE.BoxGeometry(1, 0.22 * s, 0.72);
    const lips = new THREE.InstancedMesh(lipGeo, bandMat, n);
    lips.frustumCulled = false;
    let fi = 0;
    let li = 0;
    const stack = (ox: number, oz: number, twist0: number, twistDir: number) => {
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const w = (6.4 + t * 14.8) * s;
        const y = 3.8 * s + i * (5.15 * s);
        const yaw = twist0 + t * 0.95 * twistDir + Math.PI / 4;
        const x = p.x + ox + Math.sin(t * 1.1) * 1.6 * s * twistDir;
        const z = p.z + oz;
        _dummy.position.set(x, y, z);
        _dummy.rotation.set(0, yaw, 0);
        _dummy.scale.set(w, 1, w);
        _dummy.updateMatrix();
        floors.setMatrixAt(fi++, _dummy.matrix);
        if (i % 2 === 0 && li < n) {
          _dummy.position.set(x, y + 2.2 * s, z);
          _dummy.scale.set(w + 0.6 * s, 1, w + 0.4 * s);
          _dummy.updateMatrix();
          lips.setMatrixAt(li++, _dummy.matrix);
        }
      }
    };
    stack(-8.2 * s, -1.2 * s, Math.PI / 5, 1);
    stack(8.4 * s, 2.8 * s, -Math.PI / 6, -1);
    floors.count = fi;
    lips.count = li;
    floors.instanceMatrix.needsUpdate = true;
    lips.instanceMatrix.needsUpdate = true;
    floors.castShadow = shadows;
    group.add(floors, lips);
    bag.push(floorGeo, lipGeo);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(28 * s, 3.2 * s, 16 * s), paleGlass);
    cap.position.set(p.x, 118 * s, p.z + 1.2 * s);
    cap.rotation.y = Math.PI / 4;
    add(cap);
    const base = new THREE.Mesh(new THREE.BoxGeometry(24 * s, 4.8 * s, 20 * s), cream);
    base.position.set(p.x, 2.4 * s, p.z);
    add(base);
    glowAt(p.x, 110 * s, p.z, 13166847, 46 * s, 40 * s);
    towerHit(p.x, p.z, 13 * s, 15 * s, 13 * s);
  };
  const placeMidtown = (s: number) => {
    const md = tlv(32.0806, 34.7926);
    const navy = new THREE.MeshPhysicalMaterial({
      color: 0x1c2c3c,
      roughness: 0.1,
      metalness: 0,
      envMapIntensity: 1.55,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });
    bag.push(navy);
    const hA = 108 * s;
    const hB = 94 * s;
    const a = new THREE.Mesh(new THREE.BoxGeometry(12.4 * s, hA, 14.6 * s), navy);
    a.position.set(md.x - 8.2 * s, hA * 0.5, md.z);
    add(a);
    const b = new THREE.Mesh(new THREE.BoxGeometry(12.4 * s, hB, 14.6 * s), navy);
    b.position.set(md.x + 8.2 * s, hB * 0.5, md.z);
    add(b);
    const bandGeo = new THREE.BoxGeometry(12.9 * s, 0.22 * s, 15.1 * s);
    const nBand = 18;
    const bands = new THREE.InstancedMesh(bandGeo, bandMat, nBand * 2);
    bands.frustumCulled = false;
    let bi = 0;
    for (const [ox, h] of [[-8.2 * s, hA], [8.2 * s, hB]]) {
      for (let i = 0; i < nBand; i++) {
        const y = 6 * s + i * (h - 12 * s) / (nBand - 1);
        _dummy.position.set(md.x + ox, y, md.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        bands.setMatrixAt(bi++, _dummy.matrix);
      }
    }
    bands.count = bi;
    bands.instanceMatrix.needsUpdate = true;
    group.add(bands);
    bag.push(bandGeo);
    const skyGeo = new THREE.BoxGeometry(18.6 * s, 3.2 * s, 7.2 * s);
    const skies = new THREE.InstancedMesh(skyGeo, paleGlass, 3);
    skies.frustumCulled = false;
    [26, 54, 82].forEach((y, i) => {
      _dummy.position.set(md.x, y * s, md.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      skies.setMatrixAt(i, _dummy.matrix);
    });
    skies.instanceMatrix.needsUpdate = true;
    group.add(skies);
    bag.push(skyGeo);
    glowAt(md.x, 90 * s, md.z, 0x6688aa, 40 * s, 36 * s);
    towerHit(md.x, md.z, 14 * s, 18 * s, 10 * s);
  };
  const placeElectra = (s: number) => {
    const el = tlv(32.0699, 34.7918);
    const teal = new THREE.MeshPhysicalMaterial({
      color: 0x4a7a92,
      roughness: 0.1,
      metalness: 0,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });
    bag.push(teal);
    const h = 118 * s;
    const body = new THREE.Mesh(new THREE.BoxGeometry(14.2 * s, h, 14.2 * s), teal);
    body.position.set(el.x, h * 0.5, el.z);
    add(body);
    const slabYs = [];
    for (let y = 5 * s; y < h - 4 * s; y += 3.1 * s) slabYs.push(y);
    const slabGeo = new THREE.BoxGeometry(14.8 * s, 0.2 * s, 14.8 * s);
    const slabs = new THREE.InstancedMesh(slabGeo, bandMat, slabYs.length);
    slabs.frustumCulled = false;
    for (let i = 0; i < slabYs.length; i++) {
      _dummy.position.set(el.x, slabYs[i], el.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      slabs.setMatrixAt(i, _dummy.matrix);
    }
    slabs.instanceMatrix.needsUpdate = true;
    slabs.castShadow = shadows;
    group.add(slabs);
    bag.push(slabGeo);
    const mullGeo = new THREE.BoxGeometry(0.16 * s, h * 0.96, 0.16 * s);
    const mulls = new THREE.InstancedMesh(mullGeo, bandMat, 14);
    mulls.frustumCulled = false;
    let mi = 0;
    for (let i = 0; i < 7; i++) {
      const o = -5.8 * s + i * 1.93 * s;
      for (const z of [el.z + 7.15 * s, el.z - 7.15 * s]) {
        _dummy.position.set(el.x + o, h * 0.5, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        mulls.setMatrixAt(mi++, _dummy.matrix);
      }
    }
    mulls.count = mi;
    mulls.instanceMatrix.needsUpdate = true;
    group.add(mulls);
    bag.push(mullGeo);
    const elCrown = new THREE.Mesh(new THREE.BoxGeometry(15.4 * s, 5.4 * s, 15.4 * s), bandMat);
    elCrown.position.set(el.x, h + 3.2 * s, el.z);
    add(elCrown);
    const elCrown2 = new THREE.Mesh(new THREE.BoxGeometry(10.6 * s, 4.6 * s, 10.6 * s), paleGlass);
    elCrown2.position.set(el.x, h + 8.2 * s, el.z);
    add(elCrown2);
    const elMast = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.4 * s, 32 * s, 8), bandMat);
    elMast.position.set(el.x, h + 24 * s, el.z);
    add(elMast);
    glowAt(el.x, h + 8 * s, el.z, 0x88c0d8, 36 * s, 32 * s);
    towerHit(el.x, el.z, 9 * s);
  };
  const placeSarona = (s: number) => {
    const p = tlv(32.0714, 34.7866);
    const h = 178 * s;
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xd8e4ec,
      roughness: 0.08,
      metalness: 0,
      envMapIntensity: 1.65,
      clearcoat: 1,
      clearcoatRoughness: 0.08
    });
    bag.push(glass);
    const body = new THREE.Mesh(new THREE.BoxGeometry(11.2 * s, h, 22.4 * s), glass);
    body.position.set(p.x, h * 0.5, p.z);
    body.rotation.y = 0.18;
    add(body);
    const finGeo = new THREE.BoxGeometry(0.22 * s, h * 0.96, 0.22 * s);
    const fins = new THREE.InstancedMesh(finGeo, bandMat, 12);
    fins.frustumCulled = false;
    let fi = 0;
    for (let i = 0; i < 6; i++) {
      const z = -10.4 * s + i * 4.16 * s;
      for (const x of [-5.7 * s, 5.7 * s]) {
        _dummy.position.set(p.x + x, h * 0.5, p.z + z);
        _dummy.rotation.set(0, 0.18, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        fins.setMatrixAt(fi++, _dummy.matrix);
      }
    }
    fins.count = fi;
    fins.instanceMatrix.needsUpdate = true;
    group.add(fins);
    bag.push(finGeo);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(12.2 * s, 6.4 * s, 23.2 * s), paleGlass);
    cap.position.set(p.x, h + 2.8 * s, p.z);
    cap.rotation.y = 0.18;
    add(cap);
    glowAt(p.x, h + 4 * s, p.z, 0xe8f2fa, 44 * s, 40 * s);
    towerHit(p.x, p.z, 12 * s, 8 * s, 14 * s, 0.18);
  };
  const placeHakirya = (s: number) => {
    const p = tlv(32.0756, 34.7878);
    const khaki = new THREE.MeshStandardMaterial({
      color: 0xb89a6e,
      roughness: 0.62,
      envMapIntensity: 0.45
    });
    bag.push(khaki);
    const h = 96 * s;
    const matcal = new THREE.Mesh(new THREE.BoxGeometry(14.4 * s, h, 18.6 * s), khaki);
    matcal.position.set(p.x, h * 0.5, p.z);
    add(matcal);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(15.2 * s, 4.2 * s, 19.4 * s), cream);
    cap.position.set(p.x, h + 1.8 * s, p.z);
    add(cap);
    const hallGeo = new THREE.BoxGeometry(1, 1, 1);
    const halls = new THREE.InstancedMesh(hallGeo, cream, 6);
    halls.frustumCulled = false;
    const spec = [
      [22, 6, 8, 16, 8, 10],
      [-20, 5.2, 12, 14, 6.4, 12],
      [16, 4.4, -16, 18, 5.2, 9],
      [-14, 7, -18, 12, 9.2, 14],
      [28, 3.8, -8, 10, 4.6, 16],
      [-26, 4.8, 4, 12, 5.8, 8],
    ];
    spec.forEach((h, i) => {
      _dummy.position.set(p.x + h[0] * s, h[1] * s, p.z + h[2] * s);
      _dummy.rotation.set(0, i * 0.12, 0);
      _dummy.scale.set(h[3] * s, h[4] * s * 2, h[5] * s);
      _dummy.updateMatrix();
      halls.setMatrixAt(i, _dummy.matrix);
    });
    halls.instanceMatrix.needsUpdate = true;
    group.add(halls);
    bag.push(hallGeo);
    glowAt(p.x, h + 4 * s, p.z, 0xd4c4a0, 32 * s, 28 * s);
    towerHit(p.x, p.z, 16 * s, 22 * s, 20 * s);
  };
  const placeShalomMeir = (s: number) => {
    const p = tlv(32.0639, 34.7704);
    const h = 82 * s;
    const body = new THREE.Mesh(new THREE.BoxGeometry(16.4 * s, h, 10.6 * s), cream);
    body.position.set(p.x, h * 0.5, p.z);
    add(body);
    const muralMat = new THREE.MeshStandardMaterial({ color: 0x1c4a78, roughness: 0.7, envMapIntensity: 0.4 });
    bag.push(muralMat);
    const mural = new THREE.Mesh(new THREE.BoxGeometry(0.22 * s, h * 0.58, 9.6 * s), muralMat);
    mural.position.set(p.x + 8.3 * s, h * 0.42, p.z);
    add(mural);
    const bandGeo = new THREE.BoxGeometry(16.9 * s, 0.22 * s, 11.1 * s);
    const n = 12;
    const bands = new THREE.InstancedMesh(bandGeo, bandMat, n);
    bands.frustumCulled = false;
    for (let i = 0; i < n; i++) {
      _dummy.position.set(p.x, 6 * s + i * (h - 12 * s) / (n - 1), p.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      bands.setMatrixAt(i, _dummy.matrix);
    }
    bands.instanceMatrix.needsUpdate = true;
    group.add(bands);
    bag.push(bandGeo);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.34 * s, 22 * s, 6), bandMat);
    mast.position.set(p.x, h + 10 * s, p.z);
    add(mast);
    glowAt(p.x, h + 6 * s, p.z, 0xf2ece0, 28 * s, 24 * s);
    towerHit(p.x, p.z, 9 * s, 10 * s, 7 * s);
  };
  const placeTlvTowers = (s: number) => {
    placeCityGate(s);
    placeToHa(s);
    placeSarona(s);
    placeHakirya(s);
    placeShalomMeir(s);
    placeMidtown(s);
    placeElectra(s);
  };
  const placeNycSkyline = (ox: number, oz: number, s: number) => {
    const wtcH = 118 * s;
    const wtc = new THREE.Mesh(new THREE.BoxGeometry(14 * s, wtcH, 14 * s), paleGlass);
    wtc.position.set(ox, wtcH * 0.5, oz);
    add(wtc);
    const wtcTip = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * s, 1.8 * s, 28 * s, 6), bandMat);
    wtcTip.position.set(ox, wtcH + 12 * s, oz);
    add(wtcTip);
    const esH = 92 * s;
    const es = new THREE.Mesh(new THREE.BoxGeometry(16 * s, esH, 12 * s), darkGlass);
    es.position.set(ox + 32 * s, esH * 0.5, oz + 28 * s);
    add(es);
    const es2 = new THREE.Mesh(new THREE.BoxGeometry(10 * s, 22 * s, 8 * s), darkGlass);
    es2.position.set(ox + 32 * s, esH + 10 * s, oz + 28 * s);
    add(es2);
    const esMast = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * s, 0.4 * s, 22 * s, 6), bandMat);
    esMast.position.set(ox + 32 * s, esH + 32 * s, oz + 28 * s);
    add(esMast);
    const chr = new THREE.Mesh(new THREE.BoxGeometry(11 * s, 70 * s, 11 * s), paleGlass);
    chr.position.set(ox - 28 * s, 35 * s, oz + 18 * s);
    add(chr);
    const chrCrown = new THREE.Mesh(new THREE.CylinderGeometry(2.2 * s, 7.4 * s, 16 * s, 8), paleGlass);
    chrCrown.position.set(ox - 28 * s, 78 * s, oz + 18 * s);
    add(chrCrown);
    const flat = new THREE.Mesh(new THREE.CylinderGeometry(10 * s, 10 * s, 48 * s, 3), cream);
    flat.position.set(ox + 18 * s, 24 * s, oz - 36 * s);
    flat.rotation.y = 0.4;
    add(flat);
    glowAt(ox, wtcH + 8, oz, 13166847, 52 * s, 48 * s);
    glowAt(ox + 32 * s, esH + 12, oz + 28 * s, 16771248, 36 * s, 34 * s);
    hit(ox, oz, 10 * s);
    hit(ox + 32 * s, oz + 28 * s, 9 * s);
  };
  const placeGothicTower = (x: number, z: number, h: number) => {
    const body = new THREE.Mesh(new THREE.BoxGeometry(10, h, 8), stone);
    body.position.set(x, h * 0.5, z);
    add(body);
    const arch = new THREE.Mesh(new THREE.BoxGeometry(4.2, h * 0.42, 2.2), stone);
    arch.position.set(x, h * 0.38, z);
    add(arch);
    for (const sx of [-4.2, 4.2]) {
      const pin = new THREE.Mesh(new THREE.ConeGeometry(1.4, 8, 4), stone);
      pin.position.set(x + sx, h + 3.5, z);
      add(pin);
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(11, 3.2, 9), stone);
    top.position.set(x, h + 0.8, z);
    add(top);
    hit(x, z, 8);
  };
  if (def.id === "hayarkon") {
    const hi = tlv(32.0893, 34.7694);
    {
      const n = nearestIndex(built.samples, hi.x, hi.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        hi.x = s.x + s.rx * (built.width / 2 + 24);
        hi.z = s.z + s.rz * (built.width / 2 + 24);
      }
    }
    const hilton = new THREE.Mesh(new THREE.CylinderGeometry(20, 21, 34, 20, 1, false, 0.55, 2.05), white);
    hilton.position.set(hi.x, 17, hi.z);
    hilton.rotation.y = -0.35;
    add(hilton);
    for (let i = 0; i < 11; i++) {
      const terrace = new THREE.Mesh(new THREE.CylinderGeometry(20.6, 21.4, 0.22, 20, 1, false, 0.55, 2.05), cream);
      terrace.position.set(hi.x, 3.2 + i * 2.9, hi.z);
      terrace.rotation.y = -0.35;
      add(terrace);
    }
    const hiltonRoof = new THREE.Mesh(new THREE.CylinderGeometry(16, 20, 2.4, 20, 1, false, 0.55, 2.05), cream);
    hiltonRoof.position.set(hi.x, 35.2, hi.z);
    hiltonRoof.rotation.y = -0.35;
    add(hiltonRoof);
    const winG = new THREE.PlaneGeometry(1.1, 1.4);
    bag.push(winG);
    const hiltonWins = new THREE.InstancedMesh(winG, darkGlass, 90);
    let hwi = 0;
    for (let f = 0; f < 10; f++) for (let c = 0; c < 9; c++) {
      const a = -0.35 + 0.55 + c / 8 * 2.05;
      const wy = 4.4 + f * 2.9;
      _dummy.position.set(hi.x + Math.cos(a) * 20.4, wy, hi.z + Math.sin(a) * 20.4);
      _dummy.scale.set(1, 1, 1);
      _dummy.lookAt(hi.x + Math.cos(a) * 28, wy, hi.z + Math.sin(a) * 28);
      _dummy.updateMatrix();
      hiltonWins.setMatrixAt(hwi++, _dummy.matrix);
    }
    hiltonWins.instanceMatrix.needsUpdate = true;
    group.add(hiltonWins);
    const op = tlv(32.0768, 34.7662);
    {
      const n = nearestIndex(built.samples, op.x, op.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        op.x = s.x + s.rx * (built.width / 2 + 22);
        op.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const operaBase = new THREE.Mesh(new THREE.CylinderGeometry(11, 12.4, 6, 20), cream);
    operaBase.position.set(op.x, 3, op.z);
    add(operaBase);
    const opera = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 8.4, 36, 22), cream);
    opera.position.set(op.x, 24, op.z);
    add(opera);
    for (let y = 8; y < 40; y += 3.1) {
      const win = new THREE.Mesh(new THREE.TorusGeometry(7.9, 0.18, 5, 22), darkGlass);
      win.rotation.x = Math.PI / 2;
      win.position.set(op.x, y, op.z);
      add(win);
    }
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 5.5, 6), white);
      col.position.set(op.x + Math.cos(a) * 8.6, 44, op.z + Math.sin(a) * 8.6);
      add(col);
    }
    const operaRing = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.42, 6, 20), white);
    operaRing.rotation.x = Math.PI / 2;
    operaRing.position.set(op.x, 47, op.z);
    add(operaRing);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(9.2, 5.2, 5.4, 18), white);
    crown.position.set(op.x, 50.2, op.z);
    add(crown);
    const danP = tlv(32.0814, 34.7672);
    {
      const n = nearestIndex(built.samples, danP.x, danP.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        danP.x = s.x + s.rx * (built.width / 2 + 20);
        danP.z = s.z + s.rz * (built.width / 2 + 20);
      }
    }
    const dan = new THREE.Mesh(new THREE.BoxGeometry(12, 28, 38), white);
    dan.position.set(danP.x, 14, danP.z);
    add(dan);
    for (let y = 4; y < 26; y += 2.8) {
      const bal = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.18, 39), cream);
      bal.position.set(danP.x, y, danP.z);
      add(bal);
    }
    for (const sx of [-6.08, 6.08]) {
      const pane = new THREE.Mesh(new THREE.BoxGeometry(0.1, 22, 34), darkGlass);
      pane.position.set(danP.x + sx, 14, danP.z);
      add(pane);
    }
    const danRoof = new THREE.Mesh(new THREE.BoxGeometry(10, 2.2, 28), cream);
    danRoof.position.set(danP.x, 29.2, danP.z);
    add(danRoof);
    const carP = tlv(32.0866, 34.7678);
    {
      const n = nearestIndex(built.samples, carP.x, carP.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        carP.x = s.x + s.rx * (built.width / 2 + 20);
        carP.z = s.z + s.rz * (built.width / 2 + 20);
      }
    }
    for (let i = 0; i < 5; i++) {
      const w = 16 - i * 1.4;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 5.2, 22 - i * 1.1), i % 2 ? white : cream);
      slab.position.set(carP.x, 2.8 + i * 5.4, carP.z);
      add(slab);
    }
    const carHat = new THREE.Mesh(new THREE.BoxGeometry(8.4, 2.2, 12), cream);
    carHat.position.set(carP.x, 28.4, carP.z);
    add(carHat);
    hit(carP.x, carP.z, 9);
    glowAt(carP.x, 26, carP.z, 16777200, 22, 18);
    const poolP = tlv(32.0848, 34.768);
    const pool = new THREE.Mesh(new THREE.BoxGeometry(18, 0.25, 9), cyan);
    pool.position.set(poolP.x, 0.2, poolP.z);
    add(pool);
    const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(22, 0.18, 13), stone);
    poolDeck.position.set(poolP.x, 0.08, poolP.z);
    add(poolDeck);
    const poolHall = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 8), white);
    poolHall.position.set(poolP.x + 8, 2.1, poolP.z);
    add(poolHall);
    const mar = tlv(32.0938, 34.7688);
    const breakw = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.4, 52), stone);
    breakw.position.set(mar.x - 36, 0.5, mar.z);
    add(breakw);
    const breakw2 = new THREE.Mesh(new THREE.BoxGeometry(28, 1.2, 4), stone);
    breakw2.position.set(mar.x - 22, 0.45, mar.z - 26);
    add(breakw2);
    const pier = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 42), wood);
    pier.position.set(mar.x - 18, 0.15, mar.z);
    add(pier);
    const marina = new THREE.Mesh(new THREE.BoxGeometry(22, 4.2, 12), cream);
    marina.position.set(mar.x, 2.1, mar.z);
    add(marina);
    const lightH = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 14, 8), white);
    lightH.position.set(mar.x - 34, 7, mar.z - 22);
    add(lightH);
    const lightCap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 1.6, 8), cream);
    lightCap.position.set(mar.x - 34, 14.6, mar.z - 22);
    add(lightCap);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), new THREE.MeshBasicMaterial({ color: 16777136 }));
    lamp.position.set(mar.x - 34, 15.8, mar.z - 22);
    add(lamp);
    for (let i = 0; i < 8; i++) {
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 8.2), i % 2 ? white : cream);
      hull.position.set(mar.x - 30 - i % 2 * 7, 0.45, mar.z - 22 + i * 7);
      hull.rotation.y = 0.12;
      add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 3.2), white);
      cabin.position.set(mar.x - 30 - i % 2 * 7, 1.3, mar.z - 22 + i * 7);
      add(cabin);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 9, 5), wood);
      mast.position.set(mar.x - 30 - i % 2 * 7, 5.2, mar.z - 22 + i * 7);
      add(mast);
    }
    const rd = tlv(32.1044, 34.7794);
    {
      const n = nearestIndex(built.samples, rd.x, rd.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        rd.x = s.x + s.rx * (built.width / 2 + 26);
        rd.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const brick = new THREE.MeshStandardMaterial({ color: 9067074, roughness: 0.9 });
    bag.push(brick);
    const rdHall = new THREE.Mesh(new THREE.BoxGeometry(36, 12, 20), brick);
    rdHall.position.set(rd.x, 6, rd.z);
    add(rdHall);
    const rdHall2 = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 14), cream);
    rdHall2.position.set(rd.x + 8, 4, rd.z + 12);
    add(rdHall2);
    for (const ox of [-8, 8]) {
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.7, 52, 14), brick);
      stack.position.set(rd.x + ox, 32, rd.z);
      add(stack);
      for (let b = 0; b < 5; b++) {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.5, 1.7, 14), white);
        ring.position.set(rd.x + ox, 14 + b * 8, rd.z);
        add(ring);
      }
      const lip = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.2, 1.6, 14), brick);
      lip.position.set(rd.x + ox, 58.4, rd.z);
      add(lip);
    }
    hit(rd.x, rd.z, 12, 16, 10);
    glowAt(rd.x, 48, rd.z, 16764000, 28, 22);
    const umbMat = new THREE.MeshStandardMaterial({
      color: 15920864,
      roughness: 0.7
    });
    const poleG = new THREE.CylinderGeometry(0.05, 0.06, 2.4, 5);
    const capG = new THREE.ConeGeometry(1.6, 0.55, 8);
    for (let i = 0; i < 22; i++) {
      const u = tlv(32.062 + i * 14e-4, 34.7604);
      const pole = new THREE.Mesh(poleG, wood);
      pole.position.set(u.x, 1.2, u.z);
      add(pole);
      const cap = new THREE.Mesh(capG, i % 2 ? umbMat : terracotta);
      cap.position.set(u.x, 2.5, u.z);
      add(cap);
    }
    bag.push(umbMat, poleG, capG);
    const peach = new THREE.MeshStandardMaterial({
      color: 15255720,
      roughness: 0.62
    });
    const sandM = new THREE.MeshStandardMaterial({
      color: 14206096,
      roughness: 0.96
    });
    const promMat = new THREE.MeshStandardMaterial({
      color: 14144440,
      roughness: 0.88
    });
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 5875780,
      roughness: 0.95
    });
    bag.push(peach, sandM, promMat, lawnMat);
    const sand = new THREE.Mesh(new THREE.BoxGeometry(48, 0.22, 920), sandM);
    sand.position.set(tlv(32.08, 34.763).x, 0.04, tlv(32.08, 34.763).z);
    sand.rotation.y = 0.28;
    add(sand);
    const prom = new THREE.Mesh(new THREE.BoxGeometry(9, 0.14, 820), promMat);
    prom.position.set(tlv(32.08, 34.7658).x, 0.1, tlv(32.08, 34.7658).z);
    prom.rotation.y = 0.28;
    add(prom);
    const clore = tlv(32.0618, 34.7612);
    const lawn = new THREE.Mesh(new THREE.BoxGeometry(70, 0.12, 110), lawnMat);
    lawn.position.set(clore.x, 0.06, clore.z);
    add(lawn);
    const carl = tlv(32.0865, 34.7688);
    {
      const n = nearestIndex(built.samples, carl.x, carl.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        carl.x = s.x + s.rx * (built.width / 2 + 22);
        carl.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const carlA = new THREE.Mesh(new THREE.BoxGeometry(11, 44, 11), white);
    carlA.position.set(carl.x, 22, carl.z);
    add(carlA);
    const carlB = new THREE.Mesh(new THREE.BoxGeometry(10, 36, 10), cream);
    carlB.position.set(carl.x + 14, 18, carl.z + 4);
    add(carlB);
    for (let y = 6; y < 40; y += 3.2) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.16, 11.6), cream);
      sl.position.set(carl.x, y, carl.z);
      add(sl);
    }
    const skyb = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, 5), paleGlass);
    skyb.position.set(carl.x + 7, 24, carl.z + 2);
    add(skyb);
    const yam = tlv(32.0795, 34.7668);
    const yamT = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.2, 46, 12), white);
    yamT.position.set(yam.x, 23, yam.z);
    add(yamT);
    const yamCap = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 3.8, 4.2, 12), cream);
    yamCap.position.set(yam.x, 48, yam.z);
    add(yamCap);
    const dav = tlv(32.0638, 34.7648);
    const david = new THREE.Mesh(new THREE.BoxGeometry(36, 18, 16), cream);
    david.position.set(dav.x, 9, dav.z);
    add(david);
    const davidMid = new THREE.Mesh(new THREE.BoxGeometry(28, 12, 14), white);
    davidMid.position.set(dav.x, 21, dav.z);
    add(davidMid);
    const davidTop = new THREE.Mesh(new THREE.BoxGeometry(20, 8, 12), cream);
    davidTop.position.set(dav.x, 31, dav.z);
    add(davidTop);
    const sher = tlv(32.083, 34.7674);
    const sheraton = new THREE.Mesh(new THREE.BoxGeometry(16, 22, 10), peach);
    sheraton.position.set(sher.x, 11, sher.z);
    add(sheraton);
    for (let y = 4; y < 20; y += 2.6) {
      const shade = new THREE.Mesh(new THREE.BoxGeometry(17.2, 0.14, 11), cream);
      shade.position.set(sher.x, y, sher.z);
      add(shade);
    }
    const dol = tlv(32.0648, 34.7618);
    const dolRing = new THREE.Mesh(new THREE.TorusGeometry(12, 1.4, 8, 24), stone);
    dolRing.rotation.x = Math.PI / 2;
    dolRing.position.set(dol.x, 0.8, dol.z);
    add(dolRing);
    const dolInner = new THREE.Mesh(new THREE.CylinderGeometry(8, 9.5, 2.4, 16, 1, true), stone);
    dolInner.position.set(dol.x, 1.2, dol.z);
    add(dolInner);
    const smH = tlv(32.0639, 34.7688);
    const smHM = new THREE.Mesh(new THREE.BoxGeometry(16, 62, 10), cream);
    smHM.position.set(smH.x, 31, smH.z);
    add(smHM);
    const smMastH = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 16, 6), bandMat);
    smMastH.position.set(smH.x, 70, smH.z);
    add(smMastH);
    glowAt(hi.x, 36, hi.z, 16769200, 38, 36);
    glowAt(op.x, 50, op.z, 16771264, 32, 32);
    const skipRoad = (x: number, z: number, r: number) => {
      const n = nearestIndex(built.samples, x, z, 0);
      if (n.dist > built.width / 2 + 6) hit(x, z, r);
    };
    skipRoad(smH.x, smH.z, 8);
    skipRoad(hi.x, hi.z, 16);
    skipRoad(op.x, op.z, 10);
    skipRoad(danP.x, danP.z, 14);
    skipRoad(carl.x, carl.z, 10);
    skipRoad(carl.x + 14, carl.z + 4, 8);
    skipRoad(yam.x, yam.z, 6);
    skipRoad(dav.x, dav.z, 14);
    skipRoad(sher.x, sher.z, 8);
    skipRoad(dol.x, dol.z, 10);
    skipRoad(mar.x, mar.z, 10);
    const rdH = tlv(32.1044, 34.7776);
    {
      const n = nearestIndex(built.samples, rdH.x, rdH.z, 0);
      const s = built.samples[n.index];
      placeTunnel(s.x, s.z, Math.atan2(s.tx, s.tz), 82, built.width * 0.72, 8.8, s.y);
      if (n.dist < built.width / 2 + 12) {
        rdH.x = s.x + s.rx * (built.width / 2 + 26);
        rdH.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const chimH = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 5.6, 92, 16), cream);
    chimH.position.set(rdH.x, 46, rdH.z);
    add(chimH);
    const chimGalH = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 4.2, 2.8, 16), cream);
    chimGalH.position.set(rdH.x, 93, rdH.z);
    add(chimGalH);
    const chimTopH = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.6, 3.4, 16), cream);
    chimTopH.position.set(rdH.x, 96, rdH.z);
    add(chimTopH);
    const redRing = new THREE.MeshStandardMaterial({ color: 0xc43c28, roughness: 0.52 });
    bag.push(redRing);
    for (let i = 0; i < 16; i++) {
      const bandH = new THREE.Mesh(new THREE.CylinderGeometry(4.05, 4.2, 3.2, 14), i % 2 ? redRing : white);
      bandH.position.set(rdH.x, 22 + i * 4.4, rdH.z);
      add(bandH);
    }
    skipRoad(rdH.x, rdH.z, 5);
  }
  if (def.id === "oldjaffa") {
    const ochre = new THREE.MeshStandardMaterial({
      color: 0xc4a070,
      roughness: 0.9,
      envMapIntensity: 0.22
    });
    const ochreDark = new THREE.MeshStandardMaterial({
      color: 0xa07848,
      roughness: 0.92
    });
    const lime = new THREE.MeshStandardMaterial({
      color: 13215092,
      roughness: 0.82
    });
    bag.push(ochre, ochreDark, lime);
    const ck = tlv(32.0556, 34.7558);
    {
      const n = nearestIndex(built.samples, ck.x, ck.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        ck.x = s.x + s.rx * (built.width / 2 + 16);
        ck.z = s.z + s.rz * (built.width / 2 + 16);
      }
    }
    const tower = new THREE.Mesh(new THREE.BoxGeometry(5.2, 32, 5.2), ochre);
    tower.position.set(ck.x, 17.2, ck.z);
    add(tower);
    for (let y = 6.2; y < 30; y += 4.6) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(5.55, 0.36, 5.55), lime);
      band.position.set(ck.x, y, ck.z);
      add(band);
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(8.4, 4.2, 8.4), ochreDark);
    base.position.set(ck.x, 2.1, ck.z);
    add(base);
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 0.18, 20), ochreDark);
    plaza.position.set(ck.x - 6, 0.1, ck.z);
    add(plaza);
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.24, 5.8), lime);
    balcony.position.set(ck.x, 18.8, ck.z);
    add(balcony);
    for (let lvl = 0; lvl < 4; lvl++) {
      for (const a of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.32, 10, 1, false, 0, Math.PI), darkArch);
        arch.rotation.z = Math.PI / 2;
        arch.position.set(ck.x + Math.sin(a) * 2.45, 4.8 + lvl * 3.6, ck.z + Math.cos(a) * 2.45);
        arch.rotation.y = a;
        add(arch);
      }
    }
    const clockTex = getJaffaClock();
    const faceMat = new THREE.MeshStandardMaterial({
      map: clockTex ?? undefined,
      color: clockTex ? 0xffffff : 0xf4eee0,
      roughness: 0.45,
      emissive: 3351050,
      emissiveIntensity: isNight ? 0.55 : 0.08
    });
    emitList.push({
      mat: faceMat,
      night: 0.55,
      day: 0.08
    });
    bag.push(faceMat);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.05, 22), faceMat);
      face.position.set(ck.x + Math.sin(a) * 2.66, 26.4, ck.z + Math.cos(a) * 2.66);
      face.lookAt(ck.x + Math.sin(a) * 8, 26.4, ck.z + Math.cos(a) * 8);
      add(face);
    }
    const cap = new THREE.Mesh(new THREE.ConeGeometry(3.6, 6.4, 4), ochreDark);
    cap.rotation.y = Math.PI / 4;
    cap.position.set(ck.x, 36.2, ck.z);
    add(cap);
    const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 2.8, 6), ochreDark);
    finial.position.set(ck.x, 40.2, ck.z);
    add(finial);
    hit(ck.x, ck.z, 5.5, 4.2, 4.2);
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 1.6 + 0.4;
      const hx = ck.x + Math.cos(a) * (18 + i % 3 * 4);
      const hz = ck.z + Math.sin(a) * (16 + i % 2 * 5);
      if (nearestIndex(built.samples, hx, hz, 0).dist < built.width / 2 + 6) continue;
      const h = 5.2 + i % 4 * 1.6;
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.2 + i % 3, h, 5.4 + i % 2), i % 2 ? ochre : ochreDark);
      house.position.set(hx, h * 0.5, hz);
      add(house);
      const vault = new THREE.Mesh(new THREE.CylinderGeometry(2.4 + i % 2 * 0.4, 2.4 + i % 2 * 0.4, 6.4 + i % 3, 10, 1, false, 0, Math.PI), ochreDark);
      vault.rotation.z = Math.PI / 2;
      vault.position.set(hx, h + 0.9, hz);
      add(vault);
      const arch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.3), darkArch);
      arch.position.set(hx, 1.2, hz + 2.8);
      add(arch);
      if (i % 3 === 0) {
        const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), lime);
        dome.position.set(hx, h + 2.4, hz);
        add(dome);
      }
      hit(hx, hz, 3.4, 3.2, 2.8);
    }
    const mq = tlv(32.0564, 34.7568);
    {
      const n = nearestIndex(built.samples, mq.x, mq.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        mq.x = s.x + s.rx * (built.width / 2 + 20);
        mq.z = s.z + s.rz * (built.width / 2 + 20);
      }
    }
    const mosque = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 14), ochre);
    mosque.position.set(mq.x, 4, mq.z);
    add(mosque);
    const mdome = new THREE.Mesh(new THREE.SphereGeometry(4.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
    mdome.position.set(mq.x, 8.2, mq.z);
    add(mdome);
    const minaret2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.45, 22, 10), lime);
    minaret2.position.set(mq.x + 7, 11, mq.z - 4);
    add(minaret2);
    const mcap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.8, 8), cream);
    mcap.position.set(mq.x + 7, 23.4, mq.z - 4);
    add(mcap);
    const pt = tlv(32.0524, 34.7492);
    const quay = new THREE.Mesh(new THREE.BoxGeometry(22, 0.7, 86), ochreDark);
    quay.position.set(pt.x, 0.18, pt.z);
    add(quay);
    for (const sh of [
      {
        lat: 32.0516,
        lon: 34.7494
      },
      {
        lat: 32.0522,
        lon: 34.7496
      },
      {
        lat: 32.0528,
        lon: 34.7498
      },
      {
        lat: 32.0534,
        lon: 34.75
      }
    ]) {
      const p = tlv(sh.lat, sh.lon);
      {
        const n = nearestIndex(built.samples, p.x, p.z, 0);
        if (n.dist < built.width / 2 + 10) {
          const s = built.samples[n.index];
          p.x = s.x + s.rx * (built.width / 2 + 18);
          p.z = s.z + s.rz * (built.width / 2 + 18);
        }
      }
      const shed = new THREE.Mesh(new THREE.BoxGeometry(18, 6.4, 14), ochre);
      shed.position.set(p.x, 3.2, p.z);
      add(shed);
      for (let a = 0; a < 3; a++) {
        const door = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 0.4), darkArch);
        door.position.set(p.x - 9, 1.9, p.z - 4 + a * 4);
        add(door);
      }
      const roof = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 16), terracotta);
      roof.position.set(p.x, 6.6, p.z);
      add(roof);
      hit(p.x, p.z, 6);
    }
    const hullCols = [
      12860456,
      15262940,
      2779786,
      13934688
    ];
    for (let i = 0; i < 9; i++) {
      const col = hullCols[i % hullCols.length];
      const hullMat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.55
      });
      bag.push(hullMat);
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 9.2), hullMat);
      hull.position.set(pt.x - 22 - i % 3 * 5, 0.7, pt.z - 30 + i * 8);
      hull.rotation.y = 0.12;
      add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 3.2), white);
      cabin.position.set(pt.x - 22 - i % 3 * 5, 2.1, pt.z - 30 + i * 8);
      add(cabin);
    }
    const pier = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 22), wood);
    pier.position.set(pt.x - 18, 0.4, pt.z + 8);
    add(pier);
    {
      const lh = tlv(32.0533, 34.751);
      const nL = nearestIndex(built.samples, lh.x, lh.z, 0);
      if (nL.dist < built.width / 2 + 12) {
        const sL = built.samples[nL.index];
        lh.x = sL.x + sL.rx * (built.width / 2 + 26);
        lh.z = sL.z + sL.rz * (built.width / 2 + 26);
      }
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.55, 14, 10), lime);
      stem.position.set(lh.x, 7.2, lh.z);
      add(stem);
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.5, 2.4, 10), cream);
      lantern.position.set(lh.x, 15.4, lh.z);
      add(lantern);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff2c8 }));
      lamp.position.set(lh.x, 16.8, lh.z);
      add(lamp);
      glowAt(lh.x, 16.8, lh.z, 16777136, 22, 16);
      hit(lh.x, lh.z, 2.4);
    }
    const ch = tlv(32.0546, 34.7508);
    {
      const n = nearestIndex(built.samples, ch.x, ch.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        ch.x = s.x + s.rx * (built.width / 2 + 22);
        ch.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const nave = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 22), cream);
    nave.position.set(ch.x, 8, ch.z);
    add(nave);
    const belfry = new THREE.Mesh(new THREE.BoxGeometry(6.2, 28, 6.2), cream);
    belfry.position.set(ch.x - 2, 16, ch.z - 8);
    add(belfry);
    const bclock = new THREE.Mesh(new THREE.CircleGeometry(1.05, 16), faceMat);
    bclock.position.set(ch.x - 2, 26, ch.z - 11.2);
    add(bclock);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(4.2, 7.4, 4), cream);
    spire.rotation.y = Math.PI / 4;
    spire.position.set(ch.x - 2, 33.4, ch.z - 8);
    add(spire);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.2, 0.18), white);
    cross.position.set(ch.x - 2, 38, ch.z - 8);
    add(cross);
    tlv(32.054, 34.7522);
    const oldHouses = [
      {
        lat: 32.0538,
        lon: 34.7532,
        w: 6.2,
        h: 5.4,
        d: 5.8,
        col: ochre
      },
      {
        lat: 32.054,
        lon: 34.7536,
        w: 5.6,
        h: 6.8,
        d: 5.2,
        col: ochreDark
      },
      {
        lat: 32.0544,
        lon: 34.7534,
        w: 7.4,
        h: 5.2,
        d: 6.4,
        col: lime
      },
      {
        lat: 32.0548,
        lon: 34.753,
        w: 5.8,
        h: 7.2,
        d: 5.4,
        col: ochre
      },
      {
        lat: 32.0546,
        lon: 34.754,
        w: 6.6,
        h: 6,
        d: 5.6,
        col: ochreDark
      },
      {
        lat: 32.0536,
        lon: 34.7538,
        w: 5.2,
        h: 5.8,
        d: 6.2,
        col: lime
      },
      {
        lat: 32.0534,
        lon: 34.7544,
        w: 6.8,
        h: 4.8,
        d: 5.4,
        col: ochre
      },
      {
        lat: 32.055,
        lon: 34.7538,
        w: 5.4,
        h: 6.4,
        d: 5.8,
        col: ochreDark
      }
    ];
    for (const h of oldHouses) {
      const p = tlv(h.lat, h.lon);
      const nearH = nearestIndex(built.samples, p.x, p.z, 0);
      if (nearH.dist < built.width / 2 + 8) {
        const s = built.samples[nearH.index];
        p.x = s.x + s.rx * (built.width / 2 + 14);
        p.z = s.z + s.rz * (built.width / 2 + 14);
      }
      const house = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), h.col);
      house.position.set(p.x, 1.6 + h.h * 0.5, p.z);
      add(house);
      const r = new THREE.Mesh(new THREE.BoxGeometry(h.w + 0.4, 0.28, h.d + 0.4), terracotta);
      r.position.set(p.x, 1.6 + h.h + 0.16, p.z);
      add(r);
      const door = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.28, 10, 1, false, 0, Math.PI), darkArch);
      door.rotation.z = Math.PI / 2;
      door.position.set(p.x, 2.4, p.z + h.d * 0.51);
      add(door);
      hit(p.x, p.z, 4);
    }
    const awnCols = [10762792, 12880440, 6961698, 12085296];
    for (let ilat = 0; ilat < 8; ilat++) {
      for (let ilon = 0; ilon < 7; ilon++) {
        const lat = 32.0528 + ilat * 32e-5;
        const lon = 34.7514 + ilon * 38e-5;
        const p = tlv(lat, lon);
        const near = nearestIndex(built.samples, p.x, p.z, 0);
        if (near.dist < built.width / 2 + 11) continue;
        const seed = ilat * 7 + ilon;
        const hh = 4.4 + seed % 5 * 0.85;
        const ww = 5.2 + seed % 3 * 0.7;
        const dd = 4.8 + seed % 2 * 0.8;
        const col = seed % 3 === 0 ? ochre : seed % 3 === 1 ? ochreDark : lime;
        const yHill = 0.4 + ilon * 0.35;
        const house = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), col);
        house.position.set(p.x, yHill + hh * 0.5, p.z);
        add(house);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.5, 0.28, dd + 0.5), terracotta);
        roof.position.set(p.x, yHill + hh + 0.2, p.z);
        add(roof);
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.12), darkArch);
        win.position.set(p.x, yHill + 2.2, p.z + dd * 0.51);
        add(win);
        if (seed % 4 === 0) {
          const awn = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: awnCols[seed % 4], roughness: 0.9 }));
          awn.position.set(p.x, yHill + 2.8, p.z + dd * 0.55);
          add(awn);
        }
        hit(p.x, p.z, 3.2);
      }
    }
    const lightH = tlv(32.0533, 34.7502);
    const lightBase = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.2, 11, 12), cream);
    lightBase.position.set(lightH.x, 5.6, lightH.z);
    add(lightBase);
    const gallery = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.35, 12), ochreDark);
    gallery.position.set(lightH.x, 11.3, lightH.z);
    add(gallery);
    const lightTop = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 2.8, 10), white);
    lightTop.position.set(lightH.x, 12.8, lightH.z);
    add(lightTop);
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(1.05, 10, 8), new THREE.MeshBasicMaterial({ color: 16773828 }));
    lantern.position.set(lightH.x, 14.2, lightH.z);
    add(lantern);
    const lightCap = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.6, 8), ochreDark);
    lightCap.position.set(lightH.x, 15.6, lightH.z);
    add(lightCap);
    glowAt(lightH.x, 14.2, lightH.z, 16771232, 22, 18);
    const kdm = tlv(32.0542, 34.752);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 14), ochre);
    well.position.set(kdm.x, 0.4, kdm.z);
    add(well);
    const flea = tlv(32.0535, 34.7588);
    const cloth = [
      new THREE.MeshStandardMaterial({ color: 10762792, roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 12884544, roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 3824248, roughness: 0.88 })
    ];
    bag.push(...cloth);
    for (let i = 0; i < 8; i++) {
      const pierA = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.4, 1.6), ochre);
      pierA.position.set(flea.x + i * 4.2, 2.7, flea.z);
      add(pierA);
      if (i < 7) {
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.1, 1.8), ochreDark);
        lintel.position.set(flea.x + i * 4.2 + 2.1, 5.6, flea.z);
        add(lintel);
        const shop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 0.3), darkArch);
        shop.position.set(flea.x + i * 4.2 + 2.1, 2.2, flea.z + 0.9);
        add(shop);
        const awn = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 2.4), cloth[i % 3]);
        awn.position.set(flea.x + i * 4.2 + 2.1, 4.4, flea.z + 1.6);
        add(awn);
      }
    }
    const rock = tlv(32.0528, 34.7486);
    const andromeda = new THREE.Mesh(new THREE.DodecahedronGeometry(3.4, 0), ochreDark);
    andromeda.position.set(rock.x, 0.6, rock.z);
    add(andromeda);
    glowAt(ck.x, 26, ck.z, 16770736, 36, 28);
    glowAt(ch.x - 2, 30, ch.z - 8, 16771272, 28, 24);
    glowAt(pt.x, 6, pt.z, 16763e3, 24, 22);
    const skipJ = (x: number, z: number, r: number) => {
      const n = nearestIndex(built.samples, x, z, 0);
      if (n.dist > built.width / 2 + 5) hit(x, z, r);
    };
    skipJ(ck.x, ck.z, 4.5);
    skipJ(ch.x, ch.z, 7);
    skipJ(mq.x, mq.z, 7);
    skipJ(pt.x, pt.z, 6);
    skipJ(lightH.x, lightH.z, 3);
  }
  if (def.id === "telaviv") {
    const az = tlv(32.0744, 34.7938);
    placeAzrieli(1.22);
    placeToHa(1.05);
    placeCityGate(1);
    const saT = tlv(32.0714, 34.7866);
    const saronaTw = new THREE.Mesh(new THREE.BoxGeometry(11, 92, 11), glass);
    saronaTw.position.set(saT.x, 46, saT.z);
    add(saronaTw);
    const saCap = new THREE.Mesh(new THREE.BoxGeometry(8.4, 16, 8.4), paleGlass);
    saCap.position.set(saT.x, 100, saT.z);
    add(saCap);
    tlv(32.071, 34.7858);
    const houseSpec = [
      { lat: 32.0706, lon: 34.7848, w: 6.8, d: 8.2, h: 5.8, col: cream, roof: terracotta },
      { lat: 32.071, lon: 34.7852, w: 5.6, d: 7.4, h: 4.8, col: white, roof: terracotta },
      { lat: 32.0714, lon: 34.7846, w: 7.2, d: 6.6, h: 6.4, col: cream, roof: terracotta },
      { lat: 32.0708, lon: 34.7844, w: 6.2, d: 7.8, h: 5.2, col: white, roof: terracotta },
      { lat: 32.0712, lon: 34.7842, w: 5.4, d: 6.8, h: 4.6, col: cream, roof: terracotta },
      { lat: 32.0716, lon: 34.785, w: 8.4, d: 7.2, h: 7.2, col: white, roof: terracotta }
    ];
    for (const h of houseSpec) {
      const p = tlv(h.lat, h.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), h.col);
      house.position.set(p.x, h.h * 0.5, p.z);
      add(house);
      const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(h.w, h.d) * 0.58, 2.4, 4), h.roof);
      r.rotation.y = Math.PI / 4;
      r.position.set(p.x, h.h + 1.2, p.z);
      add(r);
      hit(p.x, p.z, 4);
    }
    const saHall = tlv(32.0712, 34.7844);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(10, 8.4, 16), cream);
    hall.position.set(saHall.x, 4.2, saHall.z);
    add(hall);
    const hallRoof = new THREE.Mesh(new THREE.BoxGeometry(11, 0.5, 17), terracotta);
    hallRoof.position.set(saHall.x, 8.6, saHall.z);
    add(hallRoof);
    hit(saHall.x, saHall.z, 6);
    const mkt = tlv(32.0704, 34.7838);
    const mktHall = new THREE.Mesh(new THREE.BoxGeometry(22, 6.2, 9), paleGlass);
    mktHall.position.set(mkt.x, 3.1, mkt.z);
    add(mktHall);
    const mktFrame = new THREE.Mesh(new THREE.BoxGeometry(23.2, 0.35, 10.2), bandMat);
    mktFrame.position.set(mkt.x, 6.4, mkt.z);
    add(mktFrame);
    for (const ox of [-8, 0, 8]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.35, 6.4, 9.4), bandMat);
      rib.position.set(mkt.x + ox, 3.2, mkt.z);
      add(rib);
    }
    hit(mkt.x, mkt.z, 8);
    const ky = tlv(32.0754, 34.7874);
    const kirya = new THREE.Mesh(new THREE.BoxGeometry(16, 42, 12), cream);
    kirya.position.set(ky.x, 21, ky.z);
    add(kirya);
    const kirHat = new THREE.Mesh(new THREE.BoxGeometry(17.2, 4.4, 13), bandMat);
    kirHat.position.set(ky.x, 44.2, ky.z);
    add(kirHat);
    const el = tlv(32.0804, 34.7942);
    const electra = new THREE.Mesh(new THREE.BoxGeometry(13.2, 88, 13.2), azSqGlass);
    electra.position.set(el.x, 44, el.z);
    add(electra);
    const elMast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 24, 8), bandMat);
    elMast.position.set(el.x, 100, el.z);
    add(elMast);
    const md = tlv(32.0798, 34.7934);
    const midA = new THREE.Mesh(new THREE.BoxGeometry(11, 76, 13), gateGlass);
    midA.position.set(md.x - 8, 38, md.z);
    add(midA);
    const midB = new THREE.Mesh(new THREE.BoxGeometry(11, 68, 13), gateGlass);
    midB.position.set(md.x + 8, 34, md.z);
    add(midB);
    const sp = tlv(32.0758, 34.7946);
    const spiral = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 9.4, 72, 12), glass);
    spiral.position.set(sp.x, 36, sp.z);
    add(spiral);
    const hb = tlv(32.0728, 34.7794);
    const hbPlaza = new THREE.Mesh(new THREE.CylinderGeometry(28, 28, 0.16, 32), stone);
    hbPlaza.position.set(hb.x, 0.08, hb.z);
    add(hbPlaza);
    const hbRing = new THREE.Mesh(new THREE.TorusGeometry(20, 0.55, 6, 28), cream);
    hbRing.rotation.x = Math.PI / 2;
    hbRing.position.set(hb.x, 0.22, hb.z);
    add(hbRing);
    const habima = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 18), white);
    habima.position.set(hb.x, 7, hb.z);
    add(habima);
    const hbUp = new THREE.Mesh(new THREE.BoxGeometry(14, 12, 14), cream);
    hbUp.position.set(hb.x + 7, 19, hb.z - 3);
    hbUp.rotation.y = 0.22;
    add(hbUp);
    const hbUp2 = new THREE.Mesh(new THREE.BoxGeometry(10, 8.4, 10), white);
    hbUp2.position.set(hb.x - 6, 18, hb.z + 4);
    add(hbUp2);
    const hbGarden = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 10), new THREE.MeshStandardMaterial({ color: 0x2a6a28, roughness: 0.9 }));
    hbGarden.position.set(hb.x + 7, 25.2, hb.z - 3);
    add(hbGarden);
    const vineMat = new THREE.MeshStandardMaterial({ color: 3178290, roughness: 0.92 });
    bag.push(vineMat);
    for (const gx of [-9, 9]) {
      const vine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 14, 8), vineMat);
      vine.position.set(hb.x + gx, 9, hb.z);
      add(vine);
    }
    const hbStep = new THREE.Mesh(new THREE.BoxGeometry(28, 1.2, 10), stone);
    hbStep.position.set(hb.x, 0.6, hb.z + 12);
    add(hbStep);
    hit(hb.x, hb.z, 14);
    const ih = tlv(32.0629, 34.7716);
    const hallBody = new THREE.Mesh(new THREE.BoxGeometry(13.4, 8.2, 10.2), cream);
    hallBody.position.set(ih.x, 4.1, ih.z);
    add(hallBody);
    const hallBalc = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.22, 2.4), white);
    hallBalc.position.set(ih.x, 5.4, ih.z + 5.6);
    add(hallBalc);
    const hallRail = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.7, 0.08), white);
    hallRail.position.set(ih.x, 5.85, ih.z + 6.7);
    add(hallRail);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6.2, 6), bandMat);
    pole.position.set(ih.x + 5.4, 8.8, ih.z + 4.2);
    add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), new THREE.MeshBasicMaterial({ map: getIsraelFlag() ?? undefined, color: getIsraelFlag() ? 0xffffff : 0x0038b8, side: 2 }));
    flag.position.set(ih.x + 6.7, 11.2, ih.z + 4.2);
    add(flag);
    hit(ih.x, ih.z, 7);
    const ds = tlv(32.0732, 34.7888);
    const discount = new THREE.Mesh(new THREE.BoxGeometry(14, 56, 10), darkGlass);
    discount.position.set(ds.x, 28, ds.z);
    add(discount);
    const discCut = new THREE.Mesh(new THREE.BoxGeometry(8, 20, 10), paleGlass);
    discCut.position.set(ds.x + 4, 48, ds.z);
    add(discCut);
    hitRoad(ds.x, ds.z, 7);
    glowAt(az.x, 110, az.z, 8308968, 70, 60);
    hitRoad(az.x + 17.08, az.z, 16, 22, 14);
    hitRoad(saT.x, saT.z, 8);
    hitRoad(ky.x, ky.z, 10);
    hitRoad(el.x, el.z, 8);
    const dz = tlv(32.0753, 34.7748);
    const dzPodium = new THREE.Mesh(new THREE.CylinderGeometry(18, 20, 8, 24), cream);
    dzPodium.position.set(dz.x, 4, dz.z);
    add(dzPodium);
    const dzA = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7.8, 36, 16), white);
    dzA.position.set(dz.x - 10, 26, dz.z);
    add(dzA);
    const dzB = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 7.2, 30, 16), cream);
    dzB.position.set(dz.x + 11, 23, dz.z + 4);
    add(dzB);
    const dzRamp = new THREE.Mesh(new THREE.TorusGeometry(14, 1.1, 6, 20, Math.PI * 1.4), stone);
    dzRamp.rotation.x = Math.PI / 2;
    dzRamp.position.set(dz.x, 2.4, dz.z);
    add(dzRamp);
    hitRoad(dz.x, dz.z, 16);
    const fib = tlv(32.063, 34.7795);
    const fibM = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 9.2, 78, 3), darkGlass);
    fibM.position.set(fib.x, 39, fib.z);
    fibM.rotation.y = 0.4;
    add(fibM);
    const fibCap = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 8.2, 10, 3), paleGlass);
    fibCap.position.set(fib.x, 83, fib.z);
    fibCap.rotation.y = 0.4;
    add(fibCap);
    hitRoad(fib.x, fib.z, 8);
    const yooA = tlv(32.0854, 34.7966);
    const yooB = tlv(32.0858, 34.7972);
    const y1 = new THREE.Mesh(new THREE.BoxGeometry(11, 82, 11), paleGlass);
    y1.position.set(yooA.x, 41, yooA.z);
    add(y1);
    const y2 = new THREE.Mesh(new THREE.BoxGeometry(11, 74, 11), glass);
    y2.position.set(yooB.x, 37, yooB.z);
    add(y2);
    hitRoad(yooA.x, yooA.z, 7);
    hitRoad(yooB.x, yooB.z, 7);
    const sm = tlv(32.0639, 34.7704);
    const smM = new THREE.Mesh(new THREE.BoxGeometry(16, 62, 10), cream);
    smM.position.set(sm.x, 31, sm.z);
    add(smM);
    const smMast = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 16, 6), bandMat);
    smMast.position.set(sm.x, 70, sm.z);
    add(smMast);
    hitRoad(sm.x, sm.z, 8);
  }
  if (def.id === "namal") {
    const hangarMat = new THREE.MeshStandardMaterial({
      color: 14207144,
      roughness: 0.74,
      metalness: 0.08,
      envMapIntensity: 0.4
    });
    const rust = new THREE.MeshStandardMaterial({
      color: 11029042,
      roughness: 0.62,
      metalness: 0.35,
      envMapIntensity: 0.55
    });
    bag.push(hangarMat, rust);
    const hp = tlv(32.0968, 34.7735);
    for (const hg of [
      {
        lat: 32.0958,
        lon: 34.7712
      },
      {
        lat: 32.0964,
        lon: 34.7713
      },
      {
        lat: 32.097,
        lon: 34.7714
      },
      {
        lat: 32.0976,
        lon: 34.7715
      },
      {
        lat: 32.0982,
        lon: 34.7716
      }
    ]) {
      const p = tlv(hg.lat, hg.lon);
      {
        const n = nearestIndex(built.samples, p.x, p.z, 0);
        if (n.dist < built.width / 2 + 16) {
          const s = built.samples[n.index];
          p.x = s.x + s.rx * (built.width / 2 + 24);
          p.z = s.z + s.rz * (built.width / 2 + 24);
        }
      }
      const hangar = new THREE.Mesh(new THREE.BoxGeometry(36, 7.2, 16), hangarMat);
      hangar.position.set(p.x, 3.6, p.z);
      add(hangar);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 8.2, 36, 12, 1, false, 0, Math.PI), hangarMat);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(p.x, 7.2, p.z);
      add(barrel);
    }
    const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 22, 1.4), rust);
    crane.position.set(hp.x - 22, 11, hp.z + 30);
    add(crane);
    const jib = new THREE.Mesh(new THREE.BoxGeometry(28, 0.7, 0.7), rust);
    jib.position.set(hp.x - 10, 22, hp.z + 30);
    add(jib);
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.25, 8, 0.25), rust);
    hook.position.set(hp.x + 2, 18, hp.z + 30);
    add(hook);
    const rd = tlv(32.1035, 34.7788);
    const rdNear = nearestIndex(built.samples, rd.x, rd.z, 0);
    const rs = built.samples[rdNear.index];
    const rdYaw = Math.atan2(rs.tx, rs.tz);
    const ochre = new THREE.MeshStandardMaterial({
      color: 13213808,
      roughness: 0.8,
      envMapIntensity: 0.38
    });
    const ochreDark = new THREE.MeshStandardMaterial({
      color: 11569240,
      roughness: 0.82
    });
    const conc = new THREE.MeshStandardMaterial({
      color: 12104876,
      roughness: 0.68,
      metalness: 0.14
    });
    const redBand = new THREE.MeshStandardMaterial({
      color: 12858408,
      roughness: 0.5
    });
    const whiteBand = new THREE.MeshStandardMaterial({
      color: 15262940,
      roughness: 0.48
    });
    bag.push(ochre, ochreDark, conc, redBand, whiteBand);
    placeTunnel(rs.x, rs.z, rdYaw, 72, built.width * 0.58, 8.2, rs.y);
    const rx = Math.cos(rdYaw);
    const rz = -Math.sin(rdYaw);
    const fx = Math.sin(rdYaw);
    const fz = Math.cos(rdYaw);
    const plantX = rs.x + rx * (built.width / 2 + 30);
    const plantZ = rs.z + rz * (built.width / 2 + 30);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(34, 11, 42), ochre);
    hall.position.set(plantX, rs.y + 5.5, plantZ);
    hall.rotation.y = rdYaw;
    add(hall);
    for (const lr of [-1, 1]) {
      const clad = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8.2, 58), ochre);
      clad.position.set(plantX + rx * 17.4 * lr, rs.y + 4.1, plantZ + rz * 17.4 * lr);
      clad.rotation.y = rdYaw;
      add(clad);
    }
    for (const side of [-1, 1]) {
      const ex2 = rs.x + fx * 32 * side;
      const ez = rs.z + fz * 32 * side;
      for (const lr of [-1, 1]) {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(5.2, 8.6, 2.6), ochreDark);
        pier.position.set(ex2 + rx * 18.6 * lr, 4.3, ez + rz * 18.6 * lr);
        pier.rotation.y = rdYaw;
        add(pier);
      }
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(38, 2.6, 2.8), ochre);
      lintel.position.set(ex2, 8.7, ez);
      lintel.rotation.y = rdYaw;
      add(lintel);
      const key = new THREE.Mesh(new THREE.BoxGeometry(8, 1.4, 3.2), ochreDark);
      key.position.set(ex2, 10.4, ez);
      key.rotation.y = rdYaw;
      add(key);
    }
    for (const side of [-1, 1]) for (let c = 0; c < 8; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.4, 0.35), darkGlass);
      win.position.set(plantX + rx * side * 17.2 + fx * (c * 4.4 - 14), rs.y + 8.2, plantZ + rz * side * 17.2 + fz * (c * 4.4 - 14));
      win.rotation.y = rdYaw;
      add(win);
    }
    const tower = new THREE.Mesh(new THREE.BoxGeometry(12, 20, 14), ochreDark);
    tower.position.set(plantX - rx * 18, rs.y + 10.2, plantZ - rz * 18);
    tower.rotation.y = rdYaw;
    add(tower);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(14, 9, 16), ochre);
    wingL.position.set(plantX - rx * 20, rs.y + 4.6, plantZ - rz * 20);
    wingL.rotation.y = rdYaw;
    add(wingL);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(14, 9, 16), ochre);
    wingR.position.set(plantX + rx * 20, rs.y + 4.6, plantZ + rz * 20);
    wingR.rotation.y = rdYaw;
    add(wingR);
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(36, 0.7, 44), cream);
    cornice.position.set(plantX, rs.y + 11.1, plantZ);
    cornice.rotation.y = rdYaw;
    add(cornice);
    const chimX = plantX + rx * 26;
    const chimZ = plantZ + rz * 26;
    const chim = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 5.6, 92, 16), conc);
    chim.position.set(chimX, rs.y + 52.4, chimZ);
    add(chim);
    const chimGal = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 4.2, 2.8, 16), conc);
    chimGal.position.set(chimX, rs.y + 99.2, chimZ);
    add(chimGal);
    const chimTop = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.6, 3.6, 16), conc);
    chimTop.position.set(chimX, rs.y + 102.2, chimZ);
    add(chimTop);
    for (let i = 0; i < 16; i++) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(4.05, 4.2, 3.2, 14), i % 2 ? redBand : whiteBand);
      band.position.set(chimX, rs.y + 28 + i * 4.4, chimZ);
      add(band);
    }
    const chim2X = plantX + rx * 36;
    const chim2Z = plantZ + rz * 36;
    const chim2 = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.8, 62, 12), conc);
    chim2.position.set(chim2X, rs.y + 37.4, chim2Z);
    add(chim2);
    for (let i = 0; i < 12; i++) {
      const band2 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.1, 2.6, 12), i % 2 ? redBand : whiteBand);
      band2.position.set(chim2X, rs.y + 18 + i * 3.4, chim2Z);
      add(band2);
    }
    const beach = tlv(32.102, 34.774);
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(90, 220), new THREE.MeshStandardMaterial({
      color: 15259572,
      roughness: 1
    }));
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(beach.x, 0.02, beach.z);
    add(sand);
    const umbMat = new THREE.MeshStandardMaterial({
      color: 16052196,
      roughness: 0.7
    });
    bag.push(umbMat);
    for (let i = 0; i < 18; i++) {
      const ux = beach.x - 8 + i % 3 * 7;
      const uz = beach.z - 70 + Math.floor(i / 3) * 22;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 2.5, 5), wood);
      pole.position.set(ux, 1.25, uz);
      add(pole);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 0.5, 8), i % 2 ? umbMat : terracotta);
      cap.position.set(ux, 2.55, uz);
      add(cap);
    }
    const ex = tlv(32.104, 34.79);
    const expo = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 6, 24), white);
    expo.position.set(ex.x, 3, ex.z);
    add(expo);
    const expoRoof = new THREE.Mesh(new THREE.SphereGeometry(16, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), glass);
    expoRoof.position.set(ex.x, 6, ex.z);
    add(expoRoof);
    glowAt(chimX, rs.y + 98, chimZ, 16724016, 48, 40);
    glowAt(hp.x, 10, hp.z, 16760944, 24, 22);
    hit(rs.x - rx * 30, rs.z - rz * 30, 8);
    hit(rs.x + rx * 30, rs.z + rz * 30, 8);
    hit(chimX, chimZ, 5);
    hit(chim2X, chim2Z, 4);
    hit(plantX, plantZ, 16, 18, 22, rdYaw);
    hit(ex.x, ex.z, 14);
    hit(hp.x, hp.z + 40, 12);
  }
  if (def.id === "jerusalem") {
    const offJer = (p: { x: number; z: number }, extra = 24) => {
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      if (n.dist < built.width / 2 + extra) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * (built.width / 2 + extra);
        p.z = s.z + s.rz * (built.width / 2 + extra);
      }
      return p;
    };
    const jg = offJer(jer(31.7764, 35.2276), 22);
    const td = offJer(jer(31.7762, 35.2284), 30);
    const dm = offJer(jer(31.7788, 35.2364), 36);
    const kd = offJer(jer(31.7745, 35.2225), 22);
    const my = offJer(jer(31.7848, 35.2114), 18);
    const kt = offJer(jer(31.7784, 35.2346), 32);
    const mill = offJer(jer(31.7715, 35.2247), 20);
    const olives = offJer(jer(31.7848, 35.2462), 26);
    merlonWall(jg.x + 38, jg.z + 62, 54, 0.2, 13);
    merlonWall(jg.x + 62, jg.z + 42, 48, 1.1, 12);
    const gi = Math.max(0, Math.min(built.samples.length - 1, Math.floor(built.samples.length * 0.46)));
    const gs = built.samples[gi];
    const gOff = built.width / 2 + 32;
    ottomanGate(gs.x + gs.rx * gOff, gs.z + gs.rz * gOff, Math.atan2(gs.tx, gs.tz));
    const citadel = new THREE.Mesh(new THREE.BoxGeometry(22, 13, 22), stone);
    citadel.position.set(td.x + 28, 7.5, td.z + 36);
    add(citadel);
    for (const [dx, dz] of [
      [-9, -9],
      [9, -9],
      [-9, 9],
      [9, 9]
    ]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 4, 17, 10), stone);
      t.position.set(td.x + 28 + dx, 10, td.z + 36 + dz);
      add(t);
      const tcap = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 3.7, 1.5, 10), cream);
      tcap.position.set(td.x + 28 + dx, 19, td.z + 36 + dz);
      add(tcap);
    }
    minaret(td.x + 32, td.z + 33, 32);
    placeDome(dm.x, dm.z);
    const aq = offJer(jer(31.7784, 35.236), 34);
    const aqsa = new THREE.Mesh(new THREE.BoxGeometry(28, 8, 16), stone);
    aqsa.position.set(aq.x, 4.2, aq.z);
    add(aqsa);
    const aqDome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
    aqDome.position.set(aq.x, 10.4, aq.z);
    add(aqDome);
    const sepul = offJer(jer(31.7784, 35.2296), 26);
    const sep = new THREE.Mesh(new THREE.BoxGeometry(18, 11, 16), stone);
    sep.position.set(sepul.x, 5.6, sepul.z);
    add(sep);
    const sepDome = new THREE.Mesh(new THREE.SphereGeometry(6.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
    sepDome.position.set(sepul.x, 13.2, sepul.z);
    add(sepDome);
    const hurva = offJer(jer(31.7772, 35.2316), 24);
    const hv = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.6, 10, 12), stone);
    hv.position.set(hurva.x, 5.2, hurva.z);
    add(hv);
    const hvDome = new THREE.Mesh(new THREE.SphereGeometry(6.8, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
    hvDome.position.set(hurva.x, 11.4, hurva.z);
    add(hvDome);
    const ymcaP = offJer(jer(31.7753, 35.222), 22);
    const ymca = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 12), stone);
    ymca.position.set(ymcaP.x, 7.2, ymcaP.z);
    add(ymca);
    const ymcaTw = new THREE.Mesh(new THREE.BoxGeometry(5.2, 28, 5.2), stone);
    ymcaTw.position.set(ymcaP.x, 18, ymcaP.z);
    add(ymcaTw);
    const ymcaCap = new THREE.Mesh(new THREE.ConeGeometry(3.8, 6, 4), cream);
    ymcaCap.rotation.y = Math.PI / 4;
    ymcaCap.position.set(ymcaP.x, 35, ymcaP.z);
    add(ymcaCap);
    hit(aq.x, aq.z, 10, 14, 8);
    hit(sepul.x, sepul.z, 9, 9, 8);
    hit(hurva.x, hurva.z, 7, 6.4, 6.4);
    hit(ymcaP.x, ymcaP.z, 8, 9, 6);
    const kn = offJer(jer(31.7766, 35.2054), 28);
    const knesset = new THREE.Mesh(new THREE.BoxGeometry(36, 8.4, 22), stone);
    knesset.position.set(kn.x, 5.2, kn.z);
    add(knesset);
    const knRoof = new THREE.Mesh(new THREE.BoxGeometry(38, 0.7, 24), cream);
    knRoof.position.set(kn.x, 9.6, kn.z);
    add(knRoof);
    for (const sx of [
      -14,
      -7,
      0,
      7,
      14
    ]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(1.1, 7.2, 1.1), cream);
      col.position.set(kn.x + sx, 4.6, kn.z + 12);
      add(col);
    }
    hit(kn.x, kn.z, 12);
    const hotel = new THREE.Mesh(new THREE.BoxGeometry(28, 17, 14), stone);
    hotel.position.set(kd.x - 28, 10, kd.z - 22);
    add(hotel);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(30, 2.2, 16), terracotta);
    roof.position.set(kd.x - 28, 19.4, kd.z - 22);
    add(roof);
    const market = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 10), terracotta);
    market.position.set(my.x - 16, 4, my.z + 12);
    add(market);
    for (let i = 0; i < 10; i++) {
      const stall = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.6, 2.8), i % 2 ? terracotta : cream);
      stall.position.set(my.x - 22 + i * 4.2, 1.4, my.z + 18);
      add(stall);
      const awn = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 3.2), new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0xc45c3a : i % 3 === 1 ? 0x2a6a38 : 0x1a4a8a,
        roughness: 0.88
      }));
      awn.position.set(my.x - 22 + i * 4.2, 2.85, my.z + 18);
      add(awn);
    }
    const millBase = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 4.2, 9, 12), stone);
    millBase.position.set(mill.x, 4.6, mill.z);
    add(millBase);
    const millCap = new THREE.Mesh(new THREE.ConeGeometry(3.8, 4.2, 8), cream);
    millCap.position.set(mill.x, 11.2, mill.z);
    add(millCap);
    const herod = herodianTexture();
    bag.push(herod);
    const kotelMat = new THREE.MeshStandardMaterial({
      map: herod,
      roughness: 0.78,
      metalness: 0.06,
      envMapIntensity: 0.4
    });
    bag.push(kotelMat);
    let kx = kt.x;
    let kz = kt.z + 18;
    {
      const n = nearestIndex(built.samples, kx, kz, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        kx = s.x + s.rx * (built.width / 2 + 24);
        kz = s.z + s.rz * (built.width / 2 + 24);
      }
    }
    for (let row = 0; row < 8; row++) for (let col = 0; col < 10; col++) {
      const bw = 3.6 + (col + row) % 3 * 0.45;
      const block = new THREE.Mesh(new THREE.BoxGeometry(bw, 1.85, 3.5), kotelMat);
      block.position.set(kx - 18 + col * 4.1 + row % 2 * 0.7, 1.1 + row * 1.95, kz);
      add(block);
    }
    for (let i = 0; i < 10; i++) {
      const cypress = new THREE.Mesh(new THREE.ConeGeometry(1.15, 6.4, 7), new THREE.MeshStandardMaterial({
        color: 2972216,
        roughness: 0.9
      }));
      cypress.position.set(olives.x + i % 5 * 6 - 10, def.elevation(0.92) + 3.2, olives.z - 8 - Math.floor(i / 5) * 7);
      add(cypress);
    }
    const hillM = new THREE.MeshStandardMaterial({
      color: 12890250,
      roughness: 0.95,
      flatShading: true
    });
    bag.push(hillM);
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2 + 0.3;
      const r = 340 + i % 5 * 90;
      const h = 52 + i % 6 * 22;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(56 + i % 4 * 14, h, 6), hillM);
      hill.position.set(olives.x + Math.cos(a) * r, def.elevation(1) * 0.12 + h * 0.18, olives.z + Math.sin(a) * r);
      add(hill);
    }
    glowAt(jg.x + 18, 16, jg.z + 40, 16769184, 28, 24);
    glowAt(dm.x, 18, dm.z, 16765040, 32, 26);
    hit(jg.x + 18, jg.z + 40, 6);
    hit(td.x + 28, td.z + 36, 10);
    hit(kx, kz, 10, 22, 6);
    hit(kd.x - 28, kd.z - 22, 8);
    hit(mill.x, mill.z, 5);
  }
  if (def.id === "haifa") {
    const bg = hai(32.8118, 34.9884);
    const pt = hai(32.819, 35.004);
    const pineM = new THREE.MeshStandardMaterial({ color: 1853992, roughness: 0.9, flatShading: true });
    const barkM = new THREE.MeshStandardMaterial({ color: 3811356, roughness: 0.92 });
    const cypressM = new THREE.MeshStandardMaterial({ color: 2972216, roughness: 0.9, flatShading: true });
    const leafM = new THREE.MeshStandardMaterial({ color: 4025140, roughness: 0.88, flatShading: true });
    const wallM = new THREE.MeshStandardMaterial({ color: 9076848, roughness: 0.9, flatShading: true });
    bag.push(pineM, barkM, cypressM, leafM, wallM);
    let bx = bg.x + 26;
    let bz = bg.z + 18;
    {
      const n = nearestIndex(built.samples, bx, bz, 0);
      if (n.dist < built.width / 2 + 36) {
        const s = built.samples[n.index];
        const off = built.width / 2 + 58;
        bx = s.x + s.rx * off;
        bz = s.z + s.rz * off;
      }
    }
    for (let i = 0; i < 18; i++) {
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(38 - i * 1.15, 1.05, 12), new THREE.MeshStandardMaterial({
        color: i % 2 ? 13623492 : 15262936,
        roughness: 0.85,
        envMapIntensity: 0.35
      }));
      terrace.position.set(bx, 46 - i * 2.15, bz + i * 6.4);
      add(terrace);
      const stair = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.4, 7.4), cream);
      stair.position.set(bx, 46.4 - i * 2.15, bz + i * 6.4);
      add(stair);
      if (i % 2 === 0) for (const side of [-14, 14]) {
        const cypress = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5.4, 7), cypressM);
        cypress.position.set(bx + side, 49.2 - i * 2.15, bz + i * 6.4);
        add(cypress);
      } else for (const side of [-10, 10]) {
        const cypress = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.2, 7), cypressM);
        cypress.position.set(bx + side, 48.6 - i * 2.15, bz + i * 6.4);
        add(cypress);
      }
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(34 - i * 1.1, 0.55, 0.7), leafM);
      hedge.position.set(bx, 46.7 - i * 2.15, bz + i * 6.4 + 5.4);
      add(hedge);
    }
    const shrine = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 9.1, 13, 8), cream);
    shrine.position.set(bx, 54, bz - 8);
    add(shrine);
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 12, 8), cream);
      col.position.set(bx + Math.cos(a) * 10.2, 54, bz - 8 + Math.sin(a) * 10.2);
      add(col);
    }
    const shrineDome = new THREE.Mesh(new THREE.SphereGeometry(8.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), gold);
    shrineDome.position.set(bx, 61.6, bz - 8);
    add(shrineDome);
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(8.6, 8.9, 2.6, 18), cream);
    drum.position.set(bx, 60.4, bz - 8);
    add(drum);
    const drumGold = new THREE.Mesh(new THREE.TorusGeometry(8.55, 0.22, 6, 18), gold);
    drumGold.rotation.x = Math.PI / 2;
    drumGold.position.set(bx, 61.5, bz - 8);
    add(drumGold);
    const shrineLantern = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.5, 3.6, 8), gold);
    shrineLantern.position.set(bx, 69.2, bz - 8);
    add(shrineLantern);
    const shrineTip = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), gold);
    shrineTip.position.set(bx, 71.4, bz - 8);
    add(shrineTip);
    glowAt(bx, 69, bz - 8, 16763972, 56, 42);
    hit(bx, bz - 8, 11, 10, 10);
    const pineTrunkG = new THREE.CylinderGeometry(0.22, 0.36, 8.4, 7);
    pineTrunkG.translate(0, 4.2, 0);
    const pineCrownG = new THREE.ConeGeometry(2.2, 6.4, 7);
    const nPine = Math.min(90, built.samples.length * 2);
    const pTrunks = new THREE.InstancedMesh(pineTrunkG, barkM, nPine);
    const pCrowns = new THREE.InstancedMesh(pineCrownG, pineM, nPine);
    let pi = 0;
    const stepP = Math.max(1, Math.floor(built.samples.length / 40));
    for (let i = 1; i < built.samples.length - 1 && pi < nPine; i += stepP) {
      const s = built.samples[i];
      const vs = s.rx * (bg.x - s.x) + s.rz * (bg.z - s.z) >= 0 ? 1 : -1;
      const ms = vs;
      for (const extra of [11, 20, 32]) {
        if (pi >= nPine) break;
        const d = built.width / 2 + extra;
        const px = s.x + s.rx * d * ms;
        const pz = s.z + s.rz * d * ms;
        _dummy.position.set(px, s.y, pz);
        _dummy.scale.set(1, 1 + (i % 4) * 0.12, 1);
        _dummy.rotation.set(0, i * 0.7, 0);
        _dummy.updateMatrix();
        pTrunks.setMatrixAt(pi, _dummy.matrix);
        _dummy.position.set(px, s.y + 8.2, pz);
        _dummy.updateMatrix();
        pCrowns.setMatrixAt(pi, _dummy.matrix);
        pi++;
      }
    }
    pTrunks.count = pi;
    pCrowns.count = pi;
    pTrunks.instanceMatrix.needsUpdate = true;
    pCrowns.instanceMatrix.needsUpdate = true;
    group.add(pTrunks, pCrowns);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 6969928,
      roughness: 0.95,
      flatShading: true
    });
    bag.push(rockMat);
    for (let i = 0; i < 14; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(4 + i % 3, 0), rockMat);
      rock.position.set(bg.x + 40 + i % 4 * 18, 6 + i % 3 * 5, bg.z - 30 + Math.floor(i / 4) * 22);
      add(rock);
    }
    const floorP = pt;
    const craneM = new THREE.MeshStandardMaterial({ color: 12085288, metalness: 0.4, roughness: 0.45 });
    bag.push(craneM);
    for (let c = 0; c < 3; c++) {
      const nP = nearestIndex(built.samples, pt.x, pt.z, 0);
      const sP = built.samples[nP.index];
      const cx = sP.x + sP.rx * (built.width / 2 + 24 + c * 10);
      const cz = sP.z + sP.rz * (built.width / 2 + 24 + c * 10);
      const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 32 + c * 4, 1.4), craneM);
      crane.position.set(cx, 16 + c * 2, cz);
      add(crane);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(36, 0.8, 0.8), craneM);
      jib.position.set(cx + 12, 32 + c * 4, cz);
      add(jib);
    }
    hit(pt.x, pt.z, 6);
    const sm = hai(32.8272, 34.9698);
    let smx = sm.x;
    let smz = sm.z;
    {
      const n = nearestIndex(built.samples, smx, smz, 0);
      if (n.dist < built.width / 2 + 16) {
        const s = built.samples[n.index];
        smx = s.x + s.rx * (built.width / 2 + 28);
        smz = s.z + s.rz * (built.width / 2 + 28);
      }
    }
    const church = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 22), cream);
    church.position.set(smx, 4.5, smz);
    add(church);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 8), cream);
    nave.position.set(smx, 12, smz);
    add(nave);
    const smDome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), terracotta);
    smDome.position.set(smx, 15.4, smz);
    add(smDome);
    const bell = new THREE.Mesh(new THREE.BoxGeometry(4.2, 18, 4.2), cream);
    bell.position.set(smx + 8, 9, smz + 8);
    add(bell);
    const bellCap = new THREE.Mesh(new THREE.ConeGeometry(3.2, 4.4, 4), terracotta);
    bellCap.rotation.y = Math.PI / 4;
    bellCap.position.set(smx + 8, 20.2, smz + 8);
    add(bellCap);
    hit(smx, smz, 10, 9, 12);
    const rust = new THREE.MeshStandardMaterial({ color: 9071176, roughness: 0.7, metalness: 0.2 });
    bag.push(rust);
    for (let i = 0; i < 4; i++) {
      const hull = new THREE.Mesh(new THREE.BoxGeometry(8, 4.2, 28), rust);
      hull.position.set(pt.x + 40, 1.8, pt.z - 30 + i * 22);
      add(hull);
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 6, 8), cream);
      stack.position.set(pt.x + 40, 6.8, pt.z - 30 + i * 22);
      add(stack);
    }
    const siloM = new THREE.MeshStandardMaterial({ color: 13156532, roughness: 0.62, metalness: 0.12 });
    bag.push(siloM);
    for (let i = 0; i < 5; i++) {
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 22, 12), siloM);
      silo.position.set(pt.x - 28 + i * 8, 11, pt.z + 22);
      add(silo);
    }
    const colony = [
      { lat: 32.8194, lon: 34.9892, w: 9.2, h: 8.4, d: 7.6 },
      { lat: 32.8198, lon: 34.99, w: 10.4, h: 9.2, d: 8.2 },
      { lat: 32.82, lon: 34.9908, w: 8.6, h: 7.8, d: 7.2 },
      { lat: 32.8192, lon: 34.9914, w: 11.2, h: 8.8, d: 8.4 },
      { lat: 32.8188, lon: 34.9898, w: 9.6, h: 10.2, d: 7.8 }
    ];
    for (let i = 0; i < colony.length; i++) {
      const c = colony[i];
      const p = hai(c.lat, c.lon);
      const body = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, c.d), i % 2 ? cream : stone);
      body.position.set(p.x, c.h * 0.5, p.z);
      add(body);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(c.w, c.d) * 0.7, 3.2, 4), terracotta);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(p.x, c.h + 1.6, p.z);
      add(roof);
      hit(p.x, p.z, 5);
    }
    const valleyX = def.water ? def.water.x : pt.x;
    const valleyZ = def.water ? def.water.z : pt.z;
    const stepW = Math.max(3, Math.floor(built.samples.length / 28));
    for (let i = 2; i < built.samples.length - 2; i += stepW) {
      const s = built.samples[i];
      const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      const ms = -vs;
      const d = built.width / 2 + 3.4;
      const wx = s.x + s.rx * d * ms;
      const wz = s.z + s.rz * d * ms;
      const retain = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.6, 14), wallM);
      retain.position.set(wx, s.y + 1.4, wz);
      retain.rotation.y = Math.atan2(s.tx, s.tz);
      add(retain);
    }
    const railM = new THREE.MeshStandardMaterial({ color: 13157564, metalness: 0.35, roughness: 0.45 });
    bag.push(railM);
    for (let i = 4; i < built.samples.length - 4; i += 4) {
      const s = built.samples[i];
      const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      const d = built.width / 2 + 1.6;
      const px = s.x + s.rx * d * vs;
      const pz = s.z + s.rz * d * vs;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.15, 5), railM);
      post.position.set(px, s.y + 0.7, pz);
      add(post);
      if (i + 4 < built.samples.length) {
        const s2 = built.samples[Math.min(i + 4, built.samples.length - 1)];
        const px2 = s2.x + s2.rx * d * vs;
        const pz2 = s2.z + s2.rz * d * vs;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(px2 - px, pz2 - pz), 0.06, 0.06), railM);
        bar.position.set((px + px2) * 0.5, s.y + 1.15, (pz + pz2) * 0.5);
        bar.lookAt(px2, s.y + 1.15, pz2);
        add(bar);
      }
    }
  }
  if (def.id === "eilat") {
    const mar = eil(29.5482, 34.9542);
    {
      const n = nearestIndex(built.samples, mar.x, mar.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        mar.x = s.x + s.rx * (built.width / 2 + 24);
        mar.z = s.z + s.rz * (built.width / 2 + 24);
      }
    }
    const nb = eil(29.5585, 34.96);
    for (let i = 0; i < 7; i++) {
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(18 + i * 3, 22 + i * 6, 5), new THREE.MeshStandardMaterial({
        color: 10771002,
        roughness: 0.95,
        flatShading: true,
        envMapIntensity: 0.2
      }));
      mtn.position.set(mar.x + 80 + i * 18, 10 + i, mar.z - 20 + i % 3 * 30);
      add(mtn);
    }
    const pier = new THREE.Mesh(new THREE.BoxGeometry(5, 0.45, 36), wood);
    pier.position.set(mar.x - 12, 0.22, mar.z);
    add(pier);
    for (const ht of [
      {
        lat: 29.5578,
        lon: 34.9612,
        w: 12,
        h: 26,
        d: 9
      },
      {
        lat: 29.5564,
        lon: 34.9604,
        w: 11,
        h: 22,
        d: 9
      },
      {
        lat: 29.5586,
        lon: 34.9592,
        w: 14,
        h: 32,
        d: 10,
        round: true
      },
      {
        lat: 29.5552,
        lon: 34.9618,
        w: 13,
        h: 24,
        d: 9
      }
    ]) {
      const p = eil(ht.lat, ht.lon);
      if (ht.round) {
        const king = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 8, ht.h, 12), white);
        king.position.set(p.x, ht.h * 0.5, p.z);
        add(king);
        const kingHat = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 6.2, 3.2, 12), cream);
        kingHat.position.set(p.x, ht.h + 1.6, p.z);
        add(kingHat);
      } else {
        const hotel = new THREE.Mesh(new THREE.BoxGeometry(ht.w, ht.h, ht.d), cream);
        hotel.position.set(p.x, ht.h * 0.5, p.z);
        add(hotel);
        for (let f = 0; f < 6; f++) {
          const band = new THREE.Mesh(new THREE.BoxGeometry(ht.w + 0.3, 0.16, ht.d + 0.3), cyan);
          band.position.set(p.x, 4 + f * 3.4, p.z);
          add(band);
        }
      }
      hit(p.x, p.z, 7);
    }
    glowAt(mar.x, 16, mar.z, 6739176, 32, 26);
    hit(mar.x, mar.z, 8);
    hit(nb.x, nb.z, 8);
  }
  if (def.id === "rothschild") {
    const grassM = new THREE.MeshStandardMaterial({
      color: 3832386,
      roughness: 0.92
    });
    const walkM = new THREE.MeshStandardMaterial({
      color: 12890256,
      roughness: 0.88
    });
    const asphM = new THREE.MeshStandardMaterial({
      color: 2763822,
      roughness: 0.78
    });
    const trunkM = new THREE.MeshStandardMaterial({
      map: barkTexture(),
      color: 0x6a5038,
      roughness: 0.94
    });
    const leafM = new THREE.MeshStandardMaterial({
      map: foliageTexture(),
      color: 0x2a6a28,
      roughness: 0.82,
      flatShading: true
    });
    const peach = new THREE.MeshStandardMaterial({
      color: 15255720,
      roughness: 0.7
    });
    const sandH = new THREE.MeshStandardMaterial({
      color: 14206112,
      roughness: 0.74
    });
    bag.push(grassM, walkM, asphM, trunkM, leafM, peach, sandH);
    const n = built.samples.length;
    const medPos = [];
    const medIdx = [];
    const walkPos = [];
    const walkIdx = [];
    const medHalf = 6.2;
    const pathHalf = 1.5;
    for (let i = 0; i <= n; i++) {
      const s = built.samples[i % n];
      const y = s.y + 0.08;
      medPos.push(s.x - s.rx * medHalf, y, s.z - s.rz * medHalf);
      medPos.push(s.x + s.rx * medHalf, y, s.z + s.rz * medHalf);
      walkPos.push(s.x - s.rx * pathHalf, y + 0.04, s.z - s.rz * pathHalf);
      walkPos.push(s.x + s.rx * pathHalf, y + 0.04, s.z + s.rz * pathHalf);
    }
    for (let i = 0; i < n; i++) {
      const a = i * 2;
      medIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      walkIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const mkRibbon = (pos: number[], idx: number[], mat: THREE.Material) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat);
      m.receiveShadow = true;
      group.add(m);
      bag.push(g);
    };
    mkRibbon(medPos, medIdx, grassM);
    mkRibbon(walkPos, walkIdx, walkM);
    const curbM = new THREE.MeshStandardMaterial({
      color: 13155496,
      roughness: 0.7
    });
    bag.push(curbM);
    const ficusN = 96;
    const trunkG = new THREE.CylinderGeometry(0.85, 1.38, 11.4, 12);
    const leafG = new THREE.SphereGeometry(3.4, 10, 8);
    bag.push(trunkG, leafG);
    const trunks = new THREE.InstancedMesh(trunkG, trunkM, ficusN);
    const leaves = new THREE.InstancedMesh(leafG, leafM, 960);
    trunks.castShadow = shadows;
    leaves.castShadow = shadows;
    let ti = 0;
    let li = 0;
    const stepF = Math.max(1, Math.floor(n / 36));
    for (let i = 2; i < n && ti < ficusN; i += stepF) {
      const s = built.samples[i];
      for (const d of [-3.05, 3.05]) {
        if (ti >= ficusN) break;
        const fx = s.x + s.rx * d;
        const fz = s.z + s.rz * d;
        _dummy.position.set(fx, s.y + 5.7, fz);
        _dummy.scale.set(1, 1, 1);
        _dummy.rotation.set(0, i * 0.7 % 6, 0);
        _dummy.updateMatrix();
        trunks.setMatrixAt(ti, _dummy.matrix);
        const offs = [
          [0, 0.8, 0],
          [2.8, 0.3, 0.9],
          [-2.7, 0.4, 0.7],
          [0.9, 0.7, -2.7],
          [-1.0, 0.3, 2.6],
          [2.0, 2.2, 1.4],
          [-2.1, 2.1, -1.3],
          [0.2, 3.2, 0.3],
          [2.3, 1.6, -1.8],
          [-2.2, 1.7, 1.9],
          [1.4, 2.6, -0.8],
          [-1.5, 2.5, 0.9],
        ];
        for (let k = 0; k < 12; k++) {
          _dummy.position.set(fx + offs[k][0], s.y + 12.2 + offs[k][1], fz + offs[k][2]);
          const sc = 1.12 + (k % 3) * 0.2;
          _dummy.scale.set(sc, sc * 0.88, sc);
          _dummy.updateMatrix();
          leaves.setMatrixAt(li++, _dummy.matrix);
        }
        colliders.push({
          x: fx,
          z: fz,
          r: 1.15,
          kind: "barrier"
        });
        ti++;
      }
    }
    trunks.count = ti;
    leaves.count = li;
    trunks.instanceMatrix.needsUpdate = true;
    leaves.instanceMatrix.needsUpdate = true;
    group.add(trunks, leaves);
    const benchG = new THREE.BoxGeometry(1.8, 0.12, 0.55);
    const benchM = new THREE.MeshStandardMaterial({
      color: 6965802,
      roughness: 0.88
    });
    bag.push(benchG, benchM);
    const benches = new THREE.InstancedMesh(benchG, benchM, 28);
    let bi = 0;
    for (let i = 8; i < n && bi < 28; i += Math.max(4, Math.floor(n / 14))) {
      const s = built.samples[i];
      _dummy.position.set(s.x + s.rx * 1.7, s.y + 0.55, s.z + s.rz * 1.7);
      _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      benches.setMatrixAt(bi++, _dummy.matrix);
    }
    benches.count = bi;
    benches.instanceMatrix.needsUpdate = true;
    group.add(benches);
    const houseCols = [
      cream,
      white,
      peach,
      sandH
    ];
    const shutter = new THREE.MeshStandardMaterial({
      color: 3824248,
      roughness: 0.55
    });
    bag.push(shutter);
    for (const uh of [
      {
        lat: 32.0636,
        lon: 34.7718,
        w: 11,
        h: 9.2,
        d: 9,
        roof: "tile",
        col: 0
      },
      {
        lat: 32.0648,
        lon: 34.7734,
        w: 10,
        h: 11.4,
        d: 8.2,
        roof: "flat",
        col: 1
      },
      {
        lat: 32.0658,
        lon: 34.7746,
        w: 12,
        h: 10.2,
        d: 8.6,
        roof: "tile",
        col: 2
      },
      {
        lat: 32.067,
        lon: 34.7754,
        w: 9.2,
        h: 13.4,
        d: 8,
        roof: "flat",
        col: 3
      },
      {
        lat: 32.0684,
        lon: 34.7758,
        w: 10.4,
        h: 12.2,
        d: 9,
        roof: "tile",
        col: 0
      },
      {
        lat: 32.0704,
        lon: 34.7757,
        w: 10.6,
        h: 14.8,
        d: 10,
        roof: "flat",
        col: 1
      },
      {
        lat: 32.0718,
        lon: 34.7764,
        w: 11.2,
        h: 11.6,
        d: 8.4,
        roof: "flat",
        col: 2
      },
      {
        lat: 32.0728,
        lon: 34.7782,
        w: 9.4,
        h: 15.2,
        d: 8,
        roof: "flat",
        col: 3
      },
      {
        lat: 32.0742,
        lon: 34.7796,
        w: 10,
        h: 10.8,
        d: 8.6,
        roof: "tile",
        col: 0
      }
    ]) {
      const p = tlv(uh.lat, uh.lon);
      const nearH = nearestIndex(built.samples, p.x, p.z, 0);
      const sH = built.samples[nearH.index];
      const extraH = built.width / 2 + 14;
      if (nearH.dist < extraH) {
        p.x = sH.x + sH.rx * extraH;
        p.z = sH.z + sH.rz * extraH;
      }
      const kinds = ["white", "gold", "white", "teal"];
      const facade = new THREE.MeshStandardMaterial({
        map: curtainTexture(kinds[uh.col % 4]),
        roughness: 0.78,
        color: 15789528
      });
      bag.push(facade);
      const body = new THREE.Mesh(new THREE.BoxGeometry(uh.w, uh.h, uh.d), facade);
      body.position.set(p.x, uh.h * 0.5, p.z);
      add(body);
      const cornice = new THREE.Mesh(new THREE.BoxGeometry(uh.w + 0.7, 0.35, uh.d + 0.5), uh.col % 2 ? terracotta : cream);
      cornice.position.set(p.x, uh.h + 0.1, p.z);
      add(cornice);
      if (uh.roof === "tile") {
        const roof = new THREE.Mesh(new THREE.ConeGeometry(uh.w * 0.72, 2.6, 4), terracotta);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(p.x, uh.h + 1.5, p.z);
        add(roof);
      } else if (uh.roof === "pagoda") for (let k = 0; k < 3; k++) {
        const pg2 = new THREE.Mesh(new THREE.ConeGeometry(uh.w * (0.62 - k * 0.12), 2.1, 6), terracotta);
        pg2.position.set(p.x, uh.h + 1.2 + k * 2.1, p.z);
        add(pg2);
      }
      for (let fl = 0; fl < 3; fl++) for (const wx of [-2.2, 2.2]) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.7), darkGlass);
        win.position.set(p.x + uh.d * 0.51, 2.4 + fl * 2.8, p.z + wx);
        add(win);
      }
      hit(p.x, p.z, 5.5, uh.w * 0.48, uh.d * 0.48);
    }
    const indy = tlv(32.0629, 34.7695);
    {
      const nI = nearestIndex(built.samples, indy.x, indy.z, 0);
      if (nI.dist < built.width / 2 + 12) {
        const sI = built.samples[nI.index];
        indy.x = sI.x + sI.rx * (built.width / 2 + 16);
        indy.z = sI.z + sI.rz * (built.width / 2 + 16);
      }
    }
    {
      const indyM = new THREE.MeshStandardMaterial({ map: curtainTexture("white"), roughness: 0.8, color: 16118744 });
      bag.push(indyM);
      const indyB = new THREE.Mesh(new THREE.BoxGeometry(14.2, 8.4, 11.2), indyM);
      indyB.position.set(indy.x, 4.2, indy.z);
      add(indyB);
      const indyRoof = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.45, 12), white);
      indyRoof.position.set(indy.x, 8.7, indy.z);
      add(indyRoof);
      hit(indy.x, indy.z, 7, 7.2, 5.8);
    }
    const pg = tlv(32.0648, 34.7752);
    {
      const nP = nearestIndex(built.samples, pg.x, pg.z, 0);
      if (nP.dist < built.width / 2 + 12) {
        const sP = built.samples[nP.index];
        pg.x = sP.x + sP.rx * (built.width / 2 + 18);
        pg.z = sP.z + sP.rz * (built.width / 2 + 18);
      }
    }
    const pgBody = new THREE.Mesh(new THREE.BoxGeometry(9.2, 16.5, 9.2), cream);
    pgBody.position.set(pg.x, 8.3, pg.z);
    add(pgBody);
    for (let k = 0; k < 4; k++) {
      const r = 7.4 - k * 1.15;
      const eaves2 = new THREE.Mesh(new THREE.CylinderGeometry(r + 1.3, r, 0.55, 8), terracotta);
      eaves2.position.set(pg.x, 6.2 + k * 3.35, pg.z);
      add(eaves2);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(r + 0.4, 1.8, 8), terracotta);
      roof.position.set(pg.x, 7.3 + k * 3.35, pg.z);
      add(roof);
      const balc = new THREE.Mesh(new THREE.BoxGeometry(r * 1.35, 0.18, r * 1.35), cream);
      balc.position.set(pg.x, 5.7 + k * 3.35, pg.z);
      add(balc);
    }
    const pgCap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), terracotta);
    pgCap.position.set(pg.x, 20.4, pg.z);
    add(pgCap);
    const hb = tlv(32.0734, 34.7826);
    {
      const nB = nearestIndex(built.samples, hb.x, hb.z, 0);
      if (nB.dist < built.width / 2 + 16) {
        const sB = built.samples[nB.index];
        hb.x = sB.x + sB.rx * (built.width / 2 + 28);
        hb.z = sB.z + sB.rz * (built.width / 2 + 28);
      }
    }
    const plaza = new THREE.Mesh(new THREE.CircleGeometry(22, 24), walkM);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(hb.x, 0.12, hb.z);
    add(plaza);
    for (const [dx, dz, h, r] of [
      [
        0,
        0,
        16,
        9.5
      ],
      [
        -9,
        6,
        11,
        7.2
      ],
      [
        9,
        5,
        10,
        6.6
      ]
    ]) {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.04, h, 20), white);
      cyl.position.set(hb.x + dx, h * 0.5, hb.z + dz);
      add(cyl);
    }
    const hbRing = new THREE.Mesh(new THREE.TorusGeometry(10.2, 0.35, 6, 20), cream);
    hbRing.rotation.x = Math.PI / 2;
    hbRing.position.set(hb.x, 15.4, hb.z);
    add(hbRing);
    for (let k = 0; k < 5; k++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(9.7, 0.22, 5, 20), cream);
      rib.rotation.x = Math.PI / 2;
      rib.position.set(hb.x, 3.2 + k * 2.6, hb.z);
      add(rib);
    }
    const hbLid = new THREE.Mesh(new THREE.CylinderGeometry(10.4, 9.2, 1.4, 20), white);
    hbLid.position.set(hb.x, 16.6, hb.z);
    add(hbLid);
    const ind = tlv(32.0624, 34.7682);
    {
      const nN = nearestIndex(built.samples, ind.x, ind.z, 0);
      if (nN.dist < built.width / 2 + 12) {
        const sN = built.samples[nN.index];
        ind.x = sN.x + sN.rx * (built.width / 2 + 18);
        ind.z = sN.z + sN.rz * (built.width / 2 + 18);
      }
    }
    const hall = new THREE.Mesh(new THREE.BoxGeometry(16, 8.4, 11.4), cream);
    hall.position.set(ind.x, 4.6, ind.z);
    add(hall);
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.28, 2.6), cream);
    balcony.position.set(ind.x, 5.8, ind.z + 6.4);
    add(balcony);
    const railIH = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.72, 0.12), white);
    railIH.position.set(ind.x, 6.3, ind.z + 7.5);
    add(railIH);
    for (const sx of [-5.4, -1.8, 1.8, 5.4]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 6.2, 10), white);
      col.position.set(ind.x + sx, 3.5, ind.z + 5.9);
      add(col);
    }
    for (const [wx, wy] of [[-4.2, 3.2], [0, 3.2], [4.2, 3.2], [-4.2, 6.4], [0, 6.4], [4.2, 6.4]]) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.9), darkGlass);
      win.position.set(ind.x + wx, wy, ind.z + 5.75);
      add(win);
    }
    const eaves = new THREE.Mesh(new THREE.BoxGeometry(17.6, 0.5, 12.4), terracotta);
    eaves.position.set(ind.x, 9, ind.z);
    add(eaves);
    const ihPole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 7.6, 6), bandMat);
    ihPole.position.set(ind.x + 7.2, 8.6, ind.z + 4.2);
    add(ihPole);
    const roofIH = new THREE.Mesh(new THREE.ConeGeometry(11.2, 3.4, 4), terracotta);
    roofIH.rotation.y = Math.PI / 4;
    roofIH.position.set(ind.x, 11.1, ind.z);
    add(roofIH);
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 8.4, 6), white);
    flagPole.position.set(ind.x, 14.6, ind.z);
    add(flagPole);
    const flagTex = getIsraelFlag();
    const flagW = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.1),
      new THREE.MeshBasicMaterial({ map: flagTex ?? undefined, color: flagTex ? 0xffffff : 0xf4f6f8, side: THREE.DoubleSide }),
    );
    flagW.position.set(ind.x + 1.7, 17.4, ind.z);
    add(flagW);
    const me = tlv(32.0658, 34.7768);
    const meier = new THREE.Mesh(new THREE.BoxGeometry(8.2, 70, 8.2), white);
    meier.position.set(me.x, 35, me.z);
    add(meier);
    const meierGold = new THREE.Mesh(new THREE.BoxGeometry(9.2, 5.4, 9.2), gold);
    meierGold.position.set(me.x, 72.4, me.z);
    add(meierGold);
    glowAt(me.x, 74, me.z, 16764006, 26, 24);
    glowAt(hb.x, 16, hb.z, 16771272, 22, 18);
    hit(hb.x, hb.z, 10);
    hit(ind.x, ind.z, 8);
    hit(me.x, me.z, 6);
    const nearPg = nearestIndex(built.samples, pg.x, pg.z, 0);
    if (nearPg.dist > built.width / 2 + 6) hit(pg.x, pg.z, 6);
  }
  if (def.id === "ayalon") {
    tlv(32.0744, 34.7932);
    placeAzrieli(1.42);
    placeToHa(1.28, 32.0695, 34.7894);
    placeCityGate(1);
    placeMidtown(1.15);
    placeElectra(1.2);
    placeSarona(1.32);
    placeHakirya(1.1);
    placeShalomMeir(1.15);
    const parkOff = (lat: number, lon: number, extra: number, east: boolean) => {
      const hint = tlv(lat, lon);
      const n = nearestIndex(built.samples, hint.x, hint.z, 0);
      const s = built.samples[n.index];
      const latOff = east ? built.width + 18 + built.width / 2 + extra : -(built.width / 2 + extra);
      return { x: s.x + s.rx * latOff, z: s.z + s.rz * latOff, y: s.y };
    };
    const ibm = parkOff(32.0856, 34.7987, 36, true);
    const ibmGlass = new THREE.MeshPhysicalMaterial({
      color: 0x3a6e7a,
      roughness: 0.14,
      metalness: 0,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.12
    });
    bag.push(ibmGlass);
    const ibmGeo = new THREE.BoxGeometry(1, 7.2, 1);
    const ibmSlabs = new THREE.InstancedMesh(ibmGeo, ibmGlass, 6);
    ibmSlabs.frustumCulled = false;
    for (let i = 0; i < 6; i++) {
      const w = 20 - i * 2.2;
      _dummy.position.set(ibm.x, 4.2 + i * 8, ibm.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(w, 1, w);
      _dummy.updateMatrix();
      ibmSlabs.setMatrixAt(i, _dummy.matrix);
    }
    ibmSlabs.instanceMatrix.needsUpdate = true;
    ibmSlabs.castShadow = shadows;
    group.add(ibmSlabs);
    bag.push(ibmGeo);
    hit(ibm.x, ibm.z, 12);
    const yovel = parkOff(32.0788, 34.7916, 30, false);
    const yovGlass = new THREE.MeshPhysicalMaterial({
      color: 0x5a7088,
      roughness: 0.12,
      metalness: 0,
      envMapIntensity: 1.45,
      clearcoat: 1
    });
    bag.push(yovGlass);
    const yov = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 8.1, 92, 18), yovGlass);
    yov.position.set(yovel.x, 46, yovel.z);
    add(yov);
    const yovRingYs = [];
    for (let y = 8; y < 88; y += 4.2) yovRingYs.push(y);
    const yovRingGeo = new THREE.TorusGeometry(7.6, 0.12, 5, 18);
    const yovRings = new THREE.InstancedMesh(yovRingGeo, bandMat, yovRingYs.length);
    yovRings.frustumCulled = false;
    for (let i = 0; i < yovRingYs.length; i++) {
      _dummy.position.set(yovel.x, yovRingYs[i], yovel.z);
      _dummy.rotation.set(Math.PI / 2, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      yovRings.setMatrixAt(i, _dummy.matrix);
    }
    yovRings.instanceMatrix.needsUpdate = true;
    group.add(yovRings);
    bag.push(yovRingGeo);
    const yovCrown = new THREE.Mesh(new THREE.CylinderGeometry(9.4, 6.2, 9, 18), bandMat);
    yovCrown.position.set(yovel.x, 96, yovel.z);
    add(yovCrown);
    hit(yovel.x, yovel.z, 10);
    const plat = parkOff(32.0842, 34.8036, 42, true);
    const platM = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.4, 108, 8), darkGlass);
    platM.position.set(plat.x, 54, plat.z);
    platM.rotation.y = 0.28;
    add(platM);
    const platBandYs = [];
    for (let y = 8; y < 100; y += 5.2) platBandYs.push(y);
    const platBandGeo = new THREE.CylinderGeometry(6.7, 7.3, 0.28, 8);
    const platBands = new THREE.InstancedMesh(platBandGeo, bandMat, platBandYs.length);
    platBands.frustumCulled = false;
    for (let i = 0; i < platBandYs.length; i++) {
      _dummy.position.set(plat.x, platBandYs[i], plat.z);
      _dummy.rotation.set(0, 0.28, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      platBands.setMatrixAt(i, _dummy.matrix);
    }
    platBands.instanceMatrix.needsUpdate = true;
    group.add(platBands);
    bag.push(platBandGeo);
    const platHat = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 5.2, 7.2, 8), bandMat);
    platHat.position.set(plat.x, 112, plat.z);
    platHat.rotation.y = 0.28;
    add(platHat);
    hit(plat.x, plat.z, 10);
    const tau = parkOff(32.1124, 34.8046, 48, true);
    const tauLib = new THREE.Mesh(new THREE.CylinderGeometry(10, 11.4, 14, 20), cream);
    tauLib.position.set(tau.x, 7, tau.z);
    add(tauLib);
    const tauDome = new THREE.Mesh(new THREE.SphereGeometry(8.4, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
    tauDome.position.set(tau.x, 14.4, tau.z);
    add(tauDome);
    const hallGeo = new THREE.BoxGeometry(1, 1, 1);
    const halls = new THREE.InstancedMesh(hallGeo, cream, 5);
    halls.frustumCulled = false;
    const hallSpec = [
      [18, 5.2, 8, 14, 6.4, 10],
      [-16, 4.4, -10, 12, 5.6, 9],
      [8, 6.2, -18, 10, 8.4, 16],
      [-22, 3.8, 14, 16, 4.8, 8],
      [24, 3.2, 12, 8, 4.2, 14],
    ];
    hallSpec.forEach((h, i) => {
      _dummy.position.set(tau.x + h[0], h[1], tau.z + h[2]);
      _dummy.rotation.set(0, i * 0.35, 0);
      _dummy.scale.set(h[3], h[4] * 2, h[5]);
      _dummy.updateMatrix();
      halls.setMatrixAt(i, _dummy.matrix);
    });
    halls.instanceMatrix.needsUpdate = true;
    group.add(halls);
    bag.push(hallGeo);
    glowAt(tau.x, 16, tau.z, 0xf2e8d0, 28, 22);
    hit(tau.x, tau.z, 22);
    const hsHint = tlv(32.0735, 34.79605);
    const hsNear = nearestIndex(built.samples, hsHint.x, hsHint.z, 0);
    const hsS = built.samples[hsNear.index];
    const hsMid = built.width / 2 + 9;
    const hs = { x: hsS.x + hsS.rx * hsMid, z: hsS.z + hsS.rz * hsMid };
    const tubeLen = built.width + 42;
    const across = Math.atan2(hsS.rx, hsS.rz);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, tubeLen, 24, 1, true), paleGlass);
    tube.rotation.order = "YZX";
    tube.rotation.set(0, across, Math.PI / 2);
    tube.position.set(hs.x, hsS.y + 15.6, hs.z);
    add(tube);
    const tubeFloor = new THREE.Mesh(new THREE.BoxGeometry(tubeLen, 0.32, 5.2), white);
    tubeFloor.position.set(hs.x, hsS.y + 13.6, hs.z);
    tubeFloor.rotation.y = across;
    add(tubeFloor);
    for (let i = 0; i < 14; i++) {
      const t = i / 13 - 0.5;
      const rib = new THREE.Mesh(new THREE.TorusGeometry(3.55, 0.16, 6, 18), white);
      rib.rotation.order = "YZX";
      rib.rotation.set(0, across, Math.PI / 2);
      rib.position.set(hs.x + hsS.rx * t * tubeLen, hsS.y + 15.6, hs.z + hsS.rz * t * tubeLen);
      add(rib);
    }
    const mallHint = tlv(32.1004, 34.7996);
    const mallNear = nearestIndex(built.samples, mallHint.x, mallHint.z, 0);
    const mallS = built.samples[mallNear.index];
    const mallLat = built.width + 18 + built.width / 2 + 32;
    const mall = { x: mallS.x + mallS.rx * mallLat, z: mallS.z + mallS.rz * mallLat };
    const mallYaw = Math.atan2(mallS.tx, mallS.tz);
    const mallM = new THREE.Mesh(new THREE.BoxGeometry(42, 16, 28), cream);
    mallM.position.set(mall.x, mallS.y + 8, mall.z);
    mallM.rotation.y = mallYaw;
    add(mallM);
    const mallR = new THREE.Mesh(new THREE.BoxGeometry(46, 1.8, 32), white);
    mallR.position.set(mall.x, mallS.y + 16.6, mall.z);
    mallR.rotation.y = mallYaw;
    add(mallR);
    if (mallNear.dist > built.width / 2 + 10) hit(mall.x, mall.z, 20);
    const kit = getAyalonRoad();
    const rampAsphalt = new THREE.MeshPhysicalMaterial({
      map: kit?.map ?? null,
      roughnessMap: kit?.roughnessMap ?? null,
      bumpMap: kit?.bumpMap ?? null,
      bumpScale: kit ? 0.18 : 0,
      color: kit ? 0xffffff : 6053990,
      roughness: 0.45,
      metalness: 0,
      envMapIntensity: 0.85,
      clearcoat: 0.22,
      clearcoatRoughness: 0.4
    });
    const conc = new THREE.MeshStandardMaterial({
      color: 13157044,
      roughness: 0.72
    });
    const greenSign = new THREE.MeshStandardMaterial({
      color: 1731130,
      roughness: 0.55
    });
    bag.push(rampAsphalt, conc, greenSign);
    const pushRamp = (x: number, z: number, sx: number, sz: number, len: number, half: number, y0: number, y12: number, he: string, en: string) => {
      ramps.push({
        x,
        z,
        sx,
        sz,
        len,
        half,
        y0,
        y1: y12,
        he,
        en
      });
      streets.push({
        ax: x - sx * len * 0.5,
        az: z - sz * len * 0.5,
        bx: x + sx * len * 0.5,
        bz: z + sz * len * 0.5,
        half,
        he,
        en
      });
      const yaw = Math.atan2(sx, sz);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(half * 2, 0.95, len), rampAsphalt);
      mesh.position.set(x, (y0 + y12) * 0.5, z);
      mesh.rotation.order = "YXZ";
      mesh.rotation.y = yaw;
      mesh.rotation.x = -Math.atan2(y12 - y0, len);
      mesh.receiveShadow = true;
      add(mesh);
      for (let i = 0; i < 4; i++) {
        const t = (i + 0.5) / 4 - 0.5;
        const px = x + sx * t * len;
        const pz = z + sz * t * len;
        const py = (y0 + y12) * 0.5 + (y12 - y0) * t;
        const h = Math.max(1.4, py);
        const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, h, 8), conc);
        pier.position.set(px, h * 0.5, pz);
        pier.castShadow = true;
        add(pier);
      }
      const rx = sz;
      const rz = -sx;
      for (const side of [-1, 1]) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, len * 0.94), white);
        line.position.set(
          x + rx * (half - 0.22) * side,
          (y0 + y12) * 0.5 + 0.52,
          z + rz * (half - 0.22) * side,
        );
        line.rotation.order = "YXZ";
        line.rotation.y = yaw;
        line.rotation.x = -Math.atan2(y12 - y0, len);
        add(line);
      }
    };
    const gantryMat = (id: string) => {
      const t = getGantry(id);
      if (!t) return greenSign;
      const m = new THREE.MeshBasicMaterial({ map: t, fog: false, side: THREE.DoubleSide });
      bag.push(m);
      return m;
    };
    const gantryId: Record<string, string> = {
      "Kibbutz Galuyot": "gantry-kibbutz-galuyot",
      "HaHagana": "gantry-hahagana",
      "LaGuardia": "gantry-laguardia",
      "HaShalom": "gantry-hashalom",
      "Savidor Center": "gantry-savidor-center",
      "University": "gantry-university",
    };
    for (const ic of [
      {
        lat: 32.0525,
        he: "\u05E7\u05D9\u05D1\u05D5\u05E5 \u05D2\u05DC\u05D5\u05D9\u05D5\u05EA",
        en: "Kibbutz Galuyot"
      },
      {
        lat: 32.0547,
        he: "\u05D4\u05D4\u05D2\u05E0\u05D4",
        en: "HaHagana"
      },
      {
        lat: 32.062,
        he: "\u05DC\u05D4 \u05D2\u05E8\u05D3\u05D9\u05D4",
        en: "LaGuardia"
      },
      {
        lat: 32.0735,
        he: "\u05D4\u05E9\u05DC\u05D5\u05DD",
        en: "HaShalom"
      },
      {
        lat: 32.0837,
        he: "\u05E1\u05D1\u05D9\u05D3\u05D5\u05E8 \u05DE\u05E8\u05DB\u05D6",
        en: "Savidor Center"
      },
      {
        lat: 32.1035,
        he: "\u05D0\u05D5\u05E0\u05D9\u05D1\u05E8\u05E1\u05D9\u05D8\u05D4",
        en: "University"
      }
    ]) {
      const hint = tlv(ic.lat, 34.79605);
      const n0 = nearestIndex(built.samples, hint.x, hint.z, 0);
      const sm0 = built.samples[n0.index];
      const oppOff = built.width + 18;
      const midOff = oppOff / 2;
      const c = { x: sm0.x + sm0.rx * midOff, z: sm0.z + sm0.rz * midOff };
      const yaw = Math.atan2(sm0.tx, sm0.tz);
      const westX = sm0.x - sm0.rx * (built.width / 2 + 2.4);
      const westZ = sm0.z - sm0.rz * (built.width / 2 + 2.4);
      const eastX = sm0.x + sm0.rx * (oppOff + built.width / 2 + 2.4);
      const eastZ = sm0.z + sm0.rz * (oppOff + built.width / 2 + 2.4);
      const deckY = 9.4;
      const span = oppOff + built.width + 16;
      const deck = new THREE.Mesh(new THREE.BoxGeometry(span, 1.15, 16), conc);
      deck.position.set(c.x, deckY, c.z);
      deck.rotation.y = yaw;
      add(deck);
      for (const side of [-7.8, 7.8]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(span, 1.15, 0.22), white);
        rail.position.set(c.x + sm0.tx * side, 10.3, c.z + sm0.tz * side);
        rail.rotation.y = yaw;
        add(rail);
      }
      for (const lat of [-(built.width / 2 + 12), oppOff + built.width / 2 + 12]) {
        const px = sm0.x + sm0.rx * lat;
        const pz = sm0.z + sm0.rz * lat;
        const col = new THREE.Mesh(new THREE.BoxGeometry(1.8, deckY, 1.8), conc);
        col.position.set(px, deckY * 0.5, pz);
        add(col);
        const colNear = nearestIndex(built.samples, px, pz, 0);
        if (colNear.dist > built.width / 2 + 2.5) hitRoad(px, pz, 1.4, 0.95, 0.95);
      }
      for (const lx of [-28, -10, 10, 28]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.4, 6), conc);
        post.position.set(c.x + sm0.rx * lx, deckY + 2.2, c.z + sm0.rz * lx);
        add(post);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc070 }));
        lamp.position.set(c.x + sm0.rx * lx, deckY + 3.9, c.z + sm0.rz * lx);
        add(lamp);
      }
      const signMat = gantryMat(gantryId[ic.en] ?? "gantry-hashalom");
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.2), signMat);
      sign.position.set(c.x, 13.8, c.z);
      sign.rotation.y = yaw + Math.PI;
      add(sign);
      const sign2 = sign.clone();
      sign2.rotation.y = yaw;
      add(sign2);
      for (const gx of [-8, 8]) {
        const gpost = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.6, 0.35), conc);
        gpost.position.set(c.x + sm0.rx * gx, 11.7, c.z + sm0.rz * gx);
        add(gpost);
      }
      const gbar = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.28, 0.28), conc);
      gbar.position.set(c.x, 13.95, c.z);
      gbar.rotation.y = yaw;
      add(gbar);
      const spd = getSign("speed90");
      if (spd) {
        const yawS = yaw;
        const offS = built.width / 2 + 4.2;
        const sx = sm0.x + sm0.rx * offS;
        const sz = sm0.z + sm0.rz * offS;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.4, 6), conc);
        pole.position.set(sx, 1.7, sz);
        add(pole);
        const plate = new THREE.Mesh(
          new THREE.PlaneGeometry(1.6, 1.6),
          new THREE.MeshBasicMaterial({ map: spd, transparent: true, fog: false }),
        );
        plate.position.set(sx, 3.5, sz);
        plate.rotation.y = yawS + Math.PI;
        add(plate);
      }
      const zLen = 68;
      const a = 34;
      pushRamp(westX - sm0.tx * a, westZ - sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, 0.5, deckY, ic.he, ic.en);
      pushRamp(westX + sm0.tx * a, westZ + sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, deckY, 0.5, ic.he, ic.en);
      pushRamp(eastX - sm0.tx * a, eastZ - sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, 0.5, deckY, ic.he, ic.en);
      pushRamp(eastX + sm0.tx * a, eastZ + sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, deckY, 0.5, ic.he, ic.en);
      pushRamp(c.x, c.z, sm0.rx, sm0.rz, span, 10.2, deckY, deckY, ic.he, ic.en);
      {
        const half = built.width / 2;
        pushRamp(sm0.x + sm0.rx * (half * 0.42), sm0.z + sm0.rz * (half * 0.42), sm0.rx, sm0.rz, 32, 12.5, 0.35, deckY, ic.he, ic.en);
        pushRamp(sm0.x - sm0.rx * (half * 0.15), sm0.z - sm0.rz * (half * 0.15), sm0.tx, sm0.tz, 36, half * 0.55, 0.3, 0.3, ic.he, ic.en);
      }
      if (ic.en === "Kibbutz Galuyot") {
        pushRamp(westX - sm0.rx * 20, westZ - sm0.rz * 20, sm0.tx, sm0.tz, 84, 6.4, 0.6, 7.2, ic.he, ic.en);
        pushRamp(eastX + sm0.rx * 20, eastZ + sm0.rz * 20, sm0.tx, sm0.tz, 84, 6.4, 7.2, 0.6, ic.he, ic.en);
        const d = 0.7071;
        const dx = sm0.rx * d + sm0.tx * d;
        const dz = sm0.rz * d + sm0.tz * d;
        const inv = Math.hypot(dx, dz) || 1;
        pushRamp(c.x - 24 * sm0.rx, c.z - 24 * sm0.rz, dx / inv, dz / inv, 54, 6.2, 0.6, deckY, ic.he, ic.en);
        pushRamp(c.x + 24 * sm0.rx, c.z + 24 * sm0.rz, dx / inv, dz / inv, 54, 6.2, deckY, 0.6, ic.he, ic.en);
      }
      if (ic.en === "LaGuardia") {
        const dx = sm0.rx * 0.7071 - sm0.tx * 0.7071;
        const dz = sm0.rz * 0.7071 - sm0.tz * 0.7071;
        const inv = Math.hypot(dx, dz) || 1;
        pushRamp(c.x - 18 * sm0.rx, c.z - 18 * sm0.rz, dx / inv, dz / inv, 44, 6.2, 0.6, deckY, ic.he, ic.en);
        pushRamp(c.x + 18 * sm0.rx, c.z + 18 * sm0.rz, dx / inv, dz / inv, 44, 6.2, deckY, 0.6, ic.he, ic.en);
      }
    }
    for (const ic of [
      { lat: 32.0735, he: "השלום", en: "HaShalom" },
      { lat: 32.0837, he: "סבידור מרכז", en: "Savidor Center" },
    ]) {
      const p = tlv(ic.lat, 34.795);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      const sm = built.samples[near.index];
      const rc = built.width / 2 + 6;
      pushRamp(sm.x + sm.rx * rc, sm.z + sm.rz * rc, sm.tx, sm.tz, 46, 6.4, 0.4, 8.6, ic.he, ic.en);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(16, 0.85, 20), conc);
      wing.position.set(sm.x + sm.rx * (rc + 14), 8.7, sm.z + sm.rz * (rc + 14));
      wing.rotation.y = Math.atan2(sm.tx, sm.tz);
      add(wing);
    }
    const platMat = new THREE.MeshStandardMaterial({
      color: 13157564,
      roughness: 0.7
    });
    const glassRoof = new THREE.MeshPhysicalMaterial({
      color: 11060436,
      roughness: 0.12,
      metalness: 0,
      transparent: true,
      opacity: 0.55,
      envMapIntensity: 1.4
    });
    const silver = new THREE.MeshStandardMaterial({
      color: 14212320,
      metalness: 0,
      roughness: 0.28
    });
    const redStripe = new THREE.MeshStandardMaterial({
      color: 12589096,
      roughness: 0.45,
      metalness: 0
    });
    const purpleStripe = new THREE.MeshStandardMaterial({
      color: 0x4a1a6a,
      roughness: 0.42,
      metalness: 0
    });
    bag.push(platMat, glassRoof, silver, redStripe, purpleStripe);
    const midLon = 34.79605;
    const midOff = built.width / 2 + 9;
    for (const st of [
      {
        lat: 32.0525,
        he: "\u05E7\u05D9\u05D1\u05D5\u05E5 \u05D2\u05DC\u05D5\u05D9\u05D5\u05EA",
        kind: "galuyot"
      },
      {
        lat: 32.0547,
        he: "\u05D4\u05D4\u05D2\u05E0\u05D4",
        kind: "hagana"
      },
      {
        lat: 32.0735,
        he: "\u05D4\u05E9\u05DC\u05D5\u05DD",
        kind: "shalom"
      },
      {
        lat: 32.0837,
        he: "\u05E1\u05D1\u05D9\u05D3\u05D5\u05E8",
        kind: "savidor"
      },
      {
        lat: 32.1035,
        he: "\u05D4\u05D0\u05D5\u05E0\u05D9\u05D1\u05E8\u05E1\u05D9\u05D8\u05D4",
        kind: "uni"
      }
    ]) {
      const hint = tlv(st.lat, midLon);
      const near = nearestIndex(built.samples, hint.x, hint.z, 0);
      const s = built.samples[near.index];
      const p = { x: s.x + s.rx * midOff, z: s.z + s.rz * midOff };
      const py = s.y;
      const yaw = Math.atan2(s.tx, s.tz);
      const platLen = st.kind === "savidor" ? 110 : st.kind === "shalom" ? 96 : st.kind === "galuyot" ? 70 : 78;
      const plat2 = new THREE.Mesh(new THREE.BoxGeometry(11, 0.7, platLen), platMat);
      plat2.position.set(p.x, py + 0.55, p.z);
      plat2.rotation.y = yaw;
      add(plat2);
      const yellow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, platLen), new THREE.MeshBasicMaterial({ color: 15778816 }));
      yellow.position.set(p.x + s.rx * 5.2, py + 0.96, p.z + s.rz * 5.2);
      yellow.rotation.y = yaw;
      add(yellow);
      const yellow2 = yellow.clone();
      yellow2.position.set(p.x - s.rx * 5.2, py + 0.96, p.z - s.rz * 5.2);
      add(yellow2);
      const canopyW = st.kind === "uni" ? 12 : 14;
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(canopyW, st.kind === "hagana" ? 0.35 : 0.45, platLen * 0.92), st.kind === "shalom" ? glassRoof : silver);
      canopy.position.set(p.x, py + (st.kind === "hagana" ? 5.4 : 6.6), p.z);
      canopy.rotation.y = yaw;
      add(canopy);
      const colN = st.kind === "savidor" ? 7 : 5;
      for (const sx of [-4.6, 4.6]) for (let k = -colN; k <= colN; k++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 5.4, 6), cream);
        const along = k * (platLen / (colN * 2 + 1.2));
        col.position.set(p.x + s.rx * sx + s.tx * along, py + 3.1, p.z + s.rz * sx + s.tz * along);
        add(col);
      }
      const hallP = tlv(st.lat, st.kind === "uni" ? 34.7988 : 34.7932);
      const nearHall = nearestIndex(built.samples, hallP.x, hallP.z, 0);
      const hallW = st.kind === "savidor" ? 28 : st.kind === "shalom" ? 24 : st.kind === "hagana" ? 18 : 16;
      const hallH = st.kind === "hagana" ? 6.4 : st.kind === "uni" ? 7.2 : 9.2;
      const hallMat = st.kind === "hagana" ? conc : st.kind === "uni" ? terracotta : cream;
      const hall = new THREE.Mesh(new THREE.BoxGeometry(hallW, hallH, st.kind === "savidor" ? 40 : 24), hallMat);
      hall.position.set(hallP.x, hallH * 0.5, hallP.z);
      add(hall);
      if (st.kind === "savidor") {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(18, 5.2, 22), cream);
        wing.position.set(hallP.x + 16, 2.6, hallP.z);
        add(wing);
        const vault = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 38, 22, 1, true, Math.PI, Math.PI), paleGlass);
        vault.rotation.z = Math.PI / 2;
        vault.position.set(hallP.x, hallH + 1.6, hallP.z);
        add(vault);
        for (let i = 0; i < 6; i++) {
          const rib = new THREE.Mesh(new THREE.TorusGeometry(15.1, 0.2, 6, 18, Math.PI), bandMat);
          rib.rotation.z = Math.PI / 2;
          rib.position.set(hallP.x - 16 + i * 6.4, hallH + 1.6, hallP.z);
          add(rib);
        }
        const spanS = Math.hypot(hallP.x - p.x, hallP.z - p.z);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(Math.max(10, spanS), 1.35, 5.6), paleGlass);
        foot.position.set((hallP.x + p.x) * 0.5, 10.6, (hallP.z + p.z) * 0.5);
        foot.rotation.y = Math.atan2(p.x - hallP.x, p.z - hallP.z);
        add(foot);
      }
      if (st.kind === "uni") {
        const shed = new THREE.Mesh(new THREE.BoxGeometry(14, 3.2, 18), cream);
        shed.position.set(hallP.x, 2, hallP.z + 16);
        add(shed);
      }
      if (st.kind === "shalom") {
        const glassWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.2, 20), glassRoof);
        glassWall.position.set(hallP.x + 10, 5.2, hallP.z);
        add(glassWall);
        const az = tlv(32.0744, 34.7922);
        const spanA = Math.hypot(az.x - hallP.x, az.z - hallP.z);
        const brA = new THREE.Mesh(new THREE.BoxGeometry(Math.max(8, spanA), 1.2, 5), paleGlass);
        brA.position.set((hallP.x + az.x) * 0.5, 11.2, (hallP.z + az.z) * 0.5);
        brA.rotation.y = Math.atan2(az.x - hallP.x, az.z - hallP.z);
        add(brA);
        const spanH = Math.hypot(hallP.x - p.x, hallP.z - p.z);
        const over = new THREE.Mesh(new THREE.BoxGeometry(spanH, 1.35, 6.2), paleGlass);
        over.position.set((hallP.x + p.x) * 0.5, 12.6, (hallP.z + p.z) * 0.5);
        over.rotation.y = Math.atan2(hallP.x - p.x, hallP.z - p.z);
        add(over);
      }
      const stSign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.2), gantryMat("stn-" + st.kind));
      stSign.position.set(hallP.x, hallH + 3.2, hallP.z);
      stSign.rotation.y = Math.PI / 2;
      add(stSign);
      if (nearHall.dist > built.width / 2 + 10) hit(hallP.x, hallP.z, 8);
    }
    const makeTrain = (phase: number, trackX: number) => {
      const g = new THREE.Group();
      const roof = new THREE.MeshStandardMaterial({ color: 0xe8eaee, roughness: 0.52, metalness: 0 });
      bag.push(roof);
      for (let c = 0; c < 6; c++) {
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.9, 4.1, 17.2), silver);
        body.position.set(0, 2.55, -c * 18.2);
        g.add(body);
        const band = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.5, 17.3), purpleStripe);
        band.position.set(0, 1.55, -c * 18.2);
        g.add(band);
        const band2 = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.22, 17.3), redStripe);
        band2.position.set(0, 1.88, -c * 18.2);
        g.add(band2);
        const deck = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.12, 17.1), bandMat);
        deck.position.set(0, 3.15, -c * 18.2);
        g.add(deck);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(2.72, 0.16, 17.05), roof);
        cap.position.set(0, 4.68, -c * 18.2);
        g.add(cap);
        const winStrip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.95, 16.2), darkGlass);
        winStrip.position.set(1.48, 2.42, -c * 18.2);
        g.add(winStrip);
        const winStripB = winStrip.clone();
        winStripB.position.x = -1.48;
        g.add(winStripB);
        const winStrip2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.78, 16.2), darkGlass);
        winStrip2.position.set(1.48, 3.68, -c * 18.2);
        g.add(winStrip2);
        const winStrip2B = winStrip2.clone();
        winStrip2B.position.x = -1.48;
        g.add(winStrip2B);
      }
      const nose = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.4, 4.6), silver);
      nose.position.set(0, 2.4, 10.4);
      g.add(nose);
      const yellow = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.7, 4.65), new THREE.MeshStandardMaterial({ color: 0xe2a818, roughness: 0.45 }));
      yellow.position.set(0, 1.15, 10.4);
      g.add(yellow);
      const screen = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.15, 0.12), darkGlass);
      screen.position.set(0, 3.05, 12.68);
      g.add(screen);
      const dest = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.42), gantryMat("dest-rail"));
      dest.position.set(0, 3.58, 12.74);
      g.add(dest);
      const panArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), bandMat);
      panArm.position.set(0, 5.4, -2);
      g.add(panArm);
      const panBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), bandMat);
      panBar.position.set(0, 6.2, -2);
      g.add(panBar);
      const lightL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.2), new THREE.MeshBasicMaterial({ color: 16774344 }));
      lightL.position.set(-0.85, 1.5, 12.7);
      g.add(lightL);
      const lightR = lightL.clone();
      lightR.position.x = 0.85;
      g.add(lightR);
      g.scale.setScalar(1.08);
      group.add(g);
      const mid = built.width / 2 + 9;
      const pts = built.samples.map((s) => ({
        x: s.x + s.rx * (mid + trackX),
        y: s.y + 0.42,
        z: s.z + s.rz * (mid + trackX),
        yaw: Math.atan2(s.tx, s.tz)
      }));
      movers.push({
        mesh: g,
        pts,
        speed: 0.14,
        phase
      });
    };
    makeTrain(0, -1.15);
    makeTrain(0.48, 1.15);
    const arrowTex = getLaneArrow();
    if (!arrowTex) throw new Error("lane arrow missing");
    const arrowMat = new THREE.MeshBasicMaterial({ map: arrowTex, side: 2 });
    for (const lat of [32.055, 32.061, 32.067, 32.0735, 32.083, 32.092, 32.101]) {
      for (const lon of [34.795, 34.7971]) {
      const p = tlv(lat, lon);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      const s = built.samples[near.index];
      const hw = built.width / 2 + 1.8;
      for (const side of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.7, 9.2, 0.7), conc);
        post.position.set(s.x + s.rx * hw * side, s.y + 4.6, s.z + s.rz * hw * side);
        add(post);
      }
      const beam = new THREE.Mesh(new THREE.BoxGeometry(built.width + 2.4, 0.7, 1.15), conc);
      beam.position.set(s.x, s.y + 9.3, s.z);
      beam.rotation.y = Math.atan2(s.rx, s.rz);
      add(beam);
      for (let i = 0; i < 8; i++) {
        const off = -built.width / 2 + 3.2 + i * (built.width - 6.4) / 7;
        const ar = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6), arrowMat);
        ar.position.set(s.x + s.rx * off, s.y + 7.4, s.z + s.rz * off);
        ar.rotation.y = Math.atan2(s.tx, s.tz);
        add(ar);
      }
      }
    }
  }
  if (def.id === "caesarea") {
    const aq = cae(32.5078, 34.8976);
    {
      const n = nearestIndex(built.samples, aq.x, aq.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        aq.x = s.x + s.rx * (built.width / 2 + 28);
        aq.z = s.z + s.rz * (built.width / 2 + 28);
      }
    }
    const sandA = new THREE.MeshStandardMaterial({ color: 0xe2d2b0, roughness: 0.96 });
    bag.push(sandA);
    const beach = new THREE.Mesh(new THREE.PlaneGeometry(80, 160), sandA);
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(aq.x - 8, 0.04, aq.z);
    add(beach);
    const archGeo = new THREE.BoxGeometry(3.2, 10.4, 2.2);
    const capGeo = new THREE.BoxGeometry(4.2, 1.2, 3.2);
    const spanGeo = new THREE.BoxGeometry(3.4, 1.4, 7.2);
    for (let tier = 0; tier < 2; tier++) {
      const y0 = tier * 10.6;
      for (let i = 0; i < 22; i++) {
        const z = aq.z - 70 + i * 7.2;
        const pierA = new THREE.Mesh(archGeo, stone);
        pierA.position.set(aq.x, 5.2 + y0, z);
        add(pierA);
        const cap = new THREE.Mesh(capGeo, stone);
        cap.position.set(aq.x, 10.6 + y0, z);
        add(cap);
        if (i < 21) {
          const span = new THREE.Mesh(spanGeo, stone);
          span.position.set(aq.x, 9.2 + y0, z + 3.6);
          add(span);
          const hole = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 3.6, 12, 1, false, 0, Math.PI), darkArch);
          hole.rotation.z = Math.PI / 2;
          hole.position.set(aq.x, 4.4 + y0, z + 3.6);
          add(hole);
        }
      }
    }
    const channel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 154), stone);
    channel.position.set(aq.x, 21.6, aq.z);
    add(channel);
    const hp = cae(32.4988, 34.8896);
    const hippo = new THREE.Mesh(new THREE.TorusGeometry(32, 1.5, 8, 40), stone);
    hippo.scale.set(1.55, 1, 1);
    hippo.rotation.x = Math.PI / 2;
    hippo.position.set(hp.x, 0.95, hp.z);
    add(hippo);
    const spine = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.5, 42), stone);
    spine.position.set(hp.x, 0.85, hp.z);
    add(spine);
    const th = cae(32.4962, 34.8894);
    const theater = new THREE.Mesh(new THREE.CylinderGeometry(15, 24, 10, 22, 1, true, 0, Math.PI * 1.2), stone);
    theater.position.set(th.x, 5.4, th.z);
    theater.rotation.y = 0.6;
    add(theater);
    for (let r = 0; r < 7; r++) {
      const seat = new THREE.Mesh(new THREE.TorusGeometry(10 + r * 2.15, 0.48, 6, 22, Math.PI * 1.15), stone);
      seat.rotation.x = Math.PI / 2;
      seat.rotation.z = 0.6;
      seat.position.set(th.x, 1.15 + r * 1.2, th.z);
      add(seat);
    }
    const stage = new THREE.Mesh(new THREE.BoxGeometry(24, 1.2, 6.4), stone);
    stage.position.set(th.x + 4, 0.7, th.z + 8);
    add(stage);
    hit(aq.x, aq.z, 6);
    hit(hp.x, hp.z, 16);
    hit(th.x, th.z, 14);
    const cit = cae(32.5014, 34.8902);
    const citKeep = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 18), stone);
    citKeep.position.set(cit.x, 7.2, cit.z);
    add(citKeep);
    for (const [dx, dz] of [
      [-8, -8],
      [8, -8],
      [-8, 8],
      [8, 8]
    ]) {
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 16, 10), stone);
      tw.position.set(cit.x + dx, 8.2, cit.z + dz);
      add(tw);
    }
    hit(cit.x, cit.z, 12);
    const mole = cae(32.5004, 34.8884);
    const breakw = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, 72), stone);
    breakw.position.set(mole.x, 1, mole.z);
    add(breakw);
    const breakw2 = new THREE.Mesh(new THREE.BoxGeometry(48, 1.8, 7), stone);
    breakw2.position.set(mole.x + 16, 0.8, mole.z - 32);
    add(breakw2);
    for (let i = 0; i < 7; i++) {
      const hx = mole.x + 6 + i % 2 * 6;
      const hz = mole.z - 20 + i * 7;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 7.6), i % 2 ? white : cream);
      hull.position.set(hx, 0.4, hz);
      add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 8.4, 5), wood);
      mast.position.set(hx, 4.8, hz);
      add(mast);
    }
    const colRow = cae(32.5062, 34.897);
    for (let i = 0; i < 6; i++) {
      const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 4.2 + i % 3, 8), stone);
      stump.position.set(colRow.x + 10, 2.2, colRow.z - 12 + i * 5);
      add(stump);
    }
  }
  if (def.id === "deadsea") {
    const salt = new THREE.MeshStandardMaterial({
      color: 15261908,
      roughness: 0.55,
      envMapIntensity: 0.55
    });
    const peach = new THREE.MeshStandardMaterial({ color: 15255720, roughness: 0.7 });
    bag.push(salt, peach);
    const offSea = (p: { x: number; z: number }, pad = 24) => {
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * (built.width / 2 + pad);
        p.z = s.z + s.rz * (built.width / 2 + pad);
      }
      return p;
    };
    const herods = offSea(dsea(31.1992, 35.3682), 28);
    const herBase = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 14), cream);
    herBase.position.set(herods.x, 4, herods.z);
    add(herBase);
    for (let i = 0; i < 8; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 8, 8), white);
      col.position.set(herods.x - 9 + i * 2.6, 8.2, herods.z + 7.4);
      add(col);
    }
    const ped = new THREE.Mesh(new THREE.ConeGeometry(12, 5.4, 4), cream);
    ped.rotation.y = Math.PI / 4;
    ped.position.set(herods.x, 14.8, herods.z);
    add(ped);
    const herTower = new THREE.Mesh(new THREE.BoxGeometry(12, 18, 10), cream);
    herTower.position.set(herods.x, 17, herods.z);
    add(herTower);
    const dan = offSea(dsea(31.2016, 35.3688), 26);
    const danM = new THREE.Mesh(new THREE.BoxGeometry(16, 28, 11), darkGlass);
    danM.position.set(dan.x, 14, dan.z);
    add(danM);
    const danWing = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 14), cream);
    danWing.position.set(dan.x, 4, dan.z);
    add(danWing);
    const iso = offSea(dsea(31.2034, 35.3692), 26);
    for (let i = 0; i < 4; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(20 - i * 3.2, 6, 12 - i * 1.4), white);
      step.position.set(iso.x, 3.2 + i * 6.2, iso.z);
      add(step);
    }
    const lot = offSea(dsea(31.1974, 35.3678), 26);
    const lotM = new THREE.Mesh(new THREE.BoxGeometry(26, 12, 12), peach);
    lotM.position.set(lot.x, 6, lot.z);
    add(lotM);
    for (let y = 3; y < 11; y += 2.6) {
      const bal = new THREE.Mesh(new THREE.BoxGeometry(27, 0.14, 13), cream);
      bal.position.set(lot.x, y, lot.z);
      add(bal);
    }
    const pool = new THREE.Mesh(new THREE.BoxGeometry(18, 0.28, 8), cyan);
    pool.position.set(lot.x, 0.2, lot.z + 12);
    add(pool);
    for (let i = 0; i < 6; i++) {
      const ux = lot.x - 8 + i * 3.2;
      const uz = lot.z + 18;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.4, 5), wood);
      pole.position.set(ux, 1.2, uz);
      add(pole);
      const umb = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.35, 8), i % 2 ? white : peach);
      umb.position.set(ux, 2.4, uz);
      add(umb);
    }
    const leoD = dsea(31.2052, 35.3696);
    const leoM = new THREE.Mesh(new THREE.BoxGeometry(14, 20, 10), cream);
    leoM.position.set(leoD.x, 10, leoD.z);
    add(leoM);
    const leoBand = new THREE.Mesh(new THREE.BoxGeometry(15, 2.2, 11), terracotta);
    leoBand.position.set(leoD.x, 16, leoD.z);
    add(leoBand);
    const eb = dsea(31.201, 35.372);
    for (let i = 0; i < 8; i++) {
      const terrace = new THREE.Mesh(new THREE.CylinderGeometry(6 + i * 3.2, 8 + i * 3.2, 0.55, 16), salt);
      terrace.position.set(eb.x, 0.12 + i * 0.08, eb.z + i * 4);
      add(terrace);
    }
    for (let i = 0; i < 10; i++) {
      const pan = new THREE.Mesh(new THREE.BoxGeometry(22 + i % 3 * 6, 0.12, 14), salt);
      const p = dsea(31.186 + i * 0.004, 35.3705);
      pan.position.set(p.x, 0.08, p.z);
      add(pan);
    }
    const moab = new THREE.MeshStandardMaterial({ color: 11565650, roughness: 0.95, flatShading: true });
    bag.push(moab);
    for (let i = 0; i < 7; i++) {
      const p = dsea(31.17 + i * 0.012, 35.402);
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(22 + i % 3 * 8, 28 + i % 4 * 10, 5), moab);
      mtn.position.set(p.x, 14, p.z);
      add(mtn);
    }
    glowAt(eb.x, 18, eb.z, 16769200, 28, 24);
    hit(herods.x, herods.z, 10);
    hit(dan.x, dan.z, 8);
    hit(iso.x, iso.z, 10);
    hit(lot.x, lot.z, 12);
    hit(leoD.x, leoD.z, 8);
  }
  if (def.id === "acre") {
    const ochreH = new THREE.MeshStandardMaterial({ color: 12093784, roughness: 0.88, envMapIntensity: 0.28 });
    const ochreD = new THREE.MeshStandardMaterial({ color: 9398336, roughness: 0.9 });
    bag.push(ochreH, ochreD);
    const offAcre = (p: { x: number; z: number }, pad = 26) => {
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * (built.width / 2 + pad);
        p.z = s.z + s.rz * (built.width / 2 + pad);
      }
      return p;
    };
    const sea = offAcre(acr(32.9198, 35.0676), 32);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(110, 12, 5.4), stone);
    wall.position.set(sea.x, 6, sea.z);
    add(wall);
    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(5.4, 12, 70), stone);
    wall2.position.set(sea.x - 52, 6, sea.z + 28);
    add(wall2);
    for (let i = 0; i < 16; i++) {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 5.8), stone);
      merlon.position.set(sea.x - 50 + i * 7, 13, sea.z);
      add(merlon);
    }
    const burj = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.4, 18, 12), stone);
    burj.position.set(sea.x - 52, 10, sea.z);
    add(burj);
    const burjCap = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 5.4, 2, 12), stone);
    burjCap.position.set(sea.x - 52, 20, sea.z);
    add(burjCap);
    for (let i = 0; i < 14; i++) {
      const lat = 32.9192 + (i % 7) * 0.00055;
      const lon = 35.0692 + Math.floor(i / 7) * 0.0007;
      const p = acr(lat, lon);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      if (near.dist < built.width / 2 + 8) continue;
      const h = 5.2 + i % 4 * 0.9;
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.8, h, 7.4), i % 3 === 0 ? stone : i % 3 === 1 ? ochreH : ochreD);
      house.position.set(p.x, h * 0.5, p.z);
      add(house);
      const rf = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.32, 8), terracotta);
      rf.position.set(p.x, h + 0.18, p.z);
      add(rf);
      const door = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.24, 10, 1, false, 0, Math.PI), darkArch);
      door.rotation.z = Math.PI / 2;
      door.position.set(p.x, 1.6, p.z + 3.8);
      add(door);
      hit(p.x, p.z, 3.4);
    }
    const kh = offAcre(acr(32.9206, 35.0688), 28);
    const khan = new THREE.Mesh(new THREE.BoxGeometry(26, 7.6, 26), stone);
    khan.position.set(kh.x, 3.8, kh.z);
    add(khan);
    const court = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 14), cream);
    court.position.set(kh.x, 0.18, kh.z);
    add(court);
    for (const [dx, dz] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.9, 12, 8), stone);
      col.position.set(kh.x + dx, 8, kh.z + dz);
      add(col);
    }
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.6, 30, 10), stone);
    clock.position.set(kh.x, 17, kh.z);
    add(clock);
    const clockBox = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.4, 4.4), cream);
    clockBox.position.set(kh.x, 32.2, kh.z);
    add(clockBox);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.05, 16), cream);
      face.position.set(kh.x + Math.sin(a) * 2.25, 32.2, kh.z + Math.cos(a) * 2.25);
      face.lookAt(kh.x + Math.sin(a) * 8, 32.2, kh.z + Math.cos(a) * 8);
      add(face);
    }
    const clockCap = new THREE.Mesh(new THREE.ConeGeometry(3, 3.6, 4), terracotta);
    clockCap.rotation.y = Math.PI / 4;
    clockCap.position.set(kh.x, 36.2, kh.z);
    add(clockCap);
    const ms = acr(32.9226, 35.0718);
    const mosque = new THREE.Mesh(new THREE.BoxGeometry(20, 9, 20), cream);
    mosque.position.set(ms.x, 5.2, ms.z);
    add(mosque);
    const green = new THREE.MeshStandardMaterial({
      color: 3050072,
      roughness: 0.38,
      metalness: 0.22,
      envMapIntensity: 0.85
    });
    bag.push(green);
    const domeA = new THREE.Mesh(new THREE.SphereGeometry(7.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), green);
    domeA.position.set(ms.x, 10.4, ms.z);
    add(domeA);
    for (const [dx, dz] of [[-7, -7], [7, -7], [-7, 7], [7, 7]]) {
      const sd = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), green);
      sd.position.set(ms.x + dx, 10.2, ms.z + dz);
      add(sd);
    }
    const minaret2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.45, 32, 10), cream);
    minaret2.position.set(ms.x + 12, 18, ms.z + 6);
    add(minaret2);
    const minaBalc = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 1.6, 1.5, 10), cream);
    minaBalc.position.set(ms.x + 12, 32, ms.z + 6);
    add(minaBalc);
    const minaCap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 3.4, 8), green);
    minaCap.position.set(ms.x + 12, 34.8, ms.z + 6);
    add(minaCap);
    const cit = acr(32.9238, 35.0714);
    const citadel = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 18), stone);
    citadel.position.set(cit.x, 8, cit.z);
    add(citadel);
    const citT = new THREE.Mesh(new THREE.BoxGeometry(8, 10, 8), stone);
    citT.position.set(cit.x - 8, 18, cit.z);
    add(citT);
    const quay = acr(32.9192, 35.0682);
    const pier = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 48), stone);
    pier.position.set(quay.x, 0.2, quay.z);
    add(pier);
    for (let i = 0; i < 10; i++) {
      const hx = quay.x - 10 - i % 2 * 6;
      const hz = quay.z - 20 + i * 5.2;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.75, 7.6), i % 2 ? white : cream);
      hull.position.set(hx, 0.45, hz);
      add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 8, 5), wood);
      mast.position.set(hx, 4.7, hz);
      add(mast);
    }
    glowAt(ms.x, 16, ms.z, 16771248, 28, 22);
    hit(sea.x, sea.z, 6);
    hit(ms.x, ms.z, 11);
    hit(kh.x, kh.z, 9);
    hit(cit.x, cit.z, 9);
  }
  if (def.id === "beersheva") {
    const ch = bsv(31.252, 34.791);
    {
      const n = nearestIndex(built.samples, ch.x, ch.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        ch.x = s.x + s.rx * (built.width / 2 + 26);
        ch.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const hall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 32, 9.2), cream);
    hall.position.set(ch.x, 16, ch.z);
    add(hall);
    const hall2 = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 14), cream);
    hall2.position.set(ch.x, 4, ch.z);
    add(hall2);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(7.6, 8, 4), copper);
    cap.position.set(ch.x, 36, ch.z);
    add(cap);
    const aw = bsv(31.2435, 34.79);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 1.4, 16), stone);
    well.position.set(aw.x, 0.8, aw.z);
    add(well);
    const wellWall = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 2.4, 16, 1, true), stone);
    wellWall.position.set(aw.x, 1.6, aw.z);
    add(wellWall);
    const wellRoof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 3.6, 4), terracotta);
    wellRoof.position.set(aw.x, 4.4, aw.z);
    add(wellRoof);
    const uni = bsv(31.262, 34.801);
    for (let i = 0; i < 4; i++) {
      const campus = new THREE.Mesh(new THREE.BoxGeometry(14, 8 + i, 10), cream);
      campus.position.set(uni.x + i * 8, 4 + i * 0.4, uni.z);
      add(campus);
    }
    glowAt(ch.x, 36, ch.z, 16765056, 36, 28);
    hit(ch.x, ch.z, 8);
    hit(aw.x, aw.z, 8);
  }
  if (def.id === "netanya") {
    const sq = net(32.3318, 34.8565);
    {
      const n = nearestIndex(built.samples, sq.x, sq.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        sq.x = s.x + s.rx * (built.width / 2 + 22);
        sq.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 0.18, 28), stone);
    plaza.position.set(sq.x, 0.12, sq.z);
    add(plaza);
    const lawn = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.16, 20), new THREE.MeshStandardMaterial({ color: 3832386, roughness: 0.92 }));
    lawn.position.set(sq.x, 0.22, sq.z);
    add(lawn);
    const fountain = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 1.1, 16), stone);
    fountain.position.set(sq.x, 0.7, sq.z);
    add(fountain);
    const spray = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.1, 2.4, 8), cyan);
    spray.position.set(sq.x, 2.2, sq.z);
    add(spray);
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.55, 20, 8), cream);
    clock.position.set(sq.x + 10, 10, sq.z + 6);
    add(clock);
    const faceMatN = new THREE.MeshStandardMaterial({
      color: 15657176,
      roughness: 0.5,
      emissive: 3351050,
      emissiveIntensity: isNight ? 0.7 : 0.1
    });
    emitList.push({ mat: faceMatN, night: 0.7, day: 0.1 });
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), faceMatN);
      face.position.set(sq.x + 10 + Math.sin(a) * 2.6, 16.5, sq.z + 6 + Math.cos(a) * 2.6);
      face.lookAt(sq.x + 10 + Math.sin(a) * 8, 16.5, sq.z + 6 + Math.cos(a) * 8);
      add(face);
    }
    const hat = new THREE.Mesh(new THREE.ConeGeometry(3.1, 4.2, 4), terracotta);
    hat.rotation.y = Math.PI / 4;
    hat.position.set(sq.x + 10, 22.4, sq.z + 6);
    add(hat);
    const cl = net(32.334, 34.851);
    const chalkN = new THREE.MeshStandardMaterial({ color: 15525592, roughness: 0.9, flatShading: true });
    const sandB = new THREE.MeshStandardMaterial({ color: 15259572, roughness: 1 });
    bag.push(chalkN, sandB);
    for (let i = 0; i < 10; i++) {
      const p = net(32.327 + i * 14e-4, 34.8488);
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(18, 16 + i % 3 * 3, 7), chalkN);
      cliff.position.set(p.x, 7 + i % 3, p.z);
      cliff.rotation.y = 0.08;
      add(cliff);
    }
    const beach = new THREE.Mesh(new THREE.PlaneGeometry(70, 220), sandB);
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(cl.x - 36, 0.04, cl.z);
    add(beach);
    const leo = net(32.3282, 34.8492);
    const leonardo = new THREE.Mesh(new THREE.BoxGeometry(14, 42, 12), white);
    leonardo.position.set(leo.x, 21, leo.z);
    add(leonardo);
    for (let y = 5; y < 40; y += 3.2) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.16, 12.8), cream);
      sl.position.set(leo.x, y, leo.z);
      add(sl);
    }
    const leoCap = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 8), paleGlass);
    leoCap.position.set(leo.x, 44, leo.z);
    add(leoCap);
    const isr = net(32.3266, 34.8494);
    const isrotel = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.2, 48, 12), white);
    isrotel.position.set(isr.x, 24, isr.z);
    add(isrotel);
    for (let y = 6; y < 46; y += 3.6) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(6.7, 0.12, 5, 14), cream);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(isr.x, y, isr.z);
      add(ring);
    }
    const isrHat = new THREE.Mesh(new THREE.CylinderGeometry(8, 5.2, 5.4, 12), cream);
    isrHat.position.set(isr.x, 50.4, isr.z);
    add(isrHat);
    const pr = net(32.3316, 34.8488);
    const princess = new THREE.Mesh(new THREE.BoxGeometry(28, 16, 12), white);
    princess.position.set(pr.x, 8, pr.z);
    add(princess);
    const prWing = new THREE.Mesh(new THREE.BoxGeometry(10, 22, 10), cream);
    prWing.position.set(pr.x + 12, 11, pr.z);
    add(prWing);
    for (let y = 4; y < 14; y += 2.6) {
      const bal = new THREE.Mesh(new THREE.BoxGeometry(29, 0.14, 13), cream);
      bal.position.set(pr.x, y, pr.z);
      add(bal);
    }
    const sea = net(32.3338, 34.8486);
    const seasons = new THREE.Mesh(new THREE.BoxGeometry(12, 32, 14), paleGlass);
    seasons.position.set(sea.x, 16, sea.z);
    seasons.rotation.y = 0.12;
    add(seasons);
    const seaSlab = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 16), cream);
    seaSlab.position.set(sea.x, 4, sea.z);
    add(seaSlab);
    const lift = net(32.3324, 34.8484);
    const liftT = new THREE.Mesh(new THREE.BoxGeometry(4.2, 18, 4.2), white);
    liftT.position.set(lift.x, 9, lift.z);
    add(liftT);
    const liftC = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.2, 3.4), paleGlass);
    liftC.position.set(lift.x, 8.4, lift.z);
    add(liftC);
    for (let i = 0; i < 12; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.28, 2.2), stone);
      step.position.set(lift.x - 6, 14 - i * 1.15, lift.z - 2 - i * 1.4);
      add(step);
    }
    const herzl = net(32.329, 34.858);
    for (let i = 0; i < 4; i++) {
      const shop = new THREE.Mesh(new THREE.BoxGeometry(7.2, 8 + i % 2 * 2.4, 8), i % 2 ? cream : white);
      shop.position.set(herzl.x + 14 + i * 9, 4.4 + i % 2 * 1.2, herzl.z);
      add(shop);
      const awn = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.2, 2.4), terracotta);
      awn.position.set(herzl.x + 14 + i * 9, 3.6, herzl.z + 4.4);
      add(awn);
    }
    glowAt(cl.x, 20, cl.z, 16771248, 40, 24);
    hit(sq.x + 10, sq.z + 6, 5);
    hit(leo.x, leo.z, 8);
    hit(isr.x, isr.z, 8);
    hit(pr.x, pr.z, 12);
    hit(sea.x, sea.z, 8);
  }
  if (def.id === "hw1") {
    const vineMat = new THREE.MeshStandardMaterial({ color: 3178290, roughness: 0.92, flatShading: true });
    const ochre = new THREE.MeshStandardMaterial({ color: 13213808, roughness: 0.82 });
    const olive = new THREE.MeshStandardMaterial({ color: 4874808, roughness: 0.9, flatShading: true });
    const steel = new THREE.MeshStandardMaterial({ color: 4210752, roughness: 0.45, metalness: 0.62 });
    bag.push(vineMat, ochre, olive, steel);
    const lt = hwy1(31.8338, 34.9774);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 12), cream);
    nave.position.set(lt.x, 8.4, lt.z);
    add(nave);
    const aisle = new THREE.Mesh(new THREE.BoxGeometry(10, 9, 16), cream);
    aisle.position.set(lt.x, 6.2, lt.z + 8);
    add(aisle);
    const gable = new THREE.Mesh(new THREE.ConeGeometry(9.4, 7.2, 4), terracotta);
    gable.rotation.y = Math.PI / 4;
    gable.position.set(lt.x, 18.8, lt.z);
    add(gable);
    const bell = new THREE.Mesh(new THREE.BoxGeometry(5.4, 26, 5.4), cream);
    bell.position.set(lt.x - 10, 16, lt.z - 2);
    add(bell);
    for (let y = 8; y < 24; y += 5.2) {
      const arch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.8, 0.35), darkGlass);
      arch.position.set(lt.x - 10, y, lt.z + 2.8);
      add(arch);
    }
    const bellCap = new THREE.Mesh(new THREE.ConeGeometry(4.2, 6.4, 4), terracotta);
    bellCap.rotation.y = Math.PI / 4;
    bellCap.position.set(lt.x - 10, 32.2, lt.z - 2);
    add(bellCap);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.4, 0.28), white);
    cross.position.set(lt.x - 10, 36.4, lt.z - 2);
    add(cross);
    const cloister = new THREE.Mesh(new THREE.BoxGeometry(28, 6.4, 18), cream);
    cloister.position.set(lt.x + 8, 3.4, lt.z - 16);
    add(cloister);
    const court = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 8), olive);
    court.position.set(lt.x + 8, 0.12, lt.z - 16);
    add(court);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) {
      const vx = lt.x - 36 + c * 2.4;
      const vz = lt.z + 18 + r * 3.2;
      const vine = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.1 + (c + r) % 3 * 0.35, 0.55), vineMat);
      vine.position.set(vx, 0.7, vz);
      add(vine);
    }
    const yad = hwy1(31.8382, 34.9786);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(18, 7.2, 24), cream);
    hall.position.set(yad.x, 4, yad.z);
    add(hall);
    const towerKeep = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 8), stone);
    towerKeep.position.set(yad.x + 12, 10, yad.z);
    add(towerKeep);
    for (let i = 0; i < 5; i++) {
      const hx = yad.x - 10 + i * 7;
      const hz = yad.z + 18;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 5.4), steel);
      hull.position.set(hx, 1.1, hz);
      add(hull);
      const tur = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 1.1, 10), steel);
      tur.position.set(hx, 2.1, hz);
      add(tur);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 4.4, 6), steel);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(hx, 2.15, hz + 2.6);
      add(barrel);
    }
    const sg = hwy1(31.815, 35.023);
    const sgNear = nearestIndex(built.samples, sg.x, sg.z, 0);
    const sgs = built.samples[sgNear.index];
    const sgyaw = Math.atan2(sgs.tx, sgs.tz);
    placeTunnel(sg.x, sg.z, sgyaw, 28, built.width * 0.55, 9.2, sgs.y);
    for (const side of [-1, 1]) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 64), stone);
      wall.position.set(sg.x + sgs.rx * side * 22, 2.2 + sgs.y, sg.z + sgs.rz * side * 22);
      add(wall);
      for (let k = 0; k < 8; k++) {
        const mer = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 4.2), stone);
        mer.position.set(sg.x + sgs.rx * side * 22, 4.6 + sgs.y, sg.z + sgs.rz * side * 22 + sgs.tz * (-28 + k * 8));
        add(mer);
      }
    }
    const over = new THREE.Mesh(new THREE.BoxGeometry(built.width + 10, 1.4, 12), stone);
    over.position.set(sg.x, sgs.y + 9.6, sg.z);
    over.rotation.y = sgyaw;
    add(over);
    const cs = hwy1(31.8094, 35.0388);
    const keepB = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 16), stone);
    keepB.position.set(cs.x, 18, cs.z);
    add(keepB);
    const keepT = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), stone);
    keepT.position.set(cs.x - 4, 28, cs.z + 3);
    add(keepT);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      const ruin = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.2 + i % 3 * 2.4, 3.6), stone);
      ruin.position.set(cs.x + Math.cos(a) * 16, 10 + i % 3, cs.z + Math.sin(a) * 14);
      ruin.rotation.y = a;
      add(ruin);
    }
    const hill = new THREE.Mesh(new THREE.ConeGeometry(18, 12, 7), olive);
    hill.position.set(cs.x, 4, cs.z);
    add(hill);
    hit(lt.x, lt.z, 12);
    hit(lt.x - 10, lt.z - 2, 5);
    hit(yad.x, yad.z, 10);
    hit(cs.x, cs.z, 12);
  }
  if (def.id === "herzliya") {
    const mar = hzl(32.1635, 34.7965);
    {
      const n = nearestIndex(built.samples, mar.x, mar.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        mar.x = s.x + s.rx * (built.width / 2 + 26);
        mar.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const breakw = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, 72), stone);
    breakw.position.set(mar.x - 42, 0.7, mar.z);
    add(breakw);
    const breakw2 = new THREE.Mesh(new THREE.BoxGeometry(48, 1.4, 5), stone);
    breakw2.position.set(mar.x - 22, 0.6, mar.z - 34);
    add(breakw2);
    const dock = new THREE.Mesh(new THREE.BoxGeometry(52, 0.5, 12), wood);
    dock.position.set(mar.x - 8, 0.32, mar.z);
    add(dock);
    const lightH = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 16, 8), white);
    lightH.position.set(mar.x - 44, 8, mar.z - 30);
    add(lightH);
    const lightCap = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 1.8, 8), cream);
    lightCap.position.set(mar.x - 44, 16.8, mar.z - 30);
    add(lightCap);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 6), new THREE.MeshBasicMaterial({ color: 16777136 }));
    lamp.position.set(mar.x - 44, 18.2, mar.z - 30);
    add(lamp);
    for (let i = 0; i < 10; i++) {
      const hx = mar.x - 28 - i % 2 * 8;
      const hz = mar.z - 26 + i * 6.4;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 8.6), i % 3 === 0 ? cream : white);
      hull.position.set(hx, 0.45, hz);
      hull.rotation.y = 0.08;
      add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 3.4), white);
      cabin.position.set(hx, 1.3, hz);
      add(cabin);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 10, 5), wood);
      mast.position.set(hx, 5.6, hz);
      add(mast);
    }
    const rest = new THREE.Mesh(new THREE.BoxGeometry(18, 5.2, 10), cream);
    rest.position.set(mar.x + 8, 2.7, mar.z + 4);
    add(rest);
    const restRoof = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 12), terracotta);
    restRoof.position.set(mar.x + 8, 5.5, mar.z + 4);
    add(restRoof);
    const ac = hzl(32.1662, 34.8004);
    const accadia = new THREE.Mesh(new THREE.CylinderGeometry(14, 16, 18, 20, 1, false, 0.35, 2.45), white);
    accadia.position.set(ac.x, 9.2, ac.z);
    accadia.rotation.y = -0.4;
    add(accadia);
    for (let i = 0; i < 7; i++) {
      const terrace = new THREE.Mesh(new THREE.CylinderGeometry(14.6, 16.4, 0.2, 20, 1, false, 0.35, 2.45), cream);
      terrace.position.set(ac.x, 2.4 + i * 2.4, ac.z);
      terrace.rotation.y = -0.4;
      add(terrace);
    }
    const acRoof = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 2.2, 20, 1, false, 0.35, 2.45), cream);
    acRoof.position.set(ac.x, 19.2, ac.z);
    acRoof.rotation.y = -0.4;
    add(acRoof);
    const danH = hzl(32.1648, 34.8016);
    const daniel = new THREE.Mesh(new THREE.BoxGeometry(14, 36, 18), white);
    daniel.position.set(danH.x, 18, danH.z);
    add(daniel);
    for (let y = 5; y < 34; y += 3.1) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.16, 19.2), cream);
      sl.position.set(danH.x, y, danH.z);
      add(sl);
    }
    const danCap = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 12), paleGlass);
    danCap.position.set(danH.x, 37.4, danH.z);
    add(danCap);
    const ar = hzl(32.1612, 34.8068);
    const arena = new THREE.Mesh(new THREE.BoxGeometry(38, 11, 24), white);
    arena.position.set(ar.x, 5.6, ar.z);
    add(arena);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 8.4, 14, 6), glass);
    atrium.position.set(ar.x, 16, ar.z);
    add(atrium);
    const atriumRoof = new THREE.Mesh(new THREE.CylinderGeometry(9.2, 7.2, 3.2, 6), paleGlass);
    atriumRoof.position.set(ar.x, 24.4, ar.z);
    add(atriumRoof);
    const wingA = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 18), cream);
    wingA.position.set(ar.x - 22, 4.2, ar.z + 4);
    add(wingA);
    const wingB = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 18), cream);
    wingB.position.set(ar.x + 22, 4.2, ar.z - 4);
    add(wingB);
    const ht = hzl(32.1594, 34.8096);
    const cubeA = new THREE.Mesh(new THREE.BoxGeometry(14, 28, 14), glass);
    cubeA.position.set(ht.x, 14, ht.z);
    cubeA.rotation.y = 0.18;
    add(cubeA);
    const cubeB = new THREE.Mesh(new THREE.BoxGeometry(11, 22, 11), paleGlass);
    cubeB.position.set(ht.x + 16, 11, ht.z + 8);
    cubeB.rotation.y = -0.22;
    add(cubeB);
    const cubeC = new THREE.Mesh(new THREE.BoxGeometry(12, 18, 18), cream);
    cubeC.position.set(ht.x - 14, 9, ht.z + 10);
    add(cubeC);
    const stepTw = new THREE.Mesh(new THREE.BoxGeometry(9, 34, 9), darkGlass);
    stepTw.position.set(ht.x + 8, 17, ht.z - 12);
    add(stepTw);
    for (let i = 0; i < 4; i++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 2.2, 5.4, 16 - i * 2.2), paleGlass);
      slab.position.set(ht.x - 22, 3.2 + i * 6, ht.z - 8);
      add(slab);
    }
    glowAt(ht.x, 28, ht.z, 8967400, 44, 30);
    glowAt(ac.x, 18, ac.z, 16769200, 32, 28);
    hit(mar.x, mar.z, 10);
    hit(ac.x, ac.z, 12);
    hit(danH.x, danH.z, 10);
    hit(ar.x, ar.z, 16);
    hit(ht.x, ht.z, 10);
    hit(ht.x + 16, ht.z + 8, 7);
  }
  if (def.id === "hanikra") {
    const chalk = new THREE.MeshStandardMaterial({
      color: 15789282,
      roughness: 0.9,
      envMapIntensity: 0.22
    });
    const darkCave = new THREE.MeshStandardMaterial({
      color: 920586,
      roughness: 1
    });
    bag.push(chalk, darkCave);
    const cl = nik(33.093, 35.104);
    for (let i = 0; i < 10; i++) {
      const h = 18 + i % 4 * 6;
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(22, h, 12), chalk);
      cliff.position.set(cl.x, h * 0.4, cl.z - 28 + i * 11);
      add(cliff);
      const cave = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 10, 12), darkCave);
      cave.rotation.z = Math.PI / 2;
      cave.position.set(cl.x - 10, 3.6 + i % 3, cl.z - 28 + i * 11);
      add(cave);
      if (i % 2 === 0) {
        const cave2 = new THREE.Mesh(new THREE.SphereGeometry(3.4, 10, 8), darkCave);
        cave2.position.set(cl.x - 8, 6, cl.z - 24 + i * 11);
        add(cave2);
      }
    }
    const portal = new THREE.Mesh(new THREE.BoxGeometry(10, 7, 14), stone);
    portal.position.set(cl.x + 14, 3.6, cl.z);
    add(portal);
    const arch = new THREE.Mesh(new THREE.BoxGeometry(5, 4.4, 8), darkCave);
    arch.position.set(cl.x + 14, 3.2, cl.z);
    add(arch);
    for (let i = 0; i < 4; i++) {
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.6, 3.4), white);
      cabin.position.set(cl.x + 2 - i * 8, 12 + i * 4, cl.z + 10);
      add(cabin);
      const win = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.15), cyan);
      win.position.set(cl.x + 2 - i * 8, 12.1 + i * 4, cl.z + 11.8);
      add(win);
    }
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 42, 5), new THREE.MeshStandardMaterial({
      color: 3355184,
      metalness: 0.7,
      roughness: 0.3
    }));
    cable.rotation.z = 0.55;
    cable.position.set(cl.x - 8, 20, cl.z + 10);
    add(cable);
    glowAt(cl.x, 10, cl.z, 16771248, 24, 20);
    hit(cl.x, cl.z, 14);
  }
  if (def.id === "haifaport") {
    const rust = new THREE.MeshStandardMaterial({
      color: 12081714,
      metalness: 0.45,
      roughness: 0.42
    });
    bag.push(rust);
    const pt = hai(32.819, 35.004);
    for (const c of [
      {
        lat: 32.8186,
        lon: 35.0028
      },
      {
        lat: 32.819,
        lon: 35.004
      },
      {
        lat: 32.8194,
        lon: 35.0052
      }
    ]) {
      const p = hai(c.lat, c.lon);
      const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 34, 1.4), rust);
      crane.position.set(p.x, 17, p.z);
      add(crane);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(36, 0.9, 0.9), rust);
      jib.position.set(p.x + 16, 34, p.z);
      add(jib);
    }
    const colony = [
      {
        lat: 32.8194,
        lon: 34.9892,
        w: 9,
        h: 8
      },
      {
        lat: 32.8198,
        lon: 34.99,
        w: 10,
        h: 9
      },
      {
        lat: 32.82,
        lon: 34.9908,
        w: 8.4,
        h: 7.6
      },
      {
        lat: 32.8192,
        lon: 34.9914,
        w: 11,
        h: 8.8
      }
    ];
    for (let i = 0; i < colony.length; i++) {
      const c = colony[i];
      const p = hai(c.lat, c.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, 10), stone);
      house.position.set(p.x, c.h * 0.5, p.z);
      add(house);
      const rf = new THREE.Mesh(new THREE.ConeGeometry(c.w * 0.7, 3, 4), terracotta);
      rf.rotation.y = Math.PI / 4;
      rf.position.set(p.x, c.h + 1.5, p.z);
      add(rf);
      hit(p.x, p.z, 5);
    }
    glowAt(pt.x, 34, pt.z, 16755302, 40, 28);
    hit(pt.x, pt.z, 10);
  }
  if (def.id === "stellamaris") {
    const sm = hai(32.8275, 34.9705);
    const abbey = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 14), cream);
    abbey.position.set(sm.x, 8, sm.z);
    add(abbey);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 16), cream);
    nave.position.set(sm.x, 6, sm.z + 8);
    add(nave);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
    dome.position.set(sm.x, 14, sm.z);
    add(dome);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.2, 0.25), white);
    cross.position.set(sm.x, 20.2, sm.z);
    add(cross);
    const bg = hai(32.8118, 34.9884);
    for (let i = 0; i < 6; i++) {
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(22 - i, 1.1, 8), new THREE.MeshStandardMaterial({
        color: i % 2 ? 13623492 : 15262936,
        roughness: 0.85
      }));
      terrace.position.set(bg.x, 10 + i * 2.2, bg.z - i * 7);
      add(terrace);
    }
    glowAt(sm.x, 22, sm.z, 16771248, 36, 24);
    hit(sm.x, sm.z, 12);
    const cave = hai(32.8268, 34.9692);
    const caveM = new THREE.Mesh(new THREE.BoxGeometry(8, 4.2, 10), stone);
    caveM.position.set(cave.x, 2.2, cave.z);
    add(caveM);
    const caveH = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, 0.4), darkArch);
    caveH.position.set(cave.x, 1.8, cave.z + 5.2);
    add(caveH);
    hit(cave.x, cave.z, 5);
    const lightH = hai(32.8298, 34.9698);
    const lh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 14, 10), cream);
    lh.position.set(lightH.x, 7, lightH.z);
    add(lh);
    const lhCap = new THREE.Mesh(new THREE.ConeGeometry(2, 2.2, 8), cream);
    lhCap.position.set(lightH.x, 15.2, lightH.z);
    add(lhCap);
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), new THREE.MeshBasicMaterial({ color: 16773828 }));
    lantern.position.set(lightH.x, 14.4, lightH.z);
    add(lantern);
    glowAt(lightH.x, 14, lightH.z, 16771248, 16, 14);
    const pineM = new THREE.MeshStandardMaterial({ color: 1853992, roughness: 0.9, flatShading: true });
    const barkM = new THREE.MeshStandardMaterial({ color: 3811356, roughness: 0.92 });
    bag.push(pineM, barkM);
    const valleyX = def.water ? def.water.x : sm.x - 40;
    const valleyZ = def.water ? def.water.z : sm.z;
    const railM = new THREE.MeshStandardMaterial({ color: 13157564, metalness: 0.35, roughness: 0.45 });
    bag.push(railM);
    for (let i = 3; i < built.samples.length - 3; i += 3) {
      const s = built.samples[i];
      const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      const d = built.width / 2 + 1.5;
      const px = s.x + s.rx * d * vs;
      const pz = s.z + s.rz * d * vs;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.15, 5), railM);
      post.position.set(px, s.y + 0.7, pz);
      add(post);
      const ms = -vs;
      const tx = s.x + s.rx * (built.width / 2 + 10) * ms;
      const tz = s.z + s.rz * (built.width / 2 + 10) * ms;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 6.2, 6), barkM);
      trunk.position.set(tx, s.y + 3.1, tz);
      add(trunk);
      for (let L = 0; L < 3; L++) {
        const needle = new THREE.Mesh(new THREE.ConeGeometry(2 - L * 0.38, 4.2, 7), pineM);
        needle.position.set(tx, s.y + 5.2 + L * 2.2, tz);
        add(needle);
      }
    }
  }
  if (def.id === "tiberias") {
    const pr = tib(32.788, 35.543);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(80, 1.15, 3.4), stone);
    wall.position.set(pr.x, 0.7, pr.z);
    add(wall);
    for (let i = 0; i < 8; i++) {
      const palm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 7, 6), wood);
      palm.position.set(pr.x - 28 + i * 8, 3.6, pr.z + 4);
      add(palm);
      const frond = new THREE.Mesh(new THREE.SphereGeometry(1.8, 6, 4), new THREE.MeshStandardMaterial({
        color: 3832392,
        roughness: 0.9
      }));
      frond.position.set(pr.x - 28 + i * 8, 7.6, pr.z + 4);
      add(frond);
    }
    const hm = tib(32.7685, 35.549);
    const bath = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.6, 5, 12), stone);
    bath.position.set(hm.x, 2.6, hm.z);
    add(bath);
    const bathPool = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 0.4, 12), cyan);
    bathPool.position.set(hm.x, 0.3, hm.z);
    add(bathPool);
    const sp = tib(32.7865, 35.5425);
    const peter = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 10), cream);
    peter.position.set(sp.x, 4.2, sp.z);
    add(peter);
    const peterD = new THREE.Mesh(new THREE.SphereGeometry(3.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), white);
    peterD.position.set(sp.x, 8.4, sp.z);
    add(peterD);
    const cas = tib(32.786, 35.5412);
    const castle = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 12), stone);
    castle.position.set(cas.x, 5.2, cas.z);
    add(castle);
    glowAt(pr.x, 10, pr.z, 16771264, 22, 18);
    hit(pr.x, pr.z, 8);
    hit(hm.x, hm.z, 9);
    hit(sp.x, sp.z, 7);
    hit(cas.x, cas.z, 8);
  }
  if (def.id === "golan") {
    const basalt = new THREE.MeshStandardMaterial({
      color: 4866104,
      roughness: 0.95,
      flatShading: true
    });
    const grass = new THREE.MeshStandardMaterial({
      color: 4876856,
      roughness: 0.92,
      flatShading: true
    });
    bag.push(basalt, grass);
    const kz = gol(32.992, 35.689);
    {
      const n = nearestIndex(built.samples, kz.x, kz.z, 0);
      if (n.dist < built.width / 2 + 16) {
        const s = built.samples[n.index];
        kz.x = s.x + s.rx * (built.width / 2 + 34);
        kz.z = s.z + s.rz * (built.width / 2 + 34);
      }
    }
    for (let i = 0; i < 8; i++) {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(16 + i * 2, 18 + i * 3.4, 6), i % 2 ? grass : basalt);
      hill.position.set(kz.x + 36 + i % 4 * 18, 9, kz.z - 24 + Math.floor(i / 2) * 26);
      add(hill);
    }
    const keepB = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 18), stone);
    keepB.position.set(kz.x - 20, 8, kz.z + 10);
    add(keepB);
    for (const [dx, dz] of [
      [-9, -7],
      [9, -7],
      [-9, 7],
      [9, 7]
    ]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 16, 8), stone);
      t.position.set(kz.x - 20 + dx, 10, kz.z + 10 + dz);
      add(t);
    }
    glowAt(kz.x - 20, 16, kz.z + 10, 16769184, 24, 20);
    hit(kz.x, kz.z, 12);
    hit(kz.x - 20, kz.z + 10, 12);
  }
  if (def.id === "hermon") {
    const snowM = new THREE.MeshStandardMaterial({
      color: 15922938,
      roughness: 0.88
    });
    const rock = new THREE.MeshStandardMaterial({
      color: 9077880,
      roughness: 0.94,
      flatShading: true
    });
    const pineM = new THREE.MeshStandardMaterial({
      color: 1854002,
      roughness: 0.9,
      flatShading: true
    });
    const bark = new THREE.MeshStandardMaterial({
      color: 3811868,
      roughness: 0.92
    });
    bag.push(snowM, rock, pineM, bark);
    const peak = her(33.3112, 35.79);
    const start = her(33.2688, 35.7712);
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 1.4 - 0.4;
      const r = 90 + i % 3 * 32;
      const h = 36 + i % 4 * 14;
      const mtn = new THREE.Mesh(new THREE.DodecahedronGeometry(14 + i % 3 * 5, 0), i < 6 ? snowM : rock);
      mtn.position.set(peak.x + Math.cos(a) * r, def.elevation(1) + 10 + i * 4, peak.z + 22 + Math.sin(a) * r * 0.7);
      mtn.scale.set(2.2, 3.4, 2);
      add(mtn);
    }
    const peakCone = new THREE.Mesh(new THREE.DodecahedronGeometry(34, 0), snowM);
    peakCone.position.set(peak.x + 22, def.elevation(1) + 22, peak.z + 48);
    peakCone.scale.set(2.4, 3.2, 2.2);
    add(peakCone);
    const liftA = her(33.2924, 35.7802);
    const liftB = her(33.3084, 35.7876);
    {
      const nA = nearestIndex(built.samples, liftA.x, liftA.z, 0);
      const sA = built.samples[nA.index];
      liftA.x = sA.x + sA.rx * (built.width / 2 + 14);
      liftA.z = sA.z + sA.rz * (built.width / 2 + 14);
      const nB = nearestIndex(built.samples, liftB.x, liftB.z, 0);
      const sB = built.samples[nB.index];
      liftB.x = sB.x + sB.rx * (built.width / 2 + 14);
      liftB.z = sB.z + sB.rz * (built.width / 2 + 14);
    }
    const postGeo = new THREE.CylinderGeometry(0.35, 0.5, 14, 8);
    const postA = new THREE.Mesh(postGeo, rock);
    postA.position.set(liftA.x, 7, liftA.z);
    add(postA);
    const postB = new THREE.Mesh(postGeo, rock);
    postB.position.set(liftB.x, def.elevation(0.92) + 7, liftB.z);
    add(postB);
    const dx = liftB.x - liftA.x;
    const dy = (def.elevation(0.92) + 13) - 13;
    const dz = liftB.z - liftA.z;
    const cableLen = Math.hypot(dx, dy, dz) || 1;
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, cableLen, 6), bandMat);
    cable.position.set((liftA.x + liftB.x) * 0.5, 13 + dy * 0.5, (liftA.z + liftB.z) * 0.5);
    cable.rotation.z = Math.atan2(dx, dy || 1);
    cable.rotation.x = Math.atan2(dz, Math.hypot(dx, dy) || 1);
    add(cable);
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 2;
      const shoulder = new THREE.Mesh(new THREE.DodecahedronGeometry(16, 0), k % 2 ? snowM : rock);
      shoulder.position.set(peak.x + 22 + Math.cos(a) * 48, def.elevation(1) + 6, peak.z + 48 + Math.sin(a) * 36);
      shoulder.scale.set(1.6, 2.1, 1.5);
      add(shoulder);
    }
    for (let i = 2; i < built.samples.length - 2; i += 2) {
      const s = built.samples[i];
      const towardPeak = s.rx * (peak.x - s.x) + s.rz * (peak.z - s.z) >= 0 ? 1 : -1;
      const berm = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.6, 4.2), snowM);
      berm.position.set(s.x + s.rx * (built.width / 2 + 6.4) * towardPeak, s.y + 0.7, s.z + s.rz * (built.width / 2 + 6.4) * towardPeak);
      berm.rotation.y = Math.atan2(s.tx, s.tz);
      add(berm);
    }
    const nSlope = Math.min(40, built.samples.length);
    const stepS = Math.max(1, Math.floor(built.samples.length / nSlope));
    for (let i = 0; i < built.samples.length; i += stepS) {
      const s = built.samples[i];
      const towardPeak = s.rx * (peak.x - s.x) + s.rz * (peak.z - s.z) >= 0 ? 1 : -1;
      const ms = towardPeak;
      const vs = -ms;
      const d = built.width / 2 + 32;
      const mx = s.x + s.rx * d * ms;
      const mz = s.z + s.rz * d * ms;
      const h = 16 + s.y * 0.22;
      const ridge = new THREE.Mesh(new THREE.DodecahedronGeometry(10 + i % 3 * 3, 0), s.y > 40 ? snowM : rock);
      ridge.position.set(mx, s.y + h * 0.22, mz);
      ridge.scale.set(1.4, 1.8 + s.y * 0.012, 1.2);
      add(ridge);
    }
    const village = [
      { lat: 33.2692, lon: 35.7704 },
      { lat: 33.2698, lon: 35.7718 },
      { lat: 33.2684, lon: 35.7724 },
      { lat: 33.2704, lon: 35.7708 },
      { lat: 33.269, lon: 35.77 },
      { lat: 33.2708, lon: 35.7714 }
    ];
    for (let i = 0; i < village.length; i++) {
      const p = her(village[i].lat, village[i].lon);
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      const extra = built.width / 2 + 16;
      if (n.dist < extra) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * extra;
        p.z = s.z + s.rz * extra;
      }
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4.2, 7.4), stone);
      house.position.set(p.x, 5.2, p.z);
      add(house);
      const rf = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.8, 4), snowM);
      rf.rotation.y = Math.PI / 4;
      rf.position.set(p.x, 8.8, p.z);
      add(rf);
    }
    const lodgeY = def.elevation(0.9);
    {
      const nL = nearestIndex(built.samples, peak.x, peak.z, 0);
      const sL = built.samples[nL.index];
      const lx = sL.x + sL.rx * (built.width / 2 + 22);
      const lz = sL.z + sL.rz * (built.width / 2 + 22);
      const lodge = new THREE.Mesh(new THREE.BoxGeometry(16, 5.4, 10), rock);
      lodge.position.set(lx, lodgeY + 2.8, lz);
      add(lodge);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(11, 5.4, 4), snowM);
      roof.position.set(lx, lodgeY + 8.4, lz);
      add(roof);
    }
    const snowField = new THREE.Mesh(new THREE.CircleGeometry(168, 24), snowM);
    snowField.rotation.x = -Math.PI / 2;
    snowField.position.set(peak.x + 18, def.elevation(1) + 0.35, peak.z + 28);
    add(snowField);
    const mid = her(33.294, 35.778);
    const midY = def.elevation(0.55);
    for (let i = 0; i < 12; i++) {
      const u = i / 11;
      const px = lerp(mid.x, peak.x, u);
      const pz = lerp(mid.z, peak.z, u);
      const py = lerp(midY, lodgeY, u);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 9, 6), cream);
      pole.position.set(px + 10, py + 4.5, pz + 6);
      add(pole);
      if (i < 11) {
        const cable = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(peak.x - mid.x, peak.z - mid.z) / 11 + 0.4, 0.07, 0.07), cream);
        cable.position.set(px + 10 + (peak.x - mid.x) / 22, py + 8.6 + (lodgeY - midY) / 22, pz + 6 + (peak.z - mid.z) / 22);
        cable.lookAt(peak.x + 10, lodgeY + 9, peak.z + 6);
        add(cable);
      }
      if (i % 2 === 0) {
        const chair = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.1), cream);
        chair.position.set(px + 10, py + 6.4, pz + 6);
        add(chair);
      }
    }
    const nim = her(33.2526, 35.7147);
    const fort = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 12), stone);
    fort.position.set(nim.x, 10, nim.z);
    add(fort);
    const keepT = new THREE.Mesh(new THREE.BoxGeometry(7, 14, 7), stone);
    keepT.position.set(nim.x, 14, nim.z);
    add(keepT);
    glowAt(peak.x - 18, lodgeY + 10, peak.z - 8, 16771272, 26, 18);
    hit(peak.x - 18, peak.z - 8, 9);
    hit(nim.x, nim.z, 10);
  }
  if (def.id === "hw6") {
    const conc = new THREE.MeshStandardMaterial({ color: 12105908, roughness: 0.7 });
    const olive = new THREE.MeshStandardMaterial({ color: 4874808, roughness: 0.9, flatShading: true });
    const greenSign = new THREE.MeshStandardMaterial({ color: 1731130, roughness: 0.55 });
    bag.push(conc, olive, greenSign);
    const ks = hwy6(32.134, 34.932);
    const over = new THREE.Mesh(new THREE.BoxGeometry(42, 1.6, 12), conc);
    over.position.set(ks.x, 9.2, ks.z);
    add(over);
    for (const side of [-1, 1]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(3.6, 9, 3.6), conc);
      pier.position.set(ks.x + side * 18, 4.6, ks.z);
      add(pier);
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 28), conc);
      ramp.position.set(ks.x + side * 22, 4.4, ks.z);
      ramp.rotation.z = side * 0.18;
      add(ramp);
    }
    const ey = hwy6(32.21, 34.978);
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(28, 0.6, 1.4), conc);
    gantry.position.set(ey.x, 8.2, ey.z);
    add(gantry);
    for (const side of [-1, 1]) {
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 8.2, 0.6), conc);
      pole.position.set(ey.x + side * 13, 4.2, ey.z);
      add(pole);
    }
    const sign = new THREE.Mesh(new THREE.BoxGeometry(10, 2.4, 0.2), greenSign);
    sign.position.set(ey.x, 8.2, ey.z + 0.8);
    add(sign);
    const nc = hwy6(32.062, 34.948);
    const gantry2 = new THREE.Mesh(new THREE.BoxGeometry(26, 0.5, 1.2), conc);
    gantry2.position.set(nc.x, 7.8, nc.z);
    add(gantry2);
    for (let i = 0; i < 24; i++) {
      const p = hwy6(32.09 + i % 8 * 8e-3, 34.956 + Math.floor(i / 8) * 0.01);
      const tree = new THREE.Mesh(new THREE.SphereGeometry(2.2 + i % 3 * 0.4, 6, 5), olive);
      tree.position.set(p.x, 2.4, p.z);
      add(tree);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 2.6, 5), wood);
      tr.position.set(p.x, 1.2, p.z);
      add(tr);
    }
    hit(ks.x, ks.z, 8);
    hit(ey.x, ey.z, 4);
  }
  if (def.id === "hw2") {
    const sandMat = new THREE.MeshStandardMaterial({ color: 15259572, roughness: 1, flatShading: true });
    const palmTrunk = new THREE.MeshStandardMaterial({ color: 6965810, roughness: 0.9 });
    const palmLeaf = new THREE.MeshStandardMaterial({ color: 3107386, roughness: 0.86, flatShading: true });
    bag.push(sandMat, palmTrunk, palmLeaf);
    for (let i = 0; i < 16; i++) {
      const p = hwy2(32.35 + i * 8e-3, 34.848 + i % 3 * 4e-3);
      const dune = new THREE.Mesh(new THREE.SphereGeometry(10 + i % 4 * 3, 7, 5), sandMat);
      dune.scale.y = 0.38;
      dune.position.set(p.x, 2.2, p.z);
      add(dune);
    }
    for (let i = 0; i < 14; i++) {
      const p = hwy2(32.352 + i * 9e-3, 34.862);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 7.2, 6), palmTrunk);
      trunk.position.set(p.x, 3.6, p.z);
      add(trunk);
      for (let f = 0; f < 6; f++) {
        const a = f / 6 * Math.PI * 2;
        const fr = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.2, 5), palmLeaf);
        fr.rotation.z = 1.05;
        fr.rotation.y = a;
        fr.position.set(p.x + Math.cos(a) * 0.4, 7.4, p.z + Math.sin(a) * 0.4);
        add(fr);
      }
    }
    const nt = hwy2(32.35, 34.868);
    const n1 = new THREE.Mesh(new THREE.BoxGeometry(10, 42, 10), white);
    n1.position.set(nt.x, 21, nt.z);
    add(n1);
    const n2 = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 36, 10), cream);
    n2.position.set(nt.x + 16, 18, nt.z + 6);
    add(n2);
    const n3 = new THREE.Mesh(new THREE.BoxGeometry(8, 28, 12), paleGlass);
    n3.position.set(nt.x - 14, 14, nt.z + 8);
    add(n3);
    const ca = hwy2(32.48, 34.892);
    for (let i = 0; i < 9; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 8.4, 8), stone);
      col.position.set(ca.x - 18 + i * 4.4, 4.4, ca.z + 16);
      add(col);
      if (i < 8) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.45, 6, 10, Math.PI), stone);
        arch.rotation.z = Math.PI;
        arch.position.set(ca.x - 16 + i * 4.4, 8.4, ca.z + 16);
        add(arch);
      }
    }
    const rest = new THREE.Mesh(new THREE.BoxGeometry(16, 5.4, 10), cream);
    rest.position.set(ca.x, 2.8, ca.z);
    add(rest);
    const restR = new THREE.Mesh(new THREE.BoxGeometry(18, 0.4, 12), terracotta);
    restR.position.set(ca.x, 5.6, ca.z);
    add(restR);
    hit(nt.x, nt.z, 8);
    hit(ca.x, ca.z, 10);
  }
  if (def.id === "hw90") {
    const red = new THREE.MeshStandardMaterial({ color: 11565650, roughness: 0.95, flatShading: true });
    const date = new THREE.MeshStandardMaterial({ color: 3107386, roughness: 0.86, flatShading: true });
    bag.push(red, date);
    for (let i = 0; i < 10; i++) {
      const p = hwy90(30.66 + i * 0.012, 35.255 + i % 2 * 0.018);
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(16 + i % 4 * 6, 22 + i % 5 * 8, 5), red);
      mtn.position.set(p.x, 10 + i % 3 * 4, p.z);
      add(mtn);
    }
    for (let i = 0; i < 12; i++) {
      const p = hwy90(30.668 + i * 8e-3, 35.228);
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(14, 12 + i % 4 * 4, 8), red);
      cliff.position.set(p.x, 6 + i % 4 * 2, p.z);
      add(cliff);
    }
    for (let i = 0; i < 16; i++) {
      const p = hwy90(30.7 + i % 8 * 6e-3, 35.244 + Math.floor(i / 8) * 8e-3);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 8.4, 6), wood);
      trunk.position.set(p.x, 4.2, p.z);
      add(trunk);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(2.4, 6, 5), date);
      crown.position.set(p.x, 8.8, p.z);
      add(crown);
    }
    const stopP = hwy90(30.748, 35.268);
    const stop = new THREE.Mesh(new THREE.BoxGeometry(14, 5.2, 10), cream);
    stop.position.set(stopP.x, 2.7, stopP.z);
    add(stop);
    const stopR = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 12), terracotta);
    stopR.position.set(stopP.x, 5.5, stopP.z);
    add(stopR);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 6.4, 12), cream);
    tank.position.set(stopP.x + 12, 3.2, stopP.z);
    add(tank);
    hit(stopP.x, stopP.z, 8);
  }
  if (def.id === "petah") {
    const mallP = pth(32.091, 34.887);
    const mall = new THREE.Mesh(new THREE.BoxGeometry(32, 12, 22), cream);
    mall.position.set(mallP.x, 6.2, mallP.z);
    add(mall);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 10, 12), paleGlass);
    atrium.position.set(mallP.x, 8, mallP.z);
    add(atrium);
    const hospP = pth(32.09, 34.867);
    const hosp = new THREE.Mesh(new THREE.BoxGeometry(22, 18, 14), white);
    hosp.position.set(hospP.x, 9.2, hospP.z);
    add(hosp);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 10), white);
    wing.position.set(hospP.x + 8, 5.2, hospP.z + 10);
    add(wing);
    glowAt(mallP.x, 14, mallP.z, 16764040, 36, 24);
    hit(mallP.x, mallP.z, 12);
    hit(hospP.x, hospP.z, 10);
  }
  if (def.id === "rishon") {
    const gs = rsh(31.9638, 34.8045);
    const syn = new THREE.Mesh(new THREE.BoxGeometry(16, 11, 14), stone);
    syn.position.set(gs.x, 5.6, gs.z);
    add(syn);
    for (const sx of [-7, 7]) {
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 16, 8), stone);
      tw.position.set(gs.x + sx, 9, gs.z + 6);
      add(tw);
      const twCap = new THREE.Mesh(new THREE.ConeGeometry(2.1, 3.2, 4), terracotta);
      twCap.position.set(gs.x + sx, 18.4, gs.z + 6);
      add(twCap);
    }
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
    dome.position.set(gs.x, 11, gs.z);
    add(dome);
    const wn = rsh(31.9618, 34.8072);
    const cellar = new THREE.Mesh(new THREE.BoxGeometry(20, 7, 12), wood);
    cellar.position.set(wn.x, 3.6, wn.z);
    add(cellar);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 4, 10), wood);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(wn.x, 1.8, wn.z + 8);
    add(barrel);
    glowAt(gs.x, 16, gs.z, 16771264, 24, 20);
    hit(gs.x, gs.z, 10);
    hit(wn.x, wn.z, 10);
  }
  if (def.id === "ashdod") {
    const rust = new THREE.MeshStandardMaterial({
      color: 12081714,
      metalness: 0.45,
      roughness: 0.42
    });
    bag.push(rust);
    const quay = asd(31.821, 34.647);
    for (const c of [
      {
        lat: 31.8204,
        lon: 34.6464
      },
      {
        lat: 31.8212,
        lon: 34.647
      },
      {
        lat: 31.822,
        lon: 34.6476
      }
    ]) {
      const p = asd(c.lat, c.lon);
      const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 32, 1.4), rust);
      crane.position.set(p.x, 16, p.z);
      add(crane);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(28, 0.8, 0.8), rust);
      jib.position.set(p.x + 14, 32, p.z);
      add(jib);
    }
    glowAt(quay.x, 32, quay.z, 16755302, 36, 26);
    const lightP = asd(31.8198, 34.6458);
    const lightA = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 20, 8), cream);
    lightA.position.set(lightP.x, 10, lightP.z);
    add(lightA);
    const lightCap = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.8, 8), white);
    lightCap.position.set(lightP.x, 21, lightP.z);
    add(lightCap);
    glowAt(lightP.x, 22, lightP.z, 16771248, 24, 20);
    hit(quay.x, quay.z, 10);
    hit(lightP.x, lightP.z, 6);
  }
  if (def.id === "ashkelon") {
    const np = ask(31.663, 34.548);
    for (const w of [
      {
        lat: 31.6622,
        lon: 34.5472
      },
      {
        lat: 31.6628,
        lon: 34.5478
      },
      {
        lat: 31.6634,
        lon: 34.5484
      },
      {
        lat: 31.664,
        lon: 34.549
      },
      {
        lat: 31.6646,
        lon: 34.5496
      }
    ]) {
      const p = ask(w.lat, w.lon);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 3.2), stone);
      wall.position.set(p.x, 4, p.z);
      add(wall);
    }
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 14, 8), stone);
    tower.position.set(np.x + 12, 7, np.z);
    add(tower);
    hit(np.x, np.z, 12);
  }
  if (def.id === "scopus") {
    const peakY = def.elevation(0.94);
    const start = jer(31.7866, 35.2344);
    const uniP = jer(31.7938, 35.2452);
    const sc = jer(31.7912, 35.2454);
    {
      const nU = nearestIndex(built.samples, uniP.x, uniP.z, 0);
      const sU = built.samples[nU.index];
      uniP.x = sU.x + sU.rx * (built.width / 2 + 20);
      uniP.z = sU.z + sU.rz * (built.width / 2 + 20);
      const nS = nearestIndex(built.samples, sc.x, sc.z, 0);
      const sS = built.samples[nS.index];
      sc.x = sS.x + sS.rx * (built.width / 2 + 18);
      sc.z = sS.z + sS.rz * (built.width / 2 + 18);
    }
    const uni = new THREE.Mesh(new THREE.BoxGeometry(26, 12, 14), cream);
    uni.position.set(uniP.x, peakY * 0.78 + 6, uniP.z);
    add(uni);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(7, 26, 7), stone);
    tower.position.set(uniP.x + 8, peakY * 0.78 + 14, uniP.z);
    add(tower);
    const look = new THREE.Mesh(new THREE.BoxGeometry(16, 1.6, 7), stone);
    look.position.set(sc.x, peakY + 0.9, sc.z);
    add(look);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(16, 0.9, 0.28), cream);
    rail.position.set(sc.x, peakY + 1.8, sc.z - 3);
    add(rail);
    const dm = jer(31.778, 35.2354);
    const kt = jer(31.7767, 35.2342);
    const kn = jer(31.7766, 35.2054);
    placeDome(dm.x, dm.z);
    merlonWall(kt.x, kt.z + 18, 70, 0.2, 11);
    merlonWall(kt.x + 28, kt.z - 8, 58, 1.1, 11);
    const knesset = new THREE.Mesh(new THREE.BoxGeometry(28, 8, 18), stone);
    knesset.position.set(kn.x, 4.2, kn.z);
    add(knesset);
    const pineM = new THREE.MeshStandardMaterial({
      color: 2972216,
      roughness: 0.9,
      flatShading: true
    });
    const hillM = new THREE.MeshStandardMaterial({
      color: 12890250,
      roughness: 0.95,
      flatShading: true
    });
    bag.push(pineM, hillM);
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const r = 220 + i % 4 * 90;
      const h = 48 + i % 5 * 22;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(36 + i % 3 * 12, h, 5), hillM);
      hill.position.set(sc.x + Math.cos(a) * r, peakY * 0.12 + h * 0.18, sc.z + Math.sin(a) * r * 0.85);
      add(hill);
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(42 + i % 3 * 12, 44 + i % 4 * 16, 5), hillM);
      hill.position.set(sc.x + Math.cos(a) * 420, peakY * 0.08 + 16, sc.z + Math.sin(a) * 360);
      add(hill);
    }
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2 + 0.2;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(58 + i % 3 * 16, 52 + i % 4 * 18, 5), hillM);
      hill.position.set(sc.x + Math.cos(a) * 620, 18, sc.z + Math.sin(a) * 540);
      add(hill);
    }
    for (let i = 0; i < 32; i++) {
      const t = 0.06 + i / 32 * 0.85;
      const p = jer(31.7866 + t * 5e-3, 35.2344 + t * 0.01 + Math.sin(i) * 18e-4);
      const y = def.elevation(t);
      const side = i % 2 ? 1 : -1;
      const cyp = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6.8, 7), pineM);
      cyp.position.set(p.x + side * (13 + i % 4 * 3), y + 3.4, p.z + i % 3 * 3);
      add(cyp);
    }
    glowAt(sc.x, peakY + 4, sc.z, 16769184, 22, 18);
    glowAt(dm.x, 16, dm.z, 16765040, 36, 28);
    hit(uniP.x, uniP.z, 12);
    hit(sc.x, sc.z, 6);
    hit(dm.x, dm.z, 10);
    hit(kn.x, kn.z, 10);
  }
  if (def.id === "walls") {
    const jg = jer(31.7764, 35.2276);
    const ng = jer(31.7794, 35.226);
    const ds = jer(31.7817, 35.2304);
    const lg = jer(31.7808, 35.2368);
    const dg = jer(31.7748, 35.2342);
    const zg = jer(31.7728, 35.2292);
    const td = jer(31.7762, 35.2284);
    const dm = jer(31.778, 35.2354);
    const kt = jer(31.7767, 35.2342);
    const c = jer(31.7778, 35.2318);
    const inset = (p: { x: number; z: number }, d = 26) => {
      const dx = c.x - p.x;
      const dz = c.z - p.z;
      const l = Math.hypot(dx, dz) || 1;
      return {
        x: p.x + dx / l * d,
        z: p.z + dz / l * d
      };
    };
    const jgi = inset(jg);
    const ngi = inset(ng);
    const dsi = inset(ds);
    const lgi = inset(lg);
    const dgi = inset(dg);
    const zgi = inset(zg);
    ottomanGate(jgi.x, jgi.z, 0.4);
    ottomanGate(dsi.x, dsi.z, 2.2);
    ottomanGate(lgi.x, lgi.z, 3.3);
    ottomanGate(zgi.x, zgi.z, 5.2);
    merlonWall((jgi.x + ngi.x) * 0.5, (jgi.z + ngi.z) * 0.5, 48, Math.atan2(ngi.x - jgi.x, ngi.z - jgi.z), 12);
    merlonWall((ngi.x + dsi.x) * 0.5, (ngi.z + dsi.z) * 0.5, 58, Math.atan2(dsi.x - ngi.x, dsi.z - ngi.z), 12);
    merlonWall((dsi.x + lgi.x) * 0.5, (dsi.z + lgi.z) * 0.5, 62, Math.atan2(lgi.x - dsi.x, lgi.z - dsi.z), 12);
    merlonWall((lgi.x + dgi.x) * 0.5, (lgi.z + dgi.z) * 0.5, 70, Math.atan2(dgi.x - lgi.x, dgi.z - lgi.z), 12);
    merlonWall((dgi.x + zgi.x) * 0.5, (dgi.z + zgi.z) * 0.5, 55, Math.atan2(zgi.x - dgi.x, zgi.z - dgi.z), 12);
    merlonWall((zgi.x + jgi.x) * 0.5, (zgi.z + jgi.z) * 0.5, 52, Math.atan2(jgi.x - zgi.x, jgi.z - zgi.z), 12);
    const citadel = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 18), stone);
    const tdi = inset(td, 22);
    citadel.position.set(tdi.x, 7, tdi.z);
    add(citadel);
    minaret(tdi.x + 3, tdi.z - 2, 30);
    placeDome(dm.x, dm.z);
    hit(tdi.x, tdi.z, 8);
    hit(kt.x, kt.z, 8);
  }
  if (def.id === "modiin") {
    const mallP = mod(31.907, 35.007);
    const mall = new THREE.Mesh(new THREE.BoxGeometry(24, 12, 16), cream);
    mall.position.set(mallP.x, 6, mallP.z);
    add(mall);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 11, 12), paleGlass);
    atrium.position.set(mallP.x, 7.2, mallP.z);
    add(atrium);
    hit(mallP.x, mallP.z, 12);
  }
  if (def.id === "ramon") {
    const dust = new THREE.MeshStandardMaterial({
      color: 6961192,
      roughness: 0.97,
      flatShading: true
    });
    const sand = new THREE.MeshStandardMaterial({
      color: 12868658,
      roughness: 0.94,
      flatShading: true
    });
    const tan = new THREE.MeshStandardMaterial({
      color: 14725240,
      roughness: 0.92,
      flatShading: true
    });
    const creamRock = new THREE.MeshStandardMaterial({
      color: 15258280,
      roughness: 0.9,
      flatShading: true
    });
    const band = new THREE.MeshStandardMaterial({
      color: 11028520,
      roughness: 0.95,
      flatShading: true
    });
    const darkRock = new THREE.MeshStandardMaterial({
      color: 4860960,
      roughness: 0.96,
      flatShading: true
    });
    const rust = new THREE.MeshStandardMaterial({
      color: 11037250,
      roughness: 0.95,
      flatShading: true
    });
    bag.push(dust, sand, tan, creamRock, band, darkRock, rust);
    const floor = ram(30.585, 34.802);
    const floorPlane = new THREE.Mesh(new THREE.CircleGeometry(420, 28), sand);
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.set(floor.x, 0.4, floor.z);
    add(floorPlane);
    const wadi = new THREE.Mesh(new THREE.BoxGeometry(28, 0.3, 380), dust);
    wadi.position.set(floor.x + 8, 0.55, floor.z);
    add(wadi);
    const rockGeo = new THREE.DodecahedronGeometry(1, 0);
    const nRock = Math.min(48, built.samples.length);
    const rocks = new THREE.InstancedMesh(rockGeo, tan, nRock);
    rocks.castShadow = shadows;
    let rii = 0;
    const stepC = Math.max(1, Math.floor(built.samples.length / nRock));
    for (let i = 0; i < built.samples.length && rii < nRock; i += stepC) {
      const s = built.samples[i];
      const vs = s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1;
      const ms = -vs;
      const d = built.width / 2 + 22 + i % 4 * 6;
      const cx = s.x + s.rx * d * ms;
      const cz = s.z + s.rz * d * ms;
      _dummy.position.set(cx, s.y + 2.4, cz);
      const sc = 3.4 + i % 5 * 1.4;
      _dummy.scale.set(sc * 1.4, sc * 0.7, sc);
      _dummy.rotation.set(i * 0.4, i * 0.7, i * 0.2);
      _dummy.updateMatrix();
      rocks.setMatrixAt(rii++, _dummy.matrix);
    }
    rocks.count = rii;
    rocks.instanceMatrix.needsUpdate = true;
    group.add(rocks);
    {
      const cPos = [];
      const cIdx = [];
      const nC = segsOf(built);
      for (let i = 0; i <= nC; i++) {
        const s = samp(built, i);
        const vs = s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1;
        const ms = -vs;
        const d = built.width / 2 + 9.5;
        const y0 = s.y - 4;
        const y1 = s.y + 120 + Math.min(70, s.y * 0.5);
        cPos.push(s.x + s.rx * d * ms, y0, s.z + s.rz * d * ms);
        cPos.push(s.x + s.rx * d * ms, y1, s.z + s.rz * d * ms);
      }
      for (let i = 0; i < nC; i++) {
        const a = i * 2;
        cIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute("position", new THREE.Float32BufferAttribute(cPos, 3));
      cGeo.setIndex(cIdx);
      cGeo.computeVertexNormals();
      bag.push(cGeo);
      const wall = new THREE.Mesh(cGeo, rust);
      wall.receiveShadow = true;
      add(wall);
    }
    for (let i = 0; i < 22; i++) {
      const a = i / 22 * Math.PI * 2 + 0.15;
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(72 + i % 5 * 22, 110 + i % 4 * 36, 6), i % 3 === 0 ? darkRock : i % 3 === 1 ? rust : tan);
      mtn.position.set(floor.x + Math.cos(a) * 520, 42, floor.z + Math.sin(a) * 380);
      add(mtn);
    }
    const strata = [creamRock, tan, rust, band, sand];
    for (let i = 1; i < built.samples.length - 1; i += 3) {
      const s = built.samples[i];
      const vs = s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1;
      const ms = -vs;
      for (let layer = 0; layer < 5; layer++) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(16, 3.6, 10), strata[layer]);
        const d = built.width / 2 + 12 + layer * 3.2;
        slab.position.set(s.x + s.rx * d * ms, s.y + 2.2 + layer * 3.5, s.z + s.rz * d * ms);
        slab.rotation.y = Math.atan2(s.tx, s.tz);
        add(slab);
      }
    }
    const lk = ram(30.6132, 34.801);
    {
      const n = nearestIndex(built.samples, lk.x, lk.z, 0);
      const s = built.samples[n.index];
      lk.x = s.x + s.rx * (built.width / 2 + 18);
      lk.z = s.z + s.rz * (built.width / 2 + 18);
    }
    const lookY = def.elevation(0.02);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(18, 0.32, 12), creamRock);
    deck.position.set(lk.x, lookY + 0.2, lk.z);
    add(deck);
    const railM = new THREE.MeshStandardMaterial({ color: 0x6a5848, roughness: 0.7, metalness: 0.2 });
    bag.push(railM);
    for (const z of [-16, -4]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 0.08), railM);
      bar.position.set(lk.x, lookY + 1.15, lk.z + z);
      add(bar);
    }
    for (const sx of [-8, 0, 8]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 1.15, 6), railM);
      post.position.set(lk.x + sx, lookY + 0.7, lk.z - 6);
      add(post);
    }
    const cut = ram(30.5992, 34.806);
    const nCut = ram(30.5964, 34.8044);
    const cutYaw = Math.atan2(nCut.x - cut.x, nCut.z - cut.z);
    const cutY = def.elevation(0.55);
    placeTunnel(cut.x, cut.z, cutYaw, 42, built.width * 0.62, 7.6, cutY);
    const crx = Math.cos(cutYaw);
    const crz = -Math.sin(cutYaw);
    const spurL = new THREE.Mesh(new THREE.BoxGeometry(22, 36, 30), darkRock);
    spurL.position.set(cut.x - crx * 28, cutY + 18, cut.z - crz * 28);
    add(spurL);
    const spurR = new THREE.Mesh(new THREE.BoxGeometry(22, 32, 30), sand);
    spurR.position.set(cut.x + crx * 28, cutY + 16, cut.z + crz * 28);
    add(spurR);
    const bushM = new THREE.MeshStandardMaterial({ color: 6978104, roughness: 0.92, flatShading: true });
    bag.push(bushM);
    for (let i = 0; i < 22; i++) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(1.1 + i % 3 * 0.4, 6, 5), bushM);
      bush.position.set(floor.x + i % 9 * 28 - 90, 1.4, floor.z + Math.floor(i / 9) * 34 - 30);
      add(bush);
    }
    glowAt(lk.x, lookY + 5, lk.z, 16763e3, 24, 20);
    hit(lk.x, lk.z, 4);
    hit(cut.x - crx * 28, cut.z - crz * 28, 8);
    hit(cut.x + crx * 28, cut.z + crz * 28, 8);
  }
  if (def.id === "hw40") {
    const hutP = hwy40(30.847, 34.781);
    const hut = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 8), cream);
    hut.position.set(hutP.x, 2.2, hutP.z);
    add(hut);
    const avP = hwy40(30.794, 34.773);
    const avdat = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 12), stone);
    avdat.position.set(avP.x, 3.2, avP.z);
    add(avdat);
    hit(hutP.x, hutP.z, 8);
    hit(avP.x, avP.z, 10);
  }
  if (def.id === "eilatmtn") {
    const ridgePts = [
      eil(29.546, 34.916),
      eil(29.548, 34.92),
      eil(29.55, 34.924),
      eil(29.552, 34.918),
      eil(29.554, 34.926),
      eil(29.547, 34.928),
      eil(29.556, 34.922)
    ];
    for (let i = 0; i < ridgePts.length; i++) {
      const p = ridgePts[i];
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(16 + i * 3, 24 + i * 5, 5), new THREE.MeshStandardMaterial({
        color: 10771002,
        roughness: 0.95,
        flatShading: true
      }));
      mtn.position.set(p.x, 12, p.z);
      add(mtn);
    }
  }
  if (def.id === "gushdan") {
    const clk = tlv(32.0547, 34.7556);
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.1, 20, 12), stone);
    clock.position.set(clk.x, 10, clk.z);
    add(clock);
    const clockBox = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.2, 5.2), cream);
    clockBox.position.set(clk.x, 21.4, clk.z);
    add(clockBox);
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(1.8, 16), white);
    clockFace.position.set(clk.x, 21.4, clk.z + 2.7);
    add(clockFace);
    const clockCap = new THREE.Mesh(new THREE.ConeGeometry(3.2, 4.2, 4), terracotta);
    clockCap.rotation.y = Math.PI / 4;
    clockCap.position.set(clk.x, 26.2, clk.z);
    add(clockCap);
    placeAzrieli(0.72);
    placeTlvTowers(0.62);
    const rd = tlv(32.1044, 34.7776);
    const chim = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 5.2, 78, 16), cream);
    chim.position.set(rd.x, 39, rd.z);
    add(chim);
    const chimGal = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 3.8, 2.4, 16), cream);
    chimGal.position.set(rd.x, 79, rd.z);
    add(chimGal);
    for (let i = 0; i < 5; i++) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(3.55, 3.7, 2.6, 14), i % 2 ? terracotta : white);
      band.position.set(rd.x, 66 + i * 2.8, rd.z);
      add(band);
    }
    const hi = tlv(32.0893, 34.7732);
    const hilton = new THREE.Mesh(new THREE.CylinderGeometry(16, 17, 28, 16, 1, false, 0.55, 2.05), white);
    hilton.position.set(hi.x, 14, hi.z);
    hilton.rotation.y = -0.35;
    add(hilton);
    const marH = hzl(32.1635, 34.7965);
    const dock = new THREE.Mesh(new THREE.BoxGeometry(36, 0.5, 10), wood);
    dock.position.set(marH.x, 0.3, marH.z);
    add(dock);
    const ac = hzl(32.1674, 34.7982);
    const accadia = new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 14, 16, 1, false, 0.35, 2.45), white);
    accadia.position.set(ac.x, 7.2, ac.z);
    accadia.rotation.y = -0.4;
    add(accadia);
    glowAt(rd.x, 78, rd.z, 16724016, 28, 24);
    hit(clk.x, clk.z, 6);
    hit(rd.x, rd.z, 6);
    hit(hi.x, hi.z, 12);
    hit(ac.x, ac.z, 12);
  }
  if (def.id === "nazareth") {
    const ba = naz(32.7014, 35.2962);
    {
      const n = nearestIndex(built.samples, ba.x, ba.z, 0);
      if (n.dist < built.width / 2 + 16) {
        const s = built.samples[n.index];
        ba.x = s.x + s.rx * (built.width / 2 + 32);
        ba.z = s.z + s.rz * (built.width / 2 + 32);
      }
    }
    const darkStone = new THREE.MeshStandardMaterial({
      color: 9075304,
      roughness: 0.82,
      envMapIntensity: 0.4
    });
    bag.push(darkStone);
    const basilica = new THREE.Mesh(new THREE.BoxGeometry(30, 18, 22), darkStone);
    basilica.position.set(ba.x, 9.2, ba.z);
    add(basilica);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(20, 11, 16), cream);
    nave.position.set(ba.x, 21.5, ba.z);
    add(nave);
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.4, 13, 8), cream);
    lantern.position.set(ba.x, 32, ba.z);
    add(lantern);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8;
      const col = new THREE.Mesh(new THREE.BoxGeometry(1.2, 12, 0.8), cream);
      col.position.set(ba.x + Math.cos(a) * 6.8, 32, ba.z + Math.sin(a) * 6.8);
      add(col);
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.6, 0.3), darkGlass);
      win.position.set(ba.x + Math.cos(a) * 6.3, 32, ba.z + Math.sin(a) * 6.3);
      win.lookAt(ba.x, 32, ba.z);
      add(win);
    }
    const bDome = new THREE.Mesh(new THREE.ConeGeometry(7.8, 11, 8), darkStone);
    bDome.position.set(ba.x, 44, ba.z);
    add(bDome);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.4, 0.32), cream);
    crossV.position.set(ba.x, 50.4, ba.z);
    add(crossV);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.32, 0.32), cream);
    crossH.position.set(ba.x, 49.6, ba.z);
    add(crossH);
    const camp = new THREE.Mesh(new THREE.BoxGeometry(6.2, 28, 6.2), darkStone);
    camp.position.set(ba.x + 18, 14, ba.z - 6);
    add(camp);
    const campCap = new THREE.Mesh(new THREE.ConeGeometry(4.2, 6, 4), cream);
    campCap.rotation.y = Math.PI / 4;
    campCap.position.set(ba.x + 18, 31, ba.z - 6);
    add(campCap);
    const face = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 0.4), cream);
    face.position.set(ba.x, 12, ba.z + 11.2);
    add(face);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 0.18), r + c === 3 ? copper : darkStone);
      tile.position.set(ba.x - 6 + c * 4, 8.2 + r * 3.2, ba.z + 11.4);
      add(tile);
    }
    const mw = naz(32.7068, 35.2972);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 2.4, 12), stone);
    well.position.set(mw.x, 1.3, mw.z);
    add(well);
    const wellRoof = new THREE.Mesh(new THREE.ConeGeometry(3.8, 3, 4), terracotta);
    wellRoof.position.set(mw.x, 4, mw.z);
    add(wellRoof);
    const prec = naz(32.697, 35.288);
    const cliff = new THREE.Mesh(new THREE.BoxGeometry(48, 22, 18), stone);
    cliff.position.set(prec.x, 11, prec.z);
    add(cliff);
    for (let i = 0; i < 8; i++) {
      const p = naz(32.704 + i * 0.00035, 35.2994 + (i % 3) * 0.0002);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      if (near.dist < built.width / 2 + 6) continue;
      const stall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.4, 4.6), i % 2 ? cream : stone);
      stall.position.set(p.x, 1.7, p.z);
      add(stall);
      const awn = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 5), terracotta);
      awn.position.set(p.x, 3.5, p.z);
      add(awn);
    }
    glowAt(ba.x, 44, ba.z, 16771264, 40, 32);
    hit(ba.x, ba.z, 14);
    hit(ba.x + 18, ba.z - 6, 5);
    hit(mw.x, mw.z, 4);
    hit(prec.x, prec.z, 16);
  }
  if (def.id === "tzfat") {
    const ct = tzf(32.967, 35.495);
    {
      const n = nearestIndex(built.samples, ct.x, ct.z, 0);
      if (n.dist < built.width / 2 + 14) {
        const s = built.samples[n.index];
        ct.x = s.x + s.rx * (built.width / 2 + 28);
        ct.z = s.z + s.rz * (built.width / 2 + 28);
      }
    }
    const cit = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 9.6, 14, 8), stone);
    cit.position.set(ct.x, 9, ct.z);
    add(cit);
    const citTop = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 8.4, 5, 8), stone);
    citTop.position.set(ct.x, 18.5, ct.z);
    add(citTop);
    const blue = new THREE.MeshStandardMaterial({
      color: 3108528,
      roughness: 0.42,
      metalness: 0.14,
      envMapIntensity: 0.75
    });
    const wash = new THREE.MeshStandardMaterial({
      color: 14214384,
      roughness: 0.7
    });
    bag.push(blue, wash);
    const aq = tzf(32.966, 35.493);
    for (const s of [
      {
        lat: 32.9683,
        lon: 35.4926
      },
      {
        lat: 32.9686,
        lon: 35.4938
      },
      {
        lat: 32.9674,
        lon: 35.493
      },
      {
        lat: 32.9692,
        lon: 35.492
      }
    ]) {
      const p = tzf(s.lat, s.lon);
      const syn = new THREE.Mesh(new THREE.BoxGeometry(11, 8, 11), stone);
      syn.position.set(p.x, 5, p.z);
      add(syn);
      const d = new THREE.Mesh(new THREE.SphereGeometry(4.6, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), blue);
      d.position.set(p.x, 9.2, p.z);
      add(d);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 1.8, 8), gold);
      cap.position.set(p.x, 14.2, p.z);
      add(cap);
      hit(p.x, p.z, 7);
    }
    const houses = [
      {
        lat: 32.9664,
        lon: 35.4922,
        h: 6
      },
      {
        lat: 32.9668,
        lon: 35.4934,
        h: 5.4
      },
      {
        lat: 32.9676,
        lon: 35.4942,
        h: 7.2
      },
      {
        lat: 32.9688,
        lon: 35.4918,
        h: 5.8
      },
      {
        lat: 32.9658,
        lon: 35.4938,
        h: 6.4
      }
    ];
    for (let i = 0; i < houses.length; i++) {
      const h = houses[i];
      const p = tzf(h.lat, h.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.5, h.h, 7), i % 2 ? wash : cream);
      house.position.set(p.x, h.h * 0.5, p.z);
      add(house);
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.2), blue);
      door.position.set(p.x, 1.2, p.z + 3.6);
      add(door);
      hit(p.x, p.z, 4);
    }
    glowAt(aq.x, 14, aq.z, 6727912, 32, 26);
    hit(ct.x, ct.z, 10);
    hit(aq.x, aq.z, 14);
  }
  if (def.id === "masada") {
    const ft = mas(31.3157, 35.3538);
    {
      const n = nearestIndex(built.samples, ft.x, ft.z, 0);
      if (n.dist < built.width / 2 + 40) {
        const s = built.samples[n.index];
        ft.x = s.x + s.rx * (built.width / 2 + 58);
        ft.z = s.z + s.rz * (built.width / 2 + 58);
      }
    }
    const mesaRock = new THREE.MeshStandardMaterial({
      color: 0xa08058,
      roughness: 0.96,
      flatShading: true
    });
    const mesaDark = new THREE.MeshStandardMaterial({
      color: 0x6e5438,
      roughness: 0.97,
      flatShading: true
    });
    bag.push(mesaRock, mesaDark);
    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(38, 52, 44, 8), mesaRock);
    mesa.position.set(ft.x, 22, ft.z);
    add(mesa);
    const plateau = new THREE.Mesh(new THREE.CylinderGeometry(34, 36, 3.2, 8), stone);
    plateau.position.set(ft.x, 45.2, ft.z);
    add(plateau);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8;
      const spur = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 10), i % 2 ? mesaDark : mesaRock);
      spur.position.set(ft.x + Math.cos(a) * 40, 14, ft.z + Math.sin(a) * 28);
      spur.rotation.y = a;
      add(spur);
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 2.2), stone);
      merlon.position.set(ft.x + Math.cos(a) * 32, 48.2, ft.z + Math.sin(a) * 24);
      merlon.rotation.y = a;
      add(merlon);
    }
    const store = new THREE.Mesh(new THREE.BoxGeometry(28, 4.2, 8), stone);
    store.position.set(ft.x - 4, 48.4, ft.z - 6);
    add(store);
    for (let i = 0; i < 5; i++) {
      const hall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.6, 14), stone);
      hall.position.set(ft.x - 16 + i * 7, 48.2, ft.z + 8);
      add(hall);
    }
    const np = mas(31.3172, 35.3536);
    for (let i = 0; i < 3; i++) {
      const w = 16 - i * 3.2;
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(w, 3.4, 8 - i * 0.8), stone);
      terrace.position.set(np.x, 42 - i * 9, np.z + 8 + i * 7);
      add(terrace);
      const colN = 4 - i;
      for (let c = 0; c < colN; c++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 4.8, 8), cream);
        col.position.set(np.x - w * 0.32 + c * (w * 0.64 / Math.max(1, colN - 1)), 45.2 - i * 9, np.z + 8 + i * 7);
        add(col);
      }
    }
    const vis = mas(31.3102, 35.3648);
    const vc = new THREE.Mesh(new THREE.BoxGeometry(14, 4.2, 10), cream);
    vc.position.set(vis.x, 2.2, vis.z);
    add(vc);
    const vcRoof = new THREE.Mesh(new THREE.BoxGeometry(15, 0.4, 11), terracotta);
    vcRoof.position.set(vis.x, 4.4, vis.z);
    add(vcRoof);
    glowAt(ft.x, 50, ft.z, 16769184, 40, 32);
    hit(ft.x, ft.z, 22);
    hit(np.x, np.z + 12, 6);
    hit(vis.x, vis.z, 6);
  }
  if (def.id === "batyam") {
    const promenade = bym(32.017, 34.741);
    for (const ht of [
      {
        lat: 32.0158,
        lon: 34.7406,
        h: 18
      },
      {
        lat: 32.0172,
        lon: 34.741,
        h: 22
      },
      {
        lat: 32.0186,
        lon: 34.7414,
        h: 20
      },
      {
        lat: 32.02,
        lon: 34.7418,
        h: 24
      }
    ]) {
      const p = bym(ht.lat, ht.lon);
      const hotel = new THREE.Mesh(new THREE.BoxGeometry(9, ht.h, 8), white);
      hotel.position.set(p.x, ht.h * 0.5, p.z);
      add(hotel);
      hit(p.x, p.z, 6);
    }
    const marina = bym(32.023, 34.742);
    const pier = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 22), wood);
    pier.position.set(marina.x, 0.22, marina.z);
    add(pier);
    glowAt(promenade.x, 20, promenade.z, 16771248, 22, 18);
    hit(promenade.x + 24, promenade.z, 12);
  }
  if (def.id === "rehovot") {
    const wz = rhv(31.9078, 34.818);
    const house = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 8.4, 8, 16), cream);
    house.position.set(wz.x, 5, wz.z);
    add(house);
    const roof = new THREE.Mesh(new THREE.SphereGeometry(8.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), terracotta);
    roof.position.set(wz.x, 9, wz.z);
    add(roof);
    for (const lb of [
      {
        lat: 31.9082,
        lon: 34.8112,
        w: 16,
        h: 9,
        d: 10
      },
      {
        lat: 31.909,
        lon: 34.8098,
        w: 14,
        h: 11,
        d: 12
      },
      {
        lat: 31.9074,
        lon: 34.8106,
        w: 18,
        h: 8,
        d: 10
      },
      {
        lat: 31.9086,
        lon: 34.8122,
        w: 12,
        h: 14,
        d: 10
      }
    ]) {
      const p = rhv(lb.lat, lb.lon);
      const lab = new THREE.Mesh(new THREE.BoxGeometry(lb.w, lb.h, lb.d), white);
      lab.position.set(p.x, lb.h * 0.5, p.z);
      add(lab);
      hit(p.x, p.z, 8);
    }
    glowAt(wz.x, 12, wz.z, 16771264, 28, 22);
    hit(wz.x, wz.z, 10);
  }
  if (def.id === "nahariya") {
    const canalP = nah(33.006, 35.094);
    const canal = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 160), cyan);
    canal.position.set(canalP.x, 0.12, canalP.z);
    add(canal);
    for (let i = 0; i < 8; i++) {
      const palm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 8, 6), wood);
      palm.position.set(canalP.x + (i % 2 ? 8 : -8), 4, canalP.z - 70 + i * 18);
      add(palm);
      const fr = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 6), new THREE.MeshStandardMaterial({
        color: 2779704,
        roughness: 0.88
      }));
      fr.position.set(canalP.x + (i % 2 ? 8 : -8), 9, canalP.z - 70 + i * 18);
      add(fr);
    }
    const hotelP = nah(33.0082, 35.0924);
    const hotelN = new THREE.Mesh(new THREE.BoxGeometry(14, 16, 10), white);
    hotelN.position.set(hotelP.x, 8, hotelP.z);
    add(hotelN);
    glowAt(canalP.x, 4, canalP.z, 6736096, 22, 28);
    hit(hotelP.x, hotelP.z, 8);
  }
  if (def.id === "ramla") {
    const tw = rml(31.9294, 34.866);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(5.2, 28, 5.2), cream);
    tower.position.set(tw.x, 14, tw.z);
    add(tower);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.2, 6.2), cream);
    cap.position.set(tw.x, 29, tw.z);
    add(cap);
    const ms = rml(31.9278, 34.8668);
    const mosque = new THREE.Mesh(new THREE.BoxGeometry(18, 10, 14), stone);
    mosque.position.set(ms.x, 6, ms.z);
    add(mosque);
    const mdome = new THREE.Mesh(new THREE.SphereGeometry(5.4, 12, 8), white);
    mdome.position.set(ms.x, 13, ms.z);
    add(mdome);
    glowAt(tw.x, 30, tw.z, 16771264, 28, 24);
    hit(tw.x, tw.z, 8);
    hit(ms.x, ms.z, 10);
  }
  if (def.id === "holon") {
    const dmH = hol(32.0076, 34.7792);
    const spiral = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 9.4, 12, 10), white);
    spiral.position.set(dmH.x, 7, dmH.z);
    add(spiral);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.5, 6, 16), white);
    lip.rotation.x = Math.PI / 2;
    lip.position.set(dmH.x, 13, dmH.z);
    add(lip);
    for (const b of [
      {
        lat: 32.0086,
        lon: 34.7798,
        w: 14,
        h: 12,
        d: 10
      },
      {
        lat: 32.0094,
        lon: 34.7786,
        w: 16,
        h: 9,
        d: 12
      },
      {
        lat: 32.0072,
        lon: 34.7778,
        w: 18,
        h: 8,
        d: 11
      }
    ]) {
      const p = hol(b.lat, b.lon);
      const blk = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), cream);
      blk.position.set(p.x, b.h * 0.5, p.z);
      add(blk);
      hit(p.x, p.z, 7);
    }
    glowAt(dmH.x, 14, dmH.z, 15791352, 26, 22);
    hit(dmH.x, dmH.z, 10);
  }
  if (def.id === "beitshan") {
    const th = bsn(32.503, 35.502);
    const theatre = new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 6, 16, 1, true, 0, Math.PI), stone);
    theatre.position.set(th.x, 3.2, th.z);
    theatre.rotation.y = 0.4;
    add(theatre);
    for (const c of [
      {
        lat: 32.5032,
        lon: 35.5026
      },
      {
        lat: 32.5036,
        lon: 35.5038
      },
      {
        lat: 32.504,
        lon: 35.505
      },
      {
        lat: 32.5044,
        lon: 35.5062
      },
      {
        lat: 32.5048,
        lon: 35.5074
      }
    ]) {
      const p = bsn(c.lat, c.lon);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 9, 8), cream);
      col.position.set(p.x, 4.6, p.z);
      add(col);
      const capc = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.3), cream);
      capc.position.set(p.x, 9.3, p.z);
      add(capc);
    }
    const gb = bsn(32.48, 35.42);
    const gilboa = new THREE.Mesh(new THREE.ConeGeometry(16, 22, 5), new THREE.MeshStandardMaterial({
      color: 9071176,
      roughness: 0.95,
      flatShading: true
    }));
    gilboa.position.set(gb.x, 10, gb.z);
    add(gilboa);
    glowAt(th.x, 8, th.z, 16769200, 22, 20);
    hit(th.x, th.z, 12);
    hit(gb.x, gb.z, 14);
  }
  if (def.id === "hadera") {
    const rust = new THREE.MeshStandardMaterial({
      color: 12081714,
      metalness: 0.35,
      roughness: 0.48
    });
    bag.push(rust);
    const plant = hdr(32.47, 34.888);
    const stacks = [hdr(32.4698, 34.8874), hdr(32.4704, 34.8886)];
    for (const p of stacks) {
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.4, 52, 12), rust);
      stack.position.set(p.x, 26, p.z);
      add(stack);
    }
    const hall = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 16), cream);
    hall.position.set(plant.x, 5, plant.z + 16);
    add(hall);
    glowAt(plant.x, 50, plant.z, 16746564, 36, 40);
    hit(plant.x, plant.z, 14);
  }
  if (def.id === "lod") {
    const tw = lodp(31.9514, 34.8882);
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 28, 10), cream);
    tower.position.set(tw.x, 14, tw.z);
    add(tower);
    const church = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 12), stone);
    church.position.set(tw.x + 8, 5.2, tw.z + 4);
    add(church);
    const term = lodp(31.978, 34.888);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(36, 8, 16), white);
    hall.position.set(term.x, 4.2, term.z);
    add(hall);
    const cab = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 4, 12), paleGlass);
    cab.position.set(term.x, 22, term.z);
    add(cab);
    glowAt(term.x, 24, term.z, 8967408, 28, 24);
    hit(tw.x, tw.z, 8);
    hit(term.x, term.z, 12);
  }
  if (def.id === "kshmona") {
    const ridge0 = ksm(33.215, 35.58);
    for (let i = 0; i < 5; i++) {
      const ridge = new THREE.Mesh(new THREE.ConeGeometry(12 + i * 2, 18 + i * 4, 5), new THREE.MeshStandardMaterial({
        color: 5925448,
        roughness: 0.95,
        flatShading: true
      }));
      ridge.position.set(ridge0.x + i * 10, 8 + i, ridge0.z + i % 2 * 16);
      add(ridge);
    }
    const lionP = ksm(33.207, 35.567);
    const lion = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 4), stone);
    lion.position.set(lionP.x, 4.2, lionP.z);
    add(lion);
    glowAt(lionP.x, 8, lionP.z, 16771264, 20, 18);
    hit(lionP.x, lionP.z, 8);
  }
  if (def.id === "raanana") {
    const park = raa(32.185, 34.853);
    for (let i = 0; i < 12; i++) {
      const tree = new THREE.Mesh(new THREE.ConeGeometry(2.2, 7, 6), new THREE.MeshStandardMaterial({
        color: 2779704,
        roughness: 0.88
      }));
      tree.position.set(park.x - 10 + i % 4 * 8, 3.6, park.z + Math.floor(i / 4) * 10);
      add(tree);
    }
    const mallP = raa(32.184, 34.865);
    const mall = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 16), white);
    mall.position.set(mallP.x, 5, mallP.z);
    add(mall);
    glowAt(mallP.x, 10, mallP.z, 15791352, 22, 20);
    hit(mallP.x, mallP.z, 12);
  }
  if (def.id === "afula") {
    const ctr = afl(32.61, 35.29);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(16, 1.1, 8, 28), cream);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(ctr.x, 0.4, ctr.z);
    add(ring);
    const gb = afl(32.55, 35.33);
    const gilboa = new THREE.Mesh(new THREE.ConeGeometry(22, 28, 5), new THREE.MeshStandardMaterial({
      color: 8022600,
      roughness: 0.95,
      flatShading: true
    }));
    gilboa.position.set(gb.x, 12, gb.z);
    add(gilboa);
    glowAt(ctr.x, 2, ctr.z, 16771264, 18, 22);
    hit(gb.x, gb.z, 16);
  }
  if (def.id === "ksaba") {
    const pk = ksb(32.175, 34.908);
    const garden = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.3, 16), new THREE.MeshStandardMaterial({
      color: 3832386,
      roughness: 0.9
    }));
    garden.position.set(pk.x, 0.15, pk.z);
    add(garden);
    const obelisk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 12, 1.4), stone);
    obelisk.position.set(pk.x, 6, pk.z);
    add(obelisk);
    glowAt(pk.x, 12, pk.z, 16771264, 18, 16);
    hit(pk.x, pk.z, 8);
  }
  if (def.id === "arad") {
    for (const h of [
      {
        lat: 31.2572,
        lon: 35.2122,
        h: 4.2
      },
      {
        lat: 31.258,
        lon: 35.2134,
        h: 5.6
      },
      {
        lat: 31.2588,
        lon: 35.2126,
        h: 4.8
      },
      {
        lat: 31.2576,
        lon: 35.214,
        h: 6.2
      }
    ]) {
      const p = ard(h.lat, h.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(8, h.h, 6), white);
      house.position.set(p.x, h.h * 0.5, p.z);
      add(house);
      hit(p.x, p.z, 4);
    }
    const ridgeP = ard(31.27, 35.24);
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(28, 18, 5), new THREE.MeshStandardMaterial({
      color: 12886128,
      roughness: 0.96,
      flatShading: true
    }));
    ridge.position.set(ridgeP.x, 8, ridgeP.z);
    add(ridge);
    hit(ridgeP.x, ridgeP.z, 16);
  }
  if (def.id === "manhattan") {
    placeNycSkyline(8, -120, 1);
    const liberty = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 18, 8), copper);
    liberty.position.set(-96, 10, -180);
    add(liberty);
    const torch = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), gold);
    torch.position.set(-96, 21, -180);
    add(torch);
    glowAt(-96, 22, -180, 16764006, 24, 22);
    hit(-96, -180, 6);
  }
  if (def.id === "brooklynbridge") {
    placeGothicTower(-8, -36, 28);
    placeGothicTower(28, 62, 28);
    placeNycSkyline(-70, 8, 0.55);
    const liberty = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.1, 16, 8), copper);
    liberty.position.set(90, 9, -48);
    add(liberty);
    glowAt(90, 18, -48, 16764006, 22, 20);
  }
  if (def.id === "timessquare") {
    const oneTs = new THREE.Mesh(new THREE.BoxGeometry(12, 52, 10), darkGlass);
    oneTs.position.set(18, 26, 8);
    add(oneTs);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 10), paleGlass);
    ball.position.set(18, 56, 8);
    add(ball);
    placeNycSkyline(-48, -40, 0.62);
    glowAt(18, 56, 8, 16737962, 36, 28);
    hit(18, 8, 8);
  }
  if (def.id === "centralpark") {
    const font = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.45, 8, 24), stone);
    font.rotation.x = Math.PI / 2;
    font.position.set(8, 0.6, 12);
    add(font);
    const angel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 8, 8), copper);
    angel.position.set(8, 5, 12);
    add(angel);
    const gug = new THREE.Mesh(new THREE.CylinderGeometry(10, 6.5, 16, 16), white);
    gug.position.set(52, 8, 40);
    add(gug);
    const gugTop = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 8.4, 6, 16), white);
    gugTop.position.set(52, 18, 40);
    add(gugTop);
    glowAt(8, 8, 12, 16771264, 22, 20);
    hit(52, 40, 10);
  }
  scatterStreetBuildings(def, built, add, hit, isNight, (x, z) => {
    for (const c of colliders) {
      if (Math.hypot(c.x - x, c.z - z) < (c.r ?? 6) + 14) return true;
    }
    return false;
  });
}
