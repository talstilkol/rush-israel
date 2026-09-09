# RSH-036 r6.16 — pitched/rolled envelope, slab contact, multi-obstacle exit

Candidate, 9 September 2026. Base 458096c707135df05b603c77ff7729e6d8b7eff4
(r6.15 documentation follow-up; product parent ec79dbefaef2de415c252ef0ce1cd1b76c634df3).
No merge or freeze; 35/67 accepted; 32 remain. r6.15 exact-head evidence is retained.

AUD-26 extends the upright 1.6-unit proxy into an 8-corner wheelbase box
(half-length 1.25, half-width 1.05, height 1.6). Rest pose remains exactly
{yMin:0, yMax:1.6}. Non-finite pitch/roll fail closed at 0.75/0.34. Overhead
slabs are ceilings when the origin stays below the span; a grounded car that
cannot fit is a solid wall instead of a burial. Overlapping circles use a
combined Gauss-style exit of at most four iterations; a single collider keeps
the historical +X coincidence escape. Ramp undersides block airborne passage
without capturing a live 1.2-unit support or clipping a car through a 9.4
underpass. Legacy unbounded colliders, 546 collider records, 50 ramp recipes,
8 checkpoints, 1.05 radius, handling constants, images, thresholds, package
locks, physicsVersion 7 and storage remain unchanged.

Same 41 vehicle height/centre cases: old 20 pass/21 fail; candidate 41 pass.
New envelope file: 19 cases. Old upright proxy still misses a pitched roof
against a 1.7-unit slab; the envelope catches it without burying the origin.
Two intersecting r=1.77 circles at a midpoint leave residual overlap on the
old single-pass solver and clear after the combined exit. A 9.4 deck still
clears ground travel and remains a supported surface. Malformed bounds or
envelopes cannot turn an obstacle into a pass-through.

This is still an arcade box proxy, not a render-mesh or whole-route
qualification. Local unit suite 1,110/1,110. Original golden, record
compatibility, three font references and freeze remain open. All 13 release
gates remain open; 66 asset licences unverified. Exact published-head CI is
pending for this candidate.
