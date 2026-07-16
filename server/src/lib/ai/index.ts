import type { AIProvider } from "./provider.js";
import { OpenAIProvider } from "./openai.js";

export function getAIProvider(): AIProvider {
  // Future: switch by env, without changing business logic.
  // For Phase 1, default to OpenAI.
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "openai") return new OpenAIProvider();

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}

