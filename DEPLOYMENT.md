# Deployment: Vercel frontend + persistent Node backend

## Services

- **Frontend:** Deploy `frontend/` as a Create React App on Vercel.
- **API:** Deploy the repository root as a persistent Node service (Railway, EC2, etc.). Start: `npm start`. The API requires MongoDB, SMTP credentials, JWT configuration, Stripe keys, and persistent storage for uploaded images.
- **Socket.IO:** Deploy `socket/` as a separate persistent Node service. Start: `npm start`. Vercel Functions cannot host a long-running Socket.IO server.

## Vercel project configuration

- Root Directory: `frontend`
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Environment variables: `REACT_APP_BACKEND_URL=https://YOUR-API-HOST` and `REACT_APP_SOCKET_URL=https://YOUR-SOCKET-HOST`. These must be origins **without** `/api/v2`; the frontend adds that route.
- Deploy the site, then set the exact production frontend URL on your API and Socket.IO services and redeploy them.

## API service environment

- `NODE_ENV=production` (lowercase)
- `PORT` (typically supplied by host; default is 8000)
- `FRONTEND_URL=https://YOUR-VERCEL-SITE.vercel.app` (exact origin; no trailing slash). Multiple origins can be comma-separated if needed.
- Set the existing server-side credentials according to your current backend configuration (e.g. `DB_URL`, `JWT_SECRET_KEY`, SMTP and Stripe settings). Never put server secrets in `REACT_APP_*`.
- Review cookie settings: production cookies are `Secure` and `SameSite=None` for cross-site requests. Some browsers block third-party cookies; using a custom domain with API and app subdomains is more reliable. Frontend requests must use `withCredentials: true`.

## Socket.IO service environment

- `PORT` provided by the host (or 4000 locally)
- `FRONTEND_URL=https://YOUR-VERCEL-SITE.vercel.app`
- Configure the public origin in Vercel as `REACT_APP_SOCKET_URL`.

## Verification checklist

1. Build frontend from `frontend/`: `npm ci && npm run build`.
2. Check backend connection to MongoDB and that `GET /api/v2/...` endpoints respond.
3. Verify login and seller login set cookies successfully; verify authenticated requests.
4. Test deep-link refresh on React Router routes.
5. Test seller images, product creation, order creation, chat and Stripe **test-mode** checkout before enabling live payments.
6. Uploads are currently served from local disk. On platforms with ephemeral filesystems, use persistent storage/object storage before relying on uploaded files.
7. Use deployed HTTPS URLs everywhere. Avoid opening a public store to real customers until payments, secrets, rate limiting, auth and data storage are reviewed.

No deployment is performed by this PR. It prepares configuration; a live public deployment requires hosting accounts and environment variables.
