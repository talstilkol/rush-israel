#!/usr/bin/env node
/** Codex 74: Unversioned /game and /basis assets and HTML must revalidate. */
const base = process.env.SMOKE_URL ?? "http://127.0.0.1:8080";

async function cc(path) {
  const r = await fetch(base.replace(/\/$/, "") + path, { method: "HEAD" });
  if (!r.ok) throw new Error(path + " " + r.status);
  return (r.headers.get("cache-control") || "").toLowerCase();
}

const game = await cc("/game/blob.png");
if (!game.includes("no-cache") || game.includes("immutable")) {
  throw new Error("game cache-control: " + game);
}
const basis = await cc("/basis/basis_transcoder.js");
if (!basis.includes("no-cache") || basis.includes("immutable")) {
  throw new Error("basis cache-control: " + basis);
}
const html = await cc("/");
if (!html.includes("no-cache")) throw new Error("html cache-control: " + html);
console.log("cache-headers-smoke ok", game, "| html", html);
