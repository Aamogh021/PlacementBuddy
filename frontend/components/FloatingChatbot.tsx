"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  FileText,
  Video,
  Code2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  actions?: { label: string; href: string; icon: string }[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  "How does ATS score change between Google & TCS?",
  "How to convert project bullets to Google XYZ format?",
  "What is tested in Amazon SDE 1 OA?",
  "How does candidate movement tracking work?",
];

const PRE_SEEDED_ANSWERS: Record<string, { text: string; actions?: { label: string; href: string; icon: string }[] }> = {
  "google vs tcs": {
    text: "Here is how our ATS system benchmarks your profile:\n\n• **Google / Tier 1 (FAANG)**: Applies strict algorithmic and impact-metric filtering (Google XYZ formula). Missing quantified business impact (-11 to -14 pts penalty) drops average resumes into the 60s.\n\n• **TCS / Tier 3 (IT Services)**: Focuses on foundational CS concepts (DBMS, OOP, Java/Python, degree qualification). Leniency is higher (+10 pts bonus), so the same resume easily scores 80–85%+!",
    actions: [{ label: "Open Resume ATS Scorer", href: "/resume-helper", icon: "FileText" }],
  },
  "xyz format": {
    text: "Google XYZ Formula: **Accomplished [X] as measured by [Y], by doing [Z]**.\n\n❌ *Before*: 'Worked on backend APIs and connected frontend to database.'\n\n✅ *After*: 'Architected 14+ RESTful microservices in Node.js and PostgreSQL, cutting API response latency by 38% for 10,000+ daily peak users.'\n\nUse our AI Bullet Rewriter on the Resume Helper page to get instant rewrites for all your bullets!",
    actions: [{ label: "Rewrite Resume Bullets", href: "/resume-helper", icon: "Zap" }],
  },
  "amazon": {
    text: "Amazon SDE 1 OA typically has 2 parts:\n1. **Coding Assessment (70 mins)**: 2 questions on Two Pointers, Sliding Window, Monotonic Stack, or Heap Priority Queue.\n2. **Work Simulation & Leadership Principles**: Customer Obsession, Ownership, Bias for Action, and Disagree & Commit.\n\nYou can take the full timed simulation in our OA Arena!",
    actions: [{ label: "Launch Amazon OA Test", href: "/oa-rounds", icon: "Code2" }],
  },
  "proctor": {
    text: "Our assessment system features real-time **AI Proctor Movement Tracking**:\n\n• Uses candidate webcam to track face position, head rotation, and eye-gaze centroid.\n• If candidate looks away (e.g. looking left/right or down at a phone), a warning alert sounds with strike counters (1 of 3).\n• If candidate persists looking away for >4 seconds or accumulates 3 strikes, the session is immediately **Disqualified** to ensure exam integrity.",
    actions: [{ label: "Try AI Voice Interviewer", href: "/ai-interviewer", icon: "Video" }],
  },
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi! I'm your **PlacementBuddy AI Copilot**. Ask me anything about ATS resume scores, company tiers, OA coding questions, or live AI mock interviews!",
      timestamp: "Just now",
      actions: [
        { label: "Resume ATS Scorer", href: "/resume-helper", icon: "FileText" },
        { label: "Timed OA Arena", href: "/oa-rounds", icon: "Code2" },
        { label: "AI Voice Interview", href: "/ai-interviewer", icon: "Video" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const qLower = q.toLowerCase();
      let botResponse: {
        text: string;
        actions?: { label: string; href: string; icon: string }[];
      } = {
        text: `Great question regarding placement preparation! To maximize your hiring probability for this topic, I recommend practicing our targeted modules:`,
        actions: [
          { label: "Check Resume ATS Score", href: "/resume-helper", icon: "FileText" },
          { label: "Practice OA Rounds", href: "/oa-rounds", icon: "Code2" },
        ],
      };

      if (qLower.includes("google") || qLower.includes("tcs") || qLower.includes("score") || qLower.includes("ats")) {
        botResponse = PRE_SEEDED_ANSWERS["google vs tcs"];
      } else if (qLower.includes("bullet") || qLower.includes("xyz") || qLower.includes("metric") || qLower.includes("rewrite")) {
        botResponse = PRE_SEEDED_ANSWERS["xyz format"];
      } else if (qLower.includes("amazon") || qLower.includes("oa") || qLower.includes("test")) {
        botResponse = PRE_SEEDED_ANSWERS["amazon"];
      } else if (qLower.includes("proctor") || qLower.includes("track") || qLower.includes("camera") || qLower.includes("away") || qLower.includes("disqualif")) {
        botResponse = PRE_SEEDED_ANSWERS["proctor"];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: botResponse.text,
          actions: botResponse.actions,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* ── Floating Bar / Pill when Collapsed ───────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-40 transition-all duration-300">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-indigo-500/40 bg-slate-900/90 pl-3.5 pr-5 py-2.5 shadow-2xl backdrop-blur-xl hover:border-cyan-400/60 hover:bg-slate-900 transition-all hover:scale-105 active:scale-95"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md">
              <Bot className="h-4.5 w-4.5" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>
            <div className="text-left font-sans">
              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <span>Placement AI Buddy</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  Online
                </span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block truncate max-w-[200px]">
                Ask anything: ATS scores, OA tests...
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* ── Expanded Floating Chat Window ───────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl border border-indigo-500/40 bg-slate-950/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md">
                <Bot className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  PlacementBuddy Copilot
                </h4>
                <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Real-time Placement Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome-reset",
                      sender: "bot",
                      text: "Chat cleared! How can I help you ace your placement prep today?",
                      timestamp: "Just now",
                    },
                  ])
                }
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear chat history"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimize chat"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="text-[10px] font-mono whitespace-nowrap bg-slate-950 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 px-2.5 py-1 rounded-full transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-md ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Actions / Deep Links */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {m.actions.map((act) => (
                        <Link
                          key={act.label}
                          href={act.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold font-mono text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 w-24">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about ATS, company cutoffs, OA code..."
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
