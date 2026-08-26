#!/usr/bin/env node
/** Bake water normal + finish checker. Procedural. */
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

const size = 256;
const nrm = Buffer.alloc(size * size * 4);
const hgt = (x, y) => Math.sin(x * 0.11) * Math.cos(y * 0.09) * 0.55 + Math.sin(x * 0.29 + y * 0.17) * 0.28;
for (let y = 0; y < size; y++)
  for (let x = 0; x < size; x++) {
    const dx = hgt(x + 1, y) - hgt(x - 1, y);
    const dy = hgt(x, y + 1) - hgt(x, y - 1);
    let nx = -dx * 3.4, ny = -dy * 3.4, nz = 1;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len;
    ny /= len;
    nz /= len;
    const i = (y * size + x) * 4;
    nrm[i] = (nx * 0.5 + 0.5) * 255;
    nrm[i + 1] = (ny * 0.5 + 0.5) * 255;
    nrm[i + 2] = (nz * 0.5 + 0.5) * 255;
    nrm[i + 3] = 255;
  }
const chk = Buffer.alloc(16 * 4 * 4);
for (let y = 0; y < 4; y++)
  for (let x = 0; x < 16; x++) {
    const on = (x + y) % 2 === 0;
    const i = (y * 16 + x) * 4;
    chk[i] = on ? 244 : 22;
    chk[i + 1] = on ? 241 : 24;
    chk[i + 2] = on ? 234 : 28;
    chk[i + 3] = 255;
  }
const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
writeFileSync(join(dir, "water-n.png"), pngRgba(size, size, nrm));
writeFileSync(join(dir, "checker.png"), pngRgba(16, 4, chk));
console.log("baked water+checker");
