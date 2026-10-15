/** Codex 74: revalidate unversioned game assets on Nitro/Vercel. */

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
  headers.set("cache-control", "no-cache");
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}
