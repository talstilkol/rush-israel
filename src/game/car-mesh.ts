import * as THREE from "three";
import type { CarDef, Tune } from "./types";
import { hash01 } from "./math";

export type CarVisual = {
  group: THREE.Group;
  wheels: THREE.Object3D[];
  spins: THREE.Object3D[];
  brakeLights: THREE.Mesh[];
  headLights: THREE.Mesh[];
  headGlows: THREE.Mesh[];
  bodyMat: THREE.MeshPhysicalMaterial;
  spots: THREE.SpotLight[];
  baseColor: THREE.Color;
  bumper?: THREE.Mesh;
  dents: THREE.Mesh[];
  scratch?: THREE.Mesh;
  police?: { red: THREE.MeshPhysicalMaterial; blue: THREE.MeshPhysicalMaterial };
};

let FLAKE: THREE.CanvasTexture | null = null;

function flakeMap() {
  if (FLAKE) return FLAKE;
  if (typeof document === "undefined") return null;
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#6a6a6a";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2800; i++) {
    const x = hash01(i, 1) * size;
    const y = hash01(i, 2) * size;
    const s = hash01(i, 3) * 1.4 + 0.3;
    ctx.fillStyle = hash01(i, 4) > 0.55 ? "#e8e4dc" : hash01(i, 5) > 0.5 ? "#c8d4e8" : "#d4c4a0";
    ctx.fillRect(x, y, s, s);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 4);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.NoColorSpace;
  FLAKE = tex;
  return tex;
}

function hex(n: number) {
  return `#${n.toString(16).padStart(6, "0")}`;
}

function applyLivery(mat: THREE.MeshPhysicalMaterial, color: number, id: number) {
  if (typeof document === "undefined" || id <= 0) return;
  const w = 512;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return;
  g.fillStyle = hex(color);
  g.fillRect(0, 0, w, h);
  if (id === 1) {
    g.fillStyle = "#f4f0ea";
    g.fillRect(228, 0, 22, h);
    g.fillRect(262, 0, 22, h);
    g.fillStyle = "#121418";
    g.fillRect(250, 0, 12, h);
  } else if (id === 2) {
    g.fillStyle = "#c45c3a";
    g.beginPath();
    g.moveTo(0, 36);
    g.lineTo(w, 150);
    g.lineTo(w, 198);
    g.lineTo(0, 84);
    g.fill();
    g.fillStyle = "#2a8f8a";
    g.fillRect(0, 210, w, 16);
  } else if (id === 3) {
    const s = 28;
    for (let y = 0; y < h; y += s) {
      for (let x = 0; x < w; x += s) {
        g.fillStyle = ((x + y) / s) % 2 === 0 ? "#111214" : "#f0c400";
        g.fillRect(x, y, s, s);
      }
    }
    g.fillStyle = hex(color);
    g.fillRect(160, 0, 192, h);
  } else if (id === 4) {
    g.fillStyle = "#e24a12";
    g.beginPath();
    g.moveTo(0, h);
    g.lineTo(80, 40);
    g.lineTo(140, h);
    g.lineTo(210, 20);
    g.lineTo(280, h);
    g.lineTo(340, 70);
    g.lineTo(400, h);
    g.closePath();
    g.fill();
  } else if (id === 5) {
    g.strokeStyle = "#d4a017";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(0, 48);
    g.lineTo(w, 48);
    g.stroke();
  } else if (id === 6) {
    g.fillStyle = "#121418";
    g.fillRect(0, 0, w / 2, h);
    g.fillStyle = "#c45c3a";
    g.fillRect(w / 2, 0, w / 2, h);
    g.fillStyle = "#f2eee8";
    g.fillRect(w / 2 - 8, 0, 16, h);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  mat.map = tex;
  mat.color.set(0xffffff);
  mat.needsUpdate = true;
}

function paint(color: number): THREE.MeshPhysicalMaterial {
  const c = new THREE.Color(color);
  const flake = flakeMap();
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.82,
    roughness: 0.12,
    roughnessMap: flake ?? undefined,
    bumpMap: flake ?? undefined,
    bumpScale: 0.028,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    clearcoatNormalMap: flake ?? undefined,
    clearcoatNormalScale: new THREE.Vector2(0.18, 0.18),
    envMapIntensity: 2.25,
    sheen: 0.28,
    sheenColor: c.clone().multiplyScalar(0.45),
    sheenRoughness: 0.28,
    specularIntensity: 1,
    iridescence: 0.12,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [80, 320],
  });
}

let BEAM: THREE.CanvasTexture | null = null;
function beamCookie() {
  if (BEAM) return BEAM;
  if (typeof document === "undefined") return null;
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size * 0.5, size * 0.62, 6, size * 0.5, size * 0.5, size * 0.48);
  g.addColorStop(0, "rgba(255,248,220,1)");
  g.addColorStop(0.22, "rgba(255,236,190,0.7)");
  g.addColorStop(0.55, "rgba(255,210,140,0.18)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  BEAM = tex;
  return tex;
}

type Layout = {
  L: number;
  W: number;
  wb: number;
  track: number;
  wheelR: number;
  wheelY: number;
  cabinZ: number;
  cabinL: number;
  cabinH: number;
  hoodL: number;
  trunkL: number;
  bodyH: number;
};

function carShape(kind: CarDef["body"]): THREE.Shape {
  const s = new THREE.Shape();
  const p: [number, number][] =
    kind === "hatch"
      ? [
          [-2.02, 0.16],
          [-2.05, 0.5],
          [-1.78, 0.74],
          [-1.48, 1.24],
          [-0.18, 1.34],
          [0.52, 1.3],
          [0.92, 0.8],
          [1.52, 0.64],
          [2.0, 0.5],
          [2.08, 0.32],
          [2.02, 0.15],
          [1.62, 0.14],
          [-1.62, 0.14],
        ]
      : kind === "muscle"
        ? [
            [-2.4, 0.15],
            [-2.42, 0.46],
            [-2.08, 0.58],
            [-1.52, 0.6],
            [-1.22, 1.06],
            [-0.12, 1.12],
            [0.52, 1.08],
            [1.18, 0.6],
            [1.98, 0.5],
            [2.4, 0.46],
            [2.44, 0.26],
            [2.36, 0.14],
            [1.9, 0.13],
            [-1.9, 0.13],
          ]
        : kind === "rally"
          ? [
              [-2.14, 0.18],
              [-2.16, 0.58],
              [-1.82, 0.8],
              [-1.52, 1.3],
              [-0.18, 1.4],
              [0.48, 1.36],
              [0.9, 0.84],
              [1.42, 0.7],
              [2.08, 0.58],
              [2.16, 0.34],
              [2.08, 0.16],
              [1.68, 0.16],
              [-1.68, 0.16],
            ]
          : kind === "super"
            ? [
                [-2.24, 0.13],
                [-2.26, 0.38],
                [-1.82, 0.46],
                [-1.32, 0.9],
                [-0.18, 0.98],
                [0.58, 0.94],
                [1.28, 0.5],
                [1.98, 0.4],
                [2.26, 0.36],
                [2.3, 0.2],
                [2.2, 0.12],
                [1.78, 0.12],
                [-1.78, 0.12],
              ]
            : [
                [-2.24, 0.16],
                [-2.26, 0.48],
                [-1.92, 0.62],
                [-1.32, 0.64],
                [-1.08, 1.2],
                [-0.12, 1.3],
                [0.62, 1.26],
                [1.04, 0.72],
                [1.62, 0.6],
                [2.18, 0.5],
                [2.28, 0.32],
                [2.22, 0.15],
                [1.82, 0.14],
                [-1.82, 0.14],
              ];
  s.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) s.lineTo(p[i][0], p[i][1]);
  s.closePath();
  return s;
}

function bodyGeo(kind: CarDef["body"], width: number) {
  const g = new THREE.ExtrudeGeometry(carShape(kind), {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.07,
    bevelSegments: 3,
    steps: 1,
  });
  g.translate(0, 0, -width / 2);
  g.rotateY(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}

function layout(kind: CarDef["body"]): Layout {
  if (kind === "hatch")
    return { L: 4.08, W: 1.76, wb: 2.52, track: 1.5, wheelR: 0.32, wheelY: 0.32, cabinZ: -0.18, cabinL: 1.78, cabinH: 0.62, hoodL: 1.08, trunkL: 0.38, bodyH: 0.58 };
  if (kind === "muscle")
    return { L: 4.82, W: 1.9, wb: 2.78, track: 1.62, wheelR: 0.34, wheelY: 0.34, cabinZ: -0.48, cabinL: 1.42, cabinH: 0.46, hoodL: 1.58, trunkL: 0.9, bodyH: 0.52 };
  if (kind === "rally")
    return { L: 4.32, W: 1.84, wb: 2.56, track: 1.54, wheelR: 0.36, wheelY: 0.38, cabinZ: -0.1, cabinL: 1.68, cabinH: 0.64, hoodL: 1.12, trunkL: 0.52, bodyH: 0.62 };
  if (kind === "super")
    return { L: 4.52, W: 1.96, wb: 2.62, track: 1.68, wheelR: 0.325, wheelY: 0.3, cabinZ: -0.28, cabinL: 1.36, cabinH: 0.36, hoodL: 1.48, trunkL: 0.7, bodyH: 0.42 };
  return { L: 4.5, W: 1.82, wb: 2.68, track: 1.54, wheelR: 0.33, wheelY: 0.33, cabinZ: -0.16, cabinL: 1.62, cabinH: 0.54, hoodL: 1.22, trunkL: 0.78, bodyH: 0.56 };
}

const TAXI_COLORS = new Set([0xf5c400, 0xf0c400]);

export function createCarVisual(
  color: number,
  accent: number,
  shadows: boolean,
  lit = false,
  kind: CarDef["body"] = "gt",
  police = false,
  tune?: Tune,
): CarVisual {
  const group = new THREE.Group();
  const L = layout(kind);
  const bodyMat = paint(color);
  const accentMat = paint(accent);
  accentMat.roughness = 0.28;
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x121418, metalness: 0.42, roughness: 0.46, envMapIntensity: 0.65 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x152028,
    metalness: 0.15,
    roughness: 0.05,
    transparent: true,
    opacity: 0.58,
    envMapIntensity: 1.8,
  });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x121214, metalness: 0.06, roughness: 0.82 });
  const rim = new THREE.MeshPhysicalMaterial({ color: 0xc8d0d6, metalness: 0.94, roughness: 0.14, clearcoat: 0.6, envMapIntensity: 1.4 });
  const disc = new THREE.MeshStandardMaterial({ color: 0x6a6e74, metalness: 0.86, roughness: 0.26 });
  const emitBrake = new THREE.MeshPhysicalMaterial({ color: 0x3a0608, emissive: 0xff1a12, emissiveIntensity: 0.5, roughness: 0.3 });
  const emitHead = new THREE.MeshPhysicalMaterial({ color: 0xfff6e0, emissive: 0xfff2c8, emissiveIntensity: 3.4, roughness: 0.12 });
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xd8dee4, metalness: 1, roughness: 0.08, envMapIntensity: 2 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.55, metalness: 0.25 });
  const plate = new THREE.MeshStandardMaterial({ color: 0xf2eee8, roughness: 0.45, metalness: 0.08 });

  const put = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    m.castShadow = shadows;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  const half = L.L / 2;
  const bodyY = L.wheelY + L.bodyH * 0.22;
  put(bodyGeo(kind, L.W * 0.9), bodyMat, 0, 0, 0);

  const cabinY = L.wheelY + L.bodyH * 0.55 + L.cabinH * 0.42;
  put(new THREE.BoxGeometry(L.W * 0.58, L.cabinH * 0.28, L.cabinL * 0.48), dark, 0, cabinY - 0.12, L.cabinZ);

  put(new THREE.BoxGeometry(L.W * 0.98, 0.16, 0.2), dark, 0, L.wheelY * 0.5, half - 0.01);
  const bumper = put(new THREE.BoxGeometry(L.W * 0.94, 0.18, 0.22), dark, 0, L.wheelY * 0.55, -half + 0.03);
  put(new THREE.BoxGeometry(L.W * 0.38, 0.12, 0.03), plate, 0, L.wheelY * 0.5, -half - 0.05);
  put(new THREE.BoxGeometry(L.W * 0.72, 0.14, 0.04), black, 0, bodyY + 0.04, half - 0.01);

  const hx = L.W * 0.3;
  const headY = bodyY + 0.05;
  const headZ = half + 0.02;
  const lampGeo = new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.7);
  const houseL = put(new THREE.BoxGeometry(0.38, 0.14, 0.08), chrome, -hx, headY, headZ);
  const houseR = put(new THREE.BoxGeometry(0.38, 0.14, 0.08), chrome, hx, headY, headZ);
  const headL = put(lampGeo, emitHead, -hx, headY, headZ + 0.03, Math.PI / 2, 0, 0);
  const headR = put(lampGeo.clone(), emitHead, hx, headY, headZ + 0.03, Math.PI / 2, 0, 0);

  const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff4d0, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
  const gL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), glowMat);
  gL.position.set(-hx, headY, headZ + 0.02);
  const gR = gL.clone();
  gR.position.x = hx;
  group.add(gL, gR);

  const tailY = bodyY + 0.02;
  const tailZ = -half - 0.03;
  const brakeL = put(new THREE.BoxGeometry(0.46, 0.1, 0.05), emitBrake, -hx, tailY, tailZ);
  const brakeR = put(new THREE.BoxGeometry(0.46, 0.1, 0.05), emitBrake, hx, tailY, tailZ);
  const brakeC = put(new THREE.BoxGeometry(0.7, 0.035, 0.03), emitBrake, 0, cabinY + L.cabinH * 0.08, L.cabinZ - L.cabinL * 0.42);

  const glassW = L.W * 0.68;
  put(new THREE.PlaneGeometry(glassW, L.cabinH * 0.72), glass, 0, cabinY + 0.02, L.cabinZ + L.cabinL * 0.42, -0.62);
  put(new THREE.PlaneGeometry(glassW * 0.96, L.cabinH * 0.58), glass, 0, cabinY, L.cabinZ - L.cabinL * 0.42, 0.52);
  put(new THREE.PlaneGeometry(L.cabinL * 0.62, L.cabinH * 0.48), glass, -L.W * 0.445, cabinY, L.cabinZ, 0, Math.PI / 2);
  put(new THREE.PlaneGeometry(L.cabinL * 0.62, L.cabinH * 0.48), glass, L.W * 0.445, cabinY, L.cabinZ, 0, -Math.PI / 2);

  put(new THREE.BoxGeometry(0.18, 0.1, 0.14), black, -L.W * 0.48, cabinY + 0.01, L.cabinZ + L.cabinL * 0.18);
  put(new THREE.BoxGeometry(0.18, 0.1, 0.14), black, L.W * 0.48, cabinY + 0.01, L.cabinZ + L.cabinL * 0.18);
  put(new THREE.BoxGeometry(0.07, 0.07, 0.1), glass, -L.W * 0.54, cabinY + 0.01, L.cabinZ + L.cabinL * 0.18);
  put(new THREE.BoxGeometry(0.07, 0.07, 0.1), glass, L.W * 0.54, cabinY + 0.01, L.cabinZ + L.cabinL * 0.18);

  put(new THREE.BoxGeometry(L.W * 0.88, 0.08, L.L * 0.72), black, 0, L.wheelY * 0.22, 0);
  put(new THREE.BoxGeometry(0.36, 0.1, 0.02), chrome, 0, L.wheelY * 0.78, -half - 0.04);
  const ex = new THREE.CylinderGeometry(0.042, 0.048, 0.16, 10);
  ex.rotateX(Math.PI / 2);
  put(ex, chrome, -0.3, L.wheelY * 0.48, -half - 0.07);
  if (kind === "muscle" || kind === "super") put(ex.clone(), chrome, 0.3, L.wheelY * 0.48, -half - 0.07);

  if (kind === "super") {
    put(new THREE.BoxGeometry(L.W * 0.95, 0.05, 0.42), accentMat, 0, cabinY + 0.22, -half + 0.12);
    put(new THREE.BoxGeometry(L.W * 0.98, 0.04, 0.38), accentMat, 0, L.wheelY * 0.42, half - 0.02);
  } else if (kind === "muscle") {
    put(new THREE.BoxGeometry(0.9, 0.1, 0.7), bodyMat, 0, bodyY + L.bodyH * 0.55, half - L.hoodL * 0.5);
    put(new THREE.BoxGeometry(L.W * 0.7, 0.05, 0.28), accentMat, 0, cabinY + 0.18, -half + 0.2);
  } else if (kind === "rally") {
    put(new THREE.BoxGeometry(1.2, 0.05, 1.4), dark, 0, cabinY + L.cabinH * 0.55, L.cabinZ);
    put(new THREE.BoxGeometry(1.1, 0.08, 0.08), emitHead, 0, bodyY + 0.16, half + 0.04);
    put(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), dark, -L.W * 0.38, cabinY, L.cabinZ + 0.4);
  } else if (kind === "hatch" && TAXI_COLORS.has(color)) {
    put(new THREE.BoxGeometry(0.4, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xf2eee8, emissive: 0xf2eee8, emissiveIntensity: 0.4 }), 0, cabinY + L.cabinH * 0.58, L.cabinZ + 0.1);
  } else if (kind !== "hatch") {
    put(new THREE.BoxGeometry(1.5, 0.04, 0.26), accentMat, 0, cabinY + 0.08, -half + 0.22);
  }

  if (tune && tune.livery > 0) applyLivery(bodyMat, color, tune.livery);

  const well = new THREE.CylinderGeometry(L.wheelR + 0.04, L.wheelR + 0.04, 0.12, 18);
  well.rotateZ(Math.PI / 2);
  const lip = new THREE.TorusGeometry(L.wheelR + 0.07, 0.035, 6, 16, Math.PI);
  lip.rotateZ(Math.PI / 2);
  const wheels: THREE.Object3D[] = [];
  const spins: THREE.Object3D[] = [];
  const tire = new THREE.CylinderGeometry(L.wheelR, L.wheelR, 0.26, 32);
  tire.rotateZ(Math.PI / 2);
  const tread = new THREE.TorusGeometry(L.wheelR * 0.92, 0.055, 8, 24);
  const sidewall = new THREE.TorusGeometry(L.wheelR * 0.78, 0.04, 8, 22);
  const hubGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.28, 18);
  hubGeo.rotateZ(Math.PI / 2);
  const discGeo = new THREE.CylinderGeometry(L.wheelR * 0.7, L.wheelR * 0.7, 0.035, 22);
  discGeo.rotateZ(Math.PI / 2);
  const spokeGeo = new THREE.BoxGeometry(0.028, L.wheelR * 0.82, 0.035);
  const offsets: [number, number, number][] = [
    [-L.track / 2, L.wheelY, L.wb / 2],
    [L.track / 2, L.wheelY, L.wb / 2],
    [-L.track / 2, L.wheelY, -L.wb / 2],
    [L.track / 2, L.wheelY, -L.wb / 2],
  ];
  for (const [x, y, z] of offsets) {
    put(well, dark, x + Math.sign(x) * 0.01, y, z);
    const arch = put(lip, bodyMat, x + Math.sign(x) * 0.04, y, z, 0, 0, Math.sign(x) > 0 ? 0 : Math.PI);
    arch.rotation.x = -Math.PI / 2;
    const pivot = new THREE.Group();
    const spin = new THREE.Group();
    spin.add(new THREE.Mesh(tire, rubber));
    spin.add(new THREE.Mesh(tread, rubber));
    spin.add(new THREE.Mesh(sidewall, rubber));
    spin.add(new THREE.Mesh(hubGeo, rim));
    spin.add(new THREE.Mesh(discGeo, disc));
    for (let k = 0; k < 7; k++) {
      const sp = new THREE.Mesh(spokeGeo, rim);
      sp.rotation.z = (k / 7) * Math.PI;
      spin.add(sp);
    }
    pivot.add(spin);
    pivot.position.set(x, y, z);
    pivot.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = shadows;
    });
    group.add(pivot);
    wheels.push(pivot);
    spins.push(spin);
  }

  const spots: THREE.SpotLight[] = [];
  if (lit) {
    const cookie = beamCookie();
    for (const sx of [-hx, hx]) {
      const spot = new THREE.SpotLight(0xfff1c8, 28, 46, 0.46, 0.55, 1.35);
      spot.position.set(sx, headY, headZ);
      spot.target.position.set(sx * 0.08, -1.15, 22);
      if (cookie) spot.map = cookie;
      spot.castShadow = false;
      group.add(spot, spot.target);
      spots.push(spot);
    }
    const dash = put(new THREE.BoxGeometry(L.W * 0.7, 0.2, 0.5), dark, 0, cabinY - 0.12, L.cabinZ + L.cabinL * 0.28);
    dash.castShadow = false;
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 8, 16), dark);
    wheel.rotation.x = 0.55;
    wheel.position.set(0.28, cabinY - 0.02, L.cabinZ + L.cabinL * 0.18);
    group.add(wheel);
  }

  let policeMats: CarVisual["police"];
  if (police) {
    const redMat = new THREE.MeshPhysicalMaterial({ color: 0x8a1018, emissive: 0xff2440, emissiveIntensity: 3.2, roughness: 0.3 });
    const blueMat = new THREE.MeshPhysicalMaterial({ color: 0x102848, emissive: 0x3a8cff, emissiveIntensity: 3.2, roughness: 0.3 });
    put(new THREE.BoxGeometry(1.15, 0.1, 0.26), dark, 0, cabinY + L.cabinH * 0.62, L.cabinZ);
    put(new THREE.BoxGeometry(0.48, 0.12, 0.28), redMat, -0.3, cabinY + L.cabinH * 0.7, L.cabinZ);
    put(new THREE.BoxGeometry(0.48, 0.12, 0.28), blueMat, 0.3, cabinY + L.cabinH * 0.7, L.cabinZ);
    put(new THREE.BoxGeometry(L.W * 0.98, 0.1, L.L * 0.55), accentMat, 0, bodyY + 0.08, 0);
    policeMats = { red: redMat, blue: blueMat };
  }

  const dents: THREE.Mesh[] = [];
  const dentGeo = new THREE.SphereGeometry(0.08, 8, 6);
  for (const [x, y, z] of [
    [L.W * 0.32, bodyY, L.L * 0.22],
    [-L.W * 0.34, bodyY + 0.04, 0.1],
    [L.W * 0.28, bodyY, -L.L * 0.25],
  ] as [number, number, number][]) {
    const d = new THREE.Mesh(dentGeo, dark);
    d.position.set(x, y, z);
    d.scale.set(1.4, 0.45, 1.1);
    d.visible = false;
    group.add(d);
    dents.push(d);
  }
  const scratch = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x2a241c, transparent: true, opacity: 0, depthWrite: false }),
  );
  scratch.rotation.y = Math.PI / 2;
  scratch.position.set(L.W * 0.48, bodyY, 0.15);
  group.add(scratch);

  void houseL;
  void houseR;

  return {
    group,
    wheels,
    spins,
    brakeLights: [brakeL, brakeR, brakeC],
    headLights: [headL, headR],
    headGlows: [gL, gR],
    bodyMat,
    spots,
    baseColor: new THREE.Color(color),
    bumper,
    dents,
    scratch,
    police: policeMats,
  };
}

export function applyDamage(vis: CarVisual, dmg: number, dirt = 0) {
  const t = Math.min(1, Math.max(0, dmg));
  const d = Math.min(1, Math.max(0, dirt));
  vis.bodyMat.color.copy(vis.baseColor).lerp(new THREE.Color(0x3a342c), t * 0.72).lerp(new THREE.Color(0x4a4036), d * 0.55);
  vis.bodyMat.roughness = 0.16 + t * 0.52 + d * 0.38;
  vis.bodyMat.clearcoat = Math.max(0.08, 1 - t * 0.75 - d * 0.55);
  vis.bodyMat.clearcoatRoughness = 0.08 + t * 0.4 + d * 0.28;
  if (vis.bumper) {
    vis.bumper.rotation.x = t * 0.14;
  }
  vis.dents.forEach((dent, i) => {
    dent.visible = t > 0.16 + i * 0.18;
  });
  if (vis.scratch) {
    (vis.scratch.material as THREE.MeshBasicMaterial).opacity = t * 0.62;
  }
}

export function setCarLights(vis: CarVisual, night: boolean) {
  for (const s of vis.spots) s.intensity = night ? 240 : 36;
  vis.bodyMat.envMapIntensity = night ? 2.35 : 2.15;
  for (const h of vis.headLights) {
    (h.material as THREE.MeshPhysicalMaterial).emissiveIntensity = night ? 5.2 : 0.85;
  }
  for (const g of vis.headGlows) {
    (g.material as THREE.MeshBasicMaterial).opacity = night ? 0.78 : 0.16;
    g.visible = true;
  }
}

export function pulsePolice(vis: CarVisual, t: number) {
  if (!vis.police) return;
  const a = (Math.sin(t * 14) + 1) * 0.5;
  vis.police.red.emissiveIntensity = 0.5 + a * 7.5;
  vis.police.blue.emissiveIntensity = 0.5 + (1 - a) * 7.5;
}

export function updateCarVisual(
  vis: CarVisual,
  yaw: number,
  speed: number,
  steer: number,
  brake: number,
  dt: number,
  x: number,
  y: number,
  z: number,
  bank: number,
  pitch = 0,
  surface: "asphalt" | "curb" | "sand" = "asphalt",
) {
  vis.group.userData.t = ((vis.group.userData.t as number) || 0) + dt * Math.abs(speed);
  const hop =
    surface === "curb" ? Math.sin((vis.group.userData.t as number) * 3.4) * 0.032 : surface === "sand" ? Math.sin((vis.group.userData.t as number) * 1.8) * 0.022 : 0;
  vis.group.position.set(x, y + 0.02 + hop, z);
  vis.group.rotation.order = "YXZ";
  vis.group.rotation.set(pitch * 0.16, yaw + Math.PI, bank);

  const spin = (speed / 0.33) * dt;
  for (const s of vis.spins) s.rotateX(spin);
  if (vis.wheels[0]) vis.wheels[0].rotation.y = steer * 0.38;
  if (vis.wheels[1]) vis.wheels[1].rotation.y = steer * 0.38;

  const braking = brake > 0.15 || speed < -1;
  for (const m of vis.brakeLights) {
    (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity = braking ? 4.6 : 0.45;
  }
}
