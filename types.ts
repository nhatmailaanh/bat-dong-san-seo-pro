
export interface PropertyData {
  type: string;
  area: string;
  price: string;
  location: string;
  project: string;
  amenities: string;
  legal: string;
  contact: string;
}

export interface StrategyTitle {
  strategy: string;
  title: string;
}

export interface GeneratedContent {
  marketAnalysis: string[];
  hookTitles: StrategyTitle[];
  titleErrors: string[];
  fbContent: string;
  keywords: string[];
  metaDescription: string;
  hotDescription: string;
  bestTemplate: {
    rationale: string;
    finalContent: string;
  };
  postingSteps: string[];
}

// --- Hugging Face Analysis Types ---

export interface ContentQualityResult {
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface SEOKeywordResult {
  keywords: string[];
  density: Record<string, number>;
  recommendations: string[];
}

export interface ErrorDetectionResult {
  errors: {
    position: number;
    original: string;
    suggestion: string;
  }[];
  correctedText: string;
}

export interface ReadabilityResult {
  score: number; // 0-100
  issues: string[];
  improvements: string[];
}

export interface HFAnalysisResult {
  quality: ContentQualityResult | null;
  seo: SEOKeywordResult | null;
  grammar: ErrorDetectionResult | null;
  readability: ReadabilityResult | null;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
