import type { Task } from "@/types/task";
import type { Activity } from "@/types/activity";

// Los leads y empresas reales viven en seed-data.ts (migrados desde la planilla SDR).
// Tareas y actividades no existían como registros estructurados en la planilla original
// (solo texto libre en "Notas", que ya se incorporó a cada lead), así que arrancan vacías:
// se van llenando a medida que el equipo las crea desde la app.
export const mockTasks: Task[] = [];
export const mockActivities: Activity[] = [];
