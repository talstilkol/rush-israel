#!/usr/bin/env node
/** Bake Ayalon 8-lane asphalt PNGs. Still procedural — not photogrammetry. */
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
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

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

const W = 512;
function bakeLanes(lanes) {
const img = Buffer.alloc(W * W * 4);
const rough = Buffer.alloc(W * W * 4);
const bump = Buffer.alloc(W * W * 4);
const lum = new Float32Array(W * W);
for (let y = 0; y < W; y++)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const pebble = (x * 19 + y * 11) % 17 + (x * 7 + y * 3) % 9;
    const tar = Math.sin(x * 0.21) * Math.cos(y * 0.17) * 6 + Math.sin((x + y) * 0.08) * 3;
    const grit = hash01(x, y) * 14 - 5;
    const seam = ((x + y * 3) % 64 < 2 ? -8 : 0) + ((y * 2 + x) % 91 < 1 ? -5 : 0);
    const v = clamp(16 + pebble * 0.55 + tar * 0.7 + grit + seam, 10, 42);
    lum[y * W + x] = v;
    img[i] = v;
    img[i + 1] = v * 0.97;
    img[i + 2] = v * 0.92;
    img[i + 3] = 255;
    const r = clamp(90 + (42 - v) * 2.8 + hash01(x, y, 3) * 16, 48, 220);
    rough[i] = rough[i + 1] = rough[i + 2] = r;
    rough[i + 3] = 255;
  }
const paintPx = (x, y, r, g, b) => {
  if (x < 0 || x >= W || y < 0 || y >= W) return;
  const i = (y * W + x) * 4;
  img[i] = r;
  img[i + 1] = g;
  img[i + 2] = b;
  img[i + 3] = 255;
  rough[i] = rough[i + 1] = rough[i + 2] = 40;
  rough[i + 3] = 255;
};
const stripe = (x0, x1, r, g, b, dashed) => {
  const a = Math.max(0, Math.min(x0, x1));
  const z = Math.min(W - 1, Math.max(x0, x1));
  for (let y = 0; y < W; y++) {
    if (dashed && y % 48 > 22) continue;
    for (let x = a; x <= z; x++) paintPx(x, y, r, g, b);
  }
};
stripe(0, 8, 252, 252, 248, false);
stripe(W - 9, W - 1, 252, 252, 248, false);
stripe(10, 16, 248, 196, 28, false);
stripe(W - 17, W - 11, 248, 196, 28, false);
for (let lane = 1; lane < lanes; lane++) {
  const cx = Math.round((lane / lanes) * W);
  stripe(cx - 2, cx + 2, 248, 246, 236, true);
}
for (let y = 0; y < W; y++)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const xl = lum[y * W + ((x + W - 1) % W)];
    const xr = lum[y * W + ((x + 1) % W)];
    const yu = lum[((y + W - 1) % W) * W + x];
    const yd = lum[((y + 1) % W) * W + x];
    bump[i] = clamp(128 + (xl - xr) * 3.2, 0, 255);
    bump[i + 1] = clamp(128 + (yu - yd) * 3.2, 0, 255);
    bump[i + 2] = 255;
    bump[i + 3] = 255;
  }

writeFileSync(join(dir, `asphalt-${lanes}.png`), pngRgba(W, W, img));
writeFileSync(join(dir, `asphalt-${lanes}-rough.png`), pngRgba(W, W, rough));
writeFileSync(join(dir, `asphalt-${lanes}-bump.png`), pngRgba(W, W, bump));
}
bakeLanes(8);
bakeLanes(4);
bakeLanes(3);
console.log("baked", dir);
