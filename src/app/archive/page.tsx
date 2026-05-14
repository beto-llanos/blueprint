import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { getStore } from "@/lib/store";
import type { ScanResult } from "@/lib/types";

export const metadata = {
  title: "Archive · BLUEPRINT",
  description:
    "Every builder we've decoded — browsed by archetype, by language, by score.",
};

type SearchParams = Promise<{ archetype?: string; language?: string }>;

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { archetype, language } = await searchParams;
  const store = await getStore();
  const results = await store.list({
    archetype,
    language,
    limit: 60,
  });
  const total = await store.count();

  const archetypes = uniqueArchetypes(results);
  const languages = topLanguages(results);

  return (
    <main className="flex flex-1 flex-col min-h-screen">
      <Nav active="archive" />
      <section className="px-8 pb-32 pt-12 sm:px-14">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
            archive · every builder we&apos;ve decoded
          </p>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-paper">
            the wall of <span className="italic text-accent">decoded</span>.
          </h1>
          <p className="mt-6 max-w-xl text-paper/70">
            {total} builders read so far. Filter by archetype, language, or
            just browse.
          </p>

          <div className="mt-10 space-y-3">
            <FilterRow
              label="archetype"
              options={archetypes}
              current={archetype}
              param="archetype"
              otherParam="language"
              otherValue={language}
            />
            {languages.length > 0 && (
              <FilterRow
                label="language"
                options={languages}
                current={language}
                param="language"
                otherParam="archetype"
                otherValue={archetype}
              />
            )}
          </div>

          {results.length === 0 ? (
            <EmptyArchive />
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <ArchiveCard key={r.username} r={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ArchiveCard({ r }: { r: ScanResult }) {
  return (
    <Link
      href={`/r/${r.username}`}
      className="group flex h-full flex-col justify-between border border-line bg-card p-6 transition hover:border-paper/40"
    >
      <div>
        <div className="flex items-center gap-3">
          <Image
            src={r.snapshot.profile.avatar_url}
            alt={r.username}
            width={36}
            height={36}
            className="size-9 rounded-full grayscale group-hover:grayscale-0"
            unoptimized
          />
          <div>
            <p className="font-display text-lg text-paper">@{r.username}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {r.report.archetype} · {r.report.score.toFixed(1)}
            </p>
          </div>
        </div>
        <p className="mt-6 line-clamp-4 font-display text-base italic leading-snug text-paper/80">
          &ldquo;{r.report.killerLine}&rdquo;
        </p>
      </div>
      <div className="mt-6 flex items-baseline justify-between border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>next: {truncate(r.report.nextStartup.name, 18)}</span>
        <span className="text-accent">read →</span>
      </div>
    </Link>
  );
}

function FilterRow({
  label,
  options,
  current,
  param,
  otherParam,
  otherValue,
}: {
  label: string;
  options: string[];
  current: string | undefined;
  param: string;
  otherParam: string;
  otherValue: string | undefined;
}) {
  function href(value: string | null): string {
    const sp = new URLSearchParams();
    if (otherValue) sp.set(otherParam, otherValue);
    if (value) sp.set(param, value);
    const q = sp.toString();
    return q ? `/archive?${q}` : "/archive";
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <FilterChip label="all" href={href(null)} active={!current} />
      {options.map((o) => (
        <FilterChip
          key={o}
          label={o}
          href={href(o)}
          active={current === o}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-mono text-[10px] uppercase tracking-[0.2em] underline-offset-4 transition ${
        active
          ? "text-accent"
          : "text-paper/60 hover:text-paper hover:underline"
      }`}
    >
      {label}
    </Link>
  );
}

function EmptyArchive() {
  return (
    <div className="mt-16 border border-line bg-card p-12 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        archive is warming up
      </p>
      <p className="mt-4 font-display text-2xl italic text-paper/70 sm:text-3xl">
        no reports in the visible window yet.
      </p>
      <p className="mt-2 text-paper/60">
        Decode someone — your own GitHub, your favorite engineer on X — and
        they&apos;ll appear here.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
      >
        decode someone →
      </Link>
    </div>
  );
}

function uniqueArchetypes(results: ScanResult[]): string[] {
  return Array.from(new Set(results.map((r) => r.report.archetype))).sort();
}

function topLanguages(results: ScanResult[]): string[] {
  const counts = new Map<string, number>();
  for (const r of results) {
    const top = r.snapshot.languageWeights[0]?.lang;
    if (top) counts.set(top, (counts.get(top) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang]) => lang);
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}
