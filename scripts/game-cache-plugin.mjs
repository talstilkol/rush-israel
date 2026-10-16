/** Codex 74: revalidate unversioned /game and /basis assets and HTML. */
function setCache(req, res) {
  const url = (req.url || "").split("?")[0];
  if (url.startsWith("/game/") || url.startsWith("/basis/")) {
    res.setHeader("Cache-Control", "no-cache");
  } else if (url === "/" || url === "/index.html" || url.endsWith(".html")) {
    res.setHeader("Cache-Control", "no-cache");
  }
}

export function gameCachePlugin() {
  return {
    name: "game-cache",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        setCache(req, res);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        setCache(req, res);
        next();
      });
    },
  };
}
