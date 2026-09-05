# RSH-036 runtime repair r6.5

Date:6September2026 (Asia/Jerusalem). Base:3486e3351f596670e9fb0a55387bf0ecdcd442df.
Main:e01d91de5dfa11685a51dcea90c1dbc8e2d2148a. PR39 remains unaccepted.

## Implemented

Eight families: sky, tree, flare, water, curb, facade, sign and car.
Each uses one in-flight transaction. Preparation completes for every member
before a tuple/Map is published; rejection frees successful members, including
late successes. Retry starts a complete new batch. Successful caches remain
process-owned, and URLs/texture settings/car-clone ownership are preserved.

GLTF rollback handles all supplied scenes and deduplicates geometries, materials,
textures, skeletons and closable image data within the unpublished batch.
The helper is explicitly unsuitable for live shared caches. Failed partial
parsing inside third-party loaders is not claimed repaired.

## Actual local tests

Same48 regression tests: r6.4 has5 passed/43 failed; candidate48 passed/0failed.
Additional5 helper tests passed. Local TypeScript5.8.3 transpiles real modules;
only network/THREE fixtures are replaced. This is not GPU-memory qualification
or a complete locked dependency installation.8 actual browser cases have been
added to the existing normal required CI browser gate; that exact-head run is
still required. No expected test total substitutes for measured results.

## Preserved and open

Original asset review retained byte-for-byte. Original golden PNGs, threshold0.12,
8percent limit, ayalon.lock generation11, historical owner approval, package
lockfiles, world/camera/physics and Rothschild fixes are unchanged.
The explicit freeze inventory grows to56 paths, still partial; freeze_granted=false.
Master plan retains67 units,18 audit IDs,42 historical findings and6 bundles.
Accepted35; remaining32. All13 release gates and66 asset-licence gaps stay open.

## Golden source investigation

GitHub path history identifies b0e3e525689955e6ff944b49f08c814e49cf03fa,
26August2026, as the last baseline-image commit for day-g01. The new read-only
provenance script independently checks all4 current images against that commit,
records their actual last revisions and checks13 relevant source/config paths.
Its generated artifact must be read before claiming the all-frame findings.
Refactor-related hash differences alone are not root-cause attribution.
Original visual comparisons and generated dependency closure remain blockers.

Source for ownership API semantics: https://threejs.org/manual/en/how-to-dispose-of-objects.html
