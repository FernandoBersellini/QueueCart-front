"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Categorias", href: "/categorias" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Sobre", href: "/sobre" },
];

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
      <div
        className="flex items-center gap-8 px-6 py-4.5"
        style={{ maxWidth: 1120, margin: "0 auto" }}
      >
        <Link href="/" className="logo flex items-center gap-2.5 font-bold text-xl tracking-tight whitespace-nowrap">
          <span
            className="flex items-center justify-center shrink-0 rounded-lg w-7.5 h-7.5 text-white font-bold text-[15px]"
            style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent))" }}
          >
            Q
          </span>
          QueueCart
        </Link>

        <nav className="hidden md:flex gap-7 text-sm font-medium flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors"
              style={{ color: "var(--muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3.5 ml-auto">
          <div
            className="hidden md:flex items-center gap-2 rounded-full border px-3.5 py-2 w-55"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.55, flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar produtos"
              className="border-none bg-transparent outline-none text-[13px] w-full"
              style={{ color: "var(--text)" }}
            />
          </div>

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

          <button
            aria-label="Carrinho"
            className="relative flex items-center justify-center shrink-0 rounded-full border w-9.5 h-9.5 cursor-pointer"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[10px] font-semibold w-4.25 h-4.25"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
