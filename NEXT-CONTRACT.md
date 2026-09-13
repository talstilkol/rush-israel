# RUSH Israel — NEXT Contract

**Version:** 26.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-043 implementation base:** `b7fb239daed34b5e14bf4760bde25ec86c0b656b`
**State effective on:** merge of the RSH-043 pull request
**Next unit:** `RSH-044` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-043 after RSH-042 merged. That authority is consumed on validated merge and does not extend to RSH-044.

## RSH-043 acceptance boundary

- Validate the browser and device support matrix is locked at `src/game/device-matrix/`;
- `device_matrix_enforced` = `True`;
- `real_device_baseline_accepted` = `False`;
- `webgl2_required` = `True`;
- `webgpu_default` = `False`;
- `target_browser_count` = `6`;
- `input_maps_unified` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-044 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 43 |
| Deferred | 24 |
| Remaining | 24 |
| Queue head | RSH-044 |
| RSH-044 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-044 may be created or executed.
