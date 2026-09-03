# RUSH Israel — Acceleration Baseline and Claim Gate

**Established:** RSH-007  
**Calibrated:** RSH-033  
**Physics version:** 7  
**Track:** Ayalon  
**Claim-calibration owner:** RSH-033 (accepted on merge)

## Two separate authorities

| Authority | CI behaviour | Meaning |
|---|---|---|
| Regression baseline | Blocking | Detects an unreviewed change in current deterministic acceleration behaviour. |
| `zeroTo100` product claim | Blocking after RSH-033 | Measured first-motion 0–100 must stay inside the claim band `±15%`. |

RSH-033 keeps the five fictional claims `8.4 / 6.6 / 4.9 / 5.8 / 3.5` and does not rewrite `cars.ts`. Launch uses `launchAccel` with aero/rolling compensation below `V100_MPS`. Gear dump `speed *= 0.94` is not applied while `|speed| <= 27.778`.

## RSH-033 first-motion QA estimates

Timing starts after `speed > 0.5 m/s` and stops at `27.778 m/s`.

| Car | Claim | First-motion estimate | 50 ms quantized estimate | Claim band | Status |
|---|---:|---:|---:|---|---|
| Sabra | 8.40 s | 8.249 s | 8.200 s | 7.14–9.66 s | PASS |
| Carmel | 6.60 s | 6.481 s | 6.450 s | 5.61–7.59 s | PASS |
| Kfir | 4.90 s | 4.812 s | 4.800 s | 4.17–5.64 s | PASS |
| Negev | 5.80 s | 5.696 s | 5.650 s | 4.93–6.67 s | PASS |
| Yam | 3.50 s | 3.437 s | 3.400 s | 2.98–4.03 s | PASS |

The committed golden baseline uses the first-motion estimates. The 50 ms quantized lab is within the 0.10 s regression tolerance of those means.

## Safety rules

- CI never overwrites `golden-baseline/accel.json`.
- A local baseline rewrite requires `UPDATE_ACCEL_BASELINE=1` and is rejected when `CI=true`.
- `qa:accel` fails closed on regression drift and on `claimGaps`.
- `cars.ts` claims stay `8.4 / 6.6 / 4.9 / 5.8 / 3.5`.
- GIS/navigation accuracy, owner freeze and public distribution remain forbidden.
- Release gates remain `0/13` until the remaining Version 1 vertical-slice units land.
