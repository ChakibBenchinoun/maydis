"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { site } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const qsError = search.get("error");
  const banner =
    qsError === "forbidden"
      ? "This account is not on the staff list."
      : qsError === "supabase"
        ? "Supabase is not configured."
        : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Sign in failed");
      }
      const next = search.get("next") || "/admin";
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="border-border/50 bg-card w-full max-w-sm rounded-2xl border p-6 shadow-sm sm:p-8">
        <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
          Staff access
        </p>
        <h1 className="font-display text-foreground mt-1 text-2xl font-bold">Sign in</h1>
        <p className="text-muted-foreground mt-1 text-sm">{site.name} admin</p>

        {(banner || error) && (
          <p className="bg-destructive/10 text-destructive mt-4 rounded-lg px-3 py-2 text-sm">
            {error || banner}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-secondary text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-hidden"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border bg-secondary text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-xs leading-relaxed">
          Owner: set <code className="text-foreground">OWNER_EMAIL</code> and create that user in
          Supabase Auth. Extra staff are added later under Admin → Staff.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center text-sm">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
