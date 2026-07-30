"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-8 px-6 py-4.5">
        <Link href="/admin" className="logo flex items-center gap-2.5 font-bold text-xl tracking-tight whitespace-nowrap">
          <span
            className="flex items-center justify-center shrink-0 rounded-lg w-7.5 h-7.5 text-white font-bold text-[15px]"
            style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent))" }}
          >
            Q
          </span>
          QueueCart Admin
        </Link>

        <div className="flex items-center gap-3.5 ml-auto whitespace-nowrap">
          <Link href="/" className="text-sm font-medium" style={{ color: "var(--muted)" }}>
            Voltar à loja
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="relative flex items-center justify-center shrink-0 rounded-full border w-9.5 h-9.5 cursor-pointer"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </button>

          {user && (
            <button
              onClick={() => logout()}
              className="text-sm font-medium cursor-pointer"
              style={{ color: "var(--muted)" }}
            >
              Olá, {user.name.split(" ")[0]} · Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
