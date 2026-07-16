import { useMemo, useState } from "react";

import { GlassCard } from "../../components/common/GlassCard";

import type { SavedCareer } from "../../utils/savedCareers";

import { Button } from "../ui/button";
import { Badge } from "../common/Badge";

type SortKey = "AZ" | "salary" | "futureDemand";

type SavedToolbarProps = {
  savedCareers: SavedCareer[];
  onSearchChange: (v: string) => void;
  onSortChange: (k: SortKey) => void;
  searchValue: string;
  sortKey: SortKey;
};

export function SavedToolbar({
  savedCareers,
  onSearchChange,
  onSortChange,
  searchValue,
  sortKey,
}: SavedToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  const count = useMemo(() => savedCareers.length, [savedCareers.length]);

  return (
    <GlassCard className="p-4" hover={false}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm text-slate-500">Saved careers</div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-extrabold text-slate-900">{count}</div>
              <Badge color="blue">Total</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <input
            value={localSearch}
            onChange={(e) => {
              const next = e.target.value;
              setLocalSearch(next);
              onSearchChange(next);
            }}
            placeholder="Search by career title..."
            className="w-full sm:w-72 px-4 py-2 rounded-xl bg-white/60 border border-white/70 outline-none text-sm text-slate-700 focus:border-blue-400 focus:shadow-md"
          />

          <div className="flex items-center gap-2">
            {(
              [
                { key: "AZ", label: "A–Z" },
                { key: "salary", label: "Salary" },
                { key: "futureDemand", label: "Demand" },
              ] as const
            ).map((s) => (
              <Button
                key={s.key}
                variant={sortKey === s.key ? "secondary" : "ghost"}
                onClick={() => onSortChange(s.key)}
                className="rounded-xl"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

