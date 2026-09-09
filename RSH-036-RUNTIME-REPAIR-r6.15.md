# RSH-036 r6.15 — finite-height pier contacts

Candidate,9 September2026. Base df42ed916a8a24acb7a580c0ab176305f874fef6.
No merge or freeze;35/67 accepted;32 remain. r6.14 exact-head evidence is retained.

AUD-25 adds colliders directly alongside the176 visible cylinder meshes. Each span
extends from ground0 to its unchanged slab underside. Contact radius1.77 is the
widest0.72 pier radius plus existing1.05 car padding. Vehicle height1.6 is an
explicit upright arcade proxy,not a full pitched/rolled roof/body model. Legacy
colliders without bounds keep all-height behavior. Malformed bounds cannot make
an obstacle silently disappear. Geometry,50 ramps,8 checkpoints,handling constants,
images,thresholds,package locks and storage remain unchanged.

Same41 vehicle tests:old20 pass/21 fail;candidate41 pass/0 fail.15 evidence-validator
cases fail on missing,duplicate,nonfinite,forged and incorrectly cleared data.
Actual browser and full exact-head CI remain pending. Existing browser contracts
now require722 total entries; original circular-centre tests retain their514
unbounded entries. A separate mesh-bound4-condition x5-car matrix covers additions.
The preparation must compare all546 retained collider records and50 ramp recipes
against the exact base,not merely compare counts.

Slab/roof collisions,multi-obstacle convergence,rendering parity,physics/record
version policy and3 font dependencies remain open. Original golden is not
rebaselined or weakened. All13 release gates remain open;66 asset licences unverified.

Preparation34323947483 failed on711 instead of722 final collider entries. The
spawn-area scenery filter removed11 new structural-pier contacts. Structural
piers now survive that filter, with an actual four-car grid penetration gate.
Raw browser data is retained before structural assertions. The failed attempt
is preserved; no product publication or golden comparison occurred in it.
