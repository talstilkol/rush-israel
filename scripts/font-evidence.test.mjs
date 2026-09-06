import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { assessFontSnapshot, assessPlatformFonts, readFontEvidence, fontSnapshotInDocument } from './font-evidence.mjs';
const face = (family = 'Heebo', status = 'loaded') => ({ family, status });
const snapshot = (faces = [], status = 'loaded') => ({ supported: true, status, faces });
test('settled empty font set cannot establish the requested font', () => {
  const result = assessFontSnapshot(snapshot()); assert.equal(result.setSettled, true);
  assert.equal(result.hasLoadedHeeboFace, false); assert.equal(result.typographyVerified, false);
});
test('settled failed font set is recorded as failed availability', () => {
  const result = assessFontSnapshot(snapshot([face('Heebo', 'error')]));
  assert.equal(result.setSettled, true); assert.equal(result.anyRequestedFaceFailed, true); assert.equal(result.hasLoadedHeeboFace, false);
});
test('loaded family does not qualify immutable font bytes or reference typography', () => {
  const result = assessFontSnapshot(snapshot([face()])); assert.equal(result.hasLoadedHeeboFace, true);
  assert.equal(result.immutableBytesVerified, false); assert.equal(result.typographyVerified, false);
});
test('unused declared faces remain distinct from failed and loaded faces', () => {
  const result = assessFontSnapshot(snapshot([face(), face('Heebo','unloaded'), face('Noto Sans Arabic','loading')]));
  assert.equal(result.families[0].loaded,1); assert.equal(result.families[0].unloaded,1);
  assert.equal(result.families[1].loading,1); assert.equal(result.anyRequestedFaceFailed,false);
});
test('unavailable FontFaceSet remains unqualified', () => assert.equal(assessFontSnapshot({ supported:false,status:'unavailable',faces:[] }).setSettled,false));
test('loading font set cannot be called settled', () => assert.equal(assessFontSnapshot(snapshot([face()], 'loading')).setSettled,false));
test('quoted family names are normalized but other families do not impersonate Heebo', () => {
  assert.equal(assessFontSnapshot(snapshot([face('"Heebo"')])).hasLoadedHeeboFace,true);
  assert.equal(assessFontSnapshot(snapshot([face('Not Heebo')])).hasLoadedHeeboFace,false);
});
for (const invalid of [null, {}, {faces:[null]}, {faces:[{family:'Heebo'}]}]) test(`invalid font evidence is rejected ${JSON.stringify(invalid)}`, () => assert.throws(() => assessFontSnapshot(invalid)));
test('actual custom glyph usage is counted independently of declarations', () => {
  const result = assessPlatformFonts([{familyName:'Heebo',isCustomFont:true,glyphCount:4}], 'Heebo');
  assert.equal(result.expectedCustomGlyphs,4); assert.equal(result.fallbackGlyphs,0); assert.equal(result.immutableBytesVerified,false);
});
test('a system face with the same name is not a downloaded custom face', () => {
  const result = assessPlatformFonts([{familyName:'Heebo',isCustomFont:false,glyphCount:4}], 'Heebo');
  assert.equal(result.expectedCustomGlyphs,0); assert.equal(result.fallbackGlyphs,4);
});
test('fallback glyphs cannot be counted as requested custom glyphs', () => {
  const result = assessPlatformFonts([{familyName:'Heebo',isCustomFont:true,glyphCount:3},{familyName:'Arial',isCustomFont:false,glyphCount:2}], 'Heebo');
  assert.equal(result.glyphs,5); assert.equal(result.expectedCustomGlyphs,3); assert.equal(result.fallbackGlyphs,2);
});
test('zero glyph entries cannot masquerade as a used font', () => assert.deepEqual(assessPlatformFonts([{familyName:'Heebo',isCustomFont:true,glyphCount:0}], 'Heebo').fonts,[]));
for (const count of [-1,1.5,NaN,Infinity]) test(`invalid glyph count ${count} is rejected`, () => assert.throws(() => assessPlatformFonts([{familyName:'Heebo',isCustomFont:true,glyphCount:count}], 'Heebo')));
test('unrecognised expected font is rejected', () => assert.throws(() => assessPlatformFonts([], 'Fake')));
test('read-only snapshot collection preserves the original snapshot', async () => {
  const data=snapshot([face()]); const original=JSON.stringify(data);
  const result=await readFontEvidence({async evaluate(fn){assert.equal(fn,fontSnapshotInDocument);return data;}});
  assert.equal(result.assessment.hasLoadedHeeboFace,true);assert.equal(JSON.stringify(data),original);
});
test('font snapshot observer does not initiate font loads or mutate the document', () => {
  const source=fontSnapshotInDocument.toString(); assert.doesNotMatch(source,/\.load\(|\.add\(|\.delete\(|createElement|fetch\(/);
});
test('original typography declarations and external references remain unchanged', () => {
  const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
  assert.match(css,/family=Heebo:wght@400;500;600;700;800&family=Noto\+Sans\+Arabic:wght@400;500;600;700&display=swap/);
  assert.match(css,/--font-sans: "Heebo", "Noto Sans Arabic", ui-sans-serif, system-ui, sans-serif/);
});
