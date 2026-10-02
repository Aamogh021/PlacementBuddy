"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ShieldAlert, ShieldCheck, AlertTriangle, XCircle,
  Eye, EyeOff, RotateCcw, AlertOctagon, CopySlash
} from "lucide-react";

export interface ProctorTrackerProps {
  active: boolean;
  videoElement: HTMLVideoElement | null;
  cameraActive?: boolean;
  onDisqualified?: (reason: string) => void;
  maxStrikes?: number;
  lookAwayToleranceSeconds?: number;
  enableTabSwitchDetection?: boolean;
  enableCopyPasteBlock?: boolean;
}

export interface ProctorStatus {
  isTracking: boolean;
  isFocused: boolean;
  gazeDirection: "center" | "left" | "right" | "down" | "away";
  violationType: "none" | "looking_away" | "tab_switch" | "clipboard";
  lookAwaySeconds: number;
  strikes: number;
  tabSwitchCount: number;
  isDisqualified: boolean;
  disqualificationReason: string | null;
  focusScore: number; // 0 - 100
  lastWarning: string | null;
}

export default function ProctorTracker({
  active,
  videoElement,
  cameraActive = true,
  onDisqualified,
  maxStrikes = 3,
  lookAwayToleranceSeconds = 4,
  enableTabSwitchDetection = true,
  enableCopyPasteBlock = true,
}: ProctorTrackerProps) {
  const [status, setStatus] = useState<ProctorStatus>({
    isTracking: false,
    isFocused: true,
    gazeDirection: "center",
    violationType: "none",
    lookAwaySeconds: 0,
    strikes: 0,
    tabSwitchCount: 0,
    isDisqualified: false,
    disqualificationReason: null,
    focusScore: 98,
    lastWarning: null,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lookAwayCountRef = useRef<number>(0);
  const strikesRef = useRef<number>(0);
  const tabSwitchesRef = useRef<number>(0);
  const disqualifiedRef = useRef<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play warning chime using Web Audio API
  const playWarningBeep = useCallback((freq = 550, duration = 0.25) => {
    try {
      if (typeof window === "undefined") return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  // ── Tab Switch & Focus Loss Anti-Cheat ─────────────────────────────────────
  useEffect(() => {
    if (!active || !enableTabSwitchDetection) return;

    let warningClearTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleViolation = (eventType: "visibility" | "blur") => {
      if (disqualifiedRef.current) return;

      strikesRef.current += 1;
      tabSwitchesRef.current += 1;
      playWarningBeep(420, 0.4);

      const currentStrikes = strikesRef.current;
      const warnMsg = `⚠️ Tab Switch Detected! Please stay on the assessment window (Strike ${currentStrikes}/${maxStrikes})`;

      if (currentStrikes >= maxStrikes) {
        disqualifiedRef.current = true;
        const disqReason = `Disqualified: Switched tabs or windows ${currentStrikes} times during active proctored assessment.`;
        setStatus((prev) => ({
          ...prev,
          isDisqualified: true,
          disqualificationReason: disqReason,
          strikes: currentStrikes,
          tabSwitchCount: tabSwitchesRef.current,
          violationType: "tab_switch",
          lastWarning: disqReason,
          isFocused: false,
        }));
        onDisqualified?.(disqReason);
        return;
      }

      setStatus((prev) => ({
        ...prev,
        isFocused: false,
        strikes: currentStrikes,
        tabSwitchCount: tabSwitchesRef.current,
        violationType: "tab_switch",
        lastWarning: warnMsg,
        focusScore: Math.max(15, prev.focusScore - 25),
      }));
    };

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        handleViolation("visibility");
      } else {
        // Returned to tab
        if (warningClearTimeout) clearTimeout(warningClearTimeout);
        warningClearTimeout = setTimeout(() => {
          if (!disqualifiedRef.current) {
            setStatus((prev) => ({
              ...prev,
              isFocused: true,
              violationType: prev.violationType === "tab_switch" ? "none" : prev.violationType,
              lastWarning: null,
            }));
          }
        }, 2500);
      }
    };

    const handleWindowBlur = () => {
      if (!disqualifiedRef.current && document.visibilityState === "visible") {
        handleViolation("blur");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      if (warningClearTimeout) clearTimeout(warningClearTimeout);
    };
  }, [active, enableTabSwitchDetection, maxStrikes, onDisqualified, playWarningBeep]);

  // ── Clipboard Protection ──────────────────────────────────────────────────
  useEffect(() => {
    if (!active || !enableCopyPasteBlock) return;

    let clearWarnTimer: ReturnType<typeof setTimeout> | null = null;

    const preventClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      playWarningBeep(680, 0.15);
      setStatus((prev) => ({
        ...prev,
        lastWarning: "⚠️ Clipboard actions (Copy/Cut/Paste) are locked during OA proctoring.",
      }));
      if (clearWarnTimer) clearTimeout(clearWarnTimer);
      clearWarnTimer = setTimeout(() => {
        setStatus((prev) => ({ ...prev, lastWarning: null }));
      }, 3000);
    };

    window.addEventListener("copy", preventClipboard);
    window.addEventListener("cut", preventClipboard);
    window.addEventListener("paste", preventClipboard);

    return () => {
      window.removeEventListener("copy", preventClipboard);
      window.removeEventListener("cut", preventClipboard);
      window.removeEventListener("paste", preventClipboard);
      if (clearWarnTimer) clearTimeout(clearWarnTimer);
    };
  }, [active, enableCopyPasteBlock, playWarningBeep]);

  // ── Camera Gaze & Head Movement Analysis Loop ─────────────────────────────
  useEffect(() => {
    if (!active || !videoElement || disqualifiedRef.current) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
      canvasRef.current.width = 160;
      canvasRef.current.height = 120;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const analyzeFrame = () => {
      if (!videoElement || videoElement.readyState < 2 || disqualifiedRef.current) return;

      try {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;

        let totalFacePixels = 0;
        let sumX = 0;
        let sumY = 0;
        let totalBrightness = 0;

        // Subsample pixels for speed (step by 4 pixels)
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const pixelIdx = i / 4;
          const x = pixelIdx % canvas.width;
          const y = Math.floor(pixelIdx / canvas.width);

          totalBrightness += (r + g + b) / 3;

          // Standard YCbCr lighting-invariant skin color detection
          // Y = 0.299*R + 0.587*G + 0.114*B
          const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
          const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

          // Standard human skin bounding box in YCbCr: Cb in [75, 130], Cr in [130, 175]
          // Plus relaxed RGB check for varied lighting
          const isSkinYCbCr = cb >= 75 && cb <= 130 && cr >= 130 && cr <= 175;
          const isSkinRGB = r > 50 && g > 30 && b > 20 && r > g && (r - b) > 8;

          if (isSkinYCbCr || isSkinRGB) {
            totalFacePixels++;
            sumX += x;
            sumY += y;
          }
        }

        const sampleCount = data.length / 16;
        const avgBrightness = totalBrightness / sampleCount;

        let isLookingAway = false;
        let direction: "center" | "left" | "right" | "down" | "away" = "center";
        let violationDetail = "";

        // Check if camera is covered or pitch black
        if (avgBrightness < 12) {
          isLookingAway = true;
          direction = "away";
          violationDetail = "Camera lens is covered or in pitch darkness.";
        } else if (totalFacePixels < 28) {
          // No face detected in frame
          isLookingAway = true;
          direction = "away";
          violationDetail = "Candidate absent from camera view.";
        } else {
          const centroidX = sumX / totalFacePixels / canvas.width;
          const centroidY = sumY / totalFacePixels / canvas.height;

          // Bounding center checks (horizontal: 26% to 74%, vertical: max 78%)
          if (centroidX < 0.26) {
            isLookingAway = true;
            direction = "right"; // mirrored
            violationDetail = "Looking away to the side.";
          } else if (centroidX > 0.74) {
            isLookingAway = true;
            direction = "left"; // mirrored
            violationDetail = "Looking away to the side.";
          } else if (centroidY > 0.78) {
            isLookingAway = true;
            direction = "down";
            violationDetail = "Head tilted down looking at desk or mobile.";
          } else {
            isLookingAway = false;
            direction = "center";
          }
        }

        // Process looking-away violations
        if (isLookingAway) {
          lookAwayCountRef.current += 1;

          if (lookAwayCountRef.current === 2) {
            strikesRef.current += 1;
            playWarningBeep(580, 0.25);
          }

          const currentStrikes = strikesRef.current;
          if (
            lookAwayCountRef.current >= lookAwayToleranceSeconds ||
            currentStrikes >= maxStrikes
          ) {
            disqualifiedRef.current = true;
            const disqReason =
              currentStrikes >= maxStrikes
                ? `Exceeded maximum proctoring strikes (${currentStrikes}/${maxStrikes}) by repeatedly looking away.`
                : `Continuous looking away / absence detected for > ${lookAwayToleranceSeconds} seconds.`;

            playWarningBeep(320, 0.6);
            onDisqualified?.(disqReason);

            setStatus((prev) => ({
              ...prev,
              isFocused: false,
              gazeDirection: direction,
              lookAwaySeconds: lookAwayCountRef.current,
              strikes: currentStrikes,
              isDisqualified: true,
              disqualificationReason: disqReason,
              violationType: "looking_away",
              focusScore: Math.max(10, prev.focusScore - 30),
              lastWarning: disqReason,
            }));
            return;
          }

          setStatus((prev) => ({
            ...prev,
            isTracking: true,
            isFocused: false,
            gazeDirection: direction,
            lookAwaySeconds: lookAwayCountRef.current,
            strikes: currentStrikes,
            violationType: "looking_away",
            lastWarning: `⚠️ ${violationDetail} (Strike ${currentStrikes}/${maxStrikes})`,
            focusScore: Math.max(30, prev.focusScore - 4),
          }));
        } else {
          // Candidate returned focus to center screen
          lookAwayCountRef.current = 0;
          setStatus((prev) => ({
            ...prev,
            isTracking: true,
            isFocused: prev.violationType === "tab_switch" ? false : true,
            gazeDirection: "center",
            lookAwaySeconds: 0,
            violationType: prev.violationType === "looking_away" ? "none" : prev.violationType,
            lastWarning: prev.violationType === "looking_away" ? null : prev.lastWarning,
            focusScore: Math.min(99, prev.focusScore + 1),
          }));
        }
      } catch (err) {
        console.warn("Proctor frame error:", err);
      }
    };

    const intervalId = setInterval(analyzeFrame, 750);
    return () => clearInterval(intervalId);
  }, [active, videoElement, maxStrikes, lookAwayToleranceSeconds, onDisqualified, playWarningBeep]);

  // Recalibrate / Reset proctoring state
  const resetProctor = () => {
    disqualifiedRef.current = false;
    strikesRef.current = 0;
    tabSwitchesRef.current = 0;
    lookAwayCountRef.current = 0;
    setStatus({
      isTracking: true,
      isFocused: true,
      gazeDirection: "center",
      violationType: "none",
      lookAwaySeconds: 0,
      strikes: 0,
      tabSwitchCount: 0,
      isDisqualified: false,
      disqualificationReason: null,
      focusScore: 98,
      lastWarning: null,
    });
  };

  if (!active) return null;

  return (
    <>
      {/* ── Live Proctor HUD Overlay Badge ────────────────────────────── */}
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 rounded-full bg-slate-950/90 border border-slate-800 px-2.5 py-1 text-[10px] font-mono backdrop-blur-md transition-all shadow-lg select-none">
        {status.isDisqualified ? (
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <XCircle className="h-3 w-3 animate-pulse" /> DISQUALIFIED
          </span>
        ) : !status.isFocused ? (
          <span className="flex items-center gap-1 text-amber-300 font-bold animate-pulse">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            {status.violationType === "tab_switch" ? "TAB SWITCH" : "LOOKING AWAY"} (Strike {status.strikes}/{maxStrikes})
          </span>
        ) : (
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> PROCTOR: FOCUSED
          </span>
        )}
      </div>

      {/* ── Bottom Camera Feed Alert Overlay Banner ───────────────────── */}
      {!status.isDisqualified && status.lastWarning && (
        <div className="absolute inset-x-2 bottom-2 z-30 rounded-xl bg-amber-500/95 text-slate-950 px-2.5 py-1.5 text-center font-bold text-[10px] leading-tight shadow-xl animate-bounce">
          {status.lastWarning}
        </div>
      )}

      {/* ── Disqualification Modal Overlay ─────────────────────────────── */}
      {status.isDisqualified && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in-up">
          <div className="w-full max-w-lg rounded-3xl border-2 border-rose-500/60 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center space-y-6 shadow-2xl shadow-rose-500/20">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 shadow-xl animate-pulse">
              <ShieldAlert className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block rounded-full bg-rose-500/20 border border-rose-500/40 px-3.5 py-1 text-xs font-mono font-bold text-rose-300 uppercase tracking-widest">
                Assessment Terminated
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Candidate Disqualified
              </h2>
              <p className="text-xs sm:text-sm text-rose-300 font-sans leading-relaxed">
                {status.disqualificationReason ||
                  "Anti-cheat monitoring detected critical violations (multiple tab switches or continuous camera absence)."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-left bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Violation</span>
                <p className="text-xs font-bold text-rose-400 capitalize">
                  {status.violationType === "tab_switch" ? "Tab Switch" : "Looking Away"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Strikes Accrued</span>
                <p className="text-xs font-bold text-rose-400">{status.strikes} / {maxStrikes}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Tab Switches</span>
                <p className="text-xs font-bold text-amber-400">{status.tabSwitchCount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={resetProctor}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Recalibrate &amp; Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
