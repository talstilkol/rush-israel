import {
  appNameFromHost,
  escapeHtml,
  renderInstallPageHtml,
  renderWebManifest,
} from "./grok-pwa-shared.mjs";

export const RUSH_PWA_NAME = "RUSH Israel";
export const RUSH_PWA_DESCRIPTION =
  "Private owner-controlled Three.js WebGL simcade driving game on fictional routes inspired by Israeli places.";

export function productPwaName(site) {
  return typeof site?.title === "string" && site.title.trim()
    ? site.title.trim()
    : RUSH_PWA_NAME;
}

export function renderRushWebManifest(host, site) {
  const manifest = JSON.parse(renderWebManifest(host));
  const name = productPwaName(site);
  return JSON.stringify({
    ...manifest,
    name,
    short_name: name,
    description:
      typeof site?.description === "string" && site.description.trim()
        ? site.description.trim()
        : RUSH_PWA_DESCRIPTION,
    start_url: "/",
    scope: "/",
  });
}

export function renderRushInstallPageHtml(template, { host, url, site }) {
  const genericName = escapeHtml(appNameFromHost(host));
  const productName = escapeHtml(productPwaName(site));
  return renderInstallPageHtml(template, { host, url }).replaceAll(genericName, productName);
}
