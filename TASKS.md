# Remaining work — none of these are 100

Do **not** bake more procedural PNGs. Do **not** add cities.

## A — Ayalon (gate 1)
- [ ] A1 Photo/GIS road or drop the claim
- [ ] A2 Azrieli measured + photo glass
- [ ] A3 Aerial 8+8+rail
- [ ] A4 Human QA vs still

## B — Hero car
- [ ] B1 External glTF
- [ ] B2 Shader flakes
- [x] B3 Wheels+steer — **PARTIAL**
- [ ] B4 Cockpit

## C — Physics
- [x] C1 Pacejka — **PARTIAL**
- [x] C2 Suspension Y — **PARTIAL**
- [x] C3 Grade*g — **PARTIAL** (not DEM)
- [x] C4 AABB — **PARTIAL**

## D — Renderer
- [ ] D1 WebGPURenderer
- [ ] D2 TSL
- [x] D3 CSM — **PARTIAL** (2 cascades @1024 High; not 4-split TRAA)
- [ ] D4 SMAA default; TRAA later
- [ ] D5 No SSGI until A+B

## E — Assets
- [ ] E1 `.ktx2` (no KTX-Software)
- [x] E2 Canvas fallbacks — **PARTIAL** (7 left)
- [ ] E3 Zero canvas except probe
- [x] E4 Lease RTs — **PARTIAL** (env + probe; not every composer RT)

## F — Israel after A green
Rothschild / Reading / Jaffa / Jerusalem / Ramon / Hermon / Carmel: 15 GPS + still + zero generic boxes.

## G — Ship
- [ ] Golden CI
- [ ] WebGL2 CI
- [ ] WebGPU CI if D1
- [ ] Strip `?qa=1`
- [ ] **0/13 gates**
