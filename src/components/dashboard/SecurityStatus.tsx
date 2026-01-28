import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

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
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Security Overview</h3>
      </div>

      <div
        className={`${config.bg} ${config.border} border rounded-xl p-4 mb-4`}
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-8 h-8 ${config.color}`} />
          <div>
            <p className={`font-semibold ${config.color}`}>{config.label}</p>
            <p className="text-sm text-muted-foreground">Last scan: {lastScan}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-bold text-primary">{threatsBlocked}</p>
          <p className="text-xs text-muted-foreground">Threats Blocked</p>
        </div>
        <div className="text-center p-3 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-bold text-success">256-bit</p>
          <p className="text-xs text-muted-foreground">Encryption</p>
        </div>
      </div>
    </div>
  );
}
