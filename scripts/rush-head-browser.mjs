/** Real served HTML/network checks. Fonts remain external and explicitly unqualified. */
import assert from 'node:assert/strict';
export async function verifyProductHead(browser, url) {
  const results = [];
  for (const host of ['private-owner.example', 'preview.grok.me']) {
    const page = await browser.newPage();
    const requests = [], errors = [];
    page.on('request', request => requests.push(request.url()));
    page.on('pageerror', error => errors.push(String(error)));
    try {
      await page.setExtraHTTPHeaders({ 'x-forwarded-host': host });
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
      assert.ok(response?.ok(), 'actual document response must succeed');
      const html = await response.text();
      assert.doesNotMatch(html, /grok-app-builder\/extensions\.js|og\.grok\.me|grok-project-id|grok:app_id/);
      await page.locator('[data-rush-ready="true"]').waitFor({ state: 'visible', timeout: 30000 });
      const metadata = await page.evaluate(() => ({
        scripts: [...document.scripts].map(script => script.src).filter(Boolean),
        manifest: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
        name: document.querySelector('meta[name="apple-mobile-web-app-title"]')?.getAttribute('content'),
      }));
      assert.equal(metadata.manifest, '/__grok/manifest.webmanifest');
      assert.equal(metadata.name, 'RUSH Israel');
      const forbidden = requests.filter(value => ['grok.com', 'og.grok.me', host].includes(new URL(value).hostname));
      assert.deepEqual(forbidden, []); assert.deepEqual(errors, []);
      const externalHosts = [...new Set(requests.map(value => new URL(value).hostname))].filter(value => value !== new URL(url).hostname).sort();
      results.push({ case: 'served product head ignores forwarded platform host', host, status: 'passed',
        forbiddenRequests: forbidden.length, externalHostsObserved: externalHosts, metadata });
    } finally { await page.close(); }
  }
  return results;
}
