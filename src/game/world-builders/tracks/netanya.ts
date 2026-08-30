import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { net } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildNetanya(context: TrackWorldBuilderContext): void {
  const {
    bag,
    isNight,
    emitList,
    built,
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
    terracotta,
    cyan,
    paleGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const sq = net(32.3318, 34.8565);
    {
      const n = nearestIndex(built.samples, sq.x, sq.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        sq.x = s.x + s.rx * (built.width / 2 + 22);
        sq.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 0.18, 28), stone);
    plaza.position.set(sq.x, 0.12, sq.z);
    add(plaza);
    const lawn = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.16, 20), new THREE.MeshStandardMaterial({ color: 3832386, roughness: 0.92 }));
    lawn.position.set(sq.x, 0.22, sq.z);
    add(lawn);
    const fountain = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 1.1, 16), stone);
    fountain.position.set(sq.x, 0.7, sq.z);
    add(fountain);
    const spray = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.1, 2.4, 8), cyan);
    spray.position.set(sq.x, 2.2, sq.z);
    add(spray);
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.55, 20, 8), cream);
    clock.position.set(sq.x + 10, 10, sq.z + 6);
    add(clock);
    const faceMatN = new THREE.MeshStandardMaterial({
      color: 15657176,
      roughness: 0.5,
      emissive: 3351050,
      emissiveIntensity: isNight ? 0.7 : 0.1
    });
    emitList.push({ mat: faceMatN, night: 0.7, day: 0.1 });
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), faceMatN);
      face.position.set(sq.x + 10 + Math.sin(a) * 2.6, 16.5, sq.z + 6 + Math.cos(a) * 2.6);
      face.lookAt(sq.x + 10 + Math.sin(a) * 8, 16.5, sq.z + 6 + Math.cos(a) * 8);
      add(face);
    }
    const hat = new THREE.Mesh(new THREE.ConeGeometry(3.1, 4.2, 4), terracotta);
    hat.rotation.y = Math.PI / 4;
    hat.position.set(sq.x + 10, 22.4, sq.z + 6);
    add(hat);
    const cl = net(32.334, 34.851);
    const chalkN = new THREE.MeshStandardMaterial({ color: 15525592, roughness: 0.9, flatShading: true });
    const sandB = new THREE.MeshStandardMaterial({ color: 15259572, roughness: 1 });
    bag.push(chalkN, sandB);
    for (let i = 0; i < 10; i++) {
      const p = net(32.327 + i * 14e-4, 34.8488);
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(18, 16 + i % 3 * 3, 7), chalkN);
      cliff.position.set(p.x, 7 + i % 3, p.z);
      cliff.rotation.y = 0.08;
      add(cliff);
    }
    const beach = new THREE.Mesh(new THREE.PlaneGeometry(70, 220), sandB);
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(cl.x - 36, 0.04, cl.z);
    add(beach);
    const leo = net(32.3282, 34.8492);
    const leonardo = new THREE.Mesh(new THREE.BoxGeometry(14, 42, 12), white);
    leonardo.position.set(leo.x, 21, leo.z);
    add(leonardo);
    for (let y = 5; y < 40; y += 3.2) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.16, 12.8), cream);
      sl.position.set(leo.x, y, leo.z);
      add(sl);
    }
    const leoCap = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 8), paleGlass);
    leoCap.position.set(leo.x, 44, leo.z);
    add(leoCap);
    const isr = net(32.3266, 34.8494);
    const isrotel = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.2, 48, 12), white);
    isrotel.position.set(isr.x, 24, isr.z);
    add(isrotel);
    for (let y = 6; y < 46; y += 3.6) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(6.7, 0.12, 5, 14), cream);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(isr.x, y, isr.z);
      add(ring);
    }
    const isrHat = new THREE.Mesh(new THREE.CylinderGeometry(8, 5.2, 5.4, 12), cream);
    isrHat.position.set(isr.x, 50.4, isr.z);
    add(isrHat);
    const pr = net(32.3316, 34.8488);
    const princess = new THREE.Mesh(new THREE.BoxGeometry(28, 16, 12), white);
    princess.position.set(pr.x, 8, pr.z);
    add(princess);
    const prWing = new THREE.Mesh(new THREE.BoxGeometry(10, 22, 10), cream);
    prWing.position.set(pr.x + 12, 11, pr.z);
    add(prWing);
    for (let y = 4; y < 14; y += 2.6) {
      const bal = new THREE.Mesh(new THREE.BoxGeometry(29, 0.14, 13), cream);
      bal.position.set(pr.x, y, pr.z);
      add(bal);
    }
    const sea = net(32.3338, 34.8486);
    const seasons = new THREE.Mesh(new THREE.BoxGeometry(12, 32, 14), paleGlass);
    seasons.position.set(sea.x, 16, sea.z);
    seasons.rotation.y = 0.12;
    add(seasons);
    const seaSlab = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 16), cream);
    seaSlab.position.set(sea.x, 4, sea.z);
    add(seaSlab);
    const lift = net(32.3324, 34.8484);
    const liftT = new THREE.Mesh(new THREE.BoxGeometry(4.2, 18, 4.2), white);
    liftT.position.set(lift.x, 9, lift.z);
    add(liftT);
    const liftC = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.2, 3.4), paleGlass);
    liftC.position.set(lift.x, 8.4, lift.z);
    add(liftC);
    for (let i = 0; i < 12; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.28, 2.2), stone);
      step.position.set(lift.x - 6, 14 - i * 1.15, lift.z - 2 - i * 1.4);
      add(step);
    }
    const herzl = net(32.329, 34.858);
    for (let i = 0; i < 4; i++) {
      const shop = new THREE.Mesh(new THREE.BoxGeometry(7.2, 8 + i % 2 * 2.4, 8), i % 2 ? cream : white);
      shop.position.set(herzl.x + 14 + i * 9, 4.4 + i % 2 * 1.2, herzl.z);
      add(shop);
      const awn = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.2, 2.4), terracotta);
      awn.position.set(herzl.x + 14 + i * 9, 3.6, herzl.z + 4.4);
      add(awn);
    }
    glowAt(cl.x, 20, cl.z, 16771248, 40, 24);
    hit(sq.x + 10, sq.z + 6, 5);
    hit(leo.x, leo.z, 8);
    hit(isr.x, isr.z, 8);
    hit(pr.x, pr.z, 12);
    hit(sea.x, sea.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
