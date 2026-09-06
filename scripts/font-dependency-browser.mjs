/** Online and denied-font probes against the real app. Records hashes, never font files. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { openAyalonRace } from './golden-capture.mjs';
import { readFontEvidence, assessPlatformFonts, settleFontProbes } from './font-evidence.mjs';
const hosts = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

export async function verifyFontDependencies(browser, url) {
  const results = [];
  for (const mode of ['online-observation', 'stylesheet-denied', 'font-binary-denied']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [], denied = [], resources = [], pending = [];
    const onResponse = response => {
      const parsed = new URL(response.url());
      if (!hosts.has(parsed.hostname)) return;
      pending.push((async () => {
        const row = { url: response.url(), status: response.status(), kind: response.request().resourceType(), contentType: response.headers()['content-type'] ?? null };
        try {
          if (response.ok()) {
            const bytes = await response.body();
            assert.ok(bytes.length <= 2 * 1024 * 1024, 'unexpectedly large font dependency');
            row.bytes = bytes.length; row.sha256 = createHash('sha256').update(bytes).digest('hex');
            // Font data never leaves this in-memory scope.
          }
        } catch (error) { row.bodyError = String(error); }
        resources.push(row);
      })());
    };
    page.on('response', onResponse);
    page.on('pageerror', error => errors.push(String(error)));
    if (mode !== 'online-observation') await page.route(uri => hosts.has(uri.hostname), route => {
      const host = new URL(route.request().url()).hostname;
      if (mode === 'stylesheet-denied' || host === 'fonts.gstatic.com') { denied.push(route.request().url()); return route.abort('failed'); }
      return route.continue();
    });
    let cdp;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.locator('[data-rush-ready="true"]:not([inert])').waitFor({ state: 'visible', timeout: 45000 });
      // Visible multilingual probes deliberately request both families only on these diagnostic pages.
      await page.evaluate(() => {
        for (const [id, text, lang] of [['font-probe-he','נהיגה','he'], ['font-probe-ar','قيادة','ar']]) {
          const span = document.createElement('span'); span.id=id; span.lang=lang; span.textContent=text;
          span.style.cssText=`position:fixed;left:12px;bottom:${lang === 'he' ? 12 : 52}px;z-index:100000;font-size:24px;font-family:var(--font-sans);background:white;color:black`;
          document.body.append(span);
        }
      });
      await settleFontProbes(page);
      const fontEvidence = await readFontEvidence(page);
      cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument');
      const usage = {};
      for (const [lang, family] of [['he','Heebo'], ['ar','Noto Sans Arabic']]) {
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `#font-probe-${lang}` });
        assert.ok(nodeId, 'font probe is absent');
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
        usage[lang] = assessPlatformFonts(fonts, family);
        assert.ok(usage[lang].glyphs > 0, 'multilingual text must actually render');
        if (mode !== 'online-observation') assert.equal(usage[lang].expectedCustomGlyphs, 0, 'blocked fonts must not be reported as downloaded glyphs');
      }
      if (mode !== 'online-observation') assert.ok(denied.length > 0, 'fault injection did not reach a real request');
      if (mode === 'stylesheet-denied') assert.equal(fontEvidence.assessment.hasLoadedHeeboFace, false);
      const race = await openAyalonRace(page);
      assert.equal(race.track, 'ayalon'); assert.deepEqual(errors, []);
      await page.evaluate(() => { document.getElementById('font-probe-he')?.remove(); document.getElementById('font-probe-ar')?.remove(); });
      page.off('response', onResponse); await Promise.all(pending);
      results.push({ case: 'actual app and multilingual text remain usable under font availability condition', mode, status: 'passed',
        injectedFailures: denied.length, denied, probeLayoutSettled: true, fontEvidence, usage,
        onlineFamiliesObserved: ['he','ar'].every(lang => usage[lang].expectedCustomGlyphs > 0),
        immutableBytesVerified: false, baselineUpdates: 0, fontFilesWritten: 0,
        resources: resources.sort((a,b) => a.url.localeCompare(b.url)), raceTrack: race.track,
        limitation: 'Successful fallback is usability evidence, not original-typography parity; remote body hashes are observations, not pins.' });
    } finally { await cdp?.detach(); await page.close(); }
  }
  return results;
}
