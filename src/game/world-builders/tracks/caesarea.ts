import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { cae } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildCaesarea(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    hit,
    stone,
    white,
    cream,
    wood,
    darkArch,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const aq = cae(32.5078, 34.8976);
    {
      const n = nearestIndex(built.samples, aq.x, aq.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        aq.x = s.x + s.rx * (built.width / 2 + 28);
        aq.z = s.z + s.rz * (built.width / 2 + 28);
      }
    }
    const sandA = new THREE.MeshStandardMaterial({ color: 0xe2d2b0, roughness: 0.96 });
    bag.push(sandA);
    const beach = new THREE.Mesh(new THREE.PlaneGeometry(80, 160), sandA);
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(aq.x - 8, 0.04, aq.z);
    add(beach);
    const archGeo = new THREE.BoxGeometry(3.2, 10.4, 2.2);
    const capGeo = new THREE.BoxGeometry(4.2, 1.2, 3.2);
    const spanGeo = new THREE.BoxGeometry(3.4, 1.4, 7.2);
    for (let tier = 0; tier < 2; tier++) {
      const y0 = tier * 10.6;
      for (let i = 0; i < 22; i++) {
        const z = aq.z - 70 + i * 7.2;
        const pierA = new THREE.Mesh(archGeo, stone);
        pierA.position.set(aq.x, 5.2 + y0, z);
        add(pierA);
        const cap = new THREE.Mesh(capGeo, stone);
        cap.position.set(aq.x, 10.6 + y0, z);
        add(cap);
        if (i < 21) {
          const span = new THREE.Mesh(spanGeo, stone);
          span.position.set(aq.x, 9.2 + y0, z + 3.6);
          add(span);
          const hole = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 3.6, 12, 1, false, 0, Math.PI), darkArch);
          hole.rotation.z = Math.PI / 2;
          hole.position.set(aq.x, 4.4 + y0, z + 3.6);
          add(hole);
        }
      }
    }
    const channel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 154), stone);
    channel.position.set(aq.x, 21.6, aq.z);
    add(channel);
    const hp = cae(32.4988, 34.8896);
    const hippo = new THREE.Mesh(new THREE.TorusGeometry(32, 1.5, 8, 40), stone);
    hippo.scale.set(1.55, 1, 1);
    hippo.rotation.x = Math.PI / 2;
    hippo.position.set(hp.x, 0.95, hp.z);
    add(hippo);
    const spine = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.5, 42), stone);
    spine.position.set(hp.x, 0.85, hp.z);
    add(spine);
    const th = cae(32.4962, 34.8894);
    const theater = new THREE.Mesh(new THREE.CylinderGeometry(15, 24, 10, 22, 1, true, 0, Math.PI * 1.2), stone);
    theater.position.set(th.x, 5.4, th.z);
    theater.rotation.y = 0.6;
    add(theater);
    for (let r = 0; r < 7; r++) {
      const seat = new THREE.Mesh(new THREE.TorusGeometry(10 + r * 2.15, 0.48, 6, 22, Math.PI * 1.15), stone);
      seat.rotation.x = Math.PI / 2;
      seat.rotation.z = 0.6;
      seat.position.set(th.x, 1.15 + r * 1.2, th.z);
      add(seat);
    }
    const stage = new THREE.Mesh(new THREE.BoxGeometry(24, 1.2, 6.4), stone);
    stage.position.set(th.x + 4, 0.7, th.z + 8);
    add(stage);
    hit(aq.x, aq.z, 6);
    hit(hp.x, hp.z, 16);
    hit(th.x, th.z, 14);
    const cit = cae(32.5014, 34.8902);
    const citKeep = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 18), stone);
    citKeep.position.set(cit.x, 7.2, cit.z);
    add(citKeep);
    for (const [dx, dz] of [
      [-8, -8],
      [8, -8],
      [-8, 8],
      [8, 8]
    ]) {
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 16, 10), stone);
      tw.position.set(cit.x + dx, 8.2, cit.z + dz);
      add(tw);
    }
    hit(cit.x, cit.z, 12);
    const mole = cae(32.5004, 34.8884);
    const breakw = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, 72), stone);
    breakw.position.set(mole.x, 1, mole.z);
    add(breakw);
    const breakw2 = new THREE.Mesh(new THREE.BoxGeometry(48, 1.8, 7), stone);
    breakw2.position.set(mole.x + 16, 0.8, mole.z - 32);
    add(breakw2);
    for (let i = 0; i < 7; i++) {
      const hx = mole.x + 6 + i % 2 * 6;
      const hz = mole.z - 20 + i * 7;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 7.6), i % 2 ? white : cream);
      hull.position.set(hx, 0.4, hz);
      add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 8.4, 5), wood);
      mast.position.set(hx, 4.8, hz);
      add(mast);
    }
    const colRow = cae(32.5062, 34.897);
    for (let i = 0; i < 6; i++) {
      const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 4.2 + i % 3, 8), stone);
      stump.position.set(colRow.x + 10, 2.2, colRow.z - 12 + i * 5);
      add(stump);
    }
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
