import { useEffect, useState } from "react";
import { Bell, Filter, CheckCheck, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertItem } from "@/components/alerts/AlertItem";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/authFetch";

interface DatabaseAlert {
  alert_id: string;
  user_id: string;
  alert_type: string;
  risk_score: number;
  description: string;
  created_at: string;
  status: string;
}

interface UIAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function mapDatabaseAlertToUI(dbAlert: DatabaseAlert): UIAlert {
  let severity: "critical" | "warning" | "info";
  if (dbAlert.risk_score >= 8) {
    severity = "critical";
  } else if (dbAlert.risk_score >= 5) {
    severity = "warning";
  } else {
    severity = "info";
  }

  return {
    id: dbAlert.alert_id,
    severity,
    title: dbAlert.alert_type.replace(/_/g, " "),
    description: dbAlert.description,
    time: formatTimeAgo(dbAlert.created_at),
  };
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<UIAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated before fetching
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      toast({
        title: "Not authenticated",
        description: "Please log in to view alerts.",
        variant: "destructive",
      });
      return;
    }
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication lost",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await authFetch("/api/alerts?limit=100");
      
      if (!response.ok) {
        let errorDetail = "Unknown error";
        try {
          const errorData = await response.json();
          errorDetail = errorData.error || `HTTP ${response.status}`;
        } catch (e) {
          errorDetail = `HTTP ${response.status}`;
        }
        throw new Error(`Failed to fetch alerts: ${errorDetail}`);
      }

      const data = await response.json();
      const dbAlerts: DatabaseAlert[] = data.alerts || [];
      const uiAlerts = dbAlerts
        .filter(a => a.status !== "dismissed")
        .map(mapDatabaseAlertToUI);
      
      setAlerts(uiAlerts);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching alerts:", errorMessage);
      toast({
        title: "Failed to load alerts",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      // Optimistic update
      setAlerts(alerts.filter((alert) => alert.id !== id));

      // Persist to backend
      const response = await authFetch(`/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dismissed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to dismiss alert");
      }

      toast({
        title: "Alert dismissed",
        description: "The alert has been marked as dismissed.",
      });
    } catch (error) {
      console.error("Error dismissing alert:", error);
      // Refresh to restore state
      await fetchAlerts();
      toast({
        title: "Error",
        description: "Failed to dismiss alert.",
        variant: "destructive",
      });
    }
  };

  const handleDismissAll = async () => {
    if (alerts.length === 0) {
      toast({
        title: "No alerts",
        description: "There are no active alerts to dismiss.",
      });
      return;
    }

    try {
      const alertIds = alerts.map(a => a.id);
      // Optimistic update
      setAlerts([]);

      // Persist all dismissals
      const promises = alertIds.map(id =>
        authFetch(`/api/alerts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "dismissed" }),
        })
      );

      await Promise.all(promises);

      toast({
        title: "All alerts dismissed",
        description: `${alertIds.length} alert(s) have been marked as dismissed.`,
      });
    } catch (error) {
      console.error("Error dismissing all alerts:", error);
      // Refresh to restore state
      await fetchAlerts();
      toast({
        title: "Error",
        description: "Failed to dismiss all alerts.",
        variant: "destructive",
      });
    }
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const infoCount = alerts.filter((a) => a.severity === "info").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

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
            <Button variant="outline" onClick={handleDismissAll} disabled={alerts.length === 0}>
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
              <p className="text-2xl font-bold text-success">{infoCount}</p>
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

