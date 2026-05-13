import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLUEPRINT — your repos, decoded into your next startup",
  description:
    "Drop a GitHub username. We read every repo, commit, and signal — and tell you what to build next. Made for builders who already shipped, and the ones about to.",
  openGraph: {
    title: "BLUEPRINT",
    description: "your repos, decoded into your next startup",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BLUEPRINT",
    description: "your repos, decoded into your next startup",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">{children}</body>
    </html>
  );
}
