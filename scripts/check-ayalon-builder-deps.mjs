#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const AYALON_BUILDER_DEPS = {
  "src/game/spline.ts": "d6c950548fa64afcb148644a61e1af7c74e90713dbd1ee0ae73b8517261b96f4",
  "src/game/tracks.ts": "b28327a0a4e3cd272f8aeffe33a94d3fe6b45d923c47b0c4d27c29bd7332f581",
  "src/game/arrow-assets.ts": "4ae76b3c40e1049ac93dcdd7a316bf1065cdb03017f4af1989113f49f3ef84d9",
  "src/game/sign-assets.ts": "e32237575c42ec1efcb9a3edaae8aa2a382920aaaceecabb875ce6c12da8387b",
  "src/game/road-assets.ts": "17cc9cc0ad287a6fcd74e0a40b122ad830733247b50b1e39eb6f2afb8a35146e",
  "src/game/world-builders/shared.ts": "f0c50f4deb850d9e2d13ccdf404a88f5102fd1335c3a02f2b5ecd45d01984ba2",
};

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function validateAyalonBuilderDeps() {
  const errors = [];
  for (const [rel, expected] of Object.entries(AYALON_BUILDER_DEPS)) {
    const actual = sha256File(fromRoot(...rel.split("/")));
    if (actual !== expected) errors.push(`${rel} hash drifted from the builder-deps pin`);
  }
  return errors;
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(url);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const errors = validateAyalonBuilderDeps();
  if (errors.length) {
    console.error("ayalon-builder-deps fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`ayalon-builder-deps ok: ${Object.keys(AYALON_BUILDER_DEPS).length} direct imports pinned`);
}
