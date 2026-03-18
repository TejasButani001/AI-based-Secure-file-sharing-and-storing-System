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
    <div className="h-full p-6 rounded-lg bg-card border border-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">Security Overview</h3>
      </div>

      <div className={cn("border rounded-lg p-4 mb-6", config.bg, config.border)}>
        <div className="flex items-center gap-4">
          <StatusIcon className={cn("w-6 h-6", config.color)} />
          <div>
            <p className={cn("font-semibold text-base", config.color)}>{config.label}</p>
            <p className="text-sm text-foreground/60">Last scan: {lastScan}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-secondary/20 rounded-lg border border-border/50">
          <p className="text-3xl font-bold text-foreground">{threatsBlocked}</p>
          <p className="text-sm text-muted-foreground mt-2">Threats Blocked</p>
        </div>
        <div className="text-center p-4 bg-secondary/20 rounded-lg border border-border/50">
          <p className="text-base font-bold text-emerald-600">AES-256</p>
          <p className="text-sm text-muted-foreground mt-2">Encrypted</p>
        </div>
      </div>
    </div>
  );
}
