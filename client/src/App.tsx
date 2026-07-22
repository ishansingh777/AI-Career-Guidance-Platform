import { useEffect, useRef, useState } from "react";
import {
  BookOpen, Brain, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Code,
  Layers, LineChart, Mic, Plus, Send, Settings, Star, User
} from "lucide-react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import AssessmentPage from "./pages/Assessment";
import CareerDetailsPage from "./pages/CareerDetails";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import SkillGapPage from "./pages/SkillGap";
import CompareCareers from "./pages/CompareCareers";
import SavedCareersPage from "./pages/SavedCareers";


import { Badge } from "./components/common/Badge";
import { Blobs } from "./components/common/Blobs";
import { GlassCard } from "./components/common/GlassCard";
import { Navbar } from "./components/common/Navbar";
import { ProgressRing } from "./components/common/ProgressRing";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { cn } from "./utils/cn";

export type View = "landing" | "assessment" | "dashboard" | "careers" | "career-detail" | "mentor" | "skill-gap" | "roadmap" | "profile";

// ─── Shared helpers ───────────────────────────────────────────────────────────

// ─── Floating Blobs ───────────────────────────────────────────────────────────

// ─── Navbar ───────────────────────────────────────────────────────────────────

// ─── Landing Page ─────────────────────────────────────────────────────────────

// ─── Dashboard ────────────────────────────────────────────────────────────────

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

function CareersPage() {
  const navigate = useNavigate();
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
            <CareerCard key={c.title} career={c} onClick={() => navigate("/career-detail")} />
          ))}
        </div>
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

// ─── Floating AI Button ───────────────────────────────────────────────────────

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

// ─── Root ─────────────────────────────────────────────────────────────────────

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
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/career-detail" element={<CareerDetailsPage />} />
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
