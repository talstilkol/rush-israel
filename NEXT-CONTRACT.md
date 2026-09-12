**Version:** 21.46.0
**Date:** 2026-09-12, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** 2e2c4b0
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze, unaccepted.

GitHub is the current source of truth. Re-read live refs,CI and sources before
changes. Standing owner audit/repair/master-plan authority continues.35/67 accepted;
32 remain. No merge,freeze,release,force-push,history rewrite or RSH-037 activation.

## Verified baseline
r6.26 product `6fb27397b9edec289a48e8acf598cb049ba6b002` tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0` exact-head requiredCI 34460850784
job 102818068809 passed 1,283 units. Artifact required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`;
audit-source-34460850784-1 SHA-256
`22bb39cd0599969ff8463823e0c395a2a7b77fe176be5c8be0d392be0770c00a`. Last
successful exact-head product baseline.

r6.24 product `d02e110baa4e3b74976d0b7ad1e0576faa431953` tree
`5c0b7667e8775f04c67b62285a78d9805b473f23` exact-head requiredCI 34454517944
job 102797680687 passed 1,229 units. Artifact required-ci-34454517944-1 SHA-256
`b7034f320d86317ef571953e2f9934e9d1ed8a9dffc9ec6c3d8ff4e7b8c20594`. Retained.

r6.23 product `369dfe7a73bc225750d78c29497d90878960c930` tree
`af3fb764560d8a21a7577ea8810c91ef740a3f0b` exact-head requiredCI 34452081855
job 102789874804 passed 1,206 units, 0 errors, mesh hits 0.
Artifact required-ci-34452081855-1 SHA-256
`1ed0edf10d94cb6b466b7271e9d12828c8725008f83f464be781652abcb31522`. Retained.

Original golden remains 0/4. Live rest chase after snapCamera(true) matches the
26 August 7.4/1.92 matrices at g01/g05/g07/g08. Full-frame scene present (no HUD)
mismatches 29.3–70.2% and tracks original-golden page 31–65%, so HUD chrome is
not the remaining 0/4 driver. presentVsRawPct is 0 at rest. The 29–70% scalar is
not spatially uniform: g01/g05/g08 concentrate in the bottom foreground
(85–88%) while sky/top is 22–50%; g07 is the inverse (upper 60%, bottom 11%).
Those dominant bands are not a centre-column (vehicle) artifact: g01/g05/g08
bottom is full-width 83–92%; g07 upper mismatch is the sides (79%) while the
centre is 42%. Named residual layers do not occupy g01/g05/g08 bottom: no hide
reduces 85–88%, and hiding ground makes it worse (+10–13%). g07 upper is ramps
(bandDelta −0.1885; 0.6045 → 0.4160). Hero-car (106), road-shader (2), blob (4),
fx (5) and unclassified scene extras (813) all have bandDelta 0 on that dominant
band, so remaining 0/4 is not a scene extra. Ground-plane and daylight
co-occupy g01/g05/g08 bottom (ground −77.6/−85.0/−87.8 points; daylight
−75.5/−43.0/−87.8). Split isolation shows the remaining driver is ground-plane
color (`0xd0d4d8`): black albedo drops mismatch 77.6/85.0/87.8 points. Nulling
the map increases mismatch, so the texture helps. Roughness and daytime lights
are not independent drivers. Envmap is not the day-bottom driver (+0.00) but
contributes on g07 upper ramps (−6.3) and g08 night (−19.3). Live-vs-golden
mean RGB of the dominant band shows the locked PNG bottom is dark (g01 26/36/38,
g05 11/22/30, g08 7/6/4) while live is brighter and bluer (77/104/130, 75/104/133,
41/53/70; band L2 126/146/88). Shade isolation in L2 space shows that brightness
is exposure/unlit (−67.7/−107.3/−77.5 and −68.6/−80.5/−48.8) and the blue lift is
envmap/hemi (−50.2/−54.2/−33.9 and −18.4/−20.7/−11.0). Fog L2 delta is 0. Grade
is not a day-bottom driver. Envmap/hemi pixelmatch bandDelta stays ~0 on day —
threshold 0.12 missed the uniform tint. Independent tone isolation splits that
mix: r6.38 unlit included hemi (count 5); r6.39 unlit excludes it (count 4).
With exposure held at 0.56, combined blue drops B 70.6/77.8/45.5 while luma
only 37.3/41.6/21.6. Unlit-excluding-hemi luma is −38.7/−43.2/−28.6. Exposure=0
still blacks the buffer. Term isolation splits those combined axes: dir
(sun+near) occupies day-bottom luma (−28.0/−31.1/−11.5); fill joins dir on g08
night (−12.4). scene.environment is the entire envmap blue term
(B −48.7/−53.0/−33.9); envMapIntensity is 0. Beam isolation splits dir: sun
occupies the entire dir luma (−28.0/−31.1/−11.5); near is 0 on every pose.
Fill joins sun on g08 night (−12.4). Ray isolation splits sun: intensity
occupies the entire sun luma (−28.0/−31.1/−11.5); color white-out is not a
remaining driver (colorAxis empty; L2 +5.2/+5.5/+10.2). Fill joins intensity
on g08 night (−12.4). IBL isolation splits that environment term:
scene.environment occupies the entire blue band (B −48.7/−53.0/−33.9);
background, Sky and material envMap are 0 on every pose. Gain isolation splits
that remaining IBL: texture ≡ environmentIntensity (identical B
−48.7/−53.0/−33.9); neither is an extra independent driver. Cube isolation
splits that remaining IBL: IBL-off occupies more (B −48.7/−53.0/−33.9) than
product-vs-gray content (B −30.0/−32.5/−21.2). Product cubemap is too blue vs
0x808080, but gray IBL still leaves a residual vs off. Probe isolation splits
that remaining cubemap: day-bottom bakeEnv swap is 0 (product is already
bakeEnv); captureSceneEnv is not a remaining day-bottom driver. setNight does
not rebake, so g08 present keeps the day cubemap. Bake isolation splits that
remaining IBL: day-bottom is bakeEnv background 0x3a9ae0 (B −47.8/−52.0);
hemi and disc are 0. Sky isolation splits that remaining background: 0x3a9ae0
vs 0x808080 occupies B −30.2/−32.8, matching r6.45 product-vs-gray cubemap.
Gray isolation splits that leftover: gray cubemap vs IBL-off occupies B
−18.5/−20.2, independently of hue; additive gray+hue equals r6.45 IBL-off
(−48.7/−53.0). Bare isolation splits that leftover gray IBL: 0x808080
background occupies B −17.6/−19.3 of gray vs off −18.5/−20.2; hemi and disc
inside the gray PMREM are 0. g07 upper remains ramps. Product hex stays
`0xd0d4d8`. Preserve historical preparation 34324754353. PNG bytes last
changed 26 August 12:00:42Z, before spaghetti ramps.

r6.17 requiredCI 34385617080 failed at Playwright `--with-deps` (Google Chrome
apt hash-sum mismatch) before any product test. Retained; not a product defect.

r6.18 product `5dc27ac2f75c985fb85a2d2b235c0e5aa24bc6c2` tree
`3278c5ef62054025d5a29b49b24d2b3b494cd581` exact-head requiredCI 34387082287
job 102585948504: Chromium install **succeeded**; 1,142/1,142 units passed;
overall **FAILED** at runtime-recovery: 8 ramp supports protruded
(maxProtrusion 1.9346875033714142). Artifact required-ci-34387082287-1 SHA-256
`5c10b6eb4fbf12dcde41073852637d16b360f16700edac5249ba5882df62b31c`. That
failure is retained and is not relabelled a pass.

r6.27 product `8f446969082e85a78487e02092ce8d6e803435e7` tree
`29e5248cfef26f38a31935dee844e45a190ead1d` exact-head requiredCI 34480369405
job 102881359050 **FAILED** at lint: `verifyWorldLayers is not defined` after
the residual import replaced the world-layer import. Artifact
required-ci-34480369405-1 SHA-256
`0bffbb9366dc3a9172e8ef3e9371f799e1f15d55d06a6f5beb6e347ccd5c32ec`. Retained;
not relabelled a pass.

## r6.86 playability (not remaining 0/4)
Owner GFX-01/03/05/06/09 screenshots. Meshopt+KHR_mesh_quantization GLB
clone was a vertical origami; `cloneCarBody` now keeps the load tokens and
falls through to the Y-up Z-forward procedural extrusion. Coastal water
keeps a `waterBaseY` so the bob no longer lifts the plane through the
ribbon (Ayalon canal/plane stay on the historical −0.1+sin path). Palms
and Haifa pines skip the carriageway; Jaffa clock-tower plaza no longer
covers the road. Chase clearance 4.2 m / y+1.35 stays. Pixel 0/4 leftover
g07 empty-scene vs golden 0.2027 is unchanged. `freeze_granted=false`.
No merge, no PNG refresh, no RSH-037.

## r6.87 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of dithering vs shadowMap.autoUpdate vs info.autoReset.
Live 5/5; g07 leftover 0.2027; dither/shadow/reset/env/both/pack ≡ 0.
Product renderer stays (dithering false, shadowMap.autoUpdate true,
info.autoReset true). GFX-01–GFX-09 stay queued after RSH-036.

## r6.88 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of shadowMap.type vs shadowMap.needsUpdate vs clippingPlanes.
Live 5/5; g07 leftover 0.2027; type/needs/clip/env/both/pack ≡ 0.
Product renderer stays (PCFShadowMap, needsUpdate false, clippingPlanes []).
GFX-01–GFX-09 stay queued after RSH-036.

## r6.89 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of useLegacyLights vs debug.checkShaderErrors vs xr.enabled.
Live 5/5; g07 leftover 0.2027; lights/debug/xr/env/both/pack ≡ 0.
Product renderer stays (useLegacyLights unset, checkShaderErrors true, xr.enabled false).
GFX-01–GFX-10 stay queued after RSH-036.

## r6.90 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of shadowMap.enabled vs xr.cameraAutoUpdate vs debug.onShaderError.
Live 5/5; g07 leftover 0.2027; map/cauto/onerr/env/both/pack ≡ 0.
Product renderer stays (shadowMap.enabled true, cameraAutoUpdate true, onShaderError unset).
GFX-01–GFX-10 stay queued after RSH-036.

## r6.91 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of xr.framebufferScaleFactor vs transmissionResolutionScale vs VSMShadowMap.
Live 5/5; g07 leftover 0.2027; fbuf/trans/vsm/env/both/pack ≡ 0.
Product renderer stays (framebufferScaleFactor 1, transmissionResolutionScale 1, PCFShadowMap).
GFX-01–GFX-10 stay queued after RSH-036.

## r6.92 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of xr.setFoveation vs xr.setReferenceSpaceType vs PCFSoftShadowMap.
Live 5/5; g07 leftover 0.2027; fov/ref/soft/env/both/pack ≡ 0.
Product renderer stays (foveation 1, referenceSpaceType local-floor, PCFShadowMap).
GFX-01–GFX-10 stay queued after RSH-036.

## r6.93 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of setOpaqueSort vs setTransparentSort vs setClearAlpha.
Live 5/5; g07 leftover 0.2027; opaque/trans/alpha/env/both/pack ≡ 0.
Product renderer stays (default painter sort, default transparent sort, clearAlpha 0).
GFX-01–GFX-10 stay queued after RSH-036.

## r6.95 playability (not remaining 0/4, not freeze grant)
Owner "finish the programs" + GFX cannot-drive. Pacejka yaw in
`stepWheels` is ~0 once crawl dropped at ~10 m/s, so A/D did nothing at
speed (steer 0.82, dYaw −0.01). Kinematic mix now floors at 0.32 so
A = +yaw / D = −yaw at 12 m/s (namal independent starts dA +0.30 /
dD −0.30). `drive-smoke` / `drive-steering` keep the signed turn gate
and no longer require kinMix=0. Water/trees/plaza keepOffRoad from r6.86
plus this steer floor: namal/oldjaffa/caesarea/scopus/ayalon spawn
driveable in-browser; Haifa Baháʼí pines off ribbon; ghost 0 at spawn;
procedural Y-up car. Pixel leftover g07 0.2027 unchanged.
`freeze_granted=false`. No merge, no PNG refresh, no RSH-037.

## r7.46 Masada + Eilat mountains (not remaining 0/4, not freeze grant)
Snake path and red rock. Live 13–21 km/h. `freeze_granted=false`.

## r7.45 Nahariya + Ashdod (not remaining 0/4, not freeze grant)
Gaaton and the docks. Live both 19–21 km/h. `freeze_granted=false`.

## r7.44 Herzliya + Ashkelon (not remaining 0/4, not freeze grant)
Marina and walls. Live both 19–21 km/h. `freeze_granted=false`.

## r7.43 Ayalon chase (not remaining 0/4, not freeze grant)
Camera behind the car. Live 17–21 km/h. `freeze_granted=false`.

## r7.42 Netanya cliff (not remaining 0/4, not freeze grant)
Cliff promenade, no jersey. Live 19–21 km/h. `freeze_granted=false`.

## r7.41 rounder car + foliage fog (not remaining 0/4, not freeze grant)
Rounded Sabra, no sparkle trees. Live 24 km/h. `freeze_granted=false`.

## r7.40 signs in fog + remaining 24s (not remaining 0/4, not freeze grant)
No sparkle belt. Caesarea live 19–21 km/h. `freeze_granted=false`.

## r7.39 Highway 40 + 90 (not remaining 0/4, not freeze grant)
Sde Boker and the Arava. Live both 19–21 km/h. `freeze_granted=false`.

## r7.38 Arad + Kiryat Shmona (not remaining 0/4, not freeze grant)
Ridge town and Hula valley. Live both 19–21 km/h. `freeze_granted=false`.

## r7.37 Old Jaffa night (not remaining 0/4, not freeze grant)
No black cliff. Live 17–21 km/h. `freeze_granted=false`.

## r7.36 Afula + Beit Shean (not remaining 0/4, not freeze grant)
Valley highway and Roman cardo. Live both 19–21 km/h. `freeze_granted=false`.

## r7.35 Tiberias + Hanikra (not remaining 0/4, not freeze grant)
Kinneret and the white cliff. Live both 19–21 km/h. `freeze_granted=false`.

## r7.34 Modiin + Beersheva (not remaining 0/4, not freeze grant)
431 hills and Negev boulevard. Live both 19–21 km/h. `freeze_granted=false`.

## r7.33 TA beach steer + jersey (not remaining 0/4, not freeze grant)
Wider physics wall, no promenade jersey. Live 17–21 km/h, A/D yaw.
`freeze_granted=false`.

## r7.32 Ramla + Lod (not remaining 0/4, not freeze grant)
Old city and airport highway. Live both 19–21 km/h. `freeze_granted=false`.

## r7.31 Rishon + Rehovot (not remaining 0/4, not freeze grant)
Winery and science park. Live both 19–21 km/h. `freeze_granted=false`.

## r7.30 Raanana + Kfar Saba (not remaining 0/4, not freeze grant)
Sharon city streets. Live both 19–21 km/h. `freeze_granted=false`.

## r7.29 Hadera + Petah Tikva (not remaining 0/4, not freeze grant)
Coastal water shrink; city no jersey. Live both 19–21 km/h.
`freeze_granted=false`.

## r7.28 Azrieli city paint (not remaining 0/4, not freeze grant)
Bauhaus, no jersey, fogged paint. Live 19–21 km/h. `freeze_granted=false`.

## r7.27 Ashdod + Nahariya (not remaining 0/4, not freeze grant)
Port and canal stay off the ribbon. Live both 19–21 km/h.
`freeze_granted=false`.

## r7.26 Netanya + Ashkelon (not remaining 0/4, not freeze grant)
Wider promenades, smaller water. Live both 19–21 km/h.
`freeze_granted=false`.

## r7.25 Dead Sea night (not remaining 0/4, not freeze grant)
No foam sparkle. Live 19–21 km/h, teal water. `freeze_granted=false`.

## r7.24 Highway 6 + Herzliya (not remaining 0/4, not freeze grant)
Hills on Trans-Israel; marina off the road. Live both 19–21 km/h.
`freeze_granted=false`.

## r7.23 Gush Dan + Highway 2 (not remaining 0/4, not freeze grant)
Smaller coastal water. Live both 19–21 km/h. `freeze_granted=false`.

## r7.22 Jerusalem one car (not remaining 0/4, not freeze grant)
AI starts ahead; city chevrons gone. Live night 16 km/h, one Sabra.
`freeze_granted=false`.

## r7.21 North TA + Holon (not remaining 0/4, not freeze grant)
Smaller Reading bay, wider Holon. Live both 19–21 km/h.
`freeze_granted=false`.

## r7.20 Azrieli + Bat Yam (not remaining 0/4, not freeze grant)
Eyes only on real highways. Live both 19–21 km/h. `freeze_granted=false`.

## r7.19 rounder car + Namal (not remaining 0/4, not freeze grant)
Bevel/taper bumpers. Live Namal 19–21 km/h, sea off the road.
`freeze_granted=false`.

## r7.18 Rothschild night (not remaining 0/4, not freeze grant)
Dashes use fog. Live 19–24 km/h, no sparkle belt. `freeze_granted=false`.

## r7.17 Haifa Port (not remaining 0/4, not freeze grant)
Smaller bay, wider docks. Live 19–21 km/h. `freeze_granted=false`.

## r7.16 Ayalon readable (not remaining 0/4, not freeze grant)
Reflector off; pitch clamp; thinner rain fog. Live 21–23 km/h, lanes
visible. `freeze_granted=false`.

## r7.15 Highway 1 + Full Carmel (not remaining 0/4, not freeze grant)
Hills fill the climb. Live both 18–20 km/h. Pixel leftover g07 0.2027
unchanged. `freeze_granted=false`.

## r7.14 Walls + Old Jaffa (not remaining 0/4, not freeze grant)
Stone/jaffa slope fill. Live both 19–21 km/h. Pixel leftover g07 0.2027
unchanged. `freeze_granted=false`.

## r7.13 Nazareth + Safed (not remaining 0/4, not freeze grant)
Stone alleys in frame. Live both 19–21 km/h. Pixel leftover g07 0.2027
unchanged. `freeze_granted=false`.

## r7.12 Jerusalem Jaffa Gate day (not remaining 0/4, not freeze grant)
Smooth descent; stone hills; off-track pull. Live 15–23 km/h to the gate.
Pixel leftover g07 0.2027 unchanged. `freeze_granted=false`.

## r7.11 Caesarea + Golan (not remaining 0/4, not freeze grant)
Sea off the ribbon; basalt hills. Live both 19–21 km/h. Pixel leftover
g07 0.2027 unchanged. `freeze_granted=false`.

## r7.10 Haifa Carmel descent (not remaining 0/4, not freeze grant)
Hills and pines off the camera. Live 23–28 km/h down Yefe Nof.
Pixel leftover g07 0.2027 unchanged. `freeze_granted=false`.

## r7.09 Hermon day + Eilat mountains (not remaining 0/4, not freeze grant)
Snow cap; red-rock slope. Live Hermon 18–20 km/h up, Eilatmtn 19 km/h.
Pixel leftover g07 0.2027 unchanged. `freeze_granted=false`.

## r7.08 Ramon day no blue flicker (not remaining 0/4, not freeze grant)
Sky dome ayalon-only. Crater floor + spline look-ahead. Live 21–23 km/h
down the switchbacks. Pixel leftover g07 0.2027 unchanged.
`freeze_granted=false`.

## r7.07 Eilat + Acre night (not remaining 0/4, not freeze grant)
Jaffa moonlight; Eilat sea visible; Acre 19 km/h. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`.

## r7.06 countdown + hint + Scopus (not remaining 0/4, not freeze grant)
HUD 3-2-1 and first-drive hint. Stone night moonlight. Live Scopus 15–19
km/h up the climb. Pixel leftover g07 0.2027 unchanged.
`freeze_granted=false`.

## r7.05 chase cam looks at the road (not remaining 0/4, not freeze grant)
Look-ahead no longer pitches the camera into the sky. Live Dead Sea 19 km/h
road in frame; Masada climb 16–19 km/h. Pixel leftover g07 0.2027 unchanged.
`freeze_granted=false`.

## r7.04 climbs + settings (not remaining 0/4, not freeze grant)
Grade clamp so Hermon/Scopus/Haifa climb; FOV and handling in the settings
panel. Live Hermon 22–25 km/h. Pixel leftover g07 0.2027 unchanged.
`freeze_granted=false`.

## r7.03 Ramon night visibility (not remaining 0/4, not freeze grant)
Desert moonlight, ochre ground, roadside lamps, headlights 92/88 m.
Live: spawn 21 km/h, mid descent 27 km/h. Pixel leftover g07 0.2027
unchanged. `freeze_granted=false`.

## r7.02 Sabra body (not remaining 0/4, not freeze grant)
Procedural GT body: curved profile, bevel, nose/tail taper. Live
Rothschild: sedan silhouette, not a loaf. Pixel leftover g07 0.2027
unchanged. `freeze_granted=false`.

## r7.01 Jerusalem night flicker (not remaining 0/4, not freeze grant)
Puddles and lamp pools stay Ayalon-only so sloped night roads stop
z-fighting. Chase look-at follows ribbon height (no sky-cam).
Live Jaffa Gate night: spawn 22 km/h; mid 32 km/h A +0.23.
Pixel leftover g07 0.2027 unchanged. `freeze_granted=false`.

## r7.00 Hayarkon sea + quality/touch (not remaining 0/4, not freeze grant)
Hayarkon Mediterranean restored as off-ribbon tiles (35 km/h, A +0.28).
Low quality starts gfx step 3 (planar off on Ayalon); mid starts at 1.
Touch pad is steer-only so Gas stays held. Gamepad Start pauses.
WebGL lost calls restoreContext. HUD shows p50/p95/p99 + q-step.
Pixel leftover g07 0.2027 unchanged. `freeze_granted=false`.
No merge, no PNG refresh, no RSH-037 queue activation.

## r6.99 remaining V1 tracks (not remaining 0/4, not freeze grant)
Rothschild median-edge colliders keep the car in the outer lanes
(real spawn dA +1.18). Ramon crater disc no longer cuts the climb.
Hermon snow field off-ribbon. HUD `?qa=1` shows p50/p95/p99.
Live: rothschild 26 km/h; ramon y=168→94; hermon 25; scopus 25.
Pixel leftover g07 0.2027 unchanged. `freeze_granted=false`.
No merge, no PNG refresh, no RSH-037 queue activation.

## r6.98 playability (not remaining 0/4, not freeze grant)
Owner “finish the programs” + GFX-09/10 flicker + cannot-drive.
Non-Ayalon planar `Reflector` z-fought the sloped ribbon every frame.
Coastal water is now opaque and skipped when it still overlaps the
ribbon; hillside mesh starts on a 4.6 m shoulder; chase camera stays on
the ribbon and above road.y; `onTrack` includes the wall band. Live:
namal 30 km/h dA +0.38; oldjaffa clock-tower road visible; haifa t=0.35
y=75 not inside the mountain; jerusalem Mahane Yehuda 31 km/h dA +0.82;
caesarea water left of aqueduct. Pixel leftover g07 0.2027 unchanged.
`freeze_granted=false`. No merge, no PNG refresh, no RSH-037.

## r6.97 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of setRenderTarget vs setScissorTest vs info.reset.
Live 5/5; g07 leftover 0.2027; setRenderTarget dummy g07 +0.7602 increases
(does not occupy remaining); setScissorTest/info.reset/env ≡ 0; both/pack
follow the dummy target on g07 (+0.7602). Product renderer stays (default
framebuffer, scissorTest off, no extra info.reset). GFX-01–GFX-10 stay queued
after RSH-036.

## r6.96 leftover isolation (not remaining 0/4 grant)
Leftover g07 after world.group+outside is remaining empty-scene vs golden
independently of setViewport vs setClearColor vs renderer.compile.
Live 5/5; g07 leftover 0.2027; setViewport 640×400 g07 +0.6188 increases
(does not occupy remaining); setClearColor/compile/env ≡ 0; both/pack follow
the viewport shrink on g07 (+0.7584). Product renderer stays (full 1280×800
viewport, product clear color, no extra compile). GFX-01–GFX-10 stay queued
after RSH-036.

## r6.85 and subsequent acceptance
1. Remaining 0/4 is sun intensity luma plus bakeEnv 0x3a9ae0 hue plus leftover
   gray cubemap vs IBL-off on g01/g05/g08 bottom: intensity occupies luma,
   0x3a9ae0 vs 0x808080 occupies B −30.0/−32.5 and that hue is
   scene.environment cubemap (env ≡ both); scene.background ≡ 0.
   Leftover gray vs off occupies B −18.5/−20.2. hemi occupancy with the
   product cubemap is hemi.color (B −8.9/−9.7), not groundColor (hgnd ≡ 0);
   zeroing hemi.intensity is a superset. g08 night fill and sun are
   independent additive luma (fill −12.4, sun −11.5, both −25.2). Leftover
   after neutralizing hemi.color to 0x808080 is remaining cubemap vs IBL-off
   (off vs hgray B −21.5/−23.8). That cubemap occupancy is scene.environment
   ≡ environmentIntensity=0. material.envMap ≡ gray. setNight does not
   rebake. g07 upper remaining named occupancy is ramps (bandDelta −0.1788,
   L2 −67.1), not sky (≡ 0) and not piers (≡ 0). Env independently occupies
   g07 B −16.4 and bandDelta −0.0744 versus product present, but remaining
   g07 after ramps is leftover unnamed occupancy (~40%), not env (both ≡
   ramps). Leftover g07 after ramps is buildings (bandDelta −0.1037, L2
   −20.4, leftover 0.4003 → 0.2966), not road (≡ 0). leftover-after-ramps-
   as-env ≈ 0. Ground is a small independent leftover axis (bandDelta
   −0.0282). Remaining after ramps+buildings is still ~30% unnamed occupancy.
   Leftover g07 after ramps+buildings is instanced (bandDelta −0.0345, L2
   −8.3, leftover 0.3313 → 0.2968) plus ground (bandDelta −0.0453, leftover
   → 0.2860), not water (≡ 0) and not glass (≈ 0). leftover-after-buildings-
   as-env ≈ 0 (bandDelta −0.0044). Remaining after instanced is still ~30%
   unnamed occupancy. Leftover g07 after ramps+buildings+instanced+ground is
   remaining non-mesh occupancy (leftover 0.2087), not remaining unnamed
   world meshes (unnamed bandDelta −0.006 below 0.02, leftover → 0.2027) and
   not env (≈ 0). both ≡ unnamed. sky ≡ 0. extras ≡ 0. piers −0.0057 occupy
   unnamed. Remaining after all world meshes hidden is still ~20% non-mesh
   occupancy. leftover-after-ignd-as-env ≈ 0. Leftover g07 after all world
   meshes hidden is remaining empty-scene vs golden residual (leftover
   0.2027), not background (graying increases +0.7322, leftover → 0.9349),
   not clear (≡ 0), not fog (≡ 0), not post (≈ 0) and not env (≡ 0). both ≡
   background. leftover-after-empty-as-env ≡ 0. Product background is closer
   to golden than gray; remaining ~20% is empty-scene sky vs locked PNG at
   threshold 0.12. Leftover g07 after all world.group meshes is remaining
   empty-scene vs golden residual (leftover 0.2027), not occupancy outside
   world.group (outside ≡ 0), not hero (≡ 0), not fx (≡ 0), not blob (≡ 0)
   and not env (≡ 0). both ≡ 0. leftover-after-empty-as-outside ≡ 0.
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not toneMapping (NoToneMapping ≈ 0), not
   ColorManagement (≡ 0) and not env (≡ 0). LinearSRGB increases +0.7482
   (leftover → 0.9509). both ≡ enc ≡ space. leftover-after-empty-as-env ≡ 0.
   Product ACES / sRGB / ColorManagement.enabled is closer to golden than
   any encode neutralization. g08 night LinearSRGB collapsing leftover is a
   night-empty encode artifact, not remaining g07 0/4.
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not camera fov 90 (≡ 0, L2 ≡ 0), not near 8
   (≡ 0), not far 80 (≡ 0) and not env (≡ 0). both ≡ clip ≡ 0.
   leftover-after-empty-as-env ≡ 0. Empty leftover has no world geometry for
   a frustum change to reproject; the 200px band is a product background fill
   vs locked PNG world content.
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not follow 14 (≡ 0, L2 ≡ 0), not height 4
   (≡ 0), not look-ahead (≡ 0) and not env (≡ 0). both ≡ pose ≡ 0.
   leftover-after-empty-as-env ≡ 0. Empty leftover has no world geometry for
   a chase-pose change to reproject.
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not pixelRatio 2 (≡ 0, L2 ≡ 0), not
   drawingBuffer 640×400 (≡ 0), not post.setSize 640×400 (≡ 0) and not env
   (≡ 0). both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover
   has no world geometry for a pixel-buffer change to resample against
   golden occupancy; the 200px band is a product background fill vs locked
   PNG world content.
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not bloom 0.8 (≡ 0, L2 ≡ 0), not SMAA off
   (≡ 0), not grade off (bandDelta ≡ 0) and not env (≡ 0). both ≡ pack ≡ 0.
   leftover-after-empty-as-env ≡ 0. g08 night grade L2 +12.77 with bandDelta
   +0.0079 below 0.02 is a night-empty grade tint, not remaining g07 0/4.
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not drawing-buffer antialias (bandDelta
   +0.0003 below 0.02, L2 +38.79 increases), not samples 4 (≡ 0) and not
   clear-alpha 0 (≡ 0) and not env (≡ 0). both ≡ pack. leftover-after-empty-as-env
   ≡ 0. Skipping the composer Output/grade path brightens the empty fill
   rather than occupying remaining g07 occupancy. g08 night aa bandDelta
   +0.0061 below 0.02 is a night-empty composer-skip tint, not remaining g07
   0/4. Product renderer stays (high-quality composer, constructor antialias
   false, alpha false).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not localClippingEnabled on (≡ 0, L2 ≡ 0), not
   clipShadows on (≡ 0), not clipIntersection on (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a localClipping/clipShadows/clipIntersection change to
   occupy remaining g07. Product renderer stays (localClippingEnabled false,
   clipShadows false, clipIntersection false).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not autoClearColor off (≡ 0, L2 ≡ 0), not
   autoClearDepth off (≡ 0), not autoClearStencil off (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for an autoClearColor/autoClearDepth/autoClearStencil change
   to occupy remaining g07. Product renderer stays (autoClearColor true,
   autoClearDepth true, autoClearStencil true).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not dithering on (≡ 0, L2 ≡ 0), not
   shadowMap.autoUpdate off (≡ 0), not info.autoReset off (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a dithering/shadowMap.autoUpdate/info.autoReset change
   to occupy remaining g07. Product renderer stays (dithering false,
   shadowMap.autoUpdate true, info.autoReset true).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not BasicShadowMap (≡ 0, L2 ≡ 0), not
   shadowMap.needsUpdate on (≡ 0), not clippingPlanes (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a shadowMap.type/needsUpdate/clippingPlanes change
   to occupy remaining g07. Product renderer stays (PCFShadowMap,
   needsUpdate false, clippingPlanes empty).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not useLegacyLights (≡ 0, L2 ≡ 0), not
   debug.checkShaderErrors off (≡ 0), not xr.enabled (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a useLegacyLights/checkShaderErrors/xr.enabled change
   to occupy remaining g07. Product renderer stays (useLegacyLights unset,
   checkShaderErrors true, xr.enabled false).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not shadowMap.enabled off (≡ 0, L2 ≡ 0), not
   xr.cameraAutoUpdate off (≡ 0), not debug.onShaderError (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a shadowMap.enabled/cameraAutoUpdate/onShaderError change
   to occupy remaining g07. Product renderer stays (shadowMap.enabled true,
   cameraAutoUpdate true, onShaderError unset).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not framebufferScaleFactor 0.5 (≡ 0, L2 ≡ 0), not
   transmissionResolutionScale 0.5 (≡ 0), not VSMShadowMap (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a framebufferScaleFactor/transmissionResolutionScale/VSM
   change to occupy remaining g07. Product renderer stays (framebufferScaleFactor 1,
   transmissionResolutionScale 1, PCFShadowMap).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not setFoveation 0 (≡ 0, L2 ≡ 0), not
   setReferenceSpaceType viewer (≡ 0), not PCFSoftShadowMap (≡ 0) and not env (≡ 0).
   both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no
   world geometry for a setFoveation/setReferenceSpaceType/PCFSoftShadowMap
   change to occupy remaining g07. Product renderer stays (foveation 1,
   referenceSpaceType local-floor, PCFShadowMap).
   Leftover g07 after world.group+outside is remaining empty-scene vs golden
   residual (leftover 0.2027), not setViewport 640×400 (g07 bandDelta +0.6188
   increases leftover → 0.8215, L2 +183.4), not setClearColor 0x808080 (≡ 0,
   L2 ≡ 0), not renderer.compile (≡ 0) and not env (≡ 0). both/pack follow the
   viewport shrink on g07 (+0.7584). leftover-after-empty-as-env ≡ 0. Empty
   leftover has no world geometry for a setViewport/setClearColor/compile
   change to occupy remaining g07; g01/g05/g08 empty-fill shrink is a
   buffer-window artifact vs the dark locked PNG, not remaining g07 0/4.
   Product renderer stays (full 1280×800 viewport, product clear color, no
   extra compile).
   Live sampling must force 1280×800 pixelRatio 1 after snapCamera(true),
   capture product present (`post.setDrive(0, false); post.render()`), locate
   the dominant 200px band, and isolate leftover g07 empty-scene vs golden
   independently of setRenderTarget vs setScissorTest vs
   info.reset
   without changing product color, exposure or
   refreshing PNGs.
   Smoke must keep verifyWorldLayers through verifyWorldRsi. Live rest chase 7.4/1.92 must stay. Remaining pixel 0/4
   is that intensity+environment-hue+hemi.color+leftover-environment gap plus
   g07 upper ramps plus leftover g07 buildings after ramps plus leftover g07
   instanced+ground after ramps+buildings plus leftover g07 non-mesh after
   ramps+buildings+instanced+ground plus leftover g07 empty-scene vs golden
   after all world meshes plus leftover g07 empty-scene vs golden after
   occupancy outside world.group plus leftover g07 empty-scene vs golden
   after encode neutralization plus leftover g07 empty-scene vs golden
   after frustum neutralization plus leftover g07 empty-scene vs golden
   after chase-pose neutralization plus leftover g07 empty-scene vs golden
   after pixelRatio/drawingBuffer/post.setSize neutralization plus leftover
   g07 empty-scene vs golden after bloom/SMAA/grade neutralization plus leftover
   g07 empty-scene vs golden after antialias/samples/alpha neutralization plus leftover
   g07 empty-scene vs golden after shadowMap/fog/scissor neutralization plus leftover
   g07 empty-scene vs golden after autoClear/sortObjects/overrideMaterial neutralization plus leftover
   g07 empty-scene vs golden after physicallyCorrectLights/premultipliedAlpha/logarithmicDepthBuffer neutralization plus leftover
   g07 empty-scene vs golden after preserveDrawingBuffer/stencil/reversedDepthBuffer neutralization plus leftover
   g07 empty-scene vs golden after localClippingEnabled/clipShadows/clipIntersection neutralization plus leftover
   g07 empty-scene vs golden after autoClearColor/autoClearDepth/autoClearStencil neutralization plus leftover
   g07 empty-scene vs golden after dithering/shadowMap.autoUpdate/info.autoReset neutralization plus leftover
   g07 empty-scene vs golden after shadowMap.type/shadowMap.needsUpdate/clippingPlanes neutralization plus leftover
   g07 empty-scene vs golden after useLegacyLights/debug.checkShaderErrors/xr.enabled neutralization plus leftover
   g07 empty-scene vs golden after shadowMap.enabled/xr.cameraAutoUpdate/debug.onShaderError neutralization plus leftover
   g07 empty-scene vs golden after xr.framebufferScaleFactor/transmissionResolutionScale/VSMShadowMap neutralization plus leftover
   g07 empty-scene vs golden after xr.setFoveation/xr.setReferenceSpaceType/PCFSoftShadowMap neutralization plus leftover
   g07 empty-scene vs golden after setOpaqueSort/setTransparentSort/setClearAlpha neutralization plus leftover
   g07 empty-scene vs golden after setViewport/setClearColor/renderer.compile neutralization plus leftover
   g07 empty-scene vs golden after setRenderTarget/setScissorTest/info.reset neutralization. PNG refresh, threshold drift, color
   retune, exposure retune and skipped comparison fail closed.
   176 piers, 546 legacy colliders, 50 ramps, rest-pose 1.6, 1.05 radius and
   generation-11 lock stay. Freeze path count stays 85. Pixel 0/4 is not freeze.
2. Preserve the r6.18 Chromium install retry through the r6.84 lcc isolation,
   the r6.85 acd isolation, the r6.87 dsa isolation, the r6.88 tnc isolation, the r6.89 ldx isolation, the r6.90 sxo isolation, the r6.91 ftv isolation, the r6.92 frs isolation, the r6.93 ocs isolation, the r6.96 vcc isolation and the r6.97 rsi isolation.
3. Preserve 1280x800 images, threshold 0.12, failure 8%, generation 11 lock and
   owner approval. Do not refresh golden PNGs or silently change typography.
   Rendering performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

## Queued graphical defects (not Ayalon freeze / not remaining 0/4)

Owner screenshot 2026-09-11 17:34 on track `namal` (צפון תל אביב / Tel Aviv
Port, HUD POI נמל תל אביב, lap 1, 0 km/h). The Version 1 Sabra body renders as
a vertical origami wedge (length along world-up) with procedural glass/bumper
extras still in Y-up. Likely `/game/car-*.glb` up-axis vs `cloneCarBody` which
clones the `body` mesh with no Y-up correction. r6.34 already proved hero-car
bandDelta 0 on Ayalon g01/g05/g08 bottom, so this is **not** remaining pixel
0/4 and is **not** an Ayalon freeze item.

Queue after RSH-036, as a separate graphical workstream. Do not retune Ayalon
`0xd0d4d8` / exposure 0.56, do not refresh golden PNGs, do not merge, and do
not treat a namal car-orientation or Ayalon P2P camera-clip fix as freeze.

Owner screenshot 2026-09-11 17:51 on track `ayalon`, mode נקודה לנקודה,
night, t=0:02.64, 2 km/h, POI קיבוץ גלויות, landmark ההגנה / HaHagana. Chase
camera sits inside / through the Sabra body so a gray panel fills the frame.
Distinct from GFX-01 (namal GLB up-axis at rest). r6.34 hero-car bandDelta 0
at locked rest poses, so this is **not** remaining pixel 0/4.

Owner screenshot 2026-09-11 17:51.46 on track `ayalon`, mode נקודה לנקודה,
night, t=0:25.66, 1 km/h, POI קיבוץ גלויות. Chase camera sits inside a highway
retaining wall so a gray slab fills the left frame; the Sabra is visible from
a steep top-down angle with body split and windshield diamond detached.
Distinct from GFX-03 (camera-through-car at t=0:02.64 same POI) and GFX-01
(namal rest origami). r6.34 hero-car bandDelta 0 at locked rest poses, so this
is **not** remaining pixel 0/4.

Owner screenshot 2026-09-11 17:53.01 on track `caesarea`, mode הקפה 1/3,
day, t=0:05.20, 1 km/h, POI אמת המים. A large blue water/ocean plane is
tilted steeply through the driving surface; a striped wedge is similarly
skewed. The Sabra is boxy with a blue glass strip on the left side (GFX-01
family). Distinct from GFX-01 (namal rest origami), GFX-03 and GFX-04
(Ayalon night P2P camera clips). r6.34 hero-car bandDelta 0 at locked Ayalon
rest poses, so this is **not** remaining pixel 0/4.

Owner screenshots 2026-09-11 17:53.40 and 17:54.15 on track `haifa`
(ירידת הכרמל), mode נקודה לנקודה, day, POI הגנים הבהאיים, t=0:04.25 /
11 km/h and t=0:39.59 / 1 km/h. Pine-tree meshes poke through the driving
surface so the road is hidden; the Sabra floats on canopies and the HUD
toasts `חזור לכביש`. Distinct from GFX-01 (namal rest origami) and GFX-05
(Caesarea water plane). r6.34 hero-car bandDelta 0 at locked Ayalon rest
poses, so this is **not** remaining pixel 0/4.

Owner screenshot 2026-09-11 17:55.22 on track `jerusalem`, mode נקודה
לנקודה, day, t=0:04.59, 1 km/h, POI מחנה יהודה. Sabra body origami
(GFX-01 family); chase camera steep / beside the body so sky fills the
frame. Owner reports forward driving does not work. Distinct from GFX-01
(namal rest origami) and GFX-03–GFX-06. r6.34 hero-car bandDelta 0 at
locked Ayalon rest poses, so this is **not** remaining pixel 0/4.

Owner screenshots 2026-09-11 17:35.28 and 17:35.35 on track `namal`,
mode הקפה 1/3, day, t=0:40.10 / 13 km/h and t=0:47.69 / 1 km/h, POI
נמל תל אביב. Two cars appear; multiple road meshes sit in more than one
dimension (flooded water plane through the carriageway, giant cyan
spline/gate arc). Sabra origami is GFX-01 family. Distinct from GFX-01
(namal rest origami at 0 km/h). r6.34 hero-car bandDelta 0 at locked
Ayalon rest poses, so this is **not** remaining pixel 0/4.

Owner screenshot 2026-09-11 22:55.30 on track `oldjaffa`, mode הקפה 1/3,
day, t=0:09.40, 0 km/h, POI מגדל השעון. Owner reports the track flickers
constantly, the road is not visible, HUD toasts `חזור לכביש`, and forward
driving does not work. Origami Sabra is GFX-01 family. Distinct from
GFX-07 (Jerusalem P2P cannot-drive-forward). r6.34 hero-car bandDelta 0
at locked Ayalon rest poses, so this is **not** remaining pixel 0/4.

Owner screenshot 2026-09-11 22:56.51 on track `namal`, mode הקפה 1/3,
day, t=0:06.31, 10 km/h, POI נמל תל אביב. Owner reports the South Tel Aviv
route flickers constantly. The carriageway is a flooded coastal water plane;
the Sabra is GFX-01 origami sitting on the water. Distinct from GFX-08
(namal dual cars / stacked roads at t=0:40+) and GFX-09 (Old Jaffa flicker).
r6.34 hero-car bandDelta 0 at locked Ayalon rest poses, so this is **not**
remaining pixel 0/4.

| id | track | defect | status |
|---|---|---|---|
| GFX-01 | namal | hero-car GLB body vertical/origami vs procedural extras | queued after RSH-036 |
| GFX-02 | ayalon | leftover cubemap is scene.environment ≡ environmentIntensity=0; bakeEnv 0x3a9ae0 hue is cubemap not background; remaining hemi is hemi.color not groundColor; g08 fill and sun are independent additive luma; g07 upper is ramps not sky not piers; remaining g07 after ramps is leftover unnamed not env (both ≡ ramps); leftover g07 after ramps is buildings not road (bandDelta −0.1037; leftover-after-ramps-as-env ≈ 0); leftover g07 after ramps+buildings is instanced+ground not water not glass (bandDelta −0.0345/−0.0453; leftover-after-buildings-as-env ≈ 0); leftover g07 after ramps+buildings+instanced+ground is remaining non-mesh not unnamed meshes not env (leftover 0.2087, unnamed −0.006 below 0.02, leftover-after-ignd-as-env ≈ 0); leftover g07 after all world meshes is remaining empty-scene vs golden not background not clear not fog not post not env (leftover 0.2027, background +0.7322 increases, leftover-after-empty-as-env ≡ 0); leftover g07 after all world.group meshes is remaining empty-scene vs golden not occupancy outside world.group not hero not fx not blob not env (leftover 0.2027, outside ≡ 0, leftover-after-empty-as-outside ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not toneMapping not ColorManagement not env (leftover 0.2027, LinearSRGB +0.7482 increases, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not fov not near not far not env (leftover 0.2027, fov/near/far/clip ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not follow not height not look-ahead not env (leftover 0.2027, follow/height/look/pose ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not pixelRatio not drawingBuffer not post.setSize not env (leftover 0.2027, ratio/buffer/size/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not bloom not SMAA not grade not env (leftover 0.2027, bloom/smaa/grade/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not antialias not samples not alpha not env (leftover 0.2027, aa bandDelta +0.0003 below 0.02 L2 +38.79 increases, samples/alpha ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not shadowMap not fog not scissor not env (leftover 0.2027, shadow/fog/scissor/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not autoClear not sortObjects not overrideMaterial not env (leftover 0.2027, auto/sort/override/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not physicallyCorrectLights not premultipliedAlpha not logarithmicDepthBuffer not env (leftover 0.2027, phys/premul/logdepth/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not preserveDrawingBuffer not stencil not reversedDepthBuffer not env (leftover 0.2027, preserve/stencil/reversed/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not localClippingEnabled not clipShadows not clipIntersection not env (leftover 0.2027, local/shadows/intersect/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not autoClearColor not autoClearDepth not autoClearStencil not env (leftover 0.2027, color/depth/stencil/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not dithering not shadowMap.autoUpdate not info.autoReset not env (leftover 0.2027, dither/shadow/reset/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not shadowMap.type not shadowMap.needsUpdate not clippingPlanes not env (leftover 0.2027, type/needs/clip/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not useLegacyLights not debug.checkShaderErrors not xr.enabled not env (leftover 0.2027, lights/debug/xr/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not shadowMap.enabled not xr.cameraAutoUpdate not debug.onShaderError not env (leftover 0.2027, map/cauto/onerr/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not xr.framebufferScaleFactor not transmissionResolutionScale not VSMShadowMap not env (leftover 0.2027, fbuf/trans/vsm/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not xr.setFoveation not xr.setReferenceSpaceType not PCFSoftShadowMap not env (leftover 0.2027, fov/ref/soft/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not setOpaqueSort not setTransparentSort not setClearAlpha not env (leftover 0.2027, opaque/trans/alpha/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not setViewport not setClearColor not renderer.compile not env (leftover 0.2027, setViewport 640×400 g07 +0.6188 increases, setClearColor/compile/env ≡ 0, leftover-after-empty-as-env ≡ 0) | r6.97 done; AUD-105 next |
| GFX-03 | ayalon | night point-to-point chase camera clips through hero-car at Kibbutz Galuyot / HaHagana | r6.98 camera clamp / lift |
| GFX-04 | ayalon | night P2P camera clips into retaining wall at Kibbutz Galuyot t=0:25.66; car exploded from above | r6.98 camera clamp / collider |
| GFX-05 | caesarea | water/ground plane cuts through the road at אמת המים t=0:05.20; car boxy with side glass | r6.98 water skip-if-overlap; live water left of ribbon |
| GFX-06 | haifa | trees poke through the road at הגנים הבהאיים so the driving surface is hidden; car floats | r6.98 hillside shoulder; live road visible t=0.35 |
| GFX-07 | jerusalem | P2P origami car + steep camera at מחנה יהודה t=0:04.59 / 1 km/h; owner reports cannot drive forward | r6.98 live 31 km/h dA +0.82 onTrack |
| GFX-08 | namal | dual cars + stacked multi-dimension roads / water plane / cyan spline arc at t=0:40.10 and 0:47.69 | r6.95 ghost hide + r6.98 water; live one car |
| GFX-09 | oldjaffa | flickering track + missing road + cannot drive forward at מגדל השעון t=0:09.40 / 0 km/h lap 1/3 | r6.98 Ayalon-only reflector; live clock tower beside road |
| GFX-10 | namal | flickering track + flooded water plane + origami car at נמל תל אביב t=0:06.31 / 10 km/h lap 1/3 | r6.98 Ayalon-only reflector + opaque coastal water |

Do **not** start AUD-105 empty-scene isolation. Leftover g07 0.2027 is
irreducible without a PNG refresh. Continue product work on this branch
under OWNER-2026-09-05-CONTINUOUS-IMPROVEMENT until the remaining 32
units are implemented. RSH-037 stays unactivated as a queue unit;
instrumentation already lives on the HUD.

Master plan r7.46 retains 67 units, 42 historical findings, 6 bundles and 104
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
