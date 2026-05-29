"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (session) router.push("/shop");
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) { setError(error.message ?? "Sign up failed"); return; }
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) { setError(error.message ?? "Sign in failed"); return; }
      }
      router.push("/shop");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-sm px-6 py-24">
      <div className="w-full rounded-3xl border border-hw-border bg-hw-header p-8">
        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-hw-off-white">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="rounded-xl border border-hw-border bg-hw-dark px-3 py-2 text-sm text-hw-off-white placeholder:text-hw-border/60 outline-none focus:ring-2 focus:ring-[#20F29B]"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-xl border border-hw-border bg-hw-dark px-3 py-2 text-sm text-hw-off-white placeholder:text-hw-border/60 outline-none focus:ring-2 focus:ring-[#20F29B]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="rounded-xl border border-hw-border bg-hw-dark px-3 py-2 text-sm text-hw-off-white placeholder:text-hw-border/60 outline-none focus:ring-2 focus:ring-[#20F29B]"
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-xl bg-gradient-to-r from-[#20F29B] to-[#02DACE] px-4 py-2 text-sm font-semibold text-hw-dark disabled:opacity-50"
          >
            {pending ? "..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          className="mt-4 text-sm text-hw-off-white/70 hover:text-hw-off-white transition-colors"
        >
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
