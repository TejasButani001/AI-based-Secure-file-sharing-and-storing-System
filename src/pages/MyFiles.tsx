import { Search, Filter, Grid, List } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUpload } from "@/components/files/FileUpload";
import { FileCard } from "@/components/files/FileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileData {
    id: string;
    name: string;
    type: "document" | "image" | "archive" | "other";
    size: string;
    uploadedAt: string;
    encrypted: boolean;
}

const getFileType = (fileName: string, mimeType?: string): FileData["type"] => {
    const normalizedMime = (mimeType || '').toLowerCase();
    if (normalizedMime.startsWith('image/')) return 'image';
    if (
        normalizedMime.includes('zip') ||
        normalizedMime.includes('rar') ||
        normalizedMime.includes('7z')
    ) {
        return 'archive';
    }

    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
    if (['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) return 'document';
    return 'other';
};

export default function MyFiles() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [files, setFiles] = useState<FileData[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await authFetch('/api/files');
            if (res.ok) {
                const data = await res.json();
                // Map backend data to frontend model
                const mappedFiles = data.map((f: any) => ({
                    id: String(f.file_id || f.id),
                    name: f.file_name || f.filename || 'Unknown File',
                    type: getFileType(f.file_name || f.filename || '', f.mime_type),
                    size: ((f.size || 0) / 1024).toFixed(1) + " KB",
                    uploadedAt: new Date(f.upload_time || f.createdAt || new Date()).toLocaleDateString(),
                    encrypted: true
                }));
                setFiles(mappedFiles);
            } else {
                console.error("Failed to fetch files:", res.statusText);
                toast({ title: "Error", description: "Failed to fetch files", variant: "destructive" });
            }
        } catch (error) {
            console.error("Failed to fetch files", error);
            toast({ title: "Error", description: "Failed to fetch files", variant: "destructive" });
        }
    };

    const handleDownload = async (fileId: string, fileName: string) => {
        try {
            let password = sessionStorage.getItem('vaultPassword');
            if (!password) {
                const input = window.prompt("Enter your account password to download this file:");
                if (input === null) return;
                if (!input.trim()) {
                    toast({ title: "Error", description: "Password is required to download file", variant: "destructive" });
                    return;
                }
                password = input;
            }

            const res = await authFetch(`/api/files/${fileId}/download`, {
                method: 'POST',
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                sessionStorage.setItem('vaultPassword', password);

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                toast({ title: "Success", description: "File downloaded successfully" });
            } else {
                if (res.status === 401 || res.status === 403) {
                    sessionStorage.removeItem('vaultPassword');
                }
                let errorMessage = "Failed to download file";
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // Ignore non-JSON error responses and keep default message.
                }
                toast({ title: "Error", description: errorMessage, variant: "destructive" });
            }
        } catch (error) {
            console.error("Download error:", error);
            toast({ title: "Error", description: "Failed to download file", variant: "destructive" });
        }
    };

    const handlePreview = async (fileId: string, fileName: string, type: string) => {
        try {
            let password = sessionStorage.getItem('vaultPassword');
            if (!password) {
                const input = window.prompt("Enter your account password to preview this file:");
                if (input === null) return;
                if (!input.trim()) {
                    toast({ title: "Error", description: "Password is required to preview file", variant: "destructive" });
                    return;
                }
                password = input;
            }

            const res = await authFetch(`/api/files/${fileId}/download`, {
                method: 'POST',
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                sessionStorage.setItem('vaultPassword', password);

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                setPreviewUrl(url);
                setPreviewType(type);
                setPreviewName(fileName);
            } else {
                if (res.status === 401 || res.status === 403) {
                    sessionStorage.removeItem('vaultPassword');
                }
                let errorMessage = "Failed to preview file";
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {}
                toast({ title: "Error", description: errorMessage, variant: "destructive" });
            }
        } catch (error) {
            console.error("Preview error:", error);
            toast({ title: "Error", description: "Failed to preview file", variant: "destructive" });
        }
    };

    const handleShare = async (fileId: string, fileName: string) => {
        try {
            // Create a shareable link - could generate a unique token
            const shareLink = `${window.location.origin}/shared/${fileId}`;
            
            // Copy to clipboard
            await navigator.clipboard.writeText(shareLink);
            toast({ title: "Success", description: "Share link copied to clipboard" });
        } catch (error) {
            console.error("Share error:", error);
            toast({ title: "Error", description: "Failed to create share link", variant: "destructive" });
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await authFetch(`/api/files/${fileId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFiles(files.filter(f => f.id !== fileId));
                toast({ title: "Success", description: "File deleted successfully" });
            } else {
                const errorData = await res.json();
                toast({ 
                    title: "Error", 
                    description: errorData.error || "Failed to delete file", 
                    variant: "destructive" 
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast({ title: "Error", description: "Failed to delete file", variant: "destructive" });
        }
    };

    const filteredFiles = files.filter((file) =>
        (file.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Files</h1>
                        <p className="text-muted-foreground">
                            Manage your encrypted files securely
                        </p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="mb-8">
                    <FileUpload onUploadSuccess={fetchFiles} />
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
                            {...file}
                            onPreview={handlePreview}
                            onDownload={handleDownload}
                            onShare={handleShare}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {filteredFiles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No files found</p>
                    </div>
                )}
            </div>

            <Dialog 
                open={!!previewUrl} 
                onOpenChange={(open) => {
                    if (!open) {
                        if (previewUrl) window.URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                        setPreviewType(null);
                        setPreviewName(null);
                    }
                }}
            >
                <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{previewName}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/5 dark:bg-white/5 rounded-md min-h-[50vh]">
                        {previewType === 'image' ? (
                            <img src={previewUrl!} alt={previewName!} className="max-w-full max-h-full object-contain" />
                        ) : previewType === 'document' && (previewName?.toLowerCase().endsWith('.pdf') || previewName?.toLowerCase().endsWith('.txt')) ? (
                            <iframe src={previewUrl!} className="w-full h-full min-h-[70vh] border-0 bg-white" title={previewName!} />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p className="mb-4">Preview is not physically supported for this file type.</p>
                                <Button onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = previewUrl!;
                                    a.download = previewName!;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                }}>
                                    Download File Instead
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
