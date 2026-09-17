"use client";

import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { NavLink } from "./nav-link";

export function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:px-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-lili-purple-soft lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted lg:max-w-sm">
          <Search className="h-4 w-4" />
          <span>Buscar leads, empresas, contactos…</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">Bastián</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lili-purple text-sm font-semibold text-white">
            B
          </span>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className="relative flex w-72 flex-col gap-1 px-4 py-6"
            style={{
              background:
                "linear-gradient(180deg, var(--lili-purple) 0%, var(--lili-purple-dark) 100%)",
            }}
          >
            <div className="mb-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-lili-purple-dark">
                  Li
                </span>
                <span className="text-lg font-semibold text-white">LiLi CRM</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} onNavigate={() => setOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
