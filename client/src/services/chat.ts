import api from "./axios";

export type ChatMessage = {
  role: "user" | "ai";
  text: string;
  time: string;
};

export async function chatWithAI(message: string, careerSlug?: string): Promise<{ reply: string }> {
  const res = await api.post("/chat", { message, careerSlug });
  return res.data;
}
