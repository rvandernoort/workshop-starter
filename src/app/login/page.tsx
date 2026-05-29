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
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-6">
      <div className="w-full rounded-lg border border-zinc-200 p-8 dark:border-zinc-800">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
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
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-100"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-100"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {pending ? "..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          className="mt-4 text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-400"
        >
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
