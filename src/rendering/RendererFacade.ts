import * as THREE from "three";
import type { QualityProfile } from "./QualityProfile";
import { RenderTelemetry } from "./RenderTelemetry";
import { applyColorPipeline } from "./ColorPipeline";

/**
 * G1-01: the game talks to this, not to passes/RTs.
 * Today the backend is WebGLRenderer only. WebGPU is not wired.
 */
export class RendererFacade {
  readonly gl: THREE.WebGLRenderer;
  readonly telem = new RenderTelemetry();
  private disposed = false;
  private profile: QualityProfile;

  static init(canvas: HTMLCanvasElement, profile: QualityProfile): RendererFacade {
    const mobile = canvas.clientWidth < 700 || /Mobi|Android/i.test(navigator.userAgent);
    const gl = new THREE.WebGLRenderer({
      canvas,
      antialias: !mobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    const gfx = new RendererFacade(gl, profile);
    gfx.setQuality(profile);
    gfx.resize(canvas.clientWidth, Math.max(1, canvas.clientHeight), Math.min(window.devicePixelRatio || 1, 1) * profile.pixelScale);
    applyColorPipeline(gl);
    gfx.telem.backend = gl.capabilities.isWebGL2 ? "webgl2" : "webgl1";
    return gfx;
  }

  private constructor(gl: THREE.WebGLRenderer, profile: QualityProfile) {
    this.gl = gl;
    this.profile = profile;
  }

  setEnvironment(exposure: number) {
    this.gl.toneMappingExposure = exposure;
  }

  setQuality(profile: QualityProfile) {
    this.profile = profile;
    this.gl.shadowMap.enabled = profile.shadows > 0;
    this.gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  resize(width: number, height: number, dpr: number) {
    this.gl.setPixelRatio(dpr);
    this.gl.setSize(width, height, false);
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
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
}
