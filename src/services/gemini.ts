import { GeneratedICPResponse, ICPData } from "../types";

// ------------------------------------------------------------------
// CLIENT-SIDE PROXY SERVICE
// ------------------------------------------------------------------

const API_BASE_URL = 'http://localhost:3001/api';

// Fallback Mock Data (Client-side failover if server is down)
const CLIENT_FALLBACK_MOCK: ICPData = {
  targetName: "Server Unreachable (Demo)",
  summary: "The backend server appears to be offline. Please ensure you have started the server with 'cd server && npm start'.",
  firmographics: {
    companySize: "Unknown",
    revenueRange: "Unknown",
    facilitiesCount: "Unknown",
    geographicPresence: "Unknown",
  },
  industryVerticals: ["Error Handling"],
  operationalIndicators: {
    workforceSizePPE: "N/A",
    riskEnvironment: "N/A",
    complianceStandards: ["N/A"],
    unionPresence: "N/A",
    operatingConditions: ["Server Offline"]
  },
  keyPainPoints: ["Cannot connect to backend server"],
  buyingSignals: [],
  decisionMakers: [],
  competitorProducts: [],
  recommendedApproach: ["Start the backend server"],
  productFit: {
    highPriority: [],
    mediumPriority: [],
    crossSell: []
  }
};

export const generateICP = async (query: string): Promise<GeneratedICPResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-icp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    return result; // Matches GeneratedICPResponse shape { data, sources, isFallback }
  } catch (error) {
    console.error("Error calling backend:", error);
    return {
      data: CLIENT_FALLBACK_MOCK,
      sources: [],
      isFallback: true
    };
  }
};

export const enrichRole = async (companyName: string, roleTitle: string): Promise<{ name: string; linkedin: string; context: string } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enrich-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyName, roleTitle }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Enrichment failed:", error);
    return null;
  }
};
