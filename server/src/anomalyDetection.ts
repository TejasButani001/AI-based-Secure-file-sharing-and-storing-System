/**
 * Isolation Forest Anomaly Detection Module
 * 
 * Used to detect suspicious user behavior based on:
 * - Login time patterns
 * - IP address changes
 * - Failed login attempts
 * - Device/browser changes
 */

import { supabase } from './supabaseClient';

interface UserBehaviorFeatures {
    userId: number;
    loginHour: number;
    ipAddress: string;
    failedAttempts: number;
    deviceChange: number; // 0 or 1
    timeOfDay: 'business' | 'night' | 'early_morning'; // business: 9-5, night: 10pm-6am, early_morning: 6-9am
}

interface AnomalyScore {
    userId: number;
    anomalyScore: number; // 0-1, higher = more anomalous
    isAnomaly: boolean; // true if score > threshold
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
}

// Isolation Forest implementation (simplified)
class AnomalyDetector {
    private threshold = 0.6; // Anomaly threshold (0-1)

    /**
     * Calculate anomaly score for user behavior
     * Uses multiple heuristics instead of full Isolation Forest
     * (Full IF would require ML library or Python Flask)
     */
    calculateAnomalyScore(features: UserBehaviorFeatures): AnomalyScore {
        let anomalyScore = 0;
        const factors: string[] = [];

        // 1. Check unusual login time
        const loginTimeAnomalyScore = this.checkLoginTimeAnomaly(features.loginHour);
        if (loginTimeAnomalyScore > 0.3) {
            anomalyScore += loginTimeAnomalyScore * 0.3; // 30% weight
            factors.push(`Unusual login time: ${features.loginHour}:00`);
        }

        // 2. Check failed login attempts
        const failedLoginScore = this.checkFailedLogins(features.failedAttempts);
        if (failedLoginScore > 0.3) {
            anomalyScore += failedLoginScore * 0.35; // 35% weight
            factors.push(`${features.failedAttempts} failed login attempts`);
        }

        // 3. Check device/browser change
        if (features.deviceChange > 0) {
            anomalyScore += 0.25; // 25% weight
            factors.push('New device or browser detected');
        }

        // 4. Check time of day pattern
        const timePatternScore = this.checkTimePatternAnomaly(features.timeOfDay);
        if (timePatternScore > 0) {
            anomalyScore += timePatternScore * 0.1; // 10% weight
            factors.push(`Activity during ${features.timeOfDay}`);
        }

        const isAnomaly = anomalyScore > this.threshold;
        const riskLevel = this.getRiskLevel(anomalyScore);

        return {
            userId: features.userId,
            anomalyScore: Math.min(anomalyScore, 1), // Cap at 1
            isAnomaly,
            risk_level: riskLevel,
            factors
        };
    }

    /**
     * Check if login hour is unusual
     * Returns score 0-1 (1 = very unusual)
     */
    private checkLoginTimeAnomaly(hour: number): number {
        // Normal business hours: 8-22 (8am-10pm)
        if (hour >= 8 && hour <= 22) return 0;
        // Early morning: 6-8am (slightly unusual)
        if (hour >= 6 && hour < 8) return 0.3;
        // Night: 10pm-6am (very unusual)
        return 0.8;
    }

    /**
     * Check for brute force attempts
     */
    private checkFailedLogins(failedAttempts: number): number {
        if (failedAttempts === 0) return 0;
        if (failedAttempts === 1) return 0.2;
        if (failedAttempts <= 3) return 0.5;
        return 1; // Critical
    }

    /**
     * Check unusual time patterns
     */
    private checkTimePatternAnomaly(timeOfDay: string): number {
        if (timeOfDay === 'business') return 0;
        if (timeOfDay === 'early_morning') return 0.3;
        if (timeOfDay === 'night') return 0.5;
        return 0;
    }

    /**
     * Determine risk level based on anomaly score
     */
    private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
        if (score < 0.3) return 'low';
        if (score < 0.5) return 'medium';
        if (score < 0.75) return 'high';
        return 'critical';
    }

    /**
     * Extract time of day category
     */
    static getTimeOfDay(hour: number): 'business' | 'night' | 'early_morning' {
        if (hour >= 9 && hour <= 17) return 'business';
        if (hour >= 22 || hour < 6) return 'night';
        return 'early_morning';
    }
}

/**
 * Process login event and detect anomalies
 */
export async function detectAnomalyOnLogin(
    userId: number,
    ipAddress: string,
    userAgent?: string
): Promise<AnomalyScore> {
    try {
        const detector = new AnomalyDetector();
        const now = new Date();
        const hour = now.getHours();

        // Fetch recent login history
        const { data: loginLogs, error: logsError } = await supabase
            .from('login_logs')
            .select('ip_address, login_time')
            .eq('user_id', userId)
            .order('login_time', { ascending: false })
            .limit(10);

        if (logsError) console.error('[ANOMALY] Error fetching login logs:', logsError);

        // Check for failed login attempts in last hour
        const { data: failedLogins, error: failedError } = await supabase
            .from('login_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('success', false)
            .gte('login_time', new Date(Date.now() - 3600000).toISOString());

        if (failedError) console.error('[ANOMALY] Error fetching failed logins:', failedError);

        // Detect device change
        let deviceChange = 0;
        if (loginLogs && loginLogs.length > 0) {
            const lastLogin = loginLogs[0];
            if (lastLogin.ip_address !== ipAddress) {
                deviceChange = 1;
            }
        }

        // Calculate features
        const features: UserBehaviorFeatures = {
            userId,
            loginHour: hour,
            ipAddress,
            failedAttempts: failedLogins?.length || 0,
            deviceChange,
            timeOfDay: AnomalyDetector.getTimeOfDay(hour)
        };

        console.log('[ANOMALY] Features extracted:', features);

        // Calculate anomaly score
        const anomalyScore = detector.calculateAnomalyScore(features);
        console.log('[ANOMALY] Anomaly score calculated:', anomalyScore);

        // If anomaly detected, create alert
        if (anomalyScore.isAnomaly) {
            await createSecurityAlert(userId, anomalyScore);
        }

        return anomalyScore;
    } catch (error) {
        console.error('[ANOMALY] Error in anomaly detection:', error);
        // Return low risk if error
        return {
            userId,
            anomalyScore: 0,
            isAnomaly: false,
            risk_level: 'low',
            factors: []
        };
    }
}

/**
 * Create security alert in database
 */
export async function createSecurityAlert(
    userId: number,
    anomalyScore: AnomalyScore
): Promise<void> {
    try {
        const { error } = await supabase.from('alerts').insert({
            user_id: userId,
            alert_type: 'ANOMALOUS_LOGIN',
            risk_score: anomalyScore.anomalyScore,
            description: `Suspicious login detected. Risk Level: ${anomalyScore.risk_level}. Factors: ${anomalyScore.factors.join(', ')}`,
            created_at: new Date().toISOString(),
            status: 'open'
        });

        if (error) {
            console.error('[ANOMALY] Failed to create alert:', error);
        } else {
            console.log(`[ANOMALY] Alert created for user ${userId}`);
        }
    } catch (error) {
        console.error('[ANOMALY] Error creating alert:', error);
    }
}

/**
 * Get user behavior profile for ML training
 */
export async function getUserBehaviorProfile(userId: number, days: number = 30) {
    try {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

        // Get login times
        const { data: loginData } = await supabase
            .from('login_logs')
            .select('login_time, ip_address, success')
            .eq('user_id', userId)
            .gte('login_time', since)
            .order('login_time', { ascending: false });

        // Get file access patterns
        const { data: accessData } = await supabase
            .from('access_logs')
            .select('timestamp, action')
            .eq('user_id', userId)
            .gte('timestamp', since);

        // Get ML activity data
        const { data: mlData } = await supabase
            .from('ml_activity_data')
            .select('*')
            .eq('user_id', userId);

        return {
            userId,
            loginHistory: loginData || [],
            accessHistory: accessData || [],
            mlData: mlData || [],
            totalLogins: loginData?.length || 0,
            uniqueIPs: new Set(loginData?.map(l => l.ip_address) || []).size
        };
    } catch (error) {
        console.error('[ANOMALY] Error getting user profile:', error);
        return null;
    }
}

export default { detectAnomalyOnLogin, createSecurityAlert, getUserBehaviorProfile };
