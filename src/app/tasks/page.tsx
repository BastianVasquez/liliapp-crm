import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Tareas de hoy, vencidas y próximas, con prioridad y responsable."
      />
      <EmptyState
        icon={CheckSquare}
        title="La gestión de tareas llega en la Fase 6"
        description="Vistas por Hoy / Vencidas / Próximas y la opción de completar tareas se construyen en ese incremento."
      />
    </div>
  );
}
