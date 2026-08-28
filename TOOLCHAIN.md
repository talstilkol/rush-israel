# RUSH Israel — Reproducible Toolchain

**Unit:** RSH-004  
**Node.js:** `22.16.0`  
**npm:** `10.9.2`  
**Lockfile:** `package-lock.json`, lockfile version 3

## Clean setup

```bash
nvm use
npm --version
npm ci
npm run toolchain:verify
npx playwright install chromium
```

`npm install` is not the canonical CI/setup command. Use `npm ci` so the installed
dependency graph matches `package-lock.json` exactly.

## Supported version managers

- nvm reads `.nvmrc`;
- asdf/mise/pyenv-compatible managers read `.node-version`;
- Volta reads the `volta` block in `package.json`.

All three sources intentionally contain the same exact Node version. `package.json`
pins npm through `packageManager` and Volta, while the fail-closed `preinstall`
verifier enforces both Node and npm before installation. The root `engines` field is
intentionally omitted because npm serialises it into the root lockfile package entry;
omitting it keeps the existing dependency lock stable while the stronger exact-version
verifier remains authoritative.

## Environment

Copy `.env.example` to `.env` only when local environment values are needed.
The example contains names and safe empty defaults only. Never commit real secrets.
Auth remains off by default for the driving product.

## Deterministic checks

```bash
npm run toolchain:verify
npm ci
npm run typecheck
```

The `preinstall` hook fails immediately when Node or npm differs from the pinned
versions. This prevents a lockfile or generated artifact from being silently
rewritten by an unapproved toolchain.

`npm run test:harness` also verifies that `package.json` and the root
`package-lock.json` entry agree on the deliberate absence of `engines` metadata.

## Updating the pin

A future update must change all of the following in one reviewed unit:

1. `.nvmrc`;
2. `.node-version`;
3. `package.json` `packageManager` and `volta`;
4. `scripts/verify-toolchain.mjs`;
5. `scripts/toolchain-metadata.test.mjs`;
6. this document;
7. `package-lock.json` only when npm or dependency metadata actually changes its bytes.

The update must include a clean `npm ci`, typecheck and build result before merge.
