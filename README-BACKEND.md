# ASTRA 2 Backend

A small, defensive Node.js API starter for the ASTRA 2 website.

## What it includes
- `GET /` — basic service status
- `GET /api/health` — health check
- `POST /api/chat` — safe placeholder; returns HTTP 501 until an AI provider is configured
- Helmet security headers
- Exact-origin CORS allowlist
- JSON request size limit
- Basic API rate limiting

## Run locally
Requires Node.js 20 or newer.

```bash
npm install
npm start
```

Then open `http://localhost:3000/api/health`.

## Deploy
For Render, create a **Web Service** from the GitHub repository containing these files.
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Root directory: leave blank if these files are at repository root

Render supplies the `PORT` environment variable automatically.

## Important
This starter does not connect to an AI model, access devices, scan networks, or store chat messages. The `/api/chat` route is intentionally a placeholder. Add an AI provider only in a later step, using a server-side environment variable. Never commit `.env` or secret keys to GitHub.
