import assert from 'node:assert/strict';
import { ASSET_FAMILIES } from './asset-cache-fixture.mjs';

/** Real local PNG/GLTF loads, with one request rejected before its network call.
 * Disposal events prove explicit ownership cleanup, not physical GPU memory use.
 */
export async function verifyAssetBatches(browser, url) {
  const results = [];
  for (const family of ASSET_FAMILIES) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
      const modulePath = `/src/game/${family.id}-assets.ts`;
      const response = await page.request.get(new URL(modulePath, url).href);
      assert.equal(response.status(), 200);
      const source = await response.text();
      const dependency = family.id === 'car'
        ? source.match(/from\s+["']([^"']*GLTFLoader[^"']*)["']/)?.[1]
        : source.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1];
      assert.ok(dependency, `${family.id}: resolve the actual loader dependency`);
      const evidence = await page.evaluate(async ({ family, modulePath, dependency }) => {
        const api = await import(modulePath);
        const dep = await import(dependency);
        const prototype = family.id === 'car' ? dep.GLTFLoader.prototype : dep.TextureLoader.prototype;
        const original = prototype.loadAsync;
        const calls = [], resources = new Set(), counts = new Map();
        let fail = true, successfulLoads = 0;
        const watch = resource => {
          if (!resource || resources.has(resource)) return;
          resources.add(resource); counts.set(resource, 0);
          resource.addEventListener('dispose', () => counts.set(resource, counts.get(resource) + 1));
        };
        prototype.loadAsync = function (asset, ...args) {
          calls.push(asset); const failingBatch = fail;
          if (fail && asset === family.urls[0]) return Promise.reject(new Error('injected asset batch rejection'));
          return original.call(this, asset, ...args).then(resource => {
            if (failingBatch) {
              successfulLoads++;
              if (family.id === 'car') {
                for (const root of new Set([resource.scene, ...resource.scenes])) root.traverse(node => {
                  watch(node.geometry);
                  for (const material of Array.isArray(node.material) ? node.material : node.material ? [node.material] : []) {
                    watch(material);
                    Object.values(material).filter(x => x?.isTexture).forEach(watch);
                  }
                });
              } else watch(resource);
            }
            return resource;
          });
        };
        const published = () => family.getters.map(([getter, ...args]) => {
          const value = api[getter](...args);
          if (family.id === 'car' && value) {value.geometry.dispose();value.material.dispose();}
          return !!value;
        });
        try {
          const first = await Promise.allSettled(Array.from({ length: 6 }, () => api[family.entry]()));
          const afterFailure = published();
          const firstCalls = [...calls];
          const disposalCounts = [...counts.values()];
          fail = false;
          await Promise.all(Array.from({ length: 6 }, () => api[family.entry]()));
          const afterRetry = published(), retryCalls = calls.slice(firstCalls.length);
          await api[family.entry]();
          return { firstRejected: first.filter(x => x.status === 'rejected').length,
            firstCalls, successfulLoads, ownedResources: resources.size, disposalCounts,
            afterFailure, afterRetry, retryCalls, callsAfterCachedLoad: calls.length };
        } finally { prototype.loadAsync = original; }
      }, { family, modulePath, dependency });
      assert.equal(evidence.firstRejected, 6, family.id);
      assert.deepEqual(evidence.firstCalls, family.urls, family.id);
      assert.equal(evidence.successfulLoads, family.urls.length - 1, family.id);
      assert.ok(evidence.ownedResources >= family.urls.length - 1, family.id);
      assert.ok(evidence.disposalCounts.every(x => x === 1), `${family.id}: each unpublished resource released once`);
      assert.ok(evidence.afterFailure.every(x => !x), `${family.id}: no partial cache`);
      assert.ok(evidence.afterRetry.every(Boolean), `${family.id}: every public getter ready`);
      assert.deepEqual(evidence.retryCalls, family.urls, family.id);
      assert.equal(evidence.callsAfterCachedLoad, family.urls.length * 2, family.id);
      assert.deepEqual(errors, [], family.id);
      results.push({ case: `${family.id}: actual asset rollback, complete retry and single-flight cache`, status: 'passed', ...evidence });
    } finally { await page.close(); }
  }
  return results;
}
