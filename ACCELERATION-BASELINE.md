# RUSH Israel — Acceleration Baseline and Claim Gap

**Established:** RSH-007  
**Physics version:** 6  
**Track:** Ayalon  
**Claim-calibration owner:** RSH-033

## Two separate authorities

| Authority | CI behaviour | Meaning |
|---|---|---|
| Regression baseline | Blocking | Detects an unreviewed change in current deterministic acceleration behaviour. |
| `zeroTo100` product claim | Reported as an open gap | Must be calibrated in RSH-033; RSH-007 does not rewrite physics or car claims. |

The old `golden-baseline/accel.json` contained measurements that no longer
matched the live physics while retaining the same `PHYSICS_VERSION`. RSH-007
re-measured all five cars on a clean GitHub runner and created schema 2.

## Exact RSH-007 measurements

| Car | Current 0–100 | Declared claim | Difference | Claim status |
|---|---:|---:|---:|---|
| Sabra | 15.55 s | 8.40 s | +7.15 s | FAIL |
| Carmel | 10.95 s | 6.60 s | +4.35 s | FAIL |
| Kfir | 6.55 s | 4.90 s | +1.65 s | FAIL |
| Negev | 8.65 s | 5.80 s | +2.85 s | FAIL |
| Yam | 4.35 s | 3.50 s | +0.85 s | FAIL |

Each result was identical across three deterministic runs. The regression gate
allows at most **0.10 seconds** drift from the committed mean.

## Safety rules

- CI never overwrites `golden-baseline/accel.json`.
- A local baseline rewrite requires `UPDATE_ACCEL_BASELINE=1` and is rejected
  when `CI=true`.
- A passing regression result does **not** approve the product claims.
- RSH-033 must decide whether to change physics, car statistics or both, then
  update the claim authority and increment `PHYSICS_VERSION` when applicable.
- Release gates remain `0/13` while these five claims fail.
