import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { SAMPLE_SUPPLIERS, getCountryFlag } from "@/lib/mockData";
import { formatCurrencyShort } from "@/lib/riskCalculations";
import { Button } from "@/components/ui/button";
import { RiskBand } from "@/lib/types";

type SortMode = "eal" | "dependency" | "country";

export default function RiskAnalysis() {
  const [sortBy, setSortBy] = useState<SortMode>("eal");
  const navigate = useNavigate();
  const suppliers = SAMPLE_SUPPLIERS;

  const totalEAL = suppliers.reduce((sum, s) => sum + s.eal, 0);
  const highestRisk = [...suppliers].sort((a, b) => b.eal - a.eal)[0];
  const avgProb = suppliers.reduce((sum, s) => sum + s.floodProbability, 0) / suppliers.length;

  // Country EAL chart
  const countryData = Object.entries(
    suppliers.reduce<Record<string, number>>((acc, s) => {
      acc[s.country] = (acc[s.country] || 0) + s.eal;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Risk distribution pie
  const riskCounts: Record<RiskBand, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  suppliers.forEach((s) => riskCounts[s.riskBand]++);
  const pieData = Object.entries(riskCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
  const PIE_COLORS: Record<string, string> = {
    Low: "#22c55e",
    Medium: "#eab308",
    High: "#f97316",
    Critical: "#ef4444",
  };

  const sorted = [...suppliers].sort((a, b) => {
    if (sortBy === "eal") return b.eal - a.eal;
    if (sortBy === "dependency") return b.dependency - a.dependency;
    return a.country.localeCompare(b.country);
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Risk Analysis</h1>
            <p className="mt-1 text-muted-foreground">
              Detailed flood risk assessment for {suppliers.length} suppliers
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Total EAL Exposure" value={formatCurrencyShort(totalEAL)} />
          <div className="rounded-xl border bg-card p-5 animate-fade-in">
            <p className="text-sm text-muted-foreground">Highest Risk Supplier</p>
            <p className="mt-1 text-lg font-bold text-foreground">{highestRisk.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyShort(highestRisk.eal)} EAL
            </p>
          </div>
          <StatCard title="Average Flood Probability" value={`${avgProb.toFixed(1)}%`} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Expected Annual Loss by Country
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={countryData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => formatCurrencyShort(v)} />
                <Bar dataKey="value" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Risk Band Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Table */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Supplier Risk Details</h2>
            <div className="flex gap-2">
              {(["eal", "dependency", "country"] as SortMode[]).map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant={sortBy === mode ? "default" : "outline"}
                  onClick={() => setSortBy(mode)}
                >
                  Sort by {mode === "eal" ? "EAL" : mode === "dependency" ? "Dependency" : "Country"}
                </Button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Supplier</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Annual Spend</th>
                  <th className="px-6 py-3 font-medium">Dependency</th>
                  <th className="px-6 py-3 font-medium">Flood Prob.</th>
                  <th className="px-6 py-3 font-medium">EAL</th>
                  <th className="px-6 py-3 font-medium">Risk Band</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer border-b transition-colors hover:bg-accent"
                    onClick={() => navigate(`/supplier/${s.id}`)}
                  >
                    <td className="px-6 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {getCountryFlag(s.country)} {s.country}
                    </td>
                    <td className="px-6 py-3 text-foreground">{formatCurrencyShort(s.annualSpend)}</td>
                    <td className="px-6 py-3 text-foreground">{s.dependency}%</td>
                    <td className="px-6 py-3 text-foreground">{s.floodProbability}%</td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      {formatCurrencyShort(s.eal)}
                    </td>
                    <td className="px-6 py-3">
                      <RiskBadge band={s.riskBand} />
                    </td>
                    <td className="px-6 py-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
