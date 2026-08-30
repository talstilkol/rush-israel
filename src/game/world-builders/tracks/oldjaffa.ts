import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tlv } from "../../tracks";
import { getJaffaClock } from "../../clock-assets";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildOldjaffa(context: TrackWorldBuilderContext): void {
  const {
    bag,
    isNight,
    emitList,
    built,
    add,
    glowAt,
    hit,
    white,
    cream,
    terracotta,
    wood,
    darkArch,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ochre = new THREE.MeshStandardMaterial({
      color: 0xc4a070,
      roughness: 0.9,
      envMapIntensity: 0.22
    });
    const ochreDark = new THREE.MeshStandardMaterial({
      color: 0xa07848,
      roughness: 0.92
    });
    const lime = new THREE.MeshStandardMaterial({
      color: 13215092,
      roughness: 0.82
    });
    bag.push(ochre, ochreDark, lime);
    const ck = tlv(32.0556, 34.7558);
    {
      const n = nearestIndex(built.samples, ck.x, ck.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        ck.x = s.x + s.rx * (built.width / 2 + 22);
        ck.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const tower = new THREE.Mesh(new THREE.BoxGeometry(5.2, 32, 5.2), ochre);
    tower.position.set(ck.x, 17.2, ck.z);
    add(tower);
    for (let y = 6.2; y < 30; y += 4.6) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(5.55, 0.36, 5.55), lime);
      band.position.set(ck.x, y, ck.z);
      add(band);
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(8.4, 4.2, 8.4), ochreDark);
    base.position.set(ck.x, 2.1, ck.z);
    add(base);
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 0.18, 20), ochreDark);
    plaza.position.set(ck.x - 6, 0.1, ck.z);
    add(plaza);
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.24, 5.8), lime);
    balcony.position.set(ck.x, 18.8, ck.z);
    add(balcony);
    for (let lvl = 0; lvl < 4; lvl++) {
      for (const a of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.32, 10, 1, false, 0, Math.PI), darkArch);
        arch.rotation.z = Math.PI / 2;
        arch.position.set(ck.x + Math.sin(a) * 2.45, 4.8 + lvl * 3.6, ck.z + Math.cos(a) * 2.45);
        arch.rotation.y = a;
        add(arch);
      }
    }
    const clockTex = getJaffaClock();
    const faceMat = new THREE.MeshStandardMaterial({
      map: clockTex ?? undefined,
      color: clockTex ? 0xffffff : 0xf4eee0,
      roughness: 0.45,
      emissive: 3351050,
      emissiveIntensity: isNight ? 0.55 : 0.08
    });
    emitList.push({
      mat: faceMat,
      night: 0.55,
      day: 0.08
    });
    bag.push(faceMat);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.05, 22), faceMat);
      face.position.set(ck.x + Math.sin(a) * 2.66, 26.4, ck.z + Math.cos(a) * 2.66);
      face.lookAt(ck.x + Math.sin(a) * 8, 26.4, ck.z + Math.cos(a) * 8);
      add(face);
    }
    const cap = new THREE.Mesh(new THREE.ConeGeometry(3.6, 6.4, 4), ochreDark);
    cap.rotation.y = Math.PI / 4;
    cap.position.set(ck.x, 36.2, ck.z);
    add(cap);
    const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 2.8, 6), ochreDark);
    finial.position.set(ck.x, 40.2, ck.z);
    add(finial);
    hit(ck.x, ck.z, 5.5, 4.2, 4.2);
    for (let i = 0; i < 22; i++) {
      const a = i / 22 * Math.PI * 1.7 + 0.35;
      const hx = ck.x + Math.cos(a) * (22 + i % 4 * 5);
      const hz = ck.z + Math.sin(a) * (20 + i % 3 * 6);
      if (nearestIndex(built.samples, hx, hz, 0).dist < built.width / 2 + 10) continue;
      const h = 5.2 + i % 4 * 1.6;
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.2 + i % 3, h, 5.4 + i % 2), i % 2 ? ochre : ochreDark);
      house.position.set(hx, h * 0.5, hz);
      add(house);
      const vault = new THREE.Mesh(new THREE.CylinderGeometry(2.4 + i % 2 * 0.4, 2.4 + i % 2 * 0.4, 6.4 + i % 3, 10, 1, false, 0, Math.PI), ochreDark);
      vault.rotation.z = Math.PI / 2;
      vault.position.set(hx, h + 0.9, hz);
      add(vault);
      const arch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.3), darkArch);
      arch.position.set(hx, 1.2, hz + 2.8);
      add(arch);
      if (i % 3 === 0) {
        const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), lime);
        dome.position.set(hx, h + 2.4, hz);
        add(dome);
      }
      hit(hx, hz, 3.4, 3.2, 2.8);
    }
    const mq = tlv(32.0564, 34.7568);
    {
      const n = nearestIndex(built.samples, mq.x, mq.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        mq.x = s.x + s.rx * (built.width / 2 + 26);
        mq.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const mosque = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 14), ochre);
    mosque.position.set(mq.x, 4, mq.z);
    add(mosque);
    const mdome = new THREE.Mesh(new THREE.SphereGeometry(4.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
    mdome.position.set(mq.x, 8.2, mq.z);
    add(mdome);
    const minaret2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.45, 22, 10), lime);
    minaret2.position.set(mq.x + 7, 11, mq.z - 4);
    add(minaret2);
    const mcap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.8, 8), cream);
    mcap.position.set(mq.x + 7, 23.4, mq.z - 4);
    add(mcap);
    const pt = tlv(32.0524, 34.7492);
    const quay = new THREE.Mesh(new THREE.BoxGeometry(22, 0.7, 86), ochreDark);
    quay.position.set(pt.x, 0.18, pt.z);
    add(quay);
    for (const sh of [
      {
        lat: 32.0516,
        lon: 34.7494
      },
      {
        lat: 32.0522,
        lon: 34.7496
      },
      {
        lat: 32.0528,
        lon: 34.7498
      },
      {
        lat: 32.0534,
        lon: 34.75
      }
    ]) {
      const p = tlv(sh.lat, sh.lon);
      {
        const n = nearestIndex(built.samples, p.x, p.z, 0);
        if (n.dist < built.width / 2 + 10) {
          const s = built.samples[n.index];
          p.x = s.x + s.rx * (built.width / 2 + 18);
          p.z = s.z + s.rz * (built.width / 2 + 18);
        }
      }
      const shed = new THREE.Mesh(new THREE.BoxGeometry(18, 6.4, 14), ochre);
      shed.position.set(p.x, 3.2, p.z);
      add(shed);
      for (let a = 0; a < 3; a++) {
        const door = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 0.4), darkArch);
        door.position.set(p.x - 9, 1.9, p.z - 4 + a * 4);
        add(door);
      }
      const roof = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 16), terracotta);
      roof.position.set(p.x, 6.6, p.z);
      add(roof);
      hit(p.x, p.z, 6);
    }
    const hullCols = [
      12860456,
      15262940,
      2779786,
      13934688
    ];
    for (let i = 0; i < 9; i++) {
      const col = hullCols[i % hullCols.length];
      const hullMat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.55
      });
      bag.push(hullMat);
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 9.2), hullMat);
      hull.position.set(pt.x - 22 - i % 3 * 5, 0.7, pt.z - 30 + i * 8);
      hull.rotation.y = 0.12;
      add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 3.2), white);
      cabin.position.set(pt.x - 22 - i % 3 * 5, 2.1, pt.z - 30 + i * 8);
      add(cabin);
    }
    const pier = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 22), wood);
    pier.position.set(pt.x - 18, 0.4, pt.z + 8);
    add(pier);
    {
      const lh = tlv(32.0533, 34.751);
      const nL = nearestIndex(built.samples, lh.x, lh.z, 0);
      if (nL.dist < built.width / 2 + 12) {
        const sL = built.samples[nL.index];
        lh.x = sL.x + sL.rx * (built.width / 2 + 26);
        lh.z = sL.z + sL.rz * (built.width / 2 + 26);
      }
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.55, 14, 10), lime);
      stem.position.set(lh.x, 7.2, lh.z);
      add(stem);
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.5, 2.4, 10), cream);
      lantern.position.set(lh.x, 15.4, lh.z);
      add(lantern);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff2c8 }));
      lamp.position.set(lh.x, 16.8, lh.z);
      add(lamp);
      glowAt(lh.x, 16.8, lh.z, 16777136, 22, 16);
      hit(lh.x, lh.z, 2.4);
    }
    const ch = tlv(32.0546, 34.7508);
    {
      const n = nearestIndex(built.samples, ch.x, ch.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        ch.x = s.x + s.rx * (built.width / 2 + 22);
        ch.z = s.z + s.rz * (built.width / 2 + 22);
      }
    }
    const nave = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 22), cream);
    nave.position.set(ch.x, 8, ch.z);
    add(nave);
    const belfry = new THREE.Mesh(new THREE.BoxGeometry(6.2, 28, 6.2), cream);
    belfry.position.set(ch.x - 2, 16, ch.z - 8);
    add(belfry);
    const bclock = new THREE.Mesh(new THREE.CircleGeometry(1.05, 16), faceMat);
    bclock.position.set(ch.x - 2, 26, ch.z - 11.2);
    add(bclock);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(4.2, 7.4, 4), cream);
    spire.rotation.y = Math.PI / 4;
    spire.position.set(ch.x - 2, 33.4, ch.z - 8);
    add(spire);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.2, 0.18), white);
    cross.position.set(ch.x - 2, 38, ch.z - 8);
    add(cross);
    tlv(32.054, 34.7522);
    const oldHouses = [
      {
        lat: 32.0538,
        lon: 34.7532,
        w: 6.2,
        h: 5.4,
        d: 5.8,
        col: ochre
      },
      {
        lat: 32.054,
        lon: 34.7536,
        w: 5.6,
        h: 6.8,
        d: 5.2,
        col: ochreDark
      },
      {
        lat: 32.0544,
        lon: 34.7534,
        w: 7.4,
        h: 5.2,
        d: 6.4,
        col: lime
      },
      {
        lat: 32.0548,
        lon: 34.753,
        w: 5.8,
        h: 7.2,
        d: 5.4,
        col: ochre
      },
      {
        lat: 32.0546,
        lon: 34.754,
        w: 6.6,
        h: 6,
        d: 5.6,
        col: ochreDark
      },
      {
        lat: 32.0536,
        lon: 34.7538,
        w: 5.2,
        h: 5.8,
        d: 6.2,
        col: lime
      },
      {
        lat: 32.0534,
        lon: 34.7544,
        w: 6.8,
        h: 4.8,
        d: 5.4,
        col: ochre
      },
      {
        lat: 32.055,
        lon: 34.7538,
        w: 5.4,
        h: 6.4,
        d: 5.8,
        col: ochreDark
      }
    ];
    for (const h of oldHouses) {
      const p = tlv(h.lat, h.lon);
      const nearH = nearestIndex(built.samples, p.x, p.z, 0);
      if (nearH.dist < built.width / 2 + 8) {
        const s = built.samples[nearH.index];
        p.x = s.x + s.rx * (built.width / 2 + 14);
        p.z = s.z + s.rz * (built.width / 2 + 14);
      }
      const house = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), h.col);
      house.position.set(p.x, 1.6 + h.h * 0.5, p.z);
      add(house);
      const r = new THREE.Mesh(new THREE.BoxGeometry(h.w + 0.4, 0.28, h.d + 0.4), terracotta);
      r.position.set(p.x, 1.6 + h.h + 0.16, p.z);
      add(r);
      const door = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.28, 10, 1, false, 0, Math.PI), darkArch);
      door.rotation.z = Math.PI / 2;
      door.position.set(p.x, 2.4, p.z + h.d * 0.51);
      add(door);
      hit(p.x, p.z, 4);
    }
    const awnCols = [10762792, 12880440, 6961698, 12085296];
    for (let ilat = 0; ilat < 8; ilat++) {
      for (let ilon = 0; ilon < 7; ilon++) {
        const lat = 32.0528 + ilat * 32e-5;
        const lon = 34.7514 + ilon * 38e-5;
        const p = tlv(lat, lon);
        const near = nearestIndex(built.samples, p.x, p.z, 0);
        if (near.dist < built.width / 2 + 11) continue;
        const seed = ilat * 7 + ilon;
        const hh = 4.4 + seed % 5 * 0.85;
        const ww = 5.2 + seed % 3 * 0.7;
        const dd = 4.8 + seed % 2 * 0.8;
        const col = seed % 3 === 0 ? ochre : seed % 3 === 1 ? ochreDark : lime;
        const yHill = 0.4 + ilon * 0.35;
        const house = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), col);
        house.position.set(p.x, yHill + hh * 0.5, p.z);
        add(house);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.5, 0.28, dd + 0.5), terracotta);
        roof.position.set(p.x, yHill + hh + 0.2, p.z);
        add(roof);
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.12), darkArch);
        win.position.set(p.x, yHill + 2.2, p.z + dd * 0.51);
        add(win);
        if (seed % 4 === 0) {
          const awn = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: awnCols[seed % 4], roughness: 0.9 }));
          awn.position.set(p.x, yHill + 2.8, p.z + dd * 0.55);
          add(awn);
        }
        hit(p.x, p.z, 3.2);
      }
    }
    const lightH = tlv(32.0533, 34.7502);
    const lightBase = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.2, 11, 12), cream);
    lightBase.position.set(lightH.x, 5.6, lightH.z);
    add(lightBase);
    const gallery = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.35, 12), ochreDark);
    gallery.position.set(lightH.x, 11.3, lightH.z);
    add(gallery);
    const lightTop = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 2.8, 10), white);
    lightTop.position.set(lightH.x, 12.8, lightH.z);
    add(lightTop);
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(1.05, 10, 8), new THREE.MeshBasicMaterial({ color: 16773828 }));
    lantern.position.set(lightH.x, 14.2, lightH.z);
    add(lantern);
    const lightCap = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.6, 8), ochreDark);
    lightCap.position.set(lightH.x, 15.6, lightH.z);
    add(lightCap);
    glowAt(lightH.x, 14.2, lightH.z, 16771232, 22, 18);
    const kdm = tlv(32.0542, 34.752);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 14), ochre);
    well.position.set(kdm.x, 0.4, kdm.z);
    add(well);
    const flea = tlv(32.0535, 34.7588);
    const cloth = [
      new THREE.MeshStandardMaterial({ color: 10762792, roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 12884544, roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 3824248, roughness: 0.88 })
    ];
    bag.push(...cloth);
    for (let i = 0; i < 8; i++) {
      const pierA = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.4, 1.6), ochre);
      pierA.position.set(flea.x + i * 4.2, 2.7, flea.z);
      add(pierA);
      if (i < 7) {
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.1, 1.8), ochreDark);
        lintel.position.set(flea.x + i * 4.2 + 2.1, 5.6, flea.z);
        add(lintel);
        const shop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 0.3), darkArch);
        shop.position.set(flea.x + i * 4.2 + 2.1, 2.2, flea.z + 0.9);
        add(shop);
        const awn = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 2.4), cloth[i % 3]);
        awn.position.set(flea.x + i * 4.2 + 2.1, 4.4, flea.z + 1.6);
        add(awn);
      }
    }
    const rock = tlv(32.0528, 34.7486);
    const andromeda = new THREE.Mesh(new THREE.DodecahedronGeometry(3.4, 0), ochreDark);
    andromeda.position.set(rock.x, 0.6, rock.z);
    add(andromeda);
    glowAt(ck.x, 26, ck.z, 16770736, 36, 28);
    glowAt(ch.x - 2, 30, ch.z - 8, 16771272, 28, 24);
    glowAt(pt.x, 6, pt.z, 16763e3, 24, 22);
    const skipJ = (x: number, z: number, r: number) => {
      const n = nearestIndex(built.samples, x, z, 0);
      if (n.dist > built.width / 2 + 5) hit(x, z, r);
    };
    skipJ(ck.x, ck.z, 4.5);
    skipJ(ch.x, ch.z, 7);
    skipJ(mq.x, mq.z, 7);
    skipJ(pt.x, pt.z, 6);
    skipJ(lightH.x, lightH.z, 3);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
