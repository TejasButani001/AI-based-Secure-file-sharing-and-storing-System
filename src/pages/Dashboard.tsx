import { FolderLock, Users, AlertTriangle, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SecurityStatus } from "@/components/dashboard/SecurityStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/formatBytes";

export default function Dashboard() {
  const [stats, setStats] = useState({
    files: 0,
    storageUsed: 0,
    activeUsers: 0,
    alerts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/stats/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your file security and system activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Files"
            value={stats.files.toString()}
            change="+0 from last month" // We don't track history yet
            changeType="neutral"
            icon={FolderLock}
            iconColor="text-primary"
          />
          <StatCard
            title="Storage Used"
            value={formatBytes(stats.storageUsed)}
            change="Encrypted"
            changeType="neutral"
            icon={Activity}
            iconColor="text-accent"
          />
          <StatCard
            title="Alerts Today"
            value={stats.alerts.toString()}
            change="No threats detected"
            changeType="positive" // Assuming 0 is good
            icon={AlertTriangle}
            iconColor="text-warning"
          />
          <StatCard
            title="Active Session"
            value="Active"
            change="Secure connection"
            changeType="positive"
            icon={Users}
            iconColor="text-success"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityStatus
            status="secure"
            lastScan="Just now"
            threatsBlocked={0}
          />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
