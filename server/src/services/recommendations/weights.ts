export type FactorWeights = {
  academicBackground: number;
  technicalSkills: number;
  softSkills: number;
  sports: number;
  leadership: number;
  communication: number;
  creativity: number;
  personality: number;
  careerGoals: number;
  learningStyle: number;
  preferredWorkEnvironment: number;
  interests: number;
};

// Default weights for deterministic ranking.
// Easy to modify later, and later can be tuned per cohort/user segment.
export function buildRecommendationWeights(): FactorWeights {
  const weights: FactorWeights = {
    academicBackground: 0.15,
    technicalSkills: 0.30,
    softSkills: 0.10,
    sports: 0.05,
    leadership: 0.05,
    communication: 0.05,
    creativity: 0.05,
    personality: 0.15,
    careerGoals: 0.15,
    learningStyle: 0.05,
    preferredWorkEnvironment: 0.05,
    interests: 0.20,
  };

  // Normalize to sum = 1 (safety)
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalized = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, v / sum])
  ) as FactorWeights;

  return normalized;
}

