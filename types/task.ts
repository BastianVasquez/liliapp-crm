export const TASK_STATUSES = ["Pendiente", "Completada", "Cancelada"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["Alta", "Media", "Baja"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  task_id: string;
  lead_id?: string;
  empresa_id?: string;
  titulo: string;
  descripcion?: string;
  fecha_vencimiento: string;
  prioridad: TaskPriority;
  estado: TaskStatus;
  responsable: string;
  created_at: string;
  completed_at?: string;
}
