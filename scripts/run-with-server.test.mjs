import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_COMMAND_TIMEOUT_MS,
  DEFAULT_SERVER_URL,
  DEFAULT_START_TIMEOUT_MS,
  devServerSpec,
  parseHarnessArgs,
  probeServer,
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

test("dev server uses local Vite through the app-env wrapper", () => {
  const spec = devServerSpec({ EXAMPLE: "1" });
  assert.equal(spec.command, process.execPath);
  assert.equal(spec.options.cwd, projectRoot);
  assert.equal(spec.options.env.VITE_QA, "1");
  assert.equal(spec.args[0], fromRoot("scripts", "with-app-env.mjs"));
  assert.equal(spec.args[1], process.execPath);
  assert.equal(spec.args[2], fromRoot("node_modules", "vite", "bin", "vite.js"));
  assert.deepEqual(spec.args.slice(-6), ["dev", "--host", "0.0.0.0", "--port", "8080", "--strictPort"]);
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
