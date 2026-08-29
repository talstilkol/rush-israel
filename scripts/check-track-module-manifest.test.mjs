import assert from "node:assert/strict";
import { test } from "node:test";
import { validateTrackModuleManifest } from "./check-track-module-manifest.mjs";
import { readCanonicalTrackSource, readTrackModuleBundle } from "./load-track-modules.mjs";

test("RSH-014 commits exactly one canonical module per track", () => {
  const result = validateTrackModuleManifest();
  assert.deepEqual(result.errors, []);
  assert.equal(result.moduleCount, 56);
});

test("the modular authorities reconstruct the accepted RSH-013 source byte-for-byte", () => {
  const source = readCanonicalTrackSource();
  assert.equal(source.includes('export const TRACKS: TrackDef[] = ['), true);
  assert.equal(source.match(/^\s{4}id:\s*"[^"]+",$/gm)?.length, 56);
  assert.equal(validateTrackModuleManifest().legacyBlob, "e26454223f8a598cdf516af7c7c3f494162e2616");
});

test("missing, substituted and reordered module authorities fail closed", () => {
  const baseline = readTrackModuleBundle();
  const missing = structuredClone(baseline);
  delete missing.moduleSources[missing.manifest.modules[0].path];
  assert.match(validateTrackModuleManifest({ bundle: missing }).errors.join("\n"), /missing module source/);

  const changed = structuredClone(baseline);
  const first = changed.manifest.modules[0];
  changed.moduleSources[first.path] = changed.moduleSources[first.path].replace(
    `id: "${first.id}"`,
    'id: "invalid-track-id"',
  );
  assert.match(validateTrackModuleManifest({ bundle: changed }).errors.join("\n"), /identity differs|exports id/);

  const reordered = structuredClone(baseline);
  [reordered.manifest.modules[0], reordered.manifest.modules[1]] = [
    reordered.manifest.modules[1], reordered.manifest.modules[0],
  ];
  assert.match(validateTrackModuleManifest({ bundle: reordered }).errors.join("\n"), /manifest differs|IDs/order|path/ordinal/);
});

test("RSH-015 remains unauthorized after the batch closes", () => {
  const bundle = structuredClone(readTrackModuleBundle());
  bundle.manifest.change_control["RSH-015_authorized"] = true;
  bundle.manifestSource = JSON.stringify(bundle.manifest, null, 2) + "\n";
  assert.match(validateTrackModuleManifest({ bundle }).errors.join("\n"), /RSH-015/);
});
