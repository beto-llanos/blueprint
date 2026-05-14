import { generateReport } from "./claude";
import { fetchSnapshot } from "./github";
import { getStore } from "./store";
import type { ScanResult } from "./types";

export async function scanUser(rawUsername: string): Promise<ScanResult> {
  const username = rawUsername.trim().replace(/^@/, "").toLowerCase();
  const store = await getStore();
  const cached = await store.get(username);
  if (cached) return cached;

  const snapshot = await fetchSnapshot(username);
  const report = await generateReport(snapshot);
  const result: ScanResult = { username, snapshot, report };
  await store.save(result);
  return result;
}
