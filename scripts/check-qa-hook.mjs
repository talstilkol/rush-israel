#!/usr/bin/env node
/** Fail if a production client bundle still contains the QA hook. */
import { execSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

if (!process.env.SKIP_BUILD) {
  const path = `${process.cwd()}/node_modules/.bin:${process.env.PATH ?? ""}`;
  execSync("node scripts/with-app-env.mjs vite build", {
    stdio: "inherit",
    env: { ...process.env, PATH: path, VITE_QA: "" },
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

/** Client shipping trees only — not SSR function bundles. */
const roots = ["dist", ".output", "build", ".vercel/output/static"];
let files = [];
for (const r of roots) files = files.concat(await walk(r));
const js = files.filter((f) => /\.(js|mjs|cjs)$/.test(f));
if (!js.length) {
  console.error("check-qa-hook: no JS bundle found in dist/.output/build/static");
  process.exit(1);
}
const needles = ["finishNow", "__controlsTest"];
const hits = [];
for (const f of js) {
  const t = await readFile(f, "utf8");
  for (const n of needles) {
    if (t.includes(n)) hits.push(`${f} :: ${n}`);
  }
}
if (hits.length) {
  console.error("QA hook leaked in production client bundle:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("check-qa-hook ok", js.length, "js files");
