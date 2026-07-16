import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";
import { Badge } from "../../components/common/Badge";

function SkillList({ title, skills, color }: { title: string; skills: string[]; color: "blue" | "purple" | "green" | "amber" | "red" }) {
  return (
    <div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {(skills?.length ? skills : ["—"]).map((s, idx) => (
          <Badge key={`${s}-${idx}`} color={color}>
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({ career }: { career: CareerDetailsResponse }) {
  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Skills
      </h2>

      <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <SkillList title="Required skills" skills={career.requiredSkills} color="blue" />
        <SkillList title="Soft skills" skills={career.softSkills} color="purple" />
        <SkillList title="Technical skills" skills={career.technicalSkills} color="green" />
      </div>
    </GlassCard>
  );
}

