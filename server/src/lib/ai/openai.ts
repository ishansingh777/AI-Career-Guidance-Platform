import OpenAI from "openai";
import type { AIProvider, CareerAdviceInput, CareerAdviceOutput, CareerQuestionInput, CareerQuestionOutput, RoadmapInput, RoadmapOutput } from "./provider.js";
import { buildCareerQuestionPrompt, buildRecommendationPrompt, buildRoadmapPrompt } from "./promptBuilder.js";

export class OpenAIError extends Error {
  public code?: string;
  public cause?: unknown;

  constructor(message: string, options?: { code?: string; cause?: unknown }) {
    super(message);
    this.name = "OpenAIError";
    this.code = options?.code;
    this.cause = options?.cause;
  }
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

function getTimeoutMs(): number {
  const raw = process.env.AI_TIMEOUT_MS;
  if (!raw) return 30_000;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 30_000;
  return n;
}

async function withRetryOnce<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    return await fn();
  }
}

export class OpenAIProvider implements AIProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = requireEnv("OPENAI_API_KEY");
    this.model = requireEnv("OPENAI_MODEL");

    const baseURL = process.env.OPENAI_BASE_URL;

    this.client = new OpenAI({
      apiKey,
      baseURL: baseURL || undefined,
      // The OpenAI SDK uses fetch; timeout is handled via AbortController below.
    });
  }

  private async chatCompletionJson(prompt: string): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

    try {
      const result = await withRetryOnce(async () => {
        return await this.client.chat.completions.create(
          {
            model: this.model,
            temperature: 0.2,
            messages: [
              { role: "system", content: "Return strictly valid JSON." },
              { role: "user", content: prompt },
            ],
          },
          { signal: controller.signal as any }
        );
      });

      const content = result.choices?.[0]?.message?.content;
      if (!content) throw new OpenAIError("OpenAI returned empty response content");

      try {
        return JSON.parse(content);
      } catch (e) {
        throw new OpenAIError("OpenAI returned non-JSON content", { cause: e });
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw new OpenAIError("OpenAI request timed out", { cause: err });
      }
      throw new OpenAIError(err?.message || "OpenAI API failure", { cause: err });
    } finally {
      clearTimeout(timeout);
    }
  }

  async generateCareerAdvice(input: CareerAdviceInput): Promise<CareerAdviceOutput> {
    const prompt = buildRecommendationPrompt(input);
    const json = await this.chatCompletionJson(prompt);
    return json as CareerAdviceOutput;
  }

  async generateRoadmap(input: RoadmapInput): Promise<RoadmapOutput> {
    const prompt = buildRoadmapPrompt(input);
    const json = await this.chatCompletionJson(prompt);
    return json as RoadmapOutput;
  }

  async answerCareerQuestion(input: CareerQuestionInput): Promise<CareerQuestionOutput> {
    const prompt = buildCareerQuestionPrompt(input);
    const json = await this.chatCompletionJson(prompt);
    return json as CareerQuestionOutput;
  }
}

