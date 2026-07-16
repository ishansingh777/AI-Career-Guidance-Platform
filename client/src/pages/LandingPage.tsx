import { useEffect, useState } from "react";
import {
  ArrowRight, Brain, ChevronDown, ChevronRight, Compass, Flame, Map, MessageCircle, Play, Rocket, Sparkles, Star, Target, Trophy, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/common/Badge";
import { Blobs } from "../components/common/Blobs";
import { GlassCard } from "../components/common/GlassCard";
import { cn } from "../utils/cn";

const stats = [
  { label: "Students Guided", value: "248K+", icon: Users, color: "text-blue-600" },
  { label: "Career Paths", value: "1,200+", icon: Compass, color: "text-purple-600" },
  { label: "Success Stories", value: "94K+", icon: Trophy, color: "text-emerald-600" },
  { label: "AI Recommendations", value: "3.8M+", icon: Sparkles, color: "text-amber-500" },
];

const features = [
  { icon: Brain, title: "AI-Powered Matching", desc: "Our neural models analyze 40+ career dimensions to match you with paths where you'll genuinely thrive.", color: "from-blue-500 to-blue-700", bg: "bg-blue-50" },
  { icon: Target, title: "Precision Skill Gap", desc: "Radar-mapped analysis shows exactly which skills to acquire and in what order for maximum career velocity.", color: "from-purple-500 to-purple-700", bg: "bg-purple-50" },
  { icon: Map, title: "Dynamic Roadmaps", desc: "Personalized journey maps that adapt to your progress, learning pace, and market demand in real time.", color: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50" },
  { icon: MessageCircle, title: "24/7 AI Mentor", desc: "An intelligent career advisor that knows your profile, goals, and progress — always available, always personal.", color: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
];

const testimonials = [
  { name: "Aria Chen", role: "UX Designer @ Google", avatar: "AC", quote: "PathAI showed me a career path I never considered. Within 8 months I landed my dream role.", stars: 5, color: "from-blue-400 to-blue-600" },
  { name: "Marcus Rivera", role: "ML Engineer @ OpenAI", avatar: "MR", quote: "The skill gap analysis was surgical. I knew exactly what to learn and when. Absolutely worth it.", stars: 5, color: "from-purple-400 to-purple-600" },
  { name: "Priya Nair", role: "Product Manager @ Stripe", avatar: "PN", quote: "The AI mentor felt like having a senior PM coaching me every single day. Game changing.", stars: 5, color: "from-emerald-400 to-emerald-600" },
];

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 pt-16">
        <Blobs />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Powered by Advanced AI
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Discover Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg">
              AI that understands your strengths, passions, and potential — then maps the fastest route to your dream career.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/assessment")}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105">
                Discover Your Career
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate("/assessment")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300">
                <Play className="w-5 h-5" /> Free Assessment
              </button>
            </div>
            {/* Live stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map(s => (
                <div key={s.label} className="text-center p-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                  <div className={cn("text-2xl font-extrabold", s.color)} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                  <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="relative hidden lg:block h-[520px]">
            <div className="absolute top-8 left-8 w-64 animate-bounce" style={{ animationDuration: "4s" }}>
              <GlassCard className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">AI Analysis Complete</div>
                    <div className="text-xs text-slate-500">87% match found</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">UX Designer</span>
                  <span className="font-bold text-emerald-600">$124K/yr</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-[87%]" />
                </div>
              </GlassCard>
            </div>
            <div className="absolute top-32 right-0 w-56 animate-bounce" style={{ animationDuration: "5s", animationDelay: "1s" }}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-slate-800">Achievement!</span>
                </div>
                <p className="text-xs text-slate-500">Completed Skill Assessment</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
              </GlassCard>
            </div>
            <div className="absolute bottom-16 left-16 w-72 animate-bounce" style={{ animationDuration: "6s", animationDelay: "0.5s" }}>
              <GlassCard className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">Career Readiness</span>
                  <span className="text-sm font-bold text-blue-600">76%</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Python", "React", "ML", "Design", "SQL", "AWS"].map(s => (
                    <span key={s} className="px-2 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 font-medium text-center">{s}</span>
                  ))}
                </div>
              </GlassCard>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "2s" }}>
              <GlassCard className="p-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-extrabold text-slate-800">42 Days</div>
                <div className="text-xs text-slate-500">Learning Streak</div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs animate-bounce">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
        <Blobs />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Badge color="blue"><Sparkles className="w-3 h-3" /> Features</Badge>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">launch your career</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Built for the next generation of professionals who want more than just job listings.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <GlassCard key={f.title} className="p-6 space-y-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", f.bg)}>
                  <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center", f.color)}>
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge color="purple"><Star className="w-3 h-3" /> Stories</Badge>
          <h2 className="text-4xl font-extrabold text-white mt-4 mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Real people, real careers
          </h2>
          <div className="relative">
            {testimonials.map((t, i) => (
              <div key={t.name} className={cn("transition-all duration-500", i === activeTestimonial ? "opacity-100" : "opacity-0 absolute inset-0")}>
                <GlassCard className="p-8 text-left max-w-2xl mx-auto">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br text-white font-bold text-sm flex items-center justify-center", t.color)}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{t.name}</div>
                      <div className="text-sm text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={cn("rounded-full transition-all duration-300", i === activeTestimonial ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40")} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
        <Blobs />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/40">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your career starts{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">today</span>
          </h2>
          <p className="text-slate-500 text-lg mb-10">Join 248,000+ students who already discovered their calling with PathAI.</p>
          <button onClick={() => navigate("/assessment")}
            className="group flex items-center gap-3 mx-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all duration-300">
            Start Free Assessment
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Assessment ───────────────────────────────────────────────────────────────

