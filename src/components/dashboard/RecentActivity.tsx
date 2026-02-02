import { Activity, Upload, Download, LogIn, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ActivityItem {
  id: string;
  type: "upload" | "download" | "login" | "alert" | "security";
  message: string;
  user: string;
  time: string;
}

const activityIcons = {
  upload: Upload,
  download: Download,
  login: LogIn,
  alert: AlertTriangle,
  security: Shield,
};

const activityColors = {
  upload: "text-primary bg-primary/10",
  download: "text-accent bg-accent/10",
  login: "text-success bg-success/10",
  alert: "text-destructive bg-destructive/10",
  security: "text-warning bg-warning/10",
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/activity/recent", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Assume backend returns activities in compatible format or map it here
          // Backend sends: { id, type: 'upload', message, user, time }
          // We need to format the time to be strictly readable if it comes as ISO
          const formattedData = data.map((item: any) => ({
            ...item,
            time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setActivities(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch activity", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          activities.map((item) => {
            const Icon = activityIcons[item.type] || Activity;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className={cn("p-2 rounded-lg", activityColors[item.type] || "bg-muted")}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.user} • {item.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
