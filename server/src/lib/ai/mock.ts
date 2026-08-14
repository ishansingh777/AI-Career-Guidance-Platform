import type { AIProvider, CareerQuestionInput, CareerQuestionOutput } from "./provider.js";

export class MockAIProvider implements AIProvider {
  async answerCareerQuestion(input: CareerQuestionInput): Promise<CareerQuestionOutput> {
    // A simple mock response
    const keyword = input.question.toLowerCase();
    let answer = "That's a great question! Based on your profile and the current market trends, I suggest focusing on building practical projects and expanding your foundational knowledge.";

    if (keyword.includes("skill")) {
      answer = "I recommend focusing on the required skills for your top career matches. You can view these in the 'Career Details' page. Practice them by building projects!";
    } else if (keyword.includes("roadmap")) {
      answer = "Your career roadmap is designed to get you job-ready in a few months. Focus on completing your current learning phase before moving on to the next.";
    }

    return {
      answer: `[Mock AI] ${answer}`
    };
  }
}
