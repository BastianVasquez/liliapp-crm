import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function CompaniesPage() {
  return (
    <div>
      <PageHeader
        title="Empresas"
        description="Organizaciones con sus contactos, oportunidades y actividad asociada."
      />
      <EmptyState
        icon={Building2}
        title="La vista de empresas llega en la Fase 4"
        description="Ficha de empresa con contactos vinculados, potencial y responsable se construye en ese incremento."
      />
    </div>
  );
}
