import type { GitHubProfile, GitHubRepo, GitHubSnapshot } from "./types";

const GH_BASE = "https://api.github.com";

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "blueprint-app",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export class GitHubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${GH_BASE}${path}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new GitHubError(
      `GitHub API ${res.status} on ${path}`,
      res.status,
    );
  }
  return res.json() as Promise<T>;
}

export async function fetchSnapshot(rawUsername: string): Promise<GitHubSnapshot> {
  const username = rawUsername.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    throw new GitHubError("Invalid GitHub username", 400);
  }

  const [profile, repos] = await Promise.all([
    gh<GitHubProfile>(`/users/${username}`),
    gh<GitHubRepo[]>(
      `/users/${username}/repos?sort=updated&per_page=100&type=owner`,
    ),
  ]);

  const owned = repos.filter((r) => !r.fork && !r.archived);

  const langCounts = new Map<string, number>();
  let totalSize = 0;
  for (const r of owned) {
    if (r.language) {
      const w = Math.max(r.size, 1);
      langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + w);
      totalSize += w;
    }
  }
  const languageWeights = Array.from(langCounts.entries())
    .map(([lang, bytes]) => ({
      lang,
      bytes,
      weight: totalSize ? bytes / totalSize : 0,
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);

  const totalStars = owned.reduce((s, r) => s + r.stargazers_count, 0);
  const yearsActive =
    (Date.now() - new Date(profile.created_at).getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  const topRepos = [...owned]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 25);

  return {
    profile,
    repos: topRepos,
    languageWeights,
    totalStars,
    yearsActive: Math.round(yearsActive * 10) / 10,
  };
}
