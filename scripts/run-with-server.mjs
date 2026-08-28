#!/usr/bin/env node
import { spawn } from "node:child_process";
import { realpathSync } from "node:fs";
import { constants as osConstants } from "node:os";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const DEFAULT_SERVER_URL = "http://127.0.0.1:8080/";
export const DEFAULT_START_TIMEOUT_MS = 60_000;
export const DEFAULT_COMMAND_TIMEOUT_MS = 15 * 60_000;
export const DEFAULT_STOP_TIMEOUT_MS = 5_000;

export function signalExitCode(signal) {
  const number = osConstants.signals?.[signal];
  return Number.isInteger(number) ? 128 + number : 128;
}

function positiveInteger(value, fallback, label) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error(`${label} must be a positive integer`);
  return n;
}

export function parseHarnessArgs(argv, env = process.env) {
  const separator = argv.indexOf("--");
  const command = separator >= 0 ? argv.slice(separator + 1) : argv;
  if (!command.length || !command[0]) {
    return { error: "usage: node scripts/run-with-server.mjs -- <command> [args…]" };
  }

  let serverUrl;
  try {
    serverUrl = new URL(env.QA_SERVER_URL || DEFAULT_SERVER_URL);
  } catch {
    return { error: "QA_SERVER_URL must be a valid URL" };
  }
  if (!/^https?:$/.test(serverUrl.protocol)) {
    return { error: "QA_SERVER_URL must use http or https" };
  }

  try {
    return {
      command,
      serverUrl: serverUrl.href,
      reuseServer: env.QA_REUSE_SERVER === "1",
      startTimeoutMs: positiveInteger(
        env.QA_START_TIMEOUT_MS,
        DEFAULT_START_TIMEOUT_MS,
        "QA_START_TIMEOUT_MS",
      ),
      commandTimeoutMs: positiveInteger(
        env.QA_COMMAND_TIMEOUT_MS,
        DEFAULT_COMMAND_TIMEOUT_MS,
        "QA_COMMAND_TIMEOUT_MS",
      ),
      stopTimeoutMs: positiveInteger(
        env.QA_STOP_TIMEOUT_MS,
        DEFAULT_STOP_TIMEOUT_MS,
        "QA_STOP_TIMEOUT_MS",
      ),
    };
  } catch (error) {
    return { error: error.message };
  }
}

export function canSelfStartUrl(value) {
  const url = new URL(value);
  return (
    url.protocol === "http:" &&
    url.hostname === "127.0.0.1" &&
    url.port === "8080" &&
    url.pathname === "/" &&
    !url.search &&
    !url.hash
  );
}

export function devServerSpec(env = process.env) {
  return {
    command: process.execPath,
    args: [
      fromRoot("scripts", "with-app-env.mjs"),
      process.execPath,
      fromRoot("node_modules", "vite", "bin", "vite.js"),
      "dev",
      "--host",
      "0.0.0.0",
      "--port",
      "8080",
      "--strictPort",
    ],
    options: {
      cwd: projectRoot,
      env: { ...env, VITE_QA: "1" },
      stdio: "inherit",
      detached: process.platform !== "win32",
    },
  };
}

export async function probeServer(url, fetchImpl = fetch) {
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(1_500),
      headers: { "cache-control": "no-cache" },
    });
    return response.status > 0 && response.status < 500;
  } catch {
    return false;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function exited(child) {
  return child.exitCode !== null || child.signalCode !== null;
}

export async function waitForServer({ url, child, timeoutMs, probe = probeServer }) {
  let spawnError = null;
  const onError = (error) => {
    spawnError = error;
  };
  child?.once?.("error", onError);
  try {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (spawnError) {
        throw new Error(`QA server failed to start: ${spawnError.message || spawnError}`);
      }
      if (child && exited(child)) {
        throw new Error(
          `QA server exited before readiness (code=${child.exitCode}, signal=${child.signalCode})`,
        );
      }
      if (await probe(url)) return;
      await delay(250);
    }
    throw new Error(`QA server did not become ready within ${timeoutMs}ms: ${url}`);
  } finally {
    child?.removeListener?.("error", onError);
  }
}

export async function waitForExit(child, timeoutMs, timerApi = {}) {
  if (exited(child)) return true;
  const setTimer = timerApi.setTimeout ?? setTimeout;
  const clearTimer = timerApi.clearTimeout ?? clearTimeout;

  return await new Promise((resolve) => {
    let settled = false;
    let timer = null;
    const cleanup = () => {
      if (timer !== null) clearTimer(timer);
      child.removeListener("exit", onExit);
    };
    const settle = (value) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };
    const onExit = () => settle(true);

    child.once("exit", onExit);
    timer = setTimer(() => settle(false), timeoutMs);
  });
}

export async function terminateTree(child, timeoutMs = DEFAULT_STOP_TIMEOUT_MS) {
  if (!child || exited(child)) return;

  if (process.platform === "win32") {
    const killer = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
      windowsHide: true,
    });
    await waitForExit(killer, timeoutMs);
    return;
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
  if (await waitForExit(child, timeoutMs)) return;
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    child.kill("SIGKILL");
  }
  await waitForExit(child, Math.min(timeoutMs, 1_000));
}

function commandForPlatform(command) {
  if (process.platform === "win32" && command.toLowerCase() === "npm") return "npm.cmd";
  if (process.platform === "win32" && command.toLowerCase() === "npx") return "npx.cmd";
  return command;
}

export function spawnQaCommand(command, env = process.env) {
  const [file, ...args] = command;
  const serverUrl = env.QA_SERVER_URL || DEFAULT_SERVER_URL;
  return spawn(commandForPlatform(file), args, {
    cwd: projectRoot,
    env: {
      ...env,
      QA_SERVER_URL: serverUrl,
      SMOKE_URL: env.SMOKE_URL || serverUrl,
      SOAK_URL: env.SOAK_URL || serverUrl,
      VITE_QA: "1",
    },
    stdio: "inherit",
    windowsHide: true,
    detached: process.platform !== "win32",
  });
}

export function waitForCommandOutcome(child, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer;
    const cleanup = () => {
      clearTimeout(timer);
      child.removeListener("error", onError);
      child.removeListener("exit", onExit);
    };
    const settle = (fn, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      fn(value);
    };
    const onError = (error) => settle(reject, error);
    const onExit = (code, signal) => settle(resolve, { code, signal, timedOut: false });
    child.once("error", onError);
    child.once("exit", onExit);
    timer = setTimeout(
      () => settle(resolve, { code: null, signal: null, timedOut: true }),
      timeoutMs,
    );
  });
}

export async function runQaCommand(command, timeoutMs, env = process.env) {
  const child = spawnQaCommand(command, env);
  const outcome = await waitForCommandOutcome(child, timeoutMs);
  if (outcome.timedOut) {
    await terminateTree(child);
    throw new Error(`QA command exceeded ${timeoutMs}ms: ${command.join(" ")}`);
  }
  if (outcome.signal) return signalExitCode(outcome.signal);
  return outcome.code ?? 1;
}

function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const config = parseHarnessArgs(argv, env);
  if (config.error) {
    console.error(config.error);
    return 2;
  }

  let server = null;
  let ownsServer = false;
  let commandChild = null;
  let interrupted = null;
  const onSignal = (signal) => {
    interrupted ??= signal;
    void terminateTree(commandChild, config.stopTimeoutMs);
    void terminateTree(server, config.stopTimeoutMs);
  };
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(signal, onSignal);

  try {
    const alreadyRunning = await probeServer(config.serverUrl);
    if (interrupted) return signalExitCode(interrupted);
    if (alreadyRunning && !config.reuseServer) {
      throw new Error(
        `A server already responds at ${config.serverUrl}. `
          + "Refusing to test an unknown process; set QA_REUSE_SERVER=1 only when intentional.",
      );
    }

    if (!alreadyRunning) {
      if (!canSelfStartUrl(config.serverUrl)) {
        throw new Error(
          "The harness can self-start only the canonical loopback URL on port 8080. "
            + "For another URL, start that server explicitly and set QA_REUSE_SERVER=1.",
        );
      }
      const spec = devServerSpec(env);
      server = spawn(spec.command, spec.args, spec.options);
      ownsServer = true;
      await waitForServer({
        url: config.serverUrl,
        child: server,
        timeoutMs: config.startTimeoutMs,
      });
      console.log(`[qa-harness] server ready: ${config.serverUrl}`);
    } else {
      console.log(`[qa-harness] reusing explicitly authorised server: ${config.serverUrl}`);
    }

    if (interrupted) return signalExitCode(interrupted);
    commandChild = spawnQaCommand(config.command, {
      ...env,
      QA_SERVER_URL: config.serverUrl,
    });
    const outcome = await waitForCommandOutcome(commandChild, config.commandTimeoutMs);
    if (outcome.timedOut) {
      await terminateTree(commandChild, config.stopTimeoutMs);
      throw new Error(
        `QA command exceeded ${config.commandTimeoutMs}ms: ${config.command.join(" ")}`,
      );
    }
    if (interrupted) return signalExitCode(interrupted);
    if (outcome.signal) return signalExitCode(outcome.signal);
    return outcome.code ?? 1;
  } catch (error) {
    if (interrupted) return signalExitCode(interrupted);
    throw error;
  } finally {
    for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
      process.removeListener(signal, onSignal);
    }
    await terminateTree(commandChild, config.stopTimeoutMs);
    if (ownsServer) await terminateTree(server, config.stopTimeoutMs);
  }
}

if (isMainModule(import.meta.url)) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error(`[qa-harness] ${error?.message || error}`);
    process.exitCode = 1;
  }
}
