import { useState } from "react";
import { Bell, Filter, CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertItem } from "@/components/alerts/AlertItem";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  {
    id: "1",
    severity: "critical" as const,
    title: "Unauthorized Access Attempt",
    description: "Multiple failed login attempts detected from IP 192.168.1.105. Account temporarily locked.",
    time: "5 minutes ago",
  },
  {
    id: "2",
    severity: "warning" as const,
    title: "Unusual Download Pattern",
    description: "User john.doe@company.com downloaded 25 files in the last hour. Review activity.",
    time: "15 minutes ago",
  },
  {
    id: "3",
    severity: "info" as const,
    title: "New Device Logged In",
    description: "User sarah.m@company.com logged in from a new Windows device in New York.",
    time: "1 hour ago",
  },
  {
    id: "4",
    severity: "warning" as const,
    title: "Password Expiring Soon",
    description: "3 users have passwords expiring in the next 7 days. Send reminders.",
    time: "2 hours ago",
  },
  {
    id: "5",
    severity: "critical" as const,
    title: "Suspicious File Access",
    description: "Sensitive file 'HR_Salaries.xlsx' accessed outside business hours.",
    time: "3 hours ago",
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleDismissAll = () => {
    setAlerts([]);
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Security Alerts</h1>
            <p className="text-muted-foreground">
              Monitor and respond to security events
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" onClick={handleDismissAll}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Dismiss All
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{warningCount}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{alerts.length - criticalCount - warningCount}</p>
              <p className="text-sm text-muted-foreground">Informational</p>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} {...alert} onDismiss={handleDismiss} />
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No active alerts</p>
            <p className="text-sm text-muted-foreground">
              All security events have been reviewed
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
