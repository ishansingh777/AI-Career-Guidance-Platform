import type {
  CareerAdviceInput,
  CareerQuestionInput,
  RecommendationContext,
  SelectedCareerContext,
  LatestAssessmentContext,
} from "./provider.js";

function formatAssessment(assessment: LatestAssessmentContext | null | undefined): string {
  if (!assessment) return "No assessment found.";

  const title = assessment.title ? `Title: ${assessment.title}` : "";
  const completedAt = assessment.completedAt ? `CompletedAt: ${assessment.completedAt}` : "";
  const answerFor = (questionId: number) => assessment.responses?.find((r) => r.questionId === questionId)?.answer;
  const summary = [
    answerFor(1) ? `Interests/work energy: ${JSON.stringify(answerFor(1))}` : "",
    answerFor(2) !== undefined ? `Technology affinity: ${JSON.stringify(answerFor(2))}` : "",
    answerFor(3) ? `Selected domains/interests: ${JSON.stringify(answerFor(3))}` : "",
    answerFor(4) ? `Personality/work style: ${JSON.stringify(answerFor(4))}` : "",
    answerFor(5) ? `Selected skills: ${JSON.stringify(answerFor(5))}` : "",
    answerFor(6) ? `Work preferences: ${JSON.stringify(answerFor(6))}` : "",
    answerFor(7) ? `Learning preferences: ${JSON.stringify(answerFor(7))}` : "",
    answerFor(8) ? `Career goals: ${JSON.stringify(answerFor(8))}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const responses = assessment.responses?.length
    ? assessment.responses
        .slice(0, 20)
        .map((r) => `Q${r.questionId}: answer=${JSON.stringify(r.answer)} score=${r.score ?? "null"}`)
        .join("\n")
    : "No responses.";

  return [title, completedAt, summary ? `Latest assessment summary:\n${summary}` : "", `Raw responses:\n${responses}`].filter(Boolean).join("\n");
}

function formatRecommendations(recommendations: RecommendationContext[]): string {
  if (!recommendations.length) return "No recommendations found.";

  return recommendations
    .slice(0, 8)
    .map((r, idx) => {
      const salaryIndia =
        typeof r.salaryIndiaMin === "number" || typeof r.salaryIndiaMax === "number"
          ? `India salary: ${r.salaryIndiaMin ?? "?"}-${r.salaryIndiaMax ?? "?"}`
          : "";
      const salaryGlobal =
        typeof r.salaryGlobalMin === "number" || typeof r.salaryGlobalMax === "number"
          ? `Global salary: ${r.salaryGlobalMin ?? "?"}-${r.salaryGlobalMax ?? "?"}`
          : "";
      return [
        `${idx + 1}. ${r.title} (slug=${r.slug}) score=${r.score}`,
        r.description ? `Description: ${r.description}` : "",
        r.dailyWork ? `Daily work: ${r.dailyWork}` : "",
        r.requiredSkills?.length ? `Required skills: ${r.requiredSkills.join(", ")}` : "",
        [salaryIndia, salaryGlobal].filter(Boolean).join("; "),
        typeof r.futureDemand === "number" ? `Future demand: ${r.futureDemand}/10` : "",
        typeof r.growthRate === "number" ? `Growth rate: ${r.growthRate}%` : "",
        typeof r.automationRisk === "number" ? `Automation risk: ${r.automationRisk}/10` : "",
        r.roadmap ? `Roadmap: ${JSON.stringify(r.roadmap)}` : "",
        r.learningResources ? `Learning resources: ${JSON.stringify(r.learningResources)}` : "",
        r.reason ? `Recommendation reason: ${r.reason}` : "",
      ]
        .filter(Boolean)
        .join("\n   ");
    })
    .join("\n");
}

function formatSelectedCareer(selectedCareer: SelectedCareerContext | null | undefined): string {
  if (!selectedCareer) return "No career selected.";

  const anyCareer = selectedCareer as any;

  const desc = anyCareer.description ? `Description: ${anyCareer.description}` : "";
  const requiredSkills = anyCareer.requiredSkills ?? anyCareer.skills;
  const skills = Array.isArray(requiredSkills) && requiredSkills.length ? `Required skills: ${requiredSkills.join(", ")}` : "";
  const roadmap = anyCareer.roadmap ? `Roadmap: ${JSON.stringify(anyCareer.roadmap)}` : "";
  const learningResources = anyCareer.learningResources ? `Learning resources: ${JSON.stringify(anyCareer.learningResources)}` : "";
  const dailyWork = anyCareer.dailyWork ? `Daily work: ${anyCareer.dailyWork}` : "";
  const demand = typeof anyCareer.futureDemand === "number" ? `Future demand (1-10): ${anyCareer.futureDemand}` : "";
  const growth = typeof anyCareer.growthRate === "number" ? `Growth rate: ${anyCareer.growthRate}%` : "";
  const risk = typeof anyCareer.automationRisk === "number" ? `Automation risk (1-10): ${anyCareer.automationRisk}` : "";
  const salary =
    typeof anyCareer.salaryIndiaMin === "number" || typeof anyCareer.salaryIndiaMax === "number"
      ? `Salary (India, est.): ${anyCareer.salaryIndiaMin ?? "?"} - ${anyCareer.salaryIndiaMax ?? "?"}`
      : "";
  const globalSalary =
    typeof anyCareer.salaryGlobalMin === "number" || typeof anyCareer.salaryGlobalMax === "number"
      ? `Salary (global, est.): ${anyCareer.salaryGlobalMin ?? "?"} - ${anyCareer.salaryGlobalMax ?? "?"}`
      : "";
  const recommendationReason = anyCareer.recommendationReason ? `Recommendation reason: ${anyCareer.recommendationReason}` : "";

  return [
    `Selected career: ${selectedCareer.title ?? ""} (slug=${selectedCareer.slug})`,
    desc,
    dailyWork,
    skills,
    demand,
    growth,
    risk,
    salary,
    globalSalary,
    roadmap,
    learningResources,
    recommendationReason,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatConversationHistory(history: CareerQuestionInput["conversationHistory"] | null | undefined): string {
  if (!history?.length) return "No conversation history available.";

  return history
    .slice(-10)
    .map((m) => `${m.role}${m.createdAt ? ` at ${m.createdAt}` : ""}: ${m.content}`)
    .join("\n");
}

export function buildCareerContext(input: CareerAdviceInput): string {
  const { user, latestAssessment, recommendations, selectedCareer } = input;

  return [
    `User: id=${user.id} name=${user.name ?? ""} email=${user.email ?? ""}`,
    `Assessment Context:\n${formatAssessment(latestAssessment)}`,
    `Recommendations:\n${formatRecommendations(recommendations)}`,
    formatSelectedCareer(selectedCareer),
  ].join("\n\n");
}

export function buildRecommendationPrompt(input: CareerAdviceInput): string {
  const context = buildCareerContext(input);

  return [
    "You are a career guidance assistant.",
    "Using the provided context, generate structured career advice.",
    "Return ONLY valid JSON matching this schema:",
    JSON.stringify(
      {
        careerAdvice: "string",
        keySkills: ["string"],
        nextSteps: [{ week: "string", actions: ["string"] }],
        risksAndMitigations: ["string"],
      },
      null,
      2
    ),
    "Context:\n" + context,
  ].join("\n\n");
}

export function buildRoadmapPrompt(input: CareerAdviceInput): string {
  const context = buildCareerContext(input);

  return [
    "You are a career planning assistant.",
    "Using the provided context, generate a structured learning roadmap.",
    "Return ONLY valid JSON matching this schema:",
    JSON.stringify({ roadmap: [{ phase: "string", duration: "string", goals: ["string"] }] }, null, 2),
    "Context:\n" + context,
  ].join("\n\n");
}

export function buildComparisonPrompt(params: {
  user: CareerQuestionInput["user"];
  latestAssessment: CareerQuestionInput["latestAssessment"];
  recommendations: RecommendationContext[];
  selectedCareer: SelectedCareerContext | null;
  otherCareer?: SelectedCareerContext | null;
}): string {
  const context = [
    "You are a career comparison assistant.",
    "Compare the selected career vs another career based on the provided context.",
    "Return ONLY valid JSON with schema:",
    JSON.stringify(
      {
        comparison: {
          selectedCareer: { slug: "string", strengths: ["string"], gaps: ["string"] },
          otherCareer: { slug: "string", strengths: ["string"], gaps: ["string"] },
          recommendation: "string",
          tradeOffs: ["string"],
        },
      },
      null,
      2
    ),
  ].join("\n\n");

  const { user, latestAssessment, recommendations, selectedCareer, otherCareer } = params;
  const assessmentText = formatAssessment(latestAssessment);
  const recText = formatRecommendations(recommendations);
  const selText = formatSelectedCareer(selectedCareer);
  const otherText = otherCareer ? formatSelectedCareer(otherCareer) : "No other career provided.";

  return [
    context,
    "Context:\n" + [
      `User: id=${user.id} name=${user.name ?? ""} email=${user.email ?? ""}`,
      `Assessment Context:\n${assessmentText}`,
      `Recommendations:\n${recText}`,
      selText,
      otherText,
    ].join("\n\n"),
  ].join("\n\n");
}

export function buildCareerQuestionPrompt(input: CareerQuestionInput): string {
  const context = buildCareerContext(input);

  return [
    "You are a career guidance assistant.",
    "Use the enriched career context, recommendation reasons, latest assessment summary, and conversation history to answer personally.",
    "Prioritize practical next steps and reference the user's stated interests, personality, skills, work preferences, technology affinity, learning preferences, and goals when available.",
    "Return ONLY valid JSON matching schema: { answer: string, followUpQuestions: [string] }",
    "Context:\n" + [context, `Conversation History:\n${formatConversationHistory(input.conversationHistory)}`, `User Question:\n${input.question}`].join("\n\n"),
  ].join("\n\n");
}

