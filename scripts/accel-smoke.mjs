#!/usr/bin/env node
/**
 * Deterministic 0–100 lab: Ayalon, TCS/ABS/ESC off, 3 runs × 5 cars.
 *
 * Required CI gate: the measured mean must remain within the committed
 * behaviour baseline. The gameplay zeroTo100 claims are reported separately
 * and remain an explicit RSH-033 calibration gate; they are not silently
 * rewritten by CI.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { CARS } from "../src/game/cars.ts";
import { PHYSICS_VERSION } from "../src/game/physics.ts";
import { fromRoot } from "./project-root.mjs";

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";
const baselinePath = fromRoot("golden-baseline", "accel.json");
const artifactPath = fromRoot("artifacts", "accel.json");
const CLAIM_TOL = 0.15;

function finitePositive(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function validateBaseline(value) {
  if (!value || typeof value !== "object") throw new Error("qa:accel baseline is not an object");
  if (value.schemaVersion !== 2) throw new Error(`qa:accel baseline schema ${value.schemaVersion} != 2`);
  if (value.physicsVersion !== PHYSICS_VERSION) {
    throw new Error(
      `qa:accel baseline physicsVersion ${value.physicsVersion} != ${PHYSICS_VERSION}; `
        + "create an explicitly reviewed baseline rather than accepting drift",
    );
  }
  if (value.track !== "ayalon") throw new Error(`qa:accel baseline track ${value.track} != ayalon`);
  if (!finitePositive(value.regressionToleranceSeconds)) {
    throw new Error("qa:accel baseline regressionToleranceSeconds must be positive");
  }
  if (!Array.isArray(value.runs)) throw new Error("qa:accel baseline runs must be an array");

  const byCar = new Map();
  for (const entry of value.runs) {
    if (!entry || typeof entry.carId !== "string" || !finitePositive(entry.mean)) {
      throw new Error("qa:accel baseline contains an invalid car entry");
    }
    if (byCar.has(entry.carId)) throw new Error(`qa:accel baseline duplicates ${entry.carId}`);
    byCar.set(entry.carId, entry);
  }
  for (const car of CARS) {
    if (!byCar.has(car.id)) throw new Error(`qa:accel baseline is missing ${car.id}`);
  }
  if (byCar.size !== CARS.length) {
    throw new Error(`qa:accel baseline has ${byCar.size} cars; expected ${CARS.length}`);
  }
  return { value, byCar };
}

const baselineRaw = JSON.parse(await readFile(baselinePath, "utf8"));
const baseline = validateBaseline(baselineRaw);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(String(error).slice(0, 220)));

async function oneRun(carId) {
  return page.evaluate((id) => {
    const controls = window.__controlsTest;
    controls.resetStart();
    controls.skipCountdown();
    controls.setCarId(id);
    controls.setAssists({ abs: false, tcs: false, esc: false });
    controls.setNitro(0);
    controls.setDamage(0);
    controls.setSteer(0);
    controls.setThrottle(1);
    controls.setKeys(["KeyW"]);
    let firstMotionMs = null;
    let elapsedMs = 0;
    for (let index = 0; index < 480; index++) {
      controls.advanceTime(50);
      elapsedMs += 50;
      const speed = controls.getSpeed();
      if (controls.getDamage() > 0.04) return { t: null, v: speed, hit: true };
      if (firstMotionMs == null && speed > 0.5) firstMotionMs = elapsedMs;
      if (firstMotionMs != null && speed >= 27.778) {
        return { t: (elapsedMs - firstMotionMs) / 1000, v: speed, hit: false };
      }
    }
    return { t: null, v: controls.getSpeed(), hit: false };
  }, carId);
}

const runsOut = [];
const regressionFailures = [];
const claimGaps = [];
try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 25_000 });
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    [...document.querySelectorAll("button")].find((node) =>
      /בחר מסלול/.test(node.textContent || ""),
    )?.click(),
  );
  await page.waitForTimeout(350);
  await page.evaluate(() =>
    [...document.querySelectorAll("button")].find((node) =>
      /^הכל$/.test((node.textContent || "").trim()),
    )?.click(),
  );
  await page.waitForTimeout(250);
  const selected = await page.evaluate(() => {
    const node = [...document.querySelectorAll("button")].find((button) =>
      /נתיבי איילון/.test(button.textContent || ""),
    );
    node?.click();
    return Boolean(node);
  });
  if (!selected) throw new Error("qa:accel could not select Ayalon");
  await page.waitForFunction(() => Boolean(window.__controlsTest), { timeout: 35_000 });
  if (pageErrors.length) throw new Error("qa:accel boot errors\n" + pageErrors.join("\n"));

  for (const car of CARS) {
    const times = [];
    for (let run = 0; run < 3; run++) {
      const result = await oneRun(car.id);
      if (result.t == null || result.hit) {
        regressionFailures.push(
          `${car.id} run${run + 1} did not complete (v=${result.v?.toFixed?.(1)}, hit=${result.hit})`,
        );
        continue;
      }
      times.push(+result.t.toFixed(3));
    }

    const expected = baseline.byCar.get(car.id);
    if (times.length < 2) {
      runsOut.push({
        carId: car.id,
        times,
        mean: null,
        baselineMean: expected.mean,
        regressionToleranceSeconds: baseline.value.regressionToleranceSeconds,
        regressionOk: false,
        claim: car.zeroTo100,
        claimTolerance: CLAIM_TOL,
        claimOk: false,
      });
      continue;
    }

    const mean = times.reduce((sum, value) => sum + value, 0) / times.length;
    const roundedMean = +mean.toFixed(3);
    const regressionDelta = Math.abs(roundedMean - expected.mean);
    const regressionOk = regressionDelta <= baseline.value.regressionToleranceSeconds;
    if (!regressionOk) {
      regressionFailures.push(
        `${car.id} mean ${roundedMean.toFixed(2)}s differs from baseline `
          + `${expected.mean.toFixed(2)}s by ${regressionDelta.toFixed(2)}s `
          + `(allowed ${baseline.value.regressionToleranceSeconds.toFixed(2)}s)`,
      );
    }

    const claimLow = car.zeroTo100 * (1 - CLAIM_TOL);
    const claimHigh = car.zeroTo100 * (1 + CLAIM_TOL);
    const claimOk = roundedMean >= claimLow && roundedMean <= claimHigh;
    if (!claimOk) {
      claimGaps.push(
        `${car.id}: measured ${roundedMean.toFixed(2)}s, claim ${car.zeroTo100.toFixed(2)}s `
          + `(claim band ${claimLow.toFixed(2)}–${claimHigh.toFixed(2)}s)`,
      );
    }

    runsOut.push({
      carId: car.id,
      times,
      mean: roundedMean,
      baselineMean: expected.mean,
      regressionDeltaSeconds: +regressionDelta.toFixed(3),
      regressionToleranceSeconds: baseline.value.regressionToleranceSeconds,
      regressionOk,
      claim: car.zeroTo100,
      claimTolerance: CLAIM_TOL,
      claimOk,
      model: "extrusion",
    });
  }
} finally {
  await browser.close();
}

const report = {
  schemaVersion: 2,
  physicsVersion: PHYSICS_VERSION,
  track: "ayalon",
  gate: "current-behaviour regression",
  claimGate: "RSH-033",
  note:
    // RSH-033-OVERLAY-BEGIN:claim-note
    "CI fails on acceleration regression and on zeroTo100 claim gaps after RSH-033 calibration.",
    // RSH-033-OVERLAY-END:claim-note
  regressionOk: regressionFailures.length === 0,
  claimsOk: claimGaps.length === 0,
  claimGaps,
  runs: runsOut,
};
await mkdir(fromRoot("artifacts"), { recursive: true });
await writeFile(artifactPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));

if (process.env.UPDATE_ACCEL_BASELINE === "1") {
  if (process.env.CI === "true") {
    throw new Error("qa:accel refuses to update the committed baseline in CI");
  }
  const updated = {
    ...baseline.value,
    generatedFromPhysicsVersion: PHYSICS_VERSION,
    runs: runsOut.map((entry) => ({
      carId: entry.carId,
      mean: entry.mean,
      claim: entry.claim,
      claimOk: entry.claimOk,
    })),
  };
  await writeFile(baselinePath, JSON.stringify(updated, null, 2) + "\n");
  console.log("qa:accel baseline updated by explicit local request");
}

// RSH-033-OVERLAY-BEGIN:claim-fail
if (claimGaps.length) {
  throw new Error("qa:accel claim fail\n" + claimGaps.join("\n"));
}
// RSH-033-OVERLAY-END:claim-fail
if (regressionFailures.length) {
  throw new Error("qa:accel regression fail\n" + regressionFailures.join("\n"));
}
console.log("accel-smoke regression ok");
