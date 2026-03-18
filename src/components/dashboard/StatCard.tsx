import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex items-start justify-between gap-4 h-full">
        <div className="flex flex-col justify-between flex-1">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">{title}</p>
            <h3 className="text-4xl font-bold text-foreground mb-2">{value}</h3>
          </div>
          {change && (
            <p className={cn("text-sm font-medium", changeType === "positive" && "text-emerald-600", changeType === "negative" && "text-rose-600", changeType === "neutral" && "text-muted-foreground")}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg flex-shrink-0", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
