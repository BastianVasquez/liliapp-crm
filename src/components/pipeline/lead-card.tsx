"use client";

import Link from "next/link";
import { ScoreBadge } from "@/components/ui/score-badge";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/types/lead";

interface LeadCardProps {
  lead: Lead;
  dragging: boolean;
  onDragStart: (leadId: string) => void;
  onDragEnd: () => void;
}

export function LeadCard({ lead, dragging, onDragStart, onDragEnd }: LeadCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(lead.lead_id);
      }}
      onDragEnd={onDragEnd}
      className={
        "cursor-grab select-none rounded-xl border border-border bg-surface p-3 shadow-[0_1px_2px_rgba(20,16,50,0.04)] transition-opacity active:cursor-grabbing" +
        (dragging ? " opacity-40" : "")
      }
    >
      <Link
        href={`/leads/${lead.lead_id}`}
        className="block text-sm font-medium text-foreground hover:underline"
        draggable={false}
      >
        {lead.empresa}
      </Link>
      <p className="mt-0.5 text-xs text-muted">
        {lead.nombre} · {lead.cargo || "—"}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <ScoreBadge score={lead.scoring} />
        <span className="text-xs text-muted">{lead.responsable}</span>
      </div>
      {lead.proximo_contacto && (
        <p className="mt-2 text-xs text-muted">Próximo: {formatDate(lead.proximo_contacto)}</p>
      )}
    </div>
  );
}
