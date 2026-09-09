#!/usr/bin/env node
/** Install Playwright Chromium without aborting required-ci on Google Chrome apt hash-sum mismatch. */
import { spawnSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function isGoogleChromeAptHashMismatch(output) {
  const text = String(output ?? '');
  return /Hash Sum mismatch/i.test(text) && /dl\.google\.com\/linux\/chrome-stable/i.test(text);
}

export function chromiumInstallPlan(output, code) {
  if (code === 0) return 'ok';
  if (isGoogleChromeAptHashMismatch(output)) return 'fallback_binary_only';
  return 'fail';
}

export function runPlaywrightInstall(args, spawn = spawnSync, env = process.env) {
  const result = spawn('npx', ['playwright', 'install', ...args], {
    encoding: 'utf8',
    env,
  });
  return {
    code: result.status ?? 1,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  };
}

export function installPlaywrightChromium({ spawn = spawnSync, env = process.env, log = console } = {}) {
  const withDeps = runPlaywrightInstall(['--with-deps', 'chromium'], spawn, env);
  const plan = chromiumInstallPlan(withDeps.output, withDeps.code);
  if (plan === 'ok') {
    log.log('playwright chromium installed with OS dependencies');
    return { status: 'with-deps', code: 0 };
  }
  if (plan === 'fail') {
    log.error(withDeps.output.trim());
    return { status: 'failed', code: withDeps.code || 1 };
  }
  log.log('Google Chrome apt hash-sum mismatch; installing Chromium from Playwright CDN without OS-deps');
  const binary = runPlaywrightInstall(['chromium'], spawn, env);
  if (binary.code !== 0) {
    log.error(binary.output.trim());
    return { status: 'failed', code: binary.code || 1 };
  }
  log.log('playwright chromium installed without Google Chrome apt dependencies');
  return { status: 'binary-only', code: 0 };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = installPlaywrightChromium();
  process.exitCode = result.code;
}
