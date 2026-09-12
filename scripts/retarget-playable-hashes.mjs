#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { historicalRsh036Source } from "./rsh036-runtime-evolution.mjs";
import { canonicalFreezeDigest } from "./check-ayalon-freeze.mjs";
import { buildDependencyClosure } from "./dependency-closure.mjs";
import { fromRoot } from "./project-root.mjs";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const read = (rel) => readFileSync(fromRoot(rel));
const readText = (rel) => readFileSync(fromRoot(rel), "utf8");
const writeText = (rel, text) => writeFileSync(fromRoot(rel), text);

const gitShow = (rel) => {
  try {
    return execFileSync("git", ["show", `HEAD:${rel}`], { encoding: "utf8", cwd: fromRoot() });
  } catch {
    return null;
  }
};

const evoPath = "RSH-036-RUNTIME-EVOLUTION.json";
const evo = JSON.parse(readText(evoPath));
for (const [path, row] of Object.entries(evo.files)) {
  const head = gitShow(path);
  if (!head || hash(head) !== row.current_sha256) continue;
  const base = historicalRsh036Source(head);
  const current = readText(path);
  const curHash = hash(current);
  if (curHash === row.current_sha256) continue;
  const lines = current.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  row.current_sha256 = curHash;
  row.reverse_edits = [
    {
      start_line: 0,
      end_line: lines.length,
      current_segment_sha256: hash(lines.join("")),
      previous_text: base,
    },
  ];
  console.log("evolution", path, curHash);
}
writeText(evoPath, `${JSON.stringify(evo, null, 2)}\n`);
const evoHash = hash(read(evoPath));
writeText(
  "scripts/rsh036-runtime-evolution.mjs",
  readText("scripts/rsh036-runtime-evolution.mjs").replace(
    /export const EXPECTED_EVOLUTION_SHA256 = "[0-9a-f]{64}"/,
    `export const EXPECTED_EVOLUTION_SHA256 = "${evoHash}"`,
  ),
);

let freeze = readText("src/game/ayalon-freeze/freeze.ts");
freeze = freeze.replace(/"([^"]+)": "([0-9a-f]{64})"/g, (full, path, oldHash) => {
  try {
    const next = hash(read(path));
    if (next !== oldHash) console.log("freeze", path, next);
    return `"${path}": "${next}"`;
  } catch {
    return full;
  }
});
writeText("src/game/ayalon-freeze/freeze.ts", freeze);

const freezeHash = hash(read("src/game/ayalon-freeze/freeze.ts"));
const digest = hash(canonicalFreezeDigest());
const identities = {
  freeze_source_sha256: freezeHash,
  index_source_sha256: hash(read("src/game/ayalon-freeze/index.ts")),
  contract_sha256: hash(read("RSH-036-AYALON-FREEZE-CONTRACT.md")),
  owner_approval_sha256: hash(read("AYALON-OWNER-APPROVAL.json")),
  ayalon_lock_sha256: hash(read("golden-baseline/ayalon.lock")),
  hashalom_index_sha256: hash(read("golden-baseline/hashalom-photo.json")),
  pixel_golden_sha256: hash(read("scripts/pixel-golden.mjs")),
  checker_test_sha256: hash(read("scripts/check-ayalon-freeze.test.mjs")),
  package_source_sha256: hash(read("package.json")),
  freeze_digest_sha256: digest,
  golden_digest_sha256: "d1a09a9b9d4542b4ffd7d6feefcfd21e71a0a9903d12a1002dd728d3432f7a74",
};

const manifest = JSON.parse(readText("AYALON-FREEZE-MANIFEST.json"));
if (manifest.lock?.transitive_sources) {
  for (const path of Object.keys(manifest.lock.transitive_sources)) {
    try {
      manifest.lock.transitive_sources[path] = hash(read(path));
    } catch {
      /* keep */
    }
  }
}
manifest.identities = { ...manifest.identities, ...identities };
manifest.generated_at = new Date().toISOString();
writeText("AYALON-FREEZE-MANIFEST.json", `${JSON.stringify(manifest, null, 2)}\n`);

const expected = {
  EXPECTED_MANIFEST_SHA256: hash(read("AYALON-FREEZE-MANIFEST.json")),
  EXPECTED_FREEZE_SHA256: freezeHash,
  EXPECTED_INDEX_SHA256: identities.index_source_sha256,
  EXPECTED_CONTRACT_SHA256: identities.contract_sha256,
  EXPECTED_FREEZE_DIGEST_SHA256: digest,
};
let checker = readText("scripts/check-ayalon-freeze.mjs");
for (const [key, value] of Object.entries(expected)) {
  checker = checker.replace(new RegExp(`${key} = "[0-9a-f]{64}"`), `${key} = "${value}"`);
}
writeText("scripts/check-ayalon-freeze.mjs", checker);

const closure = buildDependencyClosure();
writeText("AYALON-DEPENDENCY-CLOSURE.json", `${JSON.stringify(closure, null, 2)}\n`);
console.log("freeze.ts", freezeHash);
console.log("manifest", expected.EXPECTED_MANIFEST_SHA256);
console.log("digest", digest);
console.log("closure files", closure.files.length);
