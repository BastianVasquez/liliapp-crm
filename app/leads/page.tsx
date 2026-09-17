import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function LeadsPage() {
  return (
    <div>
      <PageHeader
        title="Leads"
        description="Tabla con búsqueda, filtros, orden y acciones sobre cada lead."
      />
      <EmptyState
        icon={Users}
        title="La tabla de leads llega en la Fase 2"
        description="Búsqueda, filtros por país/estado/scoring, y el detalle de cada lead se construyen en el siguiente incremento."
      />
    </div>
  );
}
