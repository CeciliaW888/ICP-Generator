import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedICPResponse, ICPData } from "../types";

// ------------------------------------------------------------------
// MOCK DATA ENGINE (For Offline/Demo Use)
// ------------------------------------------------------------------

const MOCK_SOURCES = [
  { title: "ASX Company Report 2024", uri: "#" },
  { title: "Industry Safety Journal - Q3 Analysis", uri: "#" },
  { title: "WorkSafe Official Statistics", uri: "#" }
];

const MOCKS: Record<string, ICPData> = {
  MINING: {
    targetName: "Mining & Resources Sector (Demo)",
    summary: "Large-scale extraction operations characterized by high capital expenditure, remote workforce logistics, and critical safety requirements. High priority on zero-harm policies and supply chain reliability.",
    firmographics: {
      companySize: "200-2,000 employees per site",
      revenueRange: "$50M - $500M AUD",
      facilitiesCount: "2-10 active mine sites",
      geographicPresence: "Queensland, Western Australia, NSW",
    },
    industryVerticals: ["Mining", "Resources", "Heavy Industry"],
    operationalIndicators: {
      workforceSizePPE: "2,000+ active roles",
      riskEnvironment: "Extreme - Underground/Open Pit",
      complianceStandards: ["AS/NZS 4801", "ISO 45001", "Mine Safety Act"],
      unionPresence: "High",
      operatingConditions: [
        "24/7 operations requiring shift PPE",
        "Fly-in-fly-out workforce",
        "Remote site supply chain challenges"
      ]
    },
    keyPainPoints: [
      "PPE compliance across multiple sites",
      "Managing contractor safety standards",
      "Stock management for remote locations",
      "Downtime costs from safety incidents"
    ],
    buyingSignals: [
      { signal: "New Exploration Project", description: "Recently announced $500M expansion in Pilbara region.", urgency: "High" },
      { signal: "Safety Incident Report", description: "Heightened focus on hand protection following quarterly review.", urgency: "Medium" }
    ],
    decisionMakers: [
      { role: "Head of Health & Safety", priorities: ["Compliance", "Risk Reduction"], painPoints: ["Inconsistent Product Quality"] },
      { role: "Procurement Manager", priorities: ["Cost Reduction", "Vendor Consolidation"], painPoints: ["Logistics Costs"] },
      { role: "Site General Manager", priorities: ["Productivity", "Uptime"], painPoints: ["Safety Stoppages"] }
    ],
    competitorProducts: ["Ansell", "3M", "Honeywell"],
    recommendedApproach: [
      "Lead with compliance and risk reduction value",
      "Emphasize multi-site supply capability",
      "Showcase mining industry case studies"
    ],
    productFit: {
      highPriority: ["Respiratory protection", "Fall protection", "Confined space equipment"],
      mediumPriority: ["Standard PPE (gloves, boots, eyewear)"],
      crossSell: ["Safety training", "Equipment maintenance programs"]
    }
  },
  CONSTRUCTION: {
    targetName: "Tier 1 Construction (Demo)",
    summary: "Major infrastructure and commercial building projects. Project-based procurement cycles with fluctuating workforce numbers. Intense focus on height safety and dropped object prevention.",
    firmographics: {
      companySize: "200-500 employees (Project based)",
      revenueRange: "$500M - $1B AUD",
      facilitiesCount: "5 active major sites",
      geographicPresence: "Metro / Urban Fringe",
    },
    industryVerticals: ["Construction", "Infrastructure"],
    operationalIndicators: {
      workforceSizePPE: "350+ on-site daily",
      riskEnvironment: "High - Working at Heights, Traffic Management",
      complianceStandards: ["AS/NZS 1891 (Heights)", "Safe Work Australia"],
      unionPresence: "Very High",
      operatingConditions: [
        "Contractor heavy workforce",
        "Strict site access requirements",
        "High turnover of consumables"
      ]
    },
    keyPainPoints: [
      "Theft and loss of equipment",
      "Speed of delivery to site",
      "Compliance documentation management"
    ],
    buyingSignals: [
      { signal: "Tender Win", description: "Awarded government contract for new Metro station upgrades.", urgency: "High" },
      { signal: "Fiscal Year End", description: "Budget flush expected before June 30.", urgency: "Medium" }
    ],
    decisionMakers: [
      { role: "Project Manager", priorities: ["Speed to Site", "Budget Adherence"], painPoints: ["Delivery Delays"] },
      { role: "Safety Officer", priorities: ["Worker Compliance", "Training"], painPoints: ["Incorrect PPE Usage"] }
    ],
    competitorProducts: ["Bisley", "Hard Yakka", "Bolle"],
    recommendedApproach: [
      "Focus on 'Just-in-Time' delivery guarantees",
      "Offer vending machine solutions for consumables",
      "Highlight range of height safety gear"
    ],
    productFit: {
      highPriority: ["Height Safety", "Hard Hats", "Hi-Vis Workwear"],
      mediumPriority: ["Safety Boots", "Eye Protection"],
      crossSell: ["Site Signage", "First Aid Kits"]
    }
  },
  DEFAULT: {
    targetName: "General Manufacturing (Demo)",
    summary: "Mid-sized manufacturing facility focused on food processing and packaging. Steady operational rhythm with specific hygiene and safety requirements.",
    firmographics: {
      companySize: "100-200 employees",
      revenueRange: "$50M - $100M AUD",
      facilitiesCount: "2 manufacturing plants",
      geographicPresence: "Suburban Industrial Zones",
    },
    industryVerticals: ["Manufacturing", "Food & Beverage"],
    operationalIndicators: {
      workforceSizePPE: "150 staff",
      riskEnvironment: "Medium - Machinery, Slip/Trip, Hygiene",
      complianceStandards: ["HACCP", "AS/NZS 2210 (Footwear)"],
      unionPresence: "Low to Moderate",
      operatingConditions: [
        "Clean room environments",
        "Shift work (Morning/Afternoon)",
        "High hygiene standards"
      ]
    },
    keyPainPoints: [
      "Contamination risks",
      "Comfort of PPE worn for long shifts",
      "Cost of disposable consumables"
    ],
    buyingSignals: [
      { signal: "Facility Upgrade", description: "Planning application submitted for warehouse extension.", urgency: "Medium" },
      { signal: "Management Change", description: "New Operations Manager appointed last month.", urgency: "High" }
    ],
    decisionMakers: [
      { role: "Operations Manager", priorities: ["Efficiency", "Cost Control"], painPoints: ["Downtime"] },
      { role: "QA Manager", priorities: ["Contamination Control"], painPoints: ["Low quality consumables"] }
    ],
    competitorProducts: ["Uvex", "Blundstone"],
    recommendedApproach: [
      "Focus on hygiene and HACCP compliance",
      "Offer trial for comfort-focused footwear",
      "Volume pricing for disposables"
    ],
    productFit: {
      highPriority: ["Disposable Gloves", "Hair Nets", "Safety Footwear"],
      mediumPriority: ["Hearing Protection", "Aprons"],
      crossSell: ["Janitorial Supplies", "Spill Kits"]
    }
  }
};

const getMockData = (query: string, isFallback: boolean = false): GeneratedICPResponse => {
  const lowerQ = query.toLowerCase();
  let data = MOCKS.DEFAULT;

  if (lowerQ.includes('mine') || lowerQ.includes('mining') || lowerQ.includes('bhp') || lowerQ.includes('rio')) {
    data = MOCKS.MINING;
  } else if (lowerQ.includes('construct') || lowerQ.includes('build') || lowerQ.includes('infrastructure')) {
    data = MOCKS.CONSTRUCTION;
  }

  // Deep copy to allow modification if needed without affecting const
  const responseData = JSON.parse(JSON.stringify(data));

  // Customise the name slightly to make it feel responsive
  if (!responseData.targetName.includes(query)) {
    responseData.targetName = `${query} (Demo Result)`;
  }

  return {
    data: responseData,
    sources: MOCK_SOURCES,
    isFallback
  };
};

// ------------------------------------------------------------------
// REAL API IMPLEMENTATION
// ------------------------------------------------------------------

// Guideline: Always use new GoogleGenAI({apiKey: process.env.API_KEY})
// Using process.env.API_KEY directly in initialization
const ai = import.meta.env.VITE_API_KEY ? new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY }) : null;

const ICP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    targetName: { type: Type.STRING, description: "Name of the company or industry segment analyzed" },
    summary: { type: Type.STRING, description: "Executive summary of why this is a good target for Blackwoods" },
    firmographics: {
      type: Type.OBJECT,
      properties: {
        companySize: { type: Type.STRING, description: "e.g., 500-2000 employees" },
        revenueRange: { type: Type.STRING, description: "e.g., $50M - $100M AUD" },
        facilitiesCount: { type: Type.STRING, description: "Estimated number of sites" },
        geographicPresence: { type: Type.STRING, description: "Metro, Regional, Remote, etc." },
      },
      required: ["companySize", "revenueRange", "facilitiesCount", "geographicPresence"]
    },
    industryVerticals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of relevant verticals (e.g. Mining, Construction)"
    },
    operationalIndicators: {
      type: Type.OBJECT,
      properties: {
        workforceSizePPE: { type: Type.STRING, description: "Estimate of staff requiring PPE" },
        riskEnvironment: { type: Type.STRING, description: "Description of hazards (e.g. Chemical, High Impact)" },
        complianceStandards: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant AS/NZS standards" },
        unionPresence: { type: Type.STRING, description: "Likelihood of union involvement in safety" },
        operatingConditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. 24/7 operations, FIFO, Remote site supply chain" },
      },
      required: ["workforceSizePPE", "riskEnvironment", "complianceStandards", "unionPresence", "operatingConditions"]
    },
    keyPainPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "General account-level pain points (e.g. Compliance across multiple sites)"
    },
    buyingSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signal: { type: Type.STRING, description: "The specific signal (e.g. New Project)" },
          description: { type: Type.STRING, description: "Details about the signal found on the web" },
          urgency: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["signal", "description", "urgency"]
      }
    },
    decisionMakers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          name: { type: Type.STRING, description: "Real name of the person if a specific company is queried. Otherwise leave blank." },
          linkedIn: { type: Type.STRING, description: "LinkedIn URL if found." },
          priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["role", "priorities", "painPoints"]
      }
    },
    recommendedApproach: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Strategic advice for sales reps (e.g. Lead with compliance value)"
    },
    productFit: {
      type: Type.OBJECT,
      properties: {
        highPriority: { type: Type.ARRAY, items: { type: Type.STRING } },
        mediumPriority: { type: Type.ARRAY, items: { type: Type.STRING } },
        crossSell: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["highPriority", "mediumPriority", "crossSell"]
    },
    competitorProducts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Potential competitor brands currently in use"
    }
  },
  required: ["targetName", "summary", "firmographics", "industryVerticals", "operationalIndicators", "keyPainPoints", "buyingSignals", "decisionMakers", "recommendedApproach", "productFit"]
};

export const generateICP = async (query: string): Promise<GeneratedICPResponse> => {
  // FALLBACK: If no API Key, return Mock Data immediately
  // Guideline: Check process.env.API_KEY validity before making calls if needed, 
  // though typically application should handle auth. Here we support Demo Mode.
  // FALLBACK: If no API Key, return Mock Data immediately
  // Guideline: Check process.env.API_KEY validity before making calls if needed, 
  // though typically application should handle auth. Here we support Demo Mode.
  if (!import.meta.env.VITE_API_KEY) {
    console.warn("No API Key detected. Returning Demo Data.");
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockData(query, false);
  }

  try {
    const prompt = `
      Generate a detailed Ideal Customer Profile (ICP) for Blackwoods Industrial Safety products targeting: "${query}".
      
      Blackwoods sells PPE, workwear, safety footwear, and industrial consumables.
      Use Google Search to find real-time, specific data about this company or industry segment in Australia/New Zealand.
      
      Structure the profile to include:
      1. Firmographics: Real employee counts, revenue, and site locations.
      2. Operational Indicators: Safety risks, compliance needs (AS/NZS standards), and operating complexity (FIFO, 24/7 shifts, Remote Logistics).
      3. Key Pain Points: What keeps them awake at night regarding safety and supply?
      4. Buying Signals: Recent news, project announcements, tender awards, or safety incidents in the last 12 months.
      5. Decision Makers: Who buys safety gear? 
         **IMPORTANT**: 
         - If the query is a **Specific Company** (e.g. "BHP", "Woolworths"), FIND THE REAL NAMES of the people currently in these roles and their LinkedIn links. 
         - **CRITICAL**: Check the search results carefully. If you find a LinkedIn profile URL for the person, USE IT. If you absolutely cannot find it, return "SEARCH".
         - If the query is a **Generic Industry/Segment** (e.g. "Mining", "Construction"), **DO NOT** generate names or links. Leave the 'name' and 'linkedIn' fields empty. Return Job Titles only.
      6. Recommended Approach: How should a sales rep pitch to this account?
      7. Product Fit: Categorize products into High Priority, Medium Priority, and Cross-sell opportunities.
      
      If the query is a specific company (e.g., "BHP"), find data for that company.
      If the query is a segment (e.g., "Mid-tier Construction in Victoria"), generate a representative profile based on top players in that space.
    `;

    if (!ai) throw new Error("AI client not initialized");

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: ICP_SCHEMA,
      },
    });

    const jsonText = response.text;
    let parsedData: ICPData | null = null;

    if (jsonText) {
      try {
        parsedData = JSON.parse(jsonText);
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }
    }

    // Extract grounding sources
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title) || [];

    return {
      data: parsedData,
      sources: sources,
      isFallback: false
    };

  } catch (error) {
    console.error("Error generating ICP:", error);
    // FALLBACK: If API fails (e.g. quota, network), return Mock Data
    return getMockData(query, true);
  }
};

export const enrichRole = async (companyName: string, roleTitle: string): Promise<{ name: string; linkedin: string; context: string } | null> => {
  if (!import.meta.env.VITE_API_KEY || !ai) {
    console.warn("No API Key or AI client. Skipping enrichment.");
    return { name: "John Doe (Demo)", linkedin: "#", context: "Demo Mode - No API Key" };
  }

  try {
    const prompt = `
      Find the current person holding the role of "${roleTitle}" (or closest equivalent senior executive) at "${companyName}" in Australia/New Zealand.
      
      Return a JSON object with:
      - "name": Full Name
      - "linkedin": Public LinkedIn Profile URL. 
        **CRITICAL**: 
        - Return "SEARCH" if you do not find the *exact* URL in the search results. 
        - **DO NOT GUESS** or construct URLs (e.g. do not guess "linkedin.com/in/firstname-lastname").
        - It is better to return "SEARCH" than a broken link.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ["name", "linkedin", "context"]
        }
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text);

    // GROUNDING: Check if we found a better link in the actual search results
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const linkedinSource = groundingChunks
      .map((c: any) => c.web?.uri)
      .find((uri: string) =>
        uri &&
        uri.includes("linkedin.com") &&
        !uri.includes("/company/") &&
        !uri.includes("/jobs/") &&
        !uri.includes("/school/") &&
        !uri.includes("/pulse/") &&
        !uri.includes("/dir/")
      );

    // If the model gave up (SEARCH) or passed a generic link, but we found a REAL one in sources, use it.
    if (linkedinSource) {
      // If model returned SEARCH, 'Not Found', or a different link, prefer the grounded one
      // We trust the search result source more than the generated text for URLs
      if (parsed.linkedin === 'SEARCH' || parsed.linkedin === 'Not Found' || !parsed.linkedin || parsed.linkedin.includes('linkedin.com')) {
        console.log(`Grounding: Replaced ${parsed.linkedin} with ${linkedinSource}`);
        parsed.linkedin = linkedinSource;
        parsed.context = `${parsed.context} (Verified via Search)`;
      }
    }

    return parsed;
  } catch (error) {
    console.error("Enrichment failed:", error);
    return null;
  }
};