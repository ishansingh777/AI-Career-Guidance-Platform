import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { GlassCard } from "../common/GlassCard";

export function EmptyRecommendations() {
  const navigate = useNavigate();

  return (
    <GlassCard className="p-10" hover={false}>
      <div className="text-center space-y-4">
        <div className="text-4xl">🗂️</div>
        <div className="text-lg font-extrabold text-slate-900">No recommendations yet</div>
        <div className="text-sm text-slate-600">Take the assessment to unlock your personalized top career matches.</div>
        <Button
          onClick={() => navigate("/assessment")}
          className="rounded-2xl px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200"
        >
          Take Assessment
        </Button>
      </div>
    </GlassCard>
  );
}

