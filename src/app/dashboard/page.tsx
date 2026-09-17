"use client";

import { Users, Handshake, Presentation, FileText, Trophy, Activity as ActivityIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { LEAD_STATUSES } from "@/types/lead";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";

export default function DashboardPage() {
  const { leads, tasks, activities, completeTask } = useCrm();
  const { showToast } = useToast();

  const total = leads.length;
  const activos = leads.filter((l) => !["Ganado", "Perdido"].includes(l.estado)).length;
  const reuniones = leads.filter((l) => l.estado === "Reunión").length;
  const propuestas = leads.filter((l) => l.estado === "Propuesta").length;
  const pilotos = leads.filter((l) => l.estado === "Piloto").length;
  const ganados = leads.filter((l) => l.estado === "Ganado").length;

  const pipelineSummary = LEAD_STATUSES.filter(
    (status) => !["Perdido", "En pausa"].includes(status)
  ).map((status) => ({
    status,
    count: leads.filter((l) => l.estado === status).length,
  }));

  const pendingTasks = tasks.filter((t) => t.estado === "Pendiente");
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Vista general del proceso comercial de LiLi — datos de ejemplo, sin conectar aún a Google Sheets."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total leads" value={total} icon={Users} />
        <KpiCard label="Leads activos" value={activos} icon={Handshake} />
        <KpiCard label="Reuniones" value={reuniones} icon={Presentation} />
        <KpiCard label="Propuestas" value={propuestas} icon={FileText} />
        <KpiCard label="Pilotos" value={pilotos} icon={ActivityIcon} />
        <KpiCard label="Ganados" value={ganados} icon={Trophy} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 xl:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Mis tareas de hoy</h2>
          {pendingTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No tienes tareas pendientes.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingTasks.map((task) => (
                <li key={task.task_id} className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      completeTask(task.task_id);
                      showToast("Tarea completada");
                    }}
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-md border border-border hover:border-lili-purple"
                    aria-label="Completar tarea"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{task.titulo}</p>
                    <p className="text-xs text-muted">
                      Vence {formatDate(task.fecha_vencimiento)} · {task.prioridad}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 xl:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Pipeline</h2>
          <ul className="mt-4 space-y-2.5">
            {pipelineSummary.map(({ status, count }) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <StatusBadge status={status} />
                <span className="font-medium text-foreground">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 xl:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Actividad reciente</h2>
          {recentActivities.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Todavía no hay actividad registrada.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.activity_id} className="text-sm">
                  <p className="text-foreground">{activity.descripcion}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {activity.responsable} · {formatDate(activity.fecha)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
