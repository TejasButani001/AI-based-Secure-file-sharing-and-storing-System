# Security Alert Functionality - Complete Documentation

## Overview

The alert system monitors user activities and detects suspicious behavior in real-time. It integrates seamlessly with your existing login and file management systems to provide comprehensive security monitoring.

## Features Implemented

### 1. **Alert Generation Module** (`alertGenerator.ts`)

A comprehensive utility module that handles all alert creation and detection logic.

#### Alert Types Generated:

1. **MULTIPLE_FAILED_LOGINS**
   - Triggered when a user has 3+ failed login attempts within 1 hour
   - Risk Score: 4-10 (based on number of attempts)
   - Used to detect brute force attacks

2. **LOGIN_FROM_NEW_IP**
   - Triggered when user logs in from an IP address not seen before
   - Risk Score: 6/10
   - Helps detect unauthorized access from new locations

3. **EXCESSIVE_DOWNLOADS**
   - Triggered when a user downloads 10+ files in 1 hour
   - Risk Score: 5-10 (based on download count)
   - Detects data exfiltration attempts

4. **UNAUTHORIZED_ACCESS_ATTEMPT**
   - Triggered when 3+ password verification failures occur for file access
   - Risk Score: 7/10
   - Indicates potential malicious access attempts

5. **UNUSUAL_LOGIN_TIME**
   - Triggered when user logs in at unusual hours
   - Risk Score: 4/10
   - Analyzes user's historical login patterns

6. **ANOMALOUS_LOGIN** (from anomaly detection module)
   - Advanced detection using Isolation Forest algorithm
   - Considers multiple factors: login time, failed attempts, device changes
   - Risk Score: varies based on detected anomalies

### 2. **Frontend Components**

#### RiskStatusBanner (`RiskStatusBanner.tsx`)

- Displays prominently on the Dashboard
- Shows current risk level (low/medium/high/critical)
- Shows alert count and risk score
- Color-coded warnings based on severity
- Auto-refreshes every 5 minutes
- Links directly to alerts page

#### Admin Alerts Management (`AdminAlerts.tsx`)

- **Search & Filter**: Search by alert type, keyword
- **Status Filtering**: View open, investigating, resolved, dismissed alerts
- **Risk Level Filtering**: Filter by critical/high/medium/low
- **Date Range**: Filter by creation date
- **Sorting**: Sort by creation date, risk score, etc.
- **Bulk Actions**: Mark alerts as resolved, investigating, or dismissed
- **Statistics Dashboard**: View total alerts, open count, risk distribution
- **Admin Actions Logging**: Track all admin actions on alerts

### 3. **Backend API Endpoints**

#### Alert Retrieval

```
GET /api/alerts
- Retrieve user's own alerts
- Optional: filter by status, limit results
- Response: { alerts: [...] }
```

#### Alert Management

```
PUT /api/alerts/:alertId
- User can update their own alert status
- Allowed statuses: open, investigating, resolved, dismissed
```

```
GET /api/admin/alerts/search
- Admin endpoint for advanced alert search
- Query parameters:
  - alert_type: Filter by type
  - status: open/investigating/resolved/dismissed
  - min_risk / max_risk: Risk score range
  - user_id: Filter by user
  - start_date / end_date: Date range
  - sort_by: Column to sort by
  - limit / offset: Pagination
- Response: { total, limit, offset, alerts: [...] }
```

```
GET /api/admin/alerts/stats
- Get alert statistics for past N days (default: 30)
- Query: ?days=30
- Response: {
    total_alerts,
    by_status: {...},
    by_risk_level: {...},
    by_type: {...},
    avg_risk_score
  }
```

```
POST /api/admin/alerts/:alertId/resolve
- Mark alert as resolved/dismissed/false_alarm
- Logs admin action
- Request: { status, resolution_notes }
```

```
GET /api/alerts/check-risk
- Get user's current risk status
- Response: {
    risk_level,
    highest_risk_score,
    alert_count,
    recent_alerts: [...]
  }
```

### 4. **Alert Triggers Integration**

#### Login Endpoint (`/api/auth/login`)

- Checks for failed login attempts on login failure
- Checks for new IP on successful login
- Checks for suspicious login time patterns
- Runs anomaly detection on successful login
- All checks are non-blocking (failures don't prevent login)

#### File Download Endpoint (`/api/files/:fileId/download`)

- Logs unauthorized access attempts
- Checks for excessive downloads after successful download
- Triggers alerts on repeated password failures
- All checks are non-blocking

## Database Schema

### Alerts Table

```sql
CREATE TABLE alerts (
    alert_id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    alert_type TEXT,
    risk_score FLOAT (0-10),
    description TEXT,
    created_at TIMESTAMP,
    status TEXT (open/investigating/resolved/dismissed)
);

Indexes:
- idx_alerts_user_id
- idx_alerts_status
- idx_alerts_created_at
```

## Risk Score Calculation

Risk scores range from 0-10:

- **8-10**: Critical
  - Immediate action required
  - Multiple severe anomalies detected
  - Possible account compromise

- **6-8**: High
  - Significant suspicious activity
  - Should investigate
  - Multiple risk factors present

- **4-6**: Medium
  - Some unusual behavior detected
  - Worth reviewing
  - Could be legitimate activity

- **0-4**: Low
  - Minor anomalies
  - Informational only
  - Likely benign

## User Experience

### For Regular Users

1. See RiskStatusBanner on Dashboard when alerts are present
2. View personal alerts in `/alerts` page
3. Can dismiss or mark alerts as investigated
4. Click "View Details" in banner to go to alerts page

### For Administrators

1. View all user alerts in `/admin-alerts` page
2. Search and filter alerts by multiple criteria
3. See alert statistics and trends
4. Mark alerts as resolved after investigation
5. Track all alert management actions in audit logs

## Security Considerations

### Access Control

- Users can only view their own alerts
- Admins can view all alerts
- Only admins can resolve/investigate alerts
- All admin actions are logged in audit_trail table

### Non-blocking Detection

- Alert checks run asynchronously
- Never block user login or file operations
- Errors in alert generation don't impact user experience
- Graceful fallback to heuristic-based detection

### Thresholds (Configurable)

- Failed login threshold: 3 attempts per hour
- Download threshold: 10 files per hour
- Unauthorized access threshold: 3 failed attempts per file per hour

## Configuration

All thresholds are defined in `alertGenerator.ts`:

```typescript
const DEFAULT_CONFIG: AlertConfig = {
  failedLoginThreshold: 3, // Failed attempts to trigger alert
  downloadThreshold: 10, // Downloads to trigger alert
  hourWindow: 60 * 60 * 1000, // 1 hour in milliseconds
};
```

To modify thresholds, update the DEFAULT_CONFIG object.

## Monitoring the System

### Key Metrics to Watch

1. **Alert Volume**: Spike in alert count indicates potential issues
2. **Risk Distribution**: Many critical alerts = serious security concerns
3. **Alert Types**: Which types of attacks are most common?
4. **User-Specific**: User with persistently high risk may need intervention
5. **False Positives**: Monitor resolution_notes for legitimate activity

### Recommended Admin Actions

1. Review critical alerts immediately
2. Investigate high-risk alerts within 24 hours
3. Archive resolved alerts weekly
4. Monitor trends in alert types monthly
5. Adjust thresholds based on false positive rate

## Testing

### Test Failed Logins

1. Go to login page
2. Enter wrong password 3+ times
3. Check `/api/alerts` endpoint or Admin Alerts page
4. Alert of type MULTIPLE_FAILED_LOGINS should appear

### Test New IP Login

1. Login from one IP address
2. Login from different IP address
3. Check alerts for LOGIN_FROM_NEW_IP

### Test Excessive Downloads

1. Download 10+ files rapidly
2. Check alerts for EXCESSIVE_DOWNLOADS
3. Adjust threshold in DEFAULT_CONFIG to test

## Future Enhancements

1. **Email Notifications**: Send alerts to users and admins
2. **Anomaly Detection ML**: Implement full Isolation Forest in Python
3. **IP Geolocation**: Add geolocation to IP-based alerts
4. **Device Fingerprinting**: Track device changes more accurately
5. **Rate Limiting**: Auto-block IPs with repeated attacks
6. **Alert Rules Engine**: Create custom alert rules
7. **Machine Learning**: Train model on historical data for better detection

## Troubleshooting

### Alerts Not Appearing

1. Check that database migrations are applied
2. Verify alert generation is enabled in login/download endpoints
3. Check server logs for alert errors
4. Ensure users are using correct endpoints

### Too Many False Positives

1. Increase failedLoginThreshold to 5
2. Increase downloadThreshold to 15
3. Disable unusual login time alerts if not needed
4. Review user behavior patterns

### Performance Issues

1. Archive old alerts regularly
2. Add indexes on frequently queried columns
3. Implement pagination in admin alerts view
4. Consider archiving alerts older than 90 days

## API Response Examples

### Get User's Risk Status

```bash
curl -H "Authorization: Bearer token" https://your-app/api/alerts/check-risk
```

Response:

```json
{
  "risk_level": "high",
  "highest_risk_score": 7.5,
  "alert_count": 2,
  "recent_alerts": [
    {
      "alert_id": "1",
      "alert_type": "MULTIPLE_FAILED_LOGINS",
      "risk_score": 7.5,
      "description": "3 failed login attempts detected...",
      "created_at": "2024-01-15T10:30:00Z",
      "status": "open"
    }
  ]
}
```

### Search Alerts (Admin)

```bash
curl -H "Authorization: Bearer admin_token" \
  "https://your-app/api/admin/alerts/search?status=open&min_risk=6"
```

Response:

```json
{
  "total": 5,
  "limit": 50,
  "offset": 0,
  "alerts": [...]
}
```

## License & Support

For issues or questions about the alert system, check the server logs at:

- `server/src/alertGenerator.ts` - Alert logic
- `server/src/index.ts` - Endpoint implementations
- Browser console - Frontend errors
