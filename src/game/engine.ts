import * as THREE from "three";
import { GameAudio, RADIO } from "./audio";
import { createCarVisual, pulsePolice, setCarLights, updateCarVisual, applyDamage, type CarVisual } from "./car-mesh";
import { getEvent } from "./career";
import { finishLine, introLine, overtakeLine } from "./dialog";
import { applyTune, paceGhost, racePayout, sampleGhost, sampleGhostLoop, WEATHER_GRIP, type GhostFrame } from "./garage";
import { CARS, getCar, RIVALS } from "./cars";
import { GameInput } from "./input";
import { clamp, expSmooth, lerp, hash01, hashStr } from "./math";
import { hasAiPack, hasCops, MODE_LAPS } from "./modes";
import { bakeEnv, createPost, SSGI_OFF, PHOTO_AA, type PostStack } from "./postfx";
import { CSM } from "three/examples/jsm/csm/CSM.js";
import {
  DEFAULT_ASSISTS,
  MAX_ACCUMULATOR,
  MAX_CATCHUP_STEPS,
  PHYSICS_DT,
  PHYSICS_HZ,
  PHYSICS_VERSION,
  WEATHER_SPEC,
} from "./physics";
import { getDamage, getGhost, recordGhost, setDamage } from "./save";
import { buildTrack, nearestIndex, sampleAtT } from "./spline";
import { getTrack, nearestPoi, nightAmt, streetName, todLabel, tlv } from "./tracks";
import type { AssistFlags, CarId, Collider, HandlingMode, HudState, Quality, RaceMode, RaceResult, TrackId, Tune, Weather } from "./types";
import { aiInput, ArcadeCar, copInput, separateCars, SURFACE_GRIP, trafficInput, updateDrafting, type CarSnap } from "./vehicle";
import { createWorld, type World } from "./world";
import { bindRoadCompile } from "./roadShader";
import { loadBeam } from "./beam-assets";
import { loadLaneArrow } from "./arrow-assets";
import { loadFlares } from "./flare-assets";
import { loadWater } from "./water-assets";
import { loadSigns } from "./sign-assets";
import { loadFoam } from "./foam-assets";
import { loadGround } from "./ground-assets";
import { loadSidewalk } from "./walk-assets";
import { loadCurtains } from "./facade-assets";
import { loadCurbs } from "./curb-assets";
import { loadHerodian } from "./stone-assets";
import { loadJaffaClock } from "./clock-assets";
import { loadIsraelFlag } from "./flag-assets";
import { loadTreeMaps } from "./tree-assets";
import { loadBlob, getBlob, blobIsKtx2 } from "./blob-assets";
import { loadFlake } from "./flake-assets";
import { loadCars } from "./car-assets";
import { loadRoadFor } from "./road-assets";
import { getSkyDay, getSkyNight, loadSky } from "./sky-assets";
import { RenderTelemetry } from "../rendering/RenderTelemetry";
import { AYALON_GOLDEN } from "../world/goldenCameras";
import { RendererFacade } from "../rendering/RendererFacade";
import { profileFromLegacy } from "../rendering/QualityProfile";
import { FOG, fogKey, LOOKS, lookFromFlags } from "../rendering/EnvironmentState";
import { ResourceRegistry } from "../rendering/ResourceRegistry";
import { DynamicQualityController } from "../rendering/DynamicQualityController";
import { MESH_STREAMING } from "./stream-flag";

const FIXED = PHYSICS_DT;

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

function isSoftwareGL(renderer: THREE.WebGLRenderer) {
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || "") : "";
  const basic = String(gl.getParameter(gl.RENDERER) || "");
  return /swiftshader|llvmpipe|softpipe|microsoft basic render|subzero/i.test(`${name} ${basic}`);
}

type RewindPack = {
  totalTime: number;
  lapTime: number;
  heat: number;
  bustAcc: number;
  cooldown?: number;
  wanted?: number;
  cars: CarSnap[];
  traffic: CarSnap[];
  cops: CarSnap[];
};

type Options = {
  trackId: TrackId;
  carId: CarId;
  langHe: boolean;
  night: boolean;
  quality?: Quality;
  fovExtra?: number;
  mode?: RaceMode;
  eventId?: string;
  weather?: Weather;
  tune?: Tune;
  handling?: HandlingMode;
  assists?: AssistFlags;
  onHud: (h: HudState) => void;
  onFinish: (r: RaceResult) => void;
  onBoot?: (frac: number) => void;
  onRestore?: () => void;
};

export class RaceEngine {
  private renderer: THREE.WebGLRenderer;
  private gfx!: RendererFacade;
  private leases = new ResourceRegistry();
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private input!: GameInput;
  private audio!: GameAudio;
  private world!: World;
  private post!: PostStack;
  private envRT!: THREE.WebGLRenderTarget;
  private probeRT: THREE.WebGLCubeRenderTarget | null = null;
  private probeCam: THREE.CubeCamera | null = null;
  private probeTick = 0;
  private built;
  private trackDef;
  private player!: ArcadeCar;
  private racers!: ArcadeCar[];
  private visuals!: CarVisual[];
  private blobs: THREE.Mesh[] = [];
  private sparks!: THREE.Points;
  private sparkPos!: Float32Array;
  private cam = new THREE.Vector3();
  private look = new THREE.Vector3();
  private desired = new THREE.Vector3();
  private disposed = false;
  private paused = false;
  private racing = false;
  private countdown = 1.45;
  private totalTime = 0;
  private lapTime = 0;
  private bestLap = Infinity;
  private laps: number[] = [];
  private acc = 0;
  private last = 0;
  private trauma = 0;
  private fog = new THREE.FogExp2(0x0c1018, 0.005);
  private hood = false;
  private hudTimer = 0;
  private hoodEdge = false;
  private lookBack = false;
  private autoCycle = false;
  private clock = 0.5;
  private clockBake = 0;
  private lastDirt = -1;
  private replaySlow = false;
  private banter = "";
  private banterT = 0;
  private lastPlace = 4;
  private rivalIdx = 0;
  private combo = 0;
  private comboHold = 0;
  private lastDrifting = false;

  private poiGot = new Set<number>();
  private wrongBeep = 0;
  private driftBonus = "";
  private bonusT = 0;
  private missCd = 0;
  private gate!: THREE.Mesh;
  private ping = 0;
  private snapPhoto = false;
  private sectorClock = 0;
  private sectorIdx = 0;
  private sectorDelta = 0;
  private bestSectors = [Infinity, Infinity, Infinity];
  private fovExtra = 0;
  private skidMesh!: THREE.InstancedMesh;
  private skidI = 0;
  private skidAcc = 0;
  private skidDummy = new THREE.Object3D();
  private smokeMesh!: THREE.InstancedMesh;
  private smokeDummy = new THREE.Object3D();
  private smokes: { x: number; y: number; z: number; s: number; life: number; yaw: number }[] = [];
  private boostPts!: THREE.Points;
  private boostPos!: Float32Array;
  private traffic: ArcadeCar[] = [];
  private trafficVis: CarVisual[] = [];
  private freeze = 0;
  private impactCd = 0;
  private poly!: { x: number; z: number }[];
  private opts: Options;
  private canvas: HTMLCanvasElement;
  private lite = false;
  private quality: Quality = "high";
  private droppedTier = false;
  private dyn = new DynamicQualityController();
  private csmMuted = false;
  private lastPresent = 0;
  private webgpuTried = false;
  private webgpuOk = false;
  private webgpuReason = "";
  private soft = false;
  private mode: RaceMode = "circuit";
  private totalLaps = 3;
  private cops: ArcadeCar[] = [];
  private copVis: CarVisual[] = [];
  private heat = 0;
  private heatMax = 0;
  private bustAcc = 0;
  private busted = false;
  private cooldown = 0;
  private wanted = 1;
  private escaping = false;
  private extraHits: Collider[] = [];
  private csm: CSM | null = null;
  private blockGroup: THREE.Group | null = null;
  private blockT = -1;
  private blockCd = 0;
  private finishedSent = false;
  private koMarked = 0;
  private nowSec = 0;
  private weather: Weather = "clear";
  private rainMesh: THREE.Points | null = null;
  private rainPos: Float32Array | null = null;
  private ghostVis: CarVisual | null = null;
  private ghostFrames: GhostFrame[] = [];
  private ghostBuf: GhostFrame[] = [];
  private ghostAcc = 0;
  private ghostBeaten = false;
  private cashWon = 0;
  private ghostDelta = 0;
  private rivalGhostVis: CarVisual | null = null;
  private rivalGhostFrames: GhostFrame[] = [];
  private rivalGhostDelta = 0;
  private camMode = 0;
  private replaying = false;
  private replayT = 0;
  private replayBuf: { x: number; y: number; z: number; yaw: number; speed: number }[][] = [];
  private replayAcc = 0;
  private pendingResult: RaceResult | null = null;
  private camNames = ["chase", "hood", "bumper", "heli"];
  private rewindBuf: RewindPack[] = [];
  private rewindAcc = 0;
  private rewinding = false;
  private rewindTickT = 0;
  private radioEdge = false;
  private radioToast = 0;
  private photo = false;
  private photoHide = false;
  private photoYaw = 0;
  private photoPitch = 0.22;
  private photoDist = 8;
  private photoFilter = 0;
  private photoLock: { px: number; py: number; pz: number; lx: number; ly: number; lz: number; fov: number } | null = null;
  private drivePR = 1;
  private driveExposure = 1;
  private filterNames = ["none", "warm", "neon", "mono", "film", "blockbuster", "bleach", "polaroid"];
  private filterHe = ["ללא", "חם", "ניאון", "שחור-לבן", "פילם", "הוליווד", "בליץ'", "פולארויד"];
  ready: Promise<void>;
  private booted = false;
  private tickId = 0;
  private timeVoided = false;
  private qaForcedFinish = false;
  private glLost = false;
  private telem: RenderTelemetry;

  constructor(canvas: HTMLCanvasElement, opts: Options) {
    this.canvas = canvas;
    this.opts = opts;
    this.trackDef = getTrack(opts.trackId);
    this.built = buildTrack(this.trackDef);
    this.weather = opts.weather ?? "clear";

    const mobile = canvas.clientWidth < 700 || /Mobi|Android/i.test(navigator.userAgent);
    this.quality = opts.quality === "low" || opts.quality === "mid" ? opts.quality : "high";
    this.lite = this.quality === "low";
    this.fovExtra = opts.fovExtra ?? 0;

    this.gfx = RendererFacade.init(canvas, profileFromLegacy(this.quality));
    this.renderer = this.gfx.gl;
    this.telem = this.gfx.telem;
    const soft = isSoftwareGL(this.renderer);
    this.soft = soft;
    if (soft) this.lite = true;
    const shadows = !mobile && !soft;
    this.renderer.shadowMap.enabled = shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    const spec = FOG[fogKey(this.trackDef.theme, opts.trackId)];
    const skyDay = this.trackDef.theme === "desert" || opts.trackId === "ramon" ? 0x4aa8dc : this.trackDef.theme === "snow" || opts.trackId === "hermon" ? 0x6eb0d8 : 0x2f8fd4;
    const skyNight = 0x182436;
    this.gfx.setEnvironment(opts.night ? LOOKS.night.exposure : LOOKS.summer14.exposure);
    this.fog = new THREE.FogExp2(opts.night ? spec.nightCol : spec.dayCol, opts.night ? spec.night : spec.day);
    this.scene.fog = this.fog;
    this.scene.background = new THREE.Color(opts.night ? skyNight : skyDay);

    const mountain = spec.far >= 12000 || opts.trackId === "scopus" || opts.trackId === "jerusalem";
    this.camera = new THREE.PerspectiveCamera(68, canvas.clientWidth / Math.max(1, canvas.clientHeight), 0.28, spec.far);

    this.opts.onBoot?.(0.12);
    canvas.addEventListener("webglcontextlost", this.onContextLost);
    canvas.addEventListener("webglcontextrestored", this.onContextRestored);
    this.ready = this.assemble(shadows, soft);
  }

  private async assemble(shadows: boolean, soft: boolean) {
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    if (this.disposed) return;
    this.opts.onBoot?.(0.18);
    if (MESH_STREAMING) throw new Error("mesh streaming is off until cells");
    if (typeof location !== "undefined" && new URLSearchParams(location.search).get("webgpu") === "1") {
      this.webgpuTried = true;
      const probe = await RendererFacade.probeWebGPU();
      this.webgpuOk = probe.ok;
      this.webgpuReason = probe.reason;
      console.info("[gfx] webgpu", probe.ok ? "ok" : "fail", probe.reason);
    }
    await loadSky();
    await loadRoadFor(this.trackDef.id);
    await loadBeam();
    await loadBlob(this.renderer);
    await loadFlake();
    await loadCars(this.renderer);
    await loadTreeMaps();
    await loadCurbs();
    await loadCurtains();
    await loadSidewalk();
    await loadGround();
    await loadFoam();
    await loadSigns();
    await loadWater();
    await loadFlares();
    if (this.trackDef.id === "ayalon") await loadLaneArrow();
    if (this.trackDef.id === "oldjaffa") await loadJaffaClock();
    if (this.trackDef.id === "rothschild") await loadIsraelFlag();
    if (this.trackDef.id === "jerusalem" || this.trackDef.id === "scopus" || this.trackDef.id === "walls") await loadHerodian();
    if (this.disposed) return;

    this.world = await createWorld(this.trackDef, this.built, shadows, this.opts.night, this.weather);
    this.world.setLod?.(this.quality);
    if (this.disposed) {
      this.world.dispose();
      return;
    }
    this.opts.onBoot?.(0.72);
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    if (this.disposed) {
      this.world.dispose();
      return;
    }
    this.clock = this.opts.night ? 0.9 : 0.5;
    this.scene.add(this.world.group);
    if (!this.soft && this.quality === "high" && this.renderer.shadowMap.enabled) {
      this.world.dir.castShadow = false;
      this.world.dirNear.castShadow = false;
      this.csm = new CSM({
        camera: this.camera,
        parent: this.scene,
        cascades: 2,
        maxFar: 160,
        mode: "practical",
        shadowMapSize: 1024,
        lightIntensity: 1.25,
        lightNear: 1,
        lightFar: 280,
        lightMargin: 28,
        shadowBias: -0.00008,
      });
      this.leases.retain("csm", () => {
        this.csm?.remove();
        this.csm?.dispose();
        this.csm = null;
      });
      this.bindCsm();
    }

    const fallbackPost = (): PostStack => ({
      composer: null as unknown as PostStack["composer"],
      bloom: null as unknown as PostStack["bloom"],
      grade: null as unknown as PostStack["grade"],
      setSize() {},
      setDrive() {},
      setNight() {},
      setFilter() {},
      setBudget() {},
      setTier() {},
      setBloom() {},
      render: () => this.renderer.render(this.scene, this.camera),
      dispose() {},
    });

    this.setEnvRT(new THREE.WebGLRenderTarget(1, 1));
    this.post = fallbackPost();

    if (!soft && this.quality !== "low") {
      requestAnimationFrame(() => this.upgradeGraphics());
    }

    this.input = new GameInput(this.canvas);
    this.audio = new GameAudio();
    this.audio.setVoice(getCar(this.opts.carId).body);

    const playerDef = applyTune(getCar(this.opts.carId), this.opts.tune ?? { engine: 0, tires: 0, nitro: 0, paint: 0, livery: 0 });
    this.player = new ArcadeCar(playerDef, playerDef.nameHe);
    this.player.roam = (this.opts.mode ?? "circuit") === "roam" || this.opts.trackId === "gushdan";
    this.player.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
    this.player.weather = this.weather;
    this.player.handling = this.opts.handling ?? "simcade";
    this.player.assists = { ...(this.opts.assists ?? DEFAULT_ASSISTS) };
    this.player.damage = getDamage(this.opts.carId);
    this.mode = this.opts.mode ?? "circuit";
    this.totalLaps = this.trackDef.open ? 1 : MODE_LAPS[this.mode];
    this.racers = [this.player];
    if (hasAiPack(this.mode)) {
      const aiDefs = CARS.filter((c) => c.id !== this.opts.carId).slice(0, 3);
      aiDefs.forEach((d, i) => {
        const rival = RIVALS[i % RIVALS.length];
        const ai = new ArcadeCar(d, this.opts.langHe ? rival.he : rival.en);
        ai.isAi = true;
        ai.aiSkill = 0.9 - i * 0.05;
        ai.aiOffset = (i % 2 === 0 ? -1 : 1) * (2.2 + i * 0.4);
        ai.handling = this.player.handling;
        ai.assists = { abs: true, tcs: true, esc: true };
        ai.weather = this.weather;
        this.racers.push(ai);
      });
    }
    const gMul = WEATHER_GRIP[this.weather] ?? 1;
    const sg = SURFACE_GRIP[this.trackDef.theme] ?? 1;
    for (const r of this.racers) {
      r.weatherGrip = gMul;
      r.weather = this.weather;
      r.baseGrip = sg;
      r.surfaceGrip = sg;
    }

    this.visuals = this.racers.map((r, i) => {
      const vis = createCarVisual(
        r.stats.color,
        r.stats.accent,
        shadows,
        i === 0 && !soft && this.quality === "high",
        r.stats.body,
        r.stats.kit === "police",
        i === 0 ? this.opts.tune : undefined,
      );
      setCarLights(vis, this.opts.night);
      if (i === 0) applyDamage(vis, this.player.damage, this.player.dirt);
      this.scene.add(vis.group);
      return vis;
    });
    if (!soft && this.quality !== "low") {
      this.probeRT = new THREE.WebGLCubeRenderTarget(96);
      this.leases.retain("probe-rt", () => {
        this.probeRT?.dispose();
        this.probeRT = null;
      });
      this.probeCam = new THREE.CubeCamera(1.2, 220, this.probeRT);
    }

    const blobTex = getBlob();
    if (!blobTex) throw new Error("blob texture missing");
    const blobGeo = new THREE.PlaneGeometry(4.2, 2.1);
    blobGeo.rotateX(-Math.PI / 2);
    const blobMat = new THREE.MeshBasicMaterial({
      map: blobTex,
      transparent: true,
      opacity: this.opts.night ? 0.55 : 0.38,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    this.blobs = this.racers.map(() => {
      const m = new THREE.Mesh(blobGeo, blobMat);
      m.renderOrder = 1;
      m.frustumCulled = false;
      this.scene.add(m);
      return m;
    });

    const n = this.built.samples.length;
    this.poly = [];
    for (let i = 0; i < n; i += 4) this.poly.push({ x: this.built.samples[i].x, z: this.built.samples[i].z });

    this.sparkPos = new Float32Array(180);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(this.sparkPos, 3));
    this.sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({ color: 0xffc878, size: 0.18, transparent: true, opacity: 0.85, depthWrite: false }),
    );
    this.scene.add(this.sparks);

    this.gate = new THREE.Mesh(
      new THREE.TorusGeometry(this.built.width * 0.42, 0.08, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0x6ec8c4,
        emissive: 0x3ad4c8,
        emissiveIntensity: 1.6,
        roughness: 0.25,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
      }),
    );
    this.gate.rotation.y = Math.PI / 2;
    this.scene.add(this.gate);

    const skidGeo = new THREE.PlaneGeometry(0.55, 1.35);
    skidGeo.rotateX(-Math.PI / 2);
    const skidMat = new THREE.MeshBasicMaterial({
      color: 0x0a0c0e,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    this.skidMesh = new THREE.InstancedMesh(skidGeo, skidMat, 180);
    this.skidMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.skidMesh.count = 0;
    this.scene.add(this.skidMesh);

    const smokeGeo = new THREE.PlaneGeometry(1.4, 1.4);
    smokeGeo.rotateX(-Math.PI / 2);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0x9aa3aa,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    this.smokeMesh = new THREE.InstancedMesh(smokeGeo, smokeMat, 64);
    this.smokeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.smokeMesh.count = 0;
    this.scene.add(this.smokeMesh);

    this.boostPos = new Float32Array(90);
    const boostGeo = new THREE.BufferGeometry();
    boostGeo.setAttribute("position", new THREE.BufferAttribute(this.boostPos, 3));
    this.boostPts = new THREE.Points(
      boostGeo,
      new THREE.PointsMaterial({
        color: 0x7ee0dc,
        size: 0.22,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    );
    this.boostPts.visible = false;
    this.scene.add(this.boostPts);

    this.spawnTraffic();
    if (hasCops(this.mode)) this.spawnCops();
    this.spawnRain();
    this.spawnGhost();
    this.placeGrid();
    this.bindCsm();
    this.snapCamera(true);
    this.world.followShadows(this.player.x, this.player.y, this.player.z);
    this.updateCsm();

    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
    requestAnimationFrame(() => this.onResize());

    this.last = performance.now();
    try {
      this.renderer.compile(this.scene, this.camera);
    } catch {
      /* warmup is best-effort */
    }
    if (this.trackDef.id === "ayalon" && !this.soft && this.quality !== "low") {
      try {
        const rt = new THREE.WebGLCubeRenderTarget(128);
        const cam = new THREE.CubeCamera(4, 400, rt);
        cam.position.set(this.player.x, this.player.y + 26, this.player.z);
        for (const v of this.visuals) v.group.visible = false;
        cam.update(this.renderer, this.scene);
        for (const v of this.visuals) v.group.visible = true;
        this.scene.environment = rt.texture;
        this.scene.environmentIntensity = this.world.night ? 0.42 : 0.7;
        this.leases.retain("ayalon-env", () => rt.dispose());
      } catch {
        /* probe is optional */
      }
    }
    this.renderer.setAnimationLoop(() => this.frame());

    this.rivalIdx = (this.opts.eventId?.length ?? 1) % 4;
    const ev = this.opts.eventId ? getEvent(this.opts.eventId) : null;
    this.banter = introLine(ev, this.opts.langHe);
    this.banterT = 5.5;

    if (import.meta.env.DEV || import.meta.env.VITE_QA === "1") this.exposeControls();
    this.pushHud();
    this.booted = true;
    this.opts.onBoot?.(1);
  }

  private placeGrid() {
    const n = this.racers.length;
    for (let i = 0; i < n; i++) {
      const t = i === 0 ? 0.03 : (0.03 - 0.012 * i + 1) % 1;
      const lat = i === 0 ? (this.trackDef.id === "rothschild" ? -7.2 : -2.2) : this.racers[i].aiOffset;
      if (i === 0) this.racers[i].aiOffset = lat;
      this.racers[i].spawn(this.built, t, lat);
    }
    this.clearSpawnHits();
  }

  private clearSpawnHits() {
    const s0 = this.built.samples[0];
    const pad = this.built.width / 2 + 14;
    const keep = this.world.colliders.filter((c) => {
      if (Math.hypot(c.x - s0.x, c.z - s0.z) < pad) return false;
      for (const r of this.racers) {
        if (Math.hypot(c.x - r.x, c.z - r.z) < c.r + 4.5) return false;
      }
      return true;
    });
    this.world.colliders.length = 0;
    this.world.colliders.push(...keep);
  }

  private spawnTraffic() {
    const highway = this.trackDef.theme === "highway" || this.trackDef.id === "gushdan" || this.trackDef.id === "hw90";
    const n = this.lite ? 4 : highway ? 11 : this.mode === "roam" ? 9 : 7;
    const nyc = this.trackDef.city === "nyc";
    const base = CARS[0];
    for (let i = 0; i < n; i++) {
      const kind = nyc ? (i % 2 ? "taxi" : "sedan") : i % 5 === 0 ? "bus" : highway && i % 4 === 1 ? "truck" : i % 2 ? "taxi" : "sherut";
      const color =
        kind === "taxi" ? 0xf5c400 : kind === "bus" ? 0xe8e4d4 : kind === "truck" ? 0x3a3e44 : kind === "sedan" ? 0x1c1c1e : 0xf0ece4;
      const accent = kind === "taxi" ? 0x1a1a1c : kind === "bus" ? 0x1a5c3a : 0xf2eee8;
      const body = kind === "taxi" || kind === "bus" ? "hatch" : kind === "truck" ? "muscle" : "gt";
      const def = {
        ...base,
        id: base.id,
        color,
        accent,
        maxSpeed: kind === "truck" ? 16 : kind === "bus" ? 18 : 21,
        accel: kind === "truck" ? 1.6 : kind === "bus" ? 1.9 : 2.6,
        brake: 7,
        turnRate: kind === "truck" ? 1.35 : 1.7,
        grip: 0.88,
        drag: kind === "truck" ? 0.9 : 0.7,
        mass: kind === "truck" ? 1.8 : kind === "bus" ? 1.45 : 1.05,
      };
      const cab = new ArcadeCar(def, nyc ? "Taxi" : kind === "bus" ? "Egged" : kind === "truck" ? "Truck" : kind === "taxi" ? "Taxi" : "Sherut");
      cab.isAi = true;
      cab.isTraffic = true;
      cab.aiSkill = 0.48 + (i % 3) * 0.08;
      cab.aiOffset = (i % 2 === 0 ? -1 : 1) * Math.min(kind === "truck" ? 2.6 : 3.4, this.built.width * 0.28);
      cab.baseGrip = SURFACE_GRIP[this.trackDef.theme] ?? 1;
      cab.surfaceGrip = cab.baseGrip;
      cab.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
      cab.weather = this.weather;
      cab.handling = "simcade";
      cab.assists = { abs: true, tcs: true, esc: false };
      cab.spawn(this.built, (0.12 + i / n) % 1, cab.aiOffset);
      this.traffic.push(cab);
      const vis = createCarVisual(color, accent, false, false, body);
      if (kind === "bus") vis.group.scale.set(1.12, 1.22, 1.38);
      if (kind === "truck") vis.group.scale.set(1.18, 1.28, 1.42);
      setCarLights(vis, this.opts.night);
      this.scene.add(vis.group);
      this.trafficVis.push(vis);
    }
  }

  private spawnCops() {
    const n = this.lite ? 2 : 3;
    const nyc = this.trackDef.city === "nyc";
    const color = 0xf2eee8;
    const accent = nyc ? 0x1a3a6a : 0x163048;
    const base = CARS[0];
    for (let i = 0; i < n; i++) {
      const def = {
        ...base,
        id: base.id,
        color,
        accent,
        maxSpeed: 54,
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
      cop.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
      cop.weather = this.weather;
      cop.handling = this.player.handling;
      cop.assists = { abs: true, tcs: true, esc: true };
      cop.spawn(this.built, (0.86 - i * 0.04 + 1) % 1, cop.aiOffset);
      this.cops.push(cop);
      const vis = createCarVisual(color, accent, false, false, "gt", true);
      setCarLights(vis, this.opts.night);
      this.scene.add(vis.group);
      this.copVis.push(vis);
    }
  }

  private spawnRain() {
    const snow = this.trackDef.theme === "snow";
    const dust = this.weather === "hamsin";
    if (this.weather === "clear" && !snow) return;
    const n = this.lite ? 280 : snow ? 720 : dust ? 640 : this.weather === "storm" ? 900 : 560;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (hash01(i, 1) - 0.5) * 36;
      pos[i * 3 + 1] = hash01(i, 2) * 22;
      pos[i * 3 + 2] = (hash01(i, 3) - 0.5) * 36;
    }
    this.rainPos = pos;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: snow ? 0xf4f8fc : dust ? 0xc4a070 : this.weather === "storm" ? 0xb8c4cc : 0xd4dde4,
      size: snow ? 0.16 : dust ? 0.11 : this.weather === "storm" ? 0.09 : 0.06,
      transparent: true,
      opacity: snow ? 0.72 : dust ? 0.42 : 0.55,
      depthWrite: false,
    });
    this.rainMesh = new THREE.Points(geo, mat);
    this.scene.add(this.rainMesh);
  }

  private spawnGhost() {
    if (this.mode === "roam") return;
    const tintGhost = (vis: CarVisual, hex: number) => {
      vis.bodyMat.transparent = true;
      vis.bodyMat.opacity = 0.3;
      vis.bodyMat.metalness = 0.2;
      vis.bodyMat.roughness = 0.35;
      vis.bodyMat.emissive.setHex(hex);
      vis.bodyMat.emissiveIntensity = 0.32;
      vis.bodyMat.depthWrite = false;
      setCarLights(vis, false);
    };
    const stored = getGhost(this.opts.trackId);
    if (stored?.frames.length) {
      this.ghostFrames = stored.frames;
      const vis = createCarVisual(0x6ec8c4, 0x163048, false, false, this.player.stats.body);
      tintGhost(vis, 0x6ec8c4);
      this.scene.add(vis.group);
      this.ghostVis = vis;
    }
    const lap = Math.max(18, this.built.length / 34);
    this.rivalGhostFrames = paceGhost(this.built.samples, this.built.length, lap);
    if (this.rivalGhostFrames.length > 8) {
      const vis = createCarVisual(0xf0c400, 0x3a2a08, false, false, "gt");
      tintGhost(vis, 0xf0c400);
      this.scene.add(vis.group);
      this.rivalGhostVis = vis;
    }
  }

  private upgradeGraphics() {
    if (this.disposed) return;
    try {
      const env = bakeEnv(this.renderer, this.world.night);
      this.setEnvRT(env);
      this.scene.environment = env.texture;
      this.scene.environmentIntensity = this.world.night ? 0.52 : 0.88;
    } catch {
      /* keep fallback */
    }
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

  unlockAudio() {
    this.audio.unlock();
  }

  setPaused(p: boolean) {
    if (this.photoLock && !p) return;
    this.paused = p;
    if (!p && this.photo) this.exitPhoto();
  }

  applyQuality(q: Quality) {
    this.quality = q === "low" || q === "mid" ? q : "high";
    this.lite = this.quality === "low" || this.soft;
    this.droppedTier = false;
    this.dyn.reset();
    this.csmMuted = false;
    const mobile = typeof navigator !== "undefined" && /mobi|android|iphone|ipad/i.test(navigator.userAgent);
    const scale = this.lite ? 1 : this.quality === "mid" ? 0.75 : 0.85;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1) * scale);
    this.renderer.shadowMap.enabled = this.quality !== "low" && !this.soft;
    if (this.quality === "low") this.post.setTier("low");
    else if (!(this.post as { composer?: unknown }).composer) this.upgradeGraphics();
    else this.post.setTier(this.quality);
    this.world.setLod?.(this.quality);
    this.applyGfxStep();
    this.onResize();
  }

  isPaused() {
    return this.paused;
  }

  /** Codex 64: restart zeros damage. Esc/pause does not. */
  restartRace() {
    this.placeGrid();
    this.player.damage = 0;
    this.player.dirt = 0;
    if (this.visuals[0]) applyDamage(this.visuals[0], 0, 0);
    this.countdown = 0;
    this.racing = true;
    this.player.finished = false;
    this.paused = false;
  }

  toggleMute() {
    this.audio.setMuted(!this.audio.isMuted());
    return this.audio.isMuted();
  }

  setTouch(partial: { steer?: number; throttle?: number; brake?: number; drift?: boolean; nitro?: boolean; rewind?: boolean }) {
    this.input.setTouch(partial);
  }

  enterPhoto() {
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

  exitPhoto() {
    this.photo = false;
    this.photoHide = false;
    this.photoLock = null;
    this.post.setFilter(0);
    this.renderer.setPixelRatio(this.drivePR);
    this.renderer.toneMappingExposure = this.driveExposure;
    this.onResize();
    this.pushHud();
  }

  frameWorld(x: number, z: number, y = 52, camY = 22, back = 28, fov = 40) {
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

  isPhoto() {
    return this.photo;
  }

  capturePhoto() {
    this.snapPhoto = true;
  }

  private flushSnap() {
    if (!this.snapPhoto) return;
    this.snapPhoto = false;
    try {
      const a = document.createElement("a");
      a.href = this.renderer.domElement.toDataURL("image/png");
      a.download = `rush-${Date.now()}.png`;
      a.click();
    } catch {
      /* ignore */
    }
  }

  cyclePhotoFilter() {
    this.photoFilter = (this.photoFilter + 1) % this.filterNames.length;
    this.post.setFilter(this.photoFilter);
    this.pushHud();
  }

  togglePhotoHud() {
    this.photoHide = !this.photoHide;
    this.pushHud();
  }

  cycleRadio() {
    const id = this.audio.cycleStation();
    this.radioToast = 2.6;
    return RADIO[id];
  }

  setAutoCycle(on: boolean) {
    this.autoCycle = on;
    this.clockBake = 0;
    this.pushHud();
  }

  getAutoCycle() {
    return this.autoCycle;
  }

  setNight(night: boolean) {
    if (this.disposed) return;
    this.clock = night ? 0.9 : 0.5;
    this.applyClockSky(false);
  }

  private applyLook() {
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

  private applyClockSky(rebake: boolean) {
    if (this.disposed) return;
    this.world.setClock(this.clock);
    const n = nightAmt(this.clock);
    this.applyLook();
    const baked = n > 0.5 ? getSkyNight() : getSkyDay();
    if (baked) {
      this.scene.background = baked;
    } else {
      this.scene.background = new THREE.Color(n > 0.5 ? 0x0a1424 : 0x1a74c4);
    }
    this.scene.environmentIntensity = n > 0.5 ? 0.28 : 0.88;
    this.post.setNight(n > 0.5);
    const lamps = n > 0.42;
    for (const vis of this.visuals) setCarLights(vis, lamps);
    for (const vis of this.trafficVis) setCarLights(vis, lamps);
    for (const vis of this.copVis) setCarLights(vis, lamps);
    if (!rebake || this.soft) {
      this.pushHud();
      return;
    }
    try {
      const env = bakeEnv(this.renderer, this.world.night);
      this.setEnvRT(env);
      this.scene.environment = env.texture;
    } catch {
      /* keep previous env */
    }
    this.pushHud();
  }

  private applyAltitudeLook() {
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

  private updateProbe() {
    if (!this.probeCam || !this.probeRT || this.soft) return;
    this.probeTick++;
    if (this.probeTick % 8 !== 1) return;
    const vis = this.visuals[0];
    if (vis) vis.group.visible = false;
    this.probeCam.position.set(this.player.x, this.player.y + 1.05, this.player.z);
    this.probeCam.update(this.renderer, this.scene);
    if (vis) {
      vis.group.visible = true;
      vis.bodyMat.envMap = this.probeRT.texture;
      vis.bodyMat.envMapIntensity = nightAmt(this.clock) > 0.5 ? 0.8 : 1.2;
    }
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.glLost = true;
  };

  private onContextRestored = () => {
    this.glLost = false;
    this.opts.onRestore?.();
  };

  private applyGfxStep() {
    const s = this.dyn.step;
    this.droppedTier = s > 0;
    this.world.setPlanar(s < 1);
    this.post.setBloom(s < 2);
    this.csmMuted = s >= 3;
    const base = this.lite ? 1 : this.quality === "mid" ? 0.75 : 0.85;
    const extra = Math.max(0, s - 3);
    const scale = Math.max(0.5, base * Math.pow(0.85, extra));
    const mobile = typeof navigator !== "undefined" && /mobi|android|iphone|ipad/i.test(navigator.userAgent);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1) * scale);
    this.onResize();
    if (import.meta.env.DEV) console.info("[gfx]", s, "planar", s < 1, "bloom", s < 2, "csm", s < 3, "px", scale.toFixed(2));
  }

  private shouldPresent(now: number) {
    if (this.quality !== "low" && !this.lite) return true;
    return now - this.lastPresent >= 1000 / 30;
  }

  private onResize() {
    const w = this.canvas.clientWidth;
    const h = Math.max(1, this.canvas.clientHeight);
    this.gfx.resize(w, h, this.renderer.getPixelRatio());
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const size = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(size);
    this.post.setSize(size.x, size.y);
  }

  private frame() {
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
      this.camMode = (this.camMode + 1) % 4;
      this.hood = this.camMode === 1;
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
      this.world.followMirror(this.player.x, this.player.z, this.player.yaw);
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

  private fixed(dt: number) {
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

  private stepDriftCraft(dt: number) {
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

  private standings() {
    return [...this.racers].sort((a, b) => b.raceScore() - a.raceScore());
  }

  private stepHeat(dt: number) {
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

  private pushCopsBack() {
    for (let i = 0; i < this.cops.length; i++) {
      const t = (this.player.progress - 0.12 - i * 0.03 + 1) % 1;
      this.cops[i].spawn(this.built, t, this.cops[i].aiOffset);
      this.cops[i].speed = 18;
    }
  }

  private ensureCops(n: number) {
    while (this.cops.length < n) {
      this.addCop(this.cops.length);
    }
  }

  private addCop(i: number) {
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

  private spawnRoadblock() {
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

  private tickRoadblock() {
    if (!this.blockGroup || this.blockT < 0) return;
    let ds = this.player.progress - this.blockT;
    if (ds < -0.5) ds += 1;
    if (ds > 0.12) this.clearRoadblock();
  }

  private navAngle() {
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

  private stampPois() {
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

  private clearRoadblock() {
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

  private checkKnockout() {
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

  private closeSector(i: number) {
    const t = this.sectorClock;
    this.sectorClock = 0;
    if (t < 0.4) return;
    const idx = ((i % 3) + 3) % 3;
    const best = this.bestSectors[idx];
    this.sectorDelta = Number.isFinite(best) && best < 1e8 ? t - best : 0;
    if (t < best) this.bestSectors[idx] = t;
  }

  private endRace() {
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

  private emitFinish() {
    if (this.finishedSent || !this.pendingResult) return;
    this.finishedSent = true;
    this.replaying = false;
    this.opts.onFinish(this.pendingResult);
  }

  skipReplay() {
    if (!this.replaying) return;
    this.replaying = false;
    this.emitFinish();
  }

  private recordSnap() {
    this.replayBuf.push(this.racers.map((r) => ({ x: r.x, y: r.y, z: r.z, yaw: r.yaw, speed: r.speed })));
    if (this.replayBuf.length > 140) this.replayBuf.shift();
  }

  private recordReplay(dt: number) {
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

  private takePack(): RewindPack {
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

  private applyPack(p: RewindPack) {
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

  private stepRewind(dt: number) {
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

  private stepPhoto(dt: number) {
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

  private stepReplay(dt: number) {
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
      this.camMode = (this.camMode + 1) % 4;
      this.hood = this.camMode === 1;
    }
  }

  private present(dt: number) {
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
        (blob.material as THREE.MeshBasicMaterial).opacity = this.world.night ? 0.55 : 0.38;
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
    if (p.drifting || p.impact > 0.18) {
      const spread = p.impact > 0.18 ? 1.4 : 0.8;
      for (let k = 0; k < 8; k++) {
        const i = Math.floor(hash01(this.tickId, k, 1) * 60) * 3;
        this.sparkPos[i] = p.x - fx * 1.6 + (hash01(this.tickId, k, 2) - 0.5) * spread;
        this.sparkPos[i + 1] = p.y + 0.12 + hash01(this.tickId, k, 3) * 0.35;
        this.sparkPos[i + 2] = p.z - fz * 1.6 + (hash01(this.tickId, k, 4) - 0.5) * spread;
      }
      (this.sparks.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      this.sparks.visible = true;
      this.skidAcc += Math.abs(p.speed) * dt;
      if (this.skidAcc > 0.55) {
        this.skidAcc = 0;
        this.skidDummy.position.set(p.x - fx * 1.5, p.y + 0.06, p.z - fz * 1.5);
        this.skidDummy.rotation.y = p.yaw;
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
      if (hash01(this.tickId, 21) < 0.55) {
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
    (this.smokeMesh.material as THREE.MeshBasicMaterial).opacity = this.weather !== "clear" ? 0.28 : 0.2;
    (this.smokeMesh.material as THREE.MeshBasicMaterial).color.setHex(this.weather !== "clear" ? 0xc8d4dc : 0x9aa3aa);

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
    this.world.followMirror(this.player.x, this.player.z, this.player.yaw);

    if (this.rainMesh && this.rainPos) {
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

  private snapCamera(instant: boolean, dt = 0.016) {
    const p = this.player;
    this.lookBack = !this.replaying && (this.input.keys.has("KeyB") || !!navigator.getGamepads?.()?.[0]?.buttons[11]?.pressed || !!navigator.getGamepads?.()?.[0]?.buttons[13]?.pressed);
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    const rx = Math.cos(p.yaw);
    const rz = -Math.sin(p.yaw);
    const dir = this.lookBack ? -1 : 1;
    const mode = this.lookBack ? 0 : this.camMode;
    let follow = 7.4 + clamp(Math.abs(p.speed) / 22, 0, 2.2);
    let height = 1.92;
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

  setFovExtra(v: number) {
    this.fovExtra = clamp(v, 0, 12);
  }

  private pushHud() {
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
    });
  }

  private qaHookAllowed() {
    if (import.meta.env.VITE_QA === "1") return true;
    if (import.meta.env.DEV && typeof location !== "undefined") {
      const h = location.hostname;
      if (h === "127.0.0.1" || h === "localhost") return true;
    }
    return false;
  }

  private exposeControls() {
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

  private setEnvRT(rt: THREE.WebGLRenderTarget) {
    this.leases.release("env-rt");
    this.envRT = rt;
    this.leases.retain("env-rt", () => this.envRT.dispose());
  }

  private bindCsm() {
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

  private updateCsm() {
    if (!this.csm) return;
    if (this.csmMuted) {
      for (const L of this.csm.lights) L.intensity = 0;
      return;
    }
    this.csm.lightDirection.copy(this.world.sunDir).multiplyScalar(-1).normalize();
    const n = nightAmt(this.clock);
    const I = n > 0.5 ? 0.16 : 1.22;
    for (const L of this.csm.lights) L.intensity = I;
    this.csm.update();
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    window.removeEventListener("resize", this.onResize);
    if (this.booted) {
      this.input.dispose();
      this.audio.dispose();
      this.leases.release("csm");
      this.world.dispose();
      this.leases.disposeAll();
      this.sparks.geometry.dispose();
      (this.sparks.material as THREE.Material).dispose();
      if (this.blobs[0]) {
        this.blobs[0].geometry.dispose();
        (this.blobs[0].material as THREE.Material).dispose();
      }
      this.gate.geometry.dispose();
      (this.gate.material as THREE.Material).dispose();
      this.skidMesh.geometry.dispose();
      (this.skidMesh.material as THREE.Material).dispose();
      this.smokeMesh.geometry.dispose();
      (this.smokeMesh.material as THREE.Material).dispose();
      this.boostPts.geometry.dispose();
      (this.boostPts.material as THREE.Material).dispose();
      if (this.rainMesh) {
        this.rainMesh.geometry.dispose();
        (this.rainMesh.material as THREE.Material).dispose();
      }
      this.clearRoadblock();
    }
    this.leases.disposeAll();
    this.gfx.dispose();
    if (import.meta.env.DEV || import.meta.env.VITE_QA === "1") {
      delete window.__controlsTest;
      delete window.render_game_to_text;
    }
  }
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getOnTrack?: () => boolean;
      getProgress?: () => number;
      getX?: () => number;
      getZ?: () => number;
      getNitro?: () => number;
      getTrafficCount?: () => number;
      getStreetCount?: () => number;
      getSideStreet?: () => string;
      getMode?: () => string;
      getCopCount?: () => number;
      getHeat?: () => number;
      getDriftScore?: () => number;
      getLaps?: () => number;
      getWeather?: () => string;
      getGhost?: () => number;
      getTuneSpeed?: () => number;
      getCamMode?: () => number;
      getDrafting?: () => boolean;
      getDamage?: () => number;
      getRoll?: () => number;
      getSurface?: () => number;
      getGear?: () => number;
      getSteer?: () => number;
      getKinMix?: () => number;
      getCycle?: () => boolean;
      isReplay?: () => boolean;
      skipReplay?: () => void;
      finishNow?: () => void;
      enterPhoto?: () => void;
      exitPhoto?: () => void;
      isRewinding?: () => boolean;
      rewindLen?: () => number;
      setSteer?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
      setThrottle?: (v: number) => void;
      setCarId?: (id: string) => void;
      setAssists?: (a: { abs?: boolean; tcs?: boolean; esc?: boolean }) => void;
      setNitro?: (v: number) => void;
      setDamage?: (v: number) => void;
      skipCountdown?: () => void;
      resetStart?: () => void;
      setProgress?: (t: number) => void;
      getY?: () => number;
      getAirborne?: () => boolean;
      getColliders?: () => { x: number; z: number; r: number; kind: string }[];
      getTrackWidth?: () => number;
      getNearestDist?: (x: number, z: number) => number;
      getSide?: () => string;
      getRamps?: () => { x: number; z: number; sx: number; sz: number; len: number; y0: number; y1: number; he: string }[];
      teleport?: (x: number, z: number, yaw: number, y?: number) => void;
      getTick?: () => number;
      isTimeVoided?: () => boolean;
      isGlLost?: () => boolean;
      advanceTime?: (ms: number) => void;
      getHandling?: () => string;
      getAbs?: () => boolean;
      getPhysicsHz?: () => number;
      getPhysicsVersion?: () => number;
      getVis?: () => number;
      exportTelemetry?: () => { n: number; p50: number; p95: number; p99: number; last: number; backend: string };
      gotoGolden?: (id: string) => boolean;
      frameWorld?: (x: number, z: number, y?: number) => void;
      frameAzrieli?: () => void;
      frameToHa?: () => void;
      frameCityGate?: () => void;
      frameMidtown?: () => void;
      frameElectra?: () => void;
      frameSavidor?: () => void;
      frameHagana?: () => void;
      frameUniversity?: () => void;
      frameGaluyot?: () => void;
      framePlatinum?: () => void;
      frameTau?: () => void;
      frameSarona?: () => void;
      frameHakirya?: () => void;
      frameShalomMeir?: () => void;
      getPhotoLock?: () => { px: number; py: number; pz: number; lx: number; ly: number; lz: number; fov: number } | null;
      setNight?: (n: boolean) => void;
      webgpuTried?: () => boolean;
      webgpuOk?: () => boolean;
      webgpuReason?: () => string;
      blobKtx2?: () => boolean;
      getMemory?: () => { textures: number; geometries: number };
    };
    render_game_to_text?: () => string;
  }
}
