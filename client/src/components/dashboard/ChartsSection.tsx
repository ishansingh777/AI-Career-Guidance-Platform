import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, RadialLinearScale, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";
import { Bar, Radar } from "react-chartjs-2";
import { GlassCard } from "../common/GlassCard";
import type { Recommendation } from "../../types/recommendation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  Tooltip,
  Legend
);

type ChartsSectionProps = {
  recommendations: Recommendation[];
  loading?: boolean;
};

function formatSalaryIndia(min: number, max: number) {
  const toL = (n: number) => Math.round((n / 1_00_000) * 10) / 10;
  return { minL: toL(min), maxL: toL(max) };
}

export function ChartsSection({ recommendations, loading }: ChartsSectionProps) {
  const top = recommendations.slice(0, 5);

  const matchScoreData = useMemo(() => {
    const labels = top.map((r) => r.title);
    return {
      labels,
      datasets: [
        {
          label: "Match score %",
          data: labels.map((_, i) => top[i].score),
          backgroundColor: ["rgba(37, 99, 235, 0.35)", "rgba(124, 58, 237, 0.35)", "rgba(16, 185, 129, 0.35)", "rgba(245, 158, 11, 0.35)", "rgba(239, 68, 68, 0.35)"],
          borderColor: ["rgba(37, 99, 235, 1)", "rgba(124, 58, 237, 1)", "rgba(16, 185, 129, 1)", "rgba(245, 158, 11, 1)", "rgba(239, 68, 68, 1)"],
          borderWidth: 1,
          borderRadius: 12,
        },
      ],
    };
  }, [top]);

  const salaryComparisonData = useMemo(() => {
    const labels = top.map((r) => r.title);
    const min = top.map((r) => formatSalaryIndia(r.salaryIndiaMin, r.salaryIndiaMax).minL);
    const max = top.map((r) => formatSalaryIndia(r.salaryIndiaMin, r.salaryIndiaMax).maxL);
    return {
      labels,
      datasets: [
        {
          label: "Min (LPA)",
          data: min,
          backgroundColor: "rgba(37, 99, 235, 0.35)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 1,
          borderRadius: 10,
        },
        {
          label: "Max (LPA)",
          data: max,
          backgroundColor: "rgba(124, 58, 237, 0.35)",
          borderColor: "rgba(124, 58, 237, 1)",
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    };
  }, [top]);

  const futureDemandRadarData = useMemo(() => {
    const labels = top.map((r) => r.title);
    const data = top.map((r) => r.futureDemand);
    return {
      labels,
      datasets: [
        {
          label: "Future demand /10",
          data,
          backgroundColor: "rgba(37, 99, 235, 0.25)",
          borderColor: "rgba(37, 99, 235, 1)",
          pointBackgroundColor: "rgba(37, 99, 235, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [top]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#334155",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#0f172a",
        bodyColor: "#334155",
        borderColor: "rgba(148,163,184,0.4)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(226,232,240,0.9)" },
      },
      r: {
        ticks: { backdropColor: "transparent", color: "#64748b" },
        grid: { color: "rgba(226,232,240,0.9)" },
        angleLines: { color: "rgba(226,232,240,0.9)" },
        pointLabels: { color: "#0f172a", font: { size: 11 } },
      },
    },
  } as const;

  if (loading) {
    return (
      <GlassCard className="p-6" hover={false}>
        <div className="text-sm text-slate-500">Loading charts…</div>
      </GlassCard>
    );
  }

  if (!top.length) {
    return null;
  }

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="mb-4">
        <div className="text-sm font-medium text-slate-500">Charts</div>
        <div className="text-lg font-extrabold text-slate-900">Market signals snapshot</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[260px] sm:h-[300px]">
          <div className="text-xs font-semibold text-slate-600 mb-2">Match Score</div>
          <div className="h-full">
            <Bar
              data={matchScoreData}
              options={{
                ...commonOptions,
                scales: {
                  x: commonOptions.scales.x,
                  y: {
                    ...commonOptions.scales.y,
                    suggestedMax: 100,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-1 h-[260px] sm:h-[300px]">
          <div className="text-xs font-semibold text-slate-600 mb-2">Salary Comparison (LPA)</div>
          <div className="h-full">
            <Bar data={salaryComparisonData} options={commonOptions} />
          </div>
        </div>

        <div className="lg:col-span-1 h-[280px] sm:h-[320px]">
          <div className="text-xs font-semibold text-slate-600 mb-2">Future Demand Radar</div>
          <div className="h-full">
            <Radar data={futureDemandRadarData} options={commonOptions} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

