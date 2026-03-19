import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/authFetch";
import { useState, useEffect } from "react";
import { Search, Download, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuditLog {
    audit_id: number;
    user_id: number;
    event: string;
    event_time: string;
    details: string;
}

export default function AuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEvent, setFilterEvent] = useState("all");
    const { toast } = useToast();

    // Get unique events for filter dropdown
    const uniqueEvents = [
        ...new Set(logs.map(log => log.event || "Unknown")),
    ].sort();

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        // Apply filters
        let filtered = logs;

        if (searchTerm) {
            filtered = filtered.filter(log =>
                log.event?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.user_id?.toString().includes(searchTerm)
            );
        }

        if (filterEvent !== "all") {
            filtered = filtered.filter(log => log.event === filterEvent);
        }

        setFilteredLogs(filtered);
    }, [logs, searchTerm, filterEvent]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await authFetch("/api/logs");
            if (!response.ok) {
                throw new Error("Failed to fetch audit logs");
            }
            const data = await response.json();
            setLogs(data || []);
            toast({
                title: "Success",
                description: `Loaded ${data?.length || 0} audit logs`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch logs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const downloadLogs = () => {
        const csv = [
            ["ID", "User ID", "Event", "Time", "Details"],
            ...filteredLogs.map(log => [
                log.audit_id,
                log.user_id || "N/A",
                log.event || "N/A",
                new Date(log.event_time).toLocaleString(),
                log.details || "N/A",
            ]),
        ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            title: "Success",
            description: "Audit logs downloaded successfully",
        });
    };

    const getEventColor = (event: string) => {
        if (!event) return "secondary";
        if (event.toLowerCase().includes("delete") || event.toLowerCase().includes("error")) return "destructive";
        if (event.toLowerCase().includes("create") || event.toLowerCase().includes("upload")) return "default";
        if (event.toLowerCase().includes("update") || event.toLowerCase().includes("modify")) return "outline";
        return "secondary";
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
                        <p className="text-muted-foreground">
                            System activity and event tracking
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchLogs}
                            disabled={loading}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadLogs}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Info Alert */}
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Showing up to 100 most recent audit logs. Use filters to narrow down results.
                    </AlertDescription>
                </Alert>

                {/* Filters Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search events, details, or user ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Type</label>
                                <Select value={filterEvent} onValueChange={setFilterEvent}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All events" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Events</SelectItem>
                                        {uniqueEvents.map(event => (
                                            <SelectItem key={event} value={event}>
                                                {event}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Logs ({filteredLogs.length})
                        </CardTitle>
                        <CardDescription>
                            {loading ? "Loading..." : `Showing ${filteredLogs.length} of ${logs.length} total logs`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin">
                                    <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                                </div>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No audit logs found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>User ID</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLogs.map((log) => (
                                            <TableRow key={log.audit_id}>
                                                <TableCell className="text-xs">
                                                    {log.audit_id}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {log.user_id || "System"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getEventColor(log.event)}>
                                                        {log.event || "Unknown"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(log.event_time).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-sm max-w-xs truncate" title={log.details}>
                                                    {log.details || "—"}
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
