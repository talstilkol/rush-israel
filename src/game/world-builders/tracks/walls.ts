import * as THREE from "three";
import { jer } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildWalls(context: TrackWorldBuilderContext): void {
  const {
    add,
    hit,
    stone,
    merlonWall,
    minaret,
    ottomanGate,
    placeDome,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const jg = jer(31.7764, 35.2276);
    const ng = jer(31.7794, 35.226);
    const ds = jer(31.7817, 35.2304);
    const lg = jer(31.7808, 35.2368);
    const dg = jer(31.7748, 35.2342);
    const zg = jer(31.7728, 35.2292);
    const td = jer(31.7762, 35.2284);
    const dm = jer(31.778, 35.2354);
    const kt = jer(31.7767, 35.2342);
    const c = jer(31.7778, 35.2318);
    const inset = (p: { x: number; z: number }, d = 26) => {
      const dx = c.x - p.x;
      const dz = c.z - p.z;
      const l = Math.hypot(dx, dz) || 1;
      return {
        x: p.x + dx / l * d,
        z: p.z + dz / l * d
      };
    };
    const jgi = inset(jg);
    const ngi = inset(ng);
    const dsi = inset(ds);
    const lgi = inset(lg);
    const dgi = inset(dg);
    const zgi = inset(zg);
    ottomanGate(jgi.x, jgi.z, 0.4);
    ottomanGate(dsi.x, dsi.z, 2.2);
    ottomanGate(lgi.x, lgi.z, 3.3);
    ottomanGate(zgi.x, zgi.z, 5.2);
    merlonWall((jgi.x + ngi.x) * 0.5, (jgi.z + ngi.z) * 0.5, 48, Math.atan2(ngi.x - jgi.x, ngi.z - jgi.z), 12);
    merlonWall((ngi.x + dsi.x) * 0.5, (ngi.z + dsi.z) * 0.5, 58, Math.atan2(dsi.x - ngi.x, dsi.z - ngi.z), 12);
    merlonWall((dsi.x + lgi.x) * 0.5, (dsi.z + lgi.z) * 0.5, 62, Math.atan2(lgi.x - dsi.x, lgi.z - dsi.z), 12);
    merlonWall((lgi.x + dgi.x) * 0.5, (lgi.z + dgi.z) * 0.5, 70, Math.atan2(dgi.x - lgi.x, dgi.z - lgi.z), 12);
    merlonWall((dgi.x + zgi.x) * 0.5, (dgi.z + zgi.z) * 0.5, 55, Math.atan2(zgi.x - dgi.x, zgi.z - dgi.z), 12);
    merlonWall((zgi.x + jgi.x) * 0.5, (zgi.z + jgi.z) * 0.5, 52, Math.atan2(jgi.x - zgi.x, jgi.z - zgi.z), 12);
    const citadel = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 18), stone);
    const tdi = inset(td, 22);
    citadel.position.set(tdi.x, 7, tdi.z);
    add(citadel);
    minaret(tdi.x + 3, tdi.z - 2, 30);
    placeDome(dm.x, dm.z);
    hit(tdi.x, tdi.z, 8);
    hit(kt.x, kt.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
