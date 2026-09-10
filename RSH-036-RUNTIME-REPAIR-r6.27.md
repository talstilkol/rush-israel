# RSH-036 r6.27 — physical-material water is not water; residual is not a named class

Candidate, 10 September 2026. Base 6fb27397b9edec289a48e8acf598cb049ba6b002
(r6.26 world-layer isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## r6.26 exact-head CI independently recorded

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`;
audit-source-34460850784-1 SHA-256
`22bb39cd0599969ff8463823e0c395a2a7b77fe176be5c8be0d392be0770c00a`.
This is not freeze or original-golden acceptance.

## AUD-37: MeshPhysicalMaterial is not water; residual other is not a named class

r6.26 classified any MeshPhysicalMaterial as water (90 meshes). Carriageway,
landmark glass and other physical materials share that type, so the water
bucket was not water. Residual other (698) had no named split.

The new probe classifies ior-1.33 transparent physical as water, non-instanced
physical with `userData.lanes` as carriageway, remaining non-instanced physical
as glass, SphereGeometry radius ≥ 8000 as sky, PlaneGeometry width ≥ 1000 as
ground, and keeps residual as an unnamed leftover. Isolation runs at
g01/g05/g07/g08 after `snapCamera(true)`.

Live membership: water 1 / carriageway 2 / sky 2 / ground 1 / glass 80 /
instanced 47 / residual 695. Live contribution (changedFraction of 49 samples):
g01 ground 0.367 / ramps 0.265 / sky 0.102;
g05 ground 0.510 / sky 0.245 / glass 0.163;
g07 ramps 0.694 / sky 0.245;
g08 ground 0.510 / sky 0.306 / glass 0.082.
Water and carriageway contribute 0% at all four poses. Camera stays 7.4/1.92.
PNG refresh and treating this probe as original-golden fail closed.

Local unique cases: 27 in `scripts/world-residual.test.mjs`. Previous r6.26
expected 1,283 + 27 = 1,310. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
