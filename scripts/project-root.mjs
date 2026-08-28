import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function fromRoot(...segments) {
  return join(projectRoot, ...segments);
}

export function ensureProjectCwd() {
  if (process.cwd() !== projectRoot) process.chdir(projectRoot);
  return projectRoot;
}
