import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/** Codex 78: no SSGI/volumetric GI. Fog is Exp2 in engine. Rain is Points. */
export const SSGI_OFF = true;

const GRADE = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uSpeed: { value: 0 },
    uBoost: { value: 0 },
    uNight: { value: 0 },
    uFilter: { value: 0 },
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
  `,
};

export type PostStack = {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  grade: ShaderPass;
  smaa?: SMAAPass;
  gtao?: { setSize: (w: number, h: number) => void };
  setSize: (w: number, h: number) => void;
  setDrive: (speed01: number, boost: boolean) => void;
  setNight: (night: boolean) => void;
  setFilter: (f: number) => void;
  setBudget: (lite: boolean) => void;
  setTier: (q: "low" | "mid" | "high") => void;
  setBloom: (on: boolean) => void;
  render: () => void;
  dispose: () => void;
};

export function createPost(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  night: boolean,
  lite = false,
): PostStack {
  const size = new THREE.Vector2();
  renderer.getDrawingBufferSize(size);
  const rt = new THREE.WebGLRenderTarget(size.x, size.y, {
    type: lite ? THREE.UnsignedByteType : THREE.HalfFloatType,
    depthBuffer: true,
  });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));

  const bloomStrength = night && !lite ? 0.11 : 0;
  const bloom = new UnrealBloomPass(
    size,
    bloomStrength,
    night ? 0.2 : 0.06,
    night ? 0.84 : 0.96,
  );
  bloom.enabled = night && !lite;
  composer.addPass(bloom);

  const smaa = lite ? undefined : new SMAAPass();
  if (smaa) composer.addPass(smaa);

  const grade = new ShaderPass(GRADE);
  grade.uniforms.uNight.value = night ? 1 : 0;
  composer.addPass(grade);
  composer.addPass(new OutputPass());

  let useComposer = !lite;
  let tier: "low" | "mid" | "high" = lite ? "low" : "high";

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
    setNight(next: boolean) {
      night = next;
      grade.uniforms.uNight.value = next ? 1 : 0;
      bloom.enabled = next && tier === "high";
      bloom.strength = next && tier === "high" ? 0.11 : 0;
      bloom.radius = next ? 0.2 : 0.06;
      bloom.threshold = next ? 0.84 : 0.96;
    },
    setFilter(f: number) {
      grade.uniforms.uFilter.value = f;
    },
    setBudget(nextLite: boolean) {
      this.setTier(nextLite ? "low" : "high");
    },
    setTier(q: "low" | "mid" | "high") {
      tier = q;
      lite = q === "low";
      useComposer = q !== "low";
      if (smaa) smaa.enabled = q !== "low";
      bloom.enabled = night && q === "high";
      bloom.strength = night && q === "high" ? 0.11 : 0;
    },
    setBloom(on: boolean) {
      bloom.enabled = on && night && tier === "high";
      bloom.strength = bloom.enabled ? 0.11 : 0;
    },
    render() {
      if (useComposer) composer.render();
      else renderer.render(scene, camera);
    },
    dispose() {
      composer.dispose();
      rt.dispose();
    },
  };
}

/** Tiny PMREM from a 3-object scene. Not an HDRI. Not IBL from a real sky. */
export function bakeEnv(renderer: THREE.WebGLRenderer, night = false) {
  const tmp = new THREE.Scene();
  tmp.background = new THREE.Color(night ? 0x182436 : 0x3a9ae0);
  tmp.add(new THREE.HemisphereLight(night ? 0x4a6080 : 0xc8e8ff, night ? 0x1a1410 : 0xb89868, night ? 0.55 : 1.2));
  const sun = new THREE.DirectionalLight(night ? 0xa8c0e0 : 0xffe8c4, night ? 0.32 : 1.2);
  sun.position.set(6, 14, 4);
  tmp.add(sun);
  if (!night) {
    const disc = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff6d8 }),
    );
    disc.position.set(10, 16, 7);
    tmp.add(disc);
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(22, 24),
      new THREE.MeshLambertMaterial({ color: 0x3a4248 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.2;
    tmp.add(ground);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(tmp, 0.04);
  pmrem.dispose();
  return env;
}