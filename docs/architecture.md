# Architectural Overview

## Tech Stack
- **Frontend Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Utility-first)
- **AI SDK:** `@google/genai` (Official Google GenAI SDK)
- **Icons:** Lucide React

## Key Architectural Decisions

### 1. Client-Side AI Logic
**Decision:** We are currently calling the Gemini API directly from the client (browser).
**Reasoning:**
- **Speed of Prototyping:** Removes the need for a dedicated backend server during the MVP phase.
- **Latency:** Reduces one network hop.
- **Trade-off:** In a production environment, the API call should move to a secure Edge Function (e.g., Vercel Functions or Cloud Run) to protect the `API_KEY`.

### 2. Structured JSON Generation
**Decision:** We use `responseSchema` and `responseMimeType: "application/json"` in the Gemini configuration.
**Reasoning:**
- LLMs are notoriously chatty. By enforcing a strict Schema (`ICP_SCHEMA` in `services/gemini.ts`), we ensure the UI never crashes due to malformed data. The UI components (`ICPResult.tsx`) can trust the shape of the data.

### 3. The "Mock Engine" Pattern
**Decision:** The application checks for `process.env.API_KEY`. If missing, it serves hardcoded data from `MOCKS` dictionary.
**Reasoning:**
- **Developer Experience:** Allows developers to work on UI/CSS without burning API credits.
- **Demo Stability:** Ensures the app works during demos even if the API is down or the internet is flaky.
- **Safety:** Prevents the app from crashing entirely if the key is invalid.

### 4. Progressive Web App (PWA)
**Decision:** Included `manifest.json` and `service-worker.js`.
**Reasoning:**
- Sales reps are often on the road with poor connectivity.
- The Service Worker caches the "App Shell" (HTML, JS, CSS), ensuring the app loads instantly even offline (though AI search requires internet).

## File Structure

```
/
├── components/         # UI Components
│   ├── ICPResult.tsx   # Complex display logic for the report
│   └── SearchForm.tsx  # Input handling
├── services/
│   └── gemini.ts       # The "Brain". Handles API calls, Schemas, and Mock logic.
├── types.ts            # Shared TypeScript interfaces (Single source of truth)
├── App.tsx             # Main layout and State container
└── public/             # Static assets (Manifest, Service Worker)
```
