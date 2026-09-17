import { PageHeader } from "@/components/layout/page-header";
import { ActivityFeed } from "@/components/activities/activity-feed";

export default function ActivitiesPage() {
  return (
    <div>
      <PageHeader
        title="Actividades"
        description="Historial de emails, llamadas, reuniones, WhatsApp y LinkedIn."
      />
      <ActivityFeed />
    </div>
  );
}
