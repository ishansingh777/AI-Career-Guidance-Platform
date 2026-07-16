import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Badge } from "../common/Badge";
import { GlassCard } from "../common/GlassCard";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

import type { SavedCareer } from "../../utils/savedCareers";

import { removeCareer } from "../../utils/savedCareers";

function formatSalaryIndia(min?: number, max?: number) {
  if (min == null && max == null) return "—";
  const safeMin = min ?? 0;
  const safeMax = max ?? 0;
  return `₹${Math.round(safeMin / 100000) || 0}L - ₹${Math.round(safeMax / 100000) || 0}L`;
}

export function SavedCareerCard({ career }: { career: SavedCareer }) {
  const navigate = useNavigate();

  const demand = useMemo(() => {
    if (career.futureDemand == null) return null;
    return `${career.futureDemand}/10`;
  }, [career.futureDemand]);

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/70">
          <ImageWithFallback
            src={career.image ?? undefined}
            alt={career.title ?? career.slug}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Saved Career</div>
              <div className="text-lg font-extrabold text-slate-900">{career.title ?? career.slug}</div>
            </div>
            <Button
              variant="ghost"
              className="rounded-xl p-2 text-slate-500 hover:text-red-600"
              onClick={() => removeCareer(career.slug)}
              aria-label="Remove saved career"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Salary</div>
              <div className="font-bold text-slate-900">{formatSalaryIndia(career.salaryIndiaMin, career.salaryIndiaMax)}</div>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/70 p-3">
              <div className="text-xs text-slate-500">Future Demand</div>
              <div className="font-bold text-blue-700">{demand ?? "—"}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(career.requiredSkills ?? []).slice(0, 5).map((s) => (
              <Badge key={s} color="blue">
                {s}
              </Badge>
            ))}
            {!career.requiredSkills?.length && <div className="text-xs text-slate-500">No skill data</div>}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">Saved</div>
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => navigate(`/career/${career.slug}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

