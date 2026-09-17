import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/lead";

const STATUS_STYLES: Record<LeadStatus, string> = {
  Nuevo: "bg-lili-purple-soft text-lili-purple-dark",
  Contactado: "bg-[#e4ecfb] text-[#2c5cc5]",
  Respondió: "bg-[#e4ecfb] text-[#2c5cc5]",
  Reunión: "bg-warning-soft text-warning",
  Propuesta: "bg-warning-soft text-warning",
  Piloto: "bg-[#fdeee2] text-[#c05a1d]",
  Negociación: "bg-[#fdeee2] text-[#c05a1d]",
  Ganado: "bg-success-soft text-success",
  Perdido: "bg-danger-soft text-danger",
  "En pausa": "bg-[#eef0f5] text-muted",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}
