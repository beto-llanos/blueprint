import type { ScanResult } from "@/lib/types";
import type { ListOptions, ReportStore } from "./index";

type Entry = {
  value: ScanResult;
  expires: number;
  createdAt: number;
};

const TTL_MS = 60 * 60 * 1000;

export class InMemoryStore implements ReportStore {
  private store = new Map<string, Entry>();

  async save(value: ScanResult): Promise<void> {
    const key = value.username.toLowerCase();
    this.store.set(key, {
      value,
      expires: Date.now() + TTL_MS,
      createdAt: Date.now(),
    });
  }

  async get(username: string): Promise<ScanResult | null> {
    const key = username.toLowerCase();
    const hit = this.store.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expires) {
      this.store.delete(key);
      return null;
    }
    return hit.value;
  }

  async list(opts: ListOptions = {}): Promise<ScanResult[]> {
    const { limit = 24, archetype, language } = opts;
    const now = Date.now();
    const entries: Entry[] = [];
    for (const [key, entry] of this.store) {
      if (now > entry.expires) {
        this.store.delete(key);
        continue;
      }
      entries.push(entry);
    }
    let results = entries
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((e) => e.value);
    if (archetype) {
      const target = archetype.toLowerCase();
      results = results.filter(
        (r) => r.report.archetype.toLowerCase() === target,
      );
    }
    if (language) {
      const target = language.toLowerCase();
      results = results.filter((r) =>
        r.snapshot.languageWeights.some(
          (l) => l.lang.toLowerCase() === target,
        ),
      );
    }
    return results.slice(0, limit);
  }

  async count(): Promise<number> {
    const now = Date.now();
    let n = 0;
    for (const [key, entry] of this.store) {
      if (now > entry.expires) {
        this.store.delete(key);
        continue;
      }
      n++;
    }
    return n;
  }
}
