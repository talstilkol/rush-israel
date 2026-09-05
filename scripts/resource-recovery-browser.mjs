import assert from 'node:assert/strict';

/** Exercise the actual modules with temporary, restored fault injection. */
export async function verifyResourceRecovery(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const source = await (await page.request.get(new URL('/src/game/road-assets.ts', url).href)).text();
    const threePath = source.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1];
    assert.ok(threePath, 'resolve the exact THREE dependency used by the loader');
    const batch = await page.evaluate(async path => {
      const THREE = await import(path);
      const road = await import('/src/game/road-assets.ts');
      const original = THREE.TextureLoader.prototype.loadAsync;
      let created = 0, disposed = 0, calls = 0, failure;
      THREE.TextureLoader.prototype.loadAsync = function (asset) {
        calls++;
        if (asset.includes('-bump')) return new Promise((_, reject) => setTimeout(() => reject(new Error('injected road load')), 5));
        return new Promise(resolve => setTimeout(() => {
          const texture = new THREE.Texture(); created++;
          texture.addEventListener('dispose', () => disposed++);
          resolve(texture);
        }, asset.includes('-rough') ? 30 : 1));
      };
      try { await road.loadHwyRoad(); } catch (error) { failure = String(error); }
      finally { THREE.TextureLoader.prototype.loadAsync = original; }
      const partialPublished = !!road.getBakedRoad(4);
      const retried = await road.loadHwyRoad(); // real local PNGs, not mocks
      let sharedCalls = 0;
      THREE.TextureLoader.prototype.loadAsync = function (asset) { sharedCalls++; return original.call(this, asset); };
      let same;
      try { const kits = await Promise.all(Array.from({ length: 6 }, () => road.loadAyalonRoad())); same = kits.every(kit => kit === kits[0]); }
      finally { THREE.TextureLoader.prototype.loadAsync = original; }
      return { created, disposed, calls, failure, partialPublished, retryPublished: retried === road.getBakedRoad(4), sharedCalls, same };
    }, threePath);
    assert.equal(batch.created, 2); assert.equal(batch.disposed, 2);
    assert.equal(batch.calls, 3); assert.match(batch.failure, /injected road load/);
    assert.equal(batch.partialPublished, false); assert.equal(batch.retryPublished, true);
    assert.equal(batch.sharedCalls, 3); assert.equal(batch.same, true);

    const rollback = await page.evaluate(async () => {
      const { RendererFacade } = await import('/src/rendering/RendererFacade.ts');
      const { profileFromLegacy } = await import('/src/rendering/QualityProfile.ts');
      const { RaceEngine } = await import('/src/game/engine.ts');
      const makeCanvas = () => { const c = document.createElement('canvas'); c.style.cssText = 'width:800px;height:600px'; document.body.append(c); return c; };
      const outcomes = [];
      {
        const canvas = makeCanvas(); const resize = RendererFacade.prototype.resize;
        let gl, automaticDisposals = 0, caught = '';
        RendererFacade.prototype.resize = function () {
          gl = this.gl; const dispose = gl.dispose.bind(gl);
          gl.dispose = () => { automaticDisposals++; dispose(); };
          throw new Error('injected renderer initialization');
        };
        try { RendererFacade.init(canvas, profileFromLegacy('low')); }
        catch (error) { caught = String(error); }
        finally { RendererFacade.prototype.resize = resize; }
        outcomes.push({ case: 'renderer init rollback', automaticDisposals, caught });
        if (gl && automaticDisposals === 0) gl.dispose(); // test cleanup, never counted as automatic
        canvas.remove();
      }
      for (const stage of ['boot', 'listener']) {
        const canvas = makeCanvas(); const init = RendererFacade.init;
        const add = canvas.addEventListener; const remove = canvas.removeEventListener;
        let gfx, automaticDisposals = 0, caught = '';
        const listeners = new Set();
        RendererFacade.init = function (...args) {
          gfx = init.apply(this, args); const dispose = gfx.dispose.bind(gfx);
          gfx.dispose = () => { automaticDisposals++; dispose(); };
          if (stage === 'listener') {
            canvas.addEventListener = function (type, listener, ...rest) {
              if (type === 'webglcontextrestored') throw new Error('injected listener setup');
              listeners.add(listener); return add.call(this, type, listener, ...rest);
            };
            canvas.removeEventListener = function (type, listener, ...rest) { listeners.delete(listener); return remove.call(this, type, listener, ...rest); };
          }
          return gfx;
        };
        try {
          new RaceEngine(canvas, { trackId: 'ayalon', carId: 'sabra', quality: 'low', night: false, langHe: true,
            onHud() {}, onFinish() {}, onBoot() { if (stage === 'boot') throw new Error('injected boot callback'); } });
        } catch (error) { caught = String(error); }
        finally { RendererFacade.init = init; canvas.addEventListener = add; canvas.removeEventListener = remove; }
        outcomes.push({ case: `engine ${stage} rollback`, automaticDisposals, caught, listenersRemaining: listeners.size });
        if (gfx && automaticDisposals === 0) gfx.dispose();
        canvas.remove();
      }
      return outcomes;
    });
    for (const row of rollback) {
      assert.equal(row.automaticDisposals, 1, row.case);
      assert.match(row.caught, /injected/, row.case);
      if ('listenersRemaining' in row) assert.equal(row.listenersRemaining, 0);
    }
    assert.deepEqual(errors, []);
    return [{ case: 'road partial-load rollback, real retry and concurrent deduplication', status: 'passed', ...batch },
      ...rollback.map(row => ({ ...row, status: 'passed' }))];
  } finally { await page.close(); }
}
