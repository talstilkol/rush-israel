/** Process-owned cache: one in-flight transaction, no partial publication. */
export function createAssetCache<T>(request: () => Promise<T>) {
  let value: T | undefined;
  let ready = false;
  let pending: Promise<T> | undefined;
  return {
    peek(): T | undefined { return value; },
    load(): Promise<T> {
      if (ready) return Promise.resolve(value as T);
      if (pending) return pending;
      // Defer request so synchronous failures are shared and reset for retry too.
      pending = Promise.resolve().then(request).then((result) => {
        value = result;
        ready = true;
        return result;
      }).finally(() => { pending = undefined; });
      return pending;
    },
  };
}
