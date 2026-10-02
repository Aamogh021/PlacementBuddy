"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";
import {
  Video, VideoOff, Mic, MicOff, Sparkles, Volume2, VolumeX,
  Send, Award, CheckCircle2, XCircle, RotateCcw, AlertCircle,
  Play, UserCheck, MessageSquare, Bot, BrainCircuit, BarChart3,
  Lightbulb, Settings, Building2, Target, ChevronRight,
  Loader2, ArrowRight, ShieldCheck, ShieldAlert
} from "lucide-react";  
import { InterviewQuestion } from "@/lib/data/interviewQuestions";
import ProctorTracker from "@/components/ProctorTracker";

const ROLES = [
  "Software Development Engineer (SDE 1)",
  "AI / Machine Learning Engineer",
  "Full Stack Web Developer",
  "Backend Developer",
  "Data Analyst",
  "DevOps Engineer",
];

const TARGET_COMPANY_TIERS = [
  {
    tier: "Tier 1: Product Giants (18–45+ LPA)",
    companies: ["Google", "Microsoft", "Amazon", "Uber", "Atlassian", "Meta"],
  },
  {
    tier: "Tier 2: Unicorns & FinTech (9–18 LPA)",
    companies: ["Barclays", "Razorpay", "Swiggy", "Zomato", "Flipkart", "PhonePe"],
  },
  {
    tier: "Tier 3: IT Services & Mass (4–8 LPA)",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
  },
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "Software Development Engineer (SDE 1)": ["React", "TypeScript", "Python", "Docker", "PostgreSQL", "DSA", "System Design"],
  "AI / Machine Learning Engineer": ["Python", "PyTorch", "LangChain", "FastAPI", "RAG", "Vector DB", "NLP"],
  "Full Stack Web Developer": ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "Tailwind", "REST API"],
  "Backend Developer": ["Node.js", "Python", "Redis", "PostgreSQL", "Docker", "Kafka", "gRPC"],
  "Data Analyst": ["SQL", "Python", "Pandas", "Power BI", "Tableau", "Statistics", "A/B Testing"],
  "DevOps Engineer": ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Prometheus", "Linux"],
};

// Audio visualiser (pure CSS waveform animation)
function WaveformVisualiser({ active }: { active: boolean }) {
  return (
    <div className={`flex items-end gap-[3px] h-8 ${active ? "opacity-100" : "opacity-30"}`}>
      {[3, 6, 8, 5, 9, 4, 7, 5, 8, 3, 6, 9, 4, 7, 5].map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full bg-emerald-400 transition-all ${active ? "animate-bounce" : ""}`}
          style={{
            height: active ? `${h * 3}px` : "4px",
            animationDelay: `${i * 60}ms`,
            animationDuration: `${700 + (i % 3) * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function AIInterviewerPage() {
  const { data: session } = useSession();

  // ── Setup state ──────────────────────────────────────────────────────────
  const [role, setRole] = useState("Software Development Engineer (SDE 1)");
  const [targetCompany, setTargetCompany] = useState("");
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  // ── Interview state ───────────────────────────────────────────────────────
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswerInput, setCurrentAnswerInput] = useState("");

  // ── Media state ───────────────────────────────────────────────────────────
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hrStatus, setHrStatus] = useState<"speaking" | "listening" | "thinking" | "idle">("idle");

  // ── Loading / fetch state ─────────────────────────────────────────────────
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // ── Voice session seed (unique per session) ───────────────────────────────
  const sessionSeed = useRef(Math.floor(Math.random() * 999999));

  // ── Refs ──────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Camera ────────────────────────────────────────────────────────────────
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  };

  const stopWebcam = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    setCameraActive(false);
  };

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
        onEnd?.();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.lang === "en-GB" && !v.localService)
        || voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
        || voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setHrStatus("speaking");
      utterance.onend = () => {
        setHrStatus("listening");
        onEnd?.();
      };
      utterance.onerror = () => {
        setHrStatus("listening");
        onEnd?.();
      };
      window.speechSynthesis.speak(utterance);
    },
    [ttsEnabled]
  );

  // ── Speech Recognition ────────────────────────────────────────────────────
  const startSpeechRecognition = useCallback((autoMode = false) => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentAnswerInput(transcript);

      if (autoMode) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
        }, 3000);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    recognition.onerror = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsListening(false);
  }, []);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition(false);
    }
  };

  // ── Fetch role-specific questions ─────────────────────────────────────────
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const params = new URLSearchParams({
        role,
        skills: candidateSkills.join(","),
        company: targetCompany,
        seed: String(sessionSeed.current),
        count: "6",
      });
      const res = await fetch(`/api/interview/questions?${params}`);
      const data = await res.json();
      if (res.ok && data.questions?.length) {
        return data.questions as InterviewQuestion[];
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
    return [];
  };

  // ── Start interview ───────────────────────────────────────────────────────
  const handleStartInterview = async () => {
    const qs = await fetchQuestions();
    if (!qs.length) {
      alert("Failed to load questions. Please try again.");
      return;
    }
    setQuestions(qs);
    setInterviewStarted(true);
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setEvaluationResult(null);
    setCurrentAnswerInput("");
    await startWebcam();

    setTimeout(() => {
      speakText(qs[0].question, () => {
        setTimeout(() => startSpeechRecognition(false), 300);
      });
    }, 600);
  };

  // ── Next question / finish ────────────────────────────────────────────────
  const handleNextQuestion = async () => {
    if (!currentAnswerInput.trim()) {
      alert("Please provide an answer before continuing.");
      return;
    }

    stopSpeechRecognition();
    const updatedAnswers = [...answers, currentAnswerInput];
    setAnswers(updatedAnswers);
    setCurrentAnswerInput("");

    if (currentQuestionIdx < questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setHrStatus("thinking");

      setTimeout(() => {
        speakText(questions[nextIdx].question, () => {
          setTimeout(() => startSpeechRecognition(false), 300);
        });
      }, 700);
    } else {
      setHrStatus("thinking");
      setEvaluating(true);
      try {
        const res = await fetch("/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            answers: updatedAnswers,
            skills: candidateSkills.join(","),
            company: targetCompany,
          }),
        });
        const data = await res.json();
        setEvaluationResult(data);

        if (data.hired) {
          speakText("Congratulations! You have been shortlisted. Outstanding interview performance!");
        } else {
          speakText("Thank you for interviewing. Please review the feedback and keep practicing.");
        }
      } catch {
        console.error("Evaluation failed");
      } finally {
        setEvaluating(false);
        setHrStatus("idle");
        stopWebcam();
      }
    }
  };

  const handleReset = () => {
    stopSpeechRecognition();
    stopWebcam();
    window.speechSynthesis?.cancel();
    setInterviewStarted(false);
    setEvaluationResult(null);
    setAnswers([]);
    setCurrentAnswerInput("");
    setQuestions([]);
    sessionSeed.current = Math.floor(Math.random() * 999999);
  };

  const toggleSkill = (skill: string) => {
    setCandidateSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !candidateSkills.includes(s)) {
      setCandidateSkills((prev) => [...prev, s]);
    }
    setCustomSkill("");
  };

  useEffect(() => {
    return () => {
      stopWebcam();
      stopSpeechRecognition();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Floating candidate webcam video preview */}
      {interviewStarted && (
        <div className="fixed bottom-6 right-6 z-40 w-60 sm:w-64 rounded-3xl border border-indigo-500/40 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-xl transition-all">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover transform -scale-x-100" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-500 font-mono">
                <VideoOff className="h-6 w-6" />
                <span className="text-[10px]">Camera Off</span>
              </div>
            )}
            <ProctorTracker
              active={interviewStarted && cameraActive && !evaluationResult}
              videoElement={videoRef.current}
              onDisqualified={(reason) => {
                stopSpeechRecognition();
                window.speechSynthesis?.cancel();
                setHrStatus("idle");
              }}
              maxStrikes={3}
              lookAwayToleranceSeconds={4}
            />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[9px] font-mono font-bold text-white border border-slate-800">
              <span className={`h-2 w-2 rounded-full ${isListening ? "bg-emerald-400 animate-pulse" : micActive ? "bg-slate-400" : "bg-rose-500"}`} />
              {isListening ? "Listening…" : "Candidate"}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 px-1 font-mono">
            <span className="text-[11px] font-bold text-slate-300 truncate">Candidate Studio</span>
            <div className="flex items-center gap-1">
              <button onClick={() => (cameraActive ? stopWebcam() : startWebcam())} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
                {cameraActive ? <Video className="h-3.5 w-3.5 text-indigo-400" /> : <VideoOff className="h-3.5 w-3.5 text-rose-400" />}
              </button>
              <button onClick={() => setMicActive(!micActive)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
                {micActive ? <Mic className="h-3.5 w-3.5 text-emerald-400" /> : <MicOff className="h-3.5 w-3.5 text-rose-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthGate
        featureName="AI Voice Interviewer"
        featureDescription="Sign in to start a personalized voice interview with our AI HR — role-specific unique questions, voice conversation with auto-mic, and a real hiring verdict with personalized feedback."
      >
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-bold text-indigo-400">
                  <Video className="h-3.5 w-3.5 text-indigo-400" /> MODULE 03 • LIVE AI VOICE INTERVIEWER
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Live Voice AI HR &amp; Technical Interview Simulator
                </h1>
                <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                  A fully voice-driven mock interview with role-specific, unique questions each session. Speak your answers — AI HR auto-listens and responds. Get a personalized hiring verdict.
                </p>
              </div>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-mono font-bold text-slate-200 hover:bg-slate-800 self-start shadow-md"
              >
                {ttsEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-rose-400" />}
                <span>{ttsEnabled ? "HR Voice Speech On" : "HR Voice Muted"}</span>
              </button>
            </div>
          </div>

          {/* ── Stage ───────────────────────────────────────────────────────── */}
          {!interviewStarted ? (
            /* Setup Wizard */
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 space-y-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-xl flex-shrink-0">
                    <Bot className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Configure Your Interview Persona</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Questions are dynamically generated tailored to your role &amp; target company</p>
                  </div>
                </div>

                {/* Role selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                    <Target className="h-3.5 w-3.5 text-indigo-400" /> Target Technical Role:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 font-mono">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setCandidateSkills([]); }}
                        className={`rounded-2xl border px-4 py-3 text-xs font-semibold text-left transition-all ${
                          role === r
                            ? "border-indigo-500 bg-indigo-500/15 text-white shadow-md shadow-indigo-500/10"
                            : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                    <Building2 className="h-3.5 w-3.5 text-cyan-400" /> Target Company <span className="text-slate-500 font-normal">(optional)</span>:
                  </label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">No specific company (General Assessment)</option>
                    {TARGET_COMPANY_TIERS.map((tierGroup) => (
                      <optgroup key={tierGroup.tier} label={tierGroup.tier}>
                        {tierGroup.companies.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Skills selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Tech Stack Skills:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS[role]?.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`rounded-full px-3 py-1 text-xs font-mono font-semibold transition-all ${
                          candidateSkills.includes(s)
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                            : "bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                      placeholder="Add custom skill (e.g. Redis, LangChain)..."
                      className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <button onClick={addCustomSkill} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 font-mono">
                      Add
                    </button>
                  </div>
                  {candidateSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                      {candidateSkills.map((s) => (
                        <span key={s} className="flex items-center gap-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                          {s}
                          <button onClick={() => toggleSkill(s)} className="text-indigo-400 hover:text-white ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interview expectations */}
                <div className="rounded-2xl bg-slate-950/80 p-4.5 border border-slate-800 space-y-2.5 font-sans">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">What to expect:</span>
                  {[
                    "6 unique questions per session — tailored to your stack",
                    "AI Recruiter persona speaks questions with natural speech synthesis",
                    "Web Speech API captures voice answer in real-time with confidence score",
                    "Evaluates technical keyword density, communication clarity & confidence",
                    "Instant final hiring verdict with personalized feedback",
                  ].map((e) => (
                    <div key={e} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{e}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStartInterview}
                  disabled={loadingQuestions}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-4 font-bold text-white text-sm sm:text-base shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
                >
                  {loadingQuestions ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      <span>Generating Unique Interview Questions…</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 fill-current" />
                      <span>Launch AI Face-to-Face Interview</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          ) : evaluationResult ? (
            /* ── Results Screen ──────────────────────────────────────────── */
            <div className="max-w-3xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-8 space-y-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
              <div className="text-center space-y-4">
                <div className={`flex h-24 w-24 mx-auto items-center justify-center rounded-full shadow-2xl ${
                  evaluationResult.hired
                    ? "bg-emerald-500/20 text-emerald-400 border-4 border-emerald-500/40 animate-glow-pulse"
                    : "bg-rose-500/20 text-rose-400 border-4 border-rose-500/40"
                }`}>
                  {evaluationResult.hired ? <Award className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
                </div>
                <div className="space-y-1 font-mono">
                  <span className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
                    evaluationResult.hired ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  }`}>
                    Official HR Verdict: {evaluationResult.hired ? "🎉 Shortlisted / Hired" : "Improvement Needed"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{evaluationResult.verdictTitle}</h2>
                  <p className="text-xs text-slate-400">Target Role: {role}{targetCompany ? ` · ${targetCompany}` : ""}</p>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4 font-mono">
                {[
                  { label: "Technical Score", val: evaluationResult.breakdown.technicalKnowledge, color: "text-indigo-400" },
                  { label: "Communication", val: evaluationResult.breakdown.communicationClarity, color: "text-cyan-400" },
                  { label: "Confidence & Delivery", val: evaluationResult.breakdown.confidenceDelivery, color: "text-emerald-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400">{s.label}</span>
                    <p className={`text-2xl font-black ${s.color}`}>{s.val}%</p>
                  </div>
                ))}
              </div>

              {/* Detailed feedback */}
              <div className="space-y-4 border-t border-slate-800 pt-6 font-sans">
                <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4" /> AI Recruiter Evaluation Notes
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{evaluationResult.detailedFeedback}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-950/20 p-5 border border-emerald-500/20 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Demonstrated Strengths
                    </h4>
                    <ul className="text-xs text-emerald-200/90 space-y-1.5 list-disc list-inside">
                      {evaluationResult.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-rose-950/20 p-5 border border-rose-500/20 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4" /> Targeted Focus Areas
                    </h4>
                    <ul className="text-xs text-rose-200/90 space-y-1.5 list-disc list-inside">
                      {evaluationResult.areasForImprovement.map((a: string, i: number) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 py-3.5 font-mono font-bold text-xs sm:text-sm text-white hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4 text-indigo-400" /> Take Another Interview Session
              </button>
            </div>

          ) : (
            /* ── Live Interview Studio ─────────────────────────────────────── */
            currentQ && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">

                {/* HR Avatar Studio */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
                  <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-950 p-8 border border-slate-800 text-center min-h-[290px] overflow-hidden">
                    <div className={`absolute h-48 w-48 rounded-full blur-3xl transition-all duration-700 ${
                      hrStatus === "speaking" ? "bg-indigo-500/25 animate-pulse"
                        : hrStatus === "listening" ? "bg-emerald-500/20 animate-pulse"
                        : "bg-cyan-500/10"
                    }`} />

                    <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-400 shadow-2xl border-4 border-slate-900">
                      <Bot className={`h-14 w-14 text-white transition-transform duration-300 ${hrStatus === "speaking" ? "scale-110" : ""}`} />
                    </div>

                    {/* Waveform under avatar when speaking */}
                    <div className="relative z-10 mt-4">
                      <WaveformVisualiser active={hrStatus === "speaking" || isListening} />
                    </div>

                    <div className="relative z-10 mt-3 space-y-1">
                      <h3 className="text-base font-bold text-white">Elena (Senior Staff Engineer)</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold ${
                        hrStatus === "speaking" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : hrStatus === "listening" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : hrStatus === "thinking" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        <span className="h-2 w-2 rounded-full bg-current animate-ping" />
                        {hrStatus === "speaking" ? "AI HR Speaking…" : hrStatus === "listening" ? "Listening to Candidate…" : hrStatus === "thinking" ? "Evaluating Answer…" : "Ready"}
                      </span>
                    </div>
                  </div>

                  {/* Question progress */}
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
                      <span className="text-indigo-400">{currentQ.type}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question tags */}
                  <div className="flex flex-wrap gap-2 font-mono">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${currentQ.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" : currentQ.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {currentQ.difficulty}
                    </span>
                    <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">{currentQ.type}</span>
                    {currentQ.companies?.map((c) => (
                      <span key={c} className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Q & Voice Response */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-2xl backdrop-blur-xl">

                  {/* Current question box */}
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4" /> Live Question
                        </span>
                        {currentQ.hint && (
                          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                            {currentQ.hint}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => speakText(currentQ.question)}
                        className="text-xs font-mono text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Replay Question
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-white leading-relaxed font-sans">
                      &ldquo;{currentQ.question}&rdquo;
                    </p>
                  </div>

                  {/* Candidate voice response */}
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-emerald-400" /> Candidate Speech Log:
                      </label>

                      <button
                        onClick={toggleSpeechRecognition}
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          isListening
                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                            : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                        }`}
                      >
                        {isListening ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                            <Mic className="h-3.5 w-3.5" /> Listening — Click to Pause
                          </>
                        ) : (
                          <>
                            <Mic className="h-3.5 w-3.5" /> Record Voice Answer
                          </>
                        )}
                      </button>
                    </div>

                    {/* Waveform indicator while listening */}
                    {isListening && (
                      <div className="flex items-center gap-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 px-4 py-2.5">
                        <WaveformVisualiser active={true} />
                        <span className="text-xs text-emerald-400 font-semibold">Microphone active — speaking in real-time…</span>
                      </div>
                    )}

                    <textarea
                      value={currentAnswerInput}
                      onChange={(e) => setCurrentAnswerInput(e.target.value)}
                      rows={5}
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y font-mono leading-relaxed"
                      placeholder="Speak via microphone or type your response here…"
                    />
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={evaluating || !currentAnswerInput.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-3.5 font-bold text-white text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Evaluating Speech &amp; Keyword Density…
                      </>
                    ) : currentQuestionIdx < questions.length - 1 ? (
                      <>
                        <span>Submit Answer &amp; Next Question</span>
                        <Send className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Submit Final Answer &amp; Get Hiring Verdict</span>
                        <Award className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button onClick={handleReset} className="w-full text-xs text-slate-500 hover:text-rose-400 transition-colors py-1 font-mono">
                    ↩ Cancel &amp; Restart Interview
                  </button>
                </div>

              </div>
            )
          )}

        </main>
      </AuthGate>
    </div>
  );
}
