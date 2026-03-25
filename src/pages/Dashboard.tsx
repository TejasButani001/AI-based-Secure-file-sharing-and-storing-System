
import { FolderLock, Users, AlertTriangle, Activity, HardDrive } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SecurityStatus } from "@/components/dashboard/SecurityStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RiskStatusBanner } from "@/components/alerts/RiskStatusBanner";
import { useEffect, useState } from "react";

import { authFetch } from "@/lib/authFetch";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState({
    files: 0,
    users: 0,
    alerts: 0,
    logs: 0,
    health: "Connected",
    storage: { used: 0, total: 2 * 1024 * 1024 * 1024 }
  });

  useEffect(() => {
    authFetch('/api/stats')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error('Invalid JSON response');
        }
      })
      .then(data => {
        // Ensure storage object exists
        if (!data.storage) {
          data.storage = { used: 0, total: 2 * 1024 * 1024 * 1024 };
        }
        setStats(data);
      })
      .catch(err => {
        console.error("Failed to fetch stats:", err);
        // Keep default/mock stats on error so UI doesn't break
      });
  }, []);

  // Helper function to format bytes to readable size
  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    if (bytes < 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    try {
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      if (i < 0 || i >= sizes.length) return "0 B";
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    } catch {
      return "0 B";
    }
  };

  // Calculate storage percentage
  const storagePercentage = stats.storage && stats.storage.total > 0 
    ? Math.round((stats.storage.used / stats.storage.total) * 100)
    : 0;


  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-base text-muted-foreground">
            System overview & recent activity
          </p>
        </div>

        {/* Risk Status Banner */}
        <RiskStatusBanner />

        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-fr">
            <StatCard
              title="Total Files"
              value={stats.files.toString()}
              change="+12% from last month"
              changeType="positive"
              icon={FolderLock}
              iconColor="text-blue-500"
            />
            {isAdmin ? (
              <StatCard
                title="Active Users"
                value={stats.users.toString()}
                change="System wide"
                changeType="neutral"
                icon={Users}
                iconColor="text-purple-500"
              />
            ) : (
              <StatCard
                title="Account Status"
                value="Active"
                change={`Role: ${user?.role || 'User'}`}
                changeType="positive"
                icon={Users}
                iconColor="text-purple-500"
              />
            )}
            <StatCard
              title="Alerts Today"
              value={stats.alerts?.toString() || "0"}
              change={stats.alerts > 0 ? "Requires Attention" : "All clear"}
              changeType={stats.alerts > 0 ? "negative" : "positive"}
              icon={AlertTriangle}
              iconColor={stats.alerts > 0 ? "text-amber-500" : "text-success"}
            />
            <StatCard
              title="System Status"
              value={stats.health}
              change="Optimal"
              changeType="neutral"
              icon={Activity}
              iconColor="text-emerald-500"
            />
            <StatCard
              title="Storage Used"
              value={formatBytes(stats.storage?.used || 0)}
              change={`${storagePercentage}% of 2GB`}
              changeType={storagePercentage > 80 ? "negative" : storagePercentage > 50 ? "neutral" : "positive"}
              icon={HardDrive}
              iconColor="text-orange-500"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="h-full">
              <SecurityStatus
                status={stats.alerts > 0 ? "warning" : "secure"}
                lastScan="Just now"
                threatsBlocked={stats.alerts || 0}
              />
            </div>
            <div className="h-full">
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
