import { Sparkles, MessageSquareText, BrainCircuit, Compass, SearchCode, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const AI_CARDS = [
  {
    icon: MessageSquareText,
    title: "Generar follow-up",
    description: "Redacta un mensaje de seguimiento a partir del historial del lead.",
  },
  {
    icon: BrainCircuit,
    title: "Analizar lead",
    description: "Evalúa la conversación y el contexto para sugerir un LiLi Fit Score.",
  },
  {
    icon: Compass,
    title: "Recomendar próxima acción",
    description: "Sugiere el siguiente paso comercial según el estado del lead.",
  },
  {
    icon: SearchCode,
    title: "Buscar con lenguaje natural",
    description: 'Ej: "leads de retail en Chile sin contacto hace 2 semanas".',
  },
  {
    icon: CalendarClock,
    title: "Resumen diario",
    description: "Un resumen de la actividad comercial del día, listo cada mañana.",
  },
];

export default function AiPage() {
  return (
    <div>
      <PageHeader title="LiLi AI" description="Tu copiloto comercial." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {AI_CARDS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="relative rounded-2xl border border-border bg-surface p-5 opacity-80"
          >
            <span className="absolute right-4 top-4 rounded-full bg-lili-purple-soft px-2.5 py-1 text-xs font-medium text-lili-purple-dark">
              Próximamente
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lili-purple-soft text-lili-purple-dark">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-muted">{description}</p>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-[#eef0f5] px-3 py-2 text-sm font-medium text-muted"
            >
              <Sparkles className="h-4 w-4" />
              Próximamente
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
