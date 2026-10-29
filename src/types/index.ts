export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  createdAt: string;
}

export interface UserStats {
  totalAnalysed: number;
  recyclableCount: number;
  specialDisposalCount: number;
  uncertainCount: number;
  totalWeightKg: number;
  co2SavedKg: number;
  waterSavedLitres: number;
  landfillDivertedKg: number;
  recentAnalyses: AnalysisRecord[];
}

export interface ProductTransformation {
  id: string;
  suggestedProduct: string;
  suitability: string;
  estimatedMaterialAvailable: string;
  approximateYield: string;
  requiredToolsOrProcess: string;
  materialRecoveryPercentage: number;
  transformationType: 'diy' | 'industrial' | 'both';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'industrial';
  imageUrl?: string;
}

export interface UserMeasurements {
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: 'cm' | 'mm' | 'in';
  weight?: number;
  weightUnit?: 'g' | 'kg';
  quantity: number;
  condition: 'pristine' | 'clean' | 'soiled' | 'contaminated' | 'crushed' | 'mixed';
  isWeightEstimated?: boolean;
  isDimensionsEstimated?: boolean;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  timestamp: string;
  imageUrl: string;
  primaryObject: string;
  detectedObjects?: string[];
  material: string;
  category: 'plastic' | 'metal' | 'glass' | 'paper' | 'cardboard' | 'e-waste' | 'rubber' | 'organic' | 'mixed' | 'other';
  resinCode?: string;
  recyclability: 'recyclable' | 'non-recyclable' | 'uncertain';
  confidence: number;
  location: string;
  acceptedLocally: boolean | 'uncertain';
  localAcceptanceDetails: string;
  preparationSteps: string[];
  limitations: string[];
  safeDisposalInstructions?: string;
  sources: { title: string; url: string; organization?: string }[];
  transformations: ProductTransformation[];
  userMeasurements: UserMeasurements;
  notes?: string;
}

export interface MaterialGuideItem {
  id: string;
  code: string;
  name: string;
  commonUses: string[];
  recyclability: string;
  processingFacility: string;
  transformationProducts: string[];
  tips: string;
}
