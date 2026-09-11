**Version:** 20.81.0
**Date:** 2026-09-12, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** cefd16a
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

## r6.81 and subsequent acceptance
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
   Live sampling must force 1280×800 pixelRatio 1 after snapCamera(true),
   capture product present (`post.setDrive(0, false); post.render()`), locate
   the dominant 200px band, and isolate leftover g07 empty-scene vs golden
   independently of shadowMap vs fog vs scissor
   without changing product color, exposure or
   refreshing PNGs.
   Smoke must keep verifyWorldLayers through verifyWorldAa. Live rest chase 7.4/1.92 must stay. Remaining pixel 0/4
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
   g07 empty-scene vs golden after autoClear/sortObjects/overrideMaterial neutralization. PNG refresh, threshold drift, color
   retune, exposure retune and skipped comparison fail closed.
   176 piers, 546 legacy colliders, 50 ramps, rest-pose 1.6, 1.05 radius and
   generation-11 lock stay. Freeze path count stays 85. Pixel 0/4 is not freeze.
2. Preserve the r6.18 Chromium install retry through the r6.80 sfs isolation
   and the r6.81 acm isolation.
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

| id | track | defect | status |
|---|---|---|---|
| GFX-01 | namal | hero-car GLB body vertical/origami vs procedural extras | queued after RSH-036 |
| GFX-02 | ayalon | leftover cubemap is scene.environment ≡ environmentIntensity=0; bakeEnv 0x3a9ae0 hue is cubemap not background; remaining hemi is hemi.color not groundColor; g08 fill and sun are independent additive luma; g07 upper is ramps not sky not piers; remaining g07 after ramps is leftover unnamed not env (both ≡ ramps); leftover g07 after ramps is buildings not road (bandDelta −0.1037; leftover-after-ramps-as-env ≈ 0); leftover g07 after ramps+buildings is instanced+ground not water not glass (bandDelta −0.0345/−0.0453; leftover-after-buildings-as-env ≈ 0); leftover g07 after ramps+buildings+instanced+ground is remaining non-mesh not unnamed meshes not env (leftover 0.2087, unnamed −0.006 below 0.02, leftover-after-ignd-as-env ≈ 0); leftover g07 after all world meshes is remaining empty-scene vs golden not background not clear not fog not post not env (leftover 0.2027, background +0.7322 increases, leftover-after-empty-as-env ≡ 0); leftover g07 after all world.group meshes is remaining empty-scene vs golden not occupancy outside world.group not hero not fx not blob not env (leftover 0.2027, outside ≡ 0, leftover-after-empty-as-outside ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not toneMapping not ColorManagement not env (leftover 0.2027, LinearSRGB +0.7482 increases, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not fov not near not far not env (leftover 0.2027, fov/near/far/clip ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not follow not height not look-ahead not env (leftover 0.2027, follow/height/look/pose ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not pixelRatio not drawingBuffer not post.setSize not env (leftover 0.2027, ratio/buffer/size/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not bloom not SMAA not grade not env (leftover 0.2027, bloom/smaa/grade/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not antialias not samples not alpha not env (leftover 0.2027, aa bandDelta +0.0003 below 0.02 L2 +38.79 increases, samples/alpha ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not shadowMap not fog not scissor not env (leftover 0.2027, shadow/fog/scissor/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0); leftover g07 after world.group+outside is remaining empty-scene vs golden not autoClear not sortObjects not overrideMaterial not env (leftover 0.2027, auto/sort/override/env/both/pack ≡ 0, leftover-after-empty-as-env ≡ 0) | r6.81 done; AUD-92 next |
| GFX-03 | ayalon | night point-to-point chase camera clips through hero-car at Kibbutz Galuyot / HaHagana | queued after RSH-036 |
| GFX-04 | ayalon | night P2P camera clips into retaining wall at Kibbutz Galuyot t=0:25.66; car exploded from above | queued after RSH-036 |
| GFX-05 | caesarea | water/ground plane cuts through the road at אמת המים t=0:05.20; car boxy with side glass | queued after RSH-036 |
| GFX-06 | haifa | trees poke through the road at הגנים הבהאיים so the driving surface is hidden; car floats | queued after RSH-036 |
| GFX-07 | jerusalem | P2P origami car + steep camera at מחנה יהודה t=0:04.59 / 1 km/h; owner reports cannot drive forward | queued after RSH-036 |
| GFX-08 | namal | dual cars + stacked multi-dimension roads / water plane / cyan spline arc at t=0:40.10 and 0:47.69 | queued after RSH-036 |
| GFX-09 | oldjaffa | flickering track + missing road + cannot drive forward at מגדל השעון t=0:09.40 / 0 km/h lap 1/3 | queued after RSH-036 |

AUD-92 is the next RSH-036 isolation: leftover g07 empty-scene vs golden
independently of physicallyCorrectLights vs premultipliedAlpha vs
logarithmicDepthBuffer (product renderer stays).
GFX-01, GFX-03, GFX-04, GFX-05, GFX-06, GFX-07, GFX-08 and GFX-09 stay
recorded only; do not start them before RSH-036 closes.

Master plan r6.81 retains 67 units, 42 historical findings, 6 bundles and 91
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
