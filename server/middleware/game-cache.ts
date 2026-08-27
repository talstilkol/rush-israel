/** Codex 74: long-cache hashed game assets on Nitro/Vercel. */

type CacheEvent = { url: URL };

export default async function gameCacheMiddleware(
  event: CacheEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const path = event.url.pathname;
  const result = await next();
  if (!(result instanceof Response)) return result;
  if (!path.startsWith("/game/") && !path.startsWith("/basis/")) return result;
  const headers = new Headers(result.headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}
