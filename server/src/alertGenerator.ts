/**
 * Alert Generator Module
 * 
 * Handles creation of security alerts for various suspicious activities:
 * - Multiple failed login attempts
 * - Login from new IP address
 * - Excessive file downloads
 * - Unauthorized file access attempts
 */

import { supabase } from './supabaseClient';

export interface AlertConfig {
    failedLoginThreshold: number; // Failed attempts in 1 hour to trigger alert
    downloadThreshold: number; // Downloads in 1 hour to trigger alert
    hourWindow: number; // Time window in bytes (milliseconds)
}

const DEFAULT_CONFIG: AlertConfig = {
    failedLoginThreshold: 3, // 3 failed attempts
    downloadThreshold: 10, // 10 downloads
    hourWindow: 60 * 60 * 1000 // 1 hour
};

/**
 * Create a security alert
 */
export async function createAlert(
    userId: number,
    alertType: string,
    riskScore: number, // 0-10 scale
    description: string
): Promise<boolean> {
    try {
        const { error } = await supabase.from('alerts').insert({
            user_id: userId,
            alert_type: alertType,
            risk_score: Math.min(10, Math.max(0, riskScore)), // Clamp to 0-10
            description,
            created_at: new Date().toISOString(),
            status: 'open'
        });

        if (error) {
            console.error(`[ALERT] Failed to create alert for user ${userId}:`, error);
            return false;
        }

        console.log(`[ALERT] ✓ Created ${alertType} alert for user ${userId} with risk score ${riskScore}`);
        return true;
    } catch (error) {
        console.error('[ALERT] Error creating alert:', error);
        return false;
    }
}

/**
 * Check for multiple failed login attempts
 */
export async function checkFailedLoginAttempts(
    userId: number,
    config: AlertConfig = DEFAULT_CONFIG
): Promise<boolean> {
    try {
        const since = new Date(Date.now() - config.hourWindow).toISOString();

        const { data: failedAttempts, error } = await supabase
            .from('login_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('success', false)
            .gte('login_time', since);

        if (error) {
            console.error('[ALERT] Error checking failed logins:', error);
            return false;
        }

        const failureCount = failedAttempts?.length || 0;

        if (failureCount >= config.failedLoginThreshold) {
            const riskScore = Math.min(10, 4 + failureCount); // Base 4 + 1 per attempt
            await createAlert(
                userId,
                'MULTIPLE_FAILED_LOGINS',
                riskScore,
                `${failureCount} failed login attempts detected in the last hour. This may indicate a brute force attack.`
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error('[ALERT] Error in checkFailedLoginAttempts:', error);
        return false;
    }
}

/**
 * Check if user is logging in from a new IP address
 */
export async function checkNewIpLogin(
    userId: number,
    currentIp: string
): Promise<boolean> {
    try {
        // Get all previous login IPs for this user
        const { data: previousLogins, error } = await supabase
            .from('login_logs')
            .select('ip_address')
            .eq('user_id', userId)
            .eq('success', true)
            .order('login_time', { ascending: false })
            .limit(10);

        if (error) {
            console.error('[ALERT] Error fetching login history:', error);
            return false;
        }

        if (!previousLogins || previousLogins.length === 0) {
            // First login, no alert needed
            return false;
        }

        const knownIps = previousLogins.map(log => log.ip_address);
        const isNewIp = !knownIps.includes(currentIp);

        if (isNewIp) {
            await createAlert(
                userId,
                'LOGIN_FROM_NEW_IP',
                6,
                `Login detected from a new IP address: ${currentIp}. If this wasn't you, please change your password immediately.`
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error('[ALERT] Error in checkNewIpLogin:', error);
        return false;
    }
}

/**
 * Check for excessive file downloads
 */
export async function checkExcessiveDownloads(
    userId: number,
    config: AlertConfig = DEFAULT_CONFIG
): Promise<boolean> {
    try {
        const since = new Date(Date.now() - config.hourWindow).toISOString();

        const { data: downloads, error } = await supabase
            .from('access_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('action', 'download')
            .gte('timestamp', since);

        if (error) {
            console.error('[ALERT] Error checking downloads:', error);
            return false;
        }

        const downloadCount = downloads?.length || 0;

        if (downloadCount >= config.downloadThreshold) {
            const riskScore = Math.min(10, 5 + downloadCount / 2); // Base 5 + 0.5 per download
            await createAlert(
                userId,
                'EXCESSIVE_DOWNLOADS',
                riskScore,
                `${downloadCount} files downloaded in the last hour. This unusual activity may indicate unauthorized access to your account.`
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error('[ALERT] Error in checkExcessiveDownloads:', error);
        return false;
    }
}

/**
 * Check for unauthorized file access attempts
 */
export async function checkUnauthorizedAccess(
    userId: number,
    fileId: string,
    attemptType: 'password_failure' | 'permission_denied' = 'permission_denied'
): Promise<boolean> {
    try {
        // Check for multiple failed access attempts on same file
        const since = new Date(Date.now() - DEFAULT_CONFIG.hourWindow).toISOString();

        const { data: deniedAccess, error } = await supabase
            .from('access_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('file_id', fileId)
            .in('action', ['download_denied_password', 'access_denied'])
            .gte('timestamp', since);

        if (error) {
            console.error('[ALERT] Error checking access denials:', error);
            return false;
        }

        const denialCount = deniedAccess?.length || 0;

        if (denialCount >= 3) {
            const riskScore = 7;
            await createAlert(
                userId,
                'UNAUTHORIZED_ACCESS_ATTEMPT',
                riskScore,
                `Multiple failed attempts to access file ID ${fileId}. Your account may have been compromised.`
            );
            return true;
        }

        // Also alert on single severe attempt
        if (attemptType === 'password_failure' && denialCount > 0) {
            await createAlert(
                userId,
                'FAILED_PASSWORD_VERIFICATION',
                5,
                `Failed password verification for file access. If this wasn't you, your account may be at risk.`
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error('[ALERT] Error in checkUnauthorizedAccess:', error);
        return false;
    }
}

/**
 * Check for suspicious login time pattern
 */
export async function checkSuspiciousLoginTime(
    userId: number,
    currentHour: number = new Date().getHours()
): Promise<boolean> {
    try {
        // Check if user typically logs in at this hour
        const { data: historicalLogins, error } = await supabase
            .from('login_logs')
            .select('login_time')
            .eq('user_id', userId)
            .eq('success', true)
            .limit(50);

        if (error) {
            console.error('[ALERT] Error checking login patterns:', error);
            return false;
        }

        if (!historicalLogins || historicalLogins.length < 5) {
            // Not enough history to determine pattern
            return false;
        }

        // Calculate most common login hours
        const hourCounts: Record<number, number> = {};
        historicalLogins.forEach(log => {
            const hour = new Date(log.login_time).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const usualHours = Object.entries(hourCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5) // Top 5 hours
            .map(([hour]) => parseInt(hour));

        const isUnusualTime = !usualHours.includes(currentHour);

        // Check if it's night time (22:00 - 06:00) for night owls warning
        const isNightTime = currentHour >= 22 || currentHour < 6;

        if (isUnusualTime && isNightTime) {
            const riskScore = 4;
            await createAlert(
                userId,
                'UNUSUAL_LOGIN_TIME',
                riskScore,
                `Login detected at an unusual time (${currentHour}:00). If this wasn't you, please verify your account security.`
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error('[ALERT] Error in checkSuspiciousLoginTime:', error);
        return false;
    }
}

/**
 * Check user's overall risk level based on recent activity
 */
export async function calculateUserRiskLevel(userId: number): Promise<'low' | 'medium' | 'high' | 'critical'> {
    try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours

        // Count various suspicious activities
        const { data: recentAlerts } = await supabase
            .from('alerts')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('status', 'open')
            .gte('created_at', since);

        const alertCount = recentAlerts?.length || 0;

        if (alertCount >= 5) return 'critical';
        if (alertCount >= 3) return 'high';
        if (alertCount >= 1) return 'medium';
        return 'low';
    } catch (error) {
        console.error('[ALERT] Error calculating risk level:', error);
        return 'low';
    }
}

/**
 * Run all alert checks for a user login
 */
export async function runLoginAlertChecks(
    userId: number,
    ipAddress: string
): Promise<void> {
    try {
        console.log(`[ALERT] Running alert checks for user ${userId} from IP ${ipAddress}`);

        // Run checks in parallel
        await Promise.all([
            checkFailedLoginAttempts(userId),
            checkNewIpLogin(userId, ipAddress),
            checkSuspiciousLoginTime(userId)
        ]);

        console.log(`[ALERT] ✓ Alert checks completed for user ${userId}`);
    } catch (error) {
        console.error('[ALERT] Error running login alert checks:', error);
    }
}

/**
 * Run all alert checks for file downloads
 */
export async function runDownloadAlertChecks(
    userId: number,
    fileId?: string
): Promise<void> {
    try {
        console.log(`[ALERT] Running alert checks for downloads by user ${userId}`);

        await Promise.all([
            checkExcessiveDownloads(userId),
            fileId ? checkUnauthorizedAccess(userId, fileId) : Promise.resolve(false)
        ]);

        console.log(`[ALERT] ✓ Download alert checks completed for user ${userId}`);
    } catch (error) {
        console.error('[ALERT] Error running download alert checks:', error);
    }
}

export default {
    createAlert,
    checkFailedLoginAttempts,
    checkNewIpLogin,
    checkExcessiveDownloads,
    checkUnauthorizedAccess,
    checkSuspiciousLoginTime,
    calculateUserRiskLevel,
    runLoginAlertChecks,
    runDownloadAlertChecks
};
