import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";

interface Alert {
    alert_id: number;
    user_id: number;
    alert_type: string;
    risk_score: number;
    description: string;
    created_at: string;
    status: string;
}

interface DashboardStats {
    total_alerts: number;
    open_alerts: number;
    critical_alerts: number;
    failed_logins_24h: number;
    avg_risk_score: number;
}

export default function MlDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("open");
    const { toast } = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await authFetch("/api/ml/dashboard");
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            setStats(data.stats);
            setAlerts(data.recent_alerts || []);

            toast({
                title: "Success",
                description: "ML Dashboard data loaded",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load dashboard",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateAlertStatus = async (alertId: number, newStatus: string) => {
        try {
            const response = await authFetch(`/api/ml/alerts/${alertId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update alert");

            setAlerts(alerts.map(a =>
                a.alert_id === alertId ? { ...a, status: newStatus } : a
            ));

            toast({
                title: "Success",
                description: "Alert status updated",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update alert",
                variant: "destructive",
            });
        }
    };

    const getRiskColor = (score: number) => {
        if (score < 0.3) return "secondary";
        if (score < 0.5) return "default";
        if (score < 0.75) return "destructive";
        return "destructive";
    };

    const getStatusColor = (status: string) => {
        if (status === "open") return "destructive";
        if (status === "investigating") return "default";
        if (status === "resolved") return "secondary";
        return "outline";
    };

    const filteredAlerts = alerts.filter(a =>
        filterStatus === "all" || a.status === filterStatus
    );

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">ML Security Dashboard</h1>
                        <p className="text-muted-foreground">
                            Anomaly detection and security alerts
                        </p>
                    </div>
                    <Button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        variant="outline"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_alerts}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-500/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-orange-600">
                                    Open Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats.open_alerts}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-500/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-red-600">
                                    Critical
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.critical_alerts}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Failed Logins (24h)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.failed_logins_24h}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Avg Risk Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avg_risk_score}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Info Alert */}
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Isolation Forest Detection Active</AlertTitle>
                    <AlertDescription>
                        The system is monitoring login patterns, IP changes, failed attempts, and device changes to detect anomalous behavior.
                    </AlertDescription>
                </Alert>

                {/* Alerts Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Security Alerts</CardTitle>
                                <CardDescription>
                                    Detected anomalies and suspicious activities
                                </CardDescription>
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="investigating">Investigating</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="false_alarm">False Alarm</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin">
                                    <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                                </div>
                            </div>
                        ) : filteredAlerts.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                    <p className="text-muted-foreground">No alerts in this category</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Alert Type</TableHead>
                                            <TableHead>User ID</TableHead>
                                            <TableHead>Risk Score</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAlerts.map((alert) => (
                                            <TableRow key={alert.alert_id}>
                                                <TableCell className="font-medium">
                                                    {alert.alert_type}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{alert.user_id}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getRiskColor(alert.risk_score)}>
                                                        {(alert.risk_score * 100).toFixed(0)}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-sm">
                                                    {alert.description}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(alert.created_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusColor(alert.status)}>
                                                        {alert.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Select
                                                        value={alert.status}
                                                        onValueChange={(value) =>
                                                            updateAlertStatus(alert.alert_id, value)
                                                        }
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="open">Open</SelectItem>
                                                            <SelectItem value="investigating">Investigating</SelectItem>
                                                            <SelectItem value="resolved">Resolved</SelectItem>
                                                            <SelectItem value="false_alarm">False Alarm</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
