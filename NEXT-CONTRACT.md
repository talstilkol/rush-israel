# RUSH Israel — NEXT Contract

**Version:** 30.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-047 implementation base:** `660c1e024ae6cccaad2f492d0aa1cda7c0cd19b6`
**State effective on:** merge of the RSH-047 pull request
**Next unit:** `RSH-048` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-047 after RSH-046 merged. That authority is consumed on validated merge and does not extend to RSH-048.

## RSH-047 acceptance boundary

- Complete PWA, offline, update and manifest behaviour is locked at `src/game/pwa/`;
- `pwa_complete` = `True`;
- `manifest_present` = `True`;
- `manifest_path` = `/__grok/manifest.webmanifest`;
- `display_standalone` = `True`;
- `start_url` = `/`;
- `service_worker` = `False`;
- `offline_cache` = `False`;
- `update_prompt` = `False`;
- `public_install` = `False`;
- `a11y_complete` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- P2-11 stays OPEN — privacy/telemetry remain RSH-048;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss/device-matrix/input-maps/rtl-scope/onboarding sources, live `__root.tsx` / `grok-pwa-plugin.mjs` / `grok-pwa-shared.mjs` / `rush-pwa.mjs` / `grok-pwa.ts` / `PRODUCT-METADATA.json` and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-048 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 47 |
| Deferred | 20 |
| Remaining | 20 |
| Queue head | RSH-048 |
| RSH-048 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-048 may be created or executed.
