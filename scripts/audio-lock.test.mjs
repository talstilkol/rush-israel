import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

test("audio is oscillators, no FMOD/Howler", () => {
  const t = readFileSync(fromRoot("src", "game", "audio.ts"), "utf8");
  assert.match(t, /export const AUDIO_BACKEND = "oscillator"/);
  assert.match(t, /createOscillator/);
  assert.doesNotMatch(t, /from ["']howler|new Howl|FMOD/);
  const pkg = readFileSync(fromRoot("package.json"), "utf8");
  assert.doesNotMatch(pkg, /howler|fmod/);
});

test("career/garage/multiplayer stay until freeze", () => {
  assert.match(readFileSync(fromRoot("src", "game", "career.ts"), "utf8"), /KEEP_CAREER_MODULE/);
  assert.ok(readFileSync(fromRoot("src", "game", "garage.ts"), "utf8").length > 20);
  assert.ok(readFileSync(fromRoot("src", "lib", "multiplayer", "p2p.ts"), "utf8").length > 20);
});
