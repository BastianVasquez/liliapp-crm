import { PageHeader } from "@/components/layout/page-header";
import { TaskList } from "@/components/tasks/task-list";

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Tareas de hoy, vencidas y próximas, con prioridad y responsable."
      />
      <TaskList />
    </div>
  );
}
