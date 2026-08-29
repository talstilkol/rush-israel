import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function renameKey(object, from, to) {
  if (!object || typeof object !== "object" || !(from in object)) return;
  object[to] = object[from];
  delete object[from];
}

const state = readJson("CURRENT-STATE.json");
renameKey(state.validation, "RSH_014_precreated", "RSH-014_precreated");
renameKey(state.validation, "RSH_015_authorized", "RSH-015_authorized");
writeJson("CURRENT-STATE.json", state);

const queue = readJson("QUEUE.json");
renameKey(queue.next_instruction_contract, "RSH_014_precreated", "RSH-014_precreated");
renameKey(queue.next_instruction_contract, "RSH_015_authorized", "RSH-015_authorized");
writeJson("QUEUE.json", queue);

const baseline = readJson("BASELINE-REGISTER.json");
renameKey(baseline.post_merge_queue, "RSH_015_authorized", "RSH-015_authorized");
writeJson("BASELINE-REGISTER.json", baseline);

let tests = readFileSync("scripts/program-control.test.mjs", "utf8");
tests = tests.replaceAll('["RSH_014_precreated"]', '["RSH-014_precreated"]');
tests = tests.replaceAll('["RSH_015_authorized"]', '["RSH-015_authorized"]');
writeFileSync("scripts/program-control.test.mjs", tests);

for (const path of [
  "scripts/fix-rsh-013-control-keys.mjs",
  ".github/workflows/rsh-013-control-keys.yml",
]) {
  if (existsSync(path)) unlinkSync(path);
}

console.log("RSH-013 control keys normalized");
