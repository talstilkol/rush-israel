import * as THREE from "three";
import type { CarDef, Tune } from "./types";
import { cloneCarBody } from "./car-assets";
import { getBeam } from "./beam-assets";
import { getFlake } from "./flake-assets";

export type CarVisual = {
  group: THREE.Group;
  wheels: THREE.Object3D[];
  spins: THREE.Object3D[];
  brakeLights: THREE.Mesh[];
  headLights: THREE.Mesh[];
  headGlows: THREE.Mesh[];
  bodyMat: THREE.MeshPhysicalMaterial;
  spots: THREE.SpotLight[];
  headPool?: THREE.Mesh;
  steerWheel?: THREE.Object3D;
  baseColor: THREE.Color;
  bumper?: THREE.Mesh;
  dents: THREE.Mesh[];
  scratch?: THREE.Mesh;
  police?: { red: THREE.MeshPhysicalMaterial; blue: THREE.MeshPhysicalMaterial };
};

let FLAKE: THREE.Texture | null = null;

function flakeMap() {
  if (FLAKE) return FLAKE;
  const baked = getFlake();
  if (baked) {
    FLAKE = baked;
    return baked;
  }
  return null;
}

function bindPaintFlakes(mat: THREE.MeshPhysicalMaterial) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    prev?.call(mat, shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      outgoingLight += pow(max(dot(normal, normalize(vViewPosition)), 0.0), 72.0)
        * step(0.973, fract(sin(dot(normal.xy * 48.0, vec2(12.9898, 78.233))) * 43758.5453))
        * 0.4;
      #include <opaque_fragment>
      `,
    );
  };
  const prevKey = mat.customProgramCacheKey?.bind(mat);
  mat.customProgramCacheKey = () => `${prevKey?.() ?? ""}|paint-flake-v1`;
}

function paint(color: number): THREE.MeshPhysicalMaterial {
  const c = new THREE.Color(color);
  const flake = flakeMap();
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.06,
    roughness: 0.22,
    roughnessMap: flake ?? undefined,
    bumpMap: flake ?? undefined,
    bumpScale: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    clearcoatNormalMap: flake ?? undefined,
    clearcoatNormalScale: new THREE.Vector2(0.22, 0.22),
    envMapIntensity: 1.4,
    sheen: 0.18,
    sheenColor: c.clone().multiplyScalar(0.35),
    sheenRoughness: 0.35,
  });
  bindPaintFlakes(mat);
  return mat;
}

let BEAM: THREE.Texture | null = null;
function beamCookie() {
  if (BEAM) return BEAM;
  const baked = getBeam();
  if (baked) {
    baked.wrapS = THREE.ClampToEdgeWrapping;
    baked.wrapT = THREE.ClampToEdgeWrapping;
    baked.colorSpace = THREE.NoColorSpace;
    BEAM = baked;
    return baked;
  }
  return null;
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
    bevelSegments: 4,
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
  let bodyMat = paint(color);
  const accentMat = paint(accent);
  accentMat.roughness = 0.28;
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x121418, metalness: 0.42, roughness: 0.46, envMapIntensity: 0.65 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x8aa4b4,
    metalness: 0.06,
    roughness: 0.07,
    transparent: true,
    opacity: 0.38,
    envMapIntensity: 2.2,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
  const rubber = new THREE.MeshPhysicalMaterial({
    color: 0x141416,
    metalness: 0.04,
    roughness: 0.58,
    envMapIntensity: 0.42,
    clearcoat: 0.18,
    clearcoatRoughness: 0.48,
  });
  const rim = new THREE.MeshPhysicalMaterial({ color: 0xc8d0d6, metalness: 0.96, roughness: 0.12, clearcoat: 0.85, clearcoatRoughness: 0.08, envMapIntensity: 1.65 });
  const disc = new THREE.MeshPhysicalMaterial({ color: 0x6a6e74, metalness: 0.9, roughness: 0.22, envMapIntensity: 0.9 });
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
  const baked = cloneCarBody(kind, color, shadows);
  if (baked) {
    group.add(baked);
    bodyMat = baked.material as THREE.MeshPhysicalMaterial;
    bindPaintFlakes(bodyMat);
  } else {
    put(bodyGeo(kind, L.W * 0.9), bodyMat, 0, 0, 0);
  }

  const cabinY = L.wheelY + L.bodyH * 0.55 + L.cabinH * 0.42;

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

  const cabinFill = new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.92, metalness: 0.04 });
  put(new THREE.BoxGeometry(L.W * 0.62, L.cabinH * 0.48, L.cabinL * 0.52), cabinFill, 0, cabinY - 0.06, L.cabinZ);
  put(new THREE.BoxGeometry(L.W * 0.56, 0.07, 0.2), black, 0, cabinY - 0.1, L.cabinZ + L.cabinL * 0.26);
  put(new THREE.BoxGeometry(0.26, 0.2, 0.3), black, -0.17, cabinY - 0.2, L.cabinZ - 0.02);
  put(new THREE.BoxGeometry(0.26, 0.2, 0.3), black, 0.17, cabinY - 0.2, L.cabinZ - 0.02);
  const helm = new THREE.TorusGeometry(0.13, 0.016, 8, 18);
  put(helm, black, -0.17, cabinY - 0.04, L.cabinZ + L.cabinL * 0.2, 0.62, 0, 0);

  const glassW = L.W * 0.68;
  const pane = (w: number, h: number) => new THREE.BoxGeometry(w, h, 0.036);
  put(pane(glassW, L.cabinH * 0.72), glass, 0, cabinY + 0.02, L.cabinZ + L.cabinL * 0.42, -0.62);
  put(pane(glassW * 0.96, L.cabinH * 0.58), glass, 0, cabinY, L.cabinZ - L.cabinL * 0.42, 0.52);
  put(pane(L.cabinL * 0.62, L.cabinH * 0.48), glass, -L.W * 0.445, cabinY, L.cabinZ, 0, Math.PI / 2);
  put(pane(L.cabinL * 0.62, L.cabinH * 0.48), glass, L.W * 0.445, cabinY, L.cabinZ, 0, -Math.PI / 2);

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
    put(new THREE.BoxGeometry(L.W * 1.02, 0.08, 0.55), accentMat, 0, cabinY + 0.28, -half + 0.28);
    for (const sx of [-1, 1]) {
      put(new THREE.BoxGeometry(0.18, 0.22, 0.55), black, sx * L.W * 0.48, bodyY + 0.06, L.cabinZ + 0.15);
    }
  } else if (kind === "muscle") {
    put(new THREE.BoxGeometry(0.9, 0.1, 0.7), bodyMat, 0, bodyY + L.bodyH * 0.55, half - L.hoodL * 0.5);
    put(new THREE.BoxGeometry(L.W * 0.7, 0.05, 0.28), accentMat, 0, cabinY + 0.18, -half + 0.2);
    put(new THREE.BoxGeometry(L.W * 0.92, 0.08, 0.12), chrome, 0, L.wheelY * 0.62, half - 0.01);
  } else if (kind === "rally") {
    put(new THREE.BoxGeometry(1.2, 0.05, 1.4), dark, 0, cabinY + L.cabinH * 0.55, L.cabinZ);
    put(new THREE.BoxGeometry(1.1, 0.08, 0.08), emitHead, 0, bodyY + 0.16, half + 0.04);
    put(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), dark, -L.W * 0.38, cabinY, L.cabinZ + 0.4);
    for (const sx of [-0.28, 0, 0.28]) {
      const lamp = put(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 10), emitHead, sx, cabinY + L.cabinH * 0.62, L.cabinZ + 0.35);
      lamp.rotation.x = Math.PI / 2;
    }
    for (const sx of [-1, 1]) {
      put(new THREE.BoxGeometry(0.16, 0.22, 0.9), dark, sx * (L.W * 0.52), L.wheelY + 0.08, L.wb * 0.22);
    }
  } else if (kind === "hatch" && TAXI_COLORS.has(color)) {
    put(new THREE.BoxGeometry(0.4, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xf2eee8, emissive: 0xf2eee8, emissiveIntensity: 0.4 }), 0, cabinY + L.cabinH * 0.58, L.cabinZ + 0.1);
  } else if (kind === "hatch") {
    put(new THREE.BoxGeometry(L.W * 0.72, 0.05, 0.28), dark, 0, cabinY + L.cabinH * 0.48, L.cabinZ - L.cabinL * 0.48);
  } else {
    put(new THREE.BoxGeometry(1.5, 0.04, 0.26), accentMat, 0, cabinY + 0.08, -half + 0.22);
    put(new THREE.BoxGeometry(L.W * 0.02, 0.06, L.L * 0.62), chrome, L.W * 0.46, bodyY + 0.12, 0);
    put(new THREE.BoxGeometry(L.W * 0.02, 0.06, L.L * 0.62), chrome, -L.W * 0.46, bodyY + 0.12, 0);
  }



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
  const spokeN = kind === "super" ? 10 : kind === "rally" ? 5 : kind === "muscle" ? 5 : kind === "hatch" ? 6 : 7;
  const spokeGeo = new THREE.BoxGeometry(kind === "super" ? 0.022 : 0.028, L.wheelR * (kind === "super" ? 0.88 : 0.82), 0.035);
  const offsets: [number, number, number][] = [
    [-L.track / 2, L.wheelY, L.wb / 2],
    [L.track / 2, L.wheelY, L.wb / 2],
    [-L.track / 2, L.wheelY, -L.wb / 2],
    [L.track / 2, L.wheelY, -L.wb / 2],
  ];
  for (let wi = 0; wi < offsets.length; wi++) {
    const [x, y, z] = offsets[wi];
    put(well, dark, x + Math.sign(x) * 0.01, y, z);
    const arch = put(lip, bodyMat, x + Math.sign(x) * 0.04, y, z, 0, 0, Math.sign(x) > 0 ? 0 : Math.PI);
    arch.rotation.x = -Math.PI / 2;
    const pivot = new THREE.Group();
    const spin = new THREE.Group();
    const rearFat = kind === "muscle" && wi >= 2 ? 1.28 : kind === "super" && wi >= 2 ? 1.18 : 1;
    const tireM = new THREE.Mesh(tire, rubber);
    tireM.scale.x = rearFat;
    spin.add(tireM);
    spin.add(new THREE.Mesh(tread, rubber));
    spin.add(new THREE.Mesh(sidewall, rubber));
    spin.add(new THREE.Mesh(hubGeo, rim));
    spin.add(new THREE.Mesh(discGeo, disc));
    for (let k = 0; k < spokeN; k++) {
      const sp = new THREE.Mesh(spokeGeo, rim);
      sp.rotation.z = (k / spokeN) * Math.PI;
      spin.add(sp);
    }
    pivot.add(spin);
    pivot.position.set(x, y, z);
    pivot.userData.y0 = y;
    pivot.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = shadows;
    });
    group.add(pivot);
    wheels.push(pivot);
    spins.push(spin);
  }

  const spots: THREE.SpotLight[] = [];
  let headPool: THREE.Mesh | undefined;
  if (lit) {
    const cookie = beamCookie();
    for (const sx of [-hx, hx]) {
      const spot = new THREE.SpotLight(0xfff1c8, 0, 48, 0.5, 0.68, 1.05);
      spot.position.set(sx, headY, headZ);
      spot.target.position.set(sx * 0.12, -0.42, 14);
      if (cookie) spot.map = cookie;
      spot.castShadow = !!(shadows && cookie);
      if (spot.castShadow) {
        spot.shadow.mapSize.set(256, 256);
        spot.shadow.bias = -0.00025;
        spot.shadow.camera.near = 0.6;
        spot.shadow.camera.far = 42;
        spot.shadow.focus = 1;
      }
      spot.intensity = 0;
      group.add(spot, spot.target);
      spots.push(spot);
    }
    const poolMat = new THREE.MeshBasicMaterial({
      map: cookie || null,
      color: cookie ? 0xffffff : 0xffe4b0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    headPool = new THREE.Mesh(new THREE.CircleGeometry(5.4, 22), poolMat);
    headPool.rotation.x = -Math.PI / 2;
    headPool.position.set(0, 0.06, 8.6);
    headPool.scale.set(0.72, 1, 1.8);
    headPool.renderOrder = 2;
    group.add(headPool);
  }

  const leather = new THREE.MeshStandardMaterial({ color: 0x1a1614, roughness: 0.78, metalness: 0.04 });
  put(new THREE.BoxGeometry(L.W * 0.7, 0.06, L.cabinL * 0.62), leather, 0, L.wheelY + 0.36, L.cabinZ);
  put(new THREE.BoxGeometry(0.4, 0.22, 0.4), leather, 0.24, L.wheelY + 0.5, L.cabinZ - 0.04);
  put(new THREE.BoxGeometry(0.4, 0.42, 0.09), leather, 0.24, L.wheelY + 0.7, L.cabinZ - 0.22);
  put(new THREE.BoxGeometry(0.4, 0.22, 0.4), leather, -0.24, L.wheelY + 0.5, L.cabinZ - 0.04);
  const dash = put(new THREE.BoxGeometry(L.W * 0.76, 0.2, 0.4), dark, 0, cabinY - 0.16, L.cabinZ + L.cabinL * 0.3);
  dash.castShadow = false;
  put(new THREE.BoxGeometry(0.42, 0.07, 0.14), new THREE.MeshStandardMaterial({ color: 0x0c1014, emissive: 0x1a3a4a, emissiveIntensity: 0.55, roughness: 0.35 }), 0, cabinY - 0.02, L.cabinZ + L.cabinL * 0.36);
  put(new THREE.BoxGeometry(0.05, L.cabinH * 0.62, 0.05), dark, L.W * 0.34, cabinY, L.cabinZ + L.cabinL * 0.32);
  put(new THREE.BoxGeometry(0.05, L.cabinH * 0.62, 0.05), dark, -L.W * 0.34, cabinY, L.cabinZ + L.cabinL * 0.32);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.26, 8), dark);
  col.rotation.x = 1.05;
  col.position.set(0.26, cabinY - 0.1, L.cabinZ + L.cabinL * 0.2);
  group.add(col);
  const steerWheel = new THREE.Group();
  const rimW = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.026, 8, 18), dark);
  rimW.rotation.x = Math.PI / 2;
  steerWheel.add(rimW);
  steerWheel.add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.018, 0.035), dark));
  steerWheel.add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.2), dark));
  steerWheel.position.set(0.26, cabinY - 0.02, L.cabinZ + L.cabinL * 0.14);
  steerWheel.rotation.x = 0.55;
  group.add(steerWheel);

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

  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(L.W * 0.72, 16),
    new THREE.MeshBasicMaterial({ color: 0x0a0c10, transparent: true, opacity: 0, depthWrite: false }),
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.04;
  blob.visible = false;
  blob.renderOrder = -1;
  group.add(blob);

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
    headPool,
    steerWheel,
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
  const on = night;
  for (const s of vis.spots) {
    s.intensity = on ? 3.6 : 0;
    s.visible = on;
    if (!s.map) {
      const c = beamCookie();
      if (c) s.map = c;
    }
  }
  vis.bodyMat.envMapIntensity = night ? 1.15 : 1.4;
  for (const h of vis.headLights) {
    (h.material as THREE.MeshPhysicalMaterial).emissiveIntensity = night ? 5.2 : 0.85;
  }
  for (const g of vis.headGlows) {
    (g.material as THREE.MeshBasicMaterial).opacity = night ? 0.78 : 0.16;
    g.visible = true;
  }
  if (vis.headPool) {
    const m = vis.headPool.material as THREE.MeshBasicMaterial;
    if (!m.map) {
      const c = beamCookie();
      if (c) {
        m.map = c;
        m.color.setHex(0xffffff);
      }
    }
    m.opacity = night ? 0.55 : 0;
    vis.headPool.visible = night;
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
  vis.group.rotation.set(pitch * 0.55, yaw + Math.PI, bank);

  const spin = (speed / 0.33) * dt;
  for (const s of vis.spins) s.rotateX(spin);
  if (vis.wheels[0]) vis.wheels[0].rotation.y = steer * 0.38;
  if (vis.wheels[1]) vis.wheels[1].rotation.y = steer * 0.38;
  const travel = 0.14;
  const ys = vis.wheels.map((w) => (w.userData.y0 as number) ?? w.position.y);
  if (vis.wheels[0]) vis.wheels[0].position.y = ys[0] + (-pitch + bank) * travel;
  if (vis.wheels[1]) vis.wheels[1].position.y = ys[1] + (-pitch - bank) * travel;
  if (vis.wheels[2]) vis.wheels[2].position.y = ys[2] + (pitch + bank) * travel;
  if (vis.wheels[3]) vis.wheels[3].position.y = ys[3] + (pitch - bank) * travel;
  if (vis.steerWheel) vis.steerWheel.rotation.z = -steer * 0.9;

  const braking = brake > 0.15 || speed < -1;
  for (const m of vis.brakeLights) {
    (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity = braking ? 4.6 : 0.45;
  }
}
