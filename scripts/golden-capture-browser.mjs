/** Browser-level harness tests, separate from actual scene/image acceptance. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';
import { openAyalonRace } from './golden-capture.mjs';
const output = fromRoot('artifacts/golden-harness');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
function fixture({ hydrate = true, ticking = true, wrongTrack = false, loadError = false } = {}) {
  return `<html><body><div id="app" data-rush-ready="false" data-rush-screen="title" inert><button id="select">בחר מסלול</button></div><script>
    const app = document.getElementById('app'); window.events = []; let tick = 0;
    ${hydrate ? `setTimeout(() => {
      document.getElementById('select').onclick = () => {
        events.push('tracks'); app.dataset.rushScreen = 'tracks';
        app.innerHTML = '<button id="all">הכל</button>';
        document.getElementById('all').onclick = () => { events.push('all');
          setTimeout(() => { app.innerHTML = '<button id="ayalon">נתיבי איילון</button>';
            document.getElementById('ayalon').onclick = () => { events.push('ayalon'); app.dataset.rushScreen = 'race'; app.dataset.rushTrack = 'ayalon';
              setTimeout(() => {
                app.innerHTML = ${JSON.stringify(loadError ? '<div data-testid="race-load-error">injected failure</div>' : '<canvas data-testid="race-minimap" width="144" height="144"></canvas>')};
                window.__controlsTest = { getTick: () => tick };
                window.render_game_to_text = () => JSON.stringify({ track: '${wrongTrack ? 'rothschild' : 'ayalon'}', quality:'high',weather:'clear',photo:false,webgpuOk:false,speed:0,progress:0 });
                ${ticking ? 'setInterval(() => tick++, 20);' : ''}
              }, 150);
            };
          }, 150);
        };
      };
      events.push('hydrated'); app.dataset.rushReady = 'true'; app.inert = false;
    }, 200);` : ''}
  </script></body></html>`;
}
try {
  for (const [name, options, expected] of [
    ['delayed hydration, menu and engine succeed in order', {}, null],
    ['unhydrated controls cannot pass readiness', { hydrate: false }, /Timeout/],
    ['stopped engine cannot pass readiness', { ticking: false }, /Timeout/],
    ['wrong actual track is rejected', { wrongTrack: true }, /actual Ayalon/],
    ['visible engine load failure is reported', { loadError: true }, /race loading failed/],
  ]) {
    const page = await browser.newPage();
    try {
      await page.setContent(fixture(options));
      const task = openAyalonRace(page, { timeoutMs: expected ? 1500 : 5000 });
      if (expected) await assert.rejects(task, expected);
      else { await task; assert.deepEqual(await page.evaluate(() => window.events), ['hydrated', 'tracks', 'all', 'ayalon']); }
      results.push({ case: name, status: 'passed' });
    } finally { await page.close(); }
  }
} catch (error) { results.push({ case: 'golden harness', status: 'failed', error: String(error) }); process.exitCode = 1; }
finally { await browser.close(); await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n'); console.log(JSON.stringify(results)); }
