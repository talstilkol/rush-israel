#!/usr/bin/env node
/** Uncompressed RGBA KTX2 from PNG. Not UASTC — no toktx in this sandbox. */
import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";
import {
  createDefaultContainer,
  write,
  VK_FORMAT_R8G8B8A8_SRGB,
  KHR_DF_MODEL_RGBSDA,
  KHR_DF_CHANNEL_RGBSDA_RED,
  KHR_DF_CHANNEL_RGBSDA_GREEN,
  KHR_DF_CHANNEL_RGBSDA_BLUE,
  KHR_DF_CHANNEL_RGBSDA_ALPHA,
} from "ktx-parse";

const src = process.argv[2] || "/workspace/public/game/blob.png";
const dst = process.argv[3] || "/workspace/public/game/blob.ktx2";
const png = PNG.sync.read(readFileSync(src));
const c = createDefaultContainer();
c.vkFormat = VK_FORMAT_R8G8B8A8_SRGB;
c.typeSize = 1;
c.pixelWidth = png.width;
c.pixelHeight = png.height;
c.levelCount = 1;
c.levels = [{ levelData: Uint8Array.from(png.data), uncompressedByteLength: png.data.length }];
const dfd = c.dataFormatDescriptor[0];
dfd.colorModel = KHR_DF_MODEL_RGBSDA;
dfd.texelBlockDimension = [0, 0, 0, 0];
dfd.bytesPlane = [4, 0, 0, 0, 0, 0, 0, 0];
dfd.samples = [
  { bitOffset: 0, bitLength: 7, channelType: KHR_DF_CHANNEL_RGBSDA_RED, samplePosition: [0, 0, 0, 0], sampleLower: 0, sampleUpper: 255 },
  { bitOffset: 8, bitLength: 7, channelType: KHR_DF_CHANNEL_RGBSDA_GREEN, samplePosition: [0, 0, 0, 0], sampleLower: 0, sampleUpper: 255 },
  { bitOffset: 16, bitLength: 7, channelType: KHR_DF_CHANNEL_RGBSDA_BLUE, samplePosition: [0, 0, 0, 0], sampleLower: 0, sampleUpper: 255 },
  { bitOffset: 24, bitLength: 7, channelType: KHR_DF_CHANNEL_RGBSDA_ALPHA, samplePosition: [0, 0, 0, 0], sampleLower: 0, sampleUpper: 255 },
];
writeFileSync(dst, write(c));
console.log("ktx2", dst, png.width, png.height, png.data.length);
