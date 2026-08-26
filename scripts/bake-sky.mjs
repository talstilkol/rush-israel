#!/usr/bin/env node
/** Bake day/night equirect skies. Gradient + sun/stars. Not an HDRI. */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
mkdirSync(dir, { recursive: true });

function hash01(...parts) {
  let h = 2166136261;
  for (const p of parts) {
    h ^= p | 0;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function pngRgba(w, h, data) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[(w * 4 + 1) * y] = 0;
    data.copy(raw, (w * 4 + 1) * y + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const chunk = (type, payload) => {
    const t = Buffer.from(type);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(payload.length, 0);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, payload])), 0);
    return Buffer.concat([len, t, payload, crc]);
  };
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 6 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function paint(night) {
  const W = 1024;
  const H = 512;
  const data = Buffer.alloc(W * H * 4);
  const zen = night ? [10, 20, 36] : [26, 116, 196];
  const mid = night ? [21, 32, 48] : [61, 152, 212];
  const hor = night ? [28, 44, 64] : [110, 180, 224];
  for (let y = 0; y < H; y++) {
    const t = y / (H - 1);
    let r, g, b;
    if (t < 0.55) {
      const u = t / 0.55;
      r = lerp(zen[0], mid[0], u);
      g = lerp(zen[1], mid[1], u);
      b = lerp(zen[2], mid[2], u);
    } else {
      const u = (t - 0.55) / 0.45;
      r = lerp(mid[0], hor[0], u);
      g = lerp(mid[1], hor[1], u);
      b = lerp(mid[2], hor[2], u);
    }
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    const k = a / 255;
    data[i] = data[i] * (1 - k) + r * k;
    data[i + 1] = data[i + 1] * (1 - k) + g * k;
    data[i + 2] = data[i + 2] * (1 - k) + b * k;
  };
  if (!night) {
    const cx = 820;
    const cy = 70;
    for (let y = cy - 36; y <= cy + 36; y++)
      for (let x = cx - 36; x <= cx + 36; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d < 28) set(x, y, 255, 244, 210, 242);
        else if (d < 36) set(x, y, 255, 236, 180, 80);
      }
  } else {
    for (let i = 0; i < 80; i++) {
      const x = (hash01(i, 1) * W) | 0;
      const y = (hash01(i, 2) * H * 0.55) | 0;
      set(x, y, 255, 255, 240, 220);
    }
  }
  return pngRgba(W, H, data);
}

writeFileSync(join(dir, "sky-day.png"), paint(false));
writeFileSync(join(dir, "sky-night.png"), paint(true));
console.log("baked sky", dir);
