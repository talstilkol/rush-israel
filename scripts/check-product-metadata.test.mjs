import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  RUSH_PWA_DESCRIPTION,
  renderRushInstallPageHtml,
  renderRushWebManifest,
} from "./rush-pwa.mjs";
import { validateProductMetadata } from "./check-product-metadata.mjs";

function readInputs() {
  return {
    metadata: JSON.parse(readFileSync(fromRoot("PRODUCT-METADATA.json"), "utf8")),
    productDefinition: JSON.parse(readFileSync(fromRoot("PRODUCT-DEFINITION.json"), "utf8")),
    catalogue: JSON.parse(readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8")),
    provenance: JSON.parse(readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8")),
    packageJson: JSON.parse(readFileSync(fromRoot("package.json"), "utf8")),
    packageLock: JSON.parse(readFileSync(fromRoot("package-lock.json"), "utf8")),
    site: JSON.parse(readFileSync(fromRoot("src", "lib", "og", "site.json"), "utf8")),
    readme: readFileSync(fromRoot("README.md"), "utf8"),
    licence: readFileSync(fromRoot("LICENSE"), "utf8"),
    notices: readFileSync(fromRoot("THIRD-PARTY-NOTICES.md"), "utf8"),
    rootSource: readFileSync(fromRoot("src", "routes", "__root.tsx"), "utf8"),
    middlewareSource: readFileSync(fromRoot("server", "middleware", "grok-pwa.ts"), "utf8"),
    rushPwaSource: readFileSync(fromRoot("scripts", "rush-pwa.mjs"), "utf8"),
  };
}

test("committed product metadata contract passes", () => {
  assert.deepEqual(validateProductMetadata(readInputs()), []);
});

test("dynamic PWA manifest uses the exact RUSH Israel identity", () => {
  const site = { title: "RUSH Israel" };
  const manifest = JSON.parse(renderRushWebManifest("localhost:8080", site));
  assert.equal(manifest.name, "RUSH Israel");
  assert.equal(manifest.short_name, "RUSH Israel");
  assert.equal(manifest.description, RUSH_PWA_DESCRIPTION);
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
});

test("dynamic PWA install page replaces the generic host identity", () => {
  const template = readFileSync(fromRoot("scripts", "install-page.html"), "utf8");
  const html = renderRushInstallPageHtml(template, {
    host: "preview.local",
    url: "/?install=1&platform=ios",
    site: { title: "RUSH Israel" },
  });
  assert.match(html, /RUSH Israel/);
  assert.doesNotMatch(html, /Grok App/);
  assert.doesNotMatch(html, /Preview/);
  assert.match(html, /href="\/"/);
});

test("package and canonical identity mutations fail closed", () => {
  const renamed = readInputs();
  renamed.packageJson.name = "rush-israel";
  assert.match(validateProductMetadata(renamed).join("\n"), /package\.json identity/);

  const publicPackage = readInputs();
  publicPackage.packageJson.private = false;
  publicPackage.packageJson.license = "MIT";
  assert.match(validateProductMetadata(publicPackage).join("\n"), /package\.json identity/);

  const renamedProduct = readInputs();
  renamedProduct.metadata.product.name = "RUSH Global";
  assert.match(validateProductMetadata(renamedProduct).join("\n"), /canonical product identity/);
});

test("public distribution and asset clearance cannot be enabled", () => {
  const inputs = readInputs();
  inputs.metadata.licensing.public_distribution_authorized = true;
  inputs.metadata.licensing.legal_clearance_complete = true;
  inputs.metadata.readiness.public_release_ready = true;
  inputs.provenance.scope.unverified_asset_files = 0;
  inputs.provenance.scope.public_distribution_authorized = true;
  assert.match(
    validateProductMetadata(inputs).join("\n"),
    /licensing metadata|asset provenance|readiness metadata/,
  );
});

test("Open Graph and PWA path drift fail closed", () => {
  const siteDrift = readInputs();
  siteDrift.site.title = "RUSH";
  assert.match(validateProductMetadata(siteDrift).join("\n"), /Open Graph|branding/);

  const pathDrift = readInputs();
  pathDrift.metadata.pwa.manifest_path = "/manifest.webmanifest";
  assert.match(validateProductMetadata(pathDrift).join("\n"), /PWA metadata/);
});

test("README contains exact reproducible commands and no obsolete geography claim", () => {
  const { readme, packageJson } = readInputs();
  for (const command of ["npm ci", "npm run dev", "npm test", "npm run qa:ci", "npm run build:dev"]) {
    assert.match(readme, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(readme, /Israel and New York/i);
  assert.doesNotMatch(packageJson.description, /Israel and New York/i);
});

test("licence and notices preserve the proprietary and unresolved boundaries", () => {
  const { licence, notices } = readInputs();
  assert.match(licence, /All rights reserved/);
  assert.match(licence, /No public licence grant/);
  assert.match(licence, /does not constitute a licence/);
  assert.match(notices, /Basis Universal/);
  assert.match(notices, /Apache License 2\.0/);
  assert.match(notices, /66/);
  assert.match(notices, /Not cleared/);
});
