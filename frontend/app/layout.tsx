import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlacementBuddy | AI-Powered Placement Preparation Platform",
  description:
    "Your all-in-one AI placement preparation hub — Resume ATS scoring & company tier unlocking, online assessment prep (Aptitude, DBMS, CN, OS, DSA), and live face-to-face AI HR interview simulator with webcam and voice.",
  keywords: [
    "placement preparation",
    "ATS resume score",
    "AI interview simulator",
    "OA practice",
    "campus placement",
    "DBMS questions",
    "DSA practice",
    "CS placement",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} dark h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--on-surface)] font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
