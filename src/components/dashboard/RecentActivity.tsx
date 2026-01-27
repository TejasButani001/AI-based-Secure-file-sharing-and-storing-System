import { Activity, Upload, Download, LogIn, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {mockActivity.map((item) => {
          const Icon = activityIcons[item.type];
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className={cn("p-2 rounded-lg", activityColors[item.type])}>
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
        })}
      </div>
    </div>
  );
}
