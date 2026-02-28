import { Link } from "react-router-dom";
import { Upload, BarChart3, Shield, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { SAMPLE_SUPPLIERS } from "@/lib/mockData";
import { formatCurrencyShort } from "@/lib/riskCalculations";
import { RiskBand } from "@/lib/types";

export default function Dashboard() {
  const suppliers = SAMPLE_SUPPLIERS;
  const totalEAL = suppliers.reduce((sum, s) => sum + s.eal, 0);
  const highRisk = suppliers.filter((s) => s.riskBand === "High" || s.riskBand === "Critical").length;
  const avgEAL = totalEAL / suppliers.length;

  const riskCounts: Record<RiskBand, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  suppliers.forEach((s) => riskCounts[s.riskBand]++);

  const riskColors: Record<RiskBand, string> = {
    Low: "bg-risk-low-bg text-risk-low border-risk-low/20",
    Medium: "bg-risk-medium-bg text-risk-medium border-risk-medium/20",
    High: "bg-risk-high-bg text-risk-high border-risk-high/20",
    Critical: "bg-risk-critical-bg text-risk-critical border-risk-critical/20",
  };

  const criticalSupplier = suppliers.find((s) => s.riskBand === "Critical");

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Overview of your supply chain flood risk exposure
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Suppliers"
            value={suppliers.length}
            subtitle="Active suppliers analyzed"
          />
          <StatCard
            title="Total EAL Exposure"
            value={formatCurrencyShort(totalEAL)}
            subtitle="Expected Annual Loss"
          />
          <StatCard
            title="High Risk Suppliers"
            value={highRisk}
            subtitle="Critical + High risk band"
          />
          <StatCard
            title="Average Risk per Supplier"
            value={formatCurrencyShort(avgEAL)}
            subtitle="Mean EAL value"
          />
        </div>

        {/* Risk Distribution */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Risk Distribution</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(["Low", "Medium", "High", "Critical"] as RiskBand[]).map((band) => (
              <div
                key={band}
                className={`flex flex-col items-center rounded-xl border p-4 ${riskColors[band]}`}
              >
                <span className="text-3xl font-bold">{riskCounts[band]}</span>
                <span className="mt-1 text-sm font-medium">{band} Risk</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: Upload,
              title: "Upload Supplier Data",
              desc: "Upload a new CSV file with supplier information to analyze flood risk",
              link: "/upload",
              cta: "Get started →",
            },
            {
              icon: BarChart3,
              title: "View Risk Analysis",
              desc: "Detailed breakdown of flood risk exposure by supplier and region",
              link: "/risk-analysis",
              cta: "View analysis →",
            },
            {
              icon: Shield,
              title: "Simulate Mitigation",
              desc: "Test risk reduction strategies and calculate potential savings",
              link: "/mitigation",
              cta: "Run simulation →",
            },
          ].map((action) => (
            <Link
              key={action.link}
              to={action.link}
              className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <action.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">{action.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{action.desc}</p>
              <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:underline">
                {action.cta}
              </span>
            </Link>
          ))}
        </div>

        {/* Alerts */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Alerts</h2>
          <div className="space-y-3">
            {criticalSupplier && (
              <div className="flex items-start gap-3 rounded-lg bg-risk-critical-bg p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 text-risk-critical" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <strong>{criticalSupplier.name}</strong> has critical flood risk exposure
                  </p>
                  <p className="text-xs text-muted-foreground">
                    EAL: {formatCurrencyShort(criticalSupplier.eal)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-lg bg-risk-high-bg p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 text-risk-high" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  <strong>{highRisk} suppliers</strong> in high-risk flood zones detected
                </p>
                <p className="text-xs text-muted-foreground">Review recommended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
