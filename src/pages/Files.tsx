import { Search, Filter, Grid, List } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUpload } from "@/components/files/FileUpload";
import { FileCard } from "@/components/files/FileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/formatBytes";

interface FileData {
  id: number;
  filename: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

export default function Files() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/files/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFiles(data);
        }
      } catch (error) {
        console.error("Failed to fetch files", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
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
            <FileCard
              key={file.id}
              name={file.filename}
              type={file.mimetype.includes("image") ? "image" : "document"}
              size={formatBytes(file.size)}
              uploadedAt={new Date(file.createdAt).toLocaleDateString()}
              encrypted={true}
            />
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{loading ? "Loading..." : "No files found"}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
