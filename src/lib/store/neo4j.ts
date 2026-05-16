import type { ScanResult } from "@/lib/types";
import type { ListOptions, ReportStore } from "./index";

type DriverConfig = {
  uri: string;
  user: string;
  password: string;
  database?: string;
};

type Neo4jSession = {
  run: (
    q: string,
    params?: Record<string, unknown>,
  ) => Promise<{
    records: Array<{ get: (k: string) => unknown }>;
  }>;
  close: () => Promise<void>;
};

type Neo4jDriver = {
  session(opts?: { database?: string }): Neo4jSession;
  close: () => Promise<void>;
};

export class Neo4jStore implements ReportStore {
  private driver: Neo4jDriver | null = null;
  private config: DriverConfig;
  private initPromise: Promise<void> | null = null;

  constructor(config: DriverConfig) {
    this.config = config;
  }

  private async init(): Promise<void> {
    if (this.driver) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      try {
        const neo4j = await import("neo4j-driver");
        this.driver = neo4j.default.driver(
          this.config.uri,
          neo4j.default.auth.basic(this.config.user, this.config.password),
        ) as unknown as Neo4jDriver;
        const session = this.driver.session(
          this.config.database ? { database: this.config.database } : undefined,
        );
        try {
          await session.run(
            "CREATE CONSTRAINT builder_login IF NOT EXISTS FOR (b:Builder) REQUIRE b.login IS UNIQUE",
          );
        } finally {
          await session.close();
        }
      } catch (err) {
        this.driver = null;
        this.initPromise = null;
        throw err;
      }
    })();
    return this.initPromise;
  }

  async save(value: ScanResult): Promise<void> {
    await this.init();
    const session = this.driver!.session(
      this.config.database ? { database: this.config.database } : undefined,
    );
    try {
      const langs = value.snapshot.languageWeights
        .slice(0, 6)
        .map((l) => l.lang);
      await session.run(
        `MERGE (b:Builder { login: $login })
         SET b.archetype = $archetype,
             b.score = $score,
             b.languages = $languages,
             b.payload = $payload,
             b.updatedAt = timestamp()`,
        {
          login: value.username.toLowerCase(),
          archetype: value.report.archetype,
          score: value.report.score,
          languages: langs,
          payload: JSON.stringify(value),
        },
      );
    } finally {
      await session.close();
    }
  }

  async get(username: string): Promise<ScanResult | null> {
    await this.init();
    const session = this.driver!.session(
      this.config.database ? { database: this.config.database } : undefined,
    );
    try {
      const res = await session.run(
        `MATCH (b:Builder { login: $login })
         RETURN b.payload AS payload LIMIT 1`,
        { login: username.toLowerCase() },
      );
      const rec = res.records[0];
      if (!rec) return null;
      const payload = rec.get("payload") as string;
      return JSON.parse(payload) as ScanResult;
    } finally {
      await session.close();
    }
  }

  async list(opts: ListOptions = {}): Promise<ScanResult[]> {
    await this.init();
    const { limit = 24, archetype, language } = opts;
    const session = this.driver!.session(
      this.config.database ? { database: this.config.database } : undefined,
    );
    try {
      const filters: string[] = [];
      const params: Record<string, unknown> = { limit };
      if (archetype) {
        filters.push("b.archetype = $archetype");
        params.archetype = archetype;
      }
      if (language) {
        filters.push("$language IN b.languages");
        params.language = language;
      }
      const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
      const query = `
        MATCH (b:Builder)
        ${where}
        RETURN b.payload AS payload
        ORDER BY b.updatedAt DESC
        LIMIT $limit
      `;
      const res = await session.run(query, params);
      return res.records.map(
        (r) => JSON.parse(r.get("payload") as string) as ScanResult,
      );
    } finally {
      await session.close();
    }
  }

  async count(): Promise<number> {
    await this.init();
    const session = this.driver!.session(
      this.config.database ? { database: this.config.database } : undefined,
    );
    try {
      const res = await session.run(
        `MATCH (b:Builder) RETURN count(b) AS n`,
      );
      const rec = res.records[0];
      if (!rec) return 0;
      const n = rec.get("n") as { toNumber?: () => number } | number;
      return typeof n === "number" ? n : (n.toNumber?.() ?? 0);
    } finally {
      await session.close();
    }
  }
}
