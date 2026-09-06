/** RUSH-owned document head. Platform host/project/OG configuration is never consumed. */
import { escapeHtml } from './grok-pwa-shared.mjs';
import { productPwaName } from './rush-pwa.mjs';

/* @typedef is consumed through the reviewed shared module's declaration file. */
/** @typedef {import('./grok-pwa-shared.mjs').OgSite} OgSite */

/**
 * @param {string} html
 * @param {{ site?: OgSite | null }} context
 */
export function injectRushHead(html, { site } = {}) {
  if (typeof html !== 'string') return html;
  const title = escapeHtml(productPwaName(site));
  /** @type {Array<[string, string, string]>} */
  const tags = [
    ['rel', 'manifest', '<link rel="manifest" href="/__grok/manifest.webmanifest">'],
    ['rel', 'apple-touch-icon', '<link rel="apple-touch-icon" href="/__grok/icon-180.png">'],
    ['name', 'apple-mobile-web-app-title', `<meta name="apple-mobile-web-app-title" content="${title}">`],
    ['name', 'apple-mobile-web-app-status-bar-style', '<meta name="apple-mobile-web-app-status-bar-style" content="black">'],
    ['name', 'theme-color', '<meta name="theme-color" content="#0a0c0e">'],
  ];
  // Inspect meta/link tags in the document head, excluding comments and body examples.
  const start = /<head\b[^>]*>/i.exec(html);
  const end = /<\/head\s*>/i.exec(html);
  const head = start ? html.slice(start.index + start[0].length, end?.index ?? html.length) : '';
  const headTags = head.replace(/<!--[\s\S]*?-->/g, '').match(/<(?:meta|link)\b[^>]*>/gi) ?? [];
  const missing = tags.filter(([attribute, key]) => !headTags.some(tag =>
    new RegExp(`\\b${attribute}\\s*=\\s*(?:"${key}"|'${key}'|${key}(?=\\s|/?>))`, 'i').test(tag)
  )).map(([, , tag]) => tag).join('');
  if (!missing) return html;
  if (start && end && end.index >= start.index) return html.slice(0, end.index) + missing + html.slice(end.index);
  if (start) return html.slice(0, start.index + start[0].length) + missing + html.slice(start.index + start[0].length);
  const root = /<html\b[^>]*>/i.exec(html);
  const at = root ? root.index + root[0].length : /^<!doctype[^>]*>/i.exec(html)?.[0].length ?? 0;
  return html.slice(0, at) + `<head>${missing}</head>` + html.slice(at);
}

/**
 * Buffer only the head. UTF-8 characters and post-head binary chunks stay byte-exact.
 * @param {{ site?: OgSite | null }} context
 * @param {number} maxHeadBytes
 */
export function createRushHeadInjector(context = {}, maxHeadBytes = 1024 * 1024) {
  if (!Number.isSafeInteger(maxHeadBytes) || maxHeadBytes <= 0) throw new TypeError('positive head byte limit required');
  /** @type {Buffer[]} */
  let pending = [];
  let length = 0, done = false, failed = false;
  /** @param {string | Uint8Array} value */
  const buffer = value => typeof value === 'string' ? Buffer.from(value, 'utf8') : Buffer.from(value);
  return {
    /** @param {string | Uint8Array} value */
    push(value) {
      if (failed) throw new Error('RUSH document head stream already failed');
      const chunk = buffer(value);
      if (done) return [chunk];
      pending.push(chunk); length += chunk.length;
      const joined = Buffer.concat(pending, length);
      const end = /<\/head\s*>/i.exec(joined.toString('latin1'));
      const boundary = end ? end.index + end[0].length : length;
      if (boundary > maxHeadBytes) { pending = []; length = 0; failed = true; throw new Error('RUSH document head exceeds byte limit'); }
      if (!end) return [];
      pending = []; length = 0; done = true;
      return [Buffer.concat([Buffer.from(injectRushHead(joined.subarray(0, boundary).toString('utf8'), context)), joined.subarray(boundary)])];
    },
    flush() {
      if (failed) throw new Error('RUSH document head stream already failed');
      if (done || length === 0) return [];
      done = true;
      const joined = Buffer.concat(pending, length); pending = []; length = 0;
      return [Buffer.from(injectRushHead(joined.toString('utf8'), context))];
    },
  };
}
