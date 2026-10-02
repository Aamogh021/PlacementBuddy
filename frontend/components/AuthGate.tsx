"use client";

import { useSession, signIn } from "next-auth/react";
import { ShieldCheck, LogIn, Sparkles, Lock } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
  featureName: string;
  featureDescription?: string;
}

export default function AuthGate({ children, featureName, featureDescription }: AuthGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-10 text-center shadow-2xl backdrop-blur-xl space-y-7">
          {/* Lock Icon */}
          <div className="relative inline-flex">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto">
              <Lock className="h-9 w-9" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[9px] font-black">
              <ShieldCheck className="h-3 w-3" />
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-400">
              <Sparkles className="h-3 w-3" /> Protected Feature
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Sign in to access <span className="text-indigo-400">{featureName}</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              {featureDescription ||
                "This feature requires a free Google account to track your progress, personalize your experience, and save your results."}
            </p>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-1 gap-2 text-left">
            {[
              "Save your resume ATS scores and history",
              "Personalized interview questions per session",
              "Track your OA practice scores over time",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>
              <LogIn className="inline h-4 w-4 mr-1" />
              Continue with Google — It&apos;s Free
            </span>
          </button>

          <p className="text-[10px] text-slate-500">
            By signing in you agree to PlacementBuddy&apos;s terms. We never sell your data.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
