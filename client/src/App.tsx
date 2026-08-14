import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import AssessmentPage from "./pages/Assessment";
import CareerDetailsPage from "./pages/CareerDetails";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import SkillGapPage from "./pages/SkillGap";
import CompareCareers from "./pages/CompareCareers";
import SavedCareersPage from "./pages/SavedCareers";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { Navbar } from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

import CareersPage from "./pages/CareersPage";
import AIMentor from "./pages/AIMentor";
import Roadmap from "./pages/Roadmap";

function FloatingMentor() {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/mentor") return null;
  return (
    <button onClick={() => navigate("/mentor")}
      className="fixed bottom-8 right-8 z-40 group w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 transition-all duration-300">
      <Brain className="w-6 h-6 text-white" />
      <div className="absolute -top-10 right-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        AI Mentor
      </div>
      <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
    </button>
  );
}

function AppShell() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar scrolled={scrolled} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/career-detail/:slug" element={<CareerDetailsPage />} />
        <Route path="/mentor" element={<AIMentor />} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><CompareCareers /></ProtectedRoute>} />

        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/saved-careers" element={<ProtectedRoute><SavedCareersPage /></ProtectedRoute>} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingMentor />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
