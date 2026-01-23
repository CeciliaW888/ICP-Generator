Deployment Protocol
IMPORTANT

NEVER deploy to Production (Cloud Run) without explicit user approval.
Pre-Flight Check: READ .gemini/lessons-learned.md before generating the deployment plan.

Dev First: All changes must be verified in the local environment (localhost) first.
Explicit Approval: The user must say "Deploy" or "Looks good" before gcloud builds submit is run.
No Auto-Deploy: Workflows involving deployment must verify readiness first.
Cache Busting: BEFORE any deployment involving UI or Logic changes, always bump the CACHE_NAME version in 
public/service-worker.js
 to prevent stale PWA caching.
Production URL: The ONLY valid production URL is https://customer-profile-app-417063915460.us-west1.run.app/. Do not assume other regions.