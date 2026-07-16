import { BookOpen, GraduationCap, Rocket } from "lucide-react";

import { Badge } from "../../components/common/Badge";
import { GlassCard } from "../../components/common/GlassCard";

type Priority = { skill: string; level: "High" | "Medium" | "Low" };

function pickTop(items: string[], n: number) {
  return items.slice(0, n);
}

export function LearningSuggestions({
  learningPriority,
  missingSkills,
  strengths,
}: {
  learningPriority: Priority[];
  missingSkills: string[];
  strengths: string[];
}) {
  const high = learningPriority.filter((p) => p.level === "High").map((p) => p.skill);
  const medium = learningPriority.filter((p) => p.level === "Medium").map((p) => p.skill);

  const courses = pickTop(high.length ? high : missingSkills, 3);
  const certs = pickTop(medium.length ? medium : missingSkills, 2);
  const priorityText = high.length ? "High" : missingSkills.length ? "Medium" : "Low";

  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Learning Priority
      </h2>

      <div className="mt-4 flex items-center gap-2">
        <Badge color={priorityText === "High" ? "red" : priorityText === "Medium" ? "amber" : "green"}>
          {priorityText} Focus
        </Badge>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Suggested Courses
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(courses.length ? courses : ["—"]).map((s, idx) => (
              <Badge key={`${s}-${idx}`} color="blue">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            Suggested Certifications
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(certs.length ? certs : ["—"]).map((s, idx) => (
              <Badge key={`${s}-${idx}`} color="purple">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Rocket className="w-4 h-4 text-emerald-600" />
            Strength leverage
          </div>
          <div className="mt-2 text-sm text-slate-600">
            {strengths.length
              ? `Keep building on ${strengths.slice(0, 2).join(" & ")}.`
              : "Add a small project to validate your strongest direction first."}
          </div>
        </div>
      </div>

      <div className="mt-5 text-xs text-slate-400">
        Note: Courses/certifications are mapped from missing skills (frontend heuristic) until a dedicated learning-suggestions API is available.
      </div>
    </GlassCard>
  );
}

