import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { injectRushHead, createRushHeadInjector } from './rush-head.mjs';
import { grokPwaPlugin } from './grok-pwa-plugin.mjs';
import { fromRoot } from './project-root.mjs';

const html = '<!doctype html><html lang="he"><head><title>שלום</title></head><body>מרוץ العربية 🏁</body></html>';
const forbidden = /grok-app-builder\/extensions\.js|og\.grok\.me|grok-project-id|grok:app_id|x:creator|https:\/\/untrusted/;
function assertProductHead(value) {
  assert.doesNotMatch(value, forbidden);
  assert.match(value, /href="\/__grok\/manifest.webmanifest"/);
  assert.match(value, /href="\/__grok\/icon-180.png"/);
  assert.match(value, /apple-mobile-web-app-title" content="RUSH Israel"/);
  assert.equal((value.match(/rel="manifest"/g) ?? []).length, 1);
}

test('product head adds local PWA identity without platform code or host metadata', () => assertProductHead(injectRushHead(html)));
test('host, project and remote card inputs cannot introduce external product chrome', () => assertProductHead(injectRushHead(html,
  { host: 'untrusted.example', projectId: 'untrusted', creator: 'untrusted', site: { image: 'https://untrusted/img', banner: '/banner.jpg' } })));
test('existing title, description, theme and body are not replaced', () => {
  const input = html.replace('</head>', '<meta name="theme-color" content="#abcdef"><meta name="description" content="owner text"></head>');
  const output = injectRushHead(input);
  assert.ok(output.includes('<meta name="theme-color" content="#abcdef">'));
  assert.ok(output.includes('<meta name="description" content="owner text">'));
  assert.ok(output.endsWith('<body>מרוץ العربية 🏁</body></html>'));
  assert.equal((output.match(/name="theme-color"/g) ?? []).length, 1);
});
test('repeated injection is idempotent', () => { const once = injectRushHead(html); assert.equal(injectRushHead(once), once); });
test('existing uppercase and single-quoted head declarations are recognized', () => {
  const input = html.replace('</head>', "<LINK REL='manifest' href='/__grok/manifest.webmanifest'></head>");
  assert.equal((injectRushHead(input).match(/rel=['"]manifest/gi) ?? []).length, 1);
});
test('body and comment examples cannot suppress real product tags', () => {
  const input = html.replace('</head>', '<!-- <link rel="manifest"> --></head>').replace('</body>', '<code>rel="apple-touch-icon"</code></body>');
  assert.match(injectRushHead(input), /href="\/__grok\/manifest.webmanifest"/);
  assert.match(injectRushHead(input), /href="\/__grok\/icon-180.png"/);
});
test('site title is escaped before use in an attribute', () => {
  const output = injectRushHead(html, { site: { title: '"><script>bad()</script>' } });
  assert.doesNotMatch(output, /<script>/); assert.match(output, /&quot;&gt;&lt;script&gt;/);
});
for (const input of ['<!doctype html><html><body>שלום</body></html>', '<body>שלום</body>', '<html><head><title>שלום</title>']) {
  test(`missing head delimiter handled without discarding original bytes: ${input.slice(0, 20)}`, () => {
    const output = injectRushHead(input); assert.match(output, /manifest.webmanifest/); assert.ok(output.includes('שלום'));
    assert.equal(injectRushHead(output), output);
  });
}
test('non-string data is unchanged', () => { assert.equal(injectRushHead(null), null); });
test('every byte split preserves multibyte UTF-8 and head boundaries', () => {
  const bytes = Buffer.from(html), expected = injectRushHead(html);
  for (let i = 0; i <= bytes.length; i++) {
    const stream = createRushHeadInjector();
    assert.equal(Buffer.concat([...stream.push(bytes.subarray(0, i)), ...stream.push(bytes.subarray(i)), ...stream.flush()]).toString(), expected, `split ${i}`);
  }
});
test('single-byte chunks and repeated flush preserve all text', () => {
  const stream = createRushHeadInjector(), outputs = [];
  for (const byte of Buffer.from(html)) outputs.push(...stream.push(Uint8Array.of(byte)));
  outputs.push(...stream.flush()); assert.deepEqual(stream.flush(), []);
  assert.equal(Buffer.concat(outputs).toString(), injectRushHead(html));
});
test('post-head binary chunks pass through unchanged', () => {
  const stream = createRushHeadInjector(); stream.push('<html><head></head>');
  const body = Buffer.from([0, 255, 12, 80]); assert.deepEqual(Buffer.concat(stream.push(body)), body);
});
test('incomplete stream flush injects local head once', () => {
  const stream = createRushHeadInjector(); assert.deepEqual(stream.push('<html><head>שלום'), []);
  const result = Buffer.concat(stream.flush()).toString(); assert.match(result, /manifest/); assert.ok(result.endsWith('שלום'));
  assert.deepEqual(stream.flush(), []);
});
test('empty stream remains empty', () => { const stream = createRushHeadInjector(); assert.deepEqual(stream.flush(), []); });
test('stream head buffering is bounded but a large body is not rejected', () => {
  const stream = createRushHeadInjector({}, 128); assert.throws(() => stream.push('x'.repeat(129)), /byte limit/);
  assert.throws(() => stream.push('</head>'), /already failed/); assert.throws(() => stream.flush(), /already failed/);
  const good = createRushHeadInjector({}, 128); assert.ok(Buffer.concat(good.push('<head></head>' + 'x'.repeat(500))).length > 500);
});
test('invalid byte limits are rejected', () => { for (const n of [0,-1,NaN,Infinity,1.5]) assert.throws(() => createRushHeadInjector({}, n)); });
for (const host of ['', 'preview.grok.me', 'untrusted.example']) {
  test(`actual Vite transform uses only product-local head even with host=${host || 'empty'}`, () => {
    const prior = process.env.VITE_PUBLIC_HOSTNAME;
    try { process.env.VITE_PUBLIC_HOSTNAME = host; assertProductHead(grokPwaPlugin().transformIndexHtml(html)); }
    finally { if (prior === undefined) delete process.env.VITE_PUBLIC_HOSTNAME; else process.env.VITE_PUBLIC_HOSTNAME = prior; }
  });
}

// Execute the actual middleware implementation with only its bundler-only imports adapted.
async function loadMiddleware() {
  let source = readFileSync(fromRoot('server/middleware/grok-pwa.ts'), 'utf8')
    .replace(/import installPageTemplate from [^;]+;/, 'const installPageTemplate = "<html><head></head><body>{{APP_NAME}}</body></html>";')
    .replace(/import \{ grokOgIdentity \} from [^;]+;/, 'const grokOgIdentity = { site: { title: "RUSH Israel" } };')
    .replace(/from "\.\.\/\.\.\/scripts\/([^"\n]+)"/g, (_, file) => `from ${JSON.stringify(pathToFileURL(fromRoot('scripts', file)).href)}`);
  source = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default;
}
for (const host of ['untrusted.example', 'preview.grok.me']) test(`actual Nitro stream does not inject vendor resources for ${host}`, async () => {
  const middleware = await loadMiddleware();
  const req = { method: 'GET', headers: new Headers({ 'accept': 'text/html', 'x-forwarded-host': host }) };
  const chunks = Buffer.from(html);
  const response = new Response(new ReadableStream({ start(c) { for (const b of chunks) c.enqueue(Uint8Array.of(b)); c.close(); } }),
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'content-length': `${chunks.length}`, 'x-test': 'preserved' } });
  const result = await middleware({url: new URL('http://localhost/'), req}, () => response);
  assert.equal(result.status, 200); assert.equal(result.headers.get('content-length'), null); assert.equal(result.headers.get('x-test'), 'preserved');
  const text = await result.text(); assertProductHead(text); assert.ok(text.includes('מרוץ العربية 🏁'));
});
test('Nitro preserves non-document and non-HTML responses', async () => {
  const middleware = await loadMiddleware(), response = new Response('asset');
  for (const [path, method] of [['/game/x.png','GET'], ['/','POST'], ['/api/x','GET']]) {
    const event = {url: new URL(path,'http://localhost'), req:{method,headers:new Headers()}};
    assert.equal(await middleware(event, () => response), response);
  }
});
test('Nitro retains local manifest and install endpoints', async () => {
  const middleware = await loadMiddleware(), req = {method:'GET',headers:new Headers({'accept':'text/html','host':'untrusted.example'})};
  const manifest = await middleware({url:new URL('http://localhost/__grok/manifest.webmanifest'),req}, () => assert.fail('must handle manifest'));
  assert.equal((await manifest.json()).name, 'RUSH Israel');
  const install = await middleware({url:new URL('http://localhost/?install=1&platform=ios'),req}, () => assert.fail('must handle install'));
  assert.match(await install.text(), /RUSH Israel/);
});
