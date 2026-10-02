"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  Target,
  Award,
  TrendingUp,
  Zap,
  RefreshCw,
  Building2,
  Cpu,
  Info,
  Check,
  Copy,
  X,
  FileCheck,
  WifiOff,
  Brain,
  Download,
  Edit3,
  FileText,
  Briefcase,
  Layers,
} from "lucide-react";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const TARGET_ROLES = [
  "Software Development Engineer (SDE 1)",
  "AI / Machine Learning Engineer",
  "Full Stack Web Developer",
  "Backend Developer",
  "Data Analyst",
  "DevOps Engineer",
];

const ROLE_HINTS: Record<string, string> = {
  "Software Development Engineer (SDE 1)": "Focus: DSA, System Design, OOP, Java/C++/Python, Docker, PostgreSQL",
  "AI / Machine Learning Engineer": "Focus: PyTorch/TensorFlow, NLP, Computer Vision, RAG, FastAPI, MLOps",
  "Full Stack Web Developer": "Focus: React, Next.js, TypeScript, Tailwind, REST/GraphQL, Node.js, PostgreSQL",
  "Backend Developer": "Focus: System Design, Redis, Message Queues, Microservices, Security, Scalability",
  "Data Analyst": "Focus: SQL, Python/Pandas, Tableau, Power BI, Statistical Analysis, ETL, Data Warehousing",
  "DevOps Engineer": "Focus: Docker, Kubernetes, Terraform, CI/CD, GitHub Actions, Linux, AWS/GCP",
};

export const COMPANY_TIERS_SELECT = [
  {
    tier: "Tier 1: Product & Tech Giants (18–45+ LPA)",
    companies: ["Google", "Microsoft", "Amazon", "Uber", "Atlassian", "Meta"],
  },
  {
    tier: "Tier 2: Unicorns & FinTech (9–18 LPA)",
    companies: ["Barclays", "Razorpay", "Swiggy", "Zomato", "Flipkart", "PhonePe"],
  },
  {
    tier: "Tier 3: IT Services & Mass Recruiters (4–8 LPA)",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
  },
];

interface BulletImprovementItem {
  id: string;
  section: string;
  original: string;
  improved: string;
  explanation: string;
  reason: string;
  placeholder_needed?: boolean;
  status: "pending" | "accepted" | "rejected";
}

interface SectionFindingItem {
  section: string;
  status: string;
  score: number;
  evidence: string;
  feedback: string;
}

function cleanXYZBullet(text: string): string {
  if (!text) return "";
  let cleaned = text.replace(/\s*—?\s*\[\s*Add\s+metric[^\]]*\]\.?/gi, "");
  cleaned = cleaned.replace(/\s*—?\s*\(\s*Add\s+metric[^\)]*\)\.?/gi, "");
  cleaned = cleaned.replace(/\s*—\s*$/g, "").trim();
  if (cleaned && !cleaned.endsWith(".")) cleaned += ".";
  return cleaned;
}

export default function ResumeHelperPage() {
  const { data: session } = useSession();

  // Input states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [targetRole, setTargetRole] = useState("Software Development Engineer (SDE 1)");
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);

  // Interaction & execution states
  const [loading, setLoading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendOffline, setBackendOffline] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  // Interactive review states
  const [improvements, setImprovements] = useState<BulletImprovementItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [improvementFilter, setImprovementFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const handleFileSelect = (file: File) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".pdf") && !lower.endsWith(".docx") && !lower.endsWith(".doc") && !lower.endsWith(".txt")) {
      setError("Unsupported format. Please upload a .pdf, .docx, or .doc file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    setError(null);
    setBackendOffline(false);
    // Invalidate stale analysis immediately
    setAnalysisResult(null);
    setImprovements([]);
    setSelectedFile(file);
    setInputMode("file");
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setBackendOffline(false);
    setAnalysisResult(null);
    setImprovements([]);
    setPdfSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("targetRole", targetRole);
      if (targetCompany) formData.append("targetCompany", targetCompany);
      if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());
      if (session?.user?.email) formData.append("userEmail", session.user.email);

      if (inputMode === "file" && selectedFile) {
        formData.append("file", selectedFile);
      } else {
        if (!resumeText.trim()) {
          setError("Please paste your resume text or upload a document file.");
          setLoading(false);
          return;
        }
        formData.append("resumeText", resumeText);
      }

      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 503) {
        setBackendOffline(true);
        setError(data.error || "Resume analysis backend is offline. Please start the Python backend server.");
        return;
      }

      if (!res.ok) {
        setError(data.error || data.detail || "Analysis failed. Please check your document and try again.");
        return;
      }

      setAnalysisResult(data);
      // Initialize improvements list with "pending" status
      if (data.bulletRewrites && Array.isArray(data.bulletRewrites)) {
        setImprovements(
          data.bulletRewrites.map((b: any) => ({
            ...b,
            improved: cleanXYZBullet(b.improved || ""),
            status: b.status || "pending",
          }))
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown network error";
      if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
        setBackendOffline(true);
        setError("Cannot connect to resume analysis service. Please ensure the backend server is running and accessible.");
      } else {
        setError(`Analysis error: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Review workflow: Accept, Reject, Edit suggestions
  const handleAcceptImprovement = (id: string) => {
    setImprovements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "accepted" } : item))
    );
  };

  const handleRejectImprovement = (id: string) => {
    setImprovements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
  };

  const handleStartEdit = (item: BulletImprovementItem) => {
    setEditingId(item.id);
    setEditText(item.improved);
  };

  const handleSaveEdit = (id: string) => {
    setImprovements((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, improved: cleanXYZBullet(editText.trim() || item.improved), status: "accepted" }
          : item
      )
    );
    setEditingId(null);
  };

  const handleAcceptAll = () => {
    setImprovements((prev) => prev.map((item) => ({ ...item, status: "accepted" })));
  };

  const handleResetAll = () => {
    setImprovements((prev) => prev.map((item) => ({ ...item, status: "pending" })));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(cleanXYZBullet(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Real PDF Export Download
  const handleExportPdf = async () => {
    if (!analysisResult?.rawText) {
      setError("No resume text available for PDF export.");
      return;
    }

    setExportingPdf(true);
    setPdfSuccessMessage(null);

    try {
      const acceptedEdits = improvements
        .filter((item) => item.status === "accepted")
        .map((item) => ({
          original: item.original,
          improved: cleanXYZBullet(item.improved),
          section: item.section,
        }));

      const payload = {
        file_name: `${(analysisResult.fileName || "PlacementBuddy_Resume").replace(/\.[^/.]+$/, "")}_Improved.pdf`,
        raw_text: analysisResult.rawText,
        accepted_edits: acceptedEdits,
        target_role: targetRole,
        user_email: session?.user?.email || undefined,
      };

      const res = await fetch("/api/resume/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = payload.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setPdfSuccessMessage(
        `PDF downloaded successfully with ${acceptedEdits.length} accepted revision${acceptedEdits.length === 1 ? "" : "s"} applied!`
      );
      setTimeout(() => setPdfSuccessMessage(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export PDF";
      setError(`PDF Generation failed: ${msg}`);
    } finally {
      setExportingPdf(false);
    }
  };

  const acceptedCount = improvements.filter((item) => item.status === "accepted").length;
  const filteredImprovements = improvements.filter((item) => {
    if (improvementFilter === "all") return true;
    return item.status === improvementFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <AuthGate
        featureName="Real-PDF ATS Resume Reviewer & Optimizer"
        featureDescription="Sign in to analyze your actual PDF resume against transparent ATS criteria, get grounded bullet point improvements, and export a revised PDF."
      >
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up">

          {/* ── Header Banner ─────────────────────────────────────────────── */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-bold text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> REAL-PDF ATS ANALYZER &amp; RESUME REVISER
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Real-PDF ATS Scoring &amp; Grounded Resume Reviser
                </h1>
                <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Upload your genuine resume PDF. Every score, finding, and suggested rewrite is grounded in your actual text with <strong className="text-white">no fabricated metrics or random numbers</strong>.
                </p>
              </div>

              {/* Role & Target Company */}
              <div className="flex flex-col gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl min-w-[310px] backdrop-blur-md">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                    <Target className="h-3.5 w-3.5 text-indigo-400" /> Target Role:
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {TARGET_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-indigo-400/90 font-mono mt-0.5">{ROLE_HINTS[targetRole]}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-cyan-400" /> Target Company (Optional):
                    </span>
                    <span className="text-[10px] text-cyan-400 font-normal">Tier 1, 2, 3</span>
                  </label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">General Industry Benchmark (No Specific Company)</option>
                    {COMPANY_TIERS_SELECT.map((tierGroup) => (
                      <optgroup key={tierGroup.tier} label={tierGroup.tier}>
                        {tierGroup.companies.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Input + Results Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Upload & Options */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-5 shadow-2xl backdrop-blur-xl">

                {/* Mode Selector Tabs */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInputMode("file")}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        inputMode === "file"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      📁 Upload File (.pdf, .docx)
                    </button>
                    <button
                      onClick={() => setInputMode("text")}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        inputMode === "text"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      📝 Paste Text
                    </button>
                  </div>
                </div>

                {/* File Upload Zone */}
                {inputMode === "file" ? (
                  <div className="space-y-4">
                    {selectedFile ? (
                      <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-4 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 flex-shrink-0">
                            <FileCheck className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                            <p className="text-[10px] font-mono text-indigo-300">
                              {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split(".").pop()?.toUpperCase()} Document
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setAnalysisResult(null);
                            setImprovements([]);
                          }}
                          className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center transition-colors"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                          if (e.dataTransfer.files?.[0]) {
                            handleFileSelect(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                          dragActive
                            ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                            : "border-slate-800 bg-slate-950/70 hover:border-indigo-500/50 hover:bg-slate-950"
                        }`}
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3 shadow-inner">
                          <Upload className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-bold text-white">Upload Your Actual Resume Document</p>
                        <p className="text-xs text-slate-400 mt-1">Supports text-based <strong className="text-indigo-300">PDF, Word (.docx, .doc)</strong></p>
                        <span className="mt-3 inline-block rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1 text-[11px] font-mono font-bold text-indigo-300">
                          Browse Computer
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between font-mono">
                      <span>Resume Content:</span>
                      <span className="text-[10px] text-slate-400">{resumeText.length} characters</span>
                    </label>
                    <textarea
                      value={resumeText}
                      onChange={(e) => {
                        setResumeText(e.target.value);
                        setAnalysisResult(null);
                      }}
                      rows={10}
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y leading-relaxed"
                      placeholder="Paste your complete resume text here (education, skills, experience, projects)..."
                    />
                  </div>
                )}

                {/* Job Description (Optional) Toggle */}
                <div className="border-t border-slate-800/80 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowJdInput(!showJdInput)}
                    className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5 font-mono text-indigo-300">
                      <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                      Compare Against Job Description (Optional)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {showJdInput ? "Hide" : "+ Add JD"}
                    </span>
                  </button>

                  {showJdInput && (
                    <div className="mt-3 space-y-1.5 animate-fade-in-up">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                        placeholder="Paste the job posting description, key responsibilities, and required qualifications here to calculate your Job Match Score..."
                      />
                      <p className="text-[10px] text-slate-400">
                        When provided, an independent Job-Specific Match score is computed against these exact requirements.
                      </p>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className={`flex items-start gap-2 rounded-xl p-3 text-xs font-mono border ${
                    backendOffline
                      ? "bg-amber-950/40 border-amber-500/30 text-amber-300"
                      : "bg-rose-950/40 border-rose-500/30 text-rose-300"
                  }`}>
                    {backendOffline
                      ? <WifiOff className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      : <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p>{error}</p>
                      {backendOffline && (
                        <p className="mt-1 text-[10px] text-amber-400/80">
                          Please ensure the backend service is running and accessible.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Banner */}
                {pdfSuccessMessage && (
                  <div className="flex items-center gap-2 rounded-xl p-3 text-xs font-mono border bg-emerald-950/40 border-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{pdfSuccessMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  onClick={handleAnalyze}
                  disabled={loading || (inputMode === "file" && !selectedFile) || (inputMode === "text" && !resumeText.trim())}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Extracting PDF &amp; Running Evidence-Based ATS Scan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Analyze Real Resume &amp; Generate Improvements</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Results Dashboard */}
            <div className="lg:col-span-7 space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 animate-pulse">
                      <div className="h-4 w-40 bg-slate-800 rounded mb-4" />
                      <div className="h-24 bg-slate-800/60 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : !analysisResult ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center h-full min-h-[440px] backdrop-blur-xl">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-4 animate-glow-pulse">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Genuine ATS Document Evaluation</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
                    Upload your actual PDF resume to see evidence-based scoring, transparent category breakdown, section findings, and <strong className="text-indigo-400">grounded Google XYZ rewrites</strong> that you can review and export.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-md font-mono text-[11px]">
                    {[
                      { title: "Real PDF Text Parser", icon: FileText },
                      { title: "Documented ATS Rubric", icon: Target },
                      { title: "Grounded XYZ Rewrites", icon: TrendingUp },
                      { title: "Download Revised PDF", icon: Download },
                    ].map((f) => {
                      const Icon = f.icon;
                      return (
                        <div key={f.title} className="flex items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-slate-300">
                          <Icon className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                          <span>{f.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Full Analysis Output */
                <div className="space-y-6 animate-fade-in-up">

                  {/* Metadata strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
                        <span className="text-indigo-400">FILE:</span> {analysisResult.fileName}
                      </span>
                      {analysisResult.analysisId && (
                        <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-400">
                          ID: {analysisResult.analysisId}
                        </span>
                      )}
                      {analysisResult.wordCount && (
                        <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-400">
                          {analysisResult.wordCount} words
                        </span>
                      )}
                    </div>
                    {analysisResult.aiEnhanced && (
                      <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-2.5 py-1 text-indigo-300 font-bold">
                        <Brain className="h-3 w-3" /> AI Analysis Active
                      </span>
                    )}
                  </div>

                  {/* Dual Score Card: General Quality + Job Match */}
                  <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      
                      {/* Left: General ATS Score Ring */}
                      <div className="flex items-center gap-5">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-950 border-4 border-indigo-500/40 shadow-2xl flex-shrink-0">
                          <div
                            className="absolute inset-0 rounded-full transition-all duration-700"
                            style={{
                              background: `conic-gradient(${
                                analysisResult.overallScore >= 80 ? "rgb(16 185 129)" : analysisResult.overallScore >= 65 ? "rgb(245 158 11)" : "rgb(244 63 94)"
                              } ${analysisResult.overallScore * 3.6}deg, transparent 0deg)`,
                              opacity: 0.35,
                            }}
                          />
                          <div className="text-center relative z-10 font-mono">
                            <span className="text-3xl font-black text-white">{analysisResult.overallScore}%</span>
                            <span className="block text-[9px] uppercase font-bold text-indigo-400 tracking-wider">
                              ATS SCORE
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-center sm:text-left">
                          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-mono font-bold border ${
                            analysisResult.overallScore >= 80
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : analysisResult.overallScore >= 65
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}>
                            {analysisResult.tierName || "General ATS Benchmark"}
                          </span>
                          <h3 className="text-lg font-extrabold text-white">{analysisResult.role}</h3>
                          {analysisResult.targetCompany && (
                            <span className="inline-flex items-center gap-1 font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/30 font-mono text-[11px]">
                              <Building2 className="h-3 w-3 text-cyan-400" /> Target Company: {analysisResult.targetCompany}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Job-Specific Match Card (or Prompt) */}
                      <div className="w-full sm:w-auto min-w-[220px] rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 font-bold flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-cyan-400" /> Job-Specific Match:
                          </span>
                          {analysisResult.hasJobDescription ? (
                            <span className="text-emerald-400 font-bold">{analysisResult.jobMatchScore}%</span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">N/A</span>
                          )}
                        </div>
                        {analysisResult.hasJobDescription ? (
                          <div className="space-y-1">
                            <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                              <div
                                className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                                style={{ width: `${analysisResult.jobMatchScore || 0}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Keyword &amp; qualification alignment against your supplied Job Description.
                            </p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">
                            No Job Description supplied. Evaluation reflects general ATS resume quality.
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Tier Verdict Banner */}
                    {analysisResult.tierVerdict && (
                      <div className="mt-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-sans text-slate-300 flex items-start gap-2">
                        <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{analysisResult.tierVerdict}</span>
                      </div>
                    )}

                    {/* 4 Score Breakdown Progress Bars */}
                    {analysisResult.scoreBreakdown?.categories && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-800/80 font-mono">
                        {analysisResult.scoreBreakdown.categories.map((cat: any) => (
                          <div key={cat.category} className="space-y-1.5" title={cat.explanation}>
                            <div className="flex justify-between text-[11px] font-semibold">
                              <span className="text-slate-400 truncate max-w-[110px]">{cat.category}</span>
                              <span className="text-white">{cat.score}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                              <div
                                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                                style={{ width: `${cat.score}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-slate-500 truncate">{cat.status} ({cat.weight_pct}% weight)</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Evidence-Based Section Findings ───────────────────────── */}
                  {analysisResult.sectionFindings?.length > 0 && (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-xl backdrop-blur-xl">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-400" /> Evidence-Based Section Evaluation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {analysisResult.sectionFindings.map((sec: SectionFindingItem) => (
                          <div
                            key={sec.section}
                            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{sec.section}</span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                  sec.status === "Complete"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                }`}
                              >
                                {sec.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{sec.feedback}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">
                              <strong className="text-slate-400">Evidence:</strong> {sec.evidence}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Grounded Strengths & Weaknesses ───────────────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-900/70 p-5 border border-emerald-500/30 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Document Strengths
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {analysisResult.strengths?.map((st: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">&bull;</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-slate-900/70 p-5 border border-rose-500/30 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-rose-400" /> Areas for Improvement
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {analysisResult.weaknesses?.map((w: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-400 font-bold">&bull;</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── Actionable Resume Improvement Review Center ────────────── */}
                  <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/80 p-6 space-y-5 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Zap className="h-5 w-5 text-amber-400" /> Grounded Resume Improvement Center
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Review, edit, accept, or reject suggested Google XYZ rewrites before exporting.
                        </p>
                      </div>

                      {/* Bulk Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAcceptAll}
                          className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                        >
                          Accept All
                        </button>
                        <button
                          onClick={handleResetAll}
                          className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      {(["all", "pending", "accepted", "rejected"] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setImprovementFilter(filter)}
                          className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                            improvementFilter === filter
                              ? "bg-indigo-600 text-white font-bold"
                              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                          }`}
                        >
                          {filter} ({improvements.filter((i) => filter === "all" || i.status === filter).length})
                        </button>
                      ))}
                    </div>

                    {/* Suggestions List */}
                    {filteredImprovements.length === 0 ? (
                      <p className="text-xs text-slate-500 font-mono py-4 text-center">
                        No suggestions found in this view.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {filteredImprovements.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-2xl border p-4 space-y-3 transition-all ${
                              item.status === "accepted"
                                ? "border-emerald-500/40 bg-emerald-950/10"
                                : item.status === "rejected"
                                ? "border-slate-800 bg-slate-950/40 opacity-60"
                                : "border-slate-800 bg-slate-950/80"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-indigo-400 font-bold uppercase">{item.section}</span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                    item.status === "accepted"
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                      : item.status === "rejected"
                                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                      : "bg-slate-800 text-slate-400 border-slate-700"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>

                            {/* Original */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-slate-500 uppercase">Original Statement:</span>
                              <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                {item.original}
                              </p>
                            </div>

                            {/* Improved (Editable) */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" /> Grounded Google XYZ Format:
                                </span>
                                {editingId !== item.id && (
                                  <button
                                    onClick={() => handleStartEdit(item)}
                                    className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                                  >
                                    <Edit3 className="h-3 w-3" /> Edit Text
                                  </button>
                                )}
                              </div>

                              {editingId === item.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl bg-slate-900 border border-indigo-500 p-2.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                  />
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 hover:text-white"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(item.id)}
                                      className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                                    >
                                      Save &amp; Accept
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <p className="text-xs text-emerald-200 bg-emerald-950/20 p-3 pr-20 rounded-xl border border-emerald-500/20 font-medium leading-relaxed font-sans">
                                    {item.improved}
                                  </p>
                                  <button
                                    onClick={() => copyText(item.improved, item.id)}
                                    className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
                                  >
                                    {copiedId === item.id ? "Copied" : "Copy"}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Reasoning */}
                            {item.reason && (
                              <p className="text-[11px] text-slate-400 italic">
                                <Info className="inline h-3 w-3 text-indigo-400 mr-1" />
                                {item.reason}
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                              <button
                                onClick={() => handleRejectImprovement(item.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                                  item.status === "rejected"
                                    ? "bg-rose-500 text-white"
                                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40"
                                }`}
                              >
                                <X className="h-3 w-3" /> Reject
                              </button>
                              <button
                                onClick={() => handleAcceptImprovement(item.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                                  item.status === "accepted"
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                }`}
                              >
                                <Check className="h-3 w-3" /> Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── PDF Export Action Bar ─────────────────────────────── */}
                    <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-white">
                          Ready to export revised PDF: <span className="text-indigo-400">{acceptedCount} accepted change{acceptedCount === 1 ? "" : "s"}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Generates a clean, multi-page professional PDF incorporating your accepted revisions.
                        </p>
                      </div>

                      <button
                        onClick={handleExportPdf}
                        disabled={exportingPdf}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {exportingPdf ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Building Improved PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Download Improved PDF</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Skills Coverage Breakdown */}
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-xl backdrop-blur-xl">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-indigo-400" /> Target Role Skill Breakdown — {analysisResult.role}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-950/70 p-4 border border-emerald-500/30 space-y-2.5">
                        <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Detected Matching Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.skillsAnalysis?.detectedSkills?.map((s: string) => (
                            <span key={s} className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-300 border border-emerald-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-950/70 p-4 border border-rose-500/30 space-y-2.5">
                        <h4 className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-rose-400" /> Missing Role Target Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.skillsAnalysis?.missingTargetSkills?.length > 0 ? (
                            analysisResult.skillsAnalysis.missingTargetSkills.map((s: string) => (
                              <span key={s} className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-rose-300 border border-rose-500/20">
                                + {s}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-emerald-400 font-medium">All core target role competencies detected! 🎉</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

        </main>
      </AuthGate>
    </div>
  );
}
