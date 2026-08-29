# RUSH Israel — Frozen Version 1 Product Definition

**Unit:** RSH-009  
**Machine authority:** `PRODUCT-DEFINITION.json`  
**State:** FROZEN

## Product sentence

RUSH Israel Version 1 is a **private, owner-controlled browser driving game**
using Three.js, WebGL and 120 Hz simcade physics on fictional routes inspired by
Israeli places.

## In scope

| Area | Version 1 boundary |
|---|---|
| Tracks | Exactly 8 owner-approved routes; exact IDs are locked by RSH-010 |
| Vehicles | 5 fictional vehicles; performance claims are calibrated by RSH-033 |
| Renderer | `WebGLRenderer` is the default |
| Physics | Fixed-step simcade at 120 Hz |
| Play | Local single-player driving, races and free-drive flows accepted by later gates |
| Inputs | Keyboard, touch and gamepad |
| Languages | Hebrew and English |
| State | Local progress, save and timed records, subject to integrity gates |
| Delivery | Private owner-controlled web build |

## Intended eight-track names

1. Ayalon
2. Rothschild
3. Yarkon–Reading
4. Jaffa
5. Jerusalem–Scopus
6. Haifa–Carmel
7. Ramon
8. Hermon

RSH-010 must map these names to exact live repository IDs and classify all 56
catalogue entries. This document does not guess those IDs.

## Explicitly out of scope

- public distribution, licensing or archive submission;
- online multiplayer;
- mandatory accounts or a backend database as a game requirement;
- monetization and user-generated content;
- WebGPU as the default renderer;
- more than eight Version 1 tracks;
- native iOS or Android store packages;
- real-map, navigation, survey or GIS accuracy;
- Unreal, Unity, photogrammetry or scanned/licensed real vehicles;
- a claim of console-level photorealism.

## Truth boundaries

A feature named in scope is a **Version 1 commitment**, not evidence that its
release gate already passes.

Current release readiness remains **0/13**. In particular:

- all five zero-to-100 product claims fail the current measurements and belong to RSH-033;
- branch protection is not applied and remains an owner setting action;
- asset provenance and licensing are not complete until RSH-011;
- browser/device support is not defined until RSH-043;
- accessibility, privacy and Alpha UX are not accepted until RSH-048.

## Change control

This definition cannot expand implicitly. Any change requires explicit owner
authorization, a canonical queue/plan update, a separate reviewed unit and
preservation of this historical definition.
