import { Search, Download, Filter } from "lucide-react";
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

const mockLogs = [
  { id: "1", user: "john.doe@company.com", action: "File Upload", resource: "financial_report.pdf", ip: "192.168.1.45", time: "2024-01-27 14:32:15", status: "success" },
  { id: "2", user: "sarah.m@company.com", action: "Login", resource: "-", ip: "192.168.1.67", time: "2024-01-27 14:28:42", status: "success" },
  { id: "3", user: "mike.r@company.com", action: "File Download", resource: "project_specs.docx", ip: "192.168.1.89", time: "2024-01-27 14:15:33", status: "success" },
  { id: "4", user: "unknown", action: "Login Attempt", resource: "-", ip: "45.33.32.156", time: "2024-01-27 14:10:22", status: "failed" },
  { id: "5", user: "emily.k@company.com", action: "Password Change", resource: "-", ip: "192.168.1.23", time: "2024-01-27 13:55:18", status: "success" },
  { id: "6", user: "john.doe@company.com", action: "File Share", resource: "team_photo.jpg", ip: "192.168.1.45", time: "2024-01-27 13:42:09", status: "success" },
  { id: "7", user: "admin@company.com", action: "User Created", resource: "new_employee", ip: "192.168.1.10", time: "2024-01-27 13:30:00", status: "success" },
  { id: "8", user: "unknown", action: "Login Attempt", resource: "-", ip: "185.220.101.42", time: "2024-01-27 13:15:45", status: "failed" },
];

export default function Activity() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
            <p className="text-muted-foreground">
              Track all system activities and user actions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Logs Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
                <TableHead className="text-muted-foreground">Resource</TableHead>
                <TableHead className="text-muted-foreground">IP Address</TableHead>
                <TableHead className="text-muted-foreground">Time</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {log.user}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {log.resource}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {log.ip}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {log.time}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        log.status === "success"
                          ? "secure-badge"
                          : "alert-badge"
                      }
                    >
                      {log.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
