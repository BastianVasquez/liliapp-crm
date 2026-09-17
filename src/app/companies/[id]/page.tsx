import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader title={`Empresa ${id}`} description="Ficha completa de la empresa." />
      <EmptyState
        icon={Building2}
        title="El detalle de empresa llega en la Fase 4"
        description="Contactos, actividad reciente y oportunidades asociadas se construyen junto con la vista de empresas."
      />
    </div>
  );
}
