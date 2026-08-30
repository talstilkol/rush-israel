import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { hzl } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHerzliya(context: TrackWorldBuilderContext): void {
  const {
    built,
    add,
    glowAt,
    hit,
    stone,
    white,
    glass,
    cream,
    terracotta,
    wood,
    darkGlass,
    paleGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const mar = hzl(32.1635, 34.7965);
    {
      const n = nearestIndex(built.samples, mar.x, mar.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        mar.x = s.x + s.rx * (built.width / 2 + 26);
        mar.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const breakw = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, 72), stone);
    breakw.position.set(mar.x - 42, 0.7, mar.z);
    add(breakw);
    const breakw2 = new THREE.Mesh(new THREE.BoxGeometry(48, 1.4, 5), stone);
    breakw2.position.set(mar.x - 22, 0.6, mar.z - 34);
    add(breakw2);
    const dock = new THREE.Mesh(new THREE.BoxGeometry(52, 0.5, 12), wood);
    dock.position.set(mar.x - 8, 0.32, mar.z);
    add(dock);
    const lightH = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 16, 8), white);
    lightH.position.set(mar.x - 44, 8, mar.z - 30);
    add(lightH);
    const lightCap = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 1.8, 8), cream);
    lightCap.position.set(mar.x - 44, 16.8, mar.z - 30);
    add(lightCap);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 6), new THREE.MeshBasicMaterial({ color: 16777136 }));
    lamp.position.set(mar.x - 44, 18.2, mar.z - 30);
    add(lamp);
    for (let i = 0; i < 10; i++) {
      const hx = mar.x - 28 - i % 2 * 8;
      const hz = mar.z - 26 + i * 6.4;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 8.6), i % 3 === 0 ? cream : white);
      hull.position.set(hx, 0.45, hz);
      hull.rotation.y = 0.08;
      add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 3.4), white);
      cabin.position.set(hx, 1.3, hz);
      add(cabin);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 10, 5), wood);
      mast.position.set(hx, 5.6, hz);
      add(mast);
    }
    const rest = new THREE.Mesh(new THREE.BoxGeometry(18, 5.2, 10), cream);
    rest.position.set(mar.x + 8, 2.7, mar.z + 4);
    add(rest);
    const restRoof = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 12), terracotta);
    restRoof.position.set(mar.x + 8, 5.5, mar.z + 4);
    add(restRoof);
    const ac = hzl(32.1662, 34.8004);
    const accadia = new THREE.Mesh(new THREE.CylinderGeometry(14, 16, 18, 20, 1, false, 0.35, 2.45), white);
    accadia.position.set(ac.x, 9.2, ac.z);
    accadia.rotation.y = -0.4;
    add(accadia);
    for (let i = 0; i < 7; i++) {
      const terrace = new THREE.Mesh(new THREE.CylinderGeometry(14.6, 16.4, 0.2, 20, 1, false, 0.35, 2.45), cream);
      terrace.position.set(ac.x, 2.4 + i * 2.4, ac.z);
      terrace.rotation.y = -0.4;
      add(terrace);
    }
    const acRoof = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 2.2, 20, 1, false, 0.35, 2.45), cream);
    acRoof.position.set(ac.x, 19.2, ac.z);
    acRoof.rotation.y = -0.4;
    add(acRoof);
    const danH = hzl(32.1648, 34.8016);
    const daniel = new THREE.Mesh(new THREE.BoxGeometry(14, 36, 18), white);
    daniel.position.set(danH.x, 18, danH.z);
    add(daniel);
    for (let y = 5; y < 34; y += 3.1) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.16, 19.2), cream);
      sl.position.set(danH.x, y, danH.z);
      add(sl);
    }
    const danCap = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 12), paleGlass);
    danCap.position.set(danH.x, 37.4, danH.z);
    add(danCap);
    const ar = hzl(32.1612, 34.8068);
    const arena = new THREE.Mesh(new THREE.BoxGeometry(38, 11, 24), white);
    arena.position.set(ar.x, 5.6, ar.z);
    add(arena);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 8.4, 14, 6), glass);
    atrium.position.set(ar.x, 16, ar.z);
    add(atrium);
    const atriumRoof = new THREE.Mesh(new THREE.CylinderGeometry(9.2, 7.2, 3.2, 6), paleGlass);
    atriumRoof.position.set(ar.x, 24.4, ar.z);
    add(atriumRoof);
    const wingA = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 18), cream);
    wingA.position.set(ar.x - 22, 4.2, ar.z + 4);
    add(wingA);
    const wingB = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 18), cream);
    wingB.position.set(ar.x + 22, 4.2, ar.z - 4);
    add(wingB);
    const ht = hzl(32.1594, 34.8096);
    const cubeA = new THREE.Mesh(new THREE.BoxGeometry(14, 28, 14), glass);
    cubeA.position.set(ht.x, 14, ht.z);
    cubeA.rotation.y = 0.18;
    add(cubeA);
    const cubeB = new THREE.Mesh(new THREE.BoxGeometry(11, 22, 11), paleGlass);
    cubeB.position.set(ht.x + 16, 11, ht.z + 8);
    cubeB.rotation.y = -0.22;
    add(cubeB);
    const cubeC = new THREE.Mesh(new THREE.BoxGeometry(12, 18, 18), cream);
    cubeC.position.set(ht.x - 14, 9, ht.z + 10);
    add(cubeC);
    const stepTw = new THREE.Mesh(new THREE.BoxGeometry(9, 34, 9), darkGlass);
    stepTw.position.set(ht.x + 8, 17, ht.z - 12);
    add(stepTw);
    for (let i = 0; i < 4; i++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 2.2, 5.4, 16 - i * 2.2), paleGlass);
      slab.position.set(ht.x - 22, 3.2 + i * 6, ht.z - 8);
      add(slab);
    }
    glowAt(ht.x, 28, ht.z, 8967400, 44, 30);
    glowAt(ac.x, 18, ac.z, 16769200, 32, 28);
    hit(mar.x, mar.z, 10);
    hit(ac.x, ac.z, 12);
    hit(danH.x, danH.z, 10);
    hit(ar.x, ar.z, 16);
    hit(ht.x, ht.z, 10);
    hit(ht.x + 16, ht.z + 8, 7);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
