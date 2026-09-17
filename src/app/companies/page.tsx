import { PageHeader } from "@/components/layout/page-header";
import { CompanyList } from "@/components/companies/company-list";

export default function CompaniesPage() {
  return (
    <div>
      <PageHeader
        title="Empresas"
        description="Organizaciones con sus contactos, oportunidades y actividad asociada."
      />
      <CompanyList />
    </div>
  );
}
