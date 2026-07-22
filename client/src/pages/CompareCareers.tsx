import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bookmark, Loader2, Sparkles } from "lucide-react";

import api from "../services/axios";
import type { CareerDetailsResponse } from "../types/career";

import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";
import { Blobs } from "../components/common/Blobs";

import { CareerSelector } from "../components/compare/CareerSelector";
import { ComparisonCharts } from "../components/compare/ComparisonCharts";
import { ComparisonTable } from "../components/compare/ComparisonTable";
import { Button } from "../components/ui/button";
import { ProgressRing } from "../components/common/ProgressRing";
import { useNavigate } from "react-router-dom";

import { isCareerSaved, toggleCareer } from "../utils/savedCareers";


type CareerLite = { slug: string; title: string };

function formatMaybeNumber(v: number | null | undefined, suffix = "") {
  if (v === null || v === undefined) return "—";
  return `${v}${suffix}`;
}

function formatSalary(min: number | null | undefined, max: number | null | undefined) {
  if (min === null || max === null || min === undefined || max === undefined) return "—";
  return `${min}-${max}`;
}

export default function CompareCareers() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [careerList, setCareerList] = useState<CareerLite[]>([]);

  const [careerASlug, setCareerASlug] = useState<string>("");
  const [careerBSlug, setCareerBSlug] = useState<string>("");
  const [careerA, setCareerA] = useState<CareerDetailsResponse | null>(null);
  const [careerB, setCareerB] = useState<CareerDetailsResponse | null>(null);

  const [savedVersion, setSavedVersion] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // No dedicated career list endpoint found; use recommendations as a proxy.
        const recRes = await api.get("/recommendations");
        const recs = (recRes.data?.recommendations ?? recRes.data ?? []) as any[];
        const list: CareerLite[] = recs
          .map((r) => ({ slug: r.slug, title: r.title }))
          .filter((x) => x.slug && x.title);
        if (!mounted) return;
        setCareerList(list);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load careers");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function loadCareer(which: "A" | "B", slug: string) {

    if (!slug) {
      if (which === "A") setCareerA(null);
      if (which === "B") setCareerB(null);
      return;
    }
    try {
      const res = await api.get(`/careers/${encodeURIComponent(slug)}`);
      const data = res.data as CareerDetailsResponse;
      if (which === "A") setCareerA(data);
      if (which === "B") setCareerB(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load career details");
    }
  }

  useEffect(() => {
    if (careerASlug) loadCareer("A", careerASlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerASlug]);


  useEffect(() => {
    if (careerBSlug) loadCareer("B", careerBSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerBSlug]);


  const bothSelected = Boolean(careerA && careerB);

  const comparisonPayload = useMemo(() => {
    if (!careerA || !careerB) return null;
    return {
      a: {
        salary: `${formatSalary(careerA.salaryIndiaMin ?? null, careerA.salaryIndiaMax ?? null)} (India)`,
        growthRate: careerA.growthRate,
        futureDemand: careerA.futureDemand,
        automationRisk: careerA.automationRisk,
        requiredSkills: careerA.requiredSkills,
        dailyWork: careerA.dailyWork,
        roadmap: careerA.roadmap,
        resources: careerA.resources,
      },
      b: {
        salary: `${formatSalary(careerB.salaryIndiaMin ?? null, careerB.salaryIndiaMax ?? null)} (India)`,
        growthRate: careerB.growthRate,
        futureDemand: careerB.futureDemand,
        automationRisk: careerB.automationRisk,
        requiredSkills: careerB.requiredSkills,
        dailyWork: careerB.dailyWork,
        roadmap: careerB.roadmap,
        resources: careerB.resources,
      },
    };
  }, [careerA, careerB]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Blobs />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Compare Careers
            </h1>
            <p className="text-slate-500 mt-1">Side-by-side comparison of salary, growth, demand, automation risk, and required skills.</p>
          </div>
          <Badge color="blue" className="gap-2">
            <Sparkles className="w-3.5 h-3.5" />&nbsp;Interactive
          </Badge>
        </div>

        {error && (
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Comparison failed</div>
                <div className="text-sm text-slate-600 mt-1">{error}</div>
              </div>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-6" hover={false}>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Career A</h2>
              <div className="mt-3">
                <CareerSelector
                  careerList={careerList}
                  selectedSlug={careerASlug}
                  onChange={(slug) => setCareerASlug(slug)}
                  placeholder="Select career A"
                />
                {!!careerASlug && (
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      className="rounded-2xl px-3 py-2 text-sm border-slate-200 hover:border-blue-300"
                      onClick={() => {
                        const c = careerASlug;
                        toggleCareer({
                          slug: c,
                          title: careerA?.title ?? "",
                          image: careerA?.image ?? undefined,
                          salaryIndiaMin: careerA?.salaryIndiaMin ?? undefined,
                          salaryIndiaMax: careerA?.salaryIndiaMax ?? undefined,
                          futureDemand: careerA?.futureDemand ?? undefined,
                          growthRate: careerA?.growthRate ?? undefined,
                          automationRisk: careerA?.automationRisk ?? undefined,
                          requiredSkills: careerA?.requiredSkills ?? undefined,
                          dailyWork: careerA?.dailyWork ?? undefined,
                        });
                        setSavedVersion((v) => v + 1);
                      }}
                    >
                      {isCareerSaved(careerASlug) ? (
                        <><Bookmark className="w-3.5 h-3.5 fill-blue-600 text-blue-600" /> Saved</>
                      ) : (
                        <><Bookmark className="w-3.5 h-3.5" /> Save</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Career B</h2>
              <div className="mt-3">
                <CareerSelector
                  careerList={careerList}
                  selectedSlug={careerBSlug}
                  onChange={(slug) => setCareerBSlug(slug)}
                  placeholder="Select career B"
                />
                {!!careerBSlug && (
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      className="rounded-2xl px-3 py-2 text-sm border-slate-200 hover:border-blue-300"
                      onClick={() => {
                        const c = careerBSlug;
                        toggleCareer({
                          slug: c,
                          title: careerB?.title ?? "",
                          image: careerB?.image ?? undefined,
                          salaryIndiaMin: careerB?.salaryIndiaMin ?? undefined,
                          salaryIndiaMax: careerB?.salaryIndiaMax ?? undefined,
                          futureDemand: careerB?.futureDemand ?? undefined,
                          growthRate: careerB?.growthRate ?? undefined,
                          automationRisk: careerB?.automationRisk ?? undefined,
                          requiredSkills: careerB?.requiredSkills ?? undefined,
                          dailyWork: careerB?.dailyWork ?? undefined,
                        });
                        setSavedVersion((v) => v + 1);
                      }}
                    >
                      {isCareerSaved(careerBSlug) ? (
                        <><Bookmark className="w-3.5 h-3.5 fill-blue-600 text-blue-600" /> Saved</>
                      ) : (
                        <><Bookmark className="w-3.5 h-3.5" /> Save</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              {loading && (
                <div className="flex items-center gap-3">
                  <ProgressRing value={50} size={34} />
                  <div className="text-sm text-slate-600">Loading careers…</div>
                </div>
              )}
              {!loading && !bothSelected && (
                <div className="text-sm text-slate-600">
                  Select two careers to render charts and comparison table.
                </div>
              )}
              {!bothSelected && (
                <Button
                  variant="secondary"
                  className="mt-4 rounded-2xl"
                  onClick={() => navigate("/dashboard")}
                >
                  Choose from your top matches
                </Button>
              )}
            </div>
          </div>
        </GlassCard>

        {!bothSelected || !comparisonPayload ? (
          <div />
        ) : (
          <>
            <ComparisonCharts a={comparisonPayload.a} b={comparisonPayload.b} />
            <ComparisonTable a={comparisonPayload.a} b={comparisonPayload.b} titleA={careerA?.title ?? "Career A"} titleB={careerB?.title ?? "Career B"} />
          </>
        )}
      </div>
    </div>
  );
}

