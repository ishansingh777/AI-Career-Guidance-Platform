import React from "react";
import { Brain } from "lucide-react";
import { GlassCard } from "../common/GlassCard";

export function ChatHeader() {
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/60 flex items-center justify-center">
          <Brain className="h-6 w-6 text-blue-300" />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-50">
            AI Career Mentor
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Ask questions about your selected career. Get guidance, roadmaps, and next steps.
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

