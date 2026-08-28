#!/usr/bin/env node
/** Codex 9.1.3.2: no fake UASTC. PNG blob only until real Basis exists. */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";

const gameDir = fromRoot("public", "game");
if (existsSync(fromRoot("public", "game", "blob.ktx2"))) {
  throw new Error("blob.ktx2 must not ship — it was uncompressed RGBA, not UASTC");
}
const ktx = readdirSync(gameDir).filter((f) => f.endsWith(".ktx2"));
if (ktx.length) throw new Error("unexpected ktx2 " + ktx.join(","));
if (!existsSync(fromRoot("public", "game", "blob.png"))) throw new Error("missing blob.png");

const blobSrc = readFileSync(fromRoot("src", "game", "blob-assets.ts"), "utf8");
if (blobSrc.includes("KTX2Loader")) throw new Error("blob-assets still uses KTX2Loader");
if (!blobSrc.includes("return false")) throw new Error("blobIsKtx2 must be false");

console.log("ktx2-smoke ok png-only no UASTC claim");
