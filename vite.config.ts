import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";
// @ts-expect-error JS plugin alongside the TS vite config
import { gameCachePlugin } from "./scripts/game-cache-plugin.mjs";

// The /__grok PWA paths are retained compatibility URLs owned by RUSH Israel.
// Auth, database, multiplayer and preview-host template plugins are intentionally absent.
export default defineConfig(({ command, isPreview }) => ({
  cacheDir: ".cache/vite",
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    // Test evidence and exact-tree historical fixtures are generated output.
    // Watching their HTML/tsconfig files reloads an unrelated active race.
    watch: { ignored: ["**/artifacts/**"] },
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    grokPwaPlugin(),
    gameCachePlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [
          nitro({
            preset: "vercel",
            serverDir: "./server",
            routeRules: {
              "/game/**": { headers: { "cache-control": "no-cache" } },
              "/basis/**": { headers: { "cache-control": "no-cache" } },
              "/": { headers: { "cache-control": "no-cache" } },
            },
          }),
        ]
      : []),
    viteReact(),
  ],
}));
