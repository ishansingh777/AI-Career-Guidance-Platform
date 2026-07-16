import { RecommendationCard } from "./RecommendationCard";
import type { Recommendation } from "../../types/recommendation";

type RecommendationsGridProps = {
  recommendations: Recommendation[];
};

export function RecommendationsGrid({ recommendations }: RecommendationsGridProps) {
  const top = recommendations.slice(0, 5);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {top.map((rec) => (
        <RecommendationCard key={rec.slug} recommendation={rec} />
      ))}
    </div>
  );
}

