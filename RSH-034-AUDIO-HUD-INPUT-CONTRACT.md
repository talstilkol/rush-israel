# RSH-034 — Lock audio, HUD, keyboard, touch and gamepad behaviour

**Unit:** RSH-034
**Implementation base:** `550c681445b2473cbd377131b60715ade0e58774`
**Branch:** `agent/rsh-034-audio-hud-input`
**State effective on:** validated merge of the RSH-034 pull request

## Acceptance boundary

RSH-034 records the live Version 1 oscillator audio graph, HUD overlay,
keyboard map, touch pad and gamepad map. It does **not** rewrite
`audio.ts`, `input.ts`, `input-curve.ts`, `hud.tsx`,
`touch-controls.tsx`, `package.json`, `cars.ts`, `physics.ts`,
`vehicle.ts`, Ayalon / daylight / night locks, unify input maps
(RSH-044), produce the Ayalon golden pack (RSH-035), import GIS or
navigation accuracy, freeze owner settings, or start public
distribution.

## Locked identity

| Field | Required value |
|---|---|
| Audio backend | `oscillator` |
| Radio stations | Pulse 101 / Yam FM / Underground / White Night |
| Station BPM | `126 / 94 / 138 / 108` |
| Master / SFX / music gain | `0.55 / 0.7 / 0.22` |
| Engine oscillators | saw 70 Hz + triangle 90 Hz, lowpass 420 Hz |
| Siren / drift / rain | square 740 Hz / bandpass 900 Hz / highpass 1400 Hz |
| Radio toast | `2.6` s |
| `padCurve` | deadzone `0.12`, exponent `1.6`, no FFB |
| Keyboard | WASD + arrows; Space/Shift drift; E/Q nitro; R rewind; Esc/P pause |
| Gamepad[0] | axis 0 steer; axis 1 / RT throttle; LT brake; L1/R1 drift; A/B nitro; X rewind |
| Steer filter | `11` near zero / `6.5` moving |
| Throttle filter | `5.5` rise / `8` fall |
| HUD speed unit | `km/h` |
| HUD surfaces | photo, qa, mode/lap, pause, wrong-way, off-track, wanted, rewind, replay, street/POI, speed |
| Touch | `md:hidden` pad + Rewind / Brake / Drift / Nitro / Gas |
| Runtime rewrite | forbidden |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |
| Public distribution | forbidden |

## Deferred boundary

RSH-035 — Produce the unique Ayalon golden pack and owner approval
record — remains deferred, unauthorized and uncreated. RSH-034 does
not add `src/game/ayalon-golden/` or RSH-035 transport files.
