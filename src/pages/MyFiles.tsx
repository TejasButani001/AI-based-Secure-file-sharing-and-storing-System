import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileCard } from "@/components/files/FileCard";
import { formatBytes } from "@/lib/formatBytes";

interface FileData {
    id: number;
    filename: string;
    size: number;
    mimetype: string;
    createdAt: string;
}

export default function MyFiles() {
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

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">My Files</h1>
                {loading ? (
                    <p className="text-muted-foreground">Loading files...</p>
                ) : files.length === 0 ? (
                    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                        <p className="text-muted-foreground">No files uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                name={file.filename}
                                type={file.mimetype.includes("image") ? "image" : "document"} // Simple mapping
                                size={formatBytes(file.size)}
                                uploadedAt={new Date(file.createdAt).toLocaleDateString()}
                                encrypted={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
