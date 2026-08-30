import * as THREE from "three";
import { hai } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildStellamaris(context: TrackWorldBuilderContext): void {
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
    darkArch,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const sm = hai(32.8275, 34.9705);
    const abbey = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 14), cream);
    abbey.position.set(sm.x, 8, sm.z);
    add(abbey);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 16), cream);
    nave.position.set(sm.x, 6, sm.z + 8);
    add(nave);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
    dome.position.set(sm.x, 14, sm.z);
    add(dome);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.2, 0.25), white);
    cross.position.set(sm.x, 20.2, sm.z);
    add(cross);
    const bg = hai(32.8118, 34.9884);
    for (let i = 0; i < 6; i++) {
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(22 - i, 1.1, 8), new THREE.MeshStandardMaterial({
        color: i % 2 ? 13623492 : 15262936,
        roughness: 0.85
      }));
      terrace.position.set(bg.x, 10 + i * 2.2, bg.z - i * 7);
      add(terrace);
    }
    glowAt(sm.x, 22, sm.z, 16771248, 36, 24);
    hit(sm.x, sm.z, 12);
    const cave = hai(32.8268, 34.9692);
    const caveM = new THREE.Mesh(new THREE.BoxGeometry(8, 4.2, 10), stone);
    caveM.position.set(cave.x, 2.2, cave.z);
    add(caveM);
    const caveH = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, 0.4), darkArch);
    caveH.position.set(cave.x, 1.8, cave.z + 5.2);
    add(caveH);
    hit(cave.x, cave.z, 5);
    const lightH = hai(32.8298, 34.9698);
    const lh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 14, 10), cream);
    lh.position.set(lightH.x, 7, lightH.z);
    add(lh);
    const lhCap = new THREE.Mesh(new THREE.ConeGeometry(2, 2.2, 8), cream);
    lhCap.position.set(lightH.x, 15.2, lightH.z);
    add(lhCap);
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), new THREE.MeshBasicMaterial({ color: 16773828 }));
    lantern.position.set(lightH.x, 14.4, lightH.z);
    add(lantern);
    glowAt(lightH.x, 14, lightH.z, 16771248, 16, 14);
    const pineM = new THREE.MeshStandardMaterial({ color: 1853992, roughness: 0.9, flatShading: true });
    const barkM = new THREE.MeshStandardMaterial({ color: 3811356, roughness: 0.92 });
    bag.push(pineM, barkM);
    const valleyX = def.water ? def.water.x : sm.x - 40;
    const valleyZ = def.water ? def.water.z : sm.z;
    const railM = new THREE.MeshStandardMaterial({ color: 13157564, metalness: 0.35, roughness: 0.45 });
    bag.push(railM);
    for (let i = 3; i < built.samples.length - 3; i += 3) {
      const s = built.samples[i];
      const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
      const d = built.width / 2 + 1.5;
      const px = s.x + s.rx * d * vs;
      const pz = s.z + s.rz * d * vs;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.15, 5), railM);
      post.position.set(px, s.y + 0.7, pz);
      add(post);
      const ms = -vs;
      const tx = s.x + s.rx * (built.width / 2 + 10) * ms;
      const tz = s.z + s.rz * (built.width / 2 + 10) * ms;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 6.2, 6), barkM);
      trunk.position.set(tx, s.y + 3.1, tz);
      add(trunk);
      for (let L = 0; L < 3; L++) {
        const needle = new THREE.Mesh(new THREE.ConeGeometry(2 - L * 0.38, 4.2, 7), pineM);
        needle.position.set(tx, s.y + 5.2 + L * 2.2, tz);
        add(needle);
      }
    }
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
