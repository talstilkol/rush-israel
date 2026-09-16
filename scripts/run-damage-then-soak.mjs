#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fromRoot } from "./project-root.mjs";

function run(script) {
  const result = spawnSync(process.execPath, [fromRoot("scripts", script)], {
    cwd: fromRoot(),
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

run("damage-smoke.mjs");
run("soak-30min.mjs");
console.log("damage-then-soak ok");
