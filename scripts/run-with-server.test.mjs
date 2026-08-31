import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  DEFAULT_COMMAND_TIMEOUT_MS,
  DEFAULT_SERVER_URL,
  DEFAULT_START_TIMEOUT_MS,
  canSelfStartUrl,
  devServerSpec,
  parseHarnessArgs,
  probeServer,
  signalExitCode,
  waitForCommandOutcome,
  waitForExit,
  waitForServer,
} from "./run-with-server.mjs";
import { fromRoot, projectRoot } from "./project-root.mjs";

test("requires a child command", () => {
  assert.deepEqual(parseHarnessArgs([], {}), {
    error: "usage: node scripts/run-with-server.mjs -- <command> [args…]",
  });
  assert.deepEqual(parseHarnessArgs(["--"], {}), {
    error: "usage: node scripts/run-with-server.mjs -- <command> [args…]",
  });
});

test("parses command and deterministic defaults", () => {
  assert.deepEqual(parseHarnessArgs(["--", "npm", "run", "qa:raw"], {}), {
    command: ["npm", "run", "qa:raw"],
    serverUrl: DEFAULT_SERVER_URL,
    reuseServer: false,
    startTimeoutMs: DEFAULT_START_TIMEOUT_MS,
    commandTimeoutMs: DEFAULT_COMMAND_TIMEOUT_MS,
    stopTimeoutMs: 5_000,
  });
});

test("parses explicit timeouts and reuse flag", () => {
  const parsed = parseHarnessArgs(["node", "x.mjs"], {
    QA_SERVER_URL: "http://localhost:9000/qa",
    QA_REUSE_SERVER: "1",
    QA_START_TIMEOUT_MS: "1234",
    QA_COMMAND_TIMEOUT_MS: "5678",
    QA_STOP_TIMEOUT_MS: "900",
  });
  assert.deepEqual(parsed, {
    command: ["node", "x.mjs"],
    serverUrl: "http://localhost:9000/qa",
    reuseServer: true,
    startTimeoutMs: 1234,
    commandTimeoutMs: 5678,
    stopTimeoutMs: 900,
  });
});

test("rejects malformed URL and timeout values", () => {
  assert.deepEqual(parseHarnessArgs(["echo"], { QA_SERVER_URL: "nope" }), {
    error: "QA_SERVER_URL must be a valid URL",
  });
  assert.deepEqual(parseHarnessArgs(["echo"], { QA_SERVER_URL: "file:///tmp/x" }), {
    error: "QA_SERVER_URL must use http or https",
  });
  assert.deepEqual(parseHarnessArgs(["echo"], { QA_START_TIMEOUT_MS: "0" }), {
    error: "QA_START_TIMEOUT_MS must be a positive integer",
  });
});

test("self-start is restricted to the exact canonical IPv4 loopback URL", () => {
  assert.equal(canSelfStartUrl("http://127.0.0.1:8080/"), true);
  assert.equal(canSelfStartUrl("http://localhost:8080/"), false);
  assert.equal(canSelfStartUrl("http://[::1]:8080/"), false);
  assert.equal(canSelfStartUrl("http://127.0.0.1:8081/"), false);
  assert.equal(canSelfStartUrl("https://127.0.0.1:8080/"), false);
  assert.equal(canSelfStartUrl("http://127.0.0.1:8080/qa"), false);
});

test("dev server uses the repository-local Vite binary directly", () => {
  const spec = devServerSpec({ EXAMPLE: "1" });
  assert.equal(spec.command, process.execPath);
  assert.equal(spec.options.cwd, projectRoot);
  assert.equal(spec.options.env.VITE_QA, "1");
  assert.equal(spec.options.detached, process.platform !== "win32");
  assert.equal(spec.args[0], fromRoot("node_modules", "vite", "bin", "vite.js"));
  assert.deepEqual(spec.args.slice(-6), ["dev", "--host", "0.0.0.0", "--port", "8080", "--strictPort"]);
});

test("signal exit codes follow 128 plus the platform signal number", () => {
  assert.equal(signalExitCode("SIGHUP"), 129);
  assert.equal(signalExitCode("SIGINT"), 130);
  assert.equal(signalExitCode("SIGKILL"), 137);
  assert.equal(signalExitCode("SIGTERM"), 143);
  assert.equal(signalExitCode("SIGUNKNOWN"), 128);
});

test("probeServer accepts healthy or redirect responses and rejects failures", async () => {
  assert.equal(
    await probeServer(DEFAULT_SERVER_URL, async () => ({ status: 200 })),
    true,
  );
  assert.equal(
    await probeServer(DEFAULT_SERVER_URL, async () => ({ status: 302 })),
    true,
  );
  assert.equal(
    await probeServer(DEFAULT_SERVER_URL, async () => ({ status: 500 })),
    false,
  );
  assert.equal(
    await probeServer(DEFAULT_SERVER_URL, async () => {
      throw new Error("offline");
    }),
    false,
  );
});

test("waitForServer resolves after a successful probe", async () => {
  let attempts = 0;
  await waitForServer({
    url: DEFAULT_SERVER_URL,
    child: null,
    timeoutMs: 1_000,
    probe: async () => ++attempts >= 2,
  });
  assert.equal(attempts, 2);
});

test("waitForServer fails when the child exits before readiness", async () => {
  await assert.rejects(
    waitForServer({
      url: DEFAULT_SERVER_URL,
      child: { exitCode: 1, signalCode: null },
      timeoutMs: 1_000,
      probe: async () => false,
    }),
    /exited before readiness/,
  );
});

test("waitForServer reports spawn errors instead of waiting for timeout", async () => {
  const child = new EventEmitter();
  child.exitCode = null;
  child.signalCode = null;
  const result = waitForServer({
    url: DEFAULT_SERVER_URL,
    child,
    timeoutMs: 1_000,
    probe: async () => false,
  });
  setImmediate(() => child.emit("error", new Error("spawn boom")));
  await assert.rejects(result, /QA server failed to start: spawn boom/);
});

test("waitForExit cancels the losing timer and removes the exit listener", async () => {
  const child = new EventEmitter();
  child.exitCode = null;
  child.signalCode = null;
  const handle = { id: 1 };
  let timerCallback = null;
  let clearedHandle = null;
  const result = waitForExit(child, 5_000, {
    setTimeout: (callback) => {
      timerCallback = callback;
      return handle;
    },
    clearTimeout: (value) => {
      clearedHandle = value;
    },
  });

  assert.equal(child.listenerCount("exit"), 1);
  child.emit("exit", 0, null);
  assert.equal(await result, true);
  assert.equal(clearedHandle, handle);
  assert.equal(child.listenerCount("exit"), 0);
  timerCallback?.();
});

test("waitForExit removes the exit listener when the timeout wins", async () => {
  const child = new EventEmitter();
  child.exitCode = null;
  child.signalCode = null;
  const handle = { id: 2 };
  let timerCallback = null;
  let clearedHandle = null;
  const result = waitForExit(child, 5_000, {
    setTimeout: (callback) => {
      timerCallback = callback;
      return handle;
    },
    clearTimeout: (value) => {
      clearedHandle = value;
    },
  });

  timerCallback();
  assert.equal(await result, false);
  assert.equal(clearedHandle, handle);
  assert.equal(child.listenerCount("exit"), 0);
});

test("main checks interrupts before starting a server and before spawning QA", () => {
  const source = readFileSync(fromRoot("scripts", "run-with-server.mjs"), "utf8");
  const probe = source.indexOf("const alreadyRunning = await probeServer(config.serverUrl);");
  const serverBranch = source.indexOf("if (!alreadyRunning)", probe);
  const commandSpawn = source.indexOf("commandChild = spawnQaCommand", serverBranch);
  const check = "if (interrupted) return signalExitCode(interrupted);";
  const preServerCheck = source.indexOf(check, probe);
  const preCommandCheck = source.lastIndexOf(check, commandSpawn);

  assert.ok(probe >= 0);
  assert.ok(serverBranch > probe);
  assert.ok(commandSpawn > serverBranch);
  assert.ok(preServerCheck > probe && preServerCheck < serverBranch);
  assert.ok(preCommandCheck > serverBranch && preCommandCheck < commandSpawn);
});

test("waitForCommandOutcome resolves normal exits and removes listeners", async () => {
  const child = new EventEmitter();
  const result = waitForCommandOutcome(child, 1_000);
  setImmediate(() => child.emit("exit", 3, null));
  assert.deepEqual(await result, { code: 3, signal: null, timedOut: false });
  assert.equal(child.listenerCount("error"), 0);
  assert.equal(child.listenerCount("exit"), 0);
});

test("waitForCommandOutcome rejects spawn errors and removes listeners", async () => {
  const child = new EventEmitter();
  const result = waitForCommandOutcome(child, 1_000);
  setImmediate(() => child.emit("error", new Error("command boom")));
  await assert.rejects(result, /command boom/);
  assert.equal(child.listenerCount("error"), 0);
  assert.equal(child.listenerCount("exit"), 0);
});

test("waitForCommandOutcome reports timeout and removes listeners", async () => {
  const child = new EventEmitter();
  assert.deepEqual(await waitForCommandOutcome(child, 5), {
    code: null,
    signal: null,
    timedOut: true,
  });
  assert.equal(child.listenerCount("error"), 0);
  assert.equal(child.listenerCount("exit"), 0);
});
