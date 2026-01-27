import { useState, useRef } from "react";
import { Upload, Lock, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Simulate upload
      console.log("Uploading:", selectedFile.name);
      setSelectedFile(null);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Upload File</h3>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
        <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-foreground mb-1">
          Drag & drop your file here
        </p>
        <p className="text-xs text-muted-foreground">
          or click to browse (Max 50MB)
        </p>
      </div>

      {selectedFile && (
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground truncate">
              {selectedFile.name}
            </span>
          </div>
          <Button variant="glow" size="sm" onClick={handleUpload}>
            Encrypt & Upload
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
        <Lock className="w-3 h-3" />
        Files are encrypted with AES-256 before storage
      </p>
    </div>
  );
}
