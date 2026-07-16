import { useNavigate } from "react-router-dom";
import { Blobs } from "../components/common/Blobs";
import { GlassCard } from "../components/common/GlassCard";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center relative overflow-hidden">
      <Blobs />
      <div className="relative z-10 text-center px-6">
        <div className="text-9xl font-extrabold mb-4">404</div>
        <h1 className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Page Not Found
        </h1>
        <p className="text-white/60 text-lg mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
