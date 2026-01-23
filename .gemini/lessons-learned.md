# Deployment Lessons Learned

This document tracks errors encountered during deployment and their solutions. **Review this file before every deployment.**

## 1. Persistent "Demo Mode" (Missing API Key)
**Symptoms:**  
- Production app shows "Demo Mode" or warns about missing API keys, even after setting `VITE_API_KEY`.
- `import.meta.env.VITE_API_KEY` is undefined in the built code.

**Root Cause:**  
- **Race Condition in Cloud Build:** The `gcloud run deploy` step often starts pulling the image *before* the `docker build` step has successfully pushed the *new* layer to the Artifact Registry. Consequently, Cloud Run deploys the *previous* version of the image (which might have been broken or lacked the key).
- **Service Worker Caching:** Even if the deployment succeeds, the user's browser (PWA) might serve the old `index.html` from the Service Worker cache.

**Fix:**  
1.  **Explicit Push Step:** In `cloudbuild.yaml`, ensure there is an explicit `docker push` step *between* the `docker build` and `gcloud run deploy` steps.
    ```yaml
    - name: 'gcr.io/cloud-builders/docker'
      args: [ 'push', 'gcr.io/PROJECT/IMAGE' ]
    ```
2.  **Cache Busting:** Bump the `CACHE_NAME` string in `public/service-worker.js` (e.g., `v7` -> `v8`) for every deployment that involves logic/env changes.

## 2. Deployment URL Mismatches
**Symptoms:**  
- User expects a specific URL format (e.g., `...417063915460.us-west1.run.app`) but the deployment output shows a hash-based URL (e.g., `...ioudlhdida-uw.a.run.app`).

**Root Cause:**  
- Google Cloud Run has migrated to deterministic hash-based URLs for new services. Both URLs usually point to the same service (the project-ID URL is legacy).

**Fix:**  
- Verify the service name (`customer-profile-app`) and region (`us-west1`) match the user's expectation.
- Run `curl -I` on both URLs to confirm they are active and serving the same Last-Modified headers.
- **Respect User Preference:** If the user has a preferred URL in `rule.md` or memory, use it in communication, even if the CLI outputs the new one.

## 3. Invalid Model Configuration
**Symptoms:**  
- API calls fail with 400 or 404 errors locally or in prod.

**Root Cause:**  
- Using deprecated or incorrect model names (e.g., `gemini-pro-vision` instead of `gemini-1.5-flash`).
- Disabling required tools (e.g., `googleSearch`) in the code when the prompt relies on them.

**Fix:**  
- Verify `MODEL_CHAIN` in `src/services/gemini.ts` uses valid, available models (e.g., `gemini-2.0-flash-exp`, `gemini-1.5-flash`).
- Ensure tool configurations (like `googleSearch: {}`) are uncommented if search is required.

## 4. Local Verification Gap
**Symptoms:**  
- Deploying "blindly" leads to discovering env var issues only in production.

**Fix:**  
- **Always** run a local verification script (e.g., `verify-local-api.js`) using the exact API key intended for production before running `gcloud builds submit`.
