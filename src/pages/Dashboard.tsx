import { FolderLock, Users, AlertTriangle, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SecurityStatus } from "@/components/dashboard/SecurityStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
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
            value="1,284"
            change="+12% from last month"
            changeType="positive"
            icon={FolderLock}
            iconColor="text-primary"
          />
          <StatCard
            title="Active Users"
            value="48"
            change="3 new this week"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
          />
          <StatCard
            title="Alerts Today"
            value="7"
            change="-23% from yesterday"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="text-warning"
          />
          <StatCard
            title="File Activities"
            value="342"
            change="Last 24 hours"
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
