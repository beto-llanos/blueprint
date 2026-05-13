import { ImageResponse } from "next/og";
import { scanUser } from "@/lib/scan";

export const alt = "Your repos, decoded into your next startup.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw);

  let archetype = "The Builder";
  let killer = "your next startup is already in your repos.";
  let score = "";
  let nextName = "";

  try {
    const result = await scanUser(username);
    archetype = result.report.archetype;
    killer = result.report.killerLine;
    score = result.report.score.toFixed(1);
    nextName = result.report.nextStartup.name;
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          background: "#0a0a0a",
          color: "#f5f1e8",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#8a8580",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ff5b1f",
              }}
            />
            <span style={{ color: "#f5f1e8" }}>blueprint</span>
          </div>
          <span>@{username}</span>
        </div>

        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#8a8580",
            }}
          >
            archetype
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 100,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#f5f1e8",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>you are&nbsp;</span>
            <span style={{ color: "#ff5b1f", fontStyle: "italic" }}>
              {archetype}.
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontStyle: "italic",
              color: "#ff5b1f",
              lineHeight: 1.15,
              display: "flex",
            }}
          >
            “{truncate(killer, 110)}”
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8a8580",
              borderTop: "1px solid #232323",
              paddingTop: 20,
            }}
          >
            <span>
              {score ? `score ${score}/10` : "your repos, decoded"}
            </span>
            <span style={{ color: "#f5f1e8" }}>
              {nextName ? `next: ${nextName}` : "blueprint.dev"}
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}
