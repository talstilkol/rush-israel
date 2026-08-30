import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tlv } from "../../tracks";
import { getIsraelFlag } from "../../flag-assets";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildRothschild(context: TrackWorldBuilderContext): void {
  const {
    group,
    bag,
    shadows,
    colliders,
    built,
    add,
    glowAt,
    hit,
    white,
    gold,
    cream,
    terracotta,
    darkGlass,
    bandMat,
    _dummy,
    barkTexture,
    curtainTexture,
    foliageTexture,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const grassM = new THREE.MeshStandardMaterial({
      color: 3832386,
      roughness: 0.92
    });
    const walkM = new THREE.MeshStandardMaterial({
      color: 12890256,
      roughness: 0.88
    });
    const asphM = new THREE.MeshStandardMaterial({
      color: 2763822,
      roughness: 0.78
    });
    const trunkM = new THREE.MeshStandardMaterial({
      map: barkTexture(),
      color: 0x6a5038,
      roughness: 0.94
    });
    const leafM = new THREE.MeshStandardMaterial({
      map: foliageTexture(),
      color: 0x2a6a28,
      roughness: 0.82,
      flatShading: true
    });
    const peach = new THREE.MeshStandardMaterial({
      color: 15255720,
      roughness: 0.7
    });
    const sandH = new THREE.MeshStandardMaterial({
      color: 14206112,
      roughness: 0.74
    });
    bag.push(grassM, walkM, asphM, trunkM, leafM, peach, sandH);
    const n = built.samples.length;
    const medPos = [];
    const medIdx = [];
    const walkPos = [];
    const walkIdx = [];
    const medHalf = 6.2;
    const pathHalf = 1.5;
    for (let i = 0; i <= n; i++) {
      const s = built.samples[i % n];
      const y = s.y + 0.08;
      medPos.push(s.x - s.rx * medHalf, y, s.z - s.rz * medHalf);
      medPos.push(s.x + s.rx * medHalf, y, s.z + s.rz * medHalf);
      walkPos.push(s.x - s.rx * pathHalf, y + 0.04, s.z - s.rz * pathHalf);
      walkPos.push(s.x + s.rx * pathHalf, y + 0.04, s.z + s.rz * pathHalf);
    }
    for (let i = 0; i < n; i++) {
      const a = i * 2;
      medIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      walkIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const mkRibbon = (pos: number[], idx: number[], mat: THREE.Material) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat);
      m.receiveShadow = true;
      group.add(m);
      bag.push(g);
    };
    mkRibbon(medPos, medIdx, grassM);
    mkRibbon(walkPos, walkIdx, walkM);
    const curbM = new THREE.MeshStandardMaterial({
      color: 13155496,
      roughness: 0.7
    });
    bag.push(curbM);
    const ficusN = 128;
    const trunkG = new THREE.CylinderGeometry(0.95, 1.52, 12.4, 12);
    const leafG = new THREE.SphereGeometry(4.2, 10, 8);
    bag.push(trunkG, leafG);
    const trunks = new THREE.InstancedMesh(trunkG, trunkM, ficusN);
    const leaves = new THREE.InstancedMesh(leafG, leafM, 960);
    trunks.castShadow = shadows;
    leaves.castShadow = shadows;
    let ti = 0;
    let li = 0;
    const stepF = Math.max(1, Math.floor(n / 48));
    for (let i = 2; i < n && ti < ficusN; i += stepF) {
      const s = built.samples[i];
      for (const d of [-3.05, 3.05]) {
        if (ti >= ficusN) break;
        const fx = s.x + s.rx * d;
        const fz = s.z + s.rz * d;
        _dummy.position.set(fx, s.y + 6.2, fz);
        _dummy.scale.set(1, 1, 1);
        _dummy.rotation.set(0, i * 0.7 % 6, 0);
        _dummy.updateMatrix();
        trunks.setMatrixAt(ti, _dummy.matrix);
        const offs = [
          [0, 0.8, 0],
          [2.8, 0.3, 0.9],
          [-2.7, 0.4, 0.7],
          [0.9, 0.7, -2.7],
          [-1.0, 0.3, 2.6],
          [2.0, 2.2, 1.4],
          [-2.1, 2.1, -1.3],
          [0.2, 3.2, 0.3],
          [2.3, 1.6, -1.8],
          [-2.2, 1.7, 1.9],
          [1.4, 2.6, -0.8],
          [-1.5, 2.5, 0.9],
        ];
        for (let k = 0; k < 12; k++) {
          _dummy.position.set(fx + offs[k][0], s.y + 13.4 + offs[k][1], fz + offs[k][2]);
          const sc = 1.12 + (k % 3) * 0.2;
          _dummy.scale.set(sc, sc * 0.88, sc);
          _dummy.updateMatrix();
          leaves.setMatrixAt(li++, _dummy.matrix);
        }
        colliders.push({
          x: fx,
          z: fz,
          r: 1.15,
          kind: "barrier"
        });
        ti++;
      }
    }
    trunks.count = ti;
    leaves.count = li;
    trunks.instanceMatrix.needsUpdate = true;
    leaves.instanceMatrix.needsUpdate = true;
    group.add(trunks, leaves);
    const benchG = new THREE.BoxGeometry(1.8, 0.12, 0.55);
    const benchM = new THREE.MeshStandardMaterial({
      color: 6965802,
      roughness: 0.88
    });
    bag.push(benchG, benchM);
    const benches = new THREE.InstancedMesh(benchG, benchM, 28);
    let bi = 0;
    for (let i = 8; i < n && bi < 28; i += Math.max(4, Math.floor(n / 14))) {
      const s = built.samples[i];
      _dummy.position.set(s.x + s.rx * 1.7, s.y + 0.55, s.z + s.rz * 1.7);
      _dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      benches.setMatrixAt(bi++, _dummy.matrix);
    }
    benches.count = bi;
    benches.instanceMatrix.needsUpdate = true;
    group.add(benches);
    const houseCols = [
      cream,
      white,
      peach,
      sandH
    ];
    const shutter = new THREE.MeshStandardMaterial({
      color: 3824248,
      roughness: 0.55
    });
    bag.push(shutter);
    for (const uh of [
      {
        lat: 32.0636,
        lon: 34.7718,
        w: 11,
        h: 9.2,
        d: 9,
        roof: "tile",
        col: 0
      },
      {
        lat: 32.0648,
        lon: 34.7734,
        w: 10,
        h: 11.4,
        d: 8.2,
        roof: "flat",
        col: 1
      },
      {
        lat: 32.0658,
        lon: 34.7746,
        w: 12,
        h: 10.2,
        d: 8.6,
        roof: "tile",
        col: 2
      },
      {
        lat: 32.067,
        lon: 34.7754,
        w: 9.2,
        h: 13.4,
        d: 8,
        roof: "flat",
        col: 3
      },
      {
        lat: 32.0684,
        lon: 34.7758,
        w: 10.4,
        h: 12.2,
        d: 9,
        roof: "tile",
        col: 0
      },
      {
        lat: 32.0704,
        lon: 34.7757,
        w: 10.6,
        h: 14.8,
        d: 10,
        roof: "flat",
        col: 1
      },
      {
        lat: 32.0718,
        lon: 34.7764,
        w: 11.2,
        h: 11.6,
        d: 8.4,
        roof: "flat",
        col: 2
      },
      {
        lat: 32.0728,
        lon: 34.7782,
        w: 9.4,
        h: 15.2,
        d: 8,
        roof: "flat",
        col: 3
      },
      {
        lat: 32.0742,
        lon: 34.7796,
        w: 10,
        h: 10.8,
        d: 8.6,
        roof: "tile",
        col: 0
      }
    ]) {
      const p = tlv(uh.lat, uh.lon);
      const nearH = nearestIndex(built.samples, p.x, p.z, 0);
      const sH = built.samples[nearH.index];
      const extraH = built.width / 2 + 18;
      if (nearH.dist < extraH) {
        p.x = sH.x + sH.rx * extraH;
        p.z = sH.z + sH.rz * extraH;
      }
      const kinds = ["white", "gold", "white", "teal"];
      const facade = new THREE.MeshStandardMaterial({
        map: curtainTexture(kinds[uh.col % 4]),
        roughness: 0.78,
        color: 15789528
      });
      bag.push(facade);
      const body = new THREE.Mesh(new THREE.BoxGeometry(uh.w, uh.h, uh.d), facade);
      body.position.set(p.x, uh.h * 0.5, p.z);
      add(body);
      const cornice = new THREE.Mesh(new THREE.BoxGeometry(uh.w + 0.7, 0.35, uh.d + 0.5), uh.col % 2 ? terracotta : cream);
      cornice.position.set(p.x, uh.h + 0.1, p.z);
      add(cornice);
      if (uh.roof === "tile") {
        const roof = new THREE.Mesh(new THREE.ConeGeometry(uh.w * 0.72, 2.6, 4), terracotta);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(p.x, uh.h + 1.5, p.z);
        add(roof);
      } else if (uh.roof === "pagoda") for (let k = 0; k < 3; k++) {
        const pg2 = new THREE.Mesh(new THREE.ConeGeometry(uh.w * (0.62 - k * 0.12), 2.1, 6), terracotta);
        pg2.position.set(p.x, uh.h + 1.2 + k * 2.1, p.z);
        add(pg2);
      }
      for (let fl = 0; fl < 3; fl++) for (const wx of [-2.2, 2.2]) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.7), darkGlass);
        win.position.set(p.x + uh.d * 0.51, 2.4 + fl * 2.8, p.z + wx);
        add(win);
      }
      hit(p.x, p.z, 5.5, uh.w * 0.48, uh.d * 0.48);
    }
    const indy = tlv(32.0629, 34.7695);
    {
      const nI = nearestIndex(built.samples, indy.x, indy.z, 0);
      if (nI.dist < built.width / 2 + 12) {
        const sI = built.samples[nI.index];
        indy.x = sI.x + sI.rx * (built.width / 2 + 16);
        indy.z = sI.z + sI.rz * (built.width / 2 + 16);
      }
    }
    {
      const indyM = new THREE.MeshStandardMaterial({ map: curtainTexture("white"), roughness: 0.8, color: 16118744 });
      bag.push(indyM);
      const indyB = new THREE.Mesh(new THREE.BoxGeometry(14.2, 8.4, 11.2), indyM);
      indyB.position.set(indy.x, 4.2, indy.z);
      add(indyB);
      const indyRoof = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.45, 12), white);
      indyRoof.position.set(indy.x, 8.7, indy.z);
      add(indyRoof);
      hit(indy.x, indy.z, 7, 7.2, 5.8);
    }
    const pg = tlv(32.0648, 34.7752);
    {
      const nP = nearestIndex(built.samples, pg.x, pg.z, 0);
      if (nP.dist < built.width / 2 + 12) {
        const sP = built.samples[nP.index];
        pg.x = sP.x + sP.rx * (built.width / 2 + 18);
        pg.z = sP.z + sP.rz * (built.width / 2 + 18);
      }
    }
    const pgBody = new THREE.Mesh(new THREE.BoxGeometry(9.2, 16.5, 9.2), cream);
    pgBody.position.set(pg.x, 8.3, pg.z);
    add(pgBody);
    for (let k = 0; k < 4; k++) {
      const r = 7.4 - k * 1.15;
      const eaves2 = new THREE.Mesh(new THREE.CylinderGeometry(r + 1.3, r, 0.55, 8), terracotta);
      eaves2.position.set(pg.x, 6.2 + k * 3.35, pg.z);
      add(eaves2);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(r + 0.4, 1.8, 8), terracotta);
      roof.position.set(pg.x, 7.3 + k * 3.35, pg.z);
      add(roof);
      const balc = new THREE.Mesh(new THREE.BoxGeometry(r * 1.35, 0.18, r * 1.35), cream);
      balc.position.set(pg.x, 5.7 + k * 3.35, pg.z);
      add(balc);
    }
    const pgCap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), terracotta);
    pgCap.position.set(pg.x, 20.4, pg.z);
    add(pgCap);
    const hb = tlv(32.0734, 34.7826);
    {
      const nB = nearestIndex(built.samples, hb.x, hb.z, 0);
      if (nB.dist < built.width / 2 + 16) {
        const sB = built.samples[nB.index];
        hb.x = sB.x + sB.rx * (built.width / 2 + 28);
        hb.z = sB.z + sB.rz * (built.width / 2 + 28);
      }
    }
    const plaza = new THREE.Mesh(new THREE.CircleGeometry(22, 24), walkM);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(hb.x, 0.12, hb.z);
    add(plaza);
    for (const [dx, dz, h, r] of [
      [
        0,
        0,
        16,
        9.5
      ],
      [
        -9,
        6,
        11,
        7.2
      ],
      [
        9,
        5,
        10,
        6.6
      ]
    ]) {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.04, h, 20), white);
      cyl.position.set(hb.x + dx, h * 0.5, hb.z + dz);
      add(cyl);
    }
    const hbRing = new THREE.Mesh(new THREE.TorusGeometry(10.2, 0.35, 6, 20), cream);
    hbRing.rotation.x = Math.PI / 2;
    hbRing.position.set(hb.x, 15.4, hb.z);
    add(hbRing);
    for (let k = 0; k < 5; k++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(9.7, 0.22, 5, 20), cream);
      rib.rotation.x = Math.PI / 2;
      rib.position.set(hb.x, 3.2 + k * 2.6, hb.z);
      add(rib);
    }
    const hbLid = new THREE.Mesh(new THREE.CylinderGeometry(10.4, 9.2, 1.4, 20), white);
    hbLid.position.set(hb.x, 16.6, hb.z);
    add(hbLid);
    const ind = tlv(32.0624, 34.7682);
    {
      const nN = nearestIndex(built.samples, ind.x, ind.z, 0);
      if (nN.dist < built.width / 2 + 12) {
        const sN = built.samples[nN.index];
        ind.x = sN.x + sN.rx * (built.width / 2 + 18);
        ind.z = sN.z + sN.rz * (built.width / 2 + 18);
      }
    }
    const hall = new THREE.Mesh(new THREE.BoxGeometry(16, 8.4, 11.4), cream);
    hall.position.set(ind.x, 4.6, ind.z);
    add(hall);
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.28, 2.6), cream);
    balcony.position.set(ind.x, 5.8, ind.z + 6.4);
    add(balcony);
    const railIH = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.72, 0.12), white);
    railIH.position.set(ind.x, 6.3, ind.z + 7.5);
    add(railIH);
    for (const sx of [-5.4, -1.8, 1.8, 5.4]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 6.2, 10), white);
      col.position.set(ind.x + sx, 3.5, ind.z + 5.9);
      add(col);
    }
    for (const [wx, wy] of [[-4.2, 3.2], [0, 3.2], [4.2, 3.2], [-4.2, 6.4], [0, 6.4], [4.2, 6.4]]) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.9), darkGlass);
      win.position.set(ind.x + wx, wy, ind.z + 5.75);
      add(win);
    }
    const eaves = new THREE.Mesh(new THREE.BoxGeometry(17.6, 0.5, 12.4), terracotta);
    eaves.position.set(ind.x, 9, ind.z);
    add(eaves);
    const ihPole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 7.6, 6), bandMat);
    ihPole.position.set(ind.x + 7.2, 8.6, ind.z + 4.2);
    add(ihPole);
    const roofIH = new THREE.Mesh(new THREE.ConeGeometry(11.2, 3.4, 4), terracotta);
    roofIH.rotation.y = Math.PI / 4;
    roofIH.position.set(ind.x, 11.1, ind.z);
    add(roofIH);
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 8.4, 6), white);
    flagPole.position.set(ind.x, 14.6, ind.z);
    add(flagPole);
    const flagTex = getIsraelFlag();
    const flagW = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.1),
      new THREE.MeshBasicMaterial({ map: flagTex ?? undefined, color: flagTex ? 0xffffff : 0xf4f6f8, side: THREE.DoubleSide }),
    );
    flagW.position.set(ind.x + 1.7, 17.4, ind.z);
    add(flagW);
    const me = tlv(32.0658, 34.7768);
    const meier = new THREE.Mesh(new THREE.BoxGeometry(8.2, 70, 8.2), white);
    meier.position.set(me.x, 35, me.z);
    add(meier);
    const meierGold = new THREE.Mesh(new THREE.BoxGeometry(9.2, 5.4, 9.2), gold);
    meierGold.position.set(me.x, 72.4, me.z);
    add(meierGold);
    glowAt(me.x, 74, me.z, 16764006, 26, 24);
    glowAt(hb.x, 16, hb.z, 16771272, 22, 18);
    hit(hb.x, hb.z, 10);
    hit(ind.x, ind.z, 8);
    hit(me.x, me.z, 6);
    const nearPg = nearestIndex(built.samples, pg.x, pg.z, 0);
    if (nearPg.dist > built.width / 2 + 6) hit(pg.x, pg.z, 6);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
