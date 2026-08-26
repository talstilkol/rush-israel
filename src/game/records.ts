export type TimedRecord = {
  t: number;
  trackId: string;
  carId: string;
  physicsVersion: number;
  hash: string;
};

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
