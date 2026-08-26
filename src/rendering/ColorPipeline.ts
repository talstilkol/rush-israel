import * as THREE from "three";

/** G1-04: one linear working space, one ACES output. No extra LUTs. */
export function applyColorPipeline(gl: THREE.WebGLRenderer) {
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
}
