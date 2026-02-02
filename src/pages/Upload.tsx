import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { UploadCloud, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const clearFile = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus("idle");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("success");
      setMessage("File uploaded successfully and secured!");
      setFile(null); // Clear file after success? Or keep it? Users usually want to clear.
    } catch (error: any) {
      console.error("Upload error:", error);
      setStatus("error");
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Upload Files</h1>

        <div className="max-w-2xl mx-auto">
          <div
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-card/50"
              }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drag & drop your file here</h3>
                <p className="text-muted-foreground mb-6">or click to browse from your computer</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center gap-4 bg-background p-4 rounded-lg border border-border mb-6 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <File className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearFile} disabled={uploading}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {status === "error" && (
                  <div className="text-destructive flex items-center gap-2 text-sm justify-center mb-4">
                    <AlertCircle className="w-4 h-4" />
                    {message}
                  </div>
                )}

                {status === "success" && (
                  <div className="text-green-500 flex items-center gap-2 text-sm justify-center mb-4">
                    <CheckCircle className="w-4 h-4" />
                    {message}
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleUpload}
                  disabled={uploading}
                  variant="glow"
                >
                  {uploading ? "Encrypting & Uploading..." : "Upload Securely"}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <p className="font-semibold text-primary mb-1">AES-256</p>
              <p className="text-xs text-muted-foreground">Encryption Standard</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <p className="font-semibold text-primary mb-1">Malware Scan</p>
              <p className="text-xs text-muted-foreground">Real-time Detection</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <p className="font-semibold text-primary mb-1">Secure Storage</p>
              <p className="text-xs text-muted-foreground">Cloud Redundancy</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
