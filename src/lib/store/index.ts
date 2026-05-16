import type { ScanResult } from "@/lib/types";

export type ListOptions = {
  limit?: number;
  archetype?: string;
  language?: string;
};

export interface ReportStore {
  save(result: ScanResult): Promise<void>;
  get(username: string): Promise<ScanResult | null>;
  list(opts?: ListOptions): Promise<ScanResult[]>;
  count(): Promise<number>;
}

let cached: ReportStore | null = null;

export async function getStore(): Promise<ReportStore> {
  if (cached) return cached;

  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER ?? process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  if (uri && user && password) {
    const { Neo4jStore } = await import("./neo4j");
    cached = new Neo4jStore({
      uri,
      user,
      password,
      database: process.env.NEO4J_DATABASE,
    });
  } else {
    const { InMemoryStore } = await import("./in-memory");
    cached = new InMemoryStore();
  }
  return cached;
}
