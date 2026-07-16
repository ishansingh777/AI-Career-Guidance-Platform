import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";

export function RelatedCareers({
  careers,
  onNavigate,
}: {
  careers: CareerDetailsResponse["relatedCareers"];
  onNavigate: (slug: string) => void;
}) {
  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Related Careers
      </h2>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers && careers.length ? (
          careers.slice(0, 6).map((c) => (
            <button
              key={c.slug}
              onClick={() => onNavigate(c.slug)}
              className="text-left rounded-2xl border border-slate-200 bg-white/60 p-4 hover:bg-white/90 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                  {c.image ? (
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    "💼"
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-slate-900">{c.title}</div>
                  <div className="text-xs text-slate-500">{c.slug}</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 flex-wrap text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  demand: {c.futureDemand ?? "—"}
                </span>
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  growth: {c.growthRate ?? "—"}
                </span>
              </div>
            </button>
          ))
        ) : (
          <p className="text-sm text-slate-600">No related careers available.</p>
        )}
      </div>
    </GlassCard>
  );
}

