"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Link2,
  Building2,
  CalendarClock,
  Pencil,
  ListPlus,
  CheckSquare,
  Sparkles,
  MessageSquareText,
  BrainCircuit,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBadge } from "@/components/ui/score-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadForm } from "@/components/leads/lead-form";
import { ActivityForm } from "@/components/activities/activity-form";
import { TaskForm } from "@/components/tasks/task-form";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import { cn, formatDate } from "@/lib/utils";
import { LEAD_STATUSES } from "@/types/lead";
import { UserRound } from "lucide-react";

const AI_ACTIONS = [
  { icon: MessageSquareText, label: "Generar follow-up con IA" },
  { icon: BrainCircuit, label: "Analizar lead" },
  { icon: Compass, label: "Recomendar próxima acción" },
];

export function LeadDetail({ leadId }: { leadId: string }) {
  const { leads, activities, updateLead } = useCrm();
  const { showToast } = useToast();
  const lead = leads.find((l) => l.lead_id === leadId);

  const [editOpen, setEditOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  if (!lead) {
    return (
      <div>
        <Link href="/leads" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver a Leads
        </Link>
        <div className="mt-6">
          <EmptyState
            icon={UserRound}
            title="No encontramos este lead"
            description={`No existe (o fue eliminado) un lead con id ${leadId}.`}
          />
        </div>
      </div>
    );
  }

  const timeline = activities
    .filter((a) => a.lead_id === lead.lead_id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div>
      <Link href="/leads" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a Leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{lead.nombre}</h1>
          <p className="text-sm text-muted">
            {lead.cargo} · {lead.empresa}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ScoreBadge score={lead.scoring} />
          <Select
            value={lead.estado}
            onChange={(e) => {
              updateLead(lead.lead_id, { estado: e.target.value as typeof lead.estado });
              showToast("Cambio guardado");
            }}
            className="w-auto min-w-[160px]"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Información principal</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field icon={Mail} label="Email" value={lead.email} />
              <Field icon={Phone} label="Teléfono" value={lead.telefono || "—"} />
              <Field icon={Link2} label="LinkedIn" value={lead.linkedin || "—"} />
              <Field icon={Building2} label="Tipo cliente" value={lead.tipo_cliente} />
              <Field label="País" value={lead.pais} />
              <Field label="Fuente" value={lead.fuente} />
              <Field label="Responsable" value={lead.responsable} />
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Información comercial</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted">Dolor detectado</p>
                <p className="mt-1 text-foreground">{lead.dolor_detectado || "Sin registrar."}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Solución propuesta</p>
                <p className="mt-1 text-foreground">{lead.solucion_propuesta || "Sin registrar."}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Notas</p>
                <p className="mt-1 text-foreground">{lead.notas || "Sin notas."}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Historial</h2>
            {timeline.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Todavía no hay actividad registrada para este lead.</p>
            ) : (
              <ol className="mt-4 space-y-4 border-l border-border pl-4">
                {timeline.map((activity) => (
                  <li key={activity.activity_id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-lili-purple" />
                    <p className="text-xs text-muted">
                      {formatDate(activity.fecha)} · {activity.tipo}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{activity.descripcion}</p>
                    {activity.resultado && (
                      <p className="mt-0.5 text-xs text-muted">Resultado: {activity.resultado}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Seguimiento</h2>
            <div className="mt-4 space-y-3 text-sm">
              <Field icon={CalendarClock} label="Último contacto" value={formatDate(lead.ultimo_contacto)} />
              <Field icon={CalendarClock} label="Próximo contacto" value={formatDate(lead.proximo_contacto)} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Acciones</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Button size="sm" variant="secondary" onClick={() => setActivityOpen(true)}>
                <ListPlus className="h-4 w-4" /> Registrar actividad
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setTaskOpen(true)}>
                <CheckSquare className="h-4 w-4" /> Crear tarea
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" /> Editar lead
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-lili-purple-dark" /> LiLi AI
            </h2>
            <div className="mt-3 space-y-2">
              {AI_ACTIONS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  className={cn(
                    "flex w-full cursor-not-allowed items-center justify-between rounded-lg bg-background px-3 py-2 text-left text-sm text-muted"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <span className="rounded-full bg-lili-purple-soft px-2 py-0.5 text-xs text-lili-purple-dark">
                    Próximamente
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <LeadForm open={editOpen} onOpenChange={setEditOpen} lead={lead} />
      <ActivityForm open={activityOpen} onOpenChange={setActivityOpen} lead={lead} />
      <TaskForm open={taskOpen} onOpenChange={setTaskOpen} lead={lead} />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
