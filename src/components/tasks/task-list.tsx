"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskForm } from "@/components/tasks/task-form";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import { cn, formatDate } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/task";

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  Alta: "bg-danger-soft text-danger",
  Media: "bg-warning-soft text-warning",
  Baja: "bg-[#eef0f5] text-muted",
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function TaskList() {
  const { tasks, leads, completeTask } = useCrm();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const leadById = useMemo(() => new Map(leads.map((l) => [l.lead_id, l])), [leads]);

  const { vencidas, hoy, proximas, completadas } = useMemo(() => {
    const today = startOfToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pending = tasks.filter((t) => t.estado === "Pendiente");
    const done = tasks.filter((t) => t.estado === "Completada");

    const sortByDate = (a: Task, b: Task) =>
      new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime();

    return {
      vencidas: pending.filter((t) => new Date(t.fecha_vencimiento) < today).sort(sortByDate),
      hoy: pending
        .filter((t) => {
          const d = new Date(t.fecha_vencimiento);
          return d >= today && d < tomorrow;
        })
        .sort(sortByDate),
      proximas: pending.filter((t) => new Date(t.fecha_vencimiento) >= tomorrow).sort(sortByDate),
      completadas: done.sort(
        (a, b) => new Date(b.completed_at ?? b.created_at).getTime() - new Date(a.completed_at ?? a.created_at).getTime()
      ),
    };
  }, [tasks]);

  const totalPending = vencidas.length + hoy.length + proximas.length;

  function handleComplete(task: Task) {
    completeTask(task.task_id);
    showToast("Tarea completada");
  }

  function TaskRow({ task }: { task: Task }) {
    const lead = task.lead_id ? leadById.get(task.lead_id) : undefined;
    return (
      <li className="flex items-start gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => handleComplete(task)}
          className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border border-border hover:border-lili-purple"
          aria-label="Completar tarea"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">{task.titulo}</p>
          {task.descripcion && <p className="mt-0.5 text-xs text-muted">{task.descripcion}</p>}
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span
              className={cn("rounded-full px-2 py-0.5 font-medium", PRIORITY_STYLES[task.prioridad])}
            >
              {task.prioridad}
            </span>
            <span>Vence {formatDate(task.fecha_vencimiento)}</span>
            <span>{task.responsable}</span>
            {lead && (
              <Link href={`/leads/${lead.lead_id}`} className="hover:underline">
                {lead.nombre} — {lead.empresa}
              </Link>
            )}
          </p>
        </div>
      </li>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowCompleted((v) => !v)}
          className="text-xs text-muted hover:text-foreground"
        >
          {showCompleted ? "Ocultar completadas" : `Ver completadas (${completadas.length})`}
        </button>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Crear tarea
        </Button>
      </div>

      {totalPending === 0 && !showCompleted ? (
        <EmptyState
          icon={CheckSquare}
          title="No tienes tareas pendientes"
          description="Crea una tarea para hacer seguimiento a tus leads."
          action={
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Crear tarea
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {vencidas.length > 0 && (
            <section>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
                Vencidas <span className="text-xs font-normal text-muted">({vencidas.length})</span>
              </h2>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {vencidas.map((t) => (
                  <TaskRow key={t.task_id} task={t} />
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Hoy <span className="text-xs font-normal text-muted">({hoy.length})</span>
            </h2>
            {hoy.length === 0 ? (
              <p className="text-sm text-muted">Sin tareas para hoy.</p>
            ) : (
              <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {hoy.map((t) => (
                  <TaskRow key={t.task_id} task={t} />
                ))}
              </ul>
            )}
          </section>

          {proximas.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Próximas <span className="text-xs font-normal text-muted">({proximas.length})</span>
              </h2>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {proximas.map((t) => (
                  <TaskRow key={t.task_id} task={t} />
                ))}
              </ul>
            </section>
          )}

          {showCompleted && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-muted">
                Completadas <span className="text-xs font-normal">({completadas.length})</span>
              </h2>
              {completadas.length === 0 ? (
                <p className="text-sm text-muted">Todavía no completas ninguna tarea.</p>
              ) : (
                <ul className="divide-y divide-border rounded-2xl border border-border bg-surface opacity-70">
                  {completadas.map((t) => (
                    <li key={t.task_id} className="px-4 py-3 text-sm text-muted line-through">
                      {t.titulo}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}

      <TaskForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
