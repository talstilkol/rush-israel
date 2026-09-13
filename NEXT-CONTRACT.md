# RUSH Israel — NEXT Contract

**Version:** 24.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-041 implementation base:** `b24dea10f4a6ff186ee0c73e44a4fc693ad384f9`
**State effective on:** merge of the RSH-041 pull request
**Next unit:** `RSH-042` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-041 after RSH-040 merged. That authority is consumed on validated merge and does not extend to RSH-042.

## RSH-041 acceptance boundary

- WebGL context-loss recovery is locked at `src/game/context-loss/`;
- live loop-adapter still calls `preventDefault`, sets `glLost`, skips frames, and remounts on restore;
- eight synthetic loss/restore cycles leave cash/stars/records intact;
- 30-minute soak is not enforced (RSH-042);
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-042 30-minute soak structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 41 |
| Deferred | 26 |
| Remaining | 26 |
| Queue head | RSH-042 |
| RSH-042 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-042 may be created or executed.
