// RSH-017: generated extraction from the accepted engine.ts.
// Do not change behavior here without an explicit later authority.
import * as THREE from "three";
import { RADIO } from "../audio";
import { pulsePolice, setCarLights, updateCarVisual, applyDamage } from "../car-mesh";
import { sampleGhost, sampleGhostLoop } from "../garage";
import { clamp, expSmooth, lerp, hash01 } from "../math";
import { bakeEnv, createPost } from "../postfx";
import { PHYSICS_HZ } from "../physics";
import { nearestIndex } from "../spline";
import { nearestPoi, nightAmt, streetName, todLabel } from "../tracks";
import { bindRoadCompile } from "../roadShader";
import { FOG, fogKey, LOOKS, lookFromFlags } from "../../rendering/EnvironmentState";
import { gfxPassFlags } from "../../rendering/DynamicQualityController";
import { exportPhotoPng } from "../photo-export";
import type { RaceEngine } from "../engine";
import type { EngineAdapterHost } from "./adapter-host";

// RSH-017-BEGIN:upgradeGraphics
export function upgradeGraphics(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:upgradeGraphics
{
    if (this.disposed) return;
    if (!this.captureSceneEnv()) {
      try {
        const env = bakeEnv(this.renderer, this.world.night);
        this.setEnvRT(env);
        this.scene.environment = env.texture;
      } catch {
        /* keep fallback */
      }
    }
    this.scene.environmentIntensity = this.world.night ? 0.52 : 0.88;
    if (this.disposed) return;
    try {
      const post = createPost(this.renderer, this.scene, this.camera, this.world.night, this.lite);
      this.leases.release("post");
      this.post.dispose();
      this.post = post;
      this.leases.retain("post", () => this.post.dispose());
      this.post.setTier(this.quality);
      this.applyGfxStep();
      this.onResize();
    } catch {
      /* keep direct render */
    }
  }
// RSH-017-BODY-END:upgradeGraphics
// RSH-017-END:upgradeGraphics

// RSH-017-BEGIN:enterPhoto
export function enterPhoto(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:enterPhoto
{
    if (this.replaying || this.disposed) return;
    this.photo = true;
    this.paused = true;
    this.photoYaw = this.player.yaw + Math.PI;
    this.photoPitch = 0.22;
    this.photoDist = 8;
    this.photoHide = false;
    this.photoLock = null;
    this.drivePR = this.renderer.getPixelRatio();
    this.driveExposure = this.renderer.toneMappingExposure;
    const cap = Math.min(window.devicePixelRatio || 1, 1.35);
    this.renderer.setPixelRatio(Math.max(this.drivePR, cap));
    this.renderer.toneMappingExposure = this.driveExposure * 1.05;
    this.onResize();
    this.pushHud();
  }
// RSH-017-BODY-END:enterPhoto
// RSH-017-END:enterPhoto

// RSH-017-BEGIN:exitPhoto
export function exitPhoto(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:exitPhoto
{
    this.photo = false;
    this.photoHide = false;
    this.photoLock = null;
    this.post.setFilter(0);
    this.renderer.setPixelRatio(this.drivePR);
    this.renderer.toneMappingExposure = this.driveExposure;
    this.onResize();
    this.pushHud();
  }
// RSH-017-BODY-END:exitPhoto
// RSH-017-END:exitPhoto

// RSH-017-BEGIN:frameWorld
export function frameWorld(this: EngineAdapterHost, x: Parameters<RaceEngine["frameWorld"]>[0], z: Parameters<RaceEngine["frameWorld"]>[1], y: Parameters<RaceEngine["frameWorld"]>[2] = 52, camY: Parameters<RaceEngine["frameWorld"]>[3] = 22, back: Parameters<RaceEngine["frameWorld"]>[4] = 28, fov: Parameters<RaceEngine["frameWorld"]>[5] = 40)
// RSH-017-BODY-BEGIN:frameWorld
{
    this.enterPhoto();
    this.photoHide = true;
    const n = nearestIndex(this.built.samples, x, z, 0);
    const s = this.built.samples[n.index];
    this.player.spawn(this.built, n.index / Math.max(1, this.built.samples.length - 1), 0);
    this.photoLock = {
      px: s.x - s.tx * back,
      py: camY,
      pz: s.z - s.tz * back,
      lx: x,
      ly: y,
      lz: z,
      fov,
    };
    this.pushHud();
  }
// RSH-017-BODY-END:frameWorld
// RSH-017-END:frameWorld

// RSH-017-BEGIN:isPhoto
export function isPhoto(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:isPhoto
{
    return this.photo;
  }
// RSH-017-BODY-END:isPhoto
// RSH-017-END:isPhoto

// RSH-017-BEGIN:capturePhoto
export function capturePhoto(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:capturePhoto
{
    this.snapPhoto = true;
  }
// RSH-017-BODY-END:capturePhoto
// RSH-017-END:capturePhoto

// RSH-017-BEGIN:flushSnap
export function flushSnap(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:flushSnap
{
    if (!this.snapPhoto) return;
    this.snapPhoto = false;
    try {
      exportPhotoPng(this.renderer.domElement);
    } catch {
      /* ignore */
    }
  }
// RSH-017-BODY-END:flushSnap
// RSH-017-END:flushSnap

// RSH-017-BEGIN:cyclePhotoFilter
export function cyclePhotoFilter(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:cyclePhotoFilter
{
    this.photoFilter = (this.photoFilter + 1) % this.filterNames.length;
    this.post.setFilter(this.photoFilter);
    this.pushHud();
  }
// RSH-017-BODY-END:cyclePhotoFilter
// RSH-017-END:cyclePhotoFilter

// RSH-017-BEGIN:togglePhotoHud
export function togglePhotoHud(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:togglePhotoHud
{
    this.photoHide = !this.photoHide;
    this.pushHud();
  }
// RSH-017-BODY-END:togglePhotoHud
// RSH-017-END:togglePhotoHud

// RSH-017-BEGIN:setAutoCycle
export function setAutoCycle(this: EngineAdapterHost, on: Parameters<RaceEngine["setAutoCycle"]>[0])
// RSH-017-BODY-BEGIN:setAutoCycle
{
    this.autoCycle = on;
    this.clockBake = 0;
    this.pushHud();
  }
// RSH-017-BODY-END:setAutoCycle
// RSH-017-END:setAutoCycle

// RSH-017-BEGIN:getAutoCycle
export function getAutoCycle(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:getAutoCycle
{
    return this.autoCycle;
  }
// RSH-017-BODY-END:getAutoCycle
// RSH-017-END:getAutoCycle

// RSH-017-BEGIN:setNight
export function setNight(this: EngineAdapterHost, night: Parameters<RaceEngine["setNight"]>[0])
// RSH-017-BODY-BEGIN:setNight
{
    if (this.disposed) return;
    this.clock = night ? 0.9 : 0.5;
    this.applyClockSky(false);
  }
// RSH-017-BODY-END:setNight
// RSH-017-END:setNight

// RSH-017-BEGIN:applyLook
export function applyLook(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:applyLook
{
    const n = nightAmt(this.clock);
    const morning = n <= 0.5 && this.clock < 0.38;
    const look = lookFromFlags(n > 0.5, this.weather, morning);
    this.gfx.setEnvironment(LOOKS[look].exposure);
    const spec = FOG[fogKey(this.trackDef.theme, this.trackDef.id)];
    this.fog.color.setHex(n > 0.5 ? spec.nightCol : spec.dayCol);
    this.fog.density = n > 0.5 ? spec.night : spec.day;
    this.scene.fog = this.fog;
    this.applyAltitudeLook();
  }
// RSH-017-BODY-END:applyLook
// RSH-017-END:applyLook

// RSH-017-BEGIN:applyClockSky
export function applyClockSky(this: EngineAdapterHost, rebake: Parameters<RaceEngine["applyClockSky"]>[0])
// RSH-017-BODY-BEGIN:applyClockSky
{
    if (this.disposed) return;
    this.world.setClock(this.clock);
    const n = nightAmt(this.clock);
    this.applyLook();
    this.scene.background = new THREE.Color(n > 0.5 ? 0x2a4a6c : 0x3c9ee0);
    this.scene.environmentIntensity = n > 0.5 ? 0.52 : 0.7;
    this.post.setNight(n > 0.5);
    const lamps = n > 0.42;
    for (const vis of this.visuals) setCarLights(vis, lamps);
    for (const vis of this.trafficVis) setCarLights(vis, lamps);
    for (const vis of this.copVis) setCarLights(vis, lamps);
    if (!rebake || this.soft) {
      this.pushHud();
      return;
    }
    if (!this.captureSceneEnv()) {
      try {
        const env = bakeEnv(this.renderer, this.world.night);
        this.setEnvRT(env);
        this.scene.environment = env.texture;
      } catch {
        /* keep previous env */
      }
    }
    this.pushHud();
  }
// RSH-017-BODY-END:applyClockSky
// RSH-017-END:applyClockSky

// RSH-017-BEGIN:captureSceneEnv
export function captureSceneEnv(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:captureSceneEnv
{
    if (this.disposed || this.soft || this.quality === "low") return false;
    try {
      const size = this.trackDef.id === "ayalon" ? 128 : 96;
      const rt = new THREE.WebGLCubeRenderTarget(size);
      const cam = new THREE.CubeCamera(4, 400, rt);
      cam.position.set(this.player.x, this.player.y + 26, this.player.z);
      const hidden: THREE.Object3D[] = [];
      const stash = (g: THREE.Object3D) => {
        if (g.visible) {
          g.visible = false;
          hidden.push(g);
        }
      };
      for (const v of this.visuals) stash(v.group);
      for (const v of this.trafficVis) stash(v.group);
      for (const v of this.copVis) stash(v.group);
      cam.update(this.renderer, this.scene);
      for (const g of hidden) g.visible = true;
      this.leases.release("boot-env");
      this.scene.environment = rt.texture;
      this.leases.retain("boot-env", () => rt.dispose());
      return true;
    } catch {
      return false;
    }
  }
// RSH-017-BODY-END:captureSceneEnv
// RSH-017-END:captureSceneEnv

// RSH-017-BEGIN:applyAltitudeLook
export function applyAltitudeLook(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:applyAltitudeLook
{
    const spec = FOG[fogKey(this.trackDef.theme, this.trackDef.id)];
    if (this.trackDef.id !== "ramon" && this.trackDef.id !== "hermon" && this.trackDef.id !== "jerusalem" && this.trackDef.id !== "scopus" && this.trackDef.theme !== "carmel") return;
    const n = nightAmt(this.clock);
    if (n > 0.5) return;
    if (this.trackDef.id === "hermon") {
      const u = clamp(this.player.y / 110, 0, 1);
      this.fog.density = lerp(spec.day, spec.night * 0.62, u);
      this.fog.color.lerp(new THREE.Color(0xc8d8e8), u * 0.28);
      return;
    }
    if (this.trackDef.id === "scopus") {
      const u = clamp(this.player.y / 52, 0, 1);
      this.fog.density = lerp(spec.day, spec.night * 0.5, u);
      this.fog.color.lerp(new THREE.Color(0xd0dce8), u * 0.2);
      return;
    }
    if (this.trackDef.id === "jerusalem") {
      const u = clamp(this.player.y / 54, 0, 1);
      this.fog.density = lerp(spec.day, spec.day * 0.85, u);
      return;
    }
    if (this.trackDef.theme === "carmel") {
      const u = clamp(this.player.y / 48, 0, 1);
      this.fog.density = lerp(spec.day, spec.night * 0.7, u);
      return;
    }
    const u = clamp(1 - this.player.y / 110, 0, 1);
    this.fog.density = lerp(spec.day, spec.night * 0.9, u);
    this.fog.color.lerp(new THREE.Color(0xd8c4a0), u * 0.4);
  }
// RSH-017-BODY-END:applyAltitudeLook
// RSH-017-END:applyAltitudeLook

// RSH-017-BEGIN:updateProbe
export function updateProbe(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:updateProbe
{
    if (!this.probeCam || !this.probeRT || this.soft) return;
    this.probeTick++;
    if (this.probeTick % 8 !== 1) return;
    for (const vis of this.visuals) vis.group.visible = false;
    this.probeCam.position.set(this.player.x, this.player.y + 1.05, this.player.z);
    this.probeCam.update(this.renderer, this.scene);
    const inten = nightAmt(this.clock) > 0.5 ? 0.8 : 1.2;
    for (const vis of this.visuals) {
      vis.group.visible = true;
      vis.group.traverse((o) => {
        const mesh = o as THREE.Mesh;
        const mat = mesh.material as THREE.MeshPhysicalMaterial | undefined;
        if (mat && mat.isMeshPhysicalMaterial) {
          mat.envMap = this.probeRT!.texture;
          if (mat === vis.bodyMat) mat.envMapIntensity = inten;
        }
      });
    }
  }
// RSH-017-BODY-END:updateProbe
// RSH-017-END:updateProbe

// RSH-017-BEGIN:applyGfxStep
export function applyGfxStep(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:applyGfxStep
{
    const s = this.dyn.step;
    const f = gfxPassFlags(s);
    this.droppedTier = s > 0;
    this.world.setPlanar(f.planar);
    this.post.setBloom(f.bloom);
    this.csmMuted = !f.csm || this.quality === "low" || this.soft;
    const base = this.lite ? 1 : this.quality === "mid" ? 0.75 : 0.85;
    const scale = Math.max(0.5, base * Math.pow(0.85, f.pixelExtra));
    const mobile = typeof navigator !== "undefined" && /mobi|android|iphone|ipad/i.test(navigator.userAgent);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1) * scale);
    this.onResize();
    if (import.meta.env.DEV) console.info("[gfx]", s, "planar", f.planar, "bloom", f.bloom, "csm", f.csm, "px", scale.toFixed(2));
    this.trimCsm();
  }
// RSH-017-BODY-END:applyGfxStep
// RSH-017-END:applyGfxStep

// RSH-017-BEGIN:stepPhoto
export function stepPhoto(this: EngineAdapterHost, dt: Parameters<RaceEngine["stepPhoto"]>[0])
// RSH-017-BODY-BEGIN:stepPhoto
{
    if (this.photoLock) {
      const L = this.photoLock;
      this.camera.position.set(L.px, L.py, L.pz);
      this.camera.lookAt(L.lx, L.ly, L.lz);
      if (Math.abs(this.camera.fov - L.fov) > 0.2) {
        this.camera.fov = L.fov;
        this.camera.updateProjectionMatrix();
      }
      this.post.setFilter(this.photoFilter);
      return;
    }
    const inp = this.input.poll();
    this.photoYaw += inp.steer * 1.55 * dt;
    this.photoPitch = clamp(this.photoPitch + (inp.throttle - inp.brake) * 0.7 * dt, -0.4, 0.85);
    if (inp.nitro) this.photoDist = Math.max(3.2, this.photoDist - 9 * dt);
    if (inp.drift) this.photoDist = Math.min(22, this.photoDist + 9 * dt);
    const p = this.player;
    const fx = -Math.sin(this.photoYaw);
    const fz = -Math.cos(this.photoYaw);
    const cy = Math.sin(this.photoPitch);
    const cz = Math.cos(this.photoPitch);
    this.camera.position.set(p.x - fx * this.photoDist * cz, p.y + 1.1 + this.photoDist * cy, p.z - fz * this.photoDist * cz);
    this.camera.lookAt(p.x, p.y + 0.55, p.z);
    if (Math.abs(this.camera.fov - (48 + this.fovExtra)) > 0.2) {
      this.camera.fov = 48 + this.fovExtra;
      this.camera.updateProjectionMatrix();
    }
    this.post.setFilter(this.photoFilter);
    for (let i = 0; i < this.racers.length; i++) {
      const c = this.racers[i];
      updateCarVisual(this.visuals[i], c.yaw, 0, 0, 0, dt, c.x, c.y, c.z, c.pitch, 0);
    }
  }
// RSH-017-BODY-END:stepPhoto
// RSH-017-END:stepPhoto

// RSH-017-BEGIN:present
export function present(this: EngineAdapterHost, dt: Parameters<RaceEngine["present"]>[0])
// RSH-017-BODY-BEGIN:present
{
    const p = this.player;
    if (Math.abs(p.dirt - this.lastDirt) > 0.035) {
      applyDamage(this.visuals[0], p.damage, p.dirt);
      this.lastDirt = p.dirt;
    }
    for (let i = 0; i < this.racers.length; i++) {
      const c = this.racers[i];
      const steer = i === 0 ? this.input.poll().steer : clamp(c.roll * -3, -1, 1);
      updateCarVisual(this.visuals[i], c.yaw, c.speed, steer, i === 0 ? this.input.poll().brake : 0, dt, c.x, c.y, c.z, c.roll, c.pitch, c.surfaceKind);
      const blob = this.blobs[i];
      if (blob) {
        const sun = this.world.sunDir;
        blob.position.set(c.x - sun.x * 0.7, c.y + 0.04, c.z - sun.z * 0.7);
        const stretch = 1.05 + Math.abs(c.speed) * 0.014;
        blob.scale.set(stretch, 1, 0.92 + Math.abs(c.speed) * 0.008);
        blob.rotation.y = c.yaw;
        blob.visible = !c.eliminated;
        (blob.material as THREE.MeshBasicMaterial).opacity = (this.world.night ? 0.68 : 0.5) * (c.airborne ? 0.12 : 1);
      }
    }
    for (let i = 0; i < this.traffic.length; i++) {
      const c = this.traffic[i];
      updateCarVisual(this.trafficVis[i], c.yaw, c.speed, 0, 0, dt, c.x, c.y, c.z, c.roll, c.pitch, c.surfaceKind);
    }
    for (let i = 0; i < this.cops.length; i++) {
      const c = this.cops[i];
      updateCarVisual(this.copVis[i], c.yaw, c.speed, 0, 0, dt, c.x, c.y, c.z, c.roll, c.pitch);
      pulsePolice(this.copVis[i], this.nowSec + i * 0.17);
    }

    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    if (p.drifting || p.impact > 0.18 || p.wheelsLocked) {
      const spread = p.impact > 0.18 ? 1.4 : 0.8;
      for (let k = 0; k < 8; k++) {
        const i = Math.floor(hash01(this.tickId, k, 1) * 60) * 3;
        this.sparkPos[i] = p.x - fx * 1.6 + (hash01(this.tickId, k, 2) - 0.5) * spread;
        this.sparkPos[i + 1] = p.y + 0.12 + hash01(this.tickId, k, 3) * 0.35;
        this.sparkPos[i + 2] = p.z - fz * 1.6 + (hash01(this.tickId, k, 4) - 0.5) * spread;
      }
      (this.sparks.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      this.sparks.visible = true;
      const sm = this.sparks.material as THREE.PointsMaterial;
      sm.color.setHex(p.lastHit === "building" ? 0xff7a38 : p.lastHit === "car" ? 0xf4f6f8 : 0xffe080);
      sm.size = p.lastHit === "building" ? 0.26 : 0.16;
      this.skidAcc += Math.abs(p.speed) * dt;
      if (this.skidAcc > 0.55) {
        this.skidAcc = 0;
        this.skidDummy.position.set(p.x - fx * 1.5, p.y + 0.03, p.z - fz * 1.5);
        this.skidDummy.rotation.y = p.yaw;
        this.skidDummy.scale.set(1, 1, 1.1 + Math.abs(p.speed) * 0.018);
        this.skidDummy.updateMatrix();
        const idx = this.skidI % 180;
        this.skidMesh.setMatrixAt(idx, this.skidDummy.matrix);
        this.skidI += 1;
        this.skidMesh.count = Math.min(180, this.skidI);
        this.skidMesh.instanceMatrix.needsUpdate = true;
      }
    } else {
      this.sparks.visible = false;
    }

    this.ping = Math.max(0, this.ping - dt * 1.7);
    const cps = this.built.checkpoints;
    const gt = cps[this.player.nextCheckpoint] ?? 0;
    const gs = this.built.samples[Math.floor(gt * this.built.samples.length) % this.built.samples.length];
    this.gate.position.set(gs.x, gs.y + 2.55, gs.z);
    this.gate.lookAt(gs.x + gs.tx, gs.y + 2.55, gs.z + gs.tz);
    this.gate.scale.setScalar(1 + this.ping * 0.18);
    (this.gate.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.15 + this.ping * 2.2;
    this.gate.visible = this.racing && !this.player.finished && !this.replaying;

    if ((p.drifting || (!p.onTrack && Math.abs(p.speed) > 10) || (this.weather !== "clear" && Math.abs(p.speed) > 14)) && this.smokes.length < 64) {
      if (hash01(this.tickId, 21) < (!p.onTrack ? 0.88 : 0.55)) {
        this.smokes.push({
          x: p.x - fx * 1.7 + (hash01(this.tickId, 22) - 0.5) * 0.9,
          y: p.y + 0.08,
          z: p.z - fz * 1.7 + (hash01(this.tickId, 23) - 0.5) * 0.9,
          s: 0.45,
          life: 1,
          yaw: p.yaw,
        });
      }
    }
    for (let i = this.smokes.length - 1; i >= 0; i--) {
      const s = this.smokes[i];
      s.life -= dt * 1.15;
      s.s += dt * 1.6;
      s.y += dt * 0.35;
      if (s.life <= 0) this.smokes.splice(i, 1);
    }
    for (let i = 0; i < this.smokes.length; i++) {
      const s = this.smokes[i];
      this.smokeDummy.position.set(s.x, s.y, s.z);
      this.smokeDummy.rotation.y = s.yaw;
      this.smokeDummy.scale.setScalar(s.s);
      this.smokeDummy.updateMatrix();
      this.smokeMesh.setMatrixAt(i, this.smokeDummy.matrix);
    }
    this.smokeMesh.count = this.smokes.length;
    this.smokeMesh.instanceMatrix.needsUpdate = true;
    const off = !p.onTrack;
    (this.smokeMesh.material as THREE.MeshBasicMaterial).opacity = this.weather !== "clear" ? 0.32 : off ? 0.38 : 0.24;
    (this.smokeMesh.material as THREE.MeshBasicMaterial).color.setHex(off ? 0x8a6a48 : this.weather !== "clear" ? 0xc8d4dc : 0xb0b8be);

    if (p.boostT > 0 || p.drafting) {
      for (let k = 0; k < 10; k++) {
        const i = k * 3;
        this.boostPos[i] = p.x - fx * (1.8 + k * 0.12) + (hash01(this.tickId, k, 31) - 0.5) * 0.35;
        this.boostPos[i + 1] = p.y + 0.28 + hash01(this.tickId, k, 32) * 0.12;
        this.boostPos[i + 2] = p.z - fz * (1.8 + k * 0.12) + (hash01(this.tickId, k, 33) - 0.5) * 0.35;
      }
      (this.boostPts.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      this.boostPts.visible = true;
    } else {
      this.boostPts.visible = false;
    }

    this.snapCamera(false, dt);
    this.world.followShadows(this.player.x, this.player.y, this.player.z);
    this.updateCsm();
    this.world.followMirror(this.player.x, this.player.y, this.player.z, this.player.yaw);

    if (this.rainMesh && this.rainPos) {
      this.rainMesh.visible = this.quality !== "low";
      const cam = this.camera.position;
      const fall = this.trackDef.theme === "snow" ? 9 : this.weather === "hamsin" ? 5 : this.weather === "storm" ? 38 : 26;
      const n = this.rainPos.length / 3;
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        this.rainPos[i3 + 1] -= fall * dt;
        if (this.weather === "hamsin") this.rainPos[i3] += 6 * dt;
        if (this.rainPos[i3 + 1] < cam.y - 4) {
          this.rainPos[i3] = cam.x + (hash01(this.tickId, i, 41) - 0.5) * 34;
          this.rainPos[i3 + 1] = cam.y + 8 + hash01(this.tickId, i, 42) * 10;
          this.rainPos[i3 + 2] = cam.z + (hash01(this.tickId, i, 43) - 0.5) * 34;
        }
      }
      (this.rainMesh.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }

    if (this.ghostVis && this.ghostFrames.length && !this.replaying) {
      const g = sampleGhost(this.ghostFrames, this.racing ? this.totalTime : 0);
      if (g) {
        this.ghostVis.group.visible = true;
        updateCarVisual(this.ghostVis, g.yaw, 18, 0, 0, dt, g.x, g.y, g.z, 0, 0);
        this.ghostDelta = this.totalTime - this.ghostFrames.length * 0.16 * this.player.progress;
      }
    }
    if (this.rivalGhostVis && this.rivalGhostFrames.length && !this.replaying) {
      const g = sampleGhostLoop(this.rivalGhostFrames, this.racing ? this.totalTime : 0);
      if (g) {
        this.rivalGhostVis.group.visible = true;
        updateCarVisual(this.rivalGhostVis, g.yaw, 22, 0, 0, dt, g.x, g.y, g.z, 0, 0);
        const lapT = this.rivalGhostFrames.length * 0.16;
        const mine = (this.player.progress + this.player.lap) * lapT;
        this.rivalGhostDelta = this.totalTime - mine;
      }
    }
  }
// RSH-017-BODY-END:present
// RSH-017-END:present

// RSH-017-BEGIN:snapCamera
export function snapCamera(this: EngineAdapterHost, instant: Parameters<RaceEngine["snapCamera"]>[0], dt: Parameters<RaceEngine["snapCamera"]>[1] = 0.016)
// RSH-017-BODY-BEGIN:snapCamera
{
    const p = this.player;
    this.lookBack = !this.replaying && (this.input.keys.has("KeyB") || !!navigator.getGamepads?.()?.[0]?.buttons[11]?.pressed || !!navigator.getGamepads?.()?.[0]?.buttons[13]?.pressed);
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    const rx = Math.cos(p.yaw);
    const rz = -Math.sin(p.yaw);
    const dir = this.lookBack ? -1 : 1;
    const mode = this.lookBack ? 0 : this.camMode;
    let follow = 9.2 + clamp(Math.abs(p.speed) / 22, 0, 2.6);
    let height = 2.28;
    let side = 0;
    if (mode === 1) {
      follow = 0.18;
      height = 1.16;
      side = 0.36;
    } else if (mode === 2) {
      follow = 1.35;
      height = 0.52;
    } else if (mode === 3) {
      follow = 0.4;
      height = 16;
      side = 0.2;
    }
    this.desired.set(p.x - fx * follow * dir + rx * side, p.y + height, p.z - fz * follow * dir + rz * side);
    if (instant) this.cam.copy(this.desired);
    else {
      const k = mode === 1 || mode === 2 || this.lookBack ? 14 : mode === 3 ? 4.5 : 7.5;
      this.cam.x = expSmooth(this.cam.x, this.desired.x, k, dt);
      this.cam.y = expSmooth(this.cam.y, this.desired.y, k, dt);
      this.cam.z = expSmooth(this.cam.z, this.desired.z, k, dt);
    }
    if (mode !== 3 && mode !== 1 && p.onTrack && !p.sideStreet && this.mode !== "roam") {
      const near = nearestIndex(this.built.samples, this.cam.x, this.cam.z, p.sampleIndex);
      const maxCam = this.built.width / 2 + 7;
      if (near.dist > maxCam) {
        const s = this.built.samples[near.index];
        const nx = (this.cam.x - s.x) / (near.dist || 1);
        const nz = (this.cam.z - s.z) / (near.dist || 1);
        this.cam.x = s.x + nx * maxCam;
        this.cam.z = s.z + nz * maxCam;
      }
      for (const c of this.world.colliders) {
        const dx = this.cam.x - c.x;
        const dz = this.cam.z - c.z;
        const d = Math.hypot(dx, dz);
        const keep = c.r + 2.4;
        if (d < keep && d > 0.0001) {
          this.cam.x = c.x + (dx / d) * keep;
          this.cam.z = c.z + (dz / d) * keep;
        }
      }
      const road = this.built.samples[p.sampleIndex];
      if (this.cam.y < road.y + 1.55) this.cam.y = road.y + 1.55;
    }
    const shake = this.replaying ? 0 : this.trauma * this.trauma;
    this.camera.position.set(
      this.cam.x + Math.sin(this.tickId * 0.73) * shake * 0.14,
      this.cam.y + Math.cos(this.tickId * 1.17) * shake * 0.08,
      this.cam.z + Math.sin(this.tickId * 0.91) * shake * 0.14,
    );
    const lookAhead = mode === 3 ? 0.2 : mode === 1 ? 9 : 8 + clamp(Math.abs(p.speed) / 14, 0, 8);
    this.look.set(p.x + fx * lookAhead * dir, p.y + (mode === 3 ? 0.4 : mode === 1 ? 0.98 : 0.62), p.z + fz * lookAhead * dir);
    this.camera.lookAt(this.look);
    const fov =
      (mode === 1 ? 64 : mode === 2 ? 78 : mode === 3 ? 52 : 58 + clamp(Math.abs(p.speed) / 14, 0, 8) + (p.boostT > 0 || p.drafting ? 3 : 0)) +
      this.fovExtra;
    if (Math.abs(this.camera.fov - fov) > 0.2) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
  }
// RSH-017-BODY-END:snapCamera
// RSH-017-END:snapCamera

// RSH-017-BEGIN:setFovExtra
export function setFovExtra(this: EngineAdapterHost, v: Parameters<RaceEngine["setFovExtra"]>[0])
// RSH-017-BODY-BEGIN:setFovExtra
{
    this.fovExtra = clamp(v, 0, 12);
  }
// RSH-017-BODY-END:setFovExtra
// RSH-017-END:setFovExtra

// RSH-017-BEGIN:pushHud
export function pushHud(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:pushHud
{
    const order = this.standings();
    const place = order.indexOf(this.player) + 1;
    const lapEst = this.bestLap > 12 && this.bestLap < 400 ? this.bestLap : 75;
    let rivalName = "";
    let rivalGap = 0;
    if (order.length > 1) {
      const rival = place > 1 ? order[place - 2] : order[1];
      if (rival) {
        rivalName = rival.name;
        const ds = rival.lap + rival.progress - (this.player.lap + this.player.progress);
        rivalGap = place > 1 ? ds * lapEst : -ds * lapEst;
      }
    }
    this.opts.onHud({
      speedKmh: Math.abs(this.player.speed) * 3.6,
      lap: Math.min(this.totalLaps, this.player.lap + 1),
      totalLaps: this.totalLaps,
      pointToPoint: !!this.trackDef.open,
      lapTime: this.lapTime,
      bestLap: Number.isFinite(this.bestLap) ? this.bestLap : 0,
      totalTime: this.totalTime,
      position: place,
      totalRacers: this.racers.length,
      street: streetName(this.trackDef, this.player.progress, this.opts.langHe),
      poi: nearestPoi(this.trackDef, this.player.x, this.player.z, this.opts.langHe),
      night: this.world.night,
      driftCharge: this.player.driftCharge / 2.1,
      nitro: this.player.nitro,
      boosting: this.player.boostT > 0,
      drifting: this.player.drifting,
      wrongWay: this.player.wrongWayT > 0.45,
      countdown: this.countdown,
      finished: this.player.finished,
      place,
      onTrack: this.player.onTrack,
      sideStreet: this.opts.langHe ? this.player.sideStreet : this.player.sideStreetEn,
      minimap: [
        ...this.racers.map((r, i) => ({ x: r.x, z: r.z, yaw: r.yaw, isPlayer: i === 0 })),
        ...this.traffic.map((r) => ({ x: r.x, z: r.z, yaw: r.yaw, isPlayer: false, traffic: true })),
        ...this.cops.map((r) => ({ x: r.x, z: r.z, yaw: r.yaw, isPlayer: false, cop: true })),
      ],
      trackPoly: this.poly,
      poiMarks: this.trackDef.pois.map((p) => ({ x: p.x, z: p.z })),
      progress: this.player.progress,
      mode: this.mode,
      driftScore: Math.round(this.player.driftScore),
      heat: this.heat,
      heatMax: this.heatMax,
      busted: this.busted,
      chasing: this.mode === "heat" && this.racing && !this.busted && !this.escaping,
      copCount: this.cops.length,
      cooldown: this.cooldown,
      wanted: this.wanted,
      escaping: this.escaping,
      knockoutAlive: this.racers.filter((r) => !r.eliminated).length,
      weather: this.weather,
      ghost: !!this.ghostVis && !this.replaying,
      ghostDelta: this.ghostDelta,
      drafting: this.player.drafting,
      damage: this.player.damage,
      replay: this.replaying,
      camName: this.camNames[this.camMode] ?? "chase",
      rewind: this.rewinding,
      rewinds: this.rewindBuf.length * 0.05,
      photo: this.photo,
      photoFilter: this.opts.langHe ? (this.filterHe[this.photoFilter] ?? "ללא") : (this.filterNames[this.photoFilter] ?? "none"),
      photoHide: this.photoHide,
      radio: this.opts.langHe ? RADIO[this.audio.getStation()].he : RADIO[this.audio.getStation()].en,
      rpm: this.player.rpm,
      cycle: this.autoCycle,
      replaySlow: this.replaySlow,
      checkpointPing: this.ping,
      rivalName,
      rivalGap,
      sector: this.sectorIdx,
      sectorDelta: this.sectorDelta,
      gear: this.player.gear,
      surface: this.player.surfaceKind,
      tod: todLabel(this.clock, this.opts.langHe),
      dirt: this.player.dirt,
      banter: this.banter,
      combo: this.combo,
      driftBonus: this.bonusT > 0 ? this.driftBonus : "",
      driftAngle: this.player.driftAngle,
      poiHunt: this.poiGot.size,
      poiNeed: this.trackDef.pois.length,
      ghostRival: !!this.rivalGhostVis && !this.replaying,
      ghostRivalDelta: this.rivalGhostDelta,
      navAngle: this.navAngle(),
      handling: this.player.handling,
      absOn: this.player.assists.abs,
      tcsOn: this.player.assists.tcs,
      escOn: this.player.assists.esc,
      absActive: this.player.absActive,
      tcsActive: this.player.tcsActive,
      escActive: this.player.escActive,
      slipRatio: this.player.slipRatio,
      physicsHz: PHYSICS_HZ,
      msP95: this.telem.snapshot().p95,
      backend: this.telem.backend,
      kinMix: this.player.kinMix,
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      geometries: this.renderer.info.memory.geometries,
      textures: this.renderer.info.memory.textures,
    });
  }
// RSH-017-BODY-END:pushHud
// RSH-017-END:pushHud

// RSH-017-BEGIN:setEnvRT
export function setEnvRT(this: EngineAdapterHost, rt: Parameters<RaceEngine["setEnvRT"]>[0])
// RSH-017-BODY-BEGIN:setEnvRT
{
    this.leases.release("env-rt");
    this.envRT = rt;
    this.leases.retain("env-rt", () => this.envRT.dispose());
  }
// RSH-017-BODY-END:setEnvRT
// RSH-017-END:setEnvRT

// RSH-017-BEGIN:bindCsm
export function bindCsm(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:bindCsm
{
    if (!this.csm) return;
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const m = mesh.material;
      if (!m) return;
      const list = Array.isArray(m) ? m : [m];
      for (const mat of list) {
        if (!mat) continue;
        const std = mat as THREE.MeshStandardMaterial;
        if (std.isMeshStandardMaterial || (mat as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) {
          this.csm!.setupMaterial(mat);
          bindRoadCompile(mat as { userData: { lanes?: number } });
        }
      }
    });
  }
// RSH-017-BODY-END:bindCsm
// RSH-017-END:bindCsm

// RSH-017-BEGIN:csmWanted
export function csmWanted(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:csmWanted
{
    if (this.soft || this.quality === "low" || this.csmMuted) return 0;
    return this.quality === "high" ? 3 : 1;
  }
// RSH-017-BODY-END:csmWanted
// RSH-017-END:csmWanted

// RSH-017-BEGIN:trimCsm
export function trimCsm(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:trimCsm
{
    if (!this.csm) return;
    const n = this.csmWanted();
    this.csm.lights.forEach((L, i) => {
      L.visible = i < n;
    });
  }
// RSH-017-BODY-END:trimCsm
// RSH-017-END:trimCsm

// RSH-017-BEGIN:updateCsm
export function updateCsm(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:updateCsm
{
    if (!this.csm) return;
    const n = this.csmWanted();
    if (n === 0) {
      for (const L of this.csm.lights) L.intensity = 0;
      return;
    }
    this.csm.lightDirection.copy(this.world.sunDir).multiplyScalar(-1).normalize();
    const night = nightAmt(this.clock);
    const I = night > 0.5 ? 0.16 : 1.22;
    this.csm.lights.forEach((L, i) => {
      L.visible = i < n;
      L.intensity = i < n ? I : 0;
    });
    this.csm.update();
  }
// RSH-017-BODY-END:updateCsm
// RSH-017-END:updateCsm

