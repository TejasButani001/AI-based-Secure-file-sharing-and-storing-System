import { Activity, Upload, Download, LogIn, AlertTriangle, Shield, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";

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

const mockActivity: ActivityItem[] = [
  { id: "1", type: "upload", message: "Uploaded financial_report.pdf", user: "John D.", time: "2 min ago" },
  { id: "2", type: "login", message: "Successful login from new device", user: "Sarah M.", time: "5 min ago" },
  { id: "3", type: "download", message: "Downloaded project_specs.docx", user: "Mike R.", time: "12 min ago" },
  { id: "4", type: "alert", message: "Suspicious login attempt blocked", user: "Unknown", time: "15 min ago" },
  { id: "5", type: "security", message: "Password changed successfully", user: "Emily K.", time: "1 hour ago" },
];

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await authFetch('/api/files');
        if (res.ok) {
          const files = await res.json();
          // Map real files to activity items
          const mapped: ActivityItem[] = files.slice(0, 5).map((f: { file_id?: string; id?: string; file_name?: string; filename?: string; upload_time: string }) => ({
            id: f.file_id || f.id || Math.random().toString(),
            type: "upload",
            message: `Uploaded ${f.file_name || f.filename || 'file'}`,
            user: "You",
            time: new Date(f.upload_time).toLocaleDateString()
          }));
          setActivities(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="h-full p-6 rounded-lg bg-card border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Recent Activity</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80">View All</button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-base text-muted-foreground">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="text-base text-muted-foreground">No recent activity found.</p>
        ) : (
          activities.map((item, index) => {
            const Icon = activityIcons[item.type] || File;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-3 rounded hover:bg-secondary/30 border border-transparent cursor-default"
              >
                <div className={cn("p-2 rounded flex-shrink-0", activityColors[item.type] || activityColors.upload)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-medium text-foreground truncate">{item.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.user} • {item.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
