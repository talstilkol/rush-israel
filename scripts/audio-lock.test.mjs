import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("audio is oscillators, no FMOD/Howler", () => {
  const t = readFileSync("/workspace/src/game/audio.ts", "utf8");
  assert.match(t, /export const AUDIO_BACKEND = "oscillator"/);
  assert.match(t, /createOscillator/);
  assert.doesNotMatch(t, /from ["']howler|new Howl|FMOD/);
  const pkg = readFileSync("/workspace/package.json", "utf8");
  assert.doesNotMatch(pkg, /howler|fmod/);
});

test("career/garage/multiplayer stay until freeze", () => {
  assert.match(readFileSync("/workspace/src/game/career.ts", "utf8"), /KEEP_CAREER_MODULE/);
  assert.ok(readFileSync("/workspace/src/game/garage.ts", "utf8").length > 20);
  assert.ok(readFileSync("/workspace/src/lib/multiplayer/p2p.ts", "utf8").length > 20);
});
