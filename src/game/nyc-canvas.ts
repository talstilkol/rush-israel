import * as THREE from "three";
import { hash01 } from "./math";

/** NYC-only runtime canvases. Israel must not import this on the hot path if unused — world gates on city==="nyc". */

export function facadeTexture(theme: string, night: boolean) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d");
  const stone = theme === "stone";
  const jaffa = theme === "jaffa";
  const hwy = theme === "highway" || theme === "manhattan";
  const bau = theme === "bauhaus" || (!stone && !jaffa && !hwy && theme !== "desert" && theme !== "port");
  ctx.fillStyle = stone ? "#c4b090" : jaffa ? "#c4a070" : hwy ? "#1a3040" : theme === "desert" ? "#d4b48c" : theme === "port" ? "#b0a898" : "#e8e0d4";
  ctx.fillRect(0, 0, 256, 512);
  if (stone) {
    for (let y = 0; y < 512; y += 28) {
      ctx.fillStyle = y % 56 === 0 ? "#b8a07c" : "#d0be9c";
      ctx.fillRect(0, y, 256, 26);
      ctx.fillStyle = "#8a7860";
      ctx.fillRect(0, y + 26, 256, 2);
      for (let x = ((y / 28) % 2) * 40; x < 256; x += 80) {
        ctx.fillStyle = "#6a5844";
        ctx.fillRect(x + 18, y + 6, 18, 16);
        if (night && hash01(x, y) > 0.62) {
          ctx.fillStyle = "#ffe2a0";
          ctx.fillRect(x + 18, y + 6, 18, 16);
        }
      }
    }
  } else if (jaffa) {
    for (let y = 20; y < 490; y += 72) {
      for (let x = 8; x < 250; x += 64) {
        ctx.fillStyle = hash01(x, y) > 0.5 ? "#d2b080" : "#b89060";
        ctx.fillRect(x, y, 52, 58);
        ctx.fillStyle = "#2a2018";
        ctx.beginPath();
        ctx.arc(x + 26, y + 36, 12, Math.PI, 0);
        ctx.lineTo(x + 38, y + 52);
        ctx.lineTo(x + 14, y + 52);
        ctx.fill();
        if (night && hash01(x, y, 2) > 0.55) {
          ctx.fillStyle = "#ffd080";
          ctx.beginPath();
          ctx.arc(x + 26, y + 36, 10, Math.PI, 0);
          ctx.fill();
        }
      }
    }
  } else if (hwy) {
    ctx.fillStyle = "#0e2430";
    ctx.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 36) {
      ctx.fillStyle = "#6a90a0";
      ctx.fillRect(0, y, 256, 2);
      for (let x = 4; x < 252; x += 32) {
        const lit = night && hash01(x, y, 3) > 0.4;
        ctx.fillStyle = lit ? "#c8e8f8" : "#1a4050";
        ctx.fillRect(x + 4, y + 6, 22, 26);
      }
    }
    for (let x = 0; x < 256; x += 32) {
      ctx.fillStyle = "#8ab0c0";
      ctx.fillRect(x, 0, 2, 512);
    }
  } else {
    ctx.fillStyle = "#efe8dc";
    ctx.fillRect(0, 0, 256, 512);
    for (let y = 12; y < 500; y += 56) {
      ctx.fillStyle = "#d8d0c4";
      ctx.fillRect(0, y + 40, 256, 8);
      ctx.fillStyle = night ? "#3a444c" : "#5a6870";
      ctx.fillRect(8, y + 10, 240, 22);
      for (let x = 12; x < 240; x += 28) {
        const lit = night && hash01(x, y, 4) > 0.48;
        ctx.fillStyle = lit ? "#ffe8b0" : bau ? "#9aa8b0" : "#70808a";
        ctx.fillRect(x, y + 12, 18, 18);
      }
    }
    ctx.fillStyle = "#c8c0b4";
    ctx.fillRect(0, 0, 256, 22);
  }
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(0, 480, 256, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

export function windowEmitTexture() {
  const w = 256;
  const h = 512;
  const data = new Uint8Array(w * h * 4);
  const paint = (x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number) => {
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * w + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
  };
  paint(0, 0, w, h, 0, 0, 0);
  for (let y = 0; y < 10; y++)
    for (let x = 0; x < 5; x++)
      if (hash01(x, y, 11) > 0.28) {
        const cool = hash01(x, y, 13) > 0.62;
        paint(16 + x * 48, 48 + y * 44, 40 + x * 48, 74 + y * 44, cool ? 0x9a : 0xff, cool ? 0xe0 : 0xd0, cool ? 0xff : 0x89);
      }
  const tex = new THREE.DataTexture(data, w, h);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.flipY = true;
  tex.needsUpdate = true;
  return tex;
}

export function adBoardTexture(bg: string, fg: string, t: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = fg;
  ctx.font = "bold 92px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(t, 256, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
