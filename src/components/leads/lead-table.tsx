"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, ArrowUpDown, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBadge } from "@/components/ui/score-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LeadForm } from "@/components/leads/lead-form";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import { cn, formatDate } from "@/lib/utils";
import { COUNTRIES, LEAD_STATUSES, CLIENT_TYPES, type Lead } from "@/types/lead";
import { Users } from "lucide-react";

type SortKey = "scoring" | "ultimo_contacto" | "proximo_contacto" | "empresa" | "estado";

export function LeadTable() {
  const { leads, deleteLead } = useCrm();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("scoring");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = leads.filter((lead) => {
      const matchesQuery =
        !q ||
        lead.nombre.toLowerCase().includes(q) ||
        lead.empresa.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.telefono ?? "").toLowerCase().includes(q);
      const matchesPais = !pais || lead.pais === pais;
      const matchesEstado = !estado || lead.estado === estado;
      const matchesTipo = !tipoCliente || lead.tipo_cliente === tipoCliente;
      return matchesQuery && matchesPais && matchesEstado && matchesTipo;
    });

    result = [...result].sort((a, b) => {
      let diff = 0;
      if (sortKey === "scoring") diff = a.scoring - b.scoring;
      else if (sortKey === "empresa") diff = a.empresa.localeCompare(b.empresa);
      else if (sortKey === "estado") diff = a.estado.localeCompare(b.estado);
      else {
        const av = a[sortKey] ? new Date(a[sortKey] as string).getTime() : 0;
        const bv = b[sortKey] ? new Date(b[sortKey] as string).getTime() : 0;
        diff = av - bv;
      }
      return sortDir === "asc" ? diff : -diff;
    });

    return result;
  }, [leads, query, pais, estado, tipoCliente, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function openCreate() {
    setEditingLead(undefined);
    setFormOpen(true);
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setFormOpen(true);
    setOpenMenu(null);
  }

  const columns: { key: SortKey | null; label: string }[] = [
    { key: null, label: "Lead" },
    { key: "empresa", label: "Empresa" },
    { key: null, label: "Cargo" },
    { key: null, label: "País" },
    { key: null, label: "Tipo Cliente" },
    { key: "scoring", label: "Scoring" },
    { key: "estado", label: "Estado" },
    { key: null, label: "Responsable" },
    { key: "ultimo_contacto", label: "Último Contacto" },
    { key: "proximo_contacto", label: "Próximo Contacto" },
    { key: null, label: "" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, empresa, email o teléfono…"
            className="pl-9"
          />
        </div>
        <Select
          value={pais}
          onChange={(e) => {
            setPais(e.target.value);
            setPage(1);
          }}
          className="w-auto min-w-[140px]"
        >
          <option value="">Todos los países</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            setPage(1);
          }}
          className="w-auto min-w-[150px]"
        >
          <option value="">Todos los estados</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select
          value={tipoCliente}
          onChange={(e) => {
            setTipoCliente(e.target.value);
            setPage(1);
          }}
          className="w-auto min-w-[150px]"
        >
          <option value="">Todos los tipos</option>
          {CLIENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Button size="sm" onClick={openCreate} className="ml-auto">
          <Plus className="h-4 w-4" />
          Nuevo lead
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay leads"
          description="Comienza agregando tu primer lead."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Crear lead
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                {columns.map((col) => (
                  <th key={col.label || "actions"} className="px-4 py-3 font-medium">
                    {col.key ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key as SortKey)}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {col.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead) => (
                <tr key={lead.lead_id} className="border-b border-border last:border-0 hover:bg-background/60">
                  <td className="px-4 py-3">
                    <Link href={`/leads/${lead.lead_id}`} className="font-medium text-foreground hover:underline">
                      {lead.nombre}
                    </Link>
                    <p className="text-xs text-muted">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{lead.empresa}</td>
                  <td className="px-4 py-3 text-muted">{lead.cargo || "—"}</td>
                  <td className="px-4 py-3 text-muted">{lead.pais}</td>
                  <td className="px-4 py-3 text-muted">{lead.tipo_cliente}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={lead.scoring} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.estado} />
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.responsable}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(lead.ultimo_contacto)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(lead.proximo_contacto)}</td>
                  <td className="relative px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === lead.lead_id ? null : lead.lead_id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground"
                      aria-label="Más acciones"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === lead.lead_id && (
                      <div className="absolute right-4 top-11 z-20 w-40 rounded-xl border border-border bg-surface py-1 shadow-lg">
                        <Link
                          href={`/leads/${lead.lead_id}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Eye className="h-4 w-4" /> Abrir
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(lead)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-background"
                        >
                          <Pencil className="h-4 w-4" /> Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(lead);
                            setOpenMenu(null);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft"
                          )}
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>
            {filtered.length} lead{filtered.length === 1 ? "" : "s"}
            {filtered.length > PAGE_SIZE &&
              ` · mostrando ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                currentPage * PAGE_SIZE,
                filtered.length
              )}`}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}

      <LeadForm open={formOpen} onOpenChange={setFormOpen} lead={editingLead} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar lead"
        description={`¿Seguro que quieres eliminar a ${deleteTarget?.nombre}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleteTarget) {
            deleteLead(deleteTarget.lead_id);
            showToast("Lead eliminado");
          }
        }}
      />
    </div>
  );
}
