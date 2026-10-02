"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Overview", href: "/", icon: "space_dashboard", path: "overview" },
    ],
  },
  {
    label: "Preparation",
    items: [
      { label: "Resume Analyzer", href: "/resume-helper", icon: "description", path: "resume-analyzer" },
      { label: "OA Practice Hub", href: "/oa-rounds", icon: "memory", path: "oa-practice-hub" },
      { label: "AI Mock Interview", href: "/ai-interviewer", icon: "mic", path: "ai-mock-interview" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--surface-container-lowest)] z-50 flex flex-col justify-between border-r border-[var(--outline-variant)]/30 select-none">
      {/* Top section */}
      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--outline-variant)]/20">
          <Link href="/" className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[var(--secondary)] text-[20px]">terminal</span>
            <span className="font-[var(--font-headline)] text-[20px] font-semibold leading-[28px] tracking-[-0.015em] text-[var(--on-surface)]">
              Placement<span className="text-[var(--primary)]">Buddy</span>
            </span>
          </Link>
          <span className="font-mono text-[10px] font-medium leading-[14px] tracking-[0.05em] text-[var(--on-surface-variant)] bg-[var(--surface-container)] px-1 py-0.5 rounded border border-[var(--outline-variant)]/40">
            v2.4
          </span>
        </div>

        {/* Nav groups */}
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="px-2 pt-4 pb-2">
            <div className="text-[var(--on-surface-variant)]/60 font-mono text-[10px] font-medium leading-[14px] tracking-[0.05em] uppercase px-2 mb-1">
              {group.label}
            </div>
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-[13px] leading-[20px] ${
                      active
                        ? "bg-[var(--surface-container-high)] text-[var(--on-surface)] font-semibold border-l-2 border-[var(--primary)]"
                        : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom: User profile */}
      <div className="p-2 border-t border-[var(--outline-variant)]/20 bg-[var(--surface-container-lowest)]/80 flex flex-col gap-1">
        {session ? (
          <div
            className="flex items-center gap-1 px-1 py-1 rounded hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
            onClick={() => signOut()}
            title="Click to sign out"
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[var(--on-primary)] text-[18px]">person</span>
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] leading-[20px] text-[var(--on-surface)] truncate font-medium">
                {session.user?.name || "Student"}
              </span>
              <span className="font-mono text-[10px] leading-[14px] tracking-[0.05em] text-[var(--on-surface-variant)] truncate">
                {session.user?.email || "SDE-1 Prep"}
              </span>
            </div>
            <span className="material-symbols-outlined text-[var(--on-surface-variant)] text-[16px]">logout</span>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-2 py-2 rounded bg-[var(--primary)] text-[var(--on-primary)] font-mono text-[12px] font-medium leading-[16px] tracking-[0.03em] hover:opacity-90 transition-opacity w-full justify-center"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </aside>
  );
}
