import { AlertTriangle, Shield, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertItemProps {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
  onDismiss: (id: string) => void;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    iconColor: "text-destructive",
    badge: "alert-badge",
  },
  warning: {
    icon: Shield,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
    badge: "warning-badge",
  },
  info: {
    icon: Info,
    bg: "bg-accent/10",
    border: "border-accent/30",
    iconColor: "text-accent",
    badge: "secure-badge",
  },
};

export function AlertItem({ id, severity, title, description, time, onDismiss }: AlertItemProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all duration-200",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", config.bg)}>
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground">{title}</h4>
            <span className={config.badge}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => onDismiss(id)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
