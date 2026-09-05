/** One owned startup attempt. Rejections are results; retry creates a fresh attempt. */
export type StartupResource = { ready: Promise<unknown>; dispose: () => void };
export type StartupResult = {
  status: "ready" | "failed" | "cancelled";
  error?: unknown;
  cleanupError?: unknown;
  notificationError?: unknown;
};

export function beginRaceStartup<T extends StartupResource>(options: {
  prepare: () => Promise<() => T>;
  onReady: (resource: T) => void;
  onError: (error: unknown) => void;
}) {
  let cancelled = false;
  let owned: T | null = null;
  let cleanupError: unknown;
  const release = () => {
    const resource = owned;
    owned = null;
    if (!resource) return;
    try { resource.dispose(); } catch (error) { cleanupError = error; }
  };
  const result: Promise<StartupResult> = (async () => {
    try {
      const create = await options.prepare();
      if (cancelled) return { status: "cancelled" };
      const resource = create();
      owned = resource;
      await resource.ready;
      if (cancelled) return { status: "cancelled", cleanupError };
      options.onReady(resource);
      return { status: "ready" };
    } catch (error) {
      release();
      if (cancelled) return { status: "cancelled", error, cleanupError };
      let notificationError: unknown;
      try { options.onError(error); } catch (failure) { notificationError = failure; }
      return { status: "failed", error, cleanupError, notificationError };
    }
  })();
  return {
    result,
    cancel() {
      cancelled = true;
      release();
    },
  };
}
