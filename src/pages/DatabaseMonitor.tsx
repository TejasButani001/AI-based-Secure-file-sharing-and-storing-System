import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { Activity, Database, FileText, Users, Server } from "lucide-react";

interface DbStats {
    health: string;
    users: number;
    files: number;
    logs: number;
    uptime: number;
}

export default function DatabaseMonitor() {
    const [stats, setStats] = useState<DbStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/stats");
                if (!res.ok) throw new Error("Failed to fetch stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError("Could not connect to database server");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">Database Monitor</h1>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<Database className="w-5 h-5 text-primary" />}
                        label="Status"
                        value={stats?.health || "Unknown"}
                        subtext="Connection Health"
                    />
                    <StatCard
                        icon={<Users className="w-5 h-5 text-blue-500" />}
                        label="Users"
                        value={stats?.users ?? "-"}
                        subtext="Total Registered"
                    />
                    <StatCard
                        icon={<FileText className="w-5 h-5 text-green-500" />}
                        label="Files"
                        value={stats?.files ?? "-"}
                        subtext="Stored Securely"
                    />
                    <StatCard
                        icon={<Activity className="w-5 h-5 text-orange-500" />}
                        label="Logs"
                        value={stats?.logs ?? "-"}
                        subtext="System Events"
                    />
                </div>

                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Server className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">System Status</h2>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Backend Uptime: {stats?.uptime ? `${Math.floor(stats.uptime)}s` : "Offline"}</p>
                        <p>Last Updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ icon, label, value, subtext }: { icon: any, label: string, value: string | number, subtext: string }) {
    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-background rounded-lg border border-border">
                    {icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
            </div>
            <div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            </div>
        </div>
    );
}
