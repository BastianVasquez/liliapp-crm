"use client";

import { NAV_ITEMS } from "./nav-items";
import { NavLink } from "./nav-link";

export function Sidebar() {
  return (
    <aside
      className="hidden w-64 shrink-0 flex-col gap-1 px-4 py-6 lg:flex"
      style={{
        background:
          "linear-gradient(180deg, var(--lili-purple) 0%, var(--lili-purple-dark) 100%)",
      }}
    >
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-lili-purple-dark">
          Li
        </span>
        <span className="text-lg font-semibold text-white">LiLi CRM</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-white/10 px-3 py-3 text-xs text-white/70">
        Conectado a Google Sheets
        <br />
        <span className="text-white/50">Sincronización manual — Fase 8</span>
      </div>
    </aside>
  );
}
