import { Button } from "../ui/button";
import { GlassCard } from "../common/GlassCard";
import { Blobs } from "../common/Blobs";

export function EmptySavedState({ onGoDashboard }: { onGoDashboard?: () => void }) {
  return (
    <div className="min-h-[420px] flex items-center justify-center">
      <div className="w-full">
        <GlassCard className="p-8" hover={false}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-5xl">💾</div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">No saved careers yet</div>
              <div className="text-sm text-slate-500 mt-1">
                Save careers to compare and revisit your best options.
              </div>
            </div>
            <div>
              <Button className="rounded-2xl" onClick={onGoDashboard}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

