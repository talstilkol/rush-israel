import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { ram } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildRamon(context: TrackWorldBuilderContext): void {
  const {
    group,
    def,
    bag,
    shadows,
    built,
    add,
    glowAt,
    hit,
    placeTunnel,
    _dummy,
    samp,
    segsOf,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const dust = new THREE.MeshStandardMaterial({
      color: 6961192,
      roughness: 0.97,
      flatShading: true
    });
    const sand = new THREE.MeshStandardMaterial({
      color: 12868658,
      roughness: 0.94,
      flatShading: true
    });
    const tan = new THREE.MeshStandardMaterial({
      color: 14725240,
      roughness: 0.92,
      flatShading: true
    });
    const creamRock = new THREE.MeshStandardMaterial({
      color: 15258280,
      roughness: 0.9,
      flatShading: true
    });
    const band = new THREE.MeshStandardMaterial({
      color: 11028520,
      roughness: 0.95,
      flatShading: true
    });
    const darkRock = new THREE.MeshStandardMaterial({
      color: 4860960,
      roughness: 0.96,
      flatShading: true
    });
    const rust = new THREE.MeshStandardMaterial({
      color: 11037250,
      roughness: 0.95,
      flatShading: true
    });
    bag.push(dust, sand, tan, creamRock, band, darkRock, rust);
    const floor = ram(30.585, 34.802);
    const floorPlane = new THREE.Mesh(new THREE.CircleGeometry(420, 28), sand);
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.set(floor.x, 0.4, floor.z);
    add(floorPlane);
    const wadi = new THREE.Mesh(new THREE.BoxGeometry(28, 0.3, 380), dust);
    wadi.position.set(floor.x + 8, 0.55, floor.z);
    add(wadi);
    const rockGeo = new THREE.DodecahedronGeometry(1, 0);
    const nRock = Math.min(64, built.samples.length);
    const rocks = new THREE.InstancedMesh(rockGeo, tan, nRock);
    rocks.castShadow = shadows;
    let rii = 0;
    const stepC = Math.max(1, Math.floor(built.samples.length / nRock));
    for (let i = 0; i < built.samples.length && rii < nRock; i += stepC) {
      const s = built.samples[i];
      const vs = s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1;
      const ms = -vs;
      const d = built.width / 2 + 22 + i % 4 * 6;
      const cx = s.x + s.rx * d * ms;
      const cz = s.z + s.rz * d * ms;
      _dummy.position.set(cx, s.y + 2.4, cz);
      const sc = 3.4 + i % 5 * 1.4;
      _dummy.scale.set(sc * 1.4, sc * 0.7, sc);
      _dummy.rotation.set(i * 0.4, i * 0.7, i * 0.2);
      _dummy.updateMatrix();
      rocks.setMatrixAt(rii++, _dummy.matrix);
    }
    rocks.count = rii;
    rocks.instanceMatrix.needsUpdate = true;
    group.add(rocks);
    {
      const cPos = [];
      const cIdx = [];
      const nC = segsOf(built);
      for (let i = 0; i <= nC; i++) {
        const s = samp(built, i);
        const vs = s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1;
        const ms = -vs;
        const d = built.width / 2 + 9.5;
        const y0 = s.y - 4;
        const y1 = s.y + 150 + Math.min(90, s.y * 0.55);
        cPos.push(s.x + s.rx * d * ms, y0, s.z + s.rz * d * ms);
        cPos.push(s.x + s.rx * d * ms, y1, s.z + s.rz * d * ms);
      }
      for (let i = 0; i < nC; i++) {
        const a = i * 2;
        cIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute("position", new THREE.Float32BufferAttribute(cPos, 3));
      cGeo.setIndex(cIdx);
      cGeo.computeVertexNormals();
      bag.push(cGeo);
      const wall = new THREE.Mesh(cGeo, rust);
      wall.receiveShadow = true;
      add(wall);
    }
    for (let i = 0; i < 22; i++) {
      const a = i / 22 * Math.PI * 2 + 0.15;
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(80 + i % 5 * 24, 130 + i % 4 * 40, 6), i % 3 === 0 ? darkRock : i % 3 === 1 ? rust : tan);
      mtn.position.set(floor.x + Math.cos(a) * 560, 52, floor.z + Math.sin(a) * 400);
      add(mtn);
    }
    const strata = [creamRock, tan, rust, band, sand];
    for (let i = 1; i < built.samples.length - 1; i += 3) {
      const s = built.samples[i];
      const vs = s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1;
      const ms = -vs;
      for (let layer = 0; layer < 5; layer++) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(16, 3.6, 10), strata[layer]);
        const d = built.width / 2 + 12 + layer * 3.2;
        slab.position.set(s.x + s.rx * d * ms, s.y + 2.2 + layer * 3.5, s.z + s.rz * d * ms);
        slab.rotation.y = Math.atan2(s.tx, s.tz);
        add(slab);
      }
    }
    const lk = ram(30.6132, 34.801);
    {
      const n = nearestIndex(built.samples, lk.x, lk.z, 0);
      const s = built.samples[n.index];
      lk.x = s.x + s.rx * (built.width / 2 + 26);
      lk.z = s.z + s.rz * (built.width / 2 + 26);
    }
    const lookY = def.elevation(0.02);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(18, 0.32, 12), creamRock);
    deck.position.set(lk.x, lookY + 0.2, lk.z);
    add(deck);
    const railM = new THREE.MeshStandardMaterial({ color: 0x6a5848, roughness: 0.7, metalness: 0.2 });
    bag.push(railM);
    for (const z of [-16, -4]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 0.08), railM);
      bar.position.set(lk.x, lookY + 1.15, lk.z + z);
      add(bar);
    }
    for (const sx of [-8, 0, 8]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 1.15, 6), railM);
      post.position.set(lk.x + sx, lookY + 0.7, lk.z - 6);
      add(post);
    }
    const cut = ram(30.5992, 34.806);
    const nCut = ram(30.5964, 34.8044);
    const cutYaw = Math.atan2(nCut.x - cut.x, nCut.z - cut.z);
    const cutY = def.elevation(0.55);
    placeTunnel(cut.x, cut.z, cutYaw, 42, built.width * 0.62, 7.6, cutY);
    const crx = Math.cos(cutYaw);
    const crz = -Math.sin(cutYaw);
    const spurL = new THREE.Mesh(new THREE.BoxGeometry(22, 36, 30), darkRock);
    spurL.position.set(cut.x - crx * 28, cutY + 18, cut.z - crz * 28);
    add(spurL);
    const spurR = new THREE.Mesh(new THREE.BoxGeometry(22, 32, 30), sand);
    spurR.position.set(cut.x + crx * 28, cutY + 16, cut.z + crz * 28);
    add(spurR);
    const bushM = new THREE.MeshStandardMaterial({ color: 6978104, roughness: 0.92, flatShading: true });
    bag.push(bushM);
    for (let i = 0; i < 22; i++) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(1.1 + i % 3 * 0.4, 6, 5), bushM);
      bush.position.set(floor.x + i % 9 * 28 - 90, 1.4, floor.z + Math.floor(i / 9) * 34 - 30);
      add(bush);
    }
    glowAt(lk.x, lookY + 5, lk.z, 16763e3, 24, 20);
    hit(lk.x, lk.z, 4);
    hit(cut.x - crx * 28, cut.z - crz * 28, 8);
    hit(cut.x + crx * 28, cut.z + crz * 28, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
