import type { Metadata } from "next";
import Link from "next/link";
import { GitHubError } from "@/lib/github";
import { scanUser } from "@/lib/scan";
import { Report } from "@/components/report";
import { ClaudeError } from "@/lib/claude";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const u = decodeURIComponent(username);
  try {
    const { report } = await scanUser(u);
    return {
      title: `${u} — ${report.archetype} · BLUEPRINT`,
      description: report.killerLine,
      openGraph: {
        title: `${u} is ${report.archetype}.`,
        description: report.killerLine,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${u} is ${report.archetype}.`,
        description: report.killerLine,
      },
    };
  } catch {
    return {
      title: `${u} · BLUEPRINT`,
      description: "your repos, decoded into your next startup.",
    };
  }
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const raw = decodeURIComponent(username);

  try {
    const result = await scanUser(raw);
    return <Report result={result} />;
  } catch (err) {
    return <ReportError raw={raw} err={err} />;
  }
}

function ReportError({ raw, err }: { raw: string; err: unknown }) {
  let title = "something broke";
  let body =
    "we couldn't read this github. could be them, could be us. try again, or try a different username.";

  if (err instanceof GitHubError) {
    if (err.status === 404) {
      title = "github user not found";
      body = `we looked for github.com/${raw} and got nothing back. check the spelling.`;
    } else if (err.status === 403) {
      title = "rate limited";
      body =
        "github is throttling us. wait a minute and try again — or check that the token in .env.local is valid.";
    } else if (err.status === 400) {
      title = "invalid username";
      body = "github usernames are letters, numbers, and hyphens. that's it.";
    }
  } else if (err instanceof ClaudeError) {
    title = "the analysis fumbled";
    body =
      "claude returned something we couldn't parse. usually means the api key is missing or the response stalled. try once more.";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        error
      </p>
      <h1 className="mt-6 font-display text-5xl text-paper sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-md text-paper/70">{body}</p>
      <Link
        href="/"
        className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
      >
        ← back to start
      </Link>
    </main>
  );
}
