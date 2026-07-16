import { useMemo } from "react";
import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";

// Using already installed Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

function safeNumber(n: number | null | undefined) {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

export function CareerCharts({ career }: { career: CareerDetailsResponse }) {
  const skillDistribution = useMemo(() => {
    const required = career.requiredSkills?.length ?? 0;
    const soft = career.softSkills?.length ?? 0;
    const tech = career.technicalSkills?.length ?? 0;

    const labels = ["Required", "Soft", "Technical"];
    const values = [required, soft, tech];

    const total = values.reduce((a, b) => a + b, 0);
    const pct = total ? values.map((v) => Math.round((v / total) * 100)) : [0, 0, 0];

    return { labels, values: pct };
  }, [career]);

  const salaryComparison = useMemo(() => {
    return {
      labels: ["India", "Global"],
      data: [safeNumber(career.salaryIndiaMax), safeNumber(career.salaryGlobalMax)],
    };
  }, [career]);

  const growthMetrics = useMemo(() => {
    return {
      labels: ["Future demand", "Automation risk", "Growth rate"],
      data: [safeNumber(career.futureDemand), safeNumber(career.automationRisk), safeNumber(career.growthRate)],
    };
  }, [career]);

  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Charts
      </h2>

      <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white/60">
          <div className="font-bold text-slate-900 mb-3">Skill Distribution</div>
          <Doughnut
            data={{
              labels: skillDistribution.labels,
              datasets: [
                {
                  data: skillDistribution.values,
                  backgroundColor: ["#2563EB", "#7C3AED", "#16A34A"],
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white/60">
          <div className="font-bold text-slate-900 mb-3">Salary Comparison</div>
          <Bar
            data={{
              labels: salaryComparison.labels,
              datasets: [
                {
                  label: "Max salary",
                  data: salaryComparison.data,
                  backgroundColor: ["rgba(37,99,235,0.75)", "rgba(99,102,241,0.75)"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white/60 lg:col-span-1 md:col-span-2">
          <div className="font-bold text-slate-900 mb-3">Growth Metrics</div>
          <Line
            data={{
              labels: growthMetrics.labels,
              datasets: [
                {
                  label: "Score",
                  data: growthMetrics.data,
                  borderColor: "rgba(37,99,235,1)",
                  backgroundColor: "rgba(37,99,235,0.2)",
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>
    </GlassCard>
  );
}

