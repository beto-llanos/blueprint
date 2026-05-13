import type { ScanResult } from "./types";

type CacheEntry = { value: ScanResult; expires: number };
const TTL_MS = 60 * 60 * 1000;
const store = new Map<string, CacheEntry>();

export function getCached(key: string): ScanResult | null {
  const hit = store.get(key.toLowerCase());
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    store.delete(key.toLowerCase());
    return null;
  }
  return hit.value;
}

export function setCached(key: string, value: ScanResult): void {
  store.set(key.toLowerCase(), { value, expires: Date.now() + TTL_MS });
}
