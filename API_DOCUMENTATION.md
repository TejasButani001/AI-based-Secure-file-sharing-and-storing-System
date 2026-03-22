# API List (Sorted, Short)

Base URL: `http://localhost:3001`

Auth legend:

- `Public` = no token
- `JWT` = `Authorization: Bearer <token>`
- `JWT+Admin` = token + admin role

## Endpoints (A-Z by path)

| Method | Path                                   | Auth      | Purpose                             | Body/Query (short)                                 |
| ------ | -------------------------------------- | --------- | ----------------------------------- | -------------------------------------------------- |
| GET    | `/api/admin/access-control`            | JWT+Admin | Users + files + file access map     | -                                                  |
| POST   | `/api/admin/file-access`               | JWT+Admin | Grant/update file permission        | body: `fileId,userId,accessType(read/write/admin)` |
| DELETE | `/api/admin/file-access/:permissionId` | JWT+Admin | Revoke file permission              | -                                                  |
| DELETE | `/api/admin/user/:email`               | Public    | Delete user by email (test/cleanup) | -                                                  |
| PUT    | `/api/admin/user/:userId/activate`     | JWT+Admin | Activate user                       | -                                                  |
| PUT    | `/api/admin/user/:userId/role`         | JWT+Admin | Change role                         | body: `role(admin/user)`                           |
| PUT    | `/api/admin/user/:userId/suspend`      | JWT+Admin | Suspend user                        | -                                                  |
| POST   | `/api/auth/google`                     | Public    | Google OAuth login                  | body: `credential`                                 |
| POST   | `/api/auth/login`                      | Public    | Email/password login                | body: `email,password`                             |
| GET    | `/api/auth/me`                         | JWT       | Current user profile                | -                                                  |
| POST   | `/api/auth/register`                   | Public    | Register account                    | body: `email,password,username?,role?`             |
| GET    | `/api/files`                           | JWT       | List own files                      | -                                                  |
| DELETE | `/api/files/:fileId`                   | JWT       | Delete file (owner/admin)           | -                                                  |
| GET    | `/api/files/:fileId/download`          | JWT       | Download file (owner/admin)         | -                                                  |
| POST   | `/api/files/upload`                    | JWT       | Upload file                         | multipart: `file`, `description?`                  |
| GET    | `/api/health`                          | Public    | API + DB health check               | -                                                  |
| GET    | `/api/logs`                            | JWT+Admin | Latest audit logs                   | -                                                  |
| GET    | `/api/ml/alerts`                       | JWT+Admin | List security alerts                | query: `limit?,status?`                            |
| PUT    | `/api/ml/alerts/:alertId`              | JWT+Admin | Update alert status                 | body: `status`                                     |
| GET    | `/api/ml/dashboard`                    | JWT+Admin | ML dashboard summary                | -                                                  |
| POST   | `/api/ml/test-anomaly`                 | JWT+Admin | Run anomaly test manually           | body: `userId,ipAddress`                           |
| GET    | `/api/ml/user-behavior/:userId`        | JWT       | User behavior profile               | query: `days?`                                     |
| GET    | `/api/stats`                           | JWT       | System stats (scoped by role)       | -                                                  |
| POST   | `/api/test-email`                      | Public    | Send test email                     | body: `email`                                      |
| GET    | `/api/users`                           | JWT+Admin | List all users                      | -                                                  |

## Quick Structure

Files flow:

- Upload: `/api/files/upload`
- List: `/api/files`
- Download: `/api/files/:fileId/download`
- Delete: `/api/files/:fileId`

Auth flow:

- Register: `/api/auth/register`
- Login: `/api/auth/login` or `/api/auth/google`
- Session check: `/api/auth/me`

ML/Security flow:

- Dashboard: `/api/ml/dashboard`
- Alerts list/update: `/api/ml/alerts`, `/api/ml/alerts/:alertId`
- Behavior/anomaly: `/api/ml/user-behavior/:userId`, `/api/ml/test-anomaly`

## Common Status Codes

- `200` success
- `400` bad request
- `401` unauthorized
- `403` forbidden
- `404` not found
- `500` server error

## Anomaly Model

- Model: Isolation Forest
- Runtime: Python (called by backend TypeScript service)
- Script: `server/src/ml/isolation_forest.py`
- Python deps: `numpy`, `scikit-learn` (see `server/src/ml/requirements.txt`)
