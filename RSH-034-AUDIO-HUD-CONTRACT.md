# RSH-034 — Lock audio, HUD, keyboard, touch and gamepad behaviour

**Unit:** RSH-034
**Implementation base:** `550c681445b2473cbd377131b60715ade0e58774`
**Base tree:** `4a2e0d3a02cb721a87b0a9485937c0a4dc5b1788`
**Branch:** `agent/rsh-034-audio-hud-input`
**State effective on:** validated merge of the RSH-034 pull request

## Acceptance boundary

RSH-034 locks the live Version 1 audio backend, race HUD, keyboard map,
touch controls and gamepad map. It does **not** rewrite `audio.ts`,
`input.ts`, `hud.tsx`, `touch-controls.tsx`, `cars.ts`, `physics.ts` or
`package.json`, import FMOD/Howler, unify later input maps (RSH-044),
produce the Ayalon golden pack (RSH-035), or grant owner freeze / GIS
accuracy / public distribution.

Physics version 7 and the five fictional 0–100 claims stay the accepted
RSH-033 lock. Night and daylight locks stay accepted. Default boot stays
day / clear.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Audio backend | Web Audio `oscillator` |
| Radio | 4 stations: Pulse 101, Yam FM, Underground, White Night |
| Station BPM | `126 / 94 / 138 / 108` |
| FMOD / Howler / streamed music | forbidden |
| Mute | Esc settings |
| Keyboard steer | `A`/`←` = `+1`, `D`/`→` = `-1` |
| Keyboard throttle / brake | `W`/`↑`, `S`/`↓` |
| Keyboard drift | `Space`, `ShiftLeft`, `ShiftRight` |
| Keyboard nitro | `E`, `Q` |
| Keyboard pause / rewind | `Escape`/`P`, `R` |
| Gamepad | index `0`; analog stick `padCurve(dead 0.12, exp 1.6)`; no FFB |
| Gamepad throttle / brake | axis 1 or RT `buttons[7]` / LT `buttons[6]` |
| Gamepad drift / nitro / rewind | bumpers `4|5` / `0|1` / `2` |
| Touch | `md:hidden` pad plus Rewind, Brake, Drift, Nitro, Gas |
| HUD speed | integer `km/h` from `speed * 3.6` |
| HUD QA | `?qa=1` shows backend · p95 · dc · tri · g · t · kin |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |
| Public distribution | forbidden |

## Runtime preservation

| Domain | Change |
|---|---:|
| `src/game/audio.ts` | `0` |
| `src/game/input.ts` | `0` |
| `src/game/input-curve.ts` | `0` |
| `src/components/game-app/hud.tsx` | `0` |
| `src/components/touch-controls.tsx` | `0` |
| `src/game/cars.ts` | `0` |
| `src/game/physics.ts` | `0` |
| `package.json` | `0` |
| Ayalon / daylight / night / physics locks | `0` |
| Assets under `public/` | `0` |
| Release gates green | `0` |

The lock module at `src/game/ayalon-feel/` is the canonical record later
G5 units may import. Fail-closed checking proves the live tokens still
match the lock.

## Deferred boundary

RSH-035 — Produce the unique Ayalon golden pack and owner approval
record — remains deferred, unauthorized and uncreated. RSH-034 does not
add `src/game/ayalon-golden/` or RSH-035 transport files.
