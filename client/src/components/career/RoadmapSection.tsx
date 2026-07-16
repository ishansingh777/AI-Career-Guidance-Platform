import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";
import { Badge } from "../../components/common/Badge";

function flattenRoadmap(roadmap: Record<string, unknown>): Array<{ title: string; description?: string; status?: string }> {
  // Backend roadmap is stored as Json; render best-effort.
  if (!roadmap || typeof roadmap !== "object") return [];

  const items: Array<{ title: string; description?: string; status?: string }> = [];

  // Common patterns: { phases: [...] } or direct array-like keys.
  const phases = (roadmap as any).phases ?? (roadmap as any).items ?? (roadmap as any).milestones;
  if (Array.isArray(phases)) {
    for (const p of phases) {
      if (p && typeof p === "object") {
        items.push({
          title: (p as any).title ?? (p as any).phase ?? "Roadmap phase",
          description: (p as any).description ?? (p as any).desc,
          status: (p as any).status,
        });
      }
    }
    return items;
  }

  for (const [k, v] of Object.entries(roadmap)) {
    if (Array.isArray(v)) {
      for (const entry of v) {
        if (entry && typeof entry === "object") {
          items.push({
            title: (entry as any).title ?? (entry as any).phase ?? k,
            description: (entry as any).description ?? (entry as any).desc,
            status: (entry as any).status,
          });
        }
      }
    }
  }

  return items;
}

export function RoadmapSection({ career }: { career: CareerDetailsResponse }) {
  const items = flattenRoadmap(career.roadmap ?? {});

  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Learning Roadmap
      </h2>

      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((it, idx) => (
            <div key={`${it.title}-${idx}`} className="p-4 rounded-2xl border border-slate-200 bg-white/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-extrabold text-slate-900">{it.title}</div>
                  {it.description && <p className="text-sm text-slate-600 mt-1">{it.description}</p>}
                </div>
                {it.status && <Badge color={String(it.status).toLowerCase().includes("done") ? "green" : "blue"}>{it.status}</Badge>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No roadmap data available.</p>
        )}
      </div>
    </GlassCard>
  );
}

