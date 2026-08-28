import * as THREE from "three";

/** Codex 136 PARTIAL: gantry labels. Bake to PNG still pending. Allowlisted canvas. */
export function mkSign(he: string, bag: { push: (x: THREE.Texture | THREE.Material) => void }, fallback: THREE.Material, en?: string) {
  const cnv = document.createElement("canvas");
  cnv.width = 512;
  cnv.height = 128;
  const ctx = cnv.getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = "#0c4a2a";
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = "#d8e8d8";
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.fillStyle = "#f4f7f4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 40px Arial, sans-serif";
  ctx.fillText(he, 256, en ? 48 : 64);
  if (en) {
    ctx.font = "600 22px Arial, sans-serif";
    ctx.fillText(en, 256, 92);
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  bag.push(tex);
  const mat = new THREE.MeshBasicMaterial({ map: tex, fog: false, side: THREE.DoubleSide });
  bag.push(mat);
  return mat;
}
