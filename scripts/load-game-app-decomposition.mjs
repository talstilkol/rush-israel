import { historicalRsh036Inputs } from "./rsh036-runtime-evolution.mjs";
import { createHash } from "node:crypto";

export function sha256(source) {
  return createHash("sha256").update(String(source ?? "")).digest("hex");
}

export function gitBlobSha1(source) {
  const body = Buffer.from(String(source ?? ""), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

export function parseRsh018Blocks(source, path = "unknown") {
  const blocks = {};
  const expression = /^[\t ]*\/\/ RSH-018-BLOCK-BEGIN:([A-Za-z0-9_-]+)\r?\n([\s\S]*?)^[\t ]*\/\/ RSH-018-BLOCK-END:\1\r?\n?/gm;
  for (const match of String(source ?? "").matchAll(expression)) {
    if (Object.hasOwn(blocks, match[1])) throw new Error(`duplicate RSH-018 block ${match[1]} in ${path}`);
    blocks[match[1]] = match[2];
  }
  return blocks;
}

export function reconstructRsh017GameAppSource(manifest, moduleSources) {
  moduleSources = historicalRsh036Inputs(moduleSources);
  const blocks = {};
  for (const module of manifest.extraction.modules) {
    const source = moduleSources[module.path];
    if (typeof source !== "string") throw new Error(`missing RSH-018 module ${module.path}`);
    const parsed = parseRsh018Blocks(source, module.path);
    for (const [id, body] of Object.entries(parsed)) {
      if (Object.hasOwn(blocks, id)) throw new Error(`duplicate RSH-018 block authority ${id}`);
      blocks[id] = { body, path: module.path };
    }
  }
  return manifest.reconstruction.sequence.map((entry) => {
    if (entry.type === "literal") return Buffer.from(entry.base64, "base64").toString("utf8");
    if (entry.type !== "block") throw new Error(`unknown RSH-018 reconstruction entry ${entry.type}`);
    const block = blocks[entry.id];
    if (!block || block.path !== entry.path) throw new Error(`missing or reassigned RSH-018 block ${entry.id}`);
    return block.body.slice(entry.trim_start ?? 0, entry.trim_end ? -entry.trim_end : undefined);
  }).join("");
}
