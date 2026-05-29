"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function HeaderAuth() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (session) {
    return (
      <button
        onClick={async () => {
          await authClient.signOut();
          router.push("/login");
        }}
        className="text-sm font-medium text-hw-off-white/70 hover:text-hw-off-white transition-colors"
      >
        Sign out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-hw-off-white/70 hover:text-hw-off-white transition-colors"
    >
      Sign in
    </Link>
  );
}
