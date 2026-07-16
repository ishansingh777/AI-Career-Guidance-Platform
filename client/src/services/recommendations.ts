import api from "./axios";
import type { Recommendation } from "../types/recommendation";

export async function getTopCareerMatches(): Promise<Recommendation[]> {
  const res = await api.get("/recommendations");
  // backend returns { recommendations: [...] }
  return res.data?.recommendations ?? res.data;
}

