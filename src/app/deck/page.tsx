import Link from "next/link";

export const metadata = {
  title: "BLUEPRINT · Deck · HACKHAZARDS '26",
  description: "Six-slide presentation for BLUEPRINT.",
};

export default function DeckPage() {
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
      <Slide n="01" total="06" eyebrow="cover">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          hackhazards &apos;26 · developer tools track
        </p>
        <h1 className="mt-8 font-display text-[clamp(3rem,12vw,9rem)] leading-[0.95] tracking-tight text-paper">
          blueprint.
        </h1>
        <p className="mt-8 max-w-2xl font-display text-[clamp(1.5rem,3vw,2.5rem)] italic leading-snug text-accent">
          your repos, decoded into your next startup.
        </p>
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          by roberto llanos · solo build · 2 days
        </p>
      </Slide>

      <Slide n="02" total="06" eyebrow="problem">
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-paper">
          every developer has{" "}
          <span className="italic text-accent">fifty repos</span>
          <br />
          and no idea what story they tell.
        </p>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-paper/70 sm:text-xl">
          The startup they should be building isn&apos;t on Twitter or in a YC
          essay.
        </p>
        <p className="mt-3 max-w-2xl font-display text-2xl italic leading-snug text-paper sm:text-3xl">
          It&apos;s already in their git history.
          <br />
          They just can&apos;t read it from the inside.
        </p>
      </Slide>

      <Slide n="03" total="06" eyebrow="solution">
        <p className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight text-paper">
          BLUEPRINT reads any GitHub like a critic
          <br />
          reads a body of work — then tells you the{" "}
          <span className="italic text-accent">company you&apos;re already building.</span>
        </p>
        <ul className="mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            ["Decode", "single GitHub → archetype, score, signature pattern, next-startup idea."],
            ["Founder Match", "two GitHubs → cofounding verdict + compatibility score."],
            ["Team Scan", "2–6 builders → composite team report + missing-cofounder profile."],
            ["Archive", "every decoded builder, browsable. Filter by archetype or language."],
          ].map(([title, blurb]) => (
            <li key={title} className="border border-line p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                {title}
              </p>
              <p className="mt-3 font-display text-lg leading-snug text-paper sm:text-xl">
                {blurb}
              </p>
            </li>
          ))}
        </ul>
      </Slide>

      <Slide n="04" total="06" eyebrow="live demo">
        <p className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-tight text-paper">
          Try it live with{" "}
          <span className="italic text-accent">any GitHub username</span>.
        </p>
        <div className="mt-12 flex flex-col gap-3 font-mono text-sm text-paper sm:gap-6 sm:text-base">
          <DemoLink href="/" path="/" label="landing" />
          <DemoLink href="/r/gaearon" path="/r/gaearon" label="Decode · Dan Abramov" />
          <DemoLink href="/match/dhh/gaearon" path="/match/dhh/gaearon" label="Founder Match · dhh × gaearon" />
          <DemoLink
            href="/team?n=goat-team&u=dhh,gaearon,sindresorhus,antfu"
            path="/team?n=goat-team&u=…"
            label="Team Scan · 4 builders"
          />
          <DemoLink href="/archive" path="/archive" label="Archive · grid of decoded builders" />
        </div>
        <p className="mt-10 max-w-2xl font-display text-xl italic text-accent sm:text-2xl">
          “You are not a React developer. You are the writer React happened to need.”
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          — live output from /r/gaearon
        </p>
      </Slide>

      <Slide n="05" total="06" eyebrow="why now">
        <p className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight text-paper">
          Claude Sonnet 4.6 is the first model that
          <br />
          reads code{" "}
          <span className="italic text-accent">like a literary critic reads a body of work.</span>
        </p>
        <div className="mt-12 max-w-3xl border-l-2 border-accent pl-6">
          <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] italic leading-snug text-paper/90">
            &ldquo;I built this, then ran my own GitHub through it. It told me
            I&apos;d named four companies already and forgot to charge for any
            of them. So I&apos;m fixing that — starting with this one.&rdquo;
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            — origin story
          </p>
        </div>
      </Slide>

      <Slide n="06" total="06" eyebrow="roadmap">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              shipped
            </p>
            <ul className="mt-4 space-y-3 font-display text-lg leading-snug text-paper sm:text-xl">
              <li>✓ four product modes</li>
              <li>✓ Claude Sonnet 4.6 pipeline</li>
              <li>✓ Neo4j AuraDB persisting every scan</li>
              <li>✓ structurally compatible builders in every report</li>
              <li>✓ OG share cards on every URL</li>
              <li>✓ public archive</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              next
            </p>
            <ul className="mt-4 space-y-3 font-display text-lg leading-snug text-paper/80 sm:text-xl">
              <li>· Cypher-native Founder Match across the archive</li>
              <li>· `/u/[login]/matches` top-N from the graph</li>
              <li>· opt-in privacy for public archive</li>
              <li>· BLUEPRINT for orgs — composite team reports + paid tier</li>
              <li>· per-IP rate limiting before going wide</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start gap-2 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:flex-row sm:items-baseline sm:justify-between">
          <span>blueprint · roberto llanos</span>
          <Link
            href="https://blueprint-production-50d0.up.railway.app"
            className="text-accent hover:underline"
          >
            blueprint-production-50d0.up.railway.app
          </Link>
        </div>
      </Slide>
    </main>
  );
}

function Slide({
  n,
  total,
  eyebrow,
  children,
}: {
  n: string;
  total: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex h-screen snap-start flex-col justify-center px-8 py-16 sm:px-16">
      <header className="absolute left-8 right-8 top-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:left-16 sm:right-16">
        <Link href="/" className="flex items-center gap-2 transition hover:text-paper">
          <div className="size-1.5 rounded-full bg-accent" />
          <span className="text-paper">blueprint</span>
        </Link>
        <div className="flex items-center gap-4">
          <span>{eyebrow}</span>
          <span className="text-paper/40">·</span>
          <span>
            {n} / {total}
          </span>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function DemoLink({
  href,
  path,
  label,
}: {
  href: string;
  path: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-baseline justify-between border-b border-line pb-3 transition hover:border-accent"
    >
      <span className="text-paper transition group-hover:text-accent">
        {path}
      </span>
      <span className="text-muted">{label}</span>
    </Link>
  );
}
