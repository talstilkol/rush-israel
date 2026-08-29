import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  classifyPublicPath,
  computeFlatGitTreeSha,
  listPublicFiles,
  validateAssetProvenance,
} from "./check-asset-provenance.mjs";

function readInputs() {
  return {
    manifest: JSON.parse(readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8")),
    catalogue: JSON.parse(
      readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
    ),
    publicFiles: listPublicFiles(),
    licencesText: readFileSync(fromRoot("public", "game", "LICENSES.md"), "utf8"),
    bakeGantryText: readFileSync(fromRoot("scripts", "bake-gantry.mjs"), "utf8"),
    gameTreeSha: computeFlatGitTreeSha(),
  };
}

test("committed provenance inventory covers every public file", () => {
  const inputs = readInputs();
  assert.equal(inputs.publicFiles.length, 134);
  assert.deepEqual(validateAssetProvenance(inputs), []);
});

test("the complete public/game directory is pinned by its Git tree identity", () => {
  const inputs = readInputs();
  const generated = inputs.manifest.groups.find((group) => group.id === "game_generated_assets");
  assert.equal(inputs.gameTreeSha, "332fe666fd91590787856c32cf2040b8f6adb7d0");
  assert.equal(generated.pinned_git_tree_sha1, inputs.gameTreeSha);
  assert.equal(generated.pinned_directory_entry_count, 65);

  const replaced = readInputs();
  replaced.gameTreeSha = "0000000000000000000000000000000000000000";
  assert.match(validateAssetProvenance(replaced).join("\n"), /path or content identity/);
});

test("every public file maps to exactly one provenance group", () => {
  const { publicFiles } = readInputs();
  for (const filePath of publicFiles) {
    assert.equal(classifyPublicPath(filePath).length, 1, filePath);
  }
});

test("duplicate or substituted provenance group IDs fail closed", () => {
  const duplicate = readInputs();
  duplicate.manifest.groups.unshift(structuredClone(duplicate.manifest.groups[0]));
  duplicate.manifest.groups[0].public_distribution_clearance = true;
  assert.match(validateAssetProvenance(duplicate).join("\n"), /exactly six|unique/);

  const substituted = readInputs();
  substituted.manifest.groups[0].id = "unknown_group";
  assert.match(validateAssetProvenance(substituted).join("\n"), /exact six-group authority/);
});

test("all 56 track cards map one-to-one to the canonical catalogue", () => {
  const { publicFiles, catalogue } = readInputs();
  const cards = publicFiles
    .filter((filePath) => filePath.startsWith("public/tracks/"))
    .map((filePath) => filePath.replace("public/tracks/", "").replace(/\.jpg$/, ""))
    .sort();
  assert.equal(cards.length, 56);
  assert.deepEqual(cards, catalogue.entries.map((entry) => entry.id).sort());
});

test("exact group totals remain 134 files and 131 asset files", () => {
  const { manifest } = readInputs();
  assert.equal(
    manifest.groups.reduce((total, group) => total + group.expected_file_count, 0),
    134,
  );
  assert.equal(
    manifest.groups.reduce((total, group) => total + group.expected_asset_count, 0),
    131,
  );
  assert.equal(manifest.scope.unverified_shipping_files, 67);
  assert.equal(manifest.scope.unverified_asset_files, 66);
});

test("unclassified additions and missing files fail closed", () => {
  const added = readInputs();
  added.publicFiles.push("public/future.bin");
  assert.match(validateAssetProvenance(added).join("\n"), /exactly one provenance group|134/);

  const missing = readInputs();
  missing.publicFiles = missing.publicFiles.filter((filePath) => filePath !== "public/og.jpg");
  assert.match(validateAssetProvenance(missing).join("\n"), /134|root_branding_assets/);
});

test("unverified groups cannot be promoted without evidence", () => {
  for (const id of ["track_card_images", "platform_install_material", "root_branding_assets"]) {
    const inputs = readInputs();
    const group = inputs.manifest.groups.find((item) => item.id === id);
    group.licence_status = "cleared";
    group.public_distribution_clearance = true;
    assert.match(validateAssetProvenance(inputs).join("\n"), new RegExp(id));
  }
});

test("public release and legal-clearance claims remain blocked", () => {
  const inputs = readInputs();
  inputs.manifest.scope.public_distribution_authorized = true;
  inputs.manifest.scope.legal_clearance_complete = true;
  inputs.manifest.truth_boundaries.public_release_allowed = true;
  inputs.manifest.truth_boundaries.licence_clearance_complete = true;
  assert.match(
    validateAssetProvenance(inputs).join("\n"),
    /public distribution|legal clearance|public-release claims/,
  );
});

test("both generated-asset evidence families are mandatory", () => {
  const inputs = readInputs();
  const generated = inputs.manifest.groups.find((group) => group.id === "game_generated_assets");
  assert.deepEqual(generated.evidence, ["public/game/LICENSES.md", "scripts/bake-gantry.mjs"]);

  const missingBasis = readInputs();
  missingBasis.licencesText = missingBasis.licencesText.replace(/Basis Universal/g, "Removed");
  assert.match(validateAssetProvenance(missingBasis).join("\n"), /Basis Universal/);

  const missingGenerated = readInputs();
  missingGenerated.licencesText = missingGenerated.licencesText.replace(/generated/gi, "made");
  assert.match(validateAssetProvenance(missingGenerated).join("\n"), /generated-asset/);

  const missingBakedId = readInputs();
  missingBakedId.bakeGantryText = missingBakedId.bakeGantryText.replace(
    'id: "dest-rail"',
    'id: "removed-destination"',
  );
  assert.match(validateAssetProvenance(missingBakedId).join("\n"), /exact 12/);

  const missingScriptEvidence = readInputs();
  missingScriptEvidence.manifest.groups.find(
    (group) => group.id === "game_generated_assets",
  ).evidence.pop();
  assert.match(validateAssetProvenance(missingScriptEvidence).join("\n"), /both generation evidence/);
});
