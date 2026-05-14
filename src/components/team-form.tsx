"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function TeamForm({
  defaultName = "",
  defaultMembers = "",
}: {
  defaultName?: string;
  defaultMembers?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [members, setMembers] = useState(defaultMembers);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = members
      .split(/[,\s\n]+/)
      .map((s) => s.trim().replace(/^@/, ""))
      .filter((s) => s);
    if (clean.length < 2) return;
    const params = new URLSearchParams({
      n: name.trim() || "the team",
      u: clean.slice(0, 6).join(","),
    });
    startTransition(() => {
      router.push(`/team?${params.toString()}`);
    });
  }

  const count = members
    .split(/[,\s\n]+/)
    .map((s) => s.trim().replace(/^@/, ""))
    .filter((s) => s).length;

  return (
    <form onSubmit={submit} className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          team name (optional)
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="the cofounders, weekend club, etc."
          className="mt-2 w-full border-b border-paper/30 bg-transparent pb-2 font-display text-2xl text-paper outline-none transition focus:border-accent placeholder:text-paper/25 sm:text-3xl"
          autoComplete="off"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            github usernames (2–6, comma or newline separated)
          </p>
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
              count < 2 || count > 6 ? "text-accent" : "text-muted"
            }`}
          >
            {count}/6
          </p>
        </div>
        <textarea
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder={"dhh\ngaearon\nsindresorhus"}
          rows={5}
          className="mt-2 w-full resize-none border-b border-paper/30 bg-transparent pb-2 font-display text-2xl text-paper outline-none transition focus:border-accent placeholder:text-paper/25"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <button
        type="submit"
        disabled={pending || count < 2}
        className="group/btn flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:text-accent disabled:opacity-30"
      >
        {pending ? "scanning the team" : "scan the team"}
        <span className="transition group-hover/btn:translate-x-1">→</span>
      </button>
    </form>
  );
}
