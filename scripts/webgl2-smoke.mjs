#!/usr/bin/env node
import { chromium } from "playwright";

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto(url, { waitUntil: "networkidle", timeout: 25000 });
const caps = await p.evaluate(() => {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl2");
  return {
    webgl2: !!gl,
    renderer: gl ? String(gl.getParameter(gl.RENDERER) || "") : "",
  };
});
await b.close();
if (!caps.webgl2) throw new Error("no webgl2");
console.log("webgl2-smoke ok", caps.renderer);
