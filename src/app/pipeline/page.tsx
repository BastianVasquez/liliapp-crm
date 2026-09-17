import { PageHeader } from "@/components/layout/page-header";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Arrastra un lead entre columnas para cambiar su estado."
      />
      <PipelineBoard />
    </div>
  );
}
