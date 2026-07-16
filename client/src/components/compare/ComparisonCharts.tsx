import { GlassCard } from "../../components/common/GlassCard";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";
import { Badge } from "../../components/common/Badge";

export function ComparisonCharts({
  a,
  b,
}: {
  a: {
    salary: string;
    growthRate: number | null;
    futureDemand: number | null;
    automationRisk: number | null;
    requiredSkills: string[];
    dailyWork: string | null;
    roadmap: Record<string, unknown>;
    resources: Record<string, unknown>;
  };
  b: {
    salary: string;
    growthRate: number | null;
    futureDemand: number | null;
    automationRisk: number | null;
    requiredSkills: string[];
    dailyWork: string | null;
    roadmap: Record<string, unknown>;
    resources: Record<string, unknown>;
  };
}) {
  // Approx normalize to 0-100 scale for charts.
  const normalize = (v: number | null, fallback: number) => {
    if (v === null || v === undefined) return fallback;
    return Math.max(0, Math.min(100, v));
  };

  const data = [
    { metric: "Future Demand", a: normalize(a.futureDemand, 50), b: normalize(b.futureDemand, 50) },
    { metric: "Growth Rate", a: normalize(a.growthRate, 50), b: normalize(b.growthRate, 50) },
    { metric: "Automation Risk", a: normalize(a.automationRisk, 50), b: normalize(b.automationRisk, 50) },
  ];

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Charts
          </h2>
          <p className="text-sm text-slate-500 mt-1">Normalized comparison across demand, growth, and automation risk.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="blue">A</Badge>
          <Badge color="purple">B</Badge>
        </div>
      </div>

      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
            <Radar name="Career A" dataKey="a" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
            <Radar name="Career B" dataKey="b" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} />
            <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Note: The underlying backend uses numeric fields that aren’t guaranteed to be 0-100; we clamp them for visualization.
      </div>
    </GlassCard>
  );
}

