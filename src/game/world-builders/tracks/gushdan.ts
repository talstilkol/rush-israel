import * as THREE from "three";
import { hzl, tlv } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildGushdan(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
    terracotta,
    wood,
    placeAzrieli,
    placeTlvTowers,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const clk = tlv(32.0547, 34.7556);
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.1, 20, 12), stone);
    clock.position.set(clk.x, 10, clk.z);
    add(clock);
    const clockBox = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.2, 5.2), cream);
    clockBox.position.set(clk.x, 21.4, clk.z);
    add(clockBox);
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(1.8, 16), white);
    clockFace.position.set(clk.x, 21.4, clk.z + 2.7);
    add(clockFace);
    const clockCap = new THREE.Mesh(new THREE.ConeGeometry(3.2, 4.2, 4), terracotta);
    clockCap.rotation.y = Math.PI / 4;
    clockCap.position.set(clk.x, 26.2, clk.z);
    add(clockCap);
    placeAzrieli(0.72);
    placeTlvTowers(0.62);
    const rd = tlv(32.1044, 34.7776);
    const chim = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 5.2, 78, 16), cream);
    chim.position.set(rd.x, 39, rd.z);
    add(chim);
    const chimGal = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 3.8, 2.4, 16), cream);
    chimGal.position.set(rd.x, 79, rd.z);
    add(chimGal);
    for (let i = 0; i < 5; i++) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(3.55, 3.7, 2.6, 14), i % 2 ? terracotta : white);
      band.position.set(rd.x, 66 + i * 2.8, rd.z);
      add(band);
    }
    const hi = tlv(32.0893, 34.7732);
    const hilton = new THREE.Mesh(new THREE.CylinderGeometry(16, 17, 28, 16, 1, false, 0.55, 2.05), white);
    hilton.position.set(hi.x, 14, hi.z);
    hilton.rotation.y = -0.35;
    add(hilton);
    const marH = hzl(32.1635, 34.7965);
    const dock = new THREE.Mesh(new THREE.BoxGeometry(36, 0.5, 10), wood);
    dock.position.set(marH.x, 0.3, marH.z);
    add(dock);
    const ac = hzl(32.1674, 34.7982);
    const accadia = new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 14, 16, 1, false, 0.35, 2.45), white);
    accadia.position.set(ac.x, 7.2, ac.z);
    accadia.rotation.y = -0.4;
    add(accadia);
    glowAt(rd.x, 78, rd.z, 16724016, 28, 24);
    hit(clk.x, clk.z, 6);
    hit(rd.x, rd.z, 6);
    hit(hi.x, hi.z, 12);
    hit(ac.x, ac.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
