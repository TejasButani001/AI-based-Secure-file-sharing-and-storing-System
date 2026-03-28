import { useState, useEffect } from 'react';
import { Copy, Share2, Trash2, Calendar, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/authFetch';

interface Share {
  share_id: number;
  share_token: string;
  is_public: boolean;
  expiry_time: string | null;
  created_at: string;
  access_count: number;
}

interface FileShareProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
  isOpen: boolean;
}

export function FileSharing({ fileId, fileName, onClose, isOpen }: FileShareProps) {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [expiryDays, setExpiryDays] = useState<number | null>(null);
  const [creatingShare, setCreatingShare] = useState(false);
  const { toast } = useToast();

  // Load shares when modal opens
  useEffect(() => {
    if (isOpen) {
      loadShares();
    }
  }, [isOpen]);

  // Load existing shares
  const loadShares = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/files/${fileId}/shares`);
      if (response.ok) {
        const data = await response.json();
        setShares(data.shares || []);
      } else {
        throw new Error('Failed to load shares');
      }
    } catch (error) {
      console.error('Error loading shares:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shares',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new share
  const handleCreateShare = async () => {
    try {
      setCreatingShare(true);
      const response = await authFetch(`/api/files/${fileId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_public: isPublic,
          expiry_days: expiryDays
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create share');
      }

      toast({
        title: 'Success',
        description: 'Share link created successfully'
      });

      setShowCreateForm(false);
      setIsPublic(false);
      setExpiryDays(null);
      await loadShares();
    } catch (error) {
      console.error('Error creating share:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create share',
        variant: 'destructive'
      });
    } finally {
      setCreatingShare(false);
    }
  };

  // Delete share
  const handleDeleteShare = async (shareId: number) => {
    if (!confirm('Are you sure you want to delete this share link?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/shares/${shareId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete share');
      }

      toast({
        title: 'Success',
        description: 'Share link deleted'
      });

      await loadShares();
    } catch (error) {
      console.error('Error deleting share:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete share',
        variant: 'destructive'
      });
    }
  };

  // Copy share link to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied',
      description: 'Share link copied to clipboard'
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Share File</h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">File: <span className="font-semibold text-foreground">{fileName}</span></p>

            {!showCreateForm ? (
              <Button
                onClick={() => {
                  setShowCreateForm(true);
                  loadShares();
                }}
                className="w-full mb-6"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Create New Share Link
              </Button>
            ) : (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-4">Create Share Link</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Share Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!isPublic}
                          onChange={() => setIsPublic(false)}
                          className="w-4 h-4"
                        />
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Private (Authenticated users only)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={isPublic}
                          onChange={() => setIsPublic(true)}
                          className="w-4 h-4"
                        />
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Public (Anyone with link)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Expiry (days from now - leave empty for no expiry)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={expiryDays || ''}
                      onChange={(e) => setExpiryDays(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="e.g., 7"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setIsPublic(false);
                        setExpiryDays(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateShare}
                      disabled={creatingShare}
                    >
                      {creatingShare ? 'Creating...' : 'Create Share'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Shares */}
            <div>
              <h3 className="font-semibold mb-3">Active Shares ({shares.length})</h3>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading shares...</p>
              ) : shares.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active shares. Create one above!</p>
              ) : (
                <div className="space-y-2">
                  {shares.map((share) => (
                    <div
                      key={share.share_id}
                      className="flex items-start justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {share.is_public ? (
                            <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                          <span className="text-xs font-medium">
                            {share.is_public ? 'PUBLIC' : 'PRIVATE'}
                          </span>
                        </div>
                        <code className="text-xs bg-background p-2 rounded block truncate font-mono">
                          {share.share_token}
                        </code>
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <p>Created: {formatDate(share.created_at)}</p>
                          {share.expiry_time && (
                            <p>Expires: {formatDate(share.expiry_time)}</p>
                          )}
                          <p>Accessed: {share.access_count} times</p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${window.location.origin}/share/${share.share_token}`)}
                          title="Copy share link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteShare(share.share_id)}
                          title="Delete share"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
