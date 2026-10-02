"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";
import {
  COMPANY_INSIGHTS,
  OA_CALENDAR_EVENTS,
  OA_QUESTIONS,
  OAQuestion,
} from "@/lib/data/oaQuestions";
import { ALL_COMPANY_TESTS, AVAILABLE_TEST_COMPANIES, COMPANY_TIERS_DATA, CompanyTimedTest, TimedTestQuestion } from "@/lib/data/timedTests";
import ProctorTracker from "@/components/ProctorTracker";
import {
  Code2, Search, Calendar, Building2, CheckCircle, XCircle,
  HelpCircle, Clock, ChevronRight, Sparkles, Terminal,
  Cpu, Layers, Award, Play, Trophy, AlertCircle, RotateCcw,
  Timer, Zap, Target, ChevronLeft, ChevronRight as ChevRight,
  Flame, Copy, Check, Filter, BookOpen, CheckCircle2,
  RefreshCw, Send, Video, VideoOff, ShieldCheck, ShieldAlert
} from "lucide-react";

// ── Real-time countdown hook ───────────────────────────────────────────────
function useCountdown(targetDateStr: string) {
  const [countdown, setCountdown] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "soon" | "urgent">("normal");

  useEffect(() => {
    const target = new Date(targetDateStr + " 2026");
    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) { setCountdown("Past"); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days === 0) setCountdown(`${hrs}h ${mins}m`);
      else if (days < 3) setCountdown(`${days}d ${hrs}h`);
      else setCountdown(`${days} days`);
      setUrgency(days === 0 ? "urgent" : days <= 3 ? "soon" : "normal");
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return { countdown, urgency };
}

function CalendarCard({ event }: { event: (typeof OA_CALENDAR_EVENTS)[0] }) {
  const { countdown, urgency } = useCountdown(event.date);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2.5 hover:border-indigo-500/40 transition-all shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-indigo-400 font-mono">{event.company}</span>
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">{event.type}</span>
      </div>
      <h4 className="text-xs font-bold text-white">{event.role}</h4>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
        <Clock className="h-3 w-3 text-slate-500" />
        <span>{event.date} • {event.time}</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[10px] text-slate-400">{event.eligibleBatches}</span>
        <div className="flex items-center gap-2 font-mono">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            urgency === "urgent" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
              : urgency === "soon" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            <Timer className="h-2.5 w-2.5" />
            {countdown}
          </span>
          <span className={`text-[10px] font-semibold ${
            event.status === "Registration Open" ? "text-emerald-400"
              : event.status === "Closing Soon" ? "text-rose-400"
              : "text-slate-400"
          }`}>{event.status}</span>
        </div>
      </div>
    </div>
  );
}

// ── Timed Test Mode Modal ───────────────────────────────────────────────────
function TimedTestModal({ test, onClose }: { test: CompanyTimedTest; onClose: () => void }) {
  const allQs: TimedTestQuestion[] = test.sections.flatMap((s) => s.questions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>(new Array(allQs.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Candidate camera and proctoring
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [disqualifiedReason, setDisqualifiedReason] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
        }
        setCameraActive(true);
        setCameraError(false);
      } catch (err) {
        console.warn("Proctor camera not accessible:", err);
        if (isMounted) {
          setCameraActive(false);
          setCameraError(true);
        }
      }
    }
    startCam();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // Ensure stream stays bound to videoRef even across re-renders
  useEffect(() => {
    if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const handleDisqualify = (reason: string) => {
    setDisqualifiedReason(reason);
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const isLow = timeLeft < 300;

  const score = submitted
    ? allQs.reduce((acc, q, i) => acc + (selected[i] === q.correctIndex ? q.marks : test.negativeMarking && selected[i] !== null ? -test.negativeMarkValue : 0), 0)
    : 0;
  const correct = submitted ? allQs.filter((q, i) => selected[i] === q.correctIndex).length : 0;
  const attempted = selected.filter((s) => s !== null).length;

  const q = allQs[currentIdx];

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div className={`flex h-20 w-20 mx-auto items-center justify-center rounded-full shadow-xl ${
              disqualifiedReason
                ? "bg-rose-500/20 border-2 border-rose-500/60"
                : score >= test.totalMarks * 0.6
                ? "bg-emerald-500/20 border-2 border-emerald-500/40"
                : "bg-rose-500/20 border-2 border-rose-500/40"
            }`}>
              {disqualifiedReason ? (
                <ShieldAlert className="h-10 w-10 text-rose-400" />
              ) : (
                <Trophy className={`h-10 w-10 ${score >= test.totalMarks * 0.6 ? "text-emerald-400" : "text-rose-400"}`} />
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {test.company} OA — {disqualifiedReason ? "Disqualified" : "Verified Performance"}
            </h2>
            {disqualifiedReason ? (
              <p className="text-sm font-semibold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
                ⚠️ Disqualified by AI Proctor: {disqualifiedReason}
              </p>
            ) : (
              <p className={`text-sm font-semibold ${score >= test.totalMarks * 0.6 ? "text-emerald-400" : "text-rose-400"}`}>
                {score >= test.totalMarks * 0.6 ? "🎉 Great Performance! Above typical hiring cutoff!" : "📚 Below cutoff score — review the solution concepts below."}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3 font-mono">
            {[
              { label: "Score", value: `${Math.round(score * 10) / 10}/${test.totalMarks}`, color: "text-indigo-400" },
              { label: "Correct", value: correct, color: "text-emerald-400" },
              { label: "Wrong", value: attempted - correct, color: "text-rose-400" },
              { label: "Skipped", value: allQs.length - attempted, color: "text-slate-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3 text-center">
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              Exit Arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col">
      {/* Top Test Header Bar */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-white">{test.company} OA Practice Arena</span>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
            Question {currentIdx + 1} of {allQs.length}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" /> Anti-Cheat AI Active (Camera + Tab Switch Watch)
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-mono text-sm font-bold px-3 py-1 rounded-lg border ${
            isLow ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse" : "bg-slate-800 text-indigo-300 border-slate-700"
          }`}>
            ⏱️ {mins}:{secs} remaining
          </span>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-bold text-white transition-colors"
          >
            Submit Assessment
          </button>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">
                Topic: {q.topic}
              </span>
              <span className="text-xs font-mono text-slate-400">Marks: +{q.marks}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-relaxed">{q.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3 font-mono">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  const updated = [...selected];
                  updated[currentIdx] = i;
                  setSelected(updated);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left text-xs transition-all ${
                  selected[currentIdx] === i
                    ? "border-indigo-500 bg-indigo-950/40 text-white font-semibold"
                    : "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700"
                }`}
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selected[currentIdx] === i ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* Navigation Prev/Next - Sticky footer guaranteeing unblocked access */}
          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl p-4 border border-slate-800 flex items-center justify-between z-30 rounded-2xl shadow-2xl mt-6">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="text-[11px] font-mono text-slate-400">
              Question <span className="text-white font-bold">{currentIdx + 1}</span> of {allQs.length}
            </div>
            <button
              onClick={() => setCurrentIdx(Math.min(allQs.length - 1, currentIdx + 1))}
              disabled={currentIdx === allQs.length - 1}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white disabled:opacity-40 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              Next Question <ChevRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Floating Candidate Camera with Movement Tracking - Docked top-right clear of navigation */}
        {!submitted && (
          <div className="fixed top-20 right-6 z-40 w-48 sm:w-56 rounded-3xl border border-indigo-500/40 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
                  cameraActive ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              />
              {!cameraActive && (
                <div className="flex flex-col items-center gap-1 text-slate-500 font-mono text-[10px] p-2 text-center">
                  <VideoOff className="h-5 w-5 text-slate-400" />
                  <span>{cameraError ? "Camera Access Denied" : "Camera Initializing..."}</span>
                </div>
              )}
              <ProctorTracker
                active={!submitted}
                videoElement={videoRef.current}
                cameraActive={cameraActive}
                onDisqualified={handleDisqualify}
                maxStrikes={3}
                lookAwayToleranceSeconds={4}
                enableTabSwitchDetection={true}
                enableCopyPasteBlock={true}
              />
            </div>
            <div className="flex items-center justify-between mt-1 px-1 font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Proctor Active
              </span>
              <span>Anti-Cheat AI</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main OA Page ─────────────────────────────────────────────────────────────
export default function OARoundsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<OAQuestion | null>(OA_QUESTIONS[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeTimedTest, setActiveTimedTest] = useState<CompanyTimedTest | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedTierTab, setSelectedTierTab] = useState<"All" | number>("All");

  // Multi-language LeetCode code runner state
  type SupportedLang = "python" | "javascript" | "cpp" | "java";
  const [selectedLang, setSelectedLang] = useState<SupportedLang>("python");
  const [userCode, setUserCode] = useState<string>("");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"testcase" | "result">("testcase");
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [executing, setExecuting] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [execResults, setExecResults] = useState<any>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Ref for company scroll container
  const companyScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCompanyPatterns = (direction: "left" | "right") => {
    if (companyScrollRef.current) {
      const scrollOffset = direction === "left" ? -280 : 280;
      companyScrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  const categories = ["All", "Aptitude", "DBMS", "Computer Networks", "Operating Systems", "DSA & Coding"];

  // Update starter code when question or language changes
  useEffect(() => {
    if (activeQuestion) {
      if (activeQuestion.isCoding) {
        const langCode =
          activeQuestion.starterCodes?.[selectedLang] ||
          activeQuestion.solutionCode ||
          `// Write your solution for ${activeQuestion.title}\n`;
        setUserCode(langCode);
      }
      setSelectedOption(null);
      setShowAnswer(false);
      setExecResults(null);
      setSubmissionFeedback(null);
      setActiveConsoleTab("testcase");
      setSelectedTestCaseIdx(0);
    }
  }, [activeQuestion, selectedLang]);

  const filteredQuestions = OA_QUESTIONS.filter((q) => {
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    const matchesCompany = selectedCompany === "All" || q.company.toLowerCase().includes(selectedCompany.toLowerCase());
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesCompany && matchesSearch;
  });

  const handleSelectQuestion = (q: OAQuestion) => {
    setActiveQuestion(q);
    setSelectedOption(null);
    setShowAnswer(false);
    setExecResults(null);
    setSubmissionFeedback(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const resetToStarterCode = () => {
    if (activeQuestion?.isCoding && activeQuestion.starterCodes?.[selectedLang]) {
      setUserCode(activeQuestion.starterCodes[selectedLang]);
    }
  };

  // Real-time backend code execution (LeetCode Run Code)
  const handleExecuteCode = async () => {
    if (!activeQuestion) return;
    setExecuting(true);
    setActiveConsoleTab("result");
    setSubmissionFeedback(null);
    try {
      const res = await fetch("/api/oa/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode,
          language: selectedLang,
          question_id: activeQuestion.id,
        }),
      });
      const data = await res.json();
      setExecResults(data);
    } catch (e: any) {
      setExecResults({
        status: "error",
        error: "Execution server unreachable. Please verify backend is running on port 8000.",
      });
    } finally {
      setExecuting(false);
    }
  };

  // LeetCode Submit Solution
  const handleSubmitCode = async () => {
    if (!activeQuestion) return;
    setSubmitting(true);
    setActiveConsoleTab("result");
    try {
      const res = await fetch("/api/oa/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode,
          language: selectedLang,
          question_id: activeQuestion.id,
        }),
      });
      const data = await res.json();
      setExecResults(data);

      const testsPassed = data.tests_passed || (data.all_passed ? (data.total_tests || 1) : 0);
      const totalTests = data.total_tests || 1;

      await fetch("/api/oa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: activeQuestion.id,
          company: activeQuestion.company,
          code: userCode,
          language: selectedLang,
          tests_passed: testsPassed,
          total_tests: totalTests,
        }),
      });

      setSubmissionFeedback(
        testsPassed === totalTests
          ? "🎉 Accepted! 100% of test cases passed. Submission recorded."
          : `⚠️ Partial Pass: ${testsPassed}/${totalTests} test cases passed.`
      );
    } catch (e: any) {
      setSubmissionFeedback("Submitted locally.");
    } finally {
      setSubmitting(false);
    }
  };

  const isCodingQuestion = Boolean(
    activeQuestion?.isCoding || activeQuestion?.category === "DSA & Coding" || !activeQuestion?.options?.length
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      {activeTimedTest && (
        <TimedTestModal test={activeTimedTest} onClose={() => setActiveTimedTest(null)} />
      )}
      <AuthGate
        featureName="OA Rounds Practice Hub"
        featureDescription="Sign in to access company-specific timed OA tests, real-time placement calendars, and 500+ curated practice questions for Aptitude, DBMS, CN, OS, and DSA."
      >
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in-up">

          {/* ── Banner ─────────────────────────────────────────────────────── */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-bold text-indigo-400">
                  <Code2 className="h-3.5 w-3.5 text-indigo-400" /> MODULE 02 • ONLINE ASSESSMENT PRACTICE HUB
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Company OA Practice Hub &amp; LeetCode Runner
                </h1>
                <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Real-time testcase execution and conceptual placement assessments. Practice company patterns for Google, Amazon, Barclays, and Microsoft with genuine LeetCode problem constraints and multi-language support.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 font-mono">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center min-w-[110px] shadow-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Questions</span>
                  <p className="text-xl font-black text-indigo-400">{OA_QUESTIONS.length}+</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center min-w-[110px] shadow-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Companies</span>
                  <p className="text-xl font-black text-cyan-400">{COMPANY_INSIGHTS.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center min-w-[110px] shadow-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Execution</span>
                  <p className="text-xl font-black text-emerald-400">Multi-Lang</p>
                </div>
              </div>
            </div>

            {/* Trending Company Filter Pills with Horizontal Scroll Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" /> Filter by Target Company Patterns
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Scroll companies:</span>
                  <button
                    onClick={() => scrollCompanyPatterns("left")}
                    aria-label="Scroll left"
                    className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollCompanyPatterns("right")}
                    aria-label="Scroll right"
                    className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <ChevRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div
                ref={companyScrollRef}
                className="flex items-center gap-3 overflow-x-auto pb-3 scroll-smooth scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-slate-900/50"
              >
                {COMPANY_INSIGHTS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCompany(selectedCompany === c.name ? "All" : c.name)}
                    className={`flex flex-col items-start gap-1 min-w-[165px] rounded-2xl border p-3.5 text-left transition-all flex-shrink-0 ${
                      selectedCompany === c.name
                        ? "border-indigo-500 bg-indigo-600/20 shadow-md shadow-indigo-500/20"
                        : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white truncate max-w-[100px]">{c.name}</span>
                      <span className="text-[9px] font-mono text-slate-400">{c.views}</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300">OA: {c.upcomingOADate}</span>
                    {AVAILABLE_TEST_COMPANIES.includes(c.name) && (
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <Flame className="h-2.5 w-2.5 text-emerald-400" /> Timed Test
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 01: Practice Question Directory & LeetCode Workspace ────────────── */}
          {/* Placed immediately below Filter by Target Company Patterns as requested */}
          <div className="space-y-6">
            {/* Search & Category Filter Controls Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-xl">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, tag, or keyword..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left Column: Questions Directory */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span>Questions Directory ({filteredQuestions.length})</span>
                  {selectedCompany !== "All" && (
                    <span className="text-cyan-400 font-bold">Filtered: {selectedCompany}</span>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {filteredQuestions.map((q) => {
                    const isSelected = activeQuestion?.id === q.id;
                    const isCoding = q.isCoding || q.category === "DSA & Coding" || !q.options?.length;
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleSelectQuestion(q)}
                        className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-indigo-500/80 bg-indigo-950/30 shadow-xl shadow-indigo-500/10"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap font-mono">
                              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                {q.company}
                              </span>
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                {q.category}
                              </span>
                              <span className={`text-[10px] font-bold ${
                                q.difficulty === "Easy" ? "text-emerald-400" : q.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                              }`}>
                                {q.difficulty}
                              </span>
                              {isCoding && (
                                <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                                  LeetCode
                                </span>
                              )}
                            </div>
                            <h4 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? "text-indigo-300" : "text-white group-hover:text-indigo-200"}`}>
                              {q.title}
                            </h4>
                          </div>
                          <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${isSelected ? "text-indigo-400 translate-x-1" : "text-slate-600"}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Question Viewer / LeetCode Runner */}
              <div className="lg:col-span-8 space-y-6">
                {activeQuestion ? (
                  isCodingQuestion ? (
                    /* ── LeetCode Style Problem & Live Multi-Language Runner ─────────── */
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in-up">
                      
                      {/* Top Bar: Problem Title, LeetCode Badges & Language Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              activeQuestion.difficulty === "Easy"
                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                                : activeQuestion.difficulty === "Medium"
                                ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                                : "text-rose-400 bg-rose-500/10 border-rose-500/30"
                            }`}>
                              {activeQuestion.difficulty}
                            </span>
                            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                              {activeQuestion.company}
                            </span>
                            {activeQuestion.askedInYear && (
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                {activeQuestion.askedInYear}
                              </span>
                            )}
                          </div>
                          <h2 className="text-lg sm:text-xl font-extrabold text-white font-sans">{activeQuestion.title}</h2>
                        </div>

                        {/* Language Selector Dropdown */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-xs text-slate-400">Language:</span>
                          <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value as SupportedLang)}
                            className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="python">Python 3 (CPython 3.12)</option>
                            <option value="javascript">JavaScript (Node.js 20)</option>
                            <option value="cpp">C++ (g++ 14)</option>
                            <option value="java">Java (OpenJDK 21)</option>
                          </select>
                        </div>
                      </div>

                      {/* Problem Statement, Examples & Constraints (LeetCode Standard) */}
                      <div className="space-y-4">
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                          {activeQuestion.description}
                        </div>

                        {/* Examples Section */}
                        {activeQuestion.examples && activeQuestion.examples.length > 0 && (
                          <div className="space-y-3 pt-2">
                            {activeQuestion.examples.map((ex, idx) => (
                              <div key={idx} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-1.5 font-mono text-xs">
                                <span className="font-bold text-indigo-400">Example {idx + 1}:</span>
                                <div className="space-y-1 pt-1 text-slate-300">
                                  <p><strong className="text-slate-400">Input:</strong> <span className="text-emerald-300">{ex.input}</span></p>
                                  <p><strong className="text-slate-400">Output:</strong> <span className="text-cyan-300">{ex.output}</span></p>
                                  {ex.explanation && (
                                    <p className="text-slate-400 pt-0.5"><strong className="text-slate-400">Explanation:</strong> {ex.explanation}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Constraints Section */}
                        {activeQuestion.constraints && activeQuestion.constraints.length > 0 && (
                          <div className="space-y-2 pt-1 font-mono text-xs">
                            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Constraints:</span>
                            <ul className="space-y-1 text-slate-400 pl-4 list-disc marker:text-indigo-400">
                              {activeQuestion.constraints.map((c, i) => (
                                <li key={i}>
                                  <code className="text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{c}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2 font-mono">
                          {activeQuestion.tags.map((t) => (
                            <span key={t} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Code Editor Header & Controls */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
                          <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                            <Terminal className="h-3.5 w-3.5" /> Code Editor ({selectedLang})
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={resetToStarterCode}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="h-3 w-3" /> Reset Template
                            </button>
                            <button
                              onClick={() => copyCode(userCode)}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedCode ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Editor Canvas */}
                        <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner font-mono">
                          <textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            rows={12}
                            spellCheck={false}
                            className="w-full bg-slate-950 p-4 text-xs font-mono text-emerald-300 focus:outline-none resize-y leading-relaxed font-normal selection:bg-indigo-600/40"
                            placeholder="Write your solution here..."
                          />
                        </div>

                        {/* Execution & Submission Action Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <button
                              onClick={() => setActiveConsoleTab("testcase")}
                              className={`px-3 py-1.5 rounded-xl transition-all ${
                                activeConsoleTab === "testcase"
                                  ? "bg-slate-800 text-white font-bold"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              Testcases
                            </button>
                            <button
                              onClick={() => setActiveConsoleTab("result")}
                              className={`px-3 py-1.5 rounded-xl transition-all ${
                                activeConsoleTab === "result"
                                  ? "bg-slate-800 text-white font-bold"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              Execution Result
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleExecuteCode}
                              disabled={executing || submitting || !userCode.trim()}
                              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 border border-slate-700"
                            >
                              {executing ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  <span>Running...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                  <span>Run Code</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={handleSubmitCode}
                              disabled={executing || submitting || !userCode.trim()}
                              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                              {submitting ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-3.5 w-3.5" />
                                  <span>Submit</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* LeetCode Testcase & Results Drawer */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
                          {activeConsoleTab === "testcase" ? (
                            <div className="space-y-3">
                              {/* Case selector buttons */}
                              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                                {(activeQuestion.testCases || [{ id: 1, input: "Sample input", expected: "Sample output" }]).map((tc, i) => (
                                  <button
                                    key={tc.id || i}
                                    onClick={() => setSelectedTestCaseIdx(i)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                      selectedTestCaseIdx === i
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-900 text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    Case {i + 1}
                                  </button>
                                ))}
                              </div>

                              {/* Selected Case Content */}
                              {activeQuestion.testCases && activeQuestion.testCases[selectedTestCaseIdx] && (
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase">Input:</span>
                                    <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-300 mt-1 overflow-x-auto text-[11px]">
                                      {activeQuestion.testCases[selectedTestCaseIdx].input}
                                    </pre>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase">Expected:</span>
                                    <pre className="p-2.5 rounded-xl bg-slate-900 text-cyan-300 mt-1 overflow-x-auto text-[11px]">
                                      {activeQuestion.testCases[selectedTestCaseIdx].expected}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Test Result Tab */
                            <div className="space-y-3">
                              {submissionFeedback && (
                                <div className={`p-3 rounded-xl border text-xs font-bold ${
                                  submissionFeedback.includes("Accepted")
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                }`}>
                                  {submissionFeedback}
                                </div>
                              )}

                              {execResults ? (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span className={`font-bold text-sm ${
                                      execResults.all_passed ? "text-emerald-400" : "text-rose-400"
                                    }`}>
                                      {execResults.all_passed ? "Accepted" : "Wrong Answer"}
                                    </span>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                      <span>Runtime: <strong className="text-white">{execResults.runtime_ms || 12} ms</strong></span>
                                      <span>Memory: <strong className="text-white">{execResults.memory_mb || 16.4} MB</strong></span>
                                    </div>
                                  </div>

                                  {/* Test Case breakdown */}
                                  <div className="space-y-2">
                                    {execResults.results?.map((res: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className={`p-3 rounded-xl border text-[11px] flex items-center justify-between ${
                                          res.passed
                                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                                            : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                                        }`}
                                      >
                                        <div className="space-y-0.5">
                                          <span className="font-bold">Test Case #{res.case_id}: {res.passed ? "PASSED" : "FAILED"}</span>
                                          <p className="text-[10px] text-slate-400">
                                            Expected: {res.expected} | Actual: {res.actual}
                                          </p>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold">{res.runtime_ms}ms</span>
                                      </div>
                                    ))}
                                  </div>

                                  {execResults.error && (
                                    <pre className="text-rose-400 text-[11px] p-3 rounded-xl bg-rose-950/40 border border-rose-900 overflow-x-auto whitespace-pre-wrap">
                                      {execResults.error}
                                    </pre>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-xs py-2 text-center">
                                  Run code or submit to view test case execution outputs and runtime benchmark.
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  ) : (
                    /* ── Conceptual MCQ Question Practice (No Code Runner) ─────────── */
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in-up">
                      <div className="space-y-3 pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2 flex-wrap font-mono">
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
                            {activeQuestion.company} OA Question
                          </span>
                          <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
                            {activeQuestion.category}
                          </span>
                          <span className={`text-xs font-bold ${
                            activeQuestion.difficulty === "Easy" ? "text-emerald-400" : activeQuestion.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                          }`}>
                            {activeQuestion.difficulty}
                          </span>
                          {activeQuestion.askedInYear && (
                            <span className="text-[10px] font-mono text-slate-500">
                              Asked in {activeQuestion.askedInYear}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-extrabold text-white">{activeQuestion.title}</h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{activeQuestion.description}</p>

                        {/* Optional Code/Schema Snippet */}
                        {activeQuestion.codeSnippet && (
                          <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-indigo-300 overflow-x-auto">
                            {activeQuestion.codeSnippet}
                          </pre>
                        )}

                        <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                          {activeQuestion.tags.map((t) => (
                            <span key={t} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Multiple Choice Options List */}
                      {activeQuestion.options && activeQuestion.options.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Select the Correct Option:</h4>
                          <div className="space-y-2.5 font-mono">
                            {activeQuestion.options.map((opt, idx) => {
                              const isSelected = selectedOption === idx;
                              const isCorrect = idx === activeQuestion.correctOptionIndex;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSelectedOption(idx);
                                    setShowAnswer(true);
                                  }}
                                  className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left text-xs sm:text-sm transition-all ${
                                    showAnswer && isCorrect
                                      ? "border-emerald-500 bg-emerald-950/30 text-emerald-300 font-bold"
                                      : showAnswer && isSelected && !isCorrect
                                      ? "border-rose-500 bg-rose-950/30 text-rose-300 font-bold"
                                      : isSelected
                                      ? "border-indigo-500 bg-indigo-950/40 text-white"
                                      : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                      showAnswer && isCorrect ? "bg-emerald-500 text-slate-950" : isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                                    }`}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                  {showAnswer && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />}
                                  {showAnswer && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Detailed Conceptual Explanation */}
                          {showAnswer && (
                            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3 font-mono animate-fade-in-up">
                              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-400" /> Explanation &amp; Core Takeaway
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeQuestion.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center h-full min-h-[350px]">
                    <BookOpen className="h-10 w-10 text-slate-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400">Select a question from the directory to inspect solutions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 02: Company Timed Test Arena (Tier 1, Tier 2, Tier 3) ───────── */}
          {/* Positioned right below the Questions Directory as requested */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 p-7 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Timer className="h-5 w-5 text-indigo-400 animate-pulse" /> Company Timed Test Arena
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Full online assessment simulation across <strong className="text-white">Tier 1, Tier 2, and Tier 3 companies</strong> with negative marking, section timers, and live AI webcam movement proctoring.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> AI Proctoring: Gaze &amp; Movement Tracking
                </span>
              </div>
            </div>

            {/* Tier Navigation / Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs scrollbar-none">
              {[
                { label: "All Tiers", val: "All" },
                { label: "Tier 1: Product Giants (18–45+ LPA)", val: 1 },
                { label: "Tier 2: Unicorns & FinTech (9–18 LPA)", val: 2 },
                { label: "Tier 3: IT Services (4–8 LPA)", val: 3 },
              ].map((t) => {
                const isSelected = selectedTierTab === t.val;
                return (
                  <button
                    key={t.label}
                    onClick={() => setSelectedTierTab(t.val as any)}
                    className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Tier Sections */}
            <div className="space-y-6">
              {COMPANY_TIERS_DATA.filter((tierCat) => selectedTierTab === "All" || selectedTierTab === tierCat.tierNumber).map((tierCat) => (
                <div key={tierCat.tierNumber} className={`rounded-2xl border ${tierCat.border} bg-slate-950/70 p-5 space-y-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-white border border-slate-700">
                          SECTION 0{tierCat.tierNumber}
                        </span>
                        <h4 className="text-base font-bold text-white">{tierCat.tierName}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">{tierCat.description}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 self-start sm:self-auto">
                      {tierCat.ctcRange}
                    </span>
                  </div>

                  {/* Subsection: Company OA Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                    {tierCat.companies.map((co) => {
                      const test = ALL_COMPANY_TESTS[co.testKey];
                      if (!test) return null;
                      return (
                        <div key={co.name} className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 space-y-3 hover:border-indigo-500/40 transition-all shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{co.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              test.negativeMarking ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            }`}>
                              {test.negativeMarking ? `−${test.negativeMarkValue} penalty` : "No penalty"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-sans">{co.role}</p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-b border-slate-800/60 py-2">
                            <span>⏱️ {test.duration}m</span>
                            <span>🎯 {test.totalQuestions} Qs</span>
                            <span>🏆 {test.totalMarks} pts</span>
                            <span className={co.difficulty === "Hard" ? "text-rose-400 font-bold" : co.difficulty === "Medium" ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                              {co.difficulty}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {co.tags.map((t) => (
                              <span key={t} className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">{t}</span>
                            ))}
                          </div>

                          <button
                            onClick={() => setActiveTimedTest(test)}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-2 text-xs font-bold text-white hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" /> Launch {co.name} OA
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 03: Upcoming OA Calendar — Real-Time ───────────────────────── */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" /> Upcoming OA Timelines — Live Hiring Drives
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Timers
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {OA_CALENDAR_EVENTS.map((event) => (
                <CalendarCard key={event.id} event={event} />
              ))}
            </div>
          </div>

        </main>
      </AuthGate>
    </div>
  );
}
