import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  chromiumInstallPlan,
  installPlaywrightChromium,
  isGoogleChromeAptHashMismatch,
} from './install-playwright-chromium.mjs';

const CI_LOG = `Err:29 https://dl.google.com/linux/chrome-stable/deb stable/main amd64 Packages
  Hash Sum mismatch
E: Failed to fetch https://dl.google.com/linux/chrome-stable/deb/dists/stable/main/binary-amd64/Packages.gz  Hash Sum mismatch
Failed to install browsers
Error: Installation process exited with code: 100
`;

test('Google Chrome apt hash-sum mismatch is classified as a retryable OS-deps failure', () => {
  assert.equal(isGoogleChromeAptHashMismatch(CI_LOG), true);
  assert.equal(chromiumInstallPlan(CI_LOG, 100), 'fallback_binary_only');
});

test('a successful with-deps install stays successful', () => {
  assert.equal(chromiumInstallPlan('Chromium 141 installed', 0), 'ok');
});

test('an ordinary playwright install failure stays failed', () => {
  assert.equal(chromiumInstallPlan('Failed to install browsers\nError: Installation process exited with code: 1', 1), 'fail');
  assert.equal(isGoogleChromeAptHashMismatch('E: Failed to fetch http://archive.ubuntu.com/ubuntu hash'), false);
});

test('hash-sum mismatch falls back to a binary-only Playwright CDN install', () => {
  const calls = [];
  const spawn = (cmd, args) => {
    calls.push([cmd, ...args].join(' '));
    if (args.includes('--with-deps')) return { status: 100, stdout: '', stderr: CI_LOG };
    return { status: 0, stdout: 'Chromium downloaded', stderr: '' };
  };
  const logs = [];
  const result = installPlaywrightChromium({ spawn, log: { log: m => logs.push(m), error() {} } });
  assert.equal(result.status, 'binary-only');
  assert.equal(result.code, 0);
  assert.deepEqual(calls, [
    'npx playwright install --with-deps chromium',
    'npx playwright install chromium',
  ]);
  assert.match(logs.join('\n'), /without OS-deps/);
});

test('a failed binary fallback cannot be relabelled as installed', () => {
  const spawn = (_cmd, args) => ({
    status: 1,
    stdout: '',
    stderr: args.includes('--with-deps') ? CI_LOG : 'Failed to download chromium',
  });
  const result = installPlaywrightChromium({ spawn, log: { log() {}, error() {} } });
  assert.equal(result.status, 'failed');
  assert.notEqual(result.code, 0);
});

test('required CI installs Chromium through the retry helper, not a bare --with-deps one-liner', () => {
  const workflow = readFileSync(fromRoot('.github', 'workflows', 'required-ci.yml'), 'utf8');
  assert.match(workflow, /node scripts\/install-playwright-chromium\.mjs/);
  assert.doesNotMatch(workflow, /playwright install --with-deps/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});
