import { Search, Filter, Grid, List } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUpload } from "@/components/files/FileUpload";
import { FileCard } from "@/components/files/FileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockFiles = [
  { id: "1", name: "financial_report_2024.pdf", type: "document" as const, size: "2.4 MB", uploadedAt: "Today, 2:30 PM", encrypted: true },
  { id: "2", name: "project_specs.docx", type: "document" as const, size: "1.1 MB", uploadedAt: "Yesterday", encrypted: true },
  { id: "3", name: "team_photo.jpg", type: "image" as const, size: "3.8 MB", uploadedAt: "Jan 25, 2024", encrypted: true },
  { id: "4", name: "backup_2024.zip", type: "archive" as const, size: "128 MB", uploadedAt: "Jan 24, 2024", encrypted: true },
  { id: "5", name: "client_data.xlsx", type: "document" as const, size: "540 KB", uploadedAt: "Jan 23, 2024", encrypted: true },
  { id: "6", name: "presentation.pptx", type: "document" as const, size: "8.2 MB", uploadedAt: "Jan 22, 2024", encrypted: true },
];

export default function Files() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Files</h1>
            <p className="text-muted-foreground">
              Manage your encrypted files securely
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-none",
                  viewMode === "grid" && "bg-secondary"
                )}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-none",
                  viewMode === "list" && "bg-secondary"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {filteredFiles.map((file) => (
            <FileCard key={file.id} {...file} />
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No files found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
