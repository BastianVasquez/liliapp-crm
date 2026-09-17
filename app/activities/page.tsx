import { ListTodo } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function ActivitiesPage() {
  return (
    <div>
      <PageHeader
        title="Actividades"
        description="Historial de emails, llamadas, reuniones, WhatsApp y LinkedIn."
      />
      <EmptyState
        icon={ListTodo}
        title="El historial de actividades llega en la Fase 5"
        description="Timeline de actividades y el formulario para registrar una nueva se construyen en ese incremento."
      />
    </div>
  );
}
