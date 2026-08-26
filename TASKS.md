# Remaining work — none of these are 100

Do **not** bake more procedural PNGs. Do **not** add cities.

## A — Ayalon (gate 1) — all open
- [ ] A1 Photo/GIS road strip or drop the claim
- [ ] A2 Azrieli measured + photo glass (now: primitives, ratio only)
- [ ] A3 Aerial-measured 8+8+rail (now: 8-lane UV + 18m gap)
- [ ] A4 Human QA vs reference still

## B — Hero car (gate 2)
- [ ] B1 External glTF, not extrude
- [ ] B2 Shader flakes, not flake.png
- [x] B3 Four wheel meshes + steer — **PARTIAL**
- [ ] B4 Cockpit or hide cabin

## C — Physics (gate 3)
- [x] C1 Per-wheel Pacejka — **PARTIAL**
- [x] C2 Suspension Y — **PARTIAL** (visual)
- [x] C3 Grade*g — **PARTIAL** (Ramon/Hermon/Jerusalem elevation; not DEM)
- [x] C4 AABB hx/hz — **PARTIAL** (not rotated OBB)

## D — Renderer
- [ ] D1 WebGPURenderer optional
- [ ] D2 TSL road+car
- [ ] D3 Three CSM
- [ ] D4 SMAA default; TRAA later
- [ ] D5 No SSGI until A+B

## E — Assets
- [ ] E1 Real `.ktx2` (blocked: no KTX-Software)
- [x] E2 Delete canvas fallbacks — **PARTIAL** (baked path fail-closed; 7 canvases left)
- [ ] E3 Shipping: zero canvas except probe
- [ ] E4 Lease every RT

## F — Israel after A is green
Rothschild / Reading / Jaffa / Jerusalem / Ramon / Hermon / Carmel:  
15 GPS + reference still + zero generic boxes. Today: silhouette only.

## G — Ship
- [ ] Golden cameras CI
- [ ] Forced WebGL2 CI
- [ ] WebGPU CI if D1
- [ ] Strip `?qa=1`
- [ ] **0/13 gates green**
