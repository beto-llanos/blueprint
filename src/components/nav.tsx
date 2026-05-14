import Link from "next/link";

type Tab = "decode" | "match" | "team" | "archive";

const TABS: { id: Tab; label: string; href: string }[] = [
  { id: "decode", label: "decode", href: "/" },
  { id: "match", label: "match", href: "/match" },
  { id: "team", label: "team", href: "/team" },
  { id: "archive", label: "archive", href: "/archive" },
];

export function Nav({ active }: { active?: Tab }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-8 py-5 sm:px-14">
      <Link
        href="/"
        className="flex items-center gap-3 transition hover:opacity-70"
      >
        <div className="size-2 rounded-full bg-accent" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper">
          blueprint
        </span>
      </Link>
      <nav className="flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em]">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className={
              t.id === active
                ? "text-accent"
                : "text-muted transition hover:text-paper"
            }
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
