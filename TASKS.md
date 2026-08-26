# Execution plan — remaining Codex (honest)

Do **not** bake more procedural PNGs. Do **not** add cities. Stop when a gate is green.

## A — Ayalon vertical slice (gate 1)
- [ ] A1 One real road strip (photo/GIS) or officially drop the claim
- [ ] A2 Azrieli: measured footprint + glass curtain photos, not primitives
- [ ] A3 8+8 lanes + rail median measured against aerial
- [ ] A4 Screenshot QA vs reference photo (human: “that’s Azrieli”)

## B — Hero car (gate 2)
- [ ] B1 One external glTF (not extrude)
- [ ] B2 Paint shader flakes, not `flake.png` dots
- [ ] B3 Four wheel meshes + steer
- [ ] B4 Hide cabin or model a cockpit

## C — Physics (gate 3)
- [ ] C1 Per-wheel Pacejka + load
- [ ] C2 Suspension travel → Y
- [ ] C3 Grade from height samples (Ramon/Hermon/Jerusalem)
- [ ] C4 OBB buildings vs cylinder

## D — Renderer (gates 4–7)
- [ ] D1 Optional `WebGPURenderer` with WebGL fallback (game still runs)
- [ ] D2 TSL road + car only
- [ ] D3 Three.js CSM
- [ ] D4 SMAA default; TRAA after budget
- [ ] D5 No SSGI until A+B pass

## E — Asset pipe (gate 8)
- [ ] E1 Actual `.ktx2` for asphalt/sky
- [ ] E2 Delete runtime canvas fallbacks
- [ ] E3 Shipping path: zero `document.createElement("canvas")` except probe
- [ ] E4 Lease every RT in ResourceRegistry

## F — Rest of Israel (after A is green)
Rothschild → Hayarkon/Reading → Jaffa → Jerusalem A→B → Ramon A→B → Hermon A→B → Carmel.  
Each: 15 GPS landmarks + reference still + zero generic boxes.

## G — Ship
- [ ] Playwright golden cameras
- [ ] Forced WebGL2 CI
- [ ] WebGPU CI if D1 lives
- [ ] Strip `?qa=1` from shipping
- [ ] 13/13 gates green (today **0/13**)
