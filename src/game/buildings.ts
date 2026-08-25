import * as THREE from "three";
import type { TrackDef } from "./types";
import type { BuiltTrack } from "./spline";

export type BuildFn = (mesh: THREE.Mesh) => void;

type Mats = {
  cream: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  plaster: THREE.MeshStandardMaterial;
  white: THREE.MeshStandardMaterial;
  terracotta: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  darkGlass: THREE.MeshPhysicalMaterial;
  shutter: THREE.MeshStandardMaterial;
  brick: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
};

function makeMats(night: boolean): Mats {
  return {
    cream: new THREE.MeshStandardMaterial({ color: 0xe8dcc4, roughness: 0.72, envMapIntensity: 0.45 }),
    stone: new THREE.MeshStandardMaterial({ color: 0xd4c4a0, roughness: 0.88, envMapIntensity: 0.28 }),
    plaster: new THREE.MeshStandardMaterial({ color: 0xa88862, roughness: 0.9, envMapIntensity: 0.22 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf2eee4, roughness: 0.58, envMapIntensity: 0.5 }),
    terracotta: new THREE.MeshStandardMaterial({ color: 0xa45a3a, roughness: 0.84, envMapIntensity: 0.25 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x6aa0b4,
      roughness: 0.1,
      metalness: 0.82,
      envMapIntensity: 1.6,
      clearcoat: 0.8,
      emissive: 0x1a4a66,
      emissiveIntensity: night ? 0.28 : 0,
    }),
    darkGlass: new THREE.MeshPhysicalMaterial({
      color: 0x1a2830,
      roughness: 0.12,
      metalness: 0.7,
      envMapIntensity: 1.2,
      emissive: 0xffc070,
      emissiveIntensity: night ? 0.35 : 0,
    }),
    shutter: new THREE.MeshStandardMaterial({ color: 0x3a5a78, roughness: 0.55 }),
    brick: new THREE.MeshStandardMaterial({ color: 0x8a5a42, roughness: 0.86, envMapIntensity: 0.3 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x8a9098, metalness: 0.7, roughness: 0.32 }),
  };
}

function windows(
  add: BuildFn,
  x: number,
  y0: number,
  z: number,
  yaw: number,
  w: number,
  floors: number,
  glass: THREE.Material,
  depth: number,
) {
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  const rx = Math.cos(yaw);
  const rz = -Math.sin(yaw);
  const cols = w > 10 ? 3 : 2;
  for (let fl = 0; fl < floors; fl++) {
    for (let c = 0; c < cols; c++) {
      const lat = (c - (cols - 1) * 0.5) * (w * 0.28);
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.45), glass);
      win.position.set(x + fx * (depth * 0.51) + rx * lat, y0 + 2.2 + fl * 2.7, z + fz * (depth * 0.51) + rz * lat);
      win.rotation.y = yaw;
      add(win);
    }
  }
}

function bauhaus(add: BuildFn, hit: (x: number, z: number, r: number) => void, mats: Mats, x: number, y: number, z: number, yaw: number, h: number, seed: number) {
  const w = 8.4 + (seed % 4) * 1.1;
  const d = 7.2 + (seed % 3) * 0.6;
  const bodyMat = seed % 3 === 0 ? mats.white : seed % 3 === 1 ? mats.cream : mats.brick;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bodyMat);
  body.position.set(x, y + h * 0.5, z);
  body.rotation.y = yaw;
  add(body);
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.55, 0.32, d + 0.55), mats.cream);
  cornice.position.set(x, y + h + 0.08, z);
  cornice.rotation.y = yaw;
  add(cornice);
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  const bal = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 0.16, 1.45), mats.white);
  bal.position.set(x + fx * (d * 0.5 + 0.6), y + Math.min(h * 0.45, 5.2), z + fz * (d * 0.5 + 0.6));
  bal.rotation.y = yaw;
  add(bal);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 0.7, 0.08), mats.metal);
  rail.position.set(x + fx * (d * 0.5 + 1.2), y + Math.min(h * 0.45, 5.2) + 0.4, z + fz * (d * 0.5 + 1.2));
  rail.rotation.y = yaw;
  add(rail);
  if (seed % 4 === 0) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.9, 8), mats.metal);
    tank.position.set(x + 1.4, y + h + 0.7, z);
    add(tank);
  }
  windows(add, x, y, z, yaw, w, Math.max(2, Math.floor(h / 2.8)), mats.darkGlass, d);
    hit(x, z, Math.max(w, d) * 0.36);
}

function jerusalem(add: BuildFn, hit: (x: number, z: number, r: number) => void, mats: Mats, x: number, y: number, z: number, yaw: number, h: number, seed: number) {
  const w = 7.6 + (seed % 3) * 1.2;
  const d = 6.8;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.stone);
  body.position.set(x, y + h * 0.5, z);
  body.rotation.y = yaw;
  add(body);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.7, 0.55, d + 0.7), mats.stone);
  cap.position.set(x, y + h + 0.2, z);
  cap.rotation.y = yaw;
  add(cap);
  const nMer = 3 + (seed % 2);
  const rx = Math.cos(yaw);
  const rz = -Math.sin(yaw);
  for (let i = 0; i < nMer; i++) {
    const t = (i / Math.max(1, nMer - 1) - 0.5) * (w - 1.4);
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.7), mats.stone);
    m.position.set(x + rx * t, y + h + 0.85, z + rz * t);
    m.rotation.y = yaw;
    add(m);
  }
  windows(add, x, y, z, yaw, w, Math.max(2, Math.floor(h / 3)), mats.darkGlass, d);
    hit(x, z, Math.max(w, d) * 0.36);
}

function jaffa(add: BuildFn, hit: (x: number, z: number, r: number) => void, mats: Mats, x: number, y: number, z: number, yaw: number, h: number, seed: number) {
  const w = 6.4 + (seed % 3) * 0.9;
  const d = 6.2;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.plaster);
  body.position.set(x, y + h * 0.5, z);
  body.rotation.y = yaw;
  add(body);
  if (seed % 3 === 0) {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(w * 0.28, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), mats.terracotta);
    dome.position.set(x, y + h, z);
    add(dome);
  } else {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.35, d + 0.4), mats.terracotta);
    roof.position.set(x, y + h + 0.15, z);
    roof.rotation.y = yaw;
    add(roof);
  }
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.35, 10, 1, false, 0, Math.PI), mats.darkGlass);
  arch.rotation.z = Math.PI / 2;
  arch.rotation.y = yaw;
  arch.position.set(x + fx * (d * 0.51), y + 2.1, z + fz * (d * 0.51));
  add(arch);
  windows(add, x, y + 1.2, z, yaw, w * 0.8, Math.max(1, Math.floor((h - 3) / 2.8)), mats.darkGlass, d);
    hit(x, z, Math.max(w, d) * 0.36);
}

function eclectic(add: BuildFn, hit: (x: number, z: number, r: number) => void, mats: Mats, x: number, y: number, z: number, yaw: number, h: number, seed: number) {
  const w = 7.2 + (seed % 4) * 0.9;
  const d = 8.4 + (seed % 3) * 0.5;
  const plaster = seed % 2 === 0 ? mats.cream : mats.plaster;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), plaster);
  body.position.set(x, y + h * 0.5, z);
  body.rotation.y = yaw;
  add(body);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.42, d + 0.8), mats.terracotta);
  roof.position.set(x, y + h + 0.18, z);
  roof.rotation.y = yaw;
  add(roof);
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  const ped = new THREE.Mesh(new THREE.BoxGeometry(w * 0.42, 0.22, 1.6), mats.stone);
  ped.position.set(x + fx * (d * 0.5 + 0.7), y + 3.4, z + fz * (d * 0.5 + 0.7));
  ped.rotation.y = yaw;
  add(ped);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 3.1, 8), mats.stone);
  col.position.set(x + fx * (d * 0.5 + 0.85), y + 1.7, z + fz * (d * 0.5 + 0.85));
  add(col);
  if (seed % 3 !== 1) {
    const attic = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, 1.6, d * 0.4), mats.white);
    attic.position.set(x, y + h + 1.1, z);
    attic.rotation.y = yaw;
    add(attic);
  }
  windows(add, x, y, z, yaw, w, Math.max(2, Math.floor(h / 2.6)), mats.darkGlass, d);
  hit(x, z, Math.max(w, d) * 0.36);
}

function highwayTower(add: BuildFn, hit: (x: number, z: number, r: number) => void, mats: Mats, x: number, y: number, z: number, yaw: number, h: number, seed: number) {
  const profile = seed % 5;
  const w = 10 + (seed % 4) * 1.4;
  if (profile === 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, h, w * 0.72), mats.glass);
    m.position.set(x, y + h * 0.5, z);
    m.rotation.y = yaw + 0.2;
    add(m);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, h * 0.12, w * 0.5), mats.darkGlass);
    cap.position.set(x, y + h + h * 0.06, z);
    cap.rotation.y = yaw + 0.2;
    add(cap);
  } else if (profile === 1) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.38, w * 0.44, h, 12), mats.glass);
    m.position.set(x, y + h * 0.5, z);
    add(m);
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.5, w * 0.28, 4.2, 12), mats.metal);
    hat.position.set(x, y + h + 2, z);
    add(hat);
  } else if (profile === 2) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, h, w * 0.95), mats.darkGlass);
    m.position.set(x, y + h * 0.5, z);
    m.rotation.y = yaw;
    add(m);
    for (let k = 1; k < 5; k++) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 0.28, w * 1.02), mats.metal);
      band.position.set(x, y + (h * k) / 5, z);
      band.rotation.y = yaw;
      add(band);
    }
  } else if (profile === 3) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.48, w * 0.52, h, 3), mats.glass);
    m.position.set(x, y + h * 0.5, z);
    m.rotation.y = yaw + 0.35;
    add(m);
  } else {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, h, w * 0.5), mats.white);
    m.position.set(x, y + h * 0.5, z);
    m.rotation.y = yaw;
    add(m);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.92, 0.2), mats.glass);
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    glass.position.set(x + fx * (w * 0.26), y + h * 0.5, z + fz * (w * 0.26));
    glass.rotation.y = yaw;
    add(glass);
  }
  hit(x, z, w * 0.34);
}

function motzaSign(add: BuildFn, he: string, x: number, y: number, z: number, yaw: number) {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 3.4, 6),
    new THREE.MeshStandardMaterial({ color: 0x2a2e32, metalness: 0.55, roughness: 0.4 }),
  );
  pole.position.set(x, y + 1.7, z);
  add(pole);
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return;
  g.fillStyle = "#1a6a38";
  g.fillRect(0, 0, 512, 128);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 10;
  g.strokeRect(8, 8, 496, 112);
  g.fillStyle = "#ffffff";
  g.font = "600 48px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(he, 256, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshBasicMaterial({ map: tex }));
  board.position.set(x, y + 3.5, z);
  board.rotation.y = yaw + Math.PI;
  add(board);
}

export function scatterStreetBuildings(
  def: TrackDef,
  built: BuiltTrack,
  add: BuildFn,
  hit: (x: number, z: number, r: number) => void,
  night: boolean,
  blocked?: (x: number, z: number) => boolean,
) {
  if (def.city === "nyc") return;
  const id = def.id;
  if (id !== "ayalon" && id !== "rothschild") return;

  const mats = makeMats(night);
  const nSamp = built.samples.length;
  const maxN = id === "ayalon" ? 20 : id === "rothschild" ? 26 : 16;
  const step = Math.max(4, Math.floor(nSamp / (maxN + 3)));
  const hw = built.width / 2;
  const startSkip = Math.floor(nSamp * (id === "ayalon" ? 0.08 : 0.05));
  let n = 0;
  let lastH = 0;
  for (let i = startSkip; i < nSamp - 4 && n < maxN; i += step) {
    const s = built.samples[i];
    const side = n % 2 === 0 ? 1 : -1;
    const d = hw + (id === "ayalon" ? 26 + (n % 3) * 3.2 : id === "rothschild" ? 11.5 + (n % 3) * 1.4 : 16 + (n % 3) * 2);
    const x = s.x + s.rx * d * side;
    const z = s.z + s.rz * d * side;
    if (blocked?.(x, z)) continue;
    const yaw = Math.atan2(s.rx * side, s.rz * side);
    const seed = (i * 17 + def.seed + n * 31) | 0;
    let h: number;
    if (id === "ayalon") h = 28 + (seed % 54);
    else if (id === "rothschild") h = 8.4 + (seed % 9);
    else h = 12 + (seed % 22);
    if (Math.abs(h - lastH) < 2.4) h += 3.8;
    lastH = h;
    if (id === "ayalon") highwayTower(add, hit, mats, x, s.y, z, yaw, h, seed);
    else if (seed % 2 === 0) bauhaus(add, hit, mats, x, s.y, z, yaw, h, seed);
    else eclectic(add, hit, mats, x, s.y, z, yaw, Math.min(h, 14), seed);
    n++;
  }
}
