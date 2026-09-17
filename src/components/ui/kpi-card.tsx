import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
}

export function KpiCard({ label, value, icon: Icon, trend, trendTone = "neutral" }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(20,16,50,0.04)]">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lili-purple-soft text-lili-purple-dark">
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trendTone === "up" && "text-success",
              trendTone === "down" && "text-danger",
              trendTone === "neutral" && "text-muted"
            )}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
