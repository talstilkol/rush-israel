import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tlv } from "../../tracks";
import { getLaneArrow } from "../../arrow-assets";
import { getSign, getGantry } from "../../sign-assets";
import { getAyalonRoad } from "../../road-assets";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildAyalon(context: TrackWorldBuilderContext): void {
  const {
    group,
    bag,
    shadows,
    movers,
    ramps,
    streets,
    built,
    add,
    glowAt,
    hit,
    hitRoad,
    white,
    cream,
    terracotta,
    darkGlass,
    paleGlass,
    bandMat,
    placeAzrieli,
    placeCityGate,
    placeToHa,
    placeMidtown,
    placeElectra,
    placeSarona,
    placeHakirya,
    placeShalomMeir,
    _dummy,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    tlv(32.0744, 34.7932);
    placeAzrieli(1.42);
    placeToHa(1.28, 32.0695, 34.7894);
    placeCityGate(1);
    placeMidtown(1.15);
    placeElectra(1.2);
    placeSarona(1.32);
    placeHakirya(1.1);
    placeShalomMeir(1.15);
    const parkOff = (lat: number, lon: number, extra: number, east: boolean) => {
      const hint = tlv(lat, lon);
      const n = nearestIndex(built.samples, hint.x, hint.z, 0);
      const s = built.samples[n.index];
      const latOff = east ? built.width + 18 + built.width / 2 + extra : -(built.width / 2 + extra);
      return { x: s.x + s.rx * latOff, z: s.z + s.rz * latOff, y: s.y };
    };
    const ibm = parkOff(32.0856, 34.7987, 36, true);
    const ibmGlass = new THREE.MeshPhysicalMaterial({
      color: 0x3a6e7a,
      roughness: 0.14,
      metalness: 0,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.12
    });
    bag.push(ibmGlass);
    const ibmGeo = new THREE.BoxGeometry(1, 7.2, 1);
    const ibmSlabs = new THREE.InstancedMesh(ibmGeo, ibmGlass, 6);
    ibmSlabs.frustumCulled = false;
    for (let i = 0; i < 6; i++) {
      const w = 20 - i * 2.2;
      _dummy.position.set(ibm.x, 4.2 + i * 8, ibm.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(w, 1, w);
      _dummy.updateMatrix();
      ibmSlabs.setMatrixAt(i, _dummy.matrix);
    }
    ibmSlabs.instanceMatrix.needsUpdate = true;
    ibmSlabs.castShadow = shadows;
    group.add(ibmSlabs);
    bag.push(ibmGeo);
    hit(ibm.x, ibm.z, 12);
    const yovel = parkOff(32.0788, 34.7916, 30, false);
    const yovGlass = new THREE.MeshPhysicalMaterial({
      color: 0x5a7088,
      roughness: 0.12,
      metalness: 0,
      envMapIntensity: 1.45,
      clearcoat: 1
    });
    bag.push(yovGlass);
    const yov = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 8.1, 92, 18), yovGlass);
    yov.position.set(yovel.x, 46, yovel.z);
    add(yov);
    const yovRingYs = [];
    for (let y = 8; y < 88; y += 4.2) yovRingYs.push(y);
    const yovRingGeo = new THREE.TorusGeometry(7.6, 0.12, 5, 18);
    const yovRings = new THREE.InstancedMesh(yovRingGeo, bandMat, yovRingYs.length);
    yovRings.frustumCulled = false;
    for (let i = 0; i < yovRingYs.length; i++) {
      _dummy.position.set(yovel.x, yovRingYs[i], yovel.z);
      _dummy.rotation.set(Math.PI / 2, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      yovRings.setMatrixAt(i, _dummy.matrix);
    }
    yovRings.instanceMatrix.needsUpdate = true;
    group.add(yovRings);
    bag.push(yovRingGeo);
    const yovCrown = new THREE.Mesh(new THREE.CylinderGeometry(9.4, 6.2, 9, 18), bandMat);
    yovCrown.position.set(yovel.x, 96, yovel.z);
    add(yovCrown);
    hit(yovel.x, yovel.z, 10);
    const plat = parkOff(32.0842, 34.8036, 42, true);
    const platM = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.4, 108, 8), darkGlass);
    platM.position.set(plat.x, 54, plat.z);
    platM.rotation.y = 0.28;
    add(platM);
    const platBandYs = [];
    for (let y = 8; y < 100; y += 5.2) platBandYs.push(y);
    const platBandGeo = new THREE.CylinderGeometry(6.7, 7.3, 0.28, 8);
    const platBands = new THREE.InstancedMesh(platBandGeo, bandMat, platBandYs.length);
    platBands.frustumCulled = false;
    for (let i = 0; i < platBandYs.length; i++) {
      _dummy.position.set(plat.x, platBandYs[i], plat.z);
      _dummy.rotation.set(0, 0.28, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      platBands.setMatrixAt(i, _dummy.matrix);
    }
    platBands.instanceMatrix.needsUpdate = true;
    group.add(platBands);
    bag.push(platBandGeo);
    const platHat = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 5.2, 7.2, 8), bandMat);
    platHat.position.set(plat.x, 112, plat.z);
    platHat.rotation.y = 0.28;
    add(platHat);
    hit(plat.x, plat.z, 10);
    const tau = parkOff(32.1124, 34.8046, 48, true);
    const tauLib = new THREE.Mesh(new THREE.CylinderGeometry(10, 11.4, 14, 20), cream);
    tauLib.position.set(tau.x, 7, tau.z);
    add(tauLib);
    const tauDome = new THREE.Mesh(new THREE.SphereGeometry(8.4, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
    tauDome.position.set(tau.x, 14.4, tau.z);
    add(tauDome);
    const hallGeo = new THREE.BoxGeometry(1, 1, 1);
    const halls = new THREE.InstancedMesh(hallGeo, cream, 5);
    halls.frustumCulled = false;
    const hallSpec = [
      [18, 5.2, 8, 14, 6.4, 10],
      [-16, 4.4, -10, 12, 5.6, 9],
      [8, 6.2, -18, 10, 8.4, 16],
      [-22, 3.8, 14, 16, 4.8, 8],
      [24, 3.2, 12, 8, 4.2, 14],
    ];
    hallSpec.forEach((h, i) => {
      _dummy.position.set(tau.x + h[0], h[1], tau.z + h[2]);
      _dummy.rotation.set(0, i * 0.35, 0);
      _dummy.scale.set(h[3], h[4] * 2, h[5]);
      _dummy.updateMatrix();
      halls.setMatrixAt(i, _dummy.matrix);
    });
    halls.instanceMatrix.needsUpdate = true;
    group.add(halls);
    bag.push(hallGeo);
    glowAt(tau.x, 16, tau.z, 0xf2e8d0, 28, 22);
    hit(tau.x, tau.z, 22);
    const hsHint = tlv(32.0735, 34.79605);
    const hsNear = nearestIndex(built.samples, hsHint.x, hsHint.z, 0);
    const hsS = built.samples[hsNear.index];
    const hsMid = built.width / 2 + 9;
    const hs = { x: hsS.x + hsS.rx * hsMid, z: hsS.z + hsS.rz * hsMid };
    const tubeLen = built.width + 42;
    const across = Math.atan2(hsS.rx, hsS.rz);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, tubeLen, 24, 1, true), paleGlass);
    tube.rotation.order = "YZX";
    tube.rotation.set(0, across, Math.PI / 2);
    tube.position.set(hs.x, hsS.y + 15.6, hs.z);
    add(tube);
    const tubeFloor = new THREE.Mesh(new THREE.BoxGeometry(tubeLen, 0.32, 5.2), white);
    tubeFloor.position.set(hs.x, hsS.y + 13.6, hs.z);
    tubeFloor.rotation.y = across;
    add(tubeFloor);
    for (let i = 0; i < 14; i++) {
      const t = i / 13 - 0.5;
      const rib = new THREE.Mesh(new THREE.TorusGeometry(3.55, 0.16, 6, 18), white);
      rib.rotation.order = "YZX";
      rib.rotation.set(0, across, Math.PI / 2);
      rib.position.set(hs.x + hsS.rx * t * tubeLen, hsS.y + 15.6, hs.z + hsS.rz * t * tubeLen);
      add(rib);
    }
    const mallHint = tlv(32.1004, 34.7996);
    const mallNear = nearestIndex(built.samples, mallHint.x, mallHint.z, 0);
    const mallS = built.samples[mallNear.index];
    const mallLat = built.width + 18 + built.width / 2 + 32;
    const mall = { x: mallS.x + mallS.rx * mallLat, z: mallS.z + mallS.rz * mallLat };
    const mallYaw = Math.atan2(mallS.tx, mallS.tz);
    const mallM = new THREE.Mesh(new THREE.BoxGeometry(42, 16, 28), cream);
    mallM.position.set(mall.x, mallS.y + 8, mall.z);
    mallM.rotation.y = mallYaw;
    add(mallM);
    const mallR = new THREE.Mesh(new THREE.BoxGeometry(46, 1.8, 32), white);
    mallR.position.set(mall.x, mallS.y + 16.6, mall.z);
    mallR.rotation.y = mallYaw;
    add(mallR);
    if (mallNear.dist > built.width / 2 + 10) hit(mall.x, mall.z, 20);
    const kit = getAyalonRoad();
    const rampAsphalt = new THREE.MeshPhysicalMaterial({
      map: kit?.map ?? null,
      roughnessMap: kit?.roughnessMap ?? null,
      bumpMap: kit?.bumpMap ?? null,
      bumpScale: kit ? 0.18 : 0,
      color: kit ? 0xffffff : 6053990,
      roughness: 0.45,
      metalness: 0,
      envMapIntensity: 0.85,
      clearcoat: 0.22,
      clearcoatRoughness: 0.4
    });
    const conc = new THREE.MeshStandardMaterial({
      color: 13157044,
      roughness: 0.72
    });
    const greenSign = new THREE.MeshStandardMaterial({
      color: 1731130,
      roughness: 0.55
    });
    bag.push(rampAsphalt, conc, greenSign);
    const pushRamp = (x: number, z: number, sx: number, sz: number, len: number, half: number, y0: number, y12: number, he: string, en: string) => {
      ramps.push({
        x,
        z,
        sx,
        sz,
        len,
        half,
        y0,
        y1: y12,
        he,
        en
      });
      streets.push({
        ax: x - sx * len * 0.5,
        az: z - sz * len * 0.5,
        bx: x + sx * len * 0.5,
        bz: z + sz * len * 0.5,
        half,
        he,
        en
      });
      const yaw = Math.atan2(sx, sz);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(half * 2, 0.95, len), rampAsphalt);
      mesh.position.set(x, (y0 + y12) * 0.5, z);
      mesh.rotation.order = "YXZ";
      mesh.rotation.y = yaw;
      mesh.rotation.x = -Math.atan2(y12 - y0, len);
      mesh.receiveShadow = true;
      add(mesh);
      for (let i = 0; i < 4; i++) {
        const t = (i + 0.5) / 4 - 0.5;
        const px = x + sx * t * len;
        const pz = z + sz * t * len;
        const py = (y0 + y12) * 0.5 + (y12 - y0) * t;
        const h = Math.max(1.4, py);
        const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, h, 8), conc);
        pier.position.set(px, h * 0.5, pz);
        pier.castShadow = true;
        add(pier);
      }
      const rx = sz;
      const rz = -sx;
      for (const side of [-1, 1]) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, len * 0.94), white);
        line.position.set(
          x + rx * (half - 0.22) * side,
          (y0 + y12) * 0.5 + 0.52,
          z + rz * (half - 0.22) * side,
        );
        line.rotation.order = "YXZ";
        line.rotation.y = yaw;
        line.rotation.x = -Math.atan2(y12 - y0, len);
        add(line);
      }
    };
    const gantryMat = (id: string) => {
      const t = getGantry(id);
      if (!t) return greenSign;
      const m = new THREE.MeshBasicMaterial({ map: t, fog: false, side: THREE.DoubleSide });
      bag.push(m);
      return m;
    };
    const gantryId: Record<string, string> = {
      "Kibbutz Galuyot": "gantry-kibbutz-galuyot",
      "HaHagana": "gantry-hahagana",
      "LaGuardia": "gantry-laguardia",
      "HaShalom": "gantry-hashalom",
      "Savidor Center": "gantry-savidor-center",
      "University": "gantry-university",
    };
    for (const ic of [
      {
        lat: 32.0525,
        he: "\u05E7\u05D9\u05D1\u05D5\u05E5 \u05D2\u05DC\u05D5\u05D9\u05D5\u05EA",
        en: "Kibbutz Galuyot"
      },
      {
        lat: 32.0547,
        he: "\u05D4\u05D4\u05D2\u05E0\u05D4",
        en: "HaHagana"
      },
      {
        lat: 32.062,
        he: "\u05DC\u05D4 \u05D2\u05E8\u05D3\u05D9\u05D4",
        en: "LaGuardia"
      },
      {
        lat: 32.0735,
        he: "\u05D4\u05E9\u05DC\u05D5\u05DD",
        en: "HaShalom"
      },
      {
        lat: 32.0837,
        he: "\u05E1\u05D1\u05D9\u05D3\u05D5\u05E8 \u05DE\u05E8\u05DB\u05D6",
        en: "Savidor Center"
      },
      {
        lat: 32.1035,
        he: "\u05D0\u05D5\u05E0\u05D9\u05D1\u05E8\u05E1\u05D9\u05D8\u05D4",
        en: "University"
      }
    ]) {
      const hint = tlv(ic.lat, 34.79605);
      const n0 = nearestIndex(built.samples, hint.x, hint.z, 0);
      const sm0 = built.samples[n0.index];
      const oppOff = built.width + 18;
      const midOff = oppOff / 2;
      const c = { x: sm0.x + sm0.rx * midOff, z: sm0.z + sm0.rz * midOff };
      const yaw = Math.atan2(sm0.tx, sm0.tz);
      const westX = sm0.x - sm0.rx * (built.width / 2 + 2.4);
      const westZ = sm0.z - sm0.rz * (built.width / 2 + 2.4);
      const eastX = sm0.x + sm0.rx * (oppOff + built.width / 2 + 2.4);
      const eastZ = sm0.z + sm0.rz * (oppOff + built.width / 2 + 2.4);
      const deckY = 9.4;
      const span = oppOff + built.width + 16;
      const deck = new THREE.Mesh(new THREE.BoxGeometry(span, 1.15, 16), conc);
      deck.position.set(c.x, deckY, c.z);
      deck.rotation.y = yaw;
      add(deck);
      for (const side of [-7.8, 7.8]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(span, 1.15, 0.22), white);
        rail.position.set(c.x + sm0.tx * side, 10.3, c.z + sm0.tz * side);
        rail.rotation.y = yaw;
        add(rail);
      }
      for (const lat of [-(built.width / 2 + 12), oppOff + built.width / 2 + 12]) {
        const px = sm0.x + sm0.rx * lat;
        const pz = sm0.z + sm0.rz * lat;
        const col = new THREE.Mesh(new THREE.BoxGeometry(1.8, deckY, 1.8), conc);
        col.position.set(px, deckY * 0.5, pz);
        add(col);
        const colNear = nearestIndex(built.samples, px, pz, 0);
        if (colNear.dist > built.width / 2 + 2.5) hitRoad(px, pz, 1.4, 0.95, 0.95);
      }
      for (const lx of [-28, -10, 10, 28]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.4, 6), conc);
        post.position.set(c.x + sm0.rx * lx, deckY + 2.2, c.z + sm0.rz * lx);
        add(post);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc070 }));
        lamp.position.set(c.x + sm0.rx * lx, deckY + 3.9, c.z + sm0.rz * lx);
        add(lamp);
      }
      const signMat = gantryMat(gantryId[ic.en] ?? "gantry-hashalom");
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.2), signMat);
      sign.position.set(c.x, 13.8, c.z);
      sign.rotation.y = yaw + Math.PI;
      add(sign);
      const sign2 = sign.clone();
      sign2.rotation.y = yaw;
      add(sign2);
      for (const gx of [-8, 8]) {
        const gpost = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.6, 0.35), conc);
        gpost.position.set(c.x + sm0.rx * gx, 11.7, c.z + sm0.rz * gx);
        add(gpost);
      }
      const gbar = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.28, 0.28), conc);
      gbar.position.set(c.x, 13.95, c.z);
      gbar.rotation.y = yaw;
      add(gbar);
      const spd = getSign("speed90");
      if (spd) {
        const yawS = yaw;
        const offS = built.width / 2 + 4.2;
        const sx = sm0.x + sm0.rx * offS;
        const sz = sm0.z + sm0.rz * offS;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.4, 6), conc);
        pole.position.set(sx, 1.7, sz);
        add(pole);
        const plate = new THREE.Mesh(
          new THREE.PlaneGeometry(1.6, 1.6),
          new THREE.MeshBasicMaterial({ map: spd, transparent: true, fog: false }),
        );
        plate.position.set(sx, 3.5, sz);
        plate.rotation.y = yawS + Math.PI;
        add(plate);
      }
      const zLen = 68;
      const a = 34;
      pushRamp(westX - sm0.tx * a, westZ - sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, 0.5, deckY, ic.he, ic.en);
      pushRamp(westX + sm0.tx * a, westZ + sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, deckY, 0.5, ic.he, ic.en);
      pushRamp(eastX - sm0.tx * a, eastZ - sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, 0.5, deckY, ic.he, ic.en);
      pushRamp(eastX + sm0.tx * a, eastZ + sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, deckY, 0.5, ic.he, ic.en);
      pushRamp(c.x, c.z, sm0.rx, sm0.rz, span, 10.2, deckY, deckY, ic.he, ic.en);
      {
        const half = built.width / 2;
        pushRamp(sm0.x + sm0.rx * (half * 0.42), sm0.z + sm0.rz * (half * 0.42), sm0.rx, sm0.rz, 32, 12.5, 0.35, deckY, ic.he, ic.en);
        pushRamp(sm0.x - sm0.rx * (half * 0.15), sm0.z - sm0.rz * (half * 0.15), sm0.tx, sm0.tz, 36, half * 0.55, 0.3, 0.3, ic.he, ic.en);
      }
      if (ic.en === "Kibbutz Galuyot") {
        pushRamp(westX - sm0.rx * 20, westZ - sm0.rz * 20, sm0.tx, sm0.tz, 84, 6.4, 0.6, 7.2, ic.he, ic.en);
        pushRamp(eastX + sm0.rx * 20, eastZ + sm0.rz * 20, sm0.tx, sm0.tz, 84, 6.4, 7.2, 0.6, ic.he, ic.en);
        const d = 0.7071;
        const dx = sm0.rx * d + sm0.tx * d;
        const dz = sm0.rz * d + sm0.tz * d;
        const inv = Math.hypot(dx, dz) || 1;
        pushRamp(c.x - 24 * sm0.rx, c.z - 24 * sm0.rz, dx / inv, dz / inv, 54, 6.2, 0.6, deckY, ic.he, ic.en);
        pushRamp(c.x + 24 * sm0.rx, c.z + 24 * sm0.rz, dx / inv, dz / inv, 54, 6.2, deckY, 0.6, ic.he, ic.en);
      }
      if (ic.en === "LaGuardia") {
        const dx = sm0.rx * 0.7071 - sm0.tx * 0.7071;
        const dz = sm0.rz * 0.7071 - sm0.tz * 0.7071;
        const inv = Math.hypot(dx, dz) || 1;
        pushRamp(c.x - 18 * sm0.rx, c.z - 18 * sm0.rz, dx / inv, dz / inv, 44, 6.2, 0.6, deckY, ic.he, ic.en);
        pushRamp(c.x + 18 * sm0.rx, c.z + 18 * sm0.rz, dx / inv, dz / inv, 44, 6.2, deckY, 0.6, ic.he, ic.en);
      }
    }
    for (const ic of [
      { lat: 32.0735, he: "השלום", en: "HaShalom" },
      { lat: 32.0837, he: "סבידור מרכז", en: "Savidor Center" },
    ]) {
      const p = tlv(ic.lat, 34.795);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      const sm = built.samples[near.index];
      const rc = built.width / 2 + 6;
      pushRamp(sm.x + sm.rx * rc, sm.z + sm.rz * rc, sm.tx, sm.tz, 46, 6.4, 0.4, 8.6, ic.he, ic.en);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(16, 0.85, 20), conc);
      wing.position.set(sm.x + sm.rx * (rc + 14), 8.7, sm.z + sm.rz * (rc + 14));
      wing.rotation.y = Math.atan2(sm.tx, sm.tz);
      add(wing);
    }
    const platMat = new THREE.MeshStandardMaterial({
      color: 13157564,
      roughness: 0.7
    });
    const glassRoof = new THREE.MeshPhysicalMaterial({
      color: 11060436,
      roughness: 0.12,
      metalness: 0,
      transparent: true,
      opacity: 0.55,
      envMapIntensity: 1.4
    });
    const silver = new THREE.MeshStandardMaterial({
      color: 14212320,
      metalness: 0,
      roughness: 0.28
    });
    const redStripe = new THREE.MeshStandardMaterial({
      color: 12589096,
      roughness: 0.45,
      metalness: 0
    });
    const purpleStripe = new THREE.MeshStandardMaterial({
      color: 0x4a1a6a,
      roughness: 0.42,
      metalness: 0
    });
    bag.push(platMat, glassRoof, silver, redStripe, purpleStripe);
    const midLon = 34.79605;
    const midOff = built.width / 2 + 9;
    for (const st of [
      {
        lat: 32.0525,
        he: "\u05E7\u05D9\u05D1\u05D5\u05E5 \u05D2\u05DC\u05D5\u05D9\u05D5\u05EA",
        kind: "galuyot"
      },
      {
        lat: 32.0547,
        he: "\u05D4\u05D4\u05D2\u05E0\u05D4",
        kind: "hagana"
      },
      {
        lat: 32.0735,
        he: "\u05D4\u05E9\u05DC\u05D5\u05DD",
        kind: "shalom"
      },
      {
        lat: 32.0837,
        he: "\u05E1\u05D1\u05D9\u05D3\u05D5\u05E8",
        kind: "savidor"
      },
      {
        lat: 32.1035,
        he: "\u05D4\u05D0\u05D5\u05E0\u05D9\u05D1\u05E8\u05E1\u05D9\u05D8\u05D4",
        kind: "uni"
      }
    ]) {
      const hint = tlv(st.lat, midLon);
      const near = nearestIndex(built.samples, hint.x, hint.z, 0);
      const s = built.samples[near.index];
      const p = { x: s.x + s.rx * midOff, z: s.z + s.rz * midOff };
      const py = s.y;
      const yaw = Math.atan2(s.tx, s.tz);
      const platLen = st.kind === "savidor" ? 110 : st.kind === "shalom" ? 96 : st.kind === "galuyot" ? 70 : 78;
      const plat2 = new THREE.Mesh(new THREE.BoxGeometry(11, 0.7, platLen), platMat);
      plat2.position.set(p.x, py + 0.55, p.z);
      plat2.rotation.y = yaw;
      add(plat2);
      const yellow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, platLen), new THREE.MeshBasicMaterial({ color: 15778816 }));
      yellow.position.set(p.x + s.rx * 5.2, py + 0.96, p.z + s.rz * 5.2);
      yellow.rotation.y = yaw;
      add(yellow);
      const yellow2 = yellow.clone();
      yellow2.position.set(p.x - s.rx * 5.2, py + 0.96, p.z - s.rz * 5.2);
      add(yellow2);
      const canopyW = st.kind === "uni" ? 12 : 14;
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(canopyW, st.kind === "hagana" ? 0.35 : 0.45, platLen * 0.92), st.kind === "shalom" ? glassRoof : silver);
      canopy.position.set(p.x, py + (st.kind === "hagana" ? 5.4 : 6.6), p.z);
      canopy.rotation.y = yaw;
      add(canopy);
      const colN = st.kind === "savidor" ? 7 : 5;
      for (const sx of [-4.6, 4.6]) for (let k = -colN; k <= colN; k++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 5.4, 6), cream);
        const along = k * (platLen / (colN * 2 + 1.2));
        col.position.set(p.x + s.rx * sx + s.tx * along, py + 3.1, p.z + s.rz * sx + s.tz * along);
        add(col);
      }
      const hallP = tlv(st.lat, st.kind === "uni" ? 34.7988 : 34.7932);
      const nearHall = nearestIndex(built.samples, hallP.x, hallP.z, 0);
      const hallW = st.kind === "savidor" ? 28 : st.kind === "shalom" ? 24 : st.kind === "hagana" ? 18 : 16;
      const hallH = st.kind === "hagana" ? 6.4 : st.kind === "uni" ? 7.2 : 9.2;
      const hallMat = st.kind === "hagana" ? conc : st.kind === "uni" ? terracotta : cream;
      const hall = new THREE.Mesh(new THREE.BoxGeometry(hallW, hallH, st.kind === "savidor" ? 40 : 24), hallMat);
      hall.position.set(hallP.x, hallH * 0.5, hallP.z);
      add(hall);
      if (st.kind === "savidor") {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(18, 5.2, 22), cream);
        wing.position.set(hallP.x + 16, 2.6, hallP.z);
        add(wing);
        const vault = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 38, 22, 1, true, Math.PI, Math.PI), paleGlass);
        vault.rotation.z = Math.PI / 2;
        vault.position.set(hallP.x, hallH + 1.6, hallP.z);
        add(vault);
        for (let i = 0; i < 6; i++) {
          const rib = new THREE.Mesh(new THREE.TorusGeometry(15.1, 0.2, 6, 18, Math.PI), bandMat);
          rib.rotation.z = Math.PI / 2;
          rib.position.set(hallP.x - 16 + i * 6.4, hallH + 1.6, hallP.z);
          add(rib);
        }
        const spanS = Math.hypot(hallP.x - p.x, hallP.z - p.z);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(Math.max(10, spanS), 1.35, 5.6), paleGlass);
        foot.position.set((hallP.x + p.x) * 0.5, 10.6, (hallP.z + p.z) * 0.5);
        foot.rotation.y = Math.atan2(p.x - hallP.x, p.z - hallP.z);
        add(foot);
      }
      if (st.kind === "uni") {
        const shed = new THREE.Mesh(new THREE.BoxGeometry(14, 3.2, 18), cream);
        shed.position.set(hallP.x, 2, hallP.z + 16);
        add(shed);
      }
      if (st.kind === "shalom") {
        const glassWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.2, 20), glassRoof);
        glassWall.position.set(hallP.x + 10, 5.2, hallP.z);
        add(glassWall);
        const az = tlv(32.0744, 34.7922);
        const spanA = Math.hypot(az.x - hallP.x, az.z - hallP.z);
        const brA = new THREE.Mesh(new THREE.BoxGeometry(Math.max(8, spanA), 1.2, 5), paleGlass);
        brA.position.set((hallP.x + az.x) * 0.5, 11.2, (hallP.z + az.z) * 0.5);
        brA.rotation.y = Math.atan2(az.x - hallP.x, az.z - hallP.z);
        add(brA);
        const spanH = Math.hypot(hallP.x - p.x, hallP.z - p.z);
        const over = new THREE.Mesh(new THREE.BoxGeometry(spanH, 1.35, 6.2), paleGlass);
        over.position.set((hallP.x + p.x) * 0.5, 12.6, (hallP.z + p.z) * 0.5);
        over.rotation.y = Math.atan2(hallP.x - p.x, hallP.z - p.z);
        add(over);
      }
      const stSign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.2), gantryMat("stn-" + st.kind));
      stSign.position.set(hallP.x, hallH + 3.2, hallP.z);
      stSign.rotation.y = Math.PI / 2;
      add(stSign);
      if (nearHall.dist > built.width / 2 + 10) hit(hallP.x, hallP.z, 8);
    }
    const makeTrain = (phase: number, trackX: number) => {
      const g = new THREE.Group();
      const roof = new THREE.MeshStandardMaterial({ color: 0xe8eaee, roughness: 0.52, metalness: 0 });
      bag.push(roof);
      for (let c = 0; c < 6; c++) {
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.9, 4.1, 17.2), silver);
        body.position.set(0, 2.55, -c * 18.2);
        g.add(body);
        const band = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.5, 17.3), purpleStripe);
        band.position.set(0, 1.55, -c * 18.2);
        g.add(band);
        const band2 = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.22, 17.3), redStripe);
        band2.position.set(0, 1.88, -c * 18.2);
        g.add(band2);
        const deck = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.12, 17.1), bandMat);
        deck.position.set(0, 3.15, -c * 18.2);
        g.add(deck);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(2.72, 0.16, 17.05), roof);
        cap.position.set(0, 4.68, -c * 18.2);
        g.add(cap);
        const winStrip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.95, 16.2), darkGlass);
        winStrip.position.set(1.48, 2.42, -c * 18.2);
        g.add(winStrip);
        const winStripB = winStrip.clone();
        winStripB.position.x = -1.48;
        g.add(winStripB);
        const winStrip2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.78, 16.2), darkGlass);
        winStrip2.position.set(1.48, 3.68, -c * 18.2);
        g.add(winStrip2);
        const winStrip2B = winStrip2.clone();
        winStrip2B.position.x = -1.48;
        g.add(winStrip2B);
      }
      const nose = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.4, 4.6), silver);
      nose.position.set(0, 2.4, 10.4);
      g.add(nose);
      const yellow = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.7, 4.65), new THREE.MeshStandardMaterial({ color: 0xe2a818, roughness: 0.45 }));
      yellow.position.set(0, 1.15, 10.4);
      g.add(yellow);
      const screen = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.15, 0.12), darkGlass);
      screen.position.set(0, 3.05, 12.68);
      g.add(screen);
      const dest = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.42), gantryMat("dest-rail"));
      dest.position.set(0, 3.58, 12.74);
      g.add(dest);
      const panArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), bandMat);
      panArm.position.set(0, 5.4, -2);
      g.add(panArm);
      const panBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), bandMat);
      panBar.position.set(0, 6.2, -2);
      g.add(panBar);
      const lightL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.2), new THREE.MeshBasicMaterial({ color: 16774344 }));
      lightL.position.set(-0.85, 1.5, 12.7);
      g.add(lightL);
      const lightR = lightL.clone();
      lightR.position.x = 0.85;
      g.add(lightR);
      g.scale.setScalar(1.08);
      group.add(g);
      const mid = built.width / 2 + 9;
      const pts = built.samples.map((s) => ({
        x: s.x + s.rx * (mid + trackX),
        y: s.y + 0.42,
        z: s.z + s.rz * (mid + trackX),
        yaw: Math.atan2(s.tx, s.tz)
      }));
      movers.push({
        mesh: g,
        pts,
        speed: 0.14,
        phase
      });
    };
    makeTrain(0, -1.15);
    makeTrain(0.48, 1.15);
    const arrowTex = getLaneArrow();
    if (!arrowTex) throw new Error("lane arrow missing");
    const arrowMat = new THREE.MeshBasicMaterial({ map: arrowTex, side: 2 });
    for (const lat of [32.055, 32.061, 32.067, 32.0735, 32.083, 32.092, 32.101]) {
      for (const lon of [34.795, 34.7971]) {
      const p = tlv(lat, lon);
      const near = nearestIndex(built.samples, p.x, p.z, 0);
      const s = built.samples[near.index];
      const hw = built.width / 2 + 1.8;
      for (const side of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.7, 9.2, 0.7), conc);
        post.position.set(s.x + s.rx * hw * side, s.y + 4.6, s.z + s.rz * hw * side);
        add(post);
      }
      const beam = new THREE.Mesh(new THREE.BoxGeometry(built.width + 2.4, 0.7, 1.15), conc);
      beam.position.set(s.x, s.y + 9.3, s.z);
      beam.rotation.y = Math.atan2(s.rx, s.rz);
      add(beam);
      for (let i = 0; i < 8; i++) {
        const off = -built.width / 2 + 3.2 + i * (built.width - 6.4) / 7;
        const ar = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6), arrowMat);
        ar.position.set(s.x + s.rx * off, s.y + 7.4, s.z + s.rz * off);
        ar.rotation.y = Math.atan2(s.tx, s.tz);
        add(ar);
      }
      }
    }
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
