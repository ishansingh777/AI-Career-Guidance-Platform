import { GlassCard } from "../../components/common/GlassCard";
import { Badge } from "../../components/common/Badge";

function Row({ label, valueA, valueB }: { label: string; valueA: React.ReactNode; valueB: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="text-sm text-slate-600">{valueA}</div>
      <div className="text-sm text-slate-600">{valueB}</div>
    </div>
  );
}

export function ComparisonTable({
  a,
  b,
  titleA,
  titleB,
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
  titleA: string;
  titleB: string;
}) {
  const renderSkills = (skills: string[]) => (
    <div className="flex flex-wrap gap-2">
      {(skills?.length ? skills : ["—"]).slice(0, 8).map((s, idx) => (
        <Badge key={`${s}-${idx}`} color="blue">
          {s}
        </Badge>
      ))}
      {skills.length > 8 && <Badge color="purple">+{skills.length - 8}</Badge>}
    </div>
  );

  const renderResources = (resources: Record<string, unknown>) => {
    if (!resources || typeof resources !== "object") return "—";
    const entries = Object.entries(resources);
    if (!entries.length) return "—";
    // show first bullet-like values
    return (
      <ul className="list-disc pl-5 space-y-1">
        {entries.slice(0, 4).map(([k, v]) => (
          <li key={k} className="text-sm text-slate-600">
            {typeof v === "string" ? v : k}
          </li>
        ))}
      </ul>
    );
  };

  const renderRoadmap = (roadmap: Record<string, unknown>) => {
    if (!roadmap || typeof roadmap !== "object") return "—";
    const entries = Object.entries(roadmap);
    if (!entries.length) return "—";
    return (
      <ul className="list-disc pl-5 space-y-1">
        {entries.slice(0, 4).map(([k, v]) => (
          <li key={k} className="text-sm text-slate-600">
            {typeof v === "string" ? v : k}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Side-by-side comparison
          </h2>
          <p className="text-sm text-slate-500 mt-1">Salary, demand, growth, automation risk, and learning roadmap.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-sm font-semibold text-slate-700">Metric</div>
          <div className="text-sm font-semibold text-slate-700">{titleA}</div>
          <div className="text-sm font-semibold text-slate-700">{titleB}</div>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <Row label="Salary" valueA={a.salary} valueB={b.salary} />
        <Row label="Future Demand" valueA={a.futureDemand ?? "—"} valueB={b.futureDemand ?? "—"} />
        <Row label="Growth Rate" valueA={a.growthRate ?? "—"} valueB={b.growthRate ?? "—"} />
        <Row label="Automation Risk" valueA={a.automationRisk ?? "—"} valueB={b.automationRisk ?? "—"} />

        <div className="border-t border-slate-200 pt-4" />

        <Row label="Required Skills" valueA={renderSkills(a.requiredSkills)} valueB={renderSkills(b.requiredSkills)} />
        <Row label="Daily Work" valueA={a.dailyWork ?? "—"} valueB={b.dailyWork ?? "—"} />
        <Row label="Learning Roadmap" valueA={renderRoadmap(a.roadmap)} valueB={renderRoadmap(b.roadmap)} />
        <Row label="Learning Resources" valueA={renderResources(a.resources)} valueB={renderResources(b.resources)} />
      </div>
    </GlassCard>
  );
}

