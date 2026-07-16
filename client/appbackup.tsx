import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Brain, Target, TrendingUp, Award, BookOpen, Users, Star,
  ChevronRight, ArrowRight, Play, MessageCircle, X, Send, Mic, ThumbsUp,
  BarChart2, Map, Settings, Bell, Search, Home, Compass, User, Zap,
  Shield, Code, Palette, LineChart, Globe, Heart, Coffee, Moon, Sun,
  CheckCircle, Lock, Unlock, Trophy, Flame, Calendar, Clock, ChevronDown,
  ChevronLeft, LayoutDashboard, GraduationCap, Briefcase, DollarSign,
  Activity, PieChart, Layers, Plus, Minus, MoreHorizontal, ExternalLink,
  Download, Share2, Filter, Menu, Lightbulb, Rocket
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart as ReLineChart, Line
} from "recharts";

type View = "landing" | "assessment" | "dashboard" | "careers" | "career-detail" | "mentor" | "skill-gap" | "roadmap" | "profile";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function cn(...cls: (string | false | undefined | null)[]) {
  return cls.filter(Boolean).join(" ");
}

function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg shadow-blue-500/5",
      hover && "transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5",
      className
    )}>
      {children}
    </div>
  );
}

function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "purple" | "green" | "amber" | "red" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border", colors[color])}>
      {children}
    </span>
  );
}

function ProgressRing({ value, size = 80, stroke = 6, color = "#2563EB", bg = "#E2E8F0" }: {
  value: number; size?: number; stroke?: number; color?: string; bg?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

// ─── Floating Blobs ───────────────────────────────────────────────────────────

function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-emerald-400/15 blur-[90px] animate-pulse" style={{ animationDelay: "2s" }} />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ view, setView, scrolled }: { view: View; setView: (v: View) => void; scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems: { label: string; v: View }[] = [
    { label: "Dashboard", v: "dashboard" },
    { label: "Careers", v: "careers" },
    { label: "Skill Gap", v: "skill-gap" },
    { label: "Roadmap", v: "roadmap" },
    { label: "AI Mentor", v: "mentor" },
  ];
  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500",
      scrolled
        ? "bg-white/80 backdrop-blur-2xl shadow-md shadow-blue-500/10 border-b border-white/60"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PathAI</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(n => (
            <button key={n.v} onClick={() => setView(n.v)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                view === n.v
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              )}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>
          <button onClick={() => setView("profile")} className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/30">
            A
          </button>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/60 px-6 py-4 flex flex-col gap-2">
          {navItems.map(n => (
            <button key={n.v} onClick={() => { setView(n.v); setMenuOpen(false); }}
              className={cn("px-4 py-2.5 rounded-xl text-sm font-medium text-left",
                view === n.v ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50"
              )}>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

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

function LandingPage({ setView }: { setView: (v: View) => void }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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
              <button onClick={() => setView("assessment")}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105">
                Discover Your Career
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setView("assessment")}
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
          <button onClick={() => setView("assessment")}
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

const questions = [
  {
    id: 1, type: "cards",
    question: "What energizes you most?",
    emoji: "⚡",
    options: [
      { label: "Solving complex problems", icon: "🧩", desc: "Analytical thinking" },
      { label: "Creating beautiful things", icon: "🎨", desc: "Creative expression" },
      { label: "Helping people", icon: "🤝", desc: "Human connection" },
      { label: "Building systems", icon: "⚙️", desc: "Engineering mindset" },
    ]
  },
  {
    id: 2, type: "slider",
    question: "How comfortable are you with technology?",
    emoji: "💻",
    min: 0, max: 100,
  },
  {
    id: 3, type: "chips",
    question: "Which domains excite you?",
    emoji: "🌟",
    options: ["AI & Machine Learning", "Product Design", "Data Science", "Marketing", "Finance", "Healthcare", "Gaming", "Education", "Climate Tech", "Web Dev", "Mobile Apps", "Cybersecurity"],
  },
  {
    id: 4, type: "personality",
    question: "Which best describes your work style?",
    emoji: "🎯",
    options: [
      { label: "The Architect", desc: "I love designing systems and thinking long-term", color: "from-blue-500 to-blue-700", emoji: "🏗️" },
      { label: "The Creator", desc: "I thrive when building something from nothing", color: "from-purple-500 to-purple-700", emoji: "🎨" },
      { label: "The Analyst", desc: "I make decisions based on data and evidence", color: "from-emerald-500 to-emerald-700", emoji: "📊" },
      { label: "The Leader", desc: "I motivate teams and drive outcomes", color: "from-amber-500 to-orange-600", emoji: "🚀" },
    ]
  },
];

function AssessmentPage({ setView }: { setView: (v: View) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});
  const [sliderVal, setSliderVal] = useState(50);
  const [chips, setChips] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  function next() {
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }

  function toggleChip(c: string) {
    setChips(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center relative overflow-hidden pt-16">
        <Blobs />
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                  backgroundColor: ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 5)],
                  animationDuration: `${Math.random() * 2 + 1}s`, animationDelay: `${Math.random() * 2}s`
                }} />
            ))}
          </div>
        )}
        <div className="text-center relative z-10 px-6">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Analysis Complete!
          </h2>
          <p className="text-white/70 text-lg mb-8">Your personalized career map is ready.</p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
            {[{ label: "Career Matches", val: "24" }, { label: "Match Score", val: "94%" }, { label: "Skills Mapped", val: "38" }].map(s => (
              <GlassCard key={s.label} className="p-4 text-center" hover={false}>
                <div className="text-2xl font-extrabold text-blue-600">{s.val}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </GlassCard>
            ))}
          </div>
          <button onClick={() => setView("dashboard")}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all duration-300">
            View My Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center relative overflow-hidden pt-16">
      <Blobs />
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16">
        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <ProgressRing value={progress} size={56} stroke={4} color="#60A5FA" bg="rgba(255,255,255,0.1)" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{step + 1}/{questions.length}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-white/50 text-xs mb-1.5">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <GlassCard className="p-8 space-y-8" hover={false}>
          <div className="text-center">
            <div className="text-5xl mb-4">{q.emoji}</div>
            <h2 className="text-2xl font-extrabold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{q.question}</h2>
          </div>

          {q.type === "cards" && (
            <div className="grid grid-cols-2 gap-3">
              {q.options?.map((opt: { label: string; icon: string; desc: string }) => (
                <button key={opt.label} onClick={() => { setAnswers(a => ({ ...a, [q.id]: opt.label })); }}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-105",
                    answers[q.id] === opt.label
                      ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                      : "border-slate-200 hover:border-blue-300 bg-white/50"
                  )}>
                  <div className="text-2xl mb-2">{opt.icon}</div>
                  <div className="font-bold text-slate-800 text-sm">{opt.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          )}

          {q.type === "slider" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-blue-600 mb-1">{sliderVal}%</div>
                <div className="text-slate-500 text-sm">
                  {sliderVal < 30 ? "Just starting out" : sliderVal < 60 ? "Comfortable user" : sliderVal < 80 ? "Power user" : "Tech expert"}
                </div>
              </div>
              <input type="range" min={0} max={100} value={sliderVal}
                onChange={e => { setSliderVal(Number(e.target.value)); setAnswers(a => ({ ...a, [q.id]: Number(e.target.value) })); }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #2563EB ${sliderVal}%, #E2E8F0 ${sliderVal}%)` }} />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Beginner</span><span>Advanced</span>
              </div>
            </div>
          )}

          {q.type === "chips" && (
            <div className="flex flex-wrap gap-2">
              {q.options?.map((opt: string) => (
                <button key={opt} onClick={() => toggleChip(opt)}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200",
                    chips.includes(opt)
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                  )}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.type === "personality" && (
            <div className="space-y-3">
              {q.options?.map((opt: { label: string; desc: string; color: string; emoji: string }) => (
                <button key={opt.label} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.label }))}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-200",
                    answers[q.id] === opt.label ? "border-blue-500 bg-blue-50 shadow-md" : "border-slate-200 hover:border-blue-300 bg-white/50"
                  )}>
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0", opt.color)}>
                    {opt.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{opt.label}</div>
                    <div className="text-sm text-slate-500">{opt.desc}</div>
                  </div>
                  {answers[q.id] === opt.label && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-blue-300 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button onClick={next}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200">
              {step === questions.length - 1 ? "Complete!" : "Next"} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const salaryData = [
  { month: "Jan", ux: 95, ml: 130, pm: 110 },
  { month: "Feb", ux: 98, ml: 135, pm: 112 },
  { month: "Mar", ux: 102, ml: 142, pm: 115 },
  { month: "Apr", ux: 105, ml: 148, pm: 118 },
  { month: "May", ux: 108, ml: 155, pm: 122 },
  { month: "Jun", ux: 112, ml: 162, pm: 126 },
];

const activityData = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 4 }, { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 3.5 }, { day: "Fri", hours: 5 }, { day: "Sat", hours: 2 }, { day: "Sun", hours: 3 },
];

const insightCards = [
  { icon: TrendingUp, title: "Career Velocity", val: "+24%", sub: "faster than peers", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Zap, title: "Skill Momentum", val: "8 Skills", sub: "acquired this month", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Target, title: "Goal Progress", val: "73%", sub: "toward Q3 target", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Award, title: "XP Earned", val: "2,480", sub: "of 3,000 for Level 12", color: "text-amber-600", bg: "bg-amber-50" },
];

const goals = [
  { label: "Complete React Advanced", done: true }, { label: "Take SQL Certification", done: true },
  { label: "Apply to 5 companies", done: false }, { label: "Build portfolio project", done: false },
];

function Dashboard({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Good morning, Alex! 👋
            </h1>
            <p className="text-slate-500 mt-1">You have 3 tasks due today and 2 new career matches.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/30">
            <Flame className="w-5 h-5" />
            <span className="font-bold">42 Day Streak</span>
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insightCards.map(c => (
            <GlassCard key={c.title} className="p-5 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", c.bg)}>
                <c.icon className={cn("w-6 h-6", c.color)} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">{c.val}</div>
                <div className="text-sm text-slate-500">{c.sub}</div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">{c.title}</div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Career Match Score */}
          <GlassCard className="p-6 flex flex-col items-center text-center" hover={false}>
            <div className="relative mb-4">
              <ProgressRing value={94} size={120} stroke={10} color="#2563EB" bg="#EFF2F7" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-extrabold text-blue-600">94%</div>
                <div className="text-xs text-slate-400">Match</div>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Career Match Score</h3>
            <p className="text-slate-500 text-sm mt-1">Top career: UX Designer</p>
            <button onClick={() => setView("careers")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors">
              View All Matches
            </button>
          </GlassCard>

          {/* Salary Chart */}
          <GlassCard className="p-6 lg:col-span-2" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Salary Trends</h3>
                <p className="text-sm text-slate-500">Your top 3 career matches (K/yr)</p>
              </div>
              <div className="flex gap-3 text-xs">
                {[{ label: "UX", color: "bg-blue-500" }, { label: "ML", color: "bg-purple-500" }, { label: "PM", color: "bg-emerald-500" }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full", l.color)} />
                    <span className="text-slate-600">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={salaryData}>
                <defs>
                  {[["ux", "#2563EB"], ["ml", "#7C3AED"], ["pm", "#10B981"]].map(([k, c]) => (
                    <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="ux" stroke="#2563EB" strokeWidth={2} fill="url(#grad-ux)" />
                <Area type="monotone" dataKey="ml" stroke="#7C3AED" strokeWidth={2} fill="url(#grad-ml)" />
                <Area type="monotone" dataKey="pm" stroke="#10B981" strokeWidth={2} fill="url(#grad-pm)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Goals */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Weekly Goals</h3>
              <Badge color="blue">2/4</Badge>
            </div>
            <div className="space-y-3">
              {goals.map(g => (
                <div key={g.label} className="flex items-center gap-3">
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    g.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                  )}>
                    {g.done && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                  </div>
                  <span className={cn("text-sm", g.done ? "line-through text-slate-400" : "text-slate-700")}>{g.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Activity */}
          <GlassCard className="p-6 lg:col-span-2" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>This Week's Activity</h3>
              <span className="text-sm text-slate-500">21.5 hrs total</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={activityData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="hours" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Achievements */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "First Step", emoji: "👣", unlocked: true },
              { label: "Streak Master", emoji: "🔥", unlocked: true },
              { label: "Skill Builder", emoji: "⚡", unlocked: true },
              { label: "Top Learner", emoji: "🎓", unlocked: true },
              { label: "AI Native", emoji: "🤖", unlocked: false },
              { label: "Career Ready", emoji: "💼", unlocked: false },
              { label: "Network Pro", emoji: "🌐", unlocked: false },
              { label: "Goal Crusher", emoji: "🎯", unlocked: false },
            ].map(a => (
              <div key={a.label} className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 w-20 transition-all duration-200",
                a.unlocked ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50 opacity-50 grayscale"
              )}>
                <div className="text-2xl">{a.emoji}</div>
                <div className="text-xs font-medium text-slate-600 text-center leading-tight">{a.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Career Cards ─────────────────────────────────────────────────────────────

const careerData = [
  {
    title: "UX Designer", match: 94, salary: "$112K", growth: "+18%", difficulty: "Medium",
    confidence: 96, skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    color: "from-blue-500 to-blue-700", emoji: "🎨", tag: "blue",
    desc: "Craft intuitive, beautiful digital experiences that millions of people use every day.",
    companies: ["Google", "Apple", "Airbnb", "Figma"],
  },
  {
    title: "ML Engineer", match: 89, salary: "$158K", growth: "+35%", difficulty: "Hard",
    confidence: 88, skills: ["Python", "TensorFlow", "MLOps", "Statistics"],
    color: "from-purple-500 to-purple-700", emoji: "🤖", tag: "purple",
    desc: "Build the AI systems that power the next generation of intelligent products.",
    companies: ["OpenAI", "DeepMind", "Tesla", "Meta"],
  },
  {
    title: "Product Manager", match: 85, salary: "$126K", growth: "+22%", difficulty: "Medium",
    confidence: 91, skills: ["Strategy", "Analytics", "Roadmapping", "Stakeholder Mgmt"],
    color: "from-emerald-500 to-emerald-700", emoji: "📋", tag: "green",
    desc: "Orchestrate the vision, strategy, and execution of world-class products.",
    companies: ["Stripe", "Linear", "Notion", "Figma"],
  },
  {
    title: "Data Scientist", match: 82, salary: "$134K", growth: "+28%", difficulty: "Hard",
    confidence: 85, skills: ["Python", "SQL", "ML", "Data Viz"],
    color: "from-amber-500 to-orange-600", emoji: "📊", tag: "amber",
    desc: "Turn raw data into insights that shape business decisions and strategy.",
    companies: ["Netflix", "Spotify", "Uber", "Airbnb"],
  },
  {
    title: "Full Stack Developer", match: 80, salary: "$118K", growth: "+20%", difficulty: "Medium",
    confidence: 87, skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    color: "from-cyan-500 to-blue-600", emoji: "💻", tag: "blue",
    desc: "Build end-to-end web applications that serve millions of users.",
    companies: ["GitHub", "Vercel", "Cloudflare", "Shopify"],
  },
  {
    title: "Cybersecurity Analyst", match: 76, salary: "$109K", growth: "+32%", difficulty: "Hard",
    confidence: 80, skills: ["Network Security", "SIEM", "Penetration Testing", "Cloud Security"],
    color: "from-red-500 to-rose-700", emoji: "🛡️", tag: "red",
    desc: "Defend organizations against increasingly sophisticated cyber threats.",
    companies: ["CrowdStrike", "Palo Alto", "Google", "Microsoft"],
  },
];

function CareerCard({ career, onClick }: { career: typeof careerData[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const tagColors: Record<string, string> = { blue: "blue", purple: "purple", green: "green", amber: "amber", red: "red" };
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="group rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 overflow-hidden cursor-pointer"
      style={{ transform: hovered ? "perspective(1000px) rotateX(-2deg) rotateY(1deg) translateY(-4px)" : "none" }}
      onClick={onClick}>
      <div className={cn("h-32 bg-gradient-to-br flex items-center justify-center text-6xl relative", career.color)}>
        {career.emoji}
        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold">
            {career.match}% Match
          </div>
        </div>
        {hovered && <div className="absolute inset-0 bg-white/10 backdrop-blur-sm transition-all duration-300" />}
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{career.title}</h3>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">{career.desc}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <div className="font-bold text-slate-800 text-sm">{career.salary}</div>
            <div className="text-xs text-slate-400">Avg Salary</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <div className="font-bold text-emerald-600 text-sm">{career.growth}</div>
            <div className="text-xs text-slate-400">Growth</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <div className="font-bold text-slate-800 text-sm">{career.difficulty}</div>
            <div className="text-xs text-slate-400">Entry</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {career.skills.slice(0, 3).map(s => (
            <Badge key={s} color={tagColors[career.tag] as "blue" | "purple" | "green" | "amber" | "red"}>{s}</Badge>
          ))}
          {career.skills.length > 3 && <Badge color="blue">+{career.skills.length - 3}</Badge>}
        </div>
        <button className={cn("w-full py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r transition-all duration-200 group-hover:shadow-lg", career.color)}>
          Explore Career →
        </button>
      </div>
    </div>
  );
}

function CareersPage({ setView }: { setView: (v: View) => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "High Match", "High Salary", "Fast Growth"];
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Career Matches</h1>
            <p className="text-slate-500 mt-1">24 careers matched to your profile — sorted by AI confidence</p>
          </div>
          <div className="flex gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  filter === f ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                )}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerData.map(c => (
            <CareerCard key={c.title} career={c} onClick={() => setView("career-detail")} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Career Detail ────────────────────────────────────────────────────────────

const demandData = [
  { year: "2022", demand: 65 }, { year: "2023", demand: 72 }, { year: "2024", demand: 81 },
  { year: "2025", demand: 89 }, { year: "2026", demand: 96 }, { year: "2027", demand: 105 },
];

function CareerDetail({ setView }: { setView: (v: View) => void }) {
  const career = careerData[0];
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "roadmap", "companies", "courses"];

  const roadmapSteps = [
    { label: "Foundations", desc: "HTML, CSS, design principles", done: true, time: "2 months" },
    { label: "Tools Mastery", desc: "Figma, Sketch, prototyping tools", done: true, time: "3 months" },
    { label: "UX Research", desc: "User interviews, usability testing", done: false, time: "2 months" },
    { label: "Portfolio Projects", desc: "3 case studies from real problems", done: false, time: "2 months" },
    { label: "Job Readiness", desc: "Resume, interviews, networking", done: false, time: "1 month" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero banner */}
      <div className={cn("relative h-64 bg-gradient-to-br flex items-center px-8 overflow-hidden", career.color)}>
        <Blobs />
        <button onClick={() => setView("careers")} className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Careers
        </button>
        <div className="relative z-10 text-white">
          <div className="text-7xl mb-3">{career.emoji}</div>
          <h1 className="text-4xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{career.title}</h1>
          <div className="flex gap-3 mt-3 flex-wrap">
            <Badge color="blue">{career.match}% AI Match</Badge>
            <span className="text-white/80 text-sm">{career.salary}/yr avg</span>
            <span className="text-white/80 text-sm">{career.growth} job growth</span>
          </div>
        </div>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex gap-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("py-4 text-sm font-semibold capitalize border-b-2 transition-all",
                tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {tab === "overview" && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6 space-y-4" hover={false}>
                <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Future Demand</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={demandData}>
                    <defs>
                      <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                    <Area type="monotone" dataKey="demand" stroke="#2563EB" strokeWidth={2} fill="url(#demandGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
              <GlassCard className="p-6 space-y-4" hover={false}>
                <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Day in the Life</h3>
                <div className="space-y-3">
                  {[
                    { time: "9:00 AM", task: "User research synthesis", icon: "🔍" },
                    { time: "11:00 AM", task: "Design critique & iteration", icon: "✏️" },
                    { time: "1:00 PM", task: "Stakeholder presentation", icon: "📊" },
                    { time: "3:00 PM", task: "Prototype building in Figma", icon: "🎨" },
                    { time: "5:00 PM", task: "Usability testing session", icon: "👥" },
                  ].map(d => (
                    <div key={d.time} className="flex items-center gap-3">
                      <span className="text-lg w-8">{d.icon}</span>
                      <span className="text-xs text-slate-400 w-16 shrink-0">{d.time}</span>
                      <span className="text-sm text-slate-700">{d.task}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
            <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Required Skills</h3>
              <div className="space-y-3">
                {[
                  { skill: "Figma / Design Tools", level: 90 }, { skill: "User Research", level: 85 },
                  { skill: "Prototyping", level: 80 }, { skill: "Design Systems", level: 75 }, { skill: "Visual Design", level: 88 },
                ].map(s => (
                  <div key={s.skill} className="flex items-center gap-4">
                    <span className="text-sm text-slate-700 w-40 shrink-0">{s.skill}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${s.level}%` }} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 w-8">{s.level}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {tab === "roadmap" && (
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-bold text-slate-800 text-lg mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Learning Roadmap</h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
              <div className="space-y-8">
                {roadmapSteps.map((s, i) => (
                  <div key={s.label} className="flex gap-6 pl-14 relative">
                    <div className={cn("absolute left-4 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      s.done ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
                    )}>
                      {s.done && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800">{s.label}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">{s.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge color={s.done ? "green" : "blue"}>{s.done ? "✓ Done" : s.time}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {tab === "companies" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {["Google", "Apple", "Airbnb", "Figma", "Notion", "Linear", "Stripe", "Vercel"].map(c => (
              <GlassCard key={c} className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {c[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{c}</div>
                    <div className="text-xs text-slate-500">Active hiring</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                  View Jobs
                </button>
              </GlassCard>
            ))}
          </div>
        )}

        {tab === "courses" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "UX Design Fundamentals", provider: "Google", duration: "6 weeks", rating: 4.9, students: "124K" },
              { title: "Advanced Figma", provider: "Figma", duration: "4 weeks", rating: 4.8, students: "89K" },
              { title: "User Research Methods", provider: "IDEO", duration: "5 weeks", rating: 4.7, students: "62K" },
              { title: "Design Systems at Scale", provider: "Airbnb", duration: "3 weeks", rating: 4.9, students: "41K" },
            ].map(c => (
              <GlassCard key={c.title} className="p-5 space-y-3">
                <div className="flex justify-between">
                  <Badge color="blue">{c.provider}</Badge>
                  <span className="text-xs text-slate-500">{c.duration}</span>
                </div>
                <h4 className="font-bold text-slate-800">{c.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-700">{c.rating}</span>
                    <span className="text-xs text-slate-400">({c.students})</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                    Enroll
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Mentor ────────────────────────────────────────────────────────────────

const suggestedPrompts = [
  "What skills should I focus on next?",
  "Show me my career roadmap",
  "How do I prepare for UX interviews?",
  "What's trending in my field?",
];

type Msg = { role: "user" | "ai"; text: string; time: string };

const fakeReplies: Record<string, string> = {
  "What skills should I focus on next?": "Based on your profile, I recommend focusing on **User Research** next — it's your biggest skill gap for UX roles and appears in 94% of job descriptions for your target companies. After that, dive into **Design Systems** to differentiate yourself.\n\n*Want me to build a 30-day study plan?*",
  "Show me my career roadmap": "Here's your personalized roadmap:\n\n1. ✅ Design Foundations — Done!\n2. ✅ Figma Mastery — Done!\n3. 🔄 User Research (in progress, ~3 weeks left)\n4. 📋 Portfolio Projects — starts next month\n5. 🎯 Job Applications — target: March 2025\n\nYou're on track to be job-ready in **14 weeks**! 🚀",
  "How do I prepare for UX interviews?": "Great question! Here's the UX interview playbook:\n\n**Portfolio review:** Have 3 case studies with clear problem → research → solution → impact structure.\n\n**Common questions:** 'Tell me about a design decision you disagreed with' and 'How do you handle feedback?'\n\n**Tools to know:** Figma, FigJam, UserTesting, Maze.\n\nWant me to do a mock interview with you?",
};

function AIMentor() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hey Alex! 👋 I'm your AI career mentor. I know your profile, goals, and progress — ask me anything about your career journey!", time: "Now" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(text: string = input) {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text, time: "Now" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = fakeReplies[text] ?? "That's a great question! Based on your profile data and current market trends, I'd recommend starting with the foundational concepts, then building practical projects to demonstrate your skills. Want me to create a specific learning plan for this?";
      setMessages(m => [...m, { role: "ai", text: reply, time: "Now" }]);
      setTyping(false);
    }, 1200);
  }

  function renderText(text: string) {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
      return <p key={i} className={line.startsWith("#") ? "font-bold" : ""} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-4">
        {/* Header */}
        <div className="py-6 flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>PathAI Mentor</h2>
            <p className="text-sm text-emerald-600 font-medium">Online · Knows your full profile</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4 min-h-[400px] max-h-[55vh]">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={cn("max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed space-y-1",
                msg.role === "ai"
                  ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                  : "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm shadow-md shadow-blue-500/20"
              )}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        <div className="flex gap-2 flex-wrap mb-4">
          {suggestedPrompts.map(p => (
            <button key={p} onClick={() => send(p)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:border-blue-300 hover:text-blue-600 transition-all hover:shadow-sm">
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="pb-8">
          <div className="flex gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask me anything about your career..."
              className="flex-1 bg-transparent text-slate-700 text-sm outline-none placeholder-slate-400"
            />
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Mic className="w-5 h-5 text-slate-400" />
            </button>
            <button onClick={() => send()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/30 hover:scale-105 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skill Gap ────────────────────────────────────────────────────────────────

const radarData = [
  { skill: "Design", you: 85, industry: 90 }, { skill: "Research", you: 62, industry: 85 },
  { skill: "Prototyping", you: 78, industry: 80 }, { skill: "Systems", you: 55, industry: 75 },
  { skill: "Coding", you: 40, industry: 60 }, { skill: "Analytics", you: 70, industry: 72 },
];

const skillBars = [
  { name: "Figma / Design Tools", you: 85, required: 90, status: "close" },
  { name: "User Research", you: 62, required: 85, status: "gap" },
  { name: "Design Systems", you: 55, required: 75, status: "gap" },
  { name: "Prototyping", you: 78, required: 80, status: "close" },
  { name: "HTML / CSS", you: 40, required: 60, status: "gap" },
  { name: "Analytics / Data", you: 70, required: 72, status: "met" },
];

function SkillGap() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skill Gap Analysis</h1>
          <p className="text-slate-500 mt-1">See exactly where you stand vs. UX Designer industry standards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Skills Met", val: 1, total: 6, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Almost There", val: 2, total: 6, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Skill Gaps", val: 3, total: 6, color: "text-red-500", bg: "bg-red-50" },
          ].map(s => (
            <GlassCard key={s.label} className="p-5 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xl", s.bg, s.color)}>
                {s.val}
              </div>
              <div>
                <div className="font-bold text-slate-800">{s.label}</div>
                <div className="text-sm text-slate-500">of {s.total} tracked skills</div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skills Radar</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar name="You" dataKey="you" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
                <Radar name="Industry" dataKey="industry" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.1} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-2">
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-blue-500" /> You</div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-purple-500" /> Industry Avg</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4" hover={false}>
            <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skill Breakdown</h3>
            {skillBars.map(s => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Need {s.required}%</span>
                    <span className={cn("font-bold text-xs px-1.5 py-0.5 rounded",
                      s.status === "met" ? "bg-emerald-100 text-emerald-600" :
                      s.status === "close" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-500"
                    )}>{s.you}%</span>
                  </div>
                </div>
                <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-700",
                    s.status === "met" ? "bg-emerald-500" : s.status === "close" ? "bg-amber-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                  )} style={{ width: `${s.you}%` }} />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400/50" style={{ left: `${s.required}%` }} />
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Recommendations */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recommended Next Steps</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: BookOpen, title: "Take User Research Course", time: "3 weeks", priority: "High", color: "text-red-500", bg: "bg-red-50" },
              { icon: Layers, title: "Build a Design System", time: "2 weeks", priority: "Medium", color: "text-amber-600", bg: "bg-amber-50" },
              { icon: Code, title: "Learn HTML/CSS Basics", time: "4 weeks", priority: "Medium", color: "text-amber-600", bg: "bg-amber-50" },
            ].map(r => (
              <div key={r.title} className={cn("p-4 rounded-2xl space-y-3", r.bg)}>
                <r.icon className={cn("w-6 h-6", r.color)} />
                <div className="font-semibold text-slate-800 text-sm">{r.title}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{r.time}</span>
                  <Badge color={r.priority === "High" ? "red" : "amber"}>{r.priority}</Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

const milestones = [
  { phase: "Foundation", emoji: "🌱", status: "done", duration: "2 months", items: ["HTML & CSS", "Design Principles", "Typography & Color"], xp: 500 },
  { phase: "Tool Mastery", emoji: "🛠️", status: "done", duration: "3 months", items: ["Figma Advanced", "Prototyping", "Animation"], xp: 800 },
  { phase: "UX Research", emoji: "🔬", status: "active", duration: "2 months", items: ["User Interviews", "Usability Testing", "Affinity Mapping"], xp: 700 },
  { phase: "Portfolio", emoji: "💼", status: "upcoming", duration: "2 months", items: ["3 Case Studies", "Personal Brand", "GitHub Portfolio"], xp: 900 },
  { phase: "Job Ready", emoji: "🚀", status: "locked", duration: "1 month", items: ["Resume Optimization", "Interview Prep", "Networking"], xp: 600 },
];

function Roadmap() {
  const [expanded, setExpanded] = useState<number | null>(1);
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Learning Roadmap</h1>
            <p className="text-slate-500 mt-1">Your path to UX Designer — 10 months total</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-blue-600">3,480 XP</div>
            <div className="text-xs text-slate-500">earned of 4,500</div>
          </div>
        </div>

        {/* Overall progress */}
        <GlassCard className="p-6" hover={false}>
          <div className="flex justify-between text-sm font-medium text-slate-700 mb-3">
            <span>Overall Progress</span>
            <span>Phase 3 of 5</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: "52%" }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            {milestones.map(m => <span key={m.phase}>{m.emoji}</span>)}
          </div>
        </GlassCard>

        {/* Milestones */}
        <div className="space-y-4">
          {milestones.map((m, i) => (
            <GlassCard key={m.phase} className={cn("overflow-hidden", m.status === "locked" && "opacity-60")}>
              <button className="w-full p-5 flex items-center gap-4 text-left" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0",
                  m.status === "done" ? "bg-emerald-100" : m.status === "active" ? "bg-blue-100" : m.status === "upcoming" ? "bg-purple-100" : "bg-slate-100"
                )}>
                  {m.status === "done" ? "✅" : m.status === "locked" ? "🔒" : m.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.phase}</span>
                    <Badge color={m.status === "done" ? "green" : m.status === "active" ? "blue" : m.status === "upcoming" ? "purple" : "blue"}>
                      {m.status === "done" ? "Completed" : m.status === "active" ? "In Progress" : m.status === "upcoming" ? "Up Next" : "Locked"}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">{m.duration} · +{m.xp} XP</div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", expanded === i && "rotate-180")} />
              </button>
              {expanded === i && (
                <div className="px-5 pb-5">
                  <div className="pl-16 space-y-2">
                    {m.items.map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                          m.status === "done" ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                        )}>
                          {m.status === "done" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function Profile() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <GlassCard className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6" hover={false}>
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-blue-500/30">A</div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alex Johnson</h1>
            <p className="text-slate-500">Aspiring UX Designer · Level 11</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge color="blue">🎨 Creative</Badge>
              <Badge color="purple">🧠 Analytical</Badge>
              <Badge color="green">🔥 42-Day Streak</Badge>
              <Badge color="amber">⚡ Power Learner</Badge>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl border-2 border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors">
            Edit Profile
          </button>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-6">
          {/* XP Progress */}
          <GlassCard className="p-6 space-y-4" hover={false}>
            <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Level Progress</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProgressRing value={78} size={80} stroke={7} color="#7C3AED" bg="#EDE9FE" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-purple-600">11</span>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-800">Level 11 — Explorer</div>
                <div className="text-sm text-slate-500">2,480 / 3,200 XP</div>
                <div className="text-xs text-purple-600 font-medium mt-1">720 XP to Level 12</div>
              </div>
            </div>
          </GlassCard>

          {/* Stats */}
          <GlassCard className="p-6 space-y-3" hover={false}>
            <h3 className="font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Stats</h3>
            {[
              { label: "Total Learning Hours", val: "218 hrs" },
              { label: "Courses Completed", val: "12" },
              { label: "Skills Acquired", val: "38" },
              { label: "Career Paths Explored", val: "7" },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{s.label}</span>
                <span className="font-bold text-slate-900 text-sm">{s.val}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Settings preview */}
        <GlassCard className="p-6 space-y-1" hover={false}>
          <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Preferences</h3>
          {[
            { label: "Email Notifications", on: true },
            { label: "Weekly Progress Report", on: true },
            { label: "AI Mentor Suggestions", on: true },
            { label: "Career Alert Emails", on: false },
          ].map(p => (
            <div key={p.label} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
              <span className="text-sm text-slate-700">{p.label}</span>
              <div className={cn("w-10 h-5 rounded-full transition-colors relative cursor-pointer", p.on ? "bg-blue-600" : "bg-slate-200")}>
                <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all", p.on ? "left-5" : "left-0.5")} />
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Floating AI Button ───────────────────────────────────────────────────────

function FloatingMentor({ setView, view }: { setView: (v: View) => void; view: View }) {
  if (view === "mentor") return null;
  return (
    <button onClick={() => setView("mentor")}
      className="fixed bottom-8 right-8 z-40 group w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 transition-all duration-300">
      <Brain className="w-6 h-6 text-white" />
      <div className="absolute -top-10 right-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        AI Mentor
      </div>
      <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
    </button>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar view={view} setView={setView} scrolled={scrolled} />
      {view === "landing" && <LandingPage setView={setView} />}
      {view === "assessment" && <AssessmentPage setView={setView} />}
      {view === "dashboard" && <Dashboard setView={setView} />}
      {view === "careers" && <CareersPage setView={setView} />}
      {view === "career-detail" && <CareerDetail setView={setView} />}
      {view === "mentor" && <AIMentor />}
      {view === "skill-gap" && <SkillGap />}
      {view === "roadmap" && <Roadmap />}
      {view === "profile" && <Profile />}
      <FloatingMentor setView={setView} view={view} />
    </div>
  );
}
