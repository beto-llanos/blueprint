import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { GitHubError } from "@/lib/github";
import { MatchError, generateMatchReport, quantSimilarity } from "@/lib/match";
import { MatchResult } from "@/components/match-result";
import { scanUser } from "@/lib/scan";

type Params = Promise<{ a: string; b: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { a, b } = await params;
  const A = decodeURIComponent(a);
  const B = decodeURIComponent(b);
  return {
    title: `${A} × ${B} · Founder Match · BLUEPRINT`,
    description: `Should ${A} and ${B} ship a company together? BLUEPRINT reads both their repos and gives a verdict.`,
    openGraph: {
      title: `${A} × ${B} — should they ship together?`,
      description: `A side-by-side reading of two builders' public work.`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${A} × ${B} — verdict from BLUEPRINT`,
      description: `Two GitHubs in. One verdict out.`,
    },
  };
}

export default async function MatchPage({ params }: { params: Params }) {
  const { a: rawA, b: rawB } = await params;
  const A = decodeURIComponent(rawA);
  const B = decodeURIComponent(rawB);

  try {
    const [resultA, resultB] = await Promise.all([
      scanUser(A),
      scanUser(B),
    ]);
    const quant = quantSimilarity(resultA, resultB);
    const match = await generateMatchReport(resultA, resultB);
    return (
      <>
        <Nav active="match" />
        <MatchResult
          a={resultA}
          b={resultB}
          match={match}
          quant={quant}
        />
      </>
    );
  } catch (err) {
    return <MatchErrorView a={A} b={B} err={err} />;
  }
}

function MatchErrorView({
  a,
  b,
  err,
}: {
  a: string;
  b: string;
  err: unknown;
}) {
  let title = "we couldn't read the pair";
  let body =
    "one of the github lookups failed. retry, or check the spelling on both.";

  if (err instanceof GitHubError) {
    if (err.status === 404) {
      title = "one of those users does not exist";
      body = `we couldn't find both github.com/${a} and github.com/${b}. check the spelling on both.`;
    } else if (err.status === 403) {
      title = "rate limited";
      body =
        "github is throttling us. wait a minute and try again, or set a GITHUB_TOKEN.";
    }
  } else if (err instanceof MatchError) {
    title = "claude fumbled the pairing";
    body = "the match analysis returned something unparseable. try once more.";
  }

  return (
    <>
      <Nav active="match" />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          error
        </p>
        <h1 className="mt-6 font-display text-5xl text-paper sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-paper/70">{body}</p>
        <Link
          href="/match"
          className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
        >
          ← try a different pair
        </Link>
      </main>
    </>
  );
}
