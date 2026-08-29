# RUSH Israel — Product Metadata Contract

**Unit:** RSH-012  
**Schema:** 1.0.2  
**Machine authority:** `PRODUCT-METADATA.json`  
**Observed source commit:** `aab3b725f256ff5a0a145c5cd3ac749860bdaeb9`

## Canonical identity

| Field | Exact value |
|---|---|
| Product name | **RUSH Israel** |
| Product ID | `rush-israel` |
| Version | `0.0.0-private` |
| Stage | Private pre-alpha |
| Ownership | Private, owner-controlled |
| Public distribution | **Not authorised** |
| Package licence field | `UNLICENSED` |
| Root licence | Proprietary, all rights reserved |

`app-builder-workspace` remains the internal npm package name to avoid an unrelated
lockfile and template migration. It is not the canonical product name.

## Repository truth

| Setting | Live state | Policy target |
|---|---|---|
| Visibility | Public | Private — owner action required |
| `main` protection | Off | On |
| Required status checks | 0 | Required CI context after owner action |
| Rulesets | 0 | Desired ruleset already documented |

Public accessibility does not grant a licence or authorise public distribution.

## Branding and PWA

| Surface | Exact identity |
|---|---|
| Root document title | `RUSH Israel — סימולטור נהיגה ישראלי` |
| Root description | Private owner-controlled Three.js WebGL simcade driving game on fictional routes inspired by Israeli places. |
| Open Graph title | `RUSH Israel` |
| Open Graph type | `x:game` |
| Dynamic PWA name | `RUSH Israel` |
| Primary manifest | `/__grok/manifest.webmanifest` |
| Legacy manifest alias | `/__grok/manifest.json` |
| Delivery | Vite dev/preview and deployed Nitro middleware |
| Display mode | `standalone` |
| Start URL / scope | `/` / `/` |

Both runtime paths use `scripts/rush-pwa.mjs`; the generic platform fallback is not
used for the RUSH product manifest or install page.

## Exact local workflow

```bash
node --version  # v22.16.0
npm --version   # 10.9.2
npm ci
npm run dev
npm test
npm run qa:ci
npm run build:dev
```

## Legal and readiness boundary

| Metric | Value |
|---|---:|
| Unverified public asset files | **66** |
| Legal clearance complete | **No** |
| Browser/device support matrix complete | **No** |
| Release gates green | **0/13** |
| Public-release ready | **No** |

The proprietary root licence covers owner-created material only. It does not clear
third-party or unverified material. `ASSET-PROVENANCE.json` and
`THIRD-PARTY-NOTICES.md` remain controlling for those assets.
