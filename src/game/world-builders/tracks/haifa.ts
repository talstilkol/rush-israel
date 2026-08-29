import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { hai } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHaifa(context: TrackWorldBuilderContext): void {
  const {
    group,
    def,
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    gold,
    cream,
    terracotta,
    _dummy,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const bg = hai(32.8118, 34.9884);
    const pt = hai(32.819, 35.004);
    const pineM = new THREE.MeshStandardMaterial({ color: 1853992, roughness: 0.9, flatShading: true });
    const barkM = new THREE.MeshStandardMaterial({ color: 3811356, roughness: 0.92 });
    const cypressM = new THREE.MeshStandardMaterial({ color: 2972216, roughness: 0.9, flatShading: true });
    const leafM = new THREE.MeshStandardMaterial({ color: 4025140, roughness: 0.88, flatShading: true });
    const wallM = new THREE.MeshStandardMaterial({ color: 9076848, roughness: 0.9, flatShading: true });
    bag.push(pineM, barkM, cypressM, leafM, wallM);
    let bx = bg.x + 26;
    let bz = bg.z + 18;
    {
      const n = nearestIndex(built.samples, bx, bz, 0);
      if (n.dist < built.width / 2 + 36) {
        const s = built.samples[n.index];
        const off = built.width / 2 + 58;
        bx = s.x + s.rx * off;
        bz = s.z + s.rz * off;
      }
    }
    const shrineY = def.elevation(0.06);
    for (let i = 0; i < 18; i++) {
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(38 - i * 1.15, 1.05, 12), new THREE.MeshStandardMaterial({
        color: i % 2 ? 13623492 : 15262936,
        roughness: 0.85,
        envMapIntensity: 0.35
      }));
      terrace.position.set(bx, shrineY - 4 - i * 2.4, bz + i * 7.2);
      add(terrace);
      const stair = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.4, 7.4), cream);
      stair.position.set(bx, shrineY - 3.6 - i * 2.4, bz + i * 7.2);
      add(stair);
      if (i % 2 === 0) for (const side of [-14, 14]) {
        const cypress = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5.4, 7), cypressM);
        cypress.position.set(bx + side, shrineY - 0.8 - i * 2.4, bz + i * 7.2);
        add(cypress);
      } else for (const side of [-10, 10]) {
        const cypress = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.2, 7), cypressM);
        cypress.position.set(bx + side, shrineY - 1.4 - i * 2.4, bz + i * 7.2);
        add(cypress);
      }
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(34 - i * 1.1, 0.55, 0.7), leafM);
      hedge.position.set(bx, shrineY - 3.3 - i * 2.4, bz + i * 7.2 + 5.4);
      add(hedge);
    }
    const shrine = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 9.1, 13, 8), cream);
    shrine.position.set(bx, shrineY + 8, bz - 8);
    add(shrine);
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 12, 8), cream);
      col.position.set(bx + Math.cos(a) * 10.2, shrineY + 8, bz - 8 + Math.sin(a) * 10.2);
      add(col);
    }
    const shrineDome = new THREE.Mesh(new THREE.SphereGeometry(8.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), gold);
    shrineDome.position.set(bx, shrineY + 15.6, bz - 8);
    add(shrineDome);
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(8.6, 8.9, 2.6, 18), cream);
    drum.position.set(bx, shrineY + 14.4, bz - 8);
    add(drum);
    const drumGold = new THREE.Mesh(new THREE.TorusGeometry(8.55, 0.22, 6, 18), gold);
    drumGold.rotation.x = Math.PI / 2;
    drumGold.position.set(bx, shrineY + 15.5, bz - 8);
    add(drumGold);
    const shrineLantern = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.5, 3.6, 8), gold);
    shrineLantern.position.set(bx, shrineY + 23.2, bz - 8);
    add(shrineLantern);
    const shrineTip = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), gold);
    shrineTip.position.set(bx, shrineY + 25.4, bz - 8);
    add(shrineTip);
    glowAt(bx, shrineY + 23, bz - 8, 16763972, 56, 42);
    hit(bx, bz - 8, 11, 10, 10);
    {
      const hillM = new THREE.MeshStandardMaterial({
        color: 0x4a6238,
        roughness: 0.95,
        flatShading: true
      });
      bag.push(hillM);
      const start = built.samples[2];
      for (let i = 0; i < 12; i++) {
        const extra = 80 + i * 28;
        const h = 48 + i % 4 * 20;
        const hill = new THREE.Mesh(new THREE.ConeGeometry(34 + i % 3 * 10, h, 6), hillM);
        hill.position.set(start.x - start.rx * extra, start.y + h * 0.18, start.z - start.rz * extra);
        add(hill);
      }
    }
    const pineTrunkG = new THREE.CylinderGeometry(0.22, 0.36, 8.4, 7);
    pineTrunkG.translate(0, 4.2, 0);
    const pineCrownG = new THREE.ConeGeometry(2.2, 6.4, 7);
    const nPine = Math.min(90, built.samples.length * 2);
    const pTrunks = new THREE.InstancedMesh(pineTrunkG, barkM, nPine);
    const pCrowns = new THREE.InstancedMesh(pineCrownG, pineM, nPine);
    let pi = 0;
    const stepP = Math.max(1, Math.floor(built.samples.length / 40));
    for (let i = 1; i < built.samples.length - 1 && pi < nPine; i += stepP) {
      const s = built.samples[i];
      const vs = s.rx * (bg.x - s.x) + s.rz * (bg.z - s.z) >= 0 ? 1 : -1;
      const ms = vs;
      for (const extra of [11, 20, 32]) {
        if (pi >= nPine) break;
        const d = built.width / 2 + extra;
        const px = s.x + s.rx * d * ms;
        const pz = s.z + s.rz * d * ms;
        _dummy.position.set(px, s.y, pz);
        _dummy.scale.set(1, 1 + (i % 4) * 0.12, 1);
        _dummy.rotation.set(0, i * 0.7, 0);
        _dummy.updateMatrix();
        pTrunks.setMatrixAt(pi, _dummy.matrix);
        _dummy.position.set(px, s.y + 8.2, pz);
        _dummy.updateMatrix();
        pCrowns.setMatrixAt(pi, _dummy.matrix);
        pi++;
      }
    }
    pTrunks.count = pi;
    pCrowns.count = pi;
    pTrunks.instanceMatrix.needsUpdate = true;
    pCrowns.instanceMatrix.needsUpdate = true;
    group.add(pTrunks, pCrowns);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 6969928,
      roughness: 0.95,
      flatShading: true
    });
    bag.push(rockMat);
    for (let i = 0; i < 14; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(4 + i % 3, 0), rockMat);
      rock.position.set(bg.x + 40 + i % 4 * 18, 6 + i % 3 * 5, bg.z - 30 + Math.floor(i / 4) * 22);
      add(rock);
    }
    const floorP = pt;
    const craneM = new THREE.MeshStandardMaterial({ color: 12085288, metalness: 0.4, roughness: 0.45 });
    bag.push(craneM);
    for (let c = 0; c < 3; c++) {
      const nP = nearestIndex(built.samples, pt.x, pt.z, 0);
      const sP = built.samples[nP.index];
      const cx = sP.x + sP.rx * (built.width / 2 + 24 + c * 10);
      const cz = sP.z + sP.rz * (built.width / 2 + 24 + c * 10);
      const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 32 + c * 4, 1.4), craneM);
      crane.position.set(cx, 16 + c * 2, cz);
      add(crane);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(36, 0.8, 0.8), craneM);
      jib.position.set(cx + 12, 32 + c * 4, cz);
      add(jib);
    }
    const sm = hai(32.8272, 34.9698);
    let smx = sm.x;
    let smz = sm.z;
    {
      const n = nearestIndex(built.samples, smx, smz, 0);
      if (n.dist < built.width / 2 + 16) {
        const s = built.samples[n.index];
        smx = s.x + s.rx * (built.width / 2 + 28);
        smz = s.z + s.rz * (built.width / 2 + 28);
      }
    }
    const church = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 22), cream);
    church.position.set(smx, 4.5, smz);
    add(church);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 8), cream);
    nave.position.set(smx, 12, smz);
    add(nave);
    const smDome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), terracotta);
    smDome.position.set(smx, 15.4, smz);
    add(smDome);
    const bell = new THREE.Mesh(new THREE.BoxGeometry(4.2, 18, 4.2), cream);
    bell.position.set(smx + 8, 9, smz + 8);
    add(bell);
    const bellCap = new THREE.Mesh(new THREE.ConeGeometry(3.2, 4.4, 4), terracotta);
    bellCap.rotation.y = Math.PI / 4;
    bellCap.position.set(smx + 8, 20.2, smz + 8);
    add(bellCap);
    hit(smx, smz, 10, 9, 12);
    const rust = new THREE.MeshStandardMaterial({ color: 9071176, roughness: 0.7, metalness: 0.2 });
    bag.push(rust);
    for (let i = 0; i < 4; i++) {
      const hull = new THREE.Mesh(new THREE.BoxGeometry(8, 4.2, 28), rust);
      hull.position.set(pt.x + 40, 1.8, pt.z - 30 + i * 22);
      add(hull);
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 6, 8), cream);
      stack.position.set(pt.x + 40, 6.8, pt.z - 30 + i * 22);
      add(stack);
    }
    const siloM = new THREE.MeshStandardMaterial({ color: 13156532, roughness: 0.62, metalness: 0.12 });
    bag.push(siloM);
    for (let i = 0; i < 5; i++) {
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 22, 12), siloM);
      silo.position.set(pt.x - 28 + i * 8, 11, pt.z + 22);
      add(silo);
    }
    const colony = [
      { lat: 32.8194, lon: 34.9892, w: 9.2, h: 8.4, d: 7.6 },
      { lat: 32.8198, lon: 34.99, w: 10.4, h: 9.2, d: 8.2 },
      { lat: 32.82, lon: 34.9908, w: 8.6, h: 7.8, d: 7.2 },
      { lat: 32.8192, lon: 34.9914, w: 11.2, h: 8.8, d: 8.4 },
      { lat: 32.8188, lon: 34.9898, w: 9.6, h: 10.2, d: 7.8 }
    ];
    for (let i = 0; i < colony.length; i++) {
      const c = colony[i];
      const p = hai(c.lat, c.lon);
      const body = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, c.d), i % 2 ? cream : stone);
      body.position.set(p.x, c.h * 0.5, p.z);
      add(body);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(c.w, c.d) * 0.7, 3.2, 4), terracotta);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(p.x, c.h + 1.6, p.z);
      add(roof);
      hit(p.x, p.z, 5);
    }
    const valleyX = def.water ? def.water.x : pt.x;
    const valleyZ = def.water ? def.water.z : pt.z;
    const stepW = Math.max(3, Math.floor(built.samples.length / 28));
    for (let i = 2; i < built.samples.length - 2; i += stepW) {
      const s = built.samples[i];
      const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      const ms = -vs;
      const d = built.width / 2 + 3.4;
      const wx = s.x + s.rx * d * ms;
      const wz = s.z + s.rz * d * ms;
      const retain = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.6, 14), wallM);
      retain.position.set(wx, s.y + 1.4, wz);
      retain.rotation.y = Math.atan2(s.tx, s.tz);
      add(retain);
    }
    const railM = new THREE.MeshStandardMaterial({ color: 13157564, metalness: 0.35, roughness: 0.45 });
    bag.push(railM);
    for (let i = 4; i < built.samples.length - 4; i += 4) {
      const s = built.samples[i];
      const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      const d = built.width / 2 + 1.6;
      const px = s.x + s.rx * d * vs;
      const pz = s.z + s.rz * d * vs;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.15, 5), railM);
      post.position.set(px, s.y + 0.7, pz);
      add(post);
      if (i + 4 < built.samples.length) {
        const s2 = built.samples[Math.min(i + 4, built.samples.length - 1)];
        const px2 = s2.x + s2.rx * d * vs;
        const pz2 = s2.z + s2.rz * d * vs;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(px2 - px, pz2 - pz), 0.06, 0.06), railM);
        bar.position.set((px + px2) * 0.5, s.y + 1.15, (pz + pz2) * 0.5);
        bar.lookAt(px2, s.y + 1.15, pz2);
        add(bar);
      }
    }
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
