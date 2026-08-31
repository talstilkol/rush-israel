import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { validateSaveRecovery } from "./check-save-recovery.mjs";

const sandbox = mkdtempSync(join(tmpdir(), "rush-save-recovery-"));
writeFileSync(join(sandbox, "package.json"), '{"type":"module"}\n');
writeFileSync(join(sandbox, "save-schema.ts"), readFileSync(fromRoot("src", "game", "save-schema.ts")));
writeFileSync(
  join(sandbox, "save-recovery.ts"),
  readFileSync(fromRoot("src", "game", "save-recovery.ts"), "utf8")
    .replace('from "./save-schema";', 'from "./save-schema.ts";'),
);
writeFileSync(
  join(sandbox, "save-recovery-ui.ts"),
  readFileSync(fromRoot("src", "game", "save-recovery-ui.ts"), "utf8")
    .replace('from "./save-recovery";', 'from "./save-recovery.ts";'),
);
const recovery = await import(pathToFileURL(join(sandbox, "save-recovery.ts")).href);
const recoveryUi = await import(pathToFileURL(join(sandbox, "save-recovery-ui.ts")).href);
const schema = await import(pathToFileURL(join(sandbox, "save-schema.ts")).href);

function memoryStorage(initial = {}, options = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  return {
    values,
    writes,
    getItem(key) {
      if (options.failRead === true || options.failRead === key) throw new Error(`read blocked: ${key}`);
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (options.failWrite === true || options.failWrite === key) throw new Error(`write blocked: ${key}`);
      writes.push([key, value]);
      values.set(key, options.mismatch === key ? `${value}!` : value);
    },
  };
}

function save(cash) {
  return { ...schema.emptySave(), cash };
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.parent = null;
    this.attributes = new Map();
    this.dataset = {};
    this.style = {};
    this.listeners = new Map();
    this.textContent = "";
    this.id = "";
    this.type = "";
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  addEventListener(name, listener) { this.listeners.set(name, listener); }
  append(...children) {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
    }
  }
  remove() {
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter((child) => child !== this);
    this.parent = null;
  }
  focus() { this.ownerDocument.activeElement = this; }
  click() { this.listeners.get("click")?.(); }
}

class FakeDocument {
  constructor() {
    this.activeElement = null;
    this.body = new FakeElement("body", this);
  }
  createElement(tagName) { return new FakeElement(tagName, this); }
  getElementById(id) {
    const visit = (node) => node.id === id ? node : node.children.map(visit).find(Boolean) ?? null;
    return visit(this.body);
  }
}

function allElements(root) {
  return [root, ...root.children.flatMap(allElements)];
}

test("RSH-022 exposes bounded backup and quarantine keys", () => {
  assert.equal(recovery.SAVE_BACKUP_KEY, "rush-v1-backup");
  assert.equal(recovery.SAVE_QUARANTINE_KEY, "rush-v1-rejected");
  assert.equal(recovery.SAVE_QUARANTINE_PREVIOUS_KEY, "rush-v1-rejected-previous");
  assert.equal(recovery.SAVE_BACKUP_QUARANTINE_KEY, "rush-v1-backup-rejected");
});

test("the first save writes and verifies a recoverable backup before the current key", () => {
  const storage = memoryStorage();
  const result = recovery.writeSaveWithBackup(storage, save(900));
  assert.equal(result.status.state, "saved");
  assert.equal(result.status.backupAvailable, true);
  assert.deepEqual(storage.writes.map(([key]) => key), [recovery.SAVE_BACKUP_KEY, schema.SAVE_KEY]);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), storage.values.get(schema.SAVE_KEY));
});

test("a later save rotates the exact prior current bytes into the backup", () => {
  const oldRaw = schema.canonicalSaveString(save(700));
  const storage = memoryStorage({ [schema.SAVE_KEY]: oldRaw, [recovery.SAVE_BACKUP_KEY]: schema.canonicalSaveString(save(600)) });
  const result = recovery.writeSaveWithBackup(storage, save(800));
  assert.equal(result.status.state, "saved");
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), oldRaw);
  assert.equal(JSON.parse(storage.values.get(schema.SAVE_KEY)).cash, 800);
});

test("migration and repair back up exact source bytes before canonical overwrite", () => {
  const oldRaw = JSON.stringify({ version: 1, best: { ayalon: 45 } });
  const storage = memoryStorage({ [schema.SAVE_KEY]: oldRaw });
  const result = recovery.loadSaveWithRecovery(storage);
  assert.equal(result.status.state, "migrated");
  assert.equal(result.status.backupAvailable, true);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), oldRaw);
  assert.equal(JSON.parse(storage.values.get(schema.SAVE_KEY)).version, 3);
});

test("legacy migration verifies the exact legacy bytes in backup before creating the current key", () => {
  const legacyRaw = JSON.stringify({ version: 1, best: { ayalon: 44 }, cash: 640 });
  const storage = memoryStorage({ [schema.LEGACY_SAVE_KEY]: legacyRaw });
  const result = recovery.loadSaveWithRecovery(storage);
  assert.equal(result.status.state, "migrated");
  assert.equal(result.status.backupAvailable, true);
  assert.deepEqual(storage.writes.map(([key]) => key), [recovery.SAVE_BACKUP_KEY, schema.SAVE_KEY]);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), legacyRaw);
  assert.equal(storage.values.get(schema.LEGACY_SAVE_KEY), legacyRaw);
  assert.equal(JSON.parse(storage.values.get(schema.SAVE_KEY)).version, 3);
});


test("a valid backup wins over retained legacy bytes when the current key is missing", () => {
  const legacyRaw = schema.canonicalSaveString(save(410));
  const backupRaw = schema.canonicalSaveString(save(910));
  const storage = memoryStorage({
    [schema.LEGACY_SAVE_KEY]: legacyRaw,
    [recovery.SAVE_BACKUP_KEY]: backupRaw,
  });

  const loaded = recovery.loadSaveWithRecovery(storage);
  assert.equal(loaded.status.state, "recovery-available");
  assert.equal(loaded.status.source, "legacy");
  assert.equal(loaded.status.recoveryAction, "restore-backup");
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), backupRaw);
  assert.equal(storage.values.get(schema.LEGACY_SAVE_KEY), legacyRaw);
  assert.equal(storage.values.has(schema.SAVE_KEY), false);
  assert.equal(storage.writes.length, 0);

  const blockedWrite = recovery.writeSaveWithBackup(storage, save(920));
  assert.equal(blockedWrite.status.state, "recovery-available");
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), backupRaw);
  assert.equal(storage.values.has(schema.SAVE_KEY), false);
  assert.equal(storage.writes.length, 0);

  const restored = recovery.restoreSaveFromBackup(storage);
  assert.equal(restored.status.state, "recovered");
  assert.equal(storage.values.get(schema.SAVE_KEY), backupRaw);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), backupRaw);
  assert.equal(storage.values.get(schema.LEGACY_SAVE_KEY), legacyRaw);
});

test("legacy migration fails closed before creating the current key when backup verification fails", () => {
  const legacyRaw = JSON.stringify({ version: 1, best: { ayalon: 43 } });
  for (const options of [
    { failWrite: recovery.SAVE_BACKUP_KEY },
    { mismatch: recovery.SAVE_BACKUP_KEY },
  ]) {
    const storage = memoryStorage({ [schema.LEGACY_SAVE_KEY]: legacyRaw }, options);
    const result = recovery.loadSaveWithRecovery(storage);
    assert.equal(result.status.state, "write-failed");
    assert.equal(result.status.recoveryErrorCode, "backup-write-failed");
    assert.equal(storage.values.has(schema.SAVE_KEY), false);
    assert.equal(storage.values.get(schema.LEGACY_SAVE_KEY), legacyRaw);
  }
});

test("corrupt current bytes are never overwritten and a valid backup is offered", () => {
  const rejected = "{bad";
  const backup = schema.canonicalSaveString(save(750));
  const storage = memoryStorage({ [schema.SAVE_KEY]: rejected, [recovery.SAVE_BACKUP_KEY]: backup });
  const result = recovery.loadSaveWithRecovery(storage);
  assert.equal(result.status.state, "rejected");
  assert.equal(result.status.backupAvailable, true);
  assert.equal(result.status.recoveryAction, "restore-backup");
  assert.equal(storage.values.get(schema.SAVE_KEY), rejected);
  assert.equal(storage.writes.length, 0);
});

test("explicit restore quarantines exact corrupt bytes before restoring the verified backup", () => {
  const rejected = "{bad";
  const backup = schema.canonicalSaveString(save(760));
  const storage = memoryStorage({ [schema.SAVE_KEY]: rejected, [recovery.SAVE_BACKUP_KEY]: backup });
  const result = recovery.restoreSaveFromBackup(storage);
  assert.equal(result.status.state, "recovered");
  assert.equal(result.status.quarantined, true);
  assert.equal(storage.values.get(recovery.SAVE_QUARANTINE_KEY), rejected);
  assert.equal(storage.values.get(schema.SAVE_KEY), backup);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), backup);
});

test("a missing current key with a valid backup requires explicit recovery and blocks implicit replacement", () => {
  const backup = schema.canonicalSaveString(save(770));
  const storage = memoryStorage({ [recovery.SAVE_BACKUP_KEY]: backup });
  const loaded = recovery.loadSaveWithRecovery(storage);
  assert.equal(loaded.status.state, "recovery-available");
  assert.equal(loaded.status.recoveryAction, "restore-backup");
  assert.equal(storage.values.has(schema.SAVE_KEY), false);
  const restored = recovery.restoreSaveFromBackup(storage);
  assert.equal(restored.status.state, "recovered");
  assert.equal(storage.values.get(schema.SAVE_KEY), backup);
});

test("fresh start is explicit, preserves rejected bytes and creates a verified backup", () => {
  const rejected = JSON.stringify({ version: 99, cash: 1 });
  const storage = memoryStorage({ [schema.SAVE_KEY]: rejected });
  const result = recovery.startFreshSaveAfterRejection(storage);
  assert.equal(result.status.state, "fresh-started");
  assert.equal(result.status.quarantined, true);
  assert.equal(storage.values.get(recovery.SAVE_QUARANTINE_KEY), rejected);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), storage.values.get(schema.SAVE_KEY));
  assert.equal(JSON.parse(storage.values.get(schema.SAVE_KEY)).version, 3);
});

test("fresh start refuses to discard a valid backup or valid active save", () => {
  const backup = schema.canonicalSaveString(save(780));
  const withBackup = recovery.startFreshSaveAfterRejection(memoryStorage({ [recovery.SAVE_BACKUP_KEY]: backup }));
  assert.equal(withBackup.status.state, "rejected");
  assert.equal(withBackup.status.recoveryAction, "restore-backup");
  assert.equal(withBackup.status.recoveryErrorCode, "backup-available");

  const current = schema.canonicalSaveString(save(790));
  const storage = memoryStorage({ [schema.SAVE_KEY]: current });
  const active = recovery.startFreshSaveAfterRejection(storage);
  assert.equal(active.status.state, "loaded");
  assert.equal(active.status.recoveryErrorCode, "current-still-valid");
  assert.equal(storage.values.get(schema.SAVE_KEY), current);
});

test("backup write or verification failure prevents current overwrite", () => {
  const current = schema.canonicalSaveString(save(800));
  for (const options of [
    { failWrite: recovery.SAVE_BACKUP_KEY },
    { mismatch: recovery.SAVE_BACKUP_KEY },
  ]) {
    const storage = memoryStorage({ [schema.SAVE_KEY]: current }, options);
    const result = recovery.writeSaveWithBackup(storage, save(810));
    assert.equal(result.status.state, "write-failed");
    assert.equal(result.status.recoveryErrorCode, "backup-write-failed");
    assert.equal(storage.values.get(schema.SAVE_KEY), current);
  }
});

test("an invalid backup is quarantined before replacement with a valid current snapshot", () => {
  const current = schema.canonicalSaveString(save(820));
  const invalidBackup = "{broken-backup";
  const storage = memoryStorage({ [schema.SAVE_KEY]: current, [recovery.SAVE_BACKUP_KEY]: invalidBackup });
  const result = recovery.loadSaveWithRecovery(storage);
  assert.equal(result.status.state, "loaded");
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_QUARANTINE_KEY), invalidBackup);
  assert.equal(storage.values.get(recovery.SAVE_BACKUP_KEY), current);
});

test("two rejected-save quarantine slots preserve distinct recovery attempts and then fail closed", () => {
  const backup = schema.canonicalSaveString(save(830));
  const storage = memoryStorage({ [schema.SAVE_KEY]: "{one", [recovery.SAVE_BACKUP_KEY]: backup });
  assert.equal(recovery.restoreSaveFromBackup(storage).status.state, "recovered");
  storage.values.set(schema.SAVE_KEY, "{two");
  assert.equal(recovery.restoreSaveFromBackup(storage).status.state, "recovered");
  assert.equal(storage.values.get(recovery.SAVE_QUARANTINE_KEY), "{one");
  assert.equal(storage.values.get(recovery.SAVE_QUARANTINE_PREVIOUS_KEY), "{two");
  storage.values.set(schema.SAVE_KEY, "{three");
  const blocked = recovery.restoreSaveFromBackup(storage);
  assert.equal(blocked.status.state, "write-failed");
  assert.equal(blocked.status.recoveryErrorCode, "quarantine-full");
  assert.equal(storage.values.get(schema.SAVE_KEY), "{three");
});

test("storage read failures remain structured, visible and non-destructive", () => {
  const storage = memoryStorage({ [schema.SAVE_KEY]: schema.canonicalSaveString(save(840)) }, { failRead: true });
  const result = recovery.loadSaveWithRecovery(storage);
  assert.equal(result.status.state, "rejected");
  assert.equal(result.status.errorCode, "read-failed");
  assert.equal(result.status.recoveryAction, "retry");
  assert.equal(storage.writes.length, 0);
});

test("user-visible failure handling is accessible and avoids HTML injection", () => {
  const ui = readFileSync(fromRoot("src", "game", "save-recovery-ui.ts"), "utf8");
  const facade = readFileSync(fromRoot("src", "game", "save.ts"), "utf8");
  for (const token of [
    'setAttribute("role", status.notice === "success" ? "status" : "alertdialog")',
    'setAttribute("aria-live", status.notice === "success" ? "polite" : "assertive")',
    "rememberFocus(existing)",
    "restorePreviousFocus()",
    "(primaryAction ?? notice).focus()",
    "textContent",
    "Restore backup",
    "Press again to confirm",
    "Save storage unavailable",
    "SAVE_STATUS_EVENT",
    'dismissedSignature = ""',
    "dataset.saveStatusSignature",
  ]) assert.ok(ui.includes(token), `missing UI token: ${token}`);
  assert.equal(ui.includes("innerHTML"), false);
  assert.ok(facade.includes('lastSaveStatus.state === "rejected" || lastSaveStatus.state === "recovery-available"'));
  assert.ok(facade.includes("restoreSaveBackup"));
  assert.ok(facade.includes("startFreshSaveAfterFailure"));
});

test("the visible recovery notice preserves confirmation state and reappears after a healthy state", (context) => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalCustomEvent = globalThis.CustomEvent;
  const document = new FakeDocument();
  const previousFocus = document.createElement("button");
  document.body.append(previousFocus);
  previousFocus.focus();
  const events = [];
  globalThis.document = document;
  globalThis.window = { dispatchEvent(event) { events.push(event); return true; } };
  globalThis.CustomEvent = class {
    constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
  };
  context.after(() => {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.CustomEvent = originalCustomEvent;
  });

  let freshStarts = 0;
  const actions = {
    restore() {},
    startFresh() { freshStarts += 1; },
    retry() {},
    reload() {},
  };
  const rejected = recovery.createSavePersistenceStatus(
    schema.createSaveStatus("rejected", "current", null, [], [], false, false, {
      errorCode: "invalid-json",
      error: "broken",
    }),
    { recoveryAction: "start-fresh", notice: "error" },
  );

  recoveryUi.publishSavePersistenceStatus(rejected, actions);
  const firstNotice = document.getElementById("rush-save-recovery-notice");
  assert.ok(firstNotice);
  const freshButton = allElements(firstNotice).find((element) => element.textContent.includes("Start fresh"));
  assert.ok(freshButton);
  assert.equal(document.activeElement, freshButton);
  freshButton.click();
  assert.ok(freshButton.textContent.includes("Press again to confirm"));

  recoveryUi.publishSavePersistenceStatus(rejected, actions);
  assert.equal(document.getElementById("rush-save-recovery-notice"), firstNotice);
  freshButton.click();
  assert.equal(freshStarts, 1);

  const dismiss = allElements(firstNotice).find((element) => element.textContent.includes("Dismiss"));
  assert.ok(dismiss);
  dismiss.click();
  assert.equal(document.activeElement, previousFocus);
  recoveryUi.publishSavePersistenceStatus(rejected, actions);
  assert.equal(document.getElementById("rush-save-recovery-notice"), null);

  const healthy = recovery.createSavePersistenceStatus(schema.createSaveStatus("loaded", "current", 3));
  recoveryUi.publishSavePersistenceStatus(healthy, actions);
  assert.equal(document.activeElement, previousFocus);
  recoveryUi.publishSavePersistenceStatus(rejected, actions);
  const finalDialog = document.getElementById("rush-save-recovery-notice");
  assert.ok(finalDialog);
  assert.notEqual(document.activeElement, previousFocus);
  const finalDismiss = allElements(finalDialog).find((element) => element.textContent.includes("Dismiss"));
  assert.ok(finalDismiss);
  finalDismiss.click();
  assert.equal(document.activeElement, previousFocus);

  recoveryUi.publishSavePersistenceStatus(healthy, actions);
  const recovered = recovery.createSavePersistenceStatus(
    schema.createSaveStatus("loaded", "current", 3),
    { state: "recovered", backupAvailable: true, recovered: true, notice: "success" },
  );
  recoveryUi.publishSavePersistenceStatus(recovered, actions);
  const successNotice = document.getElementById("rush-save-recovery-notice");
  assert.ok(successNotice);
  assert.equal(successNotice.getAttribute("role"), "status");
  assert.equal(document.activeElement, previousFocus);

  recoveryUi.publishSavePersistenceStatus(rejected, actions);
  const replacementDialog = document.getElementById("rush-save-recovery-notice");
  assert.ok(replacementDialog);
  assert.equal(replacementDialog.getAttribute("role"), "alertdialog");
  assert.notEqual(document.activeElement, previousFocus);
  const replacementDismiss = allElements(replacementDialog).find((element) => element.textContent.includes("Dismiss"));
  assert.ok(replacementDismiss);
  replacementDismiss.click();
  assert.equal(document.activeElement, previousFocus);
  assert.equal(events.every((event) => event.type === recoveryUi.SAVE_STATUS_EVENT), true);
});

test("the committed RSH-022 recovery authority passes and RSH-023 remains absent", () => {
  const result = validateSaveRecovery();
  assert.deepEqual(result.errors, []);
  assert.equal(result.backupKeys, 4);
  assert.equal(result.quarantineSlots, 2);
  assert.equal(result.schemaVersion, 3);
});
