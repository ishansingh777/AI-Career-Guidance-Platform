import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlassCard } from "../components/common/GlassCard";
import { Blobs } from "../components/common/Blobs";

import { SavedCareerCard } from "../components/saved/SavedCareerCard";
import { SavedToolbar } from "../components/saved/SavedToolbar";
import { EmptySavedState } from "../components/saved/EmptySavedState";

import type { SavedCareer } from "../utils/savedCareers";
import { getSavedCareers } from "../utils/savedCareers";

type SortKey = "AZ" | "salary" | "futureDemand";

export default function SavedCareersPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedCareer[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("AZ");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = getSavedCareers();
        if (!mounted) return;
        setSaved(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load saved careers");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = saved;
    if (q) {
      rows = rows.filter((c) => (c.title ?? c.slug).toLowerCase().includes(q));
    }

    const copy = [...rows];
    switch (sortKey) {
      case "AZ":
        copy.sort((a, b) => (a.title ?? a.slug).localeCompare(b.title ?? b.slug));
        break;
      case "salary":
        copy.sort(
          (a, b) => (b.salaryIndiaMax ?? 0) - (a.salaryIndiaMax ?? 0)
        );
        break;
      case "futureDemand":
        copy.sort((a, b) => (b.futureDemand ?? -1) - (a.futureDemand ?? -1));
        break;
    }
    return copy;
  }, [saved, search, sortKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
        <Blobs />
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard className="p-6" hover={false}>
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Blobs />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Saved Careers</h1>
            <p className="text-sm text-slate-500 mt-1">Save careers from your dashboard, details pages, and comparisons.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Could not load saved careers</div>
                <div className="text-sm text-slate-600 mt-1">{error}</div>
              </div>
            </div>
          </GlassCard>
        )}

        {!error && (
          <>
            <SavedToolbar
              savedCareers={saved}
              onSearchChange={setSearch}
              onSortChange={setSortKey}
              searchValue={search}
              sortKey={sortKey}
            />

            {filteredSorted.length === 0 ? (
              <EmptySavedState onGoDashboard={() => navigate("/dashboard")} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSorted.map((career) => (
                  <SavedCareerCard key={career.slug} career={career} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

