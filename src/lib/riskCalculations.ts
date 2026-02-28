import { RiskBand } from "./types";

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000000) return `₹${(amount / 1000000).toFixed(2)}M`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) return `₹${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function getRiskBandFromEAL(eal: number): RiskBand {
  if (eal < 1000000) return "Low";
  if (eal < 3000000) return "Medium";
  if (eal < 6000000) return "High";
  return "Critical";
}

export function computeEAL(
  floodProbability: number,
  effectiveDamage: number
): number {
  return (floodProbability / 100) * effectiveDamage;
}

export function computeMitigation(
  currentDependency: number,
  targetDependency: number,
  adjustedDamage: number,
  floodProbability: number
) {
  const currentEffective = adjustedDamage * (currentDependency / 100);
  const newEffective = adjustedDamage * (targetDependency / 100);
  const currentEAL = (floodProbability / 100) * currentEffective;
  const newEAL = (floodProbability / 100) * newEffective;
  const reduction = currentEAL - newEAL;
  const reductionPercent = (reduction / currentEAL) * 100;
  const implementationCost = adjustedDamage * 0.04;
  const paybackYears = reduction > 0 ? implementationCost / reduction : 0;

  return {
    currentEAL,
    newEAL,
    currentEffective,
    newEffective,
    reduction,
    reductionPercent,
    implementationCost,
    paybackYears,
    currentRiskBand: getRiskBandFromEAL(currentEAL),
    newRiskBand: getRiskBandFromEAL(newEAL),
  };
}
