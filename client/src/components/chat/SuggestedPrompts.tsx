import React, { memo } from "react";

export type SuggestedPrompt = {
  key: string;
  label: string;
  message: string;
};

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    key: "why",
    label: "Why was this career recommended?",
    message: "Why was this career recommended for me? Summarize the key reasons from the platform.",
  },
  {
    key: "roadmap",
    label: "Create a 6-month roadmap",
    message: "Create a practical 6-month roadmap for this career. Include monthly milestones and weekly activities.",
  },
  {
    key: "compare",
    label: "Compare with Data Scientist",
    message: "Compare this career with Data Scientist. Provide a clear pros/cons and fit for my profile.",
  },
  {
    key: "certs",
    label: "What certifications should I pursue?",
    message: "What certifications should I pursue for this career? Prioritize by ROI and timeline."
  },
  {
    key: "projects",
    label: "What projects should I build?",
    message: "What projects should I build to get job-ready for this career? Provide 3-5 project ideas with outcomes.",
  },
  {
    key: "interviews",
    label: "Prepare me for interviews",
    message: "Prepare me for interviews for this career. Give me a study plan and a list of likely questions.",
  },
];

export const SuggestedPrompts = memo(function SuggestedPrompts({
  onPick,
}: {
  onPick: (message: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_PROMPTS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onPick(p.message)}
          className="px-3 py-2 rounded-full text-xs sm:text-sm bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 hover:bg-white/75 dark:hover:bg-white/10 transition"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
});

