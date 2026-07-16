import api from "./axios";

export type AuthUser = { id: number; email: string; name?: string; role?: string };

export async function signup(email: string, password: string, name?: string) {
  const res = await api.post("/auth/signup", { email, password, name });
  return res.data; // { user, token }
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { user, token }
}

export async function logout() {
  // Call backend logout (stateless) for completeness
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // ignore
  }
  // Remove local token
  localStorage.removeItem("token");
}

export async function getCurrentUser() {
  const res = await api.get("/user/me");
  return res.data.user as AuthUser;
}
