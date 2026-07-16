import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, CheckCircle, MessageSquare, Sparkles, Target } from "lucide-react";

import { Badge } from "../components/common/Badge";
import { GlassCard } from "../components/common/GlassCard";
import { ProgressRing } from "../components/common/ProgressRing";
import { Button } from "../components/ui/button";
import { cn } from "../utils/cn";
import { getSavedCareers } from "../utils/savedCareers";
import api from "../services/axios";
import type { Recommendation } from "../types/recommendation";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [chatCount, setChatCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const savedCareers = useMemo(() => getSavedCareers(), [loading]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Fetch recommendations
        try {
          const recRes = await api.get("/recommendations");
          const recs = (recRes.data?.recommendations ?? recRes.data ?? []) as Recommendation[];
          if (mounted) setRecommendations(Array.isArray(recs) ? recs : []);
        } catch {
          // ignore
        }

        // Fetch assessment
        try {
          const asmRes = await api.get("/assessments/me");
          if (mounted) setAssessmentData(asmRes.data ?? null);
        } catch {
          // ignore
        }

        // Fetch chat count (best-effort)
        try {
          const chatRes = await api.get("/chat/history");
          const msgs = chatRes.data?.messages ?? chatRes.data ?? [];
          if (mounted) setChatCount(Array.isArray(msgs) ? msgs.length : 0);
        } catch {
          // ignore
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);
  const topCareer = recommendations.length > 0 ? recommendations[0] : null;
  const assessmentDate = assessmentData?.createdAt ?? assessmentData?.completedAt ?? null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <GlassCard className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6" hover={false}>
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-blue-500/30">
              U
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Profile</h1>
            <p className="text-slate-500">Career Explorer</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge color="blue">🎯 Career Seeker</Badge>
              <Badge color="purple">🧠 Lifelong Learner</Badge>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Saved Careers */}
          <GlassCard className="p-6 space-y-3" hover={false}>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Saved Careers</h3>
            </div>
            {savedCareers.length > 0 ? (
              <>
                <div className="text-3xl font-extrabold text-blue-600">{savedCareers.length}</div>
                <div className="text-sm text-slate-500">Careers saved for later</div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => navigate("/saved-careers")}
                  >
                    View All
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 py-4">
                No saved careers yet. Browse recommendations and save the ones you like!
              </div>
            )}
          </GlassCard>

          {/* Recent Recommendations */}
          <GlassCard className="p-6 space-y-3" hover={false}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Recommendations</h3>
            </div>
            {topCareer ? (
              <>
                <div className="text-sm font-semibold text-slate-800">{topCareer.title}</div>
                <div className="text-sm text-slate-500">Top match · {Math.round(topCareer.score)}% fit</div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => navigate("/dashboard")}
                  >
                    View All Recommendations
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 py-4">
                No recommendations yet. Complete an assessment to get started!
              </div>
            )}
          </GlassCard>

          {/* Recent AI Chats */}
          <GlassCard className="p-6 space-y-3" hover={false}>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent AI Chats</h3>
            </div>
            {chatCount > 0 ? (
              <>
                <div className="text-3xl font-extrabold text-emerald-600">{chatCount}</div>
                <div className="text-sm text-slate-500">Messages exchanged with AI Mentor</div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => navigate("/ai-chat")}
                  >
                    Open AI Chat
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 py-4">
                No AI chats yet. Ask your AI Mentor anything about your career!
              </div>
            )}
          </GlassCard>

          {/* Latest Assessment Summary */}
          <GlassCard className="p-6 space-y-3" hover={false}>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Latest Assessment</h3>
            </div>
            {assessmentData ? (
              <>
                {assessmentDate && (
                  <div className="text-sm text-slate-500">
                    Completed: {new Date(assessmentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
                {topCareer && (
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    Top recommendation: {topCareer.title}
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => navigate("/assessment")}
                  >
                    Retake Assessment
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 py-4">
                No assessment completed yet. Take the assessment to discover your ideal career path!
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
