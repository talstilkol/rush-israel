// RSH-017: generated extraction from the accepted engine.ts.
// Do not change behavior here without an explicit later authority.
import { getCar } from "../cars";
import { SSGI_OFF, PHOTO_AA } from "../postfx";
import { PHYSICS_DT, PHYSICS_HZ, PHYSICS_VERSION, WEATHER_SPEC } from "../physics";
import { nearestIndex } from "../spline";
import { nightAmt, tlv } from "../tracks";
import { blobIsKtx2 } from "../blob-assets";
import { AYALON_GOLDEN } from "../../world/goldenCameras";
import type { RaceEngine } from "../engine";
import type { EngineAdapterHost } from "./adapter-host";

const FIXED = PHYSICS_DT;

// RSH-017-BEGIN:qaHookAllowed
export function qaHookAllowed(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:qaHookAllowed
{
    if (import.meta.env.VITE_QA === "1") return true;
    if (import.meta.env.DEV && typeof location !== "undefined") {
      const h = location.hostname;
      if (h === "127.0.0.1" || h === "localhost") return true;
    }
    return false;
  }
// RSH-017-BODY-END:qaHookAllowed
// RSH-017-END:qaHookAllowed

// RSH-017-BEGIN:exposeControls
export function exposeControls(this: EngineAdapterHost)
// RSH-017-BODY-BEGIN:exposeControls
{
    if (import.meta.env.PROD && import.meta.env.VITE_QA !== "1") return;
    if (!this.qaHookAllowed()) return;
    window.__controlsTest = {
      getYaw: () => this.player.yaw,
      getSpeed: () => this.player.speed,
      getOnTrack: () => this.player.onTrack,
      getProgress: () => this.player.progress,
      getX: () => this.player.x,
      getZ: () => this.player.z,
      getNitro: () => this.player.nitro,
      getTrafficCount: () => this.traffic.length,
      getStreetCount: () => this.world.streets.length,
      getSideStreet: () => this.player.sideStreet,
      getMode: () => this.mode,
      getCopCount: () => this.cops.length,
      getHeat: () => this.heat,
      getDriftScore: () => this.player.driftScore,
      getLaps: () => this.totalLaps,
      getWeather: () => this.weather,
      getGhost: () => this.ghostFrames.length,
      getTuneSpeed: () => this.player.stats.maxSpeed,
      getCamMode: () => this.camMode,
      getDrafting: () => this.player.drafting,
      getDamage: () => this.player.damage,
      getRoll: () => this.player.roll,
      getSurface: () => this.player.surfaceGrip,
      getGear: () => this.player.gear,
      getSteer: () => this.input.poll().steer,
      getKinMix: () => this.player.kinMix,
      getCsmCascades: () => this.csmWanted(),
      getCycle: () => this.autoCycle,
      isReplay: () => this.replaying,
      skipReplay: () => this.skipReplay(),
      finishNow: () => {
        this.qaForcedFinish = true;
        this.endRace();
      },
      enterPhoto: () => this.enterPhoto(),
      exitPhoto: () => this.exitPhoto(),
      isRewinding: () => this.rewinding,
      rewindLen: () => this.rewindBuf.length,
      setSteer: (v: number) => {
        this.input.steerOverride = v;
      },
      setKeys: (codes: string[]) => {
        this.input.keys.clear();
        for (const c of codes) this.input.keys.add(c);
      },
      setThrottle: (v: number) => {
        this.input.throttleOverride = v;
      },
      setCarId: (id: string) => {
        this.player.stats = getCar(id);
      },
      setAssists: (a: { abs?: boolean; tcs?: boolean; esc?: boolean }) => {
        this.player.assists = {
          abs: !!a.abs,
          tcs: !!a.tcs,
          esc: !!a.esc,
        };
      },
      setNitro: (v: number) => {
        this.player.nitro = v;
        this.player.boostT = 0;
      },
      setDamage: (v: number) => {
        this.player.damage = v;
      },
      skipCountdown: () => {
        this.countdown = 0;
        this.racing = true;
      },
      resetStart: () => {
        this.restartRace();
      },
      setProgress: (t: number) => {
        this.player.spawn(this.built, t, 0);
        this.countdown = 0;
        this.racing = true;
      },
      getY: () => this.player.y,
      getAirborne: () => this.player.airborne,
      getColliders: () =>
        this.world.colliders.map((c) => ({
          x: c.x,
          z: c.z,
          r: c.r,
          kind: c.kind ?? "building",
        })),
      getTrackWidth: () => this.built.width,
      getNearestDist: (x: number, z: number) => nearestIndex(this.built.samples, x, z, 0).dist,
      getSide: () => this.player.sideStreet,
      getRamps: () =>
        this.world.ramps.map((r) => ({
          x: r.x,
          z: r.z,
          sx: r.sx,
          sz: r.sz,
          len: r.len,
          y0: r.y0,
          y1: r.y1,
          he: r.he,
        })),
      teleport: (x: number, z: number, yaw: number, y = 1) => {
        this.player.x = x;
        this.player.z = z;
        this.player.y = y;
        this.player.yaw = yaw;
        this.player.vx = 0;
        this.player.vz = 0;
        this.player.vy = 0;
        this.player.speed = 14;
        this.player.airborne = false;
        this.player.airMs = 0;
        this.countdown = 0;
        this.racing = true;
      },
      getTick: () => this.tickId,
      isTimeVoided: () => this.timeVoided,
      isGlLost: () => this.glLost,
      getHandling: () => this.player.handling,
      getAbs: () => this.player.absActive,
      getPhysicsHz: () => PHYSICS_HZ,
      getPhysicsVersion: () => PHYSICS_VERSION,
      getVis: () => WEATHER_SPEC[this.weather]?.vis ?? 1,
      exportTelemetry: () => this.telem.snapshot(),
      gotoGolden: (id: string) => {
        const g = AYALON_GOLDEN.find((c) => c.id === id);
        if (!g) return false;
        this.player.spawn(this.built, g.t, 0);
        this.countdown = 0;
        this.racing = true;
        return true;
      },
      frameWorld: (x: number, z: number, y?: number) => this.frameWorld(x, z, y),
      frameAzrieli: () => {
        const p = tlv(32.07455, 34.79195);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 48,
          pz: s.z,
          lx: p.x,
          ly: 95,
          lz: p.z,
          fov: 28,
        };
        this.pushHud();
      },
      frameToHa: () => {
        const p = tlv(32.0695, 34.7894);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 36,
          pz: s.z,
          lx: p.x,
          ly: 70,
          lz: p.z,
          fov: 32,
        };
        this.pushHud();
      },
      frameCityGate: () => {
        const p = tlv(32.0832, 34.8027);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 42,
          pz: s.z,
          lx: p.x,
          ly: 110,
          lz: p.z,
          fov: 30,
        };
        this.pushHud();
      },
      frameMidtown: () => {
        const p = tlv(32.0806, 34.7926);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 38,
          pz: s.z,
          lx: p.x,
          ly: 80,
          lz: p.z,
          fov: 32,
        };
        this.pushHud();
      },
      frameElectra: () => {
        const p = tlv(32.0699, 34.7918);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 34,
          pz: s.z,
          lx: p.x,
          ly: 72,
          lz: p.z,
          fov: 32,
        };
        this.pushHud();
      },
      frameSavidor: () => {
        const p = tlv(32.0837, 34.79835);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 22,
          pz: s.z,
          lx: p.x,
          ly: 16,
          lz: p.z,
          fov: 40,
        };
        this.pushHud();
      },
      frameHagana: () => {
        const p = tlv(32.0547, 34.7982);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 18,
          pz: s.z,
          lx: p.x,
          ly: 10,
          lz: p.z,
          fov: 42,
        };
        this.pushHud();
      },
      frameUniversity: () => {
        const p = tlv(32.1035, 34.79815);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 20,
          pz: s.z,
          lx: p.x,
          ly: 12,
          lz: p.z,
          fov: 42,
        };
        this.pushHud();
      },
      frameGaluyot: () => {
        const p = tlv(32.0525, 34.79605);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 28,
          pz: s.z - 40,
          lx: p.x,
          ly: 8,
          lz: p.z,
          fov: 48,
        };
        this.pushHud();
      },
      framePlatinum: () => {
        const p = tlv(32.0842, 34.8036);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 36,
          pz: s.z,
          lx: p.x,
          ly: 80,
          lz: p.z,
          fov: 34,
        };
        this.pushHud();
      },
      frameTau: () => {
        const p = tlv(32.1124, 34.8046);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 22,
          pz: s.z,
          lx: p.x,
          ly: 14,
          lz: p.z,
          fov: 40,
        };
        this.pushHud();
      },
      frameSarona: () => {
        const p = tlv(32.0714, 34.7866);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 40,
          pz: s.z,
          lx: p.x,
          ly: 120,
          lz: p.z,
          fov: 30,
        };
        this.pushHud();
      },
      frameHakirya: () => {
        const p = tlv(32.0756, 34.7878);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 32,
          pz: s.z,
          lx: p.x,
          ly: 70,
          lz: p.z,
          fov: 36,
        };
        this.pushHud();
      },
      frameShalomMeir: () => {
        const p = tlv(32.0639, 34.7704);
        const n = nearestIndex(this.built.samples, p.x, p.z, 0);
        const s = this.built.samples[n.index];
        this.enterPhoto();
        this.photoHide = true;
        this.photoLock = {
          px: s.x,
          py: 36,
          pz: s.z,
          lx: p.x,
          ly: 55,
          lz: p.z,
          fov: 34,
        };
        this.pushHud();
      },
      getPhotoLock: () => this.photoLock,
      setNight: (n: boolean) => this.setNight(n),
      webgpuTried: () => this.webgpuTried,
      webgpuOk: () => this.webgpuOk,
      webgpuReason: () => this.webgpuReason,
      blobKtx2: () => blobIsKtx2(),
      getMemory: () => ({
        textures: this.renderer.info.memory.textures,
        geometries: this.renderer.info.memory.geometries,
      }),
      advanceTime: (ms: number) => {
        const steps = Math.max(0, Math.floor(ms / (FIXED * 1000)));
        for (let i = 0; i < steps && i < 600; i++) this.fixed(FIXED);
      },
    };
    window.render_game_to_text = () =>
      JSON.stringify({
        track: this.trackDef.id,
        quality: this.quality,
        weather: this.weather,
        night: nightAmt(this.clock) > 0.5,
        speed: +this.player.speed.toFixed(2),
        progress: +this.player.progress.toFixed(3),
        onTrack: this.player.onTrack,
        telem: this.telem.snapshot(),
        csm: !!this.csm,
        photo: this.photo,
        webgpuTried: this.webgpuTried,
        webgpuOk: this.webgpuOk,
        webgpuReason: this.webgpuReason,
        blobKtx2: blobIsKtx2(),
        ssgiOff: SSGI_OFF,
        photoAa: PHOTO_AA,
      });
  }
// RSH-017-BODY-END:exposeControls
// RSH-017-END:exposeControls

