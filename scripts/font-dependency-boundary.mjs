/** Reviewed product font URL pins. Does not vendor font files or claim immutable CDN bytes. */
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const REVIEWED_FONT_STYLESHEET = 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap';
export const REVIEWED_FONT_PRECONNECTS = Object.freeze(['https://fonts.googleapis.com', 'https://fonts.gstatic.com']);
export const REVIEWED_FONT_SANS = '"Heebo", "Noto Sans Arabic", ui-sans-serif, system-ui, sans-serif';
export const FONT_QUALIFICATION = 'reviewed_product_font_urls_pinned_without_distributed_font_files';
export const REVIEWED_FONT_RESOURCES = Object.freeze([
  { from: 'src/routes/__root.tsx', resource: 'https://fonts.googleapis.com', kind: 'potential_remote_reference' },
  { from: 'src/routes/__root.tsx', resource: 'https://fonts.gstatic.com', kind: 'potential_remote_reference' },
  { from: 'src/styles.css', resource: REVIEWED_FONT_STYLESHEET, kind: 'css_url' },
]);
const reviewedKeys = new Set(REVIEWED_FONT_RESOURCES.map(resourceKey));
const FONT_FILE = /\.(woff2?|ttf|otf|eot)$/i;

export function resourceKey(row) {
  return `${row.from}\0${row.resource}\0${row.kind}`;
}

export function isGoogleFontHost(resource) {
  try {
    const host = new URL(resource).hostname;
    return host === 'fonts.googleapis.com' || host === 'fonts.gstatic.com';
  } catch { return false; }
}

export function isReviewedFontResource(row) {
  return reviewedKeys.has(resourceKey(row));
}

export function inspectFontDependencyBoundary(root, files, externalResources = []) {
  const errors = [];
  const fontFiles = files.filter(name => FONT_FILE.test(name));
  if (fontFiles.length) errors.push(`distributed font files are forbidden: ${fontFiles.join(', ')}`);
  let styleText = '', rootText = '';
  if (files.includes('src/styles.css')) {
    try { styleText = readFileSync(path.join(root, 'src/styles.css'), 'utf8'); }
    catch { errors.push('reviewed typography stylesheet missing'); }
  }
  if (files.includes('src/routes/__root.tsx')) {
    try { rootText = readFileSync(path.join(root, 'src/routes/__root.tsx'), 'utf8'); }
    catch { errors.push('reviewed document root missing'); }
  }
  const isProductTypography = styleText.includes(REVIEWED_FONT_STYLESHEET) || styleText.includes(REVIEWED_FONT_SANS)
    || rootText.includes('https://fonts.googleapis.com') || rootText.includes('https://fonts.gstatic.com');
  if (isProductTypography) {
    if (!styleText.includes(REVIEWED_FONT_STYLESHEET)) errors.push('reviewed Heebo/Noto stylesheet URL missing or changed');
    if (!styleText.includes(`--font-sans: ${REVIEWED_FONT_SANS}`)) errors.push('reviewed font-sans stack missing or changed');
    for (const href of REVIEWED_FONT_PRECONNECTS) {
      if (!rootText.includes(href)) errors.push(`reviewed Google Fonts preconnect missing: ${href}`);
    }
    const extra = externalResources.filter(row => isGoogleFontHost(row.resource) && !isReviewedFontResource(row));
    if (extra.length) errors.push(`unreviewed Google Fonts reference: ${extra.map(row => row.resource).join(', ')}`);
    for (const expected of REVIEWED_FONT_RESOURCES) {
      if (!externalResources.some(row => resourceKey(row) === resourceKey(expected))) {
        errors.push(`reviewed font resource absent: ${expected.from} ${expected.resource}`);
      }
    }
  }
  const hasReviewedFonts = externalResources.some(isReviewedFontResource);
  return {
    applicable: isProductTypography || hasReviewedFonts,
    reviewed_resources: REVIEWED_FONT_RESOURCES,
    qualification: FONT_QUALIFICATION,
    qualified: errors.length === 0 && (!isProductTypography || REVIEWED_FONT_RESOURCES.every(expected =>
      externalResources.some(row => resourceKey(row) === resourceKey(expected)))),
    errors,
    font_files_written: fontFiles.length,
    immutable_bytes_verified: !hasReviewedFonts,
    limitation: 'Pin covers product URLs, families/weights and the absence of vendored font files. Remote stylesheet and glyph bytes remain mutable CDN observations, not immutable pins.',
  };
}
