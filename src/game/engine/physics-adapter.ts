// RSH-017: generated extraction from the accepted engine.ts.
// Do not change behavior here without an explicit later authority.
import * as THREE from "three";
import { createCarVisual, setCarLights, applyDamage } from "../car-mesh";
import { finishLine, overtakeLine } from "../dialog";
import { racePayout } from "../garage";
import { CARS } from "../cars";
import { clamp, hashStr } from "../math";
import { recordGhost, setDamage } from "../save";
import { sampleAtT } from "../spline";
import type { Collider, RaceResult } from "../types";
import { aiInput, ArcadeCar, copInput, separateCars, SURFACE_GRIP, trafficInput, updateDrafting } from "../vehicle";
import type { RaceEngine } from "../engine";
import type { EngineAdapterHost } from "./adapter-host";

function rumblePad(mag: number) {
  try {
    const gp = navigator.getGamepads?.()?.[0] as Gamepad & { vibrationActuator?: GamepadHapticActuator } | null;
    const act = gp?.vibrationActuator;
    if (!act?.playEffect) return;
    void act.playEffect("dual-rumble", {
      duration: 70 + mag * 140,
      strongMagnitude: Math.min(1, mag),
      weakMagnitude: Math.min(1, mag * 0.65),
      startDelay: 0,
    });
  } catch {
    /* no haptics */
  }
}

// RSH-017-BEGIN:fixed
export function fixed(this: EngineAdapterHost, dt: Parameters<RaceEngine["fixed"]>[0])
// RSH-017-BODY-BEGIN:fixed
{
    this.tickId += 1;
    if (this.replaying) {
      this.stepReplay(dt);
      return;
    }

    const wantRewind =
      (this.input.keys.has("KeyR") || this.input.touchRewind || !!navigator.getGamepads?.()?.[0]?.buttons[2]?.pressed) &&
      this.racing &&
      this.countdown <= 0 &&
      !this.player.finished &&
      this.rewindBuf.length > 1;
    if (wantRewind) {
      this.stepRewind(dt);
      return;
    }
    if (this.rewinding) this.post.setFilter(0);
    this.rewinding = false;

    if (this.countdown > 0) {
      const prev = this.countdown;
      this.countdown -= dt;
      if (Math.floor(prev) !== Math.floor(this.countdown) && this.countdown > 0) {
        this.audio.beep(this.countdown > 1 ? 520 : 780, 0.1, 0.16);
      }
      if (prev > 0 && this.countdown <= 0) {
        this.racing = true;
        this.audio.beep(980, 0.22, 0.2);
      }
    }

    if (this.freeze > 0) {
      this.freeze -= dt;
      this.recordReplay(dt);
      if (this.countdown > 0 || this.totalTime < 2.5) this.freeze = 0;
      else return;
    }
    this.impactCd = Math.max(0, this.impactCd - dt);

    const playerInput = this.input.poll();
    if (this.countdown > 0) {
      playerInput.throttle = 0;
      playerInput.brake = 0;
      playerInput.nitro = false;
      playerInput.drift = false;
    }

    if (this.racing && !this.player.finished) {
      this.totalTime += dt;
      this.lapTime += dt;
    }

    for (let i = 0; i < this.racers.length; i++) {
      const car = this.racers[i];
      const prev = car.progress;
      const inp = i === 0 ? playerInput : aiInput(car, this.built, this.player);
      if (i !== 0 && this.countdown > 0) {
        inp.throttle = 0;
        inp.brake = 0;
        inp.drift = false;
      }
      car.step(dt, inp, this.built, this.racing && this.countdown <= 0, this.world.colliders.concat(this.extraHits), this.world.streets, this.world.ramps);
      const ev = car.consumeCheckpoints(this.built, prev);
      if (ev.checkpoint && i === 0) {
        this.audio.checkpoint();
        this.ping = 1;
      }
      if (i === 0 && this.racing && this.countdown <= 0 && !this.player.finished) {
        this.sectorClock += dt;
        const idx = ev.lapComplete ? 0 : Math.min(2, Math.floor(this.player.progress * 3));
        if (ev.lapComplete) {
          this.closeSector(2);
          this.sectorIdx = 0;
        } else if (idx !== this.sectorIdx) {
          this.closeSector(this.sectorIdx);
          this.sectorIdx = idx;
        }
      }
      if (ev.lapComplete && i === 0) {
        this.laps.push(this.lapTime);
        if (this.lapTime < this.bestLap) this.bestLap = this.lapTime;
        this.lapTime = 0;
        if (car.lap >= this.totalLaps && this.mode !== "roam") this.endRace();
      }
      if (ev.lapComplete && this.mode === "knockout") this.checkKnockout();
    }

    this.applyAltitudeLook();

    if (this.mode === "roam") this.stampPois();

    if (this.player.wrongWayT > 0.45 && this.racing && !this.player.finished) {
      this.wrongBeep -= dt;
      if (this.wrongBeep <= 0) {
        this.audio.beep(220, 0.16, 0.12);
        this.wrongBeep = 0.9;
      }
    } else this.wrongBeep = 0;

    for (const cab of this.traffic) {
      const inp = trafficInput(cab, this.built);
      if (this.countdown > 0) {
        inp.throttle = 0;
        inp.brake = 0;
      }
      cab.step(dt, inp, this.built, this.racing && this.countdown <= 0, this.world.colliders.concat(this.extraHits), this.world.streets, this.world.ramps);
    }

    for (const cop of this.cops) {
      const inp = copInput(cop, this.built, this.player, this.heat);
      if (this.countdown > 0) {
        inp.throttle = 0;
        inp.brake = 0;
        inp.nitro = false;
      }
      cop.step(dt, inp, this.built, this.racing && this.countdown <= 0, this.world.colliders.concat(this.extraHits), this.world.streets, this.world.ramps);
    }

    if (this.mode === "heat" && this.racing && !this.player.finished) this.stepHeat(dt);

    if (this.racing && this.countdown <= 0 && !this.player.finished) {
      updateDrafting(this.player, this.racers);
    } else {
      this.player.drafting = false;
    }

    const hit = separateCars([...this.racers, ...this.traffic, ...this.cops]);
    if (this.player.nitroPulse) this.audio.whoosh();
    if (this.player.impact > 0.55 && this.impactCd <= 0) {
      this.audio.impact(this.player.impact);
      this.trauma = Math.min(1, this.trauma + this.player.impact * 0.7);
      this.freeze = 0.012;
      this.impactCd = 0.22;
      this.player.damage = Math.min(1, this.player.damage + this.player.impact * (this.player.lastHit === "building" ? 0.08 : 0.04));
      applyDamage(this.visuals[0], this.player.damage, this.player.dirt);
      rumblePad(this.player.impact);
      if (this.mode === "heat") this.bustAcc = Math.min(2.7, this.bustAcc + 0.38);
      this.combo = 0;
      this.comboHold = 0;
    } else if (hit > 10 && this.impactCd <= 0) {
      this.audio.impact(Math.min(1, hit / 18));
      this.trauma = Math.min(1, this.trauma + 0.28);
      this.impactCd = 0.18;
      this.player.damage = Math.min(1, this.player.damage + 0.05);
      applyDamage(this.visuals[0], this.player.damage, this.player.dirt);
      rumblePad(0.35);
    }

    this.audio.updateEngine(Math.abs(this.player.speed), this.player.boostT > 0, this.player.drifting, this.player.slip, this.player.rpm);
    this.audio.pulseMusic(this.world.night, dt);
    this.audio.updateSiren(this.mode === "heat" && this.racing && !this.busted && !this.escaping, dt);
    this.audio.updateRain(this.weather === "rain" || this.weather === "storm", this.weather === "storm");
    if (this.racing && !this.player.finished) {
      this.ghostAcc += dt;
      if (this.ghostAcc >= 0.16) {
        this.ghostAcc = 0;
        this.ghostBuf.push({ x: this.player.x, y: this.player.y, z: this.player.z, yaw: this.player.yaw });
      }
      this.recordReplay(dt);
    }
    if (this.player.drifting) this.trauma = Math.min(0.35, this.trauma + dt * 0.12);
    if (this.player.surfaceKind === "curb") this.trauma = Math.min(0.45, this.trauma + dt * 0.35);
    if (this.player.surfaceKind === "sand") this.trauma = Math.min(0.3, this.trauma + dt * 0.12);
    this.trauma = Math.max(0, this.trauma - dt * 2.4);
    if (this.racing && this.countdown <= 0) this.stepDriftCraft(dt);
    if (this.racing && this.countdown <= 0 && this.racers.length > 1 && !this.player.finished) {
      const place = this.standings().indexOf(this.player) + 1;
      if (place !== this.lastPlace && this.totalTime > 2.2) {
        this.banter = overtakeLine(place < this.lastPlace, this.opts.langHe, this.rivalIdx);
        this.banterT = 2.8;
      }
      this.lastPlace = place;
    }
  }
// RSH-017-BODY-END:fixed
// RSH-017-END:fixed

// RSH-017-BEGIN:stepDriftCraft
export function stepDriftCraft(this: EngineAdapterHost, dt: Parameters<RaceEngine["stepDriftCraft"]>[0])
// RSH-017-BODY-BEGIN:stepDriftCraft
{
    this.bonusT = Math.max(0, this.bonusT - dt);
    this.missCd = Math.max(0, this.missCd - dt);
    if (this.player.drifting) {
      if (!this.lastDrifting) this.combo = Math.min(12, Math.max(1, this.combo + 1));
      this.comboHold = 1.25;
    } else {
      this.comboHold -= dt;
      if (this.comboHold <= 0) this.combo = 0;
    }
    this.lastDrifting = this.player.drifting;
    this.player.comboMul = 1 + this.combo * 0.18;
    if (!this.player.drifting || this.missCd > 0 || this.player.finished) {
      if (this.bonusT <= 0) this.driftBonus = "";
      return;
    }
    const others = [...this.racers, ...this.traffic, ...this.cops];
    for (const o of others) {
      if (o === this.player || o.eliminated) continue;
      const d = Math.hypot(o.x - this.player.x, o.z - this.player.z);
      if (d < 2.3 || d > 6.4) continue;
      const rel = Math.abs(this.player.speed - o.speed);
      if (rel < 6) continue;
      const pts = Math.round((220 + (6.4 - d) * 80) * this.player.comboMul);
      this.player.driftScore += pts;
      this.combo = Math.min(12, this.combo + 1);
      this.missCd = 0.7;
      this.bonusT = 1.4;
      this.driftBonus = this.opts.langHe ? `ניר-מיס +${pts}` : `Near miss +${pts}`;
      this.trauma = Math.min(1, this.trauma + 0.22);
      break;
    }
  }
// RSH-017-BODY-END:stepDriftCraft
// RSH-017-END:stepDriftCraft

// RSH-017-BEGIN:standings
export function standings(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:standings
{
    return [...this.racers].sort((a, b) => b.raceScore() - a.raceScore());
  }
// RSH-017-BODY-END:standings
// RSH-017-END:standings

// RSH-017-BEGIN:stepHeat
export function stepHeat(this: EngineAdapterHost, dt: Parameters<RaceEngine["stepHeat"]>[0])
// RSH-017-BODY-BEGIN:stepHeat
{
    if (this.busted || this.player.finished) return;
    let nearest = Infinity;
    for (const cop of this.cops) {
      nearest = Math.min(nearest, Math.hypot(cop.x - this.player.x, cop.z - this.player.z));
    }
    this.wanted = 1 + Math.min(4, Math.floor(this.heatMax * 4.2));
    if (nearest < 18) {
      this.escaping = false;
      this.cooldown = Math.max(0, this.cooldown - dt * 0.55);
      const close = 1 - nearest / 18;
      const speedEase = 1.15 - clamp(Math.abs(this.player.speed) / 52, 0, 0.7);
      this.bustAcc += dt * close * speedEase * (0.85 + this.wanted * 0.08);
    } else if (nearest > 40) {
      this.escaping = true;
      this.cooldown = Math.min(1, this.cooldown + dt / 7.2);
      this.bustAcc = Math.max(0, this.bustAcc - dt * 0.45);
      if (this.cooldown >= 1) {
        this.wanted = Math.max(1, this.wanted - 1);
        this.heatMax = Math.max(0.12, this.heatMax - 0.22);
        this.cooldown = 0;
        this.escaping = false;
        this.bustAcc *= 0.35;
        this.banter = this.opts.langHe ? "איבדת אותם. קירור." : "You lost them. Cooldown.";
        this.banterT = 2.8;
        this.pushCopsBack();
      }
    } else {
      this.escaping = false;
      this.cooldown = Math.max(0, this.cooldown - dt * 0.18);
    }
    this.heat = clamp(this.bustAcc / 2.7, 0, 1);
    this.heatMax = Math.max(this.heatMax, this.heat);
    if (this.totalTime > 5) this.ensureCops(Math.min(this.lite ? 3 : 5, this.wanted + 1));
    this.blockCd = Math.max(0, this.blockCd - dt);
    if (this.heat > 0.32 && this.blockCd <= 0 && this.totalTime > 8 && !this.blockGroup) {
      this.spawnRoadblock();
    }
    this.tickRoadblock();
    if (this.bustAcc >= 2.7) {
      this.busted = true;
      this.player.finished = true;
      this.audio.bust();
      this.trauma = 1;
      this.endRace();
    }
  }
// RSH-017-BODY-END:stepHeat
// RSH-017-END:stepHeat

// RSH-017-BEGIN:pushCopsBack
export function pushCopsBack(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:pushCopsBack
{
    for (let i = 0; i < this.cops.length; i++) {
      const t = (this.player.progress - 0.12 - i * 0.03 + 1) % 1;
      this.cops[i].spawn(this.built, t, this.cops[i].aiOffset);
      this.cops[i].speed = 18;
    }
  }
// RSH-017-BODY-END:pushCopsBack
// RSH-017-END:pushCopsBack

// RSH-017-BEGIN:ensureCops
export function ensureCops(this: EngineAdapterHost, n: Parameters<RaceEngine["ensureCops"]>[0])
// RSH-017-BODY-BEGIN:ensureCops
{
    while (this.cops.length < n) {
      this.addCop(this.cops.length);
    }
  }
// RSH-017-BODY-END:ensureCops
// RSH-017-END:ensureCops

// RSH-017-BEGIN:addCop
export function addCop(this: EngineAdapterHost, i: Parameters<RaceEngine["addCop"]>[0])
// RSH-017-BODY-BEGIN:addCop
{
    const nyc = this.trackDef.city === "nyc";
    const color = 0xf2eee8;
    const accent = nyc ? 0x1a3a6a : 0x163048;
    const base = CARS[0];
    const def = {
      ...base,
      id: base.id,
      color,
      accent,
      maxSpeed: 54 + i * 1.1,
      accel: 5.4,
      brake: 32,
      turnRate: 2.35,
      grip: 0.94,
      drag: 0.48,
      mass: 1.18,
    };
    const cop = new ArcadeCar(def, nyc ? "NYPD" : "Police");
    cop.isAi = true;
    cop.isCop = true;
    cop.aiSkill = 0.96;
    cop.aiOffset = (i % 2 === 0 ? -1 : 1) * 2.4;
    cop.nitro = 0.55;
    cop.baseGrip = SURFACE_GRIP[this.trackDef.theme] ?? 1;
    cop.surfaceGrip = cop.baseGrip;
    cop.spawn(this.built, (this.player.progress - 0.1 - i * 0.03 + 1) % 1, cop.aiOffset);
    this.cops.push(cop);
    const vis = createCarVisual(color, accent, false, false, "gt", true);
    setCarLights(vis, this.world.night);
    this.scene.add(vis.group);
    this.copVis.push(vis);
  }
// RSH-017-BODY-END:addCop
// RSH-017-END:addCop

// RSH-017-BEGIN:spawnRoadblock
export function spawnRoadblock(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:spawnRoadblock
{
    const t = (this.player.progress + 0.15) % 1;
    const s = sampleAtT(this.built.samples, t);
    const yaw = Math.atan2(-s.tx, -s.tz);
    const gap = this.built.width * 0.22;
    const side = hashStr(`${this.opts.trackId}|${t.toFixed(4)}`) > 0.5 ? 1 : -1;
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a9098, roughness: 0.72, metalness: 0.12 });
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xe86020, roughness: 0.55 });
    const hits: Collider[] = [];
    const place = (lat: number, r: number) => {
      const x = s.x + s.rx * lat;
      const z = s.z + s.rz * lat;
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.15, 2.6), mat);
      box.position.set(x, s.y + 0.6, z);
      box.rotation.y = yaw;
      box.castShadow = !this.lite;
      group.add(box);
      hits.push({ x, z, r, kind: "barrier" });
    };
    place(side * (this.built.width * 0.38), 2.4);
    place(side * (this.built.width * 0.18), 2.2);
    place(-side * (this.built.width * 0.4), 2.1);
    for (let i = 0; i < 4; i++) {
      const lat = side * (0.08 + i * 0.12) * this.built.width;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.9, 6), coneMat);
      cone.position.set(s.x + s.rx * lat, s.y + 0.48, s.z + s.rz * lat);
      group.add(cone);
    }
    this.scene.add(group);
    this.blockGroup = group;
    this.extraHits = hits;
    this.blockT = t;
    this.blockCd = 20;
    this.banter = this.opts.langHe ? "מחסום קדימה. יש פער." : "Roadblock ahead. There's a gap.";
    this.banterT = 2.6;
  }
// RSH-017-BODY-END:spawnRoadblock
// RSH-017-END:spawnRoadblock

// RSH-017-BEGIN:tickRoadblock
export function tickRoadblock(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:tickRoadblock
{
    if (!this.blockGroup || this.blockT < 0) return;
    let ds = this.player.progress - this.blockT;
    if (ds < -0.5) ds += 1;
    if (ds > 0.12) this.clearRoadblock();
  }
// RSH-017-BODY-END:tickRoadblock
// RSH-017-END:tickRoadblock

// RSH-017-BEGIN:navAngle
export function navAngle(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:navAngle
{
    const p = this.player;
    const cps = this.built.checkpoints;
    if (!cps.length) return 0;
    const idx = ((p.nextCheckpoint % cps.length) + cps.length) % cps.length;
    const s = this.built.samples[Math.floor(cps[idx] * this.built.samples.length) % this.built.samples.length];
    const dx = s.x - p.x;
    const dz = s.z - p.z;
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    const rx = Math.cos(p.yaw);
    const rz = -Math.sin(p.yaw);
    return Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz);
  }
// RSH-017-BODY-END:navAngle
// RSH-017-END:navAngle

// RSH-017-BEGIN:stampPois
export function stampPois(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:stampPois
{
    if (this.player.finished || this.countdown > 0) return;
    const pois = this.trackDef.pois;
    for (let i = 0; i < pois.length; i++) {
      if (this.poiGot.has(i)) continue;
      const p = pois[i];
      if (Math.hypot(this.player.x - p.x, this.player.z - p.z) < p.r * 0.72) {
        this.poiGot.add(i);
        this.audio.checkpoint();
        this.ping = 1;
        this.banter = this.opts.langHe ? p.he : p.en;
        this.banterT = 2.2;
      }
    }
    if (pois.length > 0 && this.poiGot.size >= pois.length) this.endRace();
  }
// RSH-017-BODY-END:stampPois
// RSH-017-END:stampPois

// RSH-017-BEGIN:clearRoadblock
export function clearRoadblock(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:clearRoadblock
{
    if (this.blockGroup) {
      this.scene.remove(this.blockGroup);
      this.blockGroup.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
    }
    this.blockGroup = null;
    this.extraHits = [];
    this.blockT = -1;
  }
// RSH-017-BODY-END:clearRoadblock
// RSH-017-END:clearRoadblock

// RSH-017-BEGIN:checkKnockout
export function checkKnockout(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:checkKnockout
{
    const alive = this.racers.filter((r) => !r.eliminated && !r.finished);
    const leadLap = Math.max(0, ...alive.map((r) => r.lap));
    if (leadLap <= this.koMarked) return;
    this.koMarked = leadLap;
    if (alive.length <= 1) return;
    const last = [...alive].sort((a, b) => a.raceScore() - b.raceScore())[0];
    last.eliminated = true;
    last.finished = true;
    this.audio.impact(0.65);
    if (last === this.player) {
      this.endRace();
      return;
    }
    const remain = this.racers.filter((r) => !r.eliminated && !r.finished);
    if (remain.length === 1 && remain[0] === this.player) {
      this.player.lap = this.totalLaps;
      this.endRace();
    }
  }
// RSH-017-BODY-END:checkKnockout
// RSH-017-END:checkKnockout

// RSH-017-BEGIN:closeSector
export function closeSector(this: EngineAdapterHost, i: Parameters<RaceEngine["closeSector"]>[0])
// RSH-017-BODY-BEGIN:closeSector
{
    const t = this.sectorClock;
    this.sectorClock = 0;
    if (t < 0.4) return;
    const idx = ((i % 3) + 3) % 3;
    const best = this.bestSectors[idx];
    this.sectorDelta = Number.isFinite(best) && best < 1e8 ? t - best : 0;
    if (t < best) this.bestSectors[idx] = t;
  }
// RSH-017-BODY-END:closeSector
// RSH-017-END:closeSector

// RSH-017-BEGIN:endRace
export function endRace(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:endRace
{
    if (this.finishedSent || this.pendingResult) return;
    this.player.finished = true;
    this.audio.finish();
    this.audio.cheer();
    let place = this.standings().indexOf(this.player) + 1;
    if (this.mode === "heat") place = this.busted ? 4 : 1;
    if (this.mode === "time" || this.mode === "drift" || this.mode === "roam") place = 1;
    if (this.mode === "knockout" && this.player.eliminated) {
      place = this.racers.filter((r) => !r.eliminated).length + 1;
    }
    const eligible =
      !this.timeVoided &&
      !this.qaForcedFinish &&
      Number.isFinite(this.totalTime) &&
      this.totalTime >= 8;
    const resultDraft: RaceResult = {
      place,
      totalTime: this.totalTime,
      bestLap: Number.isFinite(this.bestLap) ? this.bestLap : this.totalTime,
      laps: this.laps.slice(),
      trackId: this.opts.trackId,
      carId: this.opts.carId,
      mode: this.mode,
      driftScore: Math.round(this.player.driftScore),
      busted: this.busted,
      heatMax: this.heatMax,
      eventId: this.opts.eventId,
      weather: this.weather,
      cash: 0,
      ghostBeaten: false,
      line: finishLine(place, this.busted, this.opts.langHe, this.rivalIdx),
      eligible,
    };
    this.cashWon = eligible ? racePayout(resultDraft) : 0;
    resultDraft.cash = this.cashWon;
    if (eligible && !this.busted) {
      this.ghostBeaten = recordGhost(this.opts.trackId, this.totalTime, this.ghostBuf);
      resultDraft.ghostBeaten = this.ghostBeaten;
    }
    setDamage(this.opts.carId, this.player.damage);
    this.pendingResult = resultDraft;
    this.emitFinish();
  }
// RSH-017-BODY-END:endRace
// RSH-017-END:endRace

// RSH-017-BEGIN:emitFinish
export function emitFinish(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:emitFinish
{
    if (this.finishedSent || !this.pendingResult) return;
    this.finishedSent = true;
    this.replaying = false;
    this.opts.onFinish(this.pendingResult);
  }
// RSH-017-BODY-END:emitFinish
// RSH-017-END:emitFinish

// RSH-017-BEGIN:skipReplay
export function skipReplay(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:skipReplay
{
    if (!this.replaying) return;
    this.replaying = false;
    this.emitFinish();
  }
// RSH-017-BODY-END:skipReplay
// RSH-017-END:skipReplay

// RSH-017-BEGIN:recordSnap
export function recordSnap(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:recordSnap
{
    this.replayBuf.push(this.racers.map((r) => ({ x: r.x, y: r.y, z: r.z, yaw: r.yaw, speed: r.speed })));
    if (this.replayBuf.length > 140) this.replayBuf.shift();
  }
// RSH-017-BODY-END:recordSnap
// RSH-017-END:recordSnap

// RSH-017-BEGIN:recordReplay
export function recordReplay(this: EngineAdapterHost, dt: Parameters<RaceEngine["recordReplay"]>[0])
// RSH-017-BODY-BEGIN:recordReplay
{
    if (!this.racing || this.player.finished) return;
    this.replayAcc += dt;
    if (this.replayAcc >= 0.1) {
      this.replayAcc = 0;
      this.recordSnap();
    }
    this.rewindAcc += dt;
    if (this.rewindAcc >= 0.05) {
      this.rewindAcc = 0;
      this.rewindBuf.push(this.takePack());
      if (this.rewindBuf.length > 100) this.rewindBuf.shift();
    }
  }
// RSH-017-BODY-END:recordReplay
// RSH-017-END:recordReplay

// RSH-017-BEGIN:takePack
export function takePack(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:takePack
{
    return {
      totalTime: this.totalTime,
      lapTime: this.lapTime,
      heat: this.heat,
      bustAcc: this.bustAcc,
      cooldown: this.cooldown,
      wanted: this.wanted,
      cars: this.racers.map((c) => c.snap()),
      traffic: this.traffic.map((c) => c.snap()),
      cops: this.cops.map((c) => c.snap()),
    };
  }
// RSH-017-BODY-END:takePack
// RSH-017-END:takePack

// RSH-017-BEGIN:applyPack
export function applyPack(this: EngineAdapterHost, p: Parameters<RaceEngine["applyPack"]>[0])
// RSH-017-BODY-BEGIN:applyPack
{
    this.totalTime = p.totalTime;
    this.lapTime = p.lapTime;
    this.heat = p.heat;
    this.bustAcc = p.bustAcc;
    this.cooldown = p.cooldown ?? this.cooldown;
    this.wanted = p.wanted ?? this.wanted;
    for (let i = 0; i < this.racers.length; i++) {
      const s = p.cars[i];
      if (s) this.racers[i].load(s);
    }
    for (let i = 0; i < this.traffic.length; i++) {
      const s = p.traffic[i];
      if (s) this.traffic[i].load(s);
    }
    for (let i = 0; i < this.cops.length; i++) {
      const s = p.cops[i];
      if (s) this.cops[i].load(s);
    }
    applyDamage(this.visuals[0], this.player.damage);
    const keepGhost = Math.max(0, Math.floor(this.totalTime / 0.16));
    if (this.ghostBuf.length > keepGhost) this.ghostBuf.length = keepGhost;
    const keepRep = Math.max(0, Math.floor(this.totalTime / 0.1));
    if (this.replayBuf.length > keepRep) this.replayBuf.length = keepRep;
  }
// RSH-017-BODY-END:applyPack
// RSH-017-END:applyPack

// RSH-017-BEGIN:stepRewind
export function stepRewind(this: EngineAdapterHost, dt: Parameters<RaceEngine["stepRewind"]>[0])
// RSH-017-BODY-BEGIN:stepRewind
{
    this.rewinding = true;
    this.rewindTickT += dt;
    if (this.rewindTickT > 0.08) {
      this.rewindTickT = 0;
      this.audio.rewindTick();
    }
    this.rewindAcc += dt;
    while (this.rewindAcc >= 0.05 && this.rewindBuf.length > 1) {
      this.rewindAcc -= 0.05;
      this.rewindBuf.pop();
      const last = this.rewindBuf[this.rewindBuf.length - 1];
      if (last) this.applyPack(last);
    }
    this.post.setFilter(0);
  }
// RSH-017-BODY-END:stepRewind
// RSH-017-END:stepRewind

// RSH-017-BEGIN:stepReplay
export function stepReplay(this: EngineAdapterHost, dt: Parameters<RaceEngine["stepReplay"]>[0])
// RSH-017-BODY-BEGIN:stepReplay
{
    const dur = this.replayBuf.length * 0.1;
    const slow = this.replayT < 1.35 || this.replayT > dur - 2.1;
    this.replayT += slow ? dt * 0.42 : dt;
    this.replaySlow = slow;
    if (this.replayT >= dur) {
      this.skipReplay();
      return;
    }
    const i = Math.min(this.replayBuf.length - 1, Math.floor(this.replayT / 0.1));
    const a = this.replayBuf[i];
    const b = this.replayBuf[Math.min(this.replayBuf.length - 1, i + 1)];
    const f = Math.min(1, (this.replayT - i * 0.1) / 0.1);
    for (let c = 0; c < this.racers.length; c++) {
      const ra = a[c];
      const rb = b[c] ?? ra;
      if (!ra) continue;
      const car = this.racers[c];
      car.x = ra.x + (rb.x - ra.x) * f;
      car.y = ra.y + (rb.y - ra.y) * f;
      car.z = ra.z + (rb.z - ra.z) * f;
      let dy = rb.yaw - ra.yaw;
      while (dy > Math.PI) dy -= Math.PI * 2;
      while (dy < -Math.PI) dy += Math.PI * 2;
      car.yaw = ra.yaw + dy * f;
      car.speed = ra.speed + (rb.speed - ra.speed) * f;
    }
    if (Math.floor(this.replayT / 2.8) !== Math.floor((this.replayT - dt) / 2.8)) {
      this.camMode = 0;
      this.hood = false;
    }
  }
// RSH-017-BODY-END:stepReplay
// RSH-017-END:stepReplay

