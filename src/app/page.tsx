import Link from "next/link";
import { LandingForm } from "@/components/landing-form";

const EXAMPLES = ["dhh", "gaearon", "midudev", "sindresorhus", "antfu"];

const MODES: { href: string; tag: string; title: string; blurb: string }[] = [
  {
    href: "/match",
    tag: "founder match",
    title: "two githubs in, one verdict out.",
    blurb: "Decide whether to cofound — before you go cofound.",
  },
  {
    href: "/team",
    tag: "team scan",
    title: "point at a team. find the product hiding in the overlap.",
    blurb: "2–6 builders → collective archetype, blind spot, what to build.",
  },
  {
    href: "/archive",
    tag: "archive",
    title: "every builder we've decoded, browsable.",
    blurb: "Filter by archetype, language, or just scroll.",
  },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col min-h-screen">
      <header className="flex items-center justify-between px-8 py-6 sm:px-14">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/80">
            blueprint
          </span>
        </div>
        <nav className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          <Link href="/match" className="transition hover:text-paper">
            match
          </Link>
          <Link href="/team" className="transition hover:text-paper">
            team
          </Link>
          <Link href="/archive" className="transition hover:text-paper">
            archive
          </Link>
        </nav>
      </header>

      <section className="flex flex-1 flex-col justify-center px-8 pb-16 pt-12 sm:px-14">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
            a github analysis instrument for builders
          </p>

          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-tight text-paper">
            your repos,
            <br />
            decoded into{" "}
            <span className="italic text-accent">your next</span>
            <br />
            startup.
          </h1>

          <p className="mt-10 max-w-xl font-sans text-base leading-relaxed text-paper/70 sm:text-lg">
            Drop a GitHub username. We read every repo, commit, and signal —
            then tell you the company you&apos;re already, slowly, accidentally
            building.
          </p>

          <div className="mt-12 max-w-xl">
            <LandingForm />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              or try
            </span>
            {EXAMPLES.map((u) => (
              <a
                key={u}
                href={`/r/${u}`}
                className="font-mono text-xs text-paper/60 underline-offset-4 transition hover:text-accent hover:underline"
              >
                {u}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-8 py-16 sm:px-14">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            also available
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MODES.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group flex h-full flex-col justify-between border border-line p-6 transition hover:border-paper/40"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    {m.tag}
                  </p>
                  <p className="mt-4 font-display text-2xl leading-snug text-paper">
                    {m.title}
                  </p>
                </div>
                <p className="mt-6 text-sm text-paper/60">{m.blurb}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 group-hover:text-accent">
                  open →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-8 py-6 sm:px-14">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>built for builders</span>
          <span>read your commits like a fortune teller</span>
        </div>
      </footer>
    </main>
  );
}
