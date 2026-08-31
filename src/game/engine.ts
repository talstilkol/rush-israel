import * as THREE from "three";
import { GameAudio, RADIO } from "./audio";
// RSH-019-OVERLAY-BEGIN:engine-car-disposer-import
import { createCarVisual, disposeCarVisual, pulsePolice, setCarLights, updateCarVisual, applyDamage, type CarVisual } from "./car-mesh";
// RSH-019-OVERLAY-END:engine-car-disposer-import
import { getEvent } from "./career";
import { finishLine, introLine, overtakeLine } from "./dialog";
import { applyTune, emptyTune, paceGhost, racePayout, sampleGhost, sampleGhostLoop, WEATHER_GRIP, type GhostFrame } from "./garage";
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
import { loadSky } from "./sky-assets";
import { RenderTelemetry } from "../rendering/RenderTelemetry";
import { AYALON_GOLDEN } from "../world/goldenCameras";
import { RendererFacade } from "../rendering/RendererFacade";
import { profileFromLegacy } from "../rendering/QualityProfile";
import { FOG, fogKey, LOOKS, lookFromFlags } from "../rendering/EnvironmentState";
// RSH-019-OVERLAY-BEGIN:engine-disposal-imports
import { ResourceRegistry } from "../rendering/ResourceRegistry";
import { createObject3DDisposalTracker, disposeObject3D } from "../rendering/disposeObject3D";
// RSH-019-OVERLAY-END:engine-disposal-imports
import { DynamicQualityController, gfxPassFlags } from "../rendering/DynamicQualityController";
import { exportPhotoPng } from "./photo-export";
import { MESH_STREAMING } from "./stream-flag";
import type { EngineAdapterHost } from "./engine/adapter-host";
import * as engineLoop from "./engine/loop-adapter";
import * as engineRendering from "./engine/rendering-adapter";
import * as enginePhysics from "./engine/physics-adapter";
import * as engineQa from "./engine/qa-adapter";

function engineAdapterHost(engine: RaceEngine): EngineAdapterHost {
  return engine as unknown as EngineAdapterHost;
}

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
  private camNames = ["chase"];
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
    this.camera = new THREE.PerspectiveCamera(68, canvas.clientWidth / Math.max(1, canvas.clientHeight), 0.28, mountain ? Math.max(spec.far, 12000) : spec.far);

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
    await loadLaneArrow();
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
    if (!this.soft && this.quality !== "low" && this.renderer.shadowMap.enabled) {
      this.world.dir.castShadow = false;
      this.world.dirNear.castShadow = false;
      const high = this.quality === "high";
      this.csm = new CSM({
        camera: this.camera,
        parent: this.scene,
        cascades: high ? 3 : 1,
        maxFar: high ? 160 : 90,
        mode: "practical",
        shadowMapSize: high ? 1024 : 512,
        lightIntensity: 1.25,
        lightNear: 1,
        lightFar: high ? 280 : 140,
        lightMargin: 28,
        shadowBias: -0.00008,
      });
      // RSH-019-OVERLAY-BEGIN:engine-csm-lease
      const csm = this.csm;
      this.leases.retain("csm", () => {
        csm.remove();
        csm.dispose();
        if (this.csm === csm) this.csm = null;
      }, { owner: "race-engine", kind: "csm" });
      // RSH-019-OVERLAY-END:engine-csm-lease
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

    const playerDef = applyTune(getCar(this.opts.carId), emptyTune());
    this.player = new ArcadeCar(playerDef, playerDef.nameHe);
    this.player.roam = (this.opts.mode ?? "circuit") === "roam" || this.opts.trackId === "gushdan";
    this.player.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
    this.player.weather = this.weather;
    this.player.handling = this.opts.handling ?? "arcade";
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
        i === 0 && !soft && this.quality !== "low",
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
      // RSH-019-OVERLAY-BEGIN:engine-probe-lease
      const probeRT = this.probeRT;
      this.leases.retain("probe-rt", () => {
        probeRT.dispose();
        if (this.probeRT === probeRT) this.probeRT = null;
      }, { owner: "race-engine", kind: "render-target" });
      // RSH-019-OVERLAY-END:engine-probe-lease
      this.probeCam = new THREE.CubeCamera(1.2, 220, this.probeRT);
    }

    const blobTex = getBlob();
    if (!blobTex) throw new Error("blob texture missing");
    const blobGeo = new THREE.PlaneGeometry(4.9, 2.45);
    blobGeo.rotateX(-Math.PI / 2);
    const blobMat = new THREE.MeshBasicMaterial({
      map: blobTex,
      transparent: true,
      opacity: this.opts.night ? 0.68 : 0.5,
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

    const skidGeo = new THREE.PlaneGeometry(0.62, 1.55);
    skidGeo.rotateX(-Math.PI / 2);
    const skidMat = new THREE.MeshBasicMaterial({
      map: blobTex,
      color: 0x121416,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    this.skidMesh = new THREE.InstancedMesh(skidGeo, skidMat, 180);
    this.skidMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.skidMesh.count = 0;
    this.scene.add(this.skidMesh);

    const smokeGeo = new THREE.PlaneGeometry(1.6, 1.6);
    smokeGeo.rotateX(-Math.PI / 2);
    const smokeMat = new THREE.MeshBasicMaterial({
      map: blobTex,
      color: 0xb0b8be,
      transparent: true,
      opacity: 0.26,
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
    if (!this.captureSceneEnv()) {
      try {
        const env = bakeEnv(this.renderer, this.world.night);
        this.setEnvRT(env);
        this.scene.environment = env.texture;
      } catch {
        /* probe is optional */
      }
    }
    this.scene.environmentIntensity = this.world.night ? 0.42 : 0.7;
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
      const lat = i === 0 ? (this.trackDef.id === "rothschild" ? -10.2 : -2.2) : this.racers[i].aiOffset;
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
      const lane = this.trackDef.id === "rothschild" ? 10.2 : Math.min(kind === "truck" ? 2.6 : 3.4, this.built.width * 0.28);
      cab.aiOffset = (i % 2 === 0 ? -1 : 1) * lane;
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
    return engineRendering.upgradeGraphics.call(engineAdapterHost(this));
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
    this.csmMuted = this.quality === "low" || this.soft;
    const mobile = typeof navigator !== "undefined" && /mobi|android|iphone|ipad/i.test(navigator.userAgent);
    const scale = this.lite ? 1 : this.quality === "mid" ? 0.75 : 0.85;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1) * scale);
    this.renderer.shadowMap.enabled = this.quality !== "low" && !this.soft;
    if (this.quality === "low") this.post.setTier("low");
    else if (!(this.post as { composer?: unknown }).composer) this.upgradeGraphics();
    else this.post.setTier(this.quality);
    this.world.setLod?.(this.quality);
    if (this.rainMesh) this.rainMesh.visible = this.quality !== "low" && this.weather !== "clear" && this.weather !== "hamsin";
    this.trimCsm();
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
    return engineRendering.enterPhoto.call(engineAdapterHost(this));
  }

  exitPhoto() {
    return engineRendering.exitPhoto.call(engineAdapterHost(this));
  }

  frameWorld(x: number, z: number, y = 52, camY = 22, back = 28, fov = 40) {
    return engineRendering.frameWorld.call(engineAdapterHost(this), x, z, y, camY, back, fov);
  }

  isPhoto() {
    return engineRendering.isPhoto.call(engineAdapterHost(this));
  }

  capturePhoto() {
    return engineRendering.capturePhoto.call(engineAdapterHost(this));
  }

  private flushSnap() {
    return engineRendering.flushSnap.call(engineAdapterHost(this));
  }

  cyclePhotoFilter() {
    return engineRendering.cyclePhotoFilter.call(engineAdapterHost(this));
  }

  togglePhotoHud() {
    return engineRendering.togglePhotoHud.call(engineAdapterHost(this));
  }

  cycleRadio() {
    const id = this.audio.cycleStation();
    this.radioToast = 2.6;
    return RADIO[id];
  }

  setAutoCycle(on: boolean) {
    return engineRendering.setAutoCycle.call(engineAdapterHost(this), on);
  }

  getAutoCycle() {
    return engineRendering.getAutoCycle.call(engineAdapterHost(this));
  }

  setNight(night: boolean) {
    return engineRendering.setNight.call(engineAdapterHost(this), night);
  }

  private applyLook() {
    return engineRendering.applyLook.call(engineAdapterHost(this));
  }

  private applyClockSky(rebake: boolean) {
    return engineRendering.applyClockSky.call(engineAdapterHost(this), rebake);
  }

  private captureSceneEnv() {
    return engineRendering.captureSceneEnv.call(engineAdapterHost(this));
  }

  private applyAltitudeLook() {
    return engineRendering.applyAltitudeLook.call(engineAdapterHost(this));
  }

  private updateProbe() {
    return engineRendering.updateProbe.call(engineAdapterHost(this));
  }

  private onContextLost = (e: Event) => engineLoop.onContextLost.call(engineAdapterHost(this), e);

  private onContextRestored = () => engineLoop.onContextRestored.call(engineAdapterHost(this));

  private applyGfxStep() {
    return engineRendering.applyGfxStep.call(engineAdapterHost(this));
  }

  private shouldPresent(now: number) {
    return engineLoop.shouldPresent.call(engineAdapterHost(this), now);
  }

  private onResize() {
    return engineLoop.onResize.call(engineAdapterHost(this));
  }

  private frame() {
    return engineLoop.frame.call(engineAdapterHost(this));
  }

  private fixed(dt: number) {
    return enginePhysics.fixed.call(engineAdapterHost(this), dt);
  }

  private stepDriftCraft(dt: number) {
    return enginePhysics.stepDriftCraft.call(engineAdapterHost(this), dt);
  }

  private standings() {
    return enginePhysics.standings.call(engineAdapterHost(this));
  }

  private stepHeat(dt: number) {
    return enginePhysics.stepHeat.call(engineAdapterHost(this), dt);
  }

  private pushCopsBack() {
    return enginePhysics.pushCopsBack.call(engineAdapterHost(this));
  }

  private ensureCops(n: number) {
    return enginePhysics.ensureCops.call(engineAdapterHost(this), n);
  }

  private addCop(i: number) {
    return enginePhysics.addCop.call(engineAdapterHost(this), i);
  }

  private spawnRoadblock() {
    return enginePhysics.spawnRoadblock.call(engineAdapterHost(this));
  }

  private tickRoadblock() {
    return enginePhysics.tickRoadblock.call(engineAdapterHost(this));
  }

  private navAngle() {
    return enginePhysics.navAngle.call(engineAdapterHost(this));
  }

  private stampPois() {
    return enginePhysics.stampPois.call(engineAdapterHost(this));
  }

  private clearRoadblock() {
    return enginePhysics.clearRoadblock.call(engineAdapterHost(this));
  }

  private checkKnockout() {
    return enginePhysics.checkKnockout.call(engineAdapterHost(this));
  }

  private closeSector(i: number) {
    return enginePhysics.closeSector.call(engineAdapterHost(this), i);
  }

  private endRace() {
    return enginePhysics.endRace.call(engineAdapterHost(this));
  }

  private emitFinish() {
    return enginePhysics.emitFinish.call(engineAdapterHost(this));
  }

  skipReplay() {
    return enginePhysics.skipReplay.call(engineAdapterHost(this));
  }

  private recordSnap() {
    return enginePhysics.recordSnap.call(engineAdapterHost(this));
  }

  private recordReplay(dt: number) {
    return enginePhysics.recordReplay.call(engineAdapterHost(this), dt);
  }

  private takePack(): RewindPack {
    return enginePhysics.takePack.call(engineAdapterHost(this));
  }

  private applyPack(p: RewindPack) {
    return enginePhysics.applyPack.call(engineAdapterHost(this), p);
  }

  private stepRewind(dt: number) {
    return enginePhysics.stepRewind.call(engineAdapterHost(this), dt);
  }

  private stepPhoto(dt: number) {
    return engineRendering.stepPhoto.call(engineAdapterHost(this), dt);
  }

  private stepReplay(dt: number) {
    return enginePhysics.stepReplay.call(engineAdapterHost(this), dt);
  }

  private present(dt: number) {
    return engineRendering.present.call(engineAdapterHost(this), dt);
  }

  private snapCamera(instant: boolean, dt = 0.016) {
    return engineRendering.snapCamera.call(engineAdapterHost(this), instant, dt);
  }

  setFovExtra(v: number) {
    return engineRendering.setFovExtra.call(engineAdapterHost(this), v);
  }

  private pushHud() {
    return engineRendering.pushHud.call(engineAdapterHost(this));
  }

  private qaHookAllowed() {
    return engineQa.qaHookAllowed.call(engineAdapterHost(this));
  }

  private exposeControls() {
    return engineQa.exposeControls.call(engineAdapterHost(this));
  }

  private setEnvRT(rt: THREE.WebGLRenderTarget) {
    return engineRendering.setEnvRT.call(engineAdapterHost(this), rt);
  }

  private bindCsm() {
    return engineRendering.bindCsm.call(engineAdapterHost(this));
  }

  private csmWanted() {
    return engineRendering.csmWanted.call(engineAdapterHost(this));
  }

  private trimCsm() {
    return engineRendering.trimCsm.call(engineAdapterHost(this));
  }

  private updateCsm() {
    return engineRendering.updateCsm.call(engineAdapterHost(this));
  }

  // RSH-019-OVERLAY-BEGIN:engine-dispose
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    window.removeEventListener("resize", this.onResize);

    this.clearRoadblock();
    this.input?.dispose();
    this.audio?.dispose();

    // Reverse-order leases release post-processing, render targets and CSM
    // before world materials and the renderer are destroyed.
    this.leases.disposeAll();
    this.world?.dispose();

    const tracker = createObject3DDisposalTracker();
    for (const visual of this.visuals ?? []) disposeCarVisual(visual, tracker);
    for (const visual of this.trafficVis ?? []) disposeCarVisual(visual, tracker);
    for (const visual of this.copVis ?? []) disposeCarVisual(visual, tracker);
    if (this.ghostVis) disposeCarVisual(this.ghostVis, tracker);
    if (this.rivalGhostVis) disposeCarVisual(this.rivalGhostVis, tracker);
    disposeObject3D(this.scene, tracker);
    this.scene.environment = null;
    this.scene.background = null;
    this.renderer.renderLists.dispose();
    this.gfx.dispose();

    if (import.meta.env.DEV || import.meta.env.VITE_QA === "1") {
      delete window.__controlsTest;
      delete window.render_game_to_text;
    }
  }
}
  // RSH-019-OVERLAY-END:engine-dispose


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
      getCsmCascades?: () => number;
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
