import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

const FILES = [
  "TRACK-SCHEMA.json",
  "TRACK-SCHEMA.md",
  "CURRENT-STATE.json",
  "QUEUE.json",
  "NEXT-CONTRACT.md",
  "MASTER-PLAN.md",
  "MILESTONE-REGISTER.md",
  "BASELINE-REGISTER.json",
  "FINDINGS-REGISTER.md",
  "scripts/check-track-schema.mjs",
  "scripts/check-track-schema.test.mjs",
  "scripts/program-control.test.mjs",
  "src/game/tracks.ts",
  "src/game/types.ts",
  "src/game/math.ts",
  "src/game/track-schema.ts"
];

test("export exact RSH source snapshot for remediation", () => {
  const root = fromRoot("artifacts", "rsh-source");
  for (const relative of FILES) {
    const destination = path.join(root, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    cpSync(fromRoot(relative), destination);
  }
});
