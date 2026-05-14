"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ScanResult, TeamReport } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function TeamResult({
  teamName,
  members,
  report,
  errors,
}: {
  teamName: string;
  members: ScanResult[];
  report: TeamReport;
  errors: { username: string; error: string }[];
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
          team scan · composite
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-tight text-paper">
          {teamName}
        </h1>
        <div className="mt-8 flex flex-wrap gap-4">
          {members.map((m) => (
            <Link
              key={m.username}
              href={`/r/${m.username}`}
              className="group flex items-center gap-3 border border-line px-4 py-2 transition hover:border-paper/40"
            >
              <Image
                src={m.snapshot.profile.avatar_url}
                alt={m.username}
                width={32}
                height={32}
                className="size-8 rounded-full grayscale group-hover:grayscale-0"
                unoptimized
              />
              <div>
                <p className="font-display text-base text-paper">
                  @{m.username}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                  {m.report.archetype}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {errors.length > 0 && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            skipped: {errors.map((e) => e.username).join(", ")}
          </p>
        )}
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>collective score</Eyebrow>
        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <div className="font-display text-[8rem] leading-none tracking-tight text-accent sm:text-[10rem]">
            {report.collectiveScore.toFixed(1)}
            <span className="ml-1 text-3xl text-paper/40">/10</span>
          </div>
          <ul className="space-y-3 font-mono text-xs uppercase tracking-[0.15em] sm:max-w-sm">
            {report.archetypeMix.map((a) => (
              <li
                key={a.archetype}
                className="flex items-baseline justify-between border-b border-line pb-2"
              >
                <span className="text-paper/80">{a.archetype}</span>
                <span className="font-display text-2xl text-paper">
                  ×{a.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>strongest collectively</Eyebrow>
        <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-paper sm:text-3xl">
          {report.strongest}
        </p>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>shared blind spot</Eyebrow>
        <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-accent sm:text-3xl">
          {report.blindSpot}
        </p>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-12">
        <Eyebrow>the cofounder you&apos;re missing</Eyebrow>
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-paper">
          you need a{" "}
          <span className="italic text-accent">
            {report.missingCofounder.archetype}
          </span>
          .
        </h2>
        <p className="mt-6 max-w-2xl font-display text-xl leading-snug text-paper/80 sm:text-2xl">
          {report.missingCofounder.blurb}
        </p>
      </motion.section>

      <SectionRule />

      <motion.section variants={fadeUp} className="mt-16">
        <Eyebrow>what this team should build</Eyebrow>
        <div className="mt-6 border border-line bg-card p-8 sm:p-12">
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight text-paper">
            {report.whatTheyShouldBuild.name}
          </h2>
          <p className="mt-2 font-display text-xl italic text-accent sm:text-2xl">
            {report.whatTheyShouldBuild.tagline}
          </p>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
            {report.whatTheyShouldBuild.thesis}
          </p>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="mt-16">
        <Eyebrow>closing</Eyebrow>
        <p className="mt-8 max-w-3xl font-display text-[clamp(2rem,5.5vw,3.75rem)] italic leading-[1.05] text-accent">
          “{report.killerLine}”
        </p>
      </motion.section>

      <motion.footer
        variants={fadeUp}
        className="mt-24 flex flex-col items-start gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <span>blueprint · team scan</span>
        <Link href="/team" className="text-paper hover:text-accent">
          ← scan a different team
        </Link>
      </motion.footer>
    </motion.main>
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
