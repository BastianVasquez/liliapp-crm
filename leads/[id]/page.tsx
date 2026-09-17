import { UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader title={`Lead ${id}`} description="Ficha completa del lead." />
      <EmptyState
        icon={UserRound}
        title="El detalle de lead llega en la Fase 2"
        description="Información principal, historial en timeline, y acciones de seguimiento se construyen junto con la tabla de leads."
      />
    </div>
  );
}
