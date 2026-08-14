import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";
import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";

const milestones = [
  { phase: "Foundation", emoji: "🌱", status: "done", duration: "2 months", items: ["HTML & CSS", "Design Principles", "Typography & Color"], xp: 500 },
  { phase: "Tool Mastery", emoji: "🛠️", status: "done", duration: "3 months", items: ["Figma Advanced", "Prototyping", "Animation"], xp: 800 },
  { phase: "UX Research", emoji: "🔬", status: "active", duration: "2 months", items: ["User Interviews", "Usability Testing", "Affinity Mapping"], xp: 700 },
  { phase: "Portfolio", emoji: "💼", status: "upcoming", duration: "2 months", items: ["3 Case Studies", "Personal Brand", "GitHub Portfolio"], xp: 900 },
  { phase: "Job Ready", emoji: "🚀", status: "locked", duration: "1 month", items: ["Resume Optimization", "Interview Prep", "Networking"], xp: 600 },
];

export default function Roadmap() {
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
            <GlassCard key={m.phase} className={cn("overflow-hidden", m.status === "locked" && "opacity-60")} hover={false}>
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
