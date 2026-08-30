import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tlv } from "../../tracks";
import { getIsraelFlag } from "../../flag-assets";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildTelaviv(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    hitRoad,
    stone,
    white,
    glass,
    cream,
    terracotta,
    darkGlass,
    paleGlass,
    bandMat,
    azSqGlass,
    gateGlass,
    placeAzrieli,
    placeCityGate,
    placeToHa,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const offTlv = (p: { x: number; z: number }, extra = 26) => {
      const n = nearestIndex(built.samples, p.x, p.z, 0);
      if (n.dist < built.width / 2 + extra) {
        const s = built.samples[n.index];
        p.x = s.x + s.rx * (built.width / 2 + extra);
        p.z = s.z + s.rz * (built.width / 2 + extra);
      }
      return p;
    };
    const az = tlv(32.0744, 34.7938);
    placeAzrieli(1.22);
    placeToHa(1.05);
    placeCityGate(1);
    const saT = offTlv(tlv(32.0714, 34.7866), 28);
    const saronaTw = new THREE.Mesh(new THREE.BoxGeometry(11, 92, 11), glass);
    saronaTw.position.set(saT.x, 46, saT.z);
    add(saronaTw);
    const saCap = new THREE.Mesh(new THREE.BoxGeometry(8.4, 16, 8.4), paleGlass);
    saCap.position.set(saT.x, 100, saT.z);
    add(saCap);
    tlv(32.071, 34.7858);
    const houseSpec = [
      { lat: 32.0706, lon: 34.7848, w: 6.8, d: 8.2, h: 5.8, col: cream, roof: terracotta },
      { lat: 32.071, lon: 34.7852, w: 5.6, d: 7.4, h: 4.8, col: white, roof: terracotta },
      { lat: 32.0714, lon: 34.7846, w: 7.2, d: 6.6, h: 6.4, col: cream, roof: terracotta },
      { lat: 32.0708, lon: 34.7844, w: 6.2, d: 7.8, h: 5.2, col: white, roof: terracotta },
      { lat: 32.0712, lon: 34.7842, w: 5.4, d: 6.8, h: 4.6, col: cream, roof: terracotta },
      { lat: 32.0716, lon: 34.785, w: 8.4, d: 7.2, h: 7.2, col: white, roof: terracotta }
    ];
    for (const h of houseSpec) {
      const p = offTlv(tlv(h.lat, h.lon), 22);
      const house = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), h.col);
      house.position.set(p.x, h.h * 0.5, p.z);
      add(house);
      const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(h.w, h.d) * 0.58, 2.4, 4), h.roof);
      r.rotation.y = Math.PI / 4;
      r.position.set(p.x, h.h + 1.2, p.z);
      add(r);
      hit(p.x, p.z, 4);
    }
    const saHall = offTlv(tlv(32.0712, 34.7844), 22);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(10, 8.4, 16), cream);
    hall.position.set(saHall.x, 4.2, saHall.z);
    add(hall);
    const hallRoof = new THREE.Mesh(new THREE.BoxGeometry(11, 0.5, 17), terracotta);
    hallRoof.position.set(saHall.x, 8.6, saHall.z);
    add(hallRoof);
    hit(saHall.x, saHall.z, 6);
    const mkt = offTlv(tlv(32.0704, 34.7838), 22);
    const mktHall = new THREE.Mesh(new THREE.BoxGeometry(22, 6.2, 9), paleGlass);
    mktHall.position.set(mkt.x, 3.1, mkt.z);
    add(mktHall);
    const mktFrame = new THREE.Mesh(new THREE.BoxGeometry(23.2, 0.35, 10.2), bandMat);
    mktFrame.position.set(mkt.x, 6.4, mkt.z);
    add(mktFrame);
    for (const ox of [-8, 0, 8]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.35, 6.4, 9.4), bandMat);
      rib.position.set(mkt.x + ox, 3.2, mkt.z);
      add(rib);
    }
    hit(mkt.x, mkt.z, 8);
    const ky = offTlv(tlv(32.0754, 34.7874), 30);
    const kirya = new THREE.Mesh(new THREE.BoxGeometry(16, 42, 12), cream);
    kirya.position.set(ky.x, 21, ky.z);
    add(kirya);
    const kirHat = new THREE.Mesh(new THREE.BoxGeometry(17.2, 4.4, 13), bandMat);
    kirHat.position.set(ky.x, 44.2, ky.z);
    add(kirHat);
    const el = offTlv(tlv(32.0804, 34.7942), 32);
    const electra = new THREE.Mesh(new THREE.BoxGeometry(13.2, 88, 13.2), azSqGlass);
    electra.position.set(el.x, 44, el.z);
    add(electra);
    const elMast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 24, 8), bandMat);
    elMast.position.set(el.x, 100, el.z);
    add(elMast);
    const md = offTlv(tlv(32.0798, 34.7934), 32);
    const midA = new THREE.Mesh(new THREE.BoxGeometry(11, 76, 13), gateGlass);
    midA.position.set(md.x - 8, 38, md.z);
    add(midA);
    const midB = new THREE.Mesh(new THREE.BoxGeometry(11, 68, 13), gateGlass);
    midB.position.set(md.x + 8, 34, md.z);
    add(midB);
    const sp = offTlv(tlv(32.0758, 34.7946), 30);
    const spiral = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 9.4, 72, 12), glass);
    spiral.position.set(sp.x, 36, sp.z);
    add(spiral);
    const hb = offTlv(tlv(32.0728, 34.7794), 28);
    const hbPlaza = new THREE.Mesh(new THREE.CylinderGeometry(28, 28, 0.16, 32), stone);
    hbPlaza.position.set(hb.x, 0.08, hb.z);
    add(hbPlaza);
    const hbRing = new THREE.Mesh(new THREE.TorusGeometry(20, 0.55, 6, 28), cream);
    hbRing.rotation.x = Math.PI / 2;
    hbRing.position.set(hb.x, 0.22, hb.z);
    add(hbRing);
    const habima = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 18), white);
    habima.position.set(hb.x, 7, hb.z);
    add(habima);
    const hbUp = new THREE.Mesh(new THREE.BoxGeometry(14, 12, 14), cream);
    hbUp.position.set(hb.x + 7, 19, hb.z - 3);
    hbUp.rotation.y = 0.22;
    add(hbUp);
    const hbUp2 = new THREE.Mesh(new THREE.BoxGeometry(10, 8.4, 10), white);
    hbUp2.position.set(hb.x - 6, 18, hb.z + 4);
    add(hbUp2);
    const hbGarden = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 10), new THREE.MeshStandardMaterial({ color: 0x2a6a28, roughness: 0.9 }));
    hbGarden.position.set(hb.x + 7, 25.2, hb.z - 3);
    add(hbGarden);
    const vineMat = new THREE.MeshStandardMaterial({ color: 3178290, roughness: 0.92 });
    bag.push(vineMat);
    for (const gx of [-9, 9]) {
      const vine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 14, 8), vineMat);
      vine.position.set(hb.x + gx, 9, hb.z);
      add(vine);
    }
    const hbStep = new THREE.Mesh(new THREE.BoxGeometry(28, 1.2, 10), stone);
    hbStep.position.set(hb.x, 0.6, hb.z + 12);
    add(hbStep);
    hit(hb.x, hb.z, 14);
    const ih = offTlv(tlv(32.0629, 34.7716), 24);
    const hallBody = new THREE.Mesh(new THREE.BoxGeometry(13.4, 8.2, 10.2), cream);
    hallBody.position.set(ih.x, 4.1, ih.z);
    add(hallBody);
    const hallBalc = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.22, 2.4), white);
    hallBalc.position.set(ih.x, 5.4, ih.z + 5.6);
    add(hallBalc);
    const hallRail = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.7, 0.08), white);
    hallRail.position.set(ih.x, 5.85, ih.z + 6.7);
    add(hallRail);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6.2, 6), bandMat);
    pole.position.set(ih.x + 5.4, 8.8, ih.z + 4.2);
    add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), new THREE.MeshBasicMaterial({ map: getIsraelFlag() ?? undefined, color: getIsraelFlag() ? 0xffffff : 0x0038b8, side: 2 }));
    flag.position.set(ih.x + 6.7, 11.2, ih.z + 4.2);
    add(flag);
    hit(ih.x, ih.z, 7);
    const ds = offTlv(tlv(32.0732, 34.7888), 28);
    const discount = new THREE.Mesh(new THREE.BoxGeometry(14, 56, 10), darkGlass);
    discount.position.set(ds.x, 28, ds.z);
    add(discount);
    const discCut = new THREE.Mesh(new THREE.BoxGeometry(8, 20, 10), paleGlass);
    discCut.position.set(ds.x + 4, 48, ds.z);
    add(discCut);
    hitRoad(ds.x, ds.z, 7);
    glowAt(az.x, 110, az.z, 8308968, 70, 60);
    hitRoad(az.x + 17.08, az.z, 16, 22, 14);
    hitRoad(saT.x, saT.z, 8);
    hitRoad(ky.x, ky.z, 10);
    hitRoad(el.x, el.z, 8);
    const dz = offTlv(tlv(32.0753, 34.7748), 28);
    const dzPodium = new THREE.Mesh(new THREE.CylinderGeometry(18, 20, 8, 24), cream);
    dzPodium.position.set(dz.x, 4, dz.z);
    add(dzPodium);
    const dzA = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7.8, 36, 16), white);
    dzA.position.set(dz.x - 10, 26, dz.z);
    add(dzA);
    const dzB = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 7.2, 30, 16), cream);
    dzB.position.set(dz.x + 11, 23, dz.z + 4);
    add(dzB);
    const dzRamp = new THREE.Mesh(new THREE.TorusGeometry(14, 1.1, 6, 20, Math.PI * 1.4), stone);
    dzRamp.rotation.x = Math.PI / 2;
    dzRamp.position.set(dz.x, 2.4, dz.z);
    add(dzRamp);
    hitRoad(dz.x, dz.z, 16);
    const fib = offTlv(tlv(32.063, 34.7795), 28);
    const fibM = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 9.2, 78, 3), darkGlass);
    fibM.position.set(fib.x, 39, fib.z);
    fibM.rotation.y = 0.4;
    add(fibM);
    const fibCap = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 8.2, 10, 3), paleGlass);
    fibCap.position.set(fib.x, 83, fib.z);
    fibCap.rotation.y = 0.4;
    add(fibCap);
    hitRoad(fib.x, fib.z, 8);
    const yooA = offTlv(tlv(32.0854, 34.7966), 30);
    const yooB = offTlv(tlv(32.0858, 34.7972), 30);
    const y1 = new THREE.Mesh(new THREE.BoxGeometry(11, 82, 11), paleGlass);
    y1.position.set(yooA.x, 41, yooA.z);
    add(y1);
    const y2 = new THREE.Mesh(new THREE.BoxGeometry(11, 74, 11), glass);
    y2.position.set(yooB.x, 37, yooB.z);
    add(y2);
    hitRoad(yooA.x, yooA.z, 7);
    hitRoad(yooB.x, yooB.z, 7);
    const sm = offTlv(tlv(32.0639, 34.7704), 26);
    const smM = new THREE.Mesh(new THREE.BoxGeometry(16, 62, 10), cream);
    smM.position.set(sm.x, 31, sm.z);
    add(smM);
    const smMast = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 16, 6), bandMat);
    smMast.position.set(sm.x, 70, sm.z);
    add(smMast);
    hitRoad(sm.x, sm.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
