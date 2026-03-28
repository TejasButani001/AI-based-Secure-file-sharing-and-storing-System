import { useEffect, useState } from 'react';
import { Bell, Filter, AlertTriangle, Search, Download, Loader2, Lock, LockOpen, History, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authFetch } from '@/lib/authFetch';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  alert_id: string;
  user_id: number;
  alert_type: string;
  risk_score: number;
  description: string;
  created_at: string;
  status: string;
}

interface AlertStats {
  total_alerts: number;
  by_status: {
    open: number;
    investigating: number;
    resolved: number;
    dismissed: number;
  };
  by_risk_level: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  by_type: Record<string, number>;
  avg_risk_score: string;
}

interface StatusLog {
  id: string;
  user_id: number;
  action: 'blocked' | 'unblocked';
  reason: string | null;
  admin_id: number;
  timestamp: string;
  admin_user?: { username: string; email: string };
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [blockedUsers, setBlockedUsers] = useState<Set<number>>(new Set());
  const [blockingUser, setBlockingUser] = useState<number | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUserForBlock, setSelectedUserForBlock] = useState<number | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<number | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [filterStatus, filterRiskLevel]);

  useEffect(() => {
    // Check status of users in alerts
    const checkAllUserStatuses = async () => {
      try {
        const newBlockedUsers = new Set<number>();
        
        // Use Promise.all for concurrent status checks
        const statusPromises = alerts.map(alert => checkUserStatus(alert.user_id));
        const statuses = await Promise.all(statusPromises);
        
        statuses.forEach((isBlocked, index) => {
          if (isBlocked) {
            newBlockedUsers.add(alerts[index].user_id);
          }
        });
        
        setBlockedUsers(newBlockedUsers);
      } catch (error) {
        console.error('[UI] Error checking all user statuses:', error);
      }
    };

    if (alerts.length > 0) {
      checkAllUserStatuses();
    }
  }, [alerts]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let minRisk = 0, maxRisk = 10;

      if (filterRiskLevel !== 'all') {
        if (filterRiskLevel === 'critical') [minRisk, maxRisk] = [8, 10];
        else if (filterRiskLevel === 'high') [minRisk, maxRisk] = [6, 8];
        else if (filterRiskLevel === 'medium') [minRisk, maxRisk] = [4, 6];
        else if (filterRiskLevel === 'low') [minRisk, maxRisk] = [0, 4];
      }

      const params = new URLSearchParams({
        limit: '200',
        status: filterStatus,
        min_risk: minRisk.toString(),
        max_risk: maxRisk.toString(),
        sort_by: 'created_at',
        sort_order: 'desc'
      });

      const response = await authFetch(`/api/admin/alerts/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      } else {
        throw new Error('Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authFetch('/api/admin/alerts/stats?days=30');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleResolveAlert = async (alertId: string, status: string) => {
    try {
      const response = await authFetch(`/api/admin/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Alert marked as ${status}`
        });
        fetchAlerts();
        fetchStats();
      } else {
        throw new Error('Failed to resolve alert');
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await authFetch(`/api/admin/alerts/${alertId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Alert deleted successfully'
        });
        fetchAlerts();
        fetchStats();
      } else {
        throw new Error('Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive'
      });
    }
  };

  const checkUserStatus = async (userId: number) => {
    try {
      const response = await authFetch(`/api/admin/users/${userId}/status`);
      if (response.ok) {
        const data = await response.json();
        return data.status === 'blocked';
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
    return false;
  };

  const handleBlockUser = async (userId: number) => {
    const isBlocked = blockedUsers.has(userId);
    
    if (isBlocked) {
      // Direct unblock without modal
      await performBlockAction(userId, null, true);
    } else {
      // Show modal to add reason for blocking
      setSelectedUserForBlock(userId);
      setBlockReason('');
      setShowBlockModal(true);
    }
  };

  const performBlockAction = async (userId: number, reason: string | null, isUnblock: boolean) => {
    try {
      setBlockingUser(userId);
      const endpoint = isUnblock
        ? `/api/admin/users/${userId}/unblock`
        : `/api/admin/users/${userId}/block`;

      console.log(`[UI] ${isUnblock ? 'Unblocking' : 'Blocking'} user ${userId}`);

      const response = await authFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: reason || undefined
        })
      });

      const responseData = await response.json();
      console.log(`[UI] Response:`, responseData);

      if (!response.ok) {
        throw new Error(responseData?.error || 'Failed to update user status');
      }

      const newBlockedUsers = new Set(blockedUsers);
      if (isUnblock) {
        newBlockedUsers.delete(userId);
      } else {
        newBlockedUsers.add(userId);
      }
      setBlockedUsers(newBlockedUsers);
      
      toast({
        title: 'Success',
        description: isUnblock 
          ? `User ${userId} has been unblocked`
          : `User ${userId} has been blocked successfully`
      });

      // Refresh alerts to ensure UI is in sync
      setTimeout(() => {
        fetchAlerts();
      }, 500);
    } catch (error) {
      console.error(`[UI] Error ${isUnblock ? 'unblocking' : 'blocking'} user:`, error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user account status',
        variant: 'destructive'
      });
    } finally {
      setBlockingUser(null);
    }
  };

  const closeBlockModal = () => {
    setShowBlockModal(false);
    setBlockReason('');
    setSelectedUserForBlock(null);
  };

  const handleSubmitBlock = async () => {
    if (!selectedUserForBlock) return;
    
    await performBlockAction(selectedUserForBlock, blockReason || null, false);
    closeBlockModal();
  };

  const fetchStatusHistory = async (userId: number) => {
    try {
      setLoadingHistory(true);
      const response = await authFetch(`/api/admin/users/${userId}/status-history?limit=50`);
      if (response.ok) {
        const data = await response.json();
        setStatusHistory(data.history || []);
      } else {
        throw new Error('Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching status history:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch block history',
        variant: 'destructive'
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleViewHistory = async (userId: number) => {
    setSelectedUserForHistory(userId);
    setShowHistoryModal(true);
    await fetchStatusHistory(userId);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedUserForHistory(null);
    setStatusHistory([]);
    setLoadingHistory(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAlerts = alerts.filter(alert =>
    searchTerm === '' || 
    alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // Block Reason Modal
  const BlockModal = () => (
    <>
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Block User {selectedUserForBlock}</h2>
              <button
                onClick={closeBlockModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Reason for blocking (optional)</label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Multiple suspicious login attempts, Violating security policy..."
                  className="w-full  px-3 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={closeBlockModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSubmitBlock}
                  disabled={blockingUser === selectedUserForBlock}
                >
                  {blockingUser === selectedUserForBlock ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  Block User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // History Modal
  const HistoryModal = () => (
    <>
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-2/3 max-h-96 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5" />
                Block/Unblock History - User {selectedUserForHistory}
              </h2>
              <button
                onClick={closeHistoryModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : statusHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No block/unblock history found
              </div>
            ) : (
              <div className="space-y-3">
                {statusHistory.map((log) => (
                  <div key={log.id} className="border rounded-lg p-3 bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={log.action === 'blocked' ? 'bg-destructive text-white' : 'bg-green-600 text-white'}
                        >
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Admin:</span> {log.admin_user?.username || `User ${log.admin_id}`} ({log.admin_user?.email})
                      </p>
                      {log.reason && (
                        <p>
                          <span className="font-medium">Reason:</span> {log.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <DashboardLayout>
      <BlockModal />
      <HistoryModal />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Alert Management</h1>
          <p className="text-muted-foreground">Monitor and manage all system security alerts</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Alerts</p>
              <p className="text-3xl font-bold">{stats.total_alerts}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Open Alerts</p>
              <p className="text-3xl font-bold text-destructive">{stats.by_status.open}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Critical Alerts</p>
              <p className="text-3xl font-bold text-destructive">{stats.by_risk_level.critical}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Avg Risk Score</p>
              <p className="text-3xl font-bold">{stats.avg_risk_score}</p>
            </div>
          </div>
        )}

        {/* Filter & Search */}
        <div className="bg-card border rounded-lg p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Risk Level
                </label>
                <select
                  value={filterRiskLevel}
                  onChange={(e) => setFilterRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Levels</option>
                  <option value="critical">Critical (8+)</option>
                  <option value="high">High (6-8)</option>
                  <option value="medium">Medium (4-6)</option>
                  <option value="low">Low (0-4)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No alerts found</p>
              <p className="text-sm text-muted-foreground">No alerts match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Risk</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.alert_id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium">{alert.alert_type.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <code className="bg-muted px-2 py-1 rounded text-xs">{alert.user_id}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                        {alert.description}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          className={`font-mono text-white ${
                            alert.risk_score >= 8 ? 'bg-destructive' :
                            alert.risk_score >= 6 ? 'bg-orange-600' :
                            alert.risk_score >= 4 ? 'bg-yellow-600' :
                            'bg-blue-600'
                          }`}
                        >
                          {alert.risk_score.toFixed(1)}/10
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(alert.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="outline" className="capitalize">
                          {alert.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-2">
                        {alert.status === 'open' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.alert_id, 'investigating')}
                              className="text-xs"
                            >
                              Investigate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.alert_id, 'resolved')}
                              className="text-xs"
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {alert.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleResolveAlert(alert.alert_id, 'dismissed')}
                            className="text-xs"
                          >
                            Dismiss
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewHistory(alert.user_id)}
                          className="text-xs gap-1"
                        >
                          <History className="w-3 h-3" />
                          History
                        </Button>
                        <Button
                          size="sm"
                          variant={blockedUsers.has(alert.user_id) ? "default" : "destructive"}
                          onClick={() => handleBlockUser(alert.user_id)}
                          disabled={blockingUser === alert.user_id}
                          className="text-xs gap-1"
                        >
                          {blockingUser === alert.user_id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : blockedUsers.has(alert.user_id) ? (
                            <>
                              <LockOpen className="w-3 h-3" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              Block
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteAlert(alert.alert_id)}
                          className="text-xs"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </div>
      </div>
    </DashboardLayout>
  );
}
