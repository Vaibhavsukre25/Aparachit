Aparichit server (development)

Quick start:

1. Install dependencies

```powershell
cd server
npm install
```

2. Start server (default port 4000)

```powershell
npm start
```

Environment variables:
- `ADMIN_PASS` - initial admin password (default `aparichit@2026` if not set). Change for production.
- `JWT_SECRET` - secret for signing admin tokens (set in production).

Notes:
- Uploads are stored in `../uploads` relative to the project root.
- Database is SQLite at `server/data/complaints.db`.
- Endpoints:
  - `POST /api/complaints` - accept multipart form (fields + attachments)
  - `POST /api/login` - admin login (username/password)
  - `GET /api/complaints` - admin-only (requires Bearer token)
  - `GET /api/export` - admin-only export JSON
  - `POST /api/backup` - admin-only backup to `server/backups`

Security:
This is a development scaffold. For production you must run behind HTTPS, rotate secrets, and add hardened auth and monitoring.
