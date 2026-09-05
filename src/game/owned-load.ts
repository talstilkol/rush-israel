/** Load one independently owned batch; publish only when every member is ready. */
export async function loadOwnedResources<T extends { dispose(): void }, R>(
  loaders: readonly (() => Promise<T>)[],
  commit: (resources: T[]) => R | Promise<R>,
): Promise<R> {
  // Thunks capture synchronous loader exceptions too. Waiting for every settlement
  // prevents late successful requests from escaping a rejected batch's cleanup.
  const settled = await Promise.allSettled(loaders.map((load) => Promise.resolve().then(load)));
  const resources: T[] = [];
  const failures: unknown[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled") resources.push(result.value);
    else failures.push(result.reason);
  }
  try {
    if (failures.length) throw failures[0];
    return await commit(resources);
  } catch (error) {
    const cleanupErrors: unknown[] = [];
    for (const resource of [...new Set(resources)].reverse()) {
      try { resource.dispose(); } catch (cleanupError) { cleanupErrors.push(cleanupError); }
    }
    if (cleanupErrors.length) throw new AggregateError([error, ...cleanupErrors], "Resource batch and rollback failed", { cause: error });
    throw error;
  }
}
