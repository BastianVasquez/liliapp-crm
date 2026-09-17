"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { LeadCard } from "@/components/pipeline/lead-card";
import { useCrm } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

type SaveState = { leadId: string; status: "saving" | "saved" } | null;

export function PipelineBoard() {
  const { leads, updateLead } = useCrm();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);
  const [saveState, setSaveState] = useState<SaveState>(null);

  function handleDrop(status: LeadStatus) {
    if (!draggingId) return;
    const lead = leads.find((l) => l.lead_id === draggingId);
    setDragOverColumn(null);
    setDraggingId(null);
    if (!lead || lead.estado === status) return;

    setSaveState({ leadId: lead.lead_id, status: "saving" });
    // Optimistic update — se reemplaza por la llamada real a la API en Fase 8.
    updateLead(lead.lead_id, { estado: status });
    setTimeout(() => {
      setSaveState({ leadId: lead.lead_id, status: "saved" });
      setTimeout(() => setSaveState(null), 1200);
    }, 350);
  }

  return (
    <div>
      {saveState && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-lili-purple-soft px-3 py-1 text-xs font-medium text-lili-purple-dark">
          {saveState.status === "saving" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando…
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" /> Guardado
            </>
          )}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STATUSES.map((status) => {
          const columnLeads = leads.filter((l) => l.estado === status);
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(status);
              }}
              onDragLeave={() => setDragOverColumn((prev) => (prev === status ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(status);
              }}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-background/60 p-2.5",
                dragOverColumn === status && "border-lili-purple bg-lili-purple-soft/40"
              )}
            >
              <div className="flex items-center justify-between px-1.5 py-1">
                <h3 className="text-sm font-semibold text-foreground">{status}</h3>
                <span className="text-xs text-muted">{columnLeads.length}</span>
              </div>
              <div className="mt-1 flex flex-1 flex-col gap-2 min-h-[60px]">
                {columnLeads.map((lead) => (
                  <LeadCard
                    key={lead.lead_id}
                    lead={lead}
                    dragging={draggingId === lead.lead_id}
                    onDragStart={setDraggingId}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverColumn(null);
                    }}
                  />
                ))}
                {columnLeads.length === 0 && (
                  <p className="px-1.5 py-2 text-xs text-muted">Sin leads en este estado.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
