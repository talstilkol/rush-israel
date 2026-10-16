import { contactProjection, vehicleContact, type VehicleContactBounds } from "./vehicle-contact";
import { clamp, expSmooth, wrapPi, forwardDelta } from "./math";
import {
  absModulate,
  brakeForce,
  DEFAULT_ASSISTS,
  escYaw,
  HANDLING,
  hydroplane,
  launchAccel,
  pacejka,
  SURFACE_SPEC,
  tcsModulate,
  V100_MPS,
  WEATHER_SPEC,
  type AssistFlags,
  type HandlingMode,
} from "./physics";
import { nearestIndex, sampleAtT, type BuiltTrack } from "./spline";
import { roadLaneOffset } from "./road-layout";
import { nearestStreet, type StreetRibbon } from "./streets";
import type { CarDef, Collider, InputState, Ramp, Weather } from "./types";

type CarTransientState = Pick<ArcadeCar,
  "drifting" | "nitroPulse" | "impact" | "lastHit" | "onTrack" | "sideStreet" | "sideStreetEn" | "drafting" | "surfaceGrip" | "slip" | "rpm" | "kinMix" | "surfaceKind" | "dirt" | "airborne" | "airMs" | "rideCompress" | "wasCurb" | "comboMul" | "wheelsLocked" | "driftAngle" | "reverseHold" | "absActive" | "tcsActive" | "escActive" | "slipRatio" | "wallDmgT"
> & { nitroHeld: boolean; holdSteer: number };

export type CarSnap = {
  visualInput?: Pick<InputState, "steer" | "brake">;
  transient?: CarTransientState;
  x: number;
  y: number;
  z: number;
  yaw: number;
  vx: number;
  vz: number;
  vy?: number;
  speed: number;
  progress: number;
  sampleIndex: number;
  lap: number;
  lastCheckpoint: number;
  nextCheckpoint: number;
  nitro: number;
  driftCharge: number;
  driftScore: number;
  damage: number;
  pitch: number;
  boostT: number;
  finished: boolean;
  eliminated: boolean;
  offTrackT: number;
  wrongWayT: number;
  roll: number;
  gear: number;
  yawRate: number;
};

function probeRamp(x: number, z: number, ramps: Ramp[], yHint = 0) {
  const maxStep = 1.2;
  let best: { r: Ramp; y: number; dyds: number; score: number } | null = null;
  for (const r of ramps) {
    const dx = x - r.x;
    const dz = z - r.z;
    const along = dx * r.sx + dz * r.sz;
    const across = dx * r.sz - dz * r.sx;
    if (Math.abs(along) <= r.len * 0.5 && Math.abs(across) <= r.half) {
      const t = clamp(along / r.len + 0.5, 0, 1);
      const y = r.y0 + (r.y1 - r.y0) * t;
      // An overhead deck is not the ground for a car passing underneath.
      // Apply the existing entry-height tolerance to every candidate.
      if (y > yHint + maxStep) continue;
      const dyds = (r.y1 - r.y0) / r.len;
      const score = Math.abs(y - yHint);
      if (!best || score + 0.04 < best.score || (score <= best.score + 0.04 && y > best.y && y <= yHint + maxStep)) {
        best = { r, y, dyds, score };
      }
    }
  }
  return best;
}

export class ArcadeCar {
  contactBounds?: VehicleContactBounds;
  visualSteer = 0;
  visualBrake = 0;
  x = 0;
  y = 0;
  z = 0;
  yaw = 0;
  vx = 0;
  vz = 0;
  vy = 0;
  speed = 0;
  drifting = false;
  driftCharge = 0;
  driftScore = 0;
  boostT = 0;
  nitro = 0.35;
  nitroPulse = false;
  pitch = 0;
  impact = 0;
  lastHit: "building" | "barrier" | "car" | "" = "";
  onTrack = true;
  sideStreet = "";
  sideStreetEn = "";
  progress = 0;
  sampleIndex = 0;
  lastCheckpoint = 0;
  nextCheckpoint = 1;
  lap = 0;
  wrongWayT = 0;
  offTrackT = 0;
  roam = false;
  finished = false;
  eliminated = false;
  isAi = false;
  isTraffic = false;
  isCop = false;
  aiSkill = 1;
  aiOffset = 0;
  weatherGrip = 1;
  damage = 0;
  wallDmgT = 0;
  drafting = false;
  roll = 0;
  surfaceGrip = 1;
  slip = 0;
  gear = 1;
  rpm = 0;
  yawRate = 0;
  kinMix = 0;
  surfaceKind: "asphalt" | "curb" | "sand" = "asphalt";
  baseGrip = 1;
  dirt = 0;
  airborne = false;
  airMs = 0;
  rideCompress = 0;
  wasCurb = false;
  comboMul = 1;
  wheelsLocked = false;
  driftAngle = 0;
  reverseHold = 0;
  handling: HandlingMode = "simcade";
  assists: AssistFlags = { ...DEFAULT_ASSISTS };
  weather: Weather = "clear";
  absActive = false;
  tcsActive = false;
  escActive = false;
  slipRatio = 0;
  stats: CarDef;
  name: string;
  private nitroHeld = false;
  private holdSteer = 0;

  constructor(stats: CarDef, name: string) {
    this.stats = stats;
    this.name = name;
  }

  spawn(track: BuiltTrack, t: number, lateral: number) {
    this.visualSteer = this.visualBrake = 0;
    const s = sampleAtT(track.samples, t);
    this.x = s.x + s.rx * lateral;
    this.z = s.z + s.rz * lateral;
    this.y = s.y;
    this.yaw = Math.atan2(-s.tx, -s.tz);
    this.vx = 0;
    this.vz = 0;
    this.vy = 0;
    this.speed = 0;
    this.progress = t;
    // sampleAtT already selected the supporting sample. Re-quantizing its
    // floating-point t can move the grade lookup one sample behind the car.
    // Spawn/recovery are infrequent; identity lookup preserves the exact choice.
    this.sampleIndex = track.samples.indexOf(s);
    this.nextCheckpoint = track.closed ? 1 : 0;
    this.lastCheckpoint = track.closed ? 0 : -1;
    this.lap = 0;
    this.boostT = 0;
    this.driftCharge = 0;
    this.driftScore = 0;
    this.nitro = this.isTraffic ? 0 : (this.stats.nitroStart ?? 0.35);
    this.pitch = 0;
    this.roll = 0;
    this.gear = 1;
    this.rpm = 0;
    this.yawRate = 0;
    this.impact = 0;
    if (this.isAi) this.damage = 0;
    this.wallDmgT = 0;
    this.dirt = 0;
    this.finished = false;
    this.eliminated = false;
    this.wrongWayT = 0;
    this.airborne = false;
    this.airMs = 0;
    this.rideCompress = 0;
    this.wasCurb = false;
    this.offTrackT = 0;
    this.drifting = this.nitroPulse = this.nitroHeld = false;
    this.holdSteer = this.reverseHold = this.driftAngle = 0;
    this.lastHit = "";
    this.onTrack = true;
    this.sideStreet = this.sideStreetEn = "";
    this.drafting = this.wheelsLocked = false;
    this.absActive = this.tcsActive = this.escActive = false;
    this.surfaceGrip = this.comboMul = 1;
    this.slip = this.slipRatio = this.kinMix = 0;
    this.surfaceKind = "asphalt";
  }

  /** Returns true only when this tick automatically rescues the car. */
  step(dt: number, input: InputState, track: BuiltTrack, racing: boolean, colliders: Collider[] = [], streets: StreetRibbon[] = [], ramps: Ramp[] = []): boolean {
    // Presentation follows the last simulated control, including replay frames.
    const active = racing && !this.finished && !this.eliminated;
    this.visualSteer = active ? input.steer : 0;
    this.visualBrake = active ? input.brake : 0;
    this.impact = 0;
    this.lastHit = "";
    this.nitroPulse = false;
    this.wallDmgT = Math.max(0, this.wallDmgT - dt);
    if (this.finished || this.eliminated) {
      this.speed *= Math.exp(-2.2 * dt);
      this.integrateMotion(dt, track, 0, colliders, streets, ramps);
      this.pitch = expSmooth(this.pitch, 0, 8, dt);
      return false;
    }

    const stats = this.stats;
    const profile = HANDLING[this.handling];
    const wx = WEATHER_SPEC[this.weather] ?? WEATHER_SPEC.clear;
    const boosting = this.boostT > 0;
    const hurt = 1 - this.damage * 0.28;
    const maxSpeed = stats.maxSpeed * (boosting ? 1.18 : 1) * (this.isAi && !this.isCop ? this.aiSkill : 1) * hurt;
    const ev = stats.body === "ev";
    const n = Math.abs(this.speed) / Math.max(8, maxSpeed);
    if (!ev) {
      const tops = [0.2, 0.38, 0.56, 0.76, 1.08];
      let g = this.gear;
      if (n > tops[g - 1] + 0.02) g = Math.min(5, g + 1);
      if (g > 1 && n < tops[g - 2] - 0.04) g = g - 1;
      // RSH-033-OVERLAY-BEGIN:gear-dump
      if (g !== this.gear && racing && Math.abs(this.speed) > V100_MPS) this.speed *= 0.94;
      // RSH-033-OVERLAY-END:gear-dump
      this.gear = g;
      const lo = g === 1 ? 0 : tops[g - 2];
      const hi = tops[g - 1];
      this.rpm = clamp((n - lo) / Math.max(0.06, hi - lo), 0, 1);
    } else {
      this.gear = 1;
      this.rpm = clamp(n, 0, 1);
    }
    const mass = Math.max(0.7, stats.mass || 1);
    const torque = ev ? 1.06 - n * 0.2 : [1.22, 1.08, 0.98, 0.88, 0.8][this.gear - 1] ?? 1;
    const downforce = 1 + clamp(n, 0, 1) * (stats.body === "super" ? 0.24 : stats.body === "rally" ? 0.07 : 0.1);

    this.wheelsLocked = false;
    this.absActive = false;
    this.tcsActive = false;
    this.escActive = false;
    const v = this.speed;
    const vAbs = Math.abs(v);
    const aero = stats.drag * 0.00155 * vAbs * vAbs;
    const surf = SURFACE_SPEC[this.surfaceKind] ?? SURFACE_SPEC.asphalt;
    const rolling = vAbs > 0.2 ? (1.15 + (this.onTrack ? 0 : stats.body === "rally" ? 1.15 : 3.4)) * surf.roll * wx.roll : 0;
    const driveCurve = Math.max(0.02, 1 - clamp(vAbs / Math.max(8, maxSpeed), 0, 1) ** 2.1);
    const fx = -Math.sin(this.yaw);
    const fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw);
    const rz = -Math.sin(this.yaw);
    const longVel = this.vx * fx + this.vz * fz;
    const wheelOmega = this.speed;
    this.slipRatio = (wheelOmega - longVel) / Math.max(4.2, Math.abs(longVel));

    let throttle = input.throttle;
    let brakeIn = input.brake;
    const tcs = tcsModulate(throttle, this.slipRatio, this.assists.tcs && racing);
    throttle = tcs.throttle;
    this.tcsActive = tcs.active;
    const abs = absModulate(brakeIn, this.slipRatio, this.assists.abs && racing);
    brakeIn = abs.brake;
    this.absActive = abs.active;

    if (racing) {
      if (throttle > 0 && brakeIn <= 0.1) {
        // RSH-033-OVERLAY-BEGIN:launch-law
        const dragAccel = aero / mass + rolling;
        const aLaunch = launchAccel(stats.zeroTo100 ?? 8, dragAccel, vAbs);
        const pull = throttle * aLaunch * mass * wx.long * surf.long * (boosting ? 1.08 : 1) * (this.drafting ? 1.05 : 1);
        const top = vAbs <= V100_MPS ? 1 : Math.max(0.02, driveCurve);
        this.speed += (pull / mass) * top * dt;
        // RSH-033-OVERLAY-END:launch-law
      }
      if (brakeIn > 0) {
        const speedAbs0 = Math.abs(this.speed);
        this.wheelsLocked = !this.assists.abs && brakeIn > 0.92 && speedAbs0 > 18;
        const force = brakeForce(brakeIn, stats.brake, this.pitch) * wx.long * surf.long;
        if (this.speed > 0.5) {
          this.speed -= force * dt;
          this.reverseHold = 0;
        } else {
          this.reverseHold += dt;
          if (this.reverseHold >= 0.25) this.speed -= brakeIn * stats.accel * 0.28 * dt;
          else this.speed = Math.max(0, this.speed - force * dt);
        }
      } else {
        this.reverseHold = 0;
      }
      const drag = (aero / mass + rolling) * dt;
      const engineBrake = throttle <= 0.05 && brakeIn <= 0 && vAbs > 3 ? (ev ? 0.9 : 2.2 + this.gear * 0.4) * dt : 0;
      const lose = drag + engineBrake;
      if (Math.abs(this.speed) <= lose) {
        if (throttle <= 0 && brakeIn <= 0) this.speed = 0;
      } else {
        this.speed -= Math.sign(this.speed) * lose;
      }
    } else {
      this.speed *= Math.exp(-2.4 * dt);
    }

    const firing = racing && !this.isTraffic && input.nitro && this.nitro > 0.02;
    if (firing) {
      this.nitro = Math.max(0, this.nitro - dt * (stats.nitroDrain ?? 0.42));
      this.boostT = Math.max(this.boostT, 0.14);
      this.speed += stats.accel * 0.55 * profile.nitroMul * dt;
      if (!this.nitroHeld) this.nitroPulse = true;
    }
    this.nitroHeld = firing;

    if (boosting) {
      this.speed += stats.accel * 0.28 * profile.nitroMul * dt;
      this.boostT -= dt;
    }
    this.speed = clamp(this.speed, -maxSpeed * 0.32, maxSpeed * (firing ? 1.08 : 1));
    const sG = track.samples[this.sampleIndex];
    const nG = track.samples[Math.min(this.sampleIndex + 1, track.samples.length - 1)];
    const gds = Math.hypot(nG.x - sG.x, nG.z - sG.z) || 1;
    const rp = probeRamp(this.x, this.z, ramps, this.y);
    // speed is signed in the car's forward direction. Project the supporting
    // surface gradient into that same frame, even while stopped or reversing.
    const grade = rp
      ? rp.dyds * (fx * rp.r.sx + fz * rp.r.sz)
      : ((nG.y - sG.y) / gds) * (fx * sG.tx + fz * sG.tz);
    if (racing) {
      this.speed += -grade * 16.2 * dt;
      // Preserve the existing uphill resistance, opposing actual uphill travel
      // in either gear rather than accelerating a downhill reverse roll.
      if (grade * Math.sign(this.speed) > 0.04) this.speed -= grade * 7.4 * dt;
    }

    const speedAbs = Math.abs(this.speed);
    const loadTgt = racing ? brakeIn * 0.72 - throttle * 0.48 : 0;
    const terrainPitch = clamp(-grade * 3.4, -0.75, 0.75);
    this.pitch = expSmooth(this.pitch, loadTgt + terrainPitch, 9, dt);
    const rollTgt = racing ? -input.steer * clamp(speedAbs / 24, 0, 1) * 0.34 : 0;
    this.roll = expSmooth(this.roll, rollTgt, 7, dt);
    const front = clamp(0.5 + this.pitch * 0.42, 0.32, 0.7);

    const reverse = this.speed >= 0 ? 1 : -1;
    const wantDrift = racing && input.drift && speedAbs > 9 && Math.abs(input.steer) > 0.18;

    let grip = this.onTrack ? stats.grip : stats.grip * (stats.body === "rally" ? 0.78 : 0.4);
    grip *= this.weatherGrip * this.surfaceGrip * downforce * profile.gripMul * wx.lat * surf.lat;
    grip *= 1 - this.damage * 0.22;
    grip *= 0.84 + front * 0.28;
    grip *= 1 - this.rideCompress * 1.6;
    grip *= 1 / (1 + (speedAbs / 32) ** 2);
    grip *= hydroplane(speedAbs, wx.hydro);
    if (this.wheelsLocked) grip *= 0.42;
    if (wantDrift) grip = Math.min(grip, 0.22 + (1 - front) * 0.12);

    this.stepWheels(dt, input.steer, grip, speedAbs, fx, fz, rx, rz, racing, reverse, wantDrift, front, mass);
    this.holdSteer = wantDrift ? 1 : input.steer;

    this.integrateMotion(dt, track, grip, colliders, streets, ramps);

    if (wantDrift) {
      this.drifting = true;
      this.driftCharge = Math.min(this.driftCharge + dt * 0.9, 2.1);
      this.nitro = Math.min(1, this.nitro + dt * 0.2);
      this.driftAngle = Math.asin(clamp(this.slip, 0, 1)) * 57.3;
      if (!this.isAi) {
        const a = this.driftAngle;
        const zone = a < 12 ? 0 : a > 52 ? 0.55 : a > 18 && a < 42 ? 1.42 : 1;
        this.driftScore += speedAbs * (0.55 + this.driftCharge) * dt * 14 * zone * this.comboMul;
      }
    } else {
      if (this.drifting && this.driftCharge > 0.55 && racing) {
        this.boostT = Math.min(0.4 + this.driftCharge * 0.55 * profile.driftBoost, 1.55);
        this.nitro = Math.min(1, this.nitro + this.driftCharge * 0.16);
        if (!this.isAi && this.comboMul > 1.2) this.driftScore += 70 * this.comboMul;
      }
      this.drifting = false;
      this.driftCharge = Math.max(0, this.driftCharge - dt * 1.7);
      this.driftAngle = Math.max(0, this.driftAngle - dt * 40);
      if (!firing && !this.isTraffic) this.nitro = Math.min(1, this.nitro + dt * 0.012);
    }

    if (!this.onTrack) this.offTrackT += dt;
    else this.offTrackT = 0;
    if (this.isAi && !this.isTraffic && !this.isCop && racing && (Math.abs(this.speed) < 6 || this.offTrackT > 0.45)) {
      const aheadT = track.closed ? (this.progress + 0.02) % 1 : Math.min(0.995, this.progress + 0.02);
      const ahead = sampleAtT(track.samples, aheadT);
      const want = Math.atan2(-(ahead.x - this.x), -(ahead.z - this.z));
      const err = wrapPi(want - this.yaw);
      this.yaw = wrapPi(this.yaw + clamp(err, -1, 1) * 3.2 * dt);
      if (this.speed < 4) this.speed += 8 * dt;
    }
    if (!this.isTraffic && !this.isCop) {
      if (!this.onTrack || this.surfaceKind === "sand") this.dirt += dt * 0.075;
      else if (this.surfaceKind === "curb") this.dirt += dt * 0.028;
      if (this.drifting) this.dirt += dt * 0.045;
      if (this.weatherGrip < 0.95 && this.onTrack) this.dirt -= dt * 0.11;
      this.dirt = clamp(this.dirt, 0, 1);
    }
    if (!(this.isAi && !this.isTraffic && !this.isCop) && this.offTrackT > 3.2) {
      this.respawn(track);
      return true;
    }
    return false;
  }

  private stepWheels(
    dt: number,
    steerIn: number,
    grip: number,
    speedAbs: number,
    fx: number,
    fz: number,
    rx: number,
    rz: number,
    racing: boolean,
    reverse: number,
    wantDrift: boolean,
    front: number,
    mass: number,
  ) {
    const wb = 2.55;
    const ht = 0.76;
    const iz = mass * 2.85;
    const steerMul = clamp((this.stats.turnRate || 1.85) / 1.85, 0.7, 1.45);
    const maxSteer = 0.5 * steerMul * (1 - 0.4 * clamp(speedAbs / 36, 0, 1));
    const steer = (racing ? steerIn : 0) * maxSteer * reverse;
    const longs = [wb * 0.5, wb * 0.5, -wb * 0.5, -wb * 0.5];
    const lats = [-ht, ht, -ht, ht];
    const steers = [steer, steer, 0, 0];
    const loads = [front * 0.5, front * 0.5, (1 - front) * 0.5, (1 - front) * 0.5];
    let yawT = 0;
    for (let i = 0; i < 4; i++) {
      const heading = this.yaw + steers[i];
      const wrx = Math.cos(heading);
      const wrz = -Math.sin(heading);
      const ox = fx * longs[i] + rx * lats[i];
      const oz = fz * longs[i] + rz * lats[i];
      const wvx = this.vx - this.yawRate * oz;
      const wvz = this.vz + this.yawRate * ox;
      const wfx = -Math.sin(heading);
      const wfz = -Math.cos(heading);
      const vLong = wvx * wfx + wvz * wfz;
      const vLat = wvx * wrx + wvz * wrz;
      const sa = Math.atan2(vLat, Math.max(2.2, Math.abs(vLong)));
      const Fy = -pacejka(sa, Math.max(0.08, grip * loads[i] * 4));
      // Cross product around +Y: r.z * F.x - r.x * F.z.
      yawT += oz * wrx * Fy - ox * wrz * Fy;
    }
    const speedFactor = clamp(speedAbs / 7.5, 0, 1) * (1 - 0.4 * clamp(speedAbs / 38, 0, 1));
    const crawl = 1 - clamp((speedAbs - 4) / 6, 0, 1);
    this.kinMix = crawl;
    const kin = steerIn * 1.7 * steerMul * clamp(speedAbs / 6.5, 0, 1) * reverse * (wantDrift ? 1.28 : 1) * (0.92 + front * 0.16);
    const tire = (yawT / iz) * 80;
    // Below ~10 m/s Pacejka is too weak to turn; crawl keeps kinematic yaw.
    // At speed the tire term saturates and flips, so the wheel has to keep a share.
    const kinYaw = kin * Math.max(crawl, 0.85);
    const tireYaw = clamp(tire, -1.1, 1.1);
    this.yawRate = clamp(kinYaw + tireYaw * 0.35, -2.4, 2.4);
    const latNow = this.vx * rx + this.vz * rz;
    const slipAng = Math.atan2(latNow, Math.max(2.4, speedAbs));
    const esc = escYaw(slipAng, this.yawRate, this.assists.esc && racing, wantDrift);
    this.escActive = esc.active;
    this.yawRate += esc.yaw * 1.55 * speedFactor;
    this.yawRate = clamp(this.yawRate, -3.2, 3.2);
    this.yaw = wrapPi(this.yaw + this.yawRate * dt);
    this.vx = fx * this.speed + rx * latNow;
    this.vz = fz * this.speed + rz * latNow;
  }

  private integrateMotion(dt: number, track: BuiltTrack, grip: number, colliders: Collider[] = [], streets: StreetRibbon[] = [], ramps: Ramp[] = []) {
    const fx = -Math.sin(this.yaw);
    const fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw);
    const rz = -Math.sin(this.yaw);
    let lat = this.vx * rx + this.vz * rz;
    const speedAbs = Math.hypot(this.speed, lat);
    const slip = Math.abs(lat) / Math.max(speedAbs, 2.2);
    this.slip = slip;
    const peak = Math.max(0.12, Math.abs(pacejka(slip, grip)));
    lat *= Math.exp(-peak * 8.4 * dt);
    const spin = lat * (slip > 0.3 ? 0.028 : -0.006);
    this.yaw = wrapPi(this.yaw + spin * dt);
    this.vx = fx * this.speed + rx * lat;
    this.vz = fz * this.speed + rz * lat;
    const cuts = speedAbs > 25 ? 2 : 1;
    const h = dt / cuts;
    for (let s = 0; s < cuts; s++) {
      this.x += this.vx * h;
      this.z += this.vz * h;
      this.hitColliders(colliders);
    }

    const near = nearestIndex(track.samples, this.x, this.z, this.sampleIndex, track.closed);
    this.sampleIndex = near.index;
    const s = track.samples[near.index];
    const rp = probeRamp(this.x, this.z, ramps, this.y);
    const wb = 1.25;
    const tr = 0.72;
    const corners = [
      [this.x + fx * wb + rx * tr, this.z + fz * wb + rz * tr],
      [this.x + fx * wb - rx * tr, this.z + fz * wb - rz * tr],
      [this.x - fx * wb + rx * tr, this.z - fz * wb + rz * tr],
      [this.x - fx * wb - rx * tr, this.z - fz * wb - rz * tr],
    ];
    let ySum = 0;
    let yMin = 1e9;
    let yMax = -1e9;
    for (const [cx, cz] of corners) {
      const cRp = probeRamp(cx, cz, ramps, this.y);
      const y = cRp ? cRp.y : track.samples[nearestIndex(track.samples, cx, cz, near.index, track.closed).index].y;
      ySum += y;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    const avgY = ySum * 0.25;
    this.rideCompress = clamp(yMax - yMin, 0, 0.12);
    const groundY = rp ? rp.y : avgY;
    const dist = near.dist;
    const half = track.width / 2;
    const lat01 = dist / Math.max(0.5, half);
    const onCurbBand = !rp && lat01 > 0.9 && lat01 < 1.08;
    if (rp) {
      this.y = groundY;
      this.vy = 0;
      this.airborne = false;
      this.airMs = 0;
      this.wasCurb = false;
    } else {
      if (onCurbBand && !this.wasCurb && speedAbs > 10) this.vy += 3.6;
      this.wasCurb = onCurbBand;
      this.vy -= 18 * dt;
      this.y += this.vy * dt;
      if (this.y <= groundY + 0.04) {
        this.y = groundY;
        if (this.vy < 0) this.vy = 0;
        this.airborne = false;
        this.airMs = 0;
      } else {
        if (this.y > groundY + 0.55) this.airMs += dt * 1000;
        else this.airMs = 0;
        this.airborne = this.airMs >= 12;
        const ceil = this.vy > 2 || this.airborne ? groundY + 8 : groundY + 0.85;
        if (this.y > ceil) {
          this.y = ceil;
          this.vy = Math.min(0, this.vy);
        }
      }
    }
    const alley = nearestStreet(this.x, this.z, streets);
    const onAlley = !!(alley && alley.dist < alley.street.half * 1.05);
    const onRamp = !!rp;
    const onMain = dist < half * (this.roam ? 1.35 : 1.02);
    this.onTrack = onMain || onAlley || onRamp || (this.roam && dist < half * 2.6);
    this.sideStreet = onRamp ? rp.r.he : onAlley && !onMain ? alley!.street.he : "";
    this.sideStreetEn = onRamp ? rp.r.en : onAlley && !onMain ? alley!.street.en : "";
    if (this.onTrack && !this.drifting && speedAbs > 6) {
      const latSigned = (this.x - s.x) * s.rx + (this.z - s.z) * s.rz;
      const laneCenter = track.medianHalfWidth ? roadLaneOffset(track, latSigned) : 0;
      const laneError = latSigned - laneCenter;
      const laneHalf = track.medianHalfWidth ? (half - track.medianHalfWidth) / 2 : half;
      const wide = Math.abs(laneError) > laneHalf * 0.56;
      if (Math.abs(this.holdSteer) < 0.15 || wide) {
        const road = Math.atan2(-s.tx, -s.tz);
        const aim = wrapPi(road - Math.sign(laneError || 1) * clamp(Math.abs(laneError) / laneHalf, 0, 1) * 0.28);
        const err = wrapPi(aim - this.yaw);
        this.yaw = wrapPi(this.yaw + clamp(err, -1.4, 1.4) * dt * (wide ? 8 : 2.4));
        const nfx = -Math.sin(this.yaw);
        const nfz = -Math.cos(this.yaw);
        const nrx = Math.cos(this.yaw);
        const nrz = -Math.sin(this.yaw);
        const latNow = this.vx * nrx + this.vz * nrz;
        const keep = wide ? 0.985 : 1;
        this.vx = nfx * this.speed + nrx * latNow * keep;
        this.vz = nfz * this.speed + nrz * latNow * keep;
      }
    }
    if (!this.onTrack) {
      this.surfaceKind = "sand";
      this.surfaceGrip = this.baseGrip * 0.54;
    } else if (lat01 > 0.9 && !onRamp) {
      this.surfaceKind = "curb";
      this.surfaceGrip = this.baseGrip * 0.74;
    } else {
      this.surfaceKind = "asphalt";
      this.surfaceGrip = this.baseGrip * (lat01 > 0.72 && this.weatherGrip < 0.95 ? 0.86 : 1);
    }

    if (!this.onTrack) this.speed *= Math.exp(-(this.roam ? 0.9 : this.stats.body === "rally" ? 1.15 : 2.6) * dt);

    if (onAlley && !onMain && alley) {
      const keep = alley.street.half + 1.35;
      if (alley.dist > keep) {
        const nx = (this.x - alley.qx) / (alley.dist || 1);
        const nz = (this.z - alley.qz) / (alley.dist || 1);
        this.x = alley.qx + nx * keep;
        this.z = alley.qz + nz * keep;
        const out = this.vx * nx + this.vz * nz;
        if (out > 0) {
          this.vx -= nx * out * 1.2;
          this.vz -= nz * out * 1.2;
          this.speed *= 0.88;
        }
      }
    } else if (!onRamp) {
      const wall = half + 0.35;
      if (dist > wall) {
        const nx = (this.x - s.x) / (dist || 1);
        const nz = (this.z - s.z) / (dist || 1);
        this.x = s.x + nx * wall;
        this.z = s.z + nz * wall;
        const out = this.vx * nx + this.vz * nz;
        if (out > 0) {
          this.vx -= nx * out;
          this.vz -= nz * out;
          const fx = -Math.sin(this.yaw);
          const fz = -Math.cos(this.yaw);
          this.speed = this.vx * fx + this.vz * fz;
          if (out > 8) {
            this.speed *= 0.9;
            this.impact = Math.max(this.impact, Math.min(0.35, out / 36));
            if (this.wallDmgT <= 0) {
              this.damage = clamp(this.damage + Math.min(0.05, out * 0.0016), 0, 1);
              this.wallDmgT = 0.55;
            }
          }
        }
      }
    }

    if (dist > 92) {
      const nx = (this.x - s.x) / (dist || 1);
      const nz = (this.z - s.z) / (dist || 1);
      this.x = s.x + nx * 92;
      this.z = s.z + nz * 92;
    }
    const prev = this.progress;
    this.progress = s.t;
    if (forwardDelta(prev, this.progress, track.closed) < -0.002 && Math.abs(this.speed) > 4 && onMain) this.wrongWayT += dt;
    else this.wrongWayT = Math.max(0, this.wrongWayT - dt * 1.4);
  }

  /** 5.5: resolve once per CCD cut. Not PhysX. */
  private hitColliders(colliders: Collider[]) {
    for (const c of colliders) {
      // The vehicle base is entirely above this actual solid, so their volumes cannot meet.
      if (c.maxY != null && this.y > c.maxY) continue;
      const carR = 1.05;
      let nx = 0;
      let nz = 0;
      let hitD = 0;
      if (c.hx != null && c.hz != null) {
        const dx = this.x - c.x;
        const dz = this.z - c.z;
        const yaw = c.yaw ?? 0;
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        let lx = dx * cy - dz * sy;
        let lz = dx * sy + dz * cy;
        const px = c.hx + carR - Math.abs(lx);
        const pz = c.hz + carR - Math.abs(lz);
        if (px <= 0 || pz <= 0) continue;
        let nxl = 0;
        let nzl = 0;
        if (px < pz) {
          nxl = lx < 0 ? -1 : 1;
          lx = nxl * (c.hx + carR);
          hitD = px;
        } else {
          nzl = lz < 0 ? -1 : 1;
          lz = nzl * (c.hz + carR);
          hitD = pz;
        }
        this.x = c.x + lx * cy + lz * sy;
        this.z = c.z - lx * sy + lz * cy;
        nx = nxl * cy + nzl * sy;
        nz = -nxl * sy + nzl * cy;
      } else {
        const dx = this.x - c.x;
        const dz = this.z - c.z;
        const d = Math.hypot(dx, dz);
        if (d >= c.r || d < 0.0001) continue;
        nx = dx / d;
        nz = dz / d;
        this.x = c.x + nx * c.r;
        this.z = c.z + nz * c.r;
        hitD = c.r - d;
      }
      const into = this.vx * nx + this.vz * nz;
      if (into < 0) {
        const hit = Math.max(-into, hitD);
        const kind = c.kind ?? "barrier";
        this.lastHit = kind;
        const fx = -Math.sin(this.yaw);
        const fz = -Math.cos(this.yaw);
        if (kind === "building") {
          this.vx -= nx * into;
          this.vz -= nz * into;
          const fx = -Math.sin(this.yaw);
          const fz = -Math.cos(this.yaw);
          this.speed = this.vx * fx + this.vz * fz;
          const bite = Math.min(hit, 3.5);
          this.speed *= bite > 2.5 ? 0.72 : 0.88;
          this.yaw = wrapPi(this.yaw + (nx * fz - nz * fx) * 0.08 * Math.min(1, bite / 6));
          if (-into > 3.5) {
            this.damage = clamp(this.damage + Math.min(0.04, bite * 0.01), 0, 1);
            this.impact = Math.max(this.impact, Math.min(0.65, bite / 8));
          }
        } else if (kind === "car") {
          this.vx -= nx * into * 0.68;
          this.vz -= nz * into * 0.68;
          this.speed = this.vx * fx + this.vz * fz;
          this.speed *= hit > 14 ? 0.58 : hit > 7 ? 0.76 : 0.88;
          this.damage = clamp(this.damage + hit * 0.02, 0, 1);
          if (hit > 4) this.impact = Math.max(this.impact, Math.min(0.55, hit / 20));
        } else {
          this.vx -= nx * into * 1.08;
          this.vz -= nz * into * 1.08;
          this.speed = this.vx * fx + this.vz * fz;
          this.speed *= hit > 12 ? 0.78 : 0.92;
          if (-into > 8 && this.wallDmgT <= 0) {
            this.damage = clamp(this.damage + Math.min(0.05, -into * 0.0016), 0, 1);
            this.impact = Math.max(this.impact, Math.min(0.38, -into / 40));
            this.wallDmgT = 0.55;
          }
        }
      }
    }
  }

  consumeCheckpoints(track: BuiltTrack, prevProgress: number) {
    if (this.finished || this.isTraffic || this.isCop || this.eliminated) return { lapComplete: false, checkpoint: false };
    const n = forwardDelta(prevProgress, this.progress, track.closed);
    if (n < 0 || n > 0.18) return { lapComplete: false, checkpoint: false };
    const count = track.checkpoints.length;
    let checkpoint = false;
    let lapComplete = false;
    const nextT = track.checkpoints[Math.min(this.nextCheckpoint, count - 1)] ?? 0;
    if (!track.closed) {
      if (this.nextCheckpoint < count && prevProgress < nextT && this.progress >= nextT) {
        checkpoint = true;
        this.lastCheckpoint = this.nextCheckpoint;
        this.nextCheckpoint += 1;
        if (this.lastCheckpoint === count - 1) {
          this.lap += 1;
          lapComplete = true;
        }
      }
      return { lapComplete, checkpoint };
    }
    if (this.didCross(prevProgress, this.progress, nextT)) {
      checkpoint = true;
      this.lastCheckpoint = this.nextCheckpoint;
      this.nextCheckpoint = (this.nextCheckpoint + 1) % count;
      if (this.lastCheckpoint === 0) {
        this.lap += 1;
        lapComplete = true;
      }
    }
    return { lapComplete, checkpoint };
  }

  private didCross(prev: number, now: number, gate: number) {
    if (prev <= now) return prev < gate && now >= gate && now - prev < 0.25;
    return gate < 0.15 && prev > 0.85 && now < 0.2;
  }

  respawn(track: BuiltTrack) {
    const t = track.checkpoints[this.lastCheckpoint] ?? this.progress;
    const s = sampleAtT(track.samples, t);
    this.x = s.x + s.rx * this.aiOffset;
    this.z = s.z + s.rz * this.aiOffset;
    this.y = s.y;
    this.yaw = Math.atan2(-s.tx, -s.tz);
    this.vx = 0;
    this.vz = 0;
    this.vy = 0;
    this.speed = 0;
    this.offTrackT = 0;
    this.progress = s.t;
    this.sampleIndex = track.samples.indexOf(s);
  }

  snap(): CarSnap {
    return {
      visualInput: { steer: this.visualSteer, brake: this.visualBrake },
      x: this.x,
      y: this.y,
      z: this.z,
      yaw: this.yaw,
      vx: this.vx,
      vz: this.vz,
      vy: this.vy,
      speed: this.speed,
      progress: this.progress,
      sampleIndex: this.sampleIndex,
      lap: this.lap,
      lastCheckpoint: this.lastCheckpoint,
      nextCheckpoint: this.nextCheckpoint,
      nitro: this.nitro,
      driftCharge: this.driftCharge,
      driftScore: this.driftScore,
      damage: this.damage,
      pitch: this.pitch,
      boostT: this.boostT,
      finished: this.finished,
      eliminated: this.eliminated,
      offTrackT: this.offTrackT,
      wrongWayT: this.wrongWayT,
      roll: this.roll,
      gear: this.gear,
      yawRate: this.yawRate,
      transient: {
        drifting: this.drifting,
        nitroPulse: this.nitroPulse,
        impact: this.impact,
        lastHit: this.lastHit,
        onTrack: this.onTrack,
        sideStreet: this.sideStreet,
        sideStreetEn: this.sideStreetEn,
        drafting: this.drafting,
        surfaceGrip: this.surfaceGrip,
        slip: this.slip,
        rpm: this.rpm,
        kinMix: this.kinMix,
        surfaceKind: this.surfaceKind,
        dirt: this.dirt,
        airborne: this.airborne,
        airMs: this.airMs,
        rideCompress: this.rideCompress,
        wasCurb: this.wasCurb,
        comboMul: this.comboMul,
        wheelsLocked: this.wheelsLocked,
        driftAngle: this.driftAngle,
        reverseHold: this.reverseHold,
        absActive: this.absActive,
        tcsActive: this.tcsActive,
        escActive: this.escActive,
        slipRatio: this.slipRatio,
        wallDmgT: this.wallDmgT,
        nitroHeld: this.nitroHeld,
        holdSteer: this.holdSteer,
      },
    };
  }

  load(s: CarSnap) {
    // Older replay frames have no control feedback; never retain a later frame's lights.
    this.visualSteer = s.visualInput?.steer ?? 0;
    this.visualBrake = s.visualInput?.brake ?? 0;
    if (s.transient) Object.assign(this, s.transient);
    this.x = s.x;
    this.y = s.y;
    this.z = s.z;
    this.yaw = s.yaw;
    this.vx = s.vx;
    this.vz = s.vz;
    this.vy = s.vy ?? 0;
    this.speed = s.speed;
    this.progress = s.progress;
    this.sampleIndex = s.sampleIndex;
    this.lap = s.lap;
    this.lastCheckpoint = s.lastCheckpoint;
    this.nextCheckpoint = s.nextCheckpoint;
    this.nitro = s.nitro;
    this.driftCharge = s.driftCharge;
    this.driftScore = s.driftScore;
    this.damage = s.damage;
    this.pitch = s.pitch;
    this.boostT = s.boostT;
    this.finished = s.finished;
    this.eliminated = s.eliminated;
    this.offTrackT = s.offTrackT;
    this.wrongWayT = s.wrongWayT;
    this.roll = s.roll ?? 0;
    this.gear = s.gear ?? this.gear;
    this.yawRate = s.yawRate ?? 0;
  }

  raceScore() {
    const along = this.lap === 0 && this.progress > 0.5 ? this.progress - 1 : this.progress;
    return this.lap * 1000 + Math.max(0, this.lastCheckpoint) * 10 + along;
  }
}

export const SURFACE_GRIP: Record<string, number> = {
  jaffa: 0.76,
  stone: 0.8,
  desert: 0.62,
  park: 0.86,
  carmel: 0.9,
  port: 0.88,
  highway: 0.94,
  manhattan: 0.92,
  bauhaus: 0.94,
  snow: 0.5,
};

function pathInput(car: ArcadeCar, track: BuiltTrack, player?: ArcadeCar): InputState {
  const lookM = 24 + clamp(car.speed, 0, 32) * 0.55;
  const look = Math.min(0.06, lookM / Math.max(200, track.length));
  const t = track.closed ? (car.progress + look) % 1 : Math.min(0.995, car.progress + look);
  const a = sampleAtT(track.samples, t);
  const tx = a.x + a.rx * car.aiOffset;
  const tz = a.z + a.rz * car.aiOffset;
  const err = wrapPi(Math.atan2(-(tx - car.x), -(tz - car.z)) - car.yaw);
  const here = sampleAtT(track.samples, car.progress);
  const lat = (car.x - here.x) * here.rx + (car.z - here.z) * here.rz;
  const offLine = Math.abs(lat - car.aiOffset) > track.width * 0.42 || car.offTrackT > 0.35;
  if (offLine) {
    const slow = car.speed < 8;
    const fast = car.speed > 18;
    const cap = slow ? 0.5 : fast ? 0.45 : 0.8;
    return {
      steer: clamp(err * (slow ? 1.1 : 1.4), -cap, cap),
      throttle: slow ? 1 : fast ? 0.2 : 0.55,
      brake: fast ? 0.55 : 0,
      drift: false,
      nitro: false,
    };
  }
  const steer = clamp(err * 1.6, -1, 1);
  const abs = Math.abs(err);
  if (abs > 0.55) {
    // Plan a conservative corner-entry speed from the actual look-ahead chord,
    // turn angle and configured grip. This is an AI planning heuristic, not a
    // measured tire limit. Large heading errors also need an 18m/s recovery cap.
    const chord = Math.hypot(tx - car.x, tz - car.z);
    const radius = chord / Math.max(0.1, 2 * Math.sin(Math.min(abs, Math.PI / 2)));
    const grip = Math.max(0.1, car.stats.grip * car.weatherGrip * car.surfaceGrip
      * HANDLING[car.handling].gripMul * WEATHER_SPEC[car.weather].lat);
    const cornerSpeed = Math.min(18, Math.sqrt(9.81 * grip * radius) * 0.85);
    let holdThrottle = car.speed >= cornerSpeed ? 0 : 0.65;
    let holdBrake = clamp((car.speed - cornerSpeed) / Math.max(1, car.stats.brake * 0.75), 0, 1);
    const scoreGap = player ? player.raceScore() - car.raceScore() : 0;
    if (player && HANDLING[car.handling].rubberBand && player.speed > 12 && car.speed > player.speed + 0.4 && scoreGap <= 0.012 && scoreGap > -0.04) {
      holdThrottle = Math.min(holdThrottle, 0.25);
      holdBrake = Math.max(holdBrake, 0.85);
    }
    return {
      steer: clamp(err * 2.4, -1, 1),
      throttle: holdThrottle,
      brake: holdBrake,
      drift: false,
      nitro: false,
    };
  }
  const bendLook = Math.min(0.08, 55 / Math.max(200, track.length));
  const ahead = sampleAtT(track.samples, track.closed ? (car.progress + bendLook) % 1 : Math.min(0.995, car.progress + bendLook));
  const bend = Math.abs(wrapPi(Math.atan2(-ahead.tx, -ahead.tz) - car.yaw));
  let throttle = abs > 0.55 ? 0.35 : 1;
  if (player && HANDLING[car.handling].rubberBand) {
    const gap = player.raceScore() - car.raceScore();
    const target = 1 + clamp(gap * 2.5, -0.45, 0.15);
    throttle *= car.aiSkill * target;
  } else {
    throttle *= car.aiSkill;
  }
  if (bend > 0.42 && car.speed > 14) throttle *= 0.72;
  if (bend > 0.75 && car.speed > 18) throttle *= 0.7;
  let brake = car.speed > 20 && bend > 0.9 ? 0.35 : 0;
  if (player && HANDLING[car.handling].rubberBand && player.speed > 12 && car.speed > player.speed + 0.4) {
    const scoreGap = player.raceScore() - car.raceScore();
    if (scoreGap <= 0.012 && scoreGap > -0.04) {
      throttle = Math.min(throttle, 0.25);
      brake = Math.max(brake, 0.85);
    }
  }
  const drift = abs > 0.5 && car.speed > 16;
  const nitro = car.nitro > 0.4 && abs < 0.22 && car.speed > 16;
  return {
    steer: clamp(steer, -1, 1),
    throttle: clamp(throttle, 0, 1),
    brake: clamp(brake, 0, 1),
    drift,
    nitro,
  };
}

// Avoidance uses the same measured, oriented envelope as contact resolution.

function avoidVehicleContact(car: ArcadeCar, input: InputState, vehicles: readonly ArcadeCar[]): InputState {
  const fx = -Math.sin(car.yaw), fz = -Math.cos(car.yaw);
  const rx = Math.cos(car.yaw), rz = -Math.sin(car.yaw);
  let brake = input.brake;
  let hazard = false;
  for (const other of vehicles) {
    // Avoidance predicts future contact: on a grade, an approaching body is
    // at another height before reaching us. Retain the existing four-metre
    // forecast corridor; only actual contact uses tight solid height bounds.
    if (other === car || Math.abs(other.y - car.y) > 4) continue;
    const dx = other.x - car.x, dz = other.z - car.z;
    const along = dx * fx + dz * fz;
    if (along <= 0 || along > 72) continue;
    const lateralA = contactProjection(car, rx, rz), lateralB = contactProjection(other, rx, rz);
    if (Math.abs(lateralA.center - lateralB.center) > lateralA.radius + lateralB.radius + 0.35) continue;
    const closing = (car.vx - other.vx) * fx + (car.vz - other.vz) * fz;
    if (closing <= 0.5) continue;
    // A two-second closing horizon and one metre of free space prevent the
    // driver from waiting until an overlap before reacting. Receding vehicles
    // and adjacent lanes do not impose a speed cap or change race position.
    const longitudinalA = contactProjection(car, fx, fz), longitudinalB = contactProjection(other, fx, fz);
    const gap = Math.max(0, longitudinalB.center - longitudinalA.center - longitudinalA.radius - longitudinalB.radius - 1);
    const safeClosing = gap / 2;
    if (closing <= safeClosing) continue;
    const wx = WEATHER_SPEC[car.weather] ?? WEATHER_SPEC.clear;
    const surface = SURFACE_SPEC[car.surfaceKind] ?? SURFACE_SPEC.asphalt;
    const braking = Math.max(1, car.stats.brake * wx.long * surface.long * 0.7);
    brake = Math.max(brake, clamp((closing - safeClosing) / braking, 0, 1));
    hazard = true;
  }
  return hazard ? { ...input, throttle: 0, brake, nitro: false, drift: false } : input;
}

export function aiInput(car: ArcadeCar, track: BuiltTrack, player?: ArcadeCar, vehicles: readonly ArcadeCar[] = []): InputState {
  return avoidVehicleContact(car, pathInput(car, track, player), vehicles);
}

export function trafficInput(car: ArcadeCar, track: BuiltTrack, vehicles: readonly ArcadeCar[] = []): InputState {
  const look = 0.028;
  const t = track.closed ? (car.progress + look) % 1 : Math.min(0.995, car.progress + look);
  const a = sampleAtT(track.samples, t);
  const tx = a.x + a.rx * car.aiOffset;
  const tz = a.z + a.rz * car.aiOffset;
  const err = wrapPi(Math.atan2(-(tx - car.x), -(tz - car.z)) - car.yaw);
  const steer = clamp(err * 1.35, -1, 1);
  const cruise = 12 + car.aiSkill * 7;
  return avoidVehicleContact(car, {
    steer: clamp(steer, -1, 1),
    throttle: car.speed < cruise ? 0.58 : 0.1,
    brake: Math.abs(err) > 0.65 && car.speed > 11 ? 0.45 : 0,
    drift: false,
    nitro: false,
  }, vehicles);
}

export function copInput(car: ArcadeCar, track: BuiltTrack, target: ArcadeCar, heat = 0.4): InputState {
  const dx = target.x - car.x;
  const dz = target.z - car.z;
  const dist = Math.hypot(dx, dz);
  const toTarget = Math.atan2(-dx, -dz);
  const look = sampleAtT(track.samples, (car.progress + 0.03) % 1);
  const toPath = Math.atan2(-(look.x + look.rx * car.aiOffset - car.x), -(look.z + look.rz * car.aiOffset - car.z));
  const mix = dist < 55 ? 0.72 + heat * 0.22 : 0.32 + heat * 0.2;
  const want = wrapPi(toPath + wrapPi(toTarget - toPath) * mix);
  const err = wrapPi(want - car.yaw);
  let steer = clamp(err * (2.05 + heat * 0.4), -1, 1);
  const side = Math.cos(car.yaw);
  const fwd = -Math.sin(car.yaw);
  const lat = dx * side + dz * fwd;
  if (dist < 14 && heat > 0.35) steer = clamp(steer + Math.sign(lat) * 0.28, -1, 1);
  const throttle = dist > 20 ? 1 : dist > 13 ? 0.7 : 0.28;
  const brake = Math.abs(err) > 1.05 && car.speed > 20 ? 0.42 : 0;
  const drift = Math.abs(err) > 0.62 && car.speed > 15;
  const nitro = dist > 20 && car.nitro > 0.08;
  return {
    steer: clamp(steer, -1, 1),
    throttle: clamp(throttle, 0, 1),
    brake: clamp(brake, 0, 1),
    drift,
    nitro,
  };
}

export function updateDrafting(player: ArcadeCar, others: ArcadeCar[]) {
  player.drafting = false;
  if (player.finished || Math.abs(player.speed) < 10) return;
  for (const n of others) {
    if (n === player || n.eliminated) continue;
    const fx = -Math.sin(n.yaw);
    const fz = -Math.cos(n.yaw);
    const dx = player.x - n.x;
    const dz = player.z - n.z;
    const along = -(dx * fx + dz * fz);
    const side = Math.abs(dx * Math.cos(n.yaw) + dz * -Math.sin(n.yaw));
    if (along > 3.4 && along < 14 && side < 2.5 && n.speed > 11) {
      player.drafting = true;
      return;
    }
  }
}

export function separateCars(cars: ArcadeCar[]): number {
  const n = cars.length;
  let peak = 0;
  const impulsed = new Set<number>();
  // A correction in a pack can push a car back into an earlier neighbour.
  // Revisit constraints, but charge each pair's impact only once per tick.
  for (let pass = 0; pass < 96; pass++) {
    let deepest = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = cars[i], b = cars[j];
        const contact = vehicleContact(a, b);
        if (!contact) continue;
        const { nx, nz, depth: push } = contact;
        deepest = Math.max(deepest, push);
        const ma = a.stats.mass || 1;
        const mb = b.stats.mass || 1;
        const m = ma + mb;
        a.x += nx * push * (mb / m);
        a.z += nz * push * (mb / m);
        b.x -= nx * push * (ma / m);
        b.z -= nz * push * (ma / m);
        const pair = i * n + j;
        if (impulsed.has(pair)) continue;
        const rel = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
        if (rel >= -3) continue;
        impulsed.add(pair);
        const imp = (-1.42 * rel) / (1 / ma + 1 / mb);
        a.vx += (imp / ma) * nx;
        a.vz += (imp / ma) * nz;
        b.vx -= (imp / mb) * nx;
        b.vz -= (imp / mb) * nz;
        const closing = -rel;
        const afx = -Math.sin(a.yaw);
        const afz = -Math.cos(a.yaw);
        const bfx = -Math.sin(b.yaw);
        const bfz = -Math.cos(b.yaw);
        a.speed = a.vx * afx + a.vz * afz;
        b.speed = b.vx * bfx + b.vz * bfz;
        const loss = clamp(closing / 34, 0.04, 0.32);
        a.speed *= 1 - loss * (mb / m) * 0.45;
        b.speed *= 1 - loss * (ma / m) * 0.45;
        const bump = closing > 6 ? closing * 0.006 : 0;
        a.damage = clamp(a.damage + bump * (mb / m), 0, 1);
        b.damage = clamp(b.damage + bump * (ma / m), 0, 1);
        if (!a.isAi || !b.isAi) {
          peak = Math.max(peak, closing);
          const hit = Math.min(0.55, closing / 22);
          if (!a.isAi) a.impact = Math.max(a.impact, hit);
          if (!b.isAi) b.impact = Math.max(b.impact, hit);
        }
      }
    }
    if (deepest < 1e-6) break;
  }
  return peak;
}
