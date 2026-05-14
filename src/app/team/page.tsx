import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { TeamForm } from "@/components/team-form";
import { TeamResult } from "@/components/team-result";
import { TeamError, generateTeamReport, scanTeam } from "@/lib/team";

type SearchParams = Promise<{ n?: string; u?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { n, u } = await searchParams;
  if (!u) {
    return {
      title: "Team Scan · BLUEPRINT",
      description: "Point at a team. We tell you what they're actually building.",
    };
  }
  const teamName = (n || "the team").trim();
  return {
    title: `${teamName} · Team Scan · BLUEPRINT`,
    description: `BLUEPRINT's composite read on ${teamName} — collective archetype, blind spots, and the product hiding in the overlap.`,
    openGraph: {
      title: `${teamName} — what this team is actually building`,
      description: `Composite reading of ${u?.split(",").length || 0} builders.`,
      type: "article",
    },
  };
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { n, u } = await searchParams;

  if (!u) {
    return (
      <main className="flex flex-1 flex-col min-h-screen">
        <Nav active="team" />
        <section className="flex flex-1 flex-col justify-center px-8 pb-24 pt-12 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
              team scan · composite reading
            </p>
            <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-paper">
              point at a team.
              <br />
              <span className="italic text-accent">find the product</span>
              <br />
              hiding in the overlap.
            </h1>
            <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-paper/70 sm:text-lg">
              Drop 2–6 GitHub usernames. We read every member, then tell you the
              team&apos;s strongest capability, its shared blind spot, and the
              co-founder you&apos;re missing.
            </p>
            <div className="mt-12 max-w-2xl">
              <TeamForm />
            </div>
          </div>
        </section>
      </main>
    );
  }

  const usernames = u.split(",").map((s) => s.trim()).filter(Boolean);
  const teamName = (n || "the team").trim();

  try {
    const { members, errors } = await scanTeam(usernames);
    if (members.length < 2) {
      return (
        <TeamErrorView
          teamName={teamName}
          message={`only ${members.length} of ${usernames.length} could be read. need at least 2 valid github users. ${errors.map((e) => e.username).join(", ")} failed.`}
        />
      );
    }
    const report = await generateTeamReport(teamName, members);
    return (
      <>
        <Nav active="team" />
        <TeamResult
          teamName={teamName}
          members={members}
          report={report}
          errors={errors}
        />
      </>
    );
  } catch (err) {
    let message = "something broke generating the team report.";
    if (err instanceof TeamError) message = err.message;
    return <TeamErrorView teamName={teamName} message={message} />;
  }
}

function TeamErrorView({
  teamName,
  message,
}: {
  teamName: string;
  message: string;
}) {
  return (
    <>
      <Nav active="team" />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          error · team scan
        </p>
        <h1 className="mt-6 font-display text-5xl text-paper sm:text-7xl">
          couldn&apos;t scan {teamName}
        </h1>
        <p className="mt-6 max-w-md text-paper/70">{message}</p>
        <Link
          href="/team"
          className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
        >
          ← try a different team
        </Link>
      </main>
    </>
  );
}
