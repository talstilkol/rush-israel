import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { hwy1 } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHw1(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    hit,
    placeTunnel,
    stone,
    white,
    cream,
    terracotta,
    darkGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const vineMat = new THREE.MeshStandardMaterial({ color: 3178290, roughness: 0.92, flatShading: true });
    const ochre = new THREE.MeshStandardMaterial({ color: 13213808, roughness: 0.82 });
    const olive = new THREE.MeshStandardMaterial({ color: 4874808, roughness: 0.9, flatShading: true });
    const steel = new THREE.MeshStandardMaterial({ color: 4210752, roughness: 0.45, metalness: 0.62 });
    bag.push(vineMat, ochre, olive, steel);
    const lt = hwy1(31.8338, 34.9774);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 12), cream);
    nave.position.set(lt.x, 8.4, lt.z);
    add(nave);
    const aisle = new THREE.Mesh(new THREE.BoxGeometry(10, 9, 16), cream);
    aisle.position.set(lt.x, 6.2, lt.z + 8);
    add(aisle);
    const gable = new THREE.Mesh(new THREE.ConeGeometry(9.4, 7.2, 4), terracotta);
    gable.rotation.y = Math.PI / 4;
    gable.position.set(lt.x, 18.8, lt.z);
    add(gable);
    const bell = new THREE.Mesh(new THREE.BoxGeometry(5.4, 26, 5.4), cream);
    bell.position.set(lt.x - 10, 16, lt.z - 2);
    add(bell);
    for (let y = 8; y < 24; y += 5.2) {
      const arch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.8, 0.35), darkGlass);
      arch.position.set(lt.x - 10, y, lt.z + 2.8);
      add(arch);
    }
    const bellCap = new THREE.Mesh(new THREE.ConeGeometry(4.2, 6.4, 4), terracotta);
    bellCap.rotation.y = Math.PI / 4;
    bellCap.position.set(lt.x - 10, 32.2, lt.z - 2);
    add(bellCap);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.4, 0.28), white);
    cross.position.set(lt.x - 10, 36.4, lt.z - 2);
    add(cross);
    const cloister = new THREE.Mesh(new THREE.BoxGeometry(28, 6.4, 18), cream);
    cloister.position.set(lt.x + 8, 3.4, lt.z - 16);
    add(cloister);
    const court = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 8), olive);
    court.position.set(lt.x + 8, 0.12, lt.z - 16);
    add(court);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) {
      const vx = lt.x - 36 + c * 2.4;
      const vz = lt.z + 18 + r * 3.2;
      const vine = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.1 + (c + r) % 3 * 0.35, 0.55), vineMat);
      vine.position.set(vx, 0.7, vz);
      add(vine);
    }
    const yad = hwy1(31.8382, 34.9786);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(18, 7.2, 24), cream);
    hall.position.set(yad.x, 4, yad.z);
    add(hall);
    const towerKeep = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 8), stone);
    towerKeep.position.set(yad.x + 12, 10, yad.z);
    add(towerKeep);
    for (let i = 0; i < 5; i++) {
      const hx = yad.x - 10 + i * 7;
      const hz = yad.z + 18;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 5.4), steel);
      hull.position.set(hx, 1.1, hz);
      add(hull);
      const tur = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 1.1, 10), steel);
      tur.position.set(hx, 2.1, hz);
      add(tur);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 4.4, 6), steel);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(hx, 2.15, hz + 2.6);
      add(barrel);
    }
    const sg = hwy1(31.815, 35.023);
    const sgNear = nearestIndex(built.samples, sg.x, sg.z, 0);
    const sgs = built.samples[sgNear.index];
    const sgyaw = Math.atan2(sgs.tx, sgs.tz);
    placeTunnel(sg.x, sg.z, sgyaw, 28, built.width * 0.55, 9.2, sgs.y);
    for (const side of [-1, 1]) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 64), stone);
      wall.position.set(sg.x + sgs.rx * side * 22, 2.2 + sgs.y, sg.z + sgs.rz * side * 22);
      add(wall);
      for (let k = 0; k < 8; k++) {
        const mer = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 4.2), stone);
        mer.position.set(sg.x + sgs.rx * side * 22, 4.6 + sgs.y, sg.z + sgs.rz * side * 22 + sgs.tz * (-28 + k * 8));
        add(mer);
      }
    }
    const over = new THREE.Mesh(new THREE.BoxGeometry(built.width + 10, 1.4, 12), stone);
    over.position.set(sg.x, sgs.y + 9.6, sg.z);
    over.rotation.y = sgyaw;
    add(over);
    const cs = hwy1(31.8094, 35.0388);
    const keepB = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 16), stone);
    keepB.position.set(cs.x, 18, cs.z);
    add(keepB);
    const keepT = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), stone);
    keepT.position.set(cs.x - 4, 28, cs.z + 3);
    add(keepT);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      const ruin = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.2 + i % 3 * 2.4, 3.6), stone);
      ruin.position.set(cs.x + Math.cos(a) * 16, 10 + i % 3, cs.z + Math.sin(a) * 14);
      ruin.rotation.y = a;
      add(ruin);
    }
    const hill = new THREE.Mesh(new THREE.ConeGeometry(18, 12, 7), olive);
    hill.position.set(cs.x, 4, cs.z);
    add(hill);
    hit(lt.x, lt.z, 12);
    hit(lt.x - 10, lt.z - 2, 5);
    hit(yad.x, yad.z, 10);
    hit(cs.x, cs.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
