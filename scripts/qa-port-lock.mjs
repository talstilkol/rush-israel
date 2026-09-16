import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const QA_PORT_LOCK = join(tmpdir(), "rush-qa-8080.lock");

export function withQaPortLockSync(fn, waitMs = 420_000) {
  const start = Date.now();
  for (;;) {
    try {
      mkdirSync(QA_PORT_LOCK);
      try {
        return fn();
      } finally {
        rmSync(QA_PORT_LOCK, { recursive: true, force: true });
      }
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      if (Date.now() - start > waitMs) throw new Error("timed out waiting for QA port lock");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
    }
  }
}
