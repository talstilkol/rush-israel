import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { jer } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildScopus(context: TrackWorldBuilderContext): void {
  const {
    def,
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    cream,
    merlonWall,
    placeDome,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const peakY = def.elevation(0.94);
    const start = jer(31.7866, 35.2344);
    const uniP = jer(31.7938, 35.2452);
    const sc = jer(31.7912, 35.2454);
    {
      const nU = nearestIndex(built.samples, uniP.x, uniP.z, 0);
      const sU = built.samples[nU.index];
      uniP.x = sU.x + sU.rx * (built.width / 2 + 24);
      uniP.z = sU.z + sU.rz * (built.width / 2 + 24);
      const nS = nearestIndex(built.samples, sc.x, sc.z, 0);
      const sS = built.samples[nS.index];
      sc.x = sS.x + sS.rx * (built.width / 2 + 22);
      sc.z = sS.z + sS.rz * (built.width / 2 + 22);
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
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + 0.4;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(72 + i % 3 * 18, 62 + i % 4 * 22, 5), hillM);
      hill.position.set(sc.x + Math.cos(a) * 920, 22, sc.z + Math.sin(a) * 780);
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
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
