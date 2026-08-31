import { $ as RepeatWrapping, A as DodecahedronGeometry, B as MathUtils, C as ClampToEdgeWrapping, D as CylinderGeometry, E as CubeCamera, F as Group, G as MeshStandardMaterial, H as MeshBasicMaterial, I as HalfFloatType, J as PerspectiveCamera, K as NearestFilter, L as HemisphereLight, M as ExtrudeGeometry, N as Float32BufferAttribute, P as FogExp2, Q as PointsMaterial, R as InstancedMesh, S as CircleGeometry, T as ConeGeometry, U as MeshLambertMaterial, V as Mesh, W as MeshPhysicalMaterial, X as PointLight, Y as PlaneGeometry, Z as Points, _ as WebGLRenderer, a as LensflareElement, at as TextureLoader, b as BufferAttribute, c as SMAAPass, ct as Vector2, d as EffectComposer, et as SRGBColorSpace, f as ShaderPass, g as WebGLCubeRenderTarget, h as PMREMGenerator, i as Lensflare, it as SpotLight, j as DynamicDrawUsage, k as DirectionalLight, l as RenderPass, lt as Vector3, m as GLTFLoader, n as Sky, nt as Shape, o as CSM, ot as TorusGeometry, p as MeshoptDecoder, q as Object3D, r as Reflector, rt as SphereGeometry, s as UnrealBloomPass, st as UnsignedByteType, tt as Scene, u as OutputPass, ut as WebGLRenderTarget, v as AmbientLight, w as Color, x as BufferGeometry, y as BoxGeometry } from "../_libs/three.mjs";
import { getAyalonRoad, getBakedRoad, loadRoadFor } from "./road-assets-DFzE_7km.mjs";
import { c as hashStr, d as mulberry32, f as wrapPi, i as expSmooth, l as lerp, n as catmullRom, o as forwardDelta, r as clamp, s as hash01 } from "./router-BpHl7PX6.mjs";
import { $ as her, A as getCar, B as afl, C as emptyTune, Ct as tib, D as sampleGhostLoop, E as sampleGhost, F as skyAt, G as bsv, H as asd, I as skyFor, J as dsea, K as bym, L as streetName, M as getTrack, N as nearestPoi, O as CARS, P as nightAmt, Q as hdr, R as todLabel, S as applyTune, St as rsh, T as racePayout, Tt as tzf, U as ask, V as ard, W as bsn, X as gol, Y as eil, Z as hai, _ as tcsModulate, _t as pth, a as setDamage, at as hwy90, b as hasCops, bt as rhv, c as MAX_ACCUMULATOR, ct as ksb, d as WEATHER_SPEC, dt as mas, et as hol, f as absModulate, ft as mod, g as pacejka, gt as nik, h as hydroplane, ht as net, i as recordGhost, it as hwy6, j as getEvent, k as RIVALS, l as PHYSICS_DT, lt as ksm, m as escYaw, mt as naz, n as getDamage, nt as hwy2, o as DEFAULT_ASSISTS, ot as hzl, p as brakeForce, pt as nah, q as cae, r as getGhost, rt as hwy40, s as HANDLING, st as jer, tt as hwy1, u as SURFACE_SPEC, ut as lodp, v as MODE_LAPS, vt as raa, w as paceGhost, wt as tlv, x as WEATHER_GRIP, xt as rml, y as hasAiPack, yt as ram, z as acr } from "./routes-DbBF9-mc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-9xlcmuIB.js
var RADIO = [
	{
		id: 0,
		he: "פאלס 101",
		en: "Pulse 101"
	},
	{
		id: 1,
		he: "גל ים",
		en: "Yam FM"
	},
	{
		id: 2,
		he: "המחתרת",
		en: "Underground"
	},
	{
		id: 3,
		he: "לילה לבן",
		en: "White Night"
	}
];
function hz(midi) {
	return 440 * Math.pow(2, (midi - 69) / 12);
}
var STATIONS = [
	{
		bpm: 126,
		kick: [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			1,
			0,
			0,
			0,
			1,
			0,
			1,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			1
		],
		hat: [
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			0
		],
		bass: [
			45,
			0,
			45,
			48,
			0,
			45,
			41,
			0,
			45,
			0,
			48,
			0,
			43,
			0,
			41,
			43
		],
		chords: [
			[
				57,
				60,
				64
			],
			[
				53,
				57,
				60
			],
			[
				48,
				52,
				55
			],
			[
				55,
				59,
				62
			]
		],
		lead: [
			72,
			0,
			76,
			0,
			74,
			72,
			0,
			69,
			72,
			0,
			76,
			79,
			0,
			76,
			74,
			0
		]
	},
	{
		bpm: 94,
		kick: [
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			1
		],
		bass: [
			50,
			0,
			0,
			50,
			0,
			0,
			53,
			0,
			50,
			0,
			48,
			0,
			45,
			0,
			47,
			0
		],
		chords: [
			[
				62,
				66,
				69
			],
			[
				57,
				61,
				64
			],
			[
				53,
				57,
				60
			],
			[
				55,
				59,
				62
			]
		],
		lead: [
			74,
			0,
			0,
			76,
			0,
			74,
			69,
			0,
			71,
			0,
			74,
			0,
			69,
			0,
			67,
			0
		]
	},
	{
		bpm: 138,
		kick: [
			1,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			1,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			1,
			1,
			1,
			1,
			1,
			0,
			1,
			1,
			1,
			1,
			1,
			0,
			1,
			1,
			1,
			1
		],
		bass: [
			40,
			40,
			0,
			43,
			40,
			0,
			36,
			40,
			40,
			0,
			43,
			0,
			38,
			38,
			0,
			36
		],
		chords: [
			[
				52,
				55,
				59
			],
			[
				48,
				52,
				55
			],
			[
				50,
				53,
				57
			],
			[
				47,
				50,
				55
			]
		],
		lead: [
			76,
			79,
			0,
			76,
			0,
			72,
			71,
			0,
			76,
			0,
			79,
			83,
			0,
			79,
			76,
			0
		]
	},
	{
		bpm: 108,
		kick: [
			1,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0
		],
		bass: [
			44,
			0,
			44,
			47,
			0,
			44,
			42,
			0,
			44,
			0,
			49,
			0,
			47,
			0,
			42,
			44
		],
		chords: [
			[
				56,
				59,
				63
			],
			[
				54,
				58,
				61
			],
			[
				51,
				54,
				58
			],
			[
				49,
				54,
				58
			]
		],
		lead: [
			68,
			0,
			71,
			75,
			0,
			71,
			68,
			0,
			66,
			0,
			68,
			71,
			0,
			75,
			73,
			0
		]
	}
];
var GameAudio = class {
	ctx = null;
	master = null;
	sfx = null;
	engineGain = null;
	engineOsc = null;
	engineOsc2 = null;
	driftGain = null;
	driftSrc = null;
	musicGain = null;
	muted = false;
	started = false;
	sirenOsc = null;
	sirenGain = null;
	sirenT = 0;
	rainGain = null;
	rainSrc = null;
	station = 0;
	voice = 1;
	voiceVol = 1;
	sched = 0;
	step = 0;
	noise = null;
	visBound = false;
	unbindVisibility = null;
	unlock() {
		if (!this.started) this.bootGraph();
		this.resumeSync();
		this.bindVisibility();
	}
	resumeSync() {
		const ctx = this.ctx;
		if (!ctx) return;
		if (ctx.state === "suspended") ctx.resume();
	}
	bindVisibility() {
		if (this.visBound || typeof document === "undefined") return;
		this.visBound = true;
		const onVis = () => {
			if (document.visibilityState === "visible") this.resumeSync();
		};
		document.addEventListener("visibilitychange", onVis);
		window.addEventListener("focus", onVis);
		this.unbindVisibility = () => {
			document.removeEventListener("visibilitychange", onVis);
			window.removeEventListener("focus", onVis);
			this.visBound = false;
		};
	}
	bootGraph() {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return;
		const ctx = new AC({ latencyHint: "interactive" });
		this.ctx = ctx;
		this.master = ctx.createGain();
		this.sfx = ctx.createGain();
		this.engineGain = ctx.createGain();
		this.driftGain = ctx.createGain();
		this.master.gain.value = .55;
		this.sfx.gain.value = .7;
		this.engineGain.gain.value = 0;
		this.driftGain.gain.value = 0;
		this.sfx.connect(this.master);
		this.engineGain.connect(this.master);
		this.driftGain.connect(this.master);
		this.musicGain = ctx.createGain();
		this.musicGain.gain.value = .22;
		this.musicGain.connect(this.master);
		this.sirenGain = ctx.createGain();
		this.sirenGain.gain.value = 0;
		this.sirenGain.connect(this.master);
		const siren = ctx.createOscillator();
		siren.type = "square";
		siren.frequency.value = 740;
		siren.connect(this.sirenGain);
		siren.start();
		this.sirenOsc = siren;
		this.rainGain = ctx.createGain();
		this.rainGain.gain.value = 0;
		this.rainGain.connect(this.master);
		this.noise = this.makeNoise();
		if (this.noise) {
			const src = ctx.createBufferSource();
			src.buffer = this.noise;
			src.loop = true;
			const hp = ctx.createBiquadFilter();
			hp.type = "highpass";
			hp.frequency.value = 1400;
			src.connect(hp);
			hp.connect(this.rainGain);
			src.start();
			this.rainSrc = src;
		}
		this.master.connect(ctx.destination);
		const osc = ctx.createOscillator();
		osc.type = "sawtooth";
		osc.frequency.value = 70;
		const osc2 = ctx.createOscillator();
		osc2.type = "triangle";
		osc2.frequency.value = 90;
		const filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 420;
		osc.connect(filter);
		osc2.connect(filter);
		filter.connect(this.engineGain);
		osc.start();
		osc2.start();
		this.engineOsc = osc;
		this.engineOsc2 = osc2;
		if (this.noise) {
			const src = ctx.createBufferSource();
			src.buffer = this.noise;
			src.loop = true;
			const bp = ctx.createBiquadFilter();
			bp.type = "bandpass";
			bp.frequency.value = 900;
			src.connect(bp);
			bp.connect(this.driftGain);
			src.start();
			this.driftSrc = src;
		}
		this.started = true;
		this.sched = ctx.currentTime + .05;
		this.step = 0;
	}
	makeNoise() {
		if (!this.ctx) return null;
		const len = this.ctx.sampleRate * 1.2;
		const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < len; i++) data[i] = hash01(i, 97) * 2 - 1;
		return buf;
	}
	noiseBuffer() {
		return this.noise ?? this.makeNoise();
	}
	setMuted(m) {
		this.muted = m;
		if (this.master) this.master.gain.setTargetAtTime(m ? 0 : .55, this.ctx.currentTime, .04);
	}
	isMuted() {
		return this.muted;
	}
	setVoice(kind) {
		if (kind === "ev") {
			this.voice = 1.85;
			this.voiceVol = .55;
		} else if (kind === "muscle") {
			this.voice = .7;
			this.voiceVol = 1.35;
		} else if (kind === "super") {
			this.voice = 1.28;
			this.voiceVol = 1.12;
		} else if (kind === "rally") {
			this.voice = .92;
			this.voiceVol = 1.18;
		} else {
			this.voice = 1;
			this.voiceVol = 1;
		}
	}
	updateEngine(speedAbs, boosting, drifting, slip = 0, rpm01 = 0) {
		if (!this.ctx || !this.engineOsc || !this.engineGain) return;
		const t = this.ctx.currentTime;
		const rpm = (85 + rpm01 * 540 + (boosting ? 55 : 0) + speedAbs * .9) * this.voice;
		this.engineOsc.frequency.setTargetAtTime(rpm, t, .04);
		this.engineOsc2?.frequency.setTargetAtTime(rpm * (this.voice < .85 ? 1.12 : 1.34), t, .04);
		const vol = this.muted ? 0 : Math.min(.38, (.06 + speedAbs * .0055 + rpm01 * .05) * this.voiceVol);
		this.engineGain.gain.setTargetAtTime(vol, t, .05);
		const scream = drifting || slip > .2;
		this.driftGain?.gain.setTargetAtTime(this.muted ? 0 : scream ? .035 + slip * .12 : 0, t, .04);
		if (this.musicGain && !this.muted) this.musicGain.gain.setTargetAtTime(boosting ? .1 : speedAbs > 8 ? .16 : .22, t, .1);
	}
	beep(freq, dur = .12, vol = .18) {
		if (!this.ctx || !this.sfx || this.muted) return;
		const t = this.ctx.currentTime;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = "square";
		o.frequency.value = freq;
		g.gain.setValueAtTime(vol, t);
		g.gain.exponentialRampToValueAtTime(.001, t + dur);
		o.connect(g);
		g.connect(this.sfx);
		o.start(t);
		o.stop(t + dur + .02);
	}
	whoosh() {
		if (!this.ctx || !this.sfx || this.muted) return;
		const t = this.ctx.currentTime;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = "sawtooth";
		o.frequency.setValueAtTime(240, t);
		o.frequency.exponentialRampToValueAtTime(90, t + .28);
		g.gain.setValueAtTime(.12, t);
		g.gain.exponentialRampToValueAtTime(.001, t + .3);
		o.connect(g);
		g.connect(this.sfx);
		o.start(t);
		o.stop(t + .32);
	}
	impact(amount = .5) {
		if (!this.ctx || !this.sfx || this.muted) return;
		const t = this.ctx.currentTime;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = "sine";
		o.frequency.setValueAtTime(90 + amount * 40, t);
		o.frequency.exponentialRampToValueAtTime(32, t + .16);
		const vol = .08 + amount * .16;
		g.gain.setValueAtTime(vol, t);
		g.gain.exponentialRampToValueAtTime(.001, t + .22);
		o.connect(g);
		g.connect(this.sfx);
		o.start(t);
		o.stop(t + .24);
		const n = this.ctx.createBufferSource();
		const noise = this.noiseBuffer();
		if (noise) {
			n.buffer = noise;
			const ng = this.ctx.createGain();
			const bp = this.ctx.createBiquadFilter();
			bp.type = "lowpass";
			bp.frequency.value = 380;
			ng.gain.setValueAtTime(.06 + amount * .1, t);
			ng.gain.exponentialRampToValueAtTime(.001, t + .14);
			n.connect(bp);
			bp.connect(ng);
			ng.connect(this.sfx);
			n.start(t);
			n.stop(t + .16);
		}
	}
	cheer() {
		if (!this.ctx || !this.sfx || this.muted) return;
		const t = this.ctx.currentTime;
		const noise = this.noiseBuffer();
		if (noise) {
			const src = this.ctx.createBufferSource();
			src.buffer = noise;
			const g = this.ctx.createGain();
			const bp = this.ctx.createBiquadFilter();
			bp.type = "bandpass";
			bp.frequency.value = 1200;
			g.gain.setValueAtTime(.12, t);
			g.gain.exponentialRampToValueAtTime(.001, t + 1.1);
			src.connect(bp);
			bp.connect(g);
			g.connect(this.sfx);
			src.start(t);
			src.stop(t + 1.15);
		}
		this.beep(523, .18, .1);
		this.beep(784, .28, .1);
	}
	checkpoint() {
		this.beep(880, .08, .1);
		this.beep(1180, .1, .08);
	}
	finish() {
		this.beep(523, .16, .16);
		this.beep(659, .2, .14);
		this.beep(784, .28, .14);
	}
	tone(type, freq, t, dur, vol, dest, slide) {
		if (!this.ctx) return;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = type;
		o.frequency.setValueAtTime(Math.max(20, freq), t);
		if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur * .7);
		g.gain.setValueAtTime(Math.max(1e-4, vol), t);
		g.gain.exponentialRampToValueAtTime(.001, t + dur);
		o.connect(g);
		g.connect(dest);
		o.start(t);
		o.stop(t + dur + .02);
	}
	noiseHit(t, dur, vol, hpHz, dest) {
		if (!this.ctx || !this.noise) return;
		const src = this.ctx.createBufferSource();
		src.buffer = this.noise;
		const g = this.ctx.createGain();
		const f = this.ctx.createBiquadFilter();
		f.type = hpHz > 2e3 ? "highpass" : "bandpass";
		f.frequency.value = hpHz;
		g.gain.setValueAtTime(Math.max(1e-4, vol), t);
		g.gain.exponentialRampToValueAtTime(.001, t + dur);
		src.connect(f);
		f.connect(g);
		g.connect(dest);
		src.start(t);
		src.stop(t + dur + .02);
	}
	pulseMusic(night, _dt) {
		if (!this.ctx || !this.musicGain || this.muted) return;
		const st = STATIONS[this.station] ?? STATIONS[0];
		const now = this.ctx.currentTime;
		const stepDur = 60 / st.bpm / 4;
		if (this.sched < now - .4) this.sched = now;
		const dest = this.musicGain;
		while (this.sched < now + .14) {
			const i = this.step % 16;
			const bar = Math.floor(this.step / 16) % st.chords.length;
			const t = this.sched;
			if (st.kick[i]) this.tone("sine", night ? 95 : 78, t, .18, night ? .22 : .16, dest, 38);
			if (st.snare[i]) this.noiseHit(t, .12, .09, 1800, dest);
			if (st.hat[i]) this.noiseHit(t, .045, night ? .04 : .028, 5200, dest);
			if (st.bass[i]) {
				const type = this.station === 2 ? "square" : this.station === 1 ? "sine" : "sawtooth";
				this.tone(type, hz(st.bass[i]), t, stepDur * 1.35, this.station === 2 ? .07 : .09, dest);
			}
			if (i === 0) {
				const chord = st.chords[bar];
				const lp = this.ctx.createBiquadFilter();
				lp.type = "lowpass";
				lp.frequency.value = night ? 1400 : 900;
				const cg = this.ctx.createGain();
				cg.gain.setValueAtTime(1e-4, t);
				cg.gain.exponentialRampToValueAtTime(this.station === 1 ? .05 : .032, t + .08);
				cg.gain.exponentialRampToValueAtTime(.001, t + stepDur * 16 * .95);
				lp.connect(cg);
				cg.connect(dest);
				for (const n of chord) {
					const o = this.ctx.createOscillator();
					o.type = this.station === 2 ? "sawtooth" : "triangle";
					o.frequency.value = hz(n);
					o.connect(lp);
					o.start(t);
					o.stop(t + stepDur * 16);
				}
			}
			if (st.lead[i] && (night || this.station !== 1 || i % 4 === 0)) this.tone("triangle", hz(st.lead[i] + (night ? 0 : -12)), t, stepDur * 1.8, night ? .055 : .04, dest);
			this.step += 1;
			this.sched += stepDur;
		}
	}
	cycleStation() {
		this.station = (this.station + 1) % RADIO.length;
		this.step = 0;
		if (this.ctx) this.sched = this.ctx.currentTime + .02;
		return this.station;
	}
	getStation() {
		return this.station;
	}
	rewindTick() {
		this.beep(420, .04, .05);
	}
	updateRain(on, storm) {
		if (!this.ctx || !this.rainGain) return;
		const vol = this.muted || !on ? 0 : storm ? .08 : .045;
		this.rainGain.gain.setTargetAtTime(vol, this.ctx.currentTime, .12);
	}
	updateSiren(on, dt) {
		if (!this.ctx || !this.sirenGain || !this.sirenOsc) return;
		const t = this.ctx.currentTime;
		this.sirenGain.gain.setTargetAtTime(on && !this.muted ? .055 : 0, t, .08);
		if (!on) return;
		this.sirenT += dt;
		const hi = this.sirenT % .7 < .35;
		this.sirenOsc.frequency.setTargetAtTime(hi ? 910 : 680, t, .035);
	}
	bust() {
		this.beep(180, .4, .22);
		this.beep(140, .5, .18);
	}
	resume() {
		this.resumeSync();
	}
	dispose() {
		this.unbindVisibility?.();
		this.unbindVisibility = null;
		const safeStop = (node) => {
			try {
				node?.stop();
			} catch {}
		};
		safeStop(this.engineOsc);
		safeStop(this.engineOsc2);
		safeStop(this.driftSrc);
		safeStop(this.sirenOsc);
		safeStop(this.rainSrc);
		const context = this.ctx;
		this.ctx = null;
		this.master = null;
		this.sfx = null;
		this.engineGain = null;
		this.engineOsc = null;
		this.engineOsc2 = null;
		this.driftGain = null;
		this.driftSrc = null;
		this.musicGain = null;
		this.sirenOsc = null;
		this.sirenGain = null;
		this.rainGain = null;
		this.rainSrc = null;
		this.noise = null;
		this.started = false;
		if (context && context.state !== "closed") context.close().catch(() => {});
	}
};
var templates = /* @__PURE__ */ new Map();
/** Cloned extruded body from glTF. Not a scan. */
function cloneCarBody(kind, color, shadows) {
	const template = templates.get(kind) ?? templates.get("gt");
	if (!template) return;
	let src;
	template.traverse((o) => {
		if (o.isMesh && o.name === "body") src = o;
	});
	if (!src) return;
	const mesh = src.clone();
	mesh.geometry = src.geometry.clone();
	const mat = src.material.clone();
	mat.color.setHex(color);
	mesh.material = mat;
	mesh.castShadow = shadows;
	mesh.receiveShadow = true;
	mesh.name = "body";
	return mesh;
}
async function loadCars(_renderer) {
	if (templates.size) return;
	const loader = new GLTFLoader();
	loader.setMeshoptDecoder(MeshoptDecoder);
	await Promise.all([
		"gt",
		"hatch",
		"muscle",
		"rally",
		"super"
	].map(async (k) => {
		const gltf = await loader.loadAsync(`/game/car-${k}.glb`);
		templates.set(k, gltf.scene);
	}));
}
var tex$9;
function getBeam() {
	return tex$9;
}
async function loadBeam() {
	if (tex$9) return tex$9;
	const t = await new TextureLoader().loadAsync("/game/beam.png");
	t.colorSpace = "";
	t.needsUpdate = true;
	tex$9 = t;
	return tex$9;
}
var tex$8;
function getFlake() {
	return tex$8;
}
async function loadFlake() {
	if (tex$8) return tex$8;
	const t = await new TextureLoader().loadAsync("/game/flake.png");
	t.wrapS = t.wrapT = RepeatWrapping;
	t.repeat.set(8, 4);
	t.anisotropy = 4;
	t.colorSpace = "";
	t.needsUpdate = true;
	tex$8 = t;
	return tex$8;
}
function createObject3DDisposalTracker() {
	return {
		geometries: /* @__PURE__ */ new Set(),
		materials: /* @__PURE__ */ new Set()
	};
}
function disposeMaterial(material, tracker) {
	if (tracker.materials.has(material)) return;
	tracker.materials.add(material);
	material.dispose();
}
/**
* Disposes only Object3D-owned geometries and materials.
* Textures are intentionally excluded: global asset caches own their lifetime.
*/
function disposeObject3D(root, tracker = createObject3DDisposalTracker()) {
	const beforeGeometries = tracker.geometries.size;
	const beforeMaterials = tracker.materials.size;
	root.traverse((object) => {
		const renderable = object;
		if (renderable.geometry && !tracker.geometries.has(renderable.geometry)) {
			tracker.geometries.add(renderable.geometry);
			renderable.geometry.dispose();
		}
		const materials = Array.isArray(renderable.material) ? renderable.material : renderable.material ? [renderable.material] : [];
		for (const material of materials) disposeMaterial(material, tracker);
	});
	root.removeFromParent();
	root.clear();
	return {
		geometries: tracker.geometries.size - beforeGeometries,
		materials: tracker.materials.size - beforeMaterials
	};
}
var FLAKE = null;
function flakeMap() {
	if (FLAKE) return FLAKE;
	const baked = getFlake();
	if (baked) {
		FLAKE = baked;
		return baked;
	}
	return null;
}
function bindPaintFlakes(mat) {
	const prev = mat.onBeforeCompile;
	mat.onBeforeCompile = (shader, renderer) => {
		prev?.call(mat, shader, renderer);
		shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `
      outgoingLight += pow(max(dot(normal, normalize(vViewPosition)), 0.0), 72.0)
        * step(0.973, fract(sin(dot(normal.xy * 48.0, vec2(12.9898, 78.233))) * 43758.5453))
        * 0.4;
      #include <opaque_fragment>
      `);
	};
	const prevKey = mat.customProgramCacheKey?.bind(mat);
	mat.customProgramCacheKey = () => `${prevKey?.() ?? ""}|paint-flake-v1`;
}
function paint(color) {
	const c = new Color(color);
	const flake = flakeMap();
	const mat = new MeshPhysicalMaterial({
		color,
		metalness: .06,
		roughness: .22,
		roughnessMap: flake ?? void 0,
		bumpMap: flake ?? void 0,
		bumpScale: .04,
		clearcoat: 1,
		clearcoatRoughness: .06,
		clearcoatNormalMap: flake ?? void 0,
		clearcoatNormalScale: new Vector2(.22, .22),
		envMapIntensity: 1.4,
		sheen: .18,
		sheenColor: c.clone().multiplyScalar(.35),
		sheenRoughness: .35
	});
	bindPaintFlakes(mat);
	return mat;
}
var BEAM = null;
function beamCookie() {
	if (BEAM) return BEAM;
	const baked = getBeam();
	if (baked) {
		baked.wrapS = ClampToEdgeWrapping;
		baked.wrapT = ClampToEdgeWrapping;
		baked.colorSpace = "";
		BEAM = baked;
		return baked;
	}
	return null;
}
function carShape(kind) {
	const s = new Shape();
	const p = kind === "hatch" ? [
		[-2.02, .16],
		[-2.05, .5],
		[-1.78, .74],
		[-1.48, 1.24],
		[-.18, 1.34],
		[.52, 1.3],
		[.92, .8],
		[1.52, .64],
		[2, .5],
		[2.08, .32],
		[2.02, .15],
		[1.62, .14],
		[-1.62, .14]
	] : kind === "muscle" ? [
		[-2.4, .15],
		[-2.42, .46],
		[-2.08, .58],
		[-1.52, .6],
		[-1.22, 1.06],
		[-.12, 1.12],
		[.52, 1.08],
		[1.18, .6],
		[1.98, .5],
		[2.4, .46],
		[2.44, .26],
		[2.36, .14],
		[1.9, .13],
		[-1.9, .13]
	] : kind === "rally" ? [
		[-2.14, .18],
		[-2.16, .58],
		[-1.82, .8],
		[-1.52, 1.3],
		[-.18, 1.4],
		[.48, 1.36],
		[.9, .84],
		[1.42, .7],
		[2.08, .58],
		[2.16, .34],
		[2.08, .16],
		[1.68, .16],
		[-1.68, .16]
	] : kind === "super" ? [
		[-2.24, .13],
		[-2.26, .38],
		[-1.82, .46],
		[-1.32, .9],
		[-.18, .98],
		[.58, .94],
		[1.28, .5],
		[1.98, .4],
		[2.26, .36],
		[2.3, .2],
		[2.2, .12],
		[1.78, .12],
		[-1.78, .12]
	] : [
		[-2.24, .16],
		[-2.26, .48],
		[-1.92, .62],
		[-1.32, .64],
		[-1.08, 1.2],
		[-.12, 1.3],
		[.62, 1.26],
		[1.04, .72],
		[1.62, .6],
		[2.18, .5],
		[2.28, .32],
		[2.22, .15],
		[1.82, .14],
		[-1.82, .14]
	];
	s.moveTo(p[0][0], p[0][1]);
	for (let i = 1; i < p.length; i++) s.lineTo(p[i][0], p[i][1]);
	s.closePath();
	return s;
}
function bodyGeo(kind, width) {
	const g = new ExtrudeGeometry(carShape(kind), {
		depth: width,
		bevelEnabled: true,
		bevelThickness: .09,
		bevelSize: .07,
		bevelSegments: 4,
		steps: 1
	});
	g.translate(0, 0, -width / 2);
	g.rotateY(-Math.PI / 2);
	g.computeVertexNormals();
	return g;
}
function layout(kind) {
	if (kind === "hatch") return {
		L: 4.08,
		W: 1.76,
		wb: 2.52,
		track: 1.5,
		wheelR: .32,
		wheelY: .32,
		cabinZ: -.18,
		cabinL: 1.78,
		cabinH: .62,
		hoodL: 1.08,
		trunkL: .38,
		bodyH: .58
	};
	if (kind === "muscle") return {
		L: 4.82,
		W: 1.9,
		wb: 2.78,
		track: 1.62,
		wheelR: .34,
		wheelY: .34,
		cabinZ: -.48,
		cabinL: 1.42,
		cabinH: .46,
		hoodL: 1.58,
		trunkL: .9,
		bodyH: .52
	};
	if (kind === "rally") return {
		L: 4.32,
		W: 1.84,
		wb: 2.56,
		track: 1.54,
		wheelR: .36,
		wheelY: .38,
		cabinZ: -.1,
		cabinL: 1.68,
		cabinH: .64,
		hoodL: 1.12,
		trunkL: .52,
		bodyH: .62
	};
	if (kind === "super") return {
		L: 4.52,
		W: 1.96,
		wb: 2.62,
		track: 1.68,
		wheelR: .325,
		wheelY: .3,
		cabinZ: -.28,
		cabinL: 1.36,
		cabinH: .36,
		hoodL: 1.48,
		trunkL: .7,
		bodyH: .42
	};
	return {
		L: 4.5,
		W: 1.82,
		wb: 2.68,
		track: 1.54,
		wheelR: .33,
		wheelY: .33,
		cabinZ: -.16,
		cabinL: 1.62,
		cabinH: .54,
		hoodL: 1.22,
		trunkL: .78,
		bodyH: .56
	};
}
var TAXI_COLORS = /* @__PURE__ */ new Set([16106496, 15778816]);
function createCarVisual(color, accent, shadows, lit = false, kind = "gt", police = false, tune) {
	const group = new Group();
	const L = layout(kind);
	let bodyMat = paint(color);
	const accentMat = paint(accent);
	accentMat.roughness = .28;
	const dark = new MeshPhysicalMaterial({
		color: 1184792,
		metalness: .42,
		roughness: .46,
		envMapIntensity: .65
	});
	const glass = new MeshPhysicalMaterial({
		color: 9086132,
		metalness: .06,
		roughness: .07,
		transparent: true,
		opacity: .38,
		envMapIntensity: 2.2,
		clearcoat: 1,
		clearcoatRoughness: .06
	});
	const rubber = new MeshPhysicalMaterial({
		color: 1315862,
		metalness: .04,
		roughness: .58,
		envMapIntensity: .42,
		clearcoat: .18,
		clearcoatRoughness: .48
	});
	const rim = new MeshPhysicalMaterial({
		color: 13160662,
		metalness: .96,
		roughness: .12,
		clearcoat: .85,
		clearcoatRoughness: .08,
		envMapIntensity: 1.65
	});
	const disc = new MeshPhysicalMaterial({
		color: 6975092,
		metalness: .9,
		roughness: .22,
		envMapIntensity: .9
	});
	const emitBrake = new MeshPhysicalMaterial({
		color: 3802632,
		emissive: 16718354,
		emissiveIntensity: .5,
		roughness: .3
	});
	const emitHead = new MeshPhysicalMaterial({
		color: 16774880,
		emissive: 16773832,
		emissiveIntensity: 3.4,
		roughness: .12
	});
	const chrome = new MeshPhysicalMaterial({
		color: 14212836,
		metalness: 1,
		roughness: .08,
		envMapIntensity: 2
	});
	const black = new MeshStandardMaterial({
		color: 789518,
		roughness: .55,
		metalness: .25
	});
	const plate = new MeshStandardMaterial({
		color: 15920872,
		roughness: .45,
		metalness: .08
	});
	const put = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
		const m = new Mesh(geo, mat);
		m.position.set(x, y, z);
		m.rotation.set(rx, ry, rz);
		m.castShadow = shadows;
		m.receiveShadow = true;
		group.add(m);
		return m;
	};
	const half = L.L / 2;
	const bodyY = L.wheelY + L.bodyH * .22;
	const baked = cloneCarBody(kind, color, shadows);
	if (baked) {
		group.add(baked);
		bodyMat = baked.material;
		bindPaintFlakes(bodyMat);
	} else put(bodyGeo(kind, L.W * .9), bodyMat, 0, 0, 0);
	const cabinY = L.wheelY + L.bodyH * .55 + L.cabinH * .42;
	put(new BoxGeometry(L.W * .98, .16, .2), dark, 0, L.wheelY * .5, half - .01);
	const bumper = put(new BoxGeometry(L.W * .94, .18, .22), dark, 0, L.wheelY * .55, -half + .03);
	put(new BoxGeometry(L.W * .38, .12, .03), plate, 0, L.wheelY * .5, -half - .05);
	put(new BoxGeometry(L.W * .72, .14, .04), black, 0, bodyY + .04, half - .01);
	const hx = L.W * .3;
	const headY = bodyY + .05;
	const headZ = half + .02;
	const lampGeo = new SphereGeometry(.13, 12, 8, 0, Math.PI * 2, 0, Math.PI * .7);
	put(new BoxGeometry(.38, .14, .08), chrome, -hx, headY, headZ);
	put(new BoxGeometry(.38, .14, .08), chrome, hx, headY, headZ);
	const headL = put(lampGeo, emitHead, -hx, headY, headZ + .03, Math.PI / 2, 0, 0);
	const headR = put(lampGeo.clone(), emitHead, hx, headY, headZ + .03, Math.PI / 2, 0, 0);
	const glowMat = new MeshBasicMaterial({
		color: 16774352,
		transparent: true,
		opacity: .5,
		blending: 2,
		depthWrite: false
	});
	const gL = new Mesh(new SphereGeometry(.14, 10, 8), glowMat);
	gL.position.set(-hx, headY, headZ + .02);
	const gR = gL.clone();
	gR.position.x = hx;
	group.add(gL, gR);
	const tailY = bodyY + .02;
	const tailZ = -half - .03;
	const brakeL = put(new BoxGeometry(.46, .1, .05), emitBrake, -hx, tailY, tailZ);
	const brakeR = put(new BoxGeometry(.46, .1, .05), emitBrake, hx, tailY, tailZ);
	const brakeC = put(new BoxGeometry(.7, .035, .03), emitBrake, 0, cabinY + L.cabinH * .08, L.cabinZ - L.cabinL * .42);
	const cabinFill = new MeshStandardMaterial({
		color: 658448,
		roughness: .92,
		metalness: .04
	});
	put(new BoxGeometry(L.W * .62, L.cabinH * .48, L.cabinL * .52), cabinFill, 0, cabinY - .06, L.cabinZ);
	put(new BoxGeometry(L.W * .56, .07, .2), black, 0, cabinY - .1, L.cabinZ + L.cabinL * .26);
	put(new BoxGeometry(.26, .2, .3), black, -.17, cabinY - .2, L.cabinZ - .02);
	put(new BoxGeometry(.26, .2, .3), black, .17, cabinY - .2, L.cabinZ - .02);
	put(new TorusGeometry(.13, .016, 8, 18), black, -.17, cabinY - .04, L.cabinZ + L.cabinL * .2, .62, 0, 0);
	const glassW = L.W * .68;
	const pane = (w, h) => new BoxGeometry(w, h, .036);
	put(pane(glassW, L.cabinH * .72), glass, 0, cabinY + .02, L.cabinZ + L.cabinL * .42, -.62);
	put(pane(glassW * .96, L.cabinH * .58), glass, 0, cabinY, L.cabinZ - L.cabinL * .42, .52);
	put(pane(L.cabinL * .62, L.cabinH * .48), glass, -L.W * .445, cabinY, L.cabinZ, 0, Math.PI / 2);
	put(pane(L.cabinL * .62, L.cabinH * .48), glass, L.W * .445, cabinY, L.cabinZ, 0, -Math.PI / 2);
	put(new BoxGeometry(.18, .1, .14), black, -L.W * .48, cabinY + .01, L.cabinZ + L.cabinL * .18);
	put(new BoxGeometry(.18, .1, .14), black, L.W * .48, cabinY + .01, L.cabinZ + L.cabinL * .18);
	put(new BoxGeometry(.07, .07, .1), glass, -L.W * .54, cabinY + .01, L.cabinZ + L.cabinL * .18);
	put(new BoxGeometry(.07, .07, .1), glass, L.W * .54, cabinY + .01, L.cabinZ + L.cabinL * .18);
	put(new BoxGeometry(L.W * .88, .08, L.L * .72), black, 0, L.wheelY * .22, 0);
	put(new BoxGeometry(.36, .1, .02), chrome, 0, L.wheelY * .78, -half - .04);
	const ex = new CylinderGeometry(.042, .048, .16, 10);
	ex.rotateX(Math.PI / 2);
	put(ex, chrome, -.3, L.wheelY * .48, -half - .07);
	if (kind === "muscle" || kind === "super") put(ex.clone(), chrome, .3, L.wheelY * .48, -half - .07);
	if (kind === "super") {
		put(new BoxGeometry(L.W * .95, .05, .42), accentMat, 0, cabinY + .22, -half + .12);
		put(new BoxGeometry(L.W * .98, .04, .38), accentMat, 0, L.wheelY * .42, half - .02);
		put(new BoxGeometry(L.W * 1.02, .08, .55), accentMat, 0, cabinY + .28, -half + .28);
		for (const sx of [-1, 1]) put(new BoxGeometry(.18, .22, .55), black, sx * L.W * .48, bodyY + .06, L.cabinZ + .15);
	} else if (kind === "muscle") {
		put(new BoxGeometry(.9, .1, .7), bodyMat, 0, bodyY + L.bodyH * .55, half - L.hoodL * .5);
		put(new BoxGeometry(L.W * .7, .05, .28), accentMat, 0, cabinY + .18, -half + .2);
		put(new BoxGeometry(L.W * .92, .08, .12), chrome, 0, L.wheelY * .62, half - .01);
	} else if (kind === "rally") {
		put(new BoxGeometry(1.2, .05, 1.4), dark, 0, cabinY + L.cabinH * .55, L.cabinZ);
		put(new BoxGeometry(1.1, .08, .08), emitHead, 0, bodyY + .16, half + .04);
		put(new CylinderGeometry(.06, .06, .5, 8), dark, -L.W * .38, cabinY, L.cabinZ + .4);
		for (const sx of [
			-.28,
			0,
			.28
		]) {
			const lamp = put(new CylinderGeometry(.08, .08, .1, 10), emitHead, sx, cabinY + L.cabinH * .62, L.cabinZ + .35);
			lamp.rotation.x = Math.PI / 2;
		}
		for (const sx of [-1, 1]) put(new BoxGeometry(.16, .22, .9), dark, sx * (L.W * .52), L.wheelY + .08, L.wb * .22);
	} else if (kind === "hatch" && TAXI_COLORS.has(color)) put(new BoxGeometry(.4, .14, .2), new MeshStandardMaterial({
		color: 15920872,
		emissive: 15920872,
		emissiveIntensity: .4
	}), 0, cabinY + L.cabinH * .58, L.cabinZ + .1);
	else if (kind === "hatch") put(new BoxGeometry(L.W * .72, .05, .28), dark, 0, cabinY + L.cabinH * .48, L.cabinZ - L.cabinL * .48);
	else {
		put(new BoxGeometry(1.5, .04, .26), accentMat, 0, cabinY + .08, -half + .22);
		put(new BoxGeometry(L.W * .02, .06, L.L * .62), chrome, L.W * .46, bodyY + .12, 0);
		put(new BoxGeometry(L.W * .02, .06, L.L * .62), chrome, -L.W * .46, bodyY + .12, 0);
	}
	const well = new CylinderGeometry(L.wheelR + .04, L.wheelR + .04, .12, 18);
	well.rotateZ(Math.PI / 2);
	const lip = new TorusGeometry(L.wheelR + .07, .035, 6, 16, Math.PI);
	lip.rotateZ(Math.PI / 2);
	const wheels = [];
	const spins = [];
	const tire = new CylinderGeometry(L.wheelR, L.wheelR, .26, 32);
	tire.rotateZ(Math.PI / 2);
	const tread = new TorusGeometry(L.wheelR * .92, .055, 8, 24);
	const sidewall = new TorusGeometry(L.wheelR * .78, .04, 8, 22);
	const hubGeo = new CylinderGeometry(.11, .11, .28, 18);
	hubGeo.rotateZ(Math.PI / 2);
	const discGeo = new CylinderGeometry(L.wheelR * .7, L.wheelR * .7, .035, 22);
	discGeo.rotateZ(Math.PI / 2);
	const spokeN = kind === "super" ? 10 : kind === "rally" ? 5 : kind === "muscle" ? 5 : kind === "hatch" ? 6 : 7;
	const spokeGeo = new BoxGeometry(kind === "super" ? .022 : .028, L.wheelR * (kind === "super" ? .88 : .82), .035);
	const offsets = [
		[
			-L.track / 2,
			L.wheelY,
			L.wb / 2
		],
		[
			L.track / 2,
			L.wheelY,
			L.wb / 2
		],
		[
			-L.track / 2,
			L.wheelY,
			-L.wb / 2
		],
		[
			L.track / 2,
			L.wheelY,
			-L.wb / 2
		]
	];
	for (let wi = 0; wi < offsets.length; wi++) {
		const [x, y, z] = offsets[wi];
		put(well, dark, x + Math.sign(x) * .01, y, z);
		const arch = put(lip, bodyMat, x + Math.sign(x) * .04, y, z, 0, 0, Math.sign(x) > 0 ? 0 : Math.PI);
		arch.rotation.x = -Math.PI / 2;
		const pivot = new Group();
		const spin = new Group();
		const rearFat = kind === "muscle" && wi >= 2 ? 1.28 : kind === "super" && wi >= 2 ? 1.18 : 1;
		const tireM = new Mesh(tire, rubber);
		tireM.scale.x = rearFat;
		spin.add(tireM);
		spin.add(new Mesh(tread, rubber));
		spin.add(new Mesh(sidewall, rubber));
		spin.add(new Mesh(hubGeo, rim));
		spin.add(new Mesh(discGeo, disc));
		for (let k = 0; k < spokeN; k++) {
			const sp = new Mesh(spokeGeo, rim);
			sp.rotation.z = k / spokeN * Math.PI;
			spin.add(sp);
		}
		pivot.add(spin);
		pivot.position.set(x, y, z);
		pivot.userData.y0 = y;
		pivot.traverse((o) => {
			if (o.isMesh) o.castShadow = shadows;
		});
		group.add(pivot);
		wheels.push(pivot);
		spins.push(spin);
	}
	const spots = [];
	let headPool;
	if (lit) {
		const cookie = beamCookie();
		for (const sx of [-hx, hx]) {
			const spot = new SpotLight(16773576, 0, 48, .5, .68, 1.05);
			spot.position.set(sx, headY, headZ);
			spot.target.position.set(sx * .12, -.42, 14);
			if (cookie) spot.map = cookie;
			spot.castShadow = !!(shadows && cookie);
			if (spot.castShadow) {
				spot.shadow.mapSize.set(256, 256);
				spot.shadow.bias = -25e-5;
				spot.shadow.camera.near = .6;
				spot.shadow.camera.far = 42;
				spot.shadow.focus = 1;
			}
			spot.intensity = 0;
			group.add(spot, spot.target);
			spots.push(spot);
		}
		const poolMat = new MeshBasicMaterial({
			map: cookie || null,
			color: cookie ? 16777215 : 16770224,
			transparent: true,
			opacity: 0,
			depthWrite: false,
			blending: 2
		});
		headPool = new Mesh(new CircleGeometry(5.4, 22), poolMat);
		headPool.rotation.x = -Math.PI / 2;
		headPool.position.set(0, .06, 8.6);
		headPool.scale.set(.72, 1, 1.8);
		headPool.renderOrder = 2;
		group.add(headPool);
	}
	const leather = new MeshStandardMaterial({
		color: 1709588,
		roughness: .78,
		metalness: .04
	});
	put(new BoxGeometry(L.W * .7, .06, L.cabinL * .62), leather, 0, L.wheelY + .36, L.cabinZ);
	put(new BoxGeometry(.4, .22, .4), leather, .24, L.wheelY + .5, L.cabinZ - .04);
	put(new BoxGeometry(.4, .42, .09), leather, .24, L.wheelY + .7, L.cabinZ - .22);
	put(new BoxGeometry(.4, .22, .4), leather, -.24, L.wheelY + .5, L.cabinZ - .04);
	const dash = put(new BoxGeometry(L.W * .76, .2, .4), dark, 0, cabinY - .16, L.cabinZ + L.cabinL * .3);
	dash.castShadow = false;
	put(new BoxGeometry(.42, .07, .14), new MeshStandardMaterial({
		color: 790548,
		emissive: 1718858,
		emissiveIntensity: .55,
		roughness: .35
	}), 0, cabinY - .02, L.cabinZ + L.cabinL * .36);
	put(new BoxGeometry(.05, L.cabinH * .62, .05), dark, L.W * .34, cabinY, L.cabinZ + L.cabinL * .32);
	put(new BoxGeometry(.05, L.cabinH * .62, .05), dark, -L.W * .34, cabinY, L.cabinZ + L.cabinL * .32);
	const col = new Mesh(new CylinderGeometry(.032, .04, .26, 8), dark);
	col.rotation.x = 1.05;
	col.position.set(.26, cabinY - .1, L.cabinZ + L.cabinL * .2);
	group.add(col);
	const steerWheel = new Group();
	const rimW = new Mesh(new TorusGeometry(.17, .026, 8, 18), dark);
	rimW.rotation.x = Math.PI / 2;
	steerWheel.add(rimW);
	steerWheel.add(new Mesh(new BoxGeometry(.26, .018, .035), dark));
	steerWheel.add(new Mesh(new BoxGeometry(.035, .018, .2), dark));
	steerWheel.position.set(.26, cabinY - .02, L.cabinZ + L.cabinL * .14);
	steerWheel.rotation.x = .55;
	group.add(steerWheel);
	let policeMats;
	if (police) {
		const redMat = new MeshPhysicalMaterial({
			color: 9048088,
			emissive: 16720960,
			emissiveIntensity: 3.2,
			roughness: .3
		});
		const blueMat = new MeshPhysicalMaterial({
			color: 1058888,
			emissive: 3837183,
			emissiveIntensity: 3.2,
			roughness: .3
		});
		put(new BoxGeometry(1.15, .1, .26), dark, 0, cabinY + L.cabinH * .62, L.cabinZ);
		put(new BoxGeometry(.48, .12, .28), redMat, -.3, cabinY + L.cabinH * .7, L.cabinZ);
		put(new BoxGeometry(.48, .12, .28), blueMat, .3, cabinY + L.cabinH * .7, L.cabinZ);
		put(new BoxGeometry(L.W * .98, .1, L.L * .55), accentMat, 0, bodyY + .08, 0);
		policeMats = {
			red: redMat,
			blue: blueMat
		};
	}
	const dents = [];
	const dentGeo = new SphereGeometry(.08, 8, 6);
	for (const [x, y, z] of [
		[
			L.W * .32,
			bodyY,
			L.L * .22
		],
		[
			-L.W * .34,
			bodyY + .04,
			.1
		],
		[
			L.W * .28,
			bodyY,
			-L.L * .25
		]
	]) {
		const d = new Mesh(dentGeo, dark);
		d.position.set(x, y, z);
		d.scale.set(1.4, .45, 1.1);
		d.visible = false;
		group.add(d);
		dents.push(d);
	}
	const scratch = new Mesh(new PlaneGeometry(1.3, .5), new MeshBasicMaterial({
		color: 2761756,
		transparent: true,
		opacity: 0,
		depthWrite: false
	}));
	scratch.rotation.y = Math.PI / 2;
	scratch.position.set(L.W * .48, bodyY, .15);
	group.add(scratch);
	const blob = new Mesh(new CircleGeometry(L.W * .72, 16), new MeshBasicMaterial({
		color: 658448,
		transparent: true,
		opacity: 0,
		depthWrite: false
	}));
	blob.rotation.x = -Math.PI / 2;
	blob.position.y = .04;
	blob.visible = false;
	blob.renderOrder = -1;
	group.add(blob);
	return {
		group,
		wheels,
		spins,
		brakeLights: [
			brakeL,
			brakeR,
			brakeC
		],
		headLights: [headL, headR],
		headGlows: [gL, gR],
		bodyMat,
		spots,
		headPool,
		steerWheel,
		baseColor: new Color(color),
		bumper,
		dents,
		scratch,
		police: policeMats
	};
}
function applyDamage(vis, dmg, dirt = 0) {
	const t = Math.min(1, Math.max(0, dmg));
	const d = Math.min(1, Math.max(0, dirt));
	vis.bodyMat.color.copy(vis.baseColor).lerp(new Color(3814444), t * .72).lerp(new Color(4866102), d * .55);
	vis.bodyMat.roughness = .16 + t * .52 + d * .38;
	vis.bodyMat.clearcoat = Math.max(.08, 1 - t * .75 - d * .55);
	vis.bodyMat.clearcoatRoughness = .08 + t * .4 + d * .28;
	if (vis.bumper) vis.bumper.rotation.x = t * .14;
	vis.dents.forEach((dent, i) => {
		dent.visible = t > .16 + i * .18;
	});
	if (vis.scratch) vis.scratch.material.opacity = t * .62;
}
function setCarLights(vis, night) {
	const on = night;
	for (const s of vis.spots) {
		s.intensity = on ? 28 : 0;
		s.visible = on;
		if (!s.map) {
			const c = beamCookie();
			if (c) s.map = c;
		}
	}
	vis.bodyMat.envMapIntensity = night ? 1.15 : 1.4;
	for (const h of vis.headLights) h.material.emissiveIntensity = night ? 5.2 : .85;
	for (const g of vis.headGlows) {
		g.material.opacity = night ? .78 : .16;
		g.visible = true;
	}
	if (vis.headPool) {
		const m = vis.headPool.material;
		if (!m.map) {
			const c = beamCookie();
			if (c) {
				m.map = c;
				m.color.setHex(16777215);
			}
		}
		m.opacity = night ? .88 : 0;
		vis.headPool.visible = night;
	}
}
function pulsePolice(vis, t) {
	if (!vis.police) return;
	const a = (Math.sin(t * 14) + 1) * .5;
	vis.police.red.emissiveIntensity = .5 + a * 7.5;
	vis.police.blue.emissiveIntensity = .5 + (1 - a) * 7.5;
}
function updateCarVisual(vis, yaw, speed, steer, brake, dt, x, y, z, bank, pitch = 0, surface = "asphalt") {
	vis.group.userData.t = (vis.group.userData.t || 0) + dt * Math.abs(speed);
	const hop = surface === "curb" ? Math.sin(vis.group.userData.t * 3.4) * .032 : surface === "sand" ? Math.sin(vis.group.userData.t * 1.8) * .022 : 0;
	vis.group.position.set(x, y + .02 + hop, z);
	vis.group.rotation.order = "YXZ";
	vis.group.rotation.set(pitch * .55, yaw + Math.PI, bank);
	const spin = speed / .33 * dt;
	for (const s of vis.spins) s.rotateX(spin);
	if (vis.wheels[0]) vis.wheels[0].rotation.y = steer * .38;
	if (vis.wheels[1]) vis.wheels[1].rotation.y = steer * .38;
	const travel = .14;
	const ys = vis.wheels.map((w) => w.userData.y0 ?? w.position.y);
	if (vis.wheels[0]) vis.wheels[0].position.y = ys[0] + (-pitch + bank) * travel;
	if (vis.wheels[1]) vis.wheels[1].position.y = ys[1] + (-pitch - bank) * travel;
	if (vis.wheels[2]) vis.wheels[2].position.y = ys[2] + (pitch + bank) * travel;
	if (vis.wheels[3]) vis.wheels[3].position.y = ys[3] + (pitch - bank) * travel;
	if (vis.steerWheel) vis.steerWheel.rotation.z = -steer * .9;
	const reversing = speed < -.8;
	const braking = brake > .15 && !reversing;
	for (const m of vis.brakeLights) {
		const mat = m.material;
		mat.emissive.setHex(reversing ? 16054008 : 16718354);
		mat.color.setHex(reversing ? 16054008 : 3802632);
		mat.emissiveIntensity = reversing || braking ? 4.6 : .45;
	}
}
/** RSH-019: releases one complete per-engine car visual without touching shared textures. */
function disposeCarVisual(visual, tracker) {
	return disposeObject3D(visual.group, tracker);
}
function rivalName(i, he) {
	const r = RIVALS[(i % RIVALS.length + RIVALS.length) % RIVALS.length];
	return he ? r.he : r.en;
}
function introLine(ev, he) {
	if (ev?.lineHe) return he ? ev.lineHe : ev.lineEn ?? ev.lineHe;
	const i = (ev?.chapter ?? 1) % RIVALS.length;
	const name = rivalName(i, he);
	const linesHe = [
		`${name}: בוא נראה אם אתה שייך לרחוב.`,
		`${name}: אל תישן בזינוק.`,
		`${name}: אני לוקח את הקו הפנימי.`,
		`${name}: נסיעה נקייה. בלי דרמות.`
	];
	const linesEn = [
		`${name}: Let's see if you belong on this street.`,
		`${name}: Don't sleep on the lights.`,
		`${name}: I'm taking the inside line.`,
		`${name}: Clean run. No drama.`
	];
	return he ? linesHe[i] : linesEn[i];
}
function overtakeLine(ahead, he, rivalIdx) {
	const name = rivalName(rivalIdx, he);
	if (ahead) return he ? `${name}: תעבור אותי? חח.` : `${name}: Passing me? Cute.`;
	return he ? `${name}: חזרתי. תתרגל.` : `${name}: I'm back. Get used to it.`;
}
function finishLine(place, busted, he, rivalIdx) {
	const name = rivalName(rivalIdx, he);
	if (busted) return he ? `${name}: המשטרה עשתה לך את העבודה.` : `${name}: The cops did my job.`;
	if (place === 1) return he ? `${name}: סבבה. סיבוב הבא שלי.` : `${name}: Fine. Next one's mine.`;
	if (place === 2) return he ? `${name}: קרוב. לא מספיק.` : `${name}: Close. Not enough.`;
	return he ? `${name}: לך הביתה, תתקן את הרכב.` : `${name}: Go home. Fix the car.`;
}
/** 21.18 / Codex 65: analog stick, no FFB. */
function padCurve(x, dead = .12, exp = 1.6) {
	if (Math.abs(x) <= dead) return 0;
	return (x < 0 ? -1 : 1) * Math.pow(Math.abs(x), exp);
}
var GameInput = class {
	keys = /* @__PURE__ */ new Set();
	touchSteer = 0;
	touchThrottle = 0;
	touchBrake = 0;
	touchDrift = false;
	touchNitro = false;
	touchRewind = false;
	steerOverride = null;
	throttleOverride = null;
	brakeOverride = null;
	paused = false;
	steerFilt = 0;
	thrFilt = 0;
	lastPoll = 0;
	canvas;
	unbind = [];
	constructor(target) {
		this.canvas = target;
		const down = (e) => {
			this.keys.add(e.code);
			if ([
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				"Space"
			].includes(e.code)) e.preventDefault();
		};
		const up = (e) => {
			this.keys.delete(e.code);
		};
		const blur = () => this.keys.clear();
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", blur);
		document.addEventListener("visibilitychange", blur);
		this.unbind.push(() => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", blur);
			document.removeEventListener("visibilitychange", blur);
		});
	}
	setTouch(partial) {
		if (partial.steer !== void 0) this.touchSteer = clamp(partial.steer, -1, 1);
		if (partial.throttle !== void 0) this.touchThrottle = clamp(partial.throttle, 0, 1);
		if (partial.brake !== void 0) this.touchBrake = clamp(partial.brake, 0, 1);
		if (partial.drift !== void 0) this.touchDrift = partial.drift;
		if (partial.nitro !== void 0) this.touchNitro = partial.nitro;
		if (partial.rewind !== void 0) this.touchRewind = partial.rewind;
	}
	poll() {
		let steer = 0;
		if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) steer += 1;
		if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) steer -= 1;
		steer += this.touchSteer;
		let throttle = this.touchThrottle;
		let brake = this.touchBrake;
		if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) throttle = 1;
		if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) brake = 1;
		const gp = (typeof navigator !== "undefined" ? navigator.getGamepads?.() : null)?.[0];
		if (gp) {
			steer -= padCurve(gp.axes[0] ?? 0);
			const ay = gp.axes[1] ?? 0;
			if (ay < -.12) throttle = Math.max(throttle, padCurve(-ay));
			const rt = gp.buttons[7]?.value ?? 0;
			const lt = gp.buttons[6]?.value ?? 0;
			if (rt > .05) throttle = Math.max(throttle, rt);
			if (lt > .05) brake = Math.max(brake, lt);
		}
		if (this.steerOverride !== null) steer = this.steerOverride;
		if (this.throttleOverride !== null) throttle = this.throttleOverride;
		if (this.brakeOverride !== null) brake = this.brakeOverride;
		const now = typeof performance !== "undefined" ? performance.now() : 0;
		const dt = this.lastPoll ? Math.min(.05, (now - this.lastPoll) / 1e3) : .016;
		this.lastPoll = now;
		if (this.steerOverride !== null) this.steerFilt = steer;
		else {
			const k = Math.abs(steer) < .05 ? 11 : 6.5;
			this.steerFilt += (steer - this.steerFilt) * Math.min(1, k * dt);
			if (Math.abs(this.steerFilt) < .01) this.steerFilt = 0;
			steer = this.steerFilt;
		}
		if (this.throttleOverride !== null) this.thrFilt = throttle;
		else {
			const k = throttle > this.thrFilt ? 5.5 : 8;
			this.thrFilt += (throttle - this.thrFilt) * Math.min(1, k * dt);
			throttle = this.thrFilt;
		}
		const drift = this.touchDrift || this.keys.has("Space") || this.keys.has("ShiftLeft") || this.keys.has("ShiftRight") || !!gp?.buttons[4]?.pressed || !!gp?.buttons[5]?.pressed;
		const nitro = this.touchNitro || this.keys.has("KeyE") || this.keys.has("KeyQ") || !!gp?.buttons[0]?.pressed || !!gp?.buttons[1]?.pressed;
		return {
			steer: clamp(steer, -1, 1),
			throttle: clamp(throttle, 0, 1),
			brake: clamp(brake, 0, 1),
			drift,
			nitro
		};
	}
	wantsPause() {
		return this.keys.has("Escape") || this.keys.has("KeyP");
	}
	wantsRewind() {
		const gp = typeof navigator !== "undefined" ? navigator.getGamepads?.()?.[0] : null;
		return this.touchRewind || this.keys.has("KeyR") || !!gp?.buttons[2]?.pressed;
	}
	dispose() {
		for (const u of this.unbind) u();
		this.unbind = [];
		this.keys.clear();
	}
};
var GRADE = {
	uniforms: {
		tDiffuse: { value: null },
		uSpeed: { value: 0 },
		uBoost: { value: 0 },
		uNight: { value: 0 },
		uFilter: { value: 0 }
	},
	vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uSpeed;
    uniform float uBoost;
    uniform float uNight;
    uniform float uFilter;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r = length(c);
      vec3 col = texture2D(tDiffuse, uv).rgb;

      float lum = dot(col, vec3(0.22, 0.70, 0.08));
      vec3 shadowTint = mix(vec3(1.0, 0.99, 0.98), vec3(1.04, 0.96, 0.82), uNight);
      vec3 highTint = mix(vec3(1.0), vec3(0.98, 0.97, 1.02), uNight);
      col *= mix(shadowTint, highTint, smoothstep(0.14, 0.78, lum));
      col *= mix(1.0, 1.06, uNight * (1.0 - lum) * 0.35);

      float k = smoothstep(0.18, 0.92, uSpeed);
      vec2 smear = c * r * k * mix(0.018, 0.038, uBoost);
      if (k > 0.02) {
        vec3 a = texture2D(tDiffuse, uv + smear).rgb;
        vec3 b = texture2D(tDiffuse, uv + smear * 1.7).rgb;
        col = mix(col, (col + a + b) / 3.0, k * 0.55);
        float cr = texture2D(tDiffuse, uv + smear * 0.55).r;
        float cb = texture2D(tDiffuse, uv - smear * 0.55).b;
        col = mix(col, vec3(cr, col.g, cb), k * 0.2);
      }

      float vig = smoothstep(1.22, 0.28, r);
      col *= mix(1.0, vig, mix(0.05, 0.2, k) + uNight * 0.08);

      float f = uFilter;
      if (f > 0.5) {
        float chroma = (uSpeed * 0.003 + uBoost * 0.0025) * r;
        vec2 dir = c * chroma;
        float cr = texture2D(tDiffuse, uv + dir).r;
        float cg = col.g;
        float cb = texture2D(tDiffuse, uv - dir).b;
        col = vec3(cr, cg, cb);
        float grain = fract(sin(dot(uv * 840.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
        if (f > 6.5) {
          col *= vec3(1.14, 1.05, 0.88);
          col = mix(col, vec3(0.96, 0.9, 0.76), 0.14);
          col += grain * 0.045;
        } else if (f > 5.5) {
          col = mix(col, vec3(lum), 0.38);
          col = (col - 0.5) * 1.38 + 0.52;
        } else if (f > 4.5) {
          col.r = mix(col.r, mix(0.12, 1.0, lum), 0.22);
          col *= vec3(1.08, 0.98, 0.86);
        } else if (f > 3.5) {
          col = mix(col, vec3(lum * 1.04), 0.2);
          col *= vec3(1.06, 1.02, 0.94);
          if (uv.y < 0.09 || uv.y > 0.91) col = vec3(0.015);
        } else if (f > 2.5) {
          col = vec3(lum * 1.05);
        } else if (f > 1.5) {
          col *= vec3(1.08, 0.86, 1.22);
        } else {
          col *= vec3(1.14, 1.02, 0.86);
        }
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `
};
function createPost(renderer, scene, camera, night, lite = false) {
	const size = new Vector2();
	renderer.getDrawingBufferSize(size);
	const rt = new WebGLRenderTarget(size.x, size.y, {
		type: lite ? UnsignedByteType : HalfFloatType,
		depthBuffer: true
	});
	const composer = new EffectComposer(renderer, rt);
	composer.addPass(new RenderPass(scene, camera));
	const bloom = new UnrealBloomPass(size, night && !lite ? .11 : 0, night ? .2 : .06, night ? .84 : .96);
	bloom.enabled = night && !lite;
	composer.addPass(bloom);
	const smaa = lite ? void 0 : new SMAAPass();
	if (smaa) composer.addPass(smaa);
	const grade = new ShaderPass(GRADE);
	grade.uniforms.uNight.value = night ? 1 : 0;
	composer.addPass(grade);
	composer.addPass(new OutputPass());
	let useComposer = !lite;
	let tier = lite ? "low" : "high";
	let disposed = false;
	return {
		composer,
		bloom,
		grade,
		smaa,
		setSize(w, h) {
			composer.setSize(w, h);
			bloom.setSize(w, h);
			smaa?.setSize(w, h);
		},
		setDrive(speed01, boost) {
			grade.uniforms.uSpeed.value = speed01;
			grade.uniforms.uBoost.value = boost ? 1 : 0;
		},
		setNight(next) {
			night = next;
			grade.uniforms.uNight.value = next ? 1 : 0;
			bloom.enabled = next && tier === "high";
			bloom.strength = next && tier === "high" ? .11 : 0;
			bloom.radius = next ? .2 : .06;
			bloom.threshold = next ? .84 : .96;
		},
		setFilter(f) {
			grade.uniforms.uFilter.value = f;
		},
		setBudget(nextLite) {
			this.setTier(nextLite ? "low" : "high");
		},
		setTier(q) {
			tier = q;
			lite = q === "low";
			useComposer = q !== "low";
			if (smaa) smaa.enabled = q !== "low";
			bloom.enabled = night && q === "high";
			bloom.strength = night && q === "high" ? .11 : 0;
		},
		setBloom(on) {
			bloom.enabled = on && night && tier === "high";
			bloom.strength = bloom.enabled ? .11 : 0;
		},
		render() {
			if (useComposer) composer.render();
			else renderer.render(scene, camera);
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			composer.dispose();
			rt.dispose();
		}
	};
}
/** Tiny PMREM from a 3-object scene. Not an HDRI. Not IBL from a real sky. */
function bakeEnv(renderer, night = false) {
	const tmp = new Scene();
	tmp.background = new Color(night ? 1582134 : 3840736);
	tmp.add(new HemisphereLight(night ? 4874368 : 13166847, night ? 1709072 : 12097640, night ? .55 : 1.2));
	const sun = new DirectionalLight(night ? 11059424 : 16771268, night ? .32 : 1.2);
	sun.position.set(6, 14, 4);
	tmp.add(sun);
	if (!night) {
		const disc = new Mesh(new SphereGeometry(2.4, 16, 16), new MeshBasicMaterial({ color: 16774872 }));
		disc.position.set(10, 16, 7);
		tmp.add(disc);
		const ground = new Mesh(new CircleGeometry(22, 24), new MeshLambertMaterial({ color: 3818056 }));
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -2.2;
		tmp.add(ground);
	}
	const pmrem = new PMREMGenerator(renderer);
	try {
		return pmrem.fromScene(tmp, .04);
	} finally {
		pmrem.dispose();
		disposeObject3D(tmp);
	}
}
function sampleSpline(points, stepsPerSeg = 28, open = false) {
	const n = points.length;
	const segs = open ? Math.max(1, n - 1) : n;
	const out = [];
	for (let i = 0; i < segs; i++) {
		const p0 = points[open ? Math.max(0, i - 1) : (i - 1 + n) % n];
		const p1 = points[i];
		const p2 = points[open ? Math.min(n - 1, i + 1) : (i + 1) % n];
		const p3 = points[open ? Math.min(n - 1, i + 2) : (i + 2) % n];
		for (let s = 0; s < stepsPerSeg; s++) {
			const u = s / stepsPerSeg;
			const t = (i + u) / segs;
			out.push({
				x: catmullRom(p0.x, p1.x, p2.x, p3.x, u),
				z: catmullRom(p0.z, p1.z, p2.z, p3.z, u),
				t
			});
		}
	}
	if (open) {
		const last = points[n - 1];
		out.push({
			x: last.x,
			z: last.z,
			t: 1
		});
	}
	return out;
}
function buildTrack(def) {
	const closed = !def.open;
	const raw = sampleSpline(def.points, 30, !!def.open);
	const samples = [];
	let length = 0;
	const tmp = [];
	for (let i = 0; i < raw.length; i++) {
		const a = raw[i];
		const b = raw[closed ? (i + 1) % raw.length : Math.min(i + 1, raw.length - 1)];
		const dx = b.x - a.x;
		const dz = b.z - a.z;
		const ds = Math.hypot(dx, dz) || .01;
		tmp.push({
			x: a.x,
			z: a.z,
			y: def.elevation(a.t),
			t: a.t,
			ds
		});
		length += ds;
	}
	let s = 0;
	for (let i = 0; i < tmp.length; i++) {
		const prev = tmp[closed ? (i - 1 + tmp.length) % tmp.length : Math.max(0, i - 1)];
		const next = tmp[closed ? (i + 1) % tmp.length : Math.min(tmp.length - 1, i + 1)];
		const dx = next.x - prev.x;
		const dz = next.z - prev.z;
		const hyp = Math.hypot(dx, dz) || 1;
		let tx = dx / hyp;
		let tz = dz / hyp;
		let rx = tz;
		let rz = -tx;
		if (i > 0) {
			const p = samples[i - 1];
			if (rx * p.rx + rz * p.rz < 0) {
				rx = -rx;
				rz = -rz;
			}
		}
		const a = tmp[i];
		samples.push({
			x: a.x,
			y: a.y,
			z: a.z,
			tx,
			tz,
			rx,
			rz,
			t: a.t,
			s
		});
		s += a.ds;
	}
	if (closed && samples.length > 1) {
		const first = samples[0];
		const last = samples[samples.length - 1];
		if (first.rx * last.rx + first.rz * last.rz < 0) {
			last.rx = -last.rx;
			last.rz = -last.rz;
		}
	}
	const checkpoints = [];
	for (let i = 0; i < def.checkpointCount; i++) checkpoints.push(closed ? i / def.checkpointCount : (i + 1) / (def.checkpointCount + .15));
	return {
		samples,
		length,
		width: Math.max(18.5, def.width),
		checkpoints,
		closed
	};
}
function nearestIndex(samples, x, z, hint, closed = true) {
	const n = samples.length;
	const origin = Math.max(0, Math.min(n - 1, (hint % n + n) % n));
	let bestI = origin;
	let bestCost = Infinity;
	const window = 88;
	for (let k = -88; k <= window; k++) {
		const i = closed ? ((origin + k) % n + n) % n : Math.max(0, Math.min(n - 1, origin + k));
		const s = samples[i];
		const cost = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z) + k * k * .55;
		if (cost < bestCost) {
			bestCost = cost;
			bestI = i;
		}
	}
	if ((samples[bestI].x - x) * (samples[bestI].x - x) + (samples[bestI].z - z) * (samples[bestI].z - z) > 19600) for (let i = 0; i < n; i += 2) {
		const s = samples[i];
		const d = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z);
		const jump = Math.min(Math.abs(i - origin), n - Math.abs(i - origin));
		const cost = d + jump * jump * .25;
		if (cost < bestCost) {
			bestCost = cost;
			bestI = i;
		}
	}
	const s = samples[bestI];
	return {
		index: bestI,
		dist: Math.hypot(s.x - x, s.z - z)
	};
}
function sampleAtT(samples, t) {
	const n = samples.length;
	const u = (t % 1 + 1) % 1;
	return samples[Math.min(n - 1, Math.floor(u * n))];
}
var IL_NAMES = [
	["דיזנגוף", "Dizengoff"],
	["אלנבי", "Allenby"],
	["שינקין", "Sheinkin"],
	["בן יהודה", "Ben Yehuda"],
	["רוטשילד", "Rothschild"],
	["בוגרשוב", "Bugrashov"],
	["פרישמן", "Frischmann"],
	["גורדון", "Gordon"],
	["נחלת בנימין", "Nahalat Binyamin"],
	["הרצל", "Herzl"],
	["המלך ג'ורג'", "King George"],
	["יפו", "Jaffa St"],
	["אגרון", "Agron"],
	["עמק רפאים", "Emek Refaim"]
];
var NYC_NAMES = [
	["ברודוויי", "Broadway"],
	["השדרה השביעית", "7th Avenue"],
	["השדרה החמישית", "Fifth Avenue"],
	["רחוב 42", "42nd Street"],
	["רחוב 34", "34th Street"],
	["מדיסון", "Madison Ave"],
	["לקסינגטון", "Lexington Ave"],
	["אמסטרדם", "Amsterdam Ave"],
	["קולומבוס", "Columbus Ave"],
	["מרסר", "Mercer St"],
	["ספרינג", "Spring St"],
	["פרונט", "Front Street"],
	["קדמן פלאזה", "Cadman Plaza"]
];
function inWater(bodies, x, z) {
	for (const w of bodies) if (Math.abs(x - w.x) < w.w * .42 && Math.abs(z - w.z) < w.d * .42) return true;
	return false;
}
function inClear(def, x, z) {
	for (const z0 of def.clearZones ?? []) if (Math.abs(x - z0.x) < z0.w * .5 && Math.abs(z - z0.z) < z0.d * .5) return true;
	return false;
}
function generateStreets(def, built, bodies) {
	if (def.id === "ayalon") return [];
	const names = def.city === "nyc" ? NYC_NAMES : IL_NAMES;
	const out = [];
	const park = def.theme === "park";
	const roam = def.id === "gushdan";
	const step = roam ? 30 : park ? 78 : def.theme === "highway" ? 62 : 46;
	const reach = roam ? 54 : park ? 24 : 38;
	const half = roam ? 6.2 : park ? 4.4 : 5.7;
	let next = 10;
	let n = 0;
	for (const s of built.samples) {
		if (s.s < next) continue;
		next = s.s + step;
		if (s.y > 6.5) continue;
		const label = names[n % names.length];
		for (const side of [-1, 1]) {
			const start = built.width / 2 + 2.6;
			const ax = s.x + s.rx * start * side;
			const az = s.z + s.rz * start * side;
			const bx = s.x + s.rx * (start + reach) * side;
			const bz = s.z + s.rz * (start + reach) * side;
			const mx = (ax + bx) * .5;
			const mz = (az + bz) * .5;
			if (inWater(bodies, mx, mz) || inClear(def, mx, mz)) continue;
			if (inWater(bodies, bx, bz)) continue;
			out.push({
				ax,
				az,
				bx,
				bz,
				half,
				he: label[0],
				en: label[1]
			});
			n += 1;
		}
		if (out.length >= 28) break;
	}
	return out;
}
function distToStreet(x, z, r) {
	const dx = r.bx - r.ax;
	const dz = r.bz - r.az;
	const l2 = dx * dx + dz * dz || 1;
	const t = clamp(((x - r.ax) * dx + (z - r.az) * dz) / l2, 0, 1);
	const qx = r.ax + t * dx;
	const qz = r.az + t * dz;
	return {
		dist: Math.hypot(x - qx, z - qz),
		qx,
		qz,
		t
	};
}
function nearestStreet(x, z, streets) {
	let best = null;
	let bestD = Infinity;
	let hit = {
		dist: Infinity,
		qx: x,
		qz: z,
		t: 0
	};
	for (const r of streets) {
		const d = distToStreet(x, z, r);
		if (d.dist < bestD) {
			bestD = d.dist;
			best = r;
			hit = d;
		}
	}
	return best ? {
		street: best,
		...hit
	} : null;
}
function probeRamp(x, z, ramps, yHint = 0) {
	let best = null;
	for (const r of ramps) {
		const dx = x - r.x;
		const dz = z - r.z;
		const along = dx * r.sx + dz * r.sz;
		const across = dx * r.sz - dz * r.sx;
		if (Math.abs(along) <= r.len * .5 && Math.abs(across) <= r.half) {
			const t = clamp(along / r.len + .5, 0, 1);
			const y = r.y0 + (r.y1 - r.y0) * t;
			const dyds = (r.y1 - r.y0) / r.len;
			const score = Math.abs(y - yHint);
			if (!best || score + .04 < best.score || score <= best.score + .04 && y > best.y && y <= yHint + 1.2) best = {
				r,
				y,
				dyds,
				score
			};
		}
	}
	return best;
}
var ArcadeCar = class {
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
	nitro = .35;
	nitroPulse = false;
	pitch = 0;
	impact = 0;
	lastHit = "";
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
	surfaceKind = "asphalt";
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
	handling = "simcade";
	assists = { ...DEFAULT_ASSISTS };
	weather = "clear";
	absActive = false;
	tcsActive = false;
	escActive = false;
	slipRatio = 0;
	stats;
	name;
	nitroHeld = false;
	constructor(stats, name) {
		this.stats = stats;
		this.name = name;
	}
	spawn(track, t, lateral) {
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
		this.nitro = this.isTraffic ? 0 : this.stats.nitroStart ?? .35;
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
		this.rideCompress = 0;
		this.wasCurb = false;
	}
	step(dt, input, track, racing, colliders = [], streets = [], ramps = []) {
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
		const hurt = 1 - this.damage * .28;
		const maxSpeed = stats.maxSpeed * (boosting ? 1.18 : 1) * (this.isAi && !this.isCop ? this.aiSkill : 1) * hurt;
		const ev = stats.body === "ev";
		const n = Math.abs(this.speed) / Math.max(8, maxSpeed);
		if (!ev) {
			const tops = [
				.2,
				.38,
				.56,
				.76,
				1.08
			];
			let g = this.gear;
			if (n > tops[g - 1] + .02) g = Math.min(5, g + 1);
			if (g > 1 && n < tops[g - 2] - .04) g = g - 1;
			if (g !== this.gear && racing) this.speed *= .94;
			this.gear = g;
			const lo = g === 1 ? 0 : tops[g - 2];
			const hi = tops[g - 1];
			this.rpm = clamp((n - lo) / Math.max(.06, hi - lo), 0, 1);
		} else {
			this.gear = 1;
			this.rpm = clamp(n, 0, 1);
		}
		const mass = Math.max(.7, stats.mass || 1);
		ev ? 1.06 - n * .2 : [
			1.22,
			1.08,
			.98,
			.88,
			.8
		][this.gear - 1];
		const downforce = 1 + clamp(n, 0, 1) * (stats.body === "super" ? .24 : stats.body === "rally" ? .07 : .1);
		this.wheelsLocked = false;
		this.absActive = false;
		this.tcsActive = false;
		this.escActive = false;
		const v = this.speed;
		const vAbs = Math.abs(v);
		const aero = stats.drag * .00155 * vAbs * vAbs;
		const surf = SURFACE_SPEC[this.surfaceKind] ?? SURFACE_SPEC.asphalt;
		const rolling = vAbs > .2 ? (1.15 + (this.onTrack ? 0 : stats.body === "rally" ? 1.15 : 3.4)) * surf.roll * wx.roll : 0;
		const driveCurve = Math.max(.02, 1 - clamp(vAbs / Math.max(8, maxSpeed), 0, 1) ** 2.1);
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
			if (throttle > 0 && brakeIn <= .1) {
				const v100 = 27.778;
				const t100 = Math.max(3.2, stats.zeroTo100 ?? 8);
				const pull = throttle * (v100 / t100) * mass * wx.long * surf.long * (boosting ? 1.08 : 1) * (this.drafting ? 1.05 : 1);
				const top = vAbs <= v100 ? 1 : Math.max(.02, driveCurve);
				this.speed += pull / mass * top * dt;
			}
			if (brakeIn > 0) {
				const speedAbs0 = Math.abs(this.speed);
				this.wheelsLocked = !this.assists.abs && brakeIn > .92 && speedAbs0 > 18;
				const force = brakeForce(brakeIn, stats.brake, this.pitch) * wx.long * surf.long;
				if (this.speed > .5) {
					this.speed -= force * dt;
					this.reverseHold = 0;
				} else {
					this.reverseHold += dt;
					if (this.reverseHold >= .25) this.speed -= brakeIn * stats.accel * .28 * dt;
					else this.speed = Math.max(0, this.speed - force * dt);
				}
			} else this.reverseHold = 0;
			const lose = (aero / mass + rolling) * dt + (throttle <= .05 && brakeIn <= 0 && vAbs > 3 ? (ev ? .9 : 2.2 + this.gear * .4) * dt : 0);
			if (Math.abs(this.speed) <= lose) {
				if (throttle <= 0 && brakeIn <= 0) this.speed = 0;
			} else this.speed -= Math.sign(this.speed) * lose;
		} else this.speed *= Math.exp(-2.4 * dt);
		const firing = racing && !this.isTraffic && input.nitro && this.nitro > .02;
		if (firing) {
			this.nitro = Math.max(0, this.nitro - dt * (stats.nitroDrain ?? .42));
			this.boostT = Math.max(this.boostT, .14);
			this.speed += stats.accel * .55 * profile.nitroMul * dt;
			if (!this.nitroHeld) this.nitroPulse = true;
		}
		this.nitroHeld = firing;
		if (boosting) {
			this.speed += stats.accel * .28 * profile.nitroMul * dt;
			this.boostT -= dt;
		}
		this.speed = clamp(this.speed, -maxSpeed * .32, maxSpeed * (firing ? 1.08 : 1));
		{
			const sG = track.samples[this.sampleIndex];
			const nG = track.samples[Math.min(this.sampleIndex + 1, track.samples.length - 1)];
			const gds = Math.hypot(nG.x - sG.x, nG.z - sG.z) || 1;
			let grade = (nG.y - sG.y) / gds;
			const rp = probeRamp(this.x, this.z, ramps, this.y);
			if (rp) {
				const alongV = this.vx * rp.r.sx + this.vz * rp.r.sz;
				grade = rp.dyds * Math.sign(alongV || 1);
			}
			if (racing) {
				this.speed += -grade * 16.2 * dt;
				if (grade > .04) this.speed -= grade * 7.4 * dt;
			}
		}
		const speedAbs = Math.abs(this.speed);
		const loadTgt = racing ? brakeIn * .72 - throttle * .48 : 0;
		const iG = this.sampleIndex;
		const sG = track.samples[iG];
		const nG = track.samples[Math.min(iG + 1, track.samples.length - 1)];
		const gds = Math.hypot(nG.x - sG.x, nG.z - sG.z) || 1;
		const terrainPitch = clamp(-(probeRamp(this.x, this.z, ramps, this.y)?.dyds ?? (nG.y - sG.y) / gds) * 3.4, -.75, .75);
		this.pitch = expSmooth(this.pitch, loadTgt + terrainPitch, 9, dt);
		const rollTgt = racing ? -input.steer * clamp(speedAbs / 24, 0, 1) * .34 : 0;
		this.roll = expSmooth(this.roll, rollTgt, 7, dt);
		const front = clamp(.5 + this.pitch * .42, .32, .7);
		const reverse = this.speed >= 0 ? 1 : -1;
		const wantDrift = racing && input.drift && speedAbs > 9 && Math.abs(input.steer) > .18;
		let grip = this.onTrack ? stats.grip : stats.grip * (stats.body === "rally" ? .78 : .4);
		grip *= this.weatherGrip * this.surfaceGrip * downforce * profile.gripMul * wx.lat * surf.lat;
		grip *= 1 - this.damage * .22;
		grip *= .84 + front * .28;
		grip *= 1 - this.rideCompress * 1.6;
		grip *= 1 / (1 + (speedAbs / 32) ** 2);
		grip *= hydroplane(speedAbs, wx.hydro);
		if (this.wheelsLocked) grip *= .42;
		if (wantDrift) grip = Math.min(grip, .22 + (1 - front) * .12);
		this.stepWheels(dt, input.steer, grip, speedAbs, fx, fz, rx, rz, racing, reverse, wantDrift, front, mass);
		this.integrateMotion(dt, track, grip, colliders, streets, ramps);
		if (wantDrift) {
			this.drifting = true;
			this.driftCharge = Math.min(this.driftCharge + dt * .9, 2.1);
			this.nitro = Math.min(1, this.nitro + dt * .2);
			this.driftAngle = Math.asin(clamp(this.slip, 0, 1)) * 57.3;
			if (!this.isAi) {
				const a = this.driftAngle;
				const zone = a < 12 ? .38 : a > 52 ? .55 : a > 18 && a < 42 ? 1.42 : 1;
				this.driftScore += speedAbs * (.55 + this.driftCharge) * dt * 14 * zone * this.comboMul;
			}
		} else {
			if (this.drifting && this.driftCharge > .55 && racing) {
				this.boostT = Math.min(.4 + this.driftCharge * .55 * profile.driftBoost, 1.55);
				this.nitro = Math.min(1, this.nitro + this.driftCharge * .16);
				if (!this.isAi && this.comboMul > 1.2) this.driftScore += 70 * this.comboMul;
			}
			this.drifting = false;
			this.driftCharge = Math.max(0, this.driftCharge - dt * 1.7);
			this.driftAngle = Math.max(0, this.driftAngle - dt * 40);
			if (!firing && !this.isTraffic) this.nitro = Math.min(1, this.nitro + dt * .012);
		}
		if (!this.onTrack) this.offTrackT += dt;
		else this.offTrackT = 0;
		if (!this.isTraffic && !this.isCop) {
			if (!this.onTrack || this.surfaceKind === "sand") this.dirt += dt * .075;
			else if (this.surfaceKind === "curb") this.dirt += dt * .028;
			if (this.drifting) this.dirt += dt * .045;
			if (this.weatherGrip < .95 && this.onTrack) this.dirt -= dt * .11;
			this.dirt = clamp(this.dirt, 0, 1);
		}
		if (this.offTrackT > 3.2) this.respawn(track);
	}
	stepWheels(dt, steerIn, grip, speedAbs, fx, fz, rx, rz, racing, reverse, wantDrift, front, mass) {
		const wb = 2.55;
		const ht = .76;
		const iz = mass * 2.85;
		const maxSteer = .5 * (1 - .4 * clamp(speedAbs / 36, 0, 1));
		const steer = (racing ? steerIn : 0) * maxSteer * reverse;
		const longs = [
			wb * .5,
			wb * .5,
			-1.275,
			-1.275
		];
		const lats = [
			-.76,
			ht,
			-.76,
			ht
		];
		const steers = [
			steer,
			steer,
			0,
			0
		];
		const loads = [
			front * .5,
			front * .5,
			(1 - front) * .5,
			(1 - front) * .5
		];
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
			const Fy = -pacejka(Math.atan2(vLat, Math.max(2.2, Math.abs(vLong))), Math.max(.08, grip * loads[i] * 4));
			yawT += ox * wrz * Fy - oz * wrx * Fy;
		}
		const speedFactor = clamp(speedAbs / 7.5, 0, 1) * (1 - .4 * clamp(speedAbs / 38, 0, 1));
		const crawl = 1 - clamp((speedAbs - 4) / 6, 0, 1);
		this.kinMix = crawl;
		const kin = steerIn * 1.7 * clamp(speedAbs / 6.5, 0, 1) * reverse * (wantDrift ? 1.28 : 1) * (.92 + front * .16);
		const tire = yawT / iz * 80;
		this.yawRate = kin * crawl + tire;
		const latNow = this.vx * rx + this.vz * rz;
		const esc = escYaw(Math.atan2(latNow, Math.max(2.4, speedAbs)), this.yawRate, this.assists.esc && racing, wantDrift);
		this.escActive = esc.active;
		this.yawRate += esc.yaw * 1.55 * speedFactor;
		this.yaw = wrapPi(this.yaw + this.yawRate * dt);
		this.vx = fx * this.speed + rx * latNow;
		this.vz = fz * this.speed + rz * latNow;
	}
	integrateMotion(dt, track, grip, colliders = [], streets = [], ramps = []) {
		const fx = -Math.sin(this.yaw);
		const fz = -Math.cos(this.yaw);
		const rx = Math.cos(this.yaw);
		const rz = -Math.sin(this.yaw);
		let lat = this.vx * rx + this.vz * rz;
		const speedAbs = Math.hypot(this.speed, lat);
		const slip = Math.abs(lat) / Math.max(speedAbs, 2.2);
		this.slip = slip;
		const peak = Math.max(.12, Math.abs(pacejka(slip, grip)));
		lat *= Math.exp(-peak * 8.4 * dt);
		const spin = lat * (slip > .3 ? .028 : -.006);
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
		const tr = .72;
		const corners = [
			[this.x + fx * wb + rx * tr, this.z + fz * wb + rz * tr],
			[this.x + fx * wb - rx * tr, this.z + fz * wb - rz * tr],
			[this.x - fx * wb + rx * tr, this.z - fz * wb + rz * tr],
			[this.x - fx * wb - rx * tr, this.z - fz * wb - rz * tr]
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
		const avgY = ySum * .25;
		this.rideCompress = clamp(yMax - yMin, 0, .12);
		const groundY = rp ? rp.y : avgY;
		const dist = near.dist;
		const half = track.width / 2;
		const lat01 = dist / Math.max(.5, half);
		const onCurbBand = !rp && lat01 > .9 && lat01 < 1.08;
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
			if (this.y <= groundY + .04) {
				this.y = groundY;
				if (this.vy < 0) this.vy = 0;
				this.airborne = false;
				this.airMs = 0;
			} else {
				if (this.y > groundY + .55) this.airMs += dt * 1e3;
				else this.airMs = 0;
				this.airborne = this.airMs >= 12;
				const ceil = this.vy > 2 || this.airborne ? groundY + 8 : groundY + .85;
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
		this.onTrack = onMain || onAlley || onRamp || this.roam && dist < half * 2.6;
		this.sideStreet = onRamp ? rp.r.he : onAlley && !onMain ? alley.street.he : "";
		this.sideStreetEn = onRamp ? rp.r.en : onAlley && !onMain ? alley.street.en : "";
		if (!this.onTrack) {
			this.surfaceKind = "sand";
			this.surfaceGrip = this.baseGrip * .54;
		} else if (lat01 > .9 && !onRamp) {
			this.surfaceKind = "curb";
			this.surfaceGrip = this.baseGrip * .74;
		} else {
			this.surfaceKind = "asphalt";
			this.surfaceGrip = this.baseGrip * (lat01 > .72 && this.weatherGrip < .95 ? .86 : 1);
		}
		if (!this.onTrack) this.speed *= Math.exp(-(this.roam ? .9 : this.stats.body === "rally" ? 1.15 : 2.6) * dt);
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
					this.speed *= .88;
				}
			}
		} else if (!onRamp) {
			const wall = half + .35;
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
						this.speed *= .9;
						this.impact = Math.max(this.impact, Math.min(.35, out / 36));
						this.damage = clamp(this.damage + out * .004, 0, 1);
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
		if (forwardDelta(prev, this.progress, track.closed) < -.002 && Math.abs(this.speed) > 4 && onMain) this.wrongWayT += dt;
		else this.wrongWayT = Math.max(0, this.wrongWayT - dt * 1.4);
	}
	/** 5.5: resolve once per CCD cut. Not PhysX. */
	hitColliders(colliders) {
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
				if (d >= c.r || d < 1e-4) continue;
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
					this.speed *= hit > 10 ? .02 : hit > 5 ? .07 : .14;
					this.yaw = wrapPi(this.yaw + (nx * fz - nz * fx) * .12 * Math.min(1, hit / 9));
					this.damage = clamp(this.damage + hit * .085, 0, 1);
					if (hit > 2.5) this.impact = Math.max(this.impact, Math.min(1, hit / 7));
				} else if (kind === "car") {
					this.vx -= nx * into * .68;
					this.vz -= nz * into * .68;
					this.speed = this.vx * fx + this.vz * fz;
					this.speed *= hit > 14 ? .58 : hit > 7 ? .76 : .88;
					this.damage = clamp(this.damage + hit * .02, 0, 1);
					if (hit > 4) this.impact = Math.max(this.impact, Math.min(.55, hit / 20));
				} else {
					this.vx -= nx * into * 1.08;
					this.vz -= nz * into * 1.08;
					this.speed = this.vx * fx + this.vz * fz;
					this.speed *= hit > 12 ? .78 : .92;
					if (hit > 9) {
						this.damage = clamp(this.damage + hit * .008, 0, 1);
						this.impact = Math.max(this.impact, Math.min(.38, hit / 30));
					}
				}
			}
		}
	}
	consumeCheckpoints(track, prevProgress) {
		if (this.finished || this.isTraffic || this.isCop || this.eliminated) return {
			lapComplete: false,
			checkpoint: false
		};
		const n = forwardDelta(prevProgress, this.progress, track.closed);
		if (n < 0 || n > .18) return {
			lapComplete: false,
			checkpoint: false
		};
		if (!track.closed && this.progress > .96 && this.lap < 1) {
			this.lap += 1;
			this.lastCheckpoint = track.checkpoints.length - 1;
			return {
				lapComplete: true,
				checkpoint: true
			};
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
		return {
			lapComplete,
			checkpoint
		};
	}
	didCross(prev, now, gate) {
		if (prev <= now) return prev < gate && now >= gate;
		return prev < gate || now >= gate;
	}
	respawn(track) {
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
	snap() {
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
			yawRate: this.yawRate
		};
	}
	load(s) {
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
		return this.lap * 1e3 + this.lastCheckpoint * 10 + this.progress;
	}
};
var SURFACE_GRIP = {
	jaffa: .76,
	stone: .8,
	desert: .62,
	park: .86,
	carmel: .9,
	port: .88,
	highway: .94,
	manhattan: .92,
	bauhaus: .94,
	snow: .5
};
function aiInput(car, track, player) {
	const look = .045 + clamp(car.speed / 80, 0, .04);
	const t = track.closed ? (car.progress + look) % 1 : Math.min(.995, car.progress + look);
	const a = sampleAtT(track.samples, t);
	const tx = a.x + a.rx * car.aiOffset;
	const tz = a.z + a.rz * car.aiOffset;
	const err = wrapPi(Math.atan2(-(tx - car.x), -(tz - car.z)) - car.yaw);
	const steer = clamp(err * 1.6, -1, 1);
	const abs = Math.abs(err);
	const ahead = sampleAtT(track.samples, track.closed ? (car.progress + .09) % 1 : Math.min(.995, car.progress + .09));
	const bend = Math.abs(wrapPi(Math.atan2(-ahead.tx, -ahead.tz) - car.yaw));
	let throttle = abs > .55 ? .35 : 1;
	if (player && HANDLING[car.handling].rubberBand) {
		const gap = player.raceScore() - car.raceScore();
		const target = 1 + clamp(gap * .004, -.12, .08);
		throttle *= car.aiSkill * target;
	} else throttle *= car.aiSkill;
	if (bend > .42) throttle *= .5;
	if (bend > .75) throttle *= .55;
	const brake = abs > .85 && car.speed > 22 || bend > .82 ? .48 : 0;
	const drift = abs > .5 && car.speed > 16;
	const nitro = car.nitro > .4 && abs < .22 && car.speed > 16;
	return {
		steer: clamp(steer, -1, 1),
		throttle: clamp(throttle, 0, 1),
		brake: clamp(brake, 0, 1),
		drift,
		nitro
	};
}
function trafficInput(car, track) {
	const look = .028;
	const t = track.closed ? (car.progress + look) % 1 : Math.min(.995, car.progress + look);
	const a = sampleAtT(track.samples, t);
	const tx = a.x + a.rx * car.aiOffset;
	const tz = a.z + a.rz * car.aiOffset;
	const err = wrapPi(Math.atan2(-(tx - car.x), -(tz - car.z)) - car.yaw);
	const steer = clamp(err * 1.35, -1, 1);
	const cruise = 12 + car.aiSkill * 7;
	return {
		steer: clamp(steer, -1, 1),
		throttle: car.speed < cruise ? .58 : .1,
		brake: Math.abs(err) > .65 && car.speed > 11 ? .45 : 0,
		drift: false,
		nitro: false
	};
}
function copInput(car, track, target, heat = .4) {
	const dx = target.x - car.x;
	const dz = target.z - car.z;
	const dist = Math.hypot(dx, dz);
	const toTarget = Math.atan2(-dx, -dz);
	const look = sampleAtT(track.samples, (car.progress + .03) % 1);
	const toPath = Math.atan2(-(look.x + look.rx * car.aiOffset - car.x), -(look.z + look.rz * car.aiOffset - car.z));
	const mix = dist < 55 ? .72 + heat * .22 : .32 + heat * .2;
	const want = wrapPi(toPath + wrapPi(toTarget - toPath) * mix);
	const err = wrapPi(want - car.yaw);
	let steer = clamp(err * (2.05 + heat * .4), -1, 1);
	const side = Math.cos(car.yaw);
	const fwd = -Math.sin(car.yaw);
	const lat = dx * side + dz * fwd;
	if (dist < 14 && heat > .35) steer = clamp(steer + Math.sign(lat) * .28, -1, 1);
	const throttle = dist > 7 ? 1 : .4;
	const brake = Math.abs(err) > 1.05 && car.speed > 20 ? .42 : 0;
	const drift = Math.abs(err) > .62 && car.speed > 15;
	const nitro = dist > 20 && car.nitro > .08;
	return {
		steer: clamp(steer, -1, 1),
		throttle: clamp(throttle, 0, 1),
		brake: clamp(brake, 0, 1),
		drift,
		nitro
	};
}
function updateDrafting(player, others) {
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
function separateCars(cars) {
	const n = cars.length;
	const rad = 2.45;
	let peak = 0;
	for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
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
		const imp = -1.42 * rel / (1 / ma + 1 / mb);
		a.vx += imp / ma * nx;
		a.vz += imp / ma * nz;
		b.vx -= imp / mb * nx;
		b.vz -= imp / mb * nz;
		const closing = -rel;
		const afx = -Math.sin(a.yaw);
		const afz = -Math.cos(a.yaw);
		const bfx = -Math.sin(b.yaw);
		const bfz = -Math.cos(b.yaw);
		a.speed = a.vx * afx + a.vz * afz;
		b.speed = b.vx * bfx + b.vz * bfz;
		const loss = clamp(closing / 34, .04, .32);
		a.speed *= 1 - loss * (mb / m) * .45;
		b.speed *= 1 - loss * (ma / m) * .45;
		a.damage = clamp(a.damage + closing * .014 * (mb / m), 0, 1);
		b.damage = clamp(b.damage + closing * .014 * (ma / m), 0, 1);
		if (!a.isAi || !b.isAi) {
			peak = Math.max(peak, closing);
			const hit = Math.min(.55, closing / 22);
			if (!a.isAi) a.impact = Math.max(a.impact, hit);
			if (!b.isAi) b.impact = Math.max(b.impact, hit);
		}
	}
	return peak;
}
var LOOKS = {
	summer14: {
		look: "summer14",
		exposure: .56,
		wetness: .18,
		night: 0,
		vis: 1
	},
	golden: {
		look: "golden",
		exposure: .7,
		wetness: .16,
		night: .12,
		vis: 1
	},
	night: {
		look: "night",
		exposure: 1.22,
		wetness: .22,
		night: 1,
		vis: .9
	},
	nightrain: {
		look: "nightrain",
		exposure: 1.18,
		wetness: .7,
		night: 1,
		vis: .76
	},
	rain: {
		look: "rain",
		exposure: .58,
		wetness: 1,
		night: .08,
		vis: .55
	}
};
function lookFromFlags(night, weather, morning = false) {
	if ((weather === "rain" || weather === "storm") && night) return "nightrain";
	if (weather === "rain" || weather === "storm") return "rain";
	if (night) return "night";
	if (morning) return "golden";
	return "summer14";
}
var FOG = {
	city: {
		day: 1e-5,
		night: 45e-6,
		far: 1e4,
		dayCol: 7255260,
		nightCol: 2768984
	},
	desert: {
		day: 6e-5,
		night: 12e-5,
		far: 12e3,
		dayCol: 12101768,
		nightCol: 1714232
	},
	snow: {
		day: 4e-5,
		night: 1e-4,
		far: 12e3,
		dayCol: 13163756,
		nightCol: 1714232
	},
	carmel: {
		day: 2e-5,
		night: 1e-4,
		far: 12e3,
		dayCol: 7255260,
		nightCol: 1714232
	},
	stone: {
		day: 18e-6,
		night: 8e-5,
		far: 14e3,
		dayCol: 12891290,
		nightCol: 1714232
	}
};
function fogKey(theme, id) {
	if (id === "ramon" || theme === "desert") return "desert";
	if (id === "hermon" || theme === "snow") return "snow";
	if (theme === "carmel") return "carmel";
	if (theme === "stone" || id === "jerusalem" || id === "scopus") return "stone";
	return "city";
}
/** UV lane marks. Chain AFTER CSM onBeforeCompile. uv.y in the mesh is meters/6. */
function injectRoadLanes(shader, lanes) {
	if (shader.fragmentShader.includes("RUSH_LANES")) return;
	shader.uniforms.uLanes = { value: lanes };
	shader.uniforms.uWet = { value: 0 };
	shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `#include <map_fragment>
    // RUSH_LANES
    {
      vec2 ru = vMapUv;
      float lanes = uLanes;
      float edge = max(smoothstep(0.018, 0.0, ru.x), smoothstep(0.982, 1.0, ru.x));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.93, 0.94), edge * 0.9);
      float meters = ru.y * 6.0;
      float dash = step(0.45, fract(meters / 8.0));
      float laneU = ru.x * lanes;
      float k = floor(laneU + 0.5);
      float skipEdge = step(k, 0.5) + step(lanes - 0.5, k);
      float skipMid = 0.0;
      float bound = 1.0 - smoothstep(0.018, 0.04, abs(fract(laneU + 0.5) - 0.5));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96), bound * dash * (1.0 - skipEdge) * (1.0 - skipMid) * 0.92);
      float wet = uWet;
      diffuseColor.rgb *= mix(1.0, 0.88, wet);
    }`);
	if (!shader.fragmentShader.includes("RUSH_WET_R")) shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.14, uWet); // RUSH_WET_R`);
	shader.fragmentShader = "uniform float uLanes;\nuniform float uWet;\n" + shader.fragmentShader;
}
function bindRoadCompile(mat) {
	const lanes = mat.userData.lanes;
	if (!lanes) return;
	const prev = mat.onBeforeCompile;
	mat.onBeforeCompile = (shader, renderer) => {
		if (typeof prev === "function") prev(shader, renderer);
		injectRoadLanes(shader, lanes);
		mat.userData.uWet = shader.uniforms.uWet;
	};
}
var tex$7;
function getLaneArrow() {
	return tex$7;
}
async function loadLaneArrow() {
	if (tex$7) return tex$7;
	const t = await new TextureLoader().loadAsync("/game/lane-arrow.png");
	t.colorSpace = SRGBColorSpace;
	t.needsUpdate = true;
	tex$7 = t;
	return tex$7;
}
var a;
var b;
function getFlare0() {
	return a;
}
function getFlare1() {
	return b;
}
async function loadFlares() {
	if (a && b) return;
	const L = new TextureLoader();
	const [t0, t1] = await Promise.all([L.loadAsync("/game/flare-0.png"), L.loadAsync("/game/flare-1.png")]);
	t0.colorSpace = SRGBColorSpace;
	t1.colorSpace = SRGBColorSpace;
	t0.needsUpdate = true;
	t1.needsUpdate = true;
	a = t0;
	b = t1;
}
var water;
var checker;
function getWaterNormal() {
	return water;
}
function getChecker() {
	return checker;
}
async function loadWater() {
	if (water && checker) return;
	const L = new TextureLoader();
	const [n, c] = await Promise.all([L.loadAsync("/game/water-n.png"), L.loadAsync("/game/checker.png")]);
	n.wrapS = n.wrapT = RepeatWrapping;
	n.repeat.set(48, 28);
	n.anisotropy = 4;
	n.needsUpdate = true;
	c.magFilter = NearestFilter;
	c.colorSpace = SRGBColorSpace;
	c.repeat.set(1, 1);
	c.needsUpdate = true;
	water = n;
	checker = c;
}
var kits$2 = /* @__PURE__ */ new Map();
var GANTRY = [
	"gantry-kibbutz-galuyot",
	"gantry-hahagana",
	"gantry-laguardia",
	"gantry-hashalom",
	"gantry-savidor-center",
	"gantry-university",
	"stn-galuyot",
	"stn-hagana",
	"stn-shalom",
	"stn-savidor",
	"stn-uni",
	"dest-rail"
];
function getSign(kind) {
	return kits$2.get(kind);
}
function getGantry(id) {
	return kits$2.get(id);
}
async function loadSigns() {
	if (kits$2.size) return;
	const L = new TextureLoader();
	await Promise.all([...[
		"stop",
		"yield",
		"none",
		"speed50",
		"speed80",
		"speed90"
	].map(async (k) => {
		const t = await L.loadAsync(`/game/sign-${k}.png`);
		t.colorSpace = SRGBColorSpace;
		t.anisotropy = 4;
		t.needsUpdate = true;
		kits$2.set(k, t);
	}), ...GANTRY.map(async (k) => {
		const t = await L.loadAsync(`/game/${k}.png`);
		t.colorSpace = SRGBColorSpace;
		t.anisotropy = 4;
		t.needsUpdate = true;
		kits$2.set(k, t);
	})]);
}
var tex$6;
function getFoam() {
	return tex$6;
}
async function loadFoam() {
	if (tex$6) return tex$6;
	const t = await new TextureLoader().loadAsync("/game/foam.png");
	t.wrapS = ClampToEdgeWrapping;
	t.wrapT = RepeatWrapping;
	t.repeat.set(1, 8);
	t.colorSpace = SRGBColorSpace;
	t.needsUpdate = true;
	tex$6 = t;
	return tex$6;
}
var tex$5;
function getGroundNoise() {
	return tex$5;
}
async function loadGround() {
	if (tex$5) return tex$5;
	const t = await new TextureLoader().loadAsync("/game/ground.png");
	t.wrapS = t.wrapT = RepeatWrapping;
	t.colorSpace = SRGBColorSpace;
	t.repeat.set(90, 90);
	t.anisotropy = 8;
	t.needsUpdate = true;
	tex$5 = t;
	return tex$5;
}
var tex$4;
function getSidewalk() {
	return tex$4;
}
async function loadSidewalk() {
	if (tex$4) return tex$4;
	const t = await new TextureLoader().loadAsync("/game/sidewalk.png");
	t.wrapS = t.wrapT = RepeatWrapping;
	t.colorSpace = SRGBColorSpace;
	t.anisotropy = 4;
	t.needsUpdate = true;
	tex$4 = t;
	return tex$4;
}
var kits$1 = /* @__PURE__ */ new Map();
function getCurtain(kind) {
	return kits$1.get(kind) ?? kits$1.get("blue");
}
async function loadCurtains() {
	if (kits$1.size) return;
	const L = new TextureLoader();
	await Promise.all([
		"blue",
		"teal",
		"dark",
		"gold",
		"white"
	].map(async (k) => {
		const t = await L.loadAsync(`/game/curtain-${k}.png`);
		t.wrapS = t.wrapT = RepeatWrapping;
		t.anisotropy = 8;
		t.colorSpace = SRGBColorSpace;
		t.repeat.set(2, 8);
		t.needsUpdate = true;
		kits$1.set(k, t);
	}));
}
var kits = /* @__PURE__ */ new Map();
function getCurb(kind) {
	return kits.get(kind) ?? kits.get("city");
}
async function loadCurbs() {
	if (kits.size) return;
	const L = new TextureLoader();
	await Promise.all([
		"city",
		"stone",
		"dirt",
		"sand"
	].map(async (k) => {
		const t = await L.loadAsync(`/game/curb-${k}.png`);
		t.wrapS = t.wrapT = RepeatWrapping;
		t.colorSpace = SRGBColorSpace;
		t.anisotropy = 8;
		t.repeat.set(1, 1);
		t.needsUpdate = true;
		kits.set(k, t);
	}));
}
var tex$3;
function getHerodian() {
	return tex$3;
}
async function loadHerodian() {
	if (tex$3) return tex$3;
	const t = await new TextureLoader().loadAsync("/game/herodian.png");
	t.wrapS = t.wrapT = RepeatWrapping;
	t.anisotropy = 8;
	t.colorSpace = SRGBColorSpace;
	t.repeat.set(3, 2);
	t.needsUpdate = true;
	tex$3 = t;
	return tex$3;
}
var tex$2;
function getJaffaClock() {
	return tex$2;
}
async function loadJaffaClock() {
	if (tex$2) return tex$2;
	const t = await new TextureLoader().loadAsync("/game/jaffa-clock.png");
	t.colorSpace = SRGBColorSpace;
	t.needsUpdate = true;
	tex$2 = t;
	return tex$2;
}
var tex$1;
function getIsraelFlag() {
	return tex$1;
}
async function loadIsraelFlag() {
	if (tex$1) return tex$1;
	const t = await new TextureLoader().loadAsync("/game/israel-flag.png");
	t.colorSpace = SRGBColorSpace;
	t.needsUpdate = true;
	tex$1 = t;
	return tex$1;
}
var foliage;
var bark;
function getFoliage() {
	return foliage;
}
function getBark() {
	return bark;
}
function prep$1(t, repeatY) {
	t.wrapS = t.wrapT = RepeatWrapping;
	t.anisotropy = 4;
	t.colorSpace = SRGBColorSpace;
	t.repeat.set(repeatY === 3 ? 1 : 2, repeatY);
	t.needsUpdate = true;
	return t;
}
async function loadTreeMaps() {
	if (foliage && bark) return;
	const L = new TextureLoader();
	const [f, b] = await Promise.all([L.loadAsync("/game/foliage.png"), L.loadAsync("/game/bark.png")]);
	foliage = prep$1(f, 2);
	bark = prep$1(b, 3);
}
var day;
var night;
function getSkyDay() {
	return day;
}
function getSkyNight() {
	return night;
}
function prep(tex) {
	tex.mapping = 303;
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 4;
	tex.needsUpdate = true;
	return tex;
}
/** Baked gradient skies. Not HDRI. */
async function loadSky() {
	if (day && night) return;
	const L = new TextureLoader();
	const [d, n] = await Promise.all([L.loadAsync("/game/sky-day.png"), L.loadAsync("/game/sky-night.png")]);
	day = prep(d);
	night = prep(n);
}
var tex;
function getBlob() {
	return tex;
}
async function loadBlob(_renderer) {
	if (tex) return tex;
	const t = await new TextureLoader().loadAsync("/game/blob.png");
	t.colorSpace = "";
	t.needsUpdate = true;
	tex = t;
	return tex;
}
/**
* Assemble the stable, track-agnostic world API around implementations owned by
* the concrete world composition root. This function creates no scene, physics,
* storage or QA resources and preserves the accepted public key order.
*/
function assembleWorld(parts) {
	const { group, sun, sky, dir, dirNear, waterMesh, colliders, streets, ramps, getNight, getWeather, followShadows, followMirror, setPlanar, sunDir, tick, setTime, setClock, getClock, setWeather, setLod, dispose } = parts;
	return {
		group,
		sun,
		sky,
		dir,
		dirNear,
		waterMesh,
		colliders,
		streets,
		ramps,
		get night() {
			return getNight();
		},
		get weather() {
			return getWeather();
		},
		followShadows,
		followMirror,
		setPlanar,
		sunDir,
		tick,
		setTime,
		setClock,
		get clock() {
			return getClock();
		},
		setWeather,
		setLod,
		dispose
	};
}
function scatterStreetBuildings(def, built, add, hit, night, blocked) {
	if (def.city === "nyc") return;
}
function createTrackWorldBuilderContext(input) {
	const { group, def, bag, shadows, isNight, glows, emitList, colliders, movers, ramps, streets, built, support: { _dummy, barkTexture, curtainTexture, foliageTexture, herodianTexture, samp, segsOf } } = input;
	const add = (mesh) => {
		mesh.castShadow = shadows;
		mesh.receiveShadow = true;
		group.add(mesh);
		if ("geometry" in mesh && mesh.geometry) bag.push(mesh.geometry);
		const mat = "material" in mesh ? mesh.material : null;
		if (Array.isArray(mat)) mat.forEach((m) => bag.push(m));
		else if (mat) bag.push(mat);
	};
	const glowAt = (x, y, z, color, on, dist) => {
		if (!shadows || glows.length >= 4) return;
		const pl = new PointLight(color, isNight ? on : 0, dist, 2);
		pl.position.set(x, y, z);
		group.add(pl);
		glows.push({
			light: pl,
			on
		});
	};
	const hit = (x, z, r, hx, hz, yaw) => {
		colliders.push({
			x,
			z,
			r,
			hx: hx ?? r * .72,
			hz: hz ?? r * .72,
			yaw: yaw ?? 0,
			kind: "building"
		});
	};
	const roadYaw = (x, z) => {
		const s = built.samples[nearestIndex(built.samples, x, z, 0).index];
		return Math.atan2(s.tx, s.tz);
	};
	const hitRoad = (x, z, r, hx, hz) => hit(x, z, r, hx, hz, roadYaw(x, z));
	const towerHit = (x, z, r, hx, hz, yaw) => {
		if (def.id === "ayalon") hitRoad(x, z, r, hx, hz);
		else hit(x, z, r, hx, hz, yaw);
	};
	const placeTunnel = (cx, cz, yaw, len, half, h, y0 = 0) => {
		const fx = Math.sin(yaw);
		const fz = Math.cos(yaw);
		const rx = Math.cos(yaw);
		const rz = -Math.sin(yaw);
		const wallMat = new MeshStandardMaterial({
			color: 3813932,
			roughness: .9,
			envMapIntensity: .2
		});
		const tileMat = new MeshStandardMaterial({
			color: 10127986,
			roughness: .62,
			envMapIntensity: .35
		});
		const ceilMat = new MeshStandardMaterial({
			color: 2367002,
			roughness: .92
		});
		const lampMat = new MeshStandardMaterial({
			color: 16771248,
			emissive: 16764006,
			emissiveIntensity: isNight ? 2.4 : .7,
			roughness: .4
		});
		bag.push(wallMat, tileMat, ceilMat, lampMat);
		const wallL = new Mesh(new BoxGeometry(.85, h, len), wallMat);
		wallL.position.set(cx - rx * half, y0 + h * .5, cz - rz * half);
		wallL.rotation.y = yaw;
		add(wallL);
		const wallR = new Mesh(new BoxGeometry(.85, h, len), wallMat);
		wallR.position.set(cx + rx * half, y0 + h * .5, cz + rz * half);
		wallR.rotation.y = yaw;
		add(wallR);
		const tileL = new Mesh(new BoxGeometry(.12, h * .55, len * .96), tileMat);
		tileL.position.set(cx - rx * (half - .5), y0 + h * .32, cz - rz * (half - .5));
		tileL.rotation.y = yaw;
		add(tileL);
		const tileR = tileL.clone();
		tileR.position.set(cx + rx * (half - .5), y0 + h * .32, cz + rz * (half - .5));
		add(tileR);
		const ceil = new Mesh(new BoxGeometry(half * 2 + 1.6, .7, len), ceilMat);
		ceil.position.set(cx, y0 + h + .15, cz);
		ceil.rotation.y = yaw;
		add(ceil);
		for (const end of [-1, 1]) {
			const px = cx + fx * (len * .5) * end;
			const pz = cz + fz * (len * .5) * end;
			for (const side of [-1, 1]) {
				const post = new Mesh(new BoxGeometry(1.15, h + 1.4, 1.35), tileMat);
				post.position.set(px + rx * half * side, y0 + (h + 1.4) * .5, pz + rz * half * side);
				post.rotation.y = yaw;
				add(post);
			}
			const lintel = new Mesh(new BoxGeometry(half * 2 + 2.4, 1.5, 1.5), tileMat);
			lintel.position.set(px, y0 + h + .6, pz);
			lintel.rotation.y = yaw;
			add(lintel);
		}
		const nLamps = Math.max(3, Math.round(len / 10));
		for (let i = 0; i < nLamps; i++) {
			const t = (i + .5) / nLamps - .5;
			const lx = cx + fx * t * len;
			const lz = cz + fz * t * len;
			const lamp = new Mesh(new BoxGeometry(.35, .16, 1.1), lampMat);
			lamp.position.set(lx, y0 + h - .2, lz);
			lamp.rotation.y = yaw;
			add(lamp);
		}
		const nHit = Math.max(3, Math.round(len / 12));
		for (let i = 0; i < nHit; i++) {
			const t = (i + .5) / nHit - .5;
			const wx = cx + fx * t * len;
			const wz = cz + fz * t * len;
			hit(wx - rx * (half + .4), wz - rz * (half + .4), 1.05, .55, 2.4, yaw);
			hit(wx + rx * (half + .4), wz + rz * (half + .4), 1.05, .55, 2.4, yaw);
		}
	};
	const stone = new MeshStandardMaterial({
		color: 13350810,
		roughness: .78,
		envMapIntensity: .45
	});
	const white = new MeshStandardMaterial({
		color: 15525594,
		roughness: .48,
		metalness: 0,
		envMapIntensity: .7
	});
	const glass = new MeshPhysicalMaterial({
		color: 6987956,
		roughness: .08,
		metalness: 0,
		envMapIntensity: 1.8,
		clearcoat: 1,
		clearcoatRoughness: .08,
		emissive: 1722982,
		emissiveIntensity: isNight ? .32 : 0
	});
	const copper = new MeshPhysicalMaterial({
		color: 11569722,
		metalness: .82,
		roughness: .22,
		envMapIntensity: 1.4,
		clearcoat: .45
	});
	const gold = new MeshPhysicalMaterial({
		color: 13934615,
		metalness: .92,
		roughness: .18,
		envMapIntensity: 1.8,
		clearcoat: .7,
		emissive: 13934615,
		emissiveIntensity: isNight ? .55 : .06
	});
	const cream = new MeshStandardMaterial({
		color: 15260868,
		roughness: .62,
		envMapIntensity: .5
	});
	const terracotta = new MeshStandardMaterial({
		color: 10771002,
		roughness: .82,
		envMapIntensity: .3
	});
	const wood = new MeshStandardMaterial({
		color: 6965810,
		roughness: .88
	});
	const darkArch = new MeshStandardMaterial({
		color: 1840144,
		roughness: .96
	});
	bag.push(darkArch);
	const merlonWall = (x, z, len, yaw, h = 12) => {
		const wall = new Mesh(new BoxGeometry(len, h, 4.4), stone);
		wall.position.set(x, h * .5, z);
		wall.rotation.y = yaw;
		add(wall);
		const n = Math.max(4, Math.floor(len / 5.2));
		for (let i = 0; i < n; i++) {
			const t = (i / Math.max(1, n - 1) - .5) * (len - 2.4);
			const m = new Mesh(new BoxGeometry(2.5, 2.15, 4.8), stone);
			m.position.set(x + Math.cos(yaw) * t, h + 1.05, z - Math.sin(yaw) * t);
			m.rotation.y = yaw;
			add(m);
		}
		hit(x, z, Math.min(7, Math.max(3.5, len * .1)));
	};
	const minaret = (x, z, h = 26) => {
		const shaft = new Mesh(new CylinderGeometry(1.25, 1.65, h, 10), stone);
		shaft.position.set(x, h * .5, z);
		add(shaft);
		const ring = new Mesh(new CylinderGeometry(2.05, 2.05, .65, 10), cream);
		ring.position.set(x, h * .68, z);
		add(ring);
		const cap = new Mesh(new ConeGeometry(1.7, 3.2, 8), stone);
		cap.position.set(x, h + 1.4, z);
		add(cap);
		hit(x, z, 4);
	};
	const ottomanGate = (x, z, yaw) => {
		const rx = Math.cos(yaw);
		const rz = -Math.sin(yaw);
		for (const s of [-18, 18]) {
			const t = new Mesh(new BoxGeometry(9, 16, 10), stone);
			t.position.set(x + rx * s, 8, z + rz * s);
			t.rotation.y = yaw;
			add(t);
			hit(x + rx * s, z + rz * s, 6, 4.8, 5.2, yaw);
		}
		const lintel = new Mesh(new BoxGeometry(38, 5.4, 10.4), stone);
		lintel.position.set(x, 18.2, z);
		lintel.rotation.y = yaw;
		add(lintel);
		const ped = new Mesh(new ConeGeometry(5.8, 3.6, 4), stone);
		ped.rotation.y = yaw + Math.PI / 4;
		ped.position.set(x, 23.6, z);
		add(ped);
		for (const s of [
			-16,
			-6,
			6,
			16
		]) {
			const mer = new Mesh(new BoxGeometry(3.4, 2.2, 10.8), stone);
			mer.position.set(x + rx * s, 21.8, z + rz * s);
			mer.rotation.y = yaw;
			add(mer);
		}
	};
	const placeDome = (dmx, dmz) => {
		const oct = new Mesh(new CylinderGeometry(11.4, 11.4, 8.4, 8), cream);
		oct.position.set(dmx, 9.2, dmz);
		add(oct);
		const tile = new MeshStandardMaterial({
			color: 1986178,
			roughness: .38,
			metalness: .22,
			envMapIntensity: .85
		});
		bag.push(tile);
		const tileBand = new Mesh(new CylinderGeometry(11.55, 11.55, 3.2, 8), tile);
		tileBand.position.set(dmx, 11.4, dmz);
		add(tileBand);
		for (let i = 0; i < 8; i++) {
			const a = i / 8 * Math.PI * 2 + Math.PI / 8;
			const col = new Mesh(new CylinderGeometry(.48, .55, 8.6, 8), cream);
			col.position.set(dmx + Math.cos(a) * 11.9, 9.2, dmz + Math.sin(a) * 11.9);
			add(col);
		}
		const drum = new Mesh(new CylinderGeometry(7.8, 7.8, 6.2, 20), tile);
		drum.position.set(dmx, 16.4, dmz);
		add(drum);
		const dome = new Mesh(new SphereGeometry(10.4, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), gold);
		dome.position.set(dmx, 19.4, dmz);
		add(dome);
		const lantern = new Mesh(new CylinderGeometry(.85, 1.35, 3.1, 8), gold);
		lantern.position.set(dmx, 30.4, dmz);
		add(lantern);
		glowAt(dmx, 31, dmz, 16763972, 80, 48);
		hit(dmx, dmz, 12);
	};
	const cyan = new MeshPhysicalMaterial({
		color: 3842232,
		roughness: .08,
		metalness: .12,
		envMapIntensity: 1.4,
		clearcoat: 1,
		clearcoatRoughness: .12,
		emissive: 3842232,
		emissiveIntensity: isNight ? .7 : .08
	});
	bag.push(stone, white, glass, copper, gold, cream, terracotta, wood, cyan);
	emitList.push({
		mat: gold,
		night: .55,
		day: .06
	}, {
		mat: glass,
		night: .32,
		day: 0
	}, {
		mat: cyan,
		night: .7,
		day: .08
	});
	const darkGlass = new MeshPhysicalMaterial({
		color: 3822696,
		roughness: .08,
		metalness: 0,
		envMapIntensity: 1.6,
		clearcoat: 1,
		clearcoatRoughness: .08,
		emissive: 663600,
		emissiveIntensity: isNight ? .28 : 0
	});
	const paleGlass = new MeshPhysicalMaterial({
		color: 12110036,
		roughness: .1,
		metalness: 0,
		envMapIntensity: 1.4,
		clearcoat: .9,
		emissive: 1716288,
		emissiveIntensity: isNight ? .22 : 0
	});
	const bandMat = new MeshStandardMaterial({
		color: 14214378,
		metalness: .62,
		roughness: .22,
		envMapIntensity: 1.3
	});
	const winTex = curtainTexture("blue");
	const triTex = curtainTexture("teal");
	const sqTex = curtainTexture("dark");
	const gateTex = curtainTexture("dark");
	const tohaTex = curtainTexture("gold");
	bag.push(winTex, triTex, sqTex, gateTex, tohaTex);
	const mkGlass = (map, color, nightEmi) => new MeshPhysicalMaterial({
		map,
		color,
		roughness: .12,
		metalness: 0,
		envMapIntensity: 1.45,
		clearcoat: 1,
		clearcoatRoughness: .1,
		emissive: 1722982,
		emissiveIntensity: isNight ? nightEmi : 0
	});
	const azGlass = mkGlass(winTex, 5151362, .38);
	const azTriGlass = mkGlass(triTex, 9136970, .32);
	const azSqGlass = mkGlass(sqTex, 6982314, .28);
	const gateGlass = mkGlass(gateTex, 13161692, .3);
	const tohaGlass = mkGlass(tohaTex, 13214810, .24);
	bag.push(darkGlass, paleGlass, bandMat, azGlass, azTriGlass, azSqGlass, gateGlass, tohaGlass);
	emitList.push({
		mat: darkGlass,
		night: .28,
		day: 0
	}, {
		mat: paleGlass,
		night: .22,
		day: 0
	}, {
		mat: azGlass,
		night: .38,
		day: 0
	}, {
		mat: azTriGlass,
		night: .32,
		day: 0
	}, {
		mat: azSqGlass,
		night: .28,
		day: 0
	}, {
		mat: gateGlass,
		night: .3,
		day: 0
	}, {
		mat: tohaGlass,
		night: .24,
		day: 0
	});
	const placeAzrieli = (s) => {
		const azBand = new MeshStandardMaterial({
			color: 15526112,
			metalness: 0,
			roughness: .42,
			envMapIntensity: .85
		});
		bag.push(azBand);
		const roundP = tlv(32.07455, 34.79195);
		const nAz = nearestIndex(built.samples, roundP.x, roundP.z, 0);
		const sAz = built.samples[nAz.index];
		const park = built.width / 2 + 52;
		const cx = sAz.x + sAz.rx * park;
		const cz = sAz.z + sAz.rz * park;
		const rH = 154 * s;
		const round = new Mesh(new CylinderGeometry(13.4 * s, 14.6 * s, rH, 48), azGlass);
		round.position.set(cx, rH * .5, cz);
		add(round);
		{
			const ringYs = [];
			for (let y = 4.4 * s; y < rH - 2.4 * s; y += 2.35 * s) ringYs.push(y);
			const ringGeo = new TorusGeometry(13.8 * s, .08 * s, 5, 24);
			const rings = new InstancedMesh(ringGeo, azBand, ringYs.length);
			rings.frustumCulled = false;
			for (let i = 0; i < ringYs.length; i++) {
				const sc = 1 + ringYs[i] / rH * .041;
				_dummy.position.set(cx, ringYs[i], cz);
				_dummy.rotation.set(Math.PI / 2, 0, 0);
				_dummy.scale.set(sc, sc, 1);
				_dummy.updateMatrix();
				rings.setMatrixAt(i, _dummy.matrix);
			}
			rings.instanceMatrix.needsUpdate = true;
			rings.castShadow = shadows;
			group.add(rings);
			bag.push(ringGeo);
		}
		const saucerUnd = new Mesh(new CylinderGeometry(22.4 * s, 14.6 * s, 2.8 * s, 36), azBand);
		saucerUnd.position.set(cx, rH + .4 * s, cz);
		add(saucerUnd);
		const saucer = new Mesh(new CylinderGeometry(23.2 * s, 20.4 * s, 2 * s, 36), paleGlass);
		saucer.position.set(cx, rH + 2.8 * s, cz);
		add(saucer);
		const saucerGlass = new Mesh(new SphereGeometry(12.6 * s, 28, 14, 0, Math.PI * 2, 0, Math.PI * .5), paleGlass);
		saucerGlass.position.set(cx, rH + 3.6 * s, cz);
		add(saucerGlass);
		const saucerRim = new Mesh(new TorusGeometry(21.6 * s, .48 * s, 6, 36), azBand);
		saucerRim.rotation.x = Math.PI / 2;
		saucerRim.position.set(cx, rH + 2.9 * s, cz);
		add(saucerRim);
		const saucerRim2 = new Mesh(new TorusGeometry(16.2 * s, .32 * s, 6, 28), azBand);
		saucerRim2.rotation.x = Math.PI / 2;
		saucerRim2.position.set(cx, rH + 3.8 * s, cz);
		add(saucerRim2);
		const tH = 138 * s;
		const triX = cx + sAz.tx * 24 * s + sAz.rx * 20 * s;
		const triZ = cz + sAz.tz * 24 * s + sAz.rz * 20 * s;
		const tri = new Mesh(new CylinderGeometry(8.8 * s, 10.8 * s, tH, 3), azTriGlass);
		tri.position.set(triX, tH * .5, triZ);
		tri.rotation.y = .52;
		add(tri);
		for (let i = 0; i < 3; i++) {
			const a = .52 + i * (Math.PI * 2 / 3) + Math.PI / 3;
			const r = 9.2 * s;
			const post = new Mesh(new BoxGeometry(.62 * s, tH * .96, .62 * s), azBand);
			post.position.set(triX + Math.cos(a) * r, tH * .5, triZ + Math.sin(a) * r);
			add(post);
		}
		{
			const bandYs = [];
			for (let y = 6 * s; y < tH - 4 * s; y += 5.6 * s) bandYs.push(y);
			const bandGeo = new CylinderGeometry(9.2 * s, 10.2 * s, .45 * s, 3);
			const bands = new InstancedMesh(bandGeo, azBand, bandYs.length);
			bands.frustumCulled = false;
			for (let i = 0; i < bandYs.length; i++) {
				_dummy.position.set(triX, bandYs[i], triZ);
				_dummy.rotation.set(0, .52, 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				bands.setMatrixAt(i, _dummy.matrix);
			}
			bands.instanceMatrix.needsUpdate = true;
			bands.castShadow = shadows;
			group.add(bands);
			bag.push(bandGeo);
		}
		const triCap = new Mesh(new CylinderGeometry(1.4 * s, 8.6 * s, 18 * s, 3), paleGlass);
		triCap.position.set(triX, tH + 7 * s, triZ);
		triCap.rotation.y = .52;
		add(triCap);
		const sH = 126 * s;
		const sqX = cx - sAz.tx * 22 * s + sAz.rx * 12 * s;
		const sqZ = cz - sAz.tz * 22 * s + sAz.rz * 12 * s;
		const sq = new Mesh(new BoxGeometry(15.2 * s, sH, 15.2 * s), azSqGlass);
		sq.position.set(sqX, sH * .5, sqZ);
		add(sq);
		{
			const slabYs = [];
			for (let y = 5.5 * s; y < sH - 3 * s; y += 2.9 * s) slabYs.push(y);
			const slabGeo = new BoxGeometry(15.8 * s, .35 * s, 15.8 * s);
			const slabs = new InstancedMesh(slabGeo, azBand, slabYs.length);
			slabs.frustumCulled = false;
			for (let i = 0; i < slabYs.length; i++) {
				_dummy.position.set(sqX, slabYs[i], sqZ);
				_dummy.rotation.set(0, 0, 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				slabs.setMatrixAt(i, _dummy.matrix);
			}
			slabs.instanceMatrix.needsUpdate = true;
			slabs.castShadow = shadows;
			group.add(slabs);
			bag.push(slabGeo);
		}
		const sq2 = new Mesh(new BoxGeometry(11.6 * s, 8.4 * s, 11.6 * s), paleGlass);
		sq2.position.set(sqX, sH + 3.8 * s, sqZ);
		add(sq2);
		const sq3 = new Mesh(new BoxGeometry(8.4 * s, 6.2 * s, 8.4 * s), azSqGlass);
		sq3.position.set(sqX, sH + 10.8 * s, sqZ);
		add(sq3);
		const sqMast = new Mesh(new CylinderGeometry(.2 * s, .32 * s, 12 * s, 6), azBand);
		sqMast.position.set(sqX, sH + 20 * s, sqZ);
		add(sqMast);
		const mallP = {
			x: (cx + triX + sqX) / 3,
			z: (cz + triZ + sqZ) / 3
		};
		const pod = new Mesh(new BoxGeometry(52 * s, 9.2 * s, 42 * s), white);
		pod.position.set(mallP.x, 4.6 * s, mallP.z);
		add(pod);
		const atrium = new Mesh(new CylinderGeometry(16.4 * s, 16.4 * s, 14 * s, 32), paleGlass);
		atrium.position.set(mallP.x, 7 * s, mallP.z);
		add(atrium);
		const atriumRim = new Mesh(new TorusGeometry(16.6 * s, .48 * s, 6, 32), azBand);
		atriumRim.rotation.x = Math.PI / 2;
		atriumRim.position.set(mallP.x, 14.1 * s, mallP.z);
		add(atriumRim);
		const atriumDome = new Mesh(new SphereGeometry(16.4 * s, 28, 14, 0, Math.PI * 2, 0, Math.PI * .42), paleGlass);
		atriumDome.position.set(mallP.x, 14.2 * s, mallP.z);
		add(atriumDome);
		const spanTri = Math.max(8 * s, Math.hypot(cx - triX, cz - triZ));
		const bridge = new Mesh(new BoxGeometry(spanTri, 1.7 * s, 5.8 * s), paleGlass);
		bridge.position.set((cx + triX) * .5, 34 * s, (cz + triZ) * .5);
		bridge.rotation.y = Math.atan2(triX - cx, triZ - cz);
		add(bridge);
		const spanSq = Math.max(8 * s, Math.hypot(cx - sqX, cz - sqZ));
		const bridge2 = new Mesh(new BoxGeometry(spanSq, 1.6 * s, 5.4 * s), paleGlass);
		bridge2.position.set((cx + sqX) * .5, 31 * s, (cz + sqZ) * .5);
		bridge2.rotation.y = Math.atan2(sqX - cx, sqZ - cz);
		add(bridge2);
		glowAt(cx, rH + 6, cz, 8308968, 62 * s, 54 * s);
		glowAt(triX, tH + 6, triZ, 8308968, 52 * s, 48 * s);
		towerHit(cx, cz, 12 * s, 14 * s, 14 * s);
		towerHit(triX, triZ, 11 * s, 10 * s, 10 * s);
		towerHit(sqX, sqZ, 10 * s, 8.4 * s, 8.4 * s);
	};
	const parkTower = (lat, lon, extra = 48) => {
		const hint = tlv(lat, lon);
		const nH = nearestIndex(built.samples, hint.x, hint.z, 0);
		const sH = built.samples[nH.index];
		return nH.dist < built.width / 2 + extra - 8 ? {
			x: sH.x + sH.rx * (built.width / 2 + extra),
			z: sH.z + sH.rz * (built.width / 2 + extra)
		} : hint;
	};
	const placeCityGate = (s) => {
		const p = parkTower(32.0832, 34.8027, 52);
		const h = 168 * s;
		const yaw = Math.PI / 4;
		const body = new Mesh(new BoxGeometry(16.2 * s, h, 16.2 * s), gateGlass);
		body.position.set(p.x, h * .5, p.z);
		body.rotation.y = yaw;
		add(body);
		{
			const slabYs = [];
			for (let y = 10 * s; y < h - 8 * s; y += 6.2 * s) slabYs.push(y);
			const slabGeo = new BoxGeometry(16.8 * s, .28 * s, 16.8 * s);
			const slabs = new InstancedMesh(slabGeo, bandMat, slabYs.length);
			slabs.frustumCulled = false;
			for (let i = 0; i < slabYs.length; i++) {
				_dummy.position.set(p.x, slabYs[i], p.z);
				_dummy.rotation.set(0, yaw, 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				slabs.setMatrixAt(i, _dummy.matrix);
			}
			slabs.instanceMatrix.needsUpdate = true;
			slabs.castShadow = shadows;
			group.add(slabs);
			bag.push(slabGeo);
		}
		const crown = new Mesh(new BoxGeometry(11.4 * s, 18 * s, 11.4 * s), paleGlass);
		crown.position.set(p.x, h + 8 * s, p.z);
		crown.rotation.y = yaw;
		add(crown);
		const mast = new Mesh(new CylinderGeometry(.22 * s, .55 * s, 48 * s, 8), bandMat);
		mast.position.set(p.x, h + 40 * s, p.z);
		add(mast);
		glowAt(p.x, h + 24 * s, p.z, 11065584, 52 * s, 46 * s);
		towerHit(p.x, p.z, 11 * s, 10 * s, 10 * s, yaw);
	};
	const placeToHa = (s, lat = 32.0713, lon = 34.7886) => {
		const hint = tlv(lat, lon);
		const nH = nearestIndex(built.samples, hint.x, hint.z, 0);
		const sH = built.samples[nH.index];
		const p = nH.dist < built.width / 2 + 40 ? {
			x: sH.x + sH.rx * (built.width / 2 + 48),
			z: sH.z + sH.rz * (built.width / 2 + 48)
		} : hint;
		const n = 22;
		const floorGeo = new BoxGeometry(1, 4.7 * s, .62);
		const floors = new InstancedMesh(floorGeo, tohaGlass, 44);
		floors.frustumCulled = false;
		const lipGeo = new BoxGeometry(1, .22 * s, .72);
		const lips = new InstancedMesh(lipGeo, bandMat, n);
		lips.frustumCulled = false;
		let fi = 0;
		let li = 0;
		const stack = (ox, oz, twist0, twistDir) => {
			for (let i = 0; i < n; i++) {
				const t = i / 21;
				const w = (6.4 + t * 14.8) * s;
				const y = 3.8 * s + i * (5.15 * s);
				const yaw = twist0 + t * .95 * twistDir + Math.PI / 4;
				const x = p.x + ox + Math.sin(t * 1.1) * 1.6 * s * twistDir;
				const z = p.z + oz;
				_dummy.position.set(x, y, z);
				_dummy.rotation.set(0, yaw, 0);
				_dummy.scale.set(w, 1, w);
				_dummy.updateMatrix();
				floors.setMatrixAt(fi++, _dummy.matrix);
				if (i % 2 === 0 && li < n) {
					_dummy.position.set(x, y + 2.2 * s, z);
					_dummy.scale.set(w + .6 * s, 1, w + .4 * s);
					_dummy.updateMatrix();
					lips.setMatrixAt(li++, _dummy.matrix);
				}
			}
		};
		stack(-8.2 * s, -1.2 * s, Math.PI / 5, 1);
		stack(8.4 * s, 2.8 * s, -Math.PI / 6, -1);
		floors.count = fi;
		lips.count = li;
		floors.instanceMatrix.needsUpdate = true;
		lips.instanceMatrix.needsUpdate = true;
		floors.castShadow = shadows;
		group.add(floors, lips);
		bag.push(floorGeo, lipGeo);
		const cap = new Mesh(new BoxGeometry(28 * s, 3.2 * s, 16 * s), paleGlass);
		cap.position.set(p.x, 118 * s, p.z + 1.2 * s);
		cap.rotation.y = Math.PI / 4;
		add(cap);
		const base = new Mesh(new BoxGeometry(24 * s, 4.8 * s, 20 * s), cream);
		base.position.set(p.x, 2.4 * s, p.z);
		add(base);
		glowAt(p.x, 110 * s, p.z, 13166847, 46 * s, 40 * s);
		towerHit(p.x, p.z, 13 * s, 15 * s, 13 * s);
	};
	const placeMidtown = (s) => {
		const md = parkTower(32.0806, 34.7926, 48);
		const navy = new MeshPhysicalMaterial({
			color: 1846332,
			roughness: .1,
			metalness: 0,
			envMapIntensity: 1.55,
			clearcoat: 1,
			clearcoatRoughness: .1
		});
		bag.push(navy);
		const hA = 108 * s;
		const hB = 94 * s;
		const a = new Mesh(new BoxGeometry(12.4 * s, hA, 14.6 * s), navy);
		a.position.set(md.x - 8.2 * s, hA * .5, md.z);
		add(a);
		const b = new Mesh(new BoxGeometry(12.4 * s, hB, 14.6 * s), navy);
		b.position.set(md.x + 8.2 * s, hB * .5, md.z);
		add(b);
		const bandGeo = new BoxGeometry(12.9 * s, .22 * s, 15.1 * s);
		const nBand = 18;
		const bands = new InstancedMesh(bandGeo, bandMat, 36);
		bands.frustumCulled = false;
		let bi = 0;
		for (const [ox, h] of [[-8.2 * s, hA], [8.2 * s, hB]]) for (let i = 0; i < nBand; i++) {
			const y = 6 * s + i * (h - 12 * s) / 17;
			_dummy.position.set(md.x + ox, y, md.z);
			_dummy.rotation.set(0, 0, 0);
			_dummy.scale.set(1, 1, 1);
			_dummy.updateMatrix();
			bands.setMatrixAt(bi++, _dummy.matrix);
		}
		bands.count = bi;
		bands.instanceMatrix.needsUpdate = true;
		group.add(bands);
		bag.push(bandGeo);
		const skyGeo = new BoxGeometry(18.6 * s, 3.2 * s, 7.2 * s);
		const skies = new InstancedMesh(skyGeo, paleGlass, 3);
		skies.frustumCulled = false;
		[
			26,
			54,
			82
		].forEach((y, i) => {
			_dummy.position.set(md.x, y * s, md.z);
			_dummy.rotation.set(0, 0, 0);
			_dummy.scale.set(1, 1, 1);
			_dummy.updateMatrix();
			skies.setMatrixAt(i, _dummy.matrix);
		});
		skies.instanceMatrix.needsUpdate = true;
		group.add(skies);
		bag.push(skyGeo);
		glowAt(md.x, 90 * s, md.z, 6719658, 40 * s, 36 * s);
		towerHit(md.x, md.z, 14 * s, 18 * s, 10 * s);
	};
	const placeElectra = (s) => {
		const el = parkTower(32.0699, 34.7918, 46);
		const teal = new MeshPhysicalMaterial({
			color: 4881042,
			roughness: .1,
			metalness: 0,
			envMapIntensity: 1.5,
			clearcoat: 1,
			clearcoatRoughness: .1
		});
		bag.push(teal);
		const h = 118 * s;
		const body = new Mesh(new BoxGeometry(14.2 * s, h, 14.2 * s), teal);
		body.position.set(el.x, h * .5, el.z);
		add(body);
		const slabYs = [];
		for (let y = 5 * s; y < h - 4 * s; y += 3.1 * s) slabYs.push(y);
		const slabGeo = new BoxGeometry(14.8 * s, .2 * s, 14.8 * s);
		const slabs = new InstancedMesh(slabGeo, bandMat, slabYs.length);
		slabs.frustumCulled = false;
		for (let i = 0; i < slabYs.length; i++) {
			_dummy.position.set(el.x, slabYs[i], el.z);
			_dummy.rotation.set(0, 0, 0);
			_dummy.scale.set(1, 1, 1);
			_dummy.updateMatrix();
			slabs.setMatrixAt(i, _dummy.matrix);
		}
		slabs.instanceMatrix.needsUpdate = true;
		slabs.castShadow = shadows;
		group.add(slabs);
		bag.push(slabGeo);
		const mullGeo = new BoxGeometry(.16 * s, h * .96, .16 * s);
		const mulls = new InstancedMesh(mullGeo, bandMat, 14);
		mulls.frustumCulled = false;
		let mi = 0;
		for (let i = 0; i < 7; i++) {
			const o = -5.8 * s + i * 1.93 * s;
			for (const z of [el.z + 7.15 * s, el.z - 7.15 * s]) {
				_dummy.position.set(el.x + o, h * .5, z);
				_dummy.rotation.set(0, 0, 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				mulls.setMatrixAt(mi++, _dummy.matrix);
			}
		}
		mulls.count = mi;
		mulls.instanceMatrix.needsUpdate = true;
		group.add(mulls);
		bag.push(mullGeo);
		const elCrown = new Mesh(new BoxGeometry(15.4 * s, 5.4 * s, 15.4 * s), bandMat);
		elCrown.position.set(el.x, h + 3.2 * s, el.z);
		add(elCrown);
		const elCrown2 = new Mesh(new BoxGeometry(10.6 * s, 4.6 * s, 10.6 * s), paleGlass);
		elCrown2.position.set(el.x, h + 8.2 * s, el.z);
		add(elCrown2);
		const elMast = new Mesh(new CylinderGeometry(.2 * s, .4 * s, 32 * s, 8), bandMat);
		elMast.position.set(el.x, h + 24 * s, el.z);
		add(elMast);
		glowAt(el.x, h + 8 * s, el.z, 8962264, 36 * s, 32 * s);
		towerHit(el.x, el.z, 9 * s);
	};
	const placeSarona = (s) => {
		const p = parkTower(32.0714, 34.7866, 44);
		const h = 178 * s;
		const glass = new MeshPhysicalMaterial({
			color: 14214380,
			roughness: .08,
			metalness: 0,
			envMapIntensity: 1.65,
			clearcoat: 1,
			clearcoatRoughness: .08
		});
		bag.push(glass);
		const body = new Mesh(new BoxGeometry(11.2 * s, h, 22.4 * s), glass);
		body.position.set(p.x, h * .5, p.z);
		body.rotation.y = .18;
		add(body);
		const finGeo = new BoxGeometry(.22 * s, h * .96, .22 * s);
		const fins = new InstancedMesh(finGeo, bandMat, 12);
		fins.frustumCulled = false;
		let fi = 0;
		for (let i = 0; i < 6; i++) {
			const z = -10.4 * s + i * 4.16 * s;
			for (const x of [-5.7 * s, 5.7 * s]) {
				_dummy.position.set(p.x + x, h * .5, p.z + z);
				_dummy.rotation.set(0, .18, 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				fins.setMatrixAt(fi++, _dummy.matrix);
			}
		}
		fins.count = fi;
		fins.instanceMatrix.needsUpdate = true;
		group.add(fins);
		bag.push(finGeo);
		const cap = new Mesh(new BoxGeometry(12.2 * s, 6.4 * s, 23.2 * s), paleGlass);
		cap.position.set(p.x, h + 2.8 * s, p.z);
		cap.rotation.y = .18;
		add(cap);
		glowAt(p.x, h + 4 * s, p.z, 15266554, 44 * s, 40 * s);
		towerHit(p.x, p.z, 12 * s, 8 * s, 14 * s, .18);
	};
	const placeHakirya = (s) => {
		const p = parkTower(32.0756, 34.7878, 40);
		const khaki = new MeshStandardMaterial({
			color: 12098158,
			roughness: .62,
			envMapIntensity: .45
		});
		bag.push(khaki);
		const h = 96 * s;
		const matcal = new Mesh(new BoxGeometry(14.4 * s, h, 18.6 * s), khaki);
		matcal.position.set(p.x, h * .5, p.z);
		add(matcal);
		const cap = new Mesh(new BoxGeometry(15.2 * s, 4.2 * s, 19.4 * s), cream);
		cap.position.set(p.x, h + 1.8 * s, p.z);
		add(cap);
		const hallGeo = new BoxGeometry(1, 1, 1);
		const halls = new InstancedMesh(hallGeo, cream, 6);
		halls.frustumCulled = false;
		[
			[
				22,
				6,
				8,
				16,
				8,
				10
			],
			[
				-20,
				5.2,
				12,
				14,
				6.4,
				12
			],
			[
				16,
				4.4,
				-16,
				18,
				5.2,
				9
			],
			[
				-14,
				7,
				-18,
				12,
				9.2,
				14
			],
			[
				28,
				3.8,
				-8,
				10,
				4.6,
				16
			],
			[
				-26,
				4.8,
				4,
				12,
				5.8,
				8
			]
		].forEach((h, i) => {
			_dummy.position.set(p.x + h[0] * s, h[1] * s, p.z + h[2] * s);
			_dummy.rotation.set(0, i * .12, 0);
			_dummy.scale.set(h[3] * s, h[4] * s * 2, h[5] * s);
			_dummy.updateMatrix();
			halls.setMatrixAt(i, _dummy.matrix);
		});
		halls.instanceMatrix.needsUpdate = true;
		group.add(halls);
		bag.push(hallGeo);
		glowAt(p.x, h + 4 * s, p.z, 13943968, 32 * s, 28 * s);
		towerHit(p.x, p.z, 16 * s, 22 * s, 20 * s);
	};
	const placeShalomMeir = (s) => {
		const p = parkTower(32.0639, 34.7704, 36);
		const h = 82 * s;
		const body = new Mesh(new BoxGeometry(16.4 * s, h, 10.6 * s), cream);
		body.position.set(p.x, h * .5, p.z);
		add(body);
		const muralMat = new MeshStandardMaterial({
			color: 1854072,
			roughness: .7,
			envMapIntensity: .4
		});
		bag.push(muralMat);
		const mural = new Mesh(new BoxGeometry(.22 * s, h * .58, 9.6 * s), muralMat);
		mural.position.set(p.x + 8.3 * s, h * .42, p.z);
		add(mural);
		const bandGeo = new BoxGeometry(16.9 * s, .22 * s, 11.1 * s);
		const n = 12;
		const bands = new InstancedMesh(bandGeo, bandMat, n);
		bands.frustumCulled = false;
		for (let i = 0; i < n; i++) {
			_dummy.position.set(p.x, 6 * s + i * (h - 12 * s) / 11, p.z);
			_dummy.rotation.set(0, 0, 0);
			_dummy.scale.set(1, 1, 1);
			_dummy.updateMatrix();
			bands.setMatrixAt(i, _dummy.matrix);
		}
		bands.instanceMatrix.needsUpdate = true;
		group.add(bands);
		bag.push(bandGeo);
		const mast = new Mesh(new CylinderGeometry(.2 * s, .34 * s, 22 * s, 6), bandMat);
		mast.position.set(p.x, h + 10 * s, p.z);
		add(mast);
		glowAt(p.x, h + 6 * s, p.z, 15920352, 28 * s, 24 * s);
		towerHit(p.x, p.z, 9 * s, 10 * s, 7 * s);
	};
	const placeTlvTowers = (s) => {
		placeCityGate(s);
		placeToHa(s);
		placeSarona(s);
		placeHakirya(s);
		placeShalomMeir(s);
		placeMidtown(s);
		placeElectra(s);
	};
	const placeNycSkyline = (ox, oz, s) => {
		const wtcH = 118 * s;
		const wtc = new Mesh(new BoxGeometry(14 * s, wtcH, 14 * s), paleGlass);
		wtc.position.set(ox, wtcH * .5, oz);
		add(wtc);
		const wtcTip = new Mesh(new CylinderGeometry(.35 * s, 1.8 * s, 28 * s, 6), bandMat);
		wtcTip.position.set(ox, wtcH + 12 * s, oz);
		add(wtcTip);
		const esH = 92 * s;
		const es = new Mesh(new BoxGeometry(16 * s, esH, 12 * s), darkGlass);
		es.position.set(ox + 32 * s, esH * .5, oz + 28 * s);
		add(es);
		const es2 = new Mesh(new BoxGeometry(10 * s, 22 * s, 8 * s), darkGlass);
		es2.position.set(ox + 32 * s, esH + 10 * s, oz + 28 * s);
		add(es2);
		const esMast = new Mesh(new CylinderGeometry(.22 * s, .4 * s, 22 * s, 6), bandMat);
		esMast.position.set(ox + 32 * s, esH + 32 * s, oz + 28 * s);
		add(esMast);
		const chr = new Mesh(new BoxGeometry(11 * s, 70 * s, 11 * s), paleGlass);
		chr.position.set(ox - 28 * s, 35 * s, oz + 18 * s);
		add(chr);
		const chrCrown = new Mesh(new CylinderGeometry(2.2 * s, 7.4 * s, 16 * s, 8), paleGlass);
		chrCrown.position.set(ox - 28 * s, 78 * s, oz + 18 * s);
		add(chrCrown);
		const flat = new Mesh(new CylinderGeometry(10 * s, 10 * s, 48 * s, 3), cream);
		flat.position.set(ox + 18 * s, 24 * s, oz - 36 * s);
		flat.rotation.y = .4;
		add(flat);
		glowAt(ox, wtcH + 8, oz, 13166847, 52 * s, 48 * s);
		glowAt(ox + 32 * s, esH + 12, oz + 28 * s, 16771248, 36 * s, 34 * s);
		hit(ox, oz, 10 * s);
		hit(ox + 32 * s, oz + 28 * s, 9 * s);
	};
	const placeGothicTower = (x, z, h) => {
		const body = new Mesh(new BoxGeometry(10, h, 8), stone);
		body.position.set(x, h * .5, z);
		add(body);
		const arch = new Mesh(new BoxGeometry(4.2, h * .42, 2.2), stone);
		arch.position.set(x, h * .38, z);
		add(arch);
		for (const sx of [-4.2, 4.2]) {
			const pin = new Mesh(new ConeGeometry(1.4, 8, 4), stone);
			pin.position.set(x + sx, h + 3.5, z);
			add(pin);
		}
		const top = new Mesh(new BoxGeometry(11, 3.2, 9), stone);
		top.position.set(x, h + .8, z);
		add(top);
		hit(x, z, 8);
	};
	return {
		group,
		def,
		bag,
		shadows,
		isNight,
		emitList,
		colliders,
		movers,
		ramps,
		streets,
		built,
		add,
		glowAt,
		hit,
		hitRoad,
		placeTunnel,
		stone,
		white,
		glass,
		copper,
		gold,
		cream,
		terracotta,
		wood,
		darkArch,
		merlonWall,
		minaret,
		ottomanGate,
		placeDome,
		cyan,
		darkGlass,
		paleGlass,
		bandMat,
		azSqGlass,
		gateGlass,
		placeAzrieli,
		placeCityGate,
		placeToHa,
		placeMidtown,
		placeElectra,
		placeSarona,
		placeHakirya,
		placeShalomMeir,
		placeTlvTowers,
		placeNycSkyline,
		placeGothicTower,
		_dummy,
		barkTexture,
		curtainTexture,
		foliageTexture,
		herodianTexture,
		samp,
		segsOf
	};
}
function buildHayarkon(context) {
	const { group, bag, built, add, glowAt, hit, placeTunnel, stone, white, cream, terracotta, wood, cyan, darkGlass, paleGlass, bandMat, _dummy } = context;
	const hi = tlv(32.0893, 34.7694);
	{
		const n = nearestIndex(built.samples, hi.x, hi.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			hi.x = s.x + s.rx * (built.width / 2 + 30);
			hi.z = s.z + s.rz * (built.width / 2 + 30);
		}
	}
	const hilton = new Mesh(new CylinderGeometry(20, 21, 34, 20, 1, false, .55, 2.05), white);
	hilton.position.set(hi.x, 17, hi.z);
	hilton.rotation.y = -.35;
	add(hilton);
	for (let i = 0; i < 11; i++) {
		const terrace = new Mesh(new CylinderGeometry(20.6, 21.4, .22, 20, 1, false, .55, 2.05), cream);
		terrace.position.set(hi.x, 3.2 + i * 2.9, hi.z);
		terrace.rotation.y = -.35;
		add(terrace);
	}
	const hiltonRoof = new Mesh(new CylinderGeometry(16, 20, 2.4, 20, 1, false, .55, 2.05), cream);
	hiltonRoof.position.set(hi.x, 35.2, hi.z);
	hiltonRoof.rotation.y = -.35;
	add(hiltonRoof);
	const winG = new PlaneGeometry(1.1, 1.4);
	bag.push(winG);
	const hiltonWins = new InstancedMesh(winG, darkGlass, 90);
	let hwi = 0;
	for (let f = 0; f < 10; f++) for (let c = 0; c < 9; c++) {
		const a = -.35 + .55 + c / 8 * 2.05;
		const wy = 4.4 + f * 2.9;
		_dummy.position.set(hi.x + Math.cos(a) * 20.4, wy, hi.z + Math.sin(a) * 20.4);
		_dummy.scale.set(1, 1, 1);
		_dummy.lookAt(hi.x + Math.cos(a) * 28, wy, hi.z + Math.sin(a) * 28);
		_dummy.updateMatrix();
		hiltonWins.setMatrixAt(hwi++, _dummy.matrix);
	}
	hiltonWins.instanceMatrix.needsUpdate = true;
	group.add(hiltonWins);
	const op = tlv(32.0768, 34.7662);
	{
		const n = nearestIndex(built.samples, op.x, op.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			op.x = s.x + s.rx * (built.width / 2 + 22);
			op.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const operaBase = new Mesh(new CylinderGeometry(11, 12.4, 6, 20), cream);
	operaBase.position.set(op.x, 3, op.z);
	add(operaBase);
	const opera = new Mesh(new CylinderGeometry(7.2, 8.4, 36, 22), cream);
	opera.position.set(op.x, 24, op.z);
	add(opera);
	for (let y = 8; y < 40; y += 3.1) {
		const win = new Mesh(new TorusGeometry(7.9, .18, 5, 22), darkGlass);
		win.rotation.x = Math.PI / 2;
		win.position.set(op.x, y, op.z);
		add(win);
	}
	for (let i = 0; i < 14; i++) {
		const a = i / 14 * Math.PI * 2;
		const col = new Mesh(new CylinderGeometry(.28, .32, 5.5, 6), white);
		col.position.set(op.x + Math.cos(a) * 8.6, 44, op.z + Math.sin(a) * 8.6);
		add(col);
	}
	const operaRing = new Mesh(new TorusGeometry(8.8, .42, 6, 20), white);
	operaRing.rotation.x = Math.PI / 2;
	operaRing.position.set(op.x, 47, op.z);
	add(operaRing);
	const crown = new Mesh(new CylinderGeometry(9.2, 5.2, 5.4, 18), white);
	crown.position.set(op.x, 50.2, op.z);
	add(crown);
	const danP = tlv(32.0814, 34.7672);
	{
		const n = nearestIndex(built.samples, danP.x, danP.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			danP.x = s.x + s.rx * (built.width / 2 + 20);
			danP.z = s.z + s.rz * (built.width / 2 + 20);
		}
	}
	const dan = new Mesh(new BoxGeometry(12, 28, 38), white);
	dan.position.set(danP.x, 14, danP.z);
	add(dan);
	for (let y = 4; y < 26; y += 2.8) {
		const bal = new Mesh(new BoxGeometry(13.2, .18, 39), cream);
		bal.position.set(danP.x, y, danP.z);
		add(bal);
	}
	for (const sx of [-6.08, 6.08]) {
		const pane = new Mesh(new BoxGeometry(.1, 22, 34), darkGlass);
		pane.position.set(danP.x + sx, 14, danP.z);
		add(pane);
	}
	const danRoof = new Mesh(new BoxGeometry(10, 2.2, 28), cream);
	danRoof.position.set(danP.x, 29.2, danP.z);
	add(danRoof);
	const carP = tlv(32.0866, 34.7678);
	{
		const n = nearestIndex(built.samples, carP.x, carP.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			carP.x = s.x + s.rx * (built.width / 2 + 20);
			carP.z = s.z + s.rz * (built.width / 2 + 20);
		}
	}
	for (let i = 0; i < 5; i++) {
		const w = 16 - i * 1.4;
		const slab = new Mesh(new BoxGeometry(w, 5.2, 22 - i * 1.1), i % 2 ? white : cream);
		slab.position.set(carP.x, 2.8 + i * 5.4, carP.z);
		add(slab);
	}
	const carHat = new Mesh(new BoxGeometry(8.4, 2.2, 12), cream);
	carHat.position.set(carP.x, 28.4, carP.z);
	add(carHat);
	hit(carP.x, carP.z, 9);
	glowAt(carP.x, 26, carP.z, 16777200, 22, 18);
	const poolP = tlv(32.0848, 34.768);
	const pool = new Mesh(new BoxGeometry(18, .25, 9), cyan);
	pool.position.set(poolP.x, .2, poolP.z);
	add(pool);
	const poolDeck = new Mesh(new BoxGeometry(22, .18, 13), stone);
	poolDeck.position.set(poolP.x, .08, poolP.z);
	add(poolDeck);
	const poolHall = new Mesh(new BoxGeometry(10, 4.2, 8), white);
	poolHall.position.set(poolP.x + 8, 2.1, poolP.z);
	add(poolHall);
	const mar = tlv(32.0938, 34.7688);
	{
		const n = nearestIndex(built.samples, mar.x, mar.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			mar.x = s.x + s.rx * (built.width / 2 + 22);
			mar.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const breakw = new Mesh(new BoxGeometry(4.2, 1.4, 52), stone);
	breakw.position.set(mar.x - 36, .5, mar.z);
	add(breakw);
	const breakw2 = new Mesh(new BoxGeometry(28, 1.2, 4), stone);
	breakw2.position.set(mar.x - 22, .45, mar.z - 26);
	add(breakw2);
	const pier = new Mesh(new BoxGeometry(6, .4, 42), wood);
	pier.position.set(mar.x - 18, .15, mar.z);
	add(pier);
	const marina = new Mesh(new BoxGeometry(22, 4.2, 12), cream);
	marina.position.set(mar.x, 2.1, mar.z);
	add(marina);
	const lightH = new Mesh(new CylinderGeometry(.7, 1.1, 14, 8), white);
	lightH.position.set(mar.x - 34, 7, mar.z - 22);
	add(lightH);
	const lightCap = new Mesh(new CylinderGeometry(1.4, 1.2, 1.6, 8), cream);
	lightCap.position.set(mar.x - 34, 14.6, mar.z - 22);
	add(lightCap);
	const lamp = new Mesh(new SphereGeometry(.7, 8, 6), new MeshBasicMaterial({ color: 16777136 }));
	lamp.position.set(mar.x - 34, 15.8, mar.z - 22);
	add(lamp);
	for (let i = 0; i < 8; i++) {
		const hull = new Mesh(new BoxGeometry(2.4, .75, 8.2), i % 2 ? white : cream);
		hull.position.set(mar.x - 30 - i % 2 * 7, .45, mar.z - 22 + i * 7);
		hull.rotation.y = .12;
		add(hull);
		const cabin = new Mesh(new BoxGeometry(1.6, 1.1, 3.2), white);
		cabin.position.set(mar.x - 30 - i % 2 * 7, 1.3, mar.z - 22 + i * 7);
		add(cabin);
		const mast = new Mesh(new CylinderGeometry(.06, .08, 9, 5), wood);
		mast.position.set(mar.x - 30 - i % 2 * 7, 5.2, mar.z - 22 + i * 7);
		add(mast);
	}
	const rd = tlv(32.1044, 34.7794);
	{
		const n = nearestIndex(built.samples, rd.x, rd.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			rd.x = s.x + s.rx * (built.width / 2 + 34);
			rd.z = s.z + s.rz * (built.width / 2 + 34);
		}
	}
	const brick = new MeshStandardMaterial({
		color: 9067074,
		roughness: .9
	});
	bag.push(brick);
	const rdHall = new Mesh(new BoxGeometry(36, 12, 20), brick);
	rdHall.position.set(rd.x, 6, rd.z);
	add(rdHall);
	const rdHall2 = new Mesh(new BoxGeometry(22, 8, 14), cream);
	rdHall2.position.set(rd.x + 8, 4, rd.z + 12);
	add(rdHall2);
	for (const ox of [-8, 8]) {
		const stack = new Mesh(new CylinderGeometry(2.15, 2.7, 52, 14), brick);
		stack.position.set(rd.x + ox, 32, rd.z);
		add(stack);
		for (let b = 0; b < 5; b++) {
			const ring = new Mesh(new CylinderGeometry(2.35, 2.5, 1.7, 14), white);
			ring.position.set(rd.x + ox, 14 + b * 8, rd.z);
			add(ring);
		}
		const lip = new Mesh(new CylinderGeometry(2.6, 2.2, 1.6, 14), brick);
		lip.position.set(rd.x + ox, 58.4, rd.z);
		add(lip);
	}
	hit(rd.x, rd.z, 12, 16, 10);
	glowAt(rd.x, 48, rd.z, 16764e3, 28, 22);
	const umbMat = new MeshStandardMaterial({
		color: 15920864,
		roughness: .7
	});
	const poleG = new CylinderGeometry(.05, .06, 2.4, 5);
	const capG = new ConeGeometry(1.6, .55, 8);
	for (let i = 0; i < 22; i++) {
		const u = tlv(32.062 + i * .0014, 34.7604);
		const pole = new Mesh(poleG, wood);
		pole.position.set(u.x, 1.2, u.z);
		add(pole);
		const cap = new Mesh(capG, i % 2 ? umbMat : terracotta);
		cap.position.set(u.x, 2.5, u.z);
		add(cap);
	}
	bag.push(umbMat, poleG, capG);
	const peach = new MeshStandardMaterial({
		color: 15255720,
		roughness: .62
	});
	const sandM = new MeshStandardMaterial({
		color: 14206096,
		roughness: .96
	});
	const promMat = new MeshStandardMaterial({
		color: 14144440,
		roughness: .88
	});
	const lawnMat = new MeshStandardMaterial({
		color: 5875780,
		roughness: .95
	});
	bag.push(peach, sandM, promMat, lawnMat);
	const sand = new Mesh(new BoxGeometry(48, .22, 920), sandM);
	sand.position.set(tlv(32.08, 34.763).x, .04, tlv(32.08, 34.763).z);
	sand.rotation.y = .28;
	add(sand);
	const prom = new Mesh(new BoxGeometry(9, .14, 820), promMat);
	prom.position.set(tlv(32.08, 34.7658).x, .1, tlv(32.08, 34.7658).z);
	prom.rotation.y = .28;
	add(prom);
	const clore = tlv(32.0618, 34.7612);
	const lawn = new Mesh(new BoxGeometry(70, .12, 110), lawnMat);
	lawn.position.set(clore.x, .06, clore.z);
	add(lawn);
	const carl = tlv(32.0865, 34.7688);
	{
		const n = nearestIndex(built.samples, carl.x, carl.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			carl.x = s.x + s.rx * (built.width / 2 + 22);
			carl.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const carlA = new Mesh(new BoxGeometry(11, 44, 11), white);
	carlA.position.set(carl.x, 22, carl.z);
	add(carlA);
	const carlB = new Mesh(new BoxGeometry(10, 36, 10), cream);
	carlB.position.set(carl.x + 14, 18, carl.z + 4);
	add(carlB);
	for (let y = 6; y < 40; y += 3.2) {
		const sl = new Mesh(new BoxGeometry(11.6, .16, 11.6), cream);
		sl.position.set(carl.x, y, carl.z);
		add(sl);
	}
	const skyb = new Mesh(new BoxGeometry(16, 2.2, 5), paleGlass);
	skyb.position.set(carl.x + 7, 24, carl.z + 2);
	add(skyb);
	const yam = tlv(32.0795, 34.7668);
	{
		const n = nearestIndex(built.samples, yam.x, yam.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			yam.x = s.x + s.rx * (built.width / 2 + 22);
			yam.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const yamT = new Mesh(new CylinderGeometry(4.6, 5.2, 46, 12), white);
	yamT.position.set(yam.x, 23, yam.z);
	add(yamT);
	const yamCap = new Mesh(new CylinderGeometry(5.4, 3.8, 4.2, 12), cream);
	yamCap.position.set(yam.x, 48, yam.z);
	add(yamCap);
	const dav = tlv(32.0638, 34.7648);
	{
		const n = nearestIndex(built.samples, dav.x, dav.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			dav.x = s.x + s.rx * (built.width / 2 + 24);
			dav.z = s.z + s.rz * (built.width / 2 + 24);
		}
	}
	const david = new Mesh(new BoxGeometry(36, 18, 16), cream);
	david.position.set(dav.x, 9, dav.z);
	add(david);
	const davidMid = new Mesh(new BoxGeometry(28, 12, 14), white);
	davidMid.position.set(dav.x, 21, dav.z);
	add(davidMid);
	const davidTop = new Mesh(new BoxGeometry(20, 8, 12), cream);
	davidTop.position.set(dav.x, 31, dav.z);
	add(davidTop);
	const sher = tlv(32.083, 34.7674);
	{
		const n = nearestIndex(built.samples, sher.x, sher.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			sher.x = s.x + s.rx * (built.width / 2 + 22);
			sher.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const sheraton = new Mesh(new BoxGeometry(16, 22, 10), peach);
	sheraton.position.set(sher.x, 11, sher.z);
	add(sheraton);
	for (let y = 4; y < 20; y += 2.6) {
		const shade = new Mesh(new BoxGeometry(17.2, .14, 11), cream);
		shade.position.set(sher.x, y, sher.z);
		add(shade);
	}
	const dol = tlv(32.0648, 34.7618);
	{
		const n = nearestIndex(built.samples, dol.x, dol.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			dol.x = s.x + s.rx * (built.width / 2 + 26);
			dol.z = s.z + s.rz * (built.width / 2 + 26);
		}
	}
	const dolRing = new Mesh(new TorusGeometry(12, 1.4, 8, 24), stone);
	dolRing.rotation.x = Math.PI / 2;
	dolRing.position.set(dol.x, .8, dol.z);
	add(dolRing);
	const dolInner = new Mesh(new CylinderGeometry(8, 9.5, 2.4, 16, 1, true), stone);
	dolInner.position.set(dol.x, 1.2, dol.z);
	add(dolInner);
	const smH = tlv(32.0639, 34.7688);
	{
		const n = nearestIndex(built.samples, smH.x, smH.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			smH.x = s.x + s.rx * (built.width / 2 + 24);
			smH.z = s.z + s.rz * (built.width / 2 + 24);
		}
	}
	const smHM = new Mesh(new BoxGeometry(16, 62, 10), cream);
	smHM.position.set(smH.x, 31, smH.z);
	add(smHM);
	const smMastH = new Mesh(new CylinderGeometry(.2, .32, 16, 6), bandMat);
	smMastH.position.set(smH.x, 70, smH.z);
	add(smMastH);
	glowAt(hi.x, 36, hi.z, 16769200, 38, 36);
	glowAt(op.x, 50, op.z, 16771264, 32, 32);
	const skipRoad = (x, z, r) => {
		if (nearestIndex(built.samples, x, z, 0).dist > built.width / 2 + 6) hit(x, z, r);
	};
	skipRoad(smH.x, smH.z, 8);
	skipRoad(hi.x, hi.z, 16);
	skipRoad(op.x, op.z, 10);
	skipRoad(danP.x, danP.z, 14);
	skipRoad(carl.x, carl.z, 10);
	skipRoad(carl.x + 14, carl.z + 4, 8);
	skipRoad(yam.x, yam.z, 6);
	skipRoad(dav.x, dav.z, 14);
	skipRoad(sher.x, sher.z, 8);
	skipRoad(dol.x, dol.z, 10);
	skipRoad(mar.x, mar.z, 10);
	const rdH = tlv(32.1044, 34.7776);
	{
		const n = nearestIndex(built.samples, rdH.x, rdH.z, 0);
		const s = built.samples[n.index];
		placeTunnel(s.x, s.z, Math.atan2(s.tx, s.tz), 82, built.width * .72, 8.8, s.y);
		if (n.dist < built.width / 2 + 12) {
			rdH.x = s.x + s.rx * (built.width / 2 + 26);
			rdH.z = s.z + s.rz * (built.width / 2 + 26);
		}
	}
	const chimH = new Mesh(new CylinderGeometry(3.8, 5.6, 92, 16), cream);
	chimH.position.set(rdH.x, 46, rdH.z);
	add(chimH);
	const chimGalH = new Mesh(new CylinderGeometry(5.2, 4.2, 2.8, 16), cream);
	chimGalH.position.set(rdH.x, 93, rdH.z);
	add(chimGalH);
	const chimTopH = new Mesh(new CylinderGeometry(4.2, 3.6, 3.4, 16), cream);
	chimTopH.position.set(rdH.x, 96, rdH.z);
	add(chimTopH);
	const redRing = new MeshStandardMaterial({
		color: 12860456,
		roughness: .52
	});
	bag.push(redRing);
	for (let i = 0; i < 16; i++) {
		const bandH = new Mesh(new CylinderGeometry(4.05, 4.2, 3.2, 14), i % 2 ? redRing : white);
		bandH.position.set(rdH.x, 22 + i * 4.4, rdH.z);
		add(bandH);
	}
	skipRoad(rdH.x, rdH.z, 5);
}
function buildOldjaffa(context) {
	const { bag, isNight, emitList, built, add, glowAt, hit, white, cream, terracotta, wood, darkArch } = context;
	const ochre = new MeshStandardMaterial({
		color: 12886128,
		roughness: .9,
		envMapIntensity: .22
	});
	const ochreDark = new MeshStandardMaterial({
		color: 10516552,
		roughness: .92
	});
	const lime = new MeshStandardMaterial({
		color: 13215092,
		roughness: .82
	});
	bag.push(ochre, ochreDark, lime);
	const ck = tlv(32.0556, 34.7558);
	{
		const n = nearestIndex(built.samples, ck.x, ck.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			ck.x = s.x + s.rx * (built.width / 2 + 22);
			ck.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const tower = new Mesh(new BoxGeometry(5.2, 32, 5.2), ochre);
	tower.position.set(ck.x, 17.2, ck.z);
	add(tower);
	for (let y = 6.2; y < 30; y += 4.6) {
		const band = new Mesh(new BoxGeometry(5.55, .36, 5.55), lime);
		band.position.set(ck.x, y, ck.z);
		add(band);
	}
	const base = new Mesh(new BoxGeometry(8.4, 4.2, 8.4), ochreDark);
	base.position.set(ck.x, 2.1, ck.z);
	add(base);
	const plaza = new Mesh(new CylinderGeometry(16, 16, .18, 20), ochreDark);
	plaza.position.set(ck.x - 6, .1, ck.z);
	add(plaza);
	const balcony = new Mesh(new BoxGeometry(5.8, .24, 5.8), lime);
	balcony.position.set(ck.x, 18.8, ck.z);
	add(balcony);
	for (let lvl = 0; lvl < 4; lvl++) for (const a of [
		0,
		Math.PI / 2,
		Math.PI,
		3 * Math.PI / 2
	]) {
		const arch = new Mesh(new CylinderGeometry(.85, .85, .32, 10, 1, false, 0, Math.PI), darkArch);
		arch.rotation.z = Math.PI / 2;
		arch.position.set(ck.x + Math.sin(a) * 2.45, 4.8 + lvl * 3.6, ck.z + Math.cos(a) * 2.45);
		arch.rotation.y = a;
		add(arch);
	}
	const clockTex = getJaffaClock();
	const faceMat = new MeshStandardMaterial({
		map: clockTex ?? void 0,
		color: clockTex ? 16777215 : 16051936,
		roughness: .45,
		emissive: 3351050,
		emissiveIntensity: isNight ? .55 : .08
	});
	emitList.push({
		mat: faceMat,
		night: .55,
		day: .08
	});
	bag.push(faceMat);
	for (let i = 0; i < 4; i++) {
		const a = i * Math.PI / 2;
		const face = new Mesh(new CircleGeometry(1.05, 22), faceMat);
		face.position.set(ck.x + Math.sin(a) * 2.66, 26.4, ck.z + Math.cos(a) * 2.66);
		face.lookAt(ck.x + Math.sin(a) * 8, 26.4, ck.z + Math.cos(a) * 8);
		add(face);
	}
	const cap = new Mesh(new ConeGeometry(3.6, 6.4, 4), ochreDark);
	cap.rotation.y = Math.PI / 4;
	cap.position.set(ck.x, 36.2, ck.z);
	add(cap);
	const finial = new Mesh(new CylinderGeometry(.07, .11, 2.8, 6), ochreDark);
	finial.position.set(ck.x, 40.2, ck.z);
	add(finial);
	hit(ck.x, ck.z, 5.5, 4.2, 4.2);
	for (let i = 0; i < 22; i++) {
		const a = i / 22 * Math.PI * 1.7 + .35;
		const hx = ck.x + Math.cos(a) * (22 + i % 4 * 5);
		const hz = ck.z + Math.sin(a) * (20 + i % 3 * 6);
		if (nearestIndex(built.samples, hx, hz, 0).dist < built.width / 2 + 10) continue;
		const h = 5.2 + i % 4 * 1.6;
		const house = new Mesh(new BoxGeometry(6.2 + i % 3, h, 5.4 + i % 2), i % 2 ? ochre : ochreDark);
		house.position.set(hx, h * .5, hz);
		add(house);
		const vault = new Mesh(new CylinderGeometry(2.4 + i % 2 * .4, 2.4 + i % 2 * .4, 6.4 + i % 3, 10, 1, false, 0, Math.PI), ochreDark);
		vault.rotation.z = Math.PI / 2;
		vault.position.set(hx, h + .9, hz);
		add(vault);
		const arch = new Mesh(new BoxGeometry(1.6, 2.2, .3), darkArch);
		arch.position.set(hx, 1.2, hz + 2.8);
		add(arch);
		if (i % 3 === 0) {
			const dome = new Mesh(new SphereGeometry(1.6, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), lime);
			dome.position.set(hx, h + 2.4, hz);
			add(dome);
		}
		hit(hx, hz, 3.4, 3.2, 2.8);
	}
	const mq = tlv(32.0564, 34.7568);
	{
		const n = nearestIndex(built.samples, mq.x, mq.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			mq.x = s.x + s.rx * (built.width / 2 + 26);
			mq.z = s.z + s.rz * (built.width / 2 + 26);
		}
	}
	const mosque = new Mesh(new BoxGeometry(16, 8, 14), ochre);
	mosque.position.set(mq.x, 4, mq.z);
	add(mosque);
	const mdome = new Mesh(new SphereGeometry(4.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
	mdome.position.set(mq.x, 8.2, mq.z);
	add(mdome);
	const minaret2 = new Mesh(new CylinderGeometry(1.15, 1.45, 22, 10), lime);
	minaret2.position.set(mq.x + 7, 11, mq.z - 4);
	add(minaret2);
	const mcap = new Mesh(new ConeGeometry(1.7, 2.8, 8), cream);
	mcap.position.set(mq.x + 7, 23.4, mq.z - 4);
	add(mcap);
	const pt = tlv(32.0524, 34.7492);
	const quay = new Mesh(new BoxGeometry(22, .7, 86), ochreDark);
	quay.position.set(pt.x, .18, pt.z);
	add(quay);
	for (const sh of [
		{
			lat: 32.0516,
			lon: 34.7494
		},
		{
			lat: 32.0522,
			lon: 34.7496
		},
		{
			lat: 32.0528,
			lon: 34.7498
		},
		{
			lat: 32.0534,
			lon: 34.75
		}
	]) {
		const p = tlv(sh.lat, sh.lon);
		{
			const n = nearestIndex(built.samples, p.x, p.z, 0);
			if (n.dist < built.width / 2 + 10) {
				const s = built.samples[n.index];
				p.x = s.x + s.rx * (built.width / 2 + 18);
				p.z = s.z + s.rz * (built.width / 2 + 18);
			}
		}
		const shed = new Mesh(new BoxGeometry(18, 6.4, 14), ochre);
		shed.position.set(p.x, 3.2, p.z);
		add(shed);
		for (let a = 0; a < 3; a++) {
			const door = new Mesh(new BoxGeometry(2.8, 3.6, .4), darkArch);
			door.position.set(p.x - 9, 1.9, p.z - 4 + a * 4);
			add(door);
		}
		const roof = new Mesh(new BoxGeometry(20, .4, 16), terracotta);
		roof.position.set(p.x, 6.6, p.z);
		add(roof);
		hit(p.x, p.z, 6);
	}
	const hullCols = [
		12860456,
		15262940,
		2779786,
		13934688
	];
	for (let i = 0; i < 9; i++) {
		const col = hullCols[i % hullCols.length];
		const hullMat = new MeshStandardMaterial({
			color: col,
			roughness: .55
		});
		bag.push(hullMat);
		const hull = new Mesh(new BoxGeometry(3.4, 1.6, 9.2), hullMat);
		hull.position.set(pt.x - 22 - i % 3 * 5, .7, pt.z - 30 + i * 8);
		hull.rotation.y = .12;
		add(hull);
		const cabin = new Mesh(new BoxGeometry(2.2, 1.4, 3.2), white);
		cabin.position.set(pt.x - 22 - i % 3 * 5, 2.1, pt.z - 30 + i * 8);
		add(cabin);
	}
	const pier = new Mesh(new BoxGeometry(4.2, .35, 22), wood);
	pier.position.set(pt.x - 18, .4, pt.z + 8);
	add(pier);
	{
		const lh = tlv(32.0533, 34.751);
		const nL = nearestIndex(built.samples, lh.x, lh.z, 0);
		if (nL.dist < built.width / 2 + 12) {
			const sL = built.samples[nL.index];
			lh.x = sL.x + sL.rx * (built.width / 2 + 26);
			lh.z = sL.z + sL.rz * (built.width / 2 + 26);
		}
		const stem = new Mesh(new CylinderGeometry(1.15, 1.55, 14, 10), lime);
		stem.position.set(lh.x, 7.2, lh.z);
		add(stem);
		const lantern = new Mesh(new CylinderGeometry(1.7, 1.5, 2.4, 10), cream);
		lantern.position.set(lh.x, 15.4, lh.z);
		add(lantern);
		const lamp = new Mesh(new SphereGeometry(.7, 10, 8), new MeshBasicMaterial({ color: 16773832 }));
		lamp.position.set(lh.x, 16.8, lh.z);
		add(lamp);
		glowAt(lh.x, 16.8, lh.z, 16777136, 22, 16);
		hit(lh.x, lh.z, 2.4);
	}
	const ch = tlv(32.0546, 34.7508);
	{
		const n = nearestIndex(built.samples, ch.x, ch.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			ch.x = s.x + s.rx * (built.width / 2 + 22);
			ch.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const nave = new Mesh(new BoxGeometry(14, 10, 22), cream);
	nave.position.set(ch.x, 8, ch.z);
	add(nave);
	const belfry = new Mesh(new BoxGeometry(6.2, 28, 6.2), cream);
	belfry.position.set(ch.x - 2, 16, ch.z - 8);
	add(belfry);
	const bclock = new Mesh(new CircleGeometry(1.05, 16), faceMat);
	bclock.position.set(ch.x - 2, 26, ch.z - 11.2);
	add(bclock);
	const spire = new Mesh(new ConeGeometry(4.2, 7.4, 4), cream);
	spire.rotation.y = Math.PI / 4;
	spire.position.set(ch.x - 2, 33.4, ch.z - 8);
	add(spire);
	const cross = new Mesh(new BoxGeometry(.18, 2.2, .18), white);
	cross.position.set(ch.x - 2, 38, ch.z - 8);
	add(cross);
	tlv(32.054, 34.7522);
	const oldHouses = [
		{
			lat: 32.0538,
			lon: 34.7532,
			w: 6.2,
			h: 5.4,
			d: 5.8,
			col: ochre
		},
		{
			lat: 32.054,
			lon: 34.7536,
			w: 5.6,
			h: 6.8,
			d: 5.2,
			col: ochreDark
		},
		{
			lat: 32.0544,
			lon: 34.7534,
			w: 7.4,
			h: 5.2,
			d: 6.4,
			col: lime
		},
		{
			lat: 32.0548,
			lon: 34.753,
			w: 5.8,
			h: 7.2,
			d: 5.4,
			col: ochre
		},
		{
			lat: 32.0546,
			lon: 34.754,
			w: 6.6,
			h: 6,
			d: 5.6,
			col: ochreDark
		},
		{
			lat: 32.0536,
			lon: 34.7538,
			w: 5.2,
			h: 5.8,
			d: 6.2,
			col: lime
		},
		{
			lat: 32.0534,
			lon: 34.7544,
			w: 6.8,
			h: 4.8,
			d: 5.4,
			col: ochre
		},
		{
			lat: 32.055,
			lon: 34.7538,
			w: 5.4,
			h: 6.4,
			d: 5.8,
			col: ochreDark
		}
	];
	for (const h of oldHouses) {
		const p = tlv(h.lat, h.lon);
		const nearH = nearestIndex(built.samples, p.x, p.z, 0);
		if (nearH.dist < built.width / 2 + 8) {
			const s = built.samples[nearH.index];
			p.x = s.x + s.rx * (built.width / 2 + 14);
			p.z = s.z + s.rz * (built.width / 2 + 14);
		}
		const house = new Mesh(new BoxGeometry(h.w, h.h, h.d), h.col);
		house.position.set(p.x, 1.6 + h.h * .5, p.z);
		add(house);
		const r = new Mesh(new BoxGeometry(h.w + .4, .28, h.d + .4), terracotta);
		r.position.set(p.x, 1.6 + h.h + .16, p.z);
		add(r);
		const door = new Mesh(new CylinderGeometry(.7, .7, .28, 10, 1, false, 0, Math.PI), darkArch);
		door.rotation.z = Math.PI / 2;
		door.position.set(p.x, 2.4, p.z + h.d * .51);
		add(door);
		hit(p.x, p.z, 4);
	}
	const awnCols = [
		10762792,
		12880440,
		6961698,
		12085296
	];
	for (let ilat = 0; ilat < 8; ilat++) for (let ilon = 0; ilon < 7; ilon++) {
		const lat = 32.0528 + ilat * 32e-5;
		const lon = 34.7514 + ilon * 38e-5;
		const p = tlv(lat, lon);
		if (nearestIndex(built.samples, p.x, p.z, 0).dist < built.width / 2 + 11) continue;
		const seed = ilat * 7 + ilon;
		const hh = 4.4 + seed % 5 * .85;
		const ww = 5.2 + seed % 3 * .7;
		const dd = 4.8 + seed % 2 * .8;
		const col = seed % 3 === 0 ? ochre : seed % 3 === 1 ? ochreDark : lime;
		const yHill = .4 + ilon * .35;
		const house = new Mesh(new BoxGeometry(ww, hh, dd), col);
		house.position.set(p.x, yHill + hh * .5, p.z);
		add(house);
		const roof = new Mesh(new BoxGeometry(ww + .5, .28, dd + .5), terracotta);
		roof.position.set(p.x, yHill + hh + .2, p.z);
		add(roof);
		const win = new Mesh(new BoxGeometry(1.1, 1.4, .12), darkArch);
		win.position.set(p.x, yHill + 2.2, p.z + dd * .51);
		add(win);
		if (seed % 4 === 0) {
			const awn = new Mesh(new BoxGeometry(2.4, .08, 1.6), new MeshStandardMaterial({
				color: awnCols[seed % 4],
				roughness: .9
			}));
			awn.position.set(p.x, yHill + 2.8, p.z + dd * .55);
			add(awn);
		}
		hit(p.x, p.z, 3.2);
	}
	const lightH = tlv(32.0533, 34.7502);
	const lightBase = new Mesh(new CylinderGeometry(1.7, 2.2, 11, 12), cream);
	lightBase.position.set(lightH.x, 5.6, lightH.z);
	add(lightBase);
	const gallery = new Mesh(new CylinderGeometry(2.3, 2.3, .35, 12), ochreDark);
	gallery.position.set(lightH.x, 11.3, lightH.z);
	add(gallery);
	const lightTop = new Mesh(new CylinderGeometry(1.15, 1.35, 2.8, 10), white);
	lightTop.position.set(lightH.x, 12.8, lightH.z);
	add(lightTop);
	const lantern = new Mesh(new SphereGeometry(1.05, 10, 8), new MeshBasicMaterial({ color: 16773828 }));
	lantern.position.set(lightH.x, 14.2, lightH.z);
	add(lantern);
	const lightCap = new Mesh(new ConeGeometry(1.4, 1.6, 8), ochreDark);
	lightCap.position.set(lightH.x, 15.6, lightH.z);
	add(lightCap);
	glowAt(lightH.x, 14.2, lightH.z, 16771232, 22, 18);
	const kdm = tlv(32.0542, 34.752);
	const well = new Mesh(new CylinderGeometry(2.4, 2.6, .6, 14), ochre);
	well.position.set(kdm.x, .4, kdm.z);
	add(well);
	const flea = tlv(32.0535, 34.7588);
	const cloth = [
		new MeshStandardMaterial({
			color: 10762792,
			roughness: .88
		}),
		new MeshStandardMaterial({
			color: 12884544,
			roughness: .88
		}),
		new MeshStandardMaterial({
			color: 3824248,
			roughness: .88
		})
	];
	bag.push(...cloth);
	for (let i = 0; i < 8; i++) {
		const pierA = new Mesh(new BoxGeometry(1.6, 5.4, 1.6), ochre);
		pierA.position.set(flea.x + i * 4.2, 2.7, flea.z);
		add(pierA);
		if (i < 7) {
			const lintel = new Mesh(new BoxGeometry(4.4, 1.1, 1.8), ochreDark);
			lintel.position.set(flea.x + i * 4.2 + 2.1, 5.6, flea.z);
			add(lintel);
			const shop = new Mesh(new BoxGeometry(3.2, 2.8, .3), darkArch);
			shop.position.set(flea.x + i * 4.2 + 2.1, 2.2, flea.z + .9);
			add(shop);
			const awn = new Mesh(new BoxGeometry(3.6, .1, 2.4), cloth[i % 3]);
			awn.position.set(flea.x + i * 4.2 + 2.1, 4.4, flea.z + 1.6);
			add(awn);
		}
	}
	const rock = tlv(32.0528, 34.7486);
	const andromeda = new Mesh(new DodecahedronGeometry(3.4, 0), ochreDark);
	andromeda.position.set(rock.x, .6, rock.z);
	add(andromeda);
	glowAt(ck.x, 26, ck.z, 16770736, 36, 28);
	glowAt(ch.x - 2, 30, ch.z - 8, 16771272, 28, 24);
	glowAt(pt.x, 6, pt.z, 16763e3, 24, 22);
	const skipJ = (x, z, r) => {
		if (nearestIndex(built.samples, x, z, 0).dist > built.width / 2 + 5) hit(x, z, r);
	};
	skipJ(ck.x, ck.z, 4.5);
	skipJ(ch.x, ch.z, 7);
	skipJ(mq.x, mq.z, 7);
	skipJ(pt.x, pt.z, 6);
	skipJ(lightH.x, lightH.z, 3);
}
function buildTelaviv(context) {
	const { bag, built, add, glowAt, hit, hitRoad, stone, white, glass, cream, terracotta, darkGlass, paleGlass, bandMat, azSqGlass, gateGlass, placeAzrieli, placeCityGate, placeToHa } = context;
	const offTlv = (p, extra = 26) => {
		const n = nearestIndex(built.samples, p.x, p.z, 0);
		if (n.dist < built.width / 2 + extra) {
			const s = built.samples[n.index];
			p.x = s.x + s.rx * (built.width / 2 + extra);
			p.z = s.z + s.rz * (built.width / 2 + extra);
		}
		return p;
	};
	const az = tlv(32.0744, 34.7938);
	placeAzrieli(1.22);
	placeToHa(1.05);
	placeCityGate(1);
	const saT = offTlv(tlv(32.0714, 34.7866), 28);
	const saronaTw = new Mesh(new BoxGeometry(11, 92, 11), glass);
	saronaTw.position.set(saT.x, 46, saT.z);
	add(saronaTw);
	const saCap = new Mesh(new BoxGeometry(8.4, 16, 8.4), paleGlass);
	saCap.position.set(saT.x, 100, saT.z);
	add(saCap);
	tlv(32.071, 34.7858);
	const houseSpec = [
		{
			lat: 32.0706,
			lon: 34.7848,
			w: 6.8,
			d: 8.2,
			h: 5.8,
			col: cream,
			roof: terracotta
		},
		{
			lat: 32.071,
			lon: 34.7852,
			w: 5.6,
			d: 7.4,
			h: 4.8,
			col: white,
			roof: terracotta
		},
		{
			lat: 32.0714,
			lon: 34.7846,
			w: 7.2,
			d: 6.6,
			h: 6.4,
			col: cream,
			roof: terracotta
		},
		{
			lat: 32.0708,
			lon: 34.7844,
			w: 6.2,
			d: 7.8,
			h: 5.2,
			col: white,
			roof: terracotta
		},
		{
			lat: 32.0712,
			lon: 34.7842,
			w: 5.4,
			d: 6.8,
			h: 4.6,
			col: cream,
			roof: terracotta
		},
		{
			lat: 32.0716,
			lon: 34.785,
			w: 8.4,
			d: 7.2,
			h: 7.2,
			col: white,
			roof: terracotta
		}
	];
	for (const h of houseSpec) {
		const p = offTlv(tlv(h.lat, h.lon), 22);
		const house = new Mesh(new BoxGeometry(h.w, h.h, h.d), h.col);
		house.position.set(p.x, h.h * .5, p.z);
		add(house);
		const r = new Mesh(new ConeGeometry(Math.max(h.w, h.d) * .58, 2.4, 4), h.roof);
		r.rotation.y = Math.PI / 4;
		r.position.set(p.x, h.h + 1.2, p.z);
		add(r);
		hit(p.x, p.z, 4);
	}
	const saHall = offTlv(tlv(32.0712, 34.7844), 22);
	const hall = new Mesh(new BoxGeometry(10, 8.4, 16), cream);
	hall.position.set(saHall.x, 4.2, saHall.z);
	add(hall);
	const hallRoof = new Mesh(new BoxGeometry(11, .5, 17), terracotta);
	hallRoof.position.set(saHall.x, 8.6, saHall.z);
	add(hallRoof);
	hit(saHall.x, saHall.z, 6);
	const mkt = offTlv(tlv(32.0704, 34.7838), 22);
	const mktHall = new Mesh(new BoxGeometry(22, 6.2, 9), paleGlass);
	mktHall.position.set(mkt.x, 3.1, mkt.z);
	add(mktHall);
	const mktFrame = new Mesh(new BoxGeometry(23.2, .35, 10.2), bandMat);
	mktFrame.position.set(mkt.x, 6.4, mkt.z);
	add(mktFrame);
	for (const ox of [
		-8,
		0,
		8
	]) {
		const rib = new Mesh(new BoxGeometry(.35, 6.4, 9.4), bandMat);
		rib.position.set(mkt.x + ox, 3.2, mkt.z);
		add(rib);
	}
	hit(mkt.x, mkt.z, 8);
	const ky = offTlv(tlv(32.0754, 34.7874), 30);
	const kirya = new Mesh(new BoxGeometry(16, 42, 12), cream);
	kirya.position.set(ky.x, 21, ky.z);
	add(kirya);
	const kirHat = new Mesh(new BoxGeometry(17.2, 4.4, 13), bandMat);
	kirHat.position.set(ky.x, 44.2, ky.z);
	add(kirHat);
	const el = offTlv(tlv(32.0804, 34.7942), 32);
	const electra = new Mesh(new BoxGeometry(13.2, 88, 13.2), azSqGlass);
	electra.position.set(el.x, 44, el.z);
	add(electra);
	const elMast = new Mesh(new CylinderGeometry(.22, .4, 24, 8), bandMat);
	elMast.position.set(el.x, 100, el.z);
	add(elMast);
	const md = offTlv(tlv(32.0798, 34.7934), 32);
	const midA = new Mesh(new BoxGeometry(11, 76, 13), gateGlass);
	midA.position.set(md.x - 8, 38, md.z);
	add(midA);
	const midB = new Mesh(new BoxGeometry(11, 68, 13), gateGlass);
	midB.position.set(md.x + 8, 34, md.z);
	add(midB);
	const sp = offTlv(tlv(32.0758, 34.7946), 30);
	const spiral = new Mesh(new CylinderGeometry(7.2, 9.4, 72, 12), glass);
	spiral.position.set(sp.x, 36, sp.z);
	add(spiral);
	const hb = offTlv(tlv(32.0728, 34.7794), 28);
	const hbPlaza = new Mesh(new CylinderGeometry(28, 28, .16, 32), stone);
	hbPlaza.position.set(hb.x, .08, hb.z);
	add(hbPlaza);
	const hbRing = new Mesh(new TorusGeometry(20, .55, 6, 28), cream);
	hbRing.rotation.x = Math.PI / 2;
	hbRing.position.set(hb.x, .22, hb.z);
	add(hbRing);
	const habima = new Mesh(new BoxGeometry(22, 14, 18), white);
	habima.position.set(hb.x, 7, hb.z);
	add(habima);
	const hbUp = new Mesh(new BoxGeometry(14, 12, 14), cream);
	hbUp.position.set(hb.x + 7, 19, hb.z - 3);
	hbUp.rotation.y = .22;
	add(hbUp);
	const hbUp2 = new Mesh(new BoxGeometry(10, 8.4, 10), white);
	hbUp2.position.set(hb.x - 6, 18, hb.z + 4);
	add(hbUp2);
	const hbGarden = new Mesh(new BoxGeometry(12, .4, 10), new MeshStandardMaterial({
		color: 2779688,
		roughness: .9
	}));
	hbGarden.position.set(hb.x + 7, 25.2, hb.z - 3);
	add(hbGarden);
	const vineMat = new MeshStandardMaterial({
		color: 3178290,
		roughness: .92
	});
	bag.push(vineMat);
	for (const gx of [-9, 9]) {
		const vine = new Mesh(new BoxGeometry(.6, 14, 8), vineMat);
		vine.position.set(hb.x + gx, 9, hb.z);
		add(vine);
	}
	const hbStep = new Mesh(new BoxGeometry(28, 1.2, 10), stone);
	hbStep.position.set(hb.x, .6, hb.z + 12);
	add(hbStep);
	hit(hb.x, hb.z, 14);
	const ih = offTlv(tlv(32.0629, 34.7716), 24);
	const hallBody = new Mesh(new BoxGeometry(13.4, 8.2, 10.2), cream);
	hallBody.position.set(ih.x, 4.1, ih.z);
	add(hallBody);
	const hallBalc = new Mesh(new BoxGeometry(10.4, .22, 2.4), white);
	hallBalc.position.set(ih.x, 5.4, ih.z + 5.6);
	add(hallBalc);
	const hallRail = new Mesh(new BoxGeometry(10.4, .7, .08), white);
	hallRail.position.set(ih.x, 5.85, ih.z + 6.7);
	add(hallRail);
	const pole = new Mesh(new CylinderGeometry(.06, .08, 6.2, 6), bandMat);
	pole.position.set(ih.x + 5.4, 8.8, ih.z + 4.2);
	add(pole);
	const flag = new Mesh(new PlaneGeometry(2.6, 1.5), new MeshBasicMaterial({
		map: getIsraelFlag() ?? void 0,
		color: getIsraelFlag() ? 16777215 : 14520,
		side: 2
	}));
	flag.position.set(ih.x + 6.7, 11.2, ih.z + 4.2);
	add(flag);
	hit(ih.x, ih.z, 7);
	const ds = offTlv(tlv(32.0732, 34.7888), 28);
	const discount = new Mesh(new BoxGeometry(14, 56, 10), darkGlass);
	discount.position.set(ds.x, 28, ds.z);
	add(discount);
	const discCut = new Mesh(new BoxGeometry(8, 20, 10), paleGlass);
	discCut.position.set(ds.x + 4, 48, ds.z);
	add(discCut);
	hitRoad(ds.x, ds.z, 7);
	glowAt(az.x, 110, az.z, 8308968, 70, 60);
	hitRoad(az.x + 17.08, az.z, 16, 22, 14);
	hitRoad(saT.x, saT.z, 8);
	hitRoad(ky.x, ky.z, 10);
	hitRoad(el.x, el.z, 8);
	const dz = offTlv(tlv(32.0753, 34.7748), 28);
	const dzPodium = new Mesh(new CylinderGeometry(18, 20, 8, 24), cream);
	dzPodium.position.set(dz.x, 4, dz.z);
	add(dzPodium);
	const dzA = new Mesh(new CylinderGeometry(7.2, 7.8, 36, 16), white);
	dzA.position.set(dz.x - 10, 26, dz.z);
	add(dzA);
	const dzB = new Mesh(new CylinderGeometry(6.6, 7.2, 30, 16), cream);
	dzB.position.set(dz.x + 11, 23, dz.z + 4);
	add(dzB);
	const dzRamp = new Mesh(new TorusGeometry(14, 1.1, 6, 20, Math.PI * 1.4), stone);
	dzRamp.rotation.x = Math.PI / 2;
	dzRamp.position.set(dz.x, 2.4, dz.z);
	add(dzRamp);
	hitRoad(dz.x, dz.z, 16);
	const fib = offTlv(tlv(32.063, 34.7795), 28);
	const fibM = new Mesh(new CylinderGeometry(8.4, 9.2, 78, 3), darkGlass);
	fibM.position.set(fib.x, 39, fib.z);
	fibM.rotation.y = .4;
	add(fibM);
	const fibCap = new Mesh(new CylinderGeometry(3.2, 8.2, 10, 3), paleGlass);
	fibCap.position.set(fib.x, 83, fib.z);
	fibCap.rotation.y = .4;
	add(fibCap);
	hitRoad(fib.x, fib.z, 8);
	const yooA = offTlv(tlv(32.0854, 34.7966), 30);
	const yooB = offTlv(tlv(32.0858, 34.7972), 30);
	const y1 = new Mesh(new BoxGeometry(11, 82, 11), paleGlass);
	y1.position.set(yooA.x, 41, yooA.z);
	add(y1);
	const y2 = new Mesh(new BoxGeometry(11, 74, 11), glass);
	y2.position.set(yooB.x, 37, yooB.z);
	add(y2);
	hitRoad(yooA.x, yooA.z, 7);
	hitRoad(yooB.x, yooB.z, 7);
	const sm = offTlv(tlv(32.0639, 34.7704), 26);
	const smM = new Mesh(new BoxGeometry(16, 62, 10), cream);
	smM.position.set(sm.x, 31, sm.z);
	add(smM);
	const smMast = new Mesh(new CylinderGeometry(.2, .32, 16, 6), bandMat);
	smMast.position.set(sm.x, 70, sm.z);
	add(smMast);
	hitRoad(sm.x, sm.z, 8);
}
function buildNamal(context) {
	const { bag, built, add, glowAt, hit, placeTunnel, white, glass, cream, terracotta, wood, darkGlass } = context;
	const hangarMat = new MeshStandardMaterial({
		color: 14207144,
		roughness: .74,
		metalness: .08,
		envMapIntensity: .4
	});
	const rust = new MeshStandardMaterial({
		color: 11029042,
		roughness: .62,
		metalness: .35,
		envMapIntensity: .55
	});
	bag.push(hangarMat, rust);
	const hp = tlv(32.0968, 34.7735);
	for (const hg of [
		{
			lat: 32.0958,
			lon: 34.7712
		},
		{
			lat: 32.0964,
			lon: 34.7713
		},
		{
			lat: 32.097,
			lon: 34.7714
		},
		{
			lat: 32.0976,
			lon: 34.7715
		},
		{
			lat: 32.0982,
			lon: 34.7716
		}
	]) {
		const p = tlv(hg.lat, hg.lon);
		{
			const n = nearestIndex(built.samples, p.x, p.z, 0);
			if (n.dist < built.width / 2 + 16) {
				const s = built.samples[n.index];
				p.x = s.x + s.rx * (built.width / 2 + 36);
				p.z = s.z + s.rz * (built.width / 2 + 36);
			}
		}
		const hangar = new Mesh(new BoxGeometry(36, 7.2, 16), hangarMat);
		hangar.position.set(p.x, 3.6, p.z);
		add(hangar);
		const barrel = new Mesh(new CylinderGeometry(8.2, 8.2, 36, 12, 1, false, 0, Math.PI), hangarMat);
		barrel.rotation.z = Math.PI / 2;
		barrel.position.set(p.x, 7.2, p.z);
		add(barrel);
	}
	const crane = new Mesh(new BoxGeometry(1.4, 22, 1.4), rust);
	crane.position.set(hp.x - 22, 11, hp.z + 30);
	add(crane);
	const jib = new Mesh(new BoxGeometry(28, .7, .7), rust);
	jib.position.set(hp.x - 10, 22, hp.z + 30);
	add(jib);
	const hook = new Mesh(new BoxGeometry(.25, 8, .25), rust);
	hook.position.set(hp.x + 2, 18, hp.z + 30);
	add(hook);
	const rd = tlv(32.1035, 34.7788);
	const rdNear = nearestIndex(built.samples, rd.x, rd.z, 0);
	const rs = built.samples[rdNear.index];
	const rdYaw = Math.atan2(rs.tx, rs.tz);
	const ochre = new MeshStandardMaterial({
		color: 13213808,
		roughness: .8,
		envMapIntensity: .38
	});
	const ochreDark = new MeshStandardMaterial({
		color: 11569240,
		roughness: .82
	});
	const conc = new MeshStandardMaterial({
		color: 12104876,
		roughness: .68,
		metalness: .14
	});
	const redBand = new MeshStandardMaterial({
		color: 12858408,
		roughness: .5
	});
	const whiteBand = new MeshStandardMaterial({
		color: 15262940,
		roughness: .48
	});
	bag.push(ochre, ochreDark, conc, redBand, whiteBand);
	placeTunnel(rs.x, rs.z, rdYaw, 86, built.width / 2 + .6, 8.8, rs.y);
	const rx = Math.cos(rdYaw);
	const rz = -Math.sin(rdYaw);
	const fx = Math.sin(rdYaw);
	const fz = Math.cos(rdYaw);
	const plantX = rs.x + rx * (built.width / 2 + 48);
	const plantZ = rs.z + rz * (built.width / 2 + 48);
	const hall = new Mesh(new BoxGeometry(34, 11, 42), ochre);
	hall.position.set(plantX, rs.y + 5.5, plantZ);
	hall.rotation.y = rdYaw;
	add(hall);
	for (const lr of [-1, 1]) {
		const clad = new Mesh(new BoxGeometry(1.2, 8.2, 58), ochre);
		clad.position.set(plantX + rx * 17.4 * lr, rs.y + 4.1, plantZ + rz * 17.4 * lr);
		clad.rotation.y = rdYaw;
		add(clad);
	}
	for (const side of [-1, 1]) {
		const ex2 = rs.x + fx * 32 * side;
		const ez = rs.z + fz * 32 * side;
		for (const lr of [-1, 1]) {
			const pier = new Mesh(new BoxGeometry(5.2, 8.6, 2.6), ochreDark);
			pier.position.set(ex2 + rx * 18.6 * lr, 4.3, ez + rz * 18.6 * lr);
			pier.rotation.y = rdYaw;
			add(pier);
		}
		const lintel = new Mesh(new BoxGeometry(38, 2.6, 2.8), ochre);
		lintel.position.set(ex2, 8.7, ez);
		lintel.rotation.y = rdYaw;
		add(lintel);
		const key = new Mesh(new BoxGeometry(8, 1.4, 3.2), ochreDark);
		key.position.set(ex2, 10.4, ez);
		key.rotation.y = rdYaw;
		add(key);
	}
	for (const side of [-1, 1]) for (let c = 0; c < 8; c++) {
		const win = new Mesh(new BoxGeometry(2.2, 3.4, .35), darkGlass);
		win.position.set(plantX + rx * side * 17.2 + fx * (c * 4.4 - 14), rs.y + 8.2, plantZ + rz * side * 17.2 + fz * (c * 4.4 - 14));
		win.rotation.y = rdYaw;
		add(win);
	}
	const tower = new Mesh(new BoxGeometry(12, 20, 14), ochreDark);
	tower.position.set(plantX - rx * 18, rs.y + 10.2, plantZ - rz * 18);
	tower.rotation.y = rdYaw;
	add(tower);
	const wingL = new Mesh(new BoxGeometry(14, 9, 16), ochre);
	wingL.position.set(plantX - rx * 20, rs.y + 4.6, plantZ - rz * 20);
	wingL.rotation.y = rdYaw;
	add(wingL);
	const wingR = new Mesh(new BoxGeometry(14, 9, 16), ochre);
	wingR.position.set(plantX + rx * 20, rs.y + 4.6, plantZ + rz * 20);
	wingR.rotation.y = rdYaw;
	add(wingR);
	const cornice = new Mesh(new BoxGeometry(36, .7, 44), cream);
	cornice.position.set(plantX, rs.y + 11.1, plantZ);
	cornice.rotation.y = rdYaw;
	add(cornice);
	const chimX = plantX + rx * 26;
	const chimZ = plantZ + rz * 26;
	const chim = new Mesh(new CylinderGeometry(3.8, 5.6, 92, 16), conc);
	chim.position.set(chimX, rs.y + 52.4, chimZ);
	add(chim);
	const chimGal = new Mesh(new CylinderGeometry(5.2, 4.2, 2.8, 16), conc);
	chimGal.position.set(chimX, rs.y + 99.2, chimZ);
	add(chimGal);
	const chimTop = new Mesh(new CylinderGeometry(4.2, 3.6, 3.6, 16), conc);
	chimTop.position.set(chimX, rs.y + 102.2, chimZ);
	add(chimTop);
	for (let i = 0; i < 16; i++) {
		const band = new Mesh(new CylinderGeometry(4.05, 4.2, 3.2, 14), i % 2 ? redBand : whiteBand);
		band.position.set(chimX, rs.y + 28 + i * 4.4, chimZ);
		add(band);
	}
	const chim2X = plantX + rx * 36;
	const chim2Z = plantZ + rz * 36;
	const chim2 = new Mesh(new CylinderGeometry(2.8, 3.8, 62, 12), conc);
	chim2.position.set(chim2X, rs.y + 37.4, chim2Z);
	add(chim2);
	for (let i = 0; i < 12; i++) {
		const band2 = new Mesh(new CylinderGeometry(3, 3.1, 2.6, 12), i % 2 ? redBand : whiteBand);
		band2.position.set(chim2X, rs.y + 18 + i * 3.4, chim2Z);
		add(band2);
	}
	const beach = tlv(32.102, 34.774);
	const sand = new Mesh(new PlaneGeometry(90, 220), new MeshStandardMaterial({
		color: 15259572,
		roughness: 1
	}));
	sand.rotation.x = -Math.PI / 2;
	sand.position.set(beach.x, .02, beach.z);
	add(sand);
	const umbMat = new MeshStandardMaterial({
		color: 16052196,
		roughness: .7
	});
	bag.push(umbMat);
	for (let i = 0; i < 18; i++) {
		const ux = beach.x - 8 + i % 3 * 7;
		const uz = beach.z - 70 + Math.floor(i / 3) * 22;
		const pole = new Mesh(new CylinderGeometry(.06, .07, 2.5, 5), wood);
		pole.position.set(ux, 1.25, uz);
		add(pole);
		const cap = new Mesh(new ConeGeometry(1.7, .5, 8), i % 2 ? umbMat : terracotta);
		cap.position.set(ux, 2.55, uz);
		add(cap);
	}
	const ex = tlv(32.104, 34.79);
	const expo = new Mesh(new CylinderGeometry(16, 16, 6, 24), white);
	expo.position.set(ex.x, 3, ex.z);
	add(expo);
	const expoRoof = new Mesh(new SphereGeometry(16, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), glass);
	expoRoof.position.set(ex.x, 6, ex.z);
	add(expoRoof);
	glowAt(chimX, rs.y + 98, chimZ, 16724016, 48, 40);
	glowAt(hp.x, 10, hp.z, 16760944, 24, 22);
	hit(rs.x - rx * 30, rs.z - rz * 30, 8);
	hit(rs.x + rx * 30, rs.z + rz * 30, 8);
	hit(chimX, chimZ, 5);
	hit(chim2X, chim2Z, 4);
	hit(plantX, plantZ, 16, 18, 22, rdYaw);
	hit(ex.x, ex.z, 14);
	hit(hp.x, hp.z + 40, 12);
}
function buildJerusalem(context) {
	const { def, bag, built, add, glowAt, hit, stone, white, cream, terracotta, merlonWall, minaret, ottomanGate, placeDome, herodianTexture } = context;
	const offJer = (p, extra = 24) => {
		const n = nearestIndex(built.samples, p.x, p.z, 0);
		if (n.dist < built.width / 2 + extra) {
			const s = built.samples[n.index];
			p.x = s.x + s.rx * (built.width / 2 + extra);
			p.z = s.z + s.rz * (built.width / 2 + extra);
		}
		return p;
	};
	const jg = offJer(jer(31.7764, 35.2276), 28);
	const td = offJer(jer(31.7762, 35.2284), 36);
	const dm = offJer(jer(31.7788, 35.2364), 42);
	const kd = offJer(jer(31.7745, 35.2225), 26);
	const my = offJer(jer(31.7848, 35.2114), 22);
	const kt = offJer(jer(31.7784, 35.2346), 38);
	const mill = offJer(jer(31.7715, 35.2247), 26);
	const olives = offJer(jer(31.7848, 35.2462), 32);
	merlonWall(jg.x + 38, jg.z + 62, 54, .2, 13);
	merlonWall(jg.x + 62, jg.z + 42, 48, 1.1, 12);
	const gi = Math.max(0, Math.min(built.samples.length - 1, Math.floor(built.samples.length * .46)));
	const gs = built.samples[gi];
	const gOff = built.width / 2 + 44;
	ottomanGate(gs.x + gs.rx * gOff, gs.z + gs.rz * gOff, Math.atan2(gs.tx, gs.tz));
	const citadel = new Mesh(new BoxGeometry(22, 13, 22), stone);
	citadel.position.set(td.x + 28, 7.5, td.z + 36);
	add(citadel);
	for (const [dx, dz] of [
		[-9, -9],
		[9, -9],
		[-9, 9],
		[9, 9]
	]) {
		const t = new Mesh(new CylinderGeometry(3.4, 4, 17, 10), stone);
		t.position.set(td.x + 28 + dx, 10, td.z + 36 + dz);
		add(t);
		const tcap = new Mesh(new CylinderGeometry(4.3, 3.7, 1.5, 10), cream);
		tcap.position.set(td.x + 28 + dx, 19, td.z + 36 + dz);
		add(tcap);
	}
	minaret(td.x + 32, td.z + 33, 32);
	placeDome(dm.x, dm.z);
	const aq = offJer(jer(31.7784, 35.236), 34);
	const aqsa = new Mesh(new BoxGeometry(28, 8, 16), stone);
	aqsa.position.set(aq.x, 4.2, aq.z);
	add(aqsa);
	const aqDome = new Mesh(new SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
	aqDome.position.set(aq.x, 10.4, aq.z);
	add(aqDome);
	const sepul = offJer(jer(31.7784, 35.2296), 26);
	const sep = new Mesh(new BoxGeometry(18, 11, 16), stone);
	sep.position.set(sepul.x, 5.6, sepul.z);
	add(sep);
	const sepDome = new Mesh(new SphereGeometry(6.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), cream);
	sepDome.position.set(sepul.x, 13.2, sepul.z);
	add(sepDome);
	const hurva = offJer(jer(31.7772, 35.2316), 24);
	const hv = new Mesh(new CylinderGeometry(6.2, 6.6, 10, 12), stone);
	hv.position.set(hurva.x, 5.2, hurva.z);
	add(hv);
	const hvDome = new Mesh(new SphereGeometry(6.8, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
	hvDome.position.set(hurva.x, 11.4, hurva.z);
	add(hvDome);
	const ymcaP = offJer(jer(31.7753, 35.222), 22);
	const ymca = new Mesh(new BoxGeometry(18, 14, 12), stone);
	ymca.position.set(ymcaP.x, 7.2, ymcaP.z);
	add(ymca);
	const ymcaTw = new Mesh(new BoxGeometry(5.2, 28, 5.2), stone);
	ymcaTw.position.set(ymcaP.x, 18, ymcaP.z);
	add(ymcaTw);
	const ymcaCap = new Mesh(new ConeGeometry(3.8, 6, 4), cream);
	ymcaCap.rotation.y = Math.PI / 4;
	ymcaCap.position.set(ymcaP.x, 35, ymcaP.z);
	add(ymcaCap);
	hit(aq.x, aq.z, 10, 14, 8);
	hit(sepul.x, sepul.z, 9, 9, 8);
	hit(hurva.x, hurva.z, 7, 6.4, 6.4);
	hit(ymcaP.x, ymcaP.z, 8, 9, 6);
	const kn = offJer(jer(31.7766, 35.2054), 28);
	const knesset = new Mesh(new BoxGeometry(36, 8.4, 22), stone);
	knesset.position.set(kn.x, 5.2, kn.z);
	add(knesset);
	const knRoof = new Mesh(new BoxGeometry(38, .7, 24), cream);
	knRoof.position.set(kn.x, 9.6, kn.z);
	add(knRoof);
	for (const sx of [
		-14,
		-7,
		0,
		7,
		14
	]) {
		const col = new Mesh(new BoxGeometry(1.1, 7.2, 1.1), cream);
		col.position.set(kn.x + sx, 4.6, kn.z + 12);
		add(col);
	}
	hit(kn.x, kn.z, 12);
	const hotel = new Mesh(new BoxGeometry(28, 17, 14), stone);
	hotel.position.set(kd.x - 28, 10, kd.z - 22);
	add(hotel);
	const roof = new Mesh(new BoxGeometry(30, 2.2, 16), terracotta);
	roof.position.set(kd.x - 28, 19.4, kd.z - 22);
	add(roof);
	const market = new Mesh(new BoxGeometry(20, 5, 10), terracotta);
	market.position.set(my.x - 16, 4, my.z + 12);
	add(market);
	for (let i = 0; i < 10; i++) {
		const stall = new Mesh(new BoxGeometry(3.4, 2.6, 2.8), i % 2 ? terracotta : cream);
		stall.position.set(my.x - 22 + i * 4.2, 1.4, my.z + 18);
		add(stall);
		const awn = new Mesh(new BoxGeometry(3.6, .12, 3.2), new MeshStandardMaterial({
			color: i % 3 === 0 ? 12868666 : i % 3 === 1 ? 2779704 : 1723018,
			roughness: .88
		}));
		awn.position.set(my.x - 22 + i * 4.2, 2.85, my.z + 18);
		add(awn);
	}
	const millBase = new Mesh(new CylinderGeometry(3.4, 4.2, 9, 12), stone);
	millBase.position.set(mill.x, 4.6, mill.z);
	add(millBase);
	const millCap = new Mesh(new ConeGeometry(3.8, 4.2, 8), cream);
	millCap.position.set(mill.x, 11.2, mill.z);
	add(millCap);
	const herod = herodianTexture();
	bag.push(herod);
	const kotelMat = new MeshStandardMaterial({
		map: herod,
		roughness: .78,
		metalness: .06,
		envMapIntensity: .4
	});
	bag.push(kotelMat);
	let kx = kt.x;
	let kz = kt.z + 18;
	{
		const n = nearestIndex(built.samples, kx, kz, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			kx = s.x + s.rx * (built.width / 2 + 24);
			kz = s.z + s.rz * (built.width / 2 + 24);
		}
	}
	for (let row = 0; row < 8; row++) for (let col = 0; col < 10; col++) {
		const bw = 3.6 + (col + row) % 3 * .45;
		const block = new Mesh(new BoxGeometry(bw, 1.85, 3.5), kotelMat);
		block.position.set(kx - 18 + col * 4.1 + row % 2 * .7, 1.1 + row * 1.95, kz);
		add(block);
	}
	for (let i = 0; i < 10; i++) {
		const cypress = new Mesh(new ConeGeometry(1.15, 6.4, 7), new MeshStandardMaterial({
			color: 2972216,
			roughness: .9
		}));
		cypress.position.set(olives.x + i % 5 * 6 - 10, def.elevation(.92) + 3.2, olives.z - 8 - Math.floor(i / 5) * 7);
		add(cypress);
	}
	const hillM = new MeshStandardMaterial({
		color: 12890250,
		roughness: .95,
		flatShading: true
	});
	bag.push(hillM);
	for (let i = 0; i < 18; i++) {
		const a = i / 18 * Math.PI * 2 + .3;
		const r = 340 + i % 5 * 90;
		const h = 68 + i % 6 * 28;
		const hill = new Mesh(new ConeGeometry(62 + i % 4 * 16, h, 6), hillM);
		hill.position.set(olives.x + Math.cos(a) * r, def.elevation(1) * .18 + h * .22, olives.z + Math.sin(a) * r);
		add(hill);
	}
	glowAt(jg.x + 18, 16, jg.z + 40, 16769184, 28, 24);
	glowAt(dm.x, 18, dm.z, 16765040, 32, 26);
	hit(jg.x + 18, jg.z + 40, 6);
	hit(td.x + 28, td.z + 36, 10);
	hit(kx, kz, 10, 22, 6);
	hit(kd.x - 28, kd.z - 22, 8);
	hit(mill.x, mill.z, 5);
}
function buildHaifa(context) {
	const { group, def, bag, built, add, glowAt, hit, stone, gold, cream, terracotta, _dummy } = context;
	const bg = hai(32.8118, 34.9884);
	const pt = hai(32.819, 35.004);
	const pineM = new MeshStandardMaterial({
		color: 1853992,
		roughness: .9,
		flatShading: true
	});
	const barkM = new MeshStandardMaterial({
		color: 3811356,
		roughness: .92
	});
	const cypressM = new MeshStandardMaterial({
		color: 2972216,
		roughness: .9,
		flatShading: true
	});
	const leafM = new MeshStandardMaterial({
		color: 4025140,
		roughness: .88,
		flatShading: true
	});
	const wallM = new MeshStandardMaterial({
		color: 9076848,
		roughness: .9,
		flatShading: true
	});
	bag.push(pineM, barkM, cypressM, leafM, wallM);
	let bx = bg.x + 26;
	let bz = bg.z + 18;
	{
		const n = nearestIndex(built.samples, bx, bz, 0);
		if (n.dist < built.width / 2 + 36) {
			const s = built.samples[n.index];
			const off = built.width / 2 + 58;
			bx = s.x + s.rx * off;
			bz = s.z + s.rz * off;
		}
	}
	const shrineY = def.elevation(.06);
	for (let i = 0; i < 18; i++) {
		const terrace = new Mesh(new BoxGeometry(38 - i * 1.15, 1.05, 12), new MeshStandardMaterial({
			color: i % 2 ? 13623492 : 15262936,
			roughness: .85,
			envMapIntensity: .35
		}));
		terrace.position.set(bx, shrineY - 4 - i * 2.4, bz + i * 7.2);
		add(terrace);
		const stair = new Mesh(new BoxGeometry(5.2, .4, 7.4), cream);
		stair.position.set(bx, shrineY - 3.6 - i * 2.4, bz + i * 7.2);
		add(stair);
		if (i % 2 === 0) for (const side of [-14, 14]) {
			const cypress = new Mesh(new ConeGeometry(1.1, 5.4, 7), cypressM);
			cypress.position.set(bx + side, shrineY - .8 - i * 2.4, bz + i * 7.2);
			add(cypress);
		}
		else for (const side of [-10, 10]) {
			const cypress = new Mesh(new ConeGeometry(.9, 4.2, 7), cypressM);
			cypress.position.set(bx + side, shrineY - 1.4 - i * 2.4, bz + i * 7.2);
			add(cypress);
		}
		const hedge = new Mesh(new BoxGeometry(34 - i * 1.1, .55, .7), leafM);
		hedge.position.set(bx, shrineY - 3.3 - i * 2.4, bz + i * 7.2 + 5.4);
		add(hedge);
	}
	const shrine = new Mesh(new CylinderGeometry(8.2, 9.1, 13, 8), cream);
	shrine.position.set(bx, shrineY + 8, bz - 8);
	add(shrine);
	for (let i = 0; i < 18; i++) {
		const a = i / 18 * Math.PI * 2;
		const col = new Mesh(new CylinderGeometry(.36, .42, 12, 8), cream);
		col.position.set(bx + Math.cos(a) * 10.2, shrineY + 8, bz - 8 + Math.sin(a) * 10.2);
		add(col);
	}
	const shrineDome = new Mesh(new SphereGeometry(8.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), gold);
	shrineDome.position.set(bx, shrineY + 15.6, bz - 8);
	add(shrineDome);
	const drum = new Mesh(new CylinderGeometry(8.6, 8.9, 2.6, 18), cream);
	drum.position.set(bx, shrineY + 14.4, bz - 8);
	add(drum);
	const drumGold = new Mesh(new TorusGeometry(8.55, .22, 6, 18), gold);
	drumGold.rotation.x = Math.PI / 2;
	drumGold.position.set(bx, shrineY + 15.5, bz - 8);
	add(drumGold);
	const shrineLantern = new Mesh(new CylinderGeometry(.9, 1.5, 3.6, 8), gold);
	shrineLantern.position.set(bx, shrineY + 23.2, bz - 8);
	add(shrineLantern);
	const shrineTip = new Mesh(new SphereGeometry(.7, 10, 8), gold);
	shrineTip.position.set(bx, shrineY + 25.4, bz - 8);
	add(shrineTip);
	glowAt(bx, shrineY + 23, bz - 8, 16763972, 56, 42);
	hit(bx, bz - 8, 11, 10, 10);
	{
		const hillM = new MeshStandardMaterial({
			color: 4874808,
			roughness: .95,
			flatShading: true
		});
		bag.push(hillM);
		const start = built.samples[2];
		for (let i = 0; i < 12; i++) {
			const extra = 80 + i * 28;
			const h = 48 + i % 4 * 20;
			const hill = new Mesh(new ConeGeometry(34 + i % 3 * 10, h, 6), hillM);
			hill.position.set(start.x - start.rx * extra, start.y + h * .18, start.z - start.rz * extra);
			add(hill);
		}
	}
	const pineTrunkG = new CylinderGeometry(.22, .36, 8.4, 7);
	pineTrunkG.translate(0, 4.2, 0);
	const pineCrownG = new ConeGeometry(2.2, 6.4, 7);
	const nPine = Math.min(90, built.samples.length * 2);
	const pTrunks = new InstancedMesh(pineTrunkG, barkM, nPine);
	const pCrowns = new InstancedMesh(pineCrownG, pineM, nPine);
	let pi = 0;
	const stepP = Math.max(1, Math.floor(built.samples.length / 40));
	for (let i = 1; i < built.samples.length - 1 && pi < nPine; i += stepP) {
		const s = built.samples[i];
		const ms = s.rx * (bg.x - s.x) + s.rz * (bg.z - s.z) >= 0 ? 1 : -1;
		for (const extra of [
			11,
			20,
			32
		]) {
			if (pi >= nPine) break;
			const d = built.width / 2 + extra;
			const px = s.x + s.rx * d * ms;
			const pz = s.z + s.rz * d * ms;
			_dummy.position.set(px, s.y, pz);
			_dummy.scale.set(1, 1 + i % 4 * .12, 1);
			_dummy.rotation.set(0, i * .7, 0);
			_dummy.updateMatrix();
			pTrunks.setMatrixAt(pi, _dummy.matrix);
			_dummy.position.set(px, s.y + 8.2, pz);
			_dummy.updateMatrix();
			pCrowns.setMatrixAt(pi, _dummy.matrix);
			pi++;
		}
	}
	pTrunks.count = pi;
	pCrowns.count = pi;
	pTrunks.instanceMatrix.needsUpdate = true;
	pCrowns.instanceMatrix.needsUpdate = true;
	group.add(pTrunks, pCrowns);
	const rockMat = new MeshStandardMaterial({
		color: 6969928,
		roughness: .95,
		flatShading: true
	});
	bag.push(rockMat);
	for (let i = 0; i < 14; i++) {
		const rock = new Mesh(new DodecahedronGeometry(4 + i % 3, 0), rockMat);
		rock.position.set(bg.x + 40 + i % 4 * 18, 6 + i % 3 * 5, bg.z - 30 + Math.floor(i / 4) * 22);
		add(rock);
	}
	const craneM = new MeshStandardMaterial({
		color: 12085288,
		metalness: .4,
		roughness: .45
	});
	bag.push(craneM);
	for (let c = 0; c < 3; c++) {
		const nP = nearestIndex(built.samples, pt.x, pt.z, 0);
		const sP = built.samples[nP.index];
		const cx = sP.x + sP.rx * (built.width / 2 + 24 + c * 10);
		const cz = sP.z + sP.rz * (built.width / 2 + 24 + c * 10);
		const crane = new Mesh(new BoxGeometry(1.4, 32 + c * 4, 1.4), craneM);
		crane.position.set(cx, 16 + c * 2, cz);
		add(crane);
		const jib = new Mesh(new BoxGeometry(36, .8, .8), craneM);
		jib.position.set(cx + 12, 32 + c * 4, cz);
		add(jib);
	}
	const sm = hai(32.8272, 34.9698);
	let smx = sm.x;
	let smz = sm.z;
	{
		const n = nearestIndex(built.samples, smx, smz, 0);
		if (n.dist < built.width / 2 + 16) {
			const s = built.samples[n.index];
			smx = s.x + s.rx * (built.width / 2 + 28);
			smz = s.z + s.rz * (built.width / 2 + 28);
		}
	}
	const church = new Mesh(new BoxGeometry(16, 9, 22), cream);
	church.position.set(smx, 4.5, smz);
	add(church);
	const nave = new Mesh(new BoxGeometry(10, 6, 8), cream);
	nave.position.set(smx, 12, smz);
	add(nave);
	const smDome = new Mesh(new SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), terracotta);
	smDome.position.set(smx, 15.4, smz);
	add(smDome);
	const bell = new Mesh(new BoxGeometry(4.2, 18, 4.2), cream);
	bell.position.set(smx + 8, 9, smz + 8);
	add(bell);
	const bellCap = new Mesh(new ConeGeometry(3.2, 4.4, 4), terracotta);
	bellCap.rotation.y = Math.PI / 4;
	bellCap.position.set(smx + 8, 20.2, smz + 8);
	add(bellCap);
	hit(smx, smz, 10, 9, 12);
	const rust = new MeshStandardMaterial({
		color: 9071176,
		roughness: .7,
		metalness: .2
	});
	bag.push(rust);
	for (let i = 0; i < 4; i++) {
		const hull = new Mesh(new BoxGeometry(8, 4.2, 28), rust);
		hull.position.set(pt.x + 40, 1.8, pt.z - 30 + i * 22);
		add(hull);
		const stack = new Mesh(new CylinderGeometry(.7, .9, 6, 8), cream);
		stack.position.set(pt.x + 40, 6.8, pt.z - 30 + i * 22);
		add(stack);
	}
	const siloM = new MeshStandardMaterial({
		color: 13156532,
		roughness: .62,
		metalness: .12
	});
	bag.push(siloM);
	for (let i = 0; i < 5; i++) {
		const silo = new Mesh(new CylinderGeometry(3.4, 3.6, 22, 12), siloM);
		silo.position.set(pt.x - 28 + i * 8, 11, pt.z + 22);
		add(silo);
	}
	const colony = [
		{
			lat: 32.8194,
			lon: 34.9892,
			w: 9.2,
			h: 8.4,
			d: 7.6
		},
		{
			lat: 32.8198,
			lon: 34.99,
			w: 10.4,
			h: 9.2,
			d: 8.2
		},
		{
			lat: 32.82,
			lon: 34.9908,
			w: 8.6,
			h: 7.8,
			d: 7.2
		},
		{
			lat: 32.8192,
			lon: 34.9914,
			w: 11.2,
			h: 8.8,
			d: 8.4
		},
		{
			lat: 32.8188,
			lon: 34.9898,
			w: 9.6,
			h: 10.2,
			d: 7.8
		}
	];
	for (let i = 0; i < colony.length; i++) {
		const c = colony[i];
		const p = hai(c.lat, c.lon);
		const body = new Mesh(new BoxGeometry(c.w, c.h, c.d), i % 2 ? cream : stone);
		body.position.set(p.x, c.h * .5, p.z);
		add(body);
		const roof = new Mesh(new ConeGeometry(Math.max(c.w, c.d) * .7, 3.2, 4), terracotta);
		roof.rotation.y = Math.PI / 4;
		roof.position.set(p.x, c.h + 1.6, p.z);
		add(roof);
		hit(p.x, p.z, 5);
	}
	const valleyX = def.water ? def.water.x : pt.x;
	const valleyZ = def.water ? def.water.z : pt.z;
	const stepW = Math.max(3, Math.floor(built.samples.length / 28));
	for (let i = 2; i < built.samples.length - 2; i += stepW) {
		const s = built.samples[i];
		const ms = -(s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1);
		const d = built.width / 2 + 3.4;
		const wx = s.x + s.rx * d * ms;
		const wz = s.z + s.rz * d * ms;
		const retain = new Mesh(new BoxGeometry(1.1, 3.6, 14), wallM);
		retain.position.set(wx, s.y + 1.4, wz);
		retain.rotation.y = Math.atan2(s.tx, s.tz);
		add(retain);
	}
	const railM = new MeshStandardMaterial({
		color: 13157564,
		metalness: .35,
		roughness: .45
	});
	bag.push(railM);
	for (let i = 4; i < built.samples.length - 4; i += 4) {
		const s = built.samples[i];
		const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
		const d = built.width / 2 + 1.6;
		const px = s.x + s.rx * d * vs;
		const pz = s.z + s.rz * d * vs;
		const post = new Mesh(new CylinderGeometry(.06, .07, 1.15, 5), railM);
		post.position.set(px, s.y + .7, pz);
		add(post);
		if (i + 4 < built.samples.length) {
			const s2 = built.samples[Math.min(i + 4, built.samples.length - 1)];
			const px2 = s2.x + s2.rx * d * vs;
			const pz2 = s2.z + s2.rz * d * vs;
			const bar = new Mesh(new BoxGeometry(Math.hypot(px2 - px, pz2 - pz), .06, .06), railM);
			bar.position.set((px + px2) * .5, s.y + 1.15, (pz + pz2) * .5);
			bar.lookAt(px2, s.y + 1.15, pz2);
			add(bar);
		}
	}
}
function buildEilat(context) {
	const { built, add, glowAt, hit, white, cream, wood, cyan } = context;
	const mar = eil(29.5482, 34.9542);
	{
		const n = nearestIndex(built.samples, mar.x, mar.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			mar.x = s.x + s.rx * (built.width / 2 + 24);
			mar.z = s.z + s.rz * (built.width / 2 + 24);
		}
	}
	const nb = eil(29.5585, 34.96);
	for (let i = 0; i < 7; i++) {
		const mtn = new Mesh(new ConeGeometry(18 + i * 3, 22 + i * 6, 5), new MeshStandardMaterial({
			color: 10771002,
			roughness: .95,
			flatShading: true,
			envMapIntensity: .2
		}));
		mtn.position.set(mar.x + 80 + i * 18, 10 + i, mar.z - 20 + i % 3 * 30);
		add(mtn);
	}
	const pier = new Mesh(new BoxGeometry(5, .45, 36), wood);
	pier.position.set(mar.x - 12, .22, mar.z);
	add(pier);
	for (const ht of [
		{
			lat: 29.5578,
			lon: 34.9612,
			w: 12,
			h: 26,
			d: 9
		},
		{
			lat: 29.5564,
			lon: 34.9604,
			w: 11,
			h: 22,
			d: 9
		},
		{
			lat: 29.5586,
			lon: 34.9592,
			w: 14,
			h: 32,
			d: 10,
			round: true
		},
		{
			lat: 29.5552,
			lon: 34.9618,
			w: 13,
			h: 24,
			d: 9
		}
	]) {
		const p = eil(ht.lat, ht.lon);
		if (ht.round) {
			const king = new Mesh(new CylinderGeometry(7.2, 8, ht.h, 12), white);
			king.position.set(p.x, ht.h * .5, p.z);
			add(king);
			const kingHat = new Mesh(new CylinderGeometry(8.4, 6.2, 3.2, 12), cream);
			kingHat.position.set(p.x, ht.h + 1.6, p.z);
			add(kingHat);
		} else {
			const hotel = new Mesh(new BoxGeometry(ht.w, ht.h, ht.d), cream);
			hotel.position.set(p.x, ht.h * .5, p.z);
			add(hotel);
			for (let f = 0; f < 6; f++) {
				const band = new Mesh(new BoxGeometry(ht.w + .3, .16, ht.d + .3), cyan);
				band.position.set(p.x, 4 + f * 3.4, p.z);
				add(band);
			}
		}
		hit(p.x, p.z, 7);
	}
	glowAt(mar.x, 16, mar.z, 6739176, 32, 26);
	hit(mar.x, mar.z, 8);
	hit(nb.x, nb.z, 8);
}
function buildRothschild(context) {
	const { group, bag, shadows, colliders, built, add, glowAt, hit, white, gold, cream, terracotta, darkGlass, bandMat, _dummy, barkTexture, curtainTexture, foliageTexture } = context;
	const grassM = new MeshStandardMaterial({
		color: 3832386,
		roughness: .92
	});
	const walkM = new MeshStandardMaterial({
		color: 12890256,
		roughness: .88
	});
	const asphM = new MeshStandardMaterial({
		color: 2763822,
		roughness: .78
	});
	const trunkM = new MeshStandardMaterial({
		map: barkTexture(),
		color: 6967352,
		roughness: .94
	});
	const leafM = new MeshStandardMaterial({
		map: foliageTexture(),
		color: 2779688,
		roughness: .82,
		flatShading: true
	});
	const peach = new MeshStandardMaterial({
		color: 15255720,
		roughness: .7
	});
	const sandH = new MeshStandardMaterial({
		color: 14206112,
		roughness: .74
	});
	bag.push(grassM, walkM, asphM, trunkM, leafM, peach, sandH);
	const n = built.samples.length;
	const medPos = [];
	const medIdx = [];
	const walkPos = [];
	const walkIdx = [];
	const medHalf = 6.2;
	const pathHalf = 1.5;
	for (let i = 0; i <= n; i++) {
		const s = built.samples[i % n];
		const y = s.y + .08;
		medPos.push(s.x - s.rx * medHalf, y, s.z - s.rz * medHalf);
		medPos.push(s.x + s.rx * medHalf, y, s.z + s.rz * medHalf);
		walkPos.push(s.x - s.rx * pathHalf, y + .04, s.z - s.rz * pathHalf);
		walkPos.push(s.x + s.rx * pathHalf, y + .04, s.z + s.rz * pathHalf);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		medIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
		walkIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const mkRibbon = (pos, idx, mat) => {
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(pos, 3));
		g.setIndex(idx);
		g.computeVertexNormals();
		const m = new Mesh(g, mat);
		m.receiveShadow = true;
		group.add(m);
		bag.push(g);
	};
	mkRibbon(medPos, medIdx, grassM);
	mkRibbon(walkPos, walkIdx, walkM);
	const curbM = new MeshStandardMaterial({
		color: 13155496,
		roughness: .7
	});
	bag.push(curbM);
	const ficusN = 128;
	const trunkG = new CylinderGeometry(.95, 1.52, 12.4, 12);
	const leafG = new SphereGeometry(4.2, 10, 8);
	bag.push(trunkG, leafG);
	const trunks = new InstancedMesh(trunkG, trunkM, ficusN);
	const leaves = new InstancedMesh(leafG, leafM, 960);
	trunks.castShadow = shadows;
	leaves.castShadow = shadows;
	let ti = 0;
	let li = 0;
	const stepF = Math.max(1, Math.floor(n / 48));
	for (let i = 2; i < n && ti < ficusN; i += stepF) {
		const s = built.samples[i];
		for (const d of [-3.05, 3.05]) {
			if (ti >= ficusN) break;
			const fx = s.x + s.rx * d;
			const fz = s.z + s.rz * d;
			_dummy.position.set(fx, s.y + 6.2, fz);
			_dummy.scale.set(1, 1, 1);
			_dummy.rotation.set(0, i * .7 % 6, 0);
			_dummy.updateMatrix();
			trunks.setMatrixAt(ti, _dummy.matrix);
			const offs = [
				[
					0,
					.8,
					0
				],
				[
					2.8,
					.3,
					.9
				],
				[
					-2.7,
					.4,
					.7
				],
				[
					.9,
					.7,
					-2.7
				],
				[
					-1,
					.3,
					2.6
				],
				[
					2,
					2.2,
					1.4
				],
				[
					-2.1,
					2.1,
					-1.3
				],
				[
					.2,
					3.2,
					.3
				],
				[
					2.3,
					1.6,
					-1.8
				],
				[
					-2.2,
					1.7,
					1.9
				],
				[
					1.4,
					2.6,
					-.8
				],
				[
					-1.5,
					2.5,
					.9
				]
			];
			for (let k = 0; k < 12; k++) {
				_dummy.position.set(fx + offs[k][0], s.y + 13.4 + offs[k][1], fz + offs[k][2]);
				const sc = 1.12 + k % 3 * .2;
				_dummy.scale.set(sc, sc * .88, sc);
				_dummy.updateMatrix();
				leaves.setMatrixAt(li++, _dummy.matrix);
			}
			colliders.push({
				x: fx,
				z: fz,
				r: 1.15,
				kind: "barrier"
			});
			ti++;
		}
	}
	trunks.count = ti;
	leaves.count = li;
	trunks.instanceMatrix.needsUpdate = true;
	leaves.instanceMatrix.needsUpdate = true;
	group.add(trunks, leaves);
	const benchG = new BoxGeometry(1.8, .12, .55);
	const benchM = new MeshStandardMaterial({
		color: 6965802,
		roughness: .88
	});
	bag.push(benchG, benchM);
	const benches = new InstancedMesh(benchG, benchM, 28);
	let bi = 0;
	for (let i = 8; i < n && bi < 28; i += Math.max(4, Math.floor(n / 14))) {
		const s = built.samples[i];
		_dummy.position.set(s.x + s.rx * 1.7, s.y + .55, s.z + s.rz * 1.7);
		_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
		_dummy.scale.set(1, 1, 1);
		_dummy.updateMatrix();
		benches.setMatrixAt(bi++, _dummy.matrix);
	}
	benches.count = bi;
	benches.instanceMatrix.needsUpdate = true;
	group.add(benches);
	const shutter = new MeshStandardMaterial({
		color: 3824248,
		roughness: .55
	});
	bag.push(shutter);
	for (const uh of [
		{
			lat: 32.0636,
			lon: 34.7718,
			w: 11,
			h: 9.2,
			d: 9,
			roof: "tile",
			col: 0
		},
		{
			lat: 32.0648,
			lon: 34.7734,
			w: 10,
			h: 11.4,
			d: 8.2,
			roof: "flat",
			col: 1
		},
		{
			lat: 32.0658,
			lon: 34.7746,
			w: 12,
			h: 10.2,
			d: 8.6,
			roof: "tile",
			col: 2
		},
		{
			lat: 32.067,
			lon: 34.7754,
			w: 9.2,
			h: 13.4,
			d: 8,
			roof: "flat",
			col: 3
		},
		{
			lat: 32.0684,
			lon: 34.7758,
			w: 10.4,
			h: 12.2,
			d: 9,
			roof: "tile",
			col: 0
		},
		{
			lat: 32.0704,
			lon: 34.7757,
			w: 10.6,
			h: 14.8,
			d: 10,
			roof: "flat",
			col: 1
		},
		{
			lat: 32.0718,
			lon: 34.7764,
			w: 11.2,
			h: 11.6,
			d: 8.4,
			roof: "flat",
			col: 2
		},
		{
			lat: 32.0728,
			lon: 34.7782,
			w: 9.4,
			h: 15.2,
			d: 8,
			roof: "flat",
			col: 3
		},
		{
			lat: 32.0742,
			lon: 34.7796,
			w: 10,
			h: 10.8,
			d: 8.6,
			roof: "tile",
			col: 0
		}
	]) {
		const p = tlv(uh.lat, uh.lon);
		const nearH = nearestIndex(built.samples, p.x, p.z, 0);
		const sH = built.samples[nearH.index];
		const extraH = built.width / 2 + 18;
		if (nearH.dist < extraH) {
			p.x = sH.x + sH.rx * extraH;
			p.z = sH.z + sH.rz * extraH;
		}
		const facade = new MeshStandardMaterial({
			map: curtainTexture([
				"white",
				"gold",
				"white",
				"teal"
			][uh.col % 4]),
			roughness: .78,
			color: 15789528
		});
		bag.push(facade);
		const body = new Mesh(new BoxGeometry(uh.w, uh.h, uh.d), facade);
		body.position.set(p.x, uh.h * .5, p.z);
		add(body);
		const cornice = new Mesh(new BoxGeometry(uh.w + .7, .35, uh.d + .5), uh.col % 2 ? terracotta : cream);
		cornice.position.set(p.x, uh.h + .1, p.z);
		add(cornice);
		if (uh.roof === "tile") {
			const roof = new Mesh(new ConeGeometry(uh.w * .72, 2.6, 4), terracotta);
			roof.rotation.y = Math.PI / 4;
			roof.position.set(p.x, uh.h + 1.5, p.z);
			add(roof);
		} else if (uh.roof === "pagoda") for (let k = 0; k < 3; k++) {
			const pg2 = new Mesh(new ConeGeometry(uh.w * (.62 - k * .12), 2.1, 6), terracotta);
			pg2.position.set(p.x, uh.h + 1.2 + k * 2.1, p.z);
			add(pg2);
		}
		for (let fl = 0; fl < 3; fl++) for (const wx of [-2.2, 2.2]) {
			const win = new Mesh(new PlaneGeometry(1.3, 1.7), darkGlass);
			win.position.set(p.x + uh.d * .51, 2.4 + fl * 2.8, p.z + wx);
			add(win);
		}
		hit(p.x, p.z, 5.5, uh.w * .48, uh.d * .48);
	}
	const indy = tlv(32.0629, 34.7695);
	{
		const nI = nearestIndex(built.samples, indy.x, indy.z, 0);
		if (nI.dist < built.width / 2 + 12) {
			const sI = built.samples[nI.index];
			indy.x = sI.x + sI.rx * (built.width / 2 + 16);
			indy.z = sI.z + sI.rz * (built.width / 2 + 16);
		}
	}
	{
		const indyM = new MeshStandardMaterial({
			map: curtainTexture("white"),
			roughness: .8,
			color: 16118744
		});
		bag.push(indyM);
		const indyB = new Mesh(new BoxGeometry(14.2, 8.4, 11.2), indyM);
		indyB.position.set(indy.x, 4.2, indy.z);
		add(indyB);
		const indyRoof = new Mesh(new BoxGeometry(15.2, .45, 12), white);
		indyRoof.position.set(indy.x, 8.7, indy.z);
		add(indyRoof);
		hit(indy.x, indy.z, 7, 7.2, 5.8);
	}
	const pg = tlv(32.0648, 34.7752);
	{
		const nP = nearestIndex(built.samples, pg.x, pg.z, 0);
		if (nP.dist < built.width / 2 + 12) {
			const sP = built.samples[nP.index];
			pg.x = sP.x + sP.rx * (built.width / 2 + 18);
			pg.z = sP.z + sP.rz * (built.width / 2 + 18);
		}
	}
	const pgBody = new Mesh(new BoxGeometry(9.2, 16.5, 9.2), cream);
	pgBody.position.set(pg.x, 8.3, pg.z);
	add(pgBody);
	for (let k = 0; k < 4; k++) {
		const r = 7.4 - k * 1.15;
		const eaves2 = new Mesh(new CylinderGeometry(r + 1.3, r, .55, 8), terracotta);
		eaves2.position.set(pg.x, 6.2 + k * 3.35, pg.z);
		add(eaves2);
		const roof = new Mesh(new ConeGeometry(r + .4, 1.8, 8), terracotta);
		roof.position.set(pg.x, 7.3 + k * 3.35, pg.z);
		add(roof);
		const balc = new Mesh(new BoxGeometry(r * 1.35, .18, r * 1.35), cream);
		balc.position.set(pg.x, 5.7 + k * 3.35, pg.z);
		add(balc);
	}
	const pgCap = new Mesh(new SphereGeometry(.7, 8, 6), terracotta);
	pgCap.position.set(pg.x, 20.4, pg.z);
	add(pgCap);
	const hb = tlv(32.0734, 34.7826);
	{
		const nB = nearestIndex(built.samples, hb.x, hb.z, 0);
		if (nB.dist < built.width / 2 + 16) {
			const sB = built.samples[nB.index];
			hb.x = sB.x + sB.rx * (built.width / 2 + 28);
			hb.z = sB.z + sB.rz * (built.width / 2 + 28);
		}
	}
	const plaza = new Mesh(new CircleGeometry(22, 24), walkM);
	plaza.rotation.x = -Math.PI / 2;
	plaza.position.set(hb.x, .12, hb.z);
	add(plaza);
	for (const [dx, dz, h, r] of [
		[
			0,
			0,
			16,
			9.5
		],
		[
			-9,
			6,
			11,
			7.2
		],
		[
			9,
			5,
			10,
			6.6
		]
	]) {
		const cyl = new Mesh(new CylinderGeometry(r, r * 1.04, h, 20), white);
		cyl.position.set(hb.x + dx, h * .5, hb.z + dz);
		add(cyl);
	}
	const hbRing = new Mesh(new TorusGeometry(10.2, .35, 6, 20), cream);
	hbRing.rotation.x = Math.PI / 2;
	hbRing.position.set(hb.x, 15.4, hb.z);
	add(hbRing);
	for (let k = 0; k < 5; k++) {
		const rib = new Mesh(new TorusGeometry(9.7, .22, 5, 20), cream);
		rib.rotation.x = Math.PI / 2;
		rib.position.set(hb.x, 3.2 + k * 2.6, hb.z);
		add(rib);
	}
	const hbLid = new Mesh(new CylinderGeometry(10.4, 9.2, 1.4, 20), white);
	hbLid.position.set(hb.x, 16.6, hb.z);
	add(hbLid);
	const ind = tlv(32.0624, 34.7682);
	{
		const nN = nearestIndex(built.samples, ind.x, ind.z, 0);
		if (nN.dist < built.width / 2 + 12) {
			const sN = built.samples[nN.index];
			ind.x = sN.x + sN.rx * (built.width / 2 + 18);
			ind.z = sN.z + sN.rz * (built.width / 2 + 18);
		}
	}
	const hall = new Mesh(new BoxGeometry(16, 8.4, 11.4), cream);
	hall.position.set(ind.x, 4.6, ind.z);
	add(hall);
	const balcony = new Mesh(new BoxGeometry(14.4, .28, 2.6), cream);
	balcony.position.set(ind.x, 5.8, ind.z + 6.4);
	add(balcony);
	const railIH = new Mesh(new BoxGeometry(14.4, .72, .12), white);
	railIH.position.set(ind.x, 6.3, ind.z + 7.5);
	add(railIH);
	for (const sx of [
		-5.4,
		-1.8,
		1.8,
		5.4
	]) {
		const col = new Mesh(new CylinderGeometry(.38, .44, 6.2, 10), white);
		col.position.set(ind.x + sx, 3.5, ind.z + 5.9);
		add(col);
	}
	for (const [wx, wy] of [
		[-4.2, 3.2],
		[0, 3.2],
		[4.2, 3.2],
		[-4.2, 6.4],
		[0, 6.4],
		[4.2, 6.4]
	]) {
		const win = new Mesh(new PlaneGeometry(1.6, 1.9), darkGlass);
		win.position.set(ind.x + wx, wy, ind.z + 5.75);
		add(win);
	}
	const eaves = new Mesh(new BoxGeometry(17.6, .5, 12.4), terracotta);
	eaves.position.set(ind.x, 9, ind.z);
	add(eaves);
	const ihPole = new Mesh(new CylinderGeometry(.07, .09, 7.6, 6), bandMat);
	ihPole.position.set(ind.x + 7.2, 8.6, ind.z + 4.2);
	add(ihPole);
	const roofIH = new Mesh(new ConeGeometry(11.2, 3.4, 4), terracotta);
	roofIH.rotation.y = Math.PI / 4;
	roofIH.position.set(ind.x, 11.1, ind.z);
	add(roofIH);
	const flagPole = new Mesh(new CylinderGeometry(.08, .1, 8.4, 6), white);
	flagPole.position.set(ind.x, 14.6, ind.z);
	add(flagPole);
	const flagTex = getIsraelFlag();
	const flagW = new Mesh(new PlaneGeometry(3.4, 2.1), new MeshBasicMaterial({
		map: flagTex ?? void 0,
		color: flagTex ? 16777215 : 16054008,
		side: 2
	}));
	flagW.position.set(ind.x + 1.7, 17.4, ind.z);
	add(flagW);
	const me = tlv(32.0658, 34.7768);
	const meier = new Mesh(new BoxGeometry(8.2, 70, 8.2), white);
	meier.position.set(me.x, 35, me.z);
	add(meier);
	const meierGold = new Mesh(new BoxGeometry(9.2, 5.4, 9.2), gold);
	meierGold.position.set(me.x, 72.4, me.z);
	add(meierGold);
	glowAt(me.x, 74, me.z, 16764006, 26, 24);
	glowAt(hb.x, 16, hb.z, 16771272, 22, 18);
	hit(hb.x, hb.z, 10);
	hit(ind.x, ind.z, 8);
	hit(me.x, me.z, 6);
	if (nearestIndex(built.samples, pg.x, pg.z, 0).dist > built.width / 2 + 6) hit(pg.x, pg.z, 6);
}
function buildAyalon(context) {
	const { group, bag, shadows, movers, ramps, streets, built, add, glowAt, hit, hitRoad, white, cream, terracotta, darkGlass, paleGlass, bandMat, placeAzrieli, placeCityGate, placeToHa, placeMidtown, placeElectra, placeSarona, placeHakirya, placeShalomMeir, _dummy } = context;
	tlv(32.0744, 34.7932);
	placeAzrieli(1.42);
	placeToHa(1.28, 32.0695, 34.7894);
	placeCityGate(1);
	placeMidtown(1.15);
	placeElectra(1.2);
	placeSarona(1.32);
	placeHakirya(1.1);
	placeShalomMeir(1.15);
	const parkOff = (lat, lon, extra, east) => {
		const hint = tlv(lat, lon);
		const n = nearestIndex(built.samples, hint.x, hint.z, 0);
		const s = built.samples[n.index];
		const latOff = east ? built.width + 18 + built.width / 2 + extra : -(built.width / 2 + extra);
		return {
			x: s.x + s.rx * latOff,
			z: s.z + s.rz * latOff,
			y: s.y
		};
	};
	const ibm = parkOff(32.0856, 34.7987, 36, true);
	const ibmGlass = new MeshPhysicalMaterial({
		color: 3829370,
		roughness: .14,
		metalness: 0,
		envMapIntensity: 1.5,
		clearcoat: 1,
		clearcoatRoughness: .12
	});
	bag.push(ibmGlass);
	const ibmGeo = new BoxGeometry(1, 7.2, 1);
	const ibmSlabs = new InstancedMesh(ibmGeo, ibmGlass, 6);
	ibmSlabs.frustumCulled = false;
	for (let i = 0; i < 6; i++) {
		const w = 20 - i * 2.2;
		_dummy.position.set(ibm.x, 4.2 + i * 8, ibm.z);
		_dummy.rotation.set(0, 0, 0);
		_dummy.scale.set(w, 1, w);
		_dummy.updateMatrix();
		ibmSlabs.setMatrixAt(i, _dummy.matrix);
	}
	ibmSlabs.instanceMatrix.needsUpdate = true;
	ibmSlabs.castShadow = shadows;
	group.add(ibmSlabs);
	bag.push(ibmGeo);
	hit(ibm.x, ibm.z, 12);
	const yovel = parkOff(32.0788, 34.7916, 30, false);
	const yovGlass = new MeshPhysicalMaterial({
		color: 5927048,
		roughness: .12,
		metalness: 0,
		envMapIntensity: 1.45,
		clearcoat: 1
	});
	bag.push(yovGlass);
	const yov = new Mesh(new CylinderGeometry(7.2, 8.1, 92, 18), yovGlass);
	yov.position.set(yovel.x, 46, yovel.z);
	add(yov);
	const yovRingYs = [];
	for (let y = 8; y < 88; y += 4.2) yovRingYs.push(y);
	const yovRingGeo = new TorusGeometry(7.6, .12, 5, 18);
	const yovRings = new InstancedMesh(yovRingGeo, bandMat, yovRingYs.length);
	yovRings.frustumCulled = false;
	for (let i = 0; i < yovRingYs.length; i++) {
		_dummy.position.set(yovel.x, yovRingYs[i], yovel.z);
		_dummy.rotation.set(Math.PI / 2, 0, 0);
		_dummy.scale.set(1, 1, 1);
		_dummy.updateMatrix();
		yovRings.setMatrixAt(i, _dummy.matrix);
	}
	yovRings.instanceMatrix.needsUpdate = true;
	group.add(yovRings);
	bag.push(yovRingGeo);
	const yovCrown = new Mesh(new CylinderGeometry(9.4, 6.2, 9, 18), bandMat);
	yovCrown.position.set(yovel.x, 96, yovel.z);
	add(yovCrown);
	hit(yovel.x, yovel.z, 10);
	const plat = parkOff(32.0842, 34.8036, 42, true);
	const platM = new Mesh(new CylinderGeometry(6.4, 7.4, 108, 8), darkGlass);
	platM.position.set(plat.x, 54, plat.z);
	platM.rotation.y = .28;
	add(platM);
	const platBandYs = [];
	for (let y = 8; y < 100; y += 5.2) platBandYs.push(y);
	const platBandGeo = new CylinderGeometry(6.7, 7.3, .28, 8);
	const platBands = new InstancedMesh(platBandGeo, bandMat, platBandYs.length);
	platBands.frustumCulled = false;
	for (let i = 0; i < platBandYs.length; i++) {
		_dummy.position.set(plat.x, platBandYs[i], plat.z);
		_dummy.rotation.set(0, .28, 0);
		_dummy.scale.set(1, 1, 1);
		_dummy.updateMatrix();
		platBands.setMatrixAt(i, _dummy.matrix);
	}
	platBands.instanceMatrix.needsUpdate = true;
	group.add(platBands);
	bag.push(platBandGeo);
	const platHat = new Mesh(new CylinderGeometry(8.4, 5.2, 7.2, 8), bandMat);
	platHat.position.set(plat.x, 112, plat.z);
	platHat.rotation.y = .28;
	add(platHat);
	hit(plat.x, plat.z, 10);
	const tau = parkOff(32.1124, 34.8046, 48, true);
	const tauLib = new Mesh(new CylinderGeometry(10, 11.4, 14, 20), cream);
	tauLib.position.set(tau.x, 7, tau.z);
	add(tauLib);
	const tauDome = new Mesh(new SphereGeometry(8.4, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
	tauDome.position.set(tau.x, 14.4, tau.z);
	add(tauDome);
	const hallGeo = new BoxGeometry(1, 1, 1);
	const halls = new InstancedMesh(hallGeo, cream, 5);
	halls.frustumCulled = false;
	[
		[
			18,
			5.2,
			8,
			14,
			6.4,
			10
		],
		[
			-16,
			4.4,
			-10,
			12,
			5.6,
			9
		],
		[
			8,
			6.2,
			-18,
			10,
			8.4,
			16
		],
		[
			-22,
			3.8,
			14,
			16,
			4.8,
			8
		],
		[
			24,
			3.2,
			12,
			8,
			4.2,
			14
		]
	].forEach((h, i) => {
		_dummy.position.set(tau.x + h[0], h[1], tau.z + h[2]);
		_dummy.rotation.set(0, i * .35, 0);
		_dummy.scale.set(h[3], h[4] * 2, h[5]);
		_dummy.updateMatrix();
		halls.setMatrixAt(i, _dummy.matrix);
	});
	halls.instanceMatrix.needsUpdate = true;
	group.add(halls);
	bag.push(hallGeo);
	glowAt(tau.x, 16, tau.z, 15919312, 28, 22);
	hit(tau.x, tau.z, 22);
	const hsHint = tlv(32.0735, 34.79605);
	const hsNear = nearestIndex(built.samples, hsHint.x, hsHint.z, 0);
	const hsS = built.samples[hsNear.index];
	const hsMid = built.width / 2 + 9;
	const hs = {
		x: hsS.x + hsS.rx * hsMid,
		z: hsS.z + hsS.rz * hsMid
	};
	const tubeLen = built.width + 42;
	const across = Math.atan2(hsS.rx, hsS.rz);
	const tube = new Mesh(new CylinderGeometry(3.4, 3.4, tubeLen, 24, 1, true), paleGlass);
	tube.rotation.order = "YZX";
	tube.rotation.set(0, across, Math.PI / 2);
	tube.position.set(hs.x, hsS.y + 15.6, hs.z);
	add(tube);
	const tubeFloor = new Mesh(new BoxGeometry(tubeLen, .32, 5.2), white);
	tubeFloor.position.set(hs.x, hsS.y + 13.6, hs.z);
	tubeFloor.rotation.y = across;
	add(tubeFloor);
	for (let i = 0; i < 14; i++) {
		const t = i / 13 - .5;
		const rib = new Mesh(new TorusGeometry(3.55, .16, 6, 18), white);
		rib.rotation.order = "YZX";
		rib.rotation.set(0, across, Math.PI / 2);
		rib.position.set(hs.x + hsS.rx * t * tubeLen, hsS.y + 15.6, hs.z + hsS.rz * t * tubeLen);
		add(rib);
	}
	const mallHint = tlv(32.1004, 34.7996);
	const mallNear = nearestIndex(built.samples, mallHint.x, mallHint.z, 0);
	const mallS = built.samples[mallNear.index];
	const mallLat = built.width + 18 + built.width / 2 + 32;
	const mall = {
		x: mallS.x + mallS.rx * mallLat,
		z: mallS.z + mallS.rz * mallLat
	};
	const mallYaw = Math.atan2(mallS.tx, mallS.tz);
	const mallM = new Mesh(new BoxGeometry(42, 16, 28), cream);
	mallM.position.set(mall.x, mallS.y + 8, mall.z);
	mallM.rotation.y = mallYaw;
	add(mallM);
	const mallR = new Mesh(new BoxGeometry(46, 1.8, 32), white);
	mallR.position.set(mall.x, mallS.y + 16.6, mall.z);
	mallR.rotation.y = mallYaw;
	add(mallR);
	if (mallNear.dist > built.width / 2 + 10) hit(mall.x, mall.z, 20);
	const kit = getAyalonRoad();
	const rampAsphalt = new MeshPhysicalMaterial({
		map: kit?.map ?? null,
		roughnessMap: kit?.roughnessMap ?? null,
		bumpMap: kit?.bumpMap ?? null,
		bumpScale: kit ? .18 : 0,
		color: kit ? 16777215 : 6053990,
		roughness: .45,
		metalness: 0,
		envMapIntensity: .85,
		clearcoat: .22,
		clearcoatRoughness: .4
	});
	const conc = new MeshStandardMaterial({
		color: 13157044,
		roughness: .72
	});
	const greenSign = new MeshStandardMaterial({
		color: 1731130,
		roughness: .55
	});
	bag.push(rampAsphalt, conc, greenSign);
	const pushRamp = (x, z, sx, sz, len, half, y0, y12, he, en) => {
		ramps.push({
			x,
			z,
			sx,
			sz,
			len,
			half,
			y0,
			y1: y12,
			he,
			en
		});
		streets.push({
			ax: x - sx * len * .5,
			az: z - sz * len * .5,
			bx: x + sx * len * .5,
			bz: z + sz * len * .5,
			half,
			he,
			en
		});
		const yaw = Math.atan2(sx, sz);
		const mesh = new Mesh(new BoxGeometry(half * 2, .95, len), rampAsphalt);
		mesh.position.set(x, (y0 + y12) * .5, z);
		mesh.rotation.order = "YXZ";
		mesh.rotation.y = yaw;
		mesh.rotation.x = -Math.atan2(y12 - y0, len);
		mesh.receiveShadow = true;
		add(mesh);
		for (let i = 0; i < 4; i++) {
			const t = (i + .5) / 4 - .5;
			const px = x + sx * t * len;
			const pz = z + sz * t * len;
			const py = (y0 + y12) * .5 + (y12 - y0) * t;
			const h = Math.max(1.4, py);
			const pier = new Mesh(new CylinderGeometry(.55, .72, h, 8), conc);
			pier.position.set(px, h * .5, pz);
			pier.castShadow = true;
			add(pier);
		}
		const rx = sz;
		const rz = -sx;
		for (const side of [-1, 1]) {
			const line = new Mesh(new BoxGeometry(.18, .08, len * .94), white);
			line.position.set(x + rx * (half - .22) * side, (y0 + y12) * .5 + .52, z + rz * (half - .22) * side);
			line.rotation.order = "YXZ";
			line.rotation.y = yaw;
			line.rotation.x = -Math.atan2(y12 - y0, len);
			add(line);
		}
	};
	const gantryMat = (id) => {
		const t = getGantry(id);
		if (!t) return greenSign;
		const m = new MeshBasicMaterial({
			map: t,
			fog: false,
			side: 2
		});
		bag.push(m);
		return m;
	};
	const gantryId = {
		"Kibbutz Galuyot": "gantry-kibbutz-galuyot",
		"HaHagana": "gantry-hahagana",
		"LaGuardia": "gantry-laguardia",
		"HaShalom": "gantry-hashalom",
		"Savidor Center": "gantry-savidor-center",
		"University": "gantry-university"
	};
	for (const ic of [
		{
			lat: 32.0525,
			he: "קיבוץ גלויות",
			en: "Kibbutz Galuyot"
		},
		{
			lat: 32.0547,
			he: "ההגנה",
			en: "HaHagana"
		},
		{
			lat: 32.062,
			he: "לה גרדיה",
			en: "LaGuardia"
		},
		{
			lat: 32.0735,
			he: "השלום",
			en: "HaShalom"
		},
		{
			lat: 32.0837,
			he: "סבידור מרכז",
			en: "Savidor Center"
		},
		{
			lat: 32.1035,
			he: "אוניברסיטה",
			en: "University"
		}
	]) {
		const hint = tlv(ic.lat, 34.79605);
		const n0 = nearestIndex(built.samples, hint.x, hint.z, 0);
		const sm0 = built.samples[n0.index];
		const oppOff = built.width + 18;
		const midOff = oppOff / 2;
		const c = {
			x: sm0.x + sm0.rx * midOff,
			z: sm0.z + sm0.rz * midOff
		};
		const yaw = Math.atan2(sm0.tx, sm0.tz);
		const westX = sm0.x - sm0.rx * (built.width / 2 + 2.4);
		const westZ = sm0.z - sm0.rz * (built.width / 2 + 2.4);
		const eastX = sm0.x + sm0.rx * (oppOff + built.width / 2 + 2.4);
		const eastZ = sm0.z + sm0.rz * (oppOff + built.width / 2 + 2.4);
		const deckY = 9.4;
		const span = oppOff + built.width + 16;
		const deck = new Mesh(new BoxGeometry(span, 1.15, 16), conc);
		deck.position.set(c.x, deckY, c.z);
		deck.rotation.y = yaw;
		add(deck);
		for (const side of [-7.8, 7.8]) {
			const rail = new Mesh(new BoxGeometry(span, 1.15, .22), white);
			rail.position.set(c.x + sm0.tx * side, 10.3, c.z + sm0.tz * side);
			rail.rotation.y = yaw;
			add(rail);
		}
		for (const lat of [-(built.width / 2 + 12), oppOff + built.width / 2 + 12]) {
			const px = sm0.x + sm0.rx * lat;
			const pz = sm0.z + sm0.rz * lat;
			const col = new Mesh(new BoxGeometry(1.8, deckY, 1.8), conc);
			col.position.set(px, deckY * .5, pz);
			add(col);
			if (nearestIndex(built.samples, px, pz, 0).dist > built.width / 2 + 2.5) hitRoad(px, pz, 1.4, .95, .95);
		}
		for (const lx of [
			-28,
			-10,
			10,
			28
		]) {
			const post = new Mesh(new CylinderGeometry(.12, .16, 3.4, 6), conc);
			post.position.set(c.x + sm0.rx * lx, 11.600000000000001, c.z + sm0.rz * lx);
			add(post);
			const lamp = new Mesh(new SphereGeometry(.28, 8, 6), new MeshBasicMaterial({ color: 16760944 }));
			lamp.position.set(c.x + sm0.rx * lx, 13.3, c.z + sm0.rz * lx);
			add(lamp);
		}
		const signMat = gantryMat(gantryId[ic.en] ?? "gantry-hashalom");
		const sign = new Mesh(new PlaneGeometry(18, 4.2), signMat);
		sign.position.set(c.x, 13.8, c.z);
		sign.rotation.y = yaw + Math.PI;
		add(sign);
		const sign2 = sign.clone();
		sign2.rotation.y = yaw;
		add(sign2);
		for (const gx of [-8, 8]) {
			const gpost = new Mesh(new BoxGeometry(.35, 4.6, .35), conc);
			gpost.position.set(c.x + sm0.rx * gx, 11.7, c.z + sm0.rz * gx);
			add(gpost);
		}
		const gbar = new Mesh(new BoxGeometry(18.4, .28, .28), conc);
		gbar.position.set(c.x, 13.95, c.z);
		gbar.rotation.y = yaw;
		add(gbar);
		const spd = getSign("speed90");
		if (spd) {
			const yawS = yaw;
			const offS = built.width / 2 + 4.2;
			const sx = sm0.x + sm0.rx * offS;
			const sz = sm0.z + sm0.rz * offS;
			const pole = new Mesh(new CylinderGeometry(.08, .1, 3.4, 6), conc);
			pole.position.set(sx, 1.7, sz);
			add(pole);
			const plate = new Mesh(new PlaneGeometry(1.6, 1.6), new MeshBasicMaterial({
				map: spd,
				transparent: true,
				fog: false
			}));
			plate.position.set(sx, 3.5, sz);
			plate.rotation.y = yawS + Math.PI;
			add(plate);
		}
		const zLen = 68;
		const a = 34;
		pushRamp(westX - sm0.tx * a, westZ - sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, .5, deckY, ic.he, ic.en);
		pushRamp(westX + sm0.tx * a, westZ + sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, deckY, .5, ic.he, ic.en);
		pushRamp(eastX - sm0.tx * a, eastZ - sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, .5, deckY, ic.he, ic.en);
		pushRamp(eastX + sm0.tx * a, eastZ + sm0.tz * a, sm0.tx, sm0.tz, zLen, 10.2, deckY, .5, ic.he, ic.en);
		pushRamp(c.x, c.z, sm0.rx, sm0.rz, span, 10.2, deckY, deckY, ic.he, ic.en);
		{
			const half = built.width / 2;
			pushRamp(sm0.x + sm0.rx * (half * .42), sm0.z + sm0.rz * (half * .42), sm0.rx, sm0.rz, 32, 12.5, .35, deckY, ic.he, ic.en);
			pushRamp(sm0.x - sm0.rx * (half * .15), sm0.z - sm0.rz * (half * .15), sm0.tx, sm0.tz, 36, half * .55, .3, .3, ic.he, ic.en);
		}
		if (ic.en === "Kibbutz Galuyot") {
			pushRamp(westX - sm0.rx * 20, westZ - sm0.rz * 20, sm0.tx, sm0.tz, 84, 6.4, .6, 7.2, ic.he, ic.en);
			pushRamp(eastX + sm0.rx * 20, eastZ + sm0.rz * 20, sm0.tx, sm0.tz, 84, 6.4, 7.2, .6, ic.he, ic.en);
			const d = .7071;
			const dx = sm0.rx * d + sm0.tx * d;
			const dz = sm0.rz * d + sm0.tz * d;
			const inv = Math.hypot(dx, dz) || 1;
			pushRamp(c.x - 24 * sm0.rx, c.z - 24 * sm0.rz, dx / inv, dz / inv, 54, 6.2, .6, deckY, ic.he, ic.en);
			pushRamp(c.x + 24 * sm0.rx, c.z + 24 * sm0.rz, dx / inv, dz / inv, 54, 6.2, deckY, .6, ic.he, ic.en);
		}
		if (ic.en === "LaGuardia") {
			const dx = sm0.rx * .7071 - sm0.tx * .7071;
			const dz = sm0.rz * .7071 - sm0.tz * .7071;
			const inv = Math.hypot(dx, dz) || 1;
			pushRamp(c.x - 18 * sm0.rx, c.z - 18 * sm0.rz, dx / inv, dz / inv, 44, 6.2, .6, deckY, ic.he, ic.en);
			pushRamp(c.x + 18 * sm0.rx, c.z + 18 * sm0.rz, dx / inv, dz / inv, 44, 6.2, deckY, .6, ic.he, ic.en);
		}
	}
	for (const ic of [{
		lat: 32.0735,
		he: "השלום",
		en: "HaShalom"
	}, {
		lat: 32.0837,
		he: "סבידור מרכז",
		en: "Savidor Center"
	}]) {
		const p = tlv(ic.lat, 34.795);
		const near = nearestIndex(built.samples, p.x, p.z, 0);
		const sm = built.samples[near.index];
		const rc = built.width / 2 + 6;
		pushRamp(sm.x + sm.rx * rc, sm.z + sm.rz * rc, sm.tx, sm.tz, 46, 6.4, .4, 8.6, ic.he, ic.en);
		const wing = new Mesh(new BoxGeometry(16, .85, 20), conc);
		wing.position.set(sm.x + sm.rx * (rc + 14), 8.7, sm.z + sm.rz * (rc + 14));
		wing.rotation.y = Math.atan2(sm.tx, sm.tz);
		add(wing);
	}
	const platMat = new MeshStandardMaterial({
		color: 13157564,
		roughness: .7
	});
	const glassRoof = new MeshPhysicalMaterial({
		color: 11060436,
		roughness: .12,
		metalness: 0,
		transparent: true,
		opacity: .55,
		envMapIntensity: 1.4
	});
	const silver = new MeshStandardMaterial({
		color: 14212320,
		metalness: 0,
		roughness: .28
	});
	const redStripe = new MeshStandardMaterial({
		color: 12589096,
		roughness: .45,
		metalness: 0
	});
	const purpleStripe = new MeshStandardMaterial({
		color: 4856426,
		roughness: .42,
		metalness: 0
	});
	bag.push(platMat, glassRoof, silver, redStripe, purpleStripe);
	const midLon = 34.79605;
	const midOff = built.width / 2 + 9;
	for (const st of [
		{
			lat: 32.0525,
			he: "קיבוץ גלויות",
			kind: "galuyot"
		},
		{
			lat: 32.0547,
			he: "ההגנה",
			kind: "hagana"
		},
		{
			lat: 32.0735,
			he: "השלום",
			kind: "shalom"
		},
		{
			lat: 32.0837,
			he: "סבידור",
			kind: "savidor"
		},
		{
			lat: 32.1035,
			he: "האוניברסיטה",
			kind: "uni"
		}
	]) {
		const hint = tlv(st.lat, midLon);
		const near = nearestIndex(built.samples, hint.x, hint.z, 0);
		const s = built.samples[near.index];
		const p = {
			x: s.x + s.rx * midOff,
			z: s.z + s.rz * midOff
		};
		const py = s.y;
		const yaw = Math.atan2(s.tx, s.tz);
		const platLen = st.kind === "savidor" ? 110 : st.kind === "shalom" ? 96 : st.kind === "galuyot" ? 70 : 78;
		const plat2 = new Mesh(new BoxGeometry(11, .7, platLen), platMat);
		plat2.position.set(p.x, py + .55, p.z);
		plat2.rotation.y = yaw;
		add(plat2);
		const yellow = new Mesh(new BoxGeometry(.28, .08, platLen), new MeshBasicMaterial({ color: 15778816 }));
		yellow.position.set(p.x + s.rx * 5.2, py + .96, p.z + s.rz * 5.2);
		yellow.rotation.y = yaw;
		add(yellow);
		const yellow2 = yellow.clone();
		yellow2.position.set(p.x - s.rx * 5.2, py + .96, p.z - s.rz * 5.2);
		add(yellow2);
		const canopyW = st.kind === "uni" ? 12 : 14;
		const canopy = new Mesh(new BoxGeometry(canopyW, st.kind === "hagana" ? .35 : .45, platLen * .92), st.kind === "shalom" ? glassRoof : silver);
		canopy.position.set(p.x, py + (st.kind === "hagana" ? 5.4 : 6.6), p.z);
		canopy.rotation.y = yaw;
		add(canopy);
		const colN = st.kind === "savidor" ? 7 : 5;
		for (const sx of [-4.6, 4.6]) for (let k = -colN; k <= colN; k++) {
			const col = new Mesh(new CylinderGeometry(.2, .24, 5.4, 6), cream);
			const along = k * (platLen / (colN * 2 + 1.2));
			col.position.set(p.x + s.rx * sx + s.tx * along, py + 3.1, p.z + s.rz * sx + s.tz * along);
			add(col);
		}
		const hallP = tlv(st.lat, st.kind === "uni" ? 34.7988 : 34.7932);
		const nearHall = nearestIndex(built.samples, hallP.x, hallP.z, 0);
		const hallW = st.kind === "savidor" ? 28 : st.kind === "shalom" ? 24 : st.kind === "hagana" ? 18 : 16;
		const hallH = st.kind === "hagana" ? 6.4 : st.kind === "uni" ? 7.2 : 9.2;
		const hallMat = st.kind === "hagana" ? conc : st.kind === "uni" ? terracotta : cream;
		const hall = new Mesh(new BoxGeometry(hallW, hallH, st.kind === "savidor" ? 40 : 24), hallMat);
		hall.position.set(hallP.x, hallH * .5, hallP.z);
		add(hall);
		if (st.kind === "savidor") {
			const wing = new Mesh(new BoxGeometry(18, 5.2, 22), cream);
			wing.position.set(hallP.x + 16, 2.6, hallP.z);
			add(wing);
			const vault = new Mesh(new CylinderGeometry(15, 15, 38, 22, 1, true, Math.PI, Math.PI), paleGlass);
			vault.rotation.z = Math.PI / 2;
			vault.position.set(hallP.x, hallH + 1.6, hallP.z);
			add(vault);
			for (let i = 0; i < 6; i++) {
				const rib = new Mesh(new TorusGeometry(15.1, .2, 6, 18, Math.PI), bandMat);
				rib.rotation.z = Math.PI / 2;
				rib.position.set(hallP.x - 16 + i * 6.4, hallH + 1.6, hallP.z);
				add(rib);
			}
			const spanS = Math.hypot(hallP.x - p.x, hallP.z - p.z);
			const foot = new Mesh(new BoxGeometry(Math.max(10, spanS), 1.35, 5.6), paleGlass);
			foot.position.set((hallP.x + p.x) * .5, 10.6, (hallP.z + p.z) * .5);
			foot.rotation.y = Math.atan2(p.x - hallP.x, p.z - hallP.z);
			add(foot);
		}
		if (st.kind === "uni") {
			const shed = new Mesh(new BoxGeometry(14, 3.2, 18), cream);
			shed.position.set(hallP.x, 2, hallP.z + 16);
			add(shed);
		}
		if (st.kind === "shalom") {
			const glassWall = new Mesh(new BoxGeometry(.4, 7.2, 20), glassRoof);
			glassWall.position.set(hallP.x + 10, 5.2, hallP.z);
			add(glassWall);
			const az = tlv(32.0744, 34.7922);
			const spanA = Math.hypot(az.x - hallP.x, az.z - hallP.z);
			const brA = new Mesh(new BoxGeometry(Math.max(8, spanA), 1.2, 5), paleGlass);
			brA.position.set((hallP.x + az.x) * .5, 11.2, (hallP.z + az.z) * .5);
			brA.rotation.y = Math.atan2(az.x - hallP.x, az.z - hallP.z);
			add(brA);
			const spanH = Math.hypot(hallP.x - p.x, hallP.z - p.z);
			const over = new Mesh(new BoxGeometry(spanH, 1.35, 6.2), paleGlass);
			over.position.set((hallP.x + p.x) * .5, 12.6, (hallP.z + p.z) * .5);
			over.rotation.y = Math.atan2(hallP.x - p.x, hallP.z - p.z);
			add(over);
		}
		const stSign = new Mesh(new PlaneGeometry(18, 4.2), gantryMat("stn-" + st.kind));
		stSign.position.set(hallP.x, hallH + 3.2, hallP.z);
		stSign.rotation.y = Math.PI / 2;
		add(stSign);
		if (nearHall.dist > built.width / 2 + 10) hit(hallP.x, hallP.z, 8);
	}
	const makeTrain = (phase, trackX) => {
		const g = new Group();
		const roof = new MeshStandardMaterial({
			color: 15264494,
			roughness: .52,
			metalness: 0
		});
		bag.push(roof);
		for (let c = 0; c < 6; c++) {
			const body = new Mesh(new BoxGeometry(2.9, 4.1, 17.2), silver);
			body.position.set(0, 2.55, -c * 18.2);
			g.add(body);
			const band = new Mesh(new BoxGeometry(2.96, .5, 17.3), purpleStripe);
			band.position.set(0, 1.55, -c * 18.2);
			g.add(band);
			const band2 = new Mesh(new BoxGeometry(2.96, .22, 17.3), redStripe);
			band2.position.set(0, 1.88, -c * 18.2);
			g.add(band2);
			const deck = new Mesh(new BoxGeometry(2.92, .12, 17.1), bandMat);
			deck.position.set(0, 3.15, -c * 18.2);
			g.add(deck);
			const cap = new Mesh(new BoxGeometry(2.72, .16, 17.05), roof);
			cap.position.set(0, 4.68, -c * 18.2);
			g.add(cap);
			const winStrip = new Mesh(new BoxGeometry(.07, .95, 16.2), darkGlass);
			winStrip.position.set(1.48, 2.42, -c * 18.2);
			g.add(winStrip);
			const winStripB = winStrip.clone();
			winStripB.position.x = -1.48;
			g.add(winStripB);
			const winStrip2 = new Mesh(new BoxGeometry(.07, .78, 16.2), darkGlass);
			winStrip2.position.set(1.48, 3.68, -c * 18.2);
			g.add(winStrip2);
			const winStrip2B = winStrip2.clone();
			winStrip2B.position.x = -1.48;
			g.add(winStrip2B);
		}
		const nose = new Mesh(new BoxGeometry(2.7, 3.4, 4.6), silver);
		nose.position.set(0, 2.4, 10.4);
		g.add(nose);
		const yellow = new Mesh(new BoxGeometry(2.74, .7, 4.65), new MeshStandardMaterial({
			color: 14854168,
			roughness: .45
		}));
		yellow.position.set(0, 1.15, 10.4);
		g.add(yellow);
		const screen = new Mesh(new BoxGeometry(2.2, 1.15, .12), darkGlass);
		screen.position.set(0, 3.05, 12.68);
		g.add(screen);
		const dest = new Mesh(new PlaneGeometry(2.35, .42), gantryMat("dest-rail"));
		dest.position.set(0, 3.58, 12.74);
		g.add(dest);
		const panArm = new Mesh(new BoxGeometry(.12, 1.6, .12), bandMat);
		panArm.position.set(0, 5.4, -2);
		g.add(panArm);
		const panBar = new Mesh(new BoxGeometry(2.2, .08, .08), bandMat);
		panBar.position.set(0, 6.2, -2);
		g.add(panBar);
		const lightL = new Mesh(new BoxGeometry(.55, .42, .2), new MeshBasicMaterial({ color: 16774344 }));
		lightL.position.set(-.85, 1.5, 12.7);
		g.add(lightL);
		const lightR = lightL.clone();
		lightR.position.x = .85;
		g.add(lightR);
		g.scale.setScalar(1.08);
		group.add(g);
		const mid = built.width / 2 + 9;
		const pts = built.samples.map((s) => ({
			x: s.x + s.rx * (mid + trackX),
			y: s.y + .42,
			z: s.z + s.rz * (mid + trackX),
			yaw: Math.atan2(s.tx, s.tz)
		}));
		movers.push({
			mesh: g,
			pts,
			speed: .14,
			phase
		});
	};
	makeTrain(0, -1.15);
	makeTrain(.48, 1.15);
	const arrowTex = getLaneArrow();
	if (!arrowTex) throw new Error("lane arrow missing");
	const arrowMat = new MeshBasicMaterial({
		map: arrowTex,
		side: 2
	});
	for (const lat of [
		32.055,
		32.061,
		32.067,
		32.0735,
		32.083,
		32.092,
		32.101
	]) for (const lon of [34.795, 34.7971]) {
		const p = tlv(lat, lon);
		const near = nearestIndex(built.samples, p.x, p.z, 0);
		const s = built.samples[near.index];
		const hw = built.width / 2 + 1.8;
		for (const side of [-1, 1]) {
			const post = new Mesh(new BoxGeometry(.7, 9.2, .7), conc);
			post.position.set(s.x + s.rx * hw * side, s.y + 4.6, s.z + s.rz * hw * side);
			add(post);
		}
		const beam = new Mesh(new BoxGeometry(built.width + 2.4, .7, 1.15), conc);
		beam.position.set(s.x, s.y + 9.3, s.z);
		beam.rotation.y = Math.atan2(s.rx, s.rz);
		add(beam);
		for (let i = 0; i < 8; i++) {
			const off = -built.width / 2 + 3.2 + i * (built.width - 6.4) / 7;
			const ar = new Mesh(new PlaneGeometry(3.2, 4.6), arrowMat);
			ar.position.set(s.x + s.rx * off, s.y + 7.4, s.z + s.rz * off);
			ar.rotation.y = Math.atan2(s.tx, s.tz);
			add(ar);
		}
	}
}
function buildCaesarea(context) {
	const { bag, built, add, hit, stone, white, cream, wood, darkArch } = context;
	const aq = cae(32.5078, 34.8976);
	{
		const n = nearestIndex(built.samples, aq.x, aq.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			aq.x = s.x + s.rx * (built.width / 2 + 28);
			aq.z = s.z + s.rz * (built.width / 2 + 28);
		}
	}
	const sandA = new MeshStandardMaterial({
		color: 14865072,
		roughness: .96
	});
	bag.push(sandA);
	const beach = new Mesh(new PlaneGeometry(80, 160), sandA);
	beach.rotation.x = -Math.PI / 2;
	beach.position.set(aq.x - 8, .04, aq.z);
	add(beach);
	const archGeo = new BoxGeometry(3.2, 10.4, 2.2);
	const capGeo = new BoxGeometry(4.2, 1.2, 3.2);
	const spanGeo = new BoxGeometry(3.4, 1.4, 7.2);
	for (let tier = 0; tier < 2; tier++) {
		const y0 = tier * 10.6;
		for (let i = 0; i < 22; i++) {
			const z = aq.z - 70 + i * 7.2;
			const pierA = new Mesh(archGeo, stone);
			pierA.position.set(aq.x, 5.2 + y0, z);
			add(pierA);
			const cap = new Mesh(capGeo, stone);
			cap.position.set(aq.x, 10.6 + y0, z);
			add(cap);
			if (i < 21) {
				const span = new Mesh(spanGeo, stone);
				span.position.set(aq.x, 9.2 + y0, z + 3.6);
				add(span);
				const hole = new Mesh(new CylinderGeometry(2.1, 2.1, 3.6, 12, 1, false, 0, Math.PI), darkArch);
				hole.rotation.z = Math.PI / 2;
				hole.position.set(aq.x, 4.4 + y0, z + 3.6);
				add(hole);
			}
		}
	}
	const channel = new Mesh(new BoxGeometry(2.4, .7, 154), stone);
	channel.position.set(aq.x, 21.6, aq.z);
	add(channel);
	const hp = cae(32.4988, 34.8896);
	const hippo = new Mesh(new TorusGeometry(32, 1.5, 8, 40), stone);
	hippo.scale.set(1.55, 1, 1);
	hippo.rotation.x = Math.PI / 2;
	hippo.position.set(hp.x, .95, hp.z);
	add(hippo);
	const spine = new Mesh(new BoxGeometry(4.4, 1.5, 42), stone);
	spine.position.set(hp.x, .85, hp.z);
	add(spine);
	const th = cae(32.4962, 34.8894);
	const theater = new Mesh(new CylinderGeometry(15, 24, 10, 22, 1, true, 0, Math.PI * 1.2), stone);
	theater.position.set(th.x, 5.4, th.z);
	theater.rotation.y = .6;
	add(theater);
	for (let r = 0; r < 7; r++) {
		const seat = new Mesh(new TorusGeometry(10 + r * 2.15, .48, 6, 22, Math.PI * 1.15), stone);
		seat.rotation.x = Math.PI / 2;
		seat.rotation.z = .6;
		seat.position.set(th.x, 1.15 + r * 1.2, th.z);
		add(seat);
	}
	const stage = new Mesh(new BoxGeometry(24, 1.2, 6.4), stone);
	stage.position.set(th.x + 4, .7, th.z + 8);
	add(stage);
	hit(aq.x, aq.z, 6);
	hit(hp.x, hp.z, 16);
	hit(th.x, th.z, 14);
	const cit = cae(32.5014, 34.8902);
	const citKeep = new Mesh(new BoxGeometry(18, 14, 18), stone);
	citKeep.position.set(cit.x, 7.2, cit.z);
	add(citKeep);
	for (const [dx, dz] of [
		[-8, -8],
		[8, -8],
		[-8, 8],
		[8, 8]
	]) {
		const tw = new Mesh(new CylinderGeometry(3.2, 3.6, 16, 10), stone);
		tw.position.set(cit.x + dx, 8.2, cit.z + dz);
		add(tw);
	}
	hit(cit.x, cit.z, 12);
	const mole = cae(32.5004, 34.8884);
	const breakw = new Mesh(new BoxGeometry(8, 2.2, 72), stone);
	breakw.position.set(mole.x, 1, mole.z);
	add(breakw);
	const breakw2 = new Mesh(new BoxGeometry(48, 1.8, 7), stone);
	breakw2.position.set(mole.x + 16, .8, mole.z - 32);
	add(breakw2);
	for (let i = 0; i < 7; i++) {
		const hx = mole.x + 6 + i % 2 * 6;
		const hz = mole.z - 20 + i * 7;
		const hull = new Mesh(new BoxGeometry(2.2, .7, 7.6), i % 2 ? white : cream);
		hull.position.set(hx, .4, hz);
		add(hull);
		const mast = new Mesh(new CylinderGeometry(.06, .08, 8.4, 5), wood);
		mast.position.set(hx, 4.8, hz);
		add(mast);
	}
	const colRow = cae(32.5062, 34.897);
	for (let i = 0; i < 6; i++) {
		const stump = new Mesh(new CylinderGeometry(.7, .85, 4.2 + i % 3, 8), stone);
		stump.position.set(colRow.x + 10, 2.2, colRow.z - 12 + i * 5);
		add(stump);
	}
}
function buildDeadsea(context) {
	const { bag, built, add, glowAt, hit, white, cream, terracotta, wood, cyan, darkGlass } = context;
	const salt = new MeshStandardMaterial({
		color: 15261908,
		roughness: .55,
		envMapIntensity: .55
	});
	const peach = new MeshStandardMaterial({
		color: 15255720,
		roughness: .7
	});
	bag.push(salt, peach);
	const offSea = (p, pad = 24) => {
		const n = nearestIndex(built.samples, p.x, p.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			p.x = s.x + s.rx * (built.width / 2 + pad);
			p.z = s.z + s.rz * (built.width / 2 + pad);
		}
		return p;
	};
	const herods = offSea(dsea(31.1992, 35.3682), 28);
	const herBase = new Mesh(new BoxGeometry(22, 8, 14), cream);
	herBase.position.set(herods.x, 4, herods.z);
	add(herBase);
	for (let i = 0; i < 8; i++) {
		const col = new Mesh(new CylinderGeometry(.45, .55, 8, 8), white);
		col.position.set(herods.x - 9 + i * 2.6, 8.2, herods.z + 7.4);
		add(col);
	}
	const ped = new Mesh(new ConeGeometry(12, 5.4, 4), cream);
	ped.rotation.y = Math.PI / 4;
	ped.position.set(herods.x, 14.8, herods.z);
	add(ped);
	const herTower = new Mesh(new BoxGeometry(12, 18, 10), cream);
	herTower.position.set(herods.x, 17, herods.z);
	add(herTower);
	const dan = offSea(dsea(31.2016, 35.3688), 26);
	const danM = new Mesh(new BoxGeometry(16, 28, 11), darkGlass);
	danM.position.set(dan.x, 14, dan.z);
	add(danM);
	const danWing = new Mesh(new BoxGeometry(22, 8, 14), cream);
	danWing.position.set(dan.x, 4, dan.z);
	add(danWing);
	const iso = offSea(dsea(31.2034, 35.3692), 26);
	for (let i = 0; i < 4; i++) {
		const step = new Mesh(new BoxGeometry(20 - i * 3.2, 6, 12 - i * 1.4), white);
		step.position.set(iso.x, 3.2 + i * 6.2, iso.z);
		add(step);
	}
	const lot = offSea(dsea(31.1974, 35.3678), 26);
	const lotM = new Mesh(new BoxGeometry(26, 12, 12), peach);
	lotM.position.set(lot.x, 6, lot.z);
	add(lotM);
	for (let y = 3; y < 11; y += 2.6) {
		const bal = new Mesh(new BoxGeometry(27, .14, 13), cream);
		bal.position.set(lot.x, y, lot.z);
		add(bal);
	}
	const pool = new Mesh(new BoxGeometry(18, .28, 8), cyan);
	pool.position.set(lot.x, .2, lot.z + 12);
	add(pool);
	for (let i = 0; i < 6; i++) {
		const ux = lot.x - 8 + i * 3.2;
		const uz = lot.z + 18;
		const pole = new Mesh(new CylinderGeometry(.06, .08, 2.4, 5), wood);
		pole.position.set(ux, 1.2, uz);
		add(pole);
		const umb = new Mesh(new ConeGeometry(1.6, .35, 8), i % 2 ? white : peach);
		umb.position.set(ux, 2.4, uz);
		add(umb);
	}
	const leoD = dsea(31.2052, 35.3696);
	const leoM = new Mesh(new BoxGeometry(14, 20, 10), cream);
	leoM.position.set(leoD.x, 10, leoD.z);
	add(leoM);
	const leoBand = new Mesh(new BoxGeometry(15, 2.2, 11), terracotta);
	leoBand.position.set(leoD.x, 16, leoD.z);
	add(leoBand);
	const eb = dsea(31.201, 35.372);
	for (let i = 0; i < 8; i++) {
		const terrace = new Mesh(new CylinderGeometry(6 + i * 3.2, 8 + i * 3.2, .55, 16), salt);
		terrace.position.set(eb.x, .12 + i * .08, eb.z + i * 4);
		add(terrace);
	}
	for (let i = 0; i < 10; i++) {
		const pan = new Mesh(new BoxGeometry(22 + i % 3 * 6, .12, 14), salt);
		const p = dsea(31.186 + i * .004, 35.3705);
		pan.position.set(p.x, .08, p.z);
		add(pan);
	}
	const moab = new MeshStandardMaterial({
		color: 11565650,
		roughness: .95,
		flatShading: true
	});
	bag.push(moab);
	for (let i = 0; i < 7; i++) {
		const p = dsea(31.17 + i * .012, 35.402);
		const mtn = new Mesh(new ConeGeometry(22 + i % 3 * 8, 28 + i % 4 * 10, 5), moab);
		mtn.position.set(p.x, 14, p.z);
		add(mtn);
	}
	glowAt(eb.x, 18, eb.z, 16769200, 28, 24);
	hit(herods.x, herods.z, 10);
	hit(dan.x, dan.z, 8);
	hit(iso.x, iso.z, 10);
	hit(lot.x, lot.z, 12);
	hit(leoD.x, leoD.z, 8);
}
function buildAcre(context) {
	const { bag, built, add, glowAt, hit, stone, white, cream, terracotta, wood, darkArch } = context;
	const ochreH = new MeshStandardMaterial({
		color: 12093784,
		roughness: .88,
		envMapIntensity: .28
	});
	const ochreD = new MeshStandardMaterial({
		color: 9398336,
		roughness: .9
	});
	bag.push(ochreH, ochreD);
	const offAcre = (p, pad = 26) => {
		const n = nearestIndex(built.samples, p.x, p.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			p.x = s.x + s.rx * (built.width / 2 + pad);
			p.z = s.z + s.rz * (built.width / 2 + pad);
		}
		return p;
	};
	const sea = offAcre(acr(32.9198, 35.0676), 32);
	const wall = new Mesh(new BoxGeometry(110, 12, 5.4), stone);
	wall.position.set(sea.x, 6, sea.z);
	add(wall);
	const wall2 = new Mesh(new BoxGeometry(5.4, 12, 70), stone);
	wall2.position.set(sea.x - 52, 6, sea.z + 28);
	add(wall2);
	for (let i = 0; i < 16; i++) {
		const merlon = new Mesh(new BoxGeometry(2.8, 2.2, 5.8), stone);
		merlon.position.set(sea.x - 50 + i * 7, 13, sea.z);
		add(merlon);
	}
	const burj = new Mesh(new CylinderGeometry(5.6, 6.4, 18, 12), stone);
	burj.position.set(sea.x - 52, 10, sea.z);
	add(burj);
	const burjCap = new Mesh(new CylinderGeometry(6.8, 5.4, 2, 12), stone);
	burjCap.position.set(sea.x - 52, 20, sea.z);
	add(burjCap);
	for (let i = 0; i < 14; i++) {
		const lat = 32.9192 + i % 7 * 55e-5;
		const lon = 35.0692 + Math.floor(i / 7) * 7e-4;
		const p = acr(lat, lon);
		if (nearestIndex(built.samples, p.x, p.z, 0).dist < built.width / 2 + 8) continue;
		const h = 5.2 + i % 4 * .9;
		const house = new Mesh(new BoxGeometry(6.8, h, 7.4), i % 3 === 0 ? stone : i % 3 === 1 ? ochreH : ochreD);
		house.position.set(p.x, h * .5, p.z);
		add(house);
		const rf = new Mesh(new BoxGeometry(7.4, .32, 8), terracotta);
		rf.position.set(p.x, h + .18, p.z);
		add(rf);
		const door = new Mesh(new CylinderGeometry(.65, .65, .24, 10, 1, false, 0, Math.PI), darkArch);
		door.rotation.z = Math.PI / 2;
		door.position.set(p.x, 1.6, p.z + 3.8);
		add(door);
		hit(p.x, p.z, 3.4);
	}
	const kh = offAcre(acr(32.9206, 35.0688), 28);
	const khan = new Mesh(new BoxGeometry(26, 7.6, 26), stone);
	khan.position.set(kh.x, 3.8, kh.z);
	add(khan);
	const court = new Mesh(new BoxGeometry(14, .2, 14), cream);
	court.position.set(kh.x, .18, kh.z);
	add(court);
	for (const [dx, dz] of [
		[-9, -9],
		[9, -9],
		[-9, 9],
		[9, 9]
	]) {
		const col = new Mesh(new CylinderGeometry(.72, .9, 12, 8), stone);
		col.position.set(kh.x + dx, 8, kh.z + dz);
		add(col);
	}
	const clock = new Mesh(new CylinderGeometry(2.1, 2.6, 30, 10), stone);
	clock.position.set(kh.x, 17, kh.z);
	add(clock);
	const clockBox = new Mesh(new BoxGeometry(4.4, 4.4, 4.4), cream);
	clockBox.position.set(kh.x, 32.2, kh.z);
	add(clockBox);
	for (let i = 0; i < 4; i++) {
		const a = i * Math.PI / 2;
		const face = new Mesh(new CircleGeometry(1.05, 16), cream);
		face.position.set(kh.x + Math.sin(a) * 2.25, 32.2, kh.z + Math.cos(a) * 2.25);
		face.lookAt(kh.x + Math.sin(a) * 8, 32.2, kh.z + Math.cos(a) * 8);
		add(face);
	}
	const clockCap = new Mesh(new ConeGeometry(3, 3.6, 4), terracotta);
	clockCap.rotation.y = Math.PI / 4;
	clockCap.position.set(kh.x, 36.2, kh.z);
	add(clockCap);
	const ms = acr(32.9226, 35.0718);
	const mosque = new Mesh(new BoxGeometry(20, 9, 20), cream);
	mosque.position.set(ms.x, 5.2, ms.z);
	add(mosque);
	const green = new MeshStandardMaterial({
		color: 3050072,
		roughness: .38,
		metalness: .22,
		envMapIntensity: .85
	});
	bag.push(green);
	const domeA = new Mesh(new SphereGeometry(7.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), green);
	domeA.position.set(ms.x, 10.4, ms.z);
	add(domeA);
	for (const [dx, dz] of [
		[-7, -7],
		[7, -7],
		[-7, 7],
		[7, 7]
	]) {
		const sd = new Mesh(new SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), green);
		sd.position.set(ms.x + dx, 10.2, ms.z + dz);
		add(sd);
	}
	const minaret2 = new Mesh(new CylinderGeometry(1.15, 1.45, 32, 10), cream);
	minaret2.position.set(ms.x + 12, 18, ms.z + 6);
	add(minaret2);
	const minaBalc = new Mesh(new CylinderGeometry(2.2, 1.6, 1.5, 10), cream);
	minaBalc.position.set(ms.x + 12, 32, ms.z + 6);
	add(minaBalc);
	const minaCap = new Mesh(new ConeGeometry(1.7, 3.4, 8), green);
	minaCap.position.set(ms.x + 12, 34.8, ms.z + 6);
	add(minaCap);
	const cit = acr(32.9238, 35.0714);
	const citadel = new Mesh(new BoxGeometry(22, 14, 18), stone);
	citadel.position.set(cit.x, 8, cit.z);
	add(citadel);
	const citT = new Mesh(new BoxGeometry(8, 10, 8), stone);
	citT.position.set(cit.x - 8, 18, cit.z);
	add(citT);
	const quay = acr(32.9192, 35.0682);
	const pier = new Mesh(new BoxGeometry(8, .4, 48), stone);
	pier.position.set(quay.x, .2, quay.z);
	add(pier);
	for (let i = 0; i < 10; i++) {
		const hx = quay.x - 10 - i % 2 * 6;
		const hz = quay.z - 20 + i * 5.2;
		const hull = new Mesh(new BoxGeometry(2.2, .75, 7.6), i % 2 ? white : cream);
		hull.position.set(hx, .45, hz);
		add(hull);
		const mast = new Mesh(new CylinderGeometry(.06, .08, 8, 5), wood);
		mast.position.set(hx, 4.7, hz);
		add(mast);
	}
	glowAt(ms.x, 16, ms.z, 16771248, 28, 22);
	hit(sea.x, sea.z, 6);
	hit(ms.x, ms.z, 11);
	hit(kh.x, kh.z, 9);
	hit(cit.x, cit.z, 9);
}
function buildCentralpark(context) {
	const { add, glowAt, hit, stone, white, copper } = context;
	const font = new Mesh(new TorusGeometry(5.4, .45, 8, 24), stone);
	font.rotation.x = Math.PI / 2;
	font.position.set(8, .6, 12);
	add(font);
	const angel = new Mesh(new CylinderGeometry(.5, .8, 8, 8), copper);
	angel.position.set(8, 5, 12);
	add(angel);
	const gug = new Mesh(new CylinderGeometry(10, 6.5, 16, 16), white);
	gug.position.set(52, 8, 40);
	add(gug);
	const gugTop = new Mesh(new CylinderGeometry(4.2, 8.4, 6, 16), white);
	gugTop.position.set(52, 18, 40);
	add(gugTop);
	glowAt(8, 8, 12, 16771264, 22, 20);
	hit(52, 40, 10);
}
function buildTimessquare(context) {
	const { add, glowAt, hit, darkGlass, paleGlass, placeNycSkyline } = context;
	const oneTs = new Mesh(new BoxGeometry(12, 52, 10), darkGlass);
	oneTs.position.set(18, 26, 8);
	add(oneTs);
	const ball = new Mesh(new SphereGeometry(2.4, 12, 10), paleGlass);
	ball.position.set(18, 56, 8);
	add(ball);
	placeNycSkyline(-48, -40, .62);
	glowAt(18, 56, 8, 16737962, 36, 28);
	hit(18, 8, 8);
}
function buildBrooklynbridge(context) {
	const { add, glowAt, copper, placeNycSkyline, placeGothicTower } = context;
	placeGothicTower(-8, -36, 28);
	placeGothicTower(28, 62, 28);
	placeNycSkyline(-70, 8, .55);
	const liberty = new Mesh(new CylinderGeometry(1.4, 2.1, 16, 8), copper);
	liberty.position.set(90, 9, -48);
	add(liberty);
	glowAt(90, 18, -48, 16764006, 22, 20);
}
function buildManhattan(context) {
	const { add, glowAt, hit, copper, gold, placeNycSkyline } = context;
	placeNycSkyline(8, -120, 1);
	const liberty = new Mesh(new CylinderGeometry(1.6, 2.4, 18, 8), copper);
	liberty.position.set(-96, 10, -180);
	add(liberty);
	const torch = new Mesh(new SphereGeometry(1.1, 8, 6), gold);
	torch.position.set(-96, 21, -180);
	add(torch);
	glowAt(-96, 22, -180, 16764006, 24, 22);
	hit(-96, -180, 6);
}
function buildBeersheva(context) {
	const { built, add, glowAt, hit, stone, copper, cream, terracotta } = context;
	const ch = bsv(31.252, 34.791);
	{
		const n = nearestIndex(built.samples, ch.x, ch.z, 0);
		if (n.dist < built.width / 2 + 12) {
			const s = built.samples[n.index];
			ch.x = s.x + s.rx * (built.width / 2 + 26);
			ch.z = s.z + s.rz * (built.width / 2 + 26);
		}
	}
	const hall = new Mesh(new BoxGeometry(9.2, 32, 9.2), cream);
	hall.position.set(ch.x, 16, ch.z);
	add(hall);
	const hall2 = new Mesh(new BoxGeometry(14, 8, 14), cream);
	hall2.position.set(ch.x, 4, ch.z);
	add(hall2);
	const cap = new Mesh(new ConeGeometry(7.6, 8, 4), copper);
	cap.position.set(ch.x, 36, ch.z);
	add(cap);
	const aw = bsv(31.2435, 34.79);
	const well = new Mesh(new CylinderGeometry(6.5, 6.5, 1.4, 16), stone);
	well.position.set(aw.x, .8, aw.z);
	add(well);
	const wellWall = new Mesh(new CylinderGeometry(5.2, 5.2, 2.4, 16, 1, true), stone);
	wellWall.position.set(aw.x, 1.6, aw.z);
	add(wellWall);
	const wellRoof = new Mesh(new ConeGeometry(7.2, 3.6, 4), terracotta);
	wellRoof.position.set(aw.x, 4.4, aw.z);
	add(wellRoof);
	const uni = bsv(31.262, 34.801);
	for (let i = 0; i < 4; i++) {
		const campus = new Mesh(new BoxGeometry(14, 8 + i, 10), cream);
		campus.position.set(uni.x + i * 8, 4 + i * .4, uni.z);
		add(campus);
	}
	glowAt(ch.x, 36, ch.z, 16765056, 36, 28);
	hit(ch.x, ch.z, 8);
	hit(aw.x, aw.z, 8);
}
function buildNetanya(context) {
	const { bag, isNight, emitList, built, add, glowAt, hit, stone, white, cream, terracotta, cyan, paleGlass } = context;
	const sq = net(32.3318, 34.8565);
	{
		const n = nearestIndex(built.samples, sq.x, sq.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			sq.x = s.x + s.rx * (built.width / 2 + 22);
			sq.z = s.z + s.rz * (built.width / 2 + 22);
		}
	}
	const plaza = new Mesh(new CylinderGeometry(16, 16, .18, 28), stone);
	plaza.position.set(sq.x, .12, sq.z);
	add(plaza);
	const lawn = new Mesh(new CylinderGeometry(10, 10, .16, 20), new MeshStandardMaterial({
		color: 3832386,
		roughness: .92
	}));
	lawn.position.set(sq.x, .22, sq.z);
	add(lawn);
	const fountain = new Mesh(new CylinderGeometry(3.4, 3.8, 1.1, 16), stone);
	fountain.position.set(sq.x, .7, sq.z);
	add(fountain);
	const spray = new Mesh(new CylinderGeometry(.2, 1.1, 2.4, 8), cyan);
	spray.position.set(sq.x, 2.2, sq.z);
	add(spray);
	const clock = new Mesh(new CylinderGeometry(2.15, 2.55, 20, 8), cream);
	clock.position.set(sq.x + 10, 10, sq.z + 6);
	add(clock);
	const faceMatN = new MeshStandardMaterial({
		color: 15657176,
		roughness: .5,
		emissive: 3351050,
		emissiveIntensity: isNight ? .7 : .1
	});
	emitList.push({
		mat: faceMatN,
		night: .7,
		day: .1
	});
	for (let i = 0; i < 4; i++) {
		const a = i * Math.PI / 2;
		const face = new Mesh(new CircleGeometry(1.2, 16), faceMatN);
		face.position.set(sq.x + 10 + Math.sin(a) * 2.6, 16.5, sq.z + 6 + Math.cos(a) * 2.6);
		face.lookAt(sq.x + 10 + Math.sin(a) * 8, 16.5, sq.z + 6 + Math.cos(a) * 8);
		add(face);
	}
	const hat = new Mesh(new ConeGeometry(3.1, 4.2, 4), terracotta);
	hat.rotation.y = Math.PI / 4;
	hat.position.set(sq.x + 10, 22.4, sq.z + 6);
	add(hat);
	const cl = net(32.334, 34.851);
	const chalkN = new MeshStandardMaterial({
		color: 15525592,
		roughness: .9,
		flatShading: true
	});
	const sandB = new MeshStandardMaterial({
		color: 15259572,
		roughness: 1
	});
	bag.push(chalkN, sandB);
	for (let i = 0; i < 10; i++) {
		const p = net(32.327 + i * .0014, 34.8488);
		const cliff = new Mesh(new BoxGeometry(18, 16 + i % 3 * 3, 7), chalkN);
		cliff.position.set(p.x, 7 + i % 3, p.z);
		cliff.rotation.y = .08;
		add(cliff);
	}
	const beach = new Mesh(new PlaneGeometry(70, 220), sandB);
	beach.rotation.x = -Math.PI / 2;
	beach.position.set(cl.x - 36, .04, cl.z);
	add(beach);
	const leo = net(32.3282, 34.8492);
	const leonardo = new Mesh(new BoxGeometry(14, 42, 12), white);
	leonardo.position.set(leo.x, 21, leo.z);
	add(leonardo);
	for (let y = 5; y < 40; y += 3.2) {
		const sl = new Mesh(new BoxGeometry(14.8, .16, 12.8), cream);
		sl.position.set(leo.x, y, leo.z);
		add(sl);
	}
	const leoCap = new Mesh(new BoxGeometry(10, 4.2, 8), paleGlass);
	leoCap.position.set(leo.x, 44, leo.z);
	add(leoCap);
	const isr = net(32.3266, 34.8494);
	const isrotel = new Mesh(new CylinderGeometry(6.4, 7.2, 48, 12), white);
	isrotel.position.set(isr.x, 24, isr.z);
	add(isrotel);
	for (let y = 6; y < 46; y += 3.6) {
		const ring = new Mesh(new TorusGeometry(6.7, .12, 5, 14), cream);
		ring.rotation.x = Math.PI / 2;
		ring.position.set(isr.x, y, isr.z);
		add(ring);
	}
	const isrHat = new Mesh(new CylinderGeometry(8, 5.2, 5.4, 12), cream);
	isrHat.position.set(isr.x, 50.4, isr.z);
	add(isrHat);
	const pr = net(32.3316, 34.8488);
	const princess = new Mesh(new BoxGeometry(28, 16, 12), white);
	princess.position.set(pr.x, 8, pr.z);
	add(princess);
	const prWing = new Mesh(new BoxGeometry(10, 22, 10), cream);
	prWing.position.set(pr.x + 12, 11, pr.z);
	add(prWing);
	for (let y = 4; y < 14; y += 2.6) {
		const bal = new Mesh(new BoxGeometry(29, .14, 13), cream);
		bal.position.set(pr.x, y, pr.z);
		add(bal);
	}
	const sea = net(32.3338, 34.8486);
	const seasons = new Mesh(new BoxGeometry(12, 32, 14), paleGlass);
	seasons.position.set(sea.x, 16, sea.z);
	seasons.rotation.y = .12;
	add(seasons);
	const seaSlab = new Mesh(new BoxGeometry(16, 8, 16), cream);
	seaSlab.position.set(sea.x, 4, sea.z);
	add(seaSlab);
	const lift = net(32.3324, 34.8484);
	const liftT = new Mesh(new BoxGeometry(4.2, 18, 4.2), white);
	liftT.position.set(lift.x, 9, lift.z);
	add(liftT);
	const liftC = new Mesh(new BoxGeometry(3.4, 3.2, 3.4), paleGlass);
	liftC.position.set(lift.x, 8.4, lift.z);
	add(liftC);
	for (let i = 0; i < 12; i++) {
		const step = new Mesh(new BoxGeometry(6.4, .28, 2.2), stone);
		step.position.set(lift.x - 6, 14 - i * 1.15, lift.z - 2 - i * 1.4);
		add(step);
	}
	const herzl = net(32.329, 34.858);
	for (let i = 0; i < 4; i++) {
		const shop = new Mesh(new BoxGeometry(7.2, 8 + i % 2 * 2.4, 8), i % 2 ? cream : white);
		shop.position.set(herzl.x + 14 + i * 9, 4.4 + i % 2 * 1.2, herzl.z);
		add(shop);
		const awn = new Mesh(new BoxGeometry(7.4, .2, 2.4), terracotta);
		awn.position.set(herzl.x + 14 + i * 9, 3.6, herzl.z + 4.4);
		add(awn);
	}
	glowAt(cl.x, 20, cl.z, 16771248, 40, 24);
	hit(sq.x + 10, sq.z + 6, 5);
	hit(leo.x, leo.z, 8);
	hit(isr.x, isr.z, 8);
	hit(pr.x, pr.z, 12);
	hit(sea.x, sea.z, 8);
}
function buildHw1(context) {
	const { bag, built, add, hit, placeTunnel, stone, white, cream, terracotta, darkGlass } = context;
	const vineMat = new MeshStandardMaterial({
		color: 3178290,
		roughness: .92,
		flatShading: true
	});
	const ochre = new MeshStandardMaterial({
		color: 13213808,
		roughness: .82
	});
	const olive = new MeshStandardMaterial({
		color: 4874808,
		roughness: .9,
		flatShading: true
	});
	const steel = new MeshStandardMaterial({
		color: 4210752,
		roughness: .45,
		metalness: .62
	});
	bag.push(vineMat, ochre, olive, steel);
	const lt = hwy1(31.8338, 34.9774);
	const nave = new Mesh(new BoxGeometry(22, 14, 12), cream);
	nave.position.set(lt.x, 8.4, lt.z);
	add(nave);
	const aisle = new Mesh(new BoxGeometry(10, 9, 16), cream);
	aisle.position.set(lt.x, 6.2, lt.z + 8);
	add(aisle);
	const gable = new Mesh(new ConeGeometry(9.4, 7.2, 4), terracotta);
	gable.rotation.y = Math.PI / 4;
	gable.position.set(lt.x, 18.8, lt.z);
	add(gable);
	const bell = new Mesh(new BoxGeometry(5.4, 26, 5.4), cream);
	bell.position.set(lt.x - 10, 16, lt.z - 2);
	add(bell);
	for (let y = 8; y < 24; y += 5.2) {
		const arch = new Mesh(new BoxGeometry(2.2, 2.8, .35), darkGlass);
		arch.position.set(lt.x - 10, y, lt.z + 2.8);
		add(arch);
	}
	const bellCap = new Mesh(new ConeGeometry(4.2, 6.4, 4), terracotta);
	bellCap.rotation.y = Math.PI / 4;
	bellCap.position.set(lt.x - 10, 32.2, lt.z - 2);
	add(bellCap);
	const cross = new Mesh(new BoxGeometry(.28, 3.4, .28), white);
	cross.position.set(lt.x - 10, 36.4, lt.z - 2);
	add(cross);
	const cloister = new Mesh(new BoxGeometry(28, 6.4, 18), cream);
	cloister.position.set(lt.x + 8, 3.4, lt.z - 16);
	add(cloister);
	const court = new Mesh(new BoxGeometry(10, .2, 8), olive);
	court.position.set(lt.x + 8, .12, lt.z - 16);
	add(court);
	for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) {
		const vx = lt.x - 36 + c * 2.4;
		const vz = lt.z + 18 + r * 3.2;
		const vine = new Mesh(new BoxGeometry(.55, 1.1 + (c + r) % 3 * .35, .55), vineMat);
		vine.position.set(vx, .7, vz);
		add(vine);
	}
	const yad = hwy1(31.8382, 34.9786);
	const hall = new Mesh(new BoxGeometry(18, 7.2, 24), cream);
	hall.position.set(yad.x, 4, yad.z);
	add(hall);
	const towerKeep = new Mesh(new BoxGeometry(8, 16, 8), stone);
	towerKeep.position.set(yad.x + 12, 10, yad.z);
	add(towerKeep);
	for (let i = 0; i < 5; i++) {
		const hx = yad.x - 10 + i * 7;
		const hz = yad.z + 18;
		const hull = new Mesh(new BoxGeometry(3.6, 1.4, 5.4), steel);
		hull.position.set(hx, 1.1, hz);
		add(hull);
		const tur = new Mesh(new CylinderGeometry(1.15, 1.3, 1.1, 10), steel);
		tur.position.set(hx, 2.1, hz);
		add(tur);
		const barrel = new Mesh(new CylinderGeometry(.16, .2, 4.4, 6), steel);
		barrel.rotation.x = Math.PI / 2;
		barrel.position.set(hx, 2.15, hz + 2.6);
		add(barrel);
	}
	const sg = hwy1(31.815, 35.023);
	const sgNear = nearestIndex(built.samples, sg.x, sg.z, 0);
	const sgs = built.samples[sgNear.index];
	const sgyaw = Math.atan2(sgs.tx, sgs.tz);
	placeTunnel(sg.x, sg.z, sgyaw, 28, built.width * .55, 9.2, sgs.y);
	for (const side of [-1, 1]) {
		const wall = new Mesh(new BoxGeometry(4.2, 3.6, 64), stone);
		wall.position.set(sg.x + sgs.rx * side * 22, 2.2 + sgs.y, sg.z + sgs.rz * side * 22);
		add(wall);
		for (let k = 0; k < 8; k++) {
			const mer = new Mesh(new BoxGeometry(3.2, 1.4, 4.2), stone);
			mer.position.set(sg.x + sgs.rx * side * 22, 4.6 + sgs.y, sg.z + sgs.rz * side * 22 + sgs.tz * (-28 + k * 8));
			add(mer);
		}
	}
	const over = new Mesh(new BoxGeometry(built.width + 10, 1.4, 12), stone);
	over.position.set(sg.x, sgs.y + 9.6, sg.z);
	over.rotation.y = sgyaw;
	add(over);
	const cs = hwy1(31.8094, 35.0388);
	const keepB = new Mesh(new BoxGeometry(18, 14, 16), stone);
	keepB.position.set(cs.x, 18, cs.z);
	add(keepB);
	const keepT = new Mesh(new BoxGeometry(10, 10, 10), stone);
	keepT.position.set(cs.x - 4, 28, cs.z + 3);
	add(keepT);
	for (let i = 0; i < 6; i++) {
		const a = i / 6 * Math.PI * 2;
		const ruin = new Mesh(new BoxGeometry(4.4, 3.2 + i % 3 * 2.4, 3.6), stone);
		ruin.position.set(cs.x + Math.cos(a) * 16, 10 + i % 3, cs.z + Math.sin(a) * 14);
		ruin.rotation.y = a;
		add(ruin);
	}
	const hill = new Mesh(new ConeGeometry(18, 12, 7), olive);
	hill.position.set(cs.x, 4, cs.z);
	add(hill);
	hit(lt.x, lt.z, 12);
	hit(lt.x - 10, lt.z - 2, 5);
	hit(yad.x, yad.z, 10);
	hit(cs.x, cs.z, 12);
}
function buildHerzliya(context) {
	const { built, add, glowAt, hit, stone, white, glass, cream, terracotta, wood, darkGlass, paleGlass } = context;
	const mar = hzl(32.1635, 34.7965);
	{
		const n = nearestIndex(built.samples, mar.x, mar.z, 0);
		if (n.dist < built.width / 2 + 10) {
			const s = built.samples[n.index];
			mar.x = s.x + s.rx * (built.width / 2 + 26);
			mar.z = s.z + s.rz * (built.width / 2 + 26);
		}
	}
	const breakw = new Mesh(new BoxGeometry(6, 1.6, 72), stone);
	breakw.position.set(mar.x - 42, .7, mar.z);
	add(breakw);
	const breakw2 = new Mesh(new BoxGeometry(48, 1.4, 5), stone);
	breakw2.position.set(mar.x - 22, .6, mar.z - 34);
	add(breakw2);
	const dock = new Mesh(new BoxGeometry(52, .5, 12), wood);
	dock.position.set(mar.x - 8, .32, mar.z);
	add(dock);
	const lightH = new Mesh(new CylinderGeometry(.8, 1.2, 16, 8), white);
	lightH.position.set(mar.x - 44, 8, mar.z - 30);
	add(lightH);
	const lightCap = new Mesh(new CylinderGeometry(1.6, 1.3, 1.8, 8), cream);
	lightCap.position.set(mar.x - 44, 16.8, mar.z - 30);
	add(lightCap);
	const lamp = new Mesh(new SphereGeometry(.8, 8, 6), new MeshBasicMaterial({ color: 16777136 }));
	lamp.position.set(mar.x - 44, 18.2, mar.z - 30);
	add(lamp);
	for (let i = 0; i < 10; i++) {
		const hx = mar.x - 28 - i % 2 * 8;
		const hz = mar.z - 26 + i * 6.4;
		const hull = new Mesh(new BoxGeometry(2.2, .7, 8.6), i % 3 === 0 ? cream : white);
		hull.position.set(hx, .45, hz);
		hull.rotation.y = .08;
		add(hull);
		const cabin = new Mesh(new BoxGeometry(1.5, 1.1, 3.4), white);
		cabin.position.set(hx, 1.3, hz);
		add(cabin);
		const mast = new Mesh(new CylinderGeometry(.06, .08, 10, 5), wood);
		mast.position.set(hx, 5.6, hz);
		add(mast);
	}
	const rest = new Mesh(new BoxGeometry(18, 5.2, 10), cream);
	rest.position.set(mar.x + 8, 2.7, mar.z + 4);
	add(rest);
	const restRoof = new Mesh(new BoxGeometry(20, .4, 12), terracotta);
	restRoof.position.set(mar.x + 8, 5.5, mar.z + 4);
	add(restRoof);
	const ac = hzl(32.1662, 34.8004);
	const accadia = new Mesh(new CylinderGeometry(14, 16, 18, 20, 1, false, .35, 2.45), white);
	accadia.position.set(ac.x, 9.2, ac.z);
	accadia.rotation.y = -.4;
	add(accadia);
	for (let i = 0; i < 7; i++) {
		const terrace = new Mesh(new CylinderGeometry(14.6, 16.4, .2, 20, 1, false, .35, 2.45), cream);
		terrace.position.set(ac.x, 2.4 + i * 2.4, ac.z);
		terrace.rotation.y = -.4;
		add(terrace);
	}
	const acRoof = new Mesh(new CylinderGeometry(12, 16, 2.2, 20, 1, false, .35, 2.45), cream);
	acRoof.position.set(ac.x, 19.2, ac.z);
	acRoof.rotation.y = -.4;
	add(acRoof);
	const danH = hzl(32.1648, 34.8016);
	const daniel = new Mesh(new BoxGeometry(14, 36, 18), white);
	daniel.position.set(danH.x, 18, danH.z);
	add(daniel);
	for (let y = 5; y < 34; y += 3.1) {
		const sl = new Mesh(new BoxGeometry(15.2, .16, 19.2), cream);
		sl.position.set(danH.x, y, danH.z);
		add(sl);
	}
	const danCap = new Mesh(new BoxGeometry(10, 3.2, 12), paleGlass);
	danCap.position.set(danH.x, 37.4, danH.z);
	add(danCap);
	const ar = hzl(32.1612, 34.8068);
	const arena = new Mesh(new BoxGeometry(38, 11, 24), white);
	arena.position.set(ar.x, 5.6, ar.z);
	add(arena);
	const atrium = new Mesh(new CylinderGeometry(8.4, 8.4, 14, 6), glass);
	atrium.position.set(ar.x, 16, ar.z);
	add(atrium);
	const atriumRoof = new Mesh(new CylinderGeometry(9.2, 7.2, 3.2, 6), paleGlass);
	atriumRoof.position.set(ar.x, 24.4, ar.z);
	add(atriumRoof);
	const wingA = new Mesh(new BoxGeometry(16, 8, 18), cream);
	wingA.position.set(ar.x - 22, 4.2, ar.z + 4);
	add(wingA);
	const wingB = new Mesh(new BoxGeometry(16, 8, 18), cream);
	wingB.position.set(ar.x + 22, 4.2, ar.z - 4);
	add(wingB);
	const ht = hzl(32.1594, 34.8096);
	const cubeA = new Mesh(new BoxGeometry(14, 28, 14), glass);
	cubeA.position.set(ht.x, 14, ht.z);
	cubeA.rotation.y = .18;
	add(cubeA);
	const cubeB = new Mesh(new BoxGeometry(11, 22, 11), paleGlass);
	cubeB.position.set(ht.x + 16, 11, ht.z + 8);
	cubeB.rotation.y = -.22;
	add(cubeB);
	const cubeC = new Mesh(new BoxGeometry(12, 18, 18), cream);
	cubeC.position.set(ht.x - 14, 9, ht.z + 10);
	add(cubeC);
	const stepTw = new Mesh(new BoxGeometry(9, 34, 9), darkGlass);
	stepTw.position.set(ht.x + 8, 17, ht.z - 12);
	add(stepTw);
	for (let i = 0; i < 4; i++) {
		const slab = new Mesh(new BoxGeometry(16 - i * 2.2, 5.4, 16 - i * 2.2), paleGlass);
		slab.position.set(ht.x - 22, 3.2 + i * 6, ht.z - 8);
		add(slab);
	}
	glowAt(ht.x, 28, ht.z, 8967400, 44, 30);
	glowAt(ac.x, 18, ac.z, 16769200, 32, 28);
	hit(mar.x, mar.z, 10);
	hit(ac.x, ac.z, 12);
	hit(danH.x, danH.z, 10);
	hit(ar.x, ar.z, 16);
	hit(ht.x, ht.z, 10);
	hit(ht.x + 16, ht.z + 8, 7);
}
function buildHanikra(context) {
	const { bag, add, glowAt, hit, stone, white, cyan } = context;
	const chalk = new MeshStandardMaterial({
		color: 15789282,
		roughness: .9,
		envMapIntensity: .22
	});
	const darkCave = new MeshStandardMaterial({
		color: 920586,
		roughness: 1
	});
	bag.push(chalk, darkCave);
	const cl = nik(33.093, 35.104);
	for (let i = 0; i < 10; i++) {
		const h = 18 + i % 4 * 6;
		const cliff = new Mesh(new BoxGeometry(22, h, 12), chalk);
		cliff.position.set(cl.x, h * .4, cl.z - 28 + i * 11);
		add(cliff);
		const cave = new Mesh(new CylinderGeometry(2.8, 3.2, 10, 12), darkCave);
		cave.rotation.z = Math.PI / 2;
		cave.position.set(cl.x - 10, 3.6 + i % 3, cl.z - 28 + i * 11);
		add(cave);
		if (i % 2 === 0) {
			const cave2 = new Mesh(new SphereGeometry(3.4, 10, 8), darkCave);
			cave2.position.set(cl.x - 8, 6, cl.z - 24 + i * 11);
			add(cave2);
		}
	}
	const portal = new Mesh(new BoxGeometry(10, 7, 14), stone);
	portal.position.set(cl.x + 14, 3.6, cl.z);
	add(portal);
	const arch = new Mesh(new BoxGeometry(5, 4.4, 8), darkCave);
	arch.position.set(cl.x + 14, 3.2, cl.z);
	add(arch);
	for (let i = 0; i < 4; i++) {
		const cabin = new Mesh(new BoxGeometry(4.4, 2.6, 3.4), white);
		cabin.position.set(cl.x + 2 - i * 8, 12 + i * 4, cl.z + 10);
		add(cabin);
		const win = new Mesh(new BoxGeometry(3.2, 1.4, .15), cyan);
		win.position.set(cl.x + 2 - i * 8, 12.1 + i * 4, cl.z + 11.8);
		add(win);
	}
	const cable = new Mesh(new CylinderGeometry(.09, .09, 42, 5), new MeshStandardMaterial({
		color: 3355184,
		metalness: .7,
		roughness: .3
	}));
	cable.rotation.z = .55;
	cable.position.set(cl.x - 8, 20, cl.z + 10);
	add(cable);
	glowAt(cl.x, 10, cl.z, 16771248, 24, 20);
	hit(cl.x, cl.z, 14);
}
function buildHaifaport(context) {
	const { bag, add, glowAt, hit, stone, terracotta } = context;
	const rust = new MeshStandardMaterial({
		color: 12081714,
		metalness: .45,
		roughness: .42
	});
	bag.push(rust);
	const pt = hai(32.819, 35.004);
	for (const c of [
		{
			lat: 32.8186,
			lon: 35.0028
		},
		{
			lat: 32.819,
			lon: 35.004
		},
		{
			lat: 32.8194,
			lon: 35.0052
		}
	]) {
		const p = hai(c.lat, c.lon);
		const crane = new Mesh(new BoxGeometry(1.4, 34, 1.4), rust);
		crane.position.set(p.x, 17, p.z);
		add(crane);
		const jib = new Mesh(new BoxGeometry(36, .9, .9), rust);
		jib.position.set(p.x + 16, 34, p.z);
		add(jib);
	}
	const colony = [
		{
			lat: 32.8194,
			lon: 34.9892,
			w: 9,
			h: 8
		},
		{
			lat: 32.8198,
			lon: 34.99,
			w: 10,
			h: 9
		},
		{
			lat: 32.82,
			lon: 34.9908,
			w: 8.4,
			h: 7.6
		},
		{
			lat: 32.8192,
			lon: 34.9914,
			w: 11,
			h: 8.8
		}
	];
	for (let i = 0; i < colony.length; i++) {
		const c = colony[i];
		const p = hai(c.lat, c.lon);
		const house = new Mesh(new BoxGeometry(c.w, c.h, 10), stone);
		house.position.set(p.x, c.h * .5, p.z);
		add(house);
		const rf = new Mesh(new ConeGeometry(c.w * .7, 3, 4), terracotta);
		rf.rotation.y = Math.PI / 4;
		rf.position.set(p.x, c.h + 1.5, p.z);
		add(rf);
		hit(p.x, p.z, 5);
	}
	glowAt(pt.x, 34, pt.z, 16755302, 40, 28);
	hit(pt.x, pt.z, 10);
}
function buildStellamaris(context) {
	const { def, bag, built, add, glowAt, hit, stone, white, cream, darkArch } = context;
	const sm = hai(32.8275, 34.9705);
	const abbey = new Mesh(new BoxGeometry(18, 12, 14), cream);
	abbey.position.set(sm.x, 8, sm.z);
	add(abbey);
	const nave = new Mesh(new BoxGeometry(10, 8, 16), cream);
	nave.position.set(sm.x, 6, sm.z + 8);
	add(nave);
	const dome = new Mesh(new SphereGeometry(5.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
	dome.position.set(sm.x, 14, sm.z);
	add(dome);
	const cross = new Mesh(new BoxGeometry(.25, 3.2, .25), white);
	cross.position.set(sm.x, 20.2, sm.z);
	add(cross);
	const bg = hai(32.8118, 34.9884);
	for (let i = 0; i < 6; i++) {
		const terrace = new Mesh(new BoxGeometry(22 - i, 1.1, 8), new MeshStandardMaterial({
			color: i % 2 ? 13623492 : 15262936,
			roughness: .85
		}));
		terrace.position.set(bg.x, 10 + i * 2.2, bg.z - i * 7);
		add(terrace);
	}
	glowAt(sm.x, 22, sm.z, 16771248, 36, 24);
	hit(sm.x, sm.z, 12);
	const cave = hai(32.8268, 34.9692);
	const caveM = new Mesh(new BoxGeometry(8, 4.2, 10), stone);
	caveM.position.set(cave.x, 2.2, cave.z);
	add(caveM);
	const caveH = new Mesh(new BoxGeometry(3.2, 3.4, .4), darkArch);
	caveH.position.set(cave.x, 1.8, cave.z + 5.2);
	add(caveH);
	hit(cave.x, cave.z, 5);
	const lightH = hai(32.8298, 34.9698);
	const lh = new Mesh(new CylinderGeometry(1.4, 1.8, 14, 10), cream);
	lh.position.set(lightH.x, 7, lightH.z);
	add(lh);
	const lhCap = new Mesh(new ConeGeometry(2, 2.2, 8), cream);
	lhCap.position.set(lightH.x, 15.2, lightH.z);
	add(lhCap);
	const lantern = new Mesh(new SphereGeometry(1.1, 10, 8), new MeshBasicMaterial({ color: 16773828 }));
	lantern.position.set(lightH.x, 14.4, lightH.z);
	add(lantern);
	glowAt(lightH.x, 14, lightH.z, 16771248, 16, 14);
	const pineM = new MeshStandardMaterial({
		color: 1853992,
		roughness: .9,
		flatShading: true
	});
	const barkM = new MeshStandardMaterial({
		color: 3811356,
		roughness: .92
	});
	bag.push(pineM, barkM);
	const valleyX = def.water ? def.water.x : sm.x - 40;
	const valleyZ = def.water ? def.water.z : sm.z;
	const railM = new MeshStandardMaterial({
		color: 13157564,
		metalness: .35,
		roughness: .45
	});
	bag.push(railM);
	for (let i = 3; i < built.samples.length - 3; i += 3) {
		const s = built.samples[i];
		const vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
		const d = built.width / 2 + 1.5;
		const px = s.x + s.rx * d * vs;
		const pz = s.z + s.rz * d * vs;
		const post = new Mesh(new CylinderGeometry(.06, .07, 1.15, 5), railM);
		post.position.set(px, s.y + .7, pz);
		add(post);
		const ms = -vs;
		const tx = s.x + s.rx * (built.width / 2 + 10) * ms;
		const tz = s.z + s.rz * (built.width / 2 + 10) * ms;
		const trunk = new Mesh(new CylinderGeometry(.2, .32, 6.2, 6), barkM);
		trunk.position.set(tx, s.y + 3.1, tz);
		add(trunk);
		for (let L = 0; L < 3; L++) {
			const needle = new Mesh(new ConeGeometry(2 - L * .38, 4.2, 7), pineM);
			needle.position.set(tx, s.y + 5.2 + L * 2.2, tz);
			add(needle);
		}
	}
}
function buildTiberias(context) {
	const { add, glowAt, hit, stone, white, cream, wood, cyan } = context;
	const pr = tib(32.788, 35.543);
	const wall = new Mesh(new BoxGeometry(80, 1.15, 3.4), stone);
	wall.position.set(pr.x, .7, pr.z);
	add(wall);
	for (let i = 0; i < 8; i++) {
		const palm = new Mesh(new CylinderGeometry(.22, .32, 7, 6), wood);
		palm.position.set(pr.x - 28 + i * 8, 3.6, pr.z + 4);
		add(palm);
		const frond = new Mesh(new SphereGeometry(1.8, 6, 4), new MeshStandardMaterial({
			color: 3832392,
			roughness: .9
		}));
		frond.position.set(pr.x - 28 + i * 8, 7.6, pr.z + 4);
		add(frond);
	}
	const hm = tib(32.7685, 35.549);
	const bath = new Mesh(new CylinderGeometry(8, 8.6, 5, 12), stone);
	bath.position.set(hm.x, 2.6, hm.z);
	add(bath);
	const bathPool = new Mesh(new CylinderGeometry(5.4, 5.4, .4, 12), cyan);
	bathPool.position.set(hm.x, .3, hm.z);
	add(bathPool);
	const sp = tib(32.7865, 35.5425);
	const peter = new Mesh(new BoxGeometry(12, 8, 10), cream);
	peter.position.set(sp.x, 4.2, sp.z);
	add(peter);
	const peterD = new Mesh(new SphereGeometry(3.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), white);
	peterD.position.set(sp.x, 8.4, sp.z);
	add(peterD);
	const cas = tib(32.786, 35.5412);
	const castle = new Mesh(new BoxGeometry(14, 10, 12), stone);
	castle.position.set(cas.x, 5.2, cas.z);
	add(castle);
	glowAt(pr.x, 10, pr.z, 16771264, 22, 18);
	hit(pr.x, pr.z, 8);
	hit(hm.x, hm.z, 9);
	hit(sp.x, sp.z, 7);
	hit(cas.x, cas.z, 8);
}
function buildGolan(context) {
	const { bag, built, add, glowAt, hit, stone } = context;
	const basalt = new MeshStandardMaterial({
		color: 4866104,
		roughness: .95,
		flatShading: true
	});
	const grass = new MeshStandardMaterial({
		color: 4876856,
		roughness: .92,
		flatShading: true
	});
	bag.push(basalt, grass);
	const kz = gol(32.992, 35.689);
	{
		const n = nearestIndex(built.samples, kz.x, kz.z, 0);
		if (n.dist < built.width / 2 + 16) {
			const s = built.samples[n.index];
			kz.x = s.x + s.rx * (built.width / 2 + 34);
			kz.z = s.z + s.rz * (built.width / 2 + 34);
		}
	}
	for (let i = 0; i < 8; i++) {
		const hill = new Mesh(new ConeGeometry(16 + i * 2, 18 + i * 3.4, 6), i % 2 ? grass : basalt);
		hill.position.set(kz.x + 36 + i % 4 * 18, 9, kz.z - 24 + Math.floor(i / 2) * 26);
		add(hill);
	}
	const keepB = new Mesh(new BoxGeometry(22, 12, 18), stone);
	keepB.position.set(kz.x - 20, 8, kz.z + 10);
	add(keepB);
	for (const [dx, dz] of [
		[-9, -7],
		[9, -7],
		[-9, 7],
		[9, 7]
	]) {
		const t = new Mesh(new CylinderGeometry(3.2, 3.8, 16, 8), stone);
		t.position.set(kz.x - 20 + dx, 10, kz.z + 10 + dz);
		add(t);
	}
	glowAt(kz.x - 20, 16, kz.z + 10, 16769184, 24, 20);
	hit(kz.x, kz.z, 12);
	hit(kz.x - 20, kz.z + 10, 12);
}
function buildHermon(context) {
	const { def, bag, built, add, glowAt, hit, stone, cream, bandMat } = context;
	const snowM = new MeshStandardMaterial({
		color: 15922938,
		roughness: .88
	});
	const rock = new MeshStandardMaterial({
		color: 9077880,
		roughness: .94,
		flatShading: true
	});
	const pineM = new MeshStandardMaterial({
		color: 1854002,
		roughness: .9,
		flatShading: true
	});
	const bark = new MeshStandardMaterial({
		color: 3811868,
		roughness: .92
	});
	bag.push(snowM, rock, pineM, bark);
	const peak = her(33.3112, 35.79);
	her(33.2688, 35.7712);
	for (let i = 0; i < 10; i++) {
		const a = i / 10 * Math.PI * 1.4 - .4;
		const r = 90 + i % 3 * 32;
		36 + i % 4 * 14;
		const mtn = new Mesh(new DodecahedronGeometry(14 + i % 3 * 5, 0), i < 6 ? snowM : rock);
		mtn.position.set(peak.x + Math.cos(a) * r, def.elevation(1) + 10 + i * 4, peak.z + 22 + Math.sin(a) * r * .7);
		mtn.scale.set(2.2, 3.4, 2);
		add(mtn);
	}
	const peakCone = new Mesh(new DodecahedronGeometry(34, 0), snowM);
	peakCone.position.set(peak.x + 22, def.elevation(1) + 22, peak.z + 48);
	peakCone.scale.set(2.4, 3.2, 2.2);
	add(peakCone);
	const liftA = her(33.2924, 35.7802);
	const liftB = her(33.3084, 35.7876);
	const nA = nearestIndex(built.samples, liftA.x, liftA.z, 0);
	const sA = built.samples[nA.index];
	liftA.x = sA.x + sA.rx * (built.width / 2 + 20);
	liftA.z = sA.z + sA.rz * (built.width / 2 + 20);
	const nB = nearestIndex(built.samples, liftB.x, liftB.z, 0);
	const sB = built.samples[nB.index];
	liftB.x = sB.x + sB.rx * (built.width / 2 + 20);
	liftB.z = sB.z + sB.rz * (built.width / 2 + 20);
	const postGeo = new CylinderGeometry(.35, .5, 14, 8);
	const postA = new Mesh(postGeo, rock);
	postA.position.set(liftA.x, sA.y + 7, liftA.z);
	add(postA);
	const postB = new Mesh(postGeo, rock);
	postB.position.set(liftB.x, sB.y + 7, liftB.z);
	add(postB);
	const dx = liftB.x - liftA.x;
	const dy = sB.y + 13 - (sA.y + 13);
	const dz = liftB.z - liftA.z;
	const cable = new Mesh(new CylinderGeometry(.08, .08, Math.hypot(dx, dy, dz) || 1, 6), bandMat);
	cable.position.set((liftA.x + liftB.x) * .5, (sA.y + sB.y) * .5 + 13, (liftA.z + liftB.z) * .5);
	cable.rotation.z = Math.atan2(dx, dy || 1);
	cable.rotation.x = Math.atan2(dz, Math.hypot(dx, dy) || 1);
	add(cable);
	for (let k = 0; k < 6; k++) {
		const a = k / 6 * Math.PI * 2;
		const shoulder = new Mesh(new DodecahedronGeometry(16, 0), k % 2 ? snowM : rock);
		shoulder.position.set(peak.x + 22 + Math.cos(a) * 48, def.elevation(1) + 6, peak.z + 48 + Math.sin(a) * 36);
		shoulder.scale.set(1.6, 2.1, 1.5);
		add(shoulder);
	}
	for (let i = 2; i < built.samples.length - 2; i += 2) {
		const s = built.samples[i];
		const towardPeak = s.rx * (peak.x - s.x) + s.rz * (peak.z - s.z) >= 0 ? 1 : -1;
		const berm = new Mesh(new BoxGeometry(7.4, 1.6, 4.2), snowM);
		berm.position.set(s.x + s.rx * (built.width / 2 + 6.4) * towardPeak, s.y + .7, s.z + s.rz * (built.width / 2 + 6.4) * towardPeak);
		berm.rotation.y = Math.atan2(s.tx, s.tz);
		add(berm);
	}
	const nSlope = Math.min(40, built.samples.length);
	const stepS = Math.max(1, Math.floor(built.samples.length / nSlope));
	for (let i = 0; i < built.samples.length; i += stepS) {
		const s = built.samples[i];
		const ms = s.rx * (peak.x - s.x) + s.rz * (peak.z - s.z) >= 0 ? 1 : -1;
		-ms;
		const d = built.width / 2 + 32;
		const mx = s.x + s.rx * d * ms;
		const mz = s.z + s.rz * d * ms;
		const h = 16 + s.y * .22;
		const ridge = new Mesh(new DodecahedronGeometry(10 + i % 3 * 3, 0), s.y > 40 ? snowM : rock);
		ridge.position.set(mx, s.y + h * .22, mz);
		ridge.scale.set(1.4, 1.8 + s.y * .012, 1.2);
		add(ridge);
	}
	const village = [
		{
			lat: 33.2692,
			lon: 35.7704
		},
		{
			lat: 33.2698,
			lon: 35.7718
		},
		{
			lat: 33.2684,
			lon: 35.7724
		},
		{
			lat: 33.2704,
			lon: 35.7708
		},
		{
			lat: 33.269,
			lon: 35.77
		},
		{
			lat: 33.2708,
			lon: 35.7714
		}
	];
	for (let i = 0; i < village.length; i++) {
		const p = her(village[i].lat, village[i].lon);
		const n = nearestIndex(built.samples, p.x, p.z, 0);
		const extra = built.width / 2 + 22;
		if (n.dist < extra) {
			const s = built.samples[n.index];
			p.x = s.x + s.rx * extra;
			p.z = s.z + s.rz * extra;
		}
		const house = new Mesh(new BoxGeometry(6.4, 4.2, 7.4), stone);
		house.position.set(p.x, built.samples[n.index].y + 2.2, p.z);
		add(house);
		const rf = new Mesh(new ConeGeometry(5.4, 2.8, 4), snowM);
		rf.rotation.y = Math.PI / 4;
		rf.position.set(p.x, built.samples[n.index].y + 5.8, p.z);
		add(rf);
	}
	const lodgeY = def.elevation(.9);
	{
		const nL = nearestIndex(built.samples, peak.x, peak.z, 0);
		const sL = built.samples[nL.index];
		const lx = sL.x + sL.rx * (built.width / 2 + 22);
		const lz = sL.z + sL.rz * (built.width / 2 + 22);
		const lodge = new Mesh(new BoxGeometry(16, 5.4, 10), rock);
		lodge.position.set(lx, lodgeY + 2.8, lz);
		add(lodge);
		const roof = new Mesh(new ConeGeometry(11, 5.4, 4), snowM);
		roof.position.set(lx, lodgeY + 8.4, lz);
		add(roof);
	}
	const snowField = new Mesh(new CircleGeometry(168, 24), snowM);
	snowField.rotation.x = -Math.PI / 2;
	snowField.position.set(peak.x + 18, def.elevation(1) + .35, peak.z + 28);
	add(snowField);
	const mid = her(33.294, 35.778);
	const midY = def.elevation(.55);
	for (let i = 0; i < 12; i++) {
		const u = i / 11;
		const px = lerp(mid.x, peak.x, u);
		const pz = lerp(mid.z, peak.z, u);
		const py = lerp(midY, lodgeY, u);
		const pole = new Mesh(new CylinderGeometry(.16, .2, 9, 6), cream);
		pole.position.set(px + 10, py + 4.5, pz + 6);
		add(pole);
		if (i < 11) {
			const cable = new Mesh(new BoxGeometry(Math.hypot(peak.x - mid.x, peak.z - mid.z) / 11 + .4, .07, .07), cream);
			cable.position.set(px + 10 + (peak.x - mid.x) / 22, py + 8.6 + (lodgeY - midY) / 22, pz + 6 + (peak.z - mid.z) / 22);
			cable.lookAt(peak.x + 10, lodgeY + 9, peak.z + 6);
			add(cable);
		}
		if (i % 2 === 0) {
			const chair = new Mesh(new BoxGeometry(1.4, .15, 1.1), cream);
			chair.position.set(px + 10, py + 6.4, pz + 6);
			add(chair);
		}
	}
	const nim = her(33.2526, 35.7147);
	const fort = new Mesh(new BoxGeometry(16, 9, 12), stone);
	fort.position.set(nim.x, 10, nim.z);
	add(fort);
	const keepT = new Mesh(new BoxGeometry(7, 14, 7), stone);
	keepT.position.set(nim.x, 14, nim.z);
	add(keepT);
	glowAt(peak.x - 18, lodgeY + 10, peak.z - 8, 16771272, 26, 18);
	hit(peak.x - 18, peak.z - 8, 9);
	hit(nim.x, nim.z, 10);
}
function buildHw6(context) {
	const { bag, add, hit, wood } = context;
	const conc = new MeshStandardMaterial({
		color: 12105908,
		roughness: .7
	});
	const olive = new MeshStandardMaterial({
		color: 4874808,
		roughness: .9,
		flatShading: true
	});
	const greenSign = new MeshStandardMaterial({
		color: 1731130,
		roughness: .55
	});
	bag.push(conc, olive, greenSign);
	const ks = hwy6(32.134, 34.932);
	const over = new Mesh(new BoxGeometry(42, 1.6, 12), conc);
	over.position.set(ks.x, 9.2, ks.z);
	add(over);
	for (const side of [-1, 1]) {
		const pier = new Mesh(new BoxGeometry(3.6, 9, 3.6), conc);
		pier.position.set(ks.x + side * 18, 4.6, ks.z);
		add(pier);
		const ramp = new Mesh(new BoxGeometry(8, 1.2, 28), conc);
		ramp.position.set(ks.x + side * 22, 4.4, ks.z);
		ramp.rotation.z = side * .18;
		add(ramp);
	}
	const ey = hwy6(32.21, 34.978);
	const gantry = new Mesh(new BoxGeometry(28, .6, 1.4), conc);
	gantry.position.set(ey.x, 8.2, ey.z);
	add(gantry);
	for (const side of [-1, 1]) {
		const pole = new Mesh(new BoxGeometry(.6, 8.2, .6), conc);
		pole.position.set(ey.x + side * 13, 4.2, ey.z);
		add(pole);
	}
	const sign = new Mesh(new BoxGeometry(10, 2.4, .2), greenSign);
	sign.position.set(ey.x, 8.2, ey.z + .8);
	add(sign);
	const nc = hwy6(32.062, 34.948);
	const gantry2 = new Mesh(new BoxGeometry(26, .5, 1.2), conc);
	gantry2.position.set(nc.x, 7.8, nc.z);
	add(gantry2);
	for (let i = 0; i < 24; i++) {
		const p = hwy6(32.09 + i % 8 * .008, 34.956 + Math.floor(i / 8) * .01);
		const tree = new Mesh(new SphereGeometry(2.2 + i % 3 * .4, 6, 5), olive);
		tree.position.set(p.x, 2.4, p.z);
		add(tree);
		const tr = new Mesh(new CylinderGeometry(.16, .28, 2.6, 5), wood);
		tr.position.set(p.x, 1.2, p.z);
		add(tr);
	}
	hit(ks.x, ks.z, 8);
	hit(ey.x, ey.z, 4);
}
function buildHw2(context) {
	const { bag, add, hit, stone, white, cream, terracotta, paleGlass } = context;
	const sandMat = new MeshStandardMaterial({
		color: 15259572,
		roughness: 1,
		flatShading: true
	});
	const palmTrunk = new MeshStandardMaterial({
		color: 6965810,
		roughness: .9
	});
	const palmLeaf = new MeshStandardMaterial({
		color: 3107386,
		roughness: .86,
		flatShading: true
	});
	bag.push(sandMat, palmTrunk, palmLeaf);
	for (let i = 0; i < 16; i++) {
		const p = hwy2(32.35 + i * .008, 34.848 + i % 3 * .004);
		const dune = new Mesh(new SphereGeometry(10 + i % 4 * 3, 7, 5), sandMat);
		dune.scale.y = .38;
		dune.position.set(p.x, 2.2, p.z);
		add(dune);
	}
	for (let i = 0; i < 14; i++) {
		const p = hwy2(32.352 + i * .009, 34.862);
		const trunk = new Mesh(new CylinderGeometry(.18, .32, 7.2, 6), palmTrunk);
		trunk.position.set(p.x, 3.6, p.z);
		add(trunk);
		for (let f = 0; f < 6; f++) {
			const a = f / 6 * Math.PI * 2;
			const fr = new Mesh(new ConeGeometry(.45, 3.2, 5), palmLeaf);
			fr.rotation.z = 1.05;
			fr.rotation.y = a;
			fr.position.set(p.x + Math.cos(a) * .4, 7.4, p.z + Math.sin(a) * .4);
			add(fr);
		}
	}
	const nt = hwy2(32.35, 34.868);
	const n1 = new Mesh(new BoxGeometry(10, 42, 10), white);
	n1.position.set(nt.x, 21, nt.z);
	add(n1);
	const n2 = new Mesh(new CylinderGeometry(5.2, 5.6, 36, 10), cream);
	n2.position.set(nt.x + 16, 18, nt.z + 6);
	add(n2);
	const n3 = new Mesh(new BoxGeometry(8, 28, 12), paleGlass);
	n3.position.set(nt.x - 14, 14, nt.z + 8);
	add(n3);
	const ca = hwy2(32.48, 34.892);
	for (let i = 0; i < 9; i++) {
		const col = new Mesh(new CylinderGeometry(.7, .85, 8.4, 8), stone);
		col.position.set(ca.x - 18 + i * 4.4, 4.4, ca.z + 16);
		add(col);
		if (i < 8) {
			const arch = new Mesh(new TorusGeometry(2.1, .45, 6, 10, Math.PI), stone);
			arch.rotation.z = Math.PI;
			arch.position.set(ca.x - 16 + i * 4.4, 8.4, ca.z + 16);
			add(arch);
		}
	}
	const rest = new Mesh(new BoxGeometry(16, 5.4, 10), cream);
	rest.position.set(ca.x, 2.8, ca.z);
	add(rest);
	const restR = new Mesh(new BoxGeometry(18, .4, 12), terracotta);
	restR.position.set(ca.x, 5.6, ca.z);
	add(restR);
	hit(nt.x, nt.z, 8);
	hit(ca.x, ca.z, 10);
}
function buildHw90(context) {
	const { bag, add, hit, cream, terracotta, wood } = context;
	const red = new MeshStandardMaterial({
		color: 11565650,
		roughness: .95,
		flatShading: true
	});
	const date = new MeshStandardMaterial({
		color: 3107386,
		roughness: .86,
		flatShading: true
	});
	bag.push(red, date);
	for (let i = 0; i < 10; i++) {
		const p = hwy90(30.66 + i * .012, 35.255 + i % 2 * .018);
		const mtn = new Mesh(new ConeGeometry(16 + i % 4 * 6, 22 + i % 5 * 8, 5), red);
		mtn.position.set(p.x, 10 + i % 3 * 4, p.z);
		add(mtn);
	}
	for (let i = 0; i < 12; i++) {
		const p = hwy90(30.668 + i * .008, 35.228);
		const cliff = new Mesh(new BoxGeometry(14, 12 + i % 4 * 4, 8), red);
		cliff.position.set(p.x, 6 + i % 4 * 2, p.z);
		add(cliff);
	}
	for (let i = 0; i < 16; i++) {
		const p = hwy90(30.7 + i % 8 * .006, 35.244 + Math.floor(i / 8) * .008);
		const trunk = new Mesh(new CylinderGeometry(.18, .28, 8.4, 6), wood);
		trunk.position.set(p.x, 4.2, p.z);
		add(trunk);
		const crown = new Mesh(new SphereGeometry(2.4, 6, 5), date);
		crown.position.set(p.x, 8.8, p.z);
		add(crown);
	}
	const stopP = hwy90(30.748, 35.268);
	const stop = new Mesh(new BoxGeometry(14, 5.2, 10), cream);
	stop.position.set(stopP.x, 2.7, stopP.z);
	add(stop);
	const stopR = new Mesh(new BoxGeometry(16, .4, 12), terracotta);
	stopR.position.set(stopP.x, 5.5, stopP.z);
	add(stopR);
	const tank = new Mesh(new CylinderGeometry(2.8, 2.8, 6.4, 12), cream);
	tank.position.set(stopP.x + 12, 3.2, stopP.z);
	add(tank);
	hit(stopP.x, stopP.z, 8);
}
function buildPetah(context) {
	const { add, glowAt, hit, white, cream, paleGlass } = context;
	const mallP = pth(32.091, 34.887);
	const mall = new Mesh(new BoxGeometry(32, 12, 22), cream);
	mall.position.set(mallP.x, 6.2, mallP.z);
	add(mall);
	const atrium = new Mesh(new CylinderGeometry(6.4, 6.4, 10, 12), paleGlass);
	atrium.position.set(mallP.x, 8, mallP.z);
	add(atrium);
	const hospP = pth(32.09, 34.867);
	const hosp = new Mesh(new BoxGeometry(22, 18, 14), white);
	hosp.position.set(hospP.x, 9.2, hospP.z);
	add(hosp);
	const wing = new Mesh(new BoxGeometry(28, 10, 10), white);
	wing.position.set(hospP.x + 8, 5.2, hospP.z + 10);
	add(wing);
	glowAt(mallP.x, 14, mallP.z, 16764040, 36, 24);
	hit(mallP.x, mallP.z, 12);
	hit(hospP.x, hospP.z, 10);
}
function buildRishon(context) {
	const { add, glowAt, hit, stone, white, terracotta, wood } = context;
	const gs = rsh(31.9638, 34.8045);
	const syn = new Mesh(new BoxGeometry(16, 11, 14), stone);
	syn.position.set(gs.x, 5.6, gs.z);
	add(syn);
	for (const sx of [-7, 7]) {
		const tw = new Mesh(new CylinderGeometry(1.6, 1.8, 16, 8), stone);
		tw.position.set(gs.x + sx, 9, gs.z + 6);
		add(tw);
		const twCap = new Mesh(new ConeGeometry(2.1, 3.2, 4), terracotta);
		twCap.position.set(gs.x + sx, 18.4, gs.z + 6);
		add(twCap);
	}
	const dome = new Mesh(new SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
	dome.position.set(gs.x, 11, gs.z);
	add(dome);
	const wn = rsh(31.9618, 34.8072);
	const cellar = new Mesh(new BoxGeometry(20, 7, 12), wood);
	cellar.position.set(wn.x, 3.6, wn.z);
	add(cellar);
	const barrel = new Mesh(new CylinderGeometry(1.6, 1.6, 4, 10), wood);
	barrel.rotation.z = Math.PI / 2;
	barrel.position.set(wn.x, 1.8, wn.z + 8);
	add(barrel);
	glowAt(gs.x, 16, gs.z, 16771264, 24, 20);
	hit(gs.x, gs.z, 10);
	hit(wn.x, wn.z, 10);
}
function buildAshdod(context) {
	const { bag, add, glowAt, hit, white, cream } = context;
	const rust = new MeshStandardMaterial({
		color: 12081714,
		metalness: .45,
		roughness: .42
	});
	bag.push(rust);
	const quay = asd(31.821, 34.647);
	for (const c of [
		{
			lat: 31.8204,
			lon: 34.6464
		},
		{
			lat: 31.8212,
			lon: 34.647
		},
		{
			lat: 31.822,
			lon: 34.6476
		}
	]) {
		const p = asd(c.lat, c.lon);
		const crane = new Mesh(new BoxGeometry(1.4, 32, 1.4), rust);
		crane.position.set(p.x, 16, p.z);
		add(crane);
		const jib = new Mesh(new BoxGeometry(28, .8, .8), rust);
		jib.position.set(p.x + 14, 32, p.z);
		add(jib);
	}
	glowAt(quay.x, 32, quay.z, 16755302, 36, 26);
	const lightP = asd(31.8198, 34.6458);
	const lightA = new Mesh(new CylinderGeometry(1.4, 1.8, 20, 8), cream);
	lightA.position.set(lightP.x, 10, lightP.z);
	add(lightA);
	const lightCap = new Mesh(new ConeGeometry(2.4, 2.8, 8), white);
	lightCap.position.set(lightP.x, 21, lightP.z);
	add(lightCap);
	glowAt(lightP.x, 22, lightP.z, 16771248, 24, 20);
	hit(quay.x, quay.z, 10);
	hit(lightP.x, lightP.z, 6);
}
function buildAshkelon(context) {
	const { add, hit, stone } = context;
	const np = ask(31.663, 34.548);
	for (const w of [
		{
			lat: 31.6622,
			lon: 34.5472
		},
		{
			lat: 31.6628,
			lon: 34.5478
		},
		{
			lat: 31.6634,
			lon: 34.5484
		},
		{
			lat: 31.664,
			lon: 34.549
		},
		{
			lat: 31.6646,
			lon: 34.5496
		}
	]) {
		const p = ask(w.lat, w.lon);
		const wall = new Mesh(new BoxGeometry(12, 8, 3.2), stone);
		wall.position.set(p.x, 4, p.z);
		add(wall);
	}
	const tower = new Mesh(new CylinderGeometry(3.2, 3.8, 14, 8), stone);
	tower.position.set(np.x + 12, 7, np.z);
	add(tower);
	hit(np.x, np.z, 12);
}
function buildScopus(context) {
	const { def, bag, built, add, glowAt, hit, stone, cream, merlonWall, placeDome } = context;
	const peakY = def.elevation(.94);
	jer(31.7866, 35.2344);
	const uniP = jer(31.7938, 35.2452);
	const sc = jer(31.7912, 35.2454);
	{
		const nU = nearestIndex(built.samples, uniP.x, uniP.z, 0);
		const sU = built.samples[nU.index];
		uniP.x = sU.x + sU.rx * (built.width / 2 + 24);
		uniP.z = sU.z + sU.rz * (built.width / 2 + 24);
		const nS = nearestIndex(built.samples, sc.x, sc.z, 0);
		const sS = built.samples[nS.index];
		sc.x = sS.x + sS.rx * (built.width / 2 + 22);
		sc.z = sS.z + sS.rz * (built.width / 2 + 22);
	}
	const uni = new Mesh(new BoxGeometry(26, 12, 14), cream);
	uni.position.set(uniP.x, peakY * .78 + 6, uniP.z);
	add(uni);
	const tower = new Mesh(new BoxGeometry(7, 26, 7), stone);
	tower.position.set(uniP.x + 8, peakY * .78 + 14, uniP.z);
	add(tower);
	const look = new Mesh(new BoxGeometry(16, 1.6, 7), stone);
	look.position.set(sc.x, peakY + .9, sc.z);
	add(look);
	const rail = new Mesh(new BoxGeometry(16, .9, .28), cream);
	rail.position.set(sc.x, peakY + 1.8, sc.z - 3);
	add(rail);
	const dm = jer(31.778, 35.2354);
	const kt = jer(31.7767, 35.2342);
	const kn = jer(31.7766, 35.2054);
	placeDome(dm.x, dm.z);
	merlonWall(kt.x, kt.z + 18, 70, .2, 11);
	merlonWall(kt.x + 28, kt.z - 8, 58, 1.1, 11);
	const knesset = new Mesh(new BoxGeometry(28, 8, 18), stone);
	knesset.position.set(kn.x, 4.2, kn.z);
	add(knesset);
	const pineM = new MeshStandardMaterial({
		color: 2972216,
		roughness: .9,
		flatShading: true
	});
	const hillM = new MeshStandardMaterial({
		color: 12890250,
		roughness: .95,
		flatShading: true
	});
	bag.push(pineM, hillM);
	for (let i = 0; i < 16; i++) {
		const a = i / 16 * Math.PI * 2;
		const r = 220 + i % 4 * 90;
		const h = 48 + i % 5 * 22;
		const hill = new Mesh(new ConeGeometry(36 + i % 3 * 12, h, 5), hillM);
		hill.position.set(sc.x + Math.cos(a) * r, peakY * .12 + h * .18, sc.z + Math.sin(a) * r * .85);
		add(hill);
	}
	for (let i = 0; i < 12; i++) {
		const a = i / 12 * Math.PI * 2;
		const hill = new Mesh(new ConeGeometry(42 + i % 3 * 12, 44 + i % 4 * 16, 5), hillM);
		hill.position.set(sc.x + Math.cos(a) * 420, peakY * .08 + 16, sc.z + Math.sin(a) * 360);
		add(hill);
	}
	for (let i = 0; i < 10; i++) {
		const a = i / 10 * Math.PI * 2 + .2;
		const hill = new Mesh(new ConeGeometry(58 + i % 3 * 16, 52 + i % 4 * 18, 5), hillM);
		hill.position.set(sc.x + Math.cos(a) * 620, 18, sc.z + Math.sin(a) * 540);
		add(hill);
	}
	for (let i = 0; i < 8; i++) {
		const a = i / 8 * Math.PI * 2 + .4;
		const hill = new Mesh(new ConeGeometry(72 + i % 3 * 18, 62 + i % 4 * 22, 5), hillM);
		hill.position.set(sc.x + Math.cos(a) * 920, 22, sc.z + Math.sin(a) * 780);
		add(hill);
	}
	for (let i = 0; i < 32; i++) {
		const t = .06 + i / 32 * .85;
		const p = jer(31.7866 + t * .005, 35.2344 + t * .01 + Math.sin(i) * .0018);
		const y = def.elevation(t);
		const side = i % 2 ? 1 : -1;
		const cyp = new Mesh(new ConeGeometry(1.2, 6.8, 7), pineM);
		cyp.position.set(p.x + side * (13 + i % 4 * 3), y + 3.4, p.z + i % 3 * 3);
		add(cyp);
	}
	glowAt(sc.x, peakY + 4, sc.z, 16769184, 22, 18);
	glowAt(dm.x, 16, dm.z, 16765040, 36, 28);
	hit(uniP.x, uniP.z, 12);
	hit(sc.x, sc.z, 6);
	hit(dm.x, dm.z, 10);
	hit(kn.x, kn.z, 10);
}
function buildWalls(context) {
	const { add, hit, stone, merlonWall, minaret, ottomanGate, placeDome } = context;
	const jg = jer(31.7764, 35.2276);
	const ng = jer(31.7794, 35.226);
	const ds = jer(31.7817, 35.2304);
	const lg = jer(31.7808, 35.2368);
	const dg = jer(31.7748, 35.2342);
	const zg = jer(31.7728, 35.2292);
	const td = jer(31.7762, 35.2284);
	const dm = jer(31.778, 35.2354);
	const kt = jer(31.7767, 35.2342);
	const c = jer(31.7778, 35.2318);
	const inset = (p, d = 26) => {
		const dx = c.x - p.x;
		const dz = c.z - p.z;
		const l = Math.hypot(dx, dz) || 1;
		return {
			x: p.x + dx / l * d,
			z: p.z + dz / l * d
		};
	};
	const jgi = inset(jg);
	const ngi = inset(ng);
	const dsi = inset(ds);
	const lgi = inset(lg);
	const dgi = inset(dg);
	const zgi = inset(zg);
	ottomanGate(jgi.x, jgi.z, .4);
	ottomanGate(dsi.x, dsi.z, 2.2);
	ottomanGate(lgi.x, lgi.z, 3.3);
	ottomanGate(zgi.x, zgi.z, 5.2);
	merlonWall((jgi.x + ngi.x) * .5, (jgi.z + ngi.z) * .5, 48, Math.atan2(ngi.x - jgi.x, ngi.z - jgi.z), 12);
	merlonWall((ngi.x + dsi.x) * .5, (ngi.z + dsi.z) * .5, 58, Math.atan2(dsi.x - ngi.x, dsi.z - ngi.z), 12);
	merlonWall((dsi.x + lgi.x) * .5, (dsi.z + lgi.z) * .5, 62, Math.atan2(lgi.x - dsi.x, lgi.z - dsi.z), 12);
	merlonWall((lgi.x + dgi.x) * .5, (lgi.z + dgi.z) * .5, 70, Math.atan2(dgi.x - lgi.x, dgi.z - lgi.z), 12);
	merlonWall((dgi.x + zgi.x) * .5, (dgi.z + zgi.z) * .5, 55, Math.atan2(zgi.x - dgi.x, zgi.z - dgi.z), 12);
	merlonWall((zgi.x + jgi.x) * .5, (zgi.z + jgi.z) * .5, 52, Math.atan2(jgi.x - zgi.x, jgi.z - zgi.z), 12);
	const citadel = new Mesh(new BoxGeometry(18, 12, 18), stone);
	const tdi = inset(td, 22);
	citadel.position.set(tdi.x, 7, tdi.z);
	add(citadel);
	minaret(tdi.x + 3, tdi.z - 2, 30);
	placeDome(dm.x, dm.z);
	hit(tdi.x, tdi.z, 8);
	hit(kt.x, kt.z, 8);
}
function buildModiin(context) {
	const { add, hit, cream, paleGlass } = context;
	const mallP = mod(31.907, 35.007);
	const mall = new Mesh(new BoxGeometry(24, 12, 16), cream);
	mall.position.set(mallP.x, 6, mallP.z);
	add(mall);
	const atrium = new Mesh(new CylinderGeometry(5.4, 5.4, 11, 12), paleGlass);
	atrium.position.set(mallP.x, 7.2, mallP.z);
	add(atrium);
	hit(mallP.x, mallP.z, 12);
}
function buildRamon(context) {
	const { group, def, bag, shadows, built, add, glowAt, hit, placeTunnel, _dummy, samp, segsOf } = context;
	const dust = new MeshStandardMaterial({
		color: 6961192,
		roughness: .97,
		flatShading: true
	});
	const sand = new MeshStandardMaterial({
		color: 12868658,
		roughness: .94,
		flatShading: true
	});
	const tan = new MeshStandardMaterial({
		color: 14725240,
		roughness: .92,
		flatShading: true
	});
	const creamRock = new MeshStandardMaterial({
		color: 15258280,
		roughness: .9,
		flatShading: true
	});
	const band = new MeshStandardMaterial({
		color: 11028520,
		roughness: .95,
		flatShading: true
	});
	const darkRock = new MeshStandardMaterial({
		color: 4860960,
		roughness: .96,
		flatShading: true
	});
	const rust = new MeshStandardMaterial({
		color: 11037250,
		roughness: .95,
		flatShading: true
	});
	bag.push(dust, sand, tan, creamRock, band, darkRock, rust);
	const floor = ram(30.585, 34.802);
	const floorPlane = new Mesh(new CircleGeometry(420, 28), sand);
	floorPlane.rotation.x = -Math.PI / 2;
	floorPlane.position.set(floor.x, .4, floor.z);
	add(floorPlane);
	const wadi = new Mesh(new BoxGeometry(28, .3, 380), dust);
	wadi.position.set(floor.x + 8, .55, floor.z);
	add(wadi);
	const rockGeo = new DodecahedronGeometry(1, 0);
	const nRock = Math.min(64, built.samples.length);
	const rocks = new InstancedMesh(rockGeo, tan, nRock);
	rocks.castShadow = shadows;
	let rii = 0;
	const stepC = Math.max(1, Math.floor(built.samples.length / nRock));
	for (let i = 0; i < built.samples.length && rii < nRock; i += stepC) {
		const s = built.samples[i];
		const ms = -(s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1);
		const d = built.width / 2 + 22 + i % 4 * 6;
		const cx = s.x + s.rx * d * ms;
		const cz = s.z + s.rz * d * ms;
		_dummy.position.set(cx, s.y + 2.4, cz);
		const sc = 3.4 + i % 5 * 1.4;
		_dummy.scale.set(sc * 1.4, sc * .7, sc);
		_dummy.rotation.set(i * .4, i * .7, i * .2);
		_dummy.updateMatrix();
		rocks.setMatrixAt(rii++, _dummy.matrix);
	}
	rocks.count = rii;
	rocks.instanceMatrix.needsUpdate = true;
	group.add(rocks);
	{
		const cPos = [];
		const cIdx = [];
		const nC = segsOf(built);
		for (let i = 0; i <= nC; i++) {
			const s = samp(built, i);
			const ms = -(s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1);
			const d = built.width / 2 + 9.5;
			const y0 = s.y - 4;
			const y1 = s.y + 150 + Math.min(90, s.y * .55);
			cPos.push(s.x + s.rx * d * ms, y0, s.z + s.rz * d * ms);
			cPos.push(s.x + s.rx * d * ms, y1, s.z + s.rz * d * ms);
		}
		for (let i = 0; i < nC; i++) {
			const a = i * 2;
			cIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
		}
		const cGeo = new BufferGeometry();
		cGeo.setAttribute("position", new Float32BufferAttribute(cPos, 3));
		cGeo.setIndex(cIdx);
		cGeo.computeVertexNormals();
		bag.push(cGeo);
		const wall = new Mesh(cGeo, rust);
		wall.receiveShadow = true;
		add(wall);
	}
	for (let i = 0; i < 22; i++) {
		const a = i / 22 * Math.PI * 2 + .15;
		const mtn = new Mesh(new ConeGeometry(80 + i % 5 * 24, 130 + i % 4 * 40, 6), i % 3 === 0 ? darkRock : i % 3 === 1 ? rust : tan);
		mtn.position.set(floor.x + Math.cos(a) * 560, 52, floor.z + Math.sin(a) * 400);
		add(mtn);
	}
	const strata = [
		creamRock,
		tan,
		rust,
		band,
		sand
	];
	for (let i = 1; i < built.samples.length - 1; i += 3) {
		const s = built.samples[i];
		const ms = -(s.rx * (floor.x - s.x) + s.rz * (floor.z - s.z) >= 0 ? 1 : -1);
		for (let layer = 0; layer < 5; layer++) {
			const slab = new Mesh(new BoxGeometry(16, 3.6, 10), strata[layer]);
			const d = built.width / 2 + 12 + layer * 3.2;
			slab.position.set(s.x + s.rx * d * ms, s.y + 2.2 + layer * 3.5, s.z + s.rz * d * ms);
			slab.rotation.y = Math.atan2(s.tx, s.tz);
			add(slab);
		}
	}
	const lk = ram(30.6132, 34.801);
	{
		const n = nearestIndex(built.samples, lk.x, lk.z, 0);
		const s = built.samples[n.index];
		lk.x = s.x + s.rx * (built.width / 2 + 26);
		lk.z = s.z + s.rz * (built.width / 2 + 26);
	}
	const lookY = def.elevation(.02);
	const deck = new Mesh(new BoxGeometry(18, .32, 12), creamRock);
	deck.position.set(lk.x, lookY + .2, lk.z);
	add(deck);
	const railM = new MeshStandardMaterial({
		color: 6969416,
		roughness: .7,
		metalness: .2
	});
	bag.push(railM);
	for (const z of [-16, -4]) {
		const bar = new Mesh(new BoxGeometry(18, .08, .08), railM);
		bar.position.set(lk.x, lookY + 1.15, lk.z + z);
		add(bar);
	}
	for (const sx of [
		-8,
		0,
		8
	]) {
		const post = new Mesh(new CylinderGeometry(.07, .08, 1.15, 6), railM);
		post.position.set(lk.x + sx, lookY + .7, lk.z - 6);
		add(post);
	}
	const cut = ram(30.5992, 34.806);
	const nCut = ram(30.5964, 34.8044);
	const cutYaw = Math.atan2(nCut.x - cut.x, nCut.z - cut.z);
	const cutY = def.elevation(.55);
	placeTunnel(cut.x, cut.z, cutYaw, 42, built.width * .62, 7.6, cutY);
	const crx = Math.cos(cutYaw);
	const crz = -Math.sin(cutYaw);
	const spurL = new Mesh(new BoxGeometry(22, 36, 30), darkRock);
	spurL.position.set(cut.x - crx * 28, cutY + 18, cut.z - crz * 28);
	add(spurL);
	const spurR = new Mesh(new BoxGeometry(22, 32, 30), sand);
	spurR.position.set(cut.x + crx * 28, cutY + 16, cut.z + crz * 28);
	add(spurR);
	const bushM = new MeshStandardMaterial({
		color: 6978104,
		roughness: .92,
		flatShading: true
	});
	bag.push(bushM);
	for (let i = 0; i < 22; i++) {
		const bush = new Mesh(new SphereGeometry(1.1 + i % 3 * .4, 6, 5), bushM);
		bush.position.set(floor.x + i % 9 * 28 - 90, 1.4, floor.z + Math.floor(i / 9) * 34 - 30);
		add(bush);
	}
	glowAt(lk.x, lookY + 5, lk.z, 16763e3, 24, 20);
	hit(lk.x, lk.z, 4);
	hit(cut.x - crx * 28, cut.z - crz * 28, 8);
	hit(cut.x + crx * 28, cut.z + crz * 28, 8);
}
function buildHw40(context) {
	const { add, hit, stone, cream } = context;
	const hutP = hwy40(30.847, 34.781);
	const hut = new Mesh(new BoxGeometry(10, 4, 8), cream);
	hut.position.set(hutP.x, 2.2, hutP.z);
	add(hut);
	const avP = hwy40(30.794, 34.773);
	const avdat = new Mesh(new BoxGeometry(16, 6, 12), stone);
	avdat.position.set(avP.x, 3.2, avP.z);
	add(avdat);
	hit(hutP.x, hutP.z, 8);
	hit(avP.x, avP.z, 10);
}
function buildEilatmtn(context) {
	const { add } = context;
	const ridgePts = [
		eil(29.546, 34.916),
		eil(29.548, 34.92),
		eil(29.55, 34.924),
		eil(29.552, 34.918),
		eil(29.554, 34.926),
		eil(29.547, 34.928),
		eil(29.556, 34.922)
	];
	for (let i = 0; i < ridgePts.length; i++) {
		const p = ridgePts[i];
		const mtn = new Mesh(new ConeGeometry(16 + i * 3, 24 + i * 5, 5), new MeshStandardMaterial({
			color: 10771002,
			roughness: .95,
			flatShading: true
		}));
		mtn.position.set(p.x, 12, p.z);
		add(mtn);
	}
}
function buildGushdan(context) {
	const { add, glowAt, hit, stone, white, cream, terracotta, wood, placeAzrieli, placeTlvTowers } = context;
	const clk = tlv(32.0547, 34.7556);
	const clock = new Mesh(new CylinderGeometry(2.6, 3.1, 20, 12), stone);
	clock.position.set(clk.x, 10, clk.z);
	add(clock);
	const clockBox = new Mesh(new BoxGeometry(5.2, 5.2, 5.2), cream);
	clockBox.position.set(clk.x, 21.4, clk.z);
	add(clockBox);
	const clockFace = new Mesh(new CircleGeometry(1.8, 16), white);
	clockFace.position.set(clk.x, 21.4, clk.z + 2.7);
	add(clockFace);
	const clockCap = new Mesh(new ConeGeometry(3.2, 4.2, 4), terracotta);
	clockCap.rotation.y = Math.PI / 4;
	clockCap.position.set(clk.x, 26.2, clk.z);
	add(clockCap);
	placeAzrieli(.72);
	placeTlvTowers(.62);
	const rd = tlv(32.1044, 34.7776);
	const chim = new Mesh(new CylinderGeometry(3.4, 5.2, 78, 16), cream);
	chim.position.set(rd.x, 39, rd.z);
	add(chim);
	const chimGal = new Mesh(new CylinderGeometry(4.6, 3.8, 2.4, 16), cream);
	chimGal.position.set(rd.x, 79, rd.z);
	add(chimGal);
	for (let i = 0; i < 5; i++) {
		const band = new Mesh(new CylinderGeometry(3.55, 3.7, 2.6, 14), i % 2 ? terracotta : white);
		band.position.set(rd.x, 66 + i * 2.8, rd.z);
		add(band);
	}
	const hi = tlv(32.0893, 34.7732);
	const hilton = new Mesh(new CylinderGeometry(16, 17, 28, 16, 1, false, .55, 2.05), white);
	hilton.position.set(hi.x, 14, hi.z);
	hilton.rotation.y = -.35;
	add(hilton);
	const marH = hzl(32.1635, 34.7965);
	const dock = new Mesh(new BoxGeometry(36, .5, 10), wood);
	dock.position.set(marH.x, .3, marH.z);
	add(dock);
	const ac = hzl(32.1674, 34.7982);
	const accadia = new Mesh(new CylinderGeometry(12, 14, 14, 16, 1, false, .35, 2.45), white);
	accadia.position.set(ac.x, 7.2, ac.z);
	accadia.rotation.y = -.4;
	add(accadia);
	glowAt(rd.x, 78, rd.z, 16724016, 28, 24);
	hit(clk.x, clk.z, 6);
	hit(rd.x, rd.z, 6);
	hit(hi.x, hi.z, 12);
	hit(ac.x, ac.z, 12);
}
function buildNazareth(context) {
	const { bag, built, add, glowAt, hit, stone, copper, cream, terracotta, darkGlass } = context;
	const ba = naz(32.7014, 35.2962);
	{
		const n = nearestIndex(built.samples, ba.x, ba.z, 0);
		if (n.dist < built.width / 2 + 16) {
			const s = built.samples[n.index];
			ba.x = s.x + s.rx * (built.width / 2 + 32);
			ba.z = s.z + s.rz * (built.width / 2 + 32);
		}
	}
	const darkStone = new MeshStandardMaterial({
		color: 9075304,
		roughness: .82,
		envMapIntensity: .4
	});
	bag.push(darkStone);
	const basilica = new Mesh(new BoxGeometry(30, 18, 22), darkStone);
	basilica.position.set(ba.x, 9.2, ba.z);
	add(basilica);
	const nave = new Mesh(new BoxGeometry(20, 11, 16), cream);
	nave.position.set(ba.x, 21.5, ba.z);
	add(nave);
	const lantern = new Mesh(new CylinderGeometry(6.4, 7.4, 13, 8), cream);
	lantern.position.set(ba.x, 32, ba.z);
	add(lantern);
	for (let i = 0; i < 8; i++) {
		const a = i / 8 * Math.PI * 2 + Math.PI / 8;
		const col = new Mesh(new BoxGeometry(1.2, 12, .8), cream);
		col.position.set(ba.x + Math.cos(a) * 6.8, 32, ba.z + Math.sin(a) * 6.8);
		add(col);
		const win = new Mesh(new BoxGeometry(1.6, 3.6, .3), darkGlass);
		win.position.set(ba.x + Math.cos(a) * 6.3, 32, ba.z + Math.sin(a) * 6.3);
		win.lookAt(ba.x, 32, ba.z);
		add(win);
	}
	const bDome = new Mesh(new ConeGeometry(7.8, 11, 8), darkStone);
	bDome.position.set(ba.x, 44, ba.z);
	add(bDome);
	const crossV = new Mesh(new BoxGeometry(.32, 4.4, .32), cream);
	crossV.position.set(ba.x, 50.4, ba.z);
	add(crossV);
	const crossH = new Mesh(new BoxGeometry(2.3, .32, .32), cream);
	crossH.position.set(ba.x, 49.6, ba.z);
	add(crossH);
	const camp = new Mesh(new BoxGeometry(6.2, 28, 6.2), darkStone);
	camp.position.set(ba.x + 18, 14, ba.z - 6);
	add(camp);
	const campCap = new Mesh(new ConeGeometry(4.2, 6, 4), cream);
	campCap.rotation.y = Math.PI / 4;
	campCap.position.set(ba.x + 18, 31, ba.z - 6);
	add(campCap);
	const face = new Mesh(new BoxGeometry(18, 12, .4), cream);
	face.position.set(ba.x, 12, ba.z + 11.2);
	add(face);
	for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
		const tile = new Mesh(new BoxGeometry(3.2, 2.8, .18), r + c === 3 ? copper : darkStone);
		tile.position.set(ba.x - 6 + c * 4, 8.2 + r * 3.2, ba.z + 11.4);
		add(tile);
	}
	const mw = naz(32.7068, 35.2972);
	const well = new Mesh(new CylinderGeometry(2.8, 3.2, 2.4, 12), stone);
	well.position.set(mw.x, 1.3, mw.z);
	add(well);
	const wellRoof = new Mesh(new ConeGeometry(3.8, 3, 4), terracotta);
	wellRoof.position.set(mw.x, 4, mw.z);
	add(wellRoof);
	const prec = naz(32.697, 35.288);
	const cliff = new Mesh(new BoxGeometry(48, 22, 18), stone);
	cliff.position.set(prec.x, 11, prec.z);
	add(cliff);
	for (let i = 0; i < 8; i++) {
		const p = naz(32.704 + i * 35e-5, 35.2994 + i % 3 * 2e-4);
		if (nearestIndex(built.samples, p.x, p.z, 0).dist < built.width / 2 + 6) continue;
		const stall = new Mesh(new BoxGeometry(4.2, 3.4, 4.6), i % 2 ? cream : stone);
		stall.position.set(p.x, 1.7, p.z);
		add(stall);
		const awn = new Mesh(new BoxGeometry(4.8, .12, 5), terracotta);
		awn.position.set(p.x, 3.5, p.z);
		add(awn);
	}
	glowAt(ba.x, 44, ba.z, 16771264, 40, 32);
	hit(ba.x, ba.z, 14);
	hit(ba.x + 18, ba.z - 6, 5);
	hit(mw.x, mw.z, 4);
	hit(prec.x, prec.z, 16);
}
function buildTzfat(context) {
	const { bag, built, add, glowAt, hit, stone, gold, cream } = context;
	const ct = tzf(32.967, 35.495);
	{
		const n = nearestIndex(built.samples, ct.x, ct.z, 0);
		if (n.dist < built.width / 2 + 14) {
			const s = built.samples[n.index];
			ct.x = s.x + s.rx * (built.width / 2 + 28);
			ct.z = s.z + s.rz * (built.width / 2 + 28);
		}
	}
	const cit = new Mesh(new CylinderGeometry(8.4, 9.6, 14, 8), stone);
	cit.position.set(ct.x, 9, ct.z);
	add(cit);
	const citTop = new Mesh(new CylinderGeometry(4.4, 8.4, 5, 8), stone);
	citTop.position.set(ct.x, 18.5, ct.z);
	add(citTop);
	const blue = new MeshStandardMaterial({
		color: 3108528,
		roughness: .42,
		metalness: .14,
		envMapIntensity: .75
	});
	const wash = new MeshStandardMaterial({
		color: 14214384,
		roughness: .7
	});
	bag.push(blue, wash);
	const aq = tzf(32.966, 35.493);
	for (const s of [
		{
			lat: 32.9683,
			lon: 35.4926
		},
		{
			lat: 32.9686,
			lon: 35.4938
		},
		{
			lat: 32.9674,
			lon: 35.493
		},
		{
			lat: 32.9692,
			lon: 35.492
		}
	]) {
		const p = tzf(s.lat, s.lon);
		const syn = new Mesh(new BoxGeometry(11, 8, 11), stone);
		syn.position.set(p.x, 5, p.z);
		add(syn);
		const d = new Mesh(new SphereGeometry(4.6, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), blue);
		d.position.set(p.x, 9.2, p.z);
		add(d);
		const cap = new Mesh(new CylinderGeometry(.35, .55, 1.8, 8), gold);
		cap.position.set(p.x, 14.2, p.z);
		add(cap);
		hit(p.x, p.z, 7);
	}
	const houses = [
		{
			lat: 32.9664,
			lon: 35.4922,
			h: 6
		},
		{
			lat: 32.9668,
			lon: 35.4934,
			h: 5.4
		},
		{
			lat: 32.9676,
			lon: 35.4942,
			h: 7.2
		},
		{
			lat: 32.9688,
			lon: 35.4918,
			h: 5.8
		},
		{
			lat: 32.9658,
			lon: 35.4938,
			h: 6.4
		}
	];
	for (let i = 0; i < houses.length; i++) {
		const h = houses[i];
		const p = tzf(h.lat, h.lon);
		const house = new Mesh(new BoxGeometry(6.5, h.h, 7), i % 2 ? wash : cream);
		house.position.set(p.x, h.h * .5, p.z);
		add(house);
		const door = new Mesh(new BoxGeometry(1.2, 2.2, .2), blue);
		door.position.set(p.x, 1.2, p.z + 3.6);
		add(door);
		hit(p.x, p.z, 4);
	}
	glowAt(aq.x, 14, aq.z, 6727912, 32, 26);
	hit(ct.x, ct.z, 10);
	hit(aq.x, aq.z, 14);
}
function buildMasada(context) {
	const { bag, built, add, glowAt, hit, stone, cream, terracotta } = context;
	const ft = mas(31.3157, 35.3538);
	{
		const n = nearestIndex(built.samples, ft.x, ft.z, 0);
		if (n.dist < built.width / 2 + 40) {
			const s = built.samples[n.index];
			ft.x = s.x + s.rx * (built.width / 2 + 58);
			ft.z = s.z + s.rz * (built.width / 2 + 58);
		}
	}
	const mesaRock = new MeshStandardMaterial({
		color: 10518616,
		roughness: .96,
		flatShading: true
	});
	const mesaDark = new MeshStandardMaterial({
		color: 7230520,
		roughness: .97,
		flatShading: true
	});
	bag.push(mesaRock, mesaDark);
	const mesa = new Mesh(new CylinderGeometry(38, 52, 44, 8), mesaRock);
	mesa.position.set(ft.x, 22, ft.z);
	add(mesa);
	const plateau = new Mesh(new CylinderGeometry(34, 36, 3.2, 8), stone);
	plateau.position.set(ft.x, 45.2, ft.z);
	add(plateau);
	for (let i = 0; i < 8; i++) {
		const a = i / 8 * Math.PI * 2 + Math.PI / 8;
		const spur = new Mesh(new BoxGeometry(18, 16, 10), i % 2 ? mesaDark : mesaRock);
		spur.position.set(ft.x + Math.cos(a) * 40, 14, ft.z + Math.sin(a) * 28);
		spur.rotation.y = a;
		add(spur);
	}
	for (let i = 0; i < 12; i++) {
		const a = i / 12 * Math.PI * 2;
		const merlon = new Mesh(new BoxGeometry(4.2, 2.4, 2.2), stone);
		merlon.position.set(ft.x + Math.cos(a) * 32, 48.2, ft.z + Math.sin(a) * 24);
		merlon.rotation.y = a;
		add(merlon);
	}
	const store = new Mesh(new BoxGeometry(28, 4.2, 8), stone);
	store.position.set(ft.x - 4, 48.4, ft.z - 6);
	add(store);
	for (let i = 0; i < 5; i++) {
		const hall = new Mesh(new BoxGeometry(5.2, 3.6, 14), stone);
		hall.position.set(ft.x - 16 + i * 7, 48.2, ft.z + 8);
		add(hall);
	}
	const np = mas(31.3172, 35.3536);
	for (let i = 0; i < 3; i++) {
		const w = 16 - i * 3.2;
		const terrace = new Mesh(new BoxGeometry(w, 3.4, 8 - i * .8), stone);
		terrace.position.set(np.x, 42 - i * 9, np.z + 8 + i * 7);
		add(terrace);
		const colN = 4 - i;
		for (let c = 0; c < colN; c++) {
			const col = new Mesh(new CylinderGeometry(.35, .42, 4.8, 8), cream);
			col.position.set(np.x - w * .32 + c * (w * .64 / Math.max(1, colN - 1)), 45.2 - i * 9, np.z + 8 + i * 7);
			add(col);
		}
	}
	const vis = mas(31.3102, 35.3648);
	const vc = new Mesh(new BoxGeometry(14, 4.2, 10), cream);
	vc.position.set(vis.x, 2.2, vis.z);
	add(vc);
	const vcRoof = new Mesh(new BoxGeometry(15, .4, 11), terracotta);
	vcRoof.position.set(vis.x, 4.4, vis.z);
	add(vcRoof);
	glowAt(ft.x, 50, ft.z, 16769184, 40, 32);
	hit(ft.x, ft.z, 22);
	hit(np.x, np.z + 12, 6);
	hit(vis.x, vis.z, 6);
}
function buildBatyam(context) {
	const { add, glowAt, hit, white, wood } = context;
	const promenade = bym(32.017, 34.741);
	for (const ht of [
		{
			lat: 32.0158,
			lon: 34.7406,
			h: 18
		},
		{
			lat: 32.0172,
			lon: 34.741,
			h: 22
		},
		{
			lat: 32.0186,
			lon: 34.7414,
			h: 20
		},
		{
			lat: 32.02,
			lon: 34.7418,
			h: 24
		}
	]) {
		const p = bym(ht.lat, ht.lon);
		const hotel = new Mesh(new BoxGeometry(9, ht.h, 8), white);
		hotel.position.set(p.x, ht.h * .5, p.z);
		add(hotel);
		hit(p.x, p.z, 6);
	}
	const marina = bym(32.023, 34.742);
	const pier = new Mesh(new BoxGeometry(4, .4, 22), wood);
	pier.position.set(marina.x, .22, marina.z);
	add(pier);
	glowAt(promenade.x, 20, promenade.z, 16771248, 22, 18);
	hit(promenade.x + 24, promenade.z, 12);
}
function buildRehovot(context) {
	const { add, glowAt, hit, white, cream, terracotta } = context;
	const wz = rhv(31.9078, 34.818);
	const house = new Mesh(new CylinderGeometry(8.4, 8.4, 8, 16), cream);
	house.position.set(wz.x, 5, wz.z);
	add(house);
	const roof = new Mesh(new SphereGeometry(8.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), terracotta);
	roof.position.set(wz.x, 9, wz.z);
	add(roof);
	for (const lb of [
		{
			lat: 31.9082,
			lon: 34.8112,
			w: 16,
			h: 9,
			d: 10
		},
		{
			lat: 31.909,
			lon: 34.8098,
			w: 14,
			h: 11,
			d: 12
		},
		{
			lat: 31.9074,
			lon: 34.8106,
			w: 18,
			h: 8,
			d: 10
		},
		{
			lat: 31.9086,
			lon: 34.8122,
			w: 12,
			h: 14,
			d: 10
		}
	]) {
		const p = rhv(lb.lat, lb.lon);
		const lab = new Mesh(new BoxGeometry(lb.w, lb.h, lb.d), white);
		lab.position.set(p.x, lb.h * .5, p.z);
		add(lab);
		hit(p.x, p.z, 8);
	}
	glowAt(wz.x, 12, wz.z, 16771264, 28, 22);
	hit(wz.x, wz.z, 10);
}
function buildNahariya(context) {
	const { add, glowAt, hit, white, wood, cyan } = context;
	const canalP = nah(33.006, 35.094);
	const canal = new Mesh(new BoxGeometry(6.5, .25, 160), cyan);
	canal.position.set(canalP.x, .12, canalP.z);
	add(canal);
	for (let i = 0; i < 8; i++) {
		const palm = new Mesh(new CylinderGeometry(.28, .4, 8, 6), wood);
		palm.position.set(canalP.x + (i % 2 ? 8 : -8), 4, canalP.z - 70 + i * 18);
		add(palm);
		const fr = new Mesh(new ConeGeometry(2.4, 3.2, 6), new MeshStandardMaterial({
			color: 2779704,
			roughness: .88
		}));
		fr.position.set(canalP.x + (i % 2 ? 8 : -8), 9, canalP.z - 70 + i * 18);
		add(fr);
	}
	const hotelP = nah(33.0082, 35.0924);
	const hotelN = new Mesh(new BoxGeometry(14, 16, 10), white);
	hotelN.position.set(hotelP.x, 8, hotelP.z);
	add(hotelN);
	glowAt(canalP.x, 4, canalP.z, 6736096, 22, 28);
	hit(hotelP.x, hotelP.z, 8);
}
function buildRamla(context) {
	const { add, glowAt, hit, stone, white, cream } = context;
	const tw = rml(31.9294, 34.866);
	const tower = new Mesh(new BoxGeometry(5.2, 28, 5.2), cream);
	tower.position.set(tw.x, 14, tw.z);
	add(tower);
	const cap = new Mesh(new BoxGeometry(6.2, 3.2, 6.2), cream);
	cap.position.set(tw.x, 29, tw.z);
	add(cap);
	const ms = rml(31.9278, 34.8668);
	const mosque = new Mesh(new BoxGeometry(18, 10, 14), stone);
	mosque.position.set(ms.x, 6, ms.z);
	add(mosque);
	const mdome = new Mesh(new SphereGeometry(5.4, 12, 8), white);
	mdome.position.set(ms.x, 13, ms.z);
	add(mdome);
	glowAt(tw.x, 30, tw.z, 16771264, 28, 24);
	hit(tw.x, tw.z, 8);
	hit(ms.x, ms.z, 10);
}
function buildHolon(context) {
	const { add, glowAt, hit, white, cream } = context;
	const dmH = hol(32.0076, 34.7792);
	const spiral = new Mesh(new CylinderGeometry(7.2, 9.4, 12, 10), white);
	spiral.position.set(dmH.x, 7, dmH.z);
	add(spiral);
	const lip = new Mesh(new TorusGeometry(8.2, .5, 6, 16), white);
	lip.rotation.x = Math.PI / 2;
	lip.position.set(dmH.x, 13, dmH.z);
	add(lip);
	for (const b of [
		{
			lat: 32.0086,
			lon: 34.7798,
			w: 14,
			h: 12,
			d: 10
		},
		{
			lat: 32.0094,
			lon: 34.7786,
			w: 16,
			h: 9,
			d: 12
		},
		{
			lat: 32.0072,
			lon: 34.7778,
			w: 18,
			h: 8,
			d: 11
		}
	]) {
		const p = hol(b.lat, b.lon);
		const blk = new Mesh(new BoxGeometry(b.w, b.h, b.d), cream);
		blk.position.set(p.x, b.h * .5, p.z);
		add(blk);
		hit(p.x, p.z, 7);
	}
	glowAt(dmH.x, 14, dmH.z, 15791352, 26, 22);
	hit(dmH.x, dmH.z, 10);
}
function buildBeitshan(context) {
	const { add, glowAt, hit, stone, cream } = context;
	const th = bsn(32.503, 35.502);
	const theatre = new Mesh(new CylinderGeometry(10, 12, 6, 16, 1, true, 0, Math.PI), stone);
	theatre.position.set(th.x, 3.2, th.z);
	theatre.rotation.y = .4;
	add(theatre);
	for (const c of [
		{
			lat: 32.5032,
			lon: 35.5026
		},
		{
			lat: 32.5036,
			lon: 35.5038
		},
		{
			lat: 32.504,
			lon: 35.505
		},
		{
			lat: 32.5044,
			lon: 35.5062
		},
		{
			lat: 32.5048,
			lon: 35.5074
		}
	]) {
		const p = bsn(c.lat, c.lon);
		const col = new Mesh(new CylinderGeometry(.45, .55, 9, 8), cream);
		col.position.set(p.x, 4.6, p.z);
		add(col);
		const capc = new Mesh(new BoxGeometry(1.3, .4, 1.3), cream);
		capc.position.set(p.x, 9.3, p.z);
		add(capc);
	}
	const gb = bsn(32.48, 35.42);
	const gilboa = new Mesh(new ConeGeometry(16, 22, 5), new MeshStandardMaterial({
		color: 9071176,
		roughness: .95,
		flatShading: true
	}));
	gilboa.position.set(gb.x, 10, gb.z);
	add(gilboa);
	glowAt(th.x, 8, th.z, 16769200, 22, 20);
	hit(th.x, th.z, 12);
	hit(gb.x, gb.z, 14);
}
function buildHadera(context) {
	const { bag, add, glowAt, hit, cream } = context;
	const rust = new MeshStandardMaterial({
		color: 12081714,
		metalness: .35,
		roughness: .48
	});
	bag.push(rust);
	const plant = hdr(32.47, 34.888);
	const stacks = [hdr(32.4698, 34.8874), hdr(32.4704, 34.8886)];
	for (const p of stacks) {
		const stack = new Mesh(new CylinderGeometry(3.2, 4.4, 52, 12), rust);
		stack.position.set(p.x, 26, p.z);
		add(stack);
	}
	const hall = new Mesh(new BoxGeometry(28, 10, 16), cream);
	hall.position.set(plant.x, 5, plant.z + 16);
	add(hall);
	glowAt(plant.x, 50, plant.z, 16746564, 36, 40);
	hit(plant.x, plant.z, 14);
}
function buildLod(context) {
	const { add, glowAt, hit, stone, white, cream, paleGlass } = context;
	const tw = lodp(31.9514, 34.8882);
	const tower = new Mesh(new CylinderGeometry(2.4, 3.2, 28, 10), cream);
	tower.position.set(tw.x, 14, tw.z);
	add(tower);
	const church = new Mesh(new BoxGeometry(16, 10, 12), stone);
	church.position.set(tw.x + 8, 5.2, tw.z + 4);
	add(church);
	const term = lodp(31.978, 34.888);
	const hall = new Mesh(new BoxGeometry(36, 8, 16), white);
	hall.position.set(term.x, 4.2, term.z);
	add(hall);
	const cab = new Mesh(new CylinderGeometry(4.2, 4.6, 4, 12), paleGlass);
	cab.position.set(term.x, 22, term.z);
	add(cab);
	glowAt(term.x, 24, term.z, 8967408, 28, 24);
	hit(tw.x, tw.z, 8);
	hit(term.x, term.z, 12);
}
function buildKshmona(context) {
	const { add, glowAt, hit, stone } = context;
	const ridge0 = ksm(33.215, 35.58);
	for (let i = 0; i < 5; i++) {
		const ridge = new Mesh(new ConeGeometry(12 + i * 2, 18 + i * 4, 5), new MeshStandardMaterial({
			color: 5925448,
			roughness: .95,
			flatShading: true
		}));
		ridge.position.set(ridge0.x + i * 10, 8 + i, ridge0.z + i % 2 * 16);
		add(ridge);
	}
	const lionP = ksm(33.207, 35.567);
	const lion = new Mesh(new BoxGeometry(6, 8, 4), stone);
	lion.position.set(lionP.x, 4.2, lionP.z);
	add(lion);
	glowAt(lionP.x, 8, lionP.z, 16771264, 20, 18);
	hit(lionP.x, lionP.z, 8);
}
function buildRaanana(context) {
	const { add, glowAt, hit, white } = context;
	const park = raa(32.185, 34.853);
	for (let i = 0; i < 12; i++) {
		const tree = new Mesh(new ConeGeometry(2.2, 7, 6), new MeshStandardMaterial({
			color: 2779704,
			roughness: .88
		}));
		tree.position.set(park.x - 10 + i % 4 * 8, 3.6, park.z + Math.floor(i / 4) * 10);
		add(tree);
	}
	const mallP = raa(32.184, 34.865);
	const mall = new Mesh(new BoxGeometry(28, 10, 16), white);
	mall.position.set(mallP.x, 5, mallP.z);
	add(mall);
	glowAt(mallP.x, 10, mallP.z, 15791352, 22, 20);
	hit(mallP.x, mallP.z, 12);
}
function buildAfula(context) {
	const { add, glowAt, hit, cream } = context;
	const ctr = afl(32.61, 35.29);
	const ring = new Mesh(new TorusGeometry(16, 1.1, 8, 28), cream);
	ring.rotation.x = Math.PI / 2;
	ring.position.set(ctr.x, .4, ctr.z);
	add(ring);
	const gb = afl(32.55, 35.33);
	const gilboa = new Mesh(new ConeGeometry(22, 28, 5), new MeshStandardMaterial({
		color: 8022600,
		roughness: .95,
		flatShading: true
	}));
	gilboa.position.set(gb.x, 12, gb.z);
	add(gilboa);
	glowAt(ctr.x, 2, ctr.z, 16771264, 18, 22);
	hit(gb.x, gb.z, 16);
}
function buildKsaba(context) {
	const { add, glowAt, hit, stone } = context;
	const pk = ksb(32.175, 34.908);
	const garden = new Mesh(new CylinderGeometry(10, 10, .3, 16), new MeshStandardMaterial({
		color: 3832386,
		roughness: .9
	}));
	garden.position.set(pk.x, .15, pk.z);
	add(garden);
	const obelisk = new Mesh(new BoxGeometry(1.4, 12, 1.4), stone);
	obelisk.position.set(pk.x, 6, pk.z);
	add(obelisk);
	glowAt(pk.x, 12, pk.z, 16771264, 18, 16);
	hit(pk.x, pk.z, 8);
}
function buildArad(context) {
	const { add, hit, white } = context;
	for (const h of [
		{
			lat: 31.2572,
			lon: 35.2122,
			h: 4.2
		},
		{
			lat: 31.258,
			lon: 35.2134,
			h: 5.6
		},
		{
			lat: 31.2588,
			lon: 35.2126,
			h: 4.8
		},
		{
			lat: 31.2576,
			lon: 35.214,
			h: 6.2
		}
	]) {
		const p = ard(h.lat, h.lon);
		const house = new Mesh(new BoxGeometry(8, h.h, 6), white);
		house.position.set(p.x, h.h * .5, p.z);
		add(house);
		hit(p.x, p.z, 4);
	}
	const ridgeP = ard(31.27, 35.24);
	const ridge = new Mesh(new ConeGeometry(28, 18, 5), new MeshStandardMaterial({
		color: 12886128,
		roughness: .96,
		flatShading: true
	}));
	ridge.position.set(ridgeP.x, 8, ridgeP.z);
	add(ridge);
	hit(ridgeP.x, ridgeP.z, 16);
}
var WORLD_BUILDERS = {
	"hayarkon": buildHayarkon,
	"oldjaffa": buildOldjaffa,
	"telaviv": buildTelaviv,
	"namal": buildNamal,
	"jerusalem": buildJerusalem,
	"haifa": buildHaifa,
	"eilat": buildEilat,
	"rothschild": buildRothschild,
	"ayalon": buildAyalon,
	"caesarea": buildCaesarea,
	"deadsea": buildDeadsea,
	"acre": buildAcre,
	"centralpark": buildCentralpark,
	"timessquare": buildTimessquare,
	"brooklynbridge": buildBrooklynbridge,
	"manhattan": buildManhattan,
	"beersheva": buildBeersheva,
	"netanya": buildNetanya,
	"hw1": buildHw1,
	"herzliya": buildHerzliya,
	"hanikra": buildHanikra,
	"haifaport": buildHaifaport,
	"stellamaris": buildStellamaris,
	"tiberias": buildTiberias,
	"golan": buildGolan,
	"hermon": buildHermon,
	"hw6": buildHw6,
	"hw2": buildHw2,
	"hw90": buildHw90,
	"petah": buildPetah,
	"rishon": buildRishon,
	"ashdod": buildAshdod,
	"ashkelon": buildAshkelon,
	"scopus": buildScopus,
	"walls": buildWalls,
	"modiin": buildModiin,
	"ramon": buildRamon,
	"hw40": buildHw40,
	"eilatmtn": buildEilatmtn,
	"gushdan": buildGushdan,
	"nazareth": buildNazareth,
	"tzfat": buildTzfat,
	"masada": buildMasada,
	"batyam": buildBatyam,
	"rehovot": buildRehovot,
	"nahariya": buildNahariya,
	"ramla": buildRamla,
	"holon": buildHolon,
	"beitshan": buildBeitshan,
	"hadera": buildHadera,
	"lod": buildLod,
	"kshmona": buildKshmona,
	"raanana": buildRaanana,
	"afula": buildAfula,
	"ksaba": buildKsaba,
	"arad": buildArad
};
function buildTrackWorld(id, context) {
	WORLD_BUILDERS[id](context);
}
function addLandmarks(input) {
	const context = createTrackWorldBuilderContext(input);
	buildTrackWorld(input.def.id, context);
	const { def, built, add, hit, isNight, colliders } = context;
	scatterStreetBuildings(def, built, add, hit, isNight, (x, z) => {
		for (const c of colliders) if (Math.hypot(c.x - x, c.z - z) < (c.r ?? 6) + 14) return true;
		return false;
	});
}
var _dummy = new Object3D();
var _color = new Color();
function asphaltTexture(lanes = 2) {
	const kit = getBakedRoad(lanes) || getBakedRoad(8) || getBakedRoad(4) || getBakedRoad(3);
	if (!kit) throw new Error("baked asphalt missing");
	return kit;
}
function herodianTexture() {
	const baked = getHerodian();
	if (!baked) throw new Error("herodian texture missing");
	return baked;
}
function curtainTexture(kind = "blue") {
	const baked = getCurtain(kind);
	if (!baked) throw new Error("curtain texture missing");
	return baked;
}
function curbTexture(kind) {
	const baked = getCurb(kind);
	if (!baked) throw new Error("curb texture missing");
	return baked;
}
function foliageTexture() {
	const baked = getFoliage();
	if (!baked) throw new Error("foliage texture missing");
	return baked;
}
function barkTexture() {
	const baked = getBark();
	if (!baked) throw new Error("bark texture missing");
	return baked;
}
function sidewalkTexture() {
	const baked = getSidewalk();
	if (!baked) throw new Error("sidewalk texture missing");
	return baked;
}
function groundTexture(_hex) {
	const baked = getGroundNoise();
	if (!baked) throw new Error("ground texture missing");
	return baked;
}
function foamTex() {
	const baked = getFoam();
	if (!baked) throw new Error("foam texture missing");
	return baked;
}
function tiSignTex(kind) {
	const baked = getSign(kind);
	if (!baked) throw new Error("sign texture missing");
	return baked;
}
function waterNormalTex() {
	const baked = getWaterNormal();
	if (!baked) throw new Error("water normal missing");
	return baked;
}
function checkerTexture() {
	const baked = getChecker();
	if (!baked) throw new Error("checker texture missing");
	return baked;
}
function flareTex(size, ..._rest) {
	const baked = size >= 128 ? getFlare0() : getFlare1();
	if (!baked) throw new Error("flare texture missing");
	return baked;
}
function segsOf(built) {
	return built.closed ? built.samples.length : Math.max(1, built.samples.length - 1);
}
function samp(built, i) {
	const n = built.samples.length;
	return built.samples[built.closed ? i % n : Math.min(i, n - 1)];
}
function buildRoad(built) {
	const hw = built.width / 2;
	const pos = [];
	const uv = [];
	const nrm = [];
	const idx = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const v = (i === n ? built.length : s.s) / 6;
		pos.push(s.x - s.rx * hw, s.y + .04, s.z - s.rz * hw);
		pos.push(s.x + s.rx * hw, s.y + .04, s.z + s.rz * hw);
		uv.push(0, v, 1, v);
		nrm.push(0, 1, 0, 0, 1, 0);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildOffsetRoad(built, offset) {
	const hw = built.width / 2;
	const pos = [];
	const uv = [];
	const nrm = [];
	const idx = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const v = (i === n ? built.length : s.s) / 6;
		const cx = s.x + s.rx * offset;
		const cz = s.z + s.rz * offset;
		pos.push(cx - s.rx * hw, s.y + .04, cz - s.rz * hw);
		pos.push(cx + s.rx * hw, s.y + .04, cz + s.rz * hw);
		uv.push(0, v, 1, v);
		nrm.push(0, 1, 0, 0, 1, 0);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildStrip(built, centerOff, half, y = .02) {
	const pos = [];
	const uv = [];
	const idx = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const v = (i === n ? built.length : s.s) / 8;
		const cx = s.x + s.rx * centerOff;
		const cz = s.z + s.rz * centerOff;
		pos.push(cx - s.rx * half, s.y + y, cz - s.rz * half);
		pos.push(cx + s.rx * half, s.y + y, cz + s.rz * half);
		uv.push(0, v, 1, v);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildSidewalk(built, side) {
	const d0 = built.width / 2 + .42;
	const d1 = d0 + 3.2;
	const pos = [];
	const uv = [];
	const idx = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const v = (i === n ? built.length : s.s) / 8;
		const rx = s.rx * side;
		const rz = s.rz * side;
		pos.push(s.x + rx * d0, s.y + .18, s.z + rz * d0);
		pos.push(s.x + rx * d1, s.y + .18, s.z + rz * d1);
		uv.push(0, v, 1, v);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildEdgeLine(built, side, inset = .28, hw = .28, yOff = .08, centerOff = 0) {
	const d = built.width / 2 - inset;
	const pos = [];
	const idx = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const cx = s.x + s.rx * (d * side + centerOff);
		const cz = s.z + s.rz * (d * side + centerOff);
		pos.push(cx - s.rx * hw, s.y + yOff, cz - s.rz * hw);
		pos.push(cx + s.rx * hw, s.y + yOff, cz + s.rz * hw);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function laneCountFor(def) {
	if (def.id === "ayalon") return 8;
	if (def.id === "telaviv" || def.id === "namal" || def.id === "gushdan" || def.id === "hw1" || def.id === "hw2" || def.id === "hw6") return 4;
	if (def.theme === "highway") return 4;
	if (def.id === "rothschild" || def.id === "hayarkon" || def.id === "jerusalem") return 3;
	return 3;
}
function buildCurb(built, side, centerOff = 0) {
	const d0 = built.width / 2;
	const d1 = d0 + .55;
	const pos = [];
	const uv = [];
	const idx = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const v = (i === n ? built.length : s.s) / 2.4;
		const rx = s.rx * side;
		const rz = s.rz * side;
		pos.push(s.x + rx * d0 + s.rx * centerOff, s.y + .06, s.z + rz * d0 + s.rz * centerOff);
		pos.push(s.x + rx * d1 + s.rx * centerOff, s.y + .58, s.z + rz * d1 + s.rz * centerOff);
		uv.push(0, v, 1, v);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildJersey(built, side, centerOff = 0) {
	const d0 = built.width / 2 + .62;
	const d1 = d0 + .42;
	const pos = [];
	const idx = [];
	const uvs = [];
	const n = segsOf(built);
	for (let i = 0; i <= n; i++) {
		const s = samp(built, i);
		const rx = s.rx * side;
		const rz = s.rz * side;
		pos.push(s.x + rx * d0 + s.rx * centerOff, s.y + .08, s.z + rz * d0 + s.rz * centerOff);
		pos.push(s.x + rx * d1 + s.rx * centerOff, s.y + 1.35, s.z + rz * d1 + s.rz * centerOff);
		const v = i / n * (built.length / 2.4);
		uvs.push(0, v, 1, v);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildRail(built, side) {
	const samples = built.samples;
	const d = built.width / 2 + .48;
	const pos = [];
	const idx = [];
	const uvs = [];
	const n = samples.length;
	for (let i = 0; i <= n; i++) {
		const s = samples[i % n];
		const rx = s.rx * side;
		const rz = s.rz * side;
		pos.push(s.x + rx * d, s.y + .22, s.z + rz * d);
		pos.push(s.x + rx * d, s.y + .72, s.z + rz * d);
		const v = i / n * (built.length / 3);
		uvs.push(0, v, 1, v);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function buildShoulder(built, side) {
	const samples = built.samples;
	const d0 = built.width / 2 + 3.95;
	const d1 = d0 + 8.5;
	const pos = [];
	const uv = [];
	const idx = [];
	const n = samples.length;
	for (let i = 0; i <= n; i++) {
		const s = samples[i % n];
		const v = (i === n ? built.length : s.s) / 10;
		const rx = s.rx * side;
		const rz = s.rz * side;
		pos.push(s.x + rx * d0, s.y + .03, s.z + rz * d0);
		pos.push(s.x + rx * d1, s.y + .01, s.z + rz * d1);
		uv.push(0, v, 1, v);
	}
	for (let i = 0; i < n; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
function applySky(sky, sun, preset) {
	const phi = MathUtils.degToRad(90 - preset.elevation);
	const theta = MathUtils.degToRad(preset.azimuth);
	sun.setFromSphericalCoords(1, phi, theta);
	const su = sky.material.uniforms;
	su["turbidity"].value = preset.turbidity;
	su["rayleigh"].value = preset.rayleigh;
	su["mieCoefficient"].value = preset.mieCoefficient;
	su["mieDirectionalG"].value = preset.mieDirectionalG;
	su["sunPosition"].value.copy(sun);
}
function aimLight(isNight, sun, azimuth, out) {
	if (!isNight) {
		out.copy(sun);
		return;
	}
	const phi = MathUtils.degToRad(46);
	const theta = MathUtils.degToRad(azimuth + 172);
	out.setFromSphericalCoords(1, phi, theta);
}
function applyLights(isNight, hemi, dir, fill, ambient, lightAim, flareCol, lensflare) {
	hemi.color.setHex(isNight ? 6981808 : 11061480);
	hemi.groundColor.setHex(isNight ? 2761756 : 4870728);
	hemi.intensity = isNight ? .52 : .68;
	dir.color.setHex(isNight ? 13161704 : 16773328);
	dir.intensity = isNight ? .38 : 1.12;
	dir.position.copy(lightAim).multiplyScalar(95);
	flareCol.setHex(isNight ? 16760944 : 16767136);
	if (lensflare) lensflare.visible = false;
	fill.color.setHex(isNight ? 16760944 : 12900592);
	fill.intensity = isNight ? .48 : .28;
	if (isNight) fill.position.set(8, 22, -10);
	else {
		fill.position.copy(lightAim).multiplyScalar(-50);
		fill.position.y = Math.abs(fill.position.y) + 30;
	}
	ambient.color.setHex(isNight ? 4874368 : 11584728);
	ambient.intensity = isNight ? .28 : .32;
}
function starField() {
	const n = 1100;
	const pos = new Float32Array(n * 3);
	for (let i = 0; i < n; i++) {
		const theta = hash01(i, 1) * Math.PI * 2;
		const phi = Math.acos(hash01(i, 2) * .78);
		const r = 640 + hash01(i, 3) * 90;
		pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
		pos[i * 3 + 1] = r * Math.cos(phi);
		pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	const mat = new PointsMaterial({
		color: 15659770,
		size: 2.2,
		sizeAttenuation: false,
		transparent: true,
		opacity: .92,
		depthWrite: false,
		fog: false
	});
	return {
		mesh: new Points(geo, mat),
		geo,
		mat
	};
}
async function createWorld(def, built, shadows, night, weather = "clear") {
	const group = new Group();
	const bag = [];
	let disposed = false;
	const shared = /* @__PURE__ */ new Set();
	for (const tex of [
		getFoliage(),
		getBark(),
		getSkyDay(),
		getSkyNight(),
		getJaffaClock(),
		getIsraelFlag(),
		getHerodian(),
		getCurb("city"),
		getCurb("stone"),
		getCurb("dirt"),
		getCurb("sand"),
		getCurtain("blue"),
		getCurtain("teal"),
		getCurtain("dark"),
		getCurtain("gold"),
		getCurtain("white"),
		getSidewalk(),
		getGroundNoise(),
		getFoam(),
		getBlob(),
		getSign("stop"),
		getSign("yield"),
		getSign("none"),
		getSign("speed50"),
		getSign("speed80"),
		getSign("speed90"),
		getWaterNormal(),
		getChecker(),
		getFlare0(),
		getFlare1(),
		getLaneArrow()
	]) if (tex) shared.add(tex);
	const keep = (d) => {
		if (shared.has(d)) return d;
		bag.push(d);
		return d;
	};
	const rng = mulberry32(def.seed);
	let isNight = night;
	let clock = night ? .9 : .5;
	let wx = weather;
	let lodCrowns = null;
	let lodTrunks = null;
	let lodBills = null;
	let lodShads = null;
	const lodWear = [];
	let lodPuddles = null;
	const preset = skyFor(def, isNight, wx);
	const sky = new Sky();
	sky.visible = false;
	const sun = new Vector3();
	const lightAim = new Vector3();
	applySky(sky, sun, preset);
	aimLight(isNight, sun, def.sky.azimuth, lightAim);
	const hemi = new HemisphereLight();
	group.add(hemi);
	const dir = new DirectionalLight();
	dir.castShadow = shadows;
	dir.shadow.mapSize.set(shadows ? 2048 : 512, shadows ? 2048 : 512);
	dir.shadow.camera.near = 8;
	dir.shadow.camera.far = 220;
	dir.shadow.camera.left = -58;
	dir.shadow.camera.right = 58;
	dir.shadow.camera.top = 58;
	dir.shadow.camera.bottom = -58;
	dir.shadow.bias = -6e-5;
	dir.shadow.normalBias = .022;
	dir.shadow.radius = isNight ? .55 : .85;
	dir.shadow.blurSamples = 4;
	group.add(dir);
	group.add(dir.target);
	const dirNear = new DirectionalLight();
	dirNear.castShadow = shadows;
	dirNear.shadow.mapSize.set(shadows ? 1024 : 256, shadows ? 1024 : 256);
	dirNear.shadow.camera.near = 2;
	dirNear.shadow.camera.far = 90;
	dirNear.shadow.camera.left = -18;
	dirNear.shadow.camera.right = 18;
	dirNear.shadow.camera.top = 18;
	dirNear.shadow.camera.bottom = -18;
	dirNear.shadow.bias = -4e-5;
	dirNear.shadow.normalBias = .018;
	dirNear.intensity = shadows ? .04 : 0;
	group.add(dirNear);
	group.add(dirNear.target);
	const fill = new DirectionalLight();
	group.add(fill);
	const ambient = new AmbientLight(16777215, .1);
	group.add(ambient);
	const flareCol = new Color();
	let lensflare = null;
	if (shadows) {
		const flare0 = keep(flareTex(128, "rgba(255,248,230,0.95)", "rgba(255,210,140,0.28)"));
		const flare1 = keep(flareTex(64, "rgba(255,180,90,0.45)", "rgba(255,120,40,0)"));
		lensflare = new Lensflare();
		lensflare.addElement(new LensflareElement(flare0, 190, 0, flareCol));
		lensflare.addElement(new LensflareElement(flare1, 52, .18));
		lensflare.addElement(new LensflareElement(flare1, 78, .36));
		lensflare.addElement(new LensflareElement(flare1, 36, .58));
		dir.add(lensflare);
	}
	applyLights(isNight, hemi, dir, fill, ambient, lightAim, flareCol, lensflare);
	if (isNight && (def.theme === "manhattan" || def.theme === "park")) {
		hemi.color.setHex(6981832);
		hemi.intensity = .58;
		dir.intensity = 1.22;
		fill.color.setHex(16734858);
		fill.intensity = .55;
		ambient.color.setHex(3820136);
		ambient.intensity = .32;
	}
	const stars = starField();
	keep(stars.geo);
	keep(stars.mat);
	stars.mesh.visible = isNight;
	stars.mesh.frustumCulled = false;
	group.add(stars.mesh);
	const moonMat = keep(new MeshBasicMaterial({
		color: 15265528,
		fog: false
	}));
	const moonMesh = new Mesh(keep(new SphereGeometry(12, 16, 16)), moonMat);
	moonMesh.position.copy(lightAim).multiplyScalar(420);
	moonMesh.visible = isNight;
	moonMesh.frustumCulled = false;
	group.add(moonMesh);
	const moonHaloMat = keep(new MeshBasicMaterial({
		color: 13162736,
		transparent: true,
		opacity: .18,
		depthWrite: false,
		blending: 2,
		fog: false
	}));
	const moonHalo = new Mesh(keep(new SphereGeometry(28, 12, 12)), moonHaloMat);
	moonHalo.position.copy(moonMesh.position);
	moonHalo.visible = isNight;
	group.add(moonHalo);
	const sunMat = keep(new MeshBasicMaterial({
		color: 16774348,
		fog: false,
		toneMapped: false
	}));
	const sunMesh = new Mesh(keep(new SphereGeometry(12, 16, 16)), sunMat);
	sunMesh.position.copy(lightAim).multiplyScalar(900);
	sunMesh.visible = !isNight;
	sunMesh.frustumCulled = false;
	group.add(sunMesh);
	const sunHaloMat = keep(new MeshBasicMaterial({
		color: 16771232,
		transparent: true,
		opacity: .28,
		depthWrite: false,
		blending: 2,
		fog: false,
		toneMapped: false
	}));
	const sunHalo = new Mesh(keep(new SphereGeometry(28, 12, 12)), sunHaloMat);
	sunHalo.position.copy(sunMesh.position);
	sunHalo.visible = !isNight;
	sunHalo.frustumCulled = false;
	group.add(sunHalo);
	const skyDomeMat = keep(new MeshBasicMaterial({
		color: isNight ? 2771564 : 3972832,
		fog: false,
		depthWrite: false,
		side: 1,
		toneMapped: false
	}));
	const skyDome = new Mesh(keep(new SphereGeometry(8200, 40, 20)), skyDomeMat);
	skyDome.frustumCulled = false;
	skyDome.renderOrder = -2e3;
	group.add(skyDome);
	let span = 420;
	for (const s of built.samples) span = Math.max(span, Math.hypot(s.x, s.z));
	const groundCol = def.id === "ayalon" ? 13685976 : def.theme === "desert" ? def.sand : def.theme === "stone" ? 15260872 : def.theme === "carmel" ? 12896424 : def.theme === "snow" ? 15791352 : def.theme === "jaffa" ? 14865084 : 13946822;
	const gMap = keep(groundTexture(def.ground));
	gMap.wrapS = gMap.wrapT = RepeatWrapping;
	gMap.repeat.set(90, 90);
	const ground = new Mesh(keep(new PlaneGeometry(Math.max(def.id === "scopus" || def.id === "hermon" || def.id === "ramon" ? 4200 : 1200, span * (def.id === "scopus" ? 5.4 : 2.8)), Math.max(def.id === "scopus" || def.id === "hermon" || def.id === "ramon" ? 4200 : 1200, span * (def.id === "scopus" ? 5.4 : 2.8)))), keep(new MeshStandardMaterial({
		map: gMap,
		color: groundCol,
		roughness: .97,
		metalness: 0,
		envMapIntensity: .12
	})));
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -.4;
	ground.receiveShadow = true;
	group.add(ground);
	const domeMat = keep(new MeshBasicMaterial({
		color: isNight ? 924204 : def.theme === "desert" || def.id === "ramon" ? 8893656 : def.theme === "snow" || def.id === "hermon" ? 12113136 : 4889304,
		side: 1,
		fog: false,
		depthWrite: false,
		toneMapped: false
	}));
	const dome = new Mesh(keep(new SphereGeometry(8600, 24, 10, 0, Math.PI * 2, 0, Math.PI * .54)), domeMat);
	dome.position.y = -80;
	dome.frustumCulled = false;
	group.add(dome);
	if (def.theme === "carmel" || def.theme === "snow" || def.id === "ramon" || def.id === "jerusalem" || def.id === "scopus" || def.id === "hw1" || def.id === "masada" || def.id === "eilatmtn" || def.id === "golan" || def.id === "nazareth" || def.id === "tzfat" || def.id === "stellamaris") {
		const slopeMat = keep(new MeshStandardMaterial({
			color: def.id === "ramon" ? 11565642 : def.id === "hermon" ? 13950438 : def.id === "jerusalem" || def.id === "scopus" ? 12890250 : 4874808,
			roughness: .96,
			envMapIntensity: .18,
			flatShading: true
		}));
		const pos = [];
		const idx = [];
		const n = segsOf(built);
		const outer = def.id === "ramon" ? 280 : def.id === "hermon" ? 250 : def.theme === "carmel" ? 160 : 78;
		let valleyX = 0;
		let valleyZ = 0;
		let invertSide = false;
		if (def.id === "ramon") {
			const fl = ram(30.585, 34.802);
			valleyX = fl.x;
			valleyZ = fl.z;
		} else if (def.id === "hermon") {
			const pk = her(33.3112, 35.79);
			valleyX = pk.x;
			valleyZ = pk.z;
			invertSide = true;
		} else if (def.water) {
			valleyX = def.water.x;
			valleyZ = def.water.z;
		} else {
			valleyX = built.samples[built.samples.length - 1].x;
			valleyZ = built.samples[built.samples.length - 1].z;
		}
		for (let i = 0; i <= n; i++) {
			const s = samp(built, i);
			const hw = built.width / 2 + 1.2;
			let vs = s.rx * (valleyX - s.x) + s.rz * (valleyZ - s.z) >= 0 ? 1 : -1;
			if (invertSide) vs = -vs;
			const mountainY = def.id === "ramon" ? s.y + 180 + Math.min(110, s.y * .7) : def.id === "masada" ? s.y + 28 + s.y * .35 : def.id === "hermon" ? s.y + 148 + s.y * .6 : def.theme === "carmel" ? s.y + 78 : s.y + 8;
			const valleyY = Math.max(-.35, s.y * .05 - 2);
			const leftY = vs === -1 ? valleyY : mountainY;
			const rightY = vs === 1 ? valleyY : mountainY;
			pos.push(s.x - s.rx * hw, s.y - .15, s.z - s.rz * hw);
			pos.push(s.x - s.rx * outer, leftY, s.z - s.rz * outer);
			pos.push(s.x + s.rx * hw, s.y - .15, s.z + s.rz * hw);
			pos.push(s.x + s.rx * outer, rightY, s.z + s.rz * outer);
		}
		for (let i = 0; i < n; i++) {
			const a = i * 4;
			idx.push(a, a + 1, a + 4, a + 1, a + 5, a + 4);
			idx.push(a + 2, a + 6, a + 3, a + 3, a + 6, a + 7);
		}
		const slope = new BufferGeometry();
		slope.setAttribute("position", new Float32BufferAttribute(pos, 3));
		slope.setIndex(idx);
		slope.computeVertexNormals();
		const slopeMesh = new Mesh(keep(slope), slopeMat);
		slopeMesh.receiveShadow = true;
		group.add(slopeMesh);
	}
	const lanes = laneCountFor(def);
	const roadMaps = asphaltTexture(lanes);
	if (!getBakedRoad(lanes)) bag.push(roadMaps.map, roadMaps.roughnessMap, roadMaps.bumpMap);
	const roadMat = keep(new MeshPhysicalMaterial({
		map: roadMaps.map,
		roughnessMap: roadMaps.roughnessMap,
		bumpMap: roadMaps.bumpMap,
		bumpScale: .36,
		color: 16777215,
		roughness: .48,
		metalness: 0,
		envMapIntensity: .85,
		clearcoat: .28,
		clearcoatRoughness: .4,
		reflectivity: .28
	}));
	roadMat.userData.lanes = lanes;
	roadMat.customProgramCacheKey = () => `rush-road-${lanes}`;
	bindRoadCompile(roadMat);
	const road = new Mesh(keep(buildRoad(built)), roadMat);
	road.receiveShadow = true;
	group.add(road);
	const edgeMat = keep(new MeshBasicMaterial({
		color: 16777215,
		fog: false,
		polygonOffset: true,
		polygonOffsetFactor: -2,
		polygonOffsetUnits: -2
	}));
	group.add(new Mesh(keep(buildEdgeLine(built, 1, .16, .46)), edgeMat));
	group.add(new Mesh(keep(buildEdgeLine(built, -1, .16, .46)), edgeMat));
	{
		const dashG = keep(new BoxGeometry(.2, .045, 4.4));
		const dashM = keep(new MeshBasicMaterial({
			color: 16251124,
			fog: false
		}));
		const offs = def.id === "ayalon" ? [0, built.width + 18] : [0];
		const nDash = Math.min(2800, Math.floor(built.samples.length / 2) * (lanes - 1) * offs.length);
		const dashes = new InstancedMesh(dashG, dashM, Math.max(1, nDash));
		let di = 0;
		const hw = built.width / 2;
		const lw = built.width / lanes;
		const stepD = Math.max(2, Math.floor(built.samples.length / 140));
		for (const off of offs) for (let i = 0; i < built.samples.length && di < nDash; i += stepD) {
			const s = built.samples[i];
			if (Math.floor(s.s / 9) % 2 === 0) continue;
			for (let k = 1; k < lanes && di < nDash; k++) {
				const lat = -hw + k * lw;
				_dummy.position.set(s.x + s.rx * (off + lat), s.y + .09, s.z + s.rz * (off + lat));
				_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				dashes.setMatrixAt(di++, _dummy.matrix);
			}
		}
		dashes.count = di;
		dashes.instanceMatrix.needsUpdate = true;
		group.add(dashes);
	}
	{
		const yMat = keep(new MeshBasicMaterial({
			color: 16761856,
			fog: false,
			polygonOffset: true,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2
		}));
		group.add(new Mesh(keep(buildEdgeLine(built, 1, .85, .1)), yMat));
		group.add(new Mesh(keep(buildEdgeLine(built, -1, .85, .1)), yMat));
		if (def.id === "ayalon") {
			const gap = 18;
			const oppOff = built.width + gap;
			const opp = new Mesh(keep(buildOffsetRoad(built, oppOff)), roadMat);
			opp.receiveShadow = true;
			group.add(opp);
			group.add(new Mesh(keep(buildEdgeLine(built, 1, .16, .46, .08, oppOff)), edgeMat));
			group.add(new Mesh(keep(buildEdgeLine(built, -1, .16, .46, .08, oppOff)), edgeMat));
			group.add(new Mesh(keep(buildEdgeLine(built, 1, .62, .09, .08, oppOff)), yMat));
			group.add(new Mesh(keep(buildEdgeLine(built, -1, .62, .09, .08, oppOff)), yMat));
			const midOff = built.width / 2 + gap * .5;
			const bedMap = keep(groundTexture(0));
			bedMap.wrapS = bedMap.wrapT = RepeatWrapping;
			bedMap.repeat.set(6, 80);
			const bed = new Mesh(keep(buildStrip(built, midOff, gap * .48)), keep(new MeshStandardMaterial({
				map: bedMap,
				color: 6973536,
				roughness: .96,
				metalness: 0
			})));
			bed.receiveShadow = true;
			group.add(bed);
			const jerSh = new Shape();
			jerSh.moveTo(-.3, 0);
			jerSh.lineTo(.3, 0);
			jerSh.lineTo(.14, .38);
			jerSh.lineTo(.08, .88);
			jerSh.lineTo(-.08, .88);
			jerSh.lineTo(-.14, .38);
			jerSh.closePath();
			const jerG = keep(new ExtrudeGeometry(jerSh, {
				depth: 2.6,
				bevelEnabled: false
			}));
			jerG.translate(0, 0, -1.3);
			jerG.computeVertexNormals();
			const jerM = keep(new MeshStandardMaterial({
				color: 11840160,
				roughness: .86,
				metalness: 0
			}));
			const nJer = 160;
			const jerRows = [
				-built.width / 2 - .5,
				built.width / 2 + .5,
				midOff,
				oppOff - built.width / 2 - .5,
				oppOff + built.width / 2 + .5
			];
			const jers = new InstancedMesh(jerG, jerM, nJer * jerRows.length);
			let ji = 0;
			const stepJ = Math.max(1, Math.floor(built.samples.length / nJer));
			for (let i = 0; i < built.samples.length && ji < nJer * jerRows.length; i += stepJ) {
				const s = built.samples[i];
				for (const lat of jerRows) {
					if (ji >= nJer * jerRows.length) break;
					_dummy.position.set(s.x + s.rx * lat, s.y + .06, s.z + s.rz * lat);
					_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
					_dummy.scale.set(1.2, 1.4, 1);
					_dummy.updateMatrix();
					jers.setMatrixAt(ji++, _dummy.matrix);
				}
			}
			jers.count = ji;
			jers.instanceMatrix.needsUpdate = true;
			group.add(jers);
			const railG = keep(new BoxGeometry(.14, .1, 3.4));
			const railM = keep(new MeshStandardMaterial({
				color: 10133670,
				metalness: .72,
				roughness: .28
			}));
			const nRail = 220;
			const rails = new InstancedMesh(railG, railM, 440);
			let ri = 0;
			const stepR = Math.max(1, Math.floor(built.samples.length / nRail));
			for (let i = 0; i < built.samples.length && ri < 440; i += stepR) {
				const s = built.samples[i];
				for (const lane of [-1.15, 1.15]) {
					_dummy.position.set(s.x + s.rx * (midOff + lane), s.y + .16, s.z + s.rz * (midOff + lane));
					_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
					_dummy.scale.set(1, 1, 1);
					_dummy.updateMatrix();
					rails.setMatrixAt(ri++, _dummy.matrix);
				}
			}
			rails.count = ri;
			rails.instanceMatrix.needsUpdate = true;
			group.add(rails);
			const wireG = keep(new BoxGeometry(.05, .05, 3.4));
			const wireM = keep(new MeshBasicMaterial({ color: 2895410 }));
			const poleG2 = keep(new BoxGeometry(.18, 6.2, .18));
			const poleM2 = keep(new MeshStandardMaterial({
				color: 6975606,
				metalness: .55,
				roughness: .4
			}));
			const nWire = 200;
			const wires = new InstancedMesh(wireG, wireM, nWire);
			const nPole = 48;
			const poles = new InstancedMesh(poleG2, poleM2, nPole);
			let wi2 = 0;
			const stepWire = Math.max(1, Math.floor(built.samples.length / nWire));
			for (let i = 0; i < built.samples.length && wi2 < nWire; i += stepWire) {
				const s = built.samples[i];
				_dummy.position.set(s.x + s.rx * midOff, s.y + 5.35, s.z + s.rz * midOff);
				_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				wires.setMatrixAt(wi2++, _dummy.matrix);
			}
			wires.count = wi2;
			wires.instanceMatrix.needsUpdate = true;
			group.add(wires);
			let pi2 = 0;
			const stepP = Math.max(1, Math.floor(built.samples.length / nPole));
			for (let i = 0; i < built.samples.length && pi2 < nPole; i += stepP) {
				const s = built.samples[i];
				_dummy.position.set(s.x + s.rx * (midOff + 2.4), s.y + 3.1, s.z + s.rz * (midOff + 2.4));
				_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				poles.setMatrixAt(pi2++, _dummy.matrix);
			}
			poles.count = pi2;
			poles.instanceMatrix.needsUpdate = true;
			poles.castShadow = true;
			group.add(poles);
			const wallG = keep(new BoxGeometry(.22, 3.4, 4.4));
			const wallM = keep(new MeshStandardMaterial({
				color: 13157562,
				roughness: .9,
				metalness: 0
			}));
			const nWall = 90;
			const wallRows = [-built.width / 2 - 1.4, oppOff + built.width / 2 + 1.4];
			const walls = new InstancedMesh(wallG, wallM, nWall * wallRows.length);
			let wi = 0;
			const stepW = Math.max(1, Math.floor(built.samples.length / nWall));
			for (let i = 0; i < built.samples.length && wi < nWall * wallRows.length; i += stepW) {
				const s = built.samples[i];
				for (const lat of wallRows) {
					if (wi >= nWall * wallRows.length) break;
					_dummy.position.set(s.x + s.rx * lat, s.y + 1.72, s.z + s.rz * lat);
					_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
					_dummy.scale.set(1, 1, 1);
					_dummy.updateMatrix();
					walls.setMatrixAt(wi++, _dummy.matrix);
				}
			}
			walls.count = wi;
			walls.instanceMatrix.needsUpdate = true;
			walls.castShadow = true;
			walls.receiveShadow = true;
			group.add(walls);
			const markG = keep(new BoxGeometry(.1, .62, .9));
			const markRed = keep(new MeshBasicMaterial({
				color: 12851224,
				fog: false
			}));
			const markWht = keep(new MeshBasicMaterial({
				color: 15987178,
				fog: false
			}));
			const nMark = 100;
			const markRows = [-built.width / 2 - .62, oppOff + built.width / 2 + .62];
			const reds = new InstancedMesh(markG, markRed, nMark * markRows.length);
			const whts = new InstancedMesh(markG, markWht, nMark * markRows.length);
			let riM = 0;
			let wiM = 0;
			let nM = 0;
			const stepM = Math.max(1, Math.floor(built.samples.length / nMark));
			for (let i = 0; i < built.samples.length && nM < nMark * markRows.length; i += stepM) {
				const s = built.samples[i];
				for (const lat of markRows) {
					if (nM >= nMark * markRows.length) break;
					_dummy.position.set(s.x + s.rx * lat, s.y + .95, s.z + s.rz * lat);
					_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
					_dummy.scale.set(1, 1, 1);
					_dummy.updateMatrix();
					if (nM % 2 === 0) reds.setMatrixAt(riM++, _dummy.matrix);
					else whts.setMatrixAt(wiM++, _dummy.matrix);
					nM += 1;
				}
			}
			reds.count = riM;
			whts.count = wiM;
			reds.instanceMatrix.needsUpdate = true;
			whts.instanceMatrix.needsUpdate = true;
			group.add(reds, whts);
		}
	}
	{
		const arrowTex = getLaneArrow();
		const chevGeo = keep(new PlaneGeometry(2.8, 3.6));
		chevGeo.rotateX(-Math.PI / 2);
		const chevMat = keep(new MeshBasicMaterial({
			map: arrowTex ?? void 0,
			color: arrowTex ? 16777215 : 16773248,
			transparent: !!arrowTex,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2,
			fog: false,
			side: 2
		}));
		const chevN = Math.min(def.id === "ayalon" ? 48 : 28, Math.max(8, Math.floor(built.samples.length / (def.id === "ayalon" ? 9 : 14))));
		const chevs = new InstancedMesh(chevGeo, chevMat, chevN);
		const stepC = Math.max(1, Math.floor(built.samples.length / chevN));
		let ci2 = 0;
		const chevS = def.id === "ayalon" ? 1.55 : Math.min(1.2, Math.max(.72, built.width / 18));
		for (let i = 2; i < built.samples.length - 2 && ci2 < chevN; i += stepC) {
			const s = built.samples[i];
			_dummy.position.set(s.x, s.y + .06, s.z);
			_dummy.scale.set(chevS, 1, chevS);
			_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
			_dummy.updateMatrix();
			chevs.setMatrixAt(ci2++, _dummy.matrix);
		}
		chevs.count = ci2;
		chevs.instanceMatrix.needsUpdate = true;
		group.add(chevs);
		if (def.id === "ayalon") {
			const oppOff = built.width + 18;
			const chevs2 = new InstancedMesh(chevGeo, chevMat, chevN);
			let cj = 0;
			for (let i = 2; i < built.samples.length - 2 && cj < chevN; i += stepC) {
				const s = built.samples[i];
				_dummy.position.set(s.x + s.rx * oppOff, s.y + .06, s.z + s.rz * oppOff);
				_dummy.scale.set(chevS, 1, chevS);
				_dummy.rotation.set(0, Math.atan2(s.tx, s.tz) + Math.PI, 0);
				_dummy.updateMatrix();
				chevs2.setMatrixAt(cj++, _dummy.matrix);
			}
			chevs2.count = cj;
			chevs2.instanceMatrix.needsUpdate = true;
			group.add(chevs2);
		}
	}
	const urban = def.theme === "bauhaus" || def.theme === "stone" || def.theme === "jaffa" || def.id === "telaviv" || def.id === "rothschild" || def.id === "hayarkon";
	const zebraGeo = keep(new BoxGeometry(.42, .035, 2.4));
	const zebraMat = keep(new MeshBasicMaterial({ color: 16250094 }));
	const stopGeo = keep(new BoxGeometry(built.width * .92, .04, .38));
	const paintAt = (t, cross) => {
		const idx = Math.min(built.samples.length - 1, Math.floor(t * built.samples.length));
		const s = built.samples[idx];
		const yaw = Math.atan2(s.tx, s.tz);
		if (cross) {
			const nBar = Math.max(6, Math.round(built.width / .85));
			for (let b = 0; b < nBar; b++) {
				const off = -built.width / 2 + .5 + b * (built.width / nBar);
				const bar = new Mesh(zebraGeo, zebraMat);
				bar.position.set(s.x + s.rx * off, s.y + .07, s.z + s.rz * off);
				bar.rotation.y = yaw;
				group.add(bar);
			}
		} else {
			const stop = new Mesh(stopGeo, zebraMat);
			stop.position.set(s.x, s.y + .07, s.z);
			stop.rotation.y = yaw;
			group.add(stop);
		}
	};
	paintAt(.012, false);
	paintAt(.022, true);
	if (urban) {
		paintAt(.48, false);
		paintAt(.5, true);
	}
	const wearMat = keep(new MeshBasicMaterial({
		map: getBlob() ?? void 0,
		color: getBlob() ? 2763824 : 1842720,
		transparent: true,
		opacity: .34,
		depthWrite: false,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	}));
	const wearGeo = keep(new BoxGeometry(Math.max(1.6, built.width / Math.max(2, lanes) * .55), .02, 4.2));
	const wearN = Math.min(180, Math.floor(built.length / 8));
	const wear = new InstancedMesh(wearGeo, wearMat, wearN);
	const rightLane = built.width / 2 - built.width / lanes / 2;
	let wearI = 0;
	for (let i = 0; i < built.samples.length && wearI < wearN; i += Math.max(2, Math.floor(built.samples.length / wearN))) {
		const s = built.samples[i];
		_dummy.position.set(s.x + s.rx * rightLane, s.y + .05, s.z + s.rz * rightLane);
		_dummy.scale.set(1, 1, 1);
		_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
		_dummy.updateMatrix();
		wear.setMatrixAt(wearI++, _dummy.matrix);
	}
	wear.count = wearI;
	wear.instanceMatrix.needsUpdate = true;
	group.add(wear);
	lodWear.push(wear);
	if (def.id === "ayalon") {
		const oppOff = built.width + 18;
		const wear2 = new InstancedMesh(wearGeo, wearMat, wearN);
		let w2 = 0;
		const stepW = Math.max(2, Math.floor(built.samples.length / wearN));
		for (let i = 0; i < built.samples.length && w2 < wearN; i += stepW) {
			const s = built.samples[i];
			_dummy.position.set(s.x + s.rx * (oppOff - rightLane), s.y + .05, s.z + s.rz * (oppOff - rightLane));
			_dummy.scale.set(1, 1, 1);
			_dummy.rotation.set(0, Math.atan2(s.tx, s.tz) + Math.PI, 0);
			_dummy.updateMatrix();
			wear2.setMatrixAt(w2++, _dummy.matrix);
		}
		wear2.count = w2;
		wear2.instanceMatrix.needsUpdate = true;
		group.add(wear2);
		lodWear.push(wear2);
	}
	const curbTex = keep(curbTexture(def.theme === "stone" ? "stone" : def.theme === "desert" ? "sand" : def.theme === "carmel" || def.theme === "snow" ? "dirt" : "city"));
	const curbMat = keep(new MeshStandardMaterial({
		map: curbTex,
		color: 16777215,
		roughness: .52,
		metalness: .05,
		envMapIntensity: .2,
		emissive: 3805708,
		emissiveIntensity: .14
	}));
	group.add(new Mesh(keep(buildCurb(built, 1)), curbMat));
	group.add(new Mesh(keep(buildCurb(built, -1)), curbMat));
	if (def.id === "ayalon") {
		const oppOff = built.width + 18;
		group.add(new Mesh(keep(buildCurb(built, 1, oppOff)), curbMat));
		group.add(new Mesh(keep(buildCurb(built, -1, oppOff)), curbMat));
	}
	{
		const eyeGeo = keep(new BoxGeometry(.2, .09, .32));
		const eyeMat = keep(new MeshBasicMaterial({
			color: 16773808,
			fog: false
		}));
		const eyeOffs = def.id === "ayalon" ? [0, built.width + 18] : [0];
		const eyeN = Math.min(def.id === "ayalon" ? 560 : 320, Math.max(24, Math.floor(built.samples.length / 1.5) * eyeOffs.length));
		const eyes = new InstancedMesh(eyeGeo, eyeMat, eyeN);
		let ei = 0;
		const stepE = Math.max(2, Math.floor(built.samples.length / (eyeN / (2 * eyeOffs.length))));
		for (const off of eyeOffs) for (let i = 0; i < built.samples.length && ei < eyeN; i += stepE) {
			const s = built.samples[i];
			const d = built.width / 2 - .4;
			for (const side of [1, -1]) {
				if (ei >= eyeN) break;
				_dummy.position.set(s.x + s.rx * (off + d * side), s.y + .14, s.z + s.rz * (off + d * side));
				_dummy.scale.set(1, 1, 1);
				_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
				_dummy.updateMatrix();
				eyes.setMatrixAt(ei++, _dummy.matrix);
			}
		}
		eyes.count = ei;
		eyes.instanceMatrix.needsUpdate = true;
		group.add(eyes);
	}
	const jerseySrc = getCurb("city");
	const jerseyMap = jerseySrc ? keep(jerseySrc.clone()) : void 0;
	if (jerseyMap) {
		jerseyMap.wrapS = jerseyMap.wrapT = RepeatWrapping;
		jerseyMap.needsUpdate = true;
	}
	const jerseyMat = keep(new MeshStandardMaterial({
		map: jerseyMap,
		color: 14209732,
		roughness: .58,
		metalness: .06,
		envMapIntensity: .4
	}));
	if (def.theme !== "desert" && def.theme !== "snow" && def.id !== "rothschild" && def.theme !== "stone" && def.theme !== "jaffa" && def.theme !== "carmel") {
		group.add(new Mesh(keep(buildJersey(built, 1)), jerseyMat));
		group.add(new Mesh(keep(buildJersey(built, -1)), jerseyMat));
		const capMat = keep(new MeshBasicMaterial({
			color: 16052458,
			fog: false
		}));
		group.add(new Mesh(keep(buildEdgeLine(built, 1, -.78, .14, 1.38)), capMat));
		group.add(new Mesh(keep(buildEdgeLine(built, -1, -.78, .14, 1.38)), capMat));
		if (def.id === "ayalon") {
			const oppOff = built.width + 18;
			group.add(new Mesh(keep(buildJersey(built, 1, oppOff)), jerseyMat));
			group.add(new Mesh(keep(buildJersey(built, -1, oppOff)), jerseyMat));
			group.add(new Mesh(keep(buildEdgeLine(built, 1, -.78, .14, 1.38, oppOff)), capMat));
			group.add(new Mesh(keep(buildEdgeLine(built, -1, -.78, .14, 1.38, oppOff)), capMat));
		}
	}
	const walkTex = keep(sidewalkTexture());
	walkTex.repeat.set(1, 8);
	const walkMat = keep(new MeshStandardMaterial({
		map: walkTex,
		roughness: .88,
		metalness: .04,
		envMapIntensity: .3
	}));
	if (def.theme !== "highway" && def.id !== "ayalon" && def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel") {
		const walkL = new Mesh(keep(buildSidewalk(built, 1)), walkMat);
		const walkR = new Mesh(keep(buildSidewalk(built, -1)), walkMat);
		walkL.receiveShadow = true;
		walkR.receiveShadow = true;
		group.add(walkL, walkR);
	}
	const shoulderMat = keep(new MeshStandardMaterial({
		color: def.sand,
		roughness: .96,
		metalness: .02,
		envMapIntensity: .18
	}));
	group.add(new Mesh(keep(buildShoulder(built, 1)), shoulderMat));
	group.add(new Mesh(keep(buildShoulder(built, -1)), shoulderMat));
	if (!(def.theme === "desert" || def.theme === "snow" || def.id === "ramon" || def.id === "hermon" || def.id === "masada" || def.id === "deadsea")) {
		const highway = def.theme === "highway" || def.id === "ayalon" || def.id === "hw1" || def.id === "hw2" || def.id === "hw6";
		const kinds = highway ? [
			"speed90",
			"speed80",
			"none"
		] : [
			"stop",
			"speed50",
			"yield"
		];
		const maps = {};
		for (const k of [
			"stop",
			"yield",
			"none",
			"speed50",
			"speed80",
			"speed90"
		]) maps[k] = keep(tiSignTex(k));
		const poleM = keep(new MeshStandardMaterial({
			color: 9080984,
			roughness: .55,
			metalness: .4
		}));
		const poleG = keep(new CylinderGeometry(.07, .09, 3.2, 6));
		poleG.translate(0, 1.6, 0);
		const nSign = highway ? 10 : 14;
		const stepS = Math.max(3, Math.floor(built.samples.length / nSign));
		let si = 0;
		for (let i = 8; i < built.samples.length - 8 && si < nSign; i += stepS) {
			const s = built.samples[i];
			const kind = kinds[si % kinds.length];
			const side = si % 2 ? 1 : -1;
			const off = built.width / 2 + 1.85;
			const px = s.x + s.rx * off * side;
			const pz = s.z + s.rz * off * side;
			const yaw = Math.atan2(s.tx, s.tz) + (side > 0 ? 0 : Math.PI);
			const pole = new Mesh(poleG, poleM);
			pole.position.set(px, s.y, pz);
			group.add(pole);
			const face = new Mesh(new PlaneGeometry(kind === "stop" || kind === "yield" ? 1.15 : .95, kind === "stop" || kind === "yield" ? 1.15 : .95), new MeshBasicMaterial({
				map: maps[kind],
				transparent: true,
				depthWrite: false,
				fog: false
			}));
			face.position.set(px, s.y + 3.05, pz);
			face.rotation.y = yaw;
			group.add(face);
			si++;
		}
		if (def.id === "ayalon") {
			const oppOff = built.width + 18;
			let sj = 0;
			for (let i = 12; i < built.samples.length - 8 && sj < nSign; i += stepS) {
				const s = built.samples[i];
				const kind = kinds[sj % kinds.length];
				const side = sj % 2 ? 1 : -1;
				const off = oppOff + built.width / 2 + 1.85;
				const px = s.x + s.rx * (side > 0 ? off : oppOff - built.width / 2 - 1.85);
				const pz = s.z + s.rz * (side > 0 ? off : oppOff - built.width / 2 - 1.85);
				const yaw = Math.atan2(s.tx, s.tz) + (side > 0 ? Math.PI : 0);
				const pole = new Mesh(poleG, poleM);
				pole.position.set(px, s.y, pz);
				group.add(pole);
				const face = new Mesh(new PlaneGeometry(.95, .95), new MeshBasicMaterial({
					map: maps[kind],
					transparent: true,
					depthWrite: false,
					fog: false
				}));
				face.position.set(px, s.y + 3.05, pz);
				face.rotation.y = yaw;
				group.add(face);
				sj++;
			}
		}
		if (!highway) {
			const boxM = keep(new MeshStandardMaterial({
				color: 1711128,
				roughness: .5
			}));
			const redM = keep(new MeshBasicMaterial({ color: 16722474 }));
			const yelM = keep(new MeshBasicMaterial({ color: 16761896 }));
			const grnM = keep(new MeshBasicMaterial({ color: isNight ? 4063082 : 1739320 }));
			for (const t of [.22, .71]) {
				const s = samp(built, Math.floor(t * segsOf(built)));
				const off = built.width / 2 + 1.7;
				const px = s.x + s.rx * off;
				const pz = s.z + s.rz * off;
				const pole = new Mesh(poleG, poleM);
				pole.position.set(px, s.y, pz);
				group.add(pole);
				const head = new Mesh(new BoxGeometry(.38, 1.05, .28), boxM);
				head.position.set(px, s.y + 3.35, pz);
				group.add(head);
				const lamp = (y, mat) => {
					const m = new Mesh(new SphereGeometry(.12, 8, 6), mat);
					m.position.set(px, s.y + y, pz + s.tz * .16);
					group.add(m);
				};
				lamp(3.62, redM);
				lamp(3.35, yelM);
				lamp(3.08, grnM);
			}
		}
	}
	const railMat = keep(new MeshPhysicalMaterial({
		color: 10134442,
		metalness: .82,
		roughness: .28,
		roughnessMap: getBakedRoad(3)?.roughnessMap,
		envMapIntensity: 1.25
	}));
	if (def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon") {
		group.add(new Mesh(keep(buildRail(built, 1)), railMat));
		group.add(new Mesh(keep(buildRail(built, -1)), railMat));
	}
	let mirror = null;
	let planarOk = true;
	if (shadows) {
		/** Codex 3.4: planar RT cap until Ayalon High p95 is measured on a user GPU. Do not raise. */
		const PLANAR_RT = 768;
		mirror = new Reflector(new PlaneGeometry(42, 80), {
			clipBias: .003,
			textureWidth: PLANAR_RT,
			textureHeight: PLANAR_RT,
			color: isNight ? 4871528 : 9085108
		});
		mirror.rotation.x = -Math.PI / 2;
		mirror.position.y = .026;
		const mmat = mirror.material;
		mmat.transparent = true;
		mmat.opacity = isNight ? .36 : .22;
		group.add(mirror);
		bag.push({ dispose() {
			mirror?.dispose();
		} });
	}
	const bodies = def.waters?.length ? def.waters : def.water ? [def.water] : [];
	const streets = generateStreets(def, built, bodies);
	const ramps = [];
	const railPostGeo = keep(new CylinderGeometry(.08, .1, .78, 5));
	railPostGeo.translate(0, .4, 0);
	const railPostMat = keep(new MeshStandardMaterial({
		color: 3027510,
		metalness: .55,
		roughness: .42
	}));
	const postSpots = [];
	if (def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon") for (let i = 0; i < built.samples.length; i += 5) {
		const s = built.samples[i];
		const alley = nearestStreet(s.x, s.z, streets);
		if (alley && alley.dist < alley.street.half + 5) continue;
		const d = built.width / 2 + .48;
		postSpots.push({
			x: s.x + s.rx * d,
			y: s.y,
			z: s.z + s.rz * d
		});
		postSpots.push({
			x: s.x - s.rx * d,
			y: s.y,
			z: s.z - s.rz * d
		});
	}
	if (postSpots.length) {
		const posts = new InstancedMesh(railPostGeo, railPostMat, postSpots.length);
		posts.castShadow = shadows;
		for (let i = 0; i < postSpots.length; i++) {
			const p = postSpots[i];
			_dummy.position.set(p.x, p.y, p.z);
			_dummy.scale.set(1, 1, 1);
			_dummy.rotation.set(0, 0, 0);
			_dummy.updateMatrix();
			posts.setMatrixAt(i, _dummy.matrix);
		}
		posts.instanceMatrix.needsUpdate = true;
		group.add(posts);
	}
	if (streets.length) {
		const slab = keep(new BoxGeometry(1, 1, 1));
		const sideMesh = new InstancedMesh(slab, roadMat, streets.length);
		sideMesh.receiveShadow = true;
		for (let i = 0; i < streets.length; i++) {
			const r = streets[i];
			const dx = r.bx - r.ax;
			const dz = r.bz - r.az;
			const len = Math.hypot(dx, dz) || 1;
			_dummy.position.set((r.ax + r.bx) * .5, .045, (r.az + r.bz) * .5);
			_dummy.scale.set(r.half * 2, .06, len);
			_dummy.rotation.set(0, Math.atan2(dx, dz), 0);
			_dummy.updateMatrix();
			sideMesh.setMatrixAt(i, _dummy.matrix);
		}
		sideMesh.instanceMatrix.needsUpdate = true;
		group.add(sideMesh);
		const stripeGeo = keep(new BoxGeometry(.28, .04, 1.1));
		const stripeMat = keep(new MeshStandardMaterial({
			color: 15920872,
			roughness: .55,
			emissive: 2236440,
			emissiveIntensity: isNight ? .35 : 0
		}));
		const stripeN = Math.min(streets.length * 5, 140);
		const stripes = new InstancedMesh(stripeGeo, stripeMat, stripeN);
		let si2 = 0;
		for (const r of streets) {
			const dx = r.bx - r.ax;
			const dz = r.bz - r.az;
			const len = Math.hypot(dx, dz) || 1;
			const ux = dx / len;
			const uz = dz / len;
			const yaw = Math.atan2(dx, dz);
			for (let k = 0; k < 5 && si2 < stripeN; k++) {
				const px = r.ax + ux * (1.2 + k * .55);
				const pz = r.az + uz * (1.2 + k * .55);
				_dummy.position.set(px, .08, pz);
				_dummy.scale.set(1, 1, 1);
				_dummy.rotation.set(0, yaw + Math.PI / 2, 0);
				_dummy.updateMatrix();
				stripes.setMatrixAt(si2, _dummy.matrix);
				si2 += 1;
			}
		}
		stripes.count = si2;
		stripes.instanceMatrix.needsUpdate = true;
		group.add(stripes);
	}
	let waterMesh;
	const waterMeshes = [];
	const waterMats = [];
	if (bodies.length) {
		const nrm = keep(waterNormalTex());
		for (const body of bodies) {
			const mat = keep(new MeshPhysicalMaterial({
				color: body.color,
				roughness: isNight ? .03 : .08,
				metalness: .08,
				transparent: true,
				opacity: isNight ? .9 : .82,
				envMapIntensity: isNight ? 2.6 : 1.7,
				clearcoat: 1,
				clearcoatRoughness: .06,
				ior: 1.33,
				normalMap: nrm,
				normalScale: new Vector2(1.15, 1.15)
			}));
			if (isNight) mat.color.multiplyScalar(.65);
			const mesh = new Mesh(keep(new PlaneGeometry(Math.max(body.w * 1.4, 900), Math.max(body.d, 1600), 8, 8)), mat);
			mesh.rotation.x = -Math.PI / 2;
			mesh.position.set(body.x, -.12, body.z);
			group.add(mesh);
			waterMeshes.push(mesh);
			waterMats.push(mat);
			if (!waterMesh) waterMesh = mesh;
		}
		const sandBody = bodies[0];
		const sand = new Mesh(keep(new PlaneGeometry(Math.max(sandBody.w * .55, 420), Math.max(sandBody.d, 2200))), keep(new MeshStandardMaterial({
			color: def.sand,
			roughness: 1,
			envMapIntensity: .2
		})));
		sand.rotation.x = -Math.PI / 2;
		sand.position.set(sandBody.x + sandBody.w * .28, -.18, sandBody.z);
		if (def.theme !== "manhattan" && def.theme !== "park") group.add(sand);
		const foam = new Mesh(keep(new PlaneGeometry(sandBody.w * .14, sandBody.d * .92)), keep(new MeshBasicMaterial({
			map: keep(foamTex()),
			transparent: true,
			opacity: .82,
			depthWrite: false
		})));
		foam.rotation.x = -Math.PI / 2;
		foam.position.set(sandBody.x + sandBody.w * .14, -.03, sandBody.z);
		if (def.theme !== "manhattan" && def.theme !== "park") group.add(foam);
	}
	if (def.id === "ayalon") {
		const nrm = keep(waterNormalTex());
		const canalMat = keep(new MeshPhysicalMaterial({
			color: isNight ? 1718856 : 2779768,
			roughness: .06,
			metalness: .06,
			transparent: true,
			opacity: .84,
			envMapIntensity: isNight ? 2.2 : 1.5,
			clearcoat: 1,
			clearcoatRoughness: .08,
			ior: 1.33,
			normalMap: nrm,
			normalScale: new Vector2(.9, .9)
		}));
		const canalOff = built.width / 2 + 9 - 5.2;
		const canal = new Mesh(keep(buildStrip(built, canalOff, 2.2, -.16)), canalMat);
		canal.receiveShadow = true;
		group.add(canal);
		waterMeshes.push(canal);
		waterMats.push(canalMat);
		const bankG = keep(new BoxGeometry(.32, 1.35, 4.6));
		const bankM = keep(new MeshStandardMaterial({
			color: 11841702,
			roughness: .9,
			metalness: 0
		}));
		const nBank = 110;
		const bankLats = [canalOff - 2.35, canalOff + 2.35];
		const banks = new InstancedMesh(bankG, bankM, 220);
		let bi = 0;
		const stepB = Math.max(1, Math.floor(built.samples.length / nBank));
		for (let i = 0; i < built.samples.length && bi < 220; i += stepB) {
			const s = built.samples[i];
			for (const lat of bankLats) {
				if (bi >= 220) break;
				_dummy.position.set(s.x + s.rx * lat, s.y + .55, s.z + s.rz * lat);
				_dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				banks.setMatrixAt(bi++, _dummy.matrix);
			}
		}
		banks.count = bi;
		banks.instanceMatrix.needsUpdate = true;
		banks.castShadow = true;
		banks.receiveShadow = true;
		group.add(banks);
	}
	for (const zone of def.clearZones ?? []) {
		const grass = new Mesh(keep(new PlaneGeometry(zone.w, zone.d)), keep(new MeshStandardMaterial({
			color: def.theme === "park" || def.id === "manhattan" ? 3828292 : def.ground,
			roughness: .95,
			envMapIntensity: .2
		})));
		grass.rotation.x = -Math.PI / 2;
		grass.position.set(zone.x, -.28, zone.z);
		grass.receiveShadow = true;
		group.add(grass);
	}
	const needFacade = def.city === "nyc";
	const nycMod = needFacade ? await import("./nyc-canvas-Dris4VoP.mjs") : null;
	const facadeDay = nycMod ? keep(nycMod.facadeTexture(def.theme, false)) : null;
	const facadeNight = nycMod ? keep(nycMod.facadeTexture(def.theme, true)) : null;
	const facadeEmit = nycMod ? keep(nycMod.windowEmitTexture()) : null;
	const bGeo = keep(new BoxGeometry(1, 1, 1));
	bGeo.translate(0, .5, 0);
	const bMat = keep(new MeshStandardMaterial({
		map: !needFacade || def.theme === "jaffa" ? null : isNight ? facadeNight : facadeDay,
		emissive: new Color(!needFacade || def.theme === "jaffa" ? 0 : isNight ? 16763e3 : 0),
		emissiveMap: !needFacade || def.theme === "jaffa" ? null : facadeEmit,
		emissiveIntensity: !needFacade || def.theme === "jaffa" ? 0 : isNight ? def.theme === "manhattan" ? 2.6 : 1.35 : 0,
		roughness: def.theme === "jaffa" ? .86 : .68,
		metalness: isNight ? .16 : .08,
		envMapIntensity: isNight ? .95 : .5
	}));
	const canyon = def.id === "timessquare";
	const maxB = shadows ? def.theme === "manhattan" ? canyon ? 240 : 200 : 160 : def.theme === "manhattan" ? 280 : 220;
	const placements = [];
	const minX = def.id === "manhattan" ? -90 : -200;
	const maxX = def.id === "manhattan" ? 90 : 200;
	const minZ = def.id === "manhattan" ? -200 : -200;
	const maxZ = def.id === "manhattan" ? 200 : 200;
	const gap = def.theme === "desert" || def.theme === "highway" || def.theme === "snow" ? 18 : def.theme === "port" ? 16 : def.theme === "jaffa" ? 11 : def.theme === "manhattan" ? canyon ? 9 : 14 : def.theme === "park" ? 16 : 13;
	const inWater2 = (jx, jz) => {
		for (const w of bodies) if (Math.abs(jx - w.x) < w.w * .42 && Math.abs(jz - w.z) < w.d * .42) return true;
		return false;
	};
	const inClear2 = (jx, jz) => {
		for (const z of def.clearZones ?? []) if (Math.abs(jx - z.x) < z.w * .5 && Math.abs(jz - z.z) < z.d * .5) return true;
		return false;
	};
	if ((def.id === "hayarkon" || def.id === "namal" || def.id === "netanya" || def.id === "herzliya" || def.id === "eilat" || def.id === "batyam" || def.id === "ashkelon" || def.id === "nahariya" || def.id === "oldjaffa" || def.id === "gushdan") && bodies.length) {
		const trunkGeo2 = keep(new CylinderGeometry(.16, .34, 8.2, 8));
		const trunkMat2 = keep(new MeshStandardMaterial({
			map: keep(barkTexture()),
			color: 5914672,
			roughness: .92
		}));
		const frondGeo = keep(new ConeGeometry(.42, 4.1, 6));
		frondGeo.translate(0, -1.75, 0);
		const crownMat = keep(new MeshStandardMaterial({
			map: keep(foliageTexture()),
			color: 3832370,
			roughness: .72,
			side: 0,
			depthWrite: true
		}));
		const capGeo = keep(new SphereGeometry(.55, 8, 6));
		const palmN = 28;
		const trunks2 = new InstancedMesh(trunkGeo2, trunkMat2, palmN);
		const fronds = new InstancedMesh(frondGeo, crownMat, 336);
		const caps = new InstancedMesh(capGeo, crownMat, palmN);
		trunks2.castShadow = shadows;
		fronds.castShadow = shadows;
		const w0 = bodies[0];
		let pc = 0;
		let fc = 0;
		const step2 = Math.max(4, Math.floor(built.samples.length / palmN));
		for (let i = 0; i < built.samples.length && pc < palmN; i += step2) {
			const s = built.samples[i];
			const d = built.width / 2 + 7.4;
			const side = Math.hypot(s.x + s.rx * d - w0.x, s.z + s.rz * d - w0.z) < Math.hypot(s.x - s.rx * d - w0.x, s.z - s.rz * d - w0.z) ? 1 : -1;
			const px = s.x + s.rx * d * side;
			const pz = s.z + s.rz * d * side;
			if (inWater2(px, pz) || inClear2(px, pz)) continue;
			_dummy.position.set(px, s.y + 4.1, pz);
			_dummy.scale.set(1, 1, 1);
			_dummy.rotation.set(0, 0, 0);
			_dummy.updateMatrix();
			trunks2.setMatrixAt(pc, _dummy.matrix);
			_dummy.position.set(px, s.y + 8.05, pz);
			_dummy.scale.set(1, 1, 1);
			_dummy.updateMatrix();
			caps.setMatrixAt(pc, _dummy.matrix);
			for (let f = 0; f < 12; f++) {
				const a = f / 12 * Math.PI * 2;
				_dummy.position.set(px, s.y + 8.05, pz);
				_dummy.scale.set(.95 + f % 3 * .1, 1, 1);
				_dummy.rotation.set(1.02, a, .1);
				_dummy.updateMatrix();
				fronds.setMatrixAt(fc, _dummy.matrix);
				fc++;
			}
			pc++;
		}
		trunks2.count = pc;
		fronds.count = fc;
		caps.count = pc;
		trunks2.instanceMatrix.needsUpdate = true;
		fronds.instanceMatrix.needsUpdate = true;
		caps.instanceMatrix.needsUpdate = true;
		group.add(trunks2, fronds, caps);
	}
	const heightAt = () => def.theme === "desert" ? 4 + rng() * 10 : def.theme === "jaffa" ? 3.4 + rng() * 4.2 : def.theme === "stone" ? 4.2 + rng() * 7.5 : def.theme === "carmel" ? 3.6 + rng() * 5.5 : def.theme === "port" ? 5 + rng() * 14 : def.theme === "highway" ? 16 + rng() * 38 : def.theme === "manhattan" ? 18 + rng() * 48 + (def.id === "timessquare" ? 8 : 0) : def.theme === "park" ? 14 + rng() * 26 : def.theme === "snow" ? 4 + rng() * 8 : 11 + rng() * 26;
	const step = def.theme === "highway" || def.theme === "desert" || def.theme === "snow" ? 14 : 7;
	let loopCx = 0;
	let loopCz = 0;
	for (const s of built.samples) {
		loopCx += s.x;
		loopCz += s.z;
	}
	loopCx /= built.samples.length;
	loopCz /= built.samples.length;
	for (let i = 0; i < built.samples.length && placements.length < maxB * .7; i += step) {
		if (def.city !== "nyc") break;
		const s = built.samples[i];
		if (s.y > 8) continue;
		for (const side of [-1, 1]) {
			const d = built.width / 2 + 16.5 + rng() * 2.2;
			const jx = s.x + s.rx * d * side;
			const jz = s.z + s.rz * d * side;
			if (inWater2(jx, jz) || inClear2(jx, jz)) continue;
			const alley = nearestStreet(jx, jz, streets);
			if (alley && alley.dist < alley.street.half + 6) continue;
			placements.push({
				x: jx,
				z: jz,
				y: s.y,
				sx: def.theme === "jaffa" ? 5.2 + rng() * 2.8 : def.theme === "manhattan" ? 10 + rng() * 6 : 10 + rng() * 4,
				sy: heightAt(),
				sz: def.theme === "jaffa" ? 5.2 + rng() * 2.6 : def.theme === "manhattan" ? 8 + rng() * 5 : 7 + rng() * 3,
				rot: Math.atan2(-s.rx * side, -s.rz * side)
			});
		}
	}
	for (let x = minX; x < maxX && placements.length < maxB; x += gap) for (let z = minZ; z < maxZ && placements.length < maxB; z += gap) {
		if (def.city !== "nyc") continue;
		const jx = x + (rng() - .5) * (def.theme === "manhattan" ? 3 : 6);
		const jz = z + (rng() - .5) * (def.theme === "manhattan" ? 3 : 6);
		if (inWater2(jx, jz)) continue;
		if (inClear2(jx, jz)) continue;
		const alley = nearestStreet(jx, jz, streets);
		if (alley && alley.dist < alley.street.half + (canyon ? 3.2 : 7)) continue;
		const near = nearestIndex(built.samples, jx, jz, 0);
		if (near.dist < built.width / 2 + (canyon ? 8 : 16)) continue;
		const t01 = near.index / built.samples.length;
		if ((t01 < .05 || t01 > .95) && near.dist < built.width / 2 + 16) continue;
		if (near.dist > (def.id === "manhattan" ? 90 : 140)) continue;
		const s = built.samples[near.index];
		placements.push({
			x: jx,
			z: jz,
			y: s.y,
			sx: def.theme === "jaffa" ? 4.8 + rng() * 2.4 : def.theme === "manhattan" ? 8 + rng() * 7 : 7 + rng() * 6,
			sy: heightAt(),
			sz: def.theme === "jaffa" ? 4.8 + rng() * 2.4 : def.theme === "manhattan" ? 8 + rng() * 7 : 7 + rng() * 6,
			rot: Math.atan2(s.x - jx, s.z - jz)
		});
	}
	const buildings = new InstancedMesh(bGeo, bMat, placements.length);
	buildings.castShadow = shadows;
	buildings.receiveShadow = true;
	buildings.instanceMatrix.setUsage(DynamicDrawUsage);
	const palette = def.theme === "stone" ? [
		13350810,
		12032632,
		13943460
	] : def.theme === "desert" ? [
		14730394,
		13213808,
		14200954
	] : def.theme === "carmel" ? [
		15656664,
		14274754,
		13156530
	] : def.theme === "jaffa" ? [
		12096096,
		12886128,
		10910798,
		13808780,
		10120776
	] : def.theme === "port" ? [
		13156532,
		11577496,
		10130056
	] : def.theme === "highway" ? [
		15265522,
		13687008,
		15922936,
		13161692
	] : def.theme === "manhattan" ? [
		13161696,
		10135732,
		14542058,
		6978184,
		15262940
	] : def.theme === "park" ? [
		15261908,
		13945016,
		13154468,
		15789284
	] : def.theme === "snow" ? [
		16054524,
		14739696,
		13687008
	] : [
		15920868,
		15261906,
		14472390,
		16249578
	];
	for (let i = 0; i < placements.length; i++) {
		const p = placements[i];
		_dummy.position.set(p.x, p.y + p.sy * .5, p.z);
		_dummy.scale.set(p.sx, p.sy, p.sz);
		_dummy.rotation.set(0, p.rot, 0);
		_dummy.updateMatrix();
		buildings.setMatrixAt(i, _dummy.matrix);
		buildings.setColorAt(i, _color.setHex(palette[i % palette.length]));
	}
	buildings.instanceMatrix.needsUpdate = true;
	if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
	group.add(buildings);
	if (def.theme === "jaffa") {
		const roofGeo = keep(new ConeGeometry(1, 1, 4));
		const roofMat2 = keep(new MeshStandardMaterial({
			color: 10771002,
			roughness: .82,
			flatShading: true
		}));
		const roofs2 = new InstancedMesh(roofGeo, roofMat2, placements.length);
		for (let i = 0; i < placements.length; i++) {
			const p = placements[i];
			_dummy.position.set(p.x, p.y + p.sy + 1.1, p.z);
			_dummy.scale.set(p.sx * .78, 2.2, p.sz * .78);
			_dummy.rotation.set(0, p.rot + Math.PI / 4, 0);
			_dummy.updateMatrix();
			roofs2.setMatrixAt(i, _dummy.matrix);
		}
		roofs2.instanceMatrix.needsUpdate = true;
		group.add(roofs2);
	}
	const crownPlacements = def.city === "nyc" ? placements.filter((p) => p.sy > 16) : [];
	if (crownPlacements.length) {
		const crowns2 = new InstancedMesh(bGeo, bMat, crownPlacements.length);
		crowns2.castShadow = shadows;
		for (let i = 0; i < crownPlacements.length; i++) {
			const p = crownPlacements[i];
			const step2 = p.sy > 28 ? .62 : .74;
			const ch = Math.max(2.4, p.sy * .16);
			_dummy.position.set(p.x, p.y + p.sy + ch * .5, p.z);
			_dummy.scale.set(p.sx * step2, ch, p.sz * step2);
			_dummy.rotation.set(0, p.rot, 0);
			_dummy.updateMatrix();
			crowns2.setMatrixAt(i, _dummy.matrix);
			crowns2.setColorAt(i, _color.setHex(palette[i % palette.length]));
		}
		crowns2.instanceMatrix.needsUpdate = true;
		if (crowns2.instanceColor) crowns2.instanceColor.needsUpdate = true;
		group.add(crowns2);
	}
	const winGeo = keep(new PlaneGeometry(.82, 1.18));
	const facadeWinMat = keep(new MeshStandardMaterial({
		color: 6985904,
		emissive: 16760944,
		emissiveIntensity: isNight ? .82 : .02,
		roughness: .16,
		metalness: .58,
		envMapIntensity: 1.45,
		side: 2
	}));
	const maxWin = Math.min(placements.length * 28, 1800);
	const wins = new InstancedMesh(winGeo, facadeWinMat, maxWin);
	const _off = new Vector3();
	let wi = 0;
	const faces = [
		{
			ax: 0,
			az: 1,
			yaw: 0
		},
		{
			ax: 0,
			az: -1,
			yaw: Math.PI
		},
		{
			ax: 1,
			az: 0,
			yaw: Math.PI / 2
		},
		{
			ax: -1,
			az: 0,
			yaw: -Math.PI / 2
		}
	];
	for (let i = 0; i < placements.length && wi < maxWin; i++) {
		const p = placements[i];
		const floors = Math.max(1, Math.min(8, Math.floor(p.sy / 3.4)));
		for (const face of faces) {
			const along = face.ax !== 0 ? p.sz : p.sx;
			const cols = along > 9 ? 3 : along > 6 ? 2 : 1;
			const depth = (face.ax !== 0 ? p.sx : p.sz) * .51 + .04;
			for (let f = 0; f < floors && wi < maxWin; f++) for (let c = 0; c < cols && wi < maxWin; c++) {
				const slide = (c - (cols - 1) * .5) * Math.min(2.2, along * .28);
				const lx = face.ax * depth + (face.az !== 0 ? slide : 0);
				const lz = face.az * depth + (face.ax !== 0 ? slide : 0);
				const ly = 1.5 + f * 3.1;
				_dummy.position.set(p.x, p.y, p.z);
				_dummy.rotation.set(0, p.rot, 0);
				_dummy.scale.set(1, 1, 1);
				_dummy.updateMatrix();
				_off.set(lx, ly, lz).applyMatrix4(_dummy.matrix);
				_dummy.position.copy(_off);
				_dummy.rotation.set(0, p.rot + face.yaw, 0);
				_dummy.updateMatrix();
				wins.setMatrixAt(wi++, _dummy.matrix);
			}
		}
	}
	wins.count = wi;
	wins.instanceMatrix.needsUpdate = true;
	group.add(wins);
	const roofMat = keep(new MeshStandardMaterial({
		color: isNight ? 3815476 : 6972508,
		roughness: .88,
		metalness: .08,
		envMapIntensity: .35
	}));
	const roofs = new InstancedMesh(bGeo, roofMat, placements.length);
	roofs.receiveShadow = true;
	for (let i = 0; i < placements.length; i++) {
		const p = placements[i];
		_dummy.position.set(p.x, p.y + p.sy + .12, p.z);
		_dummy.scale.set(p.sx * 1.04, .24, p.sz * 1.04);
		_dummy.rotation.set(0, p.rot, 0);
		_dummy.updateMatrix();
		roofs.setMatrixAt(i, _dummy.matrix);
	}
	roofs.instanceMatrix.needsUpdate = true;
	group.add(roofs);
	const nyc = def.theme === "manhattan" || def.theme === "park";
	const tankGeo = keep(new CylinderGeometry(nyc ? .7 : .45, nyc ? .75 : .45, nyc ? 1.1 : .7, 8));
	const tankMat = keep(new MeshPhysicalMaterial({
		color: nyc ? 9071176 : 14212320,
		metalness: nyc ? .12 : .72,
		roughness: nyc ? .72 : .28,
		envMapIntensity: 1.1
	}));
	const tanks = new InstancedMesh(tankGeo, tankMat, def.theme === "jaffa" || def.theme === "carmel" || def.theme === "stone" ? 0 : Math.min(placements.length, nyc ? 70 : 90));
	for (let i = 0; i < tanks.count; i++) {
		const p = placements[i];
		_dummy.position.set(p.x + 1.1, p.y + p.sy + (nyc ? .6 : .4), p.z);
		_dummy.scale.set(1, 1, 1);
		_dummy.rotation.set(0, 0, 0);
		_dummy.updateMatrix();
		tanks.setMatrixAt(i, _dummy.matrix);
	}
	group.add(tanks);
	let farMesh = null;
	if ((def.city === "nyc" || def.theme === "carmel" || def.theme === "stone" || def.id === "hermon" || def.id === "hw1") && def.id !== "deadsea" && def.id !== "hayarkon" && def.id !== "ayalon" && def.id !== "ramon") {
		const tid = def.id;
		const natureHill = def.theme === "jaffa" || def.theme === "carmel" || tid === "hermon" || def.theme === "stone" || tid === "hw1";
		const farN = def.theme === "manhattan" ? 48 : natureHill ? 44 : 36;
		const farGeo = keep(natureHill ? new ConeGeometry(1, 1, 6) : new BoxGeometry(1, 1, 1));
		if (!natureHill) farGeo.translate(0, .5, 0);
		const farMat = keep(new MeshStandardMaterial({
			color: isNight ? 1713202 : tid === "ramon" ? 11565642 : tid === "hermon" ? 15265524 : def.theme === "carmel" || tid === "hw1" ? 4020788 : def.theme === "stone" ? 12890250 : 12103844,
			roughness: .92,
			metalness: .04,
			envMapIntensity: isNight ? .35 : .22,
			flatShading: true
		}));
		const far = new InstancedMesh(farGeo, farMat, farN);
		for (let i = 0; i < farN; i++) {
			const a = i / farN * Math.PI * 2 + .07;
			const r = tid === "ramon" || tid === "hermon" ? span * 1.45 + i % 6 * 70 : def.theme === "stone" || tid === "hw1" ? span * 1.55 + i % 6 * 55 : span * 1.15 + i % 6 * 28;
			const h = tid === "ramon" ? 52 + i % 6 * 22 : tid === "hermon" ? 64 + i % 5 * 26 : def.theme === "carmel" || tid === "hw1" ? 38 + i % 6 * 16 : def.theme === "stone" ? 36 + i % 5 * 18 : 22 + i % 8 * 16 + (def.theme === "manhattan" ? 28 : 0);
			_dummy.position.set(Math.cos(a) * r, natureHill ? h * .18 : 0, Math.sin(a) * r);
			_dummy.scale.set(tid === "ramon" ? 42 + i % 4 * 14 : tid === "hermon" ? 38 + i % 4 * 12 : def.theme === "carmel" || tid === "hw1" ? 32 + i % 4 * 12 : def.theme === "stone" ? 38 + i % 4 * 14 : 16 + i % 4 * 7, h, tid === "ramon" ? 36 : tid === "hermon" ? 32 : def.theme === "carmel" || tid === "hw1" ? 28 : def.theme === "stone" ? 32 : 12 + i % 3 * 5);
			_dummy.rotation.set(0, a, 0);
			_dummy.updateMatrix();
			far.setMatrixAt(i, _dummy.matrix);
		}
		far.instanceMatrix.needsUpdate = true;
		farMesh = far;
		group.add(far);
	}
	const deciduous = nyc;
	const stoneHill = def.theme === "stone";
	const pine = def.theme === "carmel" || def.id === "hermon" || def.id === "hw1";
	const acacia = def.theme === "desert" && def.id !== "ramon";
	const ficusStreet = (def.theme === "bauhaus" || def.id === "telaviv" || def.id === "namal" || def.id === "hayarkon") && def.id !== "ayalon" && def.id !== "rothschild";
	const trunkGeo = keep(new CylinderGeometry(pine ? .22 : acacia ? .16 : stoneHill ? .14 : ficusStreet ? .42 : deciduous ? .22 : .16, pine ? .38 : acacia ? .28 : stoneHill ? .22 : ficusStreet ? .62 : deciduous ? .34 : .26, pine ? 7.4 : acacia ? 3.6 : stoneHill ? 3.2 : ficusStreet ? 7.2 : deciduous ? 5.2 : 4.6, 8));
	trunkGeo.translate(0, pine ? 3.7 : acacia ? 1.8 : stoneHill ? 1.6 : ficusStreet ? 3.6 : deciduous ? 2.6 : 2.3, 0);
	const trunkMat = keep(new MeshStandardMaterial({
		map: keep(barkTexture()),
		color: pine ? 6969408 : acacia ? 9071176 : stoneHill ? 7231552 : 9071182,
		roughness: .92,
		envMapIntensity: .18
	}));
	const crownGeo = keep(pine || stoneHill ? new ConeGeometry(pine ? 2.15 : 1.15, pine ? 5.6 : 7.6, 8) : acacia ? new ConeGeometry(3.4, 1.6, 8) : new SphereGeometry(ficusStreet ? 2.15 : 1.7, 8, 6));
	const frondMat = keep(new MeshStandardMaterial({
		map: keep(foliageTexture()),
		color: pine ? def.id === "hermon" ? 2449952 : 1853992 : acacia ? 6982200 : stoneHill ? 1853992 : def.theme === "park" ? 3832386 : 3107386,
		roughness: .86,
		envMapIntensity: .28,
		flatShading: pine || stoneHill,
		side: 0,
		depthWrite: true
	}));
	const treeSpots = [];
	if ((pine || stoneHill || acacia || ficusStreet || nyc) && def.id !== "timessquare" && def.id !== "ramon") {
		const stepT = pine ? 5 : acacia ? 7 : ficusStreet ? 8 : stoneHill ? 6 : deciduous ? 8 : 6;
		for (let i = 0; i < built.samples.length; i += stepT) {
			const s = built.samples[i];
			if (!pine && !acacia && s.y > 14) continue;
			for (const side of pine || acacia ? [-1, 1] : [i % 12 === 0 ? 1 : -1]) {
				const d = built.width / 2 + (pine ? 14 + i % 5 * 4.2 : acacia ? 12 + i % 4 * 4 : ficusStreet ? 12.5 : stoneHill ? 16 : 7.2);
				treeSpots.push({
					x: s.x + s.rx * d * side,
					z: s.z + s.rz * d * side,
					y: s.y
				});
			}
		}
	}
	if (def.theme === "park") for (let x = -40; x <= 40; x += 14) for (let z = -100; z <= 120; z += 14) {
		if (inWater2(x, z)) continue;
		if (nearestIndex(built.samples, x, z, 0).dist < built.width / 2 + 6) continue;
		treeSpots.push({
			x: x + (rng() - .5) * 6,
			z: z + (rng() - .5) * 6,
			y: 0
		});
	}
	if (pine) {
		const forestR = def.id === "hw1" ? 380 : 180;
		const forestStep = def.id === "hw1" ? 28 : 24;
		for (let x = -forestR; x <= forestR; x += forestStep) for (let z = -forestR; z <= forestR; z += forestStep) {
			if (inWater2(x, z)) continue;
			const near = nearestIndex(built.samples, x, z, 0);
			if (near.dist < built.width / 2 + 16) continue;
			const s = built.samples[near.index];
			treeSpots.push({
				x: x + (rng() - .5) * 8,
				z: z + (rng() - .5) * 8,
				y: s.y * .72
			});
		}
	}
	if (def.id === "manhattan") for (let x = -22; x <= 22; x += 12) for (let z = 52; z <= 124; z += 12) {
		if (inWater2(x, z)) continue;
		treeSpots.push({
			x: x + (rng() - .5) * 4,
			z: z + (rng() - .5) * 4,
			y: 0
		});
	}
	if (def.id === "ayalon") for (let i = 0; i < built.samples.length; i += 11) {
		const s = built.samples[i];
		const d = built.width / 2 + 38;
		treeSpots.push({
			x: s.x + s.rx * d,
			z: s.z + s.rz * d,
			y: s.y
		});
	}
	const trunks = new InstancedMesh(trunkGeo, trunkMat, treeSpots.length);
	const pineLayers = pine ? 3 : 1;
	const crowns = new InstancedMesh(crownGeo, frondMat, pine || stoneHill || acacia ? treeSpots.length * pineLayers : treeSpots.length * (ficusStreet ? 6 : 5));
	lodTrunks = trunks;
	lodCrowns = crowns;
	trunks.castShadow = shadows;
	crowns.castShadow = shadows;
	let ci = 0;
	const snowCapMat = keep(new MeshStandardMaterial({
		color: 15921906,
		roughness: .88,
		flatShading: true
	}));
	const snowCaps = pine && def.id === "hermon" && treeSpots.length ? new InstancedMesh(crownGeo, snowCapMat, treeSpots.length) : null;
	let si = 0;
	for (let i = 0; i < treeSpots.length; i++) {
		const t = treeSpots[i];
		const h = 1 + rng() * .45;
		_dummy.position.set(t.x, t.y, t.z);
		_dummy.scale.set(1, h, 1);
		_dummy.rotation.set(0, rng() * 6, 0);
		_dummy.updateMatrix();
		trunks.setMatrixAt(i, _dummy.matrix);
		if (pine || stoneHill) {
			if (pine) {
				for (let L = 0; L < 3; L++) {
					_dummy.position.set(t.x, t.y + (4.6 + L * 2.55) * h, t.z);
					const sc = 1.28 - L * .28 + rng() * .12;
					_dummy.scale.set(sc, h * .72, sc);
					_dummy.updateMatrix();
					crowns.setMatrixAt(ci, _dummy.matrix);
					ci++;
				}
				if (snowCaps && t.y > 36) {
					_dummy.position.set(t.x, t.y + 11.4 * h, t.z);
					_dummy.scale.set(.55, h * .42, .55);
					_dummy.updateMatrix();
					snowCaps.setMatrixAt(si++, _dummy.matrix);
				}
			} else {
				_dummy.position.set(t.x, t.y + 5.4 * h, t.z);
				_dummy.scale.set(.85 + rng() * .35, h, .85 + rng() * .35);
				_dummy.updateMatrix();
				crowns.setMatrixAt(ci, _dummy.matrix);
				ci++;
			}
		} else if (acacia) {
			_dummy.position.set(t.x, t.y + 4.1 * h, t.z);
			_dummy.scale.set(1.15 + rng() * .4, .55, 1.15 + rng() * .4);
			_dummy.updateMatrix();
			crowns.setMatrixAt(ci, _dummy.matrix);
			ci++;
		} else {
			const top = t.y + (ficusStreet ? 6.8 : 4.8) * h;
			const blobs = ficusStreet ? [
				[
					0,
					0,
					0,
					1.22
				],
				[
					1.25,
					.35,
					.5,
					.88
				],
				[
					-1.15,
					.3,
					-.55,
					.84
				],
				[
					.25,
					.95,
					-.2,
					.76
				],
				[
					.85,
					-.15,
					-1,
					.7
				],
				[
					-.9,
					-.1,
					.95,
					.7
				]
			] : [
				[
					0,
					0,
					0,
					1.08
				],
				[
					.82,
					.32,
					.42,
					.78
				],
				[
					-.68,
					.26,
					-.48,
					.74
				],
				[
					.15,
					.72,
					-.12,
					.62
				],
				[
					.55,
					-.18,
					-.7,
					.58
				]
			];
			for (const [dx, dy, dz, sc] of blobs) {
				_dummy.position.set(t.x + dx, top + dy * h, t.z + dz);
				_dummy.scale.set(sc, sc * .86 * h, sc);
				_dummy.rotation.set(0, 0, 0);
				_dummy.updateMatrix();
				crowns.setMatrixAt(ci, _dummy.matrix);
				ci++;
			}
		}
	}
	trunks.instanceMatrix.needsUpdate = true;
	crowns.count = ci;
	crowns.instanceMatrix.needsUpdate = true;
	if (treeSpots.length) group.add(trunks, crowns);
	if (treeSpots.length && def.theme !== "desert" && def.id !== "timessquare") {
		const nBill = Math.min(36, treeSpots.length);
		const billG = keep(new PlaneGeometry(6.4, 7.6));
		const billM = keep(new MeshBasicMaterial({
			map: keep(foliageTexture()),
			transparent: true,
			alphaTest: .32,
			side: 2,
			depthWrite: false
		}));
		const bills = new InstancedMesh(billG, billM, nBill * 2);
		let bi = 0;
		const stepB = Math.max(1, Math.floor(treeSpots.length / nBill));
		for (let i = 0; i < treeSpots.length && bi < nBill * 2; i += stepB) {
			const t = treeSpots[i];
			const ox = t.x + (i % 2 ? 16 : -16);
			const oz = t.z + (i % 3 ? 10 : -10);
			_dummy.position.set(ox, t.y + 3.6, oz);
			_dummy.scale.set(1, 1, 1);
			_dummy.rotation.set(0, .4, 0);
			_dummy.updateMatrix();
			bills.setMatrixAt(bi++, _dummy.matrix);
			_dummy.rotation.set(0, .4 + Math.PI / 2, 0);
			_dummy.updateMatrix();
			bills.setMatrixAt(bi++, _dummy.matrix);
		}
		bills.count = bi;
		bills.instanceMatrix.needsUpdate = true;
		group.add(bills);
		lodBills = bills;
	}
	if (snowCaps) {
		snowCaps.count = si;
		snowCaps.instanceMatrix.needsUpdate = true;
		if (si) group.add(snowCaps);
	}
	if (treeSpots.length) {
		const shadGeo = keep(new CircleGeometry(2.4, 10));
		shadGeo.rotateX(-Math.PI / 2);
		const shadMat = keep(new MeshBasicMaterial({
			color: 329224,
			transparent: true,
			opacity: .28,
			depthWrite: false
		}));
		const shads = new InstancedMesh(shadGeo, shadMat, treeSpots.length);
		for (let i = 0; i < treeSpots.length; i++) {
			const t = treeSpots[i];
			_dummy.position.set(t.x, t.y + .04, t.z);
			_dummy.scale.set(ficusStreet ? 1.6 : acacia ? 1.4 : 1, 1, ficusStreet ? 1.6 : 1);
			_dummy.rotation.set(0, 0, 0);
			_dummy.updateMatrix();
			shads.setMatrixAt(i, _dummy.matrix);
		}
		shads.instanceMatrix.needsUpdate = true;
		group.add(shads);
		lodShads = shads;
	}
	if (def.theme === "desert" || def.id === "ramon") {
		const rockGeo = keep(new DodecahedronGeometry(1.2, 0));
		const rockMat = keep(new MeshStandardMaterial({
			color: def.id === "ramon" ? 11037242 : 12886128,
			roughness: .96,
			flatShading: true
		}));
		const rockN = 80;
		const rocks = new InstancedMesh(rockGeo, rockMat, rockN);
		rocks.castShadow = shadows;
		let ri = 0;
		for (let i = 0; i < built.samples.length && ri < rockN; i += Math.max(2, Math.floor(built.samples.length / 40))) {
			const s = built.samples[i];
			const side = ri % 2 ? 1 : -1;
			const d = built.width / 2 + 14 + ri % 5 * 5;
			_dummy.position.set(s.x + s.rx * d * side, s.y + .4, s.z + s.rz * d * side);
			const sc = .8 + ri % 4 * .55;
			_dummy.scale.set(sc, sc * (.5 + ri % 3 * .25), sc);
			_dummy.rotation.set(rng() * 1.2, rng() * 6, rng() * .6);
			_dummy.updateMatrix();
			rocks.setMatrixAt(ri++, _dummy.matrix);
		}
		rocks.count = ri;
		rocks.instanceMatrix.needsUpdate = true;
		group.add(rocks);
	}
	const poleGeo = keep(new CylinderGeometry(.07, .09, 5.2, 5));
	poleGeo.translate(0, 2.6, 0);
	const poleMat = keep(new MeshStandardMaterial({
		color: 2764338,
		metalness: 0,
		roughness: .62,
		envMapIntensity: .5
	}));
	const bulbGeo = keep(new SphereGeometry(.18, 8, 8));
	const bulbMat = keep(new MeshPhysicalMaterial({
		color: 15920864,
		emissive: isNight ? 16760944 : 2236962,
		emissiveIntensity: isNight ? 6.2 : .1,
		roughness: .22,
		metalness: .05
	}));
	const haloGeo = keep(new SphereGeometry(.95, 8, 8));
	const haloMat = keep(new MeshBasicMaterial({
		color: 16760944,
		transparent: true,
		opacity: isNight ? .78 : 0,
		blending: 2,
		depthWrite: false
	}));
	const lampCount = def.id === "ramon" || def.id === "hermon" ? 0 : def.id === "ayalon" ? Math.floor(built.samples.length / 8) : def.id === "hw1" || def.id === "hw2" || def.id === "hw6" ? Math.floor(built.samples.length / 16) : def.theme === "carmel" ? Math.floor(built.samples.length / 18) : Math.floor(built.samples.length / 10);
	const lampStride = Math.max(1, Math.floor(built.samples.length / Math.max(1, lampCount)));
	const poles = new InstancedMesh(poleGeo, poleMat, Math.max(1, lampCount));
	const bulbs = new InstancedMesh(bulbGeo, bulbMat, Math.max(1, lampCount));
	const halos = new InstancedMesh(haloGeo, haloMat, Math.max(1, lampCount));
	const lampPos = [];
	for (let i = 0; i < lampCount; i++) {
		const s = built.samples[i * lampStride % built.samples.length];
		const side = i % 2 === 0 ? 1 : -1;
		const d = built.width / 2 + 2.7;
		const lx = s.x + s.rx * d * side;
		const lz = s.z + s.rz * d * side;
		lampPos.push(new Vector3(lx, s.y + 5.15, lz));
		_dummy.position.set(lx, s.y, lz);
		_dummy.scale.set(1, 1, 1);
		_dummy.rotation.set(0, 0, 0);
		_dummy.updateMatrix();
		poles.setMatrixAt(i, _dummy.matrix);
		_dummy.position.y = s.y + 5.15;
		_dummy.updateMatrix();
		bulbs.setMatrixAt(i, _dummy.matrix);
		_dummy.scale.set(1.15, 1.15, 1.15);
		halos.setMatrixAt(i, _dummy.matrix);
	}
	if (lampCount) group.add(poles, bulbs, halos);
	const poolGeo = keep(new CircleGeometry(7.2, 20));
	poolGeo.rotateX(-Math.PI / 2);
	const poolMat = keep(new MeshBasicMaterial({
		color: 16760944,
		transparent: true,
		opacity: isNight ? .58 : 0,
		blending: 2,
		depthWrite: false
	}));
	const pools = new InstancedMesh(poolGeo, poolMat, Math.max(1, lampCount));
	pools.renderOrder = 2;
	for (let i = 0; i < lampCount; i++) {
		const s = built.samples[i * lampStride % built.samples.length];
		const p = lampPos[i];
		_dummy.position.set(p.x, s.y + .055, p.z);
		_dummy.scale.set(1.35, 1, 1.15);
		_dummy.rotation.set(0, 0, 0);
		_dummy.updateMatrix();
		pools.setMatrixAt(i, _dummy.matrix);
	}
	pools.visible = isNight && lampCount > 0;
	if (lampCount) group.add(pools);
	if (def.id === "ayalon" && lampCount) {
		const oppOff = built.width + 18;
		const poles2 = new InstancedMesh(poleGeo, poleMat, lampCount);
		const bulbs2 = new InstancedMesh(bulbGeo, bulbMat, lampCount);
		const pools2 = new InstancedMesh(poolGeo, poolMat, lampCount);
		pools2.renderOrder = 2;
		const d = oppOff + built.width / 2 + 2.7;
		for (let i = 0; i < lampCount; i++) {
			const s = built.samples[(i * lampStride + Math.floor(lampStride / 2)) % built.samples.length];
			const lx = s.x + s.rx * d;
			const lz = s.z + s.rz * d;
			_dummy.position.set(lx, s.y, lz);
			_dummy.scale.set(1, 1, 1);
			_dummy.rotation.set(0, 0, 0);
			_dummy.updateMatrix();
			poles2.setMatrixAt(i, _dummy.matrix);
			_dummy.position.y = s.y + 5.15;
			_dummy.updateMatrix();
			bulbs2.setMatrixAt(i, _dummy.matrix);
			_dummy.position.y = s.y + .055;
			_dummy.scale.set(1.35, 1, 1.15);
			_dummy.updateMatrix();
			pools2.setMatrixAt(i, _dummy.matrix);
		}
		poles2.instanceMatrix.needsUpdate = true;
		bulbs2.instanceMatrix.needsUpdate = true;
		pools2.instanceMatrix.needsUpdate = true;
		pools2.visible = isNight;
		group.add(poles2, bulbs2, pools2);
	}
	const crowdN = def.id === "ramon" || def.id === "hermon" || def.theme === "carmel" || def.theme === "desert" || def.theme === "snow" || def.id === "hw1" || def.id === "hw2" || def.id === "hw6" || def.id === "ayalon" || def.id === "rothschild" || def.id === "hayarkon" || def.id === "oldjaffa" || def.id === "jerusalem" ? 0 : shadows ? 72 : 28;
	if (crowdN) {
		const bodyGeo = keep(new BoxGeometry(.42, .95, .32));
		const headGeo = keep(new SphereGeometry(.16, 6, 5));
		const crowdMat = keep(new MeshStandardMaterial({
			color: 2764340,
			roughness: .85,
			metalness: .05
		}));
		const shirtMat = keep(new MeshStandardMaterial({
			color: 7260356,
			roughness: .7
		}));
		const crowdBodies = new InstancedMesh(bodyGeo, crowdMat, crowdN);
		const shirts = new InstancedMesh(bodyGeo, shirtMat, Math.max(1, Math.floor(crowdN / 3)));
		const heads = new InstancedMesh(headGeo, keep(new MeshStandardMaterial({
			color: 12886138,
			roughness: .7
		})), crowdN);
		let shirtI = 0;
		for (let i = 0; i < crowdN; i++) {
			const s = built.samples[(i * 11 + 4) % built.samples.length];
			const side = i % 2 === 0 ? 1 : -1;
			const d = built.width / 2 + 2.35 + i % 5 * .18;
			const x = s.x + s.rx * d * side;
			const z = s.z + s.rz * d * side;
			const y = s.y + .55;
			const yaw = Math.atan2(-s.rx * side, -s.rz * side);
			_dummy.position.set(x, y, z);
			_dummy.rotation.set(0, yaw, 0);
			_dummy.scale.set(1, .9 + i % 4 * .08, 1);
			_dummy.updateMatrix();
			crowdBodies.setMatrixAt(i, _dummy.matrix);
			_dummy.position.y = y + .62;
			_dummy.scale.set(1, 1, 1);
			_dummy.updateMatrix();
			heads.setMatrixAt(i, _dummy.matrix);
			if (i % 3 === 0 && shirtI < shirts.count) {
				_dummy.position.set(x, y, z);
				_dummy.scale.set(1.05, .92, 1.05);
				_dummy.updateMatrix();
				shirts.setMatrixAt(shirtI, _dummy.matrix);
				shirtI += 1;
			}
		}
		shirts.count = shirtI;
		group.add(crowdBodies, shirts, heads);
	}
	const boardGeo = keep(new BoxGeometry(8.5, 4.2, .22));
	const postGeo = keep(new BoxGeometry(.22, 5.4, .22));
	const postMat = keep(new MeshStandardMaterial({
		color: 2764338,
		metalness: 0,
		roughness: .5
	}));
	const ads = [
		{
			bg: "#163048",
			fg: "#f2eee8",
			t: "RUSH"
		},
		{
			bg: "#1a3a6a",
			fg: "#6ec8c4",
			t: "PULSE 101"
		},
		{
			bg: "#2a8f8a",
			fg: "#f2eee8",
			t: "יפו"
		},
		{
			bg: "#1c1c1c",
			fg: "#f5c400",
			t: "TLV"
		}
	];
	if (def.city === "nyc" && nycMod) for (let i = 0; i < ads.length; i++) {
		const ad = ads[i];
		const tex = keep(nycMod.adBoardTexture(ad.bg, ad.fg, ad.t));
		const mat = keep(new MeshStandardMaterial({
			map: tex,
			emissive: new Color(ad.fg),
			emissiveIntensity: isNight ? .45 : .08,
			roughness: .45
		}));
		const s = built.samples[Math.floor(built.samples.length * (.18 + i * .2)) % built.samples.length];
		const side = i % 2 === 0 ? 1 : -1;
		const d = built.width / 2 + 7.5;
		const x = s.x + s.rx * d * side;
		const z = s.z + s.rz * d * side;
		const board = new Mesh(boardGeo, mat);
		board.position.set(x, s.y + 4.4, z);
		board.lookAt(s.x, s.y + 3.2, s.z);
		group.add(board);
		const post = new Mesh(postGeo, postMat);
		post.position.set(x, s.y + 2.6, z);
		group.add(post);
	}
	const nightLights = [];
	if (shadows) for (let i = 0; i < 10; i++) {
		const src = lampPos[i] ?? new Vector3();
		const spot = new SpotLight(16760944, isNight ? 200 : 0, 44, .9, .65, 1.2);
		spot.position.copy(src);
		spot.target.position.set(src.x, src.y - 5.2, src.z);
		spot.castShadow = false;
		group.add(spot, spot.target);
		nightLights.push(spot);
	}
	const puddleGeo = keep(new CircleGeometry(1.8, 10));
	puddleGeo.rotateX(-Math.PI / 2);
	const puddleMat = keep(new MeshPhysicalMaterial({
		color: 1843752,
		roughness: .04,
		metalness: 0,
		clearcoat: 1,
		clearcoatRoughness: .05,
		envMapIntensity: 2.6,
		transparent: true,
		opacity: .78
	}));
	const puddleN = 26;
	const puddlePos = [];
	const puddles = new InstancedMesh(puddleGeo, puddleMat, puddleN);
	for (let i = 0; i < puddleN; i++) {
		const s = built.samples[Math.floor(i / puddleN * built.samples.length) % built.samples.length];
		const lat = (rng() - .5) * built.width * .72;
		const sc = .65 + rng() * 1.5;
		const rot = rng() * 6;
		puddlePos.push({
			x: s.x + s.rx * lat,
			y: s.y + .07,
			z: s.z + s.rz * lat,
			sx: sc,
			sz: sc * .5,
			rot
		});
		_dummy.position.set(puddlePos[i].x, puddlePos[i].y, puddlePos[i].z);
		_dummy.scale.set(sc, 1, sc * .5);
		_dummy.rotation.set(0, rot, 0);
		_dummy.updateMatrix();
		puddles.setMatrixAt(i, _dummy.matrix);
	}
	puddles.visible = isNight || wx !== "clear";
	group.add(puddles);
	lodPuddles = puddles;
	const neonGroup = new Group();
	neonGroup.visible = isNight;
	const neonGeo = keep(new BoxGeometry(3.4, .55, .1));
	const neonMats = [
		keep(new MeshBasicMaterial({ color: 7260356 })),
		keep(new MeshBasicMaterial({ color: 16731533 })),
		keep(new MeshBasicMaterial({ color: 16761165 }))
	];
	const neonStep = Math.max(def.id === "timessquare" ? 7 : 18, Math.floor(built.samples.length / 22));
	for (let i = 0; i < built.samples.length; i += neonStep) {
		const s = built.samples[i];
		const side = i % (neonStep * 2) === 0 ? 1 : -1;
		const mesh = new Mesh(neonGeo, neonMats[i % 3]);
		mesh.position.set(s.x + s.rx * (built.width / 2 + 6.2) * side, s.y + 8 + rng() * 10, s.z + s.rz * (built.width / 2 + 6.2) * side);
		mesh.rotation.y = Math.atan2(s.tx, s.tz) + Math.PI / 2;
		neonGroup.add(mesh);
	}
	group.add(neonGroup);
	const neonLights = [];
	if (shadows) for (let i = 0; i < Math.min(2, neonGroup.children.length); i++) {
		const src = neonGroup.children[i * 2];
		const col = neonMats[i % 3].color;
		const pl = new PointLight(col.getHex(), isNight ? 42 : 0, 16, 2);
		if (src) pl.position.copy(src.position);
		group.add(pl);
		neonLights.push(pl);
	}
	const landmarkGlows = [];
	const emitList = [];
	emitList.push({
		mat: facadeWinMat,
		night: .82,
		day: .02
	});
	const colliders = [];
	const movers = [];
	addLandmarks({
		group,
		def,
		bag,
		shadows,
		isNight,
		glows: landmarkGlows,
		emitList,
		colliders,
		movers,
		ramps,
		streets,
		built,
		support: {
			_dummy,
			barkTexture,
			curtainTexture,
			foliageTexture,
			herodianTexture,
			samp,
			segsOf
		}
	});
	if (def.city === "nyc") (await import("./nyc-landmarks-CGx_3Akv.mjs")).addNycLandmarks(group, def, bag, shadows, isNight, landmarkGlows, emitList, colliders);
	const edgeStep = Math.max(3, Math.floor(built.samples.length / 360));
	const wallD = built.width / 2 + 1.55;
	for (let i = 0; i < built.samples.length; i += edgeStep) {
		const s = built.samples[i];
		colliders.push({
			x: s.x + s.rx * wallD,
			z: s.z + s.rz * wallD,
			r: .62,
			kind: "barrier"
		});
		colliders.push({
			x: s.x - s.rx * wallD,
			z: s.z - s.rz * wallD,
			r: 1.05,
			kind: "barrier"
		});
	}
	let bHits = 0;
	for (const p of placements) {
		if (bHits >= 80) break;
		if (nearestIndex(built.samples, p.x, p.z, 0).dist < built.width / 2 + 8) continue;
		colliders.push({
			x: p.x,
			z: p.z,
			r: Math.max(p.sx, p.sz) * .42,
			kind: "building"
		});
		bHits += 1;
	}
	const start = built.samples[0];
	const stripe = new Mesh(keep(new BoxGeometry(built.width, .05, 1.8)), keep(new MeshStandardMaterial({
		map: keep(checkerTexture()),
		roughness: .45,
		metalness: .08
	})));
	stripe.position.set(start.x, start.y + .08, start.z);
	stripe.rotation.y = Math.atan2(start.tx, start.tz);
	group.add(stripe);
	if (def.open) {
		const fin = built.samples[built.samples.length - 1];
		const finish = new Mesh(keep(new BoxGeometry(built.width, .05, 1.8)), keep(new MeshStandardMaterial({
			map: keep(checkerTexture()),
			roughness: .45,
			metalness: .08
		})));
		finish.position.set(fin.x, fin.y + .08, fin.z);
		finish.rotation.y = Math.atan2(fin.tx, fin.tz);
		group.add(finish);
	}
	const gatePoleMat = keep(new MeshStandardMaterial({
		color: 1842724,
		roughness: .42,
		metalness: 0
	}));
	const startMat = keep(new MeshBasicMaterial({ color: 16250094 }));
	const cpMat = keep(new MeshBasicMaterial({ color: 6283476 }));
	for (let i = 0; i < built.checkpoints.length; i++) {
		const t = built.checkpoints[i];
		const s = built.samples[Math.floor(t * built.samples.length) % built.samples.length];
		const startGate = i === 0;
		const h = startGate ? 8.4 : 6.4;
		const half = built.width * .56;
		for (const side of [-1, 1]) {
			const pole = new Mesh(keep(new BoxGeometry(.28, h, .28)), gatePoleMat);
			pole.position.set(s.x + s.rx * half * side, s.y + h * .5, s.z + s.rz * half * side);
			pole.castShadow = shadows;
			group.add(pole);
		}
		const beam = new Mesh(keep(new BoxGeometry(built.width * 1.16, startGate ? .85 : .55, .14)), startGate ? startMat : cpMat);
		beam.position.set(s.x, s.y + h - .2, s.z);
		beam.rotation.y = Math.atan2(s.tx, s.tz);
		group.add(beam);
		if (startGate) {
			const light = new Mesh(keep(new BoxGeometry(.5, .5, .18)), keep(new MeshStandardMaterial({
				color: 3066993,
				emissive: 1748309,
				emissiveIntensity: 2.2
			})));
			light.position.set(s.x, s.y + h + .45, s.z);
			group.add(light);
		}
	}
	const followShadows = (x, y, z) => {
		if (!dir.castShadow) {
			dir.intensity = 0;
			dirNear.intensity = 0;
			dirNear.visible = false;
			return;
		}
		dir.target.position.set(x, y, z);
		const dist = 72;
		dir.position.set(x + lightAim.x * dist, y + Math.max(28, lightAim.y * dist), z + lightAim.z * dist);
		dir.target.updateMatrixWorld();
		dir.shadow.camera.updateProjectionMatrix();
		dirNear.target.position.set(x, y, z);
		const distN = 42;
		dirNear.position.set(x + lightAim.x * distN, y + Math.max(18, lightAim.y * distN), z + lightAim.z * distN);
		dirNear.target.updateMatrixWorld();
		dirNear.shadow.camera.updateProjectionMatrix();
		dirNear.color.copy(dir.color);
		dirNear.visible = dir.castShadow;
	};
	const followMirror = (x, y, z, yaw) => {
		if (!mirror || !planarOk) return;
		mirror.visible = true;
		mirror.position.set(x, y + .03, z);
		mirror.rotation.set(-Math.PI / 2, yaw, 0);
		const col = mirror.material;
		const wet = wx === "rain" || wx === "storm";
		col.opacity = wet ? isNight ? .58 : .38 : isNight ? .34 : .22;
		if (col.uniforms?.color) {
			const c = wet ? isNight ? 6976392 : 10136508 : isNight ? 3818840 : 8954036;
			col.uniforms.color.value.setHex(c);
		}
	};
	const tick = (now, x, z) => {
		const t = now * .001;
		dome.position.x = x;
		dome.position.z = z;
		for (const mv of movers) {
			if (mv.pts.length < 2) continue;
			const f = ((t * mv.speed + mv.phase) % 1 + 1) % 1 * (mv.pts.length - 1);
			const i = Math.min(mv.pts.length - 2, Math.floor(f));
			const a = mv.pts[i];
			const b = mv.pts[i + 1];
			const k = f - i;
			mv.mesh.position.set(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, a.z + (b.z - a.z) * k);
			const yaw = a.yaw + Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw)) * k;
			mv.mesh.rotation.y = yaw;
		}
		if (waterMeshes.length) {
			for (const mesh of waterMeshes) mesh.position.y = -.1 + Math.sin(t * .7) * .06;
			if (waterMats.length) {
				for (const mat of waterMats) if (mat.normalMap) {
					mat.normalMap.offset.x = t * .04;
					mat.normalMap.offset.y = t * .026;
				}
			}
		}
		if (wx === "storm") {
			const bolt = Math.sin(now * .013) > .992;
			const n = nightAmt(clock);
			ambient.intensity = bolt ? n > .5 ? 1.8 : 1.2 : lerp(.22, .34, n);
			hemi.intensity = bolt ? 1.4 : lerp(.55, .52, n);
		}
		const wetAmt = wx === "storm" ? 1 : wx === "rain" ? .82 : lerp(.08, .42, nightAmt(clock));
		puddles.visible = wetAmt > .1;
		puddleMat.opacity = .32 + wetAmt * .58;
		const ripple = 1 + Math.sin(t * 2.2) * .035 * (wx === "clear" ? .4 : 1);
		for (let i = 0; i < puddlePos.length; i++) {
			const p = puddlePos[i];
			_dummy.position.set(p.x, p.y, p.z);
			_dummy.scale.set(p.sx * ripple, 1, p.sz * ripple);
			_dummy.rotation.set(0, p.rot + t * .04, 0);
			_dummy.updateMatrix();
			puddles.setMatrixAt(i, _dummy.matrix);
		}
		puddles.instanceMatrix.needsUpdate = true;
		if (mirror) {
			const mmat = mirror.material;
			mmat.opacity = wx !== "clear" ? .28 + wetAmt * .35 : lerp(.1, .4, nightAmt(clock));
		}
		if (nightAmt(clock) < .4 || nightLights.length === 0 || lampPos.length === 0) return;
		const ranked = lampPos.map((p, i) => ({
			i,
			d: (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z)
		})).sort((a, b) => a.d - b.d);
		for (let i = 0; i < nightLights.length; i++) {
			const src = lampPos[ranked[i]?.i ?? 0];
			nightLights[i].position.copy(src);
			nightLights[i].target.position.set(src.x, src.y - 5.2, src.z);
		}
	};
	const groundMat = ground.material;
	const walkStd = walkMat;
	const applyWet = () => {
		const n = nightAmt(clock);
		puddles.visible = wx === "rain" || wx === "storm" || wx === "clear" && n > .35;
		if (wx === "rain" || wx === "storm") {
			roadMat.color.setHex(n > .5 ? 13685976 : 15265006);
			roadMat.roughness = wx === "storm" ? .12 : .18;
			roadMat.metalness = 0;
			roadMat.envMapIntensity = n > .5 ? 1.25 : 1.1;
			roadMat.clearcoat = .62;
			roadMat.clearcoatRoughness = .14;
			puddleMat.opacity = wx === "storm" ? .9 : .78;
		} else if (n > .45) {
			roadMat.color.setHex(15264494);
			roadMat.roughness = .26;
			roadMat.metalness = 0;
			roadMat.envMapIntensity = 1.12;
			roadMat.clearcoat = .48;
			roadMat.clearcoatRoughness = .2;
		} else {
			roadMat.color.setHex(16777215);
			roadMat.roughness = .28;
			roadMat.metalness = 0;
			roadMat.envMapIntensity = 1.05;
			roadMat.clearcoat = .42;
			roadMat.clearcoatRoughness = .28;
		}
		if (roadMat.userData.uWet) {
			const n2 = nightAmt(clock);
			const look = lookFromFlags(n2 > .5, wx, n2 <= .5 && clock < .38);
			roadMat.userData.uWet.value = LOOKS[look].wetness;
		}
	};
	const _dayHemi = new Color(9356520);
	const _mornHemi = new Color(13162734);
	const _nightHemi = new Color(6981808);
	const _dayDir = new Color(16773852);
	const _mornDir = new Color(16769200);
	const _nightDir = new Color(12898524);
	const _moon = new Vector3();
	const setClock = (nextClock) => {
		clock = (nextClock % 1 + 1) % 1;
		const n = nightAmt(clock);
		isNight = n > .48;
		const morning = n <= .5 && clock < .38;
		const next = skyAt(def, clock, wx);
		applySky(sky, sun, next);
		skyDomeMat.map = null;
		skyDomeMat.color.setHex(n > .5 ? 2771564 : 3972832);
		skyDomeMat.needsUpdate = true;
		if (n < .58) lightAim.copy(sun);
		else {
			const phi = MathUtils.degToRad(46);
			const theta = MathUtils.degToRad(def.sky.azimuth + 172);
			_moon.setFromSphericalCoords(1, phi, theta);
			lightAim.copy(sun).lerp(_moon, (n - .58) / .42);
		}
		if (n > .5) {
			hemi.color.copy(_nightHemi);
			dir.color.copy(_nightDir);
			hemi.intensity = .98;
			dir.intensity = .72;
			fill.color.setHex(16758880);
			fill.intensity = .72;
			ambient.color.setHex(5929112);
			ambient.intensity = .58;
		} else if (morning) {
			hemi.color.copy(_mornHemi);
			dir.color.copy(_mornDir);
			hemi.intensity = .66;
			dir.intensity = .98;
			fill.color.setHex(16760976);
			fill.intensity = .24;
			ambient.color.setHex(13682872);
			ambient.intensity = .26;
		} else {
			hemi.color.copy(_dayHemi);
			dir.color.copy(_dayDir);
			hemi.intensity = .62;
			dir.intensity = .82;
			fill.color.setHex(10139856);
			fill.intensity = .22;
			ambient.color.setHex(11057352);
			ambient.intensity = .24;
		}
		hemi.groundColor.setHex(n > .5 ? 1709072 : 5919304);
		dir.position.copy(lightAim).multiplyScalar(95);
		flareCol.setHex(n > .55 ? 16760944 : 16767136);
		if (lensflare) lensflare.visible = false;
		dir.shadow.radius = lerp(1.05, .7, n);
		if (n > .5 && (def.theme === "manhattan" || def.theme === "park")) {
			hemi.color.setHex(6981832);
			hemi.intensity = lerp(.26, .52, n);
			dir.intensity = lerp(.72, 1.02, n);
			fill.color.setHex(16734858);
			fill.intensity = lerp(.1, .42, n);
		}
		stars.mesh.visible = n > .5;
		stars.mat.opacity = clamp((n - .45) * 2.4, 0, .92);
		moonMesh.visible = n > .55;
		moonHalo.visible = n > .55;
		moonMesh.position.copy(lightAim).multiplyScalar(420);
		moonHalo.position.copy(moonMesh.position);
		moonHaloMat.opacity = n > .55 ? .38 : 0;
		moonHaloMat.needsUpdate = true;
		sunMesh.visible = n < .5;
		sunHalo.visible = n < .5;
		sunMesh.position.copy(lightAim).multiplyScalar(900);
		sunHalo.position.copy(sunMesh.position);
		sunHaloMat.opacity = morning ? .38 : .26;
		haloMat.opacity = n > .45 ? .58 : 0;
		haloMat.needsUpdate = true;
		applyWet();
		groundMat.color.setHex(n > .5 ? 5923436 : groundCol);
		groundMat.envMapIntensity = lerp(.14, .08, n);
		domeMat.color.setHex(n > .5 ? 1980500 : clock < .38 ? 6991584 : 4889304);
		walkStd.color.setHex(n > .5 ? 9078400 : 12892324);
		walkStd.envMapIntensity = lerp(.22, .16, n);
		shoulderMat.color.setHex(n > .5 ? 4867128 : def.sand);
		jerseyMat.color.setHex(n > .5 ? 9078396 : 12893358);
		if (waterMats.length) for (let i = 0; i < waterMats.length; i++) {
			const src = bodies[i];
			const mat = waterMats[i];
			mat.color.setHex(src.color);
			if (n > .35) mat.color.multiplyScalar(lerp(1, .5, n));
			mat.envMapIntensity = lerp(1.7, 2.6, n);
			mat.roughness = lerp(.08, .03, n);
			mat.opacity = lerp(.82, .9, n);
		}
		if (needFacade) {
			bMat.map = n > .48 ? facadeNight : facadeDay;
			bMat.emissive.setHex(n > .4 ? 16763e3 : 0);
			bMat.emissiveIntensity = n * (def.theme === "manhattan" ? 3.2 : 1.85);
			bMat.metalness = lerp(.08, .16, n);
			bMat.envMapIntensity = lerp(.5, 1.15, n);
			bMat.needsUpdate = true;
		}
		bulbMat.emissive.setHex(n > .4 ? 16760944 : 2236962);
		bulbMat.emissiveIntensity = lerp(.08, 7.2, n);
		haloMat.opacity = n > .4 ? .22 + n * .42 : 0;
		pools.visible = n > .4 && lampCount > 0;
		poolMat.opacity = n > .4 ? .32 + n * .4 : 0;
		neonGroup.visible = n > .32;
		for (const pl of nightLights) pl.intensity = n * 210;
		for (const pl of neonLights) pl.intensity = n * 42;
		for (const g of landmarkGlows) g.light.intensity = n * g.on;
		for (const e of emitList) e.mat.emissiveIntensity = lerp(e.day, e.night, n);
		applyWet();
		return next;
	};
	const setTime = (nextNight) => setClock(nextNight ? .9 : .5);
	const setWeather = (w) => {
		wx = w;
		return setClock(clock);
	};
	const setLod = (tier) => {
		const hi = tier === "high";
		const mid = tier === "mid";
		if (lodCrowns) {
			lodCrowns.visible = hi || mid;
			lodCrowns.castShadow = hi;
		}
		if (lodTrunks) lodTrunks.castShadow = hi;
		if (lodBills) lodBills.visible = hi;
		if (lodShads) lodShads.visible = hi || mid;
		tanks.visible = hi || mid;
		tanks.castShadow = hi;
		if (farMesh) farMesh.visible = hi || mid;
		for (const w of lodWear) w.visible = hi || mid;
		if (lodPuddles) lodPuddles.visible = hi;
	};
	applyWet();
	return assembleWorld({
		group,
		sun,
		sky,
		dir,
		dirNear,
		waterMesh,
		colliders,
		streets,
		ramps,
		getNight: () => isNight,
		getWeather: () => wx,
		followShadows,
		followMirror,
		setPlanar(on) {
			planarOk = !!on;
			if (mirror) mirror.visible = planarOk;
		},
		sunDir: lightAim,
		tick,
		setTime,
		setClock,
		getClock: () => clock,
		setWeather,
		setLod,
		dispose() {
			if (disposed) return;
			disposed = true;
			const tracker = createObject3DDisposalTracker();
			disposeObject3D(group, tracker);
			const disposedSceneResources = /* @__PURE__ */ new Set([...tracker.geometries, ...tracker.materials]);
			for (let index = bag.length - 1; index >= 0; index -= 1) {
				const resource = bag[index];
				if (disposedSceneResources.has(resource)) continue;
				try {
					resource.dispose();
				} catch {}
			}
			bag.length = 0;
			dir.shadow.map?.dispose();
			dir.shadow.mapPass?.dispose();
			dirNear.shadow.map?.dispose();
			dirNear.shadow.mapPass?.dispose();
		}
	});
}
/** G0-03: rolling frame times. No GPU timer query yet (WebGL2 optional). */
var CAP = 120;
function pct(sorted, p) {
	if (!sorted.length) return 0;
	return sorted[Math.min(sorted.length - 1, Math.floor(p / 100 * sorted.length))];
}
var RenderTelemetry = class {
	buf = [];
	i = 0;
	filled = 0;
	last = 0;
	backend = "unknown";
	constructor() {
		this.buf = new Array(CAP).fill(0);
	}
	push(ms) {
		this.last = ms;
		this.buf[this.i] = ms;
		this.i = (this.i + 1) % CAP;
		if (this.filled < CAP) this.filled++;
	}
	snapshot() {
		const slice = this.buf.slice(0, this.filled).sort((a, b) => a - b);
		return {
			n: this.filled,
			p50: +pct(slice, 50).toFixed(2),
			p95: +pct(slice, 95).toFixed(2),
			p99: +pct(slice, 99).toFixed(2),
			last: +this.last.toFixed(2),
			backend: this.backend
		};
	}
};
/** G1-04: one linear working space, one ACES output. No extra LUTs. */
function applyColorPipeline(gl) {
	gl.outputColorSpace = SRGBColorSpace;
	gl.toneMapping = 4;
}
/**
* G1-01: the game talks to this, not to passes/RTs.
* Game canvas stays WebGLRenderer. ?webgpu=1 only probes three/webgpu (Codex 76).
* Reflector / composer / CSM.js / onBeforeCompile are not on this path.
*/
var RendererFacade = class RendererFacade {
	gl;
	telem = new RenderTelemetry();
	disposed = false;
	profile;
	static init(canvas, profile) {
		const mobile = canvas.clientWidth < 700 || /Mobi|Android/i.test(navigator.userAgent);
		const gl = new WebGLRenderer({
			canvas,
			antialias: !mobile && !profile.composer,
			alpha: false,
			powerPreference: "high-performance"
		});
		const gfx = new RendererFacade(gl, profile);
		gfx.setQuality(profile);
		gfx.resize(canvas.clientWidth, Math.max(1, canvas.clientHeight), Math.min(window.devicePixelRatio || 1, 1) * profile.pixelScale);
		applyColorPipeline(gl);
		gfx.telem.backend = gl.capabilities.isWebGL2 ? "webgl2" : "webgl1";
		return gfx;
	}
	/** Dummy canvas. Never attaches to the game. Whole probe capped at 4s. */
	static async probeWebGPU() {
		const run = async () => {
			if (!navigator.gpu) throw new Error("no navigator.gpu");
			const { WebGPURenderer } = await import("../_libs/three.mjs").then((n) => n.t);
			const r = new WebGPURenderer({
				canvas: document.createElement("canvas"),
				antialias: false,
				powerPreference: "high-performance"
			});
			await r.init();
			r.dispose();
			return {
				ok: true,
				reason: "init"
			};
		};
		try {
			return await Promise.race([run(), new Promise((resolve) => setTimeout(() => resolve({
				ok: false,
				reason: "webgpu init timeout"
			}), 4e3))]);
		} catch (e) {
			console.info("[gfx] webgpu fail", e);
			return {
				ok: false,
				reason: e instanceof Error ? e.message : "fail"
			};
		}
	}
	constructor(gl, profile) {
		this.gl = gl;
		this.profile = profile;
	}
	setEnvironment(exposure) {
		this.gl.toneMappingExposure = exposure;
	}
	setQuality(profile) {
		this.profile = profile;
		this.gl.shadowMap.enabled = profile.shadows > 0;
		this.gl.shadowMap.type = 2;
	}
	resize(width, height, dpr) {
		this.gl.setPixelRatio(dpr);
		this.gl.setSize(width, height, false);
	}
	render(scene, camera) {
		if (this.disposed) return;
		this.gl.render(scene, camera);
	}
	getTelemetry() {
		return this.telem.snapshot();
	}
	getProfile() {
		return this.profile;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.gl.setAnimationLoop(null);
		this.gl.dispose();
	}
};
var PROFILES = {
	compat: {
		version: 1,
		id: "compat",
		pixelScale: 1,
		shadows: 0,
		composer: false,
		bloom: false,
		planar: false,
		targetFps: 30
	},
	balanced: {
		version: 1,
		id: "balanced",
		pixelScale: .75,
		shadows: 1,
		composer: true,
		bloom: false,
		planar: false,
		targetFps: 60
	},
	high: {
		version: 1,
		id: "high",
		pixelScale: .85,
		shadows: 1,
		composer: true,
		bloom: true,
		planar: true,
		targetFps: 60
	},
	ultra: {
		version: 1,
		id: "ultra",
		pixelScale: 1,
		shadows: 1,
		composer: true,
		bloom: true,
		planar: true,
		targetFps: 60
	},
	photo: {
		version: 1,
		id: "photo",
		pixelScale: 1,
		shadows: 1,
		composer: true,
		bloom: true,
		planar: true,
		targetFps: 30
	}
};
function profileFromLegacy(q) {
	if (q === "low") return PROFILES.compat;
	if (q === "mid") return PROFILES.balanced;
	return PROFILES.high;
}
var DEFAULT_METADATA = {
	owner: "race-engine",
	kind: "other",
	shared: false
};
function sameMetadata(a, b) {
	return a.owner === b.owner && a.kind === b.kind && !!a.shared === !!b.shared;
}
var ResourceRegistry = class {
	items = /* @__PURE__ */ new Map();
	dead = false;
	sequence = 0;
	disposedIds = [];
	disposalErrors = [];
	retain(id, dispose, metadata = DEFAULT_METADATA) {
		if (!id.trim()) throw new Error("resource id must not be empty");
		const normalized = {
			...DEFAULT_METADATA,
			...metadata
		};
		if (this.dead) {
			this.disposeOne(id, dispose);
			return false;
		}
		const current = this.items.get(id);
		if (current) {
			if (current.dispose !== dispose) throw new Error(`resource ${id} retained with a different disposer`);
			if (!sameMetadata(current.metadata, normalized)) throw new Error(`resource ${id} retained with different ownership metadata`);
			current.count += 1;
			return true;
		}
		this.items.set(id, {
			count: 1,
			dispose,
			metadata: normalized,
			order: this.sequence++
		});
		return true;
	}
	release(id) {
		const current = this.items.get(id);
		if (!current) return false;
		current.count -= 1;
		if (current.count > 0) return false;
		this.items.delete(id);
		this.disposeOne(id, current.dispose);
		return true;
	}
	disposeAll() {
		if (this.dead) return {
			alreadyDisposed: true,
			disposed: 0,
			errors: this.disposalErrors.length,
			outstanding: 0
		};
		this.dead = true;
		const entries = [...this.items.entries()].sort((a, b) => b[1].order - a[1].order);
		this.items.clear();
		const before = this.disposedIds.length;
		for (const [id, lease] of entries) this.disposeOne(id, lease.dispose);
		return {
			alreadyDisposed: false,
			disposed: this.disposedIds.length - before,
			errors: this.disposalErrors.length,
			outstanding: this.items.size
		};
	}
	snapshot() {
		const outstanding = [...this.items.entries()].sort((a, b) => a[1].order - b[1].order).map(([id, lease]) => ({
			id,
			count: lease.count,
			owner: lease.metadata.owner,
			kind: lease.metadata.kind,
			shared: !!lease.metadata.shared,
			order: lease.order
		}));
		return {
			state: this.dead ? "disposed" : "active",
			leaseIds: outstanding.length,
			retainedReferences: outstanding.reduce((sum, lease) => sum + lease.count, 0),
			disposedIds: [...this.disposedIds],
			disposalErrors: [...this.disposalErrors],
			outstanding
		};
	}
	size() {
		return this.items.size;
	}
	disposeOne(id, dispose) {
		try {
			dispose();
		} catch (error) {
			this.disposalErrors.push(`${id}: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			this.disposedIds.push(id);
		}
	}
};
/** 21.6: drop planar → bloom → CSM → pixelScale. Raise after 5s under 16ms. */
function gfxPassFlags(step) {
	const s = Math.max(0, step);
	return {
		planar: s < 1,
		bloom: s < 2,
		csm: s < 3,
		pixelExtra: Math.max(0, s - 3)
	};
}
var DynamicQualityController = class {
	step = 0;
	over = 0;
	cool = 0;
	note(p95, dt) {
		if (p95 > 20) {
			this.over++;
			this.cool = 0;
			if (this.over >= 90 && this.step < 8) {
				this.step++;
				this.over = 0;
				return "drop";
			}
			return null;
		}
		this.over = 0;
		if (p95 < 16) {
			this.cool += dt;
			if (this.cool >= 5 && this.step > 0) {
				this.step--;
				this.cool = 0;
				return "raise";
			}
		} else this.cool = 0;
		return null;
	}
	reset() {
		this.step = 0;
		this.over = 0;
		this.cool = 0;
	}
};
var FIXED = PHYSICS_DT;
function onContextLost(e) {
	e.preventDefault();
	this.glLost = true;
}
function onContextRestored() {
	this.glLost = false;
	this.opts.onRestore?.();
}
function shouldPresent(now) {
	if (this.quality !== "low" && !this.lite) return true;
	return now - this.lastPresent >= 1e3 / 30;
}
function onResize() {
	const w = this.canvas.clientWidth;
	const h = Math.max(1, this.canvas.clientHeight);
	this.gfx.resize(w, h, this.renderer.getPixelRatio());
	this.camera.aspect = w / h;
	this.camera.updateProjectionMatrix();
	const size = new Vector2();
	this.renderer.getDrawingBufferSize(size);
	this.post.setSize(size.x, size.y);
}
function frame() {
	if (this.disposed || this.glLost) return;
	if (this.disposed) return;
	const now = performance.now();
	let dt = (now - this.last) / 1e3;
	this.last = now;
	dt = Math.min(dt, .1);
	this.telem.push(dt * 1e3);
	if (!this.soft && this.quality !== "low") {
		const snap = this.telem.snapshot();
		if (this.dyn.note(snap.p95, dt)) this.applyGfxStep();
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
		if (nightAmt(this.clock) > .5 !== this.world.night) {
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
		if (this.hudTimer > .08) {
			this.hudTimer = 0;
			this.pushHud();
		}
		return;
	}
	if (this.replaying && (this.input.keys.has("Enter") || this.input.keys.has("KeyX"))) this.skipReplay();
	if (this.paused && !this.photo) {
		this.post.render();
		this.flushSnap();
		return;
	}
	this.acc = Math.min(this.acc + dt, MAX_ACCUMULATOR);
	let steps = 0;
	while (this.acc >= FIXED && steps < 24) {
		this.fixed(FIXED);
		this.acc -= FIXED;
		steps++;
	}
	if (this.acc >= FIXED && steps >= 24) this.timeVoided = true;
	this.world.tick(now, this.player.x, this.player.z);
	this.nowSec = now / 1e3;
	if (!this.shouldPresent(now)) {
		this.hudTimer += dt;
		if (this.hudTimer > .08) {
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
	if (this.hudTimer > .08) {
		this.hudTimer = 0;
		this.pushHud();
	}
}
/** Codex 97: Photo-mode PNG dump. Only allowed runtime 2D canvas. */
function exportPhotoPng(src) {
	const c = document.createElement("canvas");
	c.width = src.width;
	c.height = src.height;
	const ctx = c.getContext("2d");
	if (!ctx) return;
	ctx.drawImage(src, 0, 0);
	ctx.font = `${Math.max(13, Math.round(c.width / 78))}px ui-sans-serif, system-ui, sans-serif`;
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillText("PHOTO MODE · RUSH", c.width - 18, c.height - 16);
	const a = document.createElement("a");
	a.href = c.toDataURL("image/png");
	a.download = `rush-photo-${Date.now()}.png`;
	a.click();
}
function upgradeGraphics() {
	if (this.disposed) return;
	if (!this.captureSceneEnv()) try {
		const env = bakeEnv(this.renderer, this.world.night);
		this.setEnvRT(env);
		this.scene.environment = env.texture;
	} catch {}
	this.scene.environmentIntensity = this.world.night ? .52 : .88;
	if (this.disposed) return;
	try {
		const post = createPost(this.renderer, this.scene, this.camera, this.world.night, this.lite);
		if (!this.leases.release("post")) this.post.dispose();
		this.post = post;
		this.leases.retain("post", () => post.dispose(), {
			owner: "race-engine",
			kind: "post-stack"
		});
		this.post.setTier(this.quality);
		this.applyGfxStep();
		this.onResize();
	} catch {}
}
function enterPhoto() {
	if (this.replaying || this.disposed) return;
	this.photo = true;
	this.paused = true;
	this.photoYaw = this.player.yaw + Math.PI;
	this.photoPitch = .22;
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
function exitPhoto() {
	this.photo = false;
	this.photoHide = false;
	this.photoLock = null;
	this.post.setFilter(0);
	this.renderer.setPixelRatio(this.drivePR);
	this.renderer.toneMappingExposure = this.driveExposure;
	this.onResize();
	this.pushHud();
}
function frameWorld(x, z, y = 52, camY = 22, back = 28, fov = 40) {
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
		fov
	};
	this.pushHud();
}
function isPhoto() {
	return this.photo;
}
function capturePhoto() {
	this.snapPhoto = true;
}
function flushSnap() {
	if (!this.snapPhoto) return;
	this.snapPhoto = false;
	try {
		exportPhotoPng(this.renderer.domElement);
	} catch {}
}
function cyclePhotoFilter() {
	this.photoFilter = (this.photoFilter + 1) % this.filterNames.length;
	this.post.setFilter(this.photoFilter);
	this.pushHud();
}
function togglePhotoHud() {
	this.photoHide = !this.photoHide;
	this.pushHud();
}
function setAutoCycle(on) {
	this.autoCycle = on;
	this.clockBake = 0;
	this.pushHud();
}
function getAutoCycle() {
	return this.autoCycle;
}
function setNight(night) {
	if (this.disposed) return;
	this.clock = night ? .9 : .5;
	this.applyClockSky(false);
}
function applyLook() {
	const n = nightAmt(this.clock);
	const morning = n <= .5 && this.clock < .38;
	const look = lookFromFlags(n > .5, this.weather, morning);
	this.gfx.setEnvironment(LOOKS[look].exposure);
	const spec = FOG[fogKey(this.trackDef.theme, this.trackDef.id)];
	this.fog.color.setHex(n > .5 ? spec.nightCol : spec.dayCol);
	this.fog.density = n > .5 ? spec.night : spec.day;
	this.scene.fog = this.fog;
	this.applyAltitudeLook();
}
function applyClockSky(rebake) {
	if (this.disposed) return;
	this.world.setClock(this.clock);
	const n = nightAmt(this.clock);
	this.applyLook();
	this.scene.background = new Color(n > .5 ? 2771564 : 3972832);
	this.scene.environmentIntensity = n > .5 ? .52 : .7;
	this.post.setNight(n > .5);
	const lamps = n > .42;
	for (const vis of this.visuals) setCarLights(vis, lamps);
	for (const vis of this.trafficVis) setCarLights(vis, lamps);
	for (const vis of this.copVis) setCarLights(vis, lamps);
	if (!rebake || this.soft) {
		this.pushHud();
		return;
	}
	if (!this.captureSceneEnv()) try {
		const env = bakeEnv(this.renderer, this.world.night);
		this.setEnvRT(env);
		this.scene.environment = env.texture;
	} catch {}
	this.pushHud();
}
function captureSceneEnv() {
	if (this.disposed || this.soft || this.quality === "low") return false;
	let renderTarget = null;
	const hidden = [];
	try {
		const size = this.trackDef.id === "ayalon" ? 128 : 96;
		renderTarget = new WebGLCubeRenderTarget(size);
		const cam = new CubeCamera(4, 400, renderTarget);
		cam.position.set(this.player.x, this.player.y + 26, this.player.z);
		const stash = (group) => {
			if (group.visible) {
				group.visible = false;
				hidden.push(group);
			}
		};
		for (const visual of this.visuals) stash(visual.group);
		for (const visual of this.trafficVis) stash(visual.group);
		for (const visual of this.copVis) stash(visual.group);
		cam.update(this.renderer, this.scene);
		this.leases.release("boot-env");
		const ownedTarget = renderTarget;
		this.scene.environment = ownedTarget.texture;
		this.leases.retain("boot-env", () => ownedTarget.dispose(), {
			owner: "race-engine",
			kind: "render-target"
		});
		renderTarget = null;
		return true;
	} catch {
		renderTarget?.dispose();
		return false;
	} finally {
		for (const group of hidden) group.visible = true;
	}
}
function applyAltitudeLook() {
	const spec = FOG[fogKey(this.trackDef.theme, this.trackDef.id)];
	if (this.trackDef.id !== "ramon" && this.trackDef.id !== "hermon" && this.trackDef.id !== "jerusalem" && this.trackDef.id !== "scopus" && this.trackDef.theme !== "carmel") return;
	if (nightAmt(this.clock) > .5) return;
	if (this.trackDef.id === "hermon") {
		const u = clamp(this.player.y / 110, 0, 1);
		this.fog.density = lerp(spec.day, spec.night * .62, u);
		this.fog.color.lerp(new Color(13162728), u * .28);
		return;
	}
	if (this.trackDef.id === "scopus") {
		const u = clamp(this.player.y / 52, 0, 1);
		this.fog.density = lerp(spec.day, spec.night * .5, u);
		this.fog.color.lerp(new Color(13688040), u * .2);
		return;
	}
	if (this.trackDef.id === "jerusalem") {
		const u = clamp(this.player.y / 54, 0, 1);
		this.fog.density = lerp(spec.day, spec.day * .85, u);
		return;
	}
	if (this.trackDef.theme === "carmel") {
		const u = clamp(this.player.y / 48, 0, 1);
		this.fog.density = lerp(spec.day, spec.night * .7, u);
		return;
	}
	const u = clamp(1 - this.player.y / 110, 0, 1);
	this.fog.density = lerp(spec.day, spec.night * .9, u);
	this.fog.color.lerp(new Color(14206112), u * .4);
}
function updateProbe() {
	if (!this.probeCam || !this.probeRT || this.soft) return;
	this.probeTick++;
	if (this.probeTick % 8 !== 1) return;
	for (const vis of this.visuals) vis.group.visible = false;
	this.probeCam.position.set(this.player.x, this.player.y + 1.05, this.player.z);
	this.probeCam.update(this.renderer, this.scene);
	const inten = nightAmt(this.clock) > .5 ? .8 : 1.2;
	for (const vis of this.visuals) {
		vis.group.visible = true;
		vis.group.traverse((o) => {
			const mat = o.material;
			if (mat && mat.isMeshPhysicalMaterial) {
				mat.envMap = this.probeRT.texture;
				if (mat === vis.bodyMat) mat.envMapIntensity = inten;
			}
		});
	}
}
function applyGfxStep() {
	const s = this.dyn.step;
	const f = gfxPassFlags(s);
	this.droppedTier = s > 0;
	this.world.setPlanar(f.planar);
	this.post.setBloom(f.bloom);
	this.csmMuted = !f.csm || this.quality === "low" || this.soft;
	const base = this.lite ? 1 : this.quality === "mid" ? .75 : .85;
	const scale = Math.max(.5, base * Math.pow(.85, f.pixelExtra));
	const mobile = typeof navigator !== "undefined" && /mobi|android|iphone|ipad/i.test(navigator.userAgent);
	this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1) * scale);
	this.onResize();
	this.trimCsm();
}
function stepPhoto(dt) {
	if (this.photoLock) {
		const L = this.photoLock;
		this.camera.position.set(L.px, L.py, L.pz);
		this.camera.lookAt(L.lx, L.ly, L.lz);
		if (Math.abs(this.camera.fov - L.fov) > .2) {
			this.camera.fov = L.fov;
			this.camera.updateProjectionMatrix();
		}
		this.post.setFilter(this.photoFilter);
		return;
	}
	const inp = this.input.poll();
	this.photoYaw += inp.steer * 1.55 * dt;
	this.photoPitch = clamp(this.photoPitch + (inp.throttle - inp.brake) * .7 * dt, -.4, .85);
	if (inp.nitro) this.photoDist = Math.max(3.2, this.photoDist - 9 * dt);
	if (inp.drift) this.photoDist = Math.min(22, this.photoDist + 9 * dt);
	const p = this.player;
	const fx = -Math.sin(this.photoYaw);
	const fz = -Math.cos(this.photoYaw);
	const cy = Math.sin(this.photoPitch);
	const cz = Math.cos(this.photoPitch);
	this.camera.position.set(p.x - fx * this.photoDist * cz, p.y + 1.1 + this.photoDist * cy, p.z - fz * this.photoDist * cz);
	this.camera.lookAt(p.x, p.y + .55, p.z);
	if (Math.abs(this.camera.fov - (48 + this.fovExtra)) > .2) {
		this.camera.fov = 48 + this.fovExtra;
		this.camera.updateProjectionMatrix();
	}
	this.post.setFilter(this.photoFilter);
	for (let i = 0; i < this.racers.length; i++) {
		const c = this.racers[i];
		updateCarVisual(this.visuals[i], c.yaw, 0, 0, 0, dt, c.x, c.y, c.z, c.pitch, 0);
	}
}
function present(dt) {
	const p = this.player;
	if (Math.abs(p.dirt - this.lastDirt) > .035) {
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
			blob.position.set(c.x - sun.x * .7, c.y + .04, c.z - sun.z * .7);
			const stretch = 1.05 + Math.abs(c.speed) * .014;
			blob.scale.set(stretch, 1, .92 + Math.abs(c.speed) * .008);
			blob.rotation.y = c.yaw;
			blob.visible = !c.eliminated;
			blob.material.opacity = (this.world.night ? .68 : .5) * (c.airborne ? .12 : 1);
		}
	}
	for (let i = 0; i < this.traffic.length; i++) {
		const c = this.traffic[i];
		updateCarVisual(this.trafficVis[i], c.yaw, c.speed, 0, 0, dt, c.x, c.y, c.z, c.roll, c.pitch, c.surfaceKind);
	}
	for (let i = 0; i < this.cops.length; i++) {
		const c = this.cops[i];
		updateCarVisual(this.copVis[i], c.yaw, c.speed, 0, 0, dt, c.x, c.y, c.z, c.roll, c.pitch);
		pulsePolice(this.copVis[i], this.nowSec + i * .17);
	}
	const fx = -Math.sin(p.yaw);
	const fz = -Math.cos(p.yaw);
	if (p.drifting || p.impact > .18 || p.wheelsLocked) {
		const spread = p.impact > .18 ? 1.4 : .8;
		for (let k = 0; k < 8; k++) {
			const i = Math.floor(hash01(this.tickId, k, 1) * 60) * 3;
			this.sparkPos[i] = p.x - fx * 1.6 + (hash01(this.tickId, k, 2) - .5) * spread;
			this.sparkPos[i + 1] = p.y + .12 + hash01(this.tickId, k, 3) * .35;
			this.sparkPos[i + 2] = p.z - fz * 1.6 + (hash01(this.tickId, k, 4) - .5) * spread;
		}
		this.sparks.geometry.getAttribute("position").needsUpdate = true;
		this.sparks.visible = true;
		const sm = this.sparks.material;
		sm.color.setHex(p.lastHit === "building" ? 16742968 : p.lastHit === "car" ? 16054008 : 16769152);
		sm.size = p.lastHit === "building" ? .26 : .16;
		this.skidAcc += Math.abs(p.speed) * dt;
		if (this.skidAcc > .55) {
			this.skidAcc = 0;
			this.skidDummy.position.set(p.x - fx * 1.5, p.y + .03, p.z - fz * 1.5);
			this.skidDummy.rotation.y = p.yaw;
			this.skidDummy.scale.set(1, 1, 1.1 + Math.abs(p.speed) * .018);
			this.skidDummy.updateMatrix();
			const idx = this.skidI % 180;
			this.skidMesh.setMatrixAt(idx, this.skidDummy.matrix);
			this.skidI += 1;
			this.skidMesh.count = Math.min(180, this.skidI);
			this.skidMesh.instanceMatrix.needsUpdate = true;
		}
	} else this.sparks.visible = false;
	this.ping = Math.max(0, this.ping - dt * 1.7);
	const gt = this.built.checkpoints[this.player.nextCheckpoint] ?? 0;
	const gs = this.built.samples[Math.floor(gt * this.built.samples.length) % this.built.samples.length];
	this.gate.position.set(gs.x, gs.y + 2.55, gs.z);
	this.gate.lookAt(gs.x + gs.tx, gs.y + 2.55, gs.z + gs.tz);
	this.gate.scale.setScalar(1 + this.ping * .18);
	this.gate.material.emissiveIntensity = 1.15 + this.ping * 2.2;
	this.gate.visible = this.racing && !this.player.finished && !this.replaying;
	if ((p.drifting || !p.onTrack && Math.abs(p.speed) > 10 || this.weather !== "clear" && Math.abs(p.speed) > 14) && this.smokes.length < 64) {
		if (hash01(this.tickId, 21) < (!p.onTrack ? .88 : .55)) this.smokes.push({
			x: p.x - fx * 1.7 + (hash01(this.tickId, 22) - .5) * .9,
			y: p.y + .08,
			z: p.z - fz * 1.7 + (hash01(this.tickId, 23) - .5) * .9,
			s: .45,
			life: 1,
			yaw: p.yaw
		});
	}
	for (let i = this.smokes.length - 1; i >= 0; i--) {
		const s = this.smokes[i];
		s.life -= dt * 1.15;
		s.s += dt * 1.6;
		s.y += dt * .35;
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
	this.smokeMesh.material.opacity = this.weather !== "clear" ? .32 : off ? .38 : .24;
	this.smokeMesh.material.color.setHex(off ? 9071176 : this.weather !== "clear" ? 13161692 : 11581630);
	if (p.boostT > 0 || p.drafting) {
		for (let k = 0; k < 10; k++) {
			const i = k * 3;
			this.boostPos[i] = p.x - fx * (1.8 + k * .12) + (hash01(this.tickId, k, 31) - .5) * .35;
			this.boostPos[i + 1] = p.y + .28 + hash01(this.tickId, k, 32) * .12;
			this.boostPos[i + 2] = p.z - fz * (1.8 + k * .12) + (hash01(this.tickId, k, 33) - .5) * .35;
		}
		this.boostPts.geometry.getAttribute("position").needsUpdate = true;
		this.boostPts.visible = true;
	} else this.boostPts.visible = false;
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
				this.rainPos[i3] = cam.x + (hash01(this.tickId, i, 41) - .5) * 34;
				this.rainPos[i3 + 1] = cam.y + 8 + hash01(this.tickId, i, 42) * 10;
				this.rainPos[i3 + 2] = cam.z + (hash01(this.tickId, i, 43) - .5) * 34;
			}
		}
		this.rainMesh.geometry.getAttribute("position").needsUpdate = true;
	}
	if (this.ghostVis && this.ghostFrames.length && !this.replaying) {
		const g = sampleGhost(this.ghostFrames, this.racing ? this.totalTime : 0);
		if (g) {
			this.ghostVis.group.visible = true;
			updateCarVisual(this.ghostVis, g.yaw, 18, 0, 0, dt, g.x, g.y, g.z, 0, 0);
			this.ghostDelta = this.totalTime - this.ghostFrames.length * .16 * this.player.progress;
		}
	}
	if (this.rivalGhostVis && this.rivalGhostFrames.length && !this.replaying) {
		const g = sampleGhostLoop(this.rivalGhostFrames, this.racing ? this.totalTime : 0);
		if (g) {
			this.rivalGhostVis.group.visible = true;
			updateCarVisual(this.rivalGhostVis, g.yaw, 22, 0, 0, dt, g.x, g.y, g.z, 0, 0);
			const lapT = this.rivalGhostFrames.length * .16;
			const mine = (this.player.progress + this.player.lap) * lapT;
			this.rivalGhostDelta = this.totalTime - mine;
		}
	}
}
function snapCamera(instant, dt = .016) {
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
		follow = .18;
		height = 1.16;
		side = .36;
	} else if (mode === 2) {
		follow = 1.35;
		height = .52;
	} else if (mode === 3) {
		follow = .4;
		height = 16;
		side = .2;
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
			if (d < keep && d > 1e-4) {
				this.cam.x = c.x + dx / d * keep;
				this.cam.z = c.z + dz / d * keep;
			}
		}
		const road = this.built.samples[p.sampleIndex];
		if (this.cam.y < road.y + 1.55) this.cam.y = road.y + 1.55;
	}
	const shake = this.replaying ? 0 : this.trauma * this.trauma;
	this.camera.position.set(this.cam.x + Math.sin(this.tickId * .73) * shake * .14, this.cam.y + Math.cos(this.tickId * 1.17) * shake * .08, this.cam.z + Math.sin(this.tickId * .91) * shake * .14);
	const lookAhead = mode === 3 ? .2 : mode === 1 ? 9 : 8 + clamp(Math.abs(p.speed) / 14, 0, 8);
	this.look.set(p.x + fx * lookAhead * dir, p.y + (mode === 3 ? .4 : mode === 1 ? .98 : .62), p.z + fz * lookAhead * dir);
	this.camera.lookAt(this.look);
	const fov = (mode === 1 ? 64 : mode === 2 ? 78 : mode === 3 ? 52 : 58 + clamp(Math.abs(p.speed) / 14, 0, 8) + (p.boostT > 0 || p.drafting ? 3 : 0)) + this.fovExtra;
	if (Math.abs(this.camera.fov - fov) > .2) {
		this.camera.fov = fov;
		this.camera.updateProjectionMatrix();
	}
}
function setFovExtra(v) {
	this.fovExtra = clamp(v, 0, 12);
}
function pushHud() {
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
		wrongWay: this.player.wrongWayT > .45,
		countdown: this.countdown,
		finished: this.player.finished,
		place,
		onTrack: this.player.onTrack,
		sideStreet: this.opts.langHe ? this.player.sideStreet : this.player.sideStreetEn,
		minimap: [
			...this.racers.map((r, i) => ({
				x: r.x,
				z: r.z,
				yaw: r.yaw,
				isPlayer: i === 0
			})),
			...this.traffic.map((r) => ({
				x: r.x,
				z: r.z,
				yaw: r.yaw,
				isPlayer: false,
				traffic: true
			})),
			...this.cops.map((r) => ({
				x: r.x,
				z: r.z,
				yaw: r.yaw,
				isPlayer: false,
				cop: true
			}))
		],
		trackPoly: this.poly,
		poiMarks: this.trackDef.pois.map((p) => ({
			x: p.x,
			z: p.z
		})),
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
		rewinds: this.rewindBuf.length * .05,
		photo: this.photo,
		photoFilter: this.opts.langHe ? this.filterHe[this.photoFilter] ?? "ללא" : this.filterNames[this.photoFilter] ?? "none",
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
		physicsHz: 120,
		msP95: this.telem.snapshot().p95,
		backend: this.telem.backend,
		kinMix: this.player.kinMix,
		drawCalls: this.renderer.info.render.calls,
		triangles: this.renderer.info.render.triangles,
		geometries: this.renderer.info.memory.geometries,
		textures: this.renderer.info.memory.textures
	});
}
function setEnvRT(rt) {
	this.leases.release("env-rt");
	this.envRT = rt;
	this.leases.retain("env-rt", () => rt.dispose(), {
		owner: "race-engine",
		kind: "render-target"
	});
}
function bindCsm() {
	if (!this.csm) return;
	this.scene.traverse((o) => {
		const m = o.material;
		if (!m) return;
		const list = Array.isArray(m) ? m : [m];
		for (const mat of list) {
			if (!mat) continue;
			if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
				this.csm.setupMaterial(mat);
				bindRoadCompile(mat);
			}
		}
	});
}
function csmWanted() {
	if (this.soft || this.quality === "low" || this.csmMuted) return 0;
	return this.quality === "high" ? 3 : 1;
}
function trimCsm() {
	if (!this.csm) return;
	const n = this.csmWanted();
	this.csm.lights.forEach((L, i) => {
		L.visible = i < n;
	});
}
function updateCsm() {
	if (!this.csm) return;
	const n = this.csmWanted();
	if (n === 0) {
		for (const L of this.csm.lights) L.intensity = 0;
		return;
	}
	this.csm.lightDirection.copy(this.world.sunDir).multiplyScalar(-1).normalize();
	const I = nightAmt(this.clock) > .5 ? .16 : 1.22;
	this.csm.lights.forEach((L, i) => {
		L.visible = i < n;
		L.intensity = i < n ? I : 0;
	});
	this.csm.update();
}
function rumblePad(mag) {
	try {
		const act = (navigator.getGamepads?.()?.[0])?.vibrationActuator;
		if (!act?.playEffect) return;
		act.playEffect("dual-rumble", {
			duration: 70 + mag * 140,
			strongMagnitude: Math.min(1, mag),
			weakMagnitude: Math.min(1, mag * .65),
			startDelay: 0
		});
	} catch {}
}
function fixed(dt) {
	this.tickId += 1;
	if (this.replaying) {
		this.stepReplay(dt);
		return;
	}
	if ((this.input.keys.has("KeyR") || this.input.touchRewind || !!navigator.getGamepads?.()?.[0]?.buttons[2]?.pressed) && this.racing && this.countdown <= 0 && !this.player.finished && this.rewindBuf.length > 1) {
		this.stepRewind(dt);
		return;
	}
	if (this.rewinding) this.post.setFilter(0);
	this.rewinding = false;
	if (this.countdown > 0) {
		const prev = this.countdown;
		this.countdown -= dt;
		if (Math.floor(prev) !== Math.floor(this.countdown) && this.countdown > 0) this.audio.beep(this.countdown > 1 ? 520 : 780, .1, .16);
		if (prev > 0 && this.countdown <= 0) {
			this.racing = true;
			this.audio.beep(980, .22, .2);
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
	if (this.player.wrongWayT > .45 && this.racing && !this.player.finished) {
		this.wrongBeep -= dt;
		if (this.wrongBeep <= 0) {
			this.audio.beep(220, .16, .12);
			this.wrongBeep = .9;
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
	if (this.racing && this.countdown <= 0 && !this.player.finished) updateDrafting(this.player, this.racers);
	else this.player.drafting = false;
	const hit = separateCars([
		...this.racers,
		...this.traffic,
		...this.cops
	]);
	if (this.player.nitroPulse) this.audio.whoosh();
	if (this.player.impact > .55 && this.impactCd <= 0) {
		this.audio.impact(this.player.impact);
		this.trauma = Math.min(1, this.trauma + this.player.impact * .7);
		this.freeze = .012;
		this.impactCd = .22;
		this.player.damage = Math.min(1, this.player.damage + this.player.impact * (this.player.lastHit === "building" ? .08 : .04));
		applyDamage(this.visuals[0], this.player.damage, this.player.dirt);
		rumblePad(this.player.impact);
		if (this.mode === "heat") this.bustAcc = Math.min(2.7, this.bustAcc + .38);
		this.combo = 0;
		this.comboHold = 0;
	} else if (hit > 10 && this.impactCd <= 0) {
		this.audio.impact(Math.min(1, hit / 18));
		this.trauma = Math.min(1, this.trauma + .28);
		this.impactCd = .18;
		this.player.damage = Math.min(1, this.player.damage + .05);
		applyDamage(this.visuals[0], this.player.damage, this.player.dirt);
		rumblePad(.35);
	}
	this.audio.updateEngine(Math.abs(this.player.speed), this.player.boostT > 0, this.player.drifting, this.player.slip, this.player.rpm);
	this.audio.pulseMusic(this.world.night, dt);
	this.audio.updateSiren(this.mode === "heat" && this.racing && !this.busted && !this.escaping, dt);
	this.audio.updateRain(this.weather === "rain" || this.weather === "storm", this.weather === "storm");
	if (this.racing && !this.player.finished) {
		this.ghostAcc += dt;
		if (this.ghostAcc >= .16) {
			this.ghostAcc = 0;
			this.ghostBuf.push({
				x: this.player.x,
				y: this.player.y,
				z: this.player.z,
				yaw: this.player.yaw
			});
		}
		this.recordReplay(dt);
	}
	if (this.player.drifting) this.trauma = Math.min(.35, this.trauma + dt * .12);
	if (this.player.surfaceKind === "curb") this.trauma = Math.min(.45, this.trauma + dt * .35);
	if (this.player.surfaceKind === "sand") this.trauma = Math.min(.3, this.trauma + dt * .12);
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
function stepDriftCraft(dt) {
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
	this.player.comboMul = 1 + this.combo * .18;
	if (!this.player.drifting || this.missCd > 0 || this.player.finished) {
		if (this.bonusT <= 0) this.driftBonus = "";
		return;
	}
	const others = [
		...this.racers,
		...this.traffic,
		...this.cops
	];
	for (const o of others) {
		if (o === this.player || o.eliminated) continue;
		const d = Math.hypot(o.x - this.player.x, o.z - this.player.z);
		if (d < 2.3 || d > 6.4) continue;
		if (Math.abs(this.player.speed - o.speed) < 6) continue;
		const pts = Math.round((220 + (6.4 - d) * 80) * this.player.comboMul);
		this.player.driftScore += pts;
		this.combo = Math.min(12, this.combo + 1);
		this.missCd = .7;
		this.bonusT = 1.4;
		this.driftBonus = this.opts.langHe ? `ניר-מיס +${pts}` : `Near miss +${pts}`;
		this.trauma = Math.min(1, this.trauma + .22);
		break;
	}
}
function standings() {
	return [...this.racers].sort((a, b) => b.raceScore() - a.raceScore());
}
function stepHeat(dt) {
	if (this.busted || this.player.finished) return;
	let nearest = Infinity;
	for (const cop of this.cops) nearest = Math.min(nearest, Math.hypot(cop.x - this.player.x, cop.z - this.player.z));
	this.wanted = 1 + Math.min(4, Math.floor(this.heatMax * 4.2));
	if (nearest < 18) {
		this.escaping = false;
		this.cooldown = Math.max(0, this.cooldown - dt * .55);
		const close = 1 - nearest / 18;
		const speedEase = 1.15 - clamp(Math.abs(this.player.speed) / 52, 0, .7);
		this.bustAcc += dt * close * speedEase * (.85 + this.wanted * .08);
	} else if (nearest > 40) {
		this.escaping = true;
		this.cooldown = Math.min(1, this.cooldown + dt / 7.2);
		this.bustAcc = Math.max(0, this.bustAcc - dt * .45);
		if (this.cooldown >= 1) {
			this.wanted = Math.max(1, this.wanted - 1);
			this.heatMax = Math.max(.12, this.heatMax - .22);
			this.cooldown = 0;
			this.escaping = false;
			this.bustAcc *= .35;
			this.banter = this.opts.langHe ? "איבדת אותם. קירור." : "You lost them. Cooldown.";
			this.banterT = 2.8;
			this.pushCopsBack();
		}
	} else {
		this.escaping = false;
		this.cooldown = Math.max(0, this.cooldown - dt * .18);
	}
	this.heat = clamp(this.bustAcc / 2.7, 0, 1);
	this.heatMax = Math.max(this.heatMax, this.heat);
	if (this.totalTime > 5) this.ensureCops(Math.min(this.lite ? 3 : 5, this.wanted + 1));
	this.blockCd = Math.max(0, this.blockCd - dt);
	if (this.heat > .32 && this.blockCd <= 0 && this.totalTime > 8 && !this.blockGroup) this.spawnRoadblock();
	this.tickRoadblock();
	if (this.bustAcc >= 2.7) {
		this.busted = true;
		this.player.finished = true;
		this.audio.bust();
		this.trauma = 1;
		this.endRace();
	}
}
function pushCopsBack() {
	for (let i = 0; i < this.cops.length; i++) {
		const t = (this.player.progress - .12 - i * .03 + 1) % 1;
		this.cops[i].spawn(this.built, t, this.cops[i].aiOffset);
		this.cops[i].speed = 18;
	}
}
function ensureCops(n) {
	while (this.cops.length < n) this.addCop(this.cops.length);
}
function addCop(i) {
	const nyc = this.trackDef.city === "nyc";
	const color = 15920872;
	const accent = nyc ? 1718890 : 1454152;
	const base = CARS[0];
	const cop = new ArcadeCar({
		...base,
		id: base.id,
		color,
		accent,
		maxSpeed: 54 + i * 1.1,
		accel: 5.4,
		brake: 32,
		turnRate: 2.35,
		grip: .94,
		drag: .48,
		mass: 1.18
	}, nyc ? "NYPD" : "Police");
	cop.isAi = true;
	cop.isCop = true;
	cop.aiSkill = .96;
	cop.aiOffset = (i % 2 === 0 ? -1 : 1) * 2.4;
	cop.nitro = .55;
	cop.baseGrip = SURFACE_GRIP[this.trackDef.theme] ?? 1;
	cop.surfaceGrip = cop.baseGrip;
	cop.spawn(this.built, (this.player.progress - .1 - i * .03 + 1) % 1, cop.aiOffset);
	this.cops.push(cop);
	const vis = createCarVisual(color, accent, false, false, "gt", true);
	setCarLights(vis, this.world.night);
	this.scene.add(vis.group);
	this.copVis.push(vis);
}
function spawnRoadblock() {
	const t = (this.player.progress + .15) % 1;
	const s = sampleAtT(this.built.samples, t);
	const yaw = Math.atan2(-s.tx, -s.tz);
	this.built.width * .22;
	const side = hashStr(`${this.opts.trackId}|${t.toFixed(4)}`) > .5 ? 1 : -1;
	const group = new Group();
	const mat = new MeshStandardMaterial({
		color: 9080984,
		roughness: .72,
		metalness: .12
	});
	const coneMat = new MeshStandardMaterial({
		color: 15228960,
		roughness: .55
	});
	const hits = [];
	const place = (lat, r) => {
		const x = s.x + s.rx * lat;
		const z = s.z + s.rz * lat;
		const box = new Mesh(new BoxGeometry(1.4, 1.15, 2.6), mat);
		box.position.set(x, s.y + .6, z);
		box.rotation.y = yaw;
		box.castShadow = !this.lite;
		group.add(box);
		hits.push({
			x,
			z,
			r,
			kind: "barrier"
		});
	};
	place(side * (this.built.width * .38), 2.4);
	place(side * (this.built.width * .18), 2.2);
	place(-side * (this.built.width * .4), 2.1);
	for (let i = 0; i < 4; i++) {
		const lat = side * (.08 + i * .12) * this.built.width;
		const cone = new Mesh(new ConeGeometry(.28, .9, 6), coneMat);
		cone.position.set(s.x + s.rx * lat, s.y + .48, s.z + s.rz * lat);
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
function tickRoadblock() {
	if (!this.blockGroup || this.blockT < 0) return;
	let ds = this.player.progress - this.blockT;
	if (ds < -.5) ds += 1;
	if (ds > .12) this.clearRoadblock();
}
function navAngle() {
	const p = this.player;
	const cps = this.built.checkpoints;
	if (!cps.length) return 0;
	const idx = (p.nextCheckpoint % cps.length + cps.length) % cps.length;
	const s = this.built.samples[Math.floor(cps[idx] * this.built.samples.length) % this.built.samples.length];
	const dx = s.x - p.x;
	const dz = s.z - p.z;
	const fx = -Math.sin(p.yaw);
	const fz = -Math.cos(p.yaw);
	const rx = Math.cos(p.yaw);
	const rz = -Math.sin(p.yaw);
	return Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz);
}
function stampPois() {
	if (this.player.finished || this.countdown > 0) return;
	const pois = this.trackDef.pois;
	for (let i = 0; i < pois.length; i++) {
		if (this.poiGot.has(i)) continue;
		const p = pois[i];
		if (Math.hypot(this.player.x - p.x, this.player.z - p.z) < p.r * .72) {
			this.poiGot.add(i);
			this.audio.checkpoint();
			this.ping = 1;
			this.banter = this.opts.langHe ? p.he : p.en;
			this.banterT = 2.2;
		}
	}
	if (pois.length > 0 && this.poiGot.size >= pois.length) this.endRace();
}
function clearRoadblock() {
	if (this.blockGroup) {
		this.scene.remove(this.blockGroup);
		this.blockGroup.traverse((o) => {
			const m = o;
			if (m.geometry) m.geometry.dispose();
			const mat = m.material;
			if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
			else mat?.dispose();
		});
	}
	this.blockGroup = null;
	this.extraHits = [];
	this.blockT = -1;
}
function checkKnockout() {
	const alive = this.racers.filter((r) => !r.eliminated && !r.finished);
	const leadLap = Math.max(0, ...alive.map((r) => r.lap));
	if (leadLap <= this.koMarked) return;
	this.koMarked = leadLap;
	if (alive.length <= 1) return;
	const last = [...alive].sort((a, b) => a.raceScore() - b.raceScore())[0];
	last.eliminated = true;
	last.finished = true;
	this.audio.impact(.65);
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
function closeSector(i) {
	const t = this.sectorClock;
	this.sectorClock = 0;
	if (t < .4) return;
	const idx = (i % 3 + 3) % 3;
	const best = this.bestSectors[idx];
	this.sectorDelta = Number.isFinite(best) && best < 1e8 ? t - best : 0;
	if (t < best) this.bestSectors[idx] = t;
}
function endRace() {
	if (this.finishedSent || this.pendingResult) return;
	this.player.finished = true;
	this.audio.finish();
	this.audio.cheer();
	let place = this.standings().indexOf(this.player) + 1;
	if (this.mode === "heat") place = this.busted ? 4 : 1;
	if (this.mode === "time" || this.mode === "drift" || this.mode === "roam") place = 1;
	if (this.mode === "knockout" && this.player.eliminated) place = this.racers.filter((r) => !r.eliminated).length + 1;
	const eligible = !this.timeVoided && !this.qaForcedFinish && Number.isFinite(this.totalTime) && this.totalTime >= 8;
	const resultDraft = {
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
		eligible
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
function emitFinish() {
	if (this.finishedSent || !this.pendingResult) return;
	this.finishedSent = true;
	this.replaying = false;
	this.opts.onFinish(this.pendingResult);
}
function skipReplay() {
	if (!this.replaying) return;
	this.replaying = false;
	this.emitFinish();
}
function recordSnap() {
	this.replayBuf.push(this.racers.map((r) => ({
		x: r.x,
		y: r.y,
		z: r.z,
		yaw: r.yaw,
		speed: r.speed
	})));
	if (this.replayBuf.length > 140) this.replayBuf.shift();
}
function recordReplay(dt) {
	if (!this.racing || this.player.finished) return;
	this.replayAcc += dt;
	if (this.replayAcc >= .1) {
		this.replayAcc = 0;
		this.recordSnap();
	}
	this.rewindAcc += dt;
	if (this.rewindAcc >= .05) {
		this.rewindAcc = 0;
		this.rewindBuf.push(this.takePack());
		if (this.rewindBuf.length > 100) this.rewindBuf.shift();
	}
}
function takePack() {
	return {
		totalTime: this.totalTime,
		lapTime: this.lapTime,
		heat: this.heat,
		bustAcc: this.bustAcc,
		cooldown: this.cooldown,
		wanted: this.wanted,
		cars: this.racers.map((c) => c.snap()),
		traffic: this.traffic.map((c) => c.snap()),
		cops: this.cops.map((c) => c.snap())
	};
}
function applyPack(p) {
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
	const keepGhost = Math.max(0, Math.floor(this.totalTime / .16));
	if (this.ghostBuf.length > keepGhost) this.ghostBuf.length = keepGhost;
	const keepRep = Math.max(0, Math.floor(this.totalTime / .1));
	if (this.replayBuf.length > keepRep) this.replayBuf.length = keepRep;
}
function stepRewind(dt) {
	this.rewinding = true;
	this.rewindTickT += dt;
	if (this.rewindTickT > .08) {
		this.rewindTickT = 0;
		this.audio.rewindTick();
	}
	this.rewindAcc += dt;
	while (this.rewindAcc >= .05 && this.rewindBuf.length > 1) {
		this.rewindAcc -= .05;
		this.rewindBuf.pop();
		const last = this.rewindBuf[this.rewindBuf.length - 1];
		if (last) this.applyPack(last);
	}
	this.post.setFilter(0);
}
function stepReplay(dt) {
	const dur = this.replayBuf.length * .1;
	const slow = this.replayT < 1.35 || this.replayT > dur - 2.1;
	this.replayT += slow ? dt * .42 : dt;
	this.replaySlow = slow;
	if (this.replayT >= dur) {
		this.skipReplay();
		return;
	}
	const i = Math.min(this.replayBuf.length - 1, Math.floor(this.replayT / .1));
	const a = this.replayBuf[i];
	const b = this.replayBuf[Math.min(this.replayBuf.length - 1, i + 1)];
	const f = Math.min(1, (this.replayT - i * .1) / .1);
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
function qaHookAllowed() {
	return false;
}
function exposeControls() {}
function engineAdapterHost(engine) {
	return engine;
}
function isSoftwareGL(renderer) {
	const gl = renderer.getContext();
	const info = gl.getExtension("WEBGL_debug_renderer_info");
	const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || "") : "";
	const basic = String(gl.getParameter(gl.RENDERER) || "");
	return /swiftshader|llvmpipe|softpipe|microsoft basic render|subzero/i.test(`${name} ${basic}`);
}
var RaceEngine = class {
	renderer;
	gfx;
	leases = new ResourceRegistry();
	scene;
	camera;
	input;
	audio;
	world;
	post;
	envRT;
	probeRT = null;
	probeCam = null;
	probeTick = 0;
	built;
	trackDef;
	player;
	racers;
	visuals;
	blobs = [];
	sparks;
	sparkPos;
	cam = new Vector3();
	look = new Vector3();
	desired = new Vector3();
	disposed = false;
	paused = false;
	racing = false;
	countdown = 1.45;
	totalTime = 0;
	lapTime = 0;
	bestLap = Infinity;
	laps = [];
	acc = 0;
	last = 0;
	trauma = 0;
	fog = new FogExp2(790552, .005);
	hood = false;
	hudTimer = 0;
	hoodEdge = false;
	lookBack = false;
	autoCycle = false;
	clock = .5;
	clockBake = 0;
	lastDirt = -1;
	replaySlow = false;
	banter = "";
	banterT = 0;
	lastPlace = 4;
	rivalIdx = 0;
	combo = 0;
	comboHold = 0;
	lastDrifting = false;
	poiGot = /* @__PURE__ */ new Set();
	wrongBeep = 0;
	driftBonus = "";
	bonusT = 0;
	missCd = 0;
	gate;
	ping = 0;
	snapPhoto = false;
	sectorClock = 0;
	sectorIdx = 0;
	sectorDelta = 0;
	bestSectors = [
		Infinity,
		Infinity,
		Infinity
	];
	fovExtra = 0;
	skidMesh;
	skidI = 0;
	skidAcc = 0;
	skidDummy = new Object3D();
	smokeMesh;
	smokeDummy = new Object3D();
	smokes = [];
	boostPts;
	boostPos;
	traffic = [];
	trafficVis = [];
	freeze = 0;
	impactCd = 0;
	poly;
	opts;
	canvas;
	lite = false;
	quality = "high";
	droppedTier = false;
	dyn = new DynamicQualityController();
	csmMuted = false;
	lastPresent = 0;
	webgpuTried = false;
	webgpuOk = false;
	webgpuReason = "";
	soft = false;
	mode = "circuit";
	totalLaps = 3;
	cops = [];
	copVis = [];
	heat = 0;
	heatMax = 0;
	bustAcc = 0;
	busted = false;
	cooldown = 0;
	wanted = 1;
	escaping = false;
	extraHits = [];
	csm = null;
	blockGroup = null;
	blockT = -1;
	blockCd = 0;
	finishedSent = false;
	koMarked = 0;
	nowSec = 0;
	weather = "clear";
	rainMesh = null;
	rainPos = null;
	ghostVis = null;
	ghostFrames = [];
	ghostBuf = [];
	ghostAcc = 0;
	ghostBeaten = false;
	cashWon = 0;
	ghostDelta = 0;
	rivalGhostVis = null;
	rivalGhostFrames = [];
	rivalGhostDelta = 0;
	camMode = 0;
	replaying = false;
	replayT = 0;
	replayBuf = [];
	replayAcc = 0;
	pendingResult = null;
	camNames = ["chase"];
	rewindBuf = [];
	rewindAcc = 0;
	rewinding = false;
	rewindTickT = 0;
	radioEdge = false;
	radioToast = 0;
	photo = false;
	photoHide = false;
	photoYaw = 0;
	photoPitch = .22;
	photoDist = 8;
	photoFilter = 0;
	photoLock = null;
	drivePR = 1;
	driveExposure = 1;
	filterNames = [
		"none",
		"warm",
		"neon",
		"mono",
		"film",
		"blockbuster",
		"bleach",
		"polaroid"
	];
	filterHe = [
		"ללא",
		"חם",
		"ניאון",
		"שחור-לבן",
		"פילם",
		"הוליווד",
		"בליץ'",
		"פולארויד"
	];
	ready;
	booted = false;
	tickId = 0;
	timeVoided = false;
	qaForcedFinish = false;
	glLost = false;
	telem;
	constructor(canvas, opts) {
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
		this.renderer.shadowMap.type = 2;
		this.scene = new Scene();
		const spec = FOG[fogKey(this.trackDef.theme, opts.trackId)];
		const skyDay = this.trackDef.theme === "desert" || opts.trackId === "ramon" ? 4892892 : this.trackDef.theme === "snow" || opts.trackId === "hermon" ? 7254232 : 3117012;
		const skyNight = 1582134;
		this.gfx.setEnvironment(opts.night ? LOOKS.night.exposure : LOOKS.summer14.exposure);
		this.fog = new FogExp2(opts.night ? spec.nightCol : spec.dayCol, opts.night ? spec.night : spec.day);
		this.scene.fog = this.fog;
		this.scene.background = new Color(opts.night ? skyNight : skyDay);
		const mountain = spec.far >= 12e3 || opts.trackId === "scopus" || opts.trackId === "jerusalem";
		this.camera = new PerspectiveCamera(68, canvas.clientWidth / Math.max(1, canvas.clientHeight), .28, mountain ? Math.max(spec.far, 12e3) : spec.far);
		this.opts.onBoot?.(.12);
		canvas.addEventListener("webglcontextlost", this.onContextLost);
		canvas.addEventListener("webglcontextrestored", this.onContextRestored);
		this.ready = this.assemble(shadows, soft);
	}
	async assemble(shadows, soft) {
		await new Promise((r) => requestAnimationFrame(() => r()));
		await new Promise((r) => requestAnimationFrame(() => r()));
		if (this.disposed) return;
		this.opts.onBoot?.(.18);
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
		this.opts.onBoot?.(.72);
		await new Promise((r) => requestAnimationFrame(() => r()));
		if (this.disposed) {
			this.world.dispose();
			return;
		}
		this.clock = this.opts.night ? .9 : .5;
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
				shadowBias: -8e-5
			});
			const csm = this.csm;
			this.leases.retain("csm", () => {
				csm.remove();
				csm.dispose();
				if (this.csm === csm) this.csm = null;
			}, {
				owner: "race-engine",
				kind: "csm"
			});
			this.bindCsm();
		}
		const fallbackPost = () => ({
			composer: null,
			bloom: null,
			grade: null,
			setSize() {},
			setDrive() {},
			setNight() {},
			setFilter() {},
			setBudget() {},
			setTier() {},
			setBloom() {},
			render: () => this.renderer.render(this.scene, this.camera),
			dispose() {}
		});
		this.setEnvRT(new WebGLRenderTarget(1, 1));
		this.post = fallbackPost();
		if (!soft && this.quality !== "low") requestAnimationFrame(() => this.upgradeGraphics());
		this.input = new GameInput(this.canvas);
		this.audio = new GameAudio();
		this.audio.setVoice(getCar(this.opts.carId).body);
		const playerDef = applyTune(getCar(this.opts.carId), emptyTune());
		this.player = new ArcadeCar(playerDef, playerDef.nameHe);
		this.player.roam = (this.opts.mode ?? "circuit") === "roam" || this.opts.trackId === "gushdan";
		this.player.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
		this.player.weather = this.weather;
		this.player.handling = this.opts.handling ?? "arcade";
		this.player.assists = { ...this.opts.assists ?? DEFAULT_ASSISTS };
		this.player.damage = getDamage(this.opts.carId);
		this.mode = this.opts.mode ?? "circuit";
		this.totalLaps = this.trackDef.open ? 1 : MODE_LAPS[this.mode];
		this.racers = [this.player];
		if (hasAiPack(this.mode)) CARS.filter((c) => c.id !== this.opts.carId).slice(0, 3).forEach((d, i) => {
			const rival = RIVALS[i % RIVALS.length];
			const ai = new ArcadeCar(d, this.opts.langHe ? rival.he : rival.en);
			ai.isAi = true;
			ai.aiSkill = .9 - i * .05;
			ai.aiOffset = (i % 2 === 0 ? -1 : 1) * (2.2 + i * .4);
			ai.handling = this.player.handling;
			ai.assists = {
				abs: true,
				tcs: true,
				esc: true
			};
			ai.weather = this.weather;
			this.racers.push(ai);
		});
		const gMul = WEATHER_GRIP[this.weather] ?? 1;
		const sg = SURFACE_GRIP[this.trackDef.theme] ?? 1;
		for (const r of this.racers) {
			r.weatherGrip = gMul;
			r.weather = this.weather;
			r.baseGrip = sg;
			r.surfaceGrip = sg;
		}
		this.visuals = this.racers.map((r, i) => {
			const vis = createCarVisual(r.stats.color, r.stats.accent, shadows, i === 0 && !soft && this.quality !== "low", r.stats.body, r.stats.kit === "police", i === 0 ? this.opts.tune : void 0);
			setCarLights(vis, this.opts.night);
			if (i === 0) applyDamage(vis, this.player.damage, this.player.dirt);
			this.scene.add(vis.group);
			return vis;
		});
		if (!soft && this.quality !== "low") {
			this.probeRT = new WebGLCubeRenderTarget(96);
			const probeRT = this.probeRT;
			this.leases.retain("probe-rt", () => {
				probeRT.dispose();
				if (this.probeRT === probeRT) this.probeRT = null;
			}, {
				owner: "race-engine",
				kind: "render-target"
			});
			this.probeCam = new CubeCamera(1.2, 220, this.probeRT);
		}
		const blobTex = getBlob();
		if (!blobTex) throw new Error("blob texture missing");
		const blobGeo = new PlaneGeometry(4.9, 2.45);
		blobGeo.rotateX(-Math.PI / 2);
		const blobMat = new MeshBasicMaterial({
			map: blobTex,
			transparent: true,
			opacity: this.opts.night ? .68 : .5,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -1,
			polygonOffsetUnits: -1
		});
		this.blobs = this.racers.map(() => {
			const m = new Mesh(blobGeo, blobMat);
			m.renderOrder = 1;
			m.frustumCulled = false;
			this.scene.add(m);
			return m;
		});
		const n = this.built.samples.length;
		this.poly = [];
		for (let i = 0; i < n; i += 4) this.poly.push({
			x: this.built.samples[i].x,
			z: this.built.samples[i].z
		});
		this.sparkPos = /* @__PURE__ */ new Float32Array(180);
		const sparkGeo = new BufferGeometry();
		sparkGeo.setAttribute("position", new BufferAttribute(this.sparkPos, 3));
		this.sparks = new Points(sparkGeo, new PointsMaterial({
			color: 16763e3,
			size: .18,
			transparent: true,
			opacity: .85,
			depthWrite: false
		}));
		this.scene.add(this.sparks);
		this.gate = new Mesh(new TorusGeometry(this.built.width * .42, .08, 8, 24), new MeshStandardMaterial({
			color: 7260356,
			emissive: 3855560,
			emissiveIntensity: 1.6,
			roughness: .25,
			metalness: .2,
			transparent: true,
			opacity: .85
		}));
		this.gate.rotation.y = Math.PI / 2;
		this.scene.add(this.gate);
		const skidGeo = new PlaneGeometry(.62, 1.55);
		skidGeo.rotateX(-Math.PI / 2);
		const skidMat = new MeshBasicMaterial({
			map: blobTex,
			color: 1184790,
			transparent: true,
			opacity: .48,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2
		});
		this.skidMesh = new InstancedMesh(skidGeo, skidMat, 180);
		this.skidMesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.skidMesh.count = 0;
		this.scene.add(this.skidMesh);
		const smokeGeo = new PlaneGeometry(1.6, 1.6);
		smokeGeo.rotateX(-Math.PI / 2);
		const smokeMat = new MeshBasicMaterial({
			map: blobTex,
			color: 11581630,
			transparent: true,
			opacity: .26,
			depthWrite: false
		});
		this.smokeMesh = new InstancedMesh(smokeGeo, smokeMat, 64);
		this.smokeMesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.smokeMesh.count = 0;
		this.scene.add(this.smokeMesh);
		this.boostPos = /* @__PURE__ */ new Float32Array(90);
		const boostGeo = new BufferGeometry();
		boostGeo.setAttribute("position", new BufferAttribute(this.boostPos, 3));
		this.boostPts = new Points(boostGeo, new PointsMaterial({
			color: 8315100,
			size: .22,
			transparent: true,
			opacity: .8,
			depthWrite: false
		}));
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
		} catch {}
		if (!this.captureSceneEnv()) try {
			const env = bakeEnv(this.renderer, this.world.night);
			this.setEnvRT(env);
			this.scene.environment = env.texture;
		} catch {}
		this.scene.environmentIntensity = this.world.night ? .42 : .7;
		this.renderer.setAnimationLoop(() => this.frame());
		this.rivalIdx = (this.opts.eventId?.length ?? 1) % 4;
		const ev = this.opts.eventId ? getEvent(this.opts.eventId) : null;
		this.banter = introLine(ev, this.opts.langHe);
		this.banterT = 5.5;
		this.pushHud();
		this.booted = true;
		this.opts.onBoot?.(1);
	}
	placeGrid() {
		const n = this.racers.length;
		for (let i = 0; i < n; i++) {
			const t = i === 0 ? .03 : (.03 - .012 * i + 1) % 1;
			const lat = i === 0 ? this.trackDef.id === "rothschild" ? -10.2 : -2.2 : this.racers[i].aiOffset;
			if (i === 0) this.racers[i].aiOffset = lat;
			this.racers[i].spawn(this.built, t, lat);
		}
		this.clearSpawnHits();
	}
	clearSpawnHits() {
		const s0 = this.built.samples[0];
		const pad = this.built.width / 2 + 14;
		const keep = this.world.colliders.filter((c) => {
			if (Math.hypot(c.x - s0.x, c.z - s0.z) < pad) return false;
			for (const r of this.racers) if (Math.hypot(c.x - r.x, c.z - r.z) < c.r + 4.5) return false;
			return true;
		});
		this.world.colliders.length = 0;
		this.world.colliders.push(...keep);
	}
	spawnTraffic() {
		const highway = this.trackDef.theme === "highway" || this.trackDef.id === "gushdan" || this.trackDef.id === "hw90";
		const n = this.lite ? 4 : highway ? 11 : this.mode === "roam" ? 9 : 7;
		const nyc = this.trackDef.city === "nyc";
		const base = CARS[0];
		for (let i = 0; i < n; i++) {
			const kind = nyc ? i % 2 ? "taxi" : "sedan" : i % 5 === 0 ? "bus" : highway && i % 4 === 1 ? "truck" : i % 2 ? "taxi" : "sherut";
			const color = kind === "taxi" ? 16106496 : kind === "bus" ? 15262932 : kind === "truck" ? 3817028 : kind === "sedan" ? 1842206 : 15789284;
			const accent = kind === "taxi" ? 1710620 : kind === "bus" ? 1727546 : 15920872;
			const body = kind === "taxi" || kind === "bus" ? "hatch" : kind === "truck" ? "muscle" : "gt";
			const cab = new ArcadeCar({
				...base,
				id: base.id,
				color,
				accent,
				maxSpeed: kind === "truck" ? 16 : kind === "bus" ? 18 : 21,
				accel: kind === "truck" ? 1.6 : kind === "bus" ? 1.9 : 2.6,
				brake: 7,
				turnRate: kind === "truck" ? 1.35 : 1.7,
				grip: .88,
				drag: kind === "truck" ? .9 : .7,
				mass: kind === "truck" ? 1.8 : kind === "bus" ? 1.45 : 1.05
			}, nyc ? "Taxi" : kind === "bus" ? "Egged" : kind === "truck" ? "Truck" : kind === "taxi" ? "Taxi" : "Sherut");
			cab.isAi = true;
			cab.isTraffic = true;
			cab.aiSkill = .48 + i % 3 * .08;
			const lane = this.trackDef.id === "rothschild" ? 10.2 : Math.min(kind === "truck" ? 2.6 : 3.4, this.built.width * .28);
			cab.aiOffset = (i % 2 === 0 ? -1 : 1) * lane;
			cab.baseGrip = SURFACE_GRIP[this.trackDef.theme] ?? 1;
			cab.surfaceGrip = cab.baseGrip;
			cab.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
			cab.weather = this.weather;
			cab.handling = "simcade";
			cab.assists = {
				abs: true,
				tcs: true,
				esc: false
			};
			cab.spawn(this.built, (.12 + i / n) % 1, cab.aiOffset);
			this.traffic.push(cab);
			const vis = createCarVisual(color, accent, false, false, body);
			if (kind === "bus") vis.group.scale.set(1.12, 1.22, 1.38);
			if (kind === "truck") vis.group.scale.set(1.18, 1.28, 1.42);
			setCarLights(vis, this.opts.night);
			this.scene.add(vis.group);
			this.trafficVis.push(vis);
		}
	}
	spawnCops() {
		const n = this.lite ? 2 : 3;
		const nyc = this.trackDef.city === "nyc";
		const color = 15920872;
		const accent = nyc ? 1718890 : 1454152;
		const base = CARS[0];
		for (let i = 0; i < n; i++) {
			const cop = new ArcadeCar({
				...base,
				id: base.id,
				color,
				accent,
				maxSpeed: 54,
				accel: 5.4,
				brake: 32,
				turnRate: 2.35,
				grip: .94,
				drag: .48,
				mass: 1.18
			}, nyc ? "NYPD" : "Police");
			cop.isAi = true;
			cop.isCop = true;
			cop.aiSkill = .96;
			cop.aiOffset = (i % 2 === 0 ? -1 : 1) * 2.4;
			cop.nitro = .55;
			cop.baseGrip = SURFACE_GRIP[this.trackDef.theme] ?? 1;
			cop.surfaceGrip = cop.baseGrip;
			cop.weatherGrip = WEATHER_GRIP[this.weather] ?? 1;
			cop.weather = this.weather;
			cop.handling = this.player.handling;
			cop.assists = {
				abs: true,
				tcs: true,
				esc: true
			};
			cop.spawn(this.built, (.86 - i * .04 + 1) % 1, cop.aiOffset);
			this.cops.push(cop);
			const vis = createCarVisual(color, accent, false, false, "gt", true);
			setCarLights(vis, this.opts.night);
			this.scene.add(vis.group);
			this.copVis.push(vis);
		}
	}
	spawnRain() {
		const snow = this.trackDef.theme === "snow";
		const dust = this.weather === "hamsin";
		if (this.weather === "clear" && !snow) return;
		const n = this.lite ? 280 : snow ? 720 : dust ? 640 : this.weather === "storm" ? 900 : 560;
		const pos = new Float32Array(n * 3);
		for (let i = 0; i < n; i++) {
			pos[i * 3] = (hash01(i, 1) - .5) * 36;
			pos[i * 3 + 1] = hash01(i, 2) * 22;
			pos[i * 3 + 2] = (hash01(i, 3) - .5) * 36;
		}
		this.rainPos = pos;
		const geo = new BufferGeometry();
		geo.setAttribute("position", new BufferAttribute(pos, 3));
		const mat = new PointsMaterial({
			color: snow ? 16054524 : dust ? 12886128 : this.weather === "storm" ? 12109004 : 13950436,
			size: snow ? .16 : dust ? .11 : this.weather === "storm" ? .09 : .06,
			transparent: true,
			opacity: snow ? .72 : dust ? .42 : .55,
			depthWrite: false
		});
		this.rainMesh = new Points(geo, mat);
		this.scene.add(this.rainMesh);
	}
	spawnGhost() {
		if (this.mode === "roam") return;
		const tintGhost = (vis, hex) => {
			vis.bodyMat.transparent = true;
			vis.bodyMat.opacity = .3;
			vis.bodyMat.metalness = .2;
			vis.bodyMat.roughness = .35;
			vis.bodyMat.emissive.setHex(hex);
			vis.bodyMat.emissiveIntensity = .32;
			vis.bodyMat.depthWrite = false;
			setCarLights(vis, false);
		};
		const stored = getGhost(this.opts.trackId);
		if (stored?.frames.length) {
			this.ghostFrames = stored.frames;
			const vis = createCarVisual(7260356, 1454152, false, false, this.player.stats.body);
			tintGhost(vis, 7260356);
			this.scene.add(vis.group);
			this.ghostVis = vis;
		}
		const lap = Math.max(18, this.built.length / 34);
		this.rivalGhostFrames = paceGhost(this.built.samples, this.built.length, lap);
		if (this.rivalGhostFrames.length > 8) {
			const vis = createCarVisual(15778816, 3811848, false, false, "gt");
			tintGhost(vis, 15778816);
			this.scene.add(vis.group);
			this.rivalGhostVis = vis;
		}
	}
	upgradeGraphics() {
		return upgradeGraphics.call(engineAdapterHost(this));
	}
	unlockAudio() {
		this.audio.unlock();
	}
	setPaused(p) {
		if (this.photoLock && !p) return;
		this.paused = p;
		if (!p && this.photo) this.exitPhoto();
	}
	applyQuality(q) {
		this.quality = q === "low" || q === "mid" ? q : "high";
		this.lite = this.quality === "low" || this.soft;
		this.droppedTier = false;
		this.dyn.reset();
		this.csmMuted = this.quality === "low" || this.soft;
		const mobile = typeof navigator !== "undefined" && /mobi|android|iphone|ipad/i.test(navigator.userAgent);
		const scale = this.lite ? 1 : this.quality === "mid" ? .75 : .85;
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1) * scale);
		this.renderer.shadowMap.enabled = this.quality !== "low" && !this.soft;
		if (this.quality === "low") this.post.setTier("low");
		else if (!this.post.composer) this.upgradeGraphics();
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
	setTouch(partial) {
		this.input.setTouch(partial);
	}
	enterPhoto() {
		return enterPhoto.call(engineAdapterHost(this));
	}
	exitPhoto() {
		return exitPhoto.call(engineAdapterHost(this));
	}
	frameWorld(x, z, y = 52, camY = 22, back = 28, fov = 40) {
		return frameWorld.call(engineAdapterHost(this), x, z, y, camY, back, fov);
	}
	isPhoto() {
		return isPhoto.call(engineAdapterHost(this));
	}
	capturePhoto() {
		return capturePhoto.call(engineAdapterHost(this));
	}
	flushSnap() {
		return flushSnap.call(engineAdapterHost(this));
	}
	cyclePhotoFilter() {
		return cyclePhotoFilter.call(engineAdapterHost(this));
	}
	togglePhotoHud() {
		return togglePhotoHud.call(engineAdapterHost(this));
	}
	cycleRadio() {
		const id = this.audio.cycleStation();
		this.radioToast = 2.6;
		return RADIO[id];
	}
	setAutoCycle(on) {
		return setAutoCycle.call(engineAdapterHost(this), on);
	}
	getAutoCycle() {
		return getAutoCycle.call(engineAdapterHost(this));
	}
	setNight(night) {
		return setNight.call(engineAdapterHost(this), night);
	}
	applyLook() {
		return applyLook.call(engineAdapterHost(this));
	}
	applyClockSky(rebake) {
		return applyClockSky.call(engineAdapterHost(this), rebake);
	}
	captureSceneEnv() {
		return captureSceneEnv.call(engineAdapterHost(this));
	}
	applyAltitudeLook() {
		return applyAltitudeLook.call(engineAdapterHost(this));
	}
	updateProbe() {
		return updateProbe.call(engineAdapterHost(this));
	}
	onContextLost = (e) => onContextLost.call(engineAdapterHost(this), e);
	onContextRestored = () => onContextRestored.call(engineAdapterHost(this));
	applyGfxStep() {
		return applyGfxStep.call(engineAdapterHost(this));
	}
	shouldPresent(now) {
		return shouldPresent.call(engineAdapterHost(this), now);
	}
	onResize() {
		return onResize.call(engineAdapterHost(this));
	}
	frame() {
		return frame.call(engineAdapterHost(this));
	}
	fixed(dt) {
		return fixed.call(engineAdapterHost(this), dt);
	}
	stepDriftCraft(dt) {
		return stepDriftCraft.call(engineAdapterHost(this), dt);
	}
	standings() {
		return standings.call(engineAdapterHost(this));
	}
	stepHeat(dt) {
		return stepHeat.call(engineAdapterHost(this), dt);
	}
	pushCopsBack() {
		return pushCopsBack.call(engineAdapterHost(this));
	}
	ensureCops(n) {
		return ensureCops.call(engineAdapterHost(this), n);
	}
	addCop(i) {
		return addCop.call(engineAdapterHost(this), i);
	}
	spawnRoadblock() {
		return spawnRoadblock.call(engineAdapterHost(this));
	}
	tickRoadblock() {
		return tickRoadblock.call(engineAdapterHost(this));
	}
	navAngle() {
		return navAngle.call(engineAdapterHost(this));
	}
	stampPois() {
		return stampPois.call(engineAdapterHost(this));
	}
	clearRoadblock() {
		return clearRoadblock.call(engineAdapterHost(this));
	}
	checkKnockout() {
		return checkKnockout.call(engineAdapterHost(this));
	}
	closeSector(i) {
		return closeSector.call(engineAdapterHost(this), i);
	}
	endRace() {
		return endRace.call(engineAdapterHost(this));
	}
	emitFinish() {
		return emitFinish.call(engineAdapterHost(this));
	}
	skipReplay() {
		return skipReplay.call(engineAdapterHost(this));
	}
	recordSnap() {
		return recordSnap.call(engineAdapterHost(this));
	}
	recordReplay(dt) {
		return recordReplay.call(engineAdapterHost(this), dt);
	}
	takePack() {
		return takePack.call(engineAdapterHost(this));
	}
	applyPack(p) {
		return applyPack.call(engineAdapterHost(this), p);
	}
	stepRewind(dt) {
		return stepRewind.call(engineAdapterHost(this), dt);
	}
	stepPhoto(dt) {
		return stepPhoto.call(engineAdapterHost(this), dt);
	}
	stepReplay(dt) {
		return stepReplay.call(engineAdapterHost(this), dt);
	}
	present(dt) {
		return present.call(engineAdapterHost(this), dt);
	}
	snapCamera(instant, dt = .016) {
		return snapCamera.call(engineAdapterHost(this), instant, dt);
	}
	setFovExtra(v) {
		return setFovExtra.call(engineAdapterHost(this), v);
	}
	pushHud() {
		return pushHud.call(engineAdapterHost(this));
	}
	qaHookAllowed() {
		return qaHookAllowed.call(engineAdapterHost(this));
	}
	exposeControls() {
		return exposeControls.call(engineAdapterHost(this));
	}
	setEnvRT(rt) {
		return setEnvRT.call(engineAdapterHost(this), rt);
	}
	bindCsm() {
		return bindCsm.call(engineAdapterHost(this));
	}
	csmWanted() {
		return csmWanted.call(engineAdapterHost(this));
	}
	trimCsm() {
		return trimCsm.call(engineAdapterHost(this));
	}
	updateCsm() {
		return updateCsm.call(engineAdapterHost(this));
	}
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
	}
};
//#endregion
export { RaceEngine };
