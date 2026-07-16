import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { GlassCard } from "../../components/common/GlassCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/ui/button";

import type { Recommendation } from "../../types/recommendation";
import { getTopCareerMatches } from "../../services/recommendations";

function formatSalary(min: number, max: number) {
  // keep simple: display as ₹X L - ₹Y L where possible
  const toL = (n: number) => Math.round((n / 1_000_00) * 10) / 10;
  const minL = toL(min);
  const maxL = toL(max);
  return `₹${minL}L - ₹${maxL}L`;
}

export function TopCareerMatches() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Recommendation[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopCareerMatches();
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load recommendations");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-3 text-slate-600">
          <Sparkles className="w-5 h-5" />
          <span>Loading career matches…</span>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-6" hover={false}>
        <div className="text-sm text-red-600">{error}</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800">Top Career Matches</h3>
          <p className="text-sm text-slate-500 mt-1">Based on your assessment</p>
        </div>
        <Badge color="blue">Top 5</Badge>
      </div>

      <div className="space-y-3">
        {items.slice(0, 5).map((c) => (
          <div
            key={c.slug}
            className="p-4 rounded-2xl border border-slate-200/60 hover:bg-white/60 transition-colors cursor-pointer"
            onClick={() => navigate(`/career/${c.slug}`)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <Badge color="blue">{c.score}%</Badge>
                </div>
                <div className="text-xs text-slate-500 mt-1">{c.reason}</div>
                <div className="text-xs text-slate-500 mt-2">
                  <span className="font-medium text-slate-700">Salary:</span> {formatSalary(c.salaryIndiaMin, c.salaryIndiaMax)}
                </div>
              </div>
              <Button
                variant="secondary"
                className="whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/career/${c.slug}`);
                }}
              >
                View
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge color="green">Demand {c.futureDemand}/10</Badge>
              <Badge color="amber">Risk {c.automationRisk}/10</Badge>
              <Badge color="purple">Growth {c.growthRate}%</Badge>
            </div>

            {c.requiredSkills?.length ? (
              <div className="mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Skills:</span> {c.requiredSkills.slice(0, 5).join(", ")}
              </div>
            ) : null}
          </div>
        ))}

        {items.length === 0 ? (
          <div className="text-sm text-slate-500">No recommendations available yet.</div>
        ) : null}
      </div>
    </GlassCard>
  );
}

