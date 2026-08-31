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

// RSH-019-OVERLAY-BEGIN:world-disposal-import
import { assembleWorld } from "./world-core";
import { createObject3DDisposalTracker, disposeObject3D } from "../rendering/disposeObject3D";
// RSH-019-OVERLAY-END:world-disposal-import
export type { World } from "./world-core";
import { addLandmarks } from "./world-builders";

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
  // RSH-019-OVERLAY-BEGIN:world-disposed-state
  const group = new THREE.Group();
  const bag: Disposable[] = [];
  let disposed = false;
  // RSH-019-OVERLAY-END:world-disposed-state
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
  const ground = new THREE.Mesh(keep(new THREE.PlaneGeometry(Math.max(def.id === "scopus" || def.id === "hermon" || def.id === "ramon" ? 4200 : 1200, span * (def.id === "scopus" ? 5.4 : 2.8)), Math.max(def.id === "scopus" || def.id === "hermon" || def.id === "ramon" ? 4200 : 1200, span * (def.id === "scopus" ? 5.4 : 2.8)))), keep(new THREE.MeshStandardMaterial({
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
    const outer = def.id === "ramon" ? 280 : def.id === "hermon" ? 250 : def.theme === "carmel" ? 160 : 78;
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
      const mountainY = def.id === "ramon" ? s.y + 180 + Math.min(110, s.y * 0.7) : def.id === "masada" ? s.y + 28 + s.y * 0.35 : def.id === "hermon" ? s.y + 148 + s.y * 0.6 : def.theme === "carmel" ? s.y + 78 : s.y + 8;
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
    // RSH-019-OVERLAY-BEGIN:world-reflector-disposal
    bag.push({ dispose() {
      mirror?.dispose();
    } });
    // RSH-019-OVERLAY-END:world-reflector-disposal
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
  addLandmarks({
    group,
    def,
    bag,
    shadows,
    isNight,
    glows: landmarkGlows,
    emitList,
    colliders,
    movers,
    ramps,
    streets,
    built,
    support: {
      _dummy,
      barkTexture,
      curtainTexture,
      foliageTexture,
      herodianTexture,
      samp,
      segsOf,
    },
  });
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
  return assembleWorld({
    group,
    sun,
    sky,
    dir,
    dirNear,
    waterMesh,
    colliders,
    streets,
    ramps,
    getNight: () => isNight,
    getWeather: () => wx,
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
    getClock: () => clock,
    setWeather,
    setLod,
    // RSH-019-OVERLAY-BEGIN:world-dispose
    dispose() {
      if (disposed) return;
      disposed = true;
      const tracker = createObject3DDisposalTracker();
      disposeObject3D(group, tracker);
      const disposedSceneResources = new Set<Disposable>([
        ...tracker.geometries,
        ...tracker.materials,
      ]);
      for (let index = bag.length - 1; index >= 0; index -= 1) {
        const resource = bag[index];
        if (disposedSceneResources.has(resource)) continue;
        try {
          resource.dispose();
        } catch {
          /* continue releasing the remaining owned resources */
        }
      }
      bag.length = 0;
      dir.shadow.map?.dispose();
      dir.shadow.mapPass?.dispose();
      dirNear.shadow.map?.dispose();
      dirNear.shadow.mapPass?.dispose();
    },
    // RSH-019-OVERLAY-END:world-dispose
  });
}

