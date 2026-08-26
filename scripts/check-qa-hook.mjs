#!/usr/bin/env node
/** Fail if a production bundle still contains finishNow (QA hook leaked). */
import { execSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

if (!process.env.SKIP_BUILD) {
  const path = `${process.cwd()}/node_modules/.bin:${process.env.PATH ?? ""}`;
  execSync("node scripts/with-app-env.mjs vite build", {
    stdio: "inherit",
    env: { ...process.env, PATH: path },
  });
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

const roots = ["dist", ".output", "build", ".vercel/output/static"];
let files = [];
for (const r of roots) files = files.concat(await walk(r));
const js = files.filter((f) => /\.(js|mjs|cjs)$/.test(f));
if (!js.length) {
  console.error("check-qa-hook: no JS bundle found in dist/.output/build");
  process.exit(1);
}
const hits = [];
for (const f of js) {
  const t = await readFile(f, "utf8");
  if (t.includes("finishNow")) hits.push(f);
}
if (hits.length) {
  console.error("finishNow leaked in production bundle:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("check-qa-hook ok", js.length, "js files");
