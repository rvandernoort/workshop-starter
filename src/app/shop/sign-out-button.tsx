"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium underline underline-offset-4"
    >
      Sign out
    </button>
  );
}
