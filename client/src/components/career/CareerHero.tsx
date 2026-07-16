import { ArrowLeft } from "lucide-react";

import type { CareerDetailsResponse } from "../../types/career";

import { Blobs } from "../../components/common/Blobs";
import { Badge } from "../../components/common/Badge";
import { GlassCard } from "../../components/common/GlassCard";

export function CareerHero({
  career,
  matchScore,
}: {
  career: CareerDetailsResponse;
  matchScore: number | null;
}) {
  const salaryText = (() => {
    const min = career.salaryIndiaMin;
    const max = career.salaryIndiaMax;
    if (min == null && max == null) return "—";
    if (min != null && max != null) return `₹${min.toLocaleString()}–₹${max.toLocaleString()}`;
    return `₹${(min ?? max)?.toLocaleString()}`;
  })();

  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
        <Blobs />

        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),transparent_55%)]" />

        <div className="relative z-10 p-8 md:p-10 text-white">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-[280px]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl">
                  {career.image ? <img src={career.image} alt={career.title} className="w-full h-full object-cover rounded-2xl" /> : "💼"}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {career.title}
                    </h1>
                  </div>
                  <p className="mt-2 text-white/70 text-sm">{career.category}</p>
                </div>
              </div>
            </div>

            <GlassCard className="p-4 md:p-5 bg-white/10 border-white/20" hover={false}>
              <div className="grid grid-cols-2 gap-3 min-w-[320px]">
                <div className="space-y-1">
                  <div className="text-xs text-white/70">Salary (India)</div>
                  <div className="text-base font-extrabold">{salaryText}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/70">Future demand</div>
                  <div className="text-base font-extrabold">{career.futureDemand ?? "—"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/70">Automation risk</div>
                  <div className="text-base font-extrabold">{career.automationRisk ?? "—"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/70">Growth rate</div>
                  <div className="text-base font-extrabold">{career.growthRate ?? "—"}</div>
                </div>
              </div>

              {matchScore != null && (
                <div className="mt-4">
                  <Badge color="blue">{matchScore}% AI Match</Badge>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Badge color="blue">{career.futureDemand ?? "—"} demand</Badge>
            <Badge color="purple">{career.automationRisk ?? "—"} automation risk</Badge>
            <Badge color="green">{career.growthRate ?? "—"} growth</Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </section>
  );
}

