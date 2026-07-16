import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, FileText } from "lucide-react";

import api from "../services/axios";
import type { CareerDetailsResponse } from "../types/career";

import { Blobs } from "../components/common/Blobs";
import { Badge } from "../components/common/Badge";
import { GlassCard } from "../components/common/GlassCard";
import { Button } from "../components/ui/button";

import { CareerHero } from "../components/career/CareerHero";
import { CareerOverview } from "../components/career/CareerOverview";
import { SkillsSection } from "../components/career/SkillsSection";
import { SalarySection } from "../components/career/SalarySection";
import { RoadmapSection } from "../components/career/RoadmapSection";
import { ResourcesSection } from "../components/career/ResourcesSection";
import { RelatedCareers } from "../components/career/RelatedCareers";
import { CareerCharts } from "../components/career/CareerCharts";

import { isCareerSaved, toggleCareer } from "../utils/savedCareers";
import { generateCareerReport } from "../utils/pdf/generateCareerReport";

export default function CareerDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [career, setCareer] = useState<CareerDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      if (!slug) {
        if (!mounted) return;
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/careers/${encodeURIComponent(slug)}`);
        if (!mounted) return;
        setCareer(res.data);
      } catch (e: any) {
        if (!mounted) return;
        const status = e?.response?.status;
        if (status === 404) {
          setNotFound(true);
        } else {
          setError(e?.response?.data?.error || e?.message || "Failed to load career details");
        }
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const matchScore = useMemo(() => {
    // Backend does not provide match score. Keep UI safe.
    return null;
  }, []);

  const handleExportPdf = useCallback(() => {
    const doc = generateCareerReport({
      selectedCareer: career
        ? {
            title: career.title,
            slug: career.slug,
            description: career.description,
            salaryIndiaMin: career.salaryIndiaMin,
            salaryIndiaMax: career.salaryIndiaMax,
            growthRate: career.growthRate,
            futureDemand: career.futureDemand,
            automationRisk: career.automationRisk,
            requiredSkills: career.requiredSkills,
            dailyWork: career.dailyWork,
          }
        : undefined,
    });
    doc.save("career-guidance-report.pdf");
  }, [career]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
        <Blobs />
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard className="p-6" hover={false}>
            <div className="h-6 bg-slate-100 rounded w-56 animate-pulse" />
            <div className="mt-4 h-4 bg-slate-100 rounded w-72 animate-pulse" />
          </GlassCard>
        </div>
      </div>
    );
  }

  if (notFound || !career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center relative overflow-hidden">
        <Blobs />
        <div className="relative z-10 text-center px-6">
          <div className="text-9xl font-extrabold mb-4 text-white">404</div>
          <h1 className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Career not found
          </h1>
          <p className="text-white/60 text-lg mb-8">The career slug you requested doesn’t exist.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
        <Blobs />
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Could not load career details</div>
                <div className="text-sm text-slate-600 mt-1">{error}</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Blobs />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CareerHero career={career} matchScore={matchScore} />
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={() =>
                toggleCareer({
                  slug: career.slug,
                  title: career.title,
                  image: career.image,
                  salaryIndiaMin: career.salaryIndiaMin ?? undefined,
                  salaryIndiaMax: career.salaryIndiaMax ?? undefined,
                  futureDemand: career.futureDemand,
                  growthRate: career.growthRate,
                  automationRisk: career.automationRisk,
                  requiredSkills: career.requiredSkills,
                  dailyWork: career.dailyWork,
                })
              }
            >
              {isCareerSaved(career.slug) ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl"
              onClick={handleExportPdf}
            >
              <FileText className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>


        <CareerOverview career={career} />
        <SkillsSection career={career} />
        <SalarySection career={career} />
        <RoadmapSection career={career} />
        <ResourcesSection career={career} />
        <RelatedCareers careers={career.relatedCareers} onNavigate={(s: string) => navigate(`/career/${s}`)} />
        <CareerCharts career={career} />

        {/* quick back */}
        <div className="pt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

