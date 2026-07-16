import { GlassCard } from "../../components/common/GlassCard";

function includesSkill(currentSkills: string[], skill: string) {
  const cur = new Set(currentSkills.map((s) => s.toLowerCase().trim()));
  return cur.has(skill.toLowerCase().trim());
}

export function ProgressBars({ requiredSkills, currentSkills }: { requiredSkills: string[]; currentSkills: string[] }) {
  // We approximate per-skill progress: 100% if present, otherwise 20% baseline.
  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Skill Match Progress
      </h2>

      <div className="mt-5 space-y-4">
        {requiredSkills.length ? (
          requiredSkills.slice(0, 12).map((skill) => {
            const met = includesSkill(currentSkills, skill);
            const val = met ? 100 : 20;
            const color = met ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-purple-500";
            return (
              <div key={skill} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{skill}</span>
                  <span className="text-xs text-slate-500">{val}%</span>
                </div>
                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${val}%` }} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-slate-600">No required skills found for the selected career.</div>
        )}
      </div>

      {requiredSkills.length > 12 && (
        <div className="mt-4 text-xs text-slate-400">Showing top 12 required skills.</div>
      )}
    </GlassCard>
  );
}

