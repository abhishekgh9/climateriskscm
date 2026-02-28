export interface Supplier {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  annualSpend: number;
  dependency: number;
  revenueImpactPerDay?: number;
  floodProbability: number;
  ndGainScore: number;
  vulnerabilityMultiplier: number;
  baseDamage: number;
  adjustedDamage: number;
  effectiveDamage: number;
  eal: number;
  riskBand: "Low" | "Medium" | "High" | "Critical";
  floodEvents: number;
  floodYears: number;
  downtimeDays: number;
}

export type RiskBand = "Low" | "Medium" | "High" | "Critical";
