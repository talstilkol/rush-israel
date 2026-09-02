export type TimedRecord = {
  t: number;
  trackId: string;
  carId: string;
  physicsVersion: number;
  hash: string;
};

export type TimedPersistStatus =
  | "saved"
  | "duplicate"
  | "rejected"
  | "write-failed";

export type TimedPersistResult = {
  status: TimedPersistStatus;
  records: TimedRecord[];
  dropped: number;
  error?: string;
};

export const REC_KEY = "rush.records.v3";
export const RECORD_LIMIT = 200;
export const RECORD_LIMIT_PER_TRACK_CAR = 24;

const HASH_RE = /^[0-9a-f]{64}$/;
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(value: number, bits: number) {
  return (value >>> bits) | (value << (32 - bits));
}

/** Portable SHA-256 so record hashes can be verified on the synchronous read path. */
export function sha256hexSync(value: string) {
  const bytes = new TextEncoder().encode(value);
  const bitLen = bytes.length * 8;
  const paddedLen = (((bytes.length + 9 + 63) >> 6) << 6);
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 4, bitLen >>> 0);
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const w = new Uint32Array(64);
  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7].map((word) => word.toString(16).padStart(8, "0")).join("");
}

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

export function hashTimedRecord(rec: Pick<TimedRecord, "trackId" | "carId" | "t" | "physicsVersion">) {
  return sha256hexSync(recordPayload(rec.trackId, rec.carId, rec.t, rec.physicsVersion));
}

export function timedRecordIdentity(rec: TimedRecord) {
  return `${rec.trackId}|${rec.carId}|${rec.physicsVersion}|${rec.t}|${rec.hash}`;
}

function isFiniteTime(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 8 && value <= 2700;
}

export function isStructurallyValidRecord(value: unknown): value is TimedRecord {
  if (!value || typeof value !== "object") return false;
  const rec = value as TimedRecord;
  return isFiniteTime(rec.t)
    && typeof rec.trackId === "string" && rec.trackId.length > 0 && rec.trackId.length < 64
    && typeof rec.carId === "string" && rec.carId.length > 0 && rec.carId.length < 32
    && Number.isInteger(rec.physicsVersion)
    && HASH_RE.test(rec.hash);
}

export function recordHashMatches(rec: TimedRecord) {
  return rec.hash === hashTimedRecord(rec);
}

export function decodeTimedRecords(raw: string | null): TimedRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStructurallyValidRecord);
  } catch {
    return [];
  }
}

export function canonicalTimedRecordsString(records: TimedRecord[]) {
  const rows = records.map((rec) => ({
    carId: rec.carId,
    hash: rec.hash,
    physicsVersion: rec.physicsVersion,
    t: rec.t,
    trackId: rec.trackId,
  }));
  rows.sort((a, b) => a.t - b.t || a.trackId.localeCompare(b.trackId) || a.carId.localeCompare(b.carId) || a.hash.localeCompare(b.hash));
  return JSON.stringify(rows);
}

export function sanitizeTimedRecords(records: TimedRecord[], physicsVersion: number) {
  const seen = new Set<string>();
  const live: TimedRecord[] = [];
  let dropped = 0;
  for (const rec of records) {
    if (!isStructurallyValidRecord(rec) || !isLiveRecord(rec, physicsVersion) || !recordHashMatches(rec)) {
      dropped += 1;
      continue;
    }
    const id = timedRecordIdentity(rec);
    if (seen.has(id)) {
      dropped += 1;
      continue;
    }
    seen.add(id);
    live.push(rec);
  }
  live.sort((a, b) => a.t - b.t || a.trackId.localeCompare(b.trackId) || a.carId.localeCompare(b.carId));
  const grouped = new Map<string, number>();
  const limited: TimedRecord[] = [];
  for (const rec of live) {
    const key = `${rec.trackId}|${rec.carId}|${rec.physicsVersion}`;
    const used = grouped.get(key) ?? 0;
    if (used >= RECORD_LIMIT_PER_TRACK_CAR) {
      dropped += 1;
      continue;
    }
    grouped.set(key, used + 1);
    limited.push(rec);
  }
  if (limited.length > RECORD_LIMIT) {
    dropped += limited.length - RECORD_LIMIT;
    limited.length = RECORD_LIMIT;
  }
  return { records: limited, dropped };
}

export function loadTimedRecords(
  storage: { getItem: (k: string) => string | null } = globalThis.localStorage,
  physicsVersion: number,
) {
  return sanitizeTimedRecords(decodeTimedRecords(storage.getItem(REC_KEY)), physicsVersion);
}

/** Codex 62: one-key atomic replace. No IndexedDB / pglite. */
export function writeRecords(
  arr: TimedRecord[],
  storage: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void } = globalThis.localStorage,
  key = REC_KEY,
) {
  const raw = canonicalTimedRecordsString(arr);
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) throw new Error("records mismatch");
}

function persistNow(
  rec: TimedRecord,
  storage: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void },
  physicsVersion: number,
): TimedPersistResult {
  if (!isStructurallyValidRecord(rec) || !isLiveRecord(rec, physicsVersion) || !recordHashMatches(rec)) {
    const loaded = loadTimedRecords(storage, physicsVersion);
    return { status: "rejected", records: loaded.records, dropped: loaded.dropped + 1, error: "invalid timed record" };
  }
  const loaded = loadTimedRecords(storage, physicsVersion);
  if (loaded.records.some((item) => timedRecordIdentity(item) === timedRecordIdentity(rec))) {
    return { status: "duplicate", records: loaded.records, dropped: loaded.dropped };
  }
  const next = sanitizeTimedRecords([...loaded.records, rec], physicsVersion);
  try {
    writeRecords(next.records, storage);
  } catch (error) {
    return {
      status: "write-failed",
      records: loaded.records,
      dropped: loaded.dropped,
      error: String(error instanceof Error ? error.message : error),
    };
  }
  return { status: "saved", records: next.records, dropped: loaded.dropped + next.dropped };
}

let persistChain: Promise<unknown> = Promise.resolve();

export function persistTimedRecord(
  rec: TimedRecord,
  storage: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void } = globalThis.localStorage,
  physicsVersion: number,
) {
  const run = () => persistNow(rec, storage, physicsVersion);
  const next = persistChain.then(run, run);
  persistChain = next.then(() => undefined, () => undefined);
  return next;
}
