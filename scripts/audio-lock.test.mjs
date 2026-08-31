import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

test("audio is oscillators, no FMOD/Howler", () => {
  const source = readFileSync(fromRoot("src", "game", "audio.ts"), "utf8");
  assert.match(source, /export const AUDIO_BACKEND = "oscillator"/);
  assert.match(source, /createOscillator/);
  assert.doesNotMatch(source, /from ["']howler|new Howl|FMOD/);
  assert.doesNotMatch(readFileSync(fromRoot("package.json"), "utf8"), /howler|fmod/);
});

test("career and garage remain while unused multiplayer is removed by RSH-020", () => {
  assert.match(readFileSync(fromRoot("src", "game", "career.ts"), "utf8"), /KEEP_CAREER_MODULE/);
  assert.ok(readFileSync(fromRoot("src", "game", "garage.ts"), "utf8").length > 20);
  assert.equal(existsSync(fromRoot("src", "lib", "multiplayer")), false);
});
