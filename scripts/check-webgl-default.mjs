#!/usr/bin/env node
/** Fail if the game renderer default is WebGPU. Probe-only WebGPU is allowed. */
import { readFile } from "node:fs/promises";

const eng = await readFile("src/game/engine.ts", "utf8");
if (!/private renderer:\s*THREE\.WebGLRenderer/.test(eng)) {
  console.error("check-webgl-default: engine is not typed as WebGLRenderer");
  process.exit(1);
}
if (/new\s+WebGPURenderer/.test(eng) || /new\s+THREE\.WebGPURenderer/.test(eng)) {
  console.error("check-webgl-default: WebGPURenderer constructed in engine.ts");
  process.exit(1);
}
console.log("check-webgl-default ok");
