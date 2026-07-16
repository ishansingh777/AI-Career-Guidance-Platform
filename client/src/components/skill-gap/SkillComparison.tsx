import { Badge } from "../../components/common/Badge";
import { GlassCard } from "../../components/common/GlassCard";

function SkillList({ title, skills, color }: { title: string; skills: string[]; color: "blue" | "purple" | "green" | "amber" | "red" }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(skills.length ? skills : ["—"]).slice(0, 12).map((s, idx) => (
          <Badge key={`${s}-${idx}`} color={color}>
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function SkillComparison({
  currentSkills,
  requiredSkills,
  missingSkills,
  strengths,
}: {
  currentSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  strengths: string[];
}) {
  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Skill Comparison
      </h2>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <SkillList title="Current Skills" skills={currentSkills} color="blue" />
        <SkillList title="Required Skills" skills={requiredSkills} color="purple" />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <SkillList title="Strengths" skills={strengths} color="green" />
        <SkillList title="Missing Skills" skills={missingSkills} color="red" />
      </div>
    </GlassCard>
  );
}

