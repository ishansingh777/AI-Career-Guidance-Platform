import { Button } from "../ui/button";
import { GlassCard } from "../common/GlassCard";
import { ProgressRing } from "../common/ProgressRing";
import type { Recommendation } from "../../types/recommendation";
import { cn } from "../../utils/cn";
import { useNavigate } from "react-router-dom";

type HeroSectionProps = {
  userName: string;
  assessmentCompleted: boolean;
  topRecommendation?: {
    title: string;
    slug: string;
    score: number;
    reason: string;
    futureDemand: number;
    automationRisk: number;
    growthRate: number;
    salaryIndiaMin: number;
    salaryIndiaMax: number;
    requiredSkills: string[];
    image: string | null | undefined;
  } | null;
};

function formatSalaryIndia(min: number, max: number) {
  const toL = (n: number) => Math.round((n / 1_00_000) * 10) / 10;
  return `₹${toL(min)}L - ₹${toL(max)}L`;
}

export function HeroSection({
  userName,
  assessmentCompleted,
  topRecommendation,
}: HeroSectionProps) {
  const navigate = useNavigate();

  const top = topRecommendation ?? null;
  const matchValue = top?.score ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back, {userName} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {assessmentCompleted ? "Assessment Completed" : "Complete your assessment to unlock matches"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <ProgressRing value={assessmentCompleted ? 100 : 35} size={64} stroke={6} color="#2563EB" bg="#E2E8F0" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
              {assessmentCompleted ? "Done" : "In progress"}
            </div>
          </div>
          <Button
            variant="secondary"
            className={cn(
              "rounded-2xl px-5 py-3 font-semibold",
              assessmentCompleted
                ? "bg-white/70"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            )}
            onClick={() => navigate("/assessment")}
          >
            Retake Assessment
          </Button>
        </div>
      </div>

      <GlassCard className="p-6" hover={false}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16">
              <ProgressRing value={Math.round(matchValue)} size={64} stroke={6} color="#7C3AED" bg="#E2E8F0" />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-700">
                {matchValue ? `${Math.round(matchValue)}%` : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Top Recommendation</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {top?.title ?? "No recommendation yet"}
              </div>
              <div className="text-sm text-slate-600 mt-2">{top?.reason ?? "Take the assessment to get personalized career matches."}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Salary</div>
              <div className="font-bold text-slate-900">{top ? formatSalaryIndia(top.salaryIndiaMin, top.salaryIndiaMax) : "—"}</div>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Growth</div>
              <div className="font-bold text-emerald-700">{top ? `${top.growthRate}%` : "—"}</div>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Future Demand</div>
              <div className="font-bold text-blue-700">{top ? `${top.futureDemand}/10` : "—"}</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

