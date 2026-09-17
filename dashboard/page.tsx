import { Users, Handshake, Presentation, FileText, Trophy, Activity as ActivityIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockLeads, mockTasks, mockActivities } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { LEAD_STATUSES } from "@/types/lead";

export default function DashboardPage() {
  const total = mockLeads.length;
  const activos = mockLeads.filter((l) => !["Ganado", "Perdido"].includes(l.estado)).length;
  const reuniones = mockLeads.filter((l) => l.estado === "Reunión").length;
  const propuestas = mockLeads.filter((l) => l.estado === "Propuesta").length;
  const pilotos = mockLeads.filter((l) => l.estado === "Piloto").length;
  const ganados = mockLeads.filter((l) => l.estado === "Ganado").length;

  const pipelineSummary = LEAD_STATUSES.filter(
    (status) => !["Perdido", "En pausa"].includes(status)
  ).map((status) => ({
    status,
    count: mockLeads.filter((l) => l.estado === status).length,
  }));

  const pendingTasks = mockTasks.filter((t) => t.estado === "Pendiente");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Vista general del proceso comercial de LiLi — datos de ejemplo, Fase 1."
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
          <ul className="mt-4 space-y-3">
            {pendingTasks.map((task) => (
              <li key={task.task_id} className="flex items-start gap-3">
                <span className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-md border border-border" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{task.titulo}</p>
                  <p className="text-xs text-muted">
                    Vence {formatDate(task.fecha_vencimiento)} · {task.prioridad}
                  </p>
                </div>
              </li>
            ))}
          </ul>
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
          <ul className="mt-4 space-y-4">
            {mockActivities.map((activity) => (
              <li key={activity.activity_id} className="text-sm">
                <p className="text-foreground">{activity.descripcion}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {activity.responsable} · {formatDate(activity.fecha)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
