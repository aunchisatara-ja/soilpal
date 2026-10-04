export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export type NutrientLevel = 'deficient' | 'slightly_low' | 'optimal' | 'excess';

export interface NutrientItem {
  name: string;
  symbol: string;
  status: NutrientLevel;
  score: number; // 0 - 100
  interpretation: string;
  symptomOnRice: string;
}

export interface DiseaseDiagnosis {
  id: string;
  nameThai: string;
  nameEng: string;
  scientificName: string;
  pathogenType: string;
  confidence: number; // 0 - 100
  severity: 'ปกติ/ไม่พบโรค' | 'ระดับเริ่มต้น (เฝ้าระวัง)' | 'ระดับปานกลาง (ต้องรักษา)' | 'ระดับรุนแรง (ระบาด)';
  keySymptoms: string[];
  sampleImageUrl: string;
  comparisonAnalysis: string;
  treatment: {
    bioMethod: string[];
    chemicalMethod: string[];
    fieldManagement: string[];
  };
}

export interface WaterManagement {
  action: 'เติมน้ำด่วน' | 'รักษาระดับน้ำปกติ' | 'ระบายน้ำออก' | 'แกล้งข้าว (ปล่อยแห้งสลับเปียก)';
  recommendedDepthCm: string;
  details: string;
  stageGuidance: string;
}

export interface FertilizerPlan {
  recommendedFormula: string;
  secondaryFormula: string;
  applicationRate: string;
  applicationMethod: string;
  organicAlternative: string;
  warningOrTips: string;
}

export interface SoilAnalysis {
  soilType: 'clay' | 'sandy_loam' | 'acid_sulfate' | 'loamy_clay' | 'sandy';
  soilNameThai: string;
  colorDescription: string;
  fertilityScore: number; // 0 - 100
  waterHoldingCapacity: number; // 0 - 100
  approximatePh: string;
  suitableRiceVarieties: string[];
  soilImprovementAdvice: string[];
  recommendedBasalFertilizer: string;
}

export interface SamplePoint {
  x: number;
  y: number;
  rgb: RGBColor;
  hex: string;
  lccLevel: number;
}

export interface AnalysisResult {
  id: string;
  mode: 'leaf' | 'soil';
  timestamp: string;
  imageUri: string;
  rgbAverage: RGBColor;
  rgbHex: string;
  lccLevel: number; // 1 - 6
  chlorophyllIndex: number; // 0 - 100 (SPAD estimation)
  healthScore: number; // 0 - 100
  summaryTitle: string;
  summaryDescription: string;
  nutrients: {
    n: NutrientItem;
    p: NutrientItem;
    k: NutrientItem;
    secondary?: NutrientItem[];
  };
  primaryDisease: DiseaseDiagnosis;
  secondarySuspicions?: DiseaseDiagnosis[];
  fertilizerPlan: FertilizerPlan;
  waterPlan: WaterManagement;
  soilAnalysis?: SoilAnalysis;
  samplePoints?: SamplePoint[];
}
