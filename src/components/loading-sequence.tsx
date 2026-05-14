"use client";

import { useEffect, useState } from "react";

const DEFAULT_STAGES = [
  "fetching repositories",
  "aggregating language signal",
  "reading the throughline",
  "consulting the model",
  "drafting your blueprint",
];

export function LoadingSequence({
  stages = DEFAULT_STAGES,
  label = "blueprint · decoding",
}: {
  stages?: string[];
  label?: string;
}) {
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((s) => (s < stages.length - 1 ? s + 1 : s));
    }, 2400);
    const tickTimer = setInterval(() => setTick((t) => t + 1), 120);
    return () => {
      clearInterval(stageTimer);
      clearInterval(tickTimer);
    };
  }, [stages.length]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8">
      <div className="w-full max-w-md font-mono text-sm">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
          {label}
        </p>
        <ul className="mt-8 space-y-3">
          {stages.map((stageLabel, i) => {
            const done = i < stage;
            const current = i === stage;
            const symbol = done ? "✓" : current ? spin(tick) : "·";
            return (
              <li
                key={stageLabel}
                className={`flex items-center gap-3 transition-opacity ${
                  done
                    ? "text-paper/60"
                    : current
                      ? "text-paper"
                      : "text-paper/25"
                }`}
              >
                <span
                  className={`w-4 ${
                    done || current ? "text-accent" : "text-muted"
                  }`}
                >
                  {symbol}
                </span>
                <span>{stageLabel}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-[10px] uppercase tracking-[0.25em] text-muted">
          this takes about 15 seconds.
        </p>
      </div>
    </main>
  );
}

function spin(tick: number): string {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  return frames[tick % frames.length];
}
