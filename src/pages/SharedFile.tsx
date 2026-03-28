import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareInfo {
  file_name: string;
  is_public: boolean;
  expiry_time: string | null;
  access_count: number;
  created_at: string;
}

export default function SharedFile() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Try to fetch share info (this would require a new endpoint to check share validity)
    setLoading(false);
  }, [token]);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await fetch(`/api/share/${token}/download`, {
        method: 'GET'
      });

      if (!response.ok) {
        // Try to parse JSON error response
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to download file';
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseErr) {
            // If JSON parsing fails, use status text
            errorMessage = `Error: ${response.status} ${response.statusText}`;
          }
        } else {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        
        setError(errorMessage);
        return;
      }

      // Get filename from response headers if available
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = 'download';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/);
        if (fileNameMatch) {
          try {
            // Decode UTF-8 encoded filename
            fileName = decodeURIComponent(fileNameMatch[1] || fileNameMatch[2]);
          } catch {
            fileName = fileNameMatch[1] || fileNameMatch[2] || 'download';
          }
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast({
        title: 'Success',
        description: 'File downloaded successfully'
      });
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive'
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading share information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Download className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Shared File</h1>
          <p className="text-muted-foreground">Download the shared file</p>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                ✓ This file has been shared with you. Click the button below to download it.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1"
                size="lg"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Share token: {token?.substring(0, 16)}...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
