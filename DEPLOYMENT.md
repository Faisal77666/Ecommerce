# Deployment: React and Express on Vercel

## Architecture

- **Frontend:** Existing Vercel project `ecommerce-b813.vercel.app`, Root Directory `frontend`, Framework Create React App.
- **API:** Make a **second Vercel project** from the same GitHub repository, Root Directory `.` (repository root). The root `index.js` exports the Express application for Vercel Functions. Do **not** start `backend/server.js` as the serverless handler.
- **Socket.IO:** Needs another long-running Node host. Vercel Functions are not a persistent Socket.IO server.
- **Database:** MongoDB Atlas. Both API and database connectivity require valid credentials and network access.
- **Uploads:** Product uploads use local filesystem. Serverless local disk is not durable; migrate uploads to persistent object storage before using seller product uploads.

## Branch testing

The fixes are on `fix/vercel-deployment` (draft PR). The repository default branch is `main`; Vercel's first production deployment may use `main` and **not** include these changes. Deploy and validate a Preview from the PR branch before merging.

## Frontend Vercel settings

- Root Directory: `frontend`
- Preset: Create React App
- Build: `npm run build`; Output: `build`
- `REACT_APP_BACKEND_URL=https://YOUR-API-VERCEL-HOST` (no `/api/v2`)
- `REACT_APP_SOCKET_URL=https://YOUR-SOCKET-HOST` (only after Socket.IO is hosted).
- Environment values are embedded at React build time; redeploy the frontend after setting them.
- `frontend/vercel.json` handles React Router deep links.
- Temporarily `CI=false` avoids CRA turning legacy lint warnings into build errors; lint issues must still be fixed before production.

## API Vercel settings

Create a separate `ecommerce-api` project:
- Import `Faisal77666/Ecommerce` (same repository), repository root directory `.`.
- Use Vercel's Express/Node framework detection and deploy `index.js` (do not select the `frontend` folder).
- Required server-only environment variables include:
  - `DB_URL`: **actual** MongoDB connection URI (keep secret).
  - `JWT_SECRET_KEY`, `JWT_EXPIRES`: used in JWT issuing/verification.
  - `STRIPE_SECRET_KEY`, `STRIPE_API_KEY`: use **test-mode** keys first.
  - `FRONTEND_URL=https://ecommerce-b813.vercel.app` (CORS origin; add the preview frontend origin if testing PR previews).
  - `NODE_ENV=production` if not automatically set by the platform.
  - Configure the SMTP variables expected by `backend/utils/sendMail.js` and any other integrations before testing related functions.
- Keep all secrets out of `REACT_APP_*` variables and out of Git.
- Verify `GET https://YOUR-API-HOST/api/health` returns `{"status":"ok"}`; it does **not** prove database availability.
- Then test actual DB-backed API routes and inspect Function Logs for errors.

## Risks and follow-up work

1. Cross-site cookies are `Secure; SameSite=None` in production, but browsers can block third-party cookies. Prefer app and API subdomains of a domain you own.
2. MongoDB connections are reused per warm function instance, but serverless scaling can create multiple instances.
3. Product images must be moved away from ephemeral local uploads before public use.
4. Payments must be tested with Stripe test keys; review authorization, webhooks, rate limiting, and checkout behavior before live payments.
5. Socket.IO chat cannot run on Vercel Functions.
6. Frontend currently has many ESLint warnings and dependency audit findings; review before production rollout.
7. Do not merge the draft PR until both API and frontend preview builds and functional checks pass.

## Local verification

```bash
npm ci
node --check index.js
node --check backend/db/Database.js
cd frontend
npm ci
npm run build
```
