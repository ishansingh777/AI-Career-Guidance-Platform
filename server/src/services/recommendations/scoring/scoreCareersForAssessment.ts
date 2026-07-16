import { FactorWeights } from "../weights.js";
import type { TopCareerMatch } from "../RecommendationService.js";

type AssessmentLike = {
  responses: Array<{ questionId: number; answer: any }>;
};

type CareerLike = {
  slug: string;
  title: string;
  futureDemand: number;
  automationRisk: number;
  growthRate: number;
  salaryIndiaMin: number;
  salaryIndiaMax: number;
  requiredSkills: string[];
  personalityTraits: string[];
  preferredInterests: string[];
  dailyWork?: string | null;
  category: string;
  image?: string | null;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function toStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function normalizeText(s: string) {
  return s.toLowerCase().trim();
}

function jaccard(a: string[], b: string[]) {
  const A = new Set(a.map(normalizeText));
  const B = new Set(b.map(normalizeText));
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function pickAnswer(answers: AssessmentLike["responses"], questionId: number) {
  const r = answers.find((x) => x.questionId === questionId);
  return r?.answer;
}

function describeTechAffinity(value: unknown) {
  if (typeof value !== "number") return null;
  if (value >= 80) return "advanced technology comfort";
  if (value >= 60) return "solid technology comfort";
  if (value >= 35) return "moderate technology comfort";
  return "early-stage technology comfort";
}

function humanJoin(items: string[]) {
  const unique = Array.from(new Set(items.filter(Boolean)));
  if (unique.length <= 1) return unique[0] ?? "";
  if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;
  return `${unique.slice(0, -1).join(", ")}, and ${unique[unique.length - 1]}`;
}

function containsAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function extractAssessmentSignals(assessment: AssessmentLike) {
  const responses = assessment.responses;
  const q1 = pickAnswer(responses, 1);
  const q2 = pickAnswer(responses, 2);
  const q3 = pickAnswer(responses, 3);
  const q4 = pickAnswer(responses, 4);

  return {
    energizer: typeof q1 === "string" ? q1 : null,
    technologyAffinity: describeTechAffinity(q2),
    technologyScore: typeof q2 === "number" ? q2 : null,
    interests: toStringArray(q3),
    personality: typeof q4 === "string" ? q4 : null,
    selectedSkills: toStringArray(pickAnswer(responses, 5)),
    workPreferences: toStringArray(pickAnswer(responses, 6)),
    learningPreferences: toStringArray(pickAnswer(responses, 7)),
    careerGoals: toStringArray(pickAnswer(responses, 8)),
  };
}

function buildPersonalizedReason({
  assessment,
  career,
  interestsScore,
  topSkillSignals,
}: {
  assessment: AssessmentLike;
  career: CareerLike;
  interestsScore: number;
  topSkillSignals: string[];
}) {
  const signals = extractAssessmentSignals(assessment);
  const snippets: string[] = [];
  const careerTitle = career.title;
  const requiredSkills = toStringArray(career.requiredSkills ?? []);
  const careerText = [
    career.title,
    career.category,
    ...(career.preferredInterests ?? []),
    ...requiredSkills,
    career.dailyWork ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const matchingInterests = signals.interests.filter((interest) => {
    const normalized = normalizeText(interest);
    if (!normalized) return false;
    const tokens = normalized.split(/\s+|&|\+|,|\//).filter((t) => t.length > 2);
    return careerText.includes(normalized) || tokens.some((token) => careerText.includes(token));
  });

  if (matchingInterests.length) {
    snippets.push(`you selected ${humanJoin(matchingInterests.slice(0, 2))} as an interest`);
  } else if (signals.interests.length && interestsScore >= 35) {
    snippets.push(`your interest pattern overlaps with ${career.category}`);
  }

  if (topSkillSignals.length) {
    snippets.push(`your selected domains connect with ${humanJoin(topSkillSignals.slice(0, 2))}`);
  }

  if (signals.selectedSkills.length) {
    const selectedSkillTokens = signals.selectedSkills.map(normalizeText);
    const matchedSelectedSkills = requiredSkills.filter((skill) => {
      const normalizedSkill = normalizeText(skill);
      return selectedSkillTokens.some((selected) => normalizedSkill.includes(selected) || selected.includes(normalizedSkill));
    });
    if (matchedSelectedSkills.length) {
      snippets.push(`your selected skills match ${humanJoin(matchedSelectedSkills.slice(0, 2))}`);
    } else {
      snippets.push(`your selected skills give you a useful starting point`);
    }
  }

  if (signals.technologyAffinity) {
    const technicalCareer = containsAny(careerText, [
      "software",
      "engineering",
      "cloud",
      "data",
      "machine",
      "ai",
      "cyber",
      "systems",
      "developer",
      "analytics",
    ]);
    if (technicalCareer) snippets.push(`you reported ${signals.technologyAffinity}`);
  }

  const personality = normalizeText(signals.personality ?? "");
  if (personality) {
    if (containsAny(personality, ["architect", "system"]) && containsAny(careerText, ["system", "architecture", "infrastructure", "backend", "cloud", "engineering"])) {
      snippets.push("your Architect work style fits structured systems work");
    } else if (containsAny(personality, ["creator", "creative"]) && containsAny(careerText, ["design", "creative", "product", "content", "game", "frontend"])) {
      snippets.push("your Creator work style fits building and designing user-facing work");
    } else if (containsAny(personality, ["analyst", "data"]) && containsAny(careerText, ["data", "analytics", "research", "risk", "finance", "analysis"])) {
      snippets.push("your Analyst work style fits evidence-based problem solving");
    } else if (containsAny(personality, ["leader"]) && containsAny(careerText, ["manager", "product", "consultant", "leadership", "strategy", "business"])) {
      snippets.push("your Leader work style fits ownership and stakeholder-heavy work");
    }
  }

  if (signals.energizer) {
    const energizer = normalizeText(signals.energizer);
    if (containsAny(energizer, ["complex", "problem"]) && containsAny(careerText, ["analysis", "engineering", "research", "security", "data"])) {
      snippets.push("you are energized by complex problem-solving");
    } else if (containsAny(energizer, ["beautiful", "creating"]) && containsAny(careerText, ["design", "creative", "frontend", "product"])) {
      snippets.push("you enjoy creating polished experiences");
    } else if (containsAny(energizer, ["helping", "people"]) && containsAny(careerText, ["health", "education", "research", "user", "public"])) {
      snippets.push("you are motivated by helping people");
    } else if (containsAny(energizer, ["building", "systems"]) && containsAny(careerText, ["systems", "engineering", "platform", "backend", "cloud"])) {
      snippets.push("you like building systems");
    }
  }

  if (signals.workPreferences.length) {
    snippets.push(`your work preference for ${humanJoin(signals.workPreferences.slice(0, 2))} aligns with this role's day-to-day work`);
  }

  if (signals.learningPreferences.length) {
    snippets.push(`your ${humanJoin(signals.learningPreferences.slice(0, 2))} learning preference suits the roadmap for this path`);
  }

  if (signals.careerGoals.length) {
    snippets.push(`your goal of ${humanJoin(signals.careerGoals.slice(0, 2))} is supported by this career path`);
  }

  const metric = (() => {
    if (career.futureDemand >= 9) return "It also has high future demand.";
    if ((career.growthRate ?? 0) >= 20) return "It also offers strong growth potential.";
    if ((career.automationRisk ?? 5) <= 3) return "It also has comparatively lower automation risk.";
    return "It also shows steady market potential.";
  })();

  if (snippets.length) {
    return `${snippets[0][0].toUpperCase()}${snippets[0].slice(1)}, making ${careerTitle} a strong match. ${metric}`;
  }

  const fallbackSkill = requiredSkills[0];
  if (fallbackSkill) {
    return `${careerTitle} is a strong match because your assessment profile aligns with roles that use ${fallbackSkill} and ${career.category.toLowerCase()} skills. ${metric}`;
  }

  return `${careerTitle} is a strong match based on your latest assessment signals and this role's career profile. ${metric}`;
}

// Maps your existing assessment UI questionIds to factors.
// Current Assessment page uses local question ids: 1..4.
// Until you implement a richer template, this is best-effort and remains deterministic.
function extractFactorScores(assessment: AssessmentLike) {
  const responses = assessment.responses;


  // Heuristics based on current Assessment.tsx question ids.
  // 1 = energizes you (cards)
  const q1 = pickAnswer(responses, 1);
  // 2 = tech comfort (slider 0-100)
  const q2 = pickAnswer(responses, 2);
  // 3 = domains excitement (chips)
  const q3 = pickAnswer(responses, 3);
  // 4 = work style (personality)
  const q4 = pickAnswer(responses, 4);

  const technicalSkills = typeof q2 === "number" ? q2 : 50;
  const interests = toStringArray(q3);

  const personality = (() => {
    if (typeof q4 !== "string") return 50;
    const v = normalizeText(q4);
    if (v.includes("architect")) return 80;
    if (v.includes("creator")) return 78;
    if (v.includes("analyst")) return 82;
    if (v.includes("leader")) return 76;
    return 60;
  })();

  // Soft / leadership / communication / creativity are best-effort from q1 + personality.
  const baseSoft = (() => {
    if (typeof q1 !== "string") return 55;
    const v = normalizeText(q1);
    if (v.includes("helping") || v.includes("human")) return 85;
    if (v.includes("collaboration") || v.includes("team")) return 80;
    if (v.includes("creating") || v.includes("creative")) return 78;
    if (v.includes("building") || v.includes("systems") || v.includes("engineering")) return 68;
    return 60;
  })();

  const communication = clamp01(baseSoft / 100) * 100;
  const creativity = (() => {
    if (typeof q1 !== "string") return 60;
    const v = normalizeText(q1);
    if (v.includes("creating") || v.includes("beautiful")) return 90;
    return 65;
  })();

  const leadership = (() => {
    const v = typeof q4 === "string" ? normalizeText(q4) : "";
    return v.includes("leader") ? 90 : 60;
  })();

  // Sports/academic/career goals/learning style/preferred environment are not present in current assessment.
  // Keep them neutral (50) to avoid extreme bias.
  const sports = 50;
  const academicBackground = 50;
  const careerGoals = 50;
  const learningStyle = 50;
  const preferredWorkEnvironment = 50;

  const softSkills = baseSoft;

  // Interpreting interests as factor score from match strength with career preferredInterests.
  // We'll compute a similarity score later in the per-career scoring.

  return {
    academicBackground,
    technicalSkills,
    softSkills,
    sports,
    leadership,
    communication,
    creativity,
    personality,
    careerGoals,
    learningStyle,
    preferredWorkEnvironment,
  };
}

export function scoreCareersForAssessment({
  assessment,
  careers,
  weights,
}: {
  assessment: AssessmentLike;
  careers: CareerLike[];
  weights: FactorWeights;
}): TopCareerMatch[] {
  const base = extractFactorScores(assessment);

  const scored = careers.map((career) => {
    const careerInterests = career.preferredInterests ?? [];


    // Since base doesn't include interests score, compute it from extracted interests.
    // We'll recompute with assessment interests.
    const q3 = pickAnswer(assessment.responses, 3);
    const userInterests = toStringArray(q3);
    const interestsScore = Math.round(jaccard(userInterests, toStringArray(careerInterests)) * 100);

    // Technical score from overlap between requiredSkills and user interests/skills not yet captured.
    // Use heuristic: if user interests include domains, treat as proxy for technical.
    const technicalFromInterests = (() => {
      const t = userInterests.join(" ").toLowerCase();
      const req = (career.requiredSkills ?? []).join(" ").toLowerCase();
      if (!req) return 50;
      // overlap words
      const tokens = userInterests.flatMap((x) => x.split(/\s+|&|\+|,|\//).filter(Boolean));
      const overlap = tokens.filter((tok) => tok.length > 2 && req.includes(tok.toLowerCase())).length;
      const denom = Math.max(3, tokens.length);
      return clamp01(overlap / denom) * 100;
    })();

    // Personality fit: jaccard between career traits and inferred personality label keywords.
    const personalityKeywords = (() => {
      const q4 = pickAnswer(assessment.responses, 4);
      const v = typeof q4 === "string" ? normalizeText(q4) : "";
      if (v.includes("architect")) return ["analytical", "structured", "systems"];
      if (v.includes("creator")) return ["creative", "experimentation", "builder"];
      if (v.includes("analyst")) return ["analytical", "data", "evidence"];
      if (v.includes("leader")) return ["leadership", "team", "communication"];
      return ["structured", "reliable"];
    })();

    const personalityFit = Math.round(
      jaccard(personalityKeywords, toStringArray(career.personalityTraits ?? [])) * 100
    );

    const softSkills = base.softSkills;

    const weighted =
      base.academicBackground * weights.academicBackground +
      (technicalFromInterests || base.technicalSkills) * weights.technicalSkills +
      softSkills * weights.softSkills +
      base.sports * weights.sports +
      base.leadership * weights.leadership +
      base.communication * weights.communication +
      base.creativity * weights.creativity +
      personalityFit * weights.personality +
      base.careerGoals * weights.careerGoals +
      base.learningStyle * weights.learningStyle +
      base.preferredWorkEnvironment * weights.preferredWorkEnvironment +
      interestsScore * weights.interests;

    // Convert weighted sum in 0..100 range because weights normalized.
    const score = Math.round(weighted);

    const topSkillSignals: string[] = [];
    const userInterestTokens = userInterests
      .flatMap((x) => x.split(/\s+|&|\+|,|\//).filter(Boolean))
      .map((t) => t.toLowerCase());

    for (const s of career.requiredSkills ?? []) {
      const parts = s
        .split(/\s+|\(|\)|,|\/|&|\+|-|_/)
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);
      if (parts.some((p) => p.length > 2 && userInterestTokens.includes(p))) {
        topSkillSignals.push(s);
      }
      if (topSkillSignals.length >= 3) break;
    }

    return {
      career,
      score,
      reason: buildPersonalizedReason({ assessment, career, interestsScore, topSkillSignals }),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map((s) => ({
    title: s.career.title,
    slug: s.career.slug,
    score: s.score,
    reason: s.reason,
    futureDemand: s.career.futureDemand,
    automationRisk: s.career.automationRisk,
    growthRate: s.career.growthRate,
    salaryIndiaMin: s.career.salaryIndiaMin,
    salaryIndiaMax: s.career.salaryIndiaMax,
    requiredSkills: s.career.requiredSkills ?? [],
    image: s.career.image ?? null,
  }));
}

