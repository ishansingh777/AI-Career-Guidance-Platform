import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
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
