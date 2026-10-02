"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Code2,
  Video,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Flame,
  ChevronRight,
  Play,
  Terminal,
  Building2,
  Trophy,
  Star,
  Users,
  BadgeCheck,
} from "lucide-react";

const HIRING_SPRINTS = [
  { company: "Google", role: "SDE 1 / Campus 2026", status: "Closing 12d", ctc: "38 LPA", color: "text-rose-400", hot: false },
  { company: "Amazon", role: "Software Dev Eng 1", status: "OA Live Now", ctc: "44 LPA", color: "text-amber-400", hot: true },
  { company: "Barclays", role: "Tech Analyst OA", status: "Reg Open", ctc: "14 LPA", color: "text-cyan-400", hot: false },
  { company: "Razorpay", role: "FinTech SDE 1", status: "OA Sprints", ctc: "18 LPA", color: "text-emerald-400", hot: false },
  { company: "TCS Digital", role: "Digital / Prime", status: "NQT Phase 2", ctc: "7.5 LPA", color: "text-slate-400", hot: false },
  { company: "Infosys", role: "Specialist DSE", status: "InfyTQ Active", ctc: "9.5 LPA", color: "text-slate-400", hot: false },
  { company: "Microsoft", role: "SWE Intern 2026", status: "Round 1 Open", ctc: "35 LPA", color: "text-indigo-400", hot: false },
  { company: "Uber", role: "Backend SDE", status: "Closing 5d", ctc: "42 LPA", color: "text-amber-400", hot: true },
];

const PLATFORM_STATS = [
  { label: "ATS Scans", value: "94,200+", icon: FileText, color: "text-indigo-400" },
  { label: "OA Tests", value: "218k+", icon: Code2, color: "text-cyan-400" },
  { label: "AI Interviews", value: "51,400+", icon: Video, color: "text-emerald-400" },
  { label: "T1 Offers", value: "3,100+", icon: Trophy, color: "text-amber-400" },
];


function ATSDemoCard() {
  const [co, setCo] = useState<"Google" | "Razorpay" | "TCS">("Google");
  const DATA = {
    Google: { score: 63, color: "text-rose-400", bar: "bg-rose-500", note: "? Missing XYZ impact metrics & quantified scale (-11 pts)" },
    Razorpay: { score: 74, color: "text-cyan-400", bar: "bg-cyan-400", note: "? API microservices & DB concurrency recognized" },
    TCS: { score: 84, color: "text-emerald-400", bar: "bg-emerald-400", note: "?? Core CS & degree qualifications validated (+10 pts)" },
  };
  const d = DATA[co];
  return (
    <div className="space-y-3 font-mono">
      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
        {(["Google", "Razorpay", "TCS"] as const).map((c) => (
          <button key={c} onClick={() => setCo(c)}
            className={`py-1.5 rounded-xl border text-center font-bold transition-all ${co === c ? "bg-indigo-600 text-white border-indigo-400 shadow-md" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-300">Resume Match:</span>
          <span className={`text-xl font-black transition-all duration-300 ${d.color}`}>{d.score}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${d.bar}`} style={{ width: `${d.score}%` }} />
        </div>
        <p className="text-[10px] text-slate-400 leading-snug">{d.note}</p>
      </div>
    </div>
  );
}

function CodeDemoCard() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const run = () => { setRunning(true); setDone(false); setTimeout(() => { setRunning(false); setDone(true); }, 900); };
  return (
    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-[11px] space-y-2">
      <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800">
        <span className="flex items-center gap-1.5 text-indigo-400"><Terminal className="h-3 w-3" /> solution.py</span>
        <span className="text-[10px]">Python 3.12</span>
      </div>
      <p className="text-slate-300 text-[10px] leading-relaxed">
        def two_sum(nums, target):<br />
        &nbsp;&nbsp;seen = &#123;&#125;<br />
        &nbsp;&nbsp;for i, n in enumerate(nums):<br />
        &nbsp;&nbsp;&nbsp;&nbsp;if target - n in seen:<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [seen[target-n], i]<br />
        &nbsp;&nbsp;&nbsp;&nbsp;seen[n] = i
      </p>
      <button onClick={run} disabled={running}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition-all disabled:opacity-60">
        {running ? <span>Executing...</span> : <><Play className="h-3 w-3 fill-current" /><span>Run Test Suite</span></>}
      </button>
      {done && (
        <div className="flex items-center justify-between text-[10px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 animate-fade-in-up">
          <span>&#10003; 24/24 Passed</span><span className="text-slate-400">38ms</span>
        </div>
      )}
    </div>
  );
}

function ProctorDemoCard() {
  const [strikes, setStrikes] = useState(0);
  const [gaze, setGaze] = useState(98);
  const addStrike = () => { setStrikes((s) => Math.min(3, s + 1)); setGaze((g) => Math.max(20, g - 22)); };
  const reset = () => { setStrikes(0); setGaze(98); };
  return (
    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-[11px] space-y-2.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className={`flex items-center gap-1.5 font-bold ${strikes >= 3 ? "text-rose-400" : "text-emerald-400"}`}>
          <span className={`h-2 w-2 rounded-full ${strikes >= 3 ? "bg-rose-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
          {strikes >= 3 ? "DISQUALIFIED" : "PROCTOR LOCKED"}
        </span>
        <span className="text-slate-400">Gaze: {gaze}% Center</span>
      </div>
      <div className="flex items-end gap-[2.5px] h-10 bg-slate-900/80 rounded-xl border border-slate-800 px-3 justify-center">
        {[4, 8, 12, 6, 14, 10, 8, 15, 7, 11, 5, 9, 13, 6, 10].map((h, i) => (
          <div key={i} className={`w-[3px] rounded-full transition-all ${strikes >= 3 ? "bg-rose-400" : "bg-emerald-400"}`}
            style={{ height: `${h * 1.8}px`, opacity: strikes >= 3 ? 0.4 : 1 }} />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>Look-away strikes:</span>
        <span className={`font-black ${strikes >= 3 ? "text-rose-400" : strikes > 0 ? "text-amber-400" : "text-emerald-400"}`}>{strikes}/3</span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={addStrike} disabled={strikes >= 3}
          className="flex-1 py-1 rounded-lg bg-rose-600/30 border border-rose-500/30 text-rose-300 text-[10px] font-bold hover:bg-rose-600/50 disabled:opacity-40 transition-all">
          Look Away (click)
        </button>
        <button onClick={reset} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold hover:bg-slate-700 transition-all">Reset</button>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [demoTicker, setDemoTicker] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDemoTicker((p) => (p + 1) % PLATFORM_STATS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">

        {/* Hiring Strip */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 py-2.5 shadow-xl">
          <div className="flex items-center gap-0">
            <div className="flex-shrink-0 flex items-center gap-2 pl-4 pr-5 border-r border-slate-800 mr-4">
              <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-mono font-black text-amber-400 uppercase tracking-wider whitespace-nowrap">Live Drives</span>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none flex-1 pb-0.5">
              {[...HIRING_SPRINTS, ...HIRING_SPRINTS].map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-1 text-[11px] font-mono whitespace-nowrap flex-shrink-0 hover:border-slate-700 transition-colors">
                  <span className={`font-black ${item.color}`}>{item.company}</span>
                  <span className="text-slate-400">{item.role}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">{item.ctc}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.hot ? "bg-rose-500/15 text-rose-300 border-rose-500/25 animate-pulse" : "bg-slate-800/80 text-slate-400 border-slate-700"}`}>
                    {item.hot ? "? " : ""}{item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asymmetric Hero */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/60 shadow-2xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left */}
            <div className="lg:col-span-6 flex flex-col justify-center p-10 space-y-7">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>AI-Driven Placement Acceleration</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-[1.05]">
                  Master
                  <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Tier-1 Cutoffs
                  </span>
                  <span className="block text-4xl sm:text-5xl text-slate-200 font-extrabold mt-1">&amp; Land Your Dream Role</span>
                </h1>
                <p className="text-slate-400 text-base max-w-lg leading-relaxed">
                  Dynamic ATS calibration, timed OA simulators with gaze tracking, and AI voice mock interviews  -  all in one platform.
                </p>
              </div>
              {/* Stats Ticker */}
              <div className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md max-w-sm">
                {PLATFORM_STATS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className={`flex-1 text-center transition-all duration-500 ${i === demoTicker ? "opacity-100 scale-105" : "opacity-35"}`}>
                      <Icon className={`h-4 w-4 mx-auto mb-0.5 ${s.color}`} />
                      <div className="text-sm font-black text-white font-mono">{s.value}</div>
                      <div className="text-[9px] text-slate-400 font-mono uppercase leading-tight">{s.label}</div>
                    </div>
                  );
                })}
              </div>
              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/resume-helper"
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]">
                  <FileText className="h-4 w-4" />
                  <span>Scan Your Resume</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/oa-rounds"
                  className="flex items-center gap-2.5 rounded-2xl bg-slate-900 border border-cyan-500/30 px-7 py-3.5 text-sm font-semibold text-cyan-300 hover:bg-slate-800 hover:border-cyan-400/50 transition-all shadow-md">
                  <Code2 className="h-4 w-4 text-cyan-400" /><span>Practice OA</span>
                </Link>
                <Link href="/ai-interviewer"
                  className="flex items-center gap-2.5 rounded-2xl bg-slate-900 border border-emerald-500/30 px-7 py-3.5 text-sm font-semibold text-emerald-300 hover:bg-slate-800 hover:border-emerald-400/50 transition-all shadow-md">
                  <Video className="h-4 w-4 text-emerald-400" /><span>AI Interview</span>
                </Link>
              </div>
            </div>
            {/* Right — Platform Social Proof & Auth */}
            <div className="lg:col-span-6 flex flex-col lg:border-l border-slate-800/60">
              <div className="flex-1 p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" /> Why PlacementBuddy
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Trusted by 50,000+ engineering students</p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: BadgeCheck, color: "text-indigo-400", bg: "bg-indigo-500/10", title: "Real ATS Scoring", desc: "Upload your actual PDF — scores are computed from your real resume text, zero simulation." },
                    { icon: Code2, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "Company OA Arena", desc: "Timed tests for Google, Amazon, TCS & more — live AI webcam proctoring included." },
                    { icon: Video, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Voice AI Interviews", desc: "Real-time voice HR mock interviews with feedback on clarity, structure and confidence." },
                    { icon: Users, color: "text-amber-400", bg: "bg-amber-500/10", title: "3,100+ Tier-1 Offers", desc: "Students who used PlacementBuddy landed roles at Google, Microsoft, Razorpay & more." },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5 hover:border-slate-700 transition-colors">
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                          <Icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.title}</p>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-slate-800/60 px-8 py-4 bg-slate-950/40">
                {session ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-slate-300 font-semibold font-mono truncate max-w-[180px]">{session.user?.name}</span>
                    </div>
                    <button onClick={() => signOut()} className="text-[11px] font-mono text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button onClick={() => signIn("google")} className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-slate-100 shadow-lg transition-all">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Sign in with Google to unlock all modules</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards - Asymmetric grid */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
                3 Core Modules
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Platform in Action</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block text-right max-w-[200px] leading-relaxed">
              Interactive live demos  -  not just screenshots
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ATS Wide Card */}
            <div className="lg:col-span-7 rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-indigo-950/30 p-7 shadow-xl backdrop-blur-xl hover:border-indigo-500/50 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">MODULE 01 | DYNAMIC ATS</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Resume ATS Helper</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed mt-1">
                    Same resume  -  wildly different scores per company tier. Google XYZ metric penalties for Tier 1, leniency bonuses for Tier 3.
                  </p>
                </div>
                <ATSDemoCard />
                <Link href="/resume-helper" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-1 transition-colors">
                  <span>Upload &amp; Scan Full Resume</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* OA + Interview Stacked */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-cyan-950/30 p-6 shadow-xl backdrop-blur-xl hover:border-cyan-500/50 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400"><Code2 className="h-4 w-4" /></div>
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">MODULE 02 | OA ARENA</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Timed OA Test Simulator</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Multi-tier timed tests (Google, Amazon, TCS) with live proctor camera + code verification.</p>
                  <CodeDemoCard />
                  <Link href="/oa-rounds" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                    <span>Launch OA Arena</span><ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-emerald-950/30 p-6 shadow-xl backdrop-blur-xl hover:border-emerald-500/50 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400"><Video className="h-4 w-4" /></div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">MODULE 03 | AI PROCTOR</span>
                  </div>
                  <h3 className="text-base font-bold text-white">AI Movement Tracking Proctor</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Real-time gaze + head-movement tracking. Look away 3x = disqualified.</p>
                  <ProctorDemoCard />
                  <Link href="/ai-interviewer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                    <span>Start AI Interview</span><ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tier Ecosystem  -  Connected cards */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 to-slate-950 p-8 shadow-xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-24 h-64 w-64 rounded-full bg-violet-500/6 blur-[80px]" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Recruitment Tier Ecosystem</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Tier Breakdown &amp; CTC Packages</h2>
                <p className="text-xs text-slate-400 mt-1">PlacementBuddy calibrates your score to unlock the companies you qualify for.</p>
              </div>
              <Link href="/resume-helper"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors font-mono self-start">
                <span>Test Eligibility</span><ChevronRight className="h-4 w-4 text-indigo-400" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-slate-800">
              {[
                { tier: "Tier 1", sub: "Product Giants & Elite", range: "18-45+ LPA", req: "ATS = 82%", badge: "ELITE", badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30", divider: "md:border-r border-slate-800", companies: ["Google", "Microsoft", "Amazon", "Uber", "Atlassian", "Meta"], accentBg: "bg-indigo-500/5" },
                { tier: "Tier 2", sub: "Unicorns & FinTech", range: "9-18 LPA", req: "ATS = 68%", badge: "HIGH GROWTH", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", divider: "md:border-r border-slate-800", companies: ["Barclays", "Razorpay", "Swiggy", "Zomato", "Flipkart", "PhonePe"], accentBg: "bg-cyan-500/5" },
                { tier: "Tier 3", sub: "IT Services & Consulting", range: "4-8 LPA", req: "ATS = 45%", badge: "MASS HIRING", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", divider: "", companies: ["TCS Ninja/Digital", "Infosys SP", "Wipro", "Accenture", "Cognizant"], accentBg: "bg-emerald-500/5" },
              ].map((t) => (
                <div key={t.tier} className={`${t.accentBg} ${t.divider} p-6 space-y-4 hover:bg-slate-900/40 transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${t.badgeColor}`}>{t.badge}</span>
                      <h3 className="text-base font-bold text-white mt-2">{t.tier}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{t.sub}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-emerald-400 font-mono">{t.range}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{t.req}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.companies.map((c) => (
                      <span key={c} className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-slate-700 transition-colors">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

