import { generateReport } from "./claude";
import { fetchSnapshot } from "./github";
import { getCached, setCached } from "./cache";
import type { ScanResult } from "./types";

export async function scanUser(rawUsername: string): Promise<ScanResult> {
  const username = rawUsername.trim().replace(/^@/, "").toLowerCase();
  const cached = getCached(username);
  if (cached) return cached;

  const snapshot = await fetchSnapshot(username);
  const report = await generateReport(snapshot);
  const result: ScanResult = { username, snapshot, report };
  setCached(username, result);
  return result;
}
