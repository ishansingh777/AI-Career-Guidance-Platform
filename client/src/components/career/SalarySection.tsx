import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";

function formatRange(min: number | null, max: number | null, currency: string) {
  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${currency}${min.toLocaleString()}–${currency}${max.toLocaleString()}`;
  return `${currency}${(min ?? max)!.toLocaleString()}`;
}

export function SalarySection({ career }: { career: CareerDetailsResponse }) {
  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Salary
      </h2>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold text-slate-800">India</h3>
          <p className="text-sm text-slate-600 mt-1">
            {formatRange(career.salaryIndiaMin, career.salaryIndiaMax, "₹")}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Global</h3>
          <p className="text-sm text-slate-600 mt-1">
            {formatRange(career.salaryGlobalMin, career.salaryGlobalMax, "$")}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

