import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export async function GET() {
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
            fontSize: 22,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#8a8580",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#ff5b1f",
              }}
            />
            <span style={{ color: "#f5f1e8" }}>blueprint</span>
          </div>
          <span>hackhazards &apos;26</span>
        </div>

        <div
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            color: "#f5f1e8",
          }}
        >
          <span>your repos,</span>
          <span>decoded into</span>
          <span style={{ color: "#ff5b1f" }}>your next startup.</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8a8580",
            borderTop: "1px solid #232323",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span>decode</span>
            <span>match</span>
            <span>team scan</span>
            <span>archive</span>
          </div>
          <span style={{ color: "#f5f1e8" }}>built for builders</span>
        </div>
      </div>
    ),
    { width: 1200, height: 800 },
  );
}
