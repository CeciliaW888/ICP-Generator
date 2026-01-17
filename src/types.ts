export interface Firmographics {
  companySize: string;
  revenueRange: string;
  facilitiesCount: string;
  geographicPresence: string;
}

export interface OperationalIndicators {
  workforceSizePPE: string;
  riskEnvironment: string;
  complianceStandards: string[];
  unionPresence: string;
  operatingConditions: string[]; // e.g. "FIFO workforce", "24/7 shifts"
}

export interface BuyingSignal {
  signal: string;
  description: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export interface DecisionMaker {
  role: string;
  priorities: string[];
  painPoints: string[];
}

export interface ProductFit {
  highPriority: string[];
  mediumPriority: string[];
  crossSell: string[];
}

export interface ICPData {
  targetName: string;
  summary: string;
  firmographics: Firmographics;
  industryVerticals: string[];
  operationalIndicators: OperationalIndicators;
  buyingSignals: BuyingSignal[];
  decisionMakers: DecisionMaker[];
  competitorProducts: string[];
  keyPainPoints: string[]; // General account-level pain points
  recommendedApproach: string[]; // Sales strategy suggestions
  productFit: ProductFit; // Specific product category mapping
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GeneratedICPResponse {
  data: ICPData | null;
  sources: GroundingSource[];
  isFallback?: boolean;
}