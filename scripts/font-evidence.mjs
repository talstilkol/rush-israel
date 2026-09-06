/** Font loading state is not proof of font availability or immutable remote bytes. */
import assert from 'node:assert/strict';
export const FONT_FAMILIES = ['Heebo', 'Noto Sans Arabic'];
const normalize = value => String(value ?? '').replace(/^['"]|['"]$/g, '').trim();

/** Serializable in the document realm; reads only, without loading or installing fonts. */
export function fontSnapshotInDocument() {
  const fonts = document.fonts;
  return { supported: !!fonts, status: fonts?.status ?? 'unavailable',
    bodyFontFamily: document.body ? getComputedStyle(document.body).fontFamily : null,
    faces: fonts ? [...fonts].map(face => ({ family: face.family, weight: face.weight, style: face.style,
      stretch: face.stretch, status: face.status, unicodeRange: face.unicodeRange })) : [] };
}
export function assessFontSnapshot(snapshot) {
  assert.ok(snapshot && Array.isArray(snapshot.faces), 'font face evidence must be an array');
  assert.ok(snapshot.faces.every(face => face && typeof face.family === 'string' && typeof face.status === 'string'), 'malformed font face');
  const families = FONT_FAMILIES.map(family => {
    const faces = snapshot.faces.filter(face => normalize(face.family) === family);
    return { family, declared: faces.length, loaded: faces.filter(face => face.status === 'loaded').length,
      loading: faces.filter(face => face.status === 'loading').length,
      failed: faces.filter(face => ['error', 'failed'].includes(face.status)).length,
      unloaded: faces.filter(face => face.status === 'unloaded').length };
  });
  return { setSettled: snapshot.supported === true && snapshot.status === 'loaded', families,
    anyRequestedFaceFailed: families.some(family => family.failed > 0),
    hasLoadedHeeboFace: families[0].loaded > 0,
    typographyVerified: false, immutableBytesVerified: false,
    limitation: 'Face availability does not prove per-glyph usage, full weight coverage, reference parity or immutable CDN bytes.' };
}
export function assessPlatformFonts(fonts, expectedFamily) {
  assert.ok(Array.isArray(fonts), 'platform font evidence must be an array');
  assert.ok(FONT_FAMILIES.includes(expectedFamily), 'unexpected font family');
  assert.ok(fonts.every(font => font && typeof font.familyName === 'string'
    && typeof font.isCustomFont === 'boolean' && Number.isSafeInteger(font.glyphCount) && font.glyphCount >= 0), 'malformed platform usage');
  const used = fonts.filter(font => font.glyphCount > 0);
  return { expectedFamily, glyphs: used.reduce((sum, font) => sum + font.glyphCount, 0),
    expectedCustomGlyphs: used.filter(font => normalize(font.familyName) === expectedFamily && font.isCustomFont)
      .reduce((sum, font) => sum + font.glyphCount, 0),
    fallbackGlyphs: used.filter(font => normalize(font.familyName) !== expectedFamily || !font.isCustomFont)
      .reduce((sum, font) => sum + font.glyphCount, 0),
    fonts: used.map(font => ({ familyName: font.familyName, isCustomFont: font.isCustomFont, glyphCount: font.glyphCount })),
    immutableBytesVerified: false };
}
export async function readFontEvidence(page) {
  const snapshot = await page.evaluate(fontSnapshotInDocument);
  return { ...snapshot, assessment: assessFontSnapshot(snapshot) };
}
