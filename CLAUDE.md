# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ICP Generator - An AI-powered web app that generates Ideal Customer Profiles for Blackwoods Industrial Safety products using Google Gemini AI with search grounding. Targets Australian/New Zealand markets.

## Development Commands

### Running Locally (requires both servers)

```bash
# Terminal 1: Start backend API server (port 3001)
cd server && npm install && npm run dev

# Terminal 2: Start frontend dev server (port 5173)
npm install && npm run dev
```

Frontend available at http://localhost:5173, API at http://localhost:3001

### Build & Deploy

```bash
npm run build          # TypeScript check + Vite build to /dist
npm run preview        # Preview production build locally
```

Docker single-container deployment to Google Cloud Run:
```bash
docker build -t icp-generator .
# GOOGLE_API_KEY injected via Cloud Run environment variables
```

## Architecture

### Two-Process Architecture

```
┌─────────────────────┐     ┌──────────────────────────────────┐
│  React Frontend     │────▶│  Express Backend (server/)       │
│  (Vite dev server)  │/api │  - Gemini API proxy              │
│  Port 5173          │     │  - Google Search grounding       │
└─────────────────────┘     │  Port 3001                       │
                            └──────────────────────────────────┘
```

- **Frontend** calls `/api/*` endpoints (proxied via Vite in dev, Express static in prod)
- **Backend** holds the API key and makes Gemini calls with search grounding
- Production: Single Docker container serves both static files and API

### Key Files

| File | Purpose |
|------|---------|
| `server/index.js` | Express server with `/api/generate-icp` and `/api/enrich-role` endpoints, model fallback chain, mock data engine |
| `src/services/gemini.ts` | Client-side API service that calls backend endpoints |
| `src/types.ts` | TypeScript interfaces for ICP data structures |
| `src/App.tsx` | Main component with view state management |

### API Endpoints

- `POST /api/generate-icp` - Generates ICP from company/industry query using Gemini + Google Search
- `POST /api/enrich-role` - Enriches decision maker with real name/LinkedIn lookup

### Model Fallback Chain

Server tries models in order: `gemini-2.5-pro` → `gemini-2.5-flash` → `gemini-2.0-flash`

If all models fail, returns mock data based on query keywords (mining, construction, default manufacturing).

## Environment Variables

```bash
# .env file in project root
GOOGLE_API_KEY=your_gemini_api_key
```

Note: `dotenv` does NOT override existing system environment variables. If API calls fail with "invalid key", check for conflicting system env vars.

## Known Constraints

- Google Search tool and `responseSchema` (structured JSON output) cannot be used together - the server prompts for JSON format instead
- LinkedIn URLs are strictly validated against grounding sources; unverified links become "SEARCH"
- LocalStorage only for saved profiles (no server persistence)

## Known Bugs & Solutions (Gemini API)

| Issue | Symptom | Solution |
|-------|---------|----------|
| `response.text` is property not method | `TypeError: response.text is not a function` | Use `response.text` not `response.text()` |
| JSON in markdown blocks | `SyntaxError: Unexpected token` | Strip ` ```json ``` ` wrapper before parsing |
| responseSchema + googleSearch | `400: controlled generation not supported` | Remove responseSchema, prompt for JSON instead |
| Outdated model names | `404: model not found` | Use `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash` |
| dotenv doesn't override system vars | Wrong API key used | Unset system env var or explicitly set when running |

## TODO: Implement Secret Manager

Currently `GOOGLE_API_KEY` must be set manually after each Cloud Run deployment. Implement Google Cloud Secret Manager:

```bash
# 1. Create secret
echo -n "YOUR_API_KEY" | gcloud secrets create GOOGLE_API_KEY --data-file=-

# 2. Grant Cloud Run access
gcloud secrets add-iam-policy-binding GOOGLE_API_KEY \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 3. Update cloudbuild.yaml to reference secret (not the actual value)
# --set-secrets="GOOGLE_API_KEY=GOOGLE_API_KEY:latest"
```
