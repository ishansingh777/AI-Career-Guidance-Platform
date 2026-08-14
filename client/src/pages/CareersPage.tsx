import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/common/Badge";
import { cn } from "../utils/cn";
import { getCareers, Career } from "../services/careers";

function CareerCard({ career, onClick }: { career: Career; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  // Default values for missing properties compared to mock data
  const match = 90; // mock match score
  const color = "from-blue-500 to-blue-700";
  const emoji = career.image ? "🖼️" : "💼";
  const tagColor = "blue";
  const difficulty = "Medium";
  const salaryString = `$${Math.round((career.salaryIndiaMin || 0) / 1000)}K+`;
  const growthString = `+${career.growthRate || 0}%`;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="group rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 overflow-hidden cursor-pointer"
      style={{ transform: hovered ? "perspective(1000px) rotateX(-2deg) rotateY(1deg) translateY(-4px)" : "none" }}
      onClick={onClick}>
      <div className={cn("h-32 bg-gradient-to-br flex items-center justify-center text-6xl relative", color)}>
        {emoji}
        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold">
            {match}% Match
          </div>
        </div>
        {hovered && <div className="absolute inset-0 bg-white/10 backdrop-blur-sm transition-all duration-300" />}
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{career.title}</h3>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2">{career.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <div className="font-bold text-slate-800 text-sm">{salaryString}</div>
            <div className="text-xs text-slate-400">Avg Salary</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <div className="font-bold text-emerald-600 text-sm">{growthString}</div>
            <div className="text-xs text-slate-400">Growth</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <div className="font-bold text-slate-800 text-sm">{difficulty}</div>
            <div className="text-xs text-slate-400">Entry</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {career.requiredSkills?.slice(0, 3).map(s => (
            <Badge key={s} color={tagColor}>{s}</Badge>
          ))}
          {(career.requiredSkills?.length || 0) > 3 && <Badge color="blue">+{career.requiredSkills.length - 3}</Badge>}
        </div>
        <button className={cn("w-full py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r transition-all duration-200 group-hover:shadow-lg", color)}>
          Explore Career →
        </button>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = ["All", "High Match", "High Salary", "Fast Growth"];

  useEffect(() => {
    getCareers().then((data) => {
      setCareers(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Career Matches</h1>
            <p className="text-slate-500 mt-1">{careers.length} careers matched to your profile — sorted by AI confidence</p>
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
        
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading careers...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map(c => (
              <CareerCard key={c.slug} career={c} onClick={() => navigate(`/career-detail/${c.slug}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
