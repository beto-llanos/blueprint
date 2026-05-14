import { ImageResponse } from "next/og";
import { generateMatchReport } from "@/lib/match";
import { scanUser } from "@/lib/scan";

export const alt = "BLUEPRINT Founder Match — two GitHubs, one verdict.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ a: string; b: string }>;

export default async function OG({ params }: { params: Params }) {
  const { a: rawA, b: rawB } = await params;
  const A = decodeURIComponent(rawA);
  const B = decodeURIComponent(rawB);

  let verdict = "verdict pending";
  let killer = "two GitHubs in. one verdict out.";
  let compat = "";

  try {
    const [resultA, resultB] = await Promise.all([
      scanUser(A),
      scanUser(B),
    ]);
    const match = await generateMatchReport(resultA, resultB);
    verdict = match.verdict;
    killer = match.killerLine;
    compat = match.compatibility.toFixed(1);
  } catch {
    // fall through to defaults
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
            <span style={{ color: "#f5f1e8" }}>blueprint · founder match</span>
          </div>
          <span>
            @{A} × @{B}
          </span>
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
            verdict
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 90,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#ff5b1f",
              fontStyle: "italic",
            }}
          >
            {verdict}.
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
              fontSize: 32,
              fontStyle: "italic",
              color: "#f5f1e8",
              lineHeight: 1.2,
              display: "flex",
            }}
          >
            “{truncate(killer, 130)}”
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
              {compat ? `compatibility ${compat}/10` : "two GitHubs, one verdict"}
            </span>
            <span style={{ color: "#f5f1e8" }}>blueprint</span>
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
