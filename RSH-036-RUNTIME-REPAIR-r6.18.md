# RSH-036 r6.18 — Playwright Chromium install without Google Chrome apt abort

Candidate, 9 September 2026. Base ec9fba559370560fc1c3a957b6c2d6fecf79f99f
(r6.17 whole-route envelope and v7 records). No merge or freeze; 35/67
accepted; 32 remain. r6.17 product evidence is retained. Exact-head required
CI 34385617080 / job 102580995300 failed before any product test at
`npx playwright install --with-deps chromium`: Google Chrome apt Packages.gz
hash-sum mismatch. Checkout `ec9fba5` / tree `d34ec85` was verified. That
failure is retained and is not relabelled a product defect or a pass.

AUD-28 replaces the bare `--with-deps` one-liner with
`scripts/install-playwright-chromium.mjs`. A matching Google Chrome apt
hash-sum mismatch falls back to `npx playwright install chromium` (Playwright
CDN). Ordinary install failures still fail the job. `continue-on-error` stays
forbidden. Toolchain docs already specified the binary-only command. Action
pins, 85 freeze paths, rest-pose 1.6, 1.05 radius, 546/176 colliders, 50
ramps, 8 checkpoints, physicsVersion 7, images and thresholds stay unchanged.

New helper file: 6 cases. Old one-liner still binds CI to Google apt; the
helper classifies the retained 34385617080 log as fallback and still fails a
broken binary download. Local unit suite 1,142/1,142. Original golden, three
mutable fonts and freeze remain open. Exact published-head CI is pending for
this candidate.
