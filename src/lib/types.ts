export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string | null;
  blog: string | null;
};

export type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  pushed_at: string;
  created_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
};

export type GitHubSnapshot = {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  languageWeights: { lang: string; weight: number; bytes?: number }[];
  totalStars: number;
  yearsActive: number;
};

export type AnalysisReport = {
  archetype: string;
  archetypeBlurb: string;
  score: number;
  scoreBreakdown: {
    range: number;
    depth: number;
    consistency: number;
    ambition: number;
  };
  strengths: string[];
  gaps: string[];
  signaturePattern: string;
  nextStartup: {
    name: string;
    tagline: string;
    thesis: string;
    mvpScope: string;
    firstDollarIn: string;
    whyYou: string;
    roadmap: string[];
  };
  alternativePaths: { name: string; tagline: string }[];
  killerLine: string;
};

export type ScanResult = {
  username: string;
  snapshot: GitHubSnapshot;
  report: AnalysisReport;
};
