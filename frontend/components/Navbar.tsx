"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Sparkles,
  FileText,
  Code2,
  Video,
  LayoutDashboard,
  LogOut,
  LogIn,
  Menu,
  X,
  UserCheck,
  Lock,
  Search,
  Command,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      protected: false,
    },
    {
      label: "ATS Resume Helper",
      href: "/resume-helper",
      icon: FileText,
      badge: "Module 01",
      protected: true,
    },
    {
      label: "OA Practice Hub",
      href: "/oa-rounds",
      icon: Code2,
      badge: "Module 02",
      protected: true,
    },
    {
      label: "AI Mock Interviewer",
      href: "/ai-interviewer",
      icon: Video,
      badge: "Module 03",
      protected: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                Placement<span className="text-indigo-400">Buddy</span>
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
                v2.4 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">AI Technical Interview &amp; OA Prep Platform</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 p-1.5 shadow-inner backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isLocked = item.protected && !session;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : isLocked ? "text-slate-500" : "text-indigo-400"}`} />
                <span className={isLocked ? "text-slate-500" : ""}>{item.label}</span>
                {/* Lock icon for protected routes when not signed in */}
                {isLocked && (
                  <Lock className="h-3 w-3 text-amber-400" aria-label="Sign in required" />
                )}
                {/* Badge for unlocked protected routes */}
                {item.badge && !isActive && !isLocked && (
                  <span className="rounded-md bg-slate-800/90 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 border border-slate-700/60">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth & Profile Section */}
        <div className="hidden sm:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-full py-1.5 px-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="h-7 w-7 rounded-full ring-2 ring-indigo-500/40 object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">
                    {session.user?.name || "Student Candidate"}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <UserCheck className="h-2.5 w-2.5" /> Authenticated
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="ml-1 rounded-full p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="group flex items-center gap-2.5 rounded-full bg-white px-4.5 py-2 text-xs font-bold text-slate-950 hover:bg-slate-100 shadow-lg shadow-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isLocked = item.protected && !session;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isLocked && <Lock className="h-3.5 w-3.5 text-amber-400" />}
                  {item.badge && !isLocked && (
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-indigo-400 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}


          <div className="pt-2 border-t border-slate-800">
            {session ? (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{session.user?.name}</span>
                    <span className="text-xs text-slate-400">{session.user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-slate-950"
              >
                <LogIn className="h-4 w-4" /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
