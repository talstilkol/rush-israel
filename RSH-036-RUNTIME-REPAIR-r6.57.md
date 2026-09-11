# RSH-036 r6.57 — leftover gray cubemap vs IBL-off is not LightProbe vs MeshBasic envMap vs custom road-shader env

Candidate, 11 September 2026. Base 3102ea6
(r6.56 road isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.56 exact-head CI is not claimed. GFX-01 namal car orientation stays
queued after RSH-036 and is not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-67: leftover gray cubemap vs IBL-off is not LightProbe vs MeshBasic envMap vs custom road-shader env

r6.56 proved leftover fromScene of Color 0x808080 vs off occupies B −18.5/−20.2
and road vs all-standard vs car envMapIntensity are not remaining day-bottom
drivers. The new probe isolates LightProbe intensity 0 vs MeshBasicMaterial
envMap=null vs unbinding rush-road onBeforeCompile on a 0x808080 fromScene
independently of road vs all-standard vs car envMapIntensity vs 0x3a9ae0 hue vs
intensity vs fill after setNight/snapCamera(true) at threshold 0.12 without
changing product color or exposure. probe/basic/shader deltas use the 0x808080
hue buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required, probe 1 / basic 1 / shader 1 /
hue 1 / intensity 1 / fill 1):

| pose | band | dominantRecv | probe B Δ | basic B Δ | shader B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | **+0.2** | **+0.2** | **+0.2** | −30.2 | −28.0 |
| g05 | bottom | intensity | **+0.3** | **+0.3** | **+0.3** | −32.8 | −31.1 |
| g07 | upper | basic | +8.0 | +8.0 | +8.0 | −24.4 | −2.8 |
| g08 | bottom | intensity | **0.0** | **0.0** | **0.0** | −21.2 | −11.5 |

Day-bottom leftover fromScene 0x808080 vs off occupies B −18.5/−20.2. probe ≡
basic ≡ shader ≡ gray cubemap (ΔB +0.2/+0.3). Leftover is not LightProbe versus
MeshBasic envMap versus custom road-shader env. Intensity occupies luma. Fill
joins intensity on g08 night (−12.4). g08 night probe ≡ basic ≡ shader ≡ gray
because setNight does not rebake. g07 upper remains ramps. Camera stays
7.4/1.92.

Local unique cases: 28 in `scripts/world-recv.test.mjs`. Previous r6.56
expected 2,121 + 28 = 2,149. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
