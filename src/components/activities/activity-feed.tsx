"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ActivityForm } from "@/components/activities/activity-form";
import { useCrm } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import { ACTIVITY_TYPES, type ActivityType } from "@/types/activity";

const TYPE_FILTERS: (ActivityType | "Todos")[] = ["Todos", ...ACTIVITY_TYPES];

export function ActivityFeed() {
  const { activities, leads } = useCrm();
  const [filter, setFilter] = useState<(typeof TYPE_FILTERS)[number]>("Todos");
  const [formOpen, setFormOpen] = useState(false);

  const leadById = useMemo(() => new Map(leads.map((l) => [l.lead_id, l])), [leads]);

  const filtered = useMemo(() => {
    const list = filter === "Todos" ? activities : activities.filter((a) => a.tipo === filter);
    return [...list].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [activities, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === type
                  ? "bg-lili-purple text-white"
                  : "bg-surface text-muted hover:bg-lili-purple-soft hover:text-lili-purple-dark"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)} className="ml-auto">
          <Plus className="h-4 w-4" />
          Registrar actividad
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No hay actividad registrada"
          description="Registra emails, llamadas, reuniones, WhatsApp o LinkedIn a medida que avanzas con tus leads."
          action={
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Registrar actividad
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {filtered.map((activity) => {
              const lead = leadById.get(activity.lead_id);
              return (
                <li key={activity.activity_id} className="flex flex-wrap items-start gap-3 px-4 py-3.5">
                  <span className="mt-0.5 rounded-full bg-lili-purple-soft px-2.5 py-1 text-xs font-medium text-lili-purple-dark">
                    {activity.tipo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{activity.descripcion}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {lead ? (
                        <Link href={`/leads/${lead.lead_id}`} className="hover:underline">
                          {lead.nombre} — {lead.empresa}
                        </Link>
                      ) : (
                        "Lead eliminado"
                      )}
                      {" · "}
                      {activity.responsable} · {formatDate(activity.fecha)}
                    </p>
                    {activity.resultado && (
                      <p className="mt-0.5 text-xs text-muted">Resultado: {activity.resultado}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <ActivityForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
