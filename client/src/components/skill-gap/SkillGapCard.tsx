import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { GlassCard } from "../../components/common/GlassCard";
import { Badge } from "../../components/common/Badge";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function SkillGapCard({
  matchPercent,
  strengths,
  missingSkills,
  targetCareerTitle,
}: {
  matchPercent: number;
  strengths: string[];
  missingSkills: string[];
  targetCareerTitle: string;
}) {
  const statusColor = matchPercent >= 75 ? "green" : matchPercent >= 45 ? "amber" : "red";

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">Target career</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{targetCareerTitle}</div>
        </div>
        <div>
          <Badge color={statusColor}>
            {matchPercent}% Match
          </Badge>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Section title="Strengths">
          {strengths.length ? (
            <div className="flex flex-wrap gap-2">
              {strengths.slice(0, 6).map((s) => (
                <Badge key={s} color="green">
                  {s}
                </Badge>
              ))}
              {strengths.length > 6 && <Badge color="blue">+{strengths.length - 6}</Badge>}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              No strengths mapped yet.
            </div>
          )}
        </Section>

        <Section title="Missing skills">
          {missingSkills.length ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.slice(0, 6).map((s) => (
                <Badge key={s} color="red">
                  {s}
                </Badge>
              ))}
              {missingSkills.length > 6 && <Badge color="blue">+{missingSkills.length - 6}</Badge>}
            </div>
          ) : (
            <div className="text-sm text-emerald-700 font-semibold">You’re fully aligned with required skills.</div>
          )}
        </Section>
      </div>
    </GlassCard>
  );
}

