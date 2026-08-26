export type TimedRecord = {
  t: number;
  trackId: string;
  carId: string;
  physicsVersion: number;
  hash: string;
};

export const REC_KEY = "rush.records.v3";

export function recordPayload(trackId: string, carId: string, t: number, physicsVersion: number) {
  return `${trackId}|${carId}|${t}|${physicsVersion}`;
}

export function isLiveRecord(r: Pick<TimedRecord, "physicsVersion">, version: number) {
  return r.physicsVersion === version;
}

export async function sha256hex(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Codex 62: one-key atomic replace. No IndexedDB / pglite. */
export function writeRecords(
  arr: TimedRecord[],
  storage: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void } = globalThis.localStorage,
  key = REC_KEY,
) {
  const raw = JSON.stringify(arr);
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) throw new Error("records mismatch");
}
