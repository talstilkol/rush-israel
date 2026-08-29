import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { jer } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildJerusalem(context: TrackWorldBuilderContext): void {
  const {
    def,
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
    terracotta,
    merlonWall,
    minaret,
    ottomanGate,
    placeDome,
    herodianTexture,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const offJer = (p: { x: number; z: number }, extra = 24) => {
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      if (n.dist < built.width / 2 + extra) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * (built.width / 2 + extra);
        p.z = s.z + s.rz * (built.width / 2 + extra);
      }
      return p;
    };
    const jg = offJer(jer(31.7764, 35.2276), 28);
    const td = offJer(jer(31.7762, 35.2284), 36);
    const dm = offJer(jer(31.7788, 35.2364), 42);
    const kd = offJer(jer(31.7745, 35.2225), 26);
    const my = offJer(jer(31.7848, 35.2114), 22);
    const kt = offJer(jer(31.7784, 35.2346), 38);
    const mill = offJer(jer(31.7715, 35.2247), 26);
    const olives = offJer(jer(31.7848, 35.2462), 32);
    merlonWall(jg.x + 38, jg.z + 62, 54, 0.2, 13);
    merlonWall(jg.x + 62, jg.z + 42, 48, 1.1, 12);
    const gi = Math.max(0, Math.min(built.samples.length - 1, Math.floor(built.samples.length * 0.46)));
    const gs = built.samples[gi];
    const gOff = built.width / 2 + 44;
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
      const h = 68 + i % 6 * 28;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(62 + i % 4 * 16, h, 6), hillM);
      hill.position.set(olives.x + Math.cos(a) * r, def.elevation(1) * 0.18 + h * 0.22, olives.z + Math.sin(a) * r);
      add(hill);
    }
    glowAt(jg.x + 18, 16, jg.z + 40, 16769184, 28, 24);
    glowAt(dm.x, 18, dm.z, 16765040, 32, 26);
    hit(jg.x + 18, jg.z + 40, 6);
    hit(td.x + 28, td.z + 36, 10);
    hit(kx, kz, 10, 22, 6);
    hit(kd.x - 28, kd.z - 22, 8);
    hit(mill.x, mill.z, 5);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
