import { clamp, expSmooth, wrapPi, forwardDelta } from "./math";
import {
  absModulate,
  brakeForce,
  DEFAULT_ASSISTS,
  escYaw,
  HANDLING,
  hydroplane,
  pacejka,
  SURFACE_SPEC,
  tcsModulate,
  WEATHER_SPEC,
  type AssistFlags,
  type HandlingMode,
} from "./physics";
import { nearestIndex, sampleAtT, type BuiltTrack } from "./spline";
import { nearestStreet, type StreetRibbon } from "./streets";
import type { CarDef, Collider, InputState, Ramp, Weather } from "./types";

export type CarSnap = {
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

function probeRamp(x: number, z: number, ramps: Ramp[]) {
  let best: { r: Ramp; y: number; dyds: number } | null = null;
  for (const r of ramps) {
    const dx = x - r.x;
    const dz = z - r.z;
    const along = dx * r.sx + dz * r.sz;
    const across = dx * r.sz - dz * r.sx;
    if (Math.abs(along) <= r.len * 0.5 && Math.abs(across) <= r.half) {
      const t = clamp(along / r.len + 0.5, 0, 1);
      const y = r.y0 + (r.y1 - r.y0) * t;
      const dyds = (r.y1 - r.y0) / r.len;
      if (!best || y > best.y) best = { r, y, dyds };
    }
  }
  return best;
}

export class ArcadeCar {
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

  constructor(stats: CarDef, name: string) {
    this.stats = stats;
    this.name = name;
  }

  spawn(track: BuiltTrack, t: number, lateral: number) {
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
    this.sampleIndex = Math.floor(t * track.samples.length) % track.samples.length;
    this.nextCheckpoint = 1;
    this.lastCheckpoint = 0;
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
    this.damage = 0;
    this.dirt = 0;
    this.finished = false;
    this.eliminated = false;
    this.wrongWayT = 0;
    this.airborne = false;
    this.airMs = 0;
    this.wasCurb = false;
  }

  step(dt: number, input: InputState, track: BuiltTrack, racing: boolean, colliders: Collider[] = [], streets: StreetRibbon[] = [], ramps: Ramp[] = []) {
    this.impact = 0;
    this.lastHit = "";
    this.nitroPulse = false;
    if (this.finished || this.eliminated) {
      this.speed *= Math.exp(-2.2 * dt);
      this.integrateMotion(dt, track, 0, colliders, streets, ramps);
      this.pitch = expSmooth(this.pitch, 0, 8, dt);
      return;
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
      if (g !== this.gear && racing) this.speed *= 0.94;
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
    const driveCurve = Math.max(0.18, 1 - clamp(vAbs / Math.max(8, maxSpeed), 0, 1) ** 2.35);
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
        const v100 = 27.778;
        const t100 = Math.max(3.2, stats.zeroTo100 ?? 8);
        const pull = throttle * (v100 / t100) * mass * 1.35 * wx.long * surf.long * (boosting ? 1.08 : 1) * (this.drafting ? 1.05 : 1);
        this.speed += (pull / mass) * dt;
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
      if (Math.abs(this.speed) <= drag) {
        if (throttle <= 0 && brakeIn <= 0) this.speed = 0;
      } else {
        this.speed -= Math.sign(this.speed) * drag;
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
    {
      const sG = track.samples[this.sampleIndex];
      const nG = track.samples[Math.min(this.sampleIndex + 1, track.samples.length - 1)];
      const gds = Math.hypot(nG.x - sG.x, nG.z - sG.z) || 1;
      let grade = (nG.y - sG.y) / gds;
      const rp = probeRamp(this.x, this.z, ramps);
      if (rp) {
        const alongV = this.vx * rp.r.sx + this.vz * rp.r.sz;
        grade = rp.dyds * Math.sign(alongV || 1);
      }
      if (racing) {
        this.speed += -grade * 9.81 * dt;
        if (grade > 0.05) this.speed -= grade * 4.2 * dt;
      }
    }

    const speedAbs = Math.abs(this.speed);
    const loadTgt = racing ? brakeIn * 0.72 - throttle * 0.48 : 0;
    const iG = this.sampleIndex;
    const sG = track.samples[iG];
    const nG = track.samples[Math.min(iG + 1, track.samples.length - 1)];
    const gds = Math.hypot(nG.x - sG.x, nG.z - sG.z) || 1;
    const terrainPitch = clamp(-((nG.y - sG.y) / gds) * 3.4, -0.75, 0.75);
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
    grip *= 1 / (1 + (speedAbs / 32) ** 2);
    grip *= hydroplane(speedAbs, wx.hydro);
    if (this.wheelsLocked) grip *= 0.42;
    if (wantDrift) grip = Math.min(grip, 0.22 + (1 - front) * 0.12);

    this.stepWheels(dt, input.steer, grip, speedAbs, fx, fz, rx, rz, racing, reverse, wantDrift, front, mass);

    this.integrateMotion(dt, track, grip, colliders, streets, ramps);

    if (wantDrift) {
      this.drifting = true;
      this.driftCharge = Math.min(this.driftCharge + dt * 0.9, 2.1);
      this.nitro = Math.min(1, this.nitro + dt * 0.2);
      this.driftAngle = Math.asin(clamp(this.slip, 0, 1)) * 57.3;
      if (!this.isAi) {
        const a = this.driftAngle;
        const zone = a < 12 ? 0.38 : a > 52 ? 0.55 : a > 18 && a < 42 ? 1.42 : 1;
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
    if (!this.isTraffic && !this.isCop) {
      if (!this.onTrack || this.surfaceKind === "sand") this.dirt += dt * 0.075;
      else if (this.surfaceKind === "curb") this.dirt += dt * 0.028;
      if (this.drifting) this.dirt += dt * 0.045;
      if (this.weatherGrip < 0.95 && this.onTrack) this.dirt -= dt * 0.11;
      this.dirt = clamp(this.dirt, 0, 1);
    }
    if (this.offTrackT > 3.2) this.respawn(track);
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
    const maxSteer = 0.5 * (1 - 0.4 * clamp(speedAbs / 36, 0, 1));
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
      yawT += ox * wrz * Fy - oz * wrx * Fy;
    }
    const speedFactor = clamp(speedAbs / 7.5, 0, 1) * (1 - 0.4 * clamp(speedAbs / 38, 0, 1));
    const crawl = 1 - clamp((speedAbs - 4) / 6, 0, 1);
    this.kinMix = crawl;
    const kin = steerIn * 1.7 * clamp(speedAbs / 6.5, 0, 1) * reverse * (wantDrift ? 1.28 : 1) * (0.92 + front * 0.16);
    const tire = (yawT / iz) * 80;
    // Below ~10 m/s Pacejka is too weak to turn; crawl keeps kinematic yaw.
    // At speed, yaw is tire + ESC only — not a 34% blend.
    this.yawRate = kin * crawl + tire;
    const latNow = this.vx * rx + this.vz * rz;
    const slipAng = Math.atan2(latNow, Math.max(2.4, speedAbs));
    const esc = escYaw(slipAng, this.yawRate, this.assists.esc && racing, wantDrift);
    this.escActive = esc.active;
    this.yawRate += esc.yaw * 1.55 * speedFactor;
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
    const rp = probeRamp(this.x, this.z, ramps);
    const groundY = rp ? rp.y : s.y;
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
            this.damage = clamp(this.damage + out * 0.004, 0, 1);
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
          this.speed *= hit > 10 ? 0.02 : hit > 5 ? 0.07 : 0.14;
          this.yaw = wrapPi(this.yaw + (nx * fz - nz * fx) * 0.12 * Math.min(1, hit / 9));
          this.damage = clamp(this.damage + hit * 0.085, 0, 1);
          if (hit > 2.5) this.impact = Math.max(this.impact, Math.min(1, hit / 7));
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
          if (hit > 9) {
            this.damage = clamp(this.damage + hit * 0.008, 0, 1);
            this.impact = Math.max(this.impact, Math.min(0.38, hit / 30));
          }
        }
      }
    }
  }

  consumeCheckpoints(track: BuiltTrack, prevProgress: number) {
    if (this.finished || this.isTraffic || this.isCop || this.eliminated) return { lapComplete: false, checkpoint: false };
    const n = forwardDelta(prevProgress, this.progress, track.closed);
    if (n < 0 || n > 0.18) return { lapComplete: false, checkpoint: false };
    if (!track.closed && this.progress > 0.96 && this.lap < 1) {
      this.lap += 1;
      this.lastCheckpoint = track.checkpoints.length - 1;
      return { lapComplete: true, checkpoint: true };
    }
    const count = track.checkpoints.length;
    let checkpoint = false;
    let lapComplete = false;
    const nextT = track.checkpoints[this.nextCheckpoint] ?? 0;
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
    if (prev <= now) return prev < gate && now >= gate;
    return prev < gate || now >= gate;
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
  }

  snap(): CarSnap {
    return {
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
    };
  }

  load(s: CarSnap) {
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
    return this.lap * 1000 + this.lastCheckpoint * 10 + this.progress;
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

export function aiInput(car: ArcadeCar, track: BuiltTrack, player?: ArcadeCar): InputState {
  const look = 0.045 + clamp(car.speed / 80, 0, 0.04);
  const t = track.closed ? (car.progress + look) % 1 : Math.min(0.995, car.progress + look);
  const a = sampleAtT(track.samples, t);
  const tx = a.x + a.rx * car.aiOffset;
  const tz = a.z + a.rz * car.aiOffset;
  const err = wrapPi(Math.atan2(-(tx - car.x), -(tz - car.z)) - car.yaw);
  const steer = clamp(err * 1.6, -1, 1);
  const abs = Math.abs(err);
  const ahead = sampleAtT(track.samples, track.closed ? (car.progress + 0.09) % 1 : Math.min(0.995, car.progress + 0.09));
  const bend = Math.abs(wrapPi(Math.atan2(-ahead.tx, -ahead.tz) - car.yaw));
  let throttle = abs > 0.55 ? 0.35 : 1;
  if (player && HANDLING[car.handling].rubberBand) {
    const gap = player.raceScore() - car.raceScore();
    const target = 1 + clamp(gap * 0.004, -0.12, 0.08);
    throttle *= car.aiSkill * target;
  } else {
    throttle *= car.aiSkill;
  }
  if (bend > 0.42) throttle *= 0.5;
  if (bend > 0.75) throttle *= 0.55;
  const brake = (abs > 0.85 && car.speed > 22) || bend > 0.82 ? 0.48 : 0;
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

export function trafficInput(car: ArcadeCar, track: BuiltTrack): InputState {
  const look = 0.028;
  const t = track.closed ? (car.progress + look) % 1 : Math.min(0.995, car.progress + look);
  const a = sampleAtT(track.samples, t);
  const tx = a.x + a.rx * car.aiOffset;
  const tz = a.z + a.rz * car.aiOffset;
  const err = wrapPi(Math.atan2(-(tx - car.x), -(tz - car.z)) - car.yaw);
  const steer = clamp(err * 1.35, -1, 1);
  const cruise = 12 + car.aiSkill * 7;
  return {
    steer: clamp(steer, -1, 1),
    throttle: car.speed < cruise ? 0.58 : 0.1,
    brake: Math.abs(err) > 0.65 && car.speed > 11 ? 0.45 : 0,
    drift: false,
    nitro: false,
  };
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
  const throttle = dist > 7 ? 1 : 0.4;
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
  const rad = 2.45;
  let peak = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = cars[i];
      const b = cars[j];
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const d = Math.hypot(dx, dz);
      if (d >= rad || d < 1e-4) continue;
      const nx = dx / d;
      const nz = dz / d;
      const ma = a.stats.mass || 1;
      const mb = b.stats.mass || 1;
      const m = ma + mb;
      const push = rad - d;
      a.x += nx * push * (mb / m);
      a.z += nz * push * (mb / m);
      b.x -= nx * push * (ma / m);
      b.z -= nz * push * (ma / m);
      const rel = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
      if (rel >= 0) continue;
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
      a.damage = clamp(a.damage + closing * 0.014 * (mb / m), 0, 1);
      b.damage = clamp(b.damage + closing * 0.014 * (ma / m), 0, 1);
      if (!a.isAi || !b.isAi) {
        peak = Math.max(peak, closing);
        const hit = Math.min(0.55, closing / 22);
        if (!a.isAi) a.impact = Math.max(a.impact, hit);
        if (!b.isAi) b.impact = Math.max(b.impact, hit);
      }
    }
  }
  return peak;
}
