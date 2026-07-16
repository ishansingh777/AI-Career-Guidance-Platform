import { motion } from "framer-motion";
import { Badge } from "../common/Badge";
import { GlassCard } from "../common/GlassCard";
import { ProgressRing } from "../common/ProgressRing";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../../utils/cn";
import type { Recommendation } from "../../types/recommendation";
import { useNavigate } from "react-router-dom";

import { toggleCareer, isCareerSaved } from "../../utils/savedCareers";
import type { SavedCareer } from "../../utils/savedCareers";


type RecommendationCardProps = {
  recommendation: Recommendation;
};

function formatSalaryIndia(min: number, max: number) {
  const toL = (n: number) => Math.round((n / 1_00_000) * 10) / 10;
  return `₹${toL(min)}L - ₹${toL(max)}L`;
}

function scoreColor(score: number) {
  if (score >= 85) return { ring: "#2563EB", label: "text-blue-700" };
  if (score >= 70) return { ring: "#7C3AED", label: "text-purple-700" };
  return { ring: "#10B981", label: "text-emerald-700" };
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const navigate = useNavigate();
  const c = scoreColor(recommendation.score);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <GlassCard className="p-5 h-full" hover={false}>
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/70">
            <ImageWithFallback
              src={recommendation.image ?? undefined}
              alt={recommendation.title}
              className="w-full h-full object-cover"
              fallbackText={recommendation.title.slice(0, 2).toUpperCase()}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">Career</div>
                <div className="text-lg font-extrabold text-slate-900">{recommendation.title}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16">
                  <ProgressRing value={Math.round(recommendation.score)} size={64} stroke={6} color={c.ring} bg="#E2E8F0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="text-sm text-slate-600 leading-relaxed">
            {recommendation.reason}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Salary</div>
              <div className="font-bold text-slate-900">{formatSalaryIndia(recommendation.salaryIndiaMin, recommendation.salaryIndiaMax)}</div>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Growth</div>
              <div className={cn("font-bold", recommendation.growthRate >= 20 ? "text-emerald-700" : "text-blue-700")}>{recommendation.growthRate}%</div>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Future Demand</div>
              <div className="font-bold text-blue-700">{recommendation.futureDemand}/10</div>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Automation Risk</div>
              <div className="font-bold text-amber-700">{recommendation.automationRisk}/10</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(recommendation.requiredSkills ?? []).slice(0, 8).map((s) => (
              <Badge key={s} color="blue">
                {s}
              </Badge>
            ))}
            {recommendation.requiredSkills?.length ? null : (
              <div className="text-xs text-slate-500">No skills provided</div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-400">Match {recommendation.score}%</div>
              <Button
                variant="ghost"
                className="rounded-xl px-2 py-1 text-xs border border-slate-200 hover:border-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCareer({
                    slug: recommendation.slug,
                    title: recommendation.title,
                    image: recommendation.image,
                    salaryIndiaMin: recommendation.salaryIndiaMin,
                    salaryIndiaMax: recommendation.salaryIndiaMax,
                    futureDemand: recommendation.futureDemand,
                    growthRate: recommendation.growthRate,
                    automationRisk: recommendation.automationRisk,
                    requiredSkills: recommendation.requiredSkills,
                  });
                }}
              >
                {isCareerSaved(recommendation.slug) ? "Saved" : "Save"}
              </Button>
            </div>

            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => navigate(`/career/${recommendation.slug}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

