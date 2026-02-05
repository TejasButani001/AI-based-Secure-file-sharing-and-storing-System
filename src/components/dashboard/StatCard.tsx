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
    <div className="relative overflow-hidden p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          {change && (
            <p
              className={cn(
                "text-xs font-medium mt-2 flex items-center gap-1",
                changeType === "positive" && "text-emerald-500",
                changeType === "negative" && "text-rose-500",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
