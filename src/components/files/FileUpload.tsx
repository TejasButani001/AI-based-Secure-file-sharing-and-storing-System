import { useState, useRef } from "react";
import { Upload, Lock, FileUp, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { authFetch } from "@/lib/authFetch";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
        toast({
            title: "File too large",
            description: `Maximum file size is 30MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
            variant: "destructive"
        });
        return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
            title: "Invalid file type",
            description: "Only images, PDFs, and standard documents are allowed.",
            variant: "destructive"
        });
        return false;
    }
    return true;
  };

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
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setDescription("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setDescription("");
    }
    // Reset input so the same file can be selected again if needed
    if (e.target) {
        e.target.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);

    try {
      const res = await authFetch('/api/files/upload', {
        method: 'POST',
        // DO NOT set Content-Type header manually here for FormData
        body: formData
      });

      if (res.ok) {
        toast({
          title: "Upload Successful",
          description: "Your file and description have been securely uploaded.",
        });
        setSelectedFile(null);
        setDescription("");
        onUploadSuccess?.();
      } else {
        const errorData = await res.json();
        toast({
          title: "Upload Failed",
          description: errorData.error || "An error occurred during upload.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Network error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={handleFileSelect}
        />
        <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-foreground mb-1">
          Drag & drop your file here
        </p>
        <p className="text-xs text-muted-foreground">
          or click to browse (Max 30MB)
        </p>
      </div>

      {selectedFile && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[60%]">
              <Lock className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-sm text-foreground truncate" title={selectedFile.name}>
                {selectedFile.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1 text-muted-foreground hover:text-destructive"
                onClick={() => { setSelectedFile(null); setDescription(""); }}
                title="Remove file"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <Button variant="glow" size="sm" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Encrypt & Upload"}
            </Button>
          </div>
          
          <Textarea 
            placeholder="Add a description for this file (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm bg-background border-border resize-y min-h-[80px]"
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
        <Lock className="w-3 h-3" />
        Files are encrypted with AES-256 before storage
      </p>
    </div>
  );
}
