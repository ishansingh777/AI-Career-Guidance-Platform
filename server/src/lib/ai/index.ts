import type { AIProvider } from "./provider.js";
import { OpenAIProvider } from "./openai.js";
import { MockAIProvider } from "./mock.js";

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ OPENAI_API_KEY is not set. Falling back to Mock AI Provider.");
      return new MockAIProvider();
    }
    return new OpenAIProvider();
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}

