#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const EXPECTED_PRODUCT_DESCRIPTION =
  "Private owner-controlled Three.js WebGL simcade driving game on fictional routes inspired by Israeli places.";
export const EXPECTED_ROOT_TITLE = "RUSH Israel — סימולטור נהיגה ישראלי";

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function containsNormalized(haystack, needle) {
  return normalizeWhitespace(haystack)
    .toLocaleLowerCase("en")
    .includes(normalizeWhitespace(needle).toLocaleLowerCase("en"));
}

export function validateProductMetadata({
  metadata,
  productDefinition,
  catalogue,
  provenance,
  packageJson,
  packageLock,
  site,
  readme,
  licence,
  notices,
  rootSource,
  middlewareSource,
  vitePluginSource,
  rushPwaSource,
}) {
  const errors = [];
  if (!metadata || typeof metadata !== "object") {
    return ["product metadata is not an object"];
  }

  if (metadata.schema_version !== "1.0.2") {
    errors.push("metadata schema version must be 1.0.2");
  }
  if (metadata.document_type !== "rush-product-metadata") {
    errors.push("metadata document type must be rush-product-metadata");
  }
  if (metadata.repository !== "talstilkol/rush-israel") {
    errors.push("metadata repository must be talstilkol/rush-israel");
  }
  if (metadata.canonical_branch !== "main") {
    errors.push("metadata canonical branch must be main");
  }
  if (metadata.observed_source_commit !== "aab3b725f256ff5a0a145c5cd3ac749860bdaeb9") {
    errors.push("metadata source commit must match the accepted RSH-011 merge");
  }

  const expectedProduct = {
    id: "rush-israel",
    name: "RUSH Israel",
    version: "0.0.0-private",
    release_stage: "pre_alpha_private",
    owner: "talstilkol",
    ownership_model: "private_owner_controlled",
  };
  if (!sameJson(metadata.product, expectedProduct)) {
    errors.push("canonical product identity differs from the RSH-012 contract");
  }

  if (
    packageJson?.name !== "app-builder-workspace"
    || packageJson?.version !== "0.0.0-private"
    || packageJson?.private !== true
    || packageJson?.license !== "UNLICENSED"
    || packageJson?.description !== EXPECTED_PRODUCT_DESCRIPTION
  ) {
    errors.push("package.json identity, version, privacy, licence or description is incorrect");
  }
  if (packageLock?.packages?.[""]?.name !== packageJson?.name) {
    errors.push("package-lock root name must retain the internal package name");
  }
  if (!sameJson(metadata.package, {
    internal_name: "app-builder-workspace",
    internal_name_retained: true,
    internal_name_is_public_product_name: false,
    version: "0.0.0-private",
    private: true,
    license: "UNLICENSED",
    description: EXPECTED_PRODUCT_DESCRIPTION,
  })) {
    errors.push("metadata package contract differs from package.json");
  }

  if (
    productDefinition?.product?.id !== metadata.product.id
    || productDefinition?.product?.name !== metadata.product.name
    || productDefinition?.product?.ownership_model !== "private_owner_controlled"
    || productDefinition?.product?.public_distribution_authorized !== false
  ) {
    errors.push("product metadata must agree with the frozen product definition");
  }
  if (productDefinition?.version_1_scope?.tracks?.target_count !== 8) {
    errors.push("frozen product definition must retain exactly eight tracks");
  }
  if (
    catalogue?.counts?.total !== 56
    || catalogue?.counts?.mvp !== 8
    || catalogue?.counts?.deferred !== 48
  ) {
    errors.push("track catalogue must remain 56 total, 8 MVP and 48 deferred");
  }

  const licensing = metadata.licensing;
  if (
    licensing?.root_file !== "LICENSE"
    || licensing?.model !== "proprietary_all_rights_reserved"
    || licensing?.public_licence_granted !== false
    || licensing?.public_distribution_authorized !== false
    || licensing?.third_party_notices !== "THIRD-PARTY-NOTICES.md"
    || licensing?.asset_provenance_authority !== "ASSET-PROVENANCE.json"
    || licensing?.unverified_asset_files !== 66
    || licensing?.legal_clearance_complete !== false
  ) {
    errors.push("licensing metadata must remain proprietary, private and legally fail-closed");
  }
  if (
    provenance?.scope?.unverified_asset_files !== 66
    || provenance?.scope?.public_distribution_authorized !== false
    || provenance?.scope?.legal_clearance_complete !== false
    || provenance?.truth_boundaries?.public_release_allowed !== false
  ) {
    errors.push("asset provenance must retain 66 unverified assets and block public release");
  }

  if (
    metadata.repository_state?.visibility_current !== "public"
    || metadata.repository_state?.visibility_policy_target !== "private"
    || metadata.repository_state?.visibility_transition_state !== "owner_setting_action_required"
    || metadata.repository_state?.main_protected !== false
    || metadata.repository_state?.required_status_checks !== 0
    || metadata.repository_state?.rulesets !== 0
  ) {
    errors.push("repository-state metadata must truthfully record the live administrative blockers");
  }

  if (!sameJson(site, { title: "RUSH Israel", type: "x:game", card: "custom" })) {
    errors.push("Open Graph site identity must be exactly RUSH Israel / x:game / custom");
  }
  if (
    metadata.branding?.canonical_title !== "RUSH Israel"
    || metadata.branding?.open_graph_title !== site.title
    || metadata.branding?.open_graph_type !== site.type
    || metadata.branding?.root_document_title !== EXPECTED_ROOT_TITLE
    || metadata.branding?.root_description !== EXPECTED_PRODUCT_DESCRIPTION
    || metadata.branding?.public_branding_assets_verified !== false
  ) {
    errors.push("branding metadata must use the exact RUSH Israel identity without clearing assets");
  }
  if (
    !rootSource.includes(`const APP_TITLE = "${EXPECTED_ROOT_TITLE}"`)
    || !rootSource.includes("{ title: APP_TITLE }")
  ) {
    errors.push("root document title must remain the exact RUSH Israel title");
  }
  if (
    !rootSource.includes(`"${EXPECTED_PRODUCT_DESCRIPTION}"`)
    || !rootSource.includes("content: APP_DESCRIPTION")
    || /Israel and New York/i.test(rootSource)
  ) {
    errors.push("root document description must match the private Israel-inspired product boundary");
  }

  const pwa = metadata.pwa;
  if (
    pwa?.manifest_delivery !== "dynamic_via_vite_and_server_middleware"
    || pwa?.manifest_path !== "/__grok/manifest.webmanifest"
    || pwa?.manifest_legacy_alias !== "/__grok/manifest.json"
    || pwa?.name_source !== "src/lib/og/site.json:title via scripts/rush-pwa.mjs"
    || pwa?.name !== "RUSH Israel"
    || pwa?.display !== "standalone"
    || pwa?.start_url !== "/"
    || pwa?.scope !== "/"
    || pwa?.install_material_licence_verified !== false
    || pwa?.public_install_distribution_authorized !== false
  ) {
    errors.push("PWA metadata must match both dynamic private RUSH Israel runtime surfaces");
  }
  if (
    !middlewareSource.includes("renderRushWebManifest")
    || !middlewareSource.includes("renderRushInstallPageHtml")
  ) {
    errors.push("server middleware must use the product-specific RUSH PWA wrapper");
  }
  if (
    !middlewareSource.includes('path === "/__grok/manifest.webmanifest"')
    || !middlewareSource.includes('path === "/__grok/manifest.json"')
  ) {
    errors.push("server middleware must expose both recorded dynamic manifest paths");
  }
  if (
    !vitePluginSource.includes('from "./rush-pwa.mjs"')
    || !vitePluginSource.includes("renderRushWebManifest")
    || !vitePluginSource.includes("renderRushInstallPageHtml")
    || !vitePluginSource.includes("renderProductWebManifest(")
    || !vitePluginSource.includes("renderProductInstallPage(")
    || !vitePluginSource.includes("serveGrokPwa(server.middlewares, root)")
  ) {
    errors.push("Vite dev and preview must use the product-specific RUSH PWA wrapper");
  }
  if (!rushPwaSource.includes('RUSH_PWA_NAME = "RUSH Israel"')) {
    errors.push("RUSH PWA wrapper must retain the exact product name");
  }

  const toolchain = metadata.toolchain;
  if (
    toolchain?.node !== "22.16.0"
    || toolchain?.npm !== "10.9.2"
    || toolchain?.clean_install !== "npm ci"
    || toolchain?.development !== "npm run dev"
    || toolchain?.complete_tests !== "npm test"
    || toolchain?.self_starting_qa !== "npm run qa:ci"
    || toolchain?.deterministic_development_build !== "npm run build:dev"
  ) {
    errors.push("toolchain metadata must retain exact accepted commands and versions");
  }

  for (const token of [
    "RUSH Israel",
    "22.16.0",
    "10.9.2",
    "npm ci",
    "npm test",
    "npm run qa:ci",
    "npm run build:dev",
    "0/13",
    "66",
    "Public",
    "Private",
    "LICENSE",
    "THIRD-PARTY-NOTICES.md",
  ]) {
    if (!readme.includes(token)) errors.push(`README is missing required token: ${token}`);
  }
  if (/Israel and New York/i.test(readme) || /Israel and New York/i.test(packageJson?.description ?? "")) {
    errors.push("obsolete Israel and New York metadata must be absent");
  }
  const englishReadmeBoundary =
    "Public accessibility of this repository does not grant a licence or authorize public distribution.";
  const hebrewReadmeBoundary =
    "המאגר הציבורי כעת אינו מעניק רישיון ואינו מאשר הפצה ציבורית.";
  if (
    !containsNormalized(readme, englishReadmeBoundary)
    && !containsNormalized(readme, hebrewReadmeBoundary)
  ) {
    errors.push("README must state that public accessibility grants no licence");
  }

  const normalizedLicence = normalizeWhitespace(licence);
  for (const token of [
    "RUSH ISRAEL PROPRIETARY LICENSE",
    "All rights reserved",
    "No public licence grant",
    "Public accessibility",
    "does not constitute a licence",
    "Third-party and unverified materials",
    "prior written permission",
  ]) {
    if (!normalizedLicence.includes(token)) {
      errors.push(`LICENSE is missing required boundary: ${token}`);
    }
  }
  const normalizedNotices = normalizeWhitespace(notices);
  for (const token of [
    "Basis Universal",
    "Apache License 2.0",
    "66",
    "Track-card images",
    "Grok install/template visual assets",
    "Root branding assets",
    "Not cleared",
  ]) {
    if (!normalizedNotices.includes(token)) {
      errors.push(`third-party notices are missing: ${token}`);
    }
  }

  if (
    metadata.readiness?.release_gates_green !== 0
    || metadata.readiness?.release_gates_total !== 13
    || metadata.readiness?.browser_device_matrix_complete !== false
    || metadata.readiness?.public_release_ready !== false
  ) {
    errors.push("readiness metadata must remain 0/13 and not public-release ready");
  }
  if (
    metadata.change_control?.metadata_changes_require_review !== true
    || metadata.change_control?.public_distribution_requires_explicit_owner_authorization !== true
    || metadata.change_control?.unverified_assets_may_not_be_marked_cleared_without_evidence !== true
    || metadata.change_control?.validator !== "scripts/check-product-metadata.mjs"
  ) {
    errors.push("metadata change control must remain review-gated and fail-closed");
  }

  return errors;
}

function loadInputs() {
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
    vitePluginSource: readFileSync(fromRoot("scripts", "grok-pwa-plugin.mjs"), "utf8"),
    rushPwaSource: readFileSync(fromRoot("scripts", "rush-pwa.mjs"), "utf8"),
  };
}

function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const errors = validateProductMetadata(loadInputs());
  if (errors.length) {
    console.error("product-metadata fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(
    "product-metadata ok: RUSH Israel 0.0.0-private; Vite/Nitro PWA aligned; 66 assets blocked; 0/13 gates",
  );
}
