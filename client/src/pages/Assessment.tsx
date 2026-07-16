import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/axios";
import { Blobs } from "../components/common/Blobs";
import { GlassCard } from "../components/common/GlassCard";
import { ProgressRing } from "../components/common/ProgressRing";
import { cn } from "../utils/cn";

type View = "landing" | "assessment" | "dashboard" | "careers" | "career-detail" | "mentor" | "skill-gap" | "roadmap" | "profile";

type AssessmentPageProps = {
  setView?: (view: View) => void;
};

type Question =
  | {
      id: number;
      type: "cards";
      question: string;
      emoji: string;
      options: { label: string; icon: string; desc: string }[];
    }
  | {
      id: number;
      type: "slider";
      question: string;
      emoji: string;
      min: number;
      max: number;
    }
  | {
      id: number;
      type: "chips";
      question: string;
      emoji: string;
      options: string[];
    }
  | {
      id: number;
      type: "personality";
      question: string;
      emoji: string;
      options: { label: string; desc: string; color: string; emoji: string }[];
    };

const questions: Question[] = [
  {
    id: 1,
    type: "cards",
    question: "What energizes you most?",
    emoji: "⚡",
    options: [
      { label: "Solving complex problems", icon: "🧩", desc: "Analytical thinking" },
      { label: "Creating beautiful things", icon: "🎨", desc: "Creative expression" },
      { label: "Helping people", icon: "🤝", desc: "Human connection" },
      { label: "Building systems", icon: "⚙️", desc: "Engineering mindset" },
    ],
  },
  {
    id: 2,
    type: "slider",
    question: "How comfortable are you with technology?",
    emoji: "💻",
    min: 0,
    max: 100,
  },
  {
    id: 3,
    type: "chips",
    question: "Which domains excite you?",
    emoji: "🌟",
    options: [
      "AI & Machine Learning",
      "Product Design",
      "Data Science",
      "Marketing",
      "Finance",
      "Healthcare",
      "Gaming",
      "Education",
      "Climate Tech",
      "Web Dev",
      "Mobile Apps",
      "Cybersecurity",
    ],
  },
  {
    id: 4,
    type: "personality",
    question: "Which best describes your work style?",
    emoji: "🎯",
    options: [
      {
        label: "The Architect",
        desc: "I love designing systems and thinking long-term",
        color: "from-blue-500 to-blue-700",
        emoji: "🏗️",
      },
      {
        label: "The Creator",
        desc: "I thrive when building something from nothing",
        color: "from-purple-500 to-purple-700",
        emoji: "🎨",
      },
      {
        label: "The Analyst",
        desc: "I make decisions based on data and evidence",
        color: "from-emerald-500 to-emerald-700",
        emoji: "📊",
      },
      {
        label: "The Leader",
        desc: "I motivate teams and drive outcomes",
        color: "from-amber-500 to-orange-600",
        emoji: "🚀",
      },
    ],
  },
];

export default function AssessmentPage({ setView }: AssessmentPageProps) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [sliderVal, setSliderVal] = useState(50);
  const [chips, setChips] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const totalSteps = questions.length + 1; // +1 for review
  const q = questions[step];
  const progress = ((step + 1) / totalSteps) * 100;

  function validateCurrentStep(): boolean {
    // basic required checks per question
    if (step >= questions.length) return true;
    const current = questions[step];
    const val = answers[current.id];
    if (current.type === "cards" || current.type === "personality") {
      if (!val) return false;
    }
    if (current.type === "slider") {
      const v = val ?? sliderVal;
      if (v === undefined || v === null) return false;
    }
    if (current.type === "chips") {
      if (!chips || chips.length === 0) return false;
    }
    return true;
  }

  function next() {
    if (!validateCurrentStep()) {
      // simple inline feedback for required fields
      // could be replaced with nicer UI later
      alert("Please answer the current question before proceeding.");
      return;
    }

    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else if (step === questions.length - 1) {
      // move to review step
      setStep(questions.length);
    } else {
      // shouldn't happen, but finish
      setDone(true);
    }
  }

  function toggleChip(value: string, qId: number) {
    setChips((prev) => {
      const next = prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
      setAnswers((current) => ({ ...current, [qId]: next }));
      return next;
    });
  }

  async function submitAssessment() {
    try {
      const responses = questions.map((question) => {
        const ans = answers[question.id] ?? (question.type === "chips" ? chips : null);
        return { questionId: question.id, answer: ans };
      });

      // basic sanity
      if (responses.some((r) => r.answer === null || r.answer === undefined)) {
        alert("Please complete all questions before submitting.");
        return;
      }

      const resp = await api.post("/assessments", { title: "Career Fit Assessment", responses });
      if (resp.status === 201) {
        setDone(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || err.message || "Submission failed");
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center relative overflow-hidden pt-16">
        <Blobs />
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(60)].map((_, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 5)],
                  animationDuration: `${Math.random() * 2 + 1}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
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
            {[
              { label: "Career Matches", val: "24" },
              { label: "Match Score", val: "94%" },
              { label: "Skills Mapped", val: "38" },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-4 text-center" hover={false}>
                <div className="text-2xl font-extrabold text-blue-600">{stat.val}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all duration-300"
          >
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
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <ProgressRing value={progress} size={56} stroke={4} color="#60A5FA" bg="rgba(255,255,255,0.1)" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {Math.min(step + 1, totalSteps)}/{totalSteps}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-white/50 text-xs mb-1.5">
              <span>{step === questions.length ? "Review" : `Question ${step + 1} of ${questions.length}`}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <GlassCard className="p-8 space-y-8" hover={false}>
          {step === questions.length ? (
            <div>
              <div className="text-center mb-2">
                <h2 className="text-2xl font-extrabold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Review your answers
                </h2>
                <div className="text-sm text-slate-500 mt-1">Edit any step before submitting.</div>
              </div>
              <div className="space-y-4">
                {questions.map((question, idx) => (
                  <div key={question.id} className="p-3 border rounded-lg bg-white/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">{question.question}</div>
                        <div className="text-sm text-slate-600 mt-1">{String(answers[question.id] ?? "")}</div>
                      </div>
                      <div>
                        <button onClick={() => setStep(idx)} className="text-sm text-blue-600 font-medium">Edit</button>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>
          ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">{q.emoji}</div>
            <h2 className="text-2xl font-extrabold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {q.question}
            </h2>
          </div>
          )}

          {step !== questions.length && q.type === "cards" && (
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    setAnswers((current) => ({ ...current, [q.id]: option.label }));
                  }}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-105",
                    answers[q.id] === option.label
                      ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                      : "border-slate-200 hover:border-blue-300 bg-white/50"
                  )}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-bold text-slate-800 text-sm">{option.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{option.desc}</div>
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
              <input
                type="range"
                min={q.min}
                max={q.max}
                value={sliderVal}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  setSliderVal(nextValue);
                  setAnswers((current) => ({ ...current, [q.id]: nextValue }));
                }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #2563EB ${sliderVal}%, #E2E8F0 ${sliderVal}%)` }}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Beginner</span>
                <span>Advanced</span>
              </div>
            </div>
          )}

          {step !== questions.length && q.type === "chips" && (
            <div className="flex flex-wrap gap-2">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleChip(option, q.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200",
                    chips.includes(option)
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {step !== questions.length && q.type === "personality" && (
            <div className="space-y-3">
              {q.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setAnswers((current) => ({ ...current, [q.id]: option.label }))}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-200",
                    answers[q.id] === option.label ? "border-blue-500 bg-blue-50 shadow-md" : "border-slate-200 hover:border-blue-300 bg-white/50"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0", option.color)}>
                    {option.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{option.label}</div>
                    <div className="text-sm text-slate-500">{option.desc}</div>
                  </div>
                  {answers[q.id] === option.label && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                onClick={() => setStep((current) => current - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-blue-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step === questions.length ? (
              <>
                <button onClick={submitAssessment} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-lg shadow-green-500/30 hover:scale-105 transition-all duration-200">
                  Submit Assessment
                </button>
              </>
            ) : (
              <button
                onClick={next}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200"
              >
                {step === questions.length - 1 ? "Review" : "Next"} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
