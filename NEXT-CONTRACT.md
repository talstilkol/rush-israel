# RUSH Israel — NEXT Contract

**Version:** 25.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-042 implementation base:** `e8129df3e1fa5b62720d11b794395fdc531eaddf`
**State effective on:** merge of the RSH-042 pull request
**Next unit:** `RSH-043` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-042 after RSH-041 merged. That authority is consumed on validated merge and does not extend to RSH-043.

## RSH-042 acceptance boundary

- 30-minute soak contract is locked at `src/game/thirty-soak/`;
- required CI keeps the 2-cycle soak-smoke and it does not substitute for 1800 s;
- live 20-cycle Playwright harness and `package.json` stay frozen;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-043 device-matrix structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 42 |
| Deferred | 25 |
| Remaining | 25 |
| Queue head | RSH-043 |
| RSH-043 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-043 may be created or executed.
