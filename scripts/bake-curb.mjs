#!/usr/bin/env node
/** Bake curb stripes. Drawn, not photos. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const kinds = {
  city: ["#f7f2ea", "#e0141c"],
  stone: ["#efe4c8", "#c4ae88"],
  dirt: ["#7a5a38", "#4a3624"],
  sand: ["#d0b080", "#a88858"],
};
const W = 16, H = 64;
const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
function hex(s) {
  return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
}
for (const [name, [a, b]] of Object.entries(kinds)) {
  const img = Buffer.alloc(W * H * 4);
  const ca = hex(a), cb = hex(b);
  for (let i = 0; i < 4; i++) {
    const [r, g, bl] = i % 2 === 0 ? ca : cb;
    for (let y = i * 16; y < i * 16 + 16; y++)
      for (let x = 0; x < W; x++) {
        const p = (y * W + x) * 4;
        img[p] = r;
        img[p + 1] = g;
        img[p + 2] = bl;
        img[p + 3] = 255;
      }
  }
  writeFileSync(join(dir, `curb-${name}.png`), pngRgba(W, H, img));
}
console.log("baked curbs");
