import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tlv } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildNamal(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    placeTunnel,
    white,
    glass,
    cream,
    terracotta,
    wood,
    darkGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
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
          p.x = s.x + s.rx * (built.width / 2 + 36);
          p.z = s.z + s.rz * (built.width / 2 + 36);
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
    placeTunnel(rs.x, rs.z, rdYaw, 86, built.width / 2 + 0.6, 8.8, rs.y);
    const rx = Math.cos(rdYaw);
    const rz = -Math.sin(rdYaw);
    const fx = Math.sin(rdYaw);
    const fz = Math.cos(rdYaw);
    const plantX = rs.x + rx * (built.width / 2 + 48);
    const plantZ = rs.z + rz * (built.width / 2 + 48);
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
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
