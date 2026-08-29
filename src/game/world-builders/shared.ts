import * as THREE from "three";
import { nearestIndex } from "../spline";
import { tlv } from "../tracks";
import type { TrackWorldBuilderInput } from "./types";

export function createTrackWorldBuilderContext(input: TrackWorldBuilderInput) {
  const {
    group,
    def,
    bag,
    shadows,
    isNight,
    glows,
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
  } = input;
  /* RSH-016:BEGIN-LEGACY-SHARED */
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
  const parkTower = (lat: number, lon: number, extra = 48) => {
    const hint = tlv(lat, lon);
    const nH = nearestIndex(built.samples, hint.x, hint.z, 0);
    const sH = built.samples[nH.index];
    return nH.dist < built.width / 2 + extra - 8
      ? { x: sH.x + sH.rx * (built.width / 2 + extra), z: sH.z + sH.rz * (built.width / 2 + extra) }
      : hint;
  };
  const placeCityGate = (s: number) => {
    const p = parkTower(32.0832, 34.8027, 52);
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
    const md = parkTower(32.0806, 34.7926, 48);
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
    const el = parkTower(32.0699, 34.7918, 46);
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
    const p = parkTower(32.0714, 34.7866, 44);
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
    const p = parkTower(32.0756, 34.7878, 40);
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
    const p = parkTower(32.0639, 34.7704, 36);
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
  /* RSH-016:END-LEGACY-SHARED */
  return {
    group,
    def,
    bag,
    shadows,
    isNight,
    emitList,
    colliders,
    movers,
    ramps,
    streets,
    built,
    add,
    glowAt,
    hit,
    hitRoad,
    placeTunnel,
    stone,
    white,
    glass,
    copper,
    gold,
    cream,
    terracotta,
    wood,
    darkArch,
    merlonWall,
    minaret,
    ottomanGate,
    placeDome,
    cyan,
    darkGlass,
    paleGlass,
    bandMat,
    azSqGlass,
    gateGlass,
    placeAzrieli,
    placeCityGate,
    placeToHa,
    placeMidtown,
    placeElectra,
    placeSarona,
    placeHakirya,
    placeShalomMeir,
    placeTlvTowers,
    placeNycSkyline,
    placeGothicTower,
    _dummy,
    barkTexture,
    curtainTexture,
    foliageTexture,
    herodianTexture,
    samp,
    segsOf,
  };
}

export type TrackWorldBuilderContext = ReturnType<typeof createTrackWorldBuilderContext>;
