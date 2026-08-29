import * as THREE from "three";
import { lerp } from "../../math";
import { nearestIndex } from "../../spline";
import { her } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHermon(context: TrackWorldBuilderContext): void {
  const {
    def,
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    cream,
    bandMat,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const snowM = new THREE.MeshStandardMaterial({
      color: 15922938,
      roughness: 0.88
    });
    const rock = new THREE.MeshStandardMaterial({
      color: 9077880,
      roughness: 0.94,
      flatShading: true
    });
    const pineM = new THREE.MeshStandardMaterial({
      color: 1854002,
      roughness: 0.9,
      flatShading: true
    });
    const bark = new THREE.MeshStandardMaterial({
      color: 3811868,
      roughness: 0.92
    });
    bag.push(snowM, rock, pineM, bark);
    const peak = her(33.3112, 35.79);
    const start = her(33.2688, 35.7712);
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 1.4 - 0.4;
      const r = 90 + i % 3 * 32;
      const h = 36 + i % 4 * 14;
      const mtn = new THREE.Mesh(new THREE.DodecahedronGeometry(14 + i % 3 * 5, 0), i < 6 ? snowM : rock);
      mtn.position.set(peak.x + Math.cos(a) * r, def.elevation(1) + 10 + i * 4, peak.z + 22 + Math.sin(a) * r * 0.7);
      mtn.scale.set(2.2, 3.4, 2);
      add(mtn);
    }
    const peakCone = new THREE.Mesh(new THREE.DodecahedronGeometry(34, 0), snowM);
    peakCone.position.set(peak.x + 22, def.elevation(1) + 22, peak.z + 48);
    peakCone.scale.set(2.4, 3.2, 2.2);
    add(peakCone);
    const liftA = her(33.2924, 35.7802);
    const liftB = her(33.3084, 35.7876);
    const nA = nearestIndex(built.samples, liftA.x, liftA.z, 0);
    const sA = built.samples[nA.index];
    liftA.x = sA.x + sA.rx * (built.width / 2 + 20);
    liftA.z = sA.z + sA.rz * (built.width / 2 + 20);
    const nB = nearestIndex(built.samples, liftB.x, liftB.z, 0);
    const sB = built.samples[nB.index];
    liftB.x = sB.x + sB.rx * (built.width / 2 + 20);
    liftB.z = sB.z + sB.rz * (built.width / 2 + 20);
    const postGeo = new THREE.CylinderGeometry(0.35, 0.5, 14, 8);
    const postA = new THREE.Mesh(postGeo, rock);
    postA.position.set(liftA.x, sA.y + 7, liftA.z);
    add(postA);
    const postB = new THREE.Mesh(postGeo, rock);
    postB.position.set(liftB.x, sB.y + 7, liftB.z);
    add(postB);
    const dx = liftB.x - liftA.x;
    const dy = (sB.y + 13) - (sA.y + 13);
    const dz = liftB.z - liftA.z;
    const cableLen = Math.hypot(dx, dy, dz) || 1;
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, cableLen, 6), bandMat);
    cable.position.set((liftA.x + liftB.x) * 0.5, (sA.y + sB.y) * 0.5 + 13, (liftA.z + liftB.z) * 0.5);
    cable.rotation.z = Math.atan2(dx, dy || 1);
    cable.rotation.x = Math.atan2(dz, Math.hypot(dx, dy) || 1);
    add(cable);
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 2;
      const shoulder = new THREE.Mesh(new THREE.DodecahedronGeometry(16, 0), k % 2 ? snowM : rock);
      shoulder.position.set(peak.x + 22 + Math.cos(a) * 48, def.elevation(1) + 6, peak.z + 48 + Math.sin(a) * 36);
      shoulder.scale.set(1.6, 2.1, 1.5);
      add(shoulder);
    }
    for (let i = 2; i < built.samples.length - 2; i += 2) {
      const s = built.samples[i];
      const towardPeak = s.rx * (peak.x - s.x) + s.rz * (peak.z - s.z) >= 0 ? 1 : -1;
      const berm = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.6, 4.2), snowM);
      berm.position.set(s.x + s.rx * (built.width / 2 + 6.4) * towardPeak, s.y + 0.7, s.z + s.rz * (built.width / 2 + 6.4) * towardPeak);
      berm.rotation.y = Math.atan2(s.tx, s.tz);
      add(berm);
    }
    const nSlope = Math.min(40, built.samples.length);
    const stepS = Math.max(1, Math.floor(built.samples.length / nSlope));
    for (let i = 0; i < built.samples.length; i += stepS) {
      const s = built.samples[i];
      const towardPeak = s.rx * (peak.x - s.x) + s.rz * (peak.z - s.z) >= 0 ? 1 : -1;
      const ms = towardPeak;
      const vs = -ms;
      const d = built.width / 2 + 32;
      const mx = s.x + s.rx * d * ms;
      const mz = s.z + s.rz * d * ms;
      const h = 16 + s.y * 0.22;
      const ridge = new THREE.Mesh(new THREE.DodecahedronGeometry(10 + i % 3 * 3, 0), s.y > 40 ? snowM : rock);
      ridge.position.set(mx, s.y + h * 0.22, mz);
      ridge.scale.set(1.4, 1.8 + s.y * 0.012, 1.2);
      add(ridge);
    }
    const village = [
      { lat: 33.2692, lon: 35.7704 },
      { lat: 33.2698, lon: 35.7718 },
      { lat: 33.2684, lon: 35.7724 },
      { lat: 33.2704, lon: 35.7708 },
      { lat: 33.269, lon: 35.77 },
      { lat: 33.2708, lon: 35.7714 }
    ];
    for (let i = 0; i < village.length; i++) {
      const p = her(village[i].lat, village[i].lon);
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      const extra = built.width / 2 + 22;
      if (n.dist < extra) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * extra;
        p.z = s.z + s.rz * extra;
      }
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4.2, 7.4), stone);
      house.position.set(p.x, built.samples[n.index].y + 2.2, p.z);
      add(house);
      const rf = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.8, 4), snowM);
      rf.rotation.y = Math.PI / 4;
      rf.position.set(p.x, built.samples[n.index].y + 5.8, p.z);
      add(rf);
    }
    const lodgeY = def.elevation(0.9);
    {
      const nL = nearestIndex(built.samples, peak.x, peak.z, 0);
      const sL = built.samples[nL.index];
      const lx = sL.x + sL.rx * (built.width / 2 + 22);
      const lz = sL.z + sL.rz * (built.width / 2 + 22);
      const lodge = new THREE.Mesh(new THREE.BoxGeometry(16, 5.4, 10), rock);
      lodge.position.set(lx, lodgeY + 2.8, lz);
      add(lodge);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(11, 5.4, 4), snowM);
      roof.position.set(lx, lodgeY + 8.4, lz);
      add(roof);
    }
    const snowField = new THREE.Mesh(new THREE.CircleGeometry(168, 24), snowM);
    snowField.rotation.x = -Math.PI / 2;
    snowField.position.set(peak.x + 18, def.elevation(1) + 0.35, peak.z + 28);
    add(snowField);
    const mid = her(33.294, 35.778);
    const midY = def.elevation(0.55);
    for (let i = 0; i < 12; i++) {
      const u = i / 11;
      const px = lerp(mid.x, peak.x, u);
      const pz = lerp(mid.z, peak.z, u);
      const py = lerp(midY, lodgeY, u);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 9, 6), cream);
      pole.position.set(px + 10, py + 4.5, pz + 6);
      add(pole);
      if (i < 11) {
        const cable = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(peak.x - mid.x, peak.z - mid.z) / 11 + 0.4, 0.07, 0.07), cream);
        cable.position.set(px + 10 + (peak.x - mid.x) / 22, py + 8.6 + (lodgeY - midY) / 22, pz + 6 + (peak.z - mid.z) / 22);
        cable.lookAt(peak.x + 10, lodgeY + 9, peak.z + 6);
        add(cable);
      }
      if (i % 2 === 0) {
        const chair = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.1), cream);
        chair.position.set(px + 10, py + 6.4, pz + 6);
        add(chair);
      }
    }
    const nim = her(33.2526, 35.7147);
    const fort = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 12), stone);
    fort.position.set(nim.x, 10, nim.z);
    add(fort);
    const keepT = new THREE.Mesh(new THREE.BoxGeometry(7, 14, 7), stone);
    keepT.position.set(nim.x, 14, nim.z);
    add(keepT);
    glowAt(peak.x - 18, lodgeY + 10, peak.z - 8, 16771272, 26, 18);
    hit(peak.x - 18, peak.z - 8, 9);
    hit(nim.x, nim.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
