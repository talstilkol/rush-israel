import * as THREE from "three";
import { sampleAtT } from "../../spline";
import { clearRoadsidePoint } from "../../roadside";
import { hwy6 } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHw6(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    hitBox,
    wood,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const conc = new THREE.MeshStandardMaterial({ color: 12105908, roughness: 0.7 });
    const olive = new THREE.MeshStandardMaterial({ color: 4874808, roughness: 0.9, flatShading: true });
    const greenSign = new THREE.MeshStandardMaterial({ color: 1731130, roughness: 0.55 });
    bag.push(conc, olive, greenSign);
    const ks = hwy6(32.134, 34.932);
    const over = new THREE.Mesh(new THREE.BoxGeometry(42, 1.6, 12), conc);
    over.position.set(ks.x, 9.2, ks.z);
    add(over);
    for (const side of [-1, 1]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(3.6, 9, 3.6), conc);
      pier.position.set(ks.x + side * 18, 4.6, ks.z);
      pier.name = `rush-hw6-pier-${side}`;
      add(pier);
      hitBox(pier);
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 28), conc);
      ramp.position.set(ks.x + side * 22, 4.4, ks.z);
      ramp.rotation.z = side * 0.18;
      add(ramp);
    }
    const ey = hwy6(32.21, 34.978);
    // A straight gantry must clear both sides without spanning another route fold.
    const candidates = [...built.samples].sort((a, b) =>
      (a.x - ey.x) ** 2 + (a.z - ey.z) ** 2 - ((b.x - ey.x) ** 2 + (b.z - ey.z) ** 2) || a.s - b.s);
    let alignment: { frame: typeof built.samples[number]; poles: { x: number; z: number }[] } | undefined;
    for (const candidate of candidates) {
      const frame = sampleAtT(built.samples, candidate.t);
      try {
        const poles = [-1, 1].map(side => clearRoadsidePoint(built, candidate.t, side, Math.hypot(0.3, 0.3), false));
        if (Math.hypot(poles[1].x - poles[0].x, poles[1].z - poles[0].z) <= built.width + 16 + 1e-6) {
          alignment = { frame, poles };
          break;
        }
      } catch (error) {
        if (!(error instanceof Error) || !error.message.startsWith("No clear roadside point")) throw error;
      }
    }
    if (!alignment) throw new Error("No nearby clear two-sided Eyal gantry position");
    const { frame, poles } = alignment;
    const yaw = Math.atan2(frame.tx, frame.tz);
    const center = { x: (poles[0].x + poles[1].x) / 2, z: (poles[0].z + poles[1].z) / 2 };
    const span = Math.hypot(poles[1].x - poles[0].x, poles[1].z - poles[0].z);
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(span + 2, 0.6, 1.4), conc);
    gantry.position.set(center.x, 8.2, center.z);
    gantry.rotation.y = yaw;
    gantry.name = "rush-hw6-eyal-gantry";
    add(gantry);
    for (const [index, side] of [-1, 1].entries()) {
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 8.2, 0.6), conc);
      pole.position.set(poles[index].x, 4.2, poles[index].z);
      pole.rotation.y = yaw;
      pole.name = `rush-hw6-pole-${side}`;
      add(pole);
      hitBox(pole);
    }
    const sign = new THREE.Mesh(new THREE.BoxGeometry(10, 2.4, 0.2), greenSign);
    sign.position.set(center.x + frame.tx * 0.8, 8.2, center.z + frame.tz * 0.8);
    sign.rotation.y = yaw;
    sign.name = "rush-hw6-eyal-sign";
    add(sign);
    const nc = hwy6(32.062, 34.948);
    const gantry2 = new THREE.Mesh(new THREE.BoxGeometry(26, 0.5, 1.2), conc);
    gantry2.position.set(nc.x, 7.8, nc.z);
    add(gantry2);
    for (let i = 0; i < 24; i++) {
      const p = hwy6(32.09 + i % 8 * 8e-3, 34.956 + Math.floor(i / 8) * 0.01);
      const tree = new THREE.Mesh(new THREE.SphereGeometry(2.2 + i % 3 * 0.4, 6, 5), olive);
      tree.position.set(p.x, 2.4, p.z);
      add(tree);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 2.6, 5), wood);
      tr.position.set(p.x, 1.2, p.z);
      add(tr);
    }
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
