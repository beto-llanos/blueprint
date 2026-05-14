import { Nav } from "@/components/nav";
import { MatchForm } from "@/components/match-form";

export const metadata = {
  title: "Founder Match · BLUEPRINT",
  description:
    "Two GitHubs go in. We tell you whether you'd cofound well.",
};

export default function MatchIndexPage() {
  return (
    <main className="flex flex-1 flex-col min-h-screen">
      <Nav active="match" />
      <section className="flex flex-1 flex-col justify-center px-8 pb-24 pt-12 sm:px-14">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
            founder match · pair-reading instrument
          </p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-paper">
            two githubs in.
            <br />
            <span className="italic text-accent">one verdict</span> out.
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-paper/70 sm:text-lg">
            We read both bodies of work, compare archetypes, and tell you
            whether to ship together — or whether you&apos;d quietly compete
            for the same wheel.
          </p>

          <div className="mt-12 max-w-2xl">
            <MatchForm />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              or try
            </span>
            {EXAMPLES.map(([a, b]) => (
              <a
                key={`${a}-${b}`}
                href={`/match/${a}/${b}`}
                className="font-mono text-xs text-paper/60 underline-offset-4 transition hover:text-accent hover:underline"
              >
                {a} × {b}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const EXAMPLES: [string, string][] = [
  ["dhh", "gaearon"],
  ["sindresorhus", "antfu"],
  ["midudev", "beto-llanos"],
];
