import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityStatusProps {
  status: "secure" | "warning" | "critical";
  lastScan: string;
  threatsBlocked: number;
}

export function SecurityStatus({ status, lastScan, threatsBlocked }: SecurityStatusProps) {
  const statusConfig = {
    secure: {
      label: "System Secure",
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
    },
    warning: {
      label: "Warnings Detected",
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
    },
    critical: {
      label: "Critical Alerts",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="h-full p-6 rounded-3xl bg-card border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Shield className="w-32 h-32 text-primary rotate-12" />
      </div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">Security Overview</h3>
      </div>

      <div
        className={cn(
          "relative z-10 border rounded-2xl p-5 mb-6 transition-colors duration-300",
          config.bg, config.border
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-full bg-background/50 backdrop-blur-sm", config.color)}>
            <StatusIcon className="w-6 h-6" />
          </div>
          <div>
            <p className={cn("font-bold text-lg", config.color)}>{config.label}</p>
            <p className="text-sm text-foreground/60">Last scan: {lastScan}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="text-center p-4 bg-secondary/30 rounded-2xl border border-border/50 hover:bg-secondary/50 transition-colors">
          <p className="text-3xl font-bold text-foreground mb-1">{threatsBlocked}</p>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Threats Blocked</p>
        </div>
        <div className="text-center p-4 bg-secondary/30 rounded-2xl border border-border/50 hover:bg-secondary/50 transition-colors">
          <p className="text-3xl font-bold text-emerald-500 mb-1">AES</p>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">256-bit Encrypted</p>
        </div>
      </div>
    </div>
  );
}
