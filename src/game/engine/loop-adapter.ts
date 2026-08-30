// RSH-017: generated extraction from the accepted engine.ts.
// Do not change behavior here without an explicit later authority.
import * as THREE from "three";
import { clamp } from "../math";
import { MAX_ACCUMULATOR, MAX_CATCHUP_STEPS, PHYSICS_DT } from "../physics";
import { nightAmt } from "../tracks";
import type { EngineAdapterHost } from "./adapter-host";

const FIXED = PHYSICS_DT;

// RSH-017-BEGIN:onContextLost
export function onContextLost(this: EngineAdapterHost, e: any)
// RSH-017-BODY-BEGIN:onContextLost
{
    e.preventDefault();
    this.glLost = true;
  }
// RSH-017-BODY-END:onContextLost
// RSH-017-END:onContextLost

// RSH-017-BEGIN:onContextRestored
export function onContextRestored(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:onContextRestored
{
    this.glLost = false;
    this.opts.onRestore?.();
  }
// RSH-017-BODY-END:onContextRestored
// RSH-017-END:onContextRestored

// RSH-017-BEGIN:shouldPresent
export function shouldPresent(this: EngineAdapterHost, now: any)
// RSH-017-BODY-BEGIN:shouldPresent
{
    if (this.quality !== "low" && !this.lite) return true;
    return now - this.lastPresent >= 1000 / 30;
  }
// RSH-017-BODY-END:shouldPresent
// RSH-017-END:shouldPresent

// RSH-017-BEGIN:onResize
export function onResize(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:onResize
{
    const w = this.canvas.clientWidth;
    const h = Math.max(1, this.canvas.clientHeight);
    this.gfx.resize(w, h, this.renderer.getPixelRatio());
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const size = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(size);
    this.post.setSize(size.x, size.y);
  }
// RSH-017-BODY-END:onResize
// RSH-017-END:onResize

// RSH-017-BEGIN:frame
export function frame(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:frame
{
    if (this.disposed || this.glLost) return;
    if (this.disposed) return;
    const now = performance.now();
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 0.1);
    this.telem.push(dt * 1000);
    if (!this.soft && this.quality !== "low") {
      const snap = this.telem.snapshot();
      const act = this.dyn.note(snap.p95, dt);
      if (act) this.applyGfxStep();
    }

    const hoodDown = this.input.keys.has("KeyC") || this.input.keys.has("KeyV") || !!navigator.getGamepads?.()?.[0]?.buttons[3]?.pressed;
    if (hoodDown && !this.hoodEdge && !this.photo) {
      this.camMode = 0;
      this.hood = false;
    }
    this.hoodEdge = hoodDown;

    const radioDown = this.input.keys.has("KeyT");
    if (radioDown && !this.radioEdge) this.cycleRadio();
    this.radioEdge = radioDown;
    if (this.radioToast > 0) this.radioToast = Math.max(0, this.radioToast - dt);
    if (this.banterT > 0) {
      this.banterT -= dt;
      if (this.banterT <= 0) this.banter = "";
    }

    if (this.autoCycle && !this.photo && !this.paused && this.racing) {
      this.clock = (this.clock + dt / 120) % 1;
      this.clockBake += dt;
      const n = nightAmt(this.clock);
      const crossed = n > 0.5 !== this.world.night;
      if (crossed) {
        this.applyClockSky(true);
        this.clockBake = 0;
      } else {
        this.world.setClock(this.clock);
        this.applyLook();
      }
    }

    if (this.photo) {
      this.stepPhoto(dt);
      this.world.tick(now, this.player.x, this.player.z);
      this.world.followMirror(this.player.x, this.player.y, this.player.z, this.player.yaw);
      this.post.setDrive(0, false);
      this.post.render();
      this.flushSnap();
      this.hudTimer += dt;
      if (this.hudTimer > 0.08) {
        this.hudTimer = 0;
        this.pushHud();
      }
      return;
    }

    if (this.replaying && (this.input.keys.has("Enter") || this.input.keys.has("KeyX"))) {
      this.skipReplay();
    }

    if (this.paused && !this.photo) {
      this.post.render();
      this.flushSnap();
      return;
    }

    this.acc = Math.min(this.acc + dt, MAX_ACCUMULATOR);
    let steps = 0;
    while (this.acc >= FIXED && steps < MAX_CATCHUP_STEPS) {
      this.fixed(FIXED);
      this.acc -= FIXED;
      steps++;
    }
    if (this.acc >= FIXED && steps >= MAX_CATCHUP_STEPS) this.timeVoided = true;

    this.world.tick(now, this.player.x, this.player.z);
    this.nowSec = now / 1000;
    if (!this.shouldPresent(now)) {
      this.hudTimer += dt;
      if (this.hudTimer > 0.08) {
        this.hudTimer = 0;
        this.pushHud();
      }
      return;
    }
    this.lastPresent = now;
    this.present(dt);
    this.world.followShadows(this.player.x, this.player.y, this.player.z);
    this.updateCsm();
    this.updateProbe();
    const spd = clamp(Math.abs(this.player.speed) / 52, 0, 1);
    this.post.setDrive(spd, this.player.boostT > 0);
    this.post.render();
    this.flushSnap();

    this.hudTimer += dt;
    if (this.hudTimer > 0.08) {
      this.hudTimer = 0;
      this.pushHud();
    }
  }
// RSH-017-BODY-END:frame
// RSH-017-END:frame

