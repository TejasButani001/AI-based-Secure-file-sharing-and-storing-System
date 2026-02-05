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
    <div className="h-full p-6 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">Recent Activity</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {mockActivity.map((item, index) => {
          const Icon = activityIcons[item.type];
          return (
            <div
              key={item.id}
              className="group flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50 cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", activityColors[item.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{item.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground font-medium">{item.user}</p>
                  <span className="text-[10px] text-muted-foreground/50">•</span>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
