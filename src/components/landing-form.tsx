"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LandingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = username.trim().replace(/^@/, "").replace(/\/$/, "");
    if (!u) return;
    startTransition(() => {
      router.push(`/r/${encodeURIComponent(u)}`);
    });
  }

  return (
    <form onSubmit={submit} className="group relative">
      <div className="flex items-center gap-3 border-b border-paper/30 pb-3 transition focus-within:border-accent">
        <span className="font-mono text-sm text-muted">github.com/</span>
        <input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your-username"
          className="flex-1 bg-transparent font-display text-2xl text-paper outline-none placeholder:text-paper/25 sm:text-3xl"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={pending || !username.trim()}
          className="group/btn flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:text-accent disabled:opacity-30"
        >
          {pending ? "decoding" : "decode"}
          <span className="transition group-hover/btn:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
