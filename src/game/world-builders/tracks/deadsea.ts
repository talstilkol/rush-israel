import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { dsea } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildDeadsea(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    white,
    cream,
    terracotta,
    wood,
    cyan,
    darkGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
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
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
