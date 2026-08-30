import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tlv } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHayarkon(context: TrackWorldBuilderContext): void {
  const {
    group,
    bag,
    built,
    add,
    glowAt,
    hit,
    placeTunnel,
    stone,
    white,
    cream,
    terracotta,
    wood,
    cyan,
    darkGlass,
    paleGlass,
    bandMat,
    _dummy,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const hi = tlv(32.0893, 34.7694);
    {
      const n = nearestIndex(built.samples, hi.x, hi.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        hi.x = s.x + s.rx * (built.width / 2 + 30);
        hi.z = s.z + s.rz * (built.width / 2 + 30);
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
    {
      const n = nearestIndex(built.samples, mar.x, mar.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        mar.x = s.x + s.rx * (built.width / 2 + 22);
        mar.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
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
        rd.x = s.x + s.rx * (built.width / 2 + 34);
        rd.z = s.z + s.rz * (built.width / 2 + 34);
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
    {
      const n = nearestIndex(built.samples, yam.x, yam.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        yam.x = s.x + s.rx * (built.width / 2 + 22);
        yam.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const yamT = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.2, 46, 12), white);
    yamT.position.set(yam.x, 23, yam.z);
    add(yamT);
    const yamCap = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 3.8, 4.2, 12), cream);
    yamCap.position.set(yam.x, 48, yam.z);
    add(yamCap);
    const dav = tlv(32.0638, 34.7648);
    {
      const n = nearestIndex(built.samples, dav.x, dav.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        dav.x = s.x + s.rx * (built.width / 2 + 24);
        dav.z = s.z + s.rz * (built.width / 2 + 24);
      }
    }
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
    {
      const n = nearestIndex(built.samples, sher.x, sher.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        sher.x = s.x + s.rx * (built.width / 2 + 22);
        sher.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const sheraton = new THREE.Mesh(new THREE.BoxGeometry(16, 22, 10), peach);
    sheraton.position.set(sher.x, 11, sher.z);
    add(sheraton);
    for (let y = 4; y < 20; y += 2.6) {
      const shade = new THREE.Mesh(new THREE.BoxGeometry(17.2, 0.14, 11), cream);
      shade.position.set(sher.x, y, sher.z);
      add(shade);
    }
    const dol = tlv(32.0648, 34.7618);
    {
      const n = nearestIndex(built.samples, dol.x, dol.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        dol.x = s.x + s.rx * (built.width / 2 + 26);
        dol.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const dolRing = new THREE.Mesh(new THREE.TorusGeometry(12, 1.4, 8, 24), stone);
    dolRing.rotation.x = Math.PI / 2;
    dolRing.position.set(dol.x, 0.8, dol.z);
    add(dolRing);
    const dolInner = new THREE.Mesh(new THREE.CylinderGeometry(8, 9.5, 2.4, 16, 1, true), stone);
    dolInner.position.set(dol.x, 1.2, dol.z);
    add(dolInner);
    const smH = tlv(32.0639, 34.7688);
    {
      const n = nearestIndex(built.samples, smH.x, smH.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        smH.x = s.x + s.rx * (built.width / 2 + 24);
        smH.z = s.z + s.rz * (built.width / 2 + 24);
      }
    }
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
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
