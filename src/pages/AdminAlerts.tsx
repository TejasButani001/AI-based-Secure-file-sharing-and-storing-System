import { useEffect, useState } from 'react';
import { Bell, Filter, AlertTriangle, Search, Download, Loader2 } from 'lucide-react';
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

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [filterStatus, filterRiskLevel]);

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

  return (
    <DashboardLayout>
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
