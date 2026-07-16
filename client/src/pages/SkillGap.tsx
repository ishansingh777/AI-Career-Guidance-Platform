import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, BadgeCheck, ChevronRight, FileText, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/axios";
import type { CareerDetailsResponse } from "../types/career";
import type { Recommendation } from "../types/recommendation";

import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";
import { Blobs } from "../components/common/Blobs";
import { Button } from "../components/ui/button";
import { ProgressBars } from "../components/skill-gap/ProgressBars";
import { SkillComparison } from "../components/skill-gap/SkillComparison";
import { SkillGapCard } from "../components/skill-gap/SkillGapCard";
import { LearningSuggestions } from "../components/skill-gap/LearningSuggestions";

import { generateCareerReport } from "../utils/pdf/generateCareerReport";

type Assessment = {
  skills?: string[];
  requiredSkills?: string[];
};

function normalizeStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  return [];
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function computeMatchPercent(currentSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills.length) return 0;
  const cur = new Set(currentSkills.map((s) => s.toLowerCase().trim()));
  const req = requiredSkills.map((s) => s.toLowerCase().trim());
  const matched = req.filter((r) => cur.has(r));
  return Math.round((matched.length / req.length) * 100);
}

function computeStrengths(currentSkills: string[], requiredSkills: string[]): string[] {
  const cur = new Set(currentSkills.map((s) => s.toLowerCase().trim()));
  return uniq(
    requiredSkills.filter((s) => cur.has(s.toLowerCase().trim()))
  );
}

function computeMissing(currentSkills: string[], requiredSkills: string[]): string[] {
  const cur = new Set(currentSkills.map((s) => s.toLowerCase().trim()));
  return requiredSkills.filter((s) => !cur.has(s.toLowerCase().trim()));
}

export default function SkillGap() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [topCareer, setTopCareer] = useState<CareerDetailsResponse | null>(null);

  const currentSkills = useMemo(() => {
    // Best-effort: many assessment schemas store a mapped skill list.
    // If unavailable, empty array triggers friendly empty state.
    return uniq(normalizeStringArray((assessment as any)?.skills));
  }, [assessment]);

  const requiredSkills = useMemo(() => {
    return topCareer?.requiredSkills ?? [];
  }, [topCareer]);

  const matchPercent = useMemo(() => {
    return computeMatchPercent(currentSkills, requiredSkills);
  }, [currentSkills, requiredSkills]);

  const missingSkills = useMemo(() => {
    return computeMissing(currentSkills, requiredSkills);
  }, [currentSkills, requiredSkills]);

  const strengths = useMemo(() => {
    return computeStrengths(currentSkills, requiredSkills);
  }, [currentSkills, requiredSkills]);

  const learningPriority = useMemo(() => {
    // Simple priority rubric based on whether skills are missing.
    // Missing => High, strengths => Low/Not priority.
    const missing = new Set(missingSkills.map((s) => s.toLowerCase().trim()));
    const strengthsSet = new Set(strengths.map((s) => s.toLowerCase().trim()));

    const priorities = requiredSkills
      .map((s) => {
        const key = s.toLowerCase().trim();
        if (missing.has(key)) return { skill: s, level: "High" as const };
        if (strengthsSet.has(key)) return { skill: s, level: "Low" as const };
        return { skill: s, level: "Medium" as const };
      })
      .filter(Boolean);

    return priorities;
  }, [missingSkills, strengths, requiredSkills]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // Assessment: best-effort fetch.
        // If endpoint doesn’t exist, we fall back gracefully to empty assessment UI.
        let assessmentData: Assessment | null = null;
        try {
          const res = await api.get("/assessments/me");
          assessmentData = res.data ?? null;
        } catch {
          // ignore; empty assessment
          assessmentData = null;
        }

        // Recommendations: used to infer which career to compare.
        let recs: Recommendation[] = [];
        try {
          const recRes = await api.get("/recommendations");
          recs = (recRes.data?.recommendations ?? recRes.data ?? []) as Recommendation[];
        } catch {
          recs = [];
        }

        const top = recs?.[0];
        let career: CareerDetailsResponse | null = null;
        if (top?.slug) {
          try {
            const cRes = await api.get(`/careers/${encodeURIComponent(top.slug)}`);
            career = cRes.data as CareerDetailsResponse;
          } catch {
            career = null;
          }
        }

        if (!mounted) return;
        setAssessment(assessmentData);
        setRecommendations(recs);
        setTopCareer(career);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load skill gap analysis");
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

  const showAssessmentEmpty = !loading && currentSkills.length === 0;
  const showRecEmpty = !loading && (!recommendations.length || !topCareer);
  const handleExportPdf = useCallback(() => {
    const doc = generateCareerReport({
      selectedCareer: topCareer
        ? {
            title: topCareer.title,
            slug: topCareer.slug,
            description: topCareer.description,
            salaryIndiaMin: topCareer.salaryIndiaMin,
            salaryIndiaMax: topCareer.salaryIndiaMax,
            growthRate: topCareer.growthRate,
            futureDemand: topCareer.futureDemand,
            automationRisk: topCareer.automationRisk,
            requiredSkills: topCareer.requiredSkills,
            dailyWork: topCareer.dailyWork,
          }
        : undefined,
      skillGapSummary: {
        matchPercent,
        strengths,
        missingSkills,
      },
      learningRoadmap: learningPriority.map((lp) => ({
        skill: lp.skill,
        level: lp.level,
      })),
    });
    doc.save("career-guidance-report.pdf");
  }, [topCareer, matchPercent, strengths, missingSkills, learningPriority]);
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Blobs />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Skill Gap Analysis
            </h1>
            <p className="text-slate-500 mt-1">Compare your current skills to a target career and get a learning priority list.</p>
          </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleExportPdf}
            >
              <FileText className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
        </div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <GlassCard key={i} className="p-5" hover={false}>
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                <div className="mt-3 h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
                <div className="mt-6 h-10 bg-slate-100 rounded-xl animate-pulse" />
              </GlassCard>
            ))}
          </div>
        )}

        {!loading && error && (
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Skill gap analysis failed</div>
                <div className="text-sm text-slate-600 mt-1">{error}</div>
              </div>
            </div>
          </GlassCard>
        )}

        {!loading && !error && showAssessmentEmpty && (
          <GlassCard className="p-6" hover={false}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                  <div className="font-bold text-slate-900">No completed assessment found</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">Take the assessment to unlock your personalized skill gap report.</div>
              </div>
              <Button onClick={() => navigate("/assessment")} className="rounded-2xl">
                Start Assessment
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </GlassCard>
        )}

        {!loading && !error && !showAssessmentEmpty && (
          <>
            {showRecEmpty ? (
              <GlassCard className="p-6" hover={false}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                      <div className="font-bold text-slate-900">No recommendations available yet</div>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Complete an assessment to generate a target career.</div>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <SkillGapCard
                      matchPercent={matchPercent}
                      strengths={strengths}
                      missingSkills={missingSkills}
                      targetCareerTitle={topCareer?.title ?? "Target Career"}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <SkillComparison
                      currentSkills={currentSkills}
                      requiredSkills={requiredSkills}
                      missingSkills={missingSkills}
                      strengths={strengths}
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ProgressBars requiredSkills={requiredSkills} currentSkills={currentSkills} />
                  </div>
                  <div>
                    <LearningSuggestions
                      learningPriority={learningPriority}
                      missingSkills={missingSkills}
                      strengths={strengths}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}


