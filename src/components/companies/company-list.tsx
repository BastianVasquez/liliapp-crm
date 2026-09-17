"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Building2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CompanyForm } from "@/components/companies/company-form";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import type { Company } from "@/types/company";

export function CompanyList() {
  const { companies, leads, deleteCompany } = useCrm();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) => c.empresa.toLowerCase().includes(q) || c.industria.toLowerCase().includes(q)
    );
  }, [companies, query]);

  function openCreate() {
    setEditingCompany(undefined);
    setFormOpen(true);
  }

  function openEdit(company: Company) {
    setEditingCompany(company);
    setFormOpen(true);
    setOpenMenu(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por empresa o industria…"
            className="pl-9"
          />
        </div>
        <Button size="sm" onClick={openCreate} className="ml-auto">
          <Plus className="h-4 w-4" />
          Nueva empresa
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hay empresas"
          description="Comienza agregando tu primera empresa."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Crear empresa
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => {
            const contactCount = leads.filter((l) => l.empresa_id === company.empresa_id).length;
            return (
              <div key={company.empresa_id} className="relative rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/companies/${company.empresa_id}`}
                      className="text-sm font-semibold text-foreground hover:underline"
                    >
                      {company.empresa}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {company.industria || "Sin industria"} · {company.pais}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === company.empresa_id ? null : company.empresa_id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground"
                    aria-label="Más acciones"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenu === company.empresa_id && (
                    <div className="absolute right-4 top-11 z-20 w-40 rounded-xl border border-border bg-surface py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => openEdit(company)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-background"
                      >
                        <Pencil className="h-4 w-4" /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(company);
                          setOpenMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft"
                      >
                        <Trash2 className="h-4 w-4" /> Eliminar
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  <span>{company.tipo_cliente}</span>
                  <span>·</span>
                  <span>Potencial {company.potencial}</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted">
                    {contactCount} contacto{contactCount === 1 ? "" : "s"}
                  </span>
                  <span className="text-muted">{company.responsable}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CompanyForm open={formOpen} onOpenChange={setFormOpen} company={editingCompany} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar empresa"
        description={`¿Seguro que quieres eliminar ${deleteTarget?.empresa}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleteTarget) {
            deleteCompany(deleteTarget.empresa_id);
            showToast("Empresa eliminada");
          }
        }}
      />
    </div>
  );
}
