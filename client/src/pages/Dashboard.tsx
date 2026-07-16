import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Recommendation } from "../types/recommendation";

import { getTopCareerMatches } from "../services/recommendations";

import { Badge } from "../components/common/Badge";
import { Blobs } from "../components/common/Blobs";
import { GlassCard } from "../components/common/GlassCard";
import { HeroSection } from "../components/dashboard/HeroSection";
import { RecommendationsGrid } from "../components/dashboard/RecommendationsGrid";
import { InsightsCard } from "../components/dashboard/InsightsCard";
import { ChartsSection } from "../components/dashboard/ChartsSection";
import { EmptyRecommendations } from "../components/dashboard/EmptyRecommendations";
import { Button } from "../components/ui/button";

function normalizeRecommendations(data: any): Recommendation[] {

  if (!data) return [];
  if (Array.isArray(data)) return data as Recommendation[];
  if (Array.isArray(data.recommendations)) return data.recommendations as Recommendation[];
  return [];
}

type UiState = {
  loading: boolean;
  error: string | null;
  recommendations: Recommendation[];
};

function SkeletonCard() {
  return (
    <GlassCard className="p-5 h-full" hover={false}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-100 rounded w-2/3 mt-2 animate-pulse" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-20 bg-slate-100 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="mt-5 h-10 bg-slate-100 rounded-xl animate-pulse" />
    </GlassCard>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [state, setState] = useState<UiState>({
    loading: true,
    error: null,
    recommendations: [],
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const data = await getTopCareerMatches();
        if (!mounted) return;
        setState({
          loading: false,
          error: null,
          recommendations: normalizeRecommendations(data),
        });
      } catch (e: any) {
        if (!mounted) return;
        setState({
          loading: false,
          error: e?.message ?? "Failed to load recommendations",
          recommendations: [],
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const userName = useMemo(() => "User", []);

  const topRecommendation =
    state.recommendations.length ? (state.recommendations[0] as any) : null;



  const assessmentCompleted = true;

/*
  const handleExportPdf = useCallback(() => {
    const doc = generateCareerReport({
      recommendations: state.recommendations.slice(0, 5),
      selectedCareer: state.recommendations[0]
        ? {
            title: state.recommendations[0].title,
            slug: state.recommendations[0].slug,
            salaryIndiaMin: state.recommendations[0].salaryIndiaMin,
            salaryIndiaMax: state.recommendations[0].salaryIndiaMax,
            growthRate: state.recommendations[0].growthRate,
            futureDemand: state.recommendations[0].futureDemand,
            automationRisk: state.recommendations[0].automationRisk,
            requiredSkills: state.recommendations[0].requiredSkills,
          }
        : undefined,
    });
    doc.save("career-guidance-report.pdf");
  }, [state.recommendations]);
  */
  const showEmpty = !state.loading && !state.error && state.recommendations.length === 0;
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6 relative">
      <Blobs />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <HeroSection
          userName={userName}
          assessmentCompleted={assessmentCompleted}
          topRecommendation={topRecommendation}
        />
        {state.error && (
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Could not load recommendations</div>
                <div className="text-sm text-slate-600 mt-1">{state.error}</div>
              </div>
            </div>
            <div className="mt-4">
              <Button className="rounded-2xl" onClick={() => navigate("/assessment")}>
                Take / Retake Assessment
              </Button>
            </div>
          </GlassCard>
        )}

        {state.loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-full">
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}

        {!state.loading && !state.error && (
          <>
            {/* Top Recommendations */}
            <section>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Top Recommendations</h2>
                  <p className="text-sm text-slate-500 mt-1">Your best matches, ranked by AI score</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="blue">Top 5</Badge>
              <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Export PDF
                  </Button>
                </div>
              </div>

              <RecommendationsGrid recommendations={state.recommendations} />
            </section>

            <InsightsCard recommendations={state.recommendations} />

            {/* Charts */}
            <ChartsSection recommendations={state.recommendations} loading={false} />

            {/* Empty */}
            {showEmpty && <EmptyRecommendations />}
          </>
        )}
      </div>
    </div>
  );
}



