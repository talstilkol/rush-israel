import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_AUDIO_DIGEST_SHA256,
  EXPECTED_HUD_DIGEST_SHA256,
  EXPECTED_INPUT_DIGEST_SHA256,
  canonicalAudioDigest,
  canonicalHudDigest,
  canonicalInputDigest,
  validateAudioHudInput,
} from "./check-audio-hud-input.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-034 audio/HUD/input lock passes and RSH-037 remains absent", () => {
  const result = validateAudioHudInput();
  assert.deepEqual(result.errors, []);
  assert.equal(result.backend, "oscillator");
  assert.equal(result.radioCount, 4);
  assert.equal(result.speedScale, 3.6);
});

test("RSH-037 precreation fails closed", () => {
  const result = validateAudioHudInput({
    repositoryFiles: ["RSH-037-PREFLIGHT.json", "src/game/ayalon-freeze/freeze.ts"],
  });
  assert.match(messages(result), /RSH-037 was precreated/);
});

test("live audio stays oscillators with locked HUD speed and input maps", () => {
  assert.equal(createHash("sha256").update(canonicalAudioDigest()).digest("hex"), EXPECTED_AUDIO_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalInputDigest()).digest("hex"), EXPECTED_INPUT_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalHudDigest()).digest("hex"), EXPECTED_HUD_DIGEST_SHA256);
  const audio = readFileSync(fromRoot("src", "game", "audio.ts"), "utf8");
  assert.match(audio, /export const AUDIO_BACKEND = "oscillator"/);
  assert.doesNotMatch(audio, /from ["']howler|new Howl|FMOD/);
  const input = readFileSync(fromRoot("src", "game", "input.ts"), "utf8");
  assert.match(input, /keys\.has\("KeyA"\) \|\| this\.keys\.has\("ArrowLeft"\)/);
  const hud = readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8");
  assert.match(hud, /Math\.round\(hud\.speedKmh\)/);
  const manifest = JSON.parse(readFileSync(fromRoot("AUDIO-HUD-INPUT-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.owner_freeze, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.fmod, false);
  assert.equal(manifest.lock.howler, false);
});
