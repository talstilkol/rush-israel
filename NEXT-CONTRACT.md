**Version:** 20.49.0
**Date:** 2026-09-11, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** 8650f45c85ed81d499716f347341b8b6536f47ce
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
(−48.7/−53.0). g07 upper remains ramps. Product hex stays `0xd0d4d8`. Preserve
historical preparation 34324754353. PNG bytes last changed 26 August 12:00:42Z,
before spaghetti ramps.

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

## r6.49 and subsequent acceptance
1. Remaining 0/4 is sun intensity luma plus bakeEnv 0x3a9ae0 hue plus leftover
   gray IBL vs off on g01/g05/g08 bottom: intensity occupies luma (live too
   bright vs dark locked PNG), 0x3a9ae0 vs 0x808080 occupies B −30.2/−32.8,
   and leftover gray cubemap vs IBL-off occupies B −18.5/−20.2. Additive
   gray+hue equals r6.45 IBL-off (−48.7/−53.0). Hemi and disc are not remaining
   day-bottom drivers. setNight does not rebake, so g08 present keeps the day
   cubemap. Fill joins intensity on g08 night. g07 upper remains ramps.
   Live sampling must force 1280×800 pixelRatio 1 after snapCamera(true),
   capture product present (`post.setDrive(0, false); post.render()`), locate
   the dominant 200px band, and isolate remaining gray IBL internals
   (0x808080 background vs baked hemi vs baked disc inside the gray PMREM)
   independently of IBL-off vs product hue vs sun intensity vs fill
   without changing product color, exposure or refreshing PNGs.
   Smoke must keep verifyWorldLayers, verifyWorldResidual, verifyWorldMismatch,
   verifyWorldBias, verifyWorldScene, verifyWorldRegion, verifyWorldColumn,
   verifyWorldSlice, verifyWorldExtra, verifyWorldMaterial, verifyWorldFactor,
   verifyWorldRgb, verifyWorldShade, verifyWorldTone, verifyWorldTerm,
   verifyWorldBeam, verifyWorldRay, verifyWorldIbl, verifyWorldGain,
   verifyWorldCube, verifyWorldProbe, verifyWorldBake, verifyWorldSky and
   verifyWorldGray. Live rest chase 7.4/1.92 must stay. Remaining pixel 0/4 is
   that intensity+hue+gray-IBL gap plus g07 upper ramps. PNG refresh, threshold
   drift, color retune, exposure retune and skipped comparison fail closed.
   176 piers, 546 legacy colliders, 50 ramps, rest-pose 1.6, 1.05 radius and
   generation-11 lock stay. Freeze path count stays 85. Pixel 0/4 is not freeze.
2. Preserve the r6.18 Chromium install retry, the r6.19 slab-underside support
   placement, the r6.20 product font URL pins, the r6.21 rest chase 7.4/1.92,
   the r6.22 complete arcade lap, the r6.23 visual hull, the r6.24 original
   protocol, the r6.25 rest-camera attribution, the r6.26 world-layer isolation,
   the r6.27 residual split, the r6.28 mismatch isolation, the r6.29
   channel-bias isolation, the r6.30 scene-buffer isolation, the r6.31
   region-band isolation, the r6.32 column isolation, the r6.33 slice isolation,
   the r6.34 extra isolation, the r6.35 material isolation, the r6.36 factor
   isolation, the r6.37 rgb sampling, the r6.38 shade isolation, the r6.39
   tone isolation, the r6.40 term isolation, the r6.41 beam isolation, the
   r6.42 ray isolation, the r6.43 ibl isolation, the r6.44 gain isolation, the
   r6.45 cube isolation, the r6.46 probe isolation, the r6.47 bake isolation,
   the r6.48 sky isolation and the r6.49 gray isolation.
3. Preserve 1280x800 images, threshold 0.12, failure 8%, generation 11 lock and
   owner approval. Do not refresh golden PNGs or silently change typography.
   Rendering performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.49 retains 67 units, 42 historical findings, 6 bundles and 59
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
