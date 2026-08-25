/**
 * Shared LIVE-PREVIEW OAuth client (server-only — NEVER import from the client).
 *
 * Secrets live in env (`GROK_AUTH_CLIENT_SECRET` or `GROK_PREVIEW_CLIENT_SECRET`).
 * Nothing is baked into source. If both are unset, federated sign-in stays off.
 */
export const PREVIEW_CLIENT_ID = "grok_preview";

export function previewClientSecret(): string | undefined {
  const a = process.env.GROK_AUTH_CLIENT_SECRET?.trim();
  if (a) return a;
  const b = process.env.GROK_PREVIEW_CLIENT_SECRET?.trim();
  return b || undefined;
}

/** The shared auth broker issuer (OIDC discovery lives under it). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Host patterns whose callbacks the preview client accepts. Better Auth derives
 * the live preview's real origin from the request host and validates it against
 * this list (wildcard-matched), so the OAuth `redirect_uri` becomes the concrete
 * `https://<preview-host>/api/auth/oauth2/callback/...` the broker allows.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
