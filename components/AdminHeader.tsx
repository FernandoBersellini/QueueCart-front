"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function AdminHeader() {
  const { user, logout } = useAuth();

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
