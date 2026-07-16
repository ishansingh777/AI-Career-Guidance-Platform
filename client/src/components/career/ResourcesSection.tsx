import type { CareerDetailsResponse } from "../../types/career";
import { GlassCard } from "../../components/common/GlassCard";
import { Badge } from "../../components/common/Badge";
import { ExternalLink } from "lucide-react";

function extractResources(resourcesJson: Record<string, unknown>): Array<{ title: string; url: string; type?: string }> {
  if (!resourcesJson || typeof resourcesJson !== "object") return [];

  // Try common shapes: { resources: [...] } or direct array.
  const arr = (resourcesJson as any).resources ?? (resourcesJson as any).items ?? (resourcesJson as any);
  if (Array.isArray(arr)) {
    return arr
      .filter((r) => r && typeof r === "object")
      .map((r) => ({
        title: (r as any).title ?? (r as any).name ?? "Resource",
        url: (r as any).url ?? (r as any).link,
        type: (r as any).type,
      }))
      .filter((r) => !!r.url);
  }

  return [];
}

export function ResourcesSection({ career }: { career: CareerDetailsResponse }) {
  const resources = extractResources(career.resources ?? {});

  return (
    <GlassCard className="p-6" hover={false}>
      <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Learning Resources
      </h2>

      <div className="mt-6 space-y-3">
        {resources.length ? (
          resources.map((r, idx) => (
            <a
              key={`${r.url}-${idx}`}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white/60 hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-blue-700">{r.title}</div>
                {r.type && <div className="mt-1"><Badge color="blue">{r.type}</Badge></div>}
              </div>
              <div className="text-blue-700 group-hover:translate-x-0.5 transition-transform">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))
        ) : (
          <p className="text-sm text-slate-600">No resources available.</p>
        )}
      </div>
    </GlassCard>
  );
}

