# RUSH Israel — Product Metadata Contract

**Unit:** RSH-012  
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
lockfile and template migration. It is not the public or canonical product name.

## Repository truth

| Setting | Live state | Policy target |
|---|---|---|
| Visibility | Public | Private — owner action required |
| `main` protection | Off | On |
| Required status checks | 0 | Required CI context after owner action |
| Rulesets | 0 | Desired ruleset already documented |

The repository's current public accessibility grants no licence and does not authorise
public distribution.

## Branding and PWA

| Surface | Exact identity |
|---|---|
| Root document title | `RUSH Israel — סימולטור נהיגה ישראלי` |
| Open Graph title | `RUSH Israel` |
| Open Graph type | `x:game` |
| Dynamic PWA name | `RUSH Israel` |
| Manifest path | `/manifest.webmanifest` |
| Display mode | `standalone` |
| Start URL | `/` |

The PWA manifest derives its product name from `src/lib/og/site.json`. The generic
platform helper may retain a generic fallback for non-product workspaces; the RUSH
identity is explicit and tested at the product boundary.

## Exact local workflow

```bash
# Required versions
node --version  # v22.16.0
npm --version   # 10.9.2

# Reproducible installation
npm ci

# Development
npm run dev

# Complete unit tests
npm test

# Self-starting QA
npm run qa:ci

# Deterministic development build
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
