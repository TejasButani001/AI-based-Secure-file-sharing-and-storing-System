import { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { authFetch } from '@/lib/authFetch';

interface RiskStatus {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  highest_risk_score: number;
  alert_count: number;
}

export function RiskStatusBanner() {
  const [riskStatus, setRiskStatus] = useState<RiskStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskStatus();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRiskStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiskStatus = async () => {
    try {
      const response = await authFetch('/api/alerts/check-risk');
      if (response.ok) {
        const data = await response.json();
        setRiskStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch risk status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !riskStatus) return null;
  if (riskStatus.risk_level === 'low' && riskStatus.alert_count === 0) return null;

  const config = {
    critical: {
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/20',
      icon: AlertOctagon,
      title: 'Critical Security Alert',
      message: 'Immediate action required. Suspicious activity detected on your account.'
    },
    high: {
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-500/20',
      icon: AlertTriangle,
      title: 'High Risk Warning',
      message: 'Multiple suspicious activities detected. Please review your account security.'
    },
    medium: {
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      borderColor: 'border-yellow-500/20',
      icon: AlertCircle,
      title: 'Security Notice',
      message: 'Some unusual activity has been detected on your account.'
    },
    low: {
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-500/20',
      icon: AlertCircle,
      title: 'Information',
      message: 'There is a new security-related event on your account.'
    }
  };

  const cfg = config[riskStatus.risk_level];
  const Icon = cfg.icon;

  if (riskStatus.alert_count === 0) return null;

  return (
    <div className={`${cfg.bgColor} ${cfg.borderColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${cfg.textColor} mt-0.5 shrink-0`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${cfg.textColor} mb-1`}>{cfg.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{cfg.message}</p>
          <p className={`text-xs font-medium ${cfg.textColor}`}>
            {riskStatus.alert_count} active alert{riskStatus.alert_count !== 1 ? 's' : ''} 
            {' '}• Risk Score: {riskStatus.highest_risk_score.toFixed(1)}/10
          </p>
        </div>
        <a
          href="/alerts"
          className={`text-xs font-semibold ${cfg.textColor} hover:underline whitespace-nowrap ml-4`}
        >
          View Details →
        </a>
      </div>
    </div>
  );
}
