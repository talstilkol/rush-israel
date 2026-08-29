# RSH-016 createWorld track-coupling preflight

- createWorld: lines 456-2766
- top-level statements: 384
- track-aware conditionals/expressions: 148

| # | Lines | Kind | Track IDs | def.id | Theme | Preview |
|---:|---:|---|---|---|---|---|
| 62 | 565-573 | IfStatement | manhattan | no | yes | if (isNight && (def.theme === "manhattan" \|\| def.theme === "park")) { hemi.color.setHex(6981832); hemi.intensity = 0.58; dir.intensity = 1.22; fill.color.setHex(16734858); fill.intensity = 0.55; ambient.color.setHex(3820136); ambient.intensity = 0.32; } |
| 99 | 638-638 | FirstStatement | ayalon | yes | yes | const groundCol = def.id === "ayalon" ? 0xd0d4d8 : def.theme === "desert" ? def.sand : def.theme === "stone" ? 0xe8dcc8 : def.theme === "carmel" ? 0xc4c8a8 : def.theme === "snow" ? 0xf0f4f8 : def.theme === "jaffa" ? 0xe2d2bc : 0xd4cfc6; |
| 103 | 642-648 | FirstStatement | hermon, scopus, ramon | yes | no | const ground = new THREE.Mesh(keep(new THREE.PlaneGeometry(Math.max(def.id === "scopus" \|\| def.id === "hermon" \|\| def.id === "ramon" ? 4200 : 1200, span * (def.id === "scopus" ? 5.4 : 2.8)), Math.max(def.id === "scopus" \|\| def.id === "hermon" \|\| def.id === "ramon" ? 4200 : 1200, span * (def.id === "scopus" ? 5.4 : 2.8) |
| 108 | 653-659 | FirstStatement | hermon, ramon | yes | yes | const domeMat = keep(new THREE.MeshBasicMaterial({ color: isNight ? 0x0e1a2c : def.theme === "desert" \|\| def.id === "ramon" ? 0x87b4d8 : def.theme === "snow" \|\| def.id === "hermon" ? 0xb8d4f0 : 0x4a9ad8, side: 1, fog: false, depthWrite: false, toneMapped: false })); |
| 113 | 664-720 | IfStatement | jerusalem, hw1, stellamaris, golan, hermon, scopus, ramon, eilatmtn, nazareth, tzfat, masada | yes | yes | if (def.theme === "carmel" \|\| def.theme === "snow" \|\| def.id === "ramon" \|\| def.id === "jerusalem" \|\| def.id === "scopus" \|\| def.id === "hw1" \|\| def.id === "masada" \|\| def.id === "eilatmtn" \|\| def.id === "golan" \|\| def.id === "nazareth" \|\| def.id === "tzfat" \|\| def.id === "stellamaris") { const slopeMat = keep(new THRE |
| 127 | 752-779 | Block | ayalon | yes | no | { const dashG = keep(new THREE.BoxGeometry(0.2, 0.045, 4.4)); const dashM = keep(new THREE.MeshBasicMaterial({ color: 0xf7f8f4, fog: false })); const offs = def.id === "ayalon" ? [0, built.width + 18] : [0]; const nDash = Math.min(2800, Math.floor(built.samples.length / 2) * (lanes - 1) * offs.length); const dashes = n |
| 128 | 780-956 | Block | ayalon | yes | no | { const yMat = keep(new THREE.MeshBasicMaterial({ color: 0xffc400, fog: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); group.add(new THREE.Mesh(keep(buildEdgeLine(built, 1, 0.85, 0.1)), yMat)); group.add(new THREE.Mesh(keep(buildEdgeLine(built, -1, 0.85, 0.1)), yMat)); if (def.id === " |
| 129 | 957-1004 | Block | ayalon | yes | no | { const arrowTex = getLaneArrow(); const chevGeo = keep(new THREE.PlaneGeometry(2.8, 3.6)); chevGeo.rotateX(-Math.PI / 2); const chevMat = keep(new THREE.MeshBasicMaterial({ map: arrowTex ?? undefined, color: arrowTex ? 0xffffff : 16773248, transparent: !!arrowTex, depthWrite: false, polygonOffset: true, polygonOffsetF |
| 130 | 1005-1005 | FirstStatement | hayarkon, telaviv, rothschild | yes | yes | const urban = def.theme === "bauhaus" \|\| def.theme === "stone" \|\| def.theme === "jaffa" \|\| def.id === "telaviv" \|\| def.id === "rothschild" \|\| def.id === "hayarkon"; |
| 149 | 1062-1079 | IfStatement | ayalon | yes | no | if (def.id === "ayalon") { const oppOff = built.width + 18; const wear2 = new THREE.InstancedMesh(wearGeo, wearMat, wearN); let w2 = 0; const stepW = Math.max(2, Math.floor(built.samples.length / wearN)); for (let i = 0; i < built.samples.length && w2 < wearN; i += stepW) { const s = built.samples[i]; _dummy.position.s |
| 150 | 1080-1080 | FirstStatement | — | no | yes | const curbTex = keep(curbTexture(def.theme === "stone" ? "stone" : def.theme === "desert" ? "sand" : def.theme === "carmel" \|\| def.theme === "snow" ? "dirt" : "city")); |
| 154 | 1092-1096 | IfStatement | ayalon | yes | no | if (def.id === "ayalon") { const oppOff = built.width + 18; group.add(new THREE.Mesh(keep(buildCurb(built, 1, oppOff)), curbMat)); group.add(new THREE.Mesh(keep(buildCurb(built, -1, oppOff)), curbMat)); } |
| 155 | 1097-1122 | Block | ayalon | yes | no | { const eyeGeo = keep(new THREE.BoxGeometry(0.2, 0.09, 0.32)); const eyeMat = keep(new THREE.MeshBasicMaterial({ color: 0xfff2b0, fog: false })); const eyeOffs = def.id === "ayalon" ? [0, built.width + 18] : [0]; const eyeN = Math.min(def.id === "ayalon" ? 560 : 320, Math.max(24, Math.floor(built.samples.length / 1.5)  |
| 160 | 1136-1149 | IfStatement | rothschild, ayalon | yes | yes | if (def.theme !== "desert" && def.theme !== "snow" && def.id !== "rothschild" && def.theme !== "stone" && def.theme !== "jaffa" && def.theme !== "carmel") { group.add(new THREE.Mesh(keep(buildJersey(built, 1)), jerseyMat)); group.add(new THREE.Mesh(keep(buildJersey(built, -1)), jerseyMat)); const capMat = keep(new THRE |
| 164 | 1158-1164 | IfStatement | ayalon | yes | yes | if (def.theme !== "highway" && def.id !== "ayalon" && def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel") { const walkL = new THREE.Mesh(keep(buildSidewalk(built, 1)), walkMat); const walkR = new THREE.Mesh(keep(buildSidewalk(built, -1)), walkMat); walkL.receiveShadow = true; walkR.receiveShadow = |
| 168 | 1173-1257 | Block | ayalon, deadsea, hw1, hermon, hw6, hw2, ramon, masada | yes | yes | { const skipSigns = def.theme === "desert" \|\| def.theme === "snow" \|\| def.id === "ramon" \|\| def.id === "hermon" \|\| def.id === "masada" \|\| def.id === "deadsea"; if (!skipSigns) { const highway = def.theme === "highway" \|\| def.id === "ayalon" \|\| def.id === "hw1" \|\| def.id === "hw2" \|\| def.id === "hw6"; const kinds = high |
| 170 | 1265-1268 | IfStatement | ayalon | yes | yes | if (def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon") { group.add(new THREE.Mesh(keep(buildRail(built, 1)), railMat)); group.add(new THREE.Mesh(keep(buildRail(built, -1)), railMat)); } |
| 181 | 1302-1317 | IfStatement | ayalon | yes | yes | if (def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon") for (let i = 0; i < built.samples.length; i += 5) { const s = built.samples[i]; const alley = nearestStreet(s.x, s.z, streets); if (alley && alley.dist < alley.street.half + 5) continue; const d = built.width / 2 + 0.48 |
| 187 | 1384-1427 | IfStatement | manhattan | no | yes | if (bodies.length) { const nrm = keep(waterNormalTex()); for (const body of bodies) { const mat = keep(new THREE.MeshPhysicalMaterial({ color: body.color, roughness: isNight ? 0.03 : 0.08, metalness: 0.08, transparent: true, opacity: isNight ? 0.9 : 0.82, envMapIntensity: isNight ? 2.6 : 1.7, clearcoat: 1, clearcoatRou |
| 188 | 1428-1472 | IfStatement | ayalon | yes | no | if (def.id === "ayalon") { const nrm = keep(waterNormalTex()); const canalMat = keep(new THREE.MeshPhysicalMaterial({ color: isNight ? 0x1a3a48 : 0x2a6a78, roughness: 0.06, metalness: 0.06, transparent: true, opacity: 0.84, envMapIntensity: isNight ? 2.2 : 1.5, clearcoat: 1, clearcoatRoughness: 0.08, ior: 1.33, normalM |
| 189 | 1473-1483 | ForOfStatement | manhattan | yes | yes | for (const zone of def.clearZones ?? []) { const grass = new THREE.Mesh(keep(new THREE.PlaneGeometry(zone.w, zone.d)), keep(new THREE.MeshStandardMaterial({ color: def.theme === "park" \|\| def.id === "manhattan" ? 3828292 : def.ground, roughness: 0.95, envMapIntensity: 0.2 }))); grass.rotation.x = -Math.PI / 2; grass.po |
| 190 | 1484-1484 | FirstStatement | — | no | no | const needFacade = def.city === "nyc"; |
| 192 | 1486-1486 | FirstStatement | — | no | yes | const facadeDay = nycMod ? keep(nycMod.facadeTexture(def.theme, false)) : null; |
| 193 | 1487-1487 | FirstStatement | — | no | yes | const facadeNight = nycMod ? keep(nycMod.facadeTexture(def.theme, true)) : null; |
| 197 | 1491-1499 | FirstStatement | manhattan | no | yes | const bMat = keep(new THREE.MeshStandardMaterial({ map: !needFacade \|\| def.theme === "jaffa" ? null : isNight ? facadeNight : facadeDay, emissive: new THREE.Color(!needFacade \|\| def.theme === "jaffa" ? 0 : isNight ? 16763e3 : 0), emissiveMap: !needFacade \|\| def.theme === "jaffa" ? null : facadeEmit, emissiveIntensity:  |
| 198 | 1500-1500 | FirstStatement | timessquare | yes | no | const canyon = def.id === "timessquare"; |
| 199 | 1501-1501 | FirstStatement | manhattan | no | yes | const maxB = shadows ? def.theme === "manhattan" ? canyon ? 240 : 200 : 160 : def.theme === "manhattan" ? 280 : 220; |
| 201 | 1503-1503 | FirstStatement | manhattan | yes | no | const minX = def.id === "manhattan" ? -90 : -200; |
| 202 | 1504-1504 | FirstStatement | manhattan | yes | no | const maxX = def.id === "manhattan" ? 90 : 200; |
| 203 | 1505-1505 | FirstStatement | manhattan | yes | no | const minZ = def.id === "manhattan" ? -200 : -200; |
| 204 | 1506-1506 | FirstStatement | manhattan | yes | no | const maxZ = def.id === "manhattan" ? 200 : 200; |
| 205 | 1507-1507 | FirstStatement | manhattan | no | yes | const gap = def.theme === "desert" \|\| def.theme === "highway" \|\| def.theme === "snow" ? 18 : def.theme === "port" ? 16 : def.theme === "jaffa" ? 11 : def.theme === "manhattan" ? canyon ? 9 : 14 : def.theme === "park" ? 16 : 13; |
| 208 | 1516-1577 | IfStatement | hayarkon, oldjaffa, namal, eilat, netanya, herzliya, ashkelon, gushdan, batyam, nahariya | yes | no | if ((def.id === "hayarkon" \|\| def.id === "namal" \|\| def.id === "netanya" \|\| def.id === "herzliya" \|\| def.id === "eilat" \|\| def.id === "batyam" \|\| def.id === "ashkelon" \|\| def.id === "nahariya" \|\| def.id === "oldjaffa" \|\| def.id === "gushdan") && bodies.length) { const trunkGeo2 = keep(new THREE.CylinderGeometry(0.16, 0 |
| 209 | 1578-1578 | FirstStatement | timessquare, manhattan | yes | yes | const heightAt = () => def.theme === "desert" ? 4 + rng() * 10 : def.theme === "jaffa" ? 3.4 + rng() * 4.2 : def.theme === "stone" ? 4.2 + rng() * 7.5 : def.theme === "carmel" ? 3.6 + rng() * 5.5 : def.theme === "port" ? 5 + rng() * 14 : def.theme === "highway" ? 16 + rng() * 38 : def.theme === "manhattan" ? 18 + rng() |
| 210 | 1579-1579 | FirstStatement | — | no | yes | const step = def.theme === "highway" \|\| def.theme === "desert" \|\| def.theme === "snow" ? 14 : 7; |
| 216 | 1588-1609 | ForStatement | manhattan | no | yes | for (let i = 0; i < built.samples.length && placements.length < maxB * 0.7; i += step) { if (def.city !== "nyc") break; const s = built.samples[i]; if (s.y > 8) continue; for (const side of [-1, 1]) { const d = built.width / 2 + 16.5 + rng() * 2.2; const jx = s.x + s.rx * d * side; const jz = s.z + s.rz * d * side; if  |
| 217 | 1610-1633 | ForStatement | manhattan | yes | yes | for (let x = minX; x < maxX && placements.length < maxB; x += gap) for (let z = minZ; z < maxZ && placements.length < maxB; z += gap) { if (def.city !== "nyc") continue; const jx = x + (rng() - 0.5) * (def.theme === "manhattan" ? 3 : 6); const jz = z + (rng() - 0.5) * (def.theme === "manhattan" ? 3 : 6); if (inWater2(j |
| 222 | 1638-1685 | FirstStatement | manhattan | no | yes | const palette = def.theme === "stone" ? [ 13350810, 12032632, 13943460 ] : def.theme === "desert" ? [ 14730394, 13213808, 14200954 ] : def.theme === "carmel" ? [ 15656664, 14274754, 13156530 ] : def.theme === "jaffa" ? [ 12096096, 12886128, 10910798, 13808780, 10120776 ] : def.theme === "port" ? [ 13156532, 11577496, 1 |
| 227 | 1698-1716 | IfStatement | — | no | yes | if (def.theme === "jaffa") { const roofGeo = keep(new THREE.ConeGeometry(1, 1, 4)); const roofMat2 = keep(new THREE.MeshStandardMaterial({ color: 10771002, roughness: 0.82, flatShading: true })); const roofs2 = new THREE.InstancedMesh(roofGeo, roofMat2, placements.length); for (let i = 0; i < placements.length; i++) {  |
| 228 | 1717-1717 | FirstStatement | — | no | no | const crownPlacements = def.city === "nyc" ? placements.filter((p) => p.sy > 16) : []; |
| 247 | 1817-1817 | FirstStatement | manhattan | no | yes | const nyc = def.theme === "manhattan" \|\| def.theme === "park"; |
| 250 | 1825-1825 | FirstStatement | — | no | yes | const tanks = new THREE.InstancedMesh(tankGeo, tankMat, def.theme === "jaffa" \|\| def.theme === "carmel" \|\| def.theme === "stone" ? 0 : Math.min(placements.length, nyc ? 70 : 90)); |
| 254 | 1836-1863 | IfStatement | hayarkon, ayalon, deadsea, manhattan, hw1, hermon, ramon | yes | yes | if ((def.city === "nyc" \|\| def.theme === "carmel" \|\| def.theme === "stone" \|\| def.id === "hermon" \|\| def.id === "hw1") && def.id !== "deadsea" && def.id !== "hayarkon" && def.id !== "ayalon" && def.id !== "ramon") { const tid = def.id as string; const natureHill = def.theme === "jaffa" \|\| def.theme === "carmel" \|\| tid  |
| 256 | 1865-1865 | FirstStatement | — | no | yes | const stoneHill = def.theme === "stone"; |
| 257 | 1866-1866 | FirstStatement | hw1, hermon | yes | yes | const pine = def.theme === "carmel" \|\| def.id === "hermon" \|\| def.id === "hw1"; |
| 258 | 1867-1867 | FirstStatement | ramon | yes | yes | const acacia = def.theme === "desert" && def.id !== "ramon"; |
| 259 | 1868-1868 | FirstStatement | hayarkon, telaviv, namal, rothschild, ayalon | yes | yes | const ficusStreet = (def.theme === "bauhaus" \|\| def.id === "telaviv" \|\| def.id === "namal" \|\| def.id === "hayarkon") && def.id !== "ayalon" && def.id !== "rothschild"; |
| 264 | 1878-1886 | FirstStatement | hermon | yes | yes | const frondMat = keep(new THREE.MeshStandardMaterial({ map: keep(foliageTexture()), color: pine ? def.id === "hermon" ? 2449952 : 1853992 : acacia ? 6982200 : stoneHill ? 1853992 : def.theme === "park" ? 3832386 : 3107386, roughness: 0.86, envMapIntensity: 0.28, flatShading: pine \|\| stoneHill, side: THREE.FrontSide, de |
| 266 | 1888-1902 | IfStatement | timessquare, ramon | yes | no | if ((pine \|\| stoneHill \|\| acacia \|\| ficusStreet \|\| nyc) && def.id !== "timessquare" && def.id !== "ramon") { const stepT = pine ? 5 : acacia ? 7 : ficusStreet ? 8 : stoneHill ? 6 : deciduous ? 8 : 6; for (let i = 0; i < built.samples.length; i += stepT) { const s = built.samples[i]; if (!pine && !acacia && s.y > 14) co |
| 267 | 1903-1911 | IfStatement | — | no | yes | if (def.theme === "park") for (let x = -40; x <= 40; x += 14) for (let z = -100; z <= 120; z += 14) { if (inWater2(x, z)) continue; if (nearestIndex(built.samples, x, z, 0).dist < built.width / 2 + 6) continue; treeSpots.push({ x: x + (rng() - 0.5) * 6, z: z + (rng() - 0.5) * 6, y: 0 }); } |
| 268 | 1912-1926 | IfStatement | hw1 | yes | no | if (pine) { const forestR = def.id === "hw1" ? 380 : 180; const forestStep = def.id === "hw1" ? 28 : 24; for (let x = -forestR; x <= forestR; x += forestStep) for (let z = -forestR; z <= forestR; z += forestStep) { if (inWater2(x, z)) continue; const near = nearestIndex(built.samples, x, z, 0); if (near.dist < built.wi |
| 269 | 1927-1934 | IfStatement | manhattan | yes | no | if (def.id === "manhattan") for (let x = -22; x <= 22; x += 12) for (let z = 52; z <= 124; z += 12) { if (inWater2(x, z)) continue; treeSpots.push({ x: x + (rng() - 0.5) * 4, z: z + (rng() - 0.5) * 4, y: 0 }); } |
| 270 | 1935-1945 | IfStatement | ayalon | yes | no | if (def.id === "ayalon") { for (let i = 0; i < built.samples.length; i += 11) { const s = built.samples[i]; const d = built.width / 2 + 38; treeSpots.push({ x: s.x + s.rx * d, z: s.z + s.rz * d, y: s.y }); } } |
| 280 | 1959-1959 | FirstStatement | hermon | yes | no | const snowCaps = pine && def.id === "hermon" && treeSpots.length ? new THREE.InstancedMesh(crownGeo, snowCapMat, treeSpots.length) : null; |
| 287 | 2017-2047 | IfStatement | timessquare | yes | yes | if (treeSpots.length && def.theme !== "desert" && def.id !== "timessquare") { const nBill = Math.min(36, treeSpots.length); const billG = keep(new THREE.PlaneGeometry(6.4, 7.6)); const billM = keep(new THREE.MeshBasicMaterial({ map: keep(foliageTexture()), transparent: true, alphaTest: 0.32, side: THREE.DoubleSide, dep |
| 290 | 2075-2100 | IfStatement | ramon | yes | yes | if (def.theme === "desert" \|\| def.id === "ramon") { const rockGeo = keep(new THREE.DodecahedronGeometry(1.2, 0)); const rockMat = keep(new THREE.MeshStandardMaterial({ color: def.id === "ramon" ? 11037242 : 12886128, roughness: 0.96, flatShading: true })); const rockN = 80; const rocks = new THREE.InstancedMesh(rockGeo |
| 298 | 2125-2125 | FirstStatement | ayalon, hw1, hermon, hw6, hw2, ramon | yes | yes | const lampCount = def.id === "ramon" \|\| def.id === "hermon" ? 0 : def.id === "ayalon" ? Math.floor(built.samples.length / 8) : def.id === "hw1" \|\| def.id === "hw2" \|\| def.id === "hw6" ? Math.floor(built.samples.length / 16) : def.theme === "carmel" ? Math.floor(built.samples.length / 18) : Math.floor(built.samples.leng |
| 314 | 2172-2201 | IfStatement | ayalon | yes | no | if (def.id === "ayalon" && lampCount) { const oppOff = built.width + 18; const poles2 = new THREE.InstancedMesh(poleGeo, poleMat, lampCount); const bulbs2 = new THREE.InstancedMesh(bulbGeo, bulbMat, lampCount); const pools2 = new THREE.InstancedMesh(poolGeo, poolMat, lampCount); pools2.renderOrder = 2; const d = oppOff |
| 315 | 2202-2202 | FirstStatement | hw1, hermon, hw6, hw2, ramon | yes | yes | const natureTrack = def.id === "ramon" \|\| def.id === "hermon" \|\| def.theme === "carmel" \|\| def.theme === "desert" \|\| def.theme === "snow" \|\| def.id === "hw1" \|\| def.id === "hw2" \|\| def.id === "hw6"; |
| 316 | 2203-2203 | FirstStatement | hayarkon, oldjaffa, jerusalem, rothschild, ayalon | yes | no | const crowdN = natureTrack \|\| def.id === "ayalon" \|\| def.id === "rothschild" \|\| def.id === "hayarkon" \|\| def.id === "oldjaffa" \|\| def.id === "jerusalem" ? 0 : shadows ? 72 : 28; |
| 322 | 2280-2301 | IfStatement | — | no | no | if (def.city === "nyc" && nycMod) for (let i = 0; i < ads.length; i++) { const ad = ads[i]; const tex = keep(nycMod.adBoardTexture(ad.bg, ad.fg, ad.t)); const mat = keep(new THREE.MeshStandardMaterial({ map: tex, emissive: new THREE.Color(ad.fg), emissiveIntensity: isNight ? 0.45 : 0.08, roughness: 0.45 })); const s =  |
| 339 | 2357-2357 | FirstStatement | timessquare | yes | no | const neonStep = Math.max(def.id === "timessquare" ? 7 : 18, Math.floor(built.samples.length / 22)); |
| 350 | 2386-2389 | IfStatement | — | no | no | if (def.city === "nyc") { const nycLand = await import("./nyc-landmarks"); nycLand.addNycLandmarks(group, def, bag, shadows, isNight, landmarkGlows, emitList, colliders); } |
| 379 | 2605-2714 | FirstStatement | manhattan | no | yes | const setClock = (nextClock: number) => { clock = (nextClock % 1 + 1) % 1; const n = nightAmt(clock); isNight = n > 0.48; const morning = n <= 0.5 && clock < 0.38; const next = skyAt(def, clock, wx); applySky(sky, sun, next); skyDomeMat.map = null; skyDomeMat.color.setHex(n > 0.5 ? 0x2a4a6c : 0x3c9ee0); skyDomeMat.need |

## Track-aware expressions

| # | Lines | Top | Condition | Track IDs |
|---:|---:|---:|---|---|
| 1 | 565-573 | 62 | isNight && (def.theme === "manhattan" \|\| def.theme === "park") | manhattan |
| 2 | 638-638 | 99 | def.id === "ayalon" | ayalon |
| 3 | 638-638 | 99 | def.theme === "desert" | — |
| 4 | 638-638 | 99 | def.theme === "stone" | — |
| 5 | 638-638 | 99 | def.theme === "carmel" | — |
| 6 | 638-638 | 99 | def.theme === "snow" | — |
| 7 | 638-638 | 99 | def.theme === "jaffa" | — |
| 8 | 642-642 | 103 | def.id === "scopus" \|\| def.id === "hermon" \|\| def.id === "ramon" | hermon, scopus, ramon |
| 9 | 642-642 | 103 | def.id === "scopus" | scopus |
| 10 | 642-642 | 103 | def.id === "scopus" \|\| def.id === "hermon" \|\| def.id === "ramon" | hermon, scopus, ramon |
| 11 | 642-642 | 103 | def.id === "scopus" | scopus |
| 12 | 654-654 | 108 | def.theme === "desert" \|\| def.id === "ramon" | ramon |
| 13 | 654-654 | 108 | def.theme === "snow" \|\| def.id === "hermon" | hermon |
| 14 | 664-720 | 113 | def.theme === "carmel" \|\| def.theme === "snow" \|\| def.id === "ramon" \|\| def.id === "jerusalem" \|\| def.id === "scopus" \|\| def.id === "hw1" \|\| def.id === "masada" \|\| def.id === "eilatmtn" \|\| def.id === "golan" \|\| def.id === "nazareth" \|\| def.id === "tzfat" \|\| def.id === "stellamaris" | jerusalem, hw1, stellamaris, golan, scopus, ramon, eilatmtn, nazareth, tzfat, masada |
| 15 | 666-666 | 113 | def.id === "ramon" | ramon |
| 16 | 666-666 | 113 | def.id === "hermon" | hermon |
| 17 | 666-666 | 113 | def.id === "jerusalem" \|\| def.id === "scopus" | jerusalem, scopus |
| 18 | 674-674 | 113 | def.id === "ramon" | ramon |
| 19 | 674-674 | 113 | def.id === "hermon" | hermon |
| 20 | 674-674 | 113 | def.theme === "carmel" | — |
| 21 | 678-693 | 113 | def.id === "ramon" | ramon |
| 22 | 682-693 | 113 | def.id === "hermon" | hermon |
| 23 | 699-699 | 113 | def.id === "ramon" | ramon |
| 24 | 699-699 | 113 | def.id === "masada" | masada |
| 25 | 699-699 | 113 | def.id === "hermon" | hermon |
| 26 | 699-699 | 113 | def.theme === "carmel" | — |
| 27 | 755-755 | 127 | def.id === "ayalon" | ayalon |
| 28 | 790-955 | 128 | def.id === "ayalon" | ayalon |
| 29 | 972-972 | 129 | def.id === "ayalon" | ayalon |
| 30 | 972-972 | 129 | def.id === "ayalon" | ayalon |
| 31 | 976-976 | 129 | def.id === "ayalon" | ayalon |
| 32 | 988-1003 | 129 | def.id === "ayalon" | ayalon |
| 33 | 1062-1079 | 149 | def.id === "ayalon" | ayalon |
| 34 | 1080-1080 | 150 | def.theme === "stone" | — |
| 35 | 1080-1080 | 150 | def.theme === "desert" | — |
| 36 | 1080-1080 | 150 | def.theme === "carmel" \|\| def.theme === "snow" | — |
| 37 | 1092-1096 | 154 | def.id === "ayalon" | ayalon |
| 38 | 1100-1100 | 155 | def.id === "ayalon" | ayalon |
| 39 | 1101-1101 | 155 | def.id === "ayalon" | ayalon |
| 40 | 1136-1149 | 160 | def.theme !== "desert" && def.theme !== "snow" && def.id !== "rothschild" && def.theme !== "stone" && def.theme !== "jaffa" && def.theme !== "carmel" | rothschild |
| 41 | 1142-1148 | 160 | def.id === "ayalon" | ayalon |
| 42 | 1158-1164 | 164 | def.theme !== "highway" && def.id !== "ayalon" && def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" | ayalon |
| 43 | 1206-1229 | 168 | def.id === "ayalon" | ayalon |
| 44 | 1265-1268 | 170 | def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon" | ayalon |
| 45 | 1302-1317 | 181 | def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon" | ayalon |
| 46 | 1417-1417 | 187 | def.theme !== "manhattan" && def.theme !== "park" | manhattan |
| 47 | 1426-1426 | 187 | def.theme !== "manhattan" && def.theme !== "park" | manhattan |
| 48 | 1428-1472 | 188 | def.id === "ayalon" | ayalon |
| 49 | 1475-1475 | 189 | def.theme === "park" \|\| def.id === "manhattan" | manhattan |
| 50 | 1492-1492 | 197 | !needFacade \|\| def.theme === "jaffa" | — |
| 51 | 1493-1493 | 197 | !needFacade \|\| def.theme === "jaffa" | — |
| 52 | 1494-1494 | 197 | !needFacade \|\| def.theme === "jaffa" | — |
| 53 | 1495-1495 | 197 | !needFacade \|\| def.theme === "jaffa" | — |
| 54 | 1495-1495 | 197 | def.theme === "manhattan" | manhattan |
| 55 | 1496-1496 | 197 | def.theme === "jaffa" | — |
| 56 | 1501-1501 | 199 | def.theme === "manhattan" | manhattan |
| 57 | 1501-1501 | 199 | def.theme === "manhattan" | manhattan |
| 58 | 1503-1503 | 201 | def.id === "manhattan" | manhattan |
| 59 | 1504-1504 | 202 | def.id === "manhattan" | manhattan |
| 60 | 1505-1505 | 203 | def.id === "manhattan" | manhattan |
| 61 | 1506-1506 | 204 | def.id === "manhattan" | manhattan |
| 62 | 1507-1507 | 205 | def.theme === "desert" \|\| def.theme === "highway" \|\| def.theme === "snow" | — |
| 63 | 1507-1507 | 205 | def.theme === "port" | — |
| 64 | 1507-1507 | 205 | def.theme === "jaffa" | — |
| 65 | 1507-1507 | 205 | def.theme === "manhattan" | manhattan |
| 66 | 1507-1507 | 205 | def.theme === "park" | — |
| 67 | 1516-1577 | 208 | (def.id === "hayarkon" \|\| def.id === "namal" \|\| def.id === "netanya" \|\| def.id === "herzliya" \|\| def.id === "eilat" \|\| def.id === "batyam" \|\| def.id === "ashkelon" \|\| def.id === "nahariya" \|\| def.id === "oldjaffa" \|\| def.id === "gushdan") && bodies.length | hayarkon, oldjaffa, namal, eilat, netanya, herzliya, ashkelon, gushdan, batyam, nahariya |
| 68 | 1578-1578 | 209 | def.theme === "desert" | — |
| 69 | 1578-1578 | 209 | def.theme === "jaffa" | — |
| 70 | 1578-1578 | 209 | def.theme === "stone" | — |
| 71 | 1578-1578 | 209 | def.theme === "carmel" | — |
| 72 | 1578-1578 | 209 | def.theme === "port" | — |
| 73 | 1578-1578 | 209 | def.theme === "highway" | — |
| 74 | 1578-1578 | 209 | def.theme === "manhattan" | manhattan |
| 75 | 1578-1578 | 209 | def.id === "timessquare" | timessquare |
| 76 | 1578-1578 | 209 | def.theme === "park" | — |
| 77 | 1578-1578 | 209 | def.theme === "snow" | — |
| 78 | 1579-1579 | 210 | def.theme === "highway" \|\| def.theme === "desert" \|\| def.theme === "snow" | — |
| 79 | 1589-1589 | 216 | def.city !== "nyc" | — |
| 80 | 1603-1603 | 216 | def.theme === "jaffa" | — |
| 81 | 1603-1603 | 216 | def.theme === "manhattan" | manhattan |
| 82 | 1605-1605 | 216 | def.theme === "jaffa" | — |
| 83 | 1605-1605 | 216 | def.theme === "manhattan" | manhattan |
| 84 | 1611-1611 | 217 | def.city !== "nyc" | — |
| 85 | 1612-1612 | 217 | def.theme === "manhattan" | manhattan |
| 86 | 1613-1613 | 217 | def.theme === "manhattan" | manhattan |
| 87 | 1622-1622 | 217 | near.dist > (def.id === "manhattan" ? 90 : 140) | manhattan |
| 88 | 1622-1622 | 217 | def.id === "manhattan" | manhattan |
| 89 | 1628-1628 | 217 | def.theme === "jaffa" | — |
| 90 | 1628-1628 | 217 | def.theme === "manhattan" | manhattan |
| 91 | 1630-1630 | 217 | def.theme === "jaffa" | — |
| 92 | 1630-1630 | 217 | def.theme === "manhattan" | manhattan |
| 93 | 1638-1685 | 222 | def.theme === "stone" | — |
| 94 | 1642-1685 | 222 | def.theme === "desert" | — |
| 95 | 1646-1685 | 222 | def.theme === "carmel" | — |
| 96 | 1650-1685 | 222 | def.theme === "jaffa" | — |
| 97 | 1656-1685 | 222 | def.theme === "port" | — |
| 98 | 1660-1685 | 222 | def.theme === "highway" | — |
| 99 | 1665-1685 | 222 | def.theme === "manhattan" | manhattan |
| 100 | 1671-1685 | 222 | def.theme === "park" | — |
| 101 | 1676-1685 | 222 | def.theme === "snow" | — |
| 102 | 1698-1716 | 227 | def.theme === "jaffa" | — |
| 103 | 1717-1717 | 228 | def.city === "nyc" | — |
| 104 | 1825-1825 | 250 | def.theme === "jaffa" \|\| def.theme === "carmel" \|\| def.theme === "stone" | — |
| 105 | 1836-1863 | 254 | (def.city === "nyc" \|\| def.theme === "carmel" \|\| def.theme === "stone" \|\| def.id === "hermon" \|\| def.id === "hw1") && def.id !== "deadsea" && def.id !== "hayarkon" && def.id !== "ayalon" && def.id !== "ramon" | hayarkon, ayalon, deadsea, hw1, hermon, ramon |
| 106 | 1839-1839 | 254 | def.theme === "manhattan" | manhattan |
| 107 | 1843-1843 | 254 | tid === "ramon" | ramon |
| 108 | 1843-1843 | 254 | tid === "hermon" | hermon |
| 109 | 1843-1843 | 254 | def.theme === "carmel" \|\| tid === "hw1" | hw1 |
| 110 | 1843-1843 | 254 | def.theme === "stone" | — |
| 111 | 1852-1852 | 254 | tid === "ramon" \|\| tid === "hermon" | hermon, ramon |
| 112 | 1852-1852 | 254 | def.theme === "stone" \|\| tid === "hw1" | hw1 |
| 113 | 1853-1853 | 254 | tid === "ramon" | ramon |
| 114 | 1853-1853 | 254 | tid === "hermon" | hermon |
| 115 | 1853-1853 | 254 | def.theme === "carmel" \|\| tid === "hw1" | hw1 |
| 116 | 1853-1853 | 254 | def.theme === "stone" | — |
| 117 | 1853-1853 | 254 | def.theme === "manhattan" | manhattan |
| 118 | 1855-1855 | 254 | tid === "ramon" | ramon |
| 119 | 1855-1855 | 254 | tid === "hermon" | hermon |
| 120 | 1855-1855 | 254 | def.theme === "carmel" \|\| tid === "hw1" | hw1 |
| 121 | 1855-1855 | 254 | def.theme === "stone" | — |
| 122 | 1855-1855 | 254 | tid === "ramon" | ramon |
| 123 | 1855-1855 | 254 | tid === "hermon" | hermon |
| 124 | 1855-1855 | 254 | def.theme === "carmel" \|\| tid === "hw1" | hw1 |
| 125 | 1855-1855 | 254 | def.theme === "stone" | — |
| 126 | 1880-1880 | 264 | def.id === "hermon" | hermon |
| 127 | 1880-1880 | 264 | def.theme === "park" | — |
| 128 | 1888-1902 | 266 | (pine \|\| stoneHill \|\| acacia \|\| ficusStreet \|\| nyc) && def.id !== "timessquare" && def.id !== "ramon" | timessquare, ramon |
| 129 | 1903-1911 | 267 | def.theme === "park" | — |
| 130 | 1913-1913 | 268 | def.id === "hw1" | hw1 |
| 131 | 1914-1914 | 268 | def.id === "hw1" | hw1 |
| 132 | 1927-1934 | 269 | def.id === "manhattan" | manhattan |
| 133 | 1935-1945 | 270 | def.id === "ayalon" | ayalon |
| 134 | 1959-1959 | 280 | pine && def.id === "hermon" && treeSpots.length | hermon |
| 135 | 2017-2047 | 287 | treeSpots.length && def.theme !== "desert" && def.id !== "timessquare" | timessquare |
| 136 | 2075-2100 | 290 | def.theme === "desert" \|\| def.id === "ramon" | ramon |
| 137 | 2078-2078 | 290 | def.id === "ramon" | ramon |
| 138 | 2125-2125 | 298 | def.id === "ramon" \|\| def.id === "hermon" | hermon, ramon |
| 139 | 2125-2125 | 298 | def.id === "ayalon" | ayalon |
| 140 | 2125-2125 | 298 | def.id === "hw1" \|\| def.id === "hw2" \|\| def.id === "hw6" | hw1, hw6, hw2 |
| 141 | 2125-2125 | 298 | def.theme === "carmel" | — |
| 142 | 2172-2201 | 314 | def.id === "ayalon" && lampCount | ayalon |
| 143 | 2203-2203 | 316 | natureTrack \|\| def.id === "ayalon" \|\| def.id === "rothschild" \|\| def.id === "hayarkon" \|\| def.id === "oldjaffa" \|\| def.id === "jerusalem" | hayarkon, oldjaffa, jerusalem, rothschild, ayalon |
| 144 | 2280-2301 | 322 | def.city === "nyc" && nycMod | — |
| 145 | 2357-2357 | 339 | def.id === "timessquare" | timessquare |
| 146 | 2386-2389 | 350 | def.city === "nyc" | — |
| 147 | 2655-2661 | 379 | n > 0.5 && (def.theme === "manhattan" \|\| def.theme === "park") | manhattan |
| 148 | 2697-2697 | 379 | def.theme === "manhattan" | manhattan |
