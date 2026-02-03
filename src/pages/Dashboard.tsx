import { FolderLock, Users, AlertTriangle, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SecurityStatus } from "@/components/dashboard/SecurityStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    files: 0,
    users: 0,
    logs: 0,
    health: "Connected"
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error('Invalid JSON response');
        }
      })
      .then(data => setStats(data))
      .catch(err => {
        console.error("Failed to fetch stats:", err);
        // Keep default/mock stats on error so UI doesn't break
      });
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
            change="+12% from last month"
            changeType="positive"
            icon={FolderLock}
            iconColor="text-primary"
          />
          <StatCard
            title="Active Users"
            value={stats.users.toString()}
            change="3 new this week"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
          />
          <StatCard
            title="Alerts Today"
            value="0"
            change="-23% from yesterday"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="text-warning"
          />
          <StatCard
            title="System Status"
            value={stats.health}
            change="Optimal"
            changeType="neutral"
            icon={Activity}
            iconColor="text-success"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityStatus
            status="secure"
            lastScan="2 minutes ago"
            threatsBlocked={47}
          />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
