import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { naz } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildNazareth(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    copper,
    cream,
    terracotta,
    darkGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ba = naz(32.7014, 35.2962);
    {
      const n = nearestIndex(built.samples, ba.x, ba.z, 0);
      if (n.dist < built.width / 2 + 16) {
        const s = built.samples[n.index];
        ba.x = s.x + s.rx * (built.width / 2 + 32);
        ba.z = s.z + s.rz * (built.width / 2 + 32);
      }
    }
    const darkStone = new THREE.MeshStandardMaterial({
      color: 9075304,
      roughness: 0.82,
      envMapIntensity: 0.4
    });
    bag.push(darkStone);
    const basilica = new THREE.Mesh(new THREE.BoxGeometry(30, 18, 22), darkStone);
    basilica.position.set(ba.x, 9.2, ba.z);
    add(basilica);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(20, 11, 16), cream);
    nave.position.set(ba.x, 21.5, ba.z);
    add(nave);
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.4, 13, 8), cream);
    lantern.position.set(ba.x, 32, ba.z);
    add(lantern);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8;
      const col = new THREE.Mesh(new THREE.BoxGeometry(1.2, 12, 0.8), cream);
      col.position.set(ba.x + Math.cos(a) * 6.8, 32, ba.z + Math.sin(a) * 6.8);
      add(col);
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.6, 0.3), darkGlass);
      win.position.set(ba.x + Math.cos(a) * 6.3, 32, ba.z + Math.sin(a) * 6.3);
      win.lookAt(ba.x, 32, ba.z);
      add(win);
    }
    const bDome = new THREE.Mesh(new THREE.ConeGeometry(7.8, 11, 8), darkStone);
    bDome.position.set(ba.x, 44, ba.z);
    add(bDome);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.4, 0.32), cream);
    crossV.position.set(ba.x, 50.4, ba.z);
    add(crossV);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.32, 0.32), cream);
    crossH.position.set(ba.x, 49.6, ba.z);
    add(crossH);
    const camp = new THREE.Mesh(new THREE.BoxGeometry(6.2, 28, 6.2), darkStone);
    camp.position.set(ba.x + 18, 14, ba.z - 6);
    add(camp);
    const campCap = new THREE.Mesh(new THREE.ConeGeometry(4.2, 6, 4), cream);
    campCap.rotation.y = Math.PI / 4;
    campCap.position.set(ba.x + 18, 31, ba.z - 6);
    add(campCap);
    const face = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 0.4), cream);
    face.position.set(ba.x, 12, ba.z + 11.2);
    add(face);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 0.18), r + c === 3 ? copper : darkStone);
      tile.position.set(ba.x - 6 + c * 4, 8.2 + r * 3.2, ba.z + 11.4);
      add(tile);
    }
    const mw = naz(32.7068, 35.2972);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 2.4, 12), stone);
    well.position.set(mw.x, 1.3, mw.z);
    add(well);
    const wellRoof = new THREE.Mesh(new THREE.ConeGeometry(3.8, 3, 4), terracotta);
    wellRoof.position.set(mw.x, 4, mw.z);
    add(wellRoof);
    const prec = naz(32.697, 35.288);
    const cliff = new THREE.Mesh(new THREE.BoxGeometry(48, 22, 18), stone);
    cliff.position.set(prec.x, 11, prec.z);
    add(cliff);
    for (let i = 0; i < 8; i++) {
      const p = naz(32.704 + i * 0.00035, 35.2994 + (i % 3) * 0.0002);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      if (near.dist < built.width / 2 + 6) continue;
      const stall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.4, 4.6), i % 2 ? cream : stone);
      stall.position.set(p.x, 1.7, p.z);
      add(stall);
      const awn = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 5), terracotta);
      awn.position.set(p.x, 3.5, p.z);
      add(awn);
    }
    glowAt(ba.x, 44, ba.z, 16771264, 40, 32);
    hit(ba.x, ba.z, 14);
    hit(ba.x + 18, ba.z - 6, 5);
    hit(mw.x, mw.z, 4);
    hit(prec.x, prec.z, 16);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
