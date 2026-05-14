"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { MatchReport, ScanResult } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function MatchResult({
  a,
  b,
  match,
  quant,
}: {
  a: ScanResult;
  b: ScanResult;
  match: MatchReport;
  quant: number;
}) {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      className="mx-auto w-full max-w-5xl px-6 pb-32 pt-12 sm:px-10"
    >
      <motion.section variants={fadeUp}>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          founder match · verdict
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <BuilderCard r={a} align="left" />
          <p className="hidden text-center font-display text-3xl italic text-accent sm:block">
            ×
          </p>
          <BuilderCard r={b} align="right" />
        </div>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-10">
        <Eyebrow>verdict</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tight text-paper">
          <span className="italic text-accent">{match.verdict}.</span>
        </h1>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-paper/80 sm:text-3xl">
          {match.verdictBlurb}
        </p>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-10">
        <Eyebrow>compatibility</Eyebrow>
        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <div className="font-display text-[8rem] leading-none tracking-tight text-accent sm:text-[10rem]">
            {match.compatibility.toFixed(1)}
            <span className="ml-1 text-3xl text-paper/40">/10</span>
          </div>
          <div className="space-y-2 font-mono text-xs uppercase tracking-[0.15em] sm:max-w-sm">
            <Row label="structural similarity" value={`${quant}%`} />
            <Row
              label="archetype distance"
              value={archDistanceWord(a.report.archetype, b.report.archetype)}
            />
            <Row
              label="score delta"
              value={`${Math.abs(a.report.score - b.report.score).toFixed(1)} pts`}
            />
          </div>
        </div>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-10">
        <Eyebrow>where you agree</Eyebrow>
        <ColumnList items={match.agree} accent="paper" />
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-10">
        <Eyebrow>where you&apos;ll fight</Eyebrow>
        <ColumnList items={match.fight} accent="accent" />
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-10">
        <Eyebrow>complementary edges</Eyebrow>
        <ColumnList items={match.complement} accent="paper" />
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-16">
        <Eyebrow>closing</Eyebrow>
        <p className="mt-8 max-w-3xl font-display text-[clamp(2rem,5.5vw,3.75rem)] italic leading-[1.05] text-accent">
          “{match.killerLine}”
        </p>
      </motion.section>

      <motion.footer
        variants={fadeUp}
        className="mt-24 flex flex-col items-start gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <span>blueprint · founder match</span>
        <div className="flex flex-wrap items-center gap-6">
          <ShareButton a={a.username} b={b.username} verdict={match.verdict} />
          <Link href="/match" className="text-paper hover:text-accent">
            ← try a different pair
          </Link>
        </div>
      </motion.footer>
    </motion.main>
  );
}

function BuilderCard({
  r,
  align,
}: {
  r: ScanResult;
  align: "left" | "right";
}) {
  return (
    <Link
      href={`/r/${r.username}`}
      className={`group flex items-center gap-4 ${
        align === "right" ? "sm:justify-self-end" : ""
      }`}
    >
      <Image
        src={r.snapshot.profile.avatar_url}
        alt={r.username}
        width={56}
        height={56}
        className="size-14 rounded-full grayscale transition group-hover:grayscale-0"
        unoptimized
      />
      <div>
        <p className="font-display text-2xl text-paper">@{r.username}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {r.report.archetype} · {r.report.score.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}

function SectionRule() {
  return <div className="mt-10 h-px w-full bg-line" />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
      {children}
    </p>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-line pb-2">
      <span className="text-muted">{label}</span>
      <span className="text-paper">{value}</span>
    </div>
  );
}

function ColumnList({
  items,
  accent,
}: {
  items: string[];
  accent: "accent" | "paper";
}) {
  return (
    <ol className="mt-6 space-y-6">
      {items.map((s, i) => (
        <li key={i} className="flex gap-6">
          <span
            className={`font-mono text-xs ${
              accent === "accent" ? "text-accent" : "text-paper/50"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="font-display text-xl leading-snug text-paper sm:text-2xl">
            {s}
          </p>
        </li>
      ))}
    </ol>
  );
}

function ShareButton({
  a,
  b,
  verdict,
}: {
  a: string;
  b: string;
  verdict: string;
}) {
  function share(e: React.MouseEvent) {
    e.preventDefault();
    const url = window.location.href;
    const text = `BLUEPRINT just ran ${a} × ${b} and the verdict is: ${verdict}.\n\n${url}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <a href="#" onClick={share} className="text-paper hover:text-accent">
      share on x →
    </a>
  );
}

function archDistanceWord(a: string, b: string): string {
  if (a === b) return "identical";
  return "different";
}
