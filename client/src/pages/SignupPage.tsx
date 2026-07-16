import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { GlassCard } from "../components/common/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/common/Badge";

export default function SignupPage() {
  const { signup, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (user) {
    navigate("/dashboard");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    try {
      await signup(email, password, name);
      navigate("/dashboard");
    } catch (e: any) {
      setLocalError(e?.response?.data?.error || e.message || "Signup failed");
    }
  }

  const formError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md">
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-500 mt-1">Start your career journey with personalized matches.</p>
            </div>
            <Badge color="purple">Signup</Badge>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-describedby={formError ? "signup-error" : undefined}>
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" autoComplete="name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" autoComplete="new-password" />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-2xl">
              {loading ? "Creating…" : "Create account"}
            </Button>

            {formError && (
              <div id="signup-error" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

