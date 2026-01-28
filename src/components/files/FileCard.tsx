import { FileText, Image, FileArchive, File, Lock, MoreVertical, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FileCardProps {
  name: string;
  type: "document" | "image" | "archive" | "other";
  size: string;
  uploadedAt: string;
  encrypted: boolean;
}

const fileIcons = {
  document: FileText,
  image: Image,
  archive: FileArchive,
  other: File,
};

const fileColors = {
  document: "text-accent bg-accent/10",
  image: "text-success bg-success/10",
  archive: "text-warning bg-warning/10",
  other: "text-muted-foreground bg-muted",
};

export function FileCard({ name, type, size, uploadedAt, encrypted }: FileCardProps) {
  const Icon = fileIcons[type];

  return (
    <div className="glass-card p-4 hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className={cn("p-3 rounded-lg", fileColors[type])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            {encrypted && (
              <Lock className="w-3 h-3 text-success shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {size} • {uploadedAt}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem className="cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
