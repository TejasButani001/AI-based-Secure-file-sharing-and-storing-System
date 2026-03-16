
import { FolderLock, Users, AlertTriangle, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SecurityStatus } from "@/components/dashboard/SecurityStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    health: "Connected"
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
      .then(data => setStats(data))
      .catch(err => {
        console.error("Failed to fetch stats:", err);
        // Keep default/mock stats on error so UI doesn't break
      });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Overview of your secure file ecosystem
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={item}>
              <StatCard
                title="Total Files"
                value={stats.files.toString()}
                change="+12% from last month"
                changeType="positive"
                icon={FolderLock}
                iconColor="text-blue-500"
              />
            </motion.div>
            {isAdmin ? (
              <motion.div variants={item}>
                <StatCard
                  title="Active Users"
                  value={stats.users.toString()}
                  change="System wide"
                  changeType="neutral"
                  icon={Users}
                  iconColor="text-purple-500"
                />
              </motion.div>
            ) : (
                <motion.div variants={item}>
                <StatCard
                  title="Account Status"
                  value="Active"
                  change={`Role: ${user?.role || 'User'}`}
                  changeType="positive"
                  icon={Users}
                  iconColor="text-purple-500"
                />
              </motion.div>
            )}
            <motion.div variants={item}>
              <StatCard
                title="Alerts Today"
                value={stats.alerts?.toString() || "0"}
                change={stats.alerts > 0 ? "Requires Attention" : "All clear"}
                changeType={stats.alerts > 0 ? "negative" : "positive"}
                icon={AlertTriangle}
                iconColor={stats.alerts > 0 ? "text-amber-500" : "text-success"}
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard
                title="System Status"
                value={stats.health}
                change="Optimal"
                changeType="neutral"
                icon={Activity}
                iconColor="text-emerald-500"
              />
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <motion.div variants={item} className="h-full">
              <SecurityStatus
                status={stats.alerts > 0 ? "warning" : "secure"}
                lastScan="Just now"
                threatsBlocked={stats.alerts || 0}
              />
            </motion.div>
            <motion.div variants={item} className="h-full">
              <RecentActivity />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
