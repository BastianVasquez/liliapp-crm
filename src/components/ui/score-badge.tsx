import { cn } from "@/lib/utils";

export function ScoreBadge({ score }: { score: number }) {
  if (!score || score <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#eef0f5] px-2.5 py-1 text-xs font-medium text-muted">
        Sin score
      </span>
    );
  }

  const tone =
    score >= 75
      ? "bg-success-soft text-success"
      : score >= 45
        ? "bg-warning-soft text-warning"
        : "bg-danger-soft text-danger";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
        tone
      )}
    >
      {score}
    </span>
  );
}
