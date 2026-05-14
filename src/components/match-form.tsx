"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MatchForm({
  defaultA = "",
  defaultB = "",
}: {
  defaultA?: string;
  defaultB?: string;
}) {
  const router = useRouter();
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const aa = a.trim().replace(/^@/, "").replace(/\/$/, "");
    const bb = b.trim().replace(/^@/, "").replace(/\/$/, "");
    if (!aa || !bb) return;
    startTransition(() => {
      router.push(`/match/${encodeURIComponent(aa)}/${encodeURIComponent(bb)}`);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="builder a" value={a} setValue={setA} autoFocus />
        <Field label="builder b" value={b} setValue={setB} />
      </div>
      <button
        type="submit"
        disabled={pending || !a.trim() || !b.trim()}
        className="group/btn flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:text-accent disabled:opacity-30"
      >
        {pending ? "judging" : "judge the pairing"}
        <span className="transition group-hover/btn:translate-x-1">→</span>
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  setValue,
  autoFocus,
}: {
  label: string;
  value: string;
  setValue: (s: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="group">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2 border-b border-paper/30 pb-2 transition focus-within:border-accent">
        <span className="font-mono text-xs text-muted">github.com/</span>
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="username"
          className="flex-1 bg-transparent font-display text-2xl text-paper outline-none placeholder:text-paper/25"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
