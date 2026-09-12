# RSH-036 r7.04 — climbs stay driveable; settings expose FOV and handling

Candidate, 12 September 2026. Base `b868acd` (r7.03).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product

Hermon snow line stalled at 7–9 km/h: spline grade uncapped plus a second
uphill penalty (`16.2` + `7.4`). Settings had quality/day/night/mute but
FOV and handling were already in save state with no buttons.

| item | repair |
|---|---|
| grade | clamp ±0.12, one term `8.4` (no extra uphill dump) |
| hermon | width 26→30, berms further off the ribbon |
| settings | Arcade / Simcade, Lens / Wide / Wider |

Ayalon city night path unchanged. Physics calibration owner freeze is false.

## Live

Hermon night: spawn 22 km/h, mid climb 25, snow line 22, y 7.5→103, onTrack.
Walls night (r7.03 lights): 21/17 km/h, road + headlights in frame.
Settings panel: handling + FOV rows visible.
