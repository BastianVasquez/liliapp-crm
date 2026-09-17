import { KanbanSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Kanban de oportunidades con drag & drop y sincronización a Google Sheets."
      />
      <EmptyState
        icon={KanbanSquare}
        title="El Kanban llega en la Fase 3"
        description="Columnas por estado, tarjetas con scoring y drag & drop conectado a la API se construyen en el siguiente incremento."
      />
    </div>
  );
}
