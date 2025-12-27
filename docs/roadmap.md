# Project Roadmap: Blackwoods ICP Intelligence

## 1. Project Vision
To build an intelligent, real-time "Ideal Customer Profile" (ICP) generator for Blackwoods' sales teams. The application leverages Generative AI (Google Gemini) and live Google Search grounding to instantly research companies or industry segments, providing actionable firmographic data, buying signals, and safety product fit assessments.

## 2. Current Status (What Works)

### Core Functionality
- **Natural Language Search:** Users can query specific companies (e.g., "BHP Iron Ore") or broad segments (e.g., "Food Manufacturing in Victoria").
- **AI Generation:** Integration with **Gemini 2.5/3.0** using `responseSchema` to force structured JSON output.
- **Live Grounding:** Uses Google Search Tooling to fetch real-time data (news, tender wins, stock reports) rather than relying solely on training data.
- **Robust Error Handling:** Falls back to a "Mock Data Engine" if the API Key is missing or quota is exceeded.

### UI/UX
- **Responsive Design:** Mobile-first layout built with Tailwind CSS.
- **Visual Feedback:** Skeleton loaders during generation and clear error states.
- **PWA Support:** Installable on mobile devices via Manifest and Service Workers (offline caching for core assets).

### Data Structure
- **Firmographics:** Revenue, Size, Locations.
- **Operational Indicators:** Risk levels, Compliance standards (AS/NZS), Union presence.
- **Sales Intelligence:** Buying signals, Decision maker personas, and Pain points.
- **Product Fit:** Automatic mapping of Blackwoods' categories (PPE, Consumables) to the target's needs.

## 3. Future Roadmap

### Phase 2: Persistence & User context
- [ ] **Authentication:** Replace hardcoded user mock (`cecilia.wangl`) with real SSO/Auth0 integration.
- [ ] **History:** Store generated profiles in a database (Supabase/Firebase) so users can revisit previous searches.
- [ ] **Export:** Add "Export to PDF" or "Export to CRM" (Salesforce integration).

### Phase 3: Deep Integration
- [ ] **Internal Data Augmentation:** RAG (Retrieval Augmented Generation) over Blackwoods' internal product catalog to recommend specific SKUs (e.g., "Recommend King Gee K27100 boots").
- [ ] **Competitor Analysis:** Deeper dive into incumbent suppliers detected via web search.

### Phase 4: Enterprise Scale
- [ ] **Team Sharing:** Allow sharing profiles between team members.
- [ ] **Automated Monitoring:** "Watch" a company and get alerted when new Buying Signals occur.
