"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { ScanResult } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Report({ result }: { result: ScanResult }) {
  const { username, snapshot, report } = result;
  const { profile } = snapshot;
  const issue = String(
    1000 + Math.abs(hashCode(username) % 9000),
  ).padStart(4, "0");

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: { staggerChildren: 0.09 } },
      }}
      className="mx-auto w-full max-w-4xl px-6 pb-32 pt-8 sm:px-10"
    >
      <Masthead username={username} issue={issue} />

      <motion.section
        variants={fadeUp}
        className="mt-16 flex items-center gap-5"
      >
        <Image
          src={profile.avatar_url}
          alt={username}
          width={64}
          height={64}
          className="size-16 rounded-full grayscale"
          unoptimized
        />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            subject
          </p>
          <p className="font-display text-3xl text-paper">
            @{profile.login}
          </p>
          {profile.bio && (
            <p className="mt-1 max-w-md text-sm text-paper/60">
              {profile.bio}
            </p>
          )}
        </div>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>archetype</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tight text-paper">
          you are <span className="italic text-accent">{report.archetype}</span>.
        </h1>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-paper/80 sm:text-3xl">
          {report.archetypeBlurb}
        </p>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>builder score</Eyebrow>
        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <div className="font-display text-[8rem] leading-none tracking-tight text-accent sm:text-[10rem]">
            {report.score.toFixed(1)}
            <span className="ml-1 text-3xl text-paper/40">/10</span>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.15em] sm:max-w-sm">
            <ScoreRow label="range" value={report.scoreBreakdown.range} />
            <ScoreRow label="depth" value={report.scoreBreakdown.depth} />
            <ScoreRow
              label="consistency"
              value={report.scoreBreakdown.consistency}
            />
            <ScoreRow
              label="ambition"
              value={report.scoreBreakdown.ambition}
            />
          </ul>
        </div>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>signature pattern</Eyebrow>
        <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-paper sm:text-3xl">
          “{report.signaturePattern}”
        </p>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>your strengths</Eyebrow>
        <ol className="mt-6 space-y-6">
          {report.strengths.map((s, i) => (
            <li key={i} className="flex gap-6">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-xl leading-snug text-paper sm:text-2xl">
                {s}
              </p>
            </li>
          ))}
        </ol>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>your gaps</Eyebrow>
        <ol className="mt-6 space-y-6">
          {report.gaps.map((g, i) => (
            <li key={i} className="flex gap-6">
              <span className="font-mono text-xs text-paper/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-xl leading-snug text-paper/70 sm:text-2xl">
                {g}
              </p>
            </li>
          ))}
        </ol>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-16">
        <Eyebrow>your next startup</Eyebrow>
        <div className="mt-6 border border-line bg-card p-8 sm:p-12">
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight text-paper">
            {report.nextStartup.name}
          </h2>
          <p className="mt-2 font-display text-xl italic text-accent sm:text-2xl">
            {report.nextStartup.tagline}
          </p>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
            {report.nextStartup.thesis}
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-paper/60">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              why you ·{" "}
            </span>
            {report.nextStartup.whyYou}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.15em] sm:grid-cols-2">
            <div>
              <p className="text-muted">mvp scope</p>
              <p className="mt-1 text-paper">
                {report.nextStartup.mvpScope}
              </p>
            </div>
            <div>
              <p className="text-muted">first dollar in</p>
              <p className="mt-1 text-paper">
                {report.nextStartup.firstDollarIn}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              roadmap
            </p>
            <ol className="mt-4 space-y-3">
              {report.nextStartup.roadmap.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-sm leading-relaxed text-paper/80 sm:text-base"
                >
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>alternative paths</Eyebrow>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {report.alternativePaths.map((alt, i) => (
            <div
              key={i}
              className="border border-line p-5 transition hover:border-paper/40"
            >
              <p className="font-display text-2xl text-paper">{alt.name}</p>
              <p className="mt-1 text-sm italic text-paper/60">
                {alt.tagline}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-20">
        <Eyebrow>closing</Eyebrow>
        <p className="mt-8 max-w-3xl font-display text-[clamp(2rem,5.5vw,3.75rem)] italic leading-[1.05] text-accent">
          “{report.killerLine}”
        </p>
      </motion.section>

      <motion.footer
        variants={fadeUp}
        className="mt-24 flex flex-col items-start gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <span>blueprint · issue {issue}</span>
        <div className="flex flex-wrap items-center gap-6">
          <ShareButton archetype={report.archetype} />
          <Link href="/" className="text-paper hover:text-accent">
            ← decode another
          </Link>
        </div>
      </motion.footer>
    </motion.main>
  );
}

function Masthead({
  username,
  issue,
}: {
  username: string;
  issue: string;
}) {
  return (
    <motion.header
      variants={fadeUp}
      className="flex items-center justify-between"
    >
      <Link
        href="/"
        className="flex items-center gap-3 transition hover:opacity-70"
      >
        <div className="size-2 rounded-full bg-accent" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper">
          blueprint
        </span>
      </Link>
      <div className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>issue {issue}</span>
        <span className="mx-2 text-paper/30">·</span>
        <span>subject @{username}</span>
      </div>
    </motion.header>
  );
}

function SectionRule() {
  return <div className="mt-12 h-px w-full bg-line" />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
      {children}
    </p>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-baseline justify-between gap-2 border-b border-line pb-2">
      <span className="text-muted">{label}</span>
      <span className="font-display text-2xl text-paper">{value}</span>
    </li>
  );
}

function ShareButton({ archetype }: { archetype: string }) {
  function share(e: React.MouseEvent) {
    e.preventDefault();
    const url = window.location.href;
    const text = `i ran my github through blueprint and apparently i'm ${archetype}.\n\n${url}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <a
      href="#"
      onClick={share}
      className="text-paper hover:text-accent"
    >
      share on x →
    </a>
  );
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
