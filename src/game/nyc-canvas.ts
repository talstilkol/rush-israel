import * as THREE from "three";
import { hash01 } from "./math";

/** NYC-only runtime DataTextures. Israel must not import this unless city==="nyc". */

function hexRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] as const;
}

function makeTex(w: number, h: number, fill: (paint: (x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number) => void, data: Uint8Array) => void) {
  const data = new Uint8Array(w * h * 4);
  const paint = (x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number) => {
    const xa = Math.max(0, Math.floor(x0));
    const ya = Math.max(0, Math.floor(y0));
    const xb = Math.min(w, Math.ceil(x1));
    const yb = Math.min(h, Math.ceil(y1));
    for (let y = ya; y < yb; y++)
      for (let x = xa; x < xb; x++) {
        const i = (y * w + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
  };
  fill(paint, data);
  const tex = new THREE.DataTexture(data, w, h);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.flipY = true;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function facadeTexture(theme: string, night: boolean) {
  const stone = theme === "stone";
  const jaffa = theme === "jaffa";
  const hwy = theme === "highway" || theme === "manhattan";
  const desert = theme === "desert";
  const port = theme === "port";
  const bau = theme === "bauhaus" || (!stone && !jaffa && !hwy && !desert && !port);
  const base = stone ? hexRgb("#c4b090") : jaffa ? hexRgb("#c4a070") : hwy ? hexRgb("#1a3040") : desert ? hexRgb("#d4b48c") : port ? hexRgb("#b0a898") : hexRgb("#e8e0d4");
  return makeTex(256, 512, (paint) => {
    paint(0, 0, 256, 512, base[0], base[1], base[2]);
    if (stone) {
      for (let y = 0; y < 512; y += 28) {
        const row = y % 56 === 0 ? hexRgb("#b8a07c") : hexRgb("#d0be9c");
        paint(0, y, 256, y + 26, row[0], row[1], row[2]);
        paint(0, y + 26, 256, y + 28, 0x8a, 0x78, 0x60);
        for (let x = ((y / 28) % 2) * 40; x < 256; x += 80) {
          const lit = night && hash01(x, y) > 0.62;
          if (lit) paint(x + 18, y + 6, x + 36, y + 22, 0xff, 0xe2, 0xa0);
          else paint(x + 18, y + 6, x + 36, y + 22, 0x6a, 0x58, 0x44);
        }
      }
    } else if (jaffa) {
      for (let y = 20; y < 490; y += 72) {
        for (let x = 8; x < 250; x += 64) {
          const warm = hash01(x, y) > 0.5 ? hexRgb("#d2b080") : hexRgb("#b89060");
          paint(x, y, x + 52, y + 58, warm[0], warm[1], warm[2]);
          paint(x + 14, y + 36, x + 38, y + 52, 0x2a, 0x20, 0x18);
          paint(x + 20, y + 28, x + 32, y + 40, 0x2a, 0x20, 0x18);
          if (night && hash01(x, y, 2) > 0.55) paint(x + 16, y + 30, x + 36, y + 50, 0xff, 0xd0, 0x80);
        }
      }
    } else if (hwy) {
      paint(0, 0, 256, 512, 0x0e, 0x24, 0x30);
      for (let y = 0; y < 512; y += 36) {
        paint(0, y, 256, y + 2, 0x6a, 0x90, 0xa0);
        for (let x = 4; x < 252; x += 32) {
          const lit = night && hash01(x, y, 3) > 0.4;
          if (lit) paint(x + 4, y + 6, x + 26, y + 32, 0xc8, 0xe8, 0xf8);
          else paint(x + 4, y + 6, x + 26, y + 32, 0x1a, 0x40, 0x50);
        }
      }
      for (let x = 0; x < 256; x += 32) paint(x, 0, x + 2, 512, 0x8a, 0xb0, 0xc0);
    } else {
      paint(0, 0, 256, 512, 0xef, 0xe8, 0xdc);
      for (let y = 12; y < 500; y += 56) {
        paint(0, y + 40, 256, y + 48, 0xd8, 0xd0, 0xc4);
        if (night) paint(8, y + 10, 248, y + 32, 0x3a, 0x44, 0x4c);
        else paint(8, y + 10, 248, y + 32, 0x5a, 0x68, 0x70);
        for (let x = 12; x < 240; x += 28) {
          const lit = night && hash01(x, y, 4) > 0.48;
          if (lit) paint(x, y + 12, x + 18, y + 30, 0xff, 0xe8, 0xb0);
          else if (bau) paint(x, y + 12, x + 18, y + 30, 0x9a, 0xa8, 0xb0);
          else paint(x, y + 12, x + 18, y + 30, 0x70, 0x80, 0x8a);
        }
      }
      paint(0, 0, 256, 22, 0xc8, 0xc0, 0xb4);
    }
    paint(0, 480, 256, 512, Math.floor(base[0] * 0.84), Math.floor(base[1] * 0.84), Math.floor(base[2] * 0.84));
  });
}

export function windowEmitTexture() {
  return makeTex(256, 512, (paint) => {
    paint(0, 0, 256, 512, 0, 0, 0);
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 5; x++)
        if (hash01(x, y, 11) > 0.28) {
          const cool = hash01(x, y, 13) > 0.62;
          paint(16 + x * 48, 48 + y * 44, 40 + x * 48, 74 + y * 44, cool ? 0x9a : 0xff, cool ? 0xe0 : 0xd0, cool ? 0xff : 0x89);
        }
  });
}

const GLYPH: Record<string, number[]> = {
  " ": [0, 0, 0, 0, 0, 0, 0],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  S: [0x0e, 0x11, 0x10, 0x0e, 0x01, 0x11, 0x0e],
  H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  V: [0x11, 0x11, 0x11, 0x11, 0x0a, 0x0a, 0x04],
  "0": [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  "1": [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  "י": [0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00],
  "פ": [0x1f, 0x01, 0x01, 0x0f, 0x01, 0x01, 0x01],
  "ו": [0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01],
};

export function adBoardTexture(bg: string, fg: string, t: string) {
  const [br, bgc, bb] = hexRgb(bg);
  const [fr, fgC, fb] = hexRgb(fg);
  return makeTex(512, 256, (paint) => {
    paint(0, 0, 512, 256, br, bgc, bb);
    const chars = [...t];
    const gw = 28;
    const gh = 40;
    const total = chars.length * (gw + 8);
    let x = Math.floor((512 - total) / 2);
    const y0 = 108;
    for (const ch of chars) {
      const rows = GLYPH[ch] ?? GLYPH[" "];
      for (let row = 0; row < 7; row++) {
        const bits = rows[row] ?? 0;
        for (let col = 0; col < 5; col++) {
          if (bits & (1 << (4 - col))) {
            const px = x + col * (gw / 5);
            const py = y0 + row * (gh / 7);
            paint(px, py, px + gw / 5 - 1, py + gh / 7 - 1, fr, fgC, fb);
          }
        }
      }
      x += gw + 8;
    }
  });
}
