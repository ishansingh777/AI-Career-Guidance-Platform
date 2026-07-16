import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

type BadgeProps = {
  children: ReactNode;
  color?: "blue" | "purple" | "green" | "amber" | "red";
  className?: string;
};

export function Badge({ children, color = "blue", className = "" }: BadgeProps) {

  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };
return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );

}
