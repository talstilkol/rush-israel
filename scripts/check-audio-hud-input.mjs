#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "c578710d548c5262374893bbcfc4dced54202810238edece41e26cd0cff5e1f8";
export const EXPECTED_FEEL_SHA256 = "fea9f1a017261cb0c0649ed8c472825954bb236224e741a00ac51b71255abc1e";
export const EXPECTED_INDEX_SHA256 = "06a2113bb5a45027ab22f9a5563a217d477f0b3f0176a458786d7373cd536ba6";
export const EXPECTED_AUDIO_SHA256 = "bf83db8b5e0929dcd7d057172db6dedbaff1cad84405f152a3ef6ca884a3b650";
export const EXPECTED_INPUT_SHA256 = "51d638c0a004d080d2b558d34a58e4631e74606129d557eb1ffc835218c124aa";
export const EXPECTED_INPUT_CURVE_SHA256 = "01abad60b246cc76a389291685f65d1bb0039767af328434169743947aa2f04c";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_TOUCH_SHA256 = "3f89972a7cf2aa62a81d0bc82aec098a91b41eae5a9d25dd74038c14577868b8";
export const EXPECTED_CARS_SHA256 = "bbdf2b01bc8ae5a9169b2706fd522d34ec3584e17255fc284740c93942236542";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_CHECKER_TEST_SHA256 = "f1aa108474c18242a7bca758fcc946a36d71e782e7a77bc9e7d841d839496592";
export const EXPECTED_AUDIO_DIGEST_SHA256 = "b5a3a609d13ad78708f362bbff4caaf071454c884aa34bf874fbeff18f56ca3f";
export const EXPECTED_INPUT_DIGEST_SHA256 = "ee389f24969bad529a9e10df5b881f7efc773ecd845056b8aefcc8c52f149809";
export const EXPECTED_HUD_DIGEST_SHA256 = "a4516f8b7784d8270fbb8a766515e40ca9ffa70103fe81b63af3733ce05faecb";
export const RADIO = ["Pulse 101", "Yam FM", "Underground", "White Night"];
export const BPM = [126, 94, 138, 108];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "coverage", ".vercel", ".output", ".nitro", "dist"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const path = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path));
    else out.push(path);
  }
  return out;
}

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
      .sort();
  } catch {
    return walk(fromRoot());
  }
}

export function canonicalAudioDigest() {
  return [
    "backend=oscillator",
    "radio=4:Pulse 101,Yam FM,Underground,White Night",
    "bpm=126,94,138,108",
    "fmod=false",
    "howler=false",
    "streaming=false",
    "mute=esc_settings",
  ].join("\n") + "\n";
}

export function canonicalInputDigest() {
  return [
    "steer_left=KeyA,ArrowLeft:+1",
    "steer_right=KeyD,ArrowRight:-1",
    "throttle=KeyW,ArrowUp",
    "brake=KeyS,ArrowDown",
    "drift=Space,ShiftLeft,ShiftRight",
    "nitro=KeyE,KeyQ",
    "pause=Escape,KeyP",
    "rewind=KeyR",
    "pad_index=0",
    "pad_steer=axes[0] inverted padCurve",
    "pad_curve=dead 0.12 exp 1.6",
    "pad_throttle=axes[1]<-0.12 or buttons[7]",
    "pad_brake=buttons[6]",
    "pad_drift=buttons[4]|buttons[5]",
    "pad_nitro=buttons[0]|buttons[1]",
    "pad_rewind=buttons[2]",
    "ffb=false",
    "touch_visible=md:hidden",
    "touch_pad=steer_throttle_brake",
    "touch_buttons=rewind,brake,drift,nitro,gas",
  ].join("\n") + "\n";
}

export function canonicalHudDigest() {
  return [
    "speed_unit=km/h",
    "speed_scale=3.6",
    "speed_display=Math.round(hud.speedKmh)",
    "qa=qa=1 backend p95 dc tri g t kin",
    "photo=true",
    "wrong_way=true",
    "rewind_banner=true",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readAudioHudInputInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AUDIO-HUD-INPUT-MANIFEST.json"), "utf8"),
    feelSource: readFileSync(fromRoot("src", "game", "ayalon-feel", "feel.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-feel", "index.ts"), "utf8"),
    audioSource: readFileSync(fromRoot("src", "game", "audio.ts"), "utf8"),
    inputSource: readFileSync(fromRoot("src", "game", "input.ts"), "utf8"),
    inputCurveSource: readFileSync(fromRoot("src", "game", "input-curve.ts"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    touchSource: readFileSync(fromRoot("src", "components", "touch-controls.tsx"), "utf8"),
    carsSource: readFileSync(fromRoot("src", "game", "cars.ts"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-audio-hud-input.test.mjs"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAudioHudInput(overrides = {}) {
  const input = { ...readAudioHudInputInputs(), ...overrides };
  const errors = [];
  let manifest, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-034 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) {
    errors.push("audio-hud-input manifest differs from the reviewed RSH-034 authority");
  }

  const identities = {
    feel_source_sha256: [input.feelSource, EXPECTED_FEEL_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    audio_source_sha256: [input.audioSource, EXPECTED_AUDIO_SHA256],
    input_source_sha256: [input.inputSource, EXPECTED_INPUT_SHA256],
    input_curve_source_sha256: [input.inputCurveSource, EXPECTED_INPUT_CURVE_SHA256],
    hud_source_sha256: [input.hudSource, EXPECTED_HUD_SHA256],
    touch_source_sha256: [input.touchSource, EXPECTED_TOUCH_SHA256],
    cars_source_sha256: [input.carsSource, EXPECTED_CARS_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (sha256(canonicalAudioDigest()) !== EXPECTED_AUDIO_DIGEST_SHA256 || manifest.identities?.audio_digest_sha256 !== EXPECTED_AUDIO_DIGEST_SHA256) {
    errors.push("audio digest identity changed");
  }
  if (sha256(canonicalInputDigest()) !== EXPECTED_INPUT_DIGEST_SHA256 || manifest.identities?.input_digest_sha256 !== EXPECTED_INPUT_DIGEST_SHA256) {
    errors.push("input digest identity changed");
  }
  if (sha256(canonicalHudDigest()) !== EXPECTED_HUD_DIGEST_SHA256 || manifest.identities?.hud_digest_sha256 !== EXPECTED_HUD_DIGEST_SHA256) {
    errors.push("hud digest identity changed");
  }

  if (manifest.unit !== "RSH-034") errors.push("RSH-034 unit identity changed");
  if (manifest.lock?.backend !== "oscillator") errors.push("audio backend is not oscillator");
  if (manifest.lock?.radio_count !== 4 || JSON.stringify(manifest.lock?.radio) !== JSON.stringify(RADIO)) errors.push("radio table changed");
  if (JSON.stringify(manifest.lock?.bpm) !== JSON.stringify(BPM)) errors.push("radio BPM table changed");
  if (manifest.lock?.fmod !== false || manifest.lock?.howler !== false || manifest.lock?.streaming_music !== false) {
    errors.push("FMOD, Howler or streamed music is forbidden");
  }
  if (manifest.lock?.mute !== "esc_settings") errors.push("mute path changed");
  if (manifest.lock?.hud_speed_scale !== 3.6 || manifest.lock?.hud_speed_unit !== "km/h") errors.push("HUD speed identity changed");
  if (manifest.lock?.ffb !== false) errors.push("force-feedback is forbidden");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) {
    errors.push("RSH-034 must not claim GIS accuracy, owner freeze or public distribution");
  }
  if (manifest.lock?.cars_rewritten !== false || manifest.lock?.package_json_changed !== false || manifest.lock?.physics_rewritten !== false) {
    errors.push("cars.ts, package.json or physics.ts rewrite is forbidden");
  }

  if (!/export const AUDIO_BACKEND = "oscillator"/.test(input.audioSource)) errors.push("AUDIO_BACKEND is not oscillator");
  if (/from ["']howler|new Howl|FMOD/.test(input.audioSource)) errors.push("audio.ts imported FMOD or Howler");
  if (/howler|fmod/i.test(input.packageSource)) errors.push("package.json gained Howler or FMOD");
  if (!/he: "פאלס 101"/.test(input.audioSource) || !/en: "White Night"/.test(input.audioSource)) errors.push("radio station table changed");
  if (!/bpm: 126/.test(input.audioSource) || !/bpm: 108/.test(input.audioSource)) errors.push("radio BPM table changed");

  if (!/keys\.has\("KeyA"\) \|\| this\.keys\.has\("ArrowLeft"\)/.test(input.inputSource)) errors.push("keyboard steer-left map changed");
  if (!/keys\.has\("KeyD"\) \|\| this\.keys\.has\("ArrowRight"\)/.test(input.inputSource)) errors.push("keyboard steer-right map changed");
  if (!/steer \+= 1/.test(input.inputSource) || !/steer -= 1/.test(input.inputSource)) errors.push("keyboard steer signs changed");
  if (!/KeyW"\) \|\| this\.keys\.has\("ArrowUp"\)/.test(input.inputSource)) errors.push("keyboard throttle map changed");
  if (!/KeyS"\) \|\| this\.keys\.has\("ArrowDown"\)/.test(input.inputSource)) errors.push("keyboard brake map changed");
  if (!/keys\.has\("Space"\)/.test(input.inputSource) || !/ShiftLeft/.test(input.inputSource)) errors.push("keyboard drift map changed");
  if (!/keys\.has\("KeyE"\)/.test(input.inputSource) || !/KeyQ/.test(input.inputSource)) errors.push("keyboard nitro map changed");
  if (!/wantsPause\(\)/.test(input.inputSource) || !/Escape/.test(input.inputSource)) errors.push("pause map changed");
  if (!/wantsRewind\(\)/.test(input.inputSource) || !/KeyR/.test(input.inputSource)) errors.push("rewind map changed");
  if (!/padCurve\(gp\.axes\[0\]/.test(input.inputSource)) errors.push("gamepad steer axis changed");
  if (!/buttons\[7\]/.test(input.inputSource) || !/buttons\[6\]/.test(input.inputSource)) errors.push("gamepad trigger map changed");
  if (!/export function padCurve\(x: number, dead = 0\.12, exp = 1\.6\)/.test(input.inputCurveSource)) errors.push("padCurve identity changed");

  if (!/Math\.round\(hud\.speedKmh\)/.test(input.hudSource)) errors.push("HUD speed display changed");
  if (!/langHe \? "קמ״ש" : "km\/h"/.test(input.hudSource)) errors.push("HUD speed unit changed");
  if (!/\(\?:\^\|\[\?&\]\)qa=1\(\?:&\|\$\)/.test(input.hudSource) && !/qa=1/.test(input.hudSource)) errors.push("HUD QA overlay changed");
  if (!/WRONG WAY/.test(input.hudSource) || !/REWIND/.test(input.hudSource)) errors.push("HUD wrong-way or rewind banner changed");
  if (!/md:hidden/.test(input.touchSource)) errors.push("touch control visibility changed");
  if (!/rewind: true/.test(input.touchSource) || !/nitro: true/.test(input.touchSource)) errors.push("touch button map changed");
  if (!/speedKmh: Math\.abs\(this\.player\.speed\) \* 3\.6/.test(readFileSync(fromRoot("src", "game", "engine", "rendering-adapter.ts"), "utf8"))) {
    errors.push("HUD speed scale is not speed * 3.6");
  }

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) {
    errors.push("asset/distribution/release boundary changed");
  }
  if (manifest.preservation?.audio_source_changes !== 0 || manifest.preservation?.input_source_changes !== 0 || manifest.preservation?.hud_source_changes !== 0) {
    errors.push("RSH-034 preservation counts changed");
  }

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-035 was precreated: ${later.join(", ")}`);
  if (
    manifest.deferred_boundary?.queue_head !== "RSH-035"
    || manifest.deferred_boundary?.rsh_035_authorized !== false
    || manifest.deferred_boundary?.rsh_035_started !== false
  ) {
    errors.push("RSH-035 deferred boundary changed");
  }

  return {
    errors,
    backend: manifest.lock?.backend,
    radioCount: manifest.lock?.radio_count,
    speedScale: manifest.lock?.hud_speed_scale,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAudioHudInput();
  if (result.errors.length) {
    console.error(`audio-hud-input fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`audio-hud-input ok: backend ${result.backend}; radio ${result.radioCount}; speed ${result.speedScale}; RSH-035 deferred`);
}
