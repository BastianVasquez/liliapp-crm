import { Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Usuarios, estados, fuentes y opciones configurables del CRM."
      />
      <EmptyState
        icon={Settings}
        title="La configuración se define junto con la integración a Sheets"
        description="Las hojas USUARIOS y CONFIG alimentan esta vista a partir de la Fase 8."
      />
    </div>
  );
}
