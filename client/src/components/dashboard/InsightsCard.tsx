import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { Award, Flame, Shield, Target, Sparkles } from "lucide-react";
import type { Recommendation } from "../../types/recommendation";
import { cn } from "../../utils/cn";

type InsightsCardProps = {
  recommendations: Recommendation[];
};

function maxBy<T>(arr: T[], fn: (x: T) => number) {
  return arr.reduce((best, x) => (fn(x) > fn(best) ? x : best), arr[0]);
}

function minBy<T>(arr: T[], fn: (x: T) => number) {
  return arr.reduce((best, x) => (fn(x) < fn(best) ? x : best), arr[0]);
}

export function InsightsCard({ recommendations }: InsightsCardProps) {
  const items = recommendations;
  if (!items.length) {
    return (
      <GlassCard className="p-6" hover={false}>
        <div className="text-sm text-slate-500">Insights will appear after you take the assessment.</div>
      </GlassCard>
    );
  }

  const highestPay = maxBy(items, (r) => r.salaryIndiaMax);
  const fastestGrowth = maxBy(items, (r) => r.growthRate);
  const safestAutomation = minBy(items, (r) => r.automationRisk);

  // “Most Skill Match” interpreted as: highest match score among recommendations
  const mostSkillMatch = maxBy(items, (r) => r.score);

  const grid = [
    {
      icon: Sparkles,
      label: "Highest Paying Career",
      title: highestPay.title,
      badge: `₹${Math.round(highestPay.salaryIndiaMin / 100000)}L+`,
      color: "blue",
    },
    {
      icon: Flame,
      label: "Fastest Growing Career",
      title: fastestGrowth.title,
      badge: `${fastestGrowth.growthRate}%`,
      color: "green",
    },
    {
      icon: Shield,
      label: "Safest From Automation",
      title: safestAutomation.title,
      badge: `${safestAutomation.automationRisk}/10`,
      color: "amber",
    },
    {
      icon: Target,
      label: "Most Skill Match",
      title: mostSkillMatch.title,
      badge: `${mostSkillMatch.score}%`,
      color: "purple",
    },
  ];

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-slate-500">Insights</div>
          <div className="text-lg font-extrabold text-slate-900">Your career signals</div>
        </div>
        <Badge color="blue">AI</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {grid.map((g) => (
          <div
            key={g.label}
            className={cn(
              "rounded-2xl border border-white/70 bg-white/60 p-4",
              "flex flex-col gap-2"
            )}
          >
            <div className="flex items-center justify-between">
              <g.icon className="w-5 h-5 text-slate-700" />
              <Badge color={g.color as any}>{g.badge}</Badge>
            </div>
            <div className="text-xs text-slate-500">{g.label}</div>
            <div className="font-extrabold text-slate-900 text-sm">{g.title}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

