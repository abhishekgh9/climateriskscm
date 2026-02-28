import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import RiskBadge from "@/components/RiskBadge";
import { SAMPLE_SUPPLIERS } from "@/lib/mockData";
import { formatCurrencyShort, computeMitigation } from "@/lib/riskCalculations";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingDown, DollarSign, Clock } from "lucide-react";

export default function Mitigation() {
  const [selectedId, setSelectedId] = useState(SAMPLE_SUPPLIERS[4].id); // TechCore
  const [targetDep, setTargetDep] = useState(25);

  const supplier = SAMPLE_SUPPLIERS.find((s) => s.id === selectedId)!;
  const result = useMemo(
    () =>
      computeMitigation(
        supplier.dependency,
        targetDep,
        supplier.adjustedDamage,
        supplier.floodProbability
      ),
    [supplier, targetDep]
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mitigation Simulation</h1>
          <p className="mt-1 text-muted-foreground">
            Model risk reduction strategies and calculate financial impact
          </p>
        </div>

        {/* Supplier Select */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-3 font-semibold text-foreground">Select Supplier</h2>
          <Select value={selectedId} onValueChange={(v) => { setSelectedId(v); setTargetDep(25); }}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_SUPPLIERS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex items-center gap-2">
                    {s.name} <RiskBadge band={s.riskBand} />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Profile */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-3 font-semibold text-foreground">Current Risk Profile</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Supplier</p>
              <p className="font-medium text-foreground">{supplier.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Dependency</p>
              <p className="font-medium text-foreground">{supplier.dependency}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current EAL</p>
              <p className="font-medium text-foreground">{formatCurrencyShort(result.currentEAL)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk Band</p>
              <RiskBadge band={result.currentRiskBand} />
            </div>
          </div>
        </div>

        {/* Dual Sourcing Strategy */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-1 font-semibold text-foreground">Dual Sourcing Strategy</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Reduce dependency by sourcing from alternative suppliers
          </p>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Target Dependency Level</span>
              <span className="font-semibold text-foreground">{targetDep}%</span>
            </div>
            <Slider
              value={[targetDep]}
              onValueChange={([v]) => setTargetDep(v)}
              min={5}
              max={supplier.dependency}
              step={1}
              className="mt-3"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>5% (Maximum diversification)</span>
              <span>{supplier.dependency}% (Current)</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-accent p-3 text-sm text-foreground">
            <strong>Strategy:</strong> Identify and qualify{" "}
            {Math.ceil((supplier.dependency - targetDep) / 15)} alternative supplier(s) to handle{" "}
            {supplier.dependency - targetDep}% of current volume. This reduces single-point-of-failure
            risk.
          </div>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Before Mitigation</h3>
            <div className="space-y-3">
              {[
                ["Dependency", `${supplier.dependency}%`],
                ["Effective Damage", formatCurrencyShort(result.currentEffective)],
                ["Expected Annual Loss", formatCurrencyShort(result.currentEAL)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Band</span>
                <RiskBadge band={result.currentRiskBand} />
              </div>
            </div>
          </div>
          <div className="rounded-xl border-2 border-success/30 bg-risk-low-bg/30 p-6">
            <h3 className="mb-4 font-semibold text-foreground">After Mitigation</h3>
            <div className="space-y-3">
              {[
                ["Dependency", `${targetDep}%`],
                ["Effective Damage", formatCurrencyShort(result.newEffective)],
                ["Expected Annual Loss", formatCurrencyShort(result.newEAL)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Band</span>
                <RiskBadge band={result.newRiskBand} />
              </div>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="rounded-xl border-2 border-success/30 bg-risk-low-bg/30 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            ✨ Mitigation Impact
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <TrendingDown className="mt-1 h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Annual Risk Reduction</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrencyShort(result.reduction)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.reductionPercent.toFixed(1)}% decrease
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Est. Implementation Cost</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrencyShort(result.implementationCost)}
                </p>
                <p className="text-xs text-muted-foreground">One-time supplier qualification</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-xl font-bold text-foreground">
                  {result.paybackYears.toFixed(1)} years
                </p>
                <p className="text-xs text-muted-foreground">Return on investment timeline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
