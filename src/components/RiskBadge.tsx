import { RiskBand } from "@/lib/types";

interface RiskBadgeProps {
  band: RiskBand;
  size?: "sm" | "md";
}

const styles: Record<RiskBand, string> = {
  Low: "bg-risk-low-bg text-risk-low",
  Medium: "bg-risk-medium-bg text-risk-medium",
  High: "bg-risk-high-bg text-risk-high",
  Critical: "bg-risk-critical-bg text-risk-critical",
};

export default function RiskBadge({ band, size = "sm" }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${styles[band]} ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {band}
    </span>
  );
}
