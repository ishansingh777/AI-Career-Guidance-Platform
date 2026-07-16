import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";

export function CareerOverview({ career }: { career: CareerDetailsResponse }) {
  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Overview
          </h2>
          <p className="text-sm text-slate-500 mt-2">{career.description ?? "No description available."}</p>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold text-slate-800">Daily work</h3>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{career.dailyWork ?? "—"}</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Work environment</h3>
          <p className="text-sm text-slate-600 mt-1">
            {/* Work environment may be inside roadmap/profile/resources depending on seed. */}
            {(() => {
              const env = (career.reason as any)?.workEnvironment;
              return env ?? "—";
            })()}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

