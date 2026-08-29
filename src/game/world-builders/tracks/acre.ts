import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { acr } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildAcre(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
    terracotta,
    wood,
    darkArch,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ochreH = new THREE.MeshStandardMaterial({ color: 12093784, roughness: 0.88, envMapIntensity: 0.28 });
    const ochreD = new THREE.MeshStandardMaterial({ color: 9398336, roughness: 0.9 });
    bag.push(ochreH, ochreD);
    const offAcre = (p: { x: number; z: number }, pad = 26) => {
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * (built.width / 2 + pad);
        p.z = s.z + s.rz * (built.width / 2 + pad);
      }
      return p;
    };
    const sea = offAcre(acr(32.9198, 35.0676), 32);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(110, 12, 5.4), stone);
    wall.position.set(sea.x, 6, sea.z);
    add(wall);
    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(5.4, 12, 70), stone);
    wall2.position.set(sea.x - 52, 6, sea.z + 28);
    add(wall2);
    for (let i = 0; i < 16; i++) {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 5.8), stone);
      merlon.position.set(sea.x - 50 + i * 7, 13, sea.z);
      add(merlon);
    }
    const burj = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.4, 18, 12), stone);
    burj.position.set(sea.x - 52, 10, sea.z);
    add(burj);
    const burjCap = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 5.4, 2, 12), stone);
    burjCap.position.set(sea.x - 52, 20, sea.z);
    add(burjCap);
    for (let i = 0; i < 14; i++) {
      const lat = 32.9192 + (i % 7) * 0.00055;
      const lon = 35.0692 + Math.floor(i / 7) * 0.0007;
      const p = acr(lat, lon);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      if (near.dist < built.width / 2 + 8) continue;
      const h = 5.2 + i % 4 * 0.9;
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.8, h, 7.4), i % 3 === 0 ? stone : i % 3 === 1 ? ochreH : ochreD);
      house.position.set(p.x, h * 0.5, p.z);
      add(house);
      const rf = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.32, 8), terracotta);
      rf.position.set(p.x, h + 0.18, p.z);
      add(rf);
      const door = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.24, 10, 1, false, 0, Math.PI), darkArch);
      door.rotation.z = Math.PI / 2;
      door.position.set(p.x, 1.6, p.z + 3.8);
      add(door);
      hit(p.x, p.z, 3.4);
    }
    const kh = offAcre(acr(32.9206, 35.0688), 28);
    const khan = new THREE.Mesh(new THREE.BoxGeometry(26, 7.6, 26), stone);
    khan.position.set(kh.x, 3.8, kh.z);
    add(khan);
    const court = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 14), cream);
    court.position.set(kh.x, 0.18, kh.z);
    add(court);
    for (const [dx, dz] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.9, 12, 8), stone);
      col.position.set(kh.x + dx, 8, kh.z + dz);
      add(col);
    }
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.6, 30, 10), stone);
    clock.position.set(kh.x, 17, kh.z);
    add(clock);
    const clockBox = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.4, 4.4), cream);
    clockBox.position.set(kh.x, 32.2, kh.z);
    add(clockBox);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.05, 16), cream);
      face.position.set(kh.x + Math.sin(a) * 2.25, 32.2, kh.z + Math.cos(a) * 2.25);
      face.lookAt(kh.x + Math.sin(a) * 8, 32.2, kh.z + Math.cos(a) * 8);
      add(face);
    }
    const clockCap = new THREE.Mesh(new THREE.ConeGeometry(3, 3.6, 4), terracotta);
    clockCap.rotation.y = Math.PI / 4;
    clockCap.position.set(kh.x, 36.2, kh.z);
    add(clockCap);
    const ms = acr(32.9226, 35.0718);
    const mosque = new THREE.Mesh(new THREE.BoxGeometry(20, 9, 20), cream);
    mosque.position.set(ms.x, 5.2, ms.z);
    add(mosque);
    const green = new THREE.MeshStandardMaterial({
      color: 3050072,
      roughness: 0.38,
      metalness: 0.22,
      envMapIntensity: 0.85
    });
    bag.push(green);
    const domeA = new THREE.Mesh(new THREE.SphereGeometry(7.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), green);
    domeA.position.set(ms.x, 10.4, ms.z);
    add(domeA);
    for (const [dx, dz] of [[-7, -7], [7, -7], [-7, 7], [7, 7]]) {
      const sd = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), green);
      sd.position.set(ms.x + dx, 10.2, ms.z + dz);
      add(sd);
    }
    const minaret2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.45, 32, 10), cream);
    minaret2.position.set(ms.x + 12, 18, ms.z + 6);
    add(minaret2);
    const minaBalc = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 1.6, 1.5, 10), cream);
    minaBalc.position.set(ms.x + 12, 32, ms.z + 6);
    add(minaBalc);
    const minaCap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 3.4, 8), green);
    minaCap.position.set(ms.x + 12, 34.8, ms.z + 6);
    add(minaCap);
    const cit = acr(32.9238, 35.0714);
    const citadel = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 18), stone);
    citadel.position.set(cit.x, 8, cit.z);
    add(citadel);
    const citT = new THREE.Mesh(new THREE.BoxGeometry(8, 10, 8), stone);
    citT.position.set(cit.x - 8, 18, cit.z);
    add(citT);
    const quay = acr(32.9192, 35.0682);
    const pier = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 48), stone);
    pier.position.set(quay.x, 0.2, quay.z);
    add(pier);
    for (let i = 0; i < 10; i++) {
      const hx = quay.x - 10 - i % 2 * 6;
      const hz = quay.z - 20 + i * 5.2;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.75, 7.6), i % 2 ? white : cream);
      hull.position.set(hx, 0.45, hz);
      add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 8, 5), wood);
      mast.position.set(hx, 4.7, hz);
      add(mast);
    }
    glowAt(ms.x, 16, ms.z, 16771248, 28, 22);
    hit(sea.x, sea.z, 6);
    hit(ms.x, ms.z, 11);
    hit(kh.x, kh.z, 9);
    hit(cit.x, cit.z, 9);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
