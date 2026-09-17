import { PageHeader } from "@/components/layout/page-header";
import { LeadTable } from "@/components/leads/lead-table";

export default function LeadsPage() {
  return (
    <div>
      <PageHeader
        title="Leads"
        description="Búsqueda, filtros, orden y acciones sobre cada lead."
      />
      <LeadTable />
    </div>
  );
}
