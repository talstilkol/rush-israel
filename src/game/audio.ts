import { hash01 } from "./math";

/** Codex 70: Web Audio oscillators only. Mute is Esc settings. */
export const AUDIO_BACKEND = "oscillator" as const;

export const RADIO = [
  { id: 0, he: "פאלס 101", en: "Pulse 101" },
  { id: 1, he: "גל ים", en: "Yam FM" },
  { id: 2, he: "המחתרת", en: "Underground" },
  { id: 3, he: "לילה לבן", en: "White Night" },
] as const;

function hz(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

type StationPat = {
  bpm: number;
  kick: number[];
  snare: number[];
  hat: number[];
  bass: number[];
  chords: number[][];
  lead: number[];
};

const STATIONS: StationPat[] = [
  {
    bpm: 126,
    kick: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    hat: [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    bass: [45, 0, 45, 48, 0, 45, 41, 0, 45, 0, 48, 0, 43, 0, 41, 43],
    chords: [
      [57, 60, 64],
      [53, 57, 60],
      [48, 52, 55],
      [55, 59, 62],
    ],
    lead: [72, 0, 76, 0, 74, 72, 0, 69, 72, 0, 76, 79, 0, 76, 74, 0],
  },
  {
    bpm: 94,
    kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    bass: [50, 0, 0, 50, 0, 0, 53, 0, 50, 0, 48, 0, 45, 0, 47, 0],
    chords: [
      [62, 66, 69],
      [57, 61, 64],
      [53, 57, 60],
      [55, 59, 62],
    ],
    lead: [74, 0, 0, 76, 0, 74, 69, 0, 71, 0, 74, 0, 69, 0, 67, 0],
  },
  {
    bpm: 138,
    kick: [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    bass: [40, 40, 0, 43, 40, 0, 36, 40, 40, 0, 43, 0, 38, 38, 0, 36],
    chords: [
      [52, 55, 59],
      [48, 52, 55],
      [50, 53, 57],
      [47, 50, 55],
    ],
    lead: [76, 79, 0, 76, 0, 72, 71, 0, 76, 0, 79, 83, 0, 79, 76, 0],
  },
  {
    bpm: 108,
    kick: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    hat: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
    bass: [44, 0, 44, 47, 0, 44, 42, 0, 44, 0, 49, 0, 47, 0, 42, 44],
    chords: [
      [56, 59, 63],
      [54, 58, 61],
      [51, 54, 58],
      [49, 54, 58],
    ],
    lead: [68, 0, 71, 75, 0, 71, 68, 0, 66, 0, 68, 71, 0, 75, 73, 0],
  },
];

export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private driftGain: GainNode | null = null;
  private driftSrc: AudioBufferSourceNode | null = null;
  private musicGain: GainNode | null = null;
  private muted = false;
  private started = false;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenT = 0;
  private rainGain: GainNode | null = null;
  private rainSrc: AudioBufferSourceNode | null = null;
  private station = 0;
  private voice = 1;
  private voiceVol = 1;
  private sched = 0;
  private step = 0;
  private noise: AudioBuffer | null = null;

  private visBound = false;

  unlock() {
    if (!this.started) this.bootGraph();
    this.resumeSync();
    this.bindVisibility();
  }

  private resumeSync() {
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
  }

  private bindVisibility() {
    if (this.visBound || typeof document === "undefined") return;
    this.visBound = true;
    const onVis = () => {
      if (document.visibilityState === "visible") this.resumeSync();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
  }

  private bootGraph() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC({ latencyHint: "interactive" });
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.sfx = ctx.createGain();
    this.engineGain = ctx.createGain();
    this.driftGain = ctx.createGain();
    this.master.gain.value = 0.55;
    this.sfx.gain.value = 0.7;
    this.engineGain.gain.value = 0;
    this.driftGain.gain.value = 0;
    this.sfx.connect(this.master);
    this.engineGain.connect(this.master);
    this.driftGain.connect(this.master);
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.22;
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
    this.sched = ctx.currentTime + 0.05;
    this.step = 0;
  }

  private makeNoise() {
    if (!this.ctx) return null;
    const len = this.ctx.sampleRate * 1.2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = hash01(i, 97) * 2 - 1;
    return buf;
  }

  private noiseBuffer() {
    return this.noise ?? this.makeNoise();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx!.currentTime, 0.04);
  }

  isMuted() {
    return this.muted;
  }

  setVoice(kind: string) {
    if (kind === "ev") {
      this.voice = 1.85;
      this.voiceVol = 0.55;
    } else if (kind === "muscle") {
      this.voice = 0.7;
      this.voiceVol = 1.35;
    } else if (kind === "super") {
      this.voice = 1.28;
      this.voiceVol = 1.12;
    } else if (kind === "rally") {
      this.voice = 0.92;
      this.voiceVol = 1.18;
    } else {
      this.voice = 1;
      this.voiceVol = 1;
    }
  }

  updateEngine(speedAbs: number, boosting: boolean, drifting: boolean, slip = 0, rpm01 = 0) {
    if (!this.ctx || !this.engineOsc || !this.engineGain) return;
    const t = this.ctx.currentTime;
    const rpm = (85 + rpm01 * 540 + (boosting ? 55 : 0) + speedAbs * 0.9) * this.voice;
    this.engineOsc.frequency.setTargetAtTime(rpm, t, 0.04);
    this.engineOsc2?.frequency.setTargetAtTime(rpm * (this.voice < 0.85 ? 1.12 : 1.34), t, 0.04);
    const vol = this.muted ? 0 : Math.min(0.38, (0.06 + speedAbs * 0.0055 + rpm01 * 0.05) * this.voiceVol);
    this.engineGain.gain.setTargetAtTime(vol, t, 0.05);
    const scream = drifting || slip > 0.2;
    this.driftGain?.gain.setTargetAtTime(this.muted ? 0 : scream ? 0.035 + slip * 0.12 : 0, t, 0.04);
    if (this.musicGain && !this.muted) {
      this.musicGain.gain.setTargetAtTime(boosting ? 0.1 : speedAbs > 8 ? 0.16 : 0.22, t, 0.1);
    }
  }

  beep(freq: number, dur = 0.12, vol = 0.18) {
    if (!this.ctx || !this.sfx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(this.sfx);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  whoosh() {
    if (!this.ctx || !this.sfx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(240, t);
    o.frequency.exponentialRampToValueAtTime(90, t + 0.28);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g);
    g.connect(this.sfx);
    o.start(t);
    o.stop(t + 0.32);
  }

  impact(amount = 0.5) {
    if (!this.ctx || !this.sfx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(90 + amount * 40, t);
    o.frequency.exponentialRampToValueAtTime(32, t + 0.16);
    const vol = 0.08 + amount * 0.16;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g);
    g.connect(this.sfx);
    o.start(t);
    o.stop(t + 0.24);
    const n = this.ctx.createBufferSource();
    const noise = this.noiseBuffer();
    if (noise) {
      n.buffer = noise;
      const ng = this.ctx.createGain();
      const bp = this.ctx.createBiquadFilter();
      bp.type = "lowpass";
      bp.frequency.value = 380;
      ng.gain.setValueAtTime(0.06 + amount * 0.1, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      n.connect(bp);
      bp.connect(ng);
      ng.connect(this.sfx);
      n.start(t);
      n.stop(t + 0.16);
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
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.sfx);
      src.start(t);
      src.stop(t + 1.15);
    }
    this.beep(523, 0.18, 0.1);
    this.beep(784, 0.28, 0.1);
  }

  checkpoint() {
    this.beep(880, 0.08, 0.1);
    this.beep(1180, 0.1, 0.08);
  }

  finish() {
    this.beep(523, 0.16, 0.16);
    this.beep(659, 0.2, 0.14);
    this.beep(784, 0.28, 0.14);
  }

  private tone(type: OscillatorType, freq: number, t: number, dur: number, vol: number, dest: AudioNode, slide?: number) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, freq), t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur * 0.7);
    g.gain.setValueAtTime(Math.max(0.0001, vol), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noiseHit(t: number, dur: number, vol: number, hpHz: number, dest: AudioNode) {
    if (!this.ctx || !this.noise) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    f.type = hpHz > 2000 ? "highpass" : "bandpass";
    f.frequency.value = hpHz;
    g.gain.setValueAtTime(Math.max(0.0001, vol), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  pulseMusic(night: boolean, _dt: number) {
    if (!this.ctx || !this.musicGain || this.muted) return;
    const st = STATIONS[this.station] ?? STATIONS[0];
    const now = this.ctx.currentTime;
    const stepDur = 60 / st.bpm / 4;
    if (this.sched < now - 0.4) this.sched = now;
    const dest = this.musicGain;
    while (this.sched < now + 0.14) {
      const i = this.step % 16;
      const bar = Math.floor(this.step / 16) % st.chords.length;
      const t = this.sched;
      if (st.kick[i]) this.tone("sine", night ? 95 : 78, t, 0.18, night ? 0.22 : 0.16, dest, 38);
      if (st.snare[i]) this.noiseHit(t, 0.12, 0.09, 1800, dest);
      if (st.hat[i]) this.noiseHit(t, 0.045, night ? 0.04 : 0.028, 5200, dest);
      if (st.bass[i]) {
        const type: OscillatorType = this.station === 2 ? "square" : this.station === 1 ? "sine" : "sawtooth";
        this.tone(type, hz(st.bass[i]), t, stepDur * 1.35, this.station === 2 ? 0.07 : 0.09, dest);
      }
      if (i === 0) {
        const chord = st.chords[bar];
        const lp = this.ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = night ? 1400 : 900;
        const cg = this.ctx.createGain();
        cg.gain.setValueAtTime(0.0001, t);
        cg.gain.exponentialRampToValueAtTime(this.station === 1 ? 0.05 : 0.032, t + 0.08);
        cg.gain.exponentialRampToValueAtTime(0.001, t + stepDur * 16 * 0.95);
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
      if (st.lead[i] && (night || this.station !== 1 || i % 4 === 0)) {
        this.tone("triangle", hz(st.lead[i] + (night ? 0 : -12)), t, stepDur * 1.8, night ? 0.055 : 0.04, dest);
      }
      this.step += 1;
      this.sched += stepDur;
    }
  }

  cycleStation() {
    this.station = (this.station + 1) % RADIO.length;
    this.step = 0;
    if (this.ctx) this.sched = this.ctx.currentTime + 0.02;
    return this.station;
  }

  getStation() {
    return this.station;
  }

  rewindTick() {
    this.beep(420, 0.04, 0.05);
  }

  updateRain(on: boolean, storm: boolean) {
    if (!this.ctx || !this.rainGain) return;
    const vol = this.muted || !on ? 0 : storm ? 0.08 : 0.045;
    this.rainGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.12);
  }

  updateSiren(on: boolean, dt: number) {
    if (!this.ctx || !this.sirenGain || !this.sirenOsc) return;
    const t = this.ctx.currentTime;
    this.sirenGain.gain.setTargetAtTime(on && !this.muted ? 0.055 : 0, t, 0.08);
    if (!on) return;
    this.sirenT += dt;
    const hi = this.sirenT % 0.7 < 0.35;
    this.sirenOsc.frequency.setTargetAtTime(hi ? 910 : 680, t, 0.035);
  }

  bust() {
    this.beep(180, 0.4, 0.22);
    this.beep(140, 0.5, 0.18);
  }

  resume() {
    this.resumeSync();
  }

  dispose() {
    try {
      this.engineOsc?.stop();
      this.engineOsc2?.stop();
      this.driftSrc?.stop();
      this.sirenOsc?.stop();
      this.rainSrc?.stop();
      void this.ctx?.close();
    } catch {
      /* ignore */
    }
    this.ctx = null;
    this.started = false;
  }
}
