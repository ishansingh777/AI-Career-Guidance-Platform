import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { GlassCard } from "../components/common/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/common/Badge";

export default function LoginPage() {
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (e: any) {
      setLocalError(e?.response?.data?.error || e.message || "Login failed");
    }
  }

  const formError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md">
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Sign in</h2>
              <p className="text-sm text-slate-500 mt-1">Welcome back — continue your career journey.</p>
            </div>
            <Badge color="blue">Login</Badge>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-describedby={formError ? "login-error" : undefined}>
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" autoComplete="current-password" />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-2xl">
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            {formError && (
              <div id="login-error" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4"
              onClick={() => navigate("/signup")}
            >
              Create an account
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

