import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Download, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { SAMPLE_SUPPLIERS } from "@/lib/mockData";
import { formatCurrencyShort } from "@/lib/riskCalculations";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SupplierDetail() {
  const { id } = useParams();
  const supplier = SAMPLE_SUPPLIERS.find((s) => s.id === id);

  if (!supplier) {
    return (
      <AppLayout>
        <p>Supplier not found</p>
      </AppLayout>
    );
  }

  const recommendations = [
    supplier.dependency >= 40 &&
      `High dependency (${supplier.dependency}%) detected. Consider dual sourcing strategy to reduce exposure.`,
    supplier.floodProbability >= 15 &&
      "Location has elevated flood probability. Recommend on-site assessment and flood mitigation infrastructure.",
    supplier.riskBand === "Critical" &&
      "Critical risk classification requires immediate action. Review mitigation strategies in the Mitigation tab.",
    "Engage with supplier to develop business continuity plan (BCP) for flood events.",
  ].filter(Boolean);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Link
            to="/risk-analysis"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Analysis
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{supplier.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {supplier.country} ({supplier.latitude.toFixed(4)},{" "}
                {supplier.longitude.toFixed(4)})
              </p>
            </div>
            <RiskBadge band={supplier.riskBand} size="md" />
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Expected Annual Loss (EAL)" value={formatCurrencyShort(supplier.eal)} />
          <StatCard title="Annual Spend" value={formatCurrencyShort(supplier.annualSpend)} />
          <StatCard title="Dependency Level" value={`${supplier.dependency}%`} />
        </div>

        {/* Risk Breakdown */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Risk Assessment Breakdown</h2>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Flood Probability (Annual)</span>
                <span className="font-semibold text-foreground">{supplier.floodProbability}%</span>
              </div>
              <Progress value={supplier.floodProbability} className="mt-2 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                Based on {supplier.floodYears}-year historical data with intensity weighting
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Country Vulnerability (ND-GAIN)</span>
                <span className="font-semibold text-foreground">{supplier.ndGainScore}/100</span>
              </div>
              <Progress value={supplier.ndGainScore} className="mt-2 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                Vulnerability multiplier: {supplier.vulnerabilityMultiplier.toFixed(2)}x
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Dependency Factor</span>
                <span className="font-semibold text-foreground">{supplier.dependency}%</span>
              </div>
              <Progress value={supplier.dependency} className="mt-2 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                Impact on operations if supplier is disrupted
              </p>
            </div>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Financial Impact Analysis</h2>
          <div className="space-y-3">
            {[
              ["Base Damage Estimate", `${formatCurrencyShort(supplier.baseDamage)}`, `${formatCurrencyShort(supplier.revenueImpactPerDay || 0)} × ${supplier.downtimeDays} days`],
              ["After Vulnerability Adjustment", formatCurrencyShort(supplier.adjustedDamage), ""],
              ["After Dependency Factor", formatCurrencyShort(supplier.effectiveDamage), ""],
              ["Expected Annual Loss (EAL)", formatCurrencyShort(supplier.eal), ""],
            ].map(([label, value, note]) => (
              <div key={label} className="flex items-center justify-between border-b py-2 last:border-0">
                <div>
                  <span className="text-sm text-foreground">{label}</span>
                  {note && <p className="text-xs text-muted-foreground">{note}</p>}
                </div>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-accent p-3 text-xs text-muted-foreground">
            EAL = Flood Probability × Effective Damage
            <br />
            EAL = {supplier.floodProbability}% × {formatCurrencyShort(supplier.effectiveDamage)} ={" "}
            {formatCurrencyShort(supplier.eal)}
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-xl border-2 border-risk-medium-bg bg-risk-medium-bg/30 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Shield className="h-5 w-5 text-risk-medium" /> Recommendations
          </h2>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-risk-high" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/mitigation">
            <Button className="gap-2">
              <Shield className="h-4 w-4" /> Simulate Mitigation
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download Detailed Report
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
