"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, ShoppingBag, LayoutList } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: Gauge },
  { label: "Produtos", href: "/admin/products", icon: ShoppingBag },
  { label: "Categorias", href: "/admin/categories", icon: LayoutList },
];

export function AdminSideBar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 px-4 pt-8 pb-6" style={{ borderColor: "var(--border)" }}>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium"
              style={{
                background: isActive ? "var(--card-bg)" : "transparent",
                color: isActive ? "var(--text)" : "var(--muted)",
              }}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}