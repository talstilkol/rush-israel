#!/usr/bin/env node
/** Bake curtain-wall window atlases. Drawn, not photos. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunk = (type, body) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(body.length);
    const t = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, body])));
    return Buffer.concat([len, t, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    data.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const palettes = {
  blue: { wall: "#163848", frame: "#8eb4c4", lit: "#d8f0fa", dim: "#1c4860", dark: "#0a2030", accent: "#2a6078" },
  teal: { wall: "#14383c", frame: "#7ab0b0", lit: "#c8f0f0", dim: "#1a5050", dark: "#0a2828", accent: "#2a6868" },
  dark: { wall: "#101418", frame: "#6a7480", lit: "#c8dce8", dim: "#1a2830", dark: "#080c10", accent: "#243038" },
  gold: { wall: "#3a3220", frame: "#c4a878", lit: "#f4ead0", dim: "#4a4030", dark: "#18140c", accent: "#6a5840" },
  white: { wall: "#d8d2c8", frame: "#8a8680", lit: "#f4f8fc", dim: "#c4c8cc", dark: "#3a4048", accent: "#b0aaa0" },
};
const W = 256, H = 1024;
const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
function fill(img, x0, y0, x1, y1, rgb) {
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = (y * W + x) * 4;
      img[i] = rgb[0];
      img[i + 1] = rgb[1];
      img[i + 2] = rgb[2];
      img[i + 3] = 255;
    }
}
for (const [kind, p] of Object.entries(palettes)) {
  const img = Buffer.alloc(W * H * 4);
  fill(img, 0, 0, W, H, hex(p.wall));
  const floorH = 32, colW = 28;
  const ki = kind.charCodeAt(0);
  for (let y = 0; y < H; y += floorH) {
    fill(img, 0, y, W, y + 4, hex(p.accent));
    fill(img, 0, y, W, y + 2, hex(p.frame));
    for (let x = 2; x < 254; x += colW) {
      const r = hash01(ki, x, y);
      const c = r > 0.68 ? p.lit : r > 0.38 ? p.dim : p.dark;
      fill(img, x + 3, y + 7, x + colW - 4, y + floorH - 5, hex(c));
    }
  }
  for (let x = 0; x < W; x += colW) fill(img, x, 0, x + 2, H, hex(p.frame));
  fill(img, 0, 980, W, H, hex(p.dark));
  for (let x = 8; x < 248; x += 40) fill(img, x, 992, x + 22, 1016, hex(p.lit));
  writeFileSync(join(dir, `curtain-${kind}.png`), pngRgba(W, H, img));
}
console.log("baked curtains");
